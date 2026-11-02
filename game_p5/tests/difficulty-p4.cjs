/* Balance P4: enemy upgrade curve, elite/boss offsets, gold, upgrade price, power per map, in-map scale, enemy relic rule,
 * raid multipliers, boss leaders, themed enemy decks and the summoned-minion charge fix. */
const assert = require('node:assert/strict');
for (const f of ['game-0', 'balance-p1', 'decks-p3', 'training-engine', 'raid-engine', 'monster-engine', 'acts-engine', 'enemy-decks-p4', 'boss-engine', 'map-variety', 'tree-data', 'tree-engine', 'journey-debug', 'content-v53', 'traits-v54', 'supports-b']) require('../dist/' + f + '.js');
const G = Game, P = Progress, A = JourneyActs, B = JourneyBosses;
P.load(P.freshProfile()); P.completeTutorial();
assert.deepEqual([G.battleReward(1), G.battleReward(9), G.battleReward(10), G.battleReward(18), G.battleReward(19), G.battleReward(27)], [14, 14, 16, 16, 18, 18]);
assert.deepEqual([A.SPEC[1].power, A.SPEC[2].power, A.SPEC[3].power], [1, 1.10, 1.16]);
assert.equal(B.D.goblin.hp, Math.round(480 * .8)); assert.equal(B.D.troll.hp, Math.round(820 * .65)); assert.equal(B.D.meowri.atk, Math.round(36 * .75));
assert.deepEqual(Object.keys(JourneyEnemyDecks), ['1', '2', '3']); for (const L of Object.values(JourneyEnemyDecks)) { assert.equal(L.length, 4); for (const d of L) assert.equal(Object.values(d.counts).reduce((a, b) => a + b), 20); }
function fight(stage, type = 'battle', seed = 7) { const s = G.fresh('vanguard', seed); G.enter(s, G.available(s)[0].id); s.mapBattles = stage - 1; s.current = { ...s.current, type }; G.startConfront(s, s.current); return s; }
const ups = s => s.ai.cards.reduce((n, c) => n + c.level, 0);
for (const [stage, n] of [[1, 0], [2, 0], [3, 1], [9, 7], [18, 16], [27, 25], [28, 26]]) assert.equal(ups(fight(stage)), n, 'curve at stage ' + stage);
assert.equal(ups(fight(9, 'elite')), 8, 'elite = curve + 1');
{ const s = fight(9); assert(s.ai.deckId && s.ai.deckId.startsWith('e1_'), 'themed map-1 deck for normal battles'); }
{ const s = fight(1); assert(!s.ai.deckId, 'first fight keeps the fixed starter pool'); }
// Enemy relics: between 1 and n-1 (n = 1 starting + relic opportunities), bag-limited.
{ const s = G.fresh('vanguard', 3); s.relicOpportunities = 6; const cards = G.DECKS[0].ids.map(t => ({ type: t, level: 0 })); const seen = new Set(); for (let i = 0; i < 200; i++) { const r = G.rollEnemyRelics(s, cards); seen.add(r.artifacts.length); assert(r.artifacts.length >= 1 && r.artifacts.length <= 6); assert(G.packBag(r.artifacts)); } assert(seen.has(1) && seen.size >= 4); }
// Bug fix: summoned minions get a real skill charge (not 0).
{ const src = require('node:fs').readFileSync(__dirname + '/../dist/boss-engine.js', 'utf8'); assert(src.includes('m.charge=G.skillLimit(m)')); }
console.log('PASS P4: enemy curve (~1 upgrade per fight), elite +1, gold 14/16/18, power 1/1.10/1.16, boss leaders, themed enemy decks, relic rule 1..n-1 with bag limit, minion charge fix.');
