(function(root){'use strict';
const G=root.Game,clone=v=>JSON.parse(JSON.stringify(v));
function side(deck='vanguard'){const d=G.DECKS.find(d=>d.id===deck)||G.DECKS[0];return {source:d.id,cards:G.deckCards(d).map(type=>({type,level:0})),relics:[d.startRelic]};}
function defaults(){return {difficulty:'normal',wins:3,player:side(),enemy:side()};}
function validate(c,visible=G.UNITS.map(u=>u.id)){
 if(!c||!['normal','elite','boss'].includes(c.difficulty)||!Number.isInteger(c.wins)||c.wins<1||c.wins>10)return 'settings';
 for(const key of ['player','enemy']){const s=c[key],counts={};if(!s||!Array.isArray(s.cards)||s.cards.length!==20)return 'deck';for(const v of s.cards){if(!visible.includes(v.type)||!G.BY[v.type]||!Number.isInteger(v.level)||v.level<0||v.level>2)return 'card';counts[v.type]=(counts[v.type]||0)+1;if(counts[v.type]>4)return 'copies';}if(!Array.isArray(s.relics)||new Set(s.relics).size!==s.relics.length||s.relics.some(id=>!G.ARTIFACTS.some(a=>a.id===id))||!G.packBag(s.relics))return 'relics';}return null;
}
function build(config,seed=Date.now(),visible){const error=validate(config,visible);if(error)throw Error(error);const c=clone(config),s=G.fresh('vanguard',seed);s.training=c;s.tutorial={mode:'skipped'};s.tutorialOpponent=false;s.tutorialReplay=true;s.meta=null;s.campaignRoute=null;s.cards=[];s.serial=0;s.phase='prep';s.round=1;s.energy=0;s.score=[0,0];s.roundStats=[];s.encounterStats=[];s.mapBattles={normal:1,elite:4,boss:9}[c.difficulty];s.encounters=1;s.current={id:'training',type:c.difficulty==='normal'?'battle':c.difficulty,name:'Training',layer:0};s.artifacts=[...c.player.relics];s.reserve=[];s.pendingRelic=null;s.bag={items:G.packBag(s.artifacts)};s.board=Array(15).fill(null);s.bench=Array(6).fill(null);s.fusions={};s.deployedAt={};s.deploySerial=0;s.draw=[];s.discard=[];s.hand=[];s.handFrozen=false;s.enemyRevealed=false;
 for(const v of c.player.cards){const card=G.newCard(s,v.type);card.level=v.level;}
 s.draw=G.shuffle(s.cards.map(v=>v.uid),()=>G.random(s));s.hand=s.draw.splice(-4);s.energy=G.energyIncome(s);
 const cards=c.enemy.cards.map((v,i)=>({...v,uid:'training-e'+i}));s.ai={cards,draw:G.shuffle(cards.map(v=>v.uid),()=>G.random(s)),discard:[],hand:[],board:Array(15).fill(null),bench:Array(6).fill(null),fusions:{},deployedAt:{},deploySerial:0,lastRound:0,energy:0,elite:c.difficulty!=='normal',deckId:'training',deckName:'Training',strategy:'balanced',boostedTypes:[],artifacts:[...c.enemy.relics],bag:{items:G.packBag(c.enemy.relics)}};G.ensureScenery(s);return s;
}
root.Training={defaults,side,validate,build};if(typeof module!=='undefined')module.exports=root.Training;
})(typeof globalThis!=='undefined'?globalThis:this);
