/* Career report: progression curve from career.cjs JSONL files.
 * Usage: node balance/sim/career-report.cjs <dir>  -> markdown (per block of runs: win %, map 1 / map 2 pass %, nodes and XP cost owned,
 * XP earned and XP converted; runs until 10 / 25 nodes; runs until first victory). */
'use strict';
const fs = require('fs');
const dir = process.argv[2];
const R = fs.readdirSync(dir).filter(f => f.endsWith('.jsonl')).flatMap(f => fs.readFileSync(dir + '/' + f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse));
const pct = x => Math.round(100 * x) + '%', avg = a => a.reduce((t, x) => t + x, 0) / (a.length || 1);
const runs = Math.max(...R.map(r => r.run));
console.log(`Carreiras: ${new Set(R.map(r => r.deck + ':' + r.career)).size} (${R.length} runs, até ${runs} runs cada).\n`);
console.log('| Runs | Nós no início (média) | XP de árvore no início | Passa M1 | Passa M2 | Vence | XP ganho / run | XP convertido em nós / run |');
console.log('|---|---|---|---|---|---|---|---|');
for (let lo = 1; lo <= runs; lo += 5) {
  const B = R.filter(r => r.run >= lo && r.run < lo + 5); if (!B.length) continue;
  const conv = B.map(r => (r.bought || []).length);
  console.log(`| ${lo}–${lo + 4} | ${avg(B.map(r => r.nodesBefore)).toFixed(1)} | ${Math.round(avg(B.map(r => r.costBefore)))} | ${pct(avg(B.map(r => r.wins >= 9 || r.result === 'victory' ? 1 : 0)))} | ${pct(avg(B.map(r => r.wins >= 18 || r.result === 'victory' ? 1 : 0)))} | **${pct(avg(B.map(r => r.result === 'victory' ? 1 : 0)))}** | ${avg(B.map(r => r.xp)).toFixed(1)} | ${avg(B.map(r => r.nodesAfter - r.nodesBefore)).toFixed(2)} nós |`);
}
const careers = {}; for (const r of R) (careers[r.deck + ':' + r.career] ??= []).push(r);
const firstAt = (rs, f) => { const x = rs.sort((a, b) => a.run - b.run).find(f); return x ? x.run : null; };
const stat = f => { const v = Object.values(careers).map(rs => firstAt(rs, f)); const ok = v.filter(x => x !== null).sort((a, b) => a - b); return { reached: ok.length, total: v.length, median: ok.length ? ok[Math.floor(ok.length / 2)] : null }; };
console.log('\n| Marco | Carreiras que chegaram | Mediana (run) |\n|---|---|---|');
for (const [name, f] of [['1º nó comprado', r => r.nodesAfter > 0], ['10 nós', r => r.nodesAfter >= 10], ['25 nós (≈ árvore intermediária)', r => r.nodesAfter >= 25], ['1ª vitória', r => r.result === 'victory']]) {
  const s = stat(f); console.log(`| ${name} | ${s.reached}/${s.total} | ${s.median ?? '—'} |`);
}
const zero = Object.values(careers).map(rs => rs.filter(r => r.run <= 5 && r.nodesAfter === 0).length);
console.log(`\nRuns 1–5 que terminaram com 0 nós: ${pct(avg(zero) / 5)}.`);
