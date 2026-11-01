/* Explicit, documented decision policies for the player side.
 * All actions go through the real engine API (deploy/transfer/refresh/buy/enter/...),
 * so energy, hand, bench, fusion, copy limit, bag shapes and prices are enforced by the game.
 * Policies never read hidden future information (draw order, enemy hand, event rolls). */
'use strict';
const { G, P, C, T } = require('./engine.cjs');

const isCurse = c => !!(C && C.isCurse(c));
const traitTiers = tr => (T && T.D[tr] && T.D[tr].thresholds) || [2, 4];

/* ---------------- Unit valuation (mirrors the structure of the game's own aiValue) ---------------- */
function baseValue(c) {
  const t = G.BY[c.type];
  return (t.hp * .12 + t.atk / t.rate) * (1 + (c.level || 0) * .16) * (c.fused ? 1 + G.FUSION_BONUS : 1);
}
function unitValue(c, on, opts = {}) {
  const t = G.BY[c.type];
  let v = baseValue(c);
  if (!opts.traits) return (v + (on.some(u => u.type === c.type) ? -8 : 7)) / Math.sqrt(G.cost(c));
  const tc = G.counts(on), same = on.some(u => u.type === c.type);
  v += same ? -20 : 10;
  if (!same) for (const tr of t.traits) { const tiers = traitTiers(tr); v += tc[tr] === tiers[0] - 1 ? 26 : tc[tr] === tiers[1] - 1 ? 34 : 0; }
  if (!on.some(u => G.BY[u.type].range <= 62) && t.range <= 62) v += 23; // need a frontline
  return v / Math.sqrt(G.cost(c));
}

/* ---------------- Preparation policy ----------------
 * basic: greedy spend like the normal enemy AI (no trait planning).
 * smart: elite-AI-like trait completion, fusion priority, frontline check, refresh when stuck. */
function layout(s) {
  const on = s.board.map((id, pos) => id ? { id, pos, c: G.card(s, id) } : null).filter(Boolean);
  on.sort((a, b) => G.BY[a.c.type].range - G.BY[b.c.type].range || G.BY[b.c.type].defense - G.BY[a.c.type].defense);
  const cols = [2, 1, 3, 0, 4], taken = new Set();
  for (const u of on) {
    const line = G.BY[u.c.type].range > 100 ? 2 : 0;
    let target = cols.map(col => line * 5 + col).find(p => !taken.has(p));
    if (target === undefined) target = cols.map(col => 5 + col).find(p => !taken.has(p));
    if (target === undefined) target = [...Array(15).keys()].find(p => !taken.has(p));
    taken.add(target);
    const cur = s.board.indexOf(u.id);
    if (cur !== target) G.transfer(s, 'field', cur, 'field', target);
  }
}
function freeSlot(s, c) {
  const line = G.BY[c.type].range > 100 ? 2 : 0, cols = [2, 1, 3, 0, 4];
  for (const l of [line, 1, line === 2 ? 0 : 2]) for (const col of cols) if (!s.board[l * 5 + col]) return l * 5 + col;
  return s.board.indexOf(null);
}
/* 'ai-normal'/'ai-elite': exact replica of the game's own enemy prep heuristic (enemies() in game-0.js),
 * applied to the player state. Used only to calibrate our policies against the game's AI. */
function aiPrep(s, elite) {
  const lookup = id => G.card(s, id);
  const fakeAi = { elite, deckId: null, strategy: 'balanced' };
  const value = c => {
    const on = s.board.filter(Boolean).map(lookup), t = G.BY[c.type];
    let v = baseValue(c);
    if (!fakeAi.elite) return v + (on.some(u => u.type === c.type) ? -8 : 7);
    return unitValue(c, on, { traits: true }) * Math.sqrt(G.cost(c)) / Math.sqrt(G.cost(c)) ;
  };
  for (let turn = 0; turn < 30; turn++) {
    const on = s.board.filter(Boolean).map(lookup), space = on.length < G.maxUnits(s);
    if (space) { const reserve = s.bench.filter(Boolean).sort((a, b) => value(lookup(b)) - value(lookup(a))); if (reserve.length) { G.transfer(s, 'bench', s.bench.indexOf(reserve[0]), 'field', s.board.indexOf(null)); continue; } }
    const cands = s.hand.map(lookup).filter(c => c && !isCurse(c) && G.cost(c) <= s.energy).sort((a, b) => {
      const sc = c => value(c) + (G.canFuse(s, c.uid) ? 180 : [...s.board, ...s.bench].filter(id => id && lookup(id).type === c.type && !s.fusions[id]).length ? 25 : 0); return sc(b) - sc(a); });
    let acted = false;
    for (const c of cands) {
      if (G.canFuse(s, c.uid)) { acted = G.deploy(s, c.uid, 0, 'bench'); break; }
      if (space) { acted = G.deploy(s, c.uid, s.board.indexOf(null), 'field'); break; }
      if (s.bench.includes(null)) { acted = G.deploy(s, c.uid, s.bench.indexOf(null), 'bench'); break; }
    }
    if (!acted) break;
  }
  for (let turn = 0; turn < 6; turn++) { const on = s.board.filter(Boolean), res = s.bench.filter(Boolean); if (!on.length || !res.length) break; const worst = [...on].sort((a, b) => value(lookup(a)) - value(lookup(b)))[0], best = [...res].sort((a, b) => value(lookup(b)) - value(lookup(a)))[0]; if (value(lookup(best)) <= value(lookup(worst)) * 1.15) break; G.transfer(s, 'bench', s.bench.indexOf(best), 'field', s.board.indexOf(worst)); }
  layout(s);
}
function prep(s, pol, log) {
  if (pol.prep === 'ai-normal' || pol.prep === 'ai-elite') return aiPrep(s, pol.prep === 'ai-elite');
  const smart = pol.prep === 'smart';
  const lookup = id => G.card(s, id);
  for (let turn = 0; turn < 40; turn++) {
    const on = s.board.filter(Boolean).map(lookup), space = on.length < G.maxUnits(s);
    if (space) { // field has room: best paid unit from bench first (free transfer)
      const reserve = s.bench.filter(Boolean).sort((a, b) => unitValue(lookup(b), on, { traits: smart }) - unitValue(lookup(a), on, { traits: smart }));
      if (reserve.length) { G.transfer(s, 'bench', s.bench.indexOf(reserve[0]), 'field', freeSlot(s, lookup(reserve[0]))); continue; }
    }
    const cand = s.hand.map(lookup).filter(c => c && !isCurse(c) && G.cost(c) <= s.energy)
      .sort((a, b) => {
        const sc = c => unitValue(c, on, { traits: smart }) + (G.canFuse(s, c.uid) ? 180 : 0);
        return sc(b) - sc(a);
      });
    let acted = false;
    for (const c of cand) {
      if (G.canFuse(s, c.uid)) { acted = G.deploy(s, c.uid, 0, 'bench'); if (acted) { log.fusions++; break; } }
      if (space) { acted = G.deploy(s, c.uid, freeSlot(s, c), 'field'); if (acted) break; }
      // Bench only when it can feed a fusion later (2nd copy) or for the smart policy as reserve.
      const pairs = [...s.board, ...s.bench].filter(id => id && lookup(id)?.type === c.type && !s.fusions[id]).length;
      if (s.bench.includes(null) && (pairs >= 1 || (!smart && false))) { acted = G.deploy(s, c.uid, s.bench.indexOf(null), 'bench'); if (acted) break; }
    }
    if (acted) continue;
    // Smart: recycle a dead hand when the field still has room and energy is plentiful.
    if (smart && space && s.energy >= 3 && s.hand.length && !cand.length && (log.refreshes || 0) < 6 && G.refreshHand(s)) { log.refreshes = (log.refreshes || 0) + 1; continue; }
    break;
  }
  // Swap weakest fielded unit for a clearly better benched one.
  for (let turn = 0; turn < 6; turn++) {
    const on = s.board.filter(Boolean), res = s.bench.filter(Boolean);
    if (!on.length || !res.length) break;
    const val = id => unitValue(lookup(id), on.filter(x => x !== id).map(lookup), { traits: smart });
    const worst = [...on].sort((a, b) => val(a) - val(b))[0], best = [...res].sort((a, b) => val(b) - val(a))[0];
    if (val(best) <= val(worst) * 1.15) break;
    G.transfer(s, 'bench', s.bench.indexOf(best), 'field', s.board.indexOf(worst));
  }
  layout(s);
}

/* ---------------- Run-level choices ---------------- */
// Card worth for upgrades/recruits: copies in deck drive fusion and draw frequency.
function deckWeight(s, type) { return G.copies(s, type); }
function bestUpgradeTarget(s, exclude = []) {
  const units = s.cards.filter(c => !isCurse(c) && c.level < 2 && !exclude.includes(c.uid));
  units.sort((a, b) => (deckWeight(s, b.type) * 10 + baseValue(b) / 10 - b.level * 3) - (deckWeight(s, a.type) * 10 + baseValue(a) / 10 - a.level * 3));
  return units[0];
}
function worstCard(s) {
  const units = s.cards.filter(c => !isCurse(c));
  units.sort((a, b) => (deckWeight(s, a.type) * 10 + baseValue(a) / 10 + a.level * 5) - (deckWeight(s, b.type) * 10 + baseValue(b) / 10 + b.level * 5));
  return units[0];
}
function recruitPick(s, offers) {
  // Prefer types already owned (fusion/draw consistency) then raw value; respects copy limit.
  const ok = offers.filter(id => id && G.copies(s, id) < G.MAX_COPIES);
  ok.sort((a, b) => ((G.copies(s, b) % 3 === 2 ? 30 : 0) + G.copies(s, b) * 6 + baseValue({ type: b, level: 0 }) / Math.sqrt(G.BY[b].cost) / 3)
    - ((G.copies(s, a) % 3 === 2 ? 30 : 0) + G.copies(s, a) * 6 + baseValue({ type: a, level: 0 }) / Math.sqrt(G.BY[a].cost) / 3));
  return ok[0];
}
// Static relic preference order (policy assumption, documented in report).
const RELIC_PREF = ['spark', 'banner', 'heart', 'plating', 'recovery', 'precision', 'laststand', 'ember', 'execution', 'fang', 'bell',
  'colossal_heart', 'dormant_sword', 'hourglass', 'quickstart', 'repulsion', 'scope', 'tome', 'shield', 'boots', 'travelers_mirror',
  'captain_standard', 'merchant', 'luckycharm', 'profane_idol'];
const relicRank = id => { const i = RELIC_PREF.indexOf(id); return i < 0 ? 99 : i; };
function placeRelic(s, accept) {
  // Fit the pending relic into the confirmed bag if possible (real packer); otherwise decline.
  const p = s.pendingRelic; if (!p) return false;
  if (accept) {
    const items = G.packBag([...s.artifacts, p.id], s);
    if (items) {
      const all = [...items, ...(s.reserve || []).map(id => ({ id, x: null, y: null, rotation: 0 }))];
      if (G.commitBag(s, all)) return true;
    }
  }
  const keep = [...(s.bag?.items || []).map(it => ({ ...it })), ...(s.reserve || []).map(id => ({ id, x: null, y: null, rotation: 0 }))];
  G.commitBag(s, keep);
  s.pendingRelic = null;
  return false;
}

/* ---------------- Map routing ---------------- */
const DEV = { upgrade: 3, shop: 2.6, recruit: 2.2, relic: 2.5, event: 1.6, battle: 0, elite: -1.5, boss: 0 };
function chooseNode(s, nodes, pol, rnd) {
  if (pol.route === 'random') return nodes[Math.floor(rnd() * nodes.length)];
  const r = s.campaignRoute || {};
  const score = n => {
    let v = DEV[n.type] ?? 0;
    if (n.type === 'shop' && s.gold < 15) v = 1;
    if (pol.route === 'safe' && n.type === 'elite') v -= 3;
    if (pol.route === 'order' && n.campaign) {
      // Chase a local order: prefer the order already beaten once on this map.
      const beat = { blackfang: (r.defeatedForces || []).length, dawncrest: (r.dawncrestForces || []).length, monsters: (r.monsterNodes || []).length }[n.campaign] || 0;
      const any = (r.defeatedForces || []).length + (r.dawncrestForces || []).length + (r.monsterNodes || []).length;
      v += beat ? 6 : any ? -2 : (pol.order && n.campaign === pol.order ? 5 : pol.order ? -1 : 3);
    }
    return v + rnd() * .01;
  };
  return [...nodes].sort((a, b) => score(b) - score(a))[0];
}

module.exports = { prep, layout, unitValue, baseValue, bestUpgradeTarget, worstCard, recruitPick, relicRank, placeRelic, chooseNode, isCurse, RELIC_PREF };
