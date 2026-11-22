const assert=require('node:assert/strict');require('../dist/game-0.js');const G=Game,P=Progress,F=require('../dist/tutorial-flow.js');
P.load(null);assert.deepEqual(P.profile.decks,['vanguard']);P.profile.diamonds=100;assert.equal(P.buy('deck','balanced'),false);assert.equal(P.buy('deck','swift'),false);
let s;
require('./tutorial-v24.cjs');
// Skip does not grant access immediately; first encounter victory does, even in a later run.
P.load(null);P.profile.onboarding.status='skipped';s=G.fresh('vanguard',2);assert(!s.tutorial);G.enter(s,'c1');s.score=[2,0];s.phase='battle';G.finish(s,'win');assert(P.profile.decks.includes('balanced'));assert(P.profile.decks.includes('swift'));
// Older profile keeps unlocks; a new-version in-progress profile stays locked on reload.
let legacy=P.freshProfile();delete legacy.onboarding;legacy.decks=['vanguard','balanced','swift','arcane'];P.load(legacy);assert(P.profile.decks.includes('arcane'));assert(P.profile.milestones.includes('firstSteps'));P.load(null);let raw=JSON.parse(JSON.stringify(P.profile));P.load(raw);assert.deepEqual(P.profile.decks,['vanguard']);
// Replays do not award encounter progress, losses or diamonds, and retain a serializable return state.
s=G.fresh('vanguard',4);s.tutorialReplay=true;s.tutorialReturnState=G.fresh('balanced',9);G.enter(s,'c1');const before=JSON.stringify(P.profile);s.phase='battle';s.score=[2,0];G.finish(s,'win');assert.equal(JSON.stringify(P.profile),before);assert(JSON.parse(JSON.stringify(s)).tutorialReturnState);P.completeTutorial();assert(P.profile.decks.includes('swift'));
// Resuming a saved combat restarts its round safely; later steps retain their identity.
s=G.fresh('vanguard',5);s.tutorial={mode:'guided',initialized:true,step:'watch'};s.phase='prep';s.round=1;assert.equal(F.reconcile(s,null),'fight');
s.tutorial.step='place-warrior';s.tutorial.warrior=s.hand[0];assert.equal(F.reconcile(s,null),'select-warrior');
console.log('PASS starter gate, skip fallback, legacy migration, replay isolation and combat resume');
