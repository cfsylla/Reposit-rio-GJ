/* Etapa 3: básico, especial e milestone com fatores diferentes (Carlos 08/11). custo = 8 x tipo x anel. */
'use strict';
const log = console.log; console.log = () => {}; const { career, BASE } = require('./r3-ritmo-calc.cjs'); console.log = log;
const D = global.JourneyTreeData, ringOf = n => n.depth <= 1 ? 0 : n.depth <= 3 ? 1 : n.depth <= 5 ? 2 : 3;
const res = [];
for (const s of [1.25, 1.5]) for (const m of [1.75, 2, 2.5]) for (const f2 of [2, 2.5, 3]) for (const f3 of [3, 3.5, 4]) for (const f4 of [3.5, 4, 4.5, 5]) {
  if (!(f2 < f3 && f3 < f4)) continue;
  const tf = { basic: 1, special: s, milestone: m }, F = [1, f2, f3, f4], cost = n => Math.round(8 * tf[n.type] * F[ringOf(n)]);
  const c = career({ ...BASE, cost }), mx = Math.max(...D.nodes.filter(n => n.id !== 'origin').map(cost));
  if (c.out[12] < 28 || c.out[12] > 33 || c.full < 25 || c.full > 30) continue;
  const tab = [1, 2, 3].map(i => `A${i + 1} ${Math.round(8 * F[i])}/${Math.round(8 * s * F[i])}/${i > 1 || true ? Math.round(8 * m * F[i]) : '-'}`).join(' ');
  res.push({ k: `tipo 1/${s}/${m} anéis ${F.join('/')}`, tab, n: [1, 2, 5, 9, 13].map(r => c.out[r - 1]).join('/'), full: c.full, total: c.total, mx });
}
res.sort((a, b) => a.mx - b.mx || a.full - b.full); for (const r of res.slice(0, 25)) console.log(Object.values(r).join(' | '));
