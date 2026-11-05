/* Career simulator: a sequence of runs with a PERSISTENT permanent tree (profile), as a real player would progress.
 * Each run starts from the nodes bought in previous runs; XP is earned in the run (1 per fight, 2/4/6 per boss) and is
 * only converted into nodes at the tree session after each boss (lost on defeat), exactly as tree-engine.js.
 * Usage: GJ_ROOT=game node balance/sim/career.cjs --decks vanguard,astral --careers 1-2 --runs 40 --out file.jsonl
 *   one JSONL line per run: {deck, career, run, seed, result, act, wins, xp, nodesBefore, nodesAfter, costBefore, bought}
 * Policy: same player as the matrix (smart prep, greedy route, safe events, balanced shop); tree buy order = run.cjs
 * TREE_BUY_ORDER, then the cheapest connected node (--treebuy all). */
'use strict';
const fs = require('node:fs');
const { playRun } = require('./run.cjs');
const { TreeData, Tree, TREE_VARIANT: TV } = require('./engine.cjs');

const a = {}, v = process.argv.slice(2);
for (let i = 0; i < v.length; i += 2) a[v[i].replace(/^--/, '')] = v[i + 1];
const range = x => x.split(',').flatMap(p => { const [lo, hi] = p.split('-').map(Number); return hi ? Array.from({ length: hi - lo + 1 }, (_, i) => lo + i) : [lo]; });
const decks = (a.decks || 'vanguard').split(','), careers = range(a.careers || '1'), runs = Number(a.runs || 40);
const out = a.out ? fs.createWriteStream(a.out) : null;
const cost = ids => ids.reduce((t, id) => t + (TreeData.by[id]?.cost || 0), 0);
const xpOf = rec => rec.fights.filter(f => f.result === 'win' && !f.event).reduce((t, f) => t + (f.type === 'boss' ? (TV?.xpBoss ? TV.xpBoss[f.act - 1] : 2 * f.act) : (TV?.xpFight ? TV.xpFight[f.act - 1] : 1)), 0);

for (const deck of decks) for (const c of careers) {
  let unlocked = [], treeXp = 0;
  for (let k = 1; k <= runs; k++) {
    const seed = c * 1000 + k;
    const pol = { prep: 'smart', route: 'greedy', events: 'safe', shop: 'balanced', tree: [...unlocked], treeXp, treeBuy: 'all', order: null, forcewin: false };
    const before = unlocked.length, cBefore = cost(unlocked);
    const h0 = Tree.profile().history ? { ...Tree.profile().history } : null; // R3 model: XP earned / spent / lost in this run
    const rec = playRun(deck, seed, pol, { dt: 1 / 60 });
    const h1 = Tree.profile().history, xpR3 = h0 && h1 ? { earned: h1.earned - h0.earned, spent: h1.spent - h0.spent, lost: h1.lost - h0.lost, diamonds: h1.diamonds - h0.diamonds } : null;
    unlocked = [...unlocked, ...rec.treeBought];
    const banked = Tree.level ? rec.treeXp - treeXp : null; if (Tree.level) treeXp = rec.treeXp;
    const row = { deck, career: c, run: k, seed, result: rec.result, act: rec.act, wins: rec.wins, xpR3, windows: rec.windows || [], deathAt: rec.deathAt || null, xp: Tree.level ? banked : xpOf(rec), level: Tree.level ? Math.min(Tree.LEVEL.maxLevel, Math.floor(treeXp / 10)) : null, nodesBefore: before, nodesAfter: unlocked.length, costBefore: cBefore, bought: rec.treeBought };
    if (out) out.write(JSON.stringify(row) + '\n');
    console.log([deck, 'c' + c, 'run' + k, rec.result, 'act' + rec.act, 'wins=' + rec.wins, 'xp=' + row.xp, 'nodes ' + before + '->' + unlocked.length].join(' '));
  }
}
if (out) out.end();
