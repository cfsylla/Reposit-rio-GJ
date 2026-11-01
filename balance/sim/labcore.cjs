/* Shared lab primitives (FIXTURE): fixed boards, real combat, enemy handicap multiplier, break-even search.
 * Same method as lab.cjs. Extra fixture switch: disableTrait(name) removes ONE trait from the PLAYER's
 * trait counts (wrapping Game.counts, used by traits-v54 for tiers), to compare "trait on" vs "trait off"
 * with the exact same units. Enemy counts are never touched. */
'use strict';
const { G } = require('./engine.cjs');
const PANEL = {
  brawlers: ['viking', 'berserker', 'orc_berserker', 'fighter', 'shieldmaiden'],
  shooters: ['bastion', 'gunner', 'crossbowman', 'cowboy', 'musketeer'],
  fortress: ['bastion', 'troll', 'shaolin', 'gladiator', 'ranger'],
  assassins: ['shinobi', 'feline_rogue', 'dark_elf_noble', 'ronin', 'archer'],
  area: ['warrior', 'lancer', 'mage', 'cannoneer', 'miner'],
  sustain: ['elf_guardian', 'shieldmaiden', 'priestess', 'shaman', 'elf_archer'],
};
const FRONTS = ['warrior', 'orc_warrior', 'viking', 'goblin_brute', 'samurai', 'gladiator', 'centaur_swordsman', 'elf_guardian'];
const BACKS = ['ranger', 'cowboy', 'goblin_archer', 'elf_archer', 'huntress', 'dark_elf_archer', 'gunner', 'goblin_bomber'];
const FRONT_POS = [2, 1, 3, 0, 4, 7, 6, 8, 5, 9], BACK_POS = [12, 11, 13, 10, 14, 7, 6, 8, 5, 9];
const isRanged = id => G.BY[id].range > 100;
const tr = id => G.BY[id].traits;

let disabled = null;
const realCounts = G.counts;
G.counts = function (cards) {
  const out = realCounts(cards);
  if (disabled && cards.length && !cards.some(c => String(c.uid).startsWith('e'))) delete out[disabled];
  return out;
};
function disableTrait(name) { disabled = name || null; }

function battle(team, foes, seed, mult) {
  const s = G.fresh('vanguard', seed);
  s.artifacts = []; s.reserve = []; s.bag = { items: [] }; s.cards = []; s.serial = 0;
  s.current = { id: 'lab', type: 'battle', name: 'Lab', layer: 5 }; s.phase = 'prep'; s.round = 5; s.mapBattles = 8; s.encounters = 1;
  s.board = Array(15).fill(null); s.bench = Array(6).fill(null); s.fusions = {}; s.deployedAt = {}; s.deploySerial = 0; s.hand = []; s.draw = []; s.discard = [];
  const fronts = [...FRONT_POS], backs = [...BACK_POS];
  for (const m of team) {
    const c = { uid: 'p' + (++s.serial), type: m.type, level: m.level || 0 }; s.cards.push(c);
    let pos = isRanged(m.type) ? backs.shift() : fronts.shift(); while (s.board[pos] !== null) pos = (isRanged(m.type) ? backs : fronts).shift();
    s.board[pos] = c.uid; s.deployedAt[c.uid] = ++s.deploySerial;
  }
  const fF = [...FRONT_POS], fB = [...BACK_POS], cards = foes.map((type, i) => ({ uid: 'e' + i, type, level: 0 })), board = Array(15).fill(null);
  for (const c of cards) board[isRanged(c.type) ? fB.shift() : fF.shift()] = c.uid;
  s.ai = { cards, draw: [], discard: [], hand: [], board, bench: Array(6).fill(null), fusions: {}, deployedAt: {}, deploySerial: 0, lastRound: s.round, round: s.round, energy: 0,
    elite: false, deckId: null, strategy: 'balanced', boostedTypes: [], artifacts: [], bag: { items: [] } };
  const b = G.createBattle(s);
  for (const u of b.units.filter(u => u.side === 1)) { u.hp *= mult; u.maxhp *= mult; u.atk *= mult; }
  while (!b.result && b.time < 200) G.step(b, 1 / 60);
  return b.result === 'win';
}
function strength(team, foes, seeds = 3, sb = 13) {
  let lo = Math.log(.25), hi = Math.log(4);
  const wins = m => { let w = 0; for (let sd = 1; sd <= seeds; sd++) w += battle(team, foes, sd * 7919 + sb, m) ? 1 : 0; return w * 2 > seeds; };
  if (!wins(Math.exp(lo))) return .25; if (wins(Math.exp(hi))) return 4;
  for (let i = 0; i < 8; i++) { const mid = (lo + hi) / 2; if (wins(Math.exp(mid))) lo = mid; else hi = mid; }
  return Math.exp((lo + hi) / 2);
}
function panelStrength(team, seeds, sb) { return Object.fromEntries(Object.entries(PANEL).map(([p, foes]) => [p, strength(team, foes, seeds, sb)])); }
const geo = arr => Math.exp(arr.reduce((n, x) => n + Math.log(x), 0) / arr.length);
module.exports = { G, PANEL, FRONTS, BACKS, isRanged, tr, battle, strength, panelStrength, disableTrait, geo };
