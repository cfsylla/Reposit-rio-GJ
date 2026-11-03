/* Post-game career (Desafios da Jornada ladder), continuing a career after the first victory, with the real rules:
 *  - the tree keeps growing with banked XP (starts at --startLevel, default 25 = typical first-victory level);
 *  - the player always attempts the highest unlocked challenge level N (N challenges active);
 *  - winning level N for the first time unlocks N+1 and grants 1 Insignia, spent at once on the next Advantage;
 *  - defeats change nothing (the player retries).
 * Path (--path easy|hard) decides WHICH challenges are active at level N and WHICH Advantage is bought next:
 *   easy = lightest challenges first + strongest Advantages first (the easiest way up: worst case for the design);
 *   hard = heaviest challenges first + weakest Advantages first.
 * Orders come from --orders file.json { challenges: [ids, lightest first], advantages: [ids, strongest first] }.
 * Usage: GJ_ROOT=game_p5 node balance/sim/postgame.cjs --decks a,b --careers 1-2 --runs 60 --path easy --orders o.json --out f.jsonl */
'use strict';
const fs = require('node:fs');
const { playRun, treePreset } = require('./run.cjs');
const { TreeData, Tree } = require('./engine.cjs');
const a = {}, v = process.argv.slice(2);
for (let i = 0; i < v.length; i += 2) a[v[i].replace(/^--/, '')] = v[i + 1];
const range = x => x.split(',').flatMap(p => { const [lo, hi] = p.split('-').map(Number); return hi ? Array.from({ length: hi - lo + 1 }, (_, i) => lo + i) : [lo]; });
const decks = (a.decks || 'vanguard').split(','), careers = range(a.careers || '1'), runs = Number(a.runs || 60), path = a.path || 'easy';
const startLevel = Number(a.startLevel || 25);
const O = JSON.parse(fs.readFileSync(a.orders, 'utf8'));
const chOrder = path === 'easy' ? O.challenges : [...O.challenges].reverse();
const adOrder = path === 'easy' ? O.advantages : [...O.advantages].reverse();
const MAX = chOrder.length;
const out = a.out ? fs.createWriteStream(a.out) : null;
for (const deck of decks) for (const c of careers) {
  let unlocked = treePreset('cap' + startLevel * 10), treeXp = startLevel * 10, available = 1, won = 0, ads = [];
  for (let k = 1; k <= runs && won < MAX; k++) {
    const n = available, active = chOrder.slice(0, n);
    const seed = 50000 + c * 1000 + k;
    const pol = { prep: 'smart', route: 'greedy', events: 'safe', shop: 'balanced', tree: [...unlocked], treeXp, treeBuy: 'all', order: null, forcewin: false, challenges: active, advantages: ads.join(',') || null };
    const lvl = Math.min(Tree.LEVEL.maxLevel, Math.floor(treeXp / 10));
    const rec = playRun(deck, seed, pol, { dt: 1 / 60 });
    unlocked = [...unlocked, ...rec.treeBought]; treeXp = rec.treeXp ?? treeXp;
    const victory = rec.result === 'victory';
    const row = { deck, career: c, path, run: k, level: n, active, advantages: [...ads], treeLevel: lvl, result: rec.result, wins: rec.wins, act: rec.act };
    if (victory && n > won) { won = n; available = Math.min(MAX, n + 1); const next = adOrder.find(id => !ads.includes(id)); if (next) ads.push(next); row.cleared = true; }
    if (out) out.write(JSON.stringify(row) + '\n');
    console.log([deck, 'c' + c, path, 'run' + k, 'nivel ' + n, 'arvore ' + lvl, 'vant ' + row.advantages.length, rec.result, 'wins=' + rec.wins].join(' '));
  }
}
if (out) out.end();
