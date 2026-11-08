/* Etapa 3 (ritmo da árvore): calculadora analítica, sem simulação de luta.
 * Escada de barreiras do Carlos -> XP de cada run -> nós acumulados (compra os mais baratos primeiro).
 * Contagem média de lutas por mapa medida no simulador (etapa2_regua, m1.6): mapa 1 = 5,35 lutas + 2,65 especiais + boss,
 * mapa 2 = 5,9 + 2,1 + boss, mapa 3 = 6,3 + 1,6 + boss. */
'use strict';
global.window = global; global.self = global; require('../../game_r3/dist/tree-data.js');
const D = global.JourneyTreeData;
const L = { 1: [5.35, 2.65], 2: [5.9, 2.1], 3: [6.3, 1.6] };
function xpRun(end, R) { // end: [mapa, fase] fase: 'meio' (até a 6ª luta), 'boss' (perde no boss), 'entrada' (perde a 1ª luta), 'vitoria', 'vitoriaTB'
  const [m, f] = end; let xp = 0;
  const full = a => (L[a][0] * R.w.battle + L[a][1] * R.w.special + R.w.boss) * R.mult[a - 1];
  for (let a = 1; a < m; a++) xp += full(a);
  if (f === 'meio') xp += (4 * R.w.battle + 2 * R.w.special) * R.mult[m - 1];
  if (f === 'boss') xp += (L[m][0] * R.w.battle + L[m][1] * R.w.special) * R.mult[m - 1];
  if (f === 'vitoria' || f === 'vitoriaTB') xp += full(m);
  if (f === 'vitoriaTB') xp += R.w.trueBoss * R.mult[2];
  return xp * (R.scale || 1);
}
const LADDER = [[1, 'meio'], [1, 'boss'], [2, 'entrada'], [2, 'meio'], [2, 'boss'], [3, 'entrada'], [3, 'meio'], [3, 'meio'], [3, 'boss'], [3, 'boss'], [3, 'boss'], [3, 'boss'], [3, 'vitoria'], [3, 'vitoria'], [3, 'vitoriaTB']];
function costs(R) { return D.nodes.filter(n => n.id !== 'origin').map(n => R.cost ? R.cost(n) : n.cost).sort((a, b) => a - b); }
function career(R, runs = 60) {
  const cs = costs(R); let xp = 0, nodes = 0, out = [], full = null;
  for (let r = 1; r <= runs; r++) {
    const end = LADDER[r - 1] || [3, 'vitoriaTB'];
    xp += xpRun(end, R); while (nodes < cs.length && xp >= cs[nodes]) xp -= cs[nodes++];
    out.push(nodes); if (nodes === cs.length && !full) full = r;
  }
  return { out, full, total: cs.reduce((a, b) => a + b, 0), run1: xpRun([1, 'meio'], R), outlier: xpRun([3, 'boss'], R) };
}
const BASE = { w: { battle: 1, special: 2, boss: 4, trueBoss: 6 }, mult: [1, 2, 3] };
const OPT = {
  'Atual (CP3)': BASE,
  'A: multiplicador 1/1,5/2': { ...BASE, mult: [1, 1.5, 2] },
  'B: custos fora do 1º/2º anel x2': { ...BASE, cost: n => n.depth <= 1 ? n.cost : n.cost * 2 },
  'C: A + B': { ...BASE, mult: [1, 1.5, 2], cost: n => n.depth <= 1 ? n.cost : n.cost * 2 },
  "B': custos fora dos 10 primeiros x1,75": { ...BASE, cost: n => n.depth <= 1 ? n.cost : Math.round(n.cost * 1.75) },
  'B2: x2, milestones mantidos 48/54': { ...BASE, cost: n => n.depth <= 1 || n.type === 'milestone' ? n.cost : n.cost * 2 },
  'B3: x2 com teto 54': { ...BASE, cost: n => n.depth <= 1 ? n.cost : Math.min(54, n.cost * 2) },
  'D: XP x0,5 (exceto mapa 1)': { ...BASE, mult: [1, 1, 1.5] },
};
for (const [k, R] of Object.entries(OPT)) {
  const c = career(R);
  console.log(k.padEnd(34), 'nós após run 1-15:', c.out.slice(0, 15).join(' '), '| run 20/25/30:', [20, 25, 30].map(r => c.out[r - 1]).join('/'), '| árvore completa na run', c.full, '| custo total', c.total, '| XP run 1', c.run1, '| run longa fora da curva (cai no boss 3)', Math.round(c.outlier));
}
