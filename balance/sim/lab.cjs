/* Character lab (FIXTURE, clearly artificial): fixed boards, no hand/energy/economy.
 * Question: how much does ONE character add to a neutral team?
 * Metric "força" (break-even multiplier): the largest multiplier applied to enemy HP and ATK at which the
 * test team still wins >= half of the seeds. Found by bisection. 1.30 = beats enemies 30% stronger.
 * Index = força(team with X) / força(same team with a neutral filler instead of X).
 * Real engine combat (createBattle/step 1/60; 40s x5 damage, 120s draw). Enemy base scale 1.00, no relics/tree.
 * Fillers never share a trait with X (so the setup itself activates no trait for X).
 * Usage: node balance/sim/lab.cjs --seeds 3 --levels 0,2,F --out file.jsonl [--units id,id] [--fill 0] */
'use strict';
const fs = require('node:fs');
const { G } = require('./engine.cjs');
const a = {}; process.argv.slice(2).forEach((v, i, arr) => { if (i % 2 === 0) a[v.replace(/^--/, '')] = arr[i + 1]; });
const SEEDS = Number(a.seeds || 3), LEVELS = (a.levels || '0,2,F').split(','), FL = Number(a.fill || 0);

const SB = Number(a.seedbase || 13);
const FRONTS = ['warrior', 'orc_warrior', 'viking', 'goblin_brute', 'samurai', 'gladiator', 'centaur_swordsman', 'elf_guardian'];
const BACKS = ['ranger', 'cowboy', 'goblin_archer', 'elf_archer', 'huntress', 'dark_elf_archer', 'gunner', 'goblin_bomber'];
const tr = id => G.BY[id].traits;
const disjoint = (x, y) => !tr(x).some(t => tr(y).includes(t));
function fillersFor(x) {
  for (const f of FRONTS) for (const k of BACKS) if (f !== x && k !== x && disjoint(f, k) && disjoint(f, x) && disjoint(k, x)) return [f, k];
  throw Error('no filler for ' + x);
}
const PANEL = {
  brawlers: ['viking', 'berserker', 'orc_berserker', 'fighter', 'shieldmaiden'],
  shooters: ['bastion', 'gunner', 'crossbowman', 'cowboy', 'musketeer'],
  fortress: ['bastion', 'troll', 'shaolin', 'gladiator', 'ranger'],
  assassins: ['shinobi', 'feline_rogue', 'dark_elf_noble', 'ronin', 'archer'],
  area: ['warrior', 'lancer', 'mage', 'cannoneer', 'miner'],
  sustain: ['elf_guardian', 'shieldmaiden', 'priestess', 'shaman', 'elf_archer'],
};
const FRONT_POS = [2, 1, 3, 0, 4], BACK_POS = [12, 11, 13, 10, 14];
const isRanged = id => G.BY[id].range > 100;

function battle(team, foes, seed, mult, track) {
  const s = G.fresh('vanguard', seed);
  s.artifacts = []; s.reserve = []; s.bag = { items: [] }; s.cards = []; s.serial = 0;
  s.current = { id: 'lab', type: 'battle', name: 'Lab', layer: 5 }; s.phase = 'prep'; s.round = 5; s.mapBattles = 8; s.encounters = 1;
  s.board = Array(15).fill(null); s.bench = Array(6).fill(null); s.fusions = {}; s.deployedAt = {}; s.deploySerial = 0; s.hand = []; s.draw = []; s.discard = [];
  const fronts = [...FRONT_POS], backs = [...BACK_POS];
  for (const m of team) {
    const make = () => { const c = { uid: 'p' + (++s.serial), type: m.type, level: m.level }; s.cards.push(c); return c; };
    const c = make();
    if (m.fused) { const b2 = make(), b3 = make(); s.fusions[c.uid] = [c.uid, b2.uid, b3.uid]; }
    const mid = process.env.LAB_XROW === '1' && m === team[0];
    s.board[mid ? 7 : isRanged(m.type) ? backs.shift() : fronts.shift()] = c.uid; s.deployedAt[c.uid] = ++s.deploySerial;
  }
  const fF = [...FRONT_POS], fB = [...BACK_POS], cards = foes.map((type, i) => ({ uid: 'e' + i, type, level: 0 })), board = Array(15).fill(null);
  for (const c of cards) board[isRanged(c.type) ? fB.shift() : fF.shift()] = c.uid;
  s.ai = { cards, draw: [], discard: [], hand: [], board, bench: Array(6).fill(null), fusions: {}, deployedAt: {}, deploySerial: 0, lastRound: s.round, round: s.round, energy: 0,
    elite: false, deckId: null, strategy: 'balanced', boostedTypes: [], artifacts: [], bag: { items: [] } };
  const b = G.createBattle(s);
  for (const u of b.units.filter(u => u.side === 1)) { u.hp *= mult; u.maxhp *= mult; u.atk *= mult; } // FIXTURE handicap
  const x = b.units.find(u => u.side === 0 && u.uid === 'p1');
  let firstCast = null, healed = 0; const prev = new Map(b.units.map(u => [u, u.hp]));
  while (!b.result && b.time < 200) {
    G.step(b, 1 / 60);
    if (track) {
      if (firstCast === null && (x.skillCasts || 0) > 0) firstCast = b.time;
      for (const u of b.units) { const p = prev.get(u); if (u.side === 0 && p > 0 && u.hp > p) healed += u.hp - p; prev.set(u, u.hp); }
      if (x.hp <= 0 && x.deathAt === undefined) x.deathAt = b.time;
    }
  }
  return { win: b.result === 'win', time: b.time, dealt: x.damageDealt || 0, taken: x.damageTaken || 0, lived: x.hp > 0 ? b.time : (x.deathAt ?? b.time), alive: x.hp > 0, casts: x.skillCasts || 0, firstCast, healed };
}
function strength(team, foes) {
  // bisection in log space on [0.25, 4]
  let lo = Math.log(.25), hi = Math.log(4);
  const wins = m => { let w = 0; for (let sd = 1; sd <= SEEDS; sd++) w += battle(team, foes, sd * 7919 + SB, m).win ? 1 : 0; return w * 2 >= SEEDS + (SEEDS % 2 ? 1 : 0); };
  if (!wins(Math.exp(lo))) return .25; if (wins(Math.exp(hi))) return 4;
  for (let i = 0; i < 8; i++) { const mid = (lo + hi) / 2; if (wins(Math.exp(mid))) lo = mid; else hi = mid; }
  return Math.exp((lo + hi) / 2);
}
const units = a.units ? a.units.split(',') : G.UNITS.map(u => u.id);
const out = a.out ? { write: l => fs.appendFileSync(a.out, l) } : null, t0 = Date.now(), baseCache = {};
function baseline(f, k) {
  const key = f + '|' + k; if (baseCache[key]) return baseCache[key];
  const team = [{ type: f, level: FL }, { type: f, level: FL }, { type: f, level: FL }, { type: k, level: FL }, { type: k, level: FL }];
  return baseCache[key] = Object.fromEntries(Object.entries(PANEL).map(([p, foes]) => [p, strength(team, foes)]));
}
for (const id of units) {
  if (process.env.GJ_OV_TESTED_ONLY === '1') process.env.GJ_OV_ONLY = id;
  const [f, k] = fillersFor(id), base = baseline(f, k);
  for (const lv of LEVELS) {
    const team = [{ type: id, level: lv === 'F' ? 0 : Number(lv), fused: lv === 'F' }, { type: f, level: FL }, { type: f, level: FL }, { type: k, level: FL }, { type: k, level: FL }];
    const per = {};
    for (const [p, foes] of Object.entries(PANEL)) {
      const st = strength(team, foes);
      const rs = []; for (let sd = 1; sd <= SEEDS; sd++) rs.push(battle(team, foes, sd * 7919 + SB, 1, true)); // detail at even strength
      const m = key => rs.reduce((n, r) => n + (r[key] || 0), 0) / rs.length, fc = rs.filter(r => r.firstCast !== null);
      per[p] = { strength: st, base: base[p], index: st / base[p], winAt1: m('win'), dealt: m('dealt'), taken: m('taken'), lived: m('lived'), time: m('time'), casts: m('casts'), healed: m('healed'),
        firstCast: fc.length ? fc.reduce((n, r) => n + r.firstCast, 0) / fc.length : null };
    }
    const geo = Math.exp(Object.values(per).reduce((n, p) => n + Math.log(p.index), 0) / 6);
    const row = { id, level: lv, cost: G.BY[id].cost, rarity: G.BY[id].rarity, traits: G.BY[id].traits, fillers: [f, k], index: geo, per };
    if (out) out.write(JSON.stringify(row) + '\n');
    console.log(id.padEnd(18), lv, 'index', geo.toFixed(2), Object.entries(per).map(([p, v]) => p.slice(0, 5) + ':' + v.index.toFixed(2)).join(' '));
  }
}

console.error('total', ((Date.now() - t0) / 1000).toFixed(0) + 's');
