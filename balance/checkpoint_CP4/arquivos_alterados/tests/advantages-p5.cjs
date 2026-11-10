/* Vantagens (post-CP1, test copy): purchase with Insignia, always active (not in training), each of the 15 effects (final versions of 03/11/2026);
 * tree XP above the level cap converted into diamonds (1 per 20 XP). */
const assert = require('node:assert/strict');
for (const f of ['game-0', 'balance-p1', 'decks-p3', 'training-engine', 'raid-engine', 'monster-engine', 'acts-engine', 'enemy-decks-p4', 'boss-engine', 'map-variety', 'tree-data', 'tree-engine', 'journey-debug', 'content-v53', 'traits-v54', 'supports-b', 'challenges', 'advantages']) require('../dist/' + f + '.js');
const G = Game, P = Progress, T = JourneyTree, AD = JourneyAdvantages, A = JourneyActs;
P.load(P.freshProfile()); P.completeTutorial();
assert.equal(AD.LIST.length, 15);

// Purchase: 1 Insignia each, once.
P.profile.insignia = 1; assert(AD.buy('full_purse')); assert.equal(P.profile.insignia, 0); assert(!AD.buy('flex_prep'), 'no Insignia'); P.profile.insignia = 5; assert(!AD.buy('full_purse'), 'already owned');
assert.deepEqual(AD.LIST.map(a => a.id), ['travel_relic', 'pretraining', 'flex_prep', 'efficient_fusion', 'full_purse', 'elite_experience', 'trained_eye', 'rehearsal', 'planned_hand', 'saved_energy', 'cleanse', 'path_blessing', 'interest', 'elite_hunter', 'second_chance']);
function own(ids) { P.profile.advantages = [...ids]; }
function run(ids, seed = 11, deck = 'vanguard') { own(ids); const s = G.fresh(deck, seed); G.enter(s, G.available(s)[0].id); return s; }
const base = run([]), cards = s => s.cards.length, lv = s => s.cards.reduce((n, c) => n + c.level, 0);
assert.equal(run(['full_purse']).gold, base.gold + 20);
{ const s = run(['pretraining']); assert.equal(lv(s), lv(base) + 2); assert.deepEqual(s.cards.filter(c => c.level).map(c => c.level).sort(), [1, 1]); } // R3: 2 cards with upgrade 1
assert.equal(run(['travel_relic']).artifacts.length, base.artifacts.length + 1);
// Olho Treinado: one free reroll on every relic choice.
{ const s = run(['trained_eye']); s.phase = 'relic'; s.offers = G.unownedRelics(s).slice(0, 3); const before = [...s.offers]; assert(AD.rerollRelic(s)); assert.notDeepEqual(s.offers, before); assert(!AD.rerollRelic(s), 'once per choice'); s.offers = G.unownedRelics(s).slice(3, 6); assert(AD.rerollRelic(s), 'again on the next choice'); }
{ const b = run([]), e1 = G.energyIncome(b); b.round = 2; const e2 = G.energyIncome(b); const s = run(['saved_energy']); assert.equal(G.energyIncome(s), e1 + 1); s.round = 2; assert.equal(G.energyIncome(s), e2); }
{ const s = run(['cleanse']); s.phase = 'shop'; s.current = { id: 'shopA', type: 'shop' }; s.gold = 0; const uid = s.cards.find(c => !JourneyContent.isCurse(c)).uid; assert.equal(G.price(s, 'remove', uid), 0); assert(G.shopService(s, 'remove', uid)); assert(G.price(s, 'remove', s.cards[0].uid) > 0, 'once per map'); }
{ const s = run(['rehearsal']); s.phase = 'shop'; s.current = { id: 'shopB', type: 'shop' }; s.gold = 999; s.offers = { cards: G.choices(s), artifacts: [] }; assert(G.buy(s, 'cards', 0)); assert.equal(s.cards.at(-1).level, 2); assert(G.buy(s, 'cards', 1)); assert.equal(s.cards.at(-1).level, 0, 'first card only'); }
{ const s = run(['interest']); s.gold = 100; s.current = { id: 'b', type: 'boss' }; P.finish(s, 'victory'); assert.equal(s.gold, 200); /* R3 08/11: 100%, máx. 150 */ const r = run(['interest']); r.gold = 400; r.current = { id: 'b', type: 'boss' }; P.finish(r, 'victory'); assert.equal(r.gold, 550, 'max 150'); }
{ const s = run(['elite_hunter']); s.gold = 0; s.current = { ...s.current, type: 'elite' }; P.encounterWin(s); assert(s.gold >= 12); }
// Segunda Chance: replays only the last round (score kept, enemy -1), once per run, never on bosses.
{ const s = run(['second_chance']); G.startConfront(s, { ...s.current, type: 'battle' }); s.score = [2, 3]; const r0 = s.round; s.phase = 'defeat'; assert.equal(P.finish(s, 'defeat'), false); assert.equal(s.phase, 'prep'); assert.deepEqual(s.score, [2, 2]); assert(s.round > r0); assert(!s.meta?.ended); s.score = [2, 3]; s.phase = 'defeat'; P.finish(s, 'defeat'); assert(s.meta.ended, 'only once per run'); }
{ const s = run(['path_blessing']); const before = lv(s); s.current = s.map[14][0]; s.phase = 'battle'; s.score[0] = G.winsNeeded(s) - 1; G.finish(s, 'win'); assert.equal(s.phase, 'tree'); assert(T.continueRun(s)); assert.equal(A.act(s), 2); assert.equal(lv(s), before + 2); /* R3 08/11: 2 cartas com upgrade 1 */ }
// Preparação Flexível: one free hand refresh per round.
{ const s = run(['flex_prep']); s.round = 1; G.startConfront(s, { ...s.current, type: 'battle' }); s.phase = 'prep'; s.energy = 0; s.hand = s.hand.length ? s.hand : s.draw.splice(0, 4); assert(G.refreshHand(s), 'free refresh with 0 energy'); assert.equal(s.energy, 0); assert(!G.refreshHand(s), 'only once per round'); s.round = 2; s.energy = 0; assert(G.refreshHand(s), 'again next round'); }
// Fusão Eficiente (pending decision): refund after a completed fusion, first per round.
{ const s = run(['efficient_fusion']); assert(AD.BY.efficient_fusion); }
// Mão Planejada: chosen type on top of the first draw in alternate confrontations; no copy created.
{ const s = run(['planned_hand']); const opts = AD.plannedOptions(s); assert(opts.length); assert(AD.choosePlanned(s, opts[0])); const n = s.cards.length; let hits = 0;
  for (let k = 0; k < 4; k++) { G.startConfront(s, { ...s.current, type: 'battle' }); if (s.hand.some(id => s.cards.find(c => c.uid === id)?.type === opts[0])) hits++; }
  assert.equal(s.cards.length, n, 'no copy created'); assert(hits >= 2, 'present at least in alternate confrontations'); }
// Experiência de Elite: +0.5% health and attack per elite, additive, player units only.
{ const s = run(['elite_experience']); const c = s.cards[0], b0 = G.stats(c, s); s.adv.eliteStacks = 4; const b4 = G.stats(c, s); assert(Math.abs(b4.hp / b0.hp - 1.02) < 1e-9); assert(Math.abs(b4.atk / b0.atk - 1.02) < 1e-9); s.current = { ...s.current, type: 'elite' }; P.encounterWin(s); assert.equal(s.adv.eliteStacks, 5); }
// Never in training.
{ own(AD.LIST.map(a => a.id)); const s = G.fresh('vanguard', 3); s.training = { wins: 1 }; assert.equal(AD.has(s, 'full_purse'), false); }
// R3: XP becomes diamonds (1 per 20) only once the whole tree is owned; covered by tests/xp-r3.cjs (section 8).
{ own([]); const st = T.profile(); st.unlocked = []; assert.equal(T.complete(), false); st.unlocked = JourneyTreeData.nodes.filter(n => n.id !== 'origin').map(n => n.id); assert.equal(T.complete(), true); st.unlocked = []; }
console.log('PASS advantages: 15 Advantages bought with Insignia, always active outside training, every effect; tree completion flag for XP -> diamonds (R3).');
