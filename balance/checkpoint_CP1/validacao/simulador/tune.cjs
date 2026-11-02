/* Auto-tuner (proposal search, testing only): for each unit, finds the multiplier m on the chosen stats so that
 * its lab index (L0, neutral team, same panel/fillers as lab.cjs) reaches the target of its cost/rarity.
 * Runs lab.cjs as a child process with a temporary GJ_OVERRIDES file containing ONLY that unit's change.
 * Usage: node balance/sim/tune.cjs --plan plan.json --out result.jsonl
 * plan.json: [{ id, target, keys:['hp','atk'] | ['hp','atk','skill'] | ..., base:{cost,rarity,trigger,area} }] */
'use strict';
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const a = {}; process.argv.slice(2).forEach((v, i, arr) => { if (i % 2 === 0) a[v.replace(/^--/, '')] = arr[i + 1]; });
const plan = JSON.parse(fs.readFileSync(a.plan, 'utf8'));
const tmp = path.join(path.dirname(a.out), 'tmp_' + process.pid + '.json');
function index(p, m) {
  const o = { ...(p.base || {}) }; for (const k of p.keys) o[k] = (o[k] || 1) * m;
  fs.writeFileSync(tmp, JSON.stringify({ units: { [p.id]: o } }));
  const out = cp.execFileSync(process.execPath, [path.join(__dirname, 'lab.cjs'), '--seeds', '3', '--levels', '0', '--units', p.id], { env: { ...process.env, GJ_OVERRIDES: tmp }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  return Number(/index ([\d.]+)/.exec(out)[1]);
}
for (const p of plan) {
  const tries = [];
  let m0 = 1, i0 = index(p, m0); tries.push([m0, i0]);
  let m1 = Math.min(2.2, Math.max(.45, 1 + (p.target - i0) / (p.elastic || .3))), i1 = index(p, m1); tries.push([m1, i1]);
  for (let k = 0; k < 4 && Math.abs(i1 - p.target) > .012; k++) {
    let m2 = Math.abs(i1 - i0) < 1e-3 ? m1 + (p.target > i1 ? .25 : -.25) : m1 + (p.target - i1) * (m1 - m0) / (i1 - i0);
    m2 = Math.min(3, Math.max(.4, m2)); m0 = m1; i0 = i1; m1 = m2; i1 = index(p, m1); tries.push([m1, i1]);
  }
  const best = tries.sort((x, y) => Math.abs(x[1] - p.target) - Math.abs(y[1] - p.target))[0];
  const row = { id: p.id, keys: p.keys, base: p.base || {}, target: p.target, before: tries.find(t => t[0] === 1)?.[1], m: Math.round(best[0] * 100) / 100, after: best[1], tries };
  fs.appendFileSync(a.out, JSON.stringify(row) + '\n');
  console.log(p.id.padEnd(18), 'target', p.target.toFixed(2), 'before', row.before?.toFixed(2), 'm', row.m, 'after', row.after.toFixed(2));
}
try { fs.unlinkSync(tmp); } catch {}
