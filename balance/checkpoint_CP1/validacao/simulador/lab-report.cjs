/* Tables from lab JSONL. Usage: node balance/sim/lab-report.cjs balance/out/lab1/all.jsonl */
'use strict';
const fs = require('node:fs');
const { G } = require('./engine.cjs');
const rows = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n').map(JSON.parse);
const R = ['Comum', 'Incomum', 'Rara', 'UltraR'];
const get = (id, lv) => rows.find(r => r.id === id && r.level === lv);
const ids = [...new Set(rows.map(r => r.id))];
const fmt = x => x.toFixed(2);
const table = ids.map(id => {
  const r0 = get(id, '0'), r2 = get(id, '2'), rf = get(id, 'F'), u = G.BY[id];
  const p = r0.per, best = Object.entries(p).sort((a, b) => b[1].index - a[1].index)[0], worst = Object.entries(p).sort((a, b) => a[1].index - b[1].index)[0];
  return { id, name: u.name, cost: u.cost, rarity: R[u.rarity], faction: u.traits[0], i0: r0.index, i2: r2?.index, iF: rf?.index, best: best[0], worst: worst[0],
    spread: best[1].index - worst[1].index, dealt: Object.values(p).reduce((n, v) => n + v.dealt, 0) / 6, lived: Object.values(p).reduce((n, v) => n + v.lived / v.time, 0) / 6,
    casts: Object.values(p).reduce((n, v) => n + v.casts, 0) / 6, first: Object.values(p).filter(v => v.firstCast !== null).map(v => v.firstCast) };
});
table.sort((a, b) => b.i0 - a.i0);
console.log('| # | Personagem | Custo | Raridade | Facção | Índice L0 | Índice L2 | Índice fundido | Melhor contra | Pior contra | Dano médio | % do tempo vivo | Especiais/luta |');
console.log('|---|---|---|---|---|---|---|---|---|---|---|---|---|');
table.forEach((t, i) => console.log(`| ${i + 1} | ${t.name} (\`${t.id}\`) | ${t.cost} | ${t.rarity} | ${t.faction} | ${fmt(t.i0)} | ${t.i2 ? fmt(t.i2) : '-'} | ${t.iF ? fmt(t.iF) : '-'} | ${t.best} | ${t.worst} | ${t.dealt.toFixed(0)} | ${(100 * t.lived).toFixed(0)}% | ${t.casts.toFixed(1)} |`));
console.log('\nPor custo (média do índice L0 / L2 / fundido):');
for (const c of [2, 3, 4]) { const v = table.filter(t => t.cost === c), m = k => v.reduce((n, t) => n + t[k], 0) / v.length; console.log(`custo ${c}: n=${v.length} L0 ${fmt(m('i0'))} L2 ${fmt(m('i2'))} F ${fmt(m('iF'))} | min ${fmt(Math.min(...v.map(t => t.i0)))} max ${fmt(Math.max(...v.map(t => t.i0)))}`); }
console.log('\nPor facção (média índice L0, custo médio):');
const fac = {}; for (const t of table) (fac[t.faction] ??= []).push(t);
for (const [f, v] of Object.entries(fac).sort((a, b) => b[1].reduce((n, t) => n + t.i0, 0) / b[1].length - a[1].reduce((n, t) => n + t.i0, 0) / a[1].length))
  console.log(`${f.padEnd(20)} n=${v.length} índice ${fmt(v.reduce((n, t) => n + t.i0, 0) / v.length)} custo ${(v.reduce((n, t) => n + t.cost, 0) / v.length).toFixed(1)} | ${v.map(t => t.id + ' ' + fmt(t.i0)).join(', ')}`);
console.log('\nGanho de upgrade (L2/L0) e fusão (F/L0):');
const g2 = table.map(t => t.i2 / t.i0), gF = table.map(t => t.iF / t.i0);
console.log('L2/L0 média', fmt(g2.reduce((a, b) => a + b) / g2.length), 'F/L0 média', fmt(gF.reduce((a, b) => a + b) / gF.length));
console.log('Maior ganho com fusão:', [...table].sort((a, b) => b.iF / b.i0 - a.iF / a.i0).slice(0, 8).map(t => t.id + ' ×' + fmt(t.iF / t.i0)).join(', '));
console.log('Menor ganho com fusão:', [...table].sort((a, b) => a.iF / a.i0 - b.iF / b.i0).slice(0, 8).map(t => t.id + ' ×' + fmt(t.iF / t.i0)).join(', '));
console.log('\nMais situacionais (diferença entre melhor e pior adversário):', [...table].sort((a, b) => b.spread - a.spread).slice(0, 10).map(t => `${t.id} ${fmt(t.spread)} (${t.best}>${t.worst})`).join(', '));
