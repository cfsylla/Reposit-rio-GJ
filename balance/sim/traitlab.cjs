/* Trait lab (FIXTURE). Two questions, real combat, same handicap method as lab.cjs.
 * --mode trait : value of each trait tier. Team = k distinct members of the trait + neutral fillers (5 units).
 *                gain = strength(trait ON) / strength(same units, trait OFF for the player only).
 * --mode unit  : value of each character INSIDE its faction team (X + up to 3 faction mates + fillers),
 *                index = strength(with X) / strength(X replaced by a neutral filler). Includes the trait tier X enables.
 * Usage: node balance/sim/traitlab.cjs --mode trait|unit [--only a,b] [--combos 4] [--seeds 3] --out file.jsonl */
'use strict';
const fs = require('node:fs');
const L = require('./labcore.cjs');
const { G, tr } = L;
const T = globalThis.JourneyTraits;
const a = {}; process.argv.slice(2).forEach((v, i, arr) => { if (i % 2 === 0) a[v.replace(/^--/, '')] = arr[i + 1]; });
const SEEDS = Number(a.seeds || 3), COMBOS = Number(a.combos || 4), mode = a.mode || 'trait';
const write = l => a.out ? fs.appendFileSync(a.out, JSON.stringify(l) + '\n') : null;
const rnd = G.rng(12345);
function sample(list, k, n) {
  const seen = new Set(), out = [];
  for (let t = 0; t < 200 && out.length < n; t++) { const pick = G.shuffle(list, rnd).slice(0, k).sort(); const key = pick.join(); if (!seen.has(key)) { seen.add(key); out.push(pick); } }
  return out;
}
function fillers(members, avoid) {
  const ok = (f, k) => f !== k && !members.includes(f) && !members.includes(k) && !tr(f).some(t => tr(k).includes(t)) && !avoid.some(t => tr(f).includes(t) || tr(k).includes(t));
  const strict = (f, k) => ok(f, k) && members.every(m => !tr(m).some(t => tr(f).includes(t) || tr(k).includes(t)));
  for (const test of [strict, ok]) for (const f of L.FRONTS) for (const k of L.BACKS) if (test(f, k)) return [f, k];
  throw Error('no fillers for ' + members);
}
function team(members, avoid) {
  const [f, k] = fillers(members, avoid), out = members.map(type => ({ type }));
  let melee = members.filter(m => !L.isRanged(m)).length, ranged = members.length - melee;
  while (out.length < 5) { if (melee <= ranged + 1) { out.push({ type: f }); melee++; } else { out.push({ type: k }); ranged++; } }
  return { units: out, fillers: [f, k] };
}
const ratio = (x, y) => L.geo(Object.keys(x).map(p => x[p] / y[p]));
const t0 = Date.now();
if (mode === 'trait') {
  const traits = a.only ? a.only.split(',') : Object.keys(T.D).filter(id => id !== 'Fairy');
  for (const id of traits) {
    const members = G.UNITS.filter(u => u.traits.includes(id)).map(u => u.id), tiers = T.D[id].thresholds || [2, 4];
    for (const [ti, k] of tiers.entries()) {
      if (members.length < k) continue;
      for (const combo of sample(members, k, COMBOS)) {
        const tm = team(combo, [id]);
        L.disableTrait(null); const on = L.panelStrength(tm.units, SEEDS);
        L.disableTrait(id); const off = L.panelStrength(tm.units, SEEDS); L.disableTrait(null);
        const row = { trait: id, category: T.D[id].category, tier: ti + 1, size: k, members: combo, fillers: tm.fillers, gain: ratio(on, off), on, off, nMembers: members.length };
        write(row); console.log(id.padEnd(20), 'tier' + (ti + 1), combo.join('+').padEnd(60), 'gain', row.gain.toFixed(3));
      }
    }
  }
} else {
  const units = a.only ? a.only.split(',') : G.UNITS.map(u => u.id).filter(id => tr(id)[0] !== 'Fairy');
  for (const x of units) {
    const fac = tr(x)[0], mates = G.UNITS.filter(u => u.id !== x && u.traits[0] === fac).map(u => u.id), size = Math.min(3, mates.length);
    for (const combo of sample(mates, size, Math.min(COMBOS, 2))) {
      const withX = team([x, ...combo], []);
      const [f] = withX.fillers, without = { units: [{ type: f }, ...withX.units.slice(1)] };
      const sw = L.panelStrength(withX.units, SEEDS), so = L.panelStrength(without.units, SEEDS);
      const row = { id: x, faction: fac, cost: G.BY[x].cost, mates: combo, fillers: withX.fillers, index: ratio(sw, so), with: sw, without: so };
      write(row); console.log(x.padEnd(18), fac.padEnd(20), combo.join('+').padEnd(50), 'index', row.index.toFixed(3));
    }
  }
}
console.error('total', ((Date.now() - t0) / 1000).toFixed(0) + 's');
