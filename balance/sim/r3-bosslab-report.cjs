/* Laboratório pareado de bosses: vitória por boss (mesmo jogador enfrenta todos os bosses do mapa). Uso: node r3-bosslab-report.cjs <dir> */
'use strict';
const fs = require('fs'), path = require('path'), dir = process.argv[2], cell = {};
for (const f of fs.readdirSync(dir).filter(f => f.startsWith('lab_') && f.endsWith('.jsonl'))) {
  const tr = /lab_(nodes\d+)_/.exec(f)[1];
  for (const l of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) if (l.trim()) for (const x of JSON.parse(l).bossLab || []) {
    if (!/^(win|loss)$/.test(x.res)) continue; const k = tr + '|' + x.act + '|' + (x.trueBoss ? 'TRUE ' : '') + x.id; const c = (cell[k] ??= { w: 0, n: 0 }); c.n++; if (x.res === 'win') c.w++; }
}
const rows = Object.entries(cell).sort(); let last = '';
for (const [k, c] of rows) { const [tr, act, id] = k.split('|'); if (tr + act !== last) { console.log(`\n${tr} mapa ${act}`); last = tr + act; } console.log(`  ${id.padEnd(22)} ${Math.round(100 * c.w / c.n)}% (n ${c.n})`); }
for (const tr of [...new Set(rows.map(([k]) => k.split('|')[0]))]) { const R = rows.filter(([k]) => k.startsWith(tr + '|3|')), reg = R.filter(([k]) => !k.includes('TRUE')), tb = R.filter(([k]) => k.includes('TRUE')), m = X => Math.round(100 * X.reduce((a, [, c]) => a + c.w, 0) / Math.max(1, X.reduce((a, [, c]) => a + c.n, 0)));
  console.log(`${tr}: média boss comum mapa 3 ${m(reg)}% | média True Boss ${m(tb)}%`); }
