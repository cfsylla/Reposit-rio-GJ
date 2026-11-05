/* Boss lab report: paired win rate of the same player states against every order boss. Usage: node r3-bosslab-report.cjs <dir> [prefix] */
'use strict';
const fs = require('fs'), path = require('path');
const [dir, prefix = 'lab'] = process.argv.slice(2);
const NAMES = { ib_marshal: 'Marechal', ib_shogun: 'Xogum', ib_jarl: 'Jarl Rúnico', ib_gunslinger: 'Pistoleiro', ib_piratequeen: 'Rainha Pirata', ib_oracle: 'Oráculo', ib_hartlord: 'Senhor dos Cervos', goblin: 'Rei Goblin', troll: 'Rei Troll', orc: 'Imperador Orc', meowri: 'Rainha Meowri', centaur: 'Líder Centauro', highelf: 'Rei High Elf', forestelf: 'Rei Forest Elf', ib_wayfarer: 'Andarilho (True)', darkelf: 'Rei Dark Elf (True)', fairy: 'Rainha Fada (True)' };
const runs = []; for (const f of fs.readdirSync(dir).filter(f => f.startsWith(prefix + '_') && f.endsWith('.jsonl'))) { const tree = f.split('_')[1]; for (const l of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) if (l.trim()) runs.push({ tree, ...JSON.parse(l) }); }
const out = {};
for (const r of runs) for (const x of r.bossLab || []) { if (!/^(win|loss)$/.test(x.res)) { (out.bad ??= {})[x.res] = ((out.bad ??= {})[x.res] || 0) + 1; continue; } const k = `${r.tree}|${x.act}|${x.id}`; const c = (out[k] ??= { tree: r.tree, act: x.act, id: x.id, order: x.order, tb: x.trueBoss, w: 0, n: 0 }); c.n++; if (x.res === 'win') c.w++; }
const rows = Object.values(out).filter(c => c.id); const trees = [...new Set(rows.map(c => c.tree))].sort();
const pct = (w, n) => n ? Math.round(100 * w / n) : null;
for (const act of [1, 2, 3]) {
  console.log(`\n=== Mapa ${act}: % de vitória do mesmo jogador contra cada boss (n = estados testados) ===`);
  console.log('boss'.padEnd(24) + trees.map(t => t.padStart(14)).join(''));
  const ids = [...new Set(rows.filter(c => c.act === act).map(c => c.id))];
  for (const id of ids) console.log(((NAMES[id] || id)).padEnd(24) + trees.map(t => { const c = out[`${t}|${act}|${id}`]; return c ? (`${pct(c.w, c.n)}% (${c.n})`).padStart(14) : ''.padStart(14); }).join(''));
  for (const [label, f] of [['MÉDIA Ironbound', c => c.order === 'ironbound' && !c.tb], ['MÉDIA Blackfang', c => c.order === 'blackfang' && !c.tb], ['MÉDIA Dawncrest', c => c.order === 'dawncrest' && !c.tb]])
    console.log(label.padEnd(24) + trees.map(t => { const R = rows.filter(c => c.act === act && c.tree === t && f(c)); const w = R.reduce((a, c) => a + c.w, 0), n = R.reduce((a, c) => a + c.n, 0); return n ? (`${pct(w, n)}%`).padStart(14) : ''.padStart(14); }).join(''));
}
if (out.bad) console.log('\nexcluded:', JSON.stringify(out.bad));
