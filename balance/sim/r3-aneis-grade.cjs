/* Etapa 3: custo = base 8 x fator do tipo (básico 1, especial s, milestone m) x fator do anel (1, f2, f3, f4).
 * Busca combinações que dão ~30 nós na run 13 da escada e árvore completa nas runs 26-30, com o nó mais caro <= teto. */
'use strict';
process.env.RINGS = '[]'; const out = []; const log = console.log; console.log = () => {};
const calc = require('./r3-ritmo-calc.cjs'); console.log = log;
const { career, BASE } = calc;
const ringOf = n => n.depth <= 1 ? 0 : n.depth <= 3 ? 1 : n.depth <= 5 ? 2 : 3;
const CAP = Number(process.argv[2] || 54);
const res = [];
for (const s of [1.5, 2]) for (const m of [1.5, 2, 2.5, 3]) for (const f2 of [1.5, 2, 2.5, 3]) for (const f3 of [2, 2.5, 3, 3.5, 4, 4.5, 5]) for (const f4 of [3, 3.5, 4, 4.5, 5, 5.5, 6, 7]) {
  if (!(f2 < f3 && f3 < f4)) continue;
  const tf = { basic: 1, special: s, milestone: m }, F = [1, f2, f3, f4];
  const cost = n => Math.round(8 * tf[n.type] * F[ringOf(n)]);
  const R = { ...BASE, cost }; const c = career(R);
  global.window = global; const D = global.JourneyTreeData; const mx = Math.max(...D.nodes.filter(n => n.id !== 'origin').map(cost));
  if (mx > CAP) continue;
  const n13 = c.out[12]; if (n13 < 28 || n13 > 33 || c.full < 26 || c.full > 31) continue;
  res.push({ s, m, F: F.join('/'), n: [1, 2, 5, 9, 13].map(r => c.out[r - 1]).join('/'), full: c.full, total: c.total, mx });
}
res.sort((a, b) => a.full - b.full); for (const r of res) console.log(JSON.stringify(r));
console.log(res.length, 'combinações');
