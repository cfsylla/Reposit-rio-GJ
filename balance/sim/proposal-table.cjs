/* Markdown table for unit proposal P1 with concrete values. Usage: node balance/sim/proposal-table.cjs */
'use strict';
const fs = require('node:fs');
const { G } = require('./engine.cjs');
const rd = f => fs.readFileSync(f, 'utf8').trim().split('\n').map(JSON.parse);
const b = rd('balance/out/lab1/all.jsonl'), p = rd('balance/out/lab_p1b/all.jsonl'), tab = require('../out/proposal_p1_table.json');
const ov = require('../out/proposal_p1_units.json').units, R = ['Comum', 'Incomum', 'Rara', 'Ultra rara'];
const g = (rows, id, l) => rows.find(r => r.id === id && r.level === l)?.index;
const arrow = (a, c) => a === c ? String(a) : `**${a} → ${c}**`;
tab.sort((x, y) => (g(b, y.id, '0') - y.target) - (g(b, x.id, '0') - x.target));
console.log('| Personagem | Custo | Raridade | Vida | Ataque | Poder de habilidade | Outros | Índice antes → depois (alvo) | Upgrade máx. depois | Fundido depois |');
console.log('|---|---|---|---|---|---|---|---|---|---|');
for (const t of tab) {
  const u = G.BY[t.id], o = ov[t.id], m = o.hp || 1;
  const hp = Math.round(u.hp * m), atk = Math.round(u.atk * (o.atk || 1));
  const other = [o.area !== undefined ? `área do básico ${u.area} → ${o.area}` : ''].filter(Boolean).join('; ');
  console.log(`| ${u.name} (\`${t.id}\`) | ${arrow(u.cost, t.cost)} | ${arrow(R[u.rarity], R[t.rarity])} | ${arrow(u.hp, hp)} | ${arrow(u.atk, atk)} | ${o.skill ? '**×' + o.skill + '**' : '-'} | ${other || '-'} | ${g(b, t.id, '0').toFixed(2)} → ${g(p, t.id, '0').toFixed(2)} (${t.target.toFixed(2)}) | ${g(b, t.id, '2').toFixed(2)} → ${g(p, t.id, '2').toFixed(2)} | ${g(b, t.id, 'F').toFixed(2)} → ${g(p, t.id, 'F').toFixed(2)} |`);
}
