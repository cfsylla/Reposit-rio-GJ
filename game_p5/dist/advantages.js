/* Vantagens (GJ-v54-BAL post-CP1, approved list; test copy).
 * Each Insignia (Desafios da Jornada) buys one Advantage, in any order. Every owned Advantage is always active in
 * normal runs (never in training or tutorial replay). Separate from the skill tree.
 * Profile (optional field): profile.advantages = [ids]. Run state: s.adv = {...} (per-run usage flags).
 * Choices that need the player (Twin, Chosen Relic, Trained Eye) are exposed as API calls for the interface. */
(function(root){'use strict';
const G=root.Game,P=root.Progress,T=root.JourneyTree,C=root.JourneyContent,A=root.JourneyActs;
const LIST=[
 {id:'travel_relic',en:'Travel Relic',pt:'Relíquia de Viagem',enDesc:'Start each run with +1 random common relic that fits the bag.',ptDesc:'Começa cada run com +1 relíquia comum aleatória que caiba na bolsa.'},
 {id:'pretraining',en:'Pre-Training',pt:'Treino Prévio',enDesc:'2 random deck cards start with upgrade 1.',ptDesc:'2 cartas aleatórias do deck começam com upgrade 1.'},
 {id:'reinforcement',en:'Reinforcement',pt:'Reforço',enDesc:'+1 copy of a random deck card (up to 4 copies).',ptDesc:'+1 cópia de uma carta aleatória do deck (até 4 cópias).'},
 {id:'twin',en:'Twin',pt:'Gêmeo',enDesc:'At the start of the run, choose 1 deck card to duplicate (up to 4 copies).',ptDesc:'No início da run, escolhe 1 carta do deck para duplicar (até 4 cópias).'},
 {id:'full_purse',en:'Full Purse',pt:'Bolsa Cheia',enDesc:'+20 starting gold.',ptDesc:'+20 de ouro inicial.'},
 {id:'chosen_relic',en:'Chosen Relic',pt:'Relíquia Escolhida',enDesc:'At the start of the run, you may swap the starting relic for one of 3 options.',ptDesc:'No início da run, pode trocar a relíquia inicial por uma de 3 opções.'},
 {id:'trained_eye',en:'Trained Eye',pt:'Olho Treinado',enDesc:'Once per map, reroll a relic choice.',ptDesc:'Uma vez por mapa, renova uma escolha de relíquia.'},
 {id:'rehearsal',en:'Rehearsal',pt:'Ensaio',enDesc:'The first card bought in each shop comes with upgrade 1.',ptDesc:'A primeira carta comprada em cada loja vem com upgrade 1.'},
 {id:'steady_hand',en:'Steady Hand',pt:'Mão Firme',enDesc:'+1 card in hand in the first round of each confrontation.',ptDesc:'+1 carta na mão na primeira rodada de cada confronto.'},
 {id:'saved_energy',en:'Saved Energy',pt:'Energia Guardada',enDesc:'+1 energy in the first round of each confrontation.',ptDesc:'+1 de energia na primeira rodada de cada confronto.'},
 {id:'cleanse',en:'Cleanse',pt:'Limpeza',enDesc:'One free card removal in the first shop of each map.',ptDesc:'Uma remoção de carta grátis na primeira loja de cada mapa.'},
 {id:'path_blessing',en:'Path Blessing',pt:'Bênção do Caminho',enDesc:'Entering maps 2 and 3 upgrades 1 random deck card.',ptDesc:'Ao entrar nos mapas 2 e 3, 1 carta aleatória do deck recebe upgrade.'},
 {id:'interest',en:'Interest',pt:'Juros',enDesc:'Defeating each map boss grants 10% of your saved gold (max. 15).',ptDesc:'Vencer o boss de cada mapa concede 10% do ouro guardado (máx. 15).'},
 {id:'elite_hunter',en:'Elite Hunter',pt:'Caçador de Elites',enDesc:'Defeating an elite grants +12 gold.',ptDesc:'Vencer uma elite concede +12 de ouro.'},
 {id:'second_chance',en:'Second Chance',pt:'Segunda Chance',enDesc:'Once per run, losing a confrontation (except bosses) does not end the run: it restarts from the beginning.',ptDesc:'Uma vez por run, perder um confronto (exceto bosses) não encerra a run: ele recomeça do início.'},
];
const BY=Object.fromEntries(LIST.map(a=>[a.id,a]));
const TUNE=root.JOURNEY_ADVANTAGE_TUNE={pretraining:2,fullPurse:20,interest:.10,interestMax:15,eliteGold:12,...(root.JOURNEY_ADVANTAGE_TUNE||{})};

function owned(){const p=P.profile;p.advantages=[...new Set((p.advantages||[]).filter(id=>BY[id]))];return p.advantages;}
function eligible(s){return !!s&&!s.training&&!s.tutorialReplay;}
function has(s,id){return eligible(s)&&owned().includes(id);}
function buy(id){const p=P.profile;if(!BY[id]||owned().includes(id)||!(p.insignia>=1))return false;p.insignia-=1;p.advantages.push(id);return true;}
function act(s){return A?.act(s)||1;}
function rnd(s){return G.random(s);}
function pick(s,list){return list.length?list[Math.floor(rnd(s)*list.length)]:null;}
function deckTypes(s){return [...new Set(s.cards.filter(c=>!C?.isCurse(c)).map(c=>c.type))];}
function repack(s){const items=G.packBag(s.artifacts,s);if(items)s.bag={items};G.ensureBag(s);}
function upgradeRandom(s,n){for(let i=0;i<n;i++){const c=pick(s,s.cards.filter(c=>!C?.isCurse(c)&&c.level<2));if(c)c.level++;}}

/* Run start: called once when the run enters its first map node (after the challenges are fixed). */
function start(s){if(!eligible(s)||s.adv)return;s.adv={shops:{},cleanse:[],eye:[],interest:[],twin:false,second:false,startOffers:null};
 if(has(s,'full_purse'))s.gold+=TUNE.fullPurse;
 if(has(s,'pretraining'))upgradeRandom(s,TUNE.pretraining);
 if(has(s,'reinforcement')){const t=pick(s,deckTypes(s).filter(t=>G.copies(s,t)<G.MAX_COPIES));if(t)G.newCard(s,t);}
 if(has(s,'travel_relic')){const ids=G.unownedRelics(s).filter(id=>G.ARTIFACTS.find(a=>a.id===id)?.rarity===0&&G.packBag([...s.artifacts,id],s));const id=pick(s,ids);if(id){s.artifacts.push(id);repack(s);}}
 if(has(s,'chosen_relic')){const pool=G.unownedRelics(s).filter(id=>(G.ARTIFACTS.find(a=>a.id===id)?.rarity??9)<=1),out=[];while(out.length<3&&pool.length)out.push(pool.splice(Math.floor(rnd(s)*pool.length),1)[0]);s.adv.startOffers=out;}
 if(has(s,'twin'))s.adv.twin='pending';}
function twinOptions(s){return s?.adv?.twin==='pending'?deckTypes(s).filter(t=>G.copies(s,t)<G.MAX_COPIES):[];}
function twin(s,type){if(!twinOptions(s).includes(type))return false;G.newCard(s,type);s.adv.twin=type;return true;}
function startRelicOptions(s){return s?.adv?.startOffers||[];}
function chooseStartRelic(s,id){const o=startRelicOptions(s);if(!o.includes(id))return false;const first=s.artifacts[0];const next=[id,...s.artifacts.slice(1)];if(!G.packBag(next,s))return false;s.artifacts=next;repack(s);s.adv.startOffers=[];s.adv.chosenRelic={from:first,to:id};return true;}
function canReroll(s){return has(s,'trained_eye')&&s.phase==='relic'&&Array.isArray(s.offers)&&!s.adv?.eye.includes(act(s));}
function rerollRelic(s){if(!canReroll(s))return false;const n=s.offers.length,pool=G.unownedRelics(s).filter(id=>!s.offers.includes(id)),out=[];while(out.length<n&&pool.length)out.push(pool.splice(Math.floor(rnd(s)*pool.length),1)[0]);if(!out.length)return false;s.offers=out;s.adv.eye.push(act(s));return true;}

/* Hooks */
const enter=G.enter;G.enter=function(s,id){const ok=enter(s,id);if(ok)start(s);return ok;};
function energy(s,enemy){return !enemy&&has(s,'saved_energy')&&s.round===1?1:0;}
if(C?.handSize){const hand=C.handSize;C.handSize=function(s){return hand(s)+(has(s,'steady_hand')&&s.round===1?1:0);};}
if(T){const price=T.price;T.price=function(s,kind,base,merchant){const a=price(s,kind,base,merchant);if(kind==='remove'&&has(s,'cleanse')&&s.current?.type==='shop'&&!s.adv?.cleanse.includes(act(s)))return 0;return a;};}
const service=G.shopService;G.shopService=function(s,kind,id){const free=kind==='remove'&&has(s,'cleanse')&&s.current?.type==='shop'&&!s.adv?.cleanse.includes(act(s));const ok=service(s,kind,id);if(ok&&free)s.adv.cleanse.push(act(s));return ok;};
const purchase=G.buy;G.buy=function(s,kind,index){const before=s.cards.length,ok=purchase(s,kind,index);if(ok&&kind==='cards'&&has(s,'rehearsal')&&s.current?.type==='shop'&&!s.adv?.shops[s.current.id]&&s.cards.length>before){const c=s.cards[s.cards.length-1];if(c.level<1)c.level=1;s.adv.shops[s.current.id]=true;}return ok;};
const advance=A.advance;A.advance=function(s){const before=act(s),ok=advance(s);if(ok&&has(s,'path_blessing')&&act(s)>before&&act(s)>=2)upgradeRandom(s,1);return ok;};
const encounter=P.encounterWin;P.encounterWin=function(s){const r=encounter(s);if(has(s,'elite_hunter')&&s.current?.type==='elite'&&!s.eventEncounter)G.rewardGold?G.rewardGold(s,TUNE.eliteGold):(s.gold+=TUNE.eliteGold);return r;};
const finish=P.finish;P.finish=function(s,reason){
 if(eligible(s)&&reason==='defeat'&&!s.meta?.ended&&has(s,'second_chance')&&!s.adv?.second&&s.current&&['battle','elite'].includes(s.current.type)&&!s.eventEncounter&&!s.raid){
  s.adv.second=s.current.id;s.mapBattles=Math.max(0,(s.mapBattles||1)-1);s.encounters=Math.max(0,(s.encounters||1)-1);G.startConfront(s,s.current);return false;}
 if(eligible(s)&&reason==='victory'&&has(s,'interest')&&s.current?.type==='boss'&&s.adv&&!s.adv.interest.includes(act(s))){s.adv.interest.push(act(s));s.gold+=Math.min(TUNE.interestMax,Math.floor(s.gold*TUNE.interest));}
 return finish(s,reason);};

root.JourneyAdvantages={LIST,BY,TUNE,owned,has,buy,start,twinOptions,twin,startRelicOptions,chooseStartRelic,canReroll,rerollRelic,energy};
})(typeof globalThis!=='undefined'?globalThis:this);
