/* Compare simulated runs with the human playtest metrics. Usage: node r3-regua-report.cjs <dir> */
'use strict';
const fs = require('fs'), path = require('path'); const dir = process.argv[2];
const H = { winsMedianTree0: 10, winsTree0: [6, 10, 6, 13, 26], eliteLossPerFight: 0.42, orderLossPerFight: 0.32, boss1LossAvg: 2.2 };
const med = v => { const a = [...v].sort((x, y) => x - y); return a.length ? a[Math.floor((a.length - 1) / 2)] : null; };
const q = (v, p) => { const a = [...v].sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.floor(p * a.length))]; };
console.log('referência humana (árvore 0-4): lutas vencidas mediana', H.winsMedianTree0, H.winsTree0.join('/'), '| rodadas perdidas por elite', H.eliteLossPerFight, '| por luta de ordem', H.orderLossPerFight, '| boss mapa 1', H.boss1LossAvg);
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.jsonl')).sort()) {
  const R = fs.readFileSync(path.join(dir, f), 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
  const wins = R.map(r => r.result === 'victory' ? 27 : r.wins);
  const fightsWon = R.flatMap(r => r.fights.filter(x => x.result === 'win' || r.result === 'victory' || x !== r.fights.at(-1)));
  const lost = x => (x.rounds || []).filter(z => z.r === 'loss').length;
  const done = R.flatMap(r => r.fights.slice(0, r.result === 'victory' ? undefined : -1));
  const el = done.filter(x => x.type === 'elite' && !x.raid), ord = el.filter(x => x.campaign === 'blackfang' || x.campaign === 'dawncrest'), b1 = done.filter(x => x.type === 'boss' && x.act === 1);
  const avg = v => v.length ? (v.reduce((a, x) => a + lost(x), 0) / v.length).toFixed(2) : '—';
  const stop = { 'mapa 1 antes da 6ª luta': 0, 'mapa 1 depois da 6ª luta': 0, 'boss 1': 0, 'mapa 2': 0, 'mapa 3+': 0 };
  for (const r of R) { if (r.result === 'victory') { stop['mapa 3+']++; continue; } const d = r.deathAt || {}, a = r.act; if (a === 1) stop[d.type === 'boss' ? 'boss 1' : (r.wins < 6 ? 'mapa 1 antes da 6ª luta' : 'mapa 1 depois da 6ª luta')]++; else if (a === 2) stop['mapa 2']++; else stop['mapa 3+']++; }
  console.log(`${f.replace('.jsonl', '').padEnd(14)} n=${R.length} lutas vencidas mediana ${med(wins)} (p25 ${q(wins, .25)}, p75 ${q(wins, .75)}) | perdidas/elite ${avg(el)} | /ordem ${avg(ord)} | boss1 ${avg(b1)} | onde cai: ${Object.entries(stop).map(([k, v]) => k + ' ' + Math.round(100 * v / R.length) + '%').join(', ')}`);
}
