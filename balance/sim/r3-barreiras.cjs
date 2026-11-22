/* Etapa 4: taxa de passagem de cada barreira (entre as runs que chegaram nela), por tamanho de árvore.
 * Barreiras na ordem da run: M1 comuns, M1 ordens, boss 1, entrada M2 (2 primeiras lutas), M2 ordens, M2 comuns, boss 2, idem M3, boss 3.
 * Uso: node r3-barreiras.cjs <dir> [prefixo=m1.0_] */
'use strict';
const fs = require('fs'), path = require('path');
const [dir, pre = 'm1.0_'] = process.argv.slice(2);
const ORD = ['blackfang', 'dawncrest'];
const STATES = ['none', 'nodes1', 'nodes2', 'nodes4', 'nodes7', 'nodes10', 'nodes13', 'nodes18', 'nodes23', 'nodes28', 'nodes33'];
const kind = (f, i) => f.type === 'boss' ? 'boss' : ORD.includes(f.campaign) ? 'ordem' : (f.raid || f.campaign === 'monsters') ? 'raid' : (f.act >= 2 && i < 2) ? 'entrada' : 'comuns';
const COLS = []; for (const a of [1, 2, 3]) for (const k of (a === 1 ? ['comuns', 'ordem', 'raid', 'boss'] : ['entrada', 'ordem', 'raid', 'comuns', 'boss'])) COLS.push(a + ':' + k);
const out = [`| Nós | ${COLS.map(c => c.replace(':', ' ')).join(' | ')} | vitória |`, '|' + '---|'.repeat(COLS.length + 2)];
for (const st of STATES) {
  const f = path.join(dir, pre + st + '.jsonl'); if (!fs.existsSync(f)) continue;
  const R = fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(JSON.parse), c = {};
  for (const r of R) { const idx = {}; for (const x of r.fights) { if (x.event) continue; const i = idx[x.act] = (idx[x.act] ?? -1) + 1; const k = x.act + ':' + kind(x, i); const o = (c[k] ??= { n: 0, w: 0 }); o.n++; if (x.result === 'win') o.w++; } }
  out.push(`| ${st.replace('none', '0').replace('nodes', '')} | ${COLS.map(k => c[k] && c[k].n >= 10 ? Math.round(100 * c[k].w / c[k].n) + '%' : '').join(' | ')} | ${Math.round(100 * R.filter(r => r.result === 'victory').length / R.length)}% |`);
}
console.log('Passagem por luta (vitórias / lutas daquele tipo entre as runs que chegaram):\n' + out.join('\n'));
