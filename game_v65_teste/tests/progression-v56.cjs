const assert=require('node:assert/strict'),fs=require('node:fs');global.window=globalThis;
const files=[...fs.readFileSync('dist/index.html','utf8').matchAll(/src="([^"?]+\.js)/g)].map(m=>m[1]);for(const f of files.slice(0,files.indexOf('game-2.js')))require('../dist/'+f);
const G=Game,P=Progress,M=JourneyMilestones,J=JourneyProgression,T=JourneyTree;
const done=id=>P.profile.milestones.includes(id),reset=()=>P.load(P.freshProfile()),mil=id=>P.MILESTONES.find(m=>m.id===id);
assert.equal(P.MILESTONES.length,102);assert.equal(new Set(P.MILESTONES.map(m=>m.id)).size,102);assert.equal(P.MILESTONES.filter(m=>m.kind==='deck').length,24);assert.equal(P.MILESTONES.filter(m=>m.kind==='collection').length,16);assert.equal(P.MILESTONES.filter(m=>m.kind==='bossMap'||m.kind==='allBoss').length,16);
reset();
assert.deepEqual(P.profile.decks,['vanguard']);
assert(P.canBorrow('vanguard'));
assert(!P.canBorrow('balanced'));
assert(!P.canBorrow('outlaws'));
assert.equal(P.profile.mapsUnlocked,1);
P.completeTutorial();assert.equal(P.profile.diamonds,0);
P.profile.stats.firstCombatWin=1;P.check();assert.equal(P.profile.diamonds,1);
assert(P.profile.boosters.includes('bst_dawnward'));
assert(!P.canBorrow('balanced'));
const tutorialRun=G.fresh('vanguard',56);
assert(P.finish(tutorialRun,'defeat'));
for(const id of ['balanced','outlaws']){
 assert(P.canBorrow(id));
 assert(P.unlocks(tutorialRun).some(e=>e.kind==='deck'&&e.id===id));
}
P.check();assert.equal(P.profile.diamonds,1);
const saved=JSON.stringify(P.profile);P.load(JSON.parse(saved));assert.equal(P.profile.diamonds,1);
assert(M.hidden(mil('win_deck_quake')));assert(M.hidden(mil('collection_Goblin')));assert(M.hidden(mil('secret_boss')));assert(!M.hidden(mil('win_deck_vanguard')));
assert.equal(P.MILESTONES.filter(m=>m.deck||m.booster).length,35);
assert.equal(P.MILESTONES.filter(m=>m.mapUnlock).length,2);
assert.equal(P.MILESTONES.filter(m=>m.relic).length,9);
assert.equal(P.MILESTONES.filter(m=>!m.deck&&!m.booster&&!m.relic&&!m.mapUnlock).length,56);
// Actual recorded boss victories: no unlock on map 1/2, normal third boss unlocks base roster only.
function bossRun(order,act,isTrue=false){const s=G.fresh('vanguard',500+act);G.enter(s,G.available(s)[0].id);s.journey.act=act;s.current={id:'qa-'+order+'-'+act,type:'boss',layer:14,campaign:order,trueBoss:isTrue,bossId:order==='ironbound'?'ib_wayfarer':order==='blackfang'?'darkelf':'fairy'};s.bossEncounter={id:s.current.bossId,form:isTrue?2:1};s.score=[4,0];P.encounterWin(s);return s;}
for(const order of ['blackfang','dawncrest']){reset();bossRun(order,1);assert(!P.profile[order+'Unlocked']);assert(!J.bossCardsUnlocked(order));assert(done('boss_'+order+'_map1'));bossRun(order,2);assert(!P.profile[order+'Unlocked']);bossRun(order,3);assert(P.profile[order+'Unlocked']);assert(!J.bossCardsUnlocked(order));assert(!done('boss_'+order+'_all'),'separate runs must not count as one route');bossRun(order,3,true);assert(J.bossCardsUnlocked(order));for(const[id,c]of Object.entries(JourneyBossCards.cards))if(JourneyBosses.D[c.boss].order===order)assert(P.visibleCard(id));}
reset();bossRun('ironbound',1);assert(!J.bossCardsUnlocked('ironbound'));let s=bossRun('ironbound',3,true);assert(J.bossCardsUnlocked('ironbound'));assert.equal(Object.keys(JourneyBossCards.cards).filter(id=>P.visibleCard(id)).length,8);
// Neither stored copies nor leaked booster pools bypass the true-boss gate.
reset();P.profile.cards.hero_ib_marshal=2;P.profile.catalogCards.push('hero_ib_marshal');assert(!P.visibleCard('hero_ib_marshal'));assert(!G.fresh('vanguard',1).bossCardsAvailable.includes('hero_ib_marshal'));
// The same run must contain all three order bosses; True Boss counts as map 3.
reset();s=G.fresh('vanguard',601);G.enter(s,G.available(s)[0].id);s.journey.act=3;s.journey.history=[{act:1,order:'ironbound',route:[]},{act:2,order:'ironbound',route:[]}];s.current={id:'last',type:'boss',campaign:'ironbound',trueBoss:true,bossId:'ib_wayfarer',layer:14};P.encounterWin(s);assert(done('boss_ironbound_all'));assert(done('true_ironbound'));
// Fusion and filling an actually valid bag, without counting reserve relics or training toward run achievements.
reset();s=G.fresh('vanguard',602);const ids=['heart','shield','tome','precision'];const all=G.ARTIFACTS.map(a=>a.id);let bag=null,chosen=null;for(let mask=1;mask<1<<Math.min(all.length,18);mask++){const list=all.slice(0,18).filter((_,i)=>mask>>i&1);if(list.reduce((n,id)=>n+G.relicShape(id).length,0)!==16)continue;const packed=G.packBag(list,s);if(packed){bag=packed;chosen=list;break;}}assert(bag);s.artifacts=chosen;s.bag={items:bag};M.observe(s);P.check();assert(done('bag_full'));s.fusionSerial=1;M.observe(s);P.check();assert(done('fusion_first'));s.training={};M.facts().firstFusion=false;M.observe(s);assert(!M.facts().firstFusion);
// Collections use one owned copy, include boss cards, and never count enemy-only leaders or minions.
reset();for(const u of M.factionCards('Dawnward Order'))P.profile.cards[u.id]=1;P.check();assert(done('collection_Dawnward Order'));for(const a of G.ARTIFACTS)P.profile.relics[a.id]=1;P.check();assert(done('collection_relics'));
// 25/50/75/100% thresholds round up and completion survives resets.
reset();P.profile.skillTree.unlocked=M.allTree.slice(0,Math.ceil(M.allTree.length*.25)).map(n=>n.id);P.check();assert(done('tree_25'));assert(!done('tree_50'));P.profile.skillTree.unlocked=[];P.check();assert(done('tree_25'));
// Active advantages versus victorious challenge levels; current menu selection alone does not count as a victory.
reset();P.profile.advantages=JourneyAdvantages.LIST.slice(0,10).map(x=>x.id);P.check();assert(done('advantages_5'));assert(done('advantages_10'));assert(!done('advantages_15'));P.profile.challenges={unlocked:true,available:15,selected:JourneyChallenges.LIST.map(x=>x.id),won:[],completed:[]};P.check();assert(!done('challenges_5'));P.profile.challenges.won=[10];P.check();assert(done('challenges_5'));assert(done('challenges_10'));assert(!done('challenges_15'));
// Custom deck must be complete; five nodes alone do not count as a custom run win.
reset();P.profile.onboarding.runComplete=true;const cards=G.deckCards(G.DECKS[0]);for(const id of cards)P.profile.cards[id]=4;P.profile.relics.banner=1;assert(P.saveCustom(0,{cards:cards.slice(0,3),relic:'banner'}));assert(!done('custom_build'));assert(P.saveCustom(0,{cards,relic:'banner'}));assert(done('custom_build'));s=P.startCustom(0,603);s.meta.completed=Array.from({length:5},(_,i)=>({id:'n'+i,type:'event',layer:i}));M.observe(s);P.check();assert(done('custom_five'));assert(!done('custom_win'));s.meta.ended=true;s.meta.reason='victory';M.observe(s);P.check();assert(done('custom_win'));assert(!done('secret_boss'));
// Training milestone requires starting a combat, not merely opening its setup screen.
reset();const train=Training.build(Training.defaults(),123);assert(!done('training_first'));train.board[10]=train.hand.shift();G.createBattle(train);assert(done('training_first'));assert(!done('fusion_first'));assert(!done('run_first_win'));
console.log('PASS v57: 102 unique milestones, single diamond payouts, order/true gates, hidden objectives, route grouping, bag, collections, tree percentages, custom/training isolation and challenge tiers.');
// Complete a real three-map journey through the tree closure, then restore the profile.
reset();P.profile.mapsUnlocked=3;s=G.fresh('vanguard',700);G.enter(s,G.available(s)[0].id);s.challenges=JourneyChallenges.LIST.slice(0,5).map(c=>c.id);s.challengeLevel=5;for(const act of [1,2,3]){s.journey.act=act;s.current={id:'real-boss-'+act,type:'boss',layer:14,campaign:'ironbound',trueBoss:false,bossId:'ib_marshal',forceId:'ironbound_boss'};s.phase='battle';s.score=[G.winsNeeded(s)-1,0];delete s.bossEncounter;G.finish(s,'win');assert.equal(s.phase,'tree');assert(T.continueRun(s));}assert(s.meta.ended);assert(done('run_first_win'));assert(done('win_deck_vanguard'));assert(done('boss_ironbound_all'));assert(done('challenges_5'));assert(s.meta.unlocks.some(e=>e.id==='run_first_win'));let diamonds=P.profile.diamonds;P.check();P.load(JSON.parse(JSON.stringify(P.profile)));assert.equal(P.profile.diamonds,diamonds);
// Every new objective has a working completion condition and one payment, including the reserved Secret Boss hook.
reset();const f=M.facts();for(const order of ['blackfang','dawncrest','ironbound','monsters']){f.bossMaps[order]=[1,2,3];f.allBossOrders.push(order);f.trueOrders.push(order);}f.wonDecks=G.DECKS.map(d=>d.id);f.titans=['tree','colossus','slime','dragon','hydra','kraken','lich','naga','manticore'];for(const k of ['training','customBuilt','customFive','customWon','bagFull','firstFusion','threeFused','secretBoss'])f[k]=true;f.treeBest=M.allTree.length;f.advBest=15;f.challengeBest=15;Object.assign(f,{recruited:3,shopRelics:2,xpGained:40,recruitsMap3:true,level2:true,orderPair:true,elites:3,raidWon:true,map3Entries:true});Object.assign(P.profile.stats,{wins:1,bestSpent:100,bestSweeps:6});for(const u of G.UNITS.filter(u=>!u.enemyOnly&&u.kind!=='curse'))P.profile.cards[u.id]=1;for(const a of G.ARTIFACTS)P.profile.relics[a.id]=1;P.check();for(const m of P.MILESTONES.filter(m=>m.kind)){assert(done(m.id),m.id);assert(f.paid.includes(m.id),m.id);}assert(!M.hidden(mil('secret_boss')));diamonds=P.profile.diamonds;P.check();P.load(JSON.parse(JSON.stringify(P.profile)));assert.equal(P.profile.diamonds,diamonds);
console.log('PASS v57 full lifecycle: three maps/tree closure, win/challenge rewards in result history, all current objectives and payout restore.');

// New careers end at the frontier until map 3 is unlocked.
reset();
const A=JourneyActs;
function winBoss(s) {
  const act=A.act(s);
  s.current={id:'boss'+act,type:'boss',layer:14,campaign:'ironbound',trueBoss:false,bossId:'ib_marshal'};
  s.phase='battle';
  s.score=[G.winsNeeded(s)-1,0];
  G.finish(s,'win');
  assert.equal(s.phase,'tree');
  assert(T.continueRun(s));
}
for(let maps=1;maps<=3;maps++){
  const s=G.fresh('vanguard',700+maps);
  for(let i=1;i<=maps;i++){
    assert.equal(A.act(s),i);
    winBoss(s);
    assert.equal(s.phase,i===maps?'victory':'map');
  }
  assert.equal(s.meta.reason,maps<3?'chapterWin':'victory');
  assert.equal(P.profile.stats.wins,+(maps===3));
  assert.equal(JourneyChallenges.profile().unlocked,maps===3);
  assert.equal(P.profile.mapsUnlocked,Math.min(3,maps+1));
}
assert(done('run_first_win'));

// Annex C tracks completed transactions, earned XP and recruits actually fielded.
reset();P.completeTutorial();
s=G.fresh('vanguard',57);s.current={id:'qa-shop',type:'shop'};s.phase='shop';s.gold=100;
s.offers={cards:[],artifacts:['scope','precision']};
for(let i=0;i<2;i++){
 const id=s.offers.artifacts[i];
 assert(G.buy(s,'artifacts',i));
 assert.equal(done('shop_relics_two'),false);
 const items=[...s.bag.items,{id,key:'stock'+i,x:null,y:null,rotation:0}];
 assert(G.commitBag(s,items));
}
assert(done('shop_relics_two'));assert(P.profile.catalogRelics.includes('merchant'));assert(!P.profile.relics.merchant);
s.journey.act=3;s.phase='prep';
const recruited=G.UNITS.filter(u=>G.runCardAvailable(s,u.id)&&!G.copies(s,u.id)).slice(0,2);
for(const [i,u] of recruited.entries()){
 const recruit=JourneyContent.recruitCard(s,u.id);
 assert(recruit?.recruited);
 s.board[i]=recruit.uid;
}
assert(!done('recruits_map3'));
for(let i=0;i<14&&!done('xp_forty');i++){
 s.encounters++;
 s.current={id:'qa-fight-'+i,type:'battle',layer:i};
 s.score=[3,0];P.encounterWin(s);
}
assert(done('recruits_map3'));assert(P.profile.catalogRelics.includes('travelers_mirror'));
assert(done('xp_forty'));assert(P.profile.catalogRelics.includes('grimoire'));
console.log('PASS Annex C: shop payment, earned XP, deployed recruits and catalogue-only rewards.');
