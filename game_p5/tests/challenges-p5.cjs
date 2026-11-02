/* Desafios da Jornada (post-CP1, test copy): each challenge's effect, challenge level, unlock and Insignia rules,
 * plus the tree level model (level from banked XP, points, reset). */
const assert = require('node:assert/strict');
for (const f of ['game-0', 'balance-p1', 'decks-p3', 'training-engine', 'raid-engine', 'monster-engine', 'acts-engine', 'enemy-decks-p4', 'boss-engine', 'map-variety', 'tree-data', 'tree-engine', 'journey-debug', 'content-v53', 'traits-v54', 'supports-b', 'challenges']) require('../dist/' + f + '.js');
const G = Game, P = Progress, T = JourneyTree, CH = JourneyChallenges, B = JourneyBosses;
P.load(P.freshProfile()); P.completeTutorial();

// Catalogue: 15 challenges, 38 points at maximum.
assert.equal(CH.LIST.length, 15);
assert.equal(CH.level(Object.fromEntries(CH.LIST.map(c => [c.id, c.grades]))), 38);
assert.equal(CH.level({ veterans: 9, scarce: 1, nope: 3 }), 3 + 3, 'grades are clamped, unknown ids ignored');

// Locked until the first victory.
assert.equal(CH.select('veterans', 1), false);
function run(sel, seed = 7) { const pc = CH.profile(); pc.unlocked = !!sel; pc.selected = { ...(sel || {}) }; const s = G.fresh('vanguard', seed); G.enter(s, G.available(s)[0].id); return s; }
function fight(sel, stage, type = 'battle', seed = 7) { const s = run(sel, seed); s.mapBattles = stage - 1; s.current = { ...s.current, type }; G.startConfront(s, s.current); return s; }
const ups = s => s.ai.cards.reduce((n, c) => n + c.level, 0);
{ const s = run(null); assert.deepEqual(s.challenges, {}); assert.equal(s.challengeLevel, 0); }

// 1 Veterans: +1 upgrade per grade on regular fights only.  4 Commanders: elites/bosses +1 upgrade and +1 relic per grade.
assert.equal(ups(fight({ veterans: 2 }, 9)) - ups(fight(null, 9)), 2);
assert.equal(ups(fight({ veterans: 2 }, 9, 'elite')), ups(fight(null, 9, 'elite')));
assert.equal(ups(fight({ commanders: 2 }, 9, 'elite')) - ups(fight(null, 9, 'elite')), 2);
{ const s = run({ commanders: 2 }); s.relicOpportunities = 4; const cards = G.DECKS[0].ids.map(t => ({ type: t, level: 0 })); for (let i = 0; i < 50; i++) assert(G.rollEnemyRelics(s, cards).artifacts.length >= 1); }

// 2/3 Tough Troops / Relentless Attacks: enemy health / damage +8% per grade.
{ const hp = sel => { const s = fight(sel, 5); s.round = 3; s.board[2] = s.cards[0].uid; const b = G.createBattle(s); return b.units.filter(u => u.side === 1).map(u => [u.maxhp, u.atk]); };
  const base = hp(null), t = hp({ tough: 2 }), r = hp({ relentless: 3 });
  base.forEach(([h, a], i) => { assert(Math.abs(t[i][0] / h - 1.16) < 1e-9); assert(Math.abs(t[i][1] / a - 1) < 1e-9); assert(Math.abs(r[i][1] / a - 1.24) < 1e-9); }); }

// 5 Full-Strength Leaders: half of the leader cut restored per grade.
{ const s = run({ leaders: 1 }), st = { hp: 100, atk: 100 }; CH.enemyStats(s, { type: 'boss_goblin' }, st); assert(Math.abs(st.hp - 100 * (0.8 + 0.1) / 0.8) < 1e-9); }

// 6 Reinforcements: +1 enemy unit (and +2 enemy energy) on regular fights, not on bosses.
{ const s = fight({ reinforcements: 1 }, 5); s.round = 2; assert.equal(G.maxUnits(s, true), 4); assert.equal(G.maxUnits(s, false), 3); }
{ const s = fight({ reinforcements: 1 }, 9, 'boss'); assert.equal(CH.extraUnits(s), 0); }

// 7 Raid Fury: raid health +15% per grade (through JourneyRaid.initialize).
{ const s = run({ raidfury: 2 }); JourneyRaid.initialize(s, 'tree', { hp: 1, damage: 1, minions: 1 }, true); assert(Math.abs(s.raid.scale.hp - 1.3) < 1e-9); assert.equal(s.raid.scale.damage, 1); }

// 8 Inflated Market: shop prices +15% per grade.  9 Light Purse: gold -15% per grade.
{ const s = run({ inflation: 2 }), base = run(null); s.current = base.current = { id: 'x', type: 'shop' }; assert.equal(T.price(s, 'upgrade', 10, 0), Math.ceil(10 * 1.3)); assert.equal(T.price(base, 'upgrade', 10, 0), 10); }
{ const s = run({ lightpurse: 1 }); assert.equal(T.gold(s, 16), Math.round(16 * .85)); }

// 10 Scarce Resources: -1 energy for the player only.
{ const s = run({ scarce: 1 }), b = run(null); s.round = b.round = 3; assert.equal(G.energyIncome(s), G.energyIncome(b) - 1); assert.equal(G.energyIncome(s, true), G.energyIncome(b, true)); }

// 11 Limited Luggage: 2 blocked cells per grade.
{ const s = run({ bag: 2 }); assert.equal(G.bagCapacity(s), 12); assert.equal(CH.cellBlocked(s, 3, 3), true); assert.equal(CH.cellBlocked(s, 0, 0), false); }

// 12 Few Choices: one card option less.
{ const s = run({ fewchoices: 1 }); assert.equal(T.offerCount(s, 3), 2); }

// 13 Contained Tree: latest nodes disabled beyond (points - 60 per grade).
{ const st = T.profile(); st.totalXp = 300; st.unlocked = []; for (const id of ['pow_atk_1', 'vit_hp_1', 'pow_atk_2', 'vit_hp_2', 'pow_atk_3', 'first_impact']) assert(T.buy(null, id), id);
  const s = run({ treecap: 2 }); assert.equal(T.points(), 300); const active = CH.treeNodes(s, st.unlocked); assert(active.length < st.unlocked.length || T.spent() <= 180); assert(active.reduce((t, id) => t + T.D.by[id].cost, 0) <= 180);
  st.unlocked = []; st.totalXp = 0; }

// 15 Cursed Path: 1 Burden per grade at run start.
assert.equal(run({ cursed: 2 }).cards.filter(c => c.type === 'burden').length, 2);

// Challenges never apply to training.
{ const pc = CH.profile(); pc.unlocked = true; pc.selected = { veterans: 3, scarce: 1 }; const s = G.fresh('vanguard', 3); s.training = { wins: 1 }; CH.start(s); assert.equal(s.challenges, undefined); assert.equal(CH.grade(s, 'scarce'), 0); }

// Insignia: 1 + floor(P/4) per win at P >= 1; record bonus 5 x (P - record).
assert.deepEqual(CH.insigniaFor(0, 0), { win: 0, record: 0 });
assert.deepEqual(CH.insigniaFor(6, 0), { win: 2, record: 30 });
assert.deepEqual(CH.insigniaFor(8, 6), { win: 3, record: 10 });
assert.deepEqual(CH.insigniaFor(4, 8), { win: 2, record: 0 });

// Tree level model: level = banked XP / 10 (max 30), 10 points per level, free reset outside a run, map 1 XP doubled.
{ const st = T.profile(); st.unlocked = []; st.totalXp = 95; assert.equal(T.level(), 9); assert.equal(T.points(), 90);
  assert(T.buy(null, 'pow_atk_1')); assert.equal(T.available(), 82); assert(T.reset(null)); assert.equal(T.available(), 90);
  st.totalXp = 1000; assert.equal(T.level(), 30); assert.equal(T.overflowXp(), 700);
  assert.deepEqual([T.xpFor(1, false), T.xpFor(1, true), T.xpFor(2, false), T.xpFor(2, true), T.xpFor(3, true)], [2, 4, 1, 4, 6]); st.totalXp = 0; }

console.log('PASS challenges: 15 challenges (38 points), per-challenge effects, training excluded, Insignia formula; tree level model (level, points, reset, map-1 XP).');
