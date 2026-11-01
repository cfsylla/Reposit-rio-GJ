const assert=require('node:assert/strict');require('../dist/game-0.js');const G=Game;
function setup(){const s=G.fresh('balanced',38);G.enter(s,'c1');delete s.tutorial;s.round=5;s.energy=50;s.cards=[0,1,2,3].map((i)=>({uid:'u'+i,type:i<3?'warrior':'archer',level:0}));s.hand=s.cards.map(c=>c.uid);s.draw=[];s.discard=[];return s;}
let s=setup();assert(G.deploy(s,'u0',0));assert.equal(s.energy,48);assert(G.transfer(s,'field',0,'bench',1));assert(G.returnToHand(s,'u0'));assert.equal(s.energy,50);assert(G.rosterAudit(s));
s=setup();G.deploy(s,'u0',0);G.refreshHand(s);assert(!G.returnToHand(s,'u0'));
s=setup();G.deploy(s,'u0',0);s.round++;assert(!G.returnToHand(s,'u0'));
s=setup();G.deploy(s,'u0',0);assert(G.createBattle(s));s.phase='prep';assert(!G.returnToHand(s,'u0'));
s=setup();G.deploy(s,'u0',0);G.deploy(s,'u1',0,'bench');s.returnable={};G.deploy(s,'u2',1,'bench');assert(G.returnToHand(s,'u0'));assert(s.hand.includes('u2'));assert.equal(s.board[0],'u0');assert.equal(s.bench[0],'u1');assert.equal(s.energy,46);assert(!G.returnToHand(s,'u0'));assert(G.rosterAudit(s));
s=setup();G.deploy(s,'u0',0);G.removeAt(s,'field',0);assert(!G.returnToHand(s,'u0'));assert.equal(s.energy,49);
s=setup();G.deploy(s,'u0',0);s.hand.push('extra');assert(!G.returnToHand(s,'u0'));
s=setup();G.deploy(s,'u0',0);G.refreshHand(s);const newId=s.hand[0];assert(G.deploy(s,newId,1,'bench'));s=JSON.parse(JSON.stringify(s));assert(G.returnToHand(s,newId));assert(!G.returnToHand(s,'u0'));assert(G.rosterAudit(s));
// A concave allied pocket requires retreat before approaching the enemy.
for(const dt of [1/60,.05,.1]){const u={uid:'w',x:215,y:330,hp:100,speed:49,range:34},enemy={uid:'e',x:215,y:240,hp:100};const allies=[[195,310],[235,310],[178,330],[252,330]].map(([x,y],i)=>({uid:'a'+i,x,y,hp:100}));const before=JSON.stringify(allies);for(let i=0;i<20/dt;i++){G.walkUnit(u,enemy,[u,enemy,...allies],dt);for(const a of allies)assert(Math.hypot(u.x-a.x,u.y-a.y)>=24-.001);}assert(Math.hypot(u.x-enemy.x,u.y-enemy.y)<=34.01,'escape pocket dt '+dt);assert.equal(JSON.stringify(allies),before);}
console.log('PASS v38 return rules, fusion rollback, conservation, discard and concave allied pocket at all speeds');
