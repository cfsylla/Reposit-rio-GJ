/* Tables for traitlab output. Usage: node balance/sim/traitlab-report.cjs trait.jsonl [unit.jsonl lab1.jsonl] */
'use strict';
const fs = require('node:fs');
const read = f => fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
const [tf, uf, lf] = process.argv.slice(2);
const pct = x => (x >= 1 ? '+' : '') + ((x - 1) * 100).toFixed(1) + '%';
if (tf) {
  const rows = read(tf), by = {};
  for (const r of rows) ((by[r.trait] ??= { cat: r.category, n: r.nMembers, t: {} }).t[r.tier] ??= []).push(r);
  const avg = v => Math.exp(v.reduce((n, r) => n + Math.log(r.gain), 0) / v.length);
  const list = Object.entries(by).map(([id, v]) => ({ id, ...v, g1: v.t[1] ? avg(v.t[1]) : null, g2: v.t[2] ? avg(v.t[2]) : null,
    min2: v.t[2] ? Math.min(...v.t[2].map(r => r.gain)) : null, max2: v.t[2] ? Math.max(...v.t[2].map(r => r.gain)) : null }));
  for (const cat of ['faction', 'attribute', 'temperament']) {
    console.log(`\n### ${{ faction: 'Facções', attribute: 'Atributos', temperament: 'Temperamentos' }[cat]}\n`);
    console.log('| Trait | Personagens com o trait | Ganho com 2 | Ganho com 4 (Orc/Centaur: 3) | Variação no patamar maior (pior–melhor combinação) |');
    console.log('|---|---|---|---|---|');
    for (const t of list.filter(t => t.cat === cat).sort((a, b) => (b.g2 ?? b.g1) - (a.g2 ?? a.g1)))
      console.log(`| ${t.id} | ${t.n} | ${t.g1 ? pct(t.g1) : '-'} | ${t.g2 ? pct(t.g2) : '-'} | ${t.min2 ? pct(t.min2) + ' a ' + pct(t.max2) : '-'} |`);
  }
}
if (uf && lf) {
  const u = read(uf), l = read(lf).filter(r => r.level === '0'), by = {};
  for (const r of u) (by[r.id] ??= []).push(r.index);
  const list = Object.entries(by).map(([id, v]) => ({ id, faction: u.find(r => r.id === id).faction, cost: u.find(r => r.id === id).cost, team: Math.exp(v.reduce((n, x) => n + Math.log(x), 0) / v.length), solo: l.find(r => r.id === id)?.index }));
  list.sort((a, b) => b.team - a.team);
  console.log('\n### Personagens dentro do time da própria facção\n');
  console.log('| # | Personagem | Facção | Custo | Índice sozinho (etapa 1) | Índice no time da facção | Diferença |');
  console.log('|---|---|---|---|---|---|---|');
  list.forEach((t, i) => console.log(`| ${i + 1} | \`${t.id}\` | ${t.faction} | ${t.cost} | ${t.solo?.toFixed(2) ?? '-'} | ${t.team.toFixed(2)} | ${t.solo ? (t.team - t.solo >= 0 ? '+' : '') + (t.team - t.solo).toFixed(2) : '-'} |`));
}
