const assert=require('node:assert/strict');require('../dist/game-0.js');const G=Game;
function setup(seed=42){const s=G.fresh('balanced',seed);G.enter(s,'c1');return s;}
function end(s){s.phase='battle';assert(G.finish(s,'draw'));assert(G.audit(s));}
for(const retained of [0,1,3,4]){
 const s=setup();while(s.hand.length>retained)s.discard.push(s.hand.pop());const ids=[...s.hand],draw=s.draw.length,energy=s.energy;
 if(retained){assert(G.toggleHandFreeze(s));assert.equal(s.energy,energy);}else{assert.equal(G.toggleHandFreeze(s),false);s.handFrozen=true;}
 end(s);assert.deepEqual(s.hand,ids);const restored=JSON.parse(JSON.stringify(s));assert(restored.handFrozen);assert(G.nextRound(restored));assert.equal(restored.hand.length,4);assert.deepEqual(restored.hand.slice(0,retained),ids);assert.equal(restored.draw.length,draw-(4-retained));assert.equal(restored.handFrozen,false);assert(G.audit(restored));
}
let s=setup(),ids=[...s.hand];end(s);assert.equal(s.hand.length,0);assert(ids.every(id=>s.discard.includes(id)));G.nextRound(s);assert.equal(s.hand.length,4);assert.equal(s.handFrozen,false);
s=setup();assert(G.toggleHandFreeze(s));s.phase='battle';assert.equal(G.toggleHandFreeze(s),false);assert.equal(s.handFrozen,true);end(s);assert.equal(s.hand.length,4);
s=setup();assert(G.toggleHandFreeze(s));const energy=s.energy;assert(G.refreshHand(s));assert.equal(s.energy,energy-1);assert.equal(s.hand.length,4);assert(G.audit(s));end(s);G.nextRound(s);assert(G.audit(s));
s=G.fresh('balanced',3);s.handFrozen=true;G.enter(s,'c1');assert.equal(s.handFrozen,false);s.phase='roundResult';assert.equal(G.toggleHandFreeze(s),false);
console.log('PASS freeze: preserve 0/1/3/4 cards, fill to four, reset after transition, no energy cost, save/load, reject battle toggles, refresh and card conservation');
