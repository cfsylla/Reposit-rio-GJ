/* Etapa 4: passo de ajuste só dos True Bosses (laboratório pareado). Meta: média do boss comum do mapa 3 na mesma árvore − GAP pontos.
 * Uso: node r3-true-tune.cjs <lab dir> <variante atual.json|-> <próxima.json> [GAP=12] [b=2.5] */
'use strict';
const fs = require('fs'), path = require('path');
const [dir, curF, nextF, gapA = '12', bA = '2.5'] = process.argv.slice(2), GAP = Number(gapA) / 100, b = Number(bA);
let cur = curF && curF !== '-' ? JSON.parse(fs.readFileSync(curF, 'utf8')) : {};
if (!cur.bossTune) { process.env.GJ_ROOT ||= 'game_r3'; delete process.env.GJ_TREE_VARIANT; require('./engine.cjs'); cur.bossTune = JSON.parse(JSON.stringify(globalThis.JOURNEY_BOSS_TUNE)); }
const logit = p => { p = Math.min(.995, Math.max(.005, p)); return Math.log(p / (1 - p)); };
const cell = {};
for (const f of fs.readdirSync(dir).filter(f => f.startsWith('lab_') && f.endsWith('.jsonl'))) { const tr = /lab_(nodes\d+)_/.exec(f)[1];
  for (const l of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) if (l.trim()) for (const x of JSON.parse(l).bossLab || []) { if (x.act !== 3 || !/^(win|loss)$/.test(x.res)) continue; const k = tr + '|' + (x.trueBoss ? 'T:' : '') + x.id; const c = (cell[k] ??= { w: 0, n: 0 }); c.n++; if (x.res === 'win') c.w++; } }
const trees = [...new Set(Object.keys(cell).map(k => k.split('|')[0]))], T = cur.bossTune, rep = [];
const META = process.env.META ? Object.fromEntries(process.env.META.split(',').map(x => { const [t, v] = x.split(':'); return [t, Number(v) / 100 + GAP]; })) : null; // META=nodes18:63,nodes23:81 (meta do True Boss)
const regMean = tr => { if (META) return META[tr]; const R = Object.entries(cell).filter(([k]) => k.startsWith(tr + '|') && !k.includes('T:')); return R.reduce((a, [, c]) => a + c.w, 0) / R.reduce((a, [, c]) => a + c.n, 0); };
for (const id of [...new Set(Object.keys(cell).filter(k => k.includes('T:')).map(k => k.split('T:')[1]))]) {
  let num = 0, den = 0; const det = [];
  for (const tr of trees) { const c = cell[tr + '|T:' + id]; if (!c) continue; const p = c.w / c.n, t = regMean(tr) - GAP; num += c.n * (logit(p) - logit(t)); den += c.n; det.push(`${tr} ${Math.round(100 * p)}% (meta ${Math.round(100 * t)}%)`); }
  const k = Math.min(1.6, Math.max(.7, Math.exp(num / den / b))) ** 1.5, half = Math.sqrt(k);
  const o = T.boss[id] || { hp: 1, atk: 1 }; T.boss[id] = { hp: +(o.hp * half).toFixed(3), atk: +(o.atk * half).toFixed(3) };
  const t2 = T.true2[id] || { hp: 1, damage: 1 }; T.true2[id] = { hp: +(t2.hp * half).toFixed(3), damage: +(t2.damage * half).toFixed(3) };
  rep.push(`TRUE ${id.padEnd(12)} ${det.join('  ')} -> forma 1 e forma 2 x${half.toFixed(3)} (forma 1 hp ${T.boss[id].hp}, forma 2 hp ${T.true2[id].hp})`);
}
fs.writeFileSync(nextF, JSON.stringify({ ...cur, note: 'etapa 4 True Boss ' + new Date().toISOString() }, null, 1)); console.log(rep.join('\n'));
