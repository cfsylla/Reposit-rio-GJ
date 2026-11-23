// Endgame (teste, 22/11): 18 vantagens (15 + Troféu de Boss, Vitória Limpa, Emboscada) e 5 revisões.
const assert = require('node:assert/strict');
const { G, P } = require('./cp4-engine.cjs');
const AD = JourneyAdvantages, T = JourneyTree, CH = JourneyChallenges;
function run(adv, deck = 'vanguard', seed = 1) {
  P.load(P.freshProfile()); P.completeTutorial(); P.profile.mapsUnlocked = 3; P.profile.advantages = [...adv];
  const s = G.fresh(deck, seed); assert.ok(G.enter(s, G.available(s)[0].id)); return s;
}
assert.equal(AD.LIST.length, 18);
for (const id of ['boss_trophy', 'clean_victory', 'ambush']) assert.ok(AD.BY[id], id);
assert.equal(AD.TUNE.fullPurse, 40); assert.equal(AD.TUNE.flexScope, 'confront'); assert.equal(AD.TUNE.secondMode, 'extra'); assert.equal(AD.TUNE.cleanseScope, 'shop');
// Bolsa Cheia: +40
{ const a = run([]), b = run(['full_purse']); assert.equal(b.gold - a.gold, 40); }
// Preparação Flexível: 1 por confronto (não por rodada)
{ const s = run(['flex_prep']); assert.equal(AD.flexLeft(s), 1); s.adv.flex = { [String(s.encounters)]: 1 }; s.round = 3; assert.equal(AD.flexLeft(s), 0); }
// Limpeza: remoção grátis em cada loja, uma vez por loja
{ const s = run(['cleanse']); s.current = { id: 'shopA', type: 'shop' }; assert.equal(G.price(s, 'remove', s.cards[0].uid), 0);
  s.adv.cleanse.push('shopA'); assert.ok(G.price(s, 'remove', s.cards[0].uid) > 0); s.current = { id: 'shopB', type: 'shop' }; assert.equal(G.price(s, 'remove', s.cards[0].uid), 0); }
// Segunda Chance: inclusive boss; limite de derrotas +1, uma vez por run
for (const type of ['battle', 'elite', 'boss']) {
  const s = run(['second_chance']); s.current = { ...s.current, type }; s.score = [1, type === 'boss' ? 4 : 3]; s.phase = 'defeat';
  assert.equal(P.finish(s, 'defeat'), false); assert.equal(s.phase, 'roundResult'); assert.equal(s.score[1], type === 'boss' ? 3 : 2); assert.ok(s.secondChanceNotice);
  s.score[1]++; s.phase = 'defeat'; assert.ok(!AD.secondChance(s), 'só uma vez por run');
}
// Troféu de Boss: +3% vida e ataque por boss de mapa vencido
{ const s = run(['boss_trophy']); s.current = { ...s.current, type: 'boss' }; P.finish(s, 'victory'); assert.deepEqual(s.adv.trophies, [1]);
  const st = T.stats({ hp: 100, atk: 10, defense: 10, rate: 1, crit: 0, speed: 1 }, s.cards[0], s, false); const st0 = T.stats({ hp: 100, atk: 10, defense: 10, rate: 1, crit: 0, speed: 1 }, s.cards[0], run([]), false);
  assert.ok(Math.abs(st.hp / st0.hp - 1.03) < 1e-9 && Math.abs(st.atk / st0.atk - 1.03) < 1e-9); }
// Emboscada: 1ª rodada, inimigo com 1 unidade a menos (mínimo 1); não vale em boss
{ const s = run(['ambush']); s.round = 1; assert.equal(CH.extraUnits(s), -1); assert.equal(G.maxUnits(s, true), 1); s.round = 2; assert.equal(CH.extraUnits(s), 0);
  s.round = 1; s.current = { ...s.current, type: 'boss' }; assert.equal(CH.extraUnits(s), 0); }
// Olho Treinado: 1 renovação grátis no nó de recrutamento
{ const s = run(['trained_eye']); s.phase = 'recruit'; s.current = { id: 'rec1', type: 'recruit' }; s.offers = G.choices(s); const before = [...s.offers];
  assert.ok(AD.canRerollRecruit(s)); assert.ok(AD.rerollRecruit(s)); assert.ok(s.offers.every(id => !before.includes(id))); assert.ok(!AD.rerollRecruit(s)); }
console.log('PASS advantages-endgame: 18 vantagens, Bolsa Cheia 40, Preparação Flexível por confronto, Limpeza em cada loja, Segunda Chance (inclusive boss), Troféu de Boss, Emboscada, Olho Treinado no recrutamento');
// Blocos de vantagens (23/11): 6 de 3; bloco seguinte abre com o atual inteiro; não pode desativar do bloco anterior com o seguinte em uso
{ assert.equal(AD.advBlocks().length, 6); assert.equal(new Set(AD.advBlocks().flat()).size, 18); assert.ok(AD.advBlocks().flat().every(id => AD.BY[id]));
  P.load(P.freshProfile()); P.profile.insignia = 18;
  assert.ok(!AD.buy('cleanse'), 'bloco 2 fechado'); assert.ok(AD.buy('ambush')); assert.ok(AD.buy('elite_hunter')); assert.ok(!AD.advAvailable('trained_eye'));
  assert.ok(AD.buy('elite_experience')); assert.ok(AD.buy('trained_eye'), 'bloco 2 aberto com o 1 inteiro');
  assert.ok(!AD.deactivate('ambush'), 'bloco 1 preso enquanto há vantagem do bloco 2'); assert.ok(AD.deactivate('trained_eye')); assert.ok(AD.deactivate('ambush'));
  console.log('PASS blocos de vantagens'); }
