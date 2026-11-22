/* Balance P3: 24 borrowed decks, counts format, starting relics, unlocks (milestones, order bosses, save migration), hidden order decks. */
const assert = require('node:assert/strict');
for (const f of ['game-0', 'balance-p1', 'decks-p3', 'training-engine', 'raid-engine', 'monster-engine', 'acts-engine', 'boss-engine', 'map-variety', 'tree-data', 'tree-engine', 'journey-debug', 'content-v53', 'traits-v54', 'supports-b']) require('../dist/' + f + '.js');
const G = Game, P = Progress, X = JourneyDecksP3;
assert.equal(G.DECKS.length, 24);
const ids = new Set(G.DECKS.map(d => d.id)); for (const old of ['vanguard', 'balanced', 'swift', 'arcane', 'outlaws', 'fortress', 'blades', 'fireline', 'astral', 'corsair']) assert(ids.has(old), 'existing id kept: ' + old);
const used = new Set();
for (const d of G.DECKS) {
  const cards = G.deckCards(d); assert.equal(cards.length, 20, d.id);
  const n = {}; for (const t of cards) { n[t] = (n[t] || 0) + 1; used.add(t); assert(G.BY[t], t); if (G.BY[t].order) assert.equal(G.BY[t].order, d.order, d.id + ' order units only in order decks'); }
  assert(Math.max(...Object.values(n)) <= 4, d.id); assert(G.packBag([d.startRelic]), d.id + ' relic fits'); assert.equal(P.START_RELICS[d.id], d.startRelic);
  P.load(P.freshProfile()); const s = G.fresh(d.id, 11); assert.equal(s.cards.length, 20); assert.deepEqual(s.artifacts, [d.startRelic]);
}
assert.equal(used.size, 77, 'every character appears in some deck');
// Fresh profile: only the starter; order decks locked; elites never use order decks before unlock.
P.load(P.freshProfile()); assert.deepEqual(P.profile.decks, ['vanguard']);
for (let seed = 1; seed <= 200; seed++) { const s = G.fresh('vanguard', seed); s.layer = 4; s.phase = 'map'; s.route = [s.map[3][0].id]; const n = G.available(s).find(n => n.type === 'elite' && !n.campaign); if (!n) continue; G.enter(s, n.id); if (s.ai?.deckId) assert(!G.DECKS.find(d => d.id === s.ai.deckId)?.order, 'elite uses order deck ' + s.ai.deckId); }
// Milestone unlock and save migration.
P.load(P.freshProfile()); P.profile.stats.elites = 1; P.check(); assert(P.profile.decks.includes('keen'));
const old = P.freshProfile(); old.milestones = ['elite', 'events']; old.decks = ['vanguard']; P.load(old); assert(P.profile.decks.includes('keen') && P.profile.decks.includes('verdant'), 'migration grants decks of completed milestones');
// Order boss and true boss unlocks.
const ob = P.freshProfile(); ob.blackfangUnlocked = true; P.load(ob); assert(P.profile.decks.includes('greenskins') && P.profile.decks.includes('goblin_horde') && !P.profile.decks.includes('dark_court'));
const tb = P.freshProfile(); tb.dawncrestUnlocked = true; tb.stats.trueBoss_dawncrest = 1; P.load(tb); for (const id of ['meowri_band', 'high_court', 'forest_guard', 'centaur_charge', 'dawncrest_choir']) assert(P.profile.decks.includes(id), id);
// New milestone: boss of map 2.
P.load(P.freshProfile()); P.profile.stats.map2Bosses = 1; P.check(); assert(P.profile.decks.includes('quake'));
console.log('PASS P3: 24 decks (counts, 20 cards, max 4, relics), all 77 characters used, hidden order decks, milestone/order/true-boss unlocks and save migration.');
