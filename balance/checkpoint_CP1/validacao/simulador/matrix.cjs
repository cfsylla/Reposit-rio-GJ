/* Deck vs deck tournament in Training mode (real engine, both sides with deck/hand/energy/fusion):
 * player uses the 'smart' policy, enemy uses the game's own AI. Each pair is played in both seats? No: the player
 * seat is the row deck; to remove seat bias every pair is played twice (A as player vs B, B as player vs A).
 * difficulty 'elite' (enemy scale 0.92 in Training) is the same for everyone, so it cancels out in the ranking.
 * Usage: GJ_ROOT=game node balance/sim/matrix.cjs --decks file.json --seeds 6 --out out.jsonl [--only a,b] */
'use strict';
const fs = require('node:fs');
const { G, Training } = require('./engine.cjs');
const Pol = require('./policy.cjs');
const a = {}; process.argv.slice(2).forEach((v, i, arr) => { if (i % 2 === 0) a[v.replace(/^--/, '')] = arr[i + 1]; });
const D = JSON.parse(fs.readFileSync(a.decks, 'utf8')).decks, SEEDS = Number(a.seeds || 6);
const only = a.only ? a.only.split(',') : D.map(d => d.id);
const side = d => ({ source: 'custom', cards: Object.entries(d.counts).flatMap(([type, n]) => Array(n).fill(0).map(() => ({ type, level: 0 }))), relics: [d.startRelic] });
const visible = G.UNITS.map(u => u.id);
const opp = a.opponents ? a.opponents.split(',') : D.map(d => d.id); // optional: restrict opponents (e.g. exclude candidate variants)
for (const A of D.filter(d => only.includes(d.id))) for (const B of D.filter(d => opp.includes(d.id))) {
  let wins = 0, rounds = 0, roundWins = 0;
  for (let sd = 1; sd <= SEEDS; sd++) {
    const cfg = { difficulty: 'elite', wins: 3, player: side(A), enemy: side(B) };
    const s = Training.build(cfg, sd * 131 + 7, visible);
    for (let g = 0; g < 12 && s.phase === 'prep'; g++) {
      Pol.prep(s, { prep: 'smart' }, {}); const b = G.createBattle(s); if (!b) break;
      while (!b.result && b.time < 200) G.step(b, 1 / 60);
      rounds++; if (b.result === 'win') roundWins++;
      G.finish(s, b.result || 'draw'); if (s.phase === 'roundResult') G.nextRound(s);
    }
    if (s.phase === 'victory') wins++;
  }
  const row = { a: A.id, b: B.id, seeds: SEEDS, wins, rounds, roundWins };
  if (a.out) fs.appendFileSync(a.out, JSON.stringify(row) + '\n');
}
console.error('done', only.join(','));
