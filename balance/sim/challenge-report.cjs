/* Challenge cost report: win rate with each challenge alone vs. no challenge (same decks and seeds, tree cap300).
 * Usage: node balance/sim/challenge-report.cjs <dir> -> markdown sorted by cost (target: each challenge costs 4-7 win points). */
'use strict';
const fs = require('fs'), dir = process.argv[2];
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsonl'));
const by = {};
for (const f of files) { const c = f.split('_')[0]; for (const l of fs.readFileSync(dir + '/' + f, 'utf8').trim().split('\n').filter(Boolean)) { const r = JSON.parse(l); (by[c] ??= []).push(r); } }
const wr = R => R.filter(r => r.result === 'victory').length / R.length, m2 = R => R.filter(r => r.wins >= 18 || r.result === 'victory').length / R.length;
const base = by.none, b = wr(base); const pct = x => Math.round(100 * x) + '%';
console.log(`Base (sem desafio): ${pct(b)} de vitória em ${base.length} runs.\n`);
console.log('| Desafio | Runs | Passa M2 | Vence | Custo (pontos de vitória) | Situação (meta 4–7) |\n|---|---|---|---|---|---|');
const rows = Object.entries(by).filter(([c]) => c !== 'none').map(([c, R]) => ({ c, n: R.length, m2: m2(R), w: wr(R), cost: 100 * (b - wr(R)) })).sort((x, y) => y.cost - x.cost);
for (const r of rows) console.log(`| ${r.c} | ${r.n} | ${pct(r.m2)} | ${pct(r.w)} | **${r.cost.toFixed(0)}** | ${r.cost > 7 ? 'forte demais' : r.cost < 4 ? 'fraco' : 'ok'} |`);
