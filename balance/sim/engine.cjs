/* Loads the REAL Grand Journey engine (dist/*.js) headlessly, in index.html order,
 * restricted to the non-UI modules. No game values are modified here.
 * GJ_ROOT selects the game copy (default: ../../v54, the intact v54 baseline). */
'use strict';
const path = require('node:path');
const ROOT = path.resolve(process.env.GJ_ROOT || path.join(__dirname, '../../v54'));
// Same relative order as dist/index.html (UI/asset-only scripts omitted).
const MODULES = ['game-0', 'training-engine', 'raid-engine', 'monster-engine', 'acts-engine', 'boss-engine',
  'map-variety', 'tree-data', 'tree-engine', 'journey-debug', 'content-v53', 'traits-v54', 'map-notes', 'cycle-data'];
// Optional approved balance data module (present in the balanced copy, absent in v54).
if (require('node:fs').existsSync(path.join(ROOT, 'dist', 'balance-p1.js'))) MODULES.splice(1, 0, 'balance-p1');
if (require('node:fs').existsSync(path.join(ROOT, 'dist', 'decks-p3.js'))) MODULES.splice(MODULES.indexOf('balance-p1') + 1, 0, 'decks-p3');
if (require('node:fs').existsSync(path.join(ROOT, 'dist', 'enemy-decks-p4.js'))) MODULES.splice(MODULES.indexOf('acts-engine') + 1, 0, 'enemy-decks-p4');
// Optional prototype module (support model B), loaded after traits-v54 when present.
if (require('node:fs').existsSync(path.join(ROOT, 'dist', 'supports-b.js'))) MODULES.splice(MODULES.indexOf('traits-v54') + 1, 0, 'supports-b');
if (require('node:fs').existsSync(path.join(ROOT, 'dist', 'challenges.js'))) MODULES.push('challenges');
if (require('node:fs').existsSync(path.join(ROOT, 'dist', 'advantages.js'))) MODULES.push('advantages');
// Variant values read by the game modules at load time (level model) must be set before loading.
if (process.env.GJ_TREE_VARIANT) { const tv0 = JSON.parse(require('node:fs').readFileSync(process.env.GJ_TREE_VARIANT, 'utf8')); if (tv0.level) globalThis.JOURNEY_TREE_LEVEL = tv0.level; if (tv0.challengeTune) globalThis.JOURNEY_CHALLENGE_TUNE = tv0.challengeTune; if (tv0.treeTune) globalThis.JOURNEY_TREE_TUNE = tv0.treeTune; if (tv0.advTune) globalThis.JOURNEY_ADVANTAGE_TUNE = tv0.advTune; if (tv0.bossTune) globalThis.JOURNEY_BOSS_TUNE = tv0.bossTune; if (tv0.barrierTune) globalThis.JOURNEY_BARRIER_TUNE = tv0.barrierTune; if (tv0.relicTune) globalThis.JOURNEY_RELIC_TUNE = { ...tv0.relicTune }; if (tv0.supportSpec) globalThis.SUPPORT_B_SPEC = tv0.supportSpec; }
// v50+ copies (progression-v56.js present): load exactly like the official loader (carregar_motor_v50.cjs):
// every script of dist/index.html, in order, up to (not including) game-2.js (first UI-bound script).
if (require('node:fs').existsSync(path.join(ROOT, 'dist', 'progression-v56.js'))) {
  globalThis.window = globalThis;
  const html = require('node:fs').readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const all = [...html.matchAll(/src="([^"?]+)\.js/g)].map(m => m[1]);
  MODULES.length = 0; MODULES.push(...all.slice(0, all.indexOf('game-2')));
}
for (const m of MODULES) require(path.join(ROOT, 'dist', m + '.js'));
const g = globalThis;
module.exports = {
  ROOT, MODULES,
  G: g.Game, P: g.Progress, C: g.JourneyContent, T: g.JourneyTraits, A: g.JourneyActs, R: g.JourneyRaid,
  B: g.JourneyBosses, Tree: g.JourneyTree, BC: g.JourneyBossCards, MS: g.JourneyMilestones, PG: g.JourneyProgression, SB: g.JourneySupportB, CH: g.JourneyChallenges, AD: g.JourneyAdvantages, TreeData: g.JourneyTreeData, Training: g.Training,
};

/* PROPOSAL OVERRIDES (testing only; the game files are not modified).
 * GJ_OVERRIDES=path.json with { units: { id: { hp, atk, defense, rate, skill, cost, rarity } }, side: 'player'|'both' }
 * hp/atk/defense/skill are multipliers on the computed stats; rate>1 = attacks faster (interval / rate).
 * cost/rarity replace the card data value. Applied through the JourneyTree.stats hook (called for every card). */
if (process.env.GJ_OVERRIDES) {
  const ov = JSON.parse(require('node:fs').readFileSync(process.env.GJ_OVERRIDES, 'utf8'));
  const units = ov.units || {}, both = ov.side === 'both';
  for (const [id, o] of Object.entries(units)) { const u = g.Game.BY[id]; if (!u) throw Error('override: unknown unit ' + id); if (o.cost) u.cost = o.cost; if (o.rarity !== undefined) u.rarity = o.rarity; if (o.trigger) u.trigger = { ...u.trigger, ...o.trigger }; if (o.area !== undefined) u.area = o.area; if (o.supportB) (g.SUPPORT_B_TUNE ??= {})[id] = o.supportB; }
  const base = g.JourneyTree.stats;
  g.JourneyTree.stats = function (st, c, s, enemy) {
    st = base(st, c, s, enemy) || st; const o = units[c.type];
    if (o && (both || !enemy) && (!process.env.GJ_OV_ONLY || process.env.GJ_OV_ONLY === c.type)) { for (const k of ['hp', 'atk', 'defense', 'skill']) if (o[k]) st[k] *= o[k]; if (o.rate) st.rate /= o.rate; }
    return st;
  };
  module.exports.OVERRIDES = ov;
}

/* TREE / XP VARIANTS (testing only; the game files are not modified).
 * GJ_TREE_VARIANT=path.json with
 *   { xpFight: [m1, m2, m3], xpBoss: [m1, m2, m3],            // XP per normal fight / boss win, by map (game: 1,1,1 / 2,4,6)
 *     costDepth: { "0": 4, "1": 6, "2": 8 },                   // cost of BASIC nodes by depth (start = 0,1); others unchanged
 *     costs: { nodeId: cost },                                 // explicit per-node costs (applied last)
 *     power: [m1, m2, m3],                                     // enemy power by map (JourneyActs.SPEC[act].power)
 *     level: { xpFight: [..], xpBoss: [..] } }                 // level-model XP table (game_p5+), set before loading                                     // enemy power by map (JourneyActs.SPEC[act].power)                                 // explicit per-node costs (applied last)
 * XP: the real award still runs; this wrapper adds the difference on the same win (same eligibility rules). */
if (process.env.GJ_TREE_VARIANT) {
  const tv = JSON.parse(require('node:fs').readFileSync(process.env.GJ_TREE_VARIANT, 'utf8'));
  const D = g.JourneyTreeData, T = g.JourneyTree, P = g.Progress, A = g.JourneyActs;
  if (tv.costDepth) for (const n of D.nodes) if (n.type === 'basic' && tv.costDepth[n.depth] !== undefined) n.cost = tv.costDepth[n.depth];
  if (tv.power) for (const [i, v] of tv.power.entries()) { if (!g.JourneyActs.SPEC[i + 1]) throw Error('variant: no act ' + (i + 1)); g.JourneyActs.SPEC[i + 1].power = v; }
  // basicScale: { "<depth>": k } multiplies the effect values of BASIC nodes at that depth (proposal testing only)
  if (tv.basicScale) for (const n of D.nodes) { const k = tv.basicScale[n.depth]; if (n.type === 'basic' && k && n.effect) for (const key of Object.keys(n.effect)) n.effect[key] *= k; }
  if (tv.costs) for (const [id, c] of Object.entries(tv.costs)) { if (!D.by[id]) throw Error('variant: unknown node ' + id); D.by[id].cost = c; }
  if (tv.xpFight || tv.xpBoss) {
    const inner = P.encounterWin;
    P.encounterWin = function (s) {
      const t = T.ensure(s), before = t ? t.earned.length : 0, r = inner(s);
      if (t && t.earned.length > before) {
        const a = A.act(s), boss = s.current?.type === 'boss', game = boss ? 2 * a : 1;
        const want = boss ? (tv.xpBoss ? tv.xpBoss[a - 1] : game) : (tv.xpFight ? tv.xpFight[a - 1] : game);
        t.xp += want - game; t.lastAward = want;
      }
      return r;
    };
  }
  module.exports.TREE_VARIANT = tv;
}

/* MÉTODO NOVO DAS RELÍQUIAS (Carlos 09/11, só medição; nenhum arquivo do jogo muda).
 * GJ_TEST_FORMATS=1: cria relíquias VAZIAS (sem efeito) 'vazia_<formato>' só no mapa de formatos, para GJ_FORCE_RELIC;
 *   não entram em ARTIFACTS, então nunca são oferecidas nem usadas por inimigos.
 * GJ_PURE_BONUS="atk:0.1" (lista separada por vírgula): bônus puro para todas as unidades do jogador, sem relíquia.
 *   atk/hp/skill = multiplicador; crit = pontos de chance (0.1 = +10); speed = velocidade de ataque;
 *   shield = escudo (fração da vida máxima) no início de cada luta (6 s, como Placas); charge = carga inicial (fração). */
if (process.env.GJ_TEST_FORMATS === '1') {
  for (const f of ['dot', 'domino', 'diag2', 'bridge', 'line3', 'L3', 'diag3', 'square', 'T', 'S', 'line4', 'L4', 'cross', 'U', 'P', 'L5']) g.Game.RELIC_FORMATS['vazia_' + f] = f;
  // só a relíquia forçada entra no catálogo (o jogo procura nele as relíquias possuídas); por ser possuída desde o início, nunca é oferecida
  const F = process.env.GJ_FORCE_RELIC; if (F && F.startsWith('vazia_') && !g.Game.ARTIFACTS.some(a => a.id === F)) g.Game.ARTIFACTS.push({ id: F, name: F, namePT: F, desc: 'sem efeito (teste)', descPT: 'sem efeito (teste)', icon: '□', rarity: 0, price: 30, shape: g.Game.RELIC_FORMATS[F], playerOnly: true, category: 'test' });
}
if (process.env.GJ_PURE_BONUS) {
  const PB = Object.fromEntries(process.env.GJ_PURE_BONUS.split(',').map(x => { const [k, v] = x.split(':'); return [k, Number(v)]; }));
  const base = g.JourneyTree.stats;
  g.JourneyTree.stats = function (st, c, s, enemy) {
    st = base(st, c, s, enemy) || st;
    if (!enemy) { if (PB.atk) st.atk *= 1 + PB.atk; if (PB.hp) st.hp *= 1 + PB.hp; if (PB.skill) st.skill *= 1 + PB.skill; if (PB.speed) st.rate /= 1 + PB.speed; if (PB.crit) st.crit = Math.min(.75, (st.crit || 0) + PB.crit); }
    return st;
  };
  if (PB.shield || PB.charge) {
    const T = g.JourneyTraits, bs = T.beforeStep;
    T.beforeStep = function (b) { const r = bs.apply(this, arguments);
      if (!b.pbInit) { b.pbInit = true; for (const u of b.units) { if (u.side) continue;
        if (PB.shield) { u.shield = (u.shield || 0) + u.maxhp * PB.shield; u.shieldTime = Math.max(u.shieldTime || 0, 6); }
        if (PB.charge && g.Game.BY[u.type]?.kind === 'active' && u.charge > 0) u.progress = Math.min(u.charge, (u.progress || 0) + u.charge * PB.charge); } }
      return r; };
  }
}
