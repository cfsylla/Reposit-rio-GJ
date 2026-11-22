/* True Boss Fairy probe: where the enemy supports stand vs the boss (form 2), healing received by the boss, result.
 * Usage: GJ_ROOT=game_r3 node balance/sim/r3-fairy-probe.cjs <decks> <seeds a-b> <out.json> */
'use strict';
process.env.GJ_BOSS_LAB = '1'; process.env.GJ_LAB_ONLY = process.env.GJ_LAB_ONLY || 'fairy';
const fs = require('fs'); const R = require('./run.cjs'); const g = globalThis, T = g.JourneyTraits, Tree = g.JourneyTree, SP = g.JourneySupportB.SPEC;
const [decks = 'corsair', seeds = '1-10', out] = process.argv.slice(2);
const st = { samples: 0, behind: 0, outOfReach: 0, healToBoss: 0, rounds: 0, playerHitsBoss: 0, playerHitsSupport: 0 };
const bs = T.beforeStep; T.beforeStep = function (b, dt) { bs(b, dt); if (b.boss?.id !== 'fairy' || b.boss.form !== 2) return;
  const boss = b.units.find(u => u.raidBoss && u.hp > 0); if (!boss) return; if (!b._probe) { b._probe = 1; st.rounds++; }
  for (const u of b.units) if (u.side === 1 && u.hp > 0 && SP[u.type]) { st.samples++; if (u.y < boss.y) st.behind++; const near = Math.min(...b.units.filter(v => v.side === 0 && v.hp > 0).map(v => Math.hypot(v.x - u.x, v.y - u.y) - v.range)); if (near > 60) st.outOfReach++; } };
const host = Tree.beforeSettle; Tree.beforeSettle = function (b, living, pending) { host.call(Tree, b, living, pending); if (b.boss?.id === 'fairy' && b.boss.form === 2) for (const p of pending) if (p.heal && p.target.raidBoss) st.healToBoss += p.heal; };
const range = x => { const [a, c] = x.split('-').map(Number); return Array.from({ length: c - a + 1 }, (_, i) => a + i); };
const res = { win: 0, n: 0 };
for (const d of decks.split(',')) for (const seed of range(seeds)) { const r = R.playRun(d, seed, { prep: 'smart', route: 'greedy', events: 'safe', shop: 'balanced', tree: R.treePreset('nodes30'), treeBuy: 'all' }, { dt: 1 / 60 }); for (const x of r.bossLab || []) if (x.trueBoss) { res.n++; if (x.res === 'win') res.win++; } }
const o = { fairyFights: res.n, playerWin: res.n ? +(res.win / res.n).toFixed(3) : null, form2Rounds: st.rounds, supportsBehindBossShare: st.samples ? +(st.behind / st.samples).toFixed(3) : null, supportsOutOfReachShare: st.samples ? +(st.outOfReach / st.samples).toFixed(3) : null, healToBossPerForm2Round: st.rounds ? Math.round(st.healToBoss / st.rounds) : null };
console.log(JSON.stringify(o)); if (out) fs.writeFileSync(out, JSON.stringify(o, null, 1));
