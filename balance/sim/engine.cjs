/* Loads the REAL Grand Journey engine (dist/*.js) headlessly, in index.html order,
 * restricted to the non-UI modules. No game values are modified here.
 * GJ_ROOT selects the game copy (default: ../../v54, the intact v54 baseline). */
'use strict';
const path = require('node:path');
const ROOT = path.resolve(process.env.GJ_ROOT || path.join(__dirname, '../../v54'));
// Same relative order as dist/index.html (UI/asset-only scripts omitted).
const MODULES = ['game-0', 'training-engine', 'raid-engine', 'monster-engine', 'acts-engine', 'boss-engine',
  'map-variety', 'tree-data', 'tree-engine', 'journey-debug', 'content-v53', 'traits-v54', 'map-notes', 'cycle-data'];
for (const m of MODULES) require(path.join(ROOT, 'dist', m + '.js'));
const g = globalThis;
module.exports = {
  ROOT, MODULES,
  G: g.Game, P: g.Progress, C: g.JourneyContent, T: g.JourneyTraits, A: g.JourneyActs, R: g.JourneyRaid,
  B: g.JourneyBosses, Tree: g.JourneyTree, TreeData: g.JourneyTreeData, Training: g.Training,
};
