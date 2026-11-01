/* AoE check (FIXTURE): index of a unit vs a swarm of 6 melee enemies (clustered contact), same method as lab.cjs.
 * Usage: node balance/sim/swarm.cjs id,id,... */
'use strict';
const L = require('./labcore.cjs'), { G, tr } = L;
const SWARM = ['fighter', 'pirate', 'feline_fighter', 'goblin_spearman', 'woodland_lancer', 'feline_swordsman'];
const dis = (x, y) => !tr(x).some(t => tr(y).includes(t));
function fill(x) { for (const f of L.FRONTS) for (const k of L.BACKS) if (f !== x && k !== x && dis(f, k) && dis(f, x) && dis(k, x)) return [f, k]; }
for (const x of process.argv[2].split(',')) {
  const [f, k] = fill(x), with_ = [{ type: x }, { type: f }, { type: f }, { type: k }, { type: k }], base = [{ type: f }, { type: f }, { type: f }, { type: k }, { type: k }];
  const a = L.strength(with_, SWARM, 3), b = L.strength(base, SWARM, 3);
  console.log(x.padEnd(16), G.BY[x].areaLabel.padEnd(13), 'swarm index', (a / b).toFixed(2));
}
