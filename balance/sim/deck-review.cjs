/* Deck review: win rate and progress per deck from several JSONL directories (e.g. CP1 matrix seeds 1-20 + rev1 seeds 21-100).
 * Usage: node balance/sim/deck-review.cjs <decks.json> <prefix> <dir1> [dir2 ...]  -> markdown table sorted by win rate
 * 95% interval: Wilson score. Band = inside / above / below the target band given by --lo/--hi env (default 40%..50% of the mean). */
'use strict';
const fs = require('fs');
const [deckFile, prefix, ...dirs] = process.argv.slice(2);
const D = JSON.parse(fs.readFileSync(deckFile, 'utf8')).decks;
const wilson = (k, n, z = 1.96) => { const p = k / n, d = 1 + z * z / n, c = (p + z * z / (2 * n)) / d, h = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d; return [c - h, c + h]; };
const pct = x => Math.round(100 * x) + '%';
const rows = [], all = [];
for (const d of D) {
  const R = [];
  for (const dir of dirs) { const f = `${dir}/${prefix}_${d.id}.jsonl`; if (fs.existsSync(f)) R.push(...fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse)); }
  if (!R.length) continue; all.push(...R);
  const n = R.length, v = R.filter(r => r.result === 'victory').length, m1 = R.filter(r => r.wins >= 9 || r.result === 'victory').length, m2 = R.filter(r => r.wins >= 18 || r.result === 'victory').length;
  const first20 = R.filter(r => r.seed <= 20), v20 = first20.filter(r => r.result === 'victory').length;
  const death = {}; for (const r of R.filter(r => r.deathAt)) { const k = 'M' + r.deathAt.act + ' ' + r.deathAt.type; death[k] = (death[k] || 0) + 1; }
  rows.push({ id: d.id, name: d.name, order: d.order, n, v, wr: v / n, ci: wilson(v, n), m1: m1 / n, m2: m2 / n, wr20: first20.length ? v20 / first20.length : null, death });
}
rows.sort((x, y) => y.wr - x.wr);
const mean = all.filter(r => r.result === 'victory').length / all.length;
console.log(`Runs: ${all.length}. Média de vitória: ${pct(mean)}.\n`);
console.log('| Deck | n | Passa M1 | Passa M2 | Vence | IC 95% | Seeds 1-20 (CP1) | Onde morre (top 2) |');
console.log('|---|---|---|---|---|---|---|---|');
for (const r of rows) {
  const top = Object.entries(r.death).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k, c]) => `${k} ${pct(c / r.n)}`).join(', ');
  console.log(`| ${r.name}${r.order ? ' (' + r.order + ')' : ''} | ${r.n} | ${pct(r.m1)} | ${pct(r.m2)} | **${pct(r.wr)}** | ${pct(r.ci[0])}–${pct(r.ci[1])} | ${r.wr20 === null ? '—' : pct(r.wr20)} | ${top} |`);
}
if (process.env.JSON_OUT) fs.writeFileSync(process.env.JSON_OUT, JSON.stringify({ mean, rows }, null, 1));
