/* R3 XP model acceptance test (Carlos 05/11/2026). Run from the repo root: GJ_ROOT=game_r3 node game_r3/tests/xp-r3.cjs */
'use strict';
process.env.GJ_ROOT ||= require('path').join(__dirname, '..');
const assert = require('assert');
const { playRun } = require('../../balance/sim/run.cjs');
const E = require('../../balance/sim/engine.cjs'); const { G, P, A, Tree: T, TreeData: D } = E;
const st = () => T.profile();
const pol = (tree, extra = {}) => ({ prep: 'smart', route: 'greedy', events: 'safe', shop: 'balanced', tree, treeBuy: 'all', order: null, forcewin: false, ...extra });
// 1. XP table: weight x map multiplier
const W = { battle: 1, special: 2, boss: 4, trueBoss: 6, secretBoss: 8 };
for (const a of [1, 2, 3]) for (const [k, w] of Object.entries(W)) assert.strictEqual(T.xpFor(a, k), w * a, `xp ${k} map ${a}`);
assert.strictEqual(T.kindOf({ type: 'battle' }), 'battle'); assert.strictEqual(T.kindOf({ type: 'elite' }), 'special');
assert.strictEqual(T.kindOf({ type: 'elite', campaign: 'monsters' }), 'special'); assert.strictEqual(T.kindOf({ type: 'boss', trueBoss: true }), 'trueBoss');
// 2. Mid window = after the 6th fight layer of every map
assert.deepStrictEqual([1, 2, 3].map(T.midLayer), [9, 8, 8]);
// 3. Forced-win run from an empty tree: 6 windows (mid + boss per map), everything earned is spent or lost, no XP left
st().unlocked = []; st().respec = 0; let h0 = { ...st().history };
let r = playRun('blades', 7, pol([], { forcewin: true }), { dt: 1 / 60 });
assert.strictEqual(r.result, 'victory');
assert.deepStrictEqual(r.windows.map(w => w.act + w.kind), ['1mid', '1boss', '2mid', '2boss', '3mid', '3boss'], 'six windows in order');
let h = st().history, earned = h.earned - h0.earned, spent = h.spent - h0.spent, lost = h.lost - h0.lost;
assert.strictEqual(earned, spent + lost, 'earned = spent + lost');
const map1mid = r.windows[0]; assert.ok(map1mid.xp >= 8 && map1mid.xp <= 10, 'map 1 window has 8..10 XP, got ' + map1mid.xp);
assert.ok(map1mid.bought.length >= 1, 'map 1 window buys at least one node');
for (let i = 1; i < r.windows.length; i++) assert.ok(r.windows[i].xp >= r.windows[i - 1].left, 'unspent XP carries to the next window');
assert.strictEqual(lost, r.windows.at(-1).left, 'only the leftover of the last window is lost at the end of the run');
console.log('run XP: earned', earned, 'spent', spent, 'lost', lost, '| windows', r.windows.map(w => `${w.act}${w.kind[0]}:${w.xp}->${w.left}`).join(' '));
// 4. Defeat: nodes bought in the mid window stay; XP not spent is lost; next run starts with 0 XP
st().unlocked = []; h0 = { ...st().history }; let dead = null;
for (let seed = 1; seed < 40 && !dead; seed++) { const x = playRun('outlaws', seed, pol([]), { dt: 1 / 60 }); if (x.result === 'defeat' && x.act === 1 && (x.windows || []).length === 1) dead = x; else st().unlocked = []; }
assert.ok(dead, 'found a run that died in map 1 after the mid window');
assert.ok(st().unlocked.length >= 1 && st().unlocked.length === dead.windows[0].bought.length, 'mid-window nodes kept after defeat');
h = st().history; assert.strictEqual(h.earned - h0.earned, h.spent - h0.spent + h.lost - h0.lost, 'defeat: earned = spent + lost');
const s2 = G.fresh('blades', 99); assert.strictEqual(T.ensure(s2).xp, 0, 'new run starts with 0 XP');
// 5. Respec: refunds only the invested cost; leftover lost at run start; a new respec cannot recreate it
st().unlocked = ['pow_atk_1', 'vit_hp_1', 'pow_atk_2']; st().respec = 0; const c = id => D.by[id].cost, inv = c('pow_atk_1') + c('vit_hp_1') + c('pow_atk_2');
assert.ok(T.reset(null)); assert.strictEqual(st().respec, inv, 'respec refunds invested cost');
assert.ok(T.buy(null, 'pow_atk_1') && T.buy(null, 'pow_atk_2')); assert.strictEqual(st().respec, inv - c('pow_atk_1') - c('pow_atk_2'));
const rl = st().history.respecLost; G.fresh('blades', 100); assert.strictEqual(st().respec, 0, 'respec leftover lost at run start'); assert.strictEqual(st().history.respecLost - rl, c('vit_hp_1'));
assert.ok(T.reset(null)); assert.strictEqual(st().respec, c('pow_atk_1') + c('pow_atk_2'), 'second respec refunds only what is owned (leftover not recreated)');
assert.ok(!T.reset(G.fresh('blades', 101)), 'no respec during a run');
// 6. Window closes once: continueRun twice / reopening does not duplicate
st().unlocked = []; st().respec = 0; const s3 = G.fresh('blades', 5); const t3 = T.ensure(s3); t3.session = { act: 1, kind: 'mid' }; s3.phase = 'tree'; t3.xp = 9;
assert.ok(T.continueRun(s3)); assert.strictEqual(s3.phase, 'map'); assert.strictEqual(t3.xp, 9, 'mid window keeps the XP for the run'); assert.ok(!T.continueRun(s3)); assert.deepStrictEqual(t3.midClosed, [1]);
// 7. Anti-farm: cumulative XP per encounter grows along the run (1 elite per map assumed)
const seq = []; for (const a of [1, 2, 3]) { for (let i = 0; i < 8; i++) seq.push(T.xpFor(a, i === 3 ? 'special' : 'battle')); seq.push(T.xpFor(a, 'boss')); }
const rate = k => seq.slice(0, k).reduce((x, y) => x + y) / k; for (const k of [6, 9, 15, 18, 24]) assert.ok(rate(k) < rate(27), 'stopping at ' + k + ' yields less XP per encounter');
// 8. Diamonds only with the full tree
st().unlocked = D.nodes.filter(n => n.id !== 'origin').map(n => n.id); assert.ok(T.complete()); const d0 = P.profile.diamonds || 0;
r = playRun('blades', 8, pol(st().unlocked, { forcewin: true }), { dt: 1 / 60 }); assert.ok((P.profile.diamonds || 0) > d0, 'full tree: XP becomes diamonds');
console.log('PASS R3 XP model: table, 6 windows, carry within run, loss at end, defeat keeps nodes, respec refund/loss, single close, anti-farm, diamonds only when complete.');
