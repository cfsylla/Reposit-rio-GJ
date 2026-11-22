/* Round 3 career report (R3 model). Usage: node balance/sim/r3-career-report.cjs <dir> [decks.json] [--json]
 * Reads <dir>/car_<deck>_<career>.jsonl (career.cjs rows) and prints per-deck and overall progression stats. */
'use strict';
const fs = require('fs'), path = require('path');
const [dir, deckFile = 'balance/decks/decks_CP2.json'] = process.argv.slice(2).filter(a => !a.startsWith('--'));
const asJson = process.argv.includes('--json');
const names = Object.fromEntries(JSON.parse(fs.readFileSync(deckFile, 'utf8')).decks.map(d => [d.id, d.name]));
const C = {}; // deck -> [career rows]
for (const f of fs.readdirSync(dir).filter(f => /^car_.*\.jsonl$/.test(f))) {
  const rows = fs.readFileSync(path.join(dir, f), 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
  if (rows.length) (C[rows[0].deck] ??= []).push(rows);
}
const med = v => { const a = v.filter(x => x != null).sort((x, y) => x - y); return a.length ? a[Math.floor((a.length - 1) / 2)] : null; };
const q = (v, p) => { const a = v.filter(x => x != null).sort((x, y) => x - y); return a.length ? a[Math.min(a.length - 1, Math.floor(p * a.length))] : null; };
const firstRun = (rows, pred) => { const r = rows.find(pred); return r ? r.run : null; };
function stats(careers) {
  const o = { careers: careers.length };
  o.firstWin = careers.map(r => firstRun(r, x => x.result === 'victory'));
  o.firstWinNodes = careers.map(r => { const x = r.find(x => x.result === 'victory'); return x ? x.nodesBefore : null; });
  for (const n of [15, 30, 45, 60]) o['n' + n] = careers.map(r => firstRun(r, x => x.nodesAfter >= n));
  o.firstBoss1 = careers.map(r => firstRun(r, x => x.act > 1 || x.result === 'victory'));
  const all = careers.flat(), early = all.filter(x => x.run <= 10);
  o.earlyBoss1 = early.filter(x => x.act > 1 || x.result === 'victory').length / (early.length || 1);
  o.xp = ['earned', 'spent', 'lost'].map(k => all.reduce((t, x) => t + (x.xpR3?.[k] || 0), 0) / (all.length || 1));
  const w1 = all.filter(x => x.nodesBefore < 60).flatMap(x => (x.windows || []).filter(w => w.act === 1 && w.kind === 'mid')); o.mid1xp = w1.length ? w1.reduce((t, w) => t + w.xp, 0) / w1.length : null; o.mid1buy = w1.length ? w1.filter(w => w.bought.length).length / w1.length : null;
  o.winBy = [[1, 5], [6, 10], [11, 15], [16, 20], [21, 30], [31, 50]].map(([a, b]) => { const R = all.filter(x => x.run >= a && x.run <= b); return R.length ? R.filter(x => x.result === 'victory').length / R.length : null; });
  return o;
}
const fmt = v => v == null ? '—' : typeof v === 'number' && !Number.isInteger(v) ? v.toFixed(1) : String(v);
const pc = v => v == null ? '—' : Math.round(100 * v) + '%';
const rowsOut = [];
const line = (name, s) => { const nv = s.firstWin.filter(x => x == null).length;
  rowsOut.push({ name, ...s });
  return [name.padEnd(24), String(s.careers).padStart(3), ('' + fmt(med(s.firstWin)) + ' (' + fmt(q(s.firstWin, .1)) + '-' + fmt(q(s.firstWin, .9)) + ')' + (nv ? ' ' + nv + '✗' : '')).padStart(14), fmt(med(s.firstWinNodes)).padStart(6),
    ...[15, 30, 45, 60].map(n => fmt(med(s['n' + n])).padStart(5)), fmt(med(s.firstBoss1)).padStart(5), pc(s.earlyBoss1).padStart(6), s.xp.map(x => x.toFixed(0)).join('/').padStart(10), (fmt(s.mid1xp) + ' ' + pc(s.mid1buy)).padStart(10), s.winBy.map(pc).join(' ')].join(' '); };
const head = ['deck'.padEnd(24), 'car', '1ª vitória med(p10-p90)'.padStart(14), 'nós@1ªv', ' 15n', ' 30n', ' 45n', ' 60n', 'boss1', 'b1≤10', 'xp g/g/p', 'jan1 xp/compra', 'vitória runs 1-5|6-10|11-15|16-20|21-30|31-50'].join(' ');
const out = [head];
for (const d of Object.keys(C)) out.push(line(names[d] || d, stats(C[d])));
out.push(line('TODOS', stats(Object.values(C).flat())));
if (asJson) console.log(JSON.stringify(rowsOut)); else console.log(out.join('\n'));
