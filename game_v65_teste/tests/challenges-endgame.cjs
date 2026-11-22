// Endgame (teste): escala geral e 7 desafios candidatos (dist/challenges-endgame.js).
const assert = require('node:assert/strict');
const { G, P } = require('./cp4-engine.cjs');
const CH = JourneyChallenges, EG = JourneyChallengesEndgame, T = JourneyTree;
function run(sel, deck = 'vanguard', seed = 1) {
  P.load(P.freshProfile()); P.completeTutorial(); P.profile.mapsUnlocked = 3;
  const pc = CH.profile(); pc.unlocked = true; pc.available = 15; pc.selected = sel;
  const s = G.fresh(deck, seed); assert.ok(G.enter(s, G.available(s)[0].id)); return s;
}
// catálogo: 15 + 7, nada ligado por padrão
assert.equal(CH.LIST.length, 22); assert.equal(CH.TUNE.globalScale, 0);
// escala geral: 3 desafios × 2% = ×1,06 em vida, ataque e defesa dos inimigos
CH.TUNE.globalScale = .02;
let s = run(['inflation', 'lightpurse', 'bag']);
let st = CH.enemyStats(s, s.ai.cards[0], { hp: 100, atk: 10, defense: 10 });
assert.ok(Math.abs(st.hp - 106) < 1e-9 && Math.abs(st.atk - 10.6) < 1e-9 && Math.abs(st.defense - 10.6) < 1e-9);
CH.TUNE.globalScale = 0;
// Fadiga: −5% em vida, ataque, defesa e velocidade de ataque do jogador
s = run(['fatigue']);
st = T.stats({ hp: 100, atk: 10, defense: 10, rate: 1, crit: 0, speed: 1 }, s.cards[0], s, false);
assert.ok(Math.abs(st.hp - 95) < 1e-9 && Math.abs(st.atk - 9.5) < 1e-9 && Math.abs(st.rate - 1 / .95) < 1e-9);
// Mais Elites: 2 camadas inteiras de batalhas simples viram elite, nunca a 1ª batalha, sem camadas vizinhas, nunca a 13
for (let seed = 1; seed <= 20; seed++) {
  s = run(['moreelites'], 'vanguard', seed);
  const L = s.map.map((row, i) => row.some(n => n.challengeElite) ? i : -1).filter(i => i >= 0);
  assert.equal(L.length, 2, 'seed ' + seed); assert.ok(L[1] - L[0] > 1 && !L.includes(0) && !L.includes(13));
  for (const i of L) assert.ok(s.map[i].every(n => n.type === 'elite'));
}
// Menos Apoio: 1 camada de apoio vira camada de batalhas, nunca a 13
for (let seed = 1; seed <= 20; seed++) {
  s = run(['lesssupport'], 'vanguard', seed);
  const L = s.map.map((row, i) => row.some(n => n.supportConverted) ? i : -1).filter(i => i >= 0);
  assert.equal(L.length, 1); assert.ok(L[0] !== 13 && s.map[L[0]].every(n => n.type === 'battle'));
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
console.log('PASS challenges-endgame: catálogo 22, escala geral, Fadiga, Mais Elites, Menos Apoio, Loja, Derrota Custa Ouro, Relíquias Amaldiçoadas, Decks Reforçados');
