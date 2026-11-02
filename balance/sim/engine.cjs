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
for (const m of MODULES) require(path.join(ROOT, 'dist', m + '.js'));
const g = globalThis;
module.exports = {
  ROOT, MODULES,
  G: g.Game, P: g.Progress, C: g.JourneyContent, T: g.JourneyTraits, A: g.JourneyActs, R: g.JourneyRaid,
  B: g.JourneyBosses, Tree: g.JourneyTree, CH: g.JourneyChallenges, TreeData: g.JourneyTreeData, Training: g.Training,
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
 *     power: [m1, m2, m3] }                                     // enemy power by map (JourneyActs.SPEC[act].power)                                 // explicit per-node costs (applied last)
 * XP: the real award still runs; this wrapper adds the difference on the same win (same eligibility rules). */
if (process.env.GJ_TREE_VARIANT) {
  const tv = JSON.parse(require('node:fs').readFileSync(process.env.GJ_TREE_VARIANT, 'utf8'));
  const D = g.JourneyTreeData, T = g.JourneyTree, P = g.Progress, A = g.JourneyActs;
  if (tv.costDepth) for (const n of D.nodes) if (n.type === 'basic' && tv.costDepth[n.depth] !== undefined) n.cost = tv.costDepth[n.depth];
  if (tv.power) for (const [i, v] of tv.power.entries()) { if (!g.JourneyActs.SPEC[i + 1]) throw Error('variant: no act ' + (i + 1)); g.JourneyActs.SPEC[i + 1].power = v; }
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
