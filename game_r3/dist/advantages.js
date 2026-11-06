/* Vantagens (GJ-v54-BAL post-CP1, approved list; test copy).
 * Each Insignia activates one Advantage, in any order; deactivation refunds it. Selected Advantages are active in
 * normal runs (never in training or tutorial replay). Separate from the skill tree.
 * Profile (optional field): profile.advantages = [ids]. Run state: s.adv = {...} (per-run usage flags).
 * Choices that need the player (Planned Hand, Trained Eye) are exposed as API calls for the interface. */
(function(root){'use strict';
const G=root.Game,P=root.Progress,T=root.JourneyTree,C=root.JourneyContent,A=root.JourneyActs;
const LIST=[
 {id:'travel_relic',en:'Travel Relic',pt:'Relíquia de Viagem',enDesc:'Start each run with +1 random common relic that fits the bag.',ptDesc:'Começa cada run com +1 relíquia comum aleatória que caiba na bolsa.'},
 {id:'pretraining',en:'Pre-Training',pt:'Treino Prévio',enDesc:'2 random deck cards start with upgrade 1.',ptDesc:'2 cartas aleatórias do deck começam com upgrade 1.'},
 {id:'flex_prep',en:'Flexible Preparation',pt:'Preparação Flexível',enDesc:'Once per round, refresh your hand for free.',ptDesc:'Uma vez por rodada, renova a mão de graça.'},
 {id:'efficient_fusion',en:'Efficient Fusion',pt:'Fusão Eficiente',enDesc:'Every fusion completed refunds 1 energy.',ptDesc:'Toda fusão concluída devolve 1 de energia.'},
 {id:'full_purse',en:'Full Purse',pt:'Bolsa Cheia',enDesc:'+20 starting gold.',ptDesc:'+20 de ouro inicial.'},
 {id:'elite_experience',en:'Elite Experience',pt:'Experiência de Elite',enDesc:'Each elite defeated grants all your units +0.5% health and attack until the end of the run.',ptDesc:'Cada elite vencida dá +0,5% de vida e ataque a todas as suas unidades até o fim da run.'},
 {id:'trained_eye',en:'Trained Eye',pt:'Olho Treinado',enDesc:'One free reroll on every relic choice.',ptDesc:'1 renovação grátis em toda escolha de relíquia.'},
 {id:'rehearsal',en:'Rehearsal',pt:'Ensaio',enDesc:'The first card bought in each shop comes with upgrade 2.',ptDesc:'A primeira carta comprada em cada loja vem com upgrade 2.'},
 {id:'planned_hand',en:'Planned Hand',pt:'Mão Planejada',enDesc:'Before the run, choose a deck card: one copy starts in your hand in every other confrontation (1st, 3rd, 5th...).',ptDesc:'Antes da run, escolhe uma carta do deck: uma cópia começa na mão em confrontos alternados (1º, 3º, 5º...).'},
 {id:'saved_energy',en:'Saved Energy',pt:'Energia Guardada',enDesc:'+1 energy in the first round of each confrontation.',ptDesc:'+1 de energia na primeira rodada de cada confronto.'},
 {id:'cleanse',en:'Cleanse',pt:'Limpeza',enDesc:'One free card removal in the first shop of each map.',ptDesc:'Uma remoção de carta grátis na primeira loja de cada mapa.'},
 {id:'path_blessing',en:'Path Blessing',pt:'Bênção do Caminho',enDesc:'Entering maps 2 and 3 upgrades 1 random deck card to level 2 and another to level 1.',ptDesc:'Ao entrar nos mapas 2 e 3, 1 carta aleatória do deck recebe upgrade 2 e outra upgrade 1.'},
 {id:'interest',en:'Interest',pt:'Juros',enDesc:'Defeating each map boss grants 50% of your saved gold (max. 75).',ptDesc:'Vencer o boss de cada mapa concede 50% do ouro guardado (máx. 75).'},
 {id:'elite_hunter',en:'Elite Hunter',pt:'Caçador de Elites',enDesc:'Defeating an elite grants +12 gold.',ptDesc:'Vencer uma elite concede +12 de ouro.'},
 {id:'second_chance',en:'Second Chance',pt:'Segunda Chance',enDesc:'Once per run, losing a confrontation (except bosses) replays only the last round: the score is kept and the enemy loses 1 point.',ptDesc:'Uma vez por run, perder um confronto (exceto bosses) repete só a última rodada: o placar continua e o inimigo perde 1 ponto.'},
];
const BY=Object.fromEntries(LIST.map(a=>[a.id,a]));
const TUNE=root.JOURNEY_ADVANTAGE_TUNE={pretraining:2,pretrainingLevel:1,pretrainingLevels:[1,1],rehearsalLevel:2,eyeMode:'every',secondMode:'round',blessingLevel:1,blessingCount:1,blessingLevels:[2,1],flexUses:1,flexScope:'round',fusionRefund:1,fusionPerRound:99,plannedCount:1,plannedFreq:'alternate',eliteHp:.005,eliteAtk:.005,eliteCap:99,fullPurse:20,interest:.5,interestMax:75,eliteGold:12,...(root.JOURNEY_ADVANTAGE_TUNE||{})};

function owned(){const p=P.profile;p.advantages=[...new Set((p.advantages||[]).filter(id=>BY[id]))];return p.advantages;}
function eligible(s){return !!s&&!s.training&&!s.tutorialReplay;}
function has(s,id){return eligible(s)&&(s.adv?.owned??owned()).includes(id);}
function buy(id){const p=P.profile;if(!BY[id]||owned().includes(id)||!(p.insignia>=1))return false;p.insignia-=1;p.advantages.push(id);return true;}
// Selection may change between runs; an active run keeps s.adv.owned.
function deactivate(id){const ids=owned(),i=ids.indexOf(id);if(i<0)return false;ids.splice(i,1);P.profile.insignia=Math.max(0,Number(P.profile.insignia)||0)+1;return true;}
function reset(){const count=owned().length;if(!count)return 0;P.profile.advantages=[];P.profile.insignia=Math.max(0,Number(P.profile.insignia)||0)+count;return count;}
function act(s){return A?.act(s)||1;}
function rnd(s){return G.random(s);}
function pick(s,list){return list.length?list[Math.floor(rnd(s)*list.length)]:null;}
function deckTypes(s){return [...new Set(s.cards.filter(c=>!C?.isCurse(c)).map(c=>c.type))];}
function repack(s){const items=G.packBag(s.artifacts,s);if(items)s.bag={items};G.ensureBag(s);}
function upgradeRandom(s,n){for(let i=0;i<n;i++){const c=pick(s,s.cards.filter(c=>!C?.isCurse(c)&&c.level<2));if(c)c.level++;}}

/* Run start: called once on confirmation, while still on the map. Enter remains a compatibility fallback. */
function start(s){if(!eligible(s)||s.adv)return;s.adv={owned:[...owned()],planned:deckTypes(s).includes(s.plannedHandChoice)?s.plannedHandChoice:null,shops:{},cleanse:[],eye:[],interest:[],firstShops:{},second:false};
 if(has(s,'full_purse'))s.gold+=TUNE.fullPurse;
 if(has(s,'pretraining')){const levels=TUNE.pretrainingLevels||Array(TUNE.pretraining).fill(TUNE.pretrainingLevel);for(const L of levels){const c=pick(s,s.cards.filter(c=>!C?.isCurse(c)&&c.level===0));if(c)c.level=L;}}
 if(has(s,'travel_relic')){const ids=G.unownedRelics(s).filter(id=>G.ARTIFACTS.find(a=>a.id===id)?.rarity===0&&G.packBag([...s.artifacts,id],s));const id=pick(s,ids);if(id){s.artifacts.push(id);repack(s);}}
}
// Include event rewards and event relic pickers, preserving their rarity restrictions.
function relicChoice(s,key){
 if(!key&&s.phase==='relic'&&Array.isArray(s.offers))return {ids:s.offers,set:ids=>{s.offers=ids;},key:'node',pool:G.unownedRelics(s)};
 if(!key&&s.phase==='eventReward'&&s.eventPending?.relic)return {ids:s.eventPending.artifactOptions,set:ids=>{s.eventPending.artifactOptions=ids;},key:'reward',pool:G.unownedRelics(s)};
 const ev=s.offers?.content;if(s.phase!=='event'||!ev||s.offers.resolved)return null;
 let ids,set,pool=G.unownedRelics(s);
 if(key==='rewardRelic'){ids=ev.relics;set=x=>{ev.relics=x;};}
 else if(key==='rareRelic'){ids=ev.rareRelics;set=x=>{ev.rareRelics=x;};pool=pool.filter(id=>G.ARTIFACTS.find(r=>r.id===id).rarity===2);}
 else if(key==='forgeRelic'&&ev.selection.relic){ids=ev.forge[ev.selection.relic];set=x=>{ev.forge[ev.selection.relic]=x;};const rarity=G.ARTIFACTS.find(r=>r.id===ev.selection.relic)?.rarity||0;pool=pool.filter(id=>id!==ev.selection.relic&&G.ARTIFACTS.find(r=>r.id===id).rarity>=rarity);}
 if(!ids)return null;return {ids,set,key,pool,selection:ev.selection};
}
function relicChoiceKey(s,c){const a=s.adv,node=act(s)+':'+s.current.id+':'+c.key;a.eyeChoices??={};let state=a.eyeChoices[node];if(!state||c.key==='node'&&state.ids.join('|')!==c.ids.join('|'))state=a.eyeChoices[node]={ids:[...c.ids],used:false};return state;}
function canReroll(s,key){if(!has(s,'trained_eye')||!s.adv)return false;const c=relicChoice(s,key);if(!c?.ids.length||!c.pool.some(id=>!c.ids.includes(id)))return false;return !relicChoiceKey(s,c).used;}
function rerollRelic(s,key){if(!canReroll(s,key))return false;const c=relicChoice(s,key),state=relicChoiceKey(s,c),pool=c.pool.filter(id=>!c.ids.includes(id)),out=[];while(out.length<c.ids.length&&pool.length)out.push(pool.splice(Math.floor(rnd(s)*pool.length),1)[0]);c.set(out);if(c.selection)delete c.selection[key];state.ids=[...out];state.used=true;s.adv.eye.push(act(s));return true;}

/* Hooks */
const enter=G.enter;G.enter=function(s,id){const ok=enter(s,id);if(ok){start(s);if(s.adv&&s.current?.type==='shop'){s.adv.firstShops??={};s.adv.firstShops[act(s)]??=s.current.id;}}return ok;};
/* Preparação Flexível: free refreshes (normal refresh rules, cost waived). scope 'confront' (per confrontation) or 'round'. */
function flexLeft(s){if(!has(s,'flex_prep')||!s.adv)return 0;const key=TUNE.flexScope==='round'?s.encounters+':'+s.round:String(s.encounters);s.adv.flex??={};return TUNE.flexUses-(s.adv.flex[key]||0);}
function useFlex(s){const key=TUNE.flexScope==='round'?s.encounters+':'+s.round:String(s.encounters);s.adv.flex[key]=(s.adv.flex[key]||0)+1;}
const refresh=G.refreshHand;G.refreshHand=function(s){const free=flexLeft(s)>0&&s.phase==='prep'&&s.hand.length>0;if(free)s.energy+=1;const ok=refresh(s);if(free){if(ok)useFlex(s);else s.energy-=1;}return ok;};
/* Fusão Eficiente: refund after a fusion is actually completed, at most fusionPerRound per round. */
const deploy=G.deploy;G.deploy=function(s,...args){const before=s.fusionSerial||0,ok=deploy(s,...args);if(ok&&has(s,'efficient_fusion')&&(s.fusionSerial||0)>before&&s.adv){const key=s.encounters+':'+s.round;s.adv.fuse??={};if((s.adv.fuse[key]||0)<TUNE.fusionPerRound){s.adv.fuse[key]=(s.adv.fuse[key]||0)+1;s.energy+=TUNE.fusionRefund;}}return ok;};
/* Mão Planejada: the chosen type is placed on top of the draw pile for the first draw of each confrontation (an existing copy; none is created). */
/* frequency: 'all' confrontations, 'elitesBosses' only, or 'alternate' (every other confrontation of the run) */
function plannedApplies(s){if(TUNE.plannedFreq==='elitesBosses')return ['elite','boss'].includes(s.current?.type);if(TUNE.plannedFreq==='alternate'){s.adv.plannedCount=(s.adv.plannedCount||0)+1;return s.adv.plannedCount%2===1;}return true;}
function plannedOptions(s){return has(s,'planned_hand')&&s.adv&&!s.adv.planned?deckTypes(s):[];}
function choosePlanned(s,type){if(!plannedOptions(s).includes(type))return false;s.adv.planned=type;return true;}
if(C?.draw){const draw=C.draw;C.draw=function(s,n){if(has(s,'planned_hand')&&s.adv?.planned&&s.round===1&&!s.hand.length&&s.adv.plannedAt!==s.encounters&&s.phase==='prep'){s.adv.plannedAt=s.encounters;if(plannedApplies(s))for(let k=0;k<TUNE.plannedCount;k++){const i=s.draw.findIndex(id=>s.cards.find(c=>c.uid===id)?.type===s.adv.planned);if(i>=0){const [id]=s.draw.splice(i,1);s.draw.push(id);}}}return draw(s,n);};}
/* Experiência de Elite: additive stacks, player units only, whole run. */
if(T?.stats){const stats=T.stats;T.stats=function(st,c,s,enemy){st=stats(st,c,s,enemy)||st;const k=!enemy&&has(s,'elite_experience')?Math.min(TUNE.eliteCap,s.adv?.eliteStacks||0):0;if(k){st.hp*=1+TUNE.eliteHp*k;st.atk*=1+TUNE.eliteAtk*k;}return st;};}
function energy(s,enemy){return !enemy&&has(s,'saved_energy')&&s.round===1?1:0;}
if(T){const price=T.price;T.price=function(s,kind,base,merchant){const a=price(s,kind,base,merchant);if(kind==='remove'&&has(s,'cleanse')&&s.current?.type==='shop'&&!s.adv?.cleanse.includes(act(s))&&(!s.adv?.firstShops?.[act(s)]||s.adv.firstShops[act(s)]===s.current.id))return 0;return a;};}
const service=G.shopService;G.shopService=function(s,kind,id){const free=kind==='remove'&&has(s,'cleanse')&&s.current?.type==='shop'&&!s.adv?.cleanse.includes(act(s))&&(!s.adv?.firstShops?.[act(s)]||s.adv.firstShops[act(s)]===s.current.id);const ok=service(s,kind,id);if(ok&&free)s.adv.cleanse.push(act(s));return ok;};
const purchase=G.buy;G.buy=function(s,kind,index){const before=s.cards.length,ok=purchase(s,kind,index);if(ok&&kind==='cards'&&has(s,'rehearsal')&&s.current?.type==='shop'&&!s.adv?.shops[s.current.id]&&s.cards.length>before){const c=s.cards[s.cards.length-1];if(c.level<TUNE.rehearsalLevel)c.level=TUNE.rehearsalLevel;s.adv.shops[s.current.id]=true;}return ok;};
const advance=A.advance;A.advance=function(s){const before=act(s),ok=advance(s);if(ok&&has(s,'path_blessing')&&act(s)>before&&act(s)>=2)for(const L of (TUNE.blessingLevels||Array(TUNE.blessingCount).fill(TUNE.blessingLevel))){const c=pick(s,s.cards.filter(c=>!C?.isCurse(c)&&c.level<L));if(c)c.level=L;}return ok;};
const encounter=P.encounterWin;P.encounterWin=function(s){const before=s.meta?.encounters?.length||0,r=encounter(s),recorded=(s.meta?.encounters?.length||0)>before;if(recorded&&has(s,'elite_experience')&&s.current?.type==='elite'&&!s.eventEncounter&&s.adv)s.adv.eliteStacks=(s.adv.eliteStacks||0)+1;if(recorded&&has(s,'elite_hunter')&&s.current?.type==='elite'&&!s.eventEncounter)G.rewardGold?G.rewardGold(s,TUNE.eliteGold):(s.gold+=TUNE.eliteGold);return r;};
const finish=P.finish;P.finish=function(s,reason){
 if(eligible(s)&&reason==='defeat'&&!s.meta?.ended&&has(s,'second_chance')&&!s.adv?.second&&s.current&&['battle','elite'].includes(s.current.type)&&!s.eventEncounter&&!s.raid){
  s.adv.second=s.current.id;if(TUNE.secondMode==='round'){s.score[1]=Math.max(0,G.winsNeeded(s)-1);s.phase='roundResult';G.nextRound(s);return false;}s.mapBattles=Math.max(0,(s.mapBattles||1)-1);s.encounters=Math.max(0,(s.encounters||1)-1);G.startConfront(s,s.current);return false;}
 if(eligible(s)&&reason==='victory'&&has(s,'interest')&&s.current?.type==='boss'&&s.adv&&!s.adv.interest.includes(act(s))){s.adv.interest.push(act(s));s.gold+=Math.min(TUNE.interestMax,Math.floor(s.gold*TUNE.interest));}
 return finish(s,reason);};

root.JourneyAdvantages={LIST,flexLeft,plannedOptions,choosePlanned,BY,TUNE,owned,has,buy,deactivate,reset,start,canReroll,rerollRelic,energy};
})(typeof globalThis!=='undefined'?globalThis:this);
