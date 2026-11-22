/* Round 3 boss tuning step (targets approved by Carlos 06/11/2026, measured at 30 nodes in the paired boss lab):
 *   regular bosses: map 1 ~95%, map 2 ~88%, map 3 ~83% player wins; every boss within +-5 of its map mean;
 *   True Bosses (map 3): ~73%.
 * Usage: node balance/sim/r3-boss-tune.cjs <lab dir> <current variant.json|-> <next variant.json> [tree=nodes30] [b=2.5]
 * Strength model: logit(win) shifts by -b * ln(k) when a leader's HP and ATK are both multiplied by k (b recalibrated per step). */
'use strict';
const fs = require('fs'), path = require('path');
const [dir, curFile, nextFile, tree = 'nodes30', bArg = '2.5', devTrees = 'nodes15,nodes30'] = process.argv.slice(2);
const clamp = k => Math.min(1.5, Math.max(.75, k));
const b = Number(bArg);
const cur = curFile && curFile !== '-' ? JSON.parse(fs.readFileSync(curFile, 'utf8')) : {};
const T = cur.bossTune || { map: [1, 1, 1], boss: {}, true2: {} };
const TARGET = { 1: .95, 2: .88, 3: .83 }, TRUE_TARGET = .73;
const logit = p => Math.log(Math.min(.995, Math.max(.005, p)) / (1 - Math.min(.995, Math.max(.005, p))));
function cells(tr) { const cell = {};
  for (const f of fs.readdirSync(dir).filter(f => f.startsWith('lab_' + tr + '_') && f.endsWith('.jsonl')))
    for (const l of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) if (l.trim()) for (const x of JSON.parse(l).bossLab || []) {
      if (!/^(win|loss)$/.test(x.res)) continue; const k = x.act + '|' + x.id; const c = (cell[k] ??= { tr, act: x.act, id: x.id, tb: x.trueBoss, w: 0, n: 0 }); c.n++; if (x.res === 'win') c.w++; }
  return Object.values(cell); }
const C = cells(tree), reg = C.filter(c => !c.tb);
const DEV = devTrees.split(',').flatMap(cells).filter(c => !c.tb);
const meanOf = (R, act, tr) => { const X = R.filter(c => c.act === act && (!tr || c.tr === tr)); return X.reduce((a, c) => a + c.w, 0) / X.reduce((a, c) => a + c.n, 0); };
const mean = act => meanOf(reg, act);
const report = [];
// map multipliers: move each map mean toward its target
const map = [...(T.map || [1, 1, 1])];
for (const act of [1, 2, 3]) { const m = mean(act), d = logit(m) - logit(TARGET[act]); map[act - 1] = +(map[act - 1] * clamp(Math.exp(d / b))).toFixed(3); report.push(`mapa ${act}: média ${(100 * m).toFixed(1)}% (meta ${100 * TARGET[act]}%) -> multiplicador ${map[act - 1]}`); }
// per-boss: deviation from the map mean, pooled over maps (weighted by n)
const boss = { ...(T.boss || {}) };
for (const id of [...new Set(reg.map(c => c.id))]) {
  let num = 0, den = 0; for (const c of DEV.filter(c => c.id === id && c.n >= 20)) { num += c.n * (logit(c.w / c.n) - logit(meanOf(DEV, c.act, c.tr))); den += c.n; }
  const dev = num / den, k = clamp(Math.exp(dev / b)), o = boss[id] || { hp: 1, atk: 1 };
  boss[id] = { hp: +(o.hp * k).toFixed(3), atk: +(o.atk * k).toFixed(3) };
  report.push(`${id.padEnd(15)} ${reg.filter(c => c.id === id).map(c => `M${c.act} ${Math.round(100 * c.w / c.n)}%`).join('  ')}  desvio ${dev.toFixed(2)} -> x${k.toFixed(3)} (hp ${boss[id].hp}, atk ${boss[id].atk})`);
}
// True Bosses: form 1 via boss[id], form 2 via true2[id]; split the needed change evenly between both forms
const true2 = { ...(T.true2 || {}) };
for (const c of C.filter(c => c.tb)) {
  const p = c.w / c.n, d = logit(p) - logit(TRUE_TARGET), k = clamp(Math.exp(d / b)) ** 1.5, half = Math.sqrt(k);
  const o = boss[c.id] || { hp: 1, atk: 1 }; boss[c.id] = { hp: +(o.hp * half).toFixed(3), atk: +(o.atk * half).toFixed(3) };
  const t = true2[c.id] || { hp: 1, damage: 1 }; true2[c.id] = { hp: +(t.hp * half).toFixed(3), damage: +(t.damage * half).toFixed(3) };
  report.push(`TRUE ${c.id.padEnd(10)} ${Math.round(100 * p)}% (n ${c.n}, meta 73%) -> forma 1 x${half.toFixed(3)}, forma 2 x${half.toFixed(3)}`);
}
const next = { note: 'R3 boss tuning step (enemy-only). ' + new Date().toISOString(), bossTune: { map, boss, true2 } };
fs.writeFileSync(nextFile, JSON.stringify(next, null, 1));
console.log(report.join('\n'));
