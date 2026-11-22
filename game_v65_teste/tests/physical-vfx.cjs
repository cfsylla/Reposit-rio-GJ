'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {G}=require('./cp4-engine.cjs'),FX=JourneyPhysicalVfx;
function arena(type,extra=0){const s=Training.build(Training.defaults(),149),card=s.cards.find(c=>c.uid===s.hand[0]);card.type=type;s.board[11]=card.uid;s.hand.shift();const b=G.createBattle(s),u=b.units.find(u=>!u.side),t=b.units.find(u=>u.side);b.units=[u,t];for(const v of b.units){v.cooldown=100;v.speed=0;v.progress=0;v.charge=1e6;v.hp=v.maxhp=1e6;}u.x=200;u.y=380;t.x=200;t.y=350;for(let i=0;i<extra;i++)b.units.push({...t,uid:'extra'+i,x:205+i*5});return{b,u,t};}
function cast(type,extra=0){const q=arena(type,extra),p=[];G.activate(q.b,q.u,q.t,q.b.units.filter(v=>v.side),q.b.units,p);return {...q,p};}
const cases=[['pirate',false,'physical-slash'],['samurai',true,'physical-heavy-slash'],['lancer',true,'physical-thrust'],['fighter',false,'physical-light-hit'],['fighter',true,'physical-heavy-hit'],['troll',true,'physical-ground']];
for(const [type,skill,key]of cases){const {b,u,t}=arena(type);G.hit(b,u,t,100,[],skill);assert.equal(b.effects.find(e=>e.vfxKey)?.vfxKey,key,type);}
{
 const {b,p}=cast('berserker');assert.equal(p.filter(e=>e.damage).length,2);assert.equal(b.effects.filter(e=>e.vfxKey==='physical-combo2').length,1);assert.equal(b.effects.filter(e=>e.vfxSkip).length,1);
}
{
 const {b,p}=cast('warrior',2);assert.equal(p.filter(e=>e.damage).length,3);assert.equal(b.effects.filter(e=>e.vfxKey==='physical-circular').length,1);
}
{
 const {b,u,t}=cast('omnamusha');let e=b.effects.find(e=>e.vfxKey==='physical-cross');assert.equal(e.vfxStart,0);assert.equal(e.vfxEnd,4);
 G.step(b,.1);G.step(b,.1);G.step(b,.03);
 e=b.effects.find(e=>e.vfxKey==='physical-cross'&&e.vfxStart===4);assert(e,'second segment only on the second actual hit');assert.equal(e.vfxEnd,8);
}
{
 const {b,t}=cast('omnamusha');t.hp=0;G.step(b,.1);G.step(b,.1);G.step(b,.03);assert(!b.effects.some(e=>e.vfxKey==='physical-cross'&&e.vfxStart===4),'no phantom second cut after target dies');
}
{
 const {b,u,t}=arena('pirate');G.hit(b,u,t,100,[],false,{crit:true});assert.equal(b.effects.filter(e=>e.vfxKey==='physical-crit').length,1);assert(b.effects.find(e=>e.kind==='slash').critVisualHandled);
}
for(const [key,c]of Object.entries(FX.clips)){const file=fs.readFileSync('dist/'+c.src);assert.equal(file.readUInt32BE(16),c.cell*c.frames);assert.equal(file.readUInt32BE(20),96);assert.equal(c.durations.length,c.frames);assert.equal(FX.frameAt(key,0),0);assert.equal(FX.frameAt(key,c.durations.reduce((s,n)=>s+n,0)/1000),-1);}
// Real engine runs with/without visual hooks must have identical unit state and results.
for(const speed of [1,1.5,2,3])for(const type of ['warrior','omnamusha','berserker','fighter','hero_troll','hero_ib_wayfarer']){
 const run=enabled=>{globalThis.JourneyPhysicalVfx=enabled?FX:null;const {b,u,t}=arena(type);u.speed=G.BY[type].speed;t.speed=30;u.charge=G.skillLimit(u);u.progress=u.charge;u.cooldown=0;t.cooldown=0;for(let i=0;i<400;i++)G.step(b,speed/60);return JSON.stringify({units:b.units,result:b.result,stats:b.stats,time:b.time});};
 assert.equal(run(true),run(false),type+' gameplay unchanged at '+speed+'x');
}
globalThis.JourneyPhysicalVfx=FX;
// Real renderer reads the approved non-uniform frame durations and never mutates effects.
const ctx={Image:class{constructor(){this.complete=true;this.naturalWidth=768;}},JourneyPhysicalVfx:FX,paintEffects(){},paintUnitSkills(){},paintZones(){},Math};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/vfx-data.js','utf8')+fs.readFileSync('dist/game-9.js','utf8'),ctx);
let calls=[];const c={globalAlpha:1,save(){},restore(){},translate(){},rotate(){},scale(){},drawImage(...args){calls.push(args)}};
for(const key of Object.keys(FX.clips))for(const speed of [1,1.5,2,3]){let elapsed=0;const a=FX.clips[key],full=a.durations.reduce((s,n)=>s+n,0)/1000;while(elapsed<full-1e-8){const e={kind:'physical',vfxKey:key,x:10,y:10,life:full-elapsed,full};const before=JSON.stringify(e);calls=[];ctx.paintEffects(c,[e]);assert.equal(calls.length,1);assert.equal(calls[0][1],FX.frameAt(key,elapsed)*96);assert.equal(JSON.stringify(e),before);elapsed+=speed/60;}}
console.log('PASS ten approved atlases, exact frame durations, physical mapping, actual critical, one circular/combo visual, cross conditional second hit, renderer and identical gameplay at 1/1.5/2/3x.');
