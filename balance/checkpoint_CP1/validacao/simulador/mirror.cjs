/* Policy calibration via Training mode (real engine): player policy vs the game's AI, same deck both sides.
 * Note: Training 'normal' scales enemy hp/atk by 0.86 (createBattle); 'elite' by 0.92 and AI uses elite heuristic.
 * Usage: node balance/sim/mirror.cjs --prep smart --difficulty elite --seeds 1-30 [--decks a,b] [--enemy deck] [--level 0] */
'use strict';
const { G, Training } = require('./engine.cjs');
const Pol = require('./policy.cjs');
const a = {}; process.argv.slice(2).forEach((v, i, arr) => { if (i % 2 === 0) a[v.replace(/^--/, '')] = arr[i + 1]; });
const [lo, hi] = (a.seeds || '1-20').split('-').map(Number);
const decks = (a.decks || G.DECKS.map(d => d.id).join(',')).split(',');
const lvl = Number(a.level || 0), diff = a.difficulty || 'elite';
let tot = { rw: 0, rp: 0, ew: 0, n: 0 };
for (const deck of decks) {
  let rw = 0, rp = 0, ew = 0, n = 0, dur = 0;
  for (let seed = lo; seed <= hi; seed++) {
    const cfg = Training.defaults(); cfg.difficulty = diff; cfg.wins = 3;
    cfg.player = Training.side(deck); cfg.enemy = Training.side(a.enemy || deck);
    cfg.player.cards.forEach(c => c.level = lvl); cfg.enemy.cards.forEach(c => c.level = lvl);
    const s = Training.build(cfg, seed);
    for (let g = 0; g < 12 && s.phase === 'prep'; g++) {
      Pol.prep(s, { prep: a.prep || 'smart' }, {});
      const b = G.createBattle(s); if (!b) break;
      while (!b.result && b.time < 200) G.step(b, 1 / 60);
      rp++; if (b.result === 'win') rw++; dur += b.time;
      G.finish(s, b.result || 'draw'); if (s.phase === 'roundResult') G.nextRound(s);
    }
    n++; if (s.phase === 'victory') ew++;
  }
  tot.rw += rw; tot.rp += rp; tot.ew += ew; tot.n += n;
  console.log(deck.padEnd(9), 'vs', (a.enemy || deck).padEnd(9), 'rounds won', (100 * rw / rp).toFixed(0) + '%', 'encounters won', ew + '/' + n, 'avg round', (dur / rp).toFixed(1) + 's');
}
console.log('TOTAL prep=' + (a.prep || 'smart'), diff, 'round win', (100 * tot.rw / tot.rp).toFixed(1) + '%', 'encounter win', (100 * tot.ew / tot.n).toFixed(1) + '%');
