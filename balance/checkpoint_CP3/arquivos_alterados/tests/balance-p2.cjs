/* Balance P1/P2 checks: approved data module, skillScale, support model B rules and the 6 new trait mechanics. */
const assert = require('node:assert/strict');
for (const f of ['game-0', 'balance-p1', 'training-engine', 'raid-engine', 'monster-engine', 'acts-engine', 'boss-engine', 'map-variety', 'tree-data', 'tree-engine', 'journey-debug', 'content-v53', 'traits-v54', 'supports-b']) require('../dist/' + f + '.js');
const G = Game, T = JourneyTraits, S = JourneySupportB;
// P1 data module
assert.equal(G.BY.cowboy.cost, 3); assert.equal(G.BY.cannoneer.rarity, 2); assert.equal(G.BY.cannoneer.area, 50); assert.equal(G.BY.sorceress.skillScale, 1.45);
{ const s = G.fresh('balanced', 3); const st = G.stats({ type: 'sorceress', level: 0 }, s, []); assert(Math.abs(st.skill - 1.45) < 1e-9); }
// Fixed board helper
function battle(mine, foes = ['warrior']) {
  const s = G.fresh('vanguard', 9); Object.assign(s, { artifacts: [], reserve: [], bag: { items: [] }, current: { id: 'x', type: 'battle', name: 'x', layer: 5 }, phase: 'prep', round: 5, mapBattles: 8, bench: Array(6).fill(null), fusions: {}, deployedAt: {}, hand: [], draw: [], discard: [] });
  s.cards = mine.map((type, i) => ({ uid: 'p' + i, type, level: 0 })); s.board = Array(15).fill(null); mine.forEach((t, i) => s.board[[2, 1, 3, 7, 6, 8][i]] = 'p' + i);
  const cards = foes.map((type, i) => ({ uid: 'e' + i, type, level: 0 })), board = Array(15).fill(null); foes.forEach((t, i) => board[[2, 1, 3][i]] = 'e' + i);
  s.ai = { cards, draw: [], discard: [], hand: [], board, bench: Array(6).fill(null), fusions: {}, deployedAt: {}, deploySerial: 0, lastRound: s.round, round: s.round, energy: 0, elite: false, boostedTypes: [], artifacts: [], bag: { items: [] } };
  return G.createBattle(s);
}
const bonusOf = (u, k) => Object.values(u.bonuses || {}).reduce((n, b) => n + (b.time > 0 ? b[k] || 0 : 0), 0);
// Supports are passive auras; the emitter is never affected by its own aura; different auras add up.
for (const id of Object.keys(S.SPEC)) { assert.equal(G.BY[id].kind, 'passive'); assert(G.BY[id].detailPT.startsWith('Aura passiva')); }
{ const b = battle(['warrior', 'goblin_king', 'bard']); const w = b.units.find(u => u.type === 'warrior' && !u.side), k = b.units.find(u => u.type === 'goblin_king'), bard = b.units.find(u => u.type === 'bard');
  for (const u of [w, k, bard]) { u.x = 200; u.y = 400; }
  T.beforeStep(b, 1 / 60);
  const BA = S.SPEC.bard.buff.atk, KA = S.SPEC.goblin_king.buff.atk; // R3: values read from SPEC (Bard +34% damage)
  assert(Math.abs(bonusOf(w, 'atk') - (KA + BA)) < 1e-9, 'auras from different supports add up');
  assert(Math.abs(bonusOf(k, 'atk') - BA) < 1e-9, 'king gets only the bard aura'); assert(Math.abs(bonusOf(bard, 'atk') - KA) < 1e-9, 'bard gets only the king aura');
  // No feedback: received skill buffs do not grow the emitter aura.
  for (let i = 0; i < 120; i++) G.step(b, 1 / 60);
  if (k.hp > 0 && w.hp > 0 && bard.hp > 0) { T.beforeStep(b, 1 / 60); assert(Math.abs(bonusOf(w, 'atk') - (KA + BA)) < 1e-9, 'aura size stable'); }
}
// Healing: others only, every interval, through the pending list.
{ const b = battle(['warrior', 'priestess']); const w = b.units.find(u => u.type === 'warrior' && !u.side), p = b.units.find(u => u.type === 'priestess'); w.x = p.x = 200; w.y = 380; p.y = 420; w.hp = 100; p.hp = 100;
  const pending = []; JourneyTree.beforeSettle(b, b.units.filter(u => u.hp > 0), pending);
  b.time = 0; p.supportBLast = -10; pending.length = 0; JourneyTree.beforeSettle(b, b.units.filter(u => u.hp > 0), pending);
  assert(pending.some(x => x.target === w && Math.abs(x.heal - w.maxhp * .068) < 1e-6)); assert(!pending.some(x => x.target === p), 'no self heal'); }
// Trait mechanics (tier values; Legends/Goblin/Patient/Fearless/Protector also asserted in traits-v54.cjs).
{ const b = battle(['pirate', 'goblin_rider', 'cavalier', 'eagle_druid']); const a = b.units.find(u => u.type === 'goblin_rider'), e = b.units.find(u => u.side);
  T.ensure(b); const tier = T.rank(a, 'Trailblazer'); assert.equal(tier, 2);
  a.hits = 1; const first = T.damage(b, a, e, 100, false, {}); assert(first >= 165 - 1e-9, 'first basic after moving +65%');
  const second = T.damage(b, a, e, 100, false, {}); assert(second < first, 'no bonus without moving / before 4s'); }
console.log('PASS balance P1/P2: data module, skillScale, support aura rules (emitter excluded, additive, no feedback, healing others), Trailblazer first strike.');
