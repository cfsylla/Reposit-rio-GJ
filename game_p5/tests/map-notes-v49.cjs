const assert=require('node:assert/strict');
require('../dist/game-0.js');require('../dist/training-engine.js');require('../dist/raid-engine.js');require('../dist/monster-engine.js');require('../dist/acts-engine.js');require('../dist/map-notes.js');
const G=Game,A=JourneyActs,N=JourneyMapNotes;
Progress.load(Progress.freshProfile());
let s=G.fresh('balanced',49);const originalMap=JSON.stringify(s.map),available=JSON.stringify(G.available(s)),route=JSON.stringify(s.route);
N.add(s,[[.2,.91],[.5,.85],[.8,.79]]);
assert.equal(JSON.stringify(s.map),originalMap);assert.equal(JSON.stringify(G.available(s)),available);assert.equal(JSON.stringify(s.route),route);
assert(G.enter(s,G.available(s)[0].id));assert.equal(s.phase,'prep');assert.equal(N.strokes(s).length,1);
s=JSON.parse(JSON.stringify(s));assert.deepEqual(N.strokes(s)[0][1],[.5,.85]);
s.phase='battle';s.score=[G.winsNeeded(s)-1,0];assert(G.finish(s,'win'));assert(G.leave(s));assert.equal(s.phase,'map');assert.equal(N.strokes(s).length,1);
// Cross-map transition and save recovery preserve separate annotation layers.
s.phase='actComplete';s.journey.history=[{act:1,order:'blackfang'}];assert(A.advance(s));assert.equal(A.act(s),2);assert.deepEqual(N.strokes(s),[]);N.add(s,[[.6,.5],[.7,.4]]);
s.phase='actComplete';s.journey.history.push({act:2,order:'blackfang'});assert(A.advance(s));N.add(s,[[.3,.7]]);assert.equal(Object.keys(s.journey.mapDrawings).length,3);
s=JSON.parse(JSON.stringify(s));assert.equal(N.strokes(s).length,1);N.clear(s);assert.deepEqual(N.strokes(s),[]);assert.equal(s.journey.mapDrawings[1].length,1);assert.equal(s.journey.mapDrawings[2].length,1);
assert.deepEqual(N.strokes(G.fresh('balanced',50)),[]);
// Old runs need no save-version migration and training never receives run notes.
const old=G.fresh('balanced',51);delete old.journey;assert.deepEqual(N.strokes(old),[]);assert(N.add(old,[[.1,.2]]));const training={training:true};assert.equal(N.add(training,[[.1,.2]]),false);assert.equal(training.journey,undefined);
for(const campaign of ['blackfang','dawncrest','monsters']){s.current={type:'boss',trueBoss:true,campaign};assert(N.trueBoss(s));s.current.trueBoss=false;assert(!N.trueBoss(s));s.current.trueBoss=true;for(const act of [1,2]){s.journey.act=act;assert(!N.trueBoss(s));}s.journey.act=3;}
s.training=true;assert(!N.trueBoss(s));delete s.training;s.tutorialReplay=true;assert(!N.trueBoss(s));
const raid=G.fresh('balanced',52);N.add(raid,[[.2,.8],[.4,.6]]);JourneyRaid.initialize(raid,'tree',{hp:1,damage:1,minions:1},true);raid.phase='prep';assert.equal(JourneyRaid.restore(JourneyRaid.snapshot(raid,null)).state.journey.mapDrawings[1].length,1);
console.log('PASS v49 notes survive encounter/save/act transitions, clear per map, fresh run empty, routes unchanged, legacy migration, true-boss selection for all orders');
