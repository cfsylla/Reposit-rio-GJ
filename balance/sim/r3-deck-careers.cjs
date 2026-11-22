/* Etapa 5: 1ª vitória por deck nas carreiras (mediana das carreiras de cada deck). Uso: node r3-deck-careers.cjs <dir> */
'use strict';
const fs = require('fs'), path = require('path'), dir = process.argv[2], C = {};
for (const f of fs.readdirSync(dir).filter(f => /^car_.*\.jsonl$/.test(f))) { const R = fs.readFileSync(path.join(dir, f), 'utf8').split('\n').filter(Boolean).map(JSON.parse); if (R.length) (C[R[0].deck] ??= []).push(R); }
const med = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor((s.length - 1) / 2)]; };
const rows = [], all = [];
for (const [d, cs] of Object.entries(C)) { const fw = cs.map(c => (c.find(r => r.result === 'victory') || {}).run || 99), n = cs.map(c => (c.find(r => r.result === 'victory') || {}).nodesBefore ?? 99); all.push(...fw); rows.push([d, med(fw), fw.sort((a, b) => a - b).join(', '), med(n)]); }
rows.sort((a, b) => a[1] - b[1]);
console.log('| Deck | 1ª vitória (mediana) | carreiras | nós na 1ª vitória |\n|---|---|---|---|\n' + rows.map(r => `| ${r[0]} | ${r[1] === 99 ? '>40' : r[1]} | ${r[2]} | ${r[3]} |`).join('\n'));
console.log(`\nTodos: mediana ${med(all)} | p10 ${[...all].sort((a, b) => a - b)[Math.floor(.1 * all.length)]} | p90 ${[...all].sort((a, b) => a - b)[Math.floor(.9 * all.length)]} | decks com mediana fora de 10-20: ${rows.filter(r => r[1] < 10 || r[1] > 20).map(r => r[0] + ' ' + r[1]).join(', ')}`);
