/* Builds unit proposal P1 from tuner pass 1 + re-tiering decisions (cost/rarity), interpolating the multiplier
 * from the measured (m, index) points. Output: overrides JSON (testing) + table rows.
 * Usage: node balance/sim/build-proposal.cjs balance/out/tune1/all.jsonl > balance/out/proposal_p1_units.json */
'use strict';
const fs = require('node:fs');
const { G } = require('./engine.cjs');
const rows = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n').map(JSON.parse);
const T = (c, r) => Math.round((1 + .04 * (c - 2) + .02 * r) * 100) / 100;
// Re-tiering decisions (design judgment, documented in the report): strong cards cost more / rarer; weak cards cheaper / more common.
const RETIER = {
  cowboy: { cost: 3 }, archer: { rarity: 1 }, eagle_druid: { cost: 2 }, dark_elf_mage: { cost: 3 }, shaolin: { rarity: 1 }, sorceress: { cost: 3 },
  kinoichi: { cost: 2 }, orc_fighter: { cost: 2 }, pirate_captain: { cost: 3 }, blackfang_guardian: { cost: 3 }, ronin: { rarity: 1 }, bear_druid: { cost: 3 },
  mage: { cost: 3 }, gladiator: { rarity: 0 }, shinobi: { rarity: 1 }, woodland_predator: { rarity: 1 }, centaur_lancer: { cost: 3 },
};
const SUPPORT_BUFF = new Set(['bard', 'goblin_king', 'feline_drummer']); // handled in the support design section
function interp(tries, target) {
  const pts = [...tries].sort((a, b) => a[1] - b[1]);
  for (let i = 0; i < pts.length - 1; i++) if (target >= pts[i][1] && target <= pts[i + 1][1]) { const [m0, i0] = pts[i], [m1, i1] = pts[i + 1]; return i1 === i0 ? m0 : m0 + (target - i0) * (m1 - m0) / (i1 - i0); }
  const [m0, i0] = pts[0], [m1, i1] = pts[pts.length - 1]; const slope = (m1 - m0) / ((i1 - i0) || 1e-6);
  return target < i0 ? m0 + (target - i0) * slope : m1 + (target - i1) * slope;
}
const units = {}, table = [];
for (const r of rows) {
  if (SUPPORT_BUFF.has(r.id)) continue;
  const u = G.BY[r.id], rt = RETIER[r.id] || {}, cost = rt.cost ?? r.base.cost ?? u.cost, rarity = rt.rarity ?? r.base.rarity ?? u.rarity, target = T(cost, rarity);
  let m = Math.abs(r.before - target) <= .0305 ? 1 : interp(r.tries, target);
  m = Math.round(m * 20) / 20; // steps of 5%
  const o = { ...r.base, ...rt }; if (m !== 1) for (const k of r.keys) o[k] = m;
  units[r.id] = o; table.push({ id: r.id, cost0: u.cost, rarity0: u.rarity, cost, rarity, target, before: r.before, keys: r.keys, m, area: o.area });
}
fs.writeFileSync('balance/out/proposal_p1_table.json', JSON.stringify(table, null, 1));
console.log(JSON.stringify({ note: 'Unit proposal P1 (testing overrides, player side). Not applied to the game.', units }, null, 1));
