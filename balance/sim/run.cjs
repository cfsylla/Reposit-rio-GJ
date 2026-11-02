/* Full-run simulator on the real engine.
 * Usage: node balance/sim/run.cjs --decks vanguard,balanced --seeds 1-20 --prep smart --route greedy --events decline --tree none --out file.jsonl
 * Each run: fresh profile (tree preset), G.fresh(deck, seed), map routing, fights (real createBattle/step/finish),
 * shops/recruits/upgrades/relics/events, boss tree sessions, act transitions, until victory/defeat. */
'use strict';
const fs = require('node:fs');
const E = require('./engine.cjs');
const { G, P, C, A, Tree, TreeData } = E;
const Pol = require('./policy.cjs');

function args() {
  const a = {}, v = process.argv.slice(2);
  for (let i = 0; i < v.length; i += 2) a[v[i].replace(/^--/, '')] = v[i + 1];
  const range = x => { if (!x) return [1]; return x.split(',').flatMap(p => { const [lo, hi] = p.split('-').map(Number); return hi ? Array.from({ length: hi - lo + 1 }, (_, i) => lo + i) : [lo]; }); };
  return { decks: (a.decks || 'vanguard').split(','), seeds: range(a.seeds), prep: a.prep || 'smart', route: a.route || 'greedy', events: a.events || 'decline',
    tree: a.tree || 'none', challenges: a.challenges ? Object.fromEntries(a.challenges.split(',').map(x => { const [k, g] = x.split(':'); return [k, Number(g || 1)]; })) : null, forcewin: a.forcewin === '1', shop: a.shop || 'upgrade-first', out: a.out, dt: Number(a.dt || 1 / 60), order: a.order || null, verbose: !!a.verbose };
}

/* Permanent tree presets (profile state BEFORE the run; in-run purchases still happen after each boss). */
const TREE_PRESETS = {
  none: [],
  // ~ a few runs of play: first nodes of four branches
  intermediate: ['pow_atk_1', 'vit_hp_1', 'def_armor_1', 'agi_rate_1', 'exp_gold_1', 'pow_atk_2', 'vit_hp_2', 'def_armor_2'],
  // many runs: all basics + specials on combat branches (no Marcos except devastating/survival)
  // ~10 runs of XP: 15 basic nodes spread over the combat branches + gold
  mid15: ['pow_atk_1', 'pow_atk_2', 'pow_atk_3', 'pow_atk_5', 'vit_hp_1', 'vit_hp_2', 'vit_hp_3', 'vit_hp_4', 'def_armor_1', 'def_armor_2', 'def_armor_3', 'def_armor_4', 'agi_rate_1', 'agi_rate_2', 'exp_gold_1'],
  // Carlos: intermediate profile = 20 to 30 of the 60 nodes (connected sets)
  mid20: ['pow_atk_1', 'pow_atk_2', 'pow_atk_3', 'pow_atk_5', 'pow_crit_2', 'vit_hp_1', 'vit_hp_2', 'vit_hp_3', 'vit_hp_4', 'def_armor_1', 'def_armor_2', 'def_armor_3', 'def_armor_4', 'agi_rate_1', 'agi_rate_2', 'agi_rate_3', 'agi_rate_4', 'exp_gold_1', 'exp_gold_2', 'exp_shop_1'],
  mid30: ['pow_atk_1', 'pow_atk_2', 'pow_atk_3', 'pow_atk_5', 'pow_crit_2', 'vit_hp_1', 'vit_hp_2', 'vit_hp_3', 'vit_hp_4', 'def_armor_1', 'def_armor_2', 'def_armor_3', 'def_armor_4', 'agi_rate_1', 'agi_rate_2', 'agi_rate_3', 'agi_rate_4', 'exp_gold_1', 'exp_gold_2', 'exp_shop_1',
    'first_impact', 'pow_crit_1', 'penetration', 'second_wind', 'formation', 'strong_shields', 'sprint', 'momentum', 'market', 'exp_shop_2'],
  mid25: ['pow_atk_1', 'pow_atk_2', 'pow_atk_3', 'pow_atk_5', 'pow_crit_2', 'vit_hp_1', 'vit_hp_2', 'vit_hp_3', 'vit_hp_4', 'def_armor_1', 'def_armor_2', 'def_armor_3', 'def_armor_4', 'agi_rate_1', 'agi_rate_2', 'agi_rate_3', 'agi_rate_4', 'exp_gold_1', 'exp_gold_2', 'exp_shop_1',
    'first_impact', 'second_wind', 'formation', 'sprint', 'market'],
  full: null,
  advanced: null, // filled below: every node except Expedition Marcos
};
TREE_PRESETS.full = Object.keys(TreeData.by).filter(id => id !== 'origin');
TREE_PRESETS.advanced = TreeData.nodes ? TreeData.nodes.filter(n => n.id !== 'origin' && !['expanded_bag', 'caravan'].includes(n.id)).map(n => n.id) : Object.keys(TreeData.by).filter(id => id !== 'origin' && !['expanded_bag', 'caravan'].includes(id));
/* capN: N tree points allocated with the simulator's buy policy (fixed order, then cheapest connected node). */
function allocate(budget) {
  const have = [], conn = id => TreeData.by[id].links.some(l => l === 'origin' || have.includes(l)), cost = id => TreeData.by[id].cost;
  let left = budget;
  for (;;) {
    let pick = TREE_BUY_ORDER.find(id => !have.includes(id) && conn(id) && cost(id) <= left);
    if (!pick) pick = TreeData.nodes.filter(n => !have.includes(n.id) && conn(n.id) && n.cost <= left).sort((x, y) => x.cost - y.cost || (x.category === 'expedition') - (y.category === 'expedition'))[0]?.id;
    if (!pick) return have; have.push(pick); left -= cost(pick);
  }
}
function treePreset(name) { const m = /^cap(\d+)$/.exec(name || ''); return m ? allocate(Number(m[1])) : TREE_PRESETS[name]; }
const TREE_BUY_ORDER = ['pow_atk_1', 'vit_hp_1', 'def_armor_1', 'agi_rate_1', 'pow_atk_2', 'vit_hp_2', 'def_armor_2', 'agi_rate_2', 'pow_atk_3', 'vit_hp_3', 'vit_hp_4',
  'def_armor_3', 'def_armor_4', 'agi_rate_3', 'agi_rate_4', 'pow_atk_5', 'first_impact', 'second_wind', 'formation', 'strong_shields', 'sprint', 'momentum'];

function playFight(s, pol, rec, dt) {
  const fight = { act: A.act(s), layer: s.layer, type: s.current.type, campaign: s.current.campaign || null, force: s.current.forceId || null, bossId: s.current.bossId || null, raid: s.raid ? s.raid.kind || s.current.raidKind : null,
    event: !!s.eventEncounter, enemyRelics: [...(s.ai?.artifacts || [])], enemyLevels: s.ai?.cards ? [s.ai.cards.filter(c => c.level === 1).length, s.ai.cards.filter(c => c.level === 2).length] : null,
    relicOpp: s.relicOpportunities, stageGlobal: s.mapBattles, stageLocal: A.localStage(s), rounds: [], fusions: 0, energyLeft: [], playerLevels: [s.cards.filter(c => c.level === 1).length, s.cards.filter(c => c.level === 2).length], gold: s.gold, relics: [...s.artifacts] };
  for (let guard = 0; guard < 40; guard++) {
    if (s.phase === 'prep') {
      if (C.stuck(s)) { C.concede(s); fight.conceded = true; break; }
      Pol.prep(s, pol, fight);
      const b = G.createBattle(s);
      if (!b) { fight.noUnits = true; // cannot field anyone: treat as forced loss via concede path if possible
        if (C.concede && C.concede(s)) break; s.phase = 'defeat'; P.finish(s, 'defeat'); break; }
      const limit = s.raid ? 900 : 200;
      while (!b.result && b.time < limit) G.step(b, dt);
      if (!b.result) { fight.stalled = true; b.result = 'draw'; }
      fight.energyLeft.push(s.energy);
      fight.rounds.push({ r: b.result, t: Math.round(b.time * 10) / 10, mine: b.units.filter(u => !u.side).length, alive: b.units.filter(u => !u.side && u.hp > 0).length,
        foes: b.units.filter(u => u.side).length, bossHp: s.raid ? Math.round(E.R.health(b)) : undefined });
      // FIXTURE ONLY (--forcewin): record the real result, then resolve the round as a win so the run
      // continues and enemy/economy exposure at later stages can be observed. Never a difficulty measure.
      if (pol.forcewin && b.result !== 'win') { fight.forced = (fight.forced || 0) + 1; G.finish(s, 'win'); } else G.finish(s, b.result);
      continue;
    }
    if (s.phase === 'roundResult') { G.nextRound(s); continue; }
    break;
  }
  fight.result = s.phase === 'defeat' ? 'loss' : 'win';
  fight.score = [...s.score];
  rec.fights.push(fight);
}

function doShop(s, pol, rec) {
  const spend = (what, amt) => { rec.spent[what] = (rec.spent[what] || 0) + amt; };
  // 'balanced' shop policy: first secure a good relic that fits (while the bag holds < 4), then upgrades, then cards.
  if (pol.shop === 'balanced' && s.artifacts.length < 4) {
    const ri = s.offers.artifacts.map((id, i) => [id, i]).filter(([id]) => id && Pol.relicRank(id) <= 14).sort((a, b) => Pol.relicRank(a[0]) - Pol.relicRank(b[0]));
    for (const [id, i] of ri) { const p = G.price(s, 'artifacts', id); if (s.gold >= p && G.packBag([...s.artifacts, id], s) && G.buy(s, 'artifacts', i)) { const before = s.gold; Pol.placeRelic(s, true); spend('relic', before - s.gold); break; } }
  }
  for (let k = 0; k < 12; k++) {
    let acted = false;
    // 1) upgrade most valuable card
    const t = Pol.bestUpgradeTarget(s);
    if (t) { const p = G.price(s, 'upgrade', t.uid); if (s.gold >= p && (pol.shop !== 'cards-first' || k > 2) && G.shopService(s, 'upgrade', t.uid)) { spend('upgrade', p); acted = true; continue; } }
    // 2) relic that fits, if affordable
    const ri = s.offers.artifacts.map((id, i) => [id, i]).filter(([id]) => id).sort((a, b) => Pol.relicRank(a[0]) - Pol.relicRank(b[0]));
    for (const [id, i] of ri) { const p = G.price(s, 'artifacts', id); if (s.gold >= p && G.packBag([...s.artifacts, id], s) && G.buy(s, 'artifacts', i)) { const before = s.gold; Pol.placeRelic(s, true); spend('relic', before - s.gold); acted = before !== s.gold; break; } }
    if (acted) continue;
    // 3) cards: buy only types already in deck (fusion/consistency) or strong pick
    const ci = s.offers.cards.map((id, i) => [id, i]).filter(([id]) => id && G.copies(s, id) < G.MAX_COPIES && G.copies(s, id) >= 1);
    for (const [id, i] of ci) { const p = G.price(s, 'cards', id); if (s.gold >= p && G.buy(s, 'cards', i)) { spend('card', p); acted = true; break; } }
    if (!acted) break;
  }
  // curses removal if any
  for (const c of s.cards.filter(Pol.isCurse)) { const p = G.price(s, 'remove', c.uid); if (s.gold >= p && G.shopService(s, 'remove', c.uid)) spend('removeCurse', p); }
}

function fillSelection(s) {
  const ev = s.offers.content, id = s.offers.eventId, sel = ev.selection;
  const pick = (key, value) => { if (value !== undefined && value !== null) C.select(s, key, value); };
  const best = Pol.bestUpgradeTarget(s), worst = Pol.worstCard(s);
  pick('upgrade', best?.uid);
  pick('card', ['reflexos'].includes(id) ? best?.uid || worst?.uid : worst?.uid);
  const t1 = Pol.bestUpgradeTarget(s, [sel.card]); pick('target1', t1?.uid);
  const t2 = Pol.bestUpgradeTarget(s, [sel.card, t1?.uid]); pick('target2', t2?.uid);
  const rec = C.pickList(s, 'recruit'); if (rec.length) { const r1 = Pol.recruitPick(s, rec); pick('recruit', r1); pick('recruit2', Pol.recruitPick(s, rec.filter(x => x !== r1))); }
  const rr = C.pickList(s, 'rareRecruit'); if (rr.length) pick('rareRecruit', Pol.recruitPick(s, rr));
  const owned = C.pickList(s, 'relic'); if (owned.length) pick('relic', [...owned].sort((a, b) => Pol.relicRank(b) - Pol.relicRank(a))[0]);
  for (const k of ['rewardRelic', 'rareRelic']) { const l = C.pickList(s, k); if (l.length) pick(k, [...l].sort((a, b) => Pol.relicRank(a) - Pol.relicRank(b))[0]); }
  const fl = C.pickList(s, 'forgeRelic'); if (fl.length) pick('forgeRelic', [...fl].sort((a, b) => Pol.relicRank(a) - Pol.relicRank(b))[0]);
  const cu = C.pickList(s, 'curse'); if (cu.length) pick('curse', cu[0]);
}
function doEvent(s, pol, rec) {
  const id = s.offers.eventId; const entry = { id, act: A.act(s), layer: s.layer, gold: s.gold, choice: 'leave' };
  rec.events.push(entry);
  if (pol.events === 'decline' || !s.offers.content) return;
  fillSelection(s);
  const opts = C.options(s).filter(o => !C.reason(s, o));
  // 'safe': only options without random outcome or curse; 'risk': prefer the second (risky/free) option.
  const safeOf = o => !/%|Curse|Maldi|Fardo|Burden|Chains|Correntes|Exhaust|Exaust|Omen|Press/i.test(o.en + ' ' + o.pt);
  let choice = null;
  if (pol.events === 'safe') choice = opts.find(o => safeOf(o) && (o.cost || 0) <= s.gold);
  else if (pol.events === 'risk') choice = opts[opts.length - 1];
  else if (pol.events === 'first') choice = opts[0];
  if (!choice) return;
  const goldBefore = s.gold;
  if (C.accept(s, choice.code)) { entry.choice = choice.code; entry.cost = goldBefore - s.gold; }
}

function resolvePending(s, rec) {
  for (let k = 0; k < 10; k++) {
    if (s.pendingRelic) { Pol.placeRelic(s, true); continue; }
    if (s.phase === 'eventReward' && s.eventPending) {
      const r = s.eventPending;
      if (r.relic && r.artifactOptions.length) { const id = [...r.artifactOptions].sort((a, b) => Pol.relicRank(a) - Pol.relicRank(b))[0]; if (G.claimEvent(s, 'relic', id)) { Pol.placeRelic(s, true); continue; } r.relic = false; }
      if (r.cards && r.cardOptions.length) { const id = Pol.recruitPick(s, r.cardOptions); if (id && G.claimEvent(s, 'card', id)) continue; }
      s.eventPending = null; s.phase = 'event'; continue;
    }
    break;
  }
}

/* Proposal decks: GJ_DECKS=path.json ({decks:[{id,counts,startRelic,order}]}) */
const CUSTOM = process.env.GJ_DECKS ? Object.fromEntries(JSON.parse(fs.readFileSync(process.env.GJ_DECKS, 'utf8')).decks.map(d => [d.id, d])) : {};
function playRun(deck, seed, pol, opt) {
  P.load(P.freshProfile()); P.completeTutorial();
  const prof = Tree.profile(); prof.unlocked = [...(Array.isArray(pol.tree) ? pol.tree : treePreset(pol.tree) || [])];
  // level model (game_p5+): banked XP = given career XP, or exactly the cost of the preset (no free points)
  if (Tree.level) prof.totalXp = pol.treeXp ?? prof.unlocked.reduce((t, id) => t + TreeData.by[id].cost, 0);
  if (E.CH) { const pc = E.CH.profile(); pc.unlocked = !!pol.challenges; pc.selected = { ...(pol.challenges || {}) }; }
  const custom = CUSTOM[deck];
  const s = G.fresh(custom ? 'vanguard' : deck, seed);
  if (custom) { // proposal deck (testing): same fresh run, cards and starting relic replaced; its order is considered unlocked
    s.cards = []; s.serial = 0; s.deck = deck;
    for (const [type, n] of Object.entries(custom.counts)) for (let i = 0; i < n; i++) G.newCard(s, type);
    s.artifacts = [custom.startRelic]; s.reserve = []; s.bag = null; G.ensureBag(s);
    if (custom.order === 'blackfang') s.blackfangAvailable = true; if (custom.order === 'dawncrest') s.dawncrestAvailable = true;
  }
  const rnd = G.rng(seed ^ 0x5eed);
  const rec = { deck, seed, policy: pol, fights: [], events: [], spent: {}, goldIn: 0, nodes: [], treeBought: [], result: null };
  let lastGold = s.gold, steps = 0;
  const trackGold = () => { if (s.gold > lastGold) rec.goldIn += s.gold - lastGold; lastGold = s.gold; };
  while (steps++ < 2000) {
    trackGold();
    if (s.pendingRelic || s.phase === 'eventReward') { resolvePending(s, rec); trackGold(); continue; }
    switch (s.phase) {
      case 'map': {
        const nodes = G.available(s); if (!nodes.length) { rec.result = 'stuck-map'; return finalize(s, rec); }
        const n = Pol.chooseNode(s, nodes, pol, rnd); rec.nodes.push(A.act(s) + ':' + n.type + (n.campaign ? '/' + n.campaign : ''));
        if (!G.enter(s, n.id)) { rec.result = 'enter-failed'; return finalize(s, rec); }
        break;
      }
      case 'prep': playFight(s, pol, rec, opt.dt); break;
      case 'encounterWin': G.leave(s); break;
      case 'recruit': { const id = Pol.recruitPick(s, s.offers); if (!id || !G.recruit(s, id)) G.leave(s); break; }
      case 'upgrade': { const c = Pol.bestUpgradeTarget(s); if (!c || !G.upgrade(s, c.uid)) G.skipUpgrade(s); else if (s.phase === 'upgrade') G.leave(s); break; }
      case 'relic': { const ids = [...s.offers].sort((a, b) => Pol.relicRank(a) - Pol.relicRank(b)); const fit = ids.find(id => G.packBag([...s.artifacts, id], s)); if (fit && G.claimRelic(s, fit) !== false) { Pol.placeRelic(s, true); if (s.phase === 'relic') G.leave(s); } else G.leave(s); break; }
      case 'shop': doShop(s, pol, rec); G.leave(s); break;
      case 'event': {
        const nodeId = s.current?.id ?? ('L' + s.layer);
        if (s.offers && !s.offers.resolved && !rec.events.some(e => e.node === nodeId)) { doEvent(s, pol, rec); rec.events.at(-1).node = nodeId; if (s.phase !== 'event') break; }
        // Multi-stage events (e.g. Arena after the first win): choose the option without risk / the first one, then leave.
        for (let k = 0; k < 3 && s.phase === 'event' && s.offers?.content && !s.offers.resolved && s.offers.content.stage && s.offers.content.stage !== 'choice'; k++) {
          const opts = C.options(s).filter(o => !C.reason(s, o)); const safe = opts.find(o => !/Risk|Arrisc|Defeat|Derrota/i.test(o.en + ' ' + (o.pt || ''))) || opts[0];
          if (!safe || !C.accept(s, safe.code)) break; if (s.phase !== 'event') break;
        }
        if (s.phase !== 'event') break;
        if (!G.leave(s)) { rec.result = 'event-stuck'; rec.stuck = { eventId: s.offers?.eventId, resolved: s.offers?.resolved, stage: s.offers?.content?.stage, pending: !!s.pendingRelic, eventPending: !!s.eventPending, phase: s.phase, outcome: s.offers?.outcome, text: s.offers?.text }; return finalize(s, rec); }
        break;
      }
      case 'tree': {
        let bought = true; while (bought) { bought = false; for (const id of TREE_BUY_ORDER) if (Tree.buy(s, id)) { rec.treeBought.push(id); bought = true; break; }
          // career mode (--treebuy all): after the fixed order, keep buying the cheapest connected node (combat branches first)
          if (!bought && pol.treeBuy === 'all') { const t = Tree.ensure(s), have = Tree.profile().unlocked;
            const cand = TreeData.nodes.filter(n => !have.includes(n.id) && Tree.connected(n.id) && n.cost <= (Tree.available ? Tree.available() : t.xp)).sort((x, y) => x.cost - y.cost || (x.category === 'expedition') - (y.category === 'expedition'));
            if (cand.length && Tree.buy(s, cand[0].id)) { rec.treeBought.push(cand[0].id); bought = true; } } }
        rec.xpLeft = (rec.xpLeft || 0) + (Tree.ensure(s)?.xp || 0);
        Tree.continueRun(s); break;
      }
      case 'actComplete': if (!A.advance(s)) { rec.result = 'act-stuck'; return finalize(s, rec); } break;
      case 'victory': rec.result = 'victory'; return finalize(s, rec);
      case 'defeat': rec.result = 'defeat'; return finalize(s, rec);
      default: rec.result = 'unknown-phase:' + s.phase; return finalize(s, rec);
    }
  }
  rec.result = 'step-limit'; return finalize(s, rec);
}
function finalize(s, rec) {
  if (s.challenges) { rec.challenges = s.challenges; rec.challengeLevel = s.challengeLevel; rec.insignia = s.meta?.insignia || 0; }
  if (Tree.level) { rec.treeXp = Tree.profile().totalXp; rec.treeLevel = Tree.level(); }
  rec.act = A.act(s); rec.layer = s.layer; rec.goldEnd = s.gold; rec.mapBattles = s.mapBattles;
  rec.cards = s.cards.length; rec.levels = [0, 1, 2].map(l => s.cards.filter(c => c.level === l && !Pol.isCurse(c)).length); rec.curses = s.cards.filter(Pol.isCurse).length;
  rec.relics = [...s.artifacts]; rec.reserve = [...(s.reserve || [])];
  rec.wins = rec.fights.filter(f => f.result === 'win' && !f.event).length;
  const last = rec.fights.at(-1); rec.deathAt = rec.result === 'defeat' && last ? { act: last.act, layer: last.layer, type: last.type, campaign: last.campaign, raid: last.raid, force: last.force, event: last.event } : null;
  return rec;
}

if (require.main === module) {
  const opt = args(), pol = { challenges: opt.challenges, prep: opt.prep, route: opt.route, events: opt.events, tree: opt.tree, shop: opt.shop, order: opt.order, forcewin: opt.forcewin };
  const out = opt.out ? fs.createWriteStream(opt.out) : null;
  const t0 = Date.now();
  for (const deck of opt.decks) for (const seed of opt.seeds) {
    const t = Date.now(); const r = playRun(deck, seed, pol, opt); r.ms = Date.now() - t;
    const line = JSON.stringify(r);
    if (out) out.write(line + '\n');
    console.log([deck, seed, r.result, 'act' + r.act, 'L' + r.layer, 'wins=' + r.wins, 'gold+' + r.goldIn, 'lv=' + r.levels.join('/'), 'relics=' + r.relics.length, r.deathAt ? 'died:' + [r.deathAt.type, r.deathAt.campaign || '', r.deathAt.raid || r.deathAt.force || ''].join('/') : '', r.ms + 'ms'].join(' '));
  }
  if (out) out.end();
  console.error('total', ((Date.now() - t0) / 1000).toFixed(1) + 's');
}
module.exports = { playRun, TREE_PRESETS, treePreset };
