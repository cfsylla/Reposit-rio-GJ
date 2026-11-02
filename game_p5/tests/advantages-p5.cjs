/* Vantagens (post-CP1, test copy): purchase with Insignia, always active (not in training), each of the 15 effects;
 * tree XP above the level cap converted into diamonds (1 per 20 XP). */
const assert = require('node:assert/strict');
for (const f of ['game-0', 'balance-p1', 'decks-p3', 'training-engine', 'raid-engine', 'monster-engine', 'acts-engine', 'enemy-decks-p4', 'boss-engine', 'map-variety', 'tree-data', 'tree-engine', 'journey-debug', 'content-v53', 'traits-v54', 'supports-b', 'challenges', 'advantages']) require('../dist/' + f + '.js');
const G = Game, P = Progress, T = JourneyTree, AD = JourneyAdvantages, A = JourneyActs;
P.load(P.freshProfile()); P.completeTutorial();
assert.equal(AD.LIST.length, 15);

// Purchase: 1 Insignia each, once.
P.profile.insignia = 1; assert(AD.buy('full_purse')); assert.equal(P.profile.insignia, 0); assert(!AD.buy('twin'), 'no Insignia'); P.profile.insignia = 5; assert(!AD.buy('full_purse'), 'already owned');
function own(ids) { P.profile.advantages = [...ids]; }
function run(ids, seed = 11, deck = 'vanguard') { own(ids); const s = G.fresh(deck, seed); G.enter(s, G.available(s)[0].id); return s; }
const base = run([]), cards = s => s.cards.length, lv = s => s.cards.reduce((n, c) => n + c.level, 0);
assert.equal(run(['full_purse']).gold, base.gold + 20);
assert.equal(lv(run(['pretraining'])), lv(base) + 2);
assert.equal(cards(run(['reinforcement'])), cards(base) + 1);
assert.equal(run(['travel_relic']).artifacts.length, base.artifacts.length + 1);
{ const s = run(['twin']); const opts = AD.twinOptions(s); assert(opts.length); assert(AD.twin(s, opts[0])); assert.equal(cards(s), cards(base) + 1); assert(!AD.twin(s, opts[0]), 'once'); }
{ const s = run(['chosen_relic']); const o = AD.startRelicOptions(s); assert.equal(o.length, 3); assert(AD.chooseStartRelic(s, o[0])); assert.equal(s.artifacts[0], o[0]); }
{ const s = run(['trained_eye']); s.phase = 'relic'; s.offers = G.unownedRelics(s).slice(0, 3); const before = [...s.offers]; assert(AD.rerollRelic(s)); assert.notDeepEqual(s.offers, before); assert(!AD.rerollRelic(s), 'once per map'); }
{ const b = run([]), e1 = G.energyIncome(b); b.round = 2; const e2 = G.energyIncome(b); const s = run(['saved_energy']); assert.equal(G.energyIncome(s), e1 + 1); s.round = 2; assert.equal(G.energyIncome(s), e2); }
{ const b = run([]), h = JourneyContent.handSize(b); const s = run(['steady_hand']); assert.equal(JourneyContent.handSize(s), h + 1); s.round = 2; assert.equal(JourneyContent.handSize(s), h); }
{ const s = run(['cleanse']); s.phase = 'shop'; s.current = { id: 'shopA', type: 'shop' }; s.gold = 0; const uid = s.cards.find(c => !JourneyContent.isCurse(c)).uid; assert.equal(G.price(s, 'remove', uid), 0); assert(G.shopService(s, 'remove', uid)); assert(G.price(s, 'remove', s.cards[0].uid) > 0, 'once per map'); }
{ const s = run(['rehearsal']); s.phase = 'shop'; s.current = { id: 'shopB', type: 'shop' }; s.gold = 999; s.offers = { cards: G.choices(s), artifacts: [] }; assert(G.buy(s, 'cards', 0)); assert.equal(s.cards.at(-1).level, 1); assert(G.buy(s, 'cards', 1)); assert.equal(s.cards.at(-1).level, 0, 'first card only'); }
{ const s = run(['interest']); s.gold = 100; s.current = { id: 'b', type: 'boss' }; P.finish(s, 'victory'); assert.equal(s.gold, 110); }
{ const s = run(['elite_hunter']); s.gold = 0; s.current = { ...s.current, type: 'elite' }; P.encounterWin(s); assert(s.gold >= 12); }
{ const s = run(['second_chance']); const n = s.current; G.startConfront(s, { ...n, type: 'battle' }); const mb = s.mapBattles; s.phase = 'defeat'; assert.equal(P.finish(s, 'defeat'), false); assert.equal(s.phase, 'prep'); assert.equal(s.mapBattles, mb); assert(!s.meta?.ended); s.phase = 'defeat'; P.finish(s, 'defeat'); assert(s.meta.ended, 'only once per run'); }
{ const s = run(['path_blessing']); const before = lv(s); s.current = s.map[14][0]; s.phase = 'battle'; s.score[0] = G.winsNeeded(s) - 1; G.finish(s, 'win'); assert.equal(s.phase, 'tree'); assert(T.continueRun(s)); assert.equal(A.act(s), 2); assert.equal(lv(s), before + 1); }
// Never in training.
{ own(AD.LIST.map(a => a.id)); const s = G.fresh('vanguard', 3); s.training = { wins: 1 }; assert.equal(AD.has(s, 'full_purse'), false); }
// Overflow XP -> diamonds (1 per 20 XP above level 30).
{ own([]); const st = T.profile(); st.totalXp = 300; st.overflowPaid = 0; const d = P.profile.diamonds || 0; const s = G.fresh('vanguard', 4); T.ensure(s).xp = 45; T.bank(s); assert.equal(P.profile.diamonds, d + 2); T.ensure(s).xp = 15; T.bank(s); assert.equal(P.profile.diamonds, d + 3); }
console.log('PASS advantages: 15 Advantages bought with Insignia, always active outside training, every effect; overflow tree XP -> diamonds (1 per 20).');
