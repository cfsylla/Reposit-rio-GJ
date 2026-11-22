'use strict';
const assert=require('node:assert/strict');
const {G}=require('./cp4-engine.cjs');
function arena(){
 const s=Training.build(Training.defaults(),149),card=s.cards.find(c=>c.uid===s.hand[0]);
 card.type='ranger';s.board[11]=card.uid;s.hand.shift();
 const b=G.createBattle(s),u=b.units.find(u=>!u.side),enemy=b.units.find(u=>u.side);
 b.units=[u,enemy];
 for(const unit of b.units){unit.cooldown=100;unit.speed=0;unit.progress=0;unit.charge=1e6;}
 u.x=215;u.y=400;enemy.x=215;enemy.y=310;
 return {b,u,enemy};
}
function cast(b,u,target){G.activate(b,u,target,b.units.filter(v=>v.side!==u.side),b.units,[]);u.progress=0;}
assert(Math.abs(G.RANGER_TRAP.radius**2/20**2-1.10)<1e-12);
{
 const {b,u,enemy}=arena();enemy.y=200;cast(b,u,enemy);
 const z=b.zones.find(z=>z.kind==='trap');assert.equal(z.destination.y,255);assert.equal(u.motion.y,455);
 for(let i=0;i<25;i++)G.step(b,1/60);
 assert.equal(z.y,255);assert(!z.destination);assert(b.zones.includes(z));
 const hp=enemy.hp;enemy.y=255;
 G.step(b,1/60);assert(enemy.hp<hp);assert(enemy.root>1.4);assert(!b.zones.includes(z));
}
{
 const {b,u,enemy}=arena();const near={...enemy,uid:'near',x:215,y:350},other={...enemy,uid:'other',x:215,y:340};
 b.units=[u,enemy,other,near];const hp=enemy.hp;cast(b,u,enemy);
 G.step(b,.1);assert(near.hp<hp);assert.equal(other.hp,hp);assert.equal(enemy.hp,hp);
 G.step(b,.1);assert.equal(other.hp,hp);assert.equal(enemy.hp,hp);
}
{
 const {b,u,enemy}=arena();enemy.bodyRadius=40;enemy.y=300;cast(b,u,enemy);
 G.step(b,.1);assert(enemy.root>0);assert(!b.zones.some(z=>z.kind==='trap'));
}
console.log('PASS Ranger: medium-range throw, swept first-enemy collision, single target, raid radius, +10% area, 55-unit retreat, ground activation.');
