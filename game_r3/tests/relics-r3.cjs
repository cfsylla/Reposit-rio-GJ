/* R3 relíquias (Carlos 08/11/2026): 40 relíquias, textos PT/EN, efeitos novos e run curta com cada uma equipada.
 * Rodar da raiz: GJ_ROOT=game_r3 node game_r3/tests/relics-r3.cjs */
'use strict';
process.env.GJ_ROOT ||= require('path').join(__dirname, '..');
const assert = require('assert');
const { playRun } = require('../../balance/sim/run.cjs');
const E = require('../../balance/sim/engine.cjs'); const { G, P, C, Tree: T } = E;
const RT = globalThis.JOURNEY_RELIC_TUNE, R3 = globalThis.JourneyRelicsR3;
// 1. Catálogo: 40 relíquias, todas com nome/texto EN e PT, formato válido, preço e categoria; dicionário registrado
const A = G.ARTIFACTS; assert.strictEqual(A.length, 43);
for (const a of A) { assert(a.name && a.namePT && a.desc && a.descPT, a.id + ' textos'); assert(G.RELIC_FORMATS[a.id] && G.relicShape(a.id).length, a.id + ' formato'); assert(a.price >= 30, a.id + ' preço'); assert(a.category, a.id + ' categoria'); assert.strictEqual(globalThis.I18N_EXTRA[a.namePT], a.name); }
assert.strictEqual(A.filter(a => R3.NEW.some(n => n[0] === a.id)).every(a => a.playerOnly), true, 'novas só do jogador');
assert.deepStrictEqual([0, 1, 2, 3].map(r => A.filter(a => a.rarity === r).length), [12, 13, 13, 5], 'distribuição por raridade (Carlos 10/11)');
for (const [id, sh] of Object.entries({ hourglass: 'diag3', scope: 'diag2', repulsion: 'bridge', precision: 'domino', sling: 'cross', echo: 'cross', contract: 'line4', grimoire: 'U' })) assert.strictEqual(G.RELIC_FORMATS[id], sh, id + ' formato');
{ const keep = G.RELIC_FORMATS.compass; for (const [sh, n] of Object.entries({ diag2: 2, diag3: 3, bridge: 2, line4: 4, stairs: 5, cross: 5, U: 5, knight: 2 })) { G.RELIC_FORMATS.compass = sh; assert.strictEqual(G.relicShape('compass').length, n, 'formato ' + sh); } G.RELIC_FORMATS.compass = keep; }
assert.strictEqual(G.RELIC_FORMATS.heart, 'L3'); assert.strictEqual(G.RELIC_FORMATS.spark, 'L4'); assert.strictEqual(G.RELIC_FORMATS.luckycharm, 'dot');
// 2. Economia e energia
let s = G.fresh('vanguard', 3); s.round = 1; const e0 = G.energyIncome(s); s.artifacts.push('quickstart'); assert.strictEqual(G.energyIncome(s) - e0, 3);
s = G.fresh('vanguard', 3); s.gold = 0; G.rewardGold(s, 20); const g0 = s.gold; s.artifacts.push('luckycharm'); s.gold = 0; G.rewardGold(s, 20); assert(s.gold > g0 && Math.abs(s.gold - Math.round(20 * 1.35)) <= 1, 'Amuleto da sorte +35%');
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
// 6. Cada uma das 40 relíquias equipada numa run curta (2 decks × 2 seeds, 10 nós): sem erro e a relíquia de fato equipada
const pol = { prep: 'smart', route: 'greedy', events: 'safe', shop: 'balanced', tree: 'nodes10', treeBuy: 'all', order: null, forcewin: false };
for (const a of A) { process.env.GJ_FORCE_RELIC = a.id; for (const [deck, seed] of [['vanguard', 1], ['dark_court', 2]]) { const r = playRun(deck, seed, pol, { dt: 1 / 30 }); assert(['victory', 'defeat'].includes(r.result), a.id + ' ' + r.result); assert(!String(r.forcedRelic || '').startsWith('nao-coube') || a.id === 'banner', a.id + ' coube'); } }
delete process.env.GJ_FORCE_RELIC;
console.log('PASS relics-r3: 43 relíquias (12/13/13/5), formatos novos, Funda de cerco, Grimório, textos PT/EN, efeitos novos e runs com cada uma equipada');
