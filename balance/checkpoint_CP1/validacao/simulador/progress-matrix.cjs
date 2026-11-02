/* Deck x progress matrix: % of runs still alive after each checkpoint (fights won along the path).
 * Usage: node balance/sim/progress-matrix.cjs <dir> <prefix> <decks.json> -> markdown table */
'use strict';
const fs = require('fs'); const [dir, prefix, deckFile] = process.argv.slice(2);
const D = JSON.parse(fs.readFileSync(deckFile, 'utf8')).decks;
const CP = [[3, 'M1 3ª luta'], [6, 'M1 6ª'], [9, 'M1 boss'], [12, 'M2 3ª'], [15, 'M2 6ª'], [18, 'M2 boss'], [21, 'M3 3ª'], [24, 'M3 6ª'], [27, 'M3 boss = vitória']];
const pct = x => Math.round(100 * x) + '%';
console.log('| Deck | ' + CP.map(c => c[1]).join(' | ') + ' |'); console.log('|---|' + CP.map(() => '---').join('|') + '|');
const all = [];
for (const d of D) {
  const f = `${dir}/${prefix}_${d.id}.jsonl`; if (!fs.existsSync(f)) continue;
  const R = fs.readFileSync(f, 'utf8').trim().split('\n').map(JSON.parse); all.push(...R);
  console.log(`| ${d.name}${d.order ? ' (' + d.order + ')' : ''} | ` + CP.map(([k]) => pct(R.filter(r => r.wins >= k || r.result === 'victory').length / R.length)).join(' | ') + ' |');
}
console.log('| **Média** | ' + CP.map(([k]) => '**' + pct(all.filter(r => r.wins >= k || r.result === 'victory').length / all.length) + '**').join(' | ') + ' |');
