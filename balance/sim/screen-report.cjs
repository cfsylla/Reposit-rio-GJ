/* Screening report: each candidate vs BASE (same decks and seeds). Usage: node balance/sim/screen-report.cjs <dir>
 * Targets: challenge (C_*) costs 5-10 (exceptions 3-12); advantage (V_*) gains 3-7 (exceptions 1-9). */
'use strict';
const fs = require('fs'), dir = process.argv[2];
const by = {}; for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.jsonl'))) { const id = f.replace(/_(blades|verdant|outlaws|blackfang_war|centaur_charge|[a-z_]+)\.jsonl$/, '').replace(/_[^_]*$/, x => x); const name = f.slice(0, f.indexOf('_', 2) > 0 ? undefined : undefined); }
const R = {}; for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.jsonl'))) { const m = /^(BASE|[CV]_[A-Za-z0-9]+)_(.+)\.jsonl$/.exec(f); if (!m) continue; (R[m[1]] ??= []).push(...fs.readFileSync(dir + '/' + f, 'utf8').split('\n').filter(Boolean).map(JSON.parse)); }
const win = X => X.filter(r => r.result === 'victory').length / X.length;
if (!R.BASE) { console.log('sem BASE'); process.exit(); }
const b = win(R.BASE); console.log(`Base: ${Math.round(100 * b)}% (${R.BASE.length} runs)\n\n| Candidato | Runs | Vence | Impacto | Situação |\n|---|---|---|---|---|`);
for (const [id, X] of Object.entries(R).filter(([k]) => k !== 'BASE').sort()) {
  const v = 100 * (win(X) - b), ch = id.startsWith('C_'), imp = ch ? -v : v;
  const st = ch ? (imp >= 5 && imp <= 10 ? 'ideal' : imp >= 3 && imp <= 12 ? 'exceção aceita' : imp < 3 ? 'fraco' : 'forte demais') : (imp >= 3 && imp <= 7 ? 'ideal' : imp >= 1 && imp <= 9 ? 'exceção aceita' : imp < 1 ? 'fraca' : 'forte demais');
  console.log(`| ${id} | ${X.length} | ${Math.round(100 * win(X))}% | ${ch ? '−' : '+'}${imp.toFixed(1)} | ${st} |`);
}
