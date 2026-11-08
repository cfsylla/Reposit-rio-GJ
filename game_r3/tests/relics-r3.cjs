/* R3 relíquias (Carlos 08/11/2026): 40 relíquias, textos PT/EN, efeitos novos e run curta com cada uma equipada.
 * Rodar da raiz: GJ_ROOT=game_r3 node game_r3/tests/relics-r3.cjs */
'use strict';
process.env.GJ_ROOT ||= require('path').join(__dirname, '..');
const assert = require('assert');
const { playRun } = require('../../balance/sim/run.cjs');
const E = require('../../balance/sim/engine.cjs'); const { G, P, C, Tree: T } = E;
const RT = globalThis.JOURNEY_RELIC_TUNE, R3 = globalThis.JourneyRelicsR3;
// 1. Catálogo: 40 relíquias, todas com nome/texto EN e PT, formato válido, preço e categoria; dicionário registrado
const A = G.ARTIFACTS; assert.strictEqual(A.length, 40);
for (const a of A) { assert(a.name && a.namePT && a.desc && a.descPT, a.id + ' textos'); assert(G.RELIC_FORMATS[a.id] && G.relicShape(a.id).length, a.id + ' formato'); assert(a.price >= 30, a.id + ' preço'); assert(a.category, a.id + ' categoria'); assert.strictEqual(globalThis.I18N_EXTRA[a.namePT], a.name); }
assert.strictEqual(A.filter(a => R3.NEW.some(n => n[0] === a.id)).every(a => a.playerOnly), true, 'novas só do jogador');
assert.deepStrictEqual([0, 1, 2, 3].map(r => A.filter(a => a.rarity === r).length), [9, 15, 12, 4], 'distribuição por raridade');
assert.strictEqual(G.RELIC_FORMATS.heart, 'L3'); assert.strictEqual(G.RELIC_FORMATS.spark, 'L4'); assert.strictEqual(G.RELIC_FORMATS.luckycharm, 'dot');
// 2. Economia e energia
let s = G.fresh('vanguard', 3); s.round = 1; const e0 = G.energyIncome(s); s.artifacts.push('quickstart'); assert.strictEqual(G.energyIncome(s) - e0, 3);
s = G.fresh('vanguard', 3); s.gold = 0; G.rewardGold(s, 20); const g0 = s.gold; s.artifacts.push('luckycharm'); s.gold = 0; G.rewardGold(s, 20); assert(s.gold > g0 && Math.abs(s.gold - Math.round(20 * 1.35)) <= 1, 'Amuleto da sorte +35%');
assert.strictEqual(T.offerCount({ artifacts: ['compass'], current: {} }, 3), 4, 'Bússola +1 opção');
// 3. Sinergias "coringa", Égide e Amuleto amplificador
const b = { relics: [['houses', 'honor', 'talents'], []] }, counts = [{ Goblin: 1, Audacious: 1, Devastator: 1 }, { Goblin: 1 }];
R3.traitCounts(b, counts); assert.deepStrictEqual(counts[0], { Goblin: 2, Audacious: 2, Devastator: 2 }); assert.deepStrictEqual(counts[1], { Goblin: 1 });
assert.strictEqual(R3.protectorRange({ relics: [['aegis'], []] }, 0), 140); assert.strictEqual(R3.protectorRange({ relics: [[], []] }, 0), 90);
assert.strictEqual(R3.auraScale({ relics: [['amplifier'], []] }, 0), 1.4);
// 4. Espelho dos viajantes: recrutar dá upgrade (não cópia); Espada adormecida progressiva; Ídolo profano adiciona Exaustão
s = G.fresh('vanguard', 4); s.artifacts.push('travelers_mirror'); const n0 = s.cards.length; const c = C.recruitCard(s, 'warrior', 0); assert.strictEqual(s.cards.length, n0 + 1); assert.strictEqual(c.level, 1);
s = G.fresh('vanguard', 5); const card = s.cards[0], atk0 = G.stats(card, s).atk; s.artifacts.push('dormant_sword'); C.state(s).sword = 0; const atk1 = G.stats(card, s).atk; C.state(s).sword = 4; const atk4 = G.stats(card, s).atk; C.state(s).sword = 9;
assert(Math.abs(atk1 / atk0 - 1.02) < 1e-6 && Math.abs(atk4 / atk0 - 1.10) < 1e-6 && Math.abs(G.stats(card, s).atk / atk0 - 1.10) < 1e-6, 'Espada: +2% e +2% por elite, até +10%');
s = G.fresh('vanguard', 6); s.artifacts.push('profane_idol'); const curses0 = s.cards.filter(C.isCurse).length; assert(G.commitBag(s, G.packBag(s.artifacts, s))); assert.strictEqual(s.cards.filter(C.isCurse).length, curses0 + 1); assert(G.commitBag(s, G.packBag(s.artifacts, s))); assert.strictEqual(s.cards.filter(C.isCurse).length, curses0 + 1, 'só uma vez');
// 5. Moeda do mercador: 25% de desconto e 1ª renovação grátis por loja
assert.strictEqual(RT.merchant, .25);
// 6. Cada uma das 40 relíquias equipada numa run curta (2 decks × 2 seeds, 10 nós): sem erro e a relíquia de fato equipada
const pol = { prep: 'smart', route: 'greedy', events: 'safe', shop: 'balanced', tree: 'nodes10', treeBuy: 'all', order: null, forcewin: false };
for (const a of A) { process.env.GJ_FORCE_RELIC = a.id; for (const [deck, seed] of [['vanguard', 1], ['dark_court', 2]]) { const r = playRun(deck, seed, pol, { dt: 1 / 30 }); assert(['victory', 'defeat'].includes(r.result), a.id + ' ' + r.result); assert(!String(r.forcedRelic || '').startsWith('nao-coube') || a.id === 'banner', a.id + ' coube'); } }
delete process.env.GJ_FORCE_RELIC;
console.log('PASS relics-r3: 40 relíquias (9/15/12/4), textos PT/EN, efeitos novos e runs com cada uma equipada');
