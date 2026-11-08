/* Etapa 3: anel 2 com degrau (Carlos 08/11): os primeiros nós do anel 2 (profundidade 2, 10 básicos) mais baratos. */
'use strict';
const log = console.log; console.log = () => {}; const { career, BASE } = require('./r3-ritmo-calc.cjs'); console.log = log;
const D = global.JourneyTreeData, ringOf = n => n.depth <= 1 ? 0 : n.depth <= 3 ? 1 : n.depth <= 5 ? 2 : 3;
const V = [
  ['Recomendada anterior (anel 2 todo a 24)', 24, [1, 3, 3.5, 4]],
  ['Profundidade 2 a 16, resto igual', 16, [1, 3, 3.5, 4]],
  ['Profundidade 2 a 16, anel 3 x4, anel 4 x4,5', 16, [1, 3, 4, 4.5]],
  ['Profundidade 2 a 16, anel 3 x3,75, anel 4 x4', 16, [1, 3, 3.75, 4]],
];
for (const [k, p2, F] of V) {
  const tf = { basic: 1, special: 1.5, milestone: 1.75 };
  const cost = n => n.depth === 2 && n.type === 'basic' ? p2 : Math.round(8 * tf[n.type] * F[ringOf(n)]);
  const c = career({ ...BASE, cost }), runOf = x => c.out.findIndex(v => v >= x) + 1;
  const tab = [1, 2, 3].map(i => Math.round(8 * F[i]) + '/' + Math.round(12 * F[i]) + (i > 1 ? '/' + Math.round(14 * F[i]) : '')).join('  ');
  console.log(k.padEnd(46), '| anéis 2-4:', tab, '| nós runs 1-15:', c.out.slice(0, 15).join(' '), '| fecha anel 1/2/3:', [10, 30, 50].map(runOf).join('/'), '| completa', c.full, '| total', c.total, '| máx', Math.max(...D.nodes.filter(n => n.id !== 'origin').map(cost)));
}
