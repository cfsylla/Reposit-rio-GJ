/* R3 etapa 4 (Carlos 08/11/2026): básicos dos anéis 1-2 x3 e força dos inimigos por barreira. Rodar: GJ_ROOT=game_r3 node game_r3/tests/escada-r3.cjs */
'use strict';
process.env.GJ_ROOT ||= require('path').join(__dirname, '..');
const assert = require('assert');
const { G, A, TreeData: D } = require('../../balance/sim/engine.cjs');
// 1. básicos: profundidade 0-3 valem x3; os outros como antes
assert.deepStrictEqual(D.by.pow_atk_1.effect, { atk: .03 }); assert.deepStrictEqual(D.by.vit_hp_3.effect, { hp: .09 }); assert.deepStrictEqual(D.by.def_armor_2.effect, { defense: .06 });
assert.deepStrictEqual(D.by.pow_atk_4.effect, { atk: .01 }, 'profundidade 6 sem mudança'); assert.deepStrictEqual(D.by.vit_hp_5.effect, { hp: .03 }, 'profundidade 4 sem mudança');
assert.strictEqual(D.by.pow_atk_1.ptDesc, '+3% ataque.'); assert.strictEqual(D.by.pow_crit_2.ptDesc, '+3 pontos percentuais de chance de crítico.');
// 2. força por barreira: ordem, entrada (2 primeiras lutas do mapa), boss (luta inteira); raids e lutas comuns sem mudança
const B = A.BARRIER; assert.deepStrictEqual(B.order, [1.122, 1.12, 1.2]); assert.deepStrictEqual(B.entrance, [1, 1.118, 1.24]); assert.deepStrictEqual(B.boss, [1.022, 1.071, 1.2]);
const s = G.fresh('vanguard', 7); A.ensure(s);
const at = (act, node, stage) => { s.journey.act = act; s.current = node; s.mapBattles = stage; s.journey.battleStart = 0; return +(A.power(s) / A.SPEC[act].power).toFixed(3); };
assert.strictEqual(at(1, { type: 'elite', campaign: 'blackfang' }, 4), 1.122);
assert.strictEqual(at(2, { type: 'battle' }, 1), 1.118); assert.strictEqual(at(2, { type: 'battle' }, 3), 1, 'depois da entrada');
assert.strictEqual(at(3, { type: 'elite', campaign: 'dawncrest' }, 5), 1.2); assert.strictEqual(at(3, { type: 'boss', campaign: 'ironbound' }, 9), 1.2);
assert.deepStrictEqual(B.raid, [1.3, 1.37, 1.46]); assert.deepStrictEqual(B.raidBoss, [1.04, 1.04, 1.04]); assert.strictEqual(at(2, { type: 'elite', campaign: 'monsters' }, 2), 1, 'raids usam o próprio ajuste (raid/raidBoss), não o power'); assert.strictEqual(at(1, { type: 'battle' }, 1), 1, 'entrada do mapa 1 sem mudança');
console.log('PASS escada-r3: básicos dos anéis 1-2 x3; força por barreira (ordem/entrada/boss) ; raids x1,30/1,37/1,46 e Titan como boss x1,04');
