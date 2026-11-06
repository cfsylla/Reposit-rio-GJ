/* Before/after table for the boss lab. Usage: node r3-boss-compare.cjs <before dir> <after dir> <variant.json> */
'use strict';
const fs = require('fs'), path = require('path');
const [A, B, V] = process.argv.slice(2), T = JSON.parse(fs.readFileSync(V, 'utf8')).bossTune;
const NAMES = { ib_marshal: 'Marechal (IB)', ib_shogun: 'Xogum (IB)', ib_jarl: 'Jarl Rúnico (IB)', ib_gunslinger: 'Pistoleiro (IB)', ib_piratequeen: 'Rainha Pirata (IB)', ib_oracle: 'Oráculo (IB)', ib_hartlord: 'Senhor dos Cervos (IB)', goblin: 'Rei Goblin (BF)', troll: 'Rei Troll (BF)', orc: 'Imperador Orc (BF)', meowri: 'Rainha Meowri (DC)', centaur: 'Líder Centauro (DC)', highelf: 'Rei High Elf (DC)', forestelf: 'Rei Forest Elf (DC)', ib_wayfarer: 'Andarilho (True IB)', darkelf: 'Rei Dark Elf (True BF)', fairy: 'Rainha Fada (True DC)' };
function load(dir) { const c = {}; for (const f of fs.readdirSync(dir).filter(f => /^lab_nodes(15|30)_.*jsonl$/.test(f))) { const tr = f.split('_')[1]; for (const l of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) if (l.trim()) for (const x of JSON.parse(l).bossLab || []) { if (!/^(win|loss)$/.test(x.res)) continue; const k = `${tr}|${x.act}|${x.id}`; const o = (c[k] ??= { w: 0, n: 0 }); o.n++; if (x.res === 'win') o.w++; } } return c; }
const a = load(A), b = load(B), p = (c, k) => c[k] ? Math.round(100 * c[k].w / c[k].n) : '—';
const cols = [['nodes15', 1], ['nodes30', 1], ['nodes30', 2], ['nodes30', 3]];
console.log('| Boss | ' + cols.map(([t, m]) => `Mapa ${m} (${t.slice(5)} nós)`).join(' | ') + ' | Vida × | Ataque × |');
console.log('|---|' + cols.map(() => '---:').join('|') + '|---:|---:|');
for (const id of Object.keys(NAMES)) { const tb = ['ib_wayfarer', 'darkelf', 'fairy'].includes(id); const cs = tb ? [['nodes15', 3], ['nodes30', 3]] : cols;
  const cells = cols.map(([t, m]) => tb && m !== 3 ? '—' : `${p(a, `${t}|${m}|${id}`)} → **${p(b, `${t}|${m}|${id}`)}**`);
  const k = T.boss[id] || { hp: 1, atk: 1 }; const t2 = tb ? ` (forma 2: vida ×${(T.true2[id]?.hp || 1).toFixed(2)}, dano ×${(T.true2[id]?.damage || 1).toFixed(2)})` : '';
  console.log(`| ${NAMES[id]} | ${cells.join(' | ')} | ${k.hp.toFixed(2)}${t2} | ${k.atk.toFixed(2)} |`); }
console.log(`\nMultiplicador por mapa (todos os bosses): ${T.map.map(x => '×' + x.toFixed(2)).join(' / ')}`);
