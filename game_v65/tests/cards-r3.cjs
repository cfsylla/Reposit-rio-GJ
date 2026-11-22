'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {G,P}=require('./cp4-engine.cjs');
const profiles=require('../review-inputs/cards-r3/herois.json');
const rarities=require('../review-inputs/cards-r3/raridades.json');
const before=require('./fixtures/cards-r3-before.json');
assert.equal(Object.keys(rarities).length,24);
for(const [id,tier] of Object.entries(rarities)){
 assert.equal(G.BY[id].rarity,tier,id+' rarity');
 assert.equal(P.RARITIES[tier].price,[10,15,20,25][tier],id+' diamond price');
}
assert.equal(Object.keys(profiles).length,17);
for(const [id,ratings] of Object.entries(before.heroRatings))assert.deepEqual(G.BY[id].ratings,ratings,id+' ratings unchanged');
for(const [id,profile] of Object.entries(profiles)){
 for(const [key,value] of Object.entries(profile))assert.deepEqual(G.BY[id][key],value,id+' '+key);
 assert.equal(JourneyBossCards.cards[id].mode,profile.mode);
 const s=Training.build(Training.defaults(),149),card=s.cards.find(c=>c.uid===s.hand[0]);
 card.type=id;s.board[11]=card.uid;s.hand.shift();
 const b=G.createBattle(s),u=b.units.find(u=>!u.side);
 assert.equal(u.charge,profile.trigger.limit,id+' actual charge');
 assert.equal(u.skill,profile.skillScale,id+' actual skillScale at level 0');
}
assert.deepEqual(JourneyBosses.D,before.bosses,'all boss definitions unchanged');
assert.deepEqual(JOURNEY_BOSS_TUNE,before.tune,'map and boss tuning unchanged');
for(const [id,values] of Object.entries(before.units)){
 if(id.startsWith('boss_'))assert.deepEqual(G.BY[id],values,id+' full boss template unchanged');
 else for(const [key,value] of Object.entries(values))assert.deepEqual(G.BY[id][key],value,id+' ordinary combat unchanged: '+key);
}
// Capture emitted effects to check exact base multipliers independently of mitigation/crit.
const originalHit=G.hit,originalShield=JourneyTraits.shield;
try{
 const hits=[],shields=[];
 G.hit=(b,u,t,n)=>hits.push({target:t.uid,damage:n});
 JourneyTraits.shield=(b,t,n,seconds)=>shields.push({target:t.uid,value:n,seconds});
 const target={uid:'target',x:100,y:100,hp:100,maxhp:100},near={uid:'near',x:150,y:100,hp:100,maxhp:100},far={uid:'far',x:200,y:100,hp:100,maxhp:100};
 const ally={uid:'ally',hp:10,maxhp:100},ally2={uid:'ally2',hp:30,maxhp:100};
 const pending=[];
 JourneyBossCards.effect({}, {type:'hero_ib_wayfarer',atk:100,skill:1},target,[target,near,far],[ally],pending,'ib_wayfarer');
 assert.deepEqual(hits,[{target:'target',damage:180},{target:'near',damage:90}]);assert.equal(pending.length,0);
 hits.length=0;
 JourneyBossCards.effect({}, {type:'boss_ib_wayfarer',atk:100,skill:1},target,[target,near],[ally],pending,'ib_wayfarer');
 assert.deepEqual(hits,[{target:'target',damage:160}]);assert.equal(pending.pop().heal,8);
 hits.length=0;
 JourneyBossCards.effect({}, {type:'hero_ib_oracle',atk:100,skill:3.946},target,[target],[ally],pending,'ib_oracle');
 assert(Math.abs(hits[0].damage-631.36)<1e-10);assert(Math.abs(pending.pop().heal-31.568)<1e-10);
 JourneyBossCards.effect({}, {type:'hero_fairy',atk:100,skill:2.256},target,[target],[ally,ally2],pending,'fairy');
 assert.equal(pending.length,2);assert.equal(shields.length,2);
 for(const effect of pending)assert(Math.abs(effect.heal-22.56)<1e-10);
 for(const shield of shields){assert(Math.abs(shield.value-22.56)<1e-10);assert.equal(shield.seconds,4);}
}finally{G.hit=originalHit;JourneyTraits.shield=originalShield;}
assert.match(G.BY.hero_meowri.detail,/three strikes/);assert.match(G.BY.hero_meowri.detailPT,/três golpes/);
assert.match(G.BY.hero_ib_wayfarer.detail,/180%/);
assert.match(G.BY.hero_ib_oracle.detail,/630%.*32%/);
assert.match(G.BY.hero_fairy.detail,/23%.*23%/);
console.log('PASS R3 cards: 24 rarities/prices, 17 exact profiles and engine charge/power, ordinary combat and all bosses unchanged; Wayfarer cleave vs boss light; exact Oracle/Fairy effects.');
