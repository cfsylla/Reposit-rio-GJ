'use strict';
const assert=require('node:assert/strict');
const {G,P,Tree:T,C}=require('./cp4-engine.cjs');

P.load(P.freshProfile());
P.completeTutorial();
P.profile.challenges={unlocked:true,available:3,selected:['tough','relentless','reinforcements']};
let s=G.fresh('vanguard',56);
const node=G.available(s)[0];
assert(G.enter(s,node.id));
assert.deepEqual(s.meta.challenges,['tough','relentless','reinforcements']);

function round(slot, handicap) {
  s.board.fill(null);
  const card=s.cards.find(c=>c.type==='warrior');
  s.board[slot]=card.uid;
  const b=G.createBattle(s);
  assert(b?.playtest);
  if(handicap) b.units.find(u=>!u.side).hp=1;
  else for(const enemy of b.units.filter(u=>u.side)) enemy.hp=1;
  for(let i=0;i<2400&&!b.result;i++)G.step(b,1/20);
  assert(b.result);
  G.recordBattleStats(s,b);
  assert(G.finish(s,b.result));
  return b.result;
}
for(let i=0;i<3;i++){
  assert.equal(round(10+i,true),'loss');
  if(i<2) {
    const old=s.meta.playtestBattle;
    s=JSON.parse(JSON.stringify(s));
    assert.deepEqual(s.meta.playtestBattle,old);
    assert(G.nextRound(s));
  }
}
assert.equal(s.phase,'defeat');
const run=P.profile.runs.at(-1), e=run.encounters.at(-1);
assert.equal(run.seed,56);
assert.equal(run.build,'v57-R3');
assert.deepEqual(run.advantages,[]);
assert.deepEqual(run.treeNodes,[]);
assert.deepEqual(run.treeBought,[]);
assert.equal(e.result,'defeat');
assert.equal(e.rounds.length,3);
assert(e.rounds.every(r=>r.winner==='enemy'&&r.playerAlive===0&&r.enemyAlive>0));
assert.notEqual(e.rounds[0].player.formation[0].x,e.rounds[1].player.formation[0].x);
assert.deepEqual(e.player,e.rounds[0].player);
assert.equal(e.player.bagCellsUsed,e.player.relics.reduce((sum,r)=>sum+r.cells.length,0));
assert(e.enemyScaleSources.some(x=>x.source==='challenge:tough'));
assert(e.enemyScaleSources.some(x=>x.source==='challenge:relentless'));
assert.equal(e.units[0].deaths,3);
assert.equal(P.profile.stats.bosses,0);

s=G.fresh('vanguard',128);
s.map[0][0].type='shop';
s.gold=100;
assert(G.enter(s,G.available(s)[0].id));
const offered=s.offers.cards[0],price=G.price(s,'cards',offered);
assert(G.buy(s,'cards',0));
const purchase=s.meta.choices.find(c=>c.kind==='shopOffer');
assert(purchase.offered.some(item=>item.id===offered&&item.price===price));
assert.deepEqual(purchase.chosen[0],{kind:'cards',id:offered,price});
const relic=s.offers.artifacts[0];
assert(G.buy(s,'artifacts',0));
const relicPrice=s.pendingRelic.price;
assert(G.commitBag(s,G.packBag([...s.artifacts,relic],s)));
assert(s.meta.choices.some(c=>c.kind==='relicMoved'&&c.id===relic));
assert(G.leave(s));
assert.deepEqual(s.meta.completed.map(({goldIn,goldOut,goldAfter})=>[goldIn,goldOut,goldAfter]),[[0,price+relicPrice,100-price-relicPrice]]);

s=G.fresh('vanguard',42);
s.map[0][0].type='event';
assert(G.enter(s,G.available(s)[0].id));
C.init(s,'cofre');
assert(C.accept(s,'safe'));
assert(G.leave(s));
assert.equal(s.meta.choices.findLast(c=>c.kind==='eventChoice').chosen,'safe');
assert.equal(s.meta.completed[0].goldIn,8);

// In the engine's formation and in the exported encounter, round 1 really is 2v3.
P.load(P.freshProfile());P.completeTutorial();
P.profile.challenges={unlocked:true,available:1,selected:['reinforcements']};
s=G.fresh('vanguard',56);
assert(G.enter(s,G.available(s)[0].id));
s.mapBattles=4;G.startConfront(s,{id:'battle-5',type:'battle',layer:7});
s.board[9]=s.cards[0].uid;s.board[10]=s.cards[1].uid;
const reinforced=G.createBattle(s);
assert.equal(reinforced.units.filter(u=>u.side===1).length,3);
reinforced.result='win';G.recordBattleStats(s,reinforced);
s.score=[G.winsNeeded(s)-1,0];G.finish(s,'win');
const reinforcementExample=s.meta.encounters.at(-1);
assert.equal(reinforcementExample.rounds[0].player.formation.length,2);
assert.equal(reinforcementExample.rounds[0].enemy.formation.length,3);
assert(reinforcementExample.rounds[0].enemyScaleSources.some(source=>source.source==='challenge:reinforcements'));

const backup={format:'grand-journey',schema:JourneyTelemetry.exportSchema,profile:P.profile,state:s};
assert(JourneyTelemetry.validExport(JSON.parse(JSON.stringify(backup))));
assert(JourneyTelemetry.validExport({...backup,schema:1,profile:P.freshProfile(),state:null}));
assert(!JourneyTelemetry.validExport({...backup,schema:3}));
if(process.argv.includes('--reinforcement-example'))console.log(JSON.stringify(reinforcementExample,null,2));
else if(process.argv.includes('--example'))console.log(JSON.stringify(e,null,2));
else console.log('PASS playtest export history: defeat, 3 rounds, formations, equipped relics, scale sources, combat totals, shop, event and gold.');
