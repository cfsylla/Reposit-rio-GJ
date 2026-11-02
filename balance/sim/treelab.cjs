/* Tree lab (FIXTURE): combat value of permanent tree nodes, same method as lab.cjs / labcore.cjs.
 * Fixed neutral team vs the 6-team panel; "força" = largest enemy HP/ATK multiplier still beaten by >= half the seeds.
 * Value of a node set = geometric mean over the panel of força(with set) / força(no tree).
 * Groups of identical basic nodes are measured together (e.g. all 6 attack nodes) and also reported per node.
 * Economy nodes (gold, discount, market, candidates, ...) have no combat effect and are measured in full runs instead.
 * Usage: GJ_ROOT=game node balance/sim/treelab.cjs --seeds 5 --out file.jsonl */
'use strict';
const fs = require('node:fs');
const L = require('./labcore.cjs');
const { Tree, TreeData } = require('./engine.cjs');
const a = {}; process.argv.slice(2).forEach((v, i, arr) => { if (i % 2 === 0) a[v.replace(/^--/, '')] = arr[i + 1]; });
const SEEDS = Number(a.seeds || 5);
const TEAMS = {
  // neutral team used by the character lab, at level 1 (mid-run strength)
  neutral: ['warrior', 'viking', 'samurai', 'ranger', 'gunner'].map(type => ({ type, level: 1 })),
  // a sustain/shield team so that heal / shield nodes have something to amplify
  sustain: ['elf_guardian', 'shieldmaiden', 'gladiator', 'priestess', 'elf_archer'].map(type => ({ type, level: 1 })),
};
const ids = p => TreeData.nodes.filter(n => n.id.startsWith(p)).map(n => n.id);
const MID25 = require('./run.cjs').TREE_PRESETS.mid25;
const SETS = {
  none: [],
  atk_x6: ids('pow_atk_'), crit_x2: ids('pow_crit_'), cdamage_x2: ids('pow_cdamage_'),
  hp_x6: ids('vit_hp_'), heal_x2: ids('vit_heal_'), def_x6: ids('def_armor_'), control_x2: ids('def_control_'),
  rate_x5: ids('agi_rate_'), move_x3: ids('agi_move_'),
  first_impact: ['first_impact'], execution: ['execution'], penetration: ['penetration'], devastating: ['devastating'],
  urgent_heal: ['urgent_heal'], second_wind: ['second_wind'], survival: ['survival'],
  formation: ['formation'], strong_shields: ['strong_shields'], last_line: ['last_line'],
  sprint: ['sprint'], momentum: ['momentum'], readiness: ['readiness'], rhythm: ['rhythm'],
  mid25: MID25, full: TreeData.nodes.map(n => n.id),
};
const only = a.sets ? a.sets.split(',') : Object.keys(SETS);
const out = a.out ? fs.createWriteStream(a.out) : null;
for (const [team, units] of Object.entries(TEAMS)) {
  for (const name of only) {
    Tree.profile().unlocked = [...SETS[name]];
    const per = L.panelStrength(units, SEEDS, 13), g = L.geo(Object.values(per));
    const row = { team, set: name, nodes: SETS[name].length, cost: SETS[name].reduce((t, id) => t + TreeData.by[id].cost, 0), forca: g, panel: per };
    if (out) out.write(JSON.stringify(row) + '\n');
    console.log(team, name, 'nodes=' + row.nodes, 'cost=' + row.cost, 'força=' + g.toFixed(3));
  }
}
Tree.profile().unlocked = [];
if (out) out.end();
