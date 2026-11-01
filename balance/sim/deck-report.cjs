/* Deck report: real runs (old vs new decks) + tournament matrix. Usage: node balance/sim/deck-report.cjs balance/out/decks1 balance/decks/decks_p3_v1.json */
'use strict';
const fs = require('node:fs'), path = require('node:path');
const [dir, deckFile] = process.argv.slice(2);
const D = JSON.parse(fs.readFileSync(deckFile, 'utf8')).decks;
const read = f => fs.readFileSync(path.join(dir, f), 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
const files = fs.readdirSync(dir);
function runStats(rows) {
  const n = rows.length, first = rows.filter(r => r.fights[0]?.result === 'loss').length;
  const r1 = rows.filter(r => r.fights[0]?.rounds[0]?.r === 'loss').length;
  const m = rows.reduce((s, r) => s + r.wins, 0) / n, a1 = rows.filter(r => r.wins >= 9).length, a2 = rows.filter(r => r.wins >= 18).length, v = rows.filter(r => r.result === 'victory').length;
  // round win rate in act-1 normal battles
  const f = rows.flatMap(r => r.fights.filter(x => x.act === 1 && x.type === 'battle' && !x.event)); const rw = f.reduce((s, x) => s + x.rounds.filter(y => y.r === 'win').length, 0), rp = f.reduce((s, x) => s + x.rounds.length, 0);
  return { n, firstLoss: first / n, r1Loss: r1 / n, meanWins: m, act1: a1 / n, act2: a2 / n, win: v / n, rw: rp ? rw / rp : 0 };
}
const pct = x => (100 * x).toFixed(0) + '%';
const line = (name, s) => `| ${name} | ${s.n} | ${pct(s.r1Loss)} | ${pct(s.firstLoss)} | ${pct(s.rw)} | ${s.meanWins.toFixed(1)} | ${pct(s.act1)} | ${pct(s.act2)} | ${pct(s.win)} |`;
const head = '| Deck | Runs | Perde rodada 1 da 1ª luta | Perde a 1ª luta | Rodadas vencidas (batalhas do mapa 1) | Lutas vencidas (média) | Passa do mapa 1 | Passa do mapa 2 | Vence a run |\n|---|---|---|---|---|---|---|---|---|';
console.log('### Decks atuais (v54 com P1/P2), mesma política\n'); console.log(head);
const oldAll = [];
for (const f of files.filter(f => f.startsWith('old_') && f.endsWith('.jsonl')).sort()) { const rows = read(f); oldAll.push(...rows); console.log(line(f.slice(4, -6), runStats(rows))); }
console.log(line('**Média**', runStats(oldAll)));
// matrix
const M = files.filter(f => f.startsWith('matrix_')).flatMap(read);
const score = {}; for (const r of M) { (score[r.a] ??= { w: 0, n: 0, rw: 0, rp: 0 }); const s = score[r.a]; s.w += r.wins; s.n += r.seeds; s.rw += r.roundWins; s.rp += r.rounds; }
console.log('\n### Decks novos (proposta P3 v1)\n'); console.log(head.replace('| Vence a run |', '| Vence a run | Torneio: confrontos vencidos |').replace('|---|---|---|---|---|---|---|---|---|', '|---|---|---|---|---|---|---|---|---|---|'));
const newAll = [], table = [];
for (const d of D) { const f = 'new_' + d.id + '.jsonl'; if (!files.includes(f)) continue; const rows = read(f); newAll.push(...rows); const s = runStats(rows), t = score[d.id]; table.push({ d, s, t }); }
for (const { d, s, t } of table) console.log(line(`${d.name} (\`${d.id}\`${d.order ? ', ' + d.order : ''})`, s) + ` ${t ? pct(t.w / t.n) : '-'} |`);
console.log(line('**Média**', runStats(newAll)) + ' 50% |');
// matrix extremes
if (M.length) {
  console.log('\nTorneio — piores confrontos (linha vence coluna em menos de 20%):');
  const bad = M.filter(r => r.wins / r.seeds <= .17 && r.a !== r.b).map(r => r.a + '×' + r.b); console.log(bad.slice(0, 40).join(', ') || 'nenhum');
}
