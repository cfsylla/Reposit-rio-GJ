'use strict';
const assert = require('node:assert/strict');
const { G, P, Tree: T } = require('./cp4-engine.cjs');

function loseFight(xp) {
  const s = G.fresh('vanguard', 251);
  assert(G.enter(s, G.available(s)[0].id));
  Object.assign(T.ensure(s), { xp, gain: xp });
  s.phase = 'battle';
  s.score = [0, G.winsNeeded(s) - 1];
  assert(G.finish(s, 'loss'));
  return s;
}
P.load(P.freshProfile()); P.completeTutorial();
const cost = T.nextLevelXp();
let s = loseFight(cost + 2);
assert.equal(s.phase, 'tree');
assert.equal(T.ensure(s).session.kind, 'defeat');
assert(!s.meta.ended);
s = JSON.parse(JSON.stringify(s));
assert(T.buy(s, 'pow_atk_1'));
assert(T.continueRun(s));
assert.equal(s.phase, 'defeat');
assert.equal(s.meta.reason, 'defeat');
assert.deepEqual(s.meta.treeXp, { gained: cost + 2, spent: cost, lost: 2 });
assert(!T.continueRun(s));
assert(T.profile().unlocked.includes('pow_atk_1'));
s = loseFight(T.nextLevelXp() - 1);
assert.equal(s.phase, 'defeat');
assert(s.meta.ended);
s = G.fresh('vanguard', 252);
Object.assign(T.ensure(s), { xp: 50, gain: 50 });
assert(P.abandon(s));
assert.equal(s.meta.treeXp.lost, 50);
assert.equal(s.phase, 'defeat');
console.log('PASS CP4 defeat window: real defeat, save restore, permanent purchase, end and no double payout');
