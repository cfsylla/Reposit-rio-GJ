/* Aura variants: win rate per deck at 15 / 30 nodes. Usage: node r3-aura-report.cjs <label=dir> ... */
'use strict';
const fs = require('fs'), path = require('path');
const names = Object.fromEntries(require('../decks/decks_CP2.json').decks.map(d => [d.id, d.name]));
const AFF = ['arcane', 'astral', 'goblin_horde', 'blackfang_war', 'meowri_band', 'dawncrest_choir'];
const sets = process.argv.slice(2).map(a => { const [label, dir] = a.split('='); const R = {}; for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.jsonl'))) { const t = f.split('_')[1]; for (const l of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) if (l.trim()) { const r = JSON.parse(l); ((R[t] ??= {})[r.deck] ??= []).push(r); } } return { label, R }; });
const w = A => A && A.length ? A.filter(r => r.result === 'victory').length / A.length : null, pc = x => x == null ? '—' : Math.round(100 * x) + '%';
for (const t of ['nodes15', 'nodes30']) {
  console.log(`\n=== Vitória na run, árvore ${t.slice(5)} nós (30 runs por deck) ===`);
  console.log('deck'.padEnd(26) + sets.map(s => s.label.padStart(8)).join(''));
  for (const d of [...AFF, ...Object.keys(sets[0].R[t] || {}).filter(x => !AFF.includes(x))]) console.log(((AFF.includes(d) ? '* ' : '  ') + (names[d] || d)).padEnd(26) + sets.map(s => pc(w(s.R[t]?.[d])).padStart(8)).join(''));
  for (const [lab, f] of [['média afetados (*)', d => AFF.includes(d)], ['média controle', d => !AFF.includes(d)]]) console.log(lab.padEnd(26) + sets.map(s => { const A = Object.entries(s.R[t] || {}).filter(([d]) => f(d)).flatMap(([, v]) => v); return pc(w(A)).padStart(8); }).join(''));
}
