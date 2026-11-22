/* Raids e Titans (Carlos 08/11): placar e derrota por mapa e árvore, comparados com lutas de ordem e bosses de ordem.
 * Metas: raid normal = derrota da luta de ordem do mesmo mapa +0 a +5 pontos; Titan como boss = derrota do boss de ordem do mesmo mapa;
 * quando passa, placar 1:3 ou 1:4. Uso: node r3-raid-report.cjs <dir> [prefixo] */
'use strict';
const fs = require('fs'), path = require('path'), [dir, pre = ''] = process.argv.slice(2);
const files = fs.readdirSync(dir).filter(f => f.startsWith(pre) && f.endsWith('.jsonl')), out = {};
const ORD = ['blackfang', 'dawncrest'];
for (const f of files) { const tr = (/(none|nodes\d+)/.exec(f) || [])[1]; if (!tr) continue;
  for (const l of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) { if (!l.trim()) continue; const r = JSON.parse(l);
    for (const x of r.fights) { const a = x.act, raid = x.raid || x.campaign === 'monsters', boss = x.type === 'boss';
      const k = raid ? (boss ? 'titanBoss' : 'raid') : ORD.includes(x.campaign) ? (boss ? 'ordBoss' : 'ordem') : null; if (!k) continue;
      const o = ((out[tr] ??= {})[a + '|' + k] ??= { n: 0, l: 0, sc: {} }); o.n++; if (x.result !== 'win') o.l++; else if (raid) { const s = '1:' + x.rounds.filter(q => q.r !== 'win').length; o.sc[s] = (o.sc[s] || 0) + 1; } } } }
const P = (a, b) => b ? Math.round(100 * a / b) + '%' : '-';
const rows = [];
for (const tr of ['none', 'nodes4', 'nodes10', 'nodes18', 'nodes23', 'nodes30'].filter(t => out[t])) for (const a of [1, 2, 3]) {
  const g = k => out[tr][a + '|' + k] || { n: 0, l: 0, sc: {} }, R = g('raid'), T = g('titanBoss'), O = g('ordem'), B = g('ordBoss'), won = R.n - R.l;
  if (!R.n && !T.n) continue;
  rows.push(`| ${tr.replace('none', '0').replace('nodes', '')} | ${a} | ${R.n} | **${P(R.l, R.n)}** | ${P(O.l, O.n)} | ${['1:0', '1:1', '1:2', '1:3', '1:4'].map(s => P(R.sc[s] || 0, won)).join(' | ')} | ${T.n} | **${P(T.l, T.n)}** | ${P(B.l, B.n)} (n${B.n}) |`);
}
console.log('| Nós | Mapa | Raids | Derrota raid | Derrota ordem | 1:0 | 1:1 | 1:2 | 1:3 | 1:4 | Titan boss | Derrota Titan boss | Derrota boss de ordem |');
console.log('|---|---|---|---|---|---|---|---|---|---|---|---|---|'); console.log(rows.join('\n'));
