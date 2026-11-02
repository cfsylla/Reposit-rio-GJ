/* Desafios da Jornada (GJ-v54-BAL post-CP1, approved list; test copy).
 * Optional difficulty rules chosen before a run, unlocked by the first run victory (map 3 boss).
 * Each challenge has grades; points add up to the run's Challenge Level (P). Wins with P >= 1 grant Insignia.
 * Profile (optional fields): profile.challenges = {unlocked, selected:{id:grade}, record:{deckId:P}}, profile.insignia.
 * Run: s.challenges = {id:grade}, fixed when the run enters its first map node (never in training or tutorial replay).
 * Engine hooks: game-0.js (makeAI upgrades, rollEnemyRelics, enemy stats, maxUnits, energyIncome, bag),
 * tree-engine.js (active nodes), and wrappers below (shop price, gold, card offers, raid scaling). */
(function(root){'use strict';
const G=root.Game,P=root.Progress,T=root.JourneyTree,C=root.JourneyContent,R=root.JourneyRaid,B=root.JourneyBosses;
const LIST=[
 {id:'veterans',grades:3,points:1,en:'Veterans',pt:'Veteranos',enDesc:'Regular enemies have +1 upgrade per grade.',ptDesc:'Inimigos comuns têm +1 upgrade por grau.'},
 {id:'tough',grades:3,points:1,en:'Tough Troops',pt:'Tropas Resistentes',enDesc:'Enemy health +8% per grade.',ptDesc:'Vida dos inimigos +8% por grau.'},
 {id:'relentless',grades:3,points:1,en:'Relentless Attacks',pt:'Ataques Implacáveis',enDesc:'Enemy damage +8% per grade.',ptDesc:'Dano dos inimigos +8% por grau.'},
 {id:'commanders',grades:2,points:1,en:'Prepared Commanders',pt:'Comandantes Preparados',enDesc:'Elites, orders and bosses gain +1 relic and +1 upgrade per grade.',ptDesc:'Elites, ordens e bosses ganham +1 relíquia e +1 upgrade por grau.'},
 {id:'leaders',grades:2,points:2,en:'Full-Strength Leaders',pt:'Líderes Inteiros',enDesc:'Boss leaders recover half of their health and attack reduction per grade.',ptDesc:'Líderes de boss recuperam metade da redução de vida e ataque por grau.'},
 {id:'reinforcements',grades:1,points:2,en:'Enemy Reinforcements',pt:'Reforços Inimigos',enDesc:'Regular and elite enemies field +1 unit (not bosses or raids).',ptDesc:'Inimigos comuns e elites colocam +1 unidade em campo (não vale para bosses e raids).'},
 {id:'raidfury',grades:2,points:1,en:'Raid Fury',pt:'Fúria das Raids',enDesc:'Raid health +15% per grade.',ptDesc:'Vida das raids +15% por grau.'},
 {id:'inflation',grades:2,points:1,en:'Inflated Market',pt:'Mercado Inflacionado',enDesc:'Shop prices +15% per grade.',ptDesc:'Preços da loja +15% por grau.'},
 {id:'lightpurse',grades:2,points:1,en:'Light Purse',pt:'Bolsa Leve',enDesc:'Gold from victories −15% per grade.',ptDesc:'Ouro por vitória −15% por grau.'},
 {id:'scarce',grades:1,points:3,en:'Scarce Resources',pt:'Recursos Escassos',enDesc:'−1 energy in every preparation.',ptDesc:'−1 de energia no preparo de cada rodada.'},
 {id:'bag',grades:2,points:1,en:'Limited Luggage',pt:'Bagagem Limitada',enDesc:'Blocks 2 Relic Bag cells per grade.',ptDesc:'Bloqueia 2 casas da bolsa de relíquias por grau.'},
 {id:'fewchoices',grades:1,points:2,en:'Few Choices',pt:'Escolhas Escassas',enDesc:'Card offers show 1 option less.',ptDesc:'Ofertas de cartas mostram 1 opção a menos.'},
 {id:'treecap',grades:2,points:2,en:'Contained Tree',pt:'Árvore Contida',enDesc:'Your tree is limited to 60 fewer points per grade during the run (latest nodes are disabled first).',ptDesc:'A árvore fica limitada a 60 pontos a menos por grau durante a run (os nós mais recentes são desativados primeiro).'},
 {id:'noprep',grades:2,points:1,en:'Unprepared',pt:'Sem Preparo',enDesc:'−1 Preparation slot per grade.',ptDesc:'−1 espaço de preparativo por grau.'},
 {id:'cursed',grades:2,points:1,en:'Cursed Path',pt:'Caminho Amaldiçoado',enDesc:'Start the run with 1 Burden curse per grade.',ptDesc:'Começa a run com 1 maldição Fardo por grau.'},
];
const BY=Object.fromEntries(LIST.map(c=>[c.id,c]));
// Tuning table (calibrated by simulation).
const TUNE=root.JOURNEY_CHALLENGE_TUNE={tough:.08,relentless:.08,raidfury:.15,inflation:.15,lightpurse:.15,treecap:60,...(root.JOURNEY_CHALLENGE_TUNE||{})};
const BAG_CELLS=[[3,3],[2,3],[1,3],[0,3]];

function profile(){const p=P.profile;p.challenges??={unlocked:false,selected:{},record:{}};p.challenges.selected??={};p.challenges.record??={};p.insignia=Number.isFinite(p.insignia)?p.insignia:0;return p.challenges;}
function clean(sel){const out={};for(const [id,g] of Object.entries(sel||{})){const c=BY[id],n=Math.floor(Number(g));if(c&&n>0)out[id]=Math.min(c.grades,n);}return out;}
function level(sel){return Object.entries(clean(sel)).reduce((t,[id,g])=>t+g*BY[id].points,0);}
function eligible(s){return !!s&&!s.training&&!s.tutorialReplay;}
function grade(s,id){return eligible(s)?(s.challenges?.[id]||0):0;}
function select(id,g){const pc=profile();if(!pc.unlocked||!BY[id])return false;const n=Math.max(0,Math.min(BY[id].grades,Math.floor(g)||0));if(n)pc.selected[id]=n;else delete pc.selected[id];return true;}
function start(s){if(!eligible(s)||s.challenges)return;const pc=profile();s.challenges=pc.unlocked?clean(pc.selected):{};s.challengeLevel=level(s.challenges);
 for(let i=0;i<(s.challenges.cursed||0);i++)C?.addCurse(s,'burden');if(s.challenges.bag)G.ensureBag(s);}
const enter=G.enter;G.enter=function(s,id){start(s);return enter(s,id);};

/* game-0 hooks */
function upgrades(s,elite,boss){const v=grade(s,'veterans'),c=grade(s,'commanders');return elite||boss?c:v;}
function enemyRelics(s){return grade(s,'commanders');}
function bossFight(s){return s.current?.type==='boss'||!!B?.deck?.(s);}
function extraUnits(s){return grade(s,'reinforcements')&&!s.raid&&!bossFight(s)?1:0;}
function energy(s,enemy){if(enemy)return extraUnits(s)?2:0;return grade(s,'scarce')?-1:0;}
function bagBlocked(owner){return 2*grade(owner,'bag');}
function cellBlocked(owner,x,y){const n=bagBlocked(owner);return n>0&&BAG_CELLS.slice(0,n).some(([bx,by])=>bx===x&&by===y);}
function enemyStats(s,c,st){if(!eligible(s))return st;const t=grade(s,'tough'),r=grade(s,'relentless');if(t)st.hp*=1+TUNE.tough*t;if(r)st.atk*=1+TUNE.relentless*r;
 const l=grade(s,'leaders'),cut=B?.leaderCut;if(l&&cut&&/^boss_/.test(c.type)&&!/_2$/.test(c.type)){const id=c.type.slice(5),m=(Array.isArray(cut)?cut:(cut[id]||cut.default))?.[0];if(m&&m<1){const k=(m+(1-m)*l/2)/m;st.hp*=k;st.atk*=k;}}return st;}
/* tree-engine hook: nodes active during the run */
function treeNodes(s,unlocked){const g=grade(s,'treecap');if(!g||!T?.points)return unlocked;const cap=Math.max(0,T.points()-TUNE.treecap*g),out=[];let used=0;for(const id of unlocked){const k=T.D.by[id]?.cost||0;if(used+k>cap)break;used+=k;out.push(id);}return out;}

/* wrappers on properties the engine reads at call time */
if(T){const price=T.price;T.price=function(s,kind,base,merchant){const a=price(s,kind,base,merchant),g=grade(s,'inflation');return g&&s?.current?.type==='shop'?Math.max(1,Math.ceil(a*(1+TUNE.inflation*g)-1e-9)):a;};
 const gold=T.gold;T.gold=function(s,base){const g=grade(s,'lightpurse');return gold(s,g?base*(1-TUNE.lightpurse*g):base);};
 const offer=T.offerCount;T.offerCount=function(s,n){const out=offer(s,n);return grade(s,'fewchoices')?Math.max(1,out-1):out;};}
if(R?.initialize){const init=R.initialize;R.initialize=function(s,kind,scale,...rest){const g=grade(s,'raidfury');if(g&&scale)scale={...scale,hp:scale.hp*(1+TUNE.raidfury*g)};return init.call(this,s,kind,scale,...rest);};}

/* Insignia on victory; first victory unlocks the system */
function insigniaFor(p,record){if(p<1)return {win:0,record:0};return {win:1+Math.floor(p/4),record:p>record?5*(p-record):0};}
const finish=P.finish;P.finish=function(s,reason){const before=!!s?.meta?.ended,r=finish(s,reason);if(eligible(s)&&!before&&s.meta?.ended&&s.meta.reason==='victory'){const pc=profile(),p=s.challengeLevel||0,deck=s.deck||'unknown',rec=pc.record[deck]||0,got=insigniaFor(p,rec);
 pc.unlocked=true;if(p>rec)pc.record[deck]=p;P.profile.insignia+=got.win+got.record;s.meta.insignia=got.win+got.record;s.meta.challengeLevel=p;}return r;};

root.JourneyChallenges={LIST,BY,TUNE,profile,clean,level,select,start,grade,upgrades,enemyRelics,extraUnits,energy,bagBlocked,cellBlocked,enemyStats,treeNodes,insigniaFor};
})(typeof globalThis!=='undefined'?globalThis:this);
