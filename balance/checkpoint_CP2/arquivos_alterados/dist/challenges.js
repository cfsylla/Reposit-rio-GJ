/* Desafios da Jornada (GJ-v54-BAL post-CP1, approved list; test copy).
 * Rules of revision 2 (02/11/2026): unlocked by the first run victory (map 3 boss); the run level is the NUMBER of active
 * challenges (no grades or weights); sequential access (winning level N unlocks N+1); 1 Insignia on the first victory of each
 * level; each challenge counts as completed after a winning run with it active. Final Challenge (secret boss) comes last.
 * Profile (optional fields): profile.challenges = {unlocked, available, won:[levels], completed:[ids], selected:[ids], final},
 * profile.insignia. Run: s.challenges = [ids], fixed when the run enters its first map node (never in training/tutorial replay).
 * Engine hooks: game-0.js (makeAI upgrades, rollEnemyRelics, enemy stats, maxUnits, energyIncome, bag),
 * tree-engine.js (active nodes), and wrappers below (shop price, gold, card offers, raid scaling). */
(function(root){'use strict';
const G=root.Game,P=root.Progress,T=root.JourneyTree,C=root.JourneyContent,R=root.JourneyRaid,B=root.JourneyBosses;
const LIST=[
 {id:'veterans',en:'Veterans',pt:'Veteranos',enDesc:'Regular enemies have +3 upgrades.',ptDesc:'Inimigos comuns têm +3 upgrades.'},
 {id:'tough',en:'Tough Troops',pt:'Tropas Resistentes',enDesc:'Enemy health +3%.',ptDesc:'Vida dos inimigos +3%.'},
 {id:'relentless',en:'Relentless Attacks',pt:'Ataques Implacáveis',enDesc:'Enemy damage +4%.',ptDesc:'Dano dos inimigos +4%.'},
 {id:'commanders',en:'Prepared Commanders',pt:'Comandantes Preparados',enDesc:'Elites, orders and bosses gain +1 relic and +1 upgrade.',ptDesc:'Elites, ordens e bosses ganham +1 relíquia e +1 upgrade.'},
 {id:'bossrounds',en:'Relentless Bosses',pt:'Bosses Implacáveis',enDesc:'Map bosses (team and leader) have +8% health and damage.',ptDesc:'Bosses de mapa (time e líder) têm +8% de vida e de dano.'},
 {id:'reinforcements',en:'Enemy Reinforcements',pt:'Reforços Inimigos',enDesc:'From the 2nd round on, regular and elite enemies field +1 unit.',ptDesc:'A partir da 2ª rodada, inimigos comuns e elites colocam +1 unidade em campo.'},
 {id:'raidfury',en:'Raid Fury',pt:'Fúria das Raids',enDesc:'Raid health +30% and damage +10%.',ptDesc:'Raids com +30% de vida e +10% de dano.'},
 {id:'inflation',en:'Inflated Market',pt:'Mercado Inflacionado',enDesc:'Shop prices +15%.',ptDesc:'Preços da loja +15%.'},
 {id:'lightpurse',en:'Light Purse',pt:'Bolsa Leve',enDesc:'Gold from victories −20%.',ptDesc:'Ouro por vitória −20%.'},
 {id:'scarce',en:'Scarce Resources',pt:'Recursos Escassos',enDesc:'−1 energy in the first 2 rounds against bosses.',ptDesc:'−1 de energia nas 2 primeiras rodadas contra bosses.'},
 {id:'bag',en:'Limited Luggage',pt:'Bagagem Limitada',enDesc:'Blocks 3 Relic Bag cells.',ptDesc:'Bloqueia 3 casas da bolsa de relíquias.'},
 {id:'heavydeck',en:'Heavy Deck',pt:'Deck Pesado',enDesc:'Start the run with +1 copy of a random card of your deck.',ptDesc:'Começa a run com +1 cópia de uma carta aleatória do próprio deck.'},
 {id:'dissipate',en:'Dissipating Energy',pt:'Energia Dissipada',enDesc:'Lose 1 of the energy left over at the end of each round.',ptDesc:'Perde 1 da energia que sobrar ao fim de cada rodada.'},
 {id:'fewrelics',en:'Scarce Relics',pt:'Relíquias Escassas',enDesc:'Relic choices offer 2 options less (minimum 1).',ptDesc:'Escolhas de relíquia oferecem 2 opções a menos (mínimo 1).'},
 {id:'cursed',en:'Cursed Path',pt:'Caminho Amaldiçoado',enDesc:'Start the run with the Exhaustion curse.',ptDesc:'Começa a run com a maldição Exaustão.'},
];
/* Candidates under evaluation (not in the 15-challenge catalogue until approved). */
const CANDIDATES=[
 {id:'relicswap',en:'Swapped Relic',pt:'Relíquia Trocada',enDesc:'The deck starting relic is replaced by a random relic.',ptDesc:'A relíquia inicial do deck é trocada por uma relíquia aleatória.'},
 {id:'treecap',retired:true,en:'Contained Tree',pt:'Árvore Contida',enDesc:'Your tree is limited to 50 fewer points during the run (latest nodes are disabled first).',ptDesc:'A árvore fica limitada a 50 pontos a menos durante a run (os nós mais recentes são desativados primeiro).'},
 {id:'forcedtwin',en:'Forced Copy',pt:'Cópia Obrigatória',enDesc:'At the start of the run, choose 1 deck card to duplicate (up to 4 copies).',ptDesc:'No início da run, escolhe 1 carta do deck para duplicar (até 4 cópias).'},
];
const BY=Object.fromEntries([...LIST,...CANDIDATES].map(c=>[c.id,c]));
const MAX_LEVEL=LIST.length;
// Single intensity per challenge (revision 2: the level is the number of active challenges). Calibrated by simulation.
const TUNE=root.JOURNEY_CHALLENGE_TUNE={veterans:3,commanders:1,commanderRelics:1,tough:.03,relentless:.04,bossRounds:0,bossStats:.08,raidfury:.30,raidDamage:.10,inflation:.15,lightpurse:.20,bagCells:3,treecap:50,curses:['exhaustion'],reinforceFromRound:2,heavyCards:1,heavyMode:'copy',forcedTwinCount:1,dissipateMode:'fixed',dissipateFixed:1,dissipateKeep:2,scarceRounds:2,heavyPool:['warrior','lancer','fighter','martial_artist','miner','pirate','ranger','shackled_pirate'],fewRelics:2,...(root.JOURNEY_CHALLENGE_TUNE||{})};
const BAG_CELLS=[[3,3],[2,3],[1,3],[0,3]];

function profile(){const p=P.profile;const pc=p.challenges??={};pc.unlocked=!!pc.unlocked;pc.available=Math.max(pc.unlocked?1:0,Math.min(MAX_LEVEL,Math.floor(pc.available||0)));
 pc.won=[...new Set((pc.won||[]).filter(n=>Number.isInteger(n)&&n>=1&&n<=MAX_LEVEL))];pc.completed=[...new Set((pc.completed||[]).filter(id=>BY[id]))];pc.selected=clean(pc.selected);if(pc.selected.length>pc.available)pc.selected=pc.selected.slice(0,pc.available);
 pc.final??={done:false};p.insignia=Number.isFinite(p.insignia)?p.insignia:0;return pc;}
function clean(sel){const ids=Array.isArray(sel)?sel:Object.keys(sel||{});return [...new Set(ids.filter(id=>BY[id]))];}
function level(sel){return clean(sel).length;}
function highestWon(){return Math.max(0,...profile().won);}
function eligible(s){return !!s&&!s.training&&!s.tutorialReplay;}
function active(s,id){return eligible(s)&&!!s.challenges?.includes?.(id);}
/* Selection: free combination, limited to the unlocked level (number of challenges). */
function select(ids){const pc=profile();const list=clean(ids);if(!pc.unlocked||list.length>pc.available)return false;pc.selected=list;return true;}
function toggle(id){const pc=profile();if(!pc.unlocked||!BY[id])return false;const on=pc.selected.includes(id);if(!on&&pc.selected.length>=pc.available)return false;pc.selected=on?pc.selected.filter(x=>x!==id):[...pc.selected,id];return true;}
function start(s){if(!eligible(s)||s.challenges)return;const pc=profile();s.challenges=pc.unlocked?[...pc.selected]:[];s.challengeLevel=s.challenges.length;
 if(active(s,'cursed'))for(const id of TUNE.curses)C?.addCurse(s,id);if(active(s,'relicswap')){const deck=s.artifacts[0],pool=G.unownedRelics(s).filter(id=>id!==deck&&(G.ARTIFACTS.find(a=>a.id===id)?.rarity??9)<=1);if(pool.length&&deck){const id=pool[Math.floor(G.random(s)*pool.length)],next=[id,...s.artifacts.slice(1)],items=G.packBag(next,s);if(items){s.artifacts=next;s.bag={items};G.ensureBag(s);}}}if(active(s,'forcedtwin')){s.forcedTwin='pending';s.forcedTwinLeft=TUNE.forcedTwinCount;}if(active(s,'heavydeck')&&TUNE.heavyMode==='copy')for(let i=0;i<TUNE.heavyCards;i++){const ts=[...new Set(s.cards.filter(c=>!C?.isCurse(c)).map(c=>c.type))].filter(t=>G.copies(s,t)<G.MAX_COPIES);if(ts.length)G.newCard(s,ts[Math.floor(G.random(s)*ts.length)]);}if(active(s,'heavydeck')&&TUNE.heavyMode!=='copy')for(let i=0;i<TUNE.heavyCards;i++){const pool=TUNE.heavyPool.filter(t=>G.BY[t]&&G.copies(s,t)<G.MAX_COPIES);if(pool.length)G.newCard(s,pool[Math.floor(G.random(s)*pool.length)]);}if(active(s,'bag'))G.ensureBag(s);root.JourneyAdvantages?.start?.(s);}
const enter=G.enter;G.enter=function(s,id){start(s);return enter(s,id);};

/* game-0 hooks */
function forcedTwinOptions(s){return s?.forcedTwin==='pending'?[...new Set(s.cards.filter(c=>!C?.isCurse(c)).map(c=>c.type))].filter(t=>G.copies(s,t)<G.MAX_COPIES):[];}
function forcedTwin(s,type){if(!forcedTwinOptions(s).includes(type))return false;G.newCard(s,type);s.forcedTwinLeft=(s.forcedTwinLeft||1)-1;if(s.forcedTwinLeft<=0)s.forcedTwin=type;return true;}
/* Energia Dissipada: applied when the round ends (before the next preparation). Only the leftover energy is affected.
 * modes: 'half' = loses half of the leftover, rounded up (keeps floor(e/2)); 'fixed' = loses dissipateFixed; 'keep' = keeps at most dissipateKeep. */
function roundEnd(s){if(!active(s,'dissipate'))return;const e=Math.max(0,s.energy||0);if(!e)return;let keep=e;if(TUNE.dissipateMode==='half')keep=Math.floor(e/2);else if(TUNE.dissipateMode==='fixed')keep=Math.max(0,e-TUNE.dissipateFixed);else if(TUNE.dissipateMode==='keep')keep=Math.min(e,TUNE.dissipateKeep);s.energy=keep;s.dissipated=(s.dissipated||0)+(e-keep);}
function upgrades(s,elite,boss){return elite||boss?(active(s,'commanders')?TUNE.commanders:0):(active(s,'veterans')?TUNE.veterans:0);}
function enemyRelics(s){return active(s,'commanders')?TUNE.commanderRelics:0;}
function bossFight(s){return s.current?.type==='boss'||!!B?.deck?.(s);}
function extraUnits(s){return active(s,'reinforcements')&&!s.raid&&!bossFight(s)&&(s.round||1)>=TUNE.reinforceFromRound?1:0;}
function energy(s,enemy){if(enemy)return extraUnits(s)?2:0;return active(s,'scarce')&&bossFight(s)&&(s.round||1)<=TUNE.scarceRounds?-1:0;}
function bagBlocked(owner){return active(owner,'bag')?TUNE.bagCells:0;}
function cellBlocked(owner,x,y){const n=bagBlocked(owner);return n>0&&BAG_CELLS.slice(0,n).some(([bx,by])=>bx===x&&by===y);}
function enemyStats(s,c,st){if(!eligible(s))return st;if(active(s,'tough'))st.hp*=1+TUNE.tough;if(TUNE.bossStats&&active(s,'bossrounds')&&s.current?.type==='boss'&&!s.current.trueBoss){st.hp*=1+TUNE.bossStats;st.atk*=1+TUNE.bossStats;}if(active(s,'relentless'))st.atk*=1+TUNE.relentless;return st;}
function extraBossRounds(s){return active(s,'bossrounds')&&s.current?.type==='boss'&&!s.current.trueBoss&&!s.raid?TUNE.bossRounds:0;}
/* tree-engine hook: nodes active during the run */
function treeNodes(s,unlocked){if(!active(s,'treecap')||!T?.points)return unlocked;const cap=Math.max(0,T.points()-TUNE.treecap),out=[];let used=0;for(const id of unlocked){const k=T.D.by[id]?.cost||0;if(used+k>cap)break;used+=k;out.push(id);}return out;}

/* wrappers on properties the engine reads at call time */
if(T){const price=T.price;T.price=function(s,kind,base,merchant){const a=price(s,kind,base,merchant);return active(s,'inflation')&&s?.current?.type==='shop'?Math.max(1,Math.ceil(a*(1+TUNE.inflation)-1e-9)):a;};
 const gold=T.gold;T.gold=function(s,base){return gold(s,active(s,'lightpurse')?base*(1-TUNE.lightpurse):base);};
 const relics=T.relicCount;T.relicCount=function(s,n){const out=relics(s,n);return active(s,'fewrelics')?Math.max(1,out-TUNE.fewRelics):out;};}
if(R?.initialize){const init=R.initialize;R.initialize=function(s,kind,scale,...rest){if(active(s,'raidfury')&&scale)scale={...scale,hp:scale.hp*(1+TUNE.raidfury),damage:scale.damage*(1+TUNE.raidDamage)};return init.call(this,s,kind,scale,...rest);};}

/* Victory (revision 2): the first run victory unlocks level 1. Winning with N active challenges marks level N as won,
 * unlocks N+1 (up to the maximum) and grants 1 Insignia the first time N is won. Every active challenge of a winning run
 * counts as completed. Defeats change nothing. */
function recordVictory(s){const pc=profile(),n=(s.challenges||[]).length,out={level:n,insignia:0,unlocked:false};
 if(!pc.unlocked){pc.unlocked=true;pc.available=Math.max(pc.available,1);out.unlocked=true;}
 if(n>=1){if(!pc.won.includes(n)){pc.won.push(n);P.profile.insignia+=1;out.insignia=1;}pc.available=Math.min(MAX_LEVEL,Math.max(pc.available,n+1));for(const id of s.challenges)if(!pc.completed.includes(id))pc.completed.push(id);}
 return out;}
/* Final Challenge (secret boss) requirements; the encounter itself is not implemented yet. */
/* Final Challenge (approved): available only after winning everything: level 15 won (so every level), every challenge
 * completed and the three true bosses defeated. The run then has all 15 challenges active. Sequence (to implement with the
 * secret boss content): first the true boss of the order the player followed in the 6 order battles, then the other two in
 * random order, then the secret boss (stronger than the other true bosses). */
const TRUE_ORDERS=['blackfang','dawncrest','monsters'];
function trueBossesBeaten(){const st=P.profile.stats||{};return TRUE_ORDERS.every(o=>!!st['trueBoss_'+o]);}
// Records every true boss victory (decks-p3 only records the two orders that unlock decks).
const encounter=P.encounterWin;P.encounterWin=function(s){const r=encounter(s);if(eligible(s)&&s.current?.trueBoss&&TRUE_ORDERS.includes(s.current.campaign)&&!s.eventEncounter){P.profile.stats??={};P.profile.stats['trueBoss_'+s.current.campaign]=1;}return r;};
function finalRequirements(){const pc=profile(),tb=trueBossesBeaten();return {wonMaxLevel:pc.won.includes(MAX_LEVEL),allCompleted:pc.completed.length===MAX_LEVEL,trueBosses:tb,ready:pc.won.includes(MAX_LEVEL)&&pc.completed.length===MAX_LEVEL&&tb===true};}
const finish=P.finish;P.finish=function(s,reason){const before=!!s?.meta?.ended,r=finish(s,reason);if(eligible(s)&&!before&&s.meta?.ended&&s.meta.reason==='victory'){const got=recordVictory(s);s.meta.challengeLevel=got.level;s.meta.insignia=got.insignia;}return r;};

root.JourneyChallenges={LIST,CANDIDATES,roundEnd,forcedTwinOptions,forcedTwin,BY,TUNE,MAX_LEVEL,profile,clean,level,highestWon,select,toggle,start,active,upgrades,enemyRelics,extraUnits,extraBossRounds,energy,bagBlocked,cellBlocked,enemyStats,treeNodes,recordVictory,trueBossesBeaten,finalRequirements};
})(typeof globalThis!=='undefined'?globalThis:this);
