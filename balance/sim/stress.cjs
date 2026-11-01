/* Sustain stress test (FIXTURE): support-heavy, fused teams. Checks for stalls (120s draws), round length and
 * break-even strength, on the current GJ_ROOT copy. Real combat, fixed boards, enemy at scale 1.00.
 * Usage: GJ_ROOT=... node balance/sim/stress.cjs */
'use strict';
const { G } = require('./engine.cjs');
const POS = { front: [2, 1, 3, 0, 4], mid: [7, 6, 8, 5, 9], back: [12, 11, 13, 10, 14] };
function side(s, list, prefix, fus) {
  const board = Array(15).fill(null), cards = [], used = { front: [...POS.front], mid: [...POS.mid], back: [...POS.back] };
  list.forEach((m, i) => {
    const c = { uid: prefix + i, type: m.type, level: m.level || 0 }; cards.push(c);
    if (m.fused) { const a = { uid: prefix + i + 'b', type: m.type, level: m.level || 0 }, b = { uid: prefix + i + 'c', type: m.type, level: m.level || 0 }; cards.push(a, b); fus[c.uid] = [c.uid, a.uid, b.uid]; }
    board[used[m.row || (G.BY[m.type].range > 100 ? 'back' : 'front')].shift()] = c.uid;
  });
  return { board, cards };
}
function fight(mine, foes, seed, mult = 1) {
  const s = G.fresh('vanguard', seed);
  Object.assign(s, { artifacts: [], reserve: [], bag: { items: [] }, current: { id: 'lab', type: 'battle', name: 'Lab', layer: 5 }, phase: 'prep', round: 5, mapBattles: 8, encounters: 1,
    bench: Array(6).fill(null), fusions: {}, deployedAt: {}, deploySerial: 0, hand: [], draw: [], discard: [] });
  const p = side(s, mine, 'p', s.fusions); s.cards = p.cards; s.board = p.board;
  const ef = {}, e = side(s, foes, 'e', ef);
  s.ai = { cards: e.cards, draw: [], discard: [], hand: [], board: e.board, bench: Array(6).fill(null), fusions: ef, deployedAt: {}, deploySerial: 0, lastRound: s.round, round: s.round, energy: 0,
    elite: false, deckId: null, strategy: 'balanced', boostedTypes: [], artifacts: [], bag: { items: [] } };
  const b = G.createBattle(s);
  for (const u of b.units.filter(u => u.side === 1)) { u.hp *= mult; u.maxhp *= mult; u.atk *= mult; }
  while (!b.result && b.time < 200) G.step(b, 1 / 60);
  return { r: b.result, t: b.time };
}
const F = (type, extra = {}) => ({ type, fused: true, level: 2, ...extra });
const SUP = {
  'quatro curandeiros fundidos': [F('gladiator'), F('orc_warrior'), F('priestess'), F('elf_harpist'), F('snow_troll'), F('shaman')],
  'curandeiros + bônus fundidos': [F('gladiator'), F('bear_druid'), F('elf_harpist'), F('goblin_king'), F('sage'), F('bard')],
  'dois curandeiros fundidos + dano': [F('gladiator'), F('cavalier'), F('cowboy'), F('musketeer'), F('priestess'), F('snow_troll')],
};
const ENEMY = {
  'brigões fundidos': [F('viking'), F('berserker'), F('orc_berserker'), F('fighter'), F('shieldmaiden'), F('samurai')],
  'atiradores fundidos': [F('bastion'), F('gunner'), F('crossbowman'), F('cowboy'), F('musketeer'), F('huntress')],
};
console.log('copy', require('./engine.cjs').ROOT);
for (const [name, team] of Object.entries(SUP)) {
  for (const [ename, foes] of Object.entries({ ...ENEMY, 'espelho (mesmo time)': team })) {
    const rs = []; for (let sd = 1; sd <= 6; sd++) rs.push(fight(team, foes, sd * 101 + 7));
    const draws = rs.filter(r => r.r === 'draw').length, wins = rs.filter(r => r.r === 'win').length;
    console.log(name.padEnd(34), 'vs', ename.padEnd(22), 'vitórias', wins + '/6', 'empates', draws + '/6', 'duração média', (rs.reduce((n, r) => n + r.t, 0) / 6).toFixed(1) + 's', 'máx', Math.max(...rs.map(r => r.t)).toFixed(1) + 's');
  }
}
