/* R3 etapa 3 (Carlos 08/11/2026): custo por anel x tipo. */
'use strict';
const assert = require('assert');
global.window = global; global.self = global; require('../dist/tree-data.js');
const D = global.JourneyTreeData, N = D.nodes.filter(n => n.id !== 'origin');
const ring = n => n.depth <= 1 ? 1 : n.depth <= 3 ? 2 : n.depth <= 5 ? 3 : 4;
const expect = n => ring(n) === 1 ? 8 : n.depth === 2 && n.type === 'basic' ? 16 : Math.round(8 * { basic: 1, special: 1.5, milestone: 1.75 }[n.type] * { 2: 3, 3: 3.75, 4: 4 }[ring(n)]);
for (const n of N) assert.equal(n.cost, expect(n), n.id);
assert.equal(N.length, 60);
assert.equal(N.reduce((a, n) => a + n.cost, 0), 1754);
assert.equal(Math.max(...N.map(n => n.cost)), 56);
for (const r of [2, 3, 4]) { const b = N.filter(n => ring(n) === r && n.type === 'basic' && n.depth !== 2), s = N.filter(n => ring(n) === r && n.type !== 'basic'); for (const x of s) assert(x.cost > Math.max(...b.map(n => n.cost)), x.id + ' deve custar mais que o básico do anel'); }
console.log('PASS tree-rings-r3: 4 anéis (8 / 16-24-36 / 30-45-53 / 32-56), total 1754, máximo 56');
