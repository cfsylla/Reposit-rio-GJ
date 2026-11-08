/* Etapa 4: onde a run termina, por tamanho da árvore, comparado com a escada de barreiras do Carlos (08/11/2026).
 * Uso: node r3-escada-report.cjs <dir> [prefixo=m1.0_]  (arquivos <prefixo><árvore>.jsonl do r3-regua-run.sh) */
'use strict';
const fs = require('fs'), path = require('path');
const [dir, pre = 'm1.0_'] = process.argv.slice(2);
const ORD = ['blackfang', 'dawncrest'];
const STATES = ['none', 'nodes1', 'nodes2', 'nodes4', 'nodes7', 'nodes10', 'nodes13', 'nodes18', 'nodes23', 'nodes28', 'nodes33'];
// alvo da escada: run em que o estado é típico e onde a run deve terminar
const ALVO = { none: 'run 1: cai na 2ª ordem do M1 (ou no boss 1)', nodes1: 'run 2: vence o boss 1, cai na entrada/ordem do M2', nodes2: 'run 3: cai nas ordens do M2', nodes4: 'run 4: ordens do M2 / boss 2', nodes7: 'run 5: boss 2', nodes10: 'run 6: entrada do M3', nodes13: 'run 7: ordens do M3', nodes18: 'run 8: ordens do M3 / boss 3', nodes23: 'runs 9-10: boss 3 (perde)', nodes28: 'runs 11-12: boss 3 (perde 2-3 vezes)', nodes33: 'run 13: 1ª vitória' };
function where(r) {
  if (r.result === 'victory') return 'Vitória';
  const F = r.fights, last = F[F.length - 1], a = last.act, inMap = F.filter(f => f.act === a), i = inMap.length - 1;
  const ordersBefore = inMap.slice(0, i).filter(f => ORD.includes(f.campaign)).length;
  if (last.type === 'boss') return 'Boss ' + a;
  if (ORD.includes(last.campaign)) return `Ordem ${a}` + (a === 1 ? (ordersBefore ? ' (2ª)' : ' (1ª)') : '');
  if (last.raid || last.campaign === 'monsters') return 'Raid ' + a;
  if (a >= 2 && !ordersBefore && i <= 2) return 'Entrada ' + a;
  return 'Outras ' + a;
}
const COLS = ['Outras 1', 'Ordem 1 (1ª)', 'Ordem 1 (2ª)', 'Raid 1', 'Boss 1', 'Entrada 2', 'Ordem 2', 'Raid 2', 'Outras 2', 'Boss 2', 'Entrada 3', 'Ordem 3', 'Raid 3', 'Outras 3', 'Boss 3', 'Vitória'];
const rows = [];
for (const st of STATES) {
  const f = path.join(dir, pre + st + '.jsonl'); if (!fs.existsSync(f)) continue;
  const R = fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(JSON.parse), t = {};
  for (const r of R) { const w = where(r); t[w] = (t[w] || 0) + 1; }
  const reach = a => R.filter(r => r.fights.some(f => f.act === a && f.type === 'boss')).length;
  const pass = a => R.filter(r => r.fights.some(f => f.act === a && f.type === 'boss' && f.result === 'win')).length;
  const pb = [1, 2, 3].map(a => reach(a) ? Math.round(100 * pass(a) / reach(a)) + '%' : '-').join(' / ');
  rows.push(`| ${st.replace('none', '0').replace('nodes', '')} | ${ALVO[st]} | ${COLS.map(c => t[c] ? Math.round(100 * t[c] / R.length) : '').join(' | ')} | ${pb} |`);
}
console.log(`| Nós | Alvo da escada | ${COLS.join(' | ')} | Vence boss 1/2/3 (se chega) |`);
console.log('|' + '---|'.repeat(COLS.length + 3));
console.log(rows.join('\n'));
