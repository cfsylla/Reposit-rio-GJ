'use strict';
const assert = require('node:assert/strict');
const { G } = require('./cp4-engine.cjs');

function battle(type) {
  const s = Training.build(Training.defaults(), 149);
  const card = s.cards.find(c => c.uid === s.hand[0]);
  card.type = type;
  s.board[11] = card.uid;
  s.hand.shift();
  const b = G.createBattle(s);
  const u = b.units.find(u => !u.side);
  const enemy = b.units.find(u => u.side);
  b.units = [u, enemy];
  for (const unit of b.units) unit.cooldown = 100;
  u.progress = u.charge;
  return { b, u, enemy };
}
for (const [type, rule] of [['warrior','area'], ['lancer','line'], ['shinobi','dash'], ['kinoichi','target'], ['samurai','line'], ['omnamusha','dash'], ...Object.entries(JourneyBossCards.cards).map(([id,c])=>[id,c.mode])]) {
  const { b, u, enemy } = battle(type);
  enemy.x = u.x; enemy.y = u.y - 300;
  const charge = u.progress;
  G.step(b, 1 / 60);
  assert.equal(u.skillCasts || 0, 0, type + ' keeps its charged skill');
  assert.equal(u.progress, charge);
  enemy.y = u.y - 24;
  if (rule === 'heal') {
    G.step(b, 1 / 60);
    assert.equal(u.skillCasts || 0, 0, type + ' waits for injury');
    u.hp = u.maxhp * .94;
  }
  G.step(b, 1 / 60);
  assert.equal(u.skillCasts, 1, type + ' casts with a valid target');
  if (['warrior','lancer','shinobi','kinoichi','samurai','omnamusha'].includes(type)) assert(u.skillAnimation, type + ' preserves the animation');
}
for (const type of ['shinobi','kinoichi','samurai','omnamusha']) {
  const { b, u, enemy } = battle(type);
  u.progress = 0;
  enemy.x = u.x; enemy.y = u.y - 150;
  G.step(b, 1 / 60);
  assert.equal(u.walkAnimation?.last, b.time, type + ' moves with a walk animation');
  enemy.x = u.x; enemy.y = u.y - 20;
  u.cooldown = 0;
  G.step(b, 1 / 60);
  assert.equal(u.attackAnimation?.time, b.time, type + ' uses the basic attack animation');
}
console.log('PASS CP4 valid targets: active charge waits, all 17 boss cards, combat animations preserved');
