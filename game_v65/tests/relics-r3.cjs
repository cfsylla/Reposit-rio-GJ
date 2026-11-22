/* R3 relíquias (Carlos 08/11/2026): 40 relíquias, textos PT/EN, efeitos novos e run curta com cada uma equipada.
 * Rodar da raiz: GJ_ROOT=game_r3 node game_r3/tests/relics-r3.cjs */
'use strict';
process.env.GJ_ROOT ||= require('path').join(__dirname, '..');
const assert = require('assert');
const E = require('./cp4-engine.cjs'); const { G, P, C, Tree: T } = E;
const RT = globalThis.JOURNEY_RELIC_TUNE, R3 = globalThis.JourneyRelicsR3;
// 1. Catálogo: 40 relíquias, todas com nome/texto EN e PT, formato válido, preço e categoria; dicionário registrado
const A = G.ARTIFACTS; assert.strictEqual(A.length, 43);
for (const a of A) { assert(a.name && a.namePT && a.desc && a.descPT, a.id + ' textos'); assert(G.RELIC_FORMATS[a.id] && G.relicShape(a.id).length, a.id + ' formato'); assert(a.price >= 30, a.id + ' preço'); assert(a.category, a.id + ' categoria'); assert.strictEqual(globalThis.I18N_EXTRA[a.namePT], a.name); }
const milestoneRelics=P.MILESTONES.flatMap(m=>m.relic?[m.relic]:[]);
assert.equal(new Set(milestoneRelics).size,9);
assert.deepEqual(A.filter(a=>a.playerOnly||['merchant','luckycharm'].includes(a.id)).map(a=>a.id).sort(),milestoneRelics.sort());
const context=(map,campaign,type)=>({journey:{act:map},current:{campaign,type}});
const pool=(map,campaign,type,cards=G.UNITS.map(u=>({type:u.id})))=>G.enemyRelicPool(cards,[],context(map,campaign,type)).map(a=>a.id);
for (const [id,trait] of Object.entries(R3.ENEMY_RELIC_TRAITS)){
  assert(pool(3,'ironbound','boss').includes(id),id);
  assert(pool(3,'monsters','boss').includes(id),id);
  assert(!pool(3,'blackfang','boss').includes(id),id);
  assert(!pool(3,'dawncrest','boss').includes(id),id);
  if(trait)assert(!pool(3,'ironbound','boss',[]).includes(id),id);
}
for(const id of ['sling','echo']){
  for(const map of [1,2,3])assert(!pool(map,'ironbound','elite').includes(id),id);
  for(const map of [1,2])assert(!pool(map,'ironbound','boss').includes(id),id);
}
for(const [order,id] of [['blackfang','horde'],['dawncrest','dawn']]){
  assert(pool(1,order,'elite').includes(id),id);
  assert(!pool(3,'ironbound','boss').includes(id),id);
}

assert.deepStrictEqual([0, 1, 2, 3].map(r => A.filter(a => a.rarity === r).length), [11, 14, 13, 5], 'distribuição por raridade (Carlos 10/11)');
for (const [id, sh] of Object.entries({ hourglass: 'diag3', scope: 'diag2', repulsion: 'bridge', precision: 'domino', sling: 'cross', echo: 'cross', contract: 'line4', grimoire: 'U' })) assert.strictEqual(G.RELIC_FORMATS[id], sh, id + ' formato');
{ const keep = G.RELIC_FORMATS.compass; for (const [sh, n] of Object.entries({ diag2: 2, diag3: 3, bridge: 2, line4: 4, stairs: 5, cross: 5, U: 5, knight: 2 })) { G.RELIC_FORMATS.compass = sh; assert.strictEqual(G.relicShape('compass').length, n, 'formato ' + sh); } G.RELIC_FORMATS.compass = keep; }
assert.strictEqual(G.RELIC_FORMATS.heart, 'L3'); assert.strictEqual(G.RELIC_FORMATS.spark, 'L4'); assert.strictEqual(G.RELIC_FORMATS.luckycharm, 'dot');
// 2. Economia e energia
let s = G.fresh('vanguard', 3); s.round = 1; const e0 = G.energyIncome(s); s.artifacts.push('quickstart'); assert.strictEqual(G.energyIncome(s) - e0, 3);
s = G.fresh('vanguard', 3); s.gold = 0; G.rewardGold(s, 20); const g0 = s.gold; s.artifacts.push('luckycharm'); s.gold = 0; G.rewardGold(s, 20); assert(s.gold > g0 && Math.abs(s.gold - Math.round(20 * 1.21)) <= 1, 'Amuleto da sorte +21%');
assert.strictEqual(T.offerCount({ artifacts: ['compass'], current: {} }, 3), 4, 'Bússola +1 opção');
s = G.fresh('vanguard', 3); s.gold = 0; s.artifacts.push('grimoire'); G.rewardGold(s, 20); assert.strictEqual(s.gold, 17, 'Grimório −15% de ouro');
{ const t = G.fresh('balanced', 11); G.enter(t, G.available(t)[0].id); t.artifacts = ['sling']; t.bag = null; t.reserve = []; G.ensureBag(t); t.energy = 99; const h = t.hand.slice(); G.deploy(t, h[0], 10, 'board'); G.deploy(t, h[1], 14, 'board'); const bb = G.createBattle(t); G.step(bb, 1 / 60); assert.strictEqual(bb.units.filter(u => u.r3Slung).length, 0, 'Funda: espera 1 s'); while (bb.time < 1.02 && !bb.result) G.step(bb, 1 / 60); const flung = bb.units.filter(u => !u.side && u.r3Slung); assert.strictEqual(flung.length, 2, 'Funda: os 2 cantos do fundo'); assert(flung.every(u => u.y < 150), 'caem na linha inimiga'); assert(flung.every(u => u.r3Invuln > bb.time && u.r3Invuln <= bb.time + 1), 'caem invulneráveis por 1 s'); assert(flung.every(u => !(u.shield > 0)), 'sem escudo'); assert(bb.units.some(u => u.side && u.stun > 0.4), 'atordoa 1,5 s'); }
// Carlos 09/11: Eco devolve 30% em toda habilidade; Ampulheta começa com a habilidade pronta
{ const TR = globalThis.JourneyTraits, orig = TR.afterSkill; let sk = 0, rf = 0; TR.afterSkill = function (b2, u) { if (!u.side) sk++; return orig.apply(this, arguments); }; for (let seed = 1; seed <= 10; seed++) { const t = G.fresh('arcane', seed); G.enter(t, G.available(t)[0].id); t.artifacts = ['echo']; t.bag = null; t.reserve = []; G.ensureBag(t); t.energy = 99; t.hand.slice().forEach((u, i) => G.deploy(t, u, 8 + i, 'board')); const bb = G.createBattle(t); while (!bb.result && bb.time < 40) { rf += bb.units.filter(u => !u.side && u.r3EchoPending).length; G.step(bb, 1 / 60); } } TR.afterSkill = orig; assert(sk >= 2 && rf >= sk - 10, `Eco em toda habilidade (${sk} habilidades, ${rf} devoluções)`); assert.strictEqual(RT.echoRefund, .30); /* Carlos 10/11 */ }
{ assert.strictEqual(RT.hourglass, .9); /* Carlos 10/11: 90% */ const t = G.fresh('arcane', 3); G.enter(t, G.available(t)[0].id); t.artifacts = ['hourglass']; t.bag = null; t.reserve = []; G.ensureBag(t); t.energy = 99; t.hand.slice().forEach((u, i) => G.deploy(t, u, 8 + i, 'board')); const bb = G.createBattle(t); const el = bb.units.filter(u => !u.side && G.BY[u.type].kind === 'active' && !G.BY[u.type].trigger.startFull); assert(el.length && el.every(u => u.progress >= Math.floor(u.charge * RT.hourglass) - 1e-9), 'Ampulheta: habilidade pronta'); }
// 3. Sinergias "coringa", Égide e Amuleto amplificador
const b = { relics: [['houses', 'honor', 'talents'], []] }, counts = [{ Goblin: 1, Audacious: 1, Devastator: 1 }, { Goblin: 1 }];
R3.traitCounts(b, counts); assert.deepStrictEqual(counts[0], { Goblin: 2, Audacious: 2, Devastator: 2 }); assert.deepStrictEqual(counts[1], { Goblin: 1 });
assert.strictEqual(R3.protectorRange({ relics: [['aegis'], []] }, 0), 140); assert.strictEqual(R3.protectorRange({ relics: [[], []] }, 0), 90);
assert.strictEqual(R3.auraScale({ relics: [['amplifier'], []] }, 0), 1.4);
// 4. Espelho dos viajantes: recrutar dá upgrade (não cópia); Espada adormecida progressiva; Ídolo profano adiciona Exaustão
s = G.fresh('vanguard', 4); s.artifacts.push('travelers_mirror'); const n0 = s.cards.length; const c = C.recruitCard(s, 'warrior', 0); assert.strictEqual(s.cards.length, n0 + 1); assert.strictEqual(c.level, 1);
s = G.fresh('vanguard', 5); const card = s.cards[0], atk0 = G.stats(card, s).atk; s.artifacts.push('dormant_sword'); C.state(s).sword = 0; const atk1 = G.stats(card, s).atk; C.state(s).sword = 4; const atk4 = G.stats(card, s).atk; C.state(s).sword = 9;
{ const sw = n => 1 + Math.min(RT.swordCap, RT.swordBase + n * RT.swordStep); /* valores da tabela (calibração 09/11) */ assert(Math.abs(atk1 / atk0 - sw(0)) < 1e-6 && Math.abs(atk4 / atk0 - sw(4)) < 1e-6 && Math.abs(G.stats(card, s).atk / atk0 - sw(9)) < 1e-6 && RT.swordCap < RT.swordBase + 9 * RT.swordStep, 'Espada: inicial + por elite, até o teto'); }
s = G.fresh('vanguard', 6); s.artifacts.push('profane_idol'); const curses0 = s.cards.filter(C.isCurse).length; assert(G.commitBag(s, G.packBag(s.artifacts, s))); assert.strictEqual(s.cards.filter(C.isCurse).length, curses0 + 1); assert(G.commitBag(s, G.packBag(s.artifacts, s))); assert.strictEqual(s.cards.filter(C.isCurse).length, curses0 + 1, 'só uma vez');
// 5. Moeda do mercador: desconto da tabela (calibração 09/11: 50%) e 1ª renovação grátis por loja
assert(RT.merchant > 0 && RT.merchant < 1); /* valor na tabela (Carlos 10/11) */

// Only relics equipped by the defeated enemy can be discovered.
P.load(P.freshProfile()); P.completeTutorial();
s = G.fresh('vanguard', 17);
s.current = { id: 'cp4-deck-reward', type: 'battle' };
const deck = G.DECKS.find(d => d.id === 'vanguard');
const deckCards = deck.ids.map(type=>({type}));
P.profile.catalogCards.push(...deck.ids);
const orderRelics = ['horde', 'dawn'];
assert(orderRelics.every(id => !G.unownedRelics(s).includes(id)));
const normalRelics = R3.NEW.map(([id]) => id).filter(id => !orderRelics.includes(id));
P.profile.catalogRelics.push(...normalRelics);
assert.equal(P.eliteReward(s, { deckId: deck.id, cards: deckCards, artifacts: orderRelics }, () => 0).kind, 'gold');
P.profile.catalogRelics.push(...orderRelics);
P.profile.diamonds = 500;
assert(!P.buy('relic', 'horde'), 'previously discovered relic remains gated until its deck unlocks');
P.profile.catalogRelics = P.profile.catalogRelics.filter(id => ![...normalRelics, ...orderRelics].includes(id));
C.init(s, 'cofre');
s.phase = 'event';
s.offers.content.relics = [...orderRelics, 'aegis'];
assert.deepEqual(C.pickList(s, 'rewardRelic'), ['aegis'], 'stale event offers respect the gate');
assert(!G.receiveRelic(s, 'horde'));
P.unlockBlackfang();
assert(G.unownedRelics(s).includes('horde'));
assert(!G.unownedRelics(s).includes('dawn'));
P.unlockDawncrest();
assert(G.unownedRelics(s).includes('dawn'));
for (const [id] of R3.NEW) {
  const reward = P.eliteReward(s, { deckId: deck.id, cards: deckCards, artifacts: [id] }, () => 0);
  assert.deepEqual(reward, { kind: 'relic', id });
  assert(P.profile.catalogRelics.includes(id));
  assert(!P.profile.relics[id], 'discovery unlocks purchase, not ownership');
  P.profile.diamonds = 500;
  assert(P.buy('relic', id));
}
assert.equal(P.MILESTONES.find(m => m.id === 'collection_relics').goal, 43);
assert.match(A.find(a => a.id === 'recovery').descPT, /4,5%/);
assert.equal(G.stats({ type: 'warrior', level: 0 }, { artifacts: ['recovery'] }).pulseHeal, .045);
// Equip every relic in a real encounter and step the engine, including initialization and skills.
for (const relic of A) {
  s = G.fresh('vanguard', 123);
  assert(G.enter(s, G.available(s)[0].id));
  s.artifacts = [relic.id]; s.bag = null; s.reserve = [];
  G.ensureBag(s); s.energy = 100;
  for (const [i, uid] of s.hand.slice(0, 2).entries()) G.deploy(s, uid, i + 10, 'board');
  const battle = G.createBattle(s);
  assert(battle?.relics[0].includes(relic.id), relic.id);
  for (let step = 0; step < 1800 && !battle.result; step++) G.step(battle, 1 / 60);
  assert(battle.units.every(u => Number.isFinite(u.hp)), relic.id);
}
console.log('PASS CP4: 43 relics, all formats, actual battles and new relic discoveries/purchases');

s = G.fresh('vanguard', 4);
s.current = { id: 'cp4-shop', type: 'shop' }; s.phase = 'shop'; s.gold = 0;
s.artifacts = ['merchant']; s.offers = { cards: [null, 'warrior', 'lancer', 'bastion'], artifacts: ['heart'] };
assert(G.freeMerchantRefresh(s));
assert(G.rerollOffers(s));
assert.equal(s.offers.cards[0], null);
assert.equal(s.gold, 0);
assert(!G.freeMerchantRefresh(s));
assert(!G.rerollOffers(s));

// Colossal Heart uses the same health bonus on both sides, and the AI opens with three cards.
{
  P.load(P.freshProfile());P.completeTutorial();
  const run=G.fresh('vanguard',57);
  G.enter(run,G.available(run)[0].id);
  const base=JSON.parse(JSON.stringify(run)),heart=JSON.parse(JSON.stringify(run));
  base.ai.artifacts=[];heart.ai.artifacts=['colossal_heart'];
  const card=base.ai.cards[0],roster=[card];
  assert(Math.abs(G.stats(card,heart,roster,true).hp/G.stats(card,base,roster,true).hp-(1+RT.colossal))<1e-9);
  const draw=heart.ai.draw.length;
  G.enemies(heart);
  assert.equal(heart.ai.draw.length,draw-3);
  G.enemies(base);
  assert.equal(base.ai.draw.length,draw-4);
}
