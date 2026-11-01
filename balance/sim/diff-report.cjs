/* Difficulty report by policy/tree: reach per map, death location, economy, level gap. Usage: node diff-report.cjs dir prefix1 [prefix2 ...] */
'use strict';
const fs = require('fs'); const [dir, ...prefixes] = process.argv.slice(2);
const pct = x => (100 * x).toFixed(0) + '%';
for (const pre of prefixes) {
  const R = fs.readdirSync(dir).filter(f => f.startsWith(pre) && f.endsWith('.jsonl')).flatMap(f => fs.readFileSync(dir + '/' + f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse));
  if (!R.length) continue; const n = R.length;
  const reach = k => R.filter(r => r.wins >= k).length / n;
  const d = {}; for (const r of R.filter(r => r.deathAt)) { const k = 'mapa ' + r.deathAt.act; d[k] = (d[k] || 0) + 1; }
  console.log(`${pre.padEnd(18)} runs ${n} | passa mapa1 ${pct(reach(9))} | passa mapa2 ${pct(reach(18))} | vence ${pct(R.filter(r => r.result === 'victory').length / n)} | lutas ${(R.reduce((a, r) => a + r.wins, 0) / n).toFixed(1)} | ouro ${(R.reduce((a, r) => a + r.goldIn, 0) / n).toFixed(0)} | mortes ${Object.entries(d).map(([k, v]) => k + ' ' + pct(v / n)).join(', ')}`);
}
