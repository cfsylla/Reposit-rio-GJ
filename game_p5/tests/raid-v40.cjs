const assert=require('node:assert/strict');require('../dist/game-0.js');require('../dist/training-engine.js');require('../dist/raid-engine.js');const G=Game,R=JourneyRaid;
function setup(round=3){const s=R.build(Training.defaults(),40);s.round=round;s.energy=100;G.deploy(s,s.hand[0],2);const b=G.createBattle(s);return {s,b,boss:b.units.find(u=>u.raidBoss),ally:b.units.find(u=>!u.side)};}
// Surviving teams continue beyond old 60s timeout, even with old saved config.
for(const speed of [1,1.5,2]){let {s,b,boss,ally}=setup();b.raid.config.roundSeconds=60;ally.hp=ally.maxhp=1e8;ally.atk=0;boss.atk=0;b.raid.config.rootDamage=0;for(let t=0;t<75;t+=speed/60){let remaining=speed/60;while(remaining>1e-8){const dt=Math.min(remaining,1/60);G.step(b,dt);remaining-=dt;}}assert(!b.result);assert(b.time>74);assert(!b.frenzy);let resumed=R.restore(R.snapshot(s,b));assert.equal(resumed.battle.units.find(u=>u.raidBoss).y,180);assert.equal(resumed.battle.raid.config.roundSeconds,undefined);resumed.battle.units.filter(u=>!u.side).forEach(u=>u.hp=0);G.step(resumed.battle,.01);assert.equal(resumed.battle.result,'loss');G.finish(resumed.state,'loss');assert.equal(resumed.state.score[1],1);}
// Melee reaches the boss's ground footprint and attacks outside the trunk.
let {s,b,boss,ally}=setup(1);ally.hp=ally.maxhp=1e8;boss.atk=0;for(let i=0;i<1200&&!b.result;i++)G.step(b,1/60);assert(ally.hits>0);assert(Math.hypot(ally.x-boss.x,ally.y-boss.y)>=54);assert.equal(boss.y,180);assert.equal(boss.x,215);
// Skill motion cannot put an ally inside the boss footprint.
({s,b,boss,ally}=setup(1));ally.motion={x:215,y:180,life:.01};G.step(b,.01);assert(Math.hypot(ally.x-boss.x,ally.y-boss.y)>=54);
// Victory still has priority over simultaneous elimination.
({s,b,boss,ally}=setup(5));boss.hp=0;ally.hp=0;G.step(b,.01);assert.equal(b.result,'win');G.finish(s,b.result);assert.equal(s.phase,'victory');
console.log('PASS v40 no raid timeout at all speeds/old saves, ground contact, skill footprint, immediate victory');
