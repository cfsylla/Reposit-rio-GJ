/* R3 aura identity (Carlos 06/11/2026): only Priestess, Flower Fairy, Elf Harpist and Shaman heal; the other six supports are
 * pure buff auras with one buff each (Goblin King keeps two). Run: node game_r3/tests/auras-r3.cjs (values read from SPEC). */
const assert = require('node:assert/strict');
for (const f of ['game-0', 'balance-p1', 'training-engine', 'raid-engine', 'monster-engine', 'acts-engine', 'boss-engine', 'map-variety', 'tree-data', 'tree-engine', 'journey-debug', 'content-v53', 'traits-v54', 'supports-b']) require('../dist/' + f + '.js');
const G = Game, S = JourneySupportB, SPEC = S.SPEC;
const HEAL = ['priestess', 'flower_fairy', 'elf_harpist', 'shaman'], PURE = ['bard', 'sage', 'snow_troll', 'feline_arcanist', 'feline_drummer', 'goblin_king'];
for (const id of HEAL) assert(SPEC[id].heal > 0, id + ' heals');
for (const id of PURE) { assert.equal(SPEC[id].heal, 0, id + ' heal 0'); assert(!/cura|heal/i.test(G.BY[id].detail + ' ' + G.BY[id].detailPT), id + ' text without heal'); }
for (const id of HEAL) { assert(SPEC[id].every >= 3, id + ' heals at most every 3 s'); const per = G.BY[id].hp * SPEC[id].heal / SPEC[id].every; assert(per > 4.5 && per < 5.5, id + ' ~5 HP/s at level 0: ' + per); }
for (const id of [...HEAL, ...PURE]) assert.equal(Object.keys(SPEC[id].buff).length, id === 'goblin_king' ? 2 : 1, id + ' buff count');
function battle(mine) {
  const s = G.fresh('vanguard', 9); Object.assign(s, { artifacts: [], reserve: [], bag: { items: [] }, current: { id: 'x', type: 'battle', name: 'x', layer: 5 }, phase: 'prep', round: 5, mapBattles: 8, bench: Array(6).fill(null), fusions: {}, deployedAt: {}, hand: [], draw: [], discard: [] });
  s.cards = mine.map((type, i) => ({ uid: 'p' + i, type, level: 0 })); s.board = Array(15).fill(null); mine.forEach((t, i) => s.board[[2, 1, 3, 7][i]] = 'p' + i);
  const cards = [{ uid: 'e0', type: 'warrior', level: 0 }], board = Array(15).fill(null); board[2] = 'e0';
  s.ai = { cards, draw: [], discard: [], hand: [], board, bench: Array(6).fill(null), fusions: {}, deployedAt: {}, deploySerial: 0, lastRound: s.round, round: s.round, energy: 0, elite: false, boostedTypes: [], artifacts: [], bag: { items: [] } };
  return G.createBattle(s);
}
const bonusOf = (u, k) => Object.values(u.bonuses || {}).reduce((n, b) => n + (b.time > 0 ? b[k] || 0 : 0), 0);
// Wounded ally, no other heal source: pure auras never create a heal entry, but the buff still applies; healers still heal.
for (const id of [...PURE, ...HEAL]) {
  const b = battle(['warrior', id]); const w = b.units.find(u => u.type === 'warrior' && !u.side), e = b.units.find(u => u.type === id);
  w.x = e.x = 200; w.y = 380; e.y = 420; w.hp = w.maxhp * .3;
  JourneyTraits.beforeStep(b, 1 / 60);
  const [k, v] = Object.entries(SPEC[id].buff)[0]; assert(Math.abs(bonusOf(w, k) - v) < 1e-9, id + ' buff applies');
  const pending = []; e.supportBLast = -10; JourneyTree.beforeSettle(b, b.units.filter(u => u.hp > 0), pending);
  const heals = pending.filter(x => x.heal && x.target === w);
  if (PURE.includes(id)) assert.equal(heals.length, 0, id + ' must not heal'); else assert(heals.some(x => x.heal >= e.maxhp * SPEC[id].heal * .9 - 1e-6 && x.heal <= e.maxhp * SPEC[id].heal * 1.1 + 1e-6), id + ' heals % of the HEALER max HP (±10%)');
}
// Titan / True Boss form 2: healing from other units is capped per pulse (0.25% max HP); its own healing is not.
{ const b = battle(['warrior']); const t = b.units.find(u => u.side === 1); Object.assign(t, { raidBoss: true, maxhp: 20000, hp: 10000 }); const healer = b.units.find(u => u.side === 0);
  const pend = []; G.heal(b, t, 5000, pend, healer); assert(Math.abs(pend[0].heal - 50) < 1e-6, 'per-pulse cap 0.25%: ' + pend[0].heal);
  const self = []; G.heal(b, t, 5000, self, t); assert(self[0].heal > 50, 'own healing not capped by the per-pulse cap'); }
// Enemy support next to a stationary raid boss stands in FRONT of it (toward the player), inside the field.
{ const b = battle(['warrior']); const boss = b.units.find(u => u.side === 1); Object.assign(boss, { raidBoss: true, speed: 0, x: 215, y: 180 });
  const sup = { ...boss, uid: 'esup', type: 'priestess', raidBoss: false, speed: 60, x: 215, y: 120, hp: 180, maxhp: 180, range: 145, motion: null, stun: 0 };
  b.units.push(sup); JourneyTraits.beforeStep(b, 1 / 60); assert(sup.motion, 'support moves'); assert(sup.motion.y > sup.y, 'moves toward the front (y grows), not behind the boss'); }
console.log('PASS R3 auras: Titan per-pulse heal cap, supports in front of a stationary boss, 4 healers heal % of their own max HP (~5 HP/s, every >= 3 s, ±10%), 6 pure buff auras heal 0 (no heal entry, no heal text), one buff each (Goblin King two), buffs still apply.');
