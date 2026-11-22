/* Integration regressions: event idempotence, migration, localization and UI contracts. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
for(const f of ['game-0','balance-p1','decks-p3','training-engine','raid-engine','monster-engine','acts-engine','enemy-decks-p4','boss-engine','map-variety','tree-data','tree-engine','journey-debug','content-v53','traits-v54','supports-b'])require('../dist/'+f+'.js');
const G=Game,P=Progress,X=JourneyDecksP3;
P.load(P.freshProfile());assert.equal(X.visibleDecks().length,15);
P.profile.blackfangUnlocked=true;X.sync();assert.equal(X.visibleDecks().length,19);
P.profile.dawncrestUnlocked=true;X.sync();assert.equal(X.visibleDecks().length,24);
P.load(P.freshProfile());const s=G.fresh('vanguard',731);delete s.tutorial;s.journey.act=2;s.current={id:'cp1-map2boss',type:'boss',layer:14};s.score=[3,0];s.mapBattles=9;s.ai=null;
P.encounterWin(s);assert.equal(P.profile.stats.map2Bosses,1);assert(P.profile.decks.includes('quake'));
const progress=JSON.stringify(P.profile);P.encounterWin(s);assert.equal(JSON.stringify(P.profile),progress,'duplicate win must not grant or count again');
P.load(JSON.parse(progress));const once=JSON.stringify(P.profile);P.load(JSON.parse(once));assert.equal(JSON.stringify(P.profile),once,'reloading migration is idempotent');
const ctx={Game:G,JourneyDecksP3:X,JourneySupportB,localStorage:{getItem:()=> 'pt-BR',setItem:()=>{}},navigator:{language:'pt-BR'},document:{body:null}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(require.resolve('../dist/game-5.js'),'utf8')+';this.i18n=I18n;',ctx);
for(const id of Object.keys(JourneySupportB.SPEC)){const u=G.BY[id];ctx.i18n.set('pt-BR');assert.equal(ctx.i18n.t(u.detail),u.detailPT,id+' PT aura');ctx.i18n.set('en');assert.equal(ctx.i18n.t(u.detailPT),u.detail,id+' EN aura');}
for(const [pt,en]of Object.entries(X.EN)){ctx.i18n.set('en');assert.equal(ctx.i18n.t(pt),en);ctx.i18n.set('pt-BR');assert.equal(ctx.i18n.t(en),pt);}
console.log('PASS integration CP1: hidden order decks (15/19/24), one-time map-2 boss rewards, idempotent migration, 10 aura descriptions and all new deck translations in both languages.');
