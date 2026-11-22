/* CP3 functional acceptance using the real engine. No dependency on Claude's statistical simulator. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');globalThis.window=globalThis;
const files=[...fs.readFileSync('dist/index.html','utf8').matchAll(/src="([^"?]+\.js)/g)].map(m=>m[1]);for(const file of files.slice(0,files.indexOf('game-2.js')))require('../dist/'+file);
const G=Game,P=Progress,T=JourneyTree,A=JourneyActs,D=T.D;
function reset(){P.load(P.freshProfile());P.completeTutorial();}
reset();for(const act of [1,2,3])for(const[k,w]of Object.entries({battle:1,special:2,boss:4,trueBoss:6,secretBoss:8}))assert.equal(T.xpFor(act,k),k==='boss'?[6,10,12][act-1]:w*act);
assert.deepEqual([1,2,3].map(T.midLayer),[9,8,8]);assert.equal(D.nodes.reduce((n,x)=>n+(x.cost||0),0),1754);assert.equal(T.LEVEL.maxLevel,60);
// Six real windows from map traversal, with forced battle outcomes only; no simulated win-rate claim.
let s=G.fresh('vanguard',314),windows=[];s.runSetupConfirmed=true;
for(let step=0;step<90&&!s.meta.ended;step++){
 if(s.phase==='tree'){const t=T.ensure(s),kind=t.session.kind,act=A.act(s),before=t.xp;windows.push(act+kind);for(let guard=0;guard<60;guard++){const node=D.nodes.filter(n=>n.id!=='origin'&&!T.profile().unlocked.includes(n.id)&&T.connected(n.id)&&n.cost<=T.available(s)).sort((a,b)=>a.cost-b.cost)[0];if(!node)break;assert(T.buy(s,node.id));}const left=t.xp;assert(T.continueRun(s));assert(!T.continueRun(s));if(!s.meta.ended)assert.equal(T.ensure(s).xp,left);if(act===1&&kind==='mid'){assert(before>=8&&before<=10);assert(T.profile().unlocked.length>0);}continue;}
 if(s.phase==='map'){assert(G.enter(s,G.available(s)[0].id));}
 if(G.isFight(s.current)){
  if(s.current.trueBoss&&s.bossEncounter)s.bossEncounter.form=2;
  s.phase='battle';s.score=[G.winsNeeded(s)-1,0];G.finish(s,'win');
  if(s.phase==='roundResult'){G.nextRound(s);continue;}
 }else if(s.phase==='event'&&s.offers)s.offers.resolved=true;
 if(s.phase!=='tree'&&!s.meta.ended){assert(G.leave(s),'leave '+s.phase);}
}
assert(s.meta.ended);assert.equal(s.meta.reason,'victory');assert.deepEqual(windows,['1mid','1boss','2mid','2boss','3mid','3boss']);const t=T.ensure(s);assert.equal(t.xp,0);assert.equal(t.gain,t.spent+t.lost);assert.deepEqual(s.meta.treeXp,{gained:t.gain,spent:t.spent,lost:t.lost});
const paid=P.profile.diamonds;P.finish(s,'victory');assert.equal(P.profile.diamonds,paid);
// Saved open windows and single close preserve XP without extra awards.
reset();s=G.fresh('vanguard',315);Object.assign(T.ensure(s),{xp:17,gain:17,session:{act:1,kind:'mid'}});s.phase='tree';s=JSON.parse(JSON.stringify(s));assert.equal(T.available(s),17);assert(T.buy(s,'pow_atk_1'));const left=T.available(s);assert(T.continueRun(s));assert.equal(T.ensure(s).xp,left);assert(!T.continueRun(s));
// Loss/abandon discards only unspent XP and retains permanent purchases.
P.abandon(s);assert.equal(T.ensure(s).xp,0);assert(T.profile().unlocked.includes('pow_atk_1'));assert.equal(s.meta.treeXp.lost,left);assert.equal(P.profile.runs.at(-1).treeXp.lost,left);
// Respec refunds invested cost only; normal runs discard unused budget, practice and tutorial do not.
reset();T.profile().unlocked=['pow_atk_1','vit_hp_1','pow_atk_2'];const refund=T.spent();assert(T.reset(null));assert.equal(T.available(),refund);assert(T.buy(null,'pow_atk_1'));const budget=T.available();Training.build(Training.defaults(),316);assert.equal(T.available(),budget);JourneyRaid.build(Training.defaults(),317);assert.equal(T.available(),budget);G.fresh('vanguard',73421,{practice:true});assert.equal(T.available(),budget);G.fresh('vanguard',318);assert.equal(T.available(),0);assert.equal(T.profile().history.respecLost,budget);assert(T.reset(null));assert.equal(T.available(),D.by.pow_atk_1.cost);
// No permanent XP bank, no cost cap, and diamonds only after every node is owned.
reset();T.profile().unlocked=D.nodes.filter(n=>n.id!=='origin').map(n=>n.id);s=G.fresh('vanguard',319);s.current={id:'diamond-test',type:'boss',trueBoss:true};s.journey.act=3;const diamonds=P.profile.diamonds;assert.equal(T.award(s),18);assert.equal(T.award(s),0);s.current.id='diamond-test-2';T.award(s);assert.equal(P.profile.diamonds,diamonds+1);assert.equal(T.ensure(s).xp,0);assert(T.complete());assert.equal(T.level(),60);assert.equal(T.bank(s),0);assert.equal(T.overflowXp(),0);
console.log('PASS CP3 functional XP: weighted XP, six actual windows, mid-map purchase, carry, final loss, JSON restore, single close/award, respec, training/raid/tutorial isolation, full-tree diamonds and persisted summary.');
