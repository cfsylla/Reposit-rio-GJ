/* Desafios da Jornada (post-CP1, test copy, rules of revision 2): each challenge's effect, level = number of active
 * challenges, sequential unlock, 1 Insignia per first victory of each level, completion per challenge, training excluded;
 * plus the tree level model (level from banked XP, points, reset, map-1 XP). */
const assert = require('node:assert/strict');
for (const f of ['game-0', 'balance-p1', 'decks-p3', 'training-engine', 'raid-engine', 'monster-engine', 'acts-engine', 'enemy-decks-p4', 'boss-engine', 'map-variety', 'tree-data', 'tree-engine', 'journey-debug', 'content-v53', 'traits-v54', 'supports-b', 'challenges']) require('../dist/' + f + '.js');
const G = Game, P = Progress, T = JourneyTree, CH = JourneyChallenges;
P.load(P.freshProfile()); P.completeTutorial();

assert.equal(CH.LIST.length, 15); assert.equal(CH.MAX_LEVEL, 15);
assert.equal(CH.level(['veterans', 'scarce', 'nope', 'scarce']), 2, 'level = number of distinct valid challenges');

// Locked until the first victory; then level 1 only; sequential unlock.
{ const pc = CH.profile(); assert.equal(pc.unlocked, false); assert.equal(CH.toggle('veterans'), false); }
function play(ids, seed = 7) { const pc = CH.profile(); if (ids) assert(CH.select(ids), 'select ' + ids); const s = G.fresh('vanguard', seed); G.enter(s, G.available(s)[0].id); return s; }
function win(s) { return CH.recordVictory(s); }
{ const s = play(null); assert.deepEqual(s.challenges, []); const r = win(s); assert(r.unlocked); assert.equal(r.insignia, 0); const pc = CH.profile(); assert.equal(pc.available, 1); assert.equal(P.profile.insignia, 0); }
assert.equal(CH.select(['veterans', 'tough']), false, 'level 2 is not available yet');
{ const s = play(['veterans']); assert.deepEqual(win(s), { level: 1, insignia: 1, unlocked: false }); assert.equal(CH.profile().available, 2); assert.equal(P.profile.insignia, 1); }
{ const s = play(['tough']); assert.equal(win(s).insignia, 0, 'repeating a won level gives no Insignia'); assert.deepEqual(CH.profile().completed.sort(), ['tough', 'veterans']); assert.equal(CH.profile().available, 2, 'a repeated level does not skip ahead'); }
{ assert(CH.select(['tough', 'relentless'])); const s = play(null); assert.equal(win(s).insignia, 1); assert.equal(CH.profile().available, 3); assert.equal(P.profile.insignia, 2); }

// Effects (helper: run with exactly these challenges active, regardless of progression).
function run(ids, seed = 7) { const pc = CH.profile(); pc.unlocked = true; pc.available = 15; pc.selected = ids ? [...ids] : []; const s = G.fresh('vanguard', seed); G.enter(s, G.available(s)[0].id); return s; }
function fight(ids, stage, type = 'battle', seed = 7) { const s = run(ids, seed); s.mapBattles = stage - 1; s.current = { ...s.current, type }; G.startConfront(s, s.current); return s; }
const ups = s => s.ai.cards.reduce((n, c) => n + c.level, 0);
assert.equal(ups(fight(['veterans'], 9)) - ups(fight(null, 9)), 2);
assert.equal(ups(fight(['veterans'], 9, 'elite')), ups(fight(null, 9, 'elite')));
assert.equal(ups(fight(['commanders'], 9, 'elite')) - ups(fight(null, 9, 'elite')), 2);
{ const st = ids => { const s = fight(ids, 5); s.round = 3; s.board[2] = s.cards[0].uid; return G.createBattle(s).units.filter(u => u.side === 1).map(u => [u.maxhp, u.atk]); };
  const base = st(null), t = st(['tough']), r = st(['relentless']); base.forEach(([h, a], i) => { assert(Math.abs(t[i][0] / h - 1.15) < 1e-9); assert(Math.abs(r[i][1] / a - 1.15) < 1e-9); assert(Math.abs(t[i][1] / a - 1) < 1e-9); }); }
{ const s = run(['leaders']), st = { hp: 100, atk: 100 }; CH.enemyStats(s, { type: 'boss_goblin' }, st); assert(Math.abs(st.hp - 100 / 0.8) < 1e-9); }
{ const s = fight(['reinforcements'], 5); s.round = 2; assert.equal(G.maxUnits(s, true), 4); assert.equal(G.maxUnits(s, false), 3); }
{ const s = fight(['reinforcements'], 9, 'boss'); assert.equal(CH.extraUnits(s), 0); }
{ const s = run(['raidfury']); JourneyRaid.initialize(s, 'tree', { hp: 1, damage: 1, minions: 1 }, true); assert(Math.abs(s.raid.scale.hp - 1.25) < 1e-9); assert.equal(s.raid.scale.damage, 1); }
{ const s = run(['inflation']), b = run(null); s.current = b.current = { id: 'x', type: 'shop' }; assert.equal(T.price(s, 'upgrade', 10, 0), 13); assert.equal(T.price(b, 'upgrade', 10, 0), 10); }
{ const s = run(['lightpurse']); assert.equal(T.gold(s, 16), 12); }
{ const s = run(['scarce']), b = run(null); s.round = b.round = 3; assert.equal(G.energyIncome(s), G.energyIncome(b) - 1); assert.equal(G.energyIncome(s, true), G.energyIncome(b, true)); }
{ const s = run(['bag']); assert.equal(G.bagCapacity(s), 13); assert(CH.cellBlocked(s, 3, 3)); assert(!CH.cellBlocked(s, 0, 0)); }
{ const s = run(['fewchoices']); assert.equal(T.offerCount(s, 3), 2); }
{ const s = run(['fewrelics']); assert.equal(T.relicCount(s, 3), 2); }
{ const st = T.profile(); st.totalXp = 300; st.unlocked = []; for (const id of ['pow_atk_1', 'vit_hp_1', 'pow_atk_2', 'vit_hp_2', 'pow_atk_3', 'first_impact']) assert(T.buy(null, id), id);
  const s = run(['treecap']); assert(CH.treeNodes(s, st.unlocked).reduce((t, id) => t + T.D.by[id].cost, 0) <= 210); st.unlocked = []; st.totalXp = 0; }
assert.equal(run(['cursed']).cards.filter(c => c.type === 'burden').length, 2);
{ const pc = CH.profile(); pc.selected = ['veterans', 'scarce']; const s = G.fresh('vanguard', 3); s.training = { wins: 1 }; CH.start(s); assert.equal(s.challenges, undefined); assert.equal(CH.active(s, 'scarce'), false); }

// Tree level model.
{ const st = T.profile(); st.unlocked = []; st.totalXp = 95; assert.equal(T.level(), 9); assert.equal(T.points(), 90);
  assert(T.buy(null, 'pow_atk_1')); assert.equal(T.available(), 82); assert(T.reset(null)); assert.equal(T.available(), 90);
  st.totalXp = 1000; assert.equal(T.level(), 30); assert.equal(T.overflowXp(), 700);
  assert.deepEqual([T.xpFor(1, false), T.xpFor(1, true), T.xpFor(2, false), T.xpFor(2, true), T.xpFor(3, true)], [2, 4, 1, 4, 6]); st.totalXp = 0; }

console.log('PASS challenges (revision 2): 15 challenges, level = number of active challenges, sequential unlock, 1 Insignia per first victory of each level, completion per challenge, per-challenge effects, training excluded; tree level model.');
