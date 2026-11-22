// Endgame (teste): escala geral e 7 desafios candidatos (dist/challenges-endgame.js).
const assert = require('node:assert/strict');
const { G, P } = require('./cp4-engine.cjs');
const CH = JourneyChallenges, EG = JourneyChallengesEndgame, T = JourneyTree;
function run(sel, deck = 'vanguard', seed = 1) {
  P.load(P.freshProfile()); P.completeTutorial(); P.profile.mapsUnlocked = 3;
  const pc = CH.profile(); pc.unlocked = true; pc.available = 15; pc.selected = sel;
  const s = G.fresh(deck, seed); assert.ok(G.enter(s, G.available(s)[0].id)); return s;
}
// catálogo (22/11): 18 desafios (5 na reserva), nível máximo 18; valores decididos
assert.equal(CH.catalog().length, 18); assert.equal(CH.MAX_LEVEL, 18);
for (const id of ['tough', 'relentless', 'raidfury', 'scarce', 'fewrelics']) assert.ok(CH.BY[id].reserve && !CH.clean([id]).length, id);
assert.equal(CH.TUNE.globalScale, .02); assert.equal(CH.TUNE.fatigue, .03); assert.equal(CH.TUNE.lessSupportLayers, 2);
assert.equal(CH.TUNE.reinforceFromRound, 3); assert.equal(CH.TUNE.lightpurse, .30); assert.equal(CH.TUNE.bagCells, 4);
// blocos (6 de 3): blocos anteriores inteiros + parte do bloco seguinte
assert.equal(CH.blocks().length, 6); assert.ok(CH.blocks().flat().length === 18 && new Set(CH.blocks().flat()).size === 18);
assert.ok(CH.blockValid(['moreelites'])); assert.ok(!CH.blockValid(['commanders']));
assert.ok(CH.blockValid(['reinforcements', 'fortified', 'moreelites', 'fatigue'])); assert.ok(!CH.blockValid(['reinforcements', 'fortified', 'fatigue']));
P.load(P.freshProfile()); let pc = CH.profile(); pc.unlocked = true; pc.available = 4;
assert.ok(!CH.select(['commanders'])); assert.ok(CH.select(['reinforcements', 'fortified', 'moreelites', 'fatigue']));
assert.ok(!CH.toggle('moreelites'), 'não pode tirar desafio do bloco anterior enquanto há desafio do bloco seguinte');
// vencer o nível 3 (bloco 1 inteiro) libera o nível 4, ou seja, o bloco 2
{ const s = { challenges: ['reinforcements', 'fortified', 'moreelites'] }; pc.available = 3; CH.recordVictory(s); assert.equal(CH.profile().available, 4); }
// escala geral: 3 desafios × 2% = ×1,06 em vida, ataque e defesa dos inimigos
CH.TUNE.blocks = null; // testes de mecânica sem a restrição de blocos
let s = run(['inflation', 'lightpurse', 'bag']);
let st = CH.enemyStats(s, s.ai.cards[0], { hp: 100, atk: 10, defense: 10 });
assert.ok(Math.abs(st.hp - 106) < 1e-9 && Math.abs(st.atk - 10.6) < 1e-9 && Math.abs(st.defense - 10.6) < 1e-9);
// Inimigos Fortalecidos: +10% vida e +8% dano, somados à escala (1 desafio × 2%)
s = run(['fortified']); st = CH.enemyStats(s, s.ai.cards[0], { hp: 100, atk: 10, defense: 10 });
assert.ok(Math.abs(st.hp - 100 * 1.1 * 1.02) < 1e-9 && Math.abs(st.atk - 10 * 1.08 * 1.02) < 1e-9);
// Fadiga: −3% em vida, ataque, defesa e velocidade de ataque do jogador
s = run(['fatigue']);
st = T.stats({ hp: 100, atk: 10, defense: 10, rate: 1, crit: 0, speed: 1 }, s.cards[0], s, false);
assert.ok(Math.abs(st.hp - 97) < 1e-9 && Math.abs(st.atk - 9.7) < 1e-9 && Math.abs(st.rate - 1 / .97) < 1e-9);
// Mais Elites: 2 camadas inteiras de batalhas simples viram elite, nunca a 1ª batalha, sem camadas vizinhas, nunca a 13
for (let seed = 1; seed <= 20; seed++) {
  s = run(['moreelites'], 'vanguard', seed);
  const L = s.map.map((row, i) => row.some(n => n.challengeElite) ? i : -1).filter(i => i >= 0);
  assert.equal(L.length, 2, 'seed ' + seed); assert.ok(L[1] - L[0] > 1 && !L.includes(0) && !L.includes(13));
  for (const i of L) assert.ok(s.map[i].every(n => n.type === 'elite'));
}
// Menos Apoio: 2 camadas de apoio viram camadas de batalhas, nunca a 13
for (let seed = 1; seed <= 20; seed++) {
  s = run(['lesssupport'], 'vanguard', seed);
  const L = s.map.map((row, i) => row.some(n => n.supportConverted) ? i : -1).filter(i => i >= 0);
  assert.equal(L.length, 2); assert.ok(L.every(i => i !== 13 && s.map[i].every(n => n.type === 'battle')));
}
// Menos Apoio + Mais Elites: a camada convertida pode virar elite (elegível)
// Loja com Menos Opções: 2 recrutas e 1 relíquia
s = run(['smallshop']); s.phase = 'shop'; s.offers = { cards: ['a', 'b', 'c'], artifacts: ['x', 'y'] }; EG.trimShop(s);
assert.deepEqual([s.offers.cards.length, s.offers.artifacts.length], [2, 1]);
// Derrota Custa Ouro: 3×1 perde 1/3, 3×2 perde 2/3, 3 derrotas zeram; sem o desafio, nada muda
s = run(['lostgold']);
for (const [L, want] of [[0, 18], [1, 12], [2, 6], [3, 0], [4, 0]]) { s.lgPending = L; assert.equal(T.gold(s, 18), want); }
s = run([]); s.lgPending = 2; assert.equal(T.gold(s, 18), 18);
// Relíquias Amaldiçoadas: só relíquias novas; a inicial não conta
s = run(['cursedrelics']); const before = s.cards.length; EG.curseSweep(s); assert.equal(s.cards.length, before);
let cursed = 0; for (let k = 0; k < 60; k++) { s.artifacts.push('fake_' + k); EG.curseSweep(s); } cursed = (s.crCurses || []).length;
assert.ok(cursed > 10 && cursed < 30, 'maldições ' + cursed); assert.ok(s.crCurses.every(([, c]) => ['burden', 'chains'].includes(c)));
// Decks Reforçados: elites e bosses trocam as 2 cartas mais fracas (times de 4 cópias: 1)
s = run(['reinforceddecks']); s.current = { type: 'elite' }; s.ai.reinforced = false;
s.ai.cards = [['warrior', 3], ['lancer', 3], ['cannoneer', 2]].flatMap(([t, n]) => Array.from({ length: n }, (_, i) => ({ uid: t + i, type: t, level: 0 })));
EG.reinforce(s); assert.equal(s.ai.reinforcedSwaps.length, 2); assert.equal(s.ai.cards.length, 8);
console.log('PASS challenges-endgame: catálogo 18 em 6 blocos, valores de 22/11, Inimigos Fortalecidos, escala geral, Fadiga, Mais Elites, Menos Apoio, Loja, Derrota Custa Ouro, Relíquias Amaldiçoadas, Decks Reforçados');
