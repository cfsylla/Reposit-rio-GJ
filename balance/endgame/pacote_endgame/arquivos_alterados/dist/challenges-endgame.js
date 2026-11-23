/* Endgame (Claude, 22/11/2026) — TESTE. Escala geral e 7 desafios candidatos. Nada é ativado por padrão:
 * - escala geral: TUNE.globalScale (0 = desligada); vida, ataque e defesa dos inimigos × (1 + globalScale × nº de desafios ativos),
 *   em todo combate e todo boss (raids, Titãs e forma 2 do True Boss pelo fator da raid: vida e dano);
 * - Inimigos Fortalecidos (fortified) substitui Tropas Resistentes e Ataques Implacáveis (agora na reserva);
 * - candidatos (só valem quando escolhidos na run): moreelites, cursedrelics, fatigue, reinforceddecks, lesssupport, smallshop, lostgold.
 * Carregar depois de challenges.js e advantages.js (index.html). Decisões em balance/endgame/DECISOES_ENDGAME.md. */
(function(root){'use strict';
const G=root.Game,P=root.Progress,CH=root.JourneyChallenges,T=root.JourneyTree,R=root.JourneyRaid,A=root.JourneyActs,C=root.JourneyContent;
if(!G||!CH)return;
/* Valores decididos por Carlos em 22/11: escala 1% (23/11; era 2% em 22/11), Fadiga −3%, Menos Apoio 2 camadas, Inimigos Fortalecidos +10% vida / +8% dano; blocos 6×3. */
const TUNE=CH.TUNE,DEF={globalScale:.01,fatigue:.03,fortifiedHp:.10,fortifiedAtk:.08,cursedRelicChance:1/3,cursedRelicPool:['burden','chains'],lostGoldPerRound:1/3,moreElitesLayers:2,lessSupportLayers:2,reinforcedSwaps:2,reinforcedTeamSwaps:1,smallShopCards:2,smallShopRelics:1,blocks:[['reinforcements','fortified','moreelites'],['commanders','fatigue','cursedrelics'],['lesssupport','heavydeck','smallshop'],['inflation','cursed','bossrounds'],['lightpurse','veterans','dissipate'],['reinforceddecks','lostgold','bag']]};
for(const [k,v] of Object.entries(DEF))if(!(k in TUNE))TUNE[k]=v;
const NEW=[
 {id:'fortified',en:'Fortified Enemies',pt:'Inimigos Fortalecidos',enDesc:'Enemy health +10% and damage +8%.',ptDesc:'Vida dos inimigos +10% e dano +8%.'},
 {id:'moreelites',en:'More Elites',pt:'Mais Elites no Mapa',enDesc:'In each map, 2 whole layers of simple battles become elite battles.',ptDesc:'Em cada mapa, 2 camadas inteiras de batalhas simples viram batalhas de elite.'},
 {id:'cursedrelics',en:'Cursed Relics',pt:'Relíquias Amaldiçoadas',enDesc:'Each relic you obtain has a 33% chance to add Burden or Chains to your deck.',ptDesc:'Cada relíquia obtida tem 33% de chance de adicionar Fardo ou Correntes ao deck.'},
 {id:'fatigue',en:'Journey Fatigue',pt:'Fadiga da Jornada',enDesc:'Your units have −3% attack, health, defense and attack speed.',ptDesc:'Suas unidades têm −3% de ataque, vida, defesa e velocidade de ataque.'},
 {id:'reinforceddecks',en:'Reinforced Decks',pt:'Decks Reforçados',enDesc:'Elites and bosses swap their weakest cards for stronger ones.',ptDesc:'Elites e bosses trocam as cartas mais fracas por outras mais fortes.'},
 {id:'lesssupport',en:'Less Support',pt:'Menos Apoio no Mapa',enDesc:'In each map, 2 support layers become layers of battles.',ptDesc:'Em cada mapa, 2 camadas de apoio viram camadas de batalhas.'},
 {id:'smallshop',en:'Smaller Shop',pt:'Loja com Menos Opções',enDesc:'Shops offer 2 recruits and 1 relic.',ptDesc:'A loja oferece 2 recrutas e 1 relíquia.'},
 {id:'lostgold',en:'Costly Victories',pt:'Derrota Custa Ouro',enDesc:'Each lost round removes 33% of the victory gold of that fight.',ptDesc:'Cada rodada perdida tira 33% do ouro da vitória daquela luta.'},
];
for(const c of NEW)if(!CH.BY[c.id]){CH.LIST.push(c);CH.BY[c.id]=c;}
const active=(s,id)=>CH.active(s,id);
/* scaleLevel: só para medição (simulador); quando definido, substitui a contagem de desafios ativos. */
const count=s=>(s&&!s.training&&!s.tutorialReplay&&Array.isArray(s.challenges))?(TUNE.scaleLevel??s.challenges.length):0;
const scaleOf=s=>1+(TUNE.globalScale||0)*count(s);
const rand=(s,salt)=>G.rng(((s.seed>>>0)^Math.imul(salt>>>0,0x9e3779b1))>>>0)();

/* 1) Escala geral: inimigos fora de raid (comum, elite, ordem, evento, boss de mapa, forma 1 do True Boss). */
/* Inimigos Fortalecidos (junta Tropas Resistentes e Ataques Implacáveis): mesmos valores, fora das raids (como antes). */
const es=CH.enemyStats;CH.enemyStats=function(s,c,st){es(s,c,st);if(active(s,'fortified')){st.hp*=1+TUNE.fortifiedHp;st.atk*=1+TUNE.fortifiedAtk;}const k=scaleOf(s);if(k!==1){st.hp*=k;st.atk*=k;st.defense*=k;}return st;};
/* Raids, Titãs e forma 2 do True Boss: fator da raid (vida e dano). */
if(R?.initialize){const init=R.initialize;R.initialize=function(s,kind,scale,...rest){const k=scaleOf(s);if(k!==1&&scale){rest[1]=[...(rest[1]||[{source:'raid:'+kind,...scale}]),{source:'challenge:globalScale',hp:k,damage:k}];scale={...scale,hp:scale.hp*k,damage:scale.damage*k,minions:(scale.minions||1)*k};}return init.call(this,s,kind,scale,...rest);};}

/* 2) Fadiga da Jornada: debuff fixo nas unidades do jogador (não mexe na árvore). */
if(T?.stats){const st0=T.stats;T.stats=function(st,c,s,enemy){st=st0(st,c,s,enemy)||st;if(!enemy&&active(s,'fatigue')){const f=1-TUNE.fatigue;st.hp*=f;st.atk*=f;st.defense*=f;st.rate/=f;}return st;};}

/* 3) Mapa: Menos Apoio (1 camada de apoio vira batalhas) e depois Mais Elites (2 camadas de batalhas simples viram elite). */
const SUPPORT=['recruit','upgrade','event','shop','relic'];
function pick(list,n,s,salt,ok){const out=[],pool=[...list];let k=0;while(out.length<n&&pool.length){const i=Math.floor(rand(s,salt+(k++))*pool.length),x=pool.splice(i,1)[0];if(!ok||ok(x,out))out.push(x);}return out;}
function shapeMap(s){const map=s.map;if(!map||s.mapShaped===(A?.act?.(s)||1))return;const act=A?.act?.(s)||1;s.mapShaped=act;
 if(active(s,'lesssupport')){const layers=map.map((row,i)=>i).filter(i=>i>0&&i<13&&map[i].every(n=>SUPPORT.includes(n.type)));
  for(const i of pick(layers,TUNE.lessSupportLayers,s,act*101+1))for(const n of map[i]){n.type='battle';n.name='Confronto';n.supportConverted=true;}}
 if(active(s,'moreelites')){const first=map.findIndex(row=>row.some(n=>['battle','elite'].includes(n.type)));
  const layers=map.map((row,i)=>i).filter(i=>i!==first&&i<13&&map[i].some(n=>n.type==='battle'&&!n.campaign)&&map[i].every(n=>!n.campaign&&['battle','elite'].includes(n.type)));
  for(const i of pick(layers,TUNE.moreElitesLayers,s,act*101+7,(x,out)=>out.every(y=>Math.abs(x-y)>1)))for(const n of map[i])if(n.type==='battle'){n.type='elite';n.name='Companhia de elite';n.challengeElite=true;}}}
if(A?.advance){const adv=A.advance;A.advance=function(s){const ok=adv(s);if(ok)shapeMap(s);return ok;};}

/* 4) Decks Reforçados: elites e bosses trocam as cartas mais fracas (índice L0 do laboratório lab2, R3) pelas mais fortes
 *    da mesma facção que não estão no deck; sem melhor na facção, do mesmo trait. Times de 4 cópias: troca 1 personagem. */
const RANK={"cannoneer":[1.157,"Seasalt Crew"],"pirate_admiral":[1.114,"Seasalt Crew"],"shaman":[1.112,"Frostborn Clans"],"goblin_king":[1.11,"Goblin"],"snow_troll":[1.11,"Troll"],"troll":[1.092,"Troll"],"sage":[1.087,"Arcane"],"elf_noble":[1.085,"High Elf"],"dark_elf_noble":[1.077,"Dark Elf"],"goblin_bomber":[1.075,"Goblin"],"centaur_crossbow":[1.075,"Centaur"],"centaur_lancer":[1.075,"Centaur"],"shaolin":[1.073,"Legends of the East"],"feline_drummer":[1.073,"Meowri"],"pirate_captain":[1.069,"Seasalt Crew"],"dark_elf_archer":[1.067,"Dark Elf"],"sheriff":[1.067,"Wild West"],"huntress":[1.063,"Frostborn Clans"],"blackfang_guardian":[1.063,"Dark Elf"],"feline_arcanist":[1.058,"Meowri"],"woodland_predator":[1.058,"Forest Elf"],"cavalier":[1.056,"Dawnward Order"],"elf_guardian":[1.054,"High Elf"],"shinobi":[1.052,"Legends of the East"],"musketeer":[1.048,"Dawnward Order"],"crossbowman":[1.044,"Verdant Covenant"],"archer":[1.042,"Verdant Covenant"],"bear_druid":[1.042,"Verdant Covenant"],"orc_berserker":[1.041,"Orc"],"priestess":[1.039,"Arcane"],"mountain_troll":[1.037,"Troll"],"woodland_scout":[1.037,"Forest Elf"],"omnamusha":[1.035,"Legends of the East"],"eagle_druid":[1.035,"Verdant Covenant"],"ronin":[1.033,"Legends of the East"],"mage":[1.033,"Arcane"],"elf_harpist":[1.033,"High Elf"],"bard":[1.033,"Arcane"],"goblin_rider":[1.031,"Goblin"],"orc_warrior":[1.031,"Orc"],"shieldmaiden":[1.029,"Frostborn Clans"],"feline_rogue":[1.029,"Meowri"],"orc_fighter":[1.027,"Orc"],"cowboy":[1.026,"Wild West"],"gunner":[1.022,"Wild West"],"ranger":[1.022,"Verdant Covenant"],"duelist":[1.02,"Dawnward Order"],"bastion":[1.02,"Dawnward Order"],"kinoichi":[1.018,"Legends of the East"],"samurai":[1.018,"Legends of the East"],"martial_artist":[1.018,"Legends of the East"],"swordsman":[1.016,"Dawnward Order"],"dark_elf_mage":[1.016,"Dark Elf"],"gladiator":[1.016,"Dawnward Order"],"sorceress":[1.013,"Arcane"],"goblin_brute":[1.011,"Goblin"],"feline_fighter":[1.011,"Meowri"],"elf_halberdier":[1.007,"High Elf"],"woodland_flailer":[1.004,"Forest Elf"],"goblin_archer":[1.002,"Goblin"],"flower_fairy":[1,"Fairy"],"glutton":[0.996,"Frostborn Clans"],"elf_archer":[0.993,"High Elf"],"berserker":[0.991,"Frostborn Clans"],"cave_troll":[0.989,"Troll"],"dark_elf_warrior":[0.986,"Dark Elf"],"miner":[0.979,"Wild West"],"woodland_lancer":[0.977,"Forest Elf"],"centaur_swordsman":[0.977,"Centaur"],"warrior":[0.972,"Dawnward Order"],"pirate":[0.972,"Seasalt Crew"],"goblin_spearman":[0.97,"Goblin"],"feline_swordsman":[0.968,"Meowri"],"lancer":[0.963,"Dawnward Order"],"shackled_pirate":[0.963,"Seasalt Crew"],"viking":[0.954,"Frostborn Clans"],"fighter":[0.951,"Legends of the East"]};
const idx=t=>RANK[t]?.[0];
function reinforce(s){const ai=s.ai,n=s.current;if(!ai?.cards?.length||ai.reinforced||!['elite','boss'].includes(n?.type)||s.raid)return;
 const types=[...new Set(ai.cards.map(c=>c.type))],counts=Object.fromEntries(types.map(t=>[t,ai.cards.filter(c=>c.type===t).length]));
 const team=types.every(t=>counts[t]>=4),swaps=team?TUNE.reinforcedTeamSwaps:TUNE.reinforcedSwaps;
 const weak=types.filter(t=>idx(t)!==undefined).sort((a,b)=>idx(a)-idx(b)).slice(0,swaps),changed=[];
 for(const w of weak){const have=new Set(ai.cards.map(c=>c.type)),cand=t=>G.BY[t]&&!have.has(t)&&!String(t).startsWith('hero_')&&idx(t)>idx(w);
  let best=Object.keys(RANK).filter(t=>cand(t)&&RANK[t][1]===RANK[w][1]).sort((a,b)=>idx(b)-idx(a))[0];
  if(!best){const tr=new Set(G.BY[w]?.traits||[]);best=Object.keys(RANK).filter(t=>cand(t)&&(G.BY[t].traits||[]).some(x=>tr.has(x))).sort((a,b)=>idx(b)-idx(a))[0];}
  if(!best)continue;for(const c of ai.cards)if(c.type===w)c.type=best;changed.push([w,best]);}
 ai.reinforced=true;ai.reinforcedSwaps=changed;}

/* 5) Relíquias Amaldiçoadas: cada relíquia nova (fora a inicial e a da Relíquia de Viagem) tem 33% de chance de dar Fardo ou Correntes. */
function curseSweep(s){if(!active(s,'cursedrelics'))return;const owned=[...(s.artifacts||[]),...(s.reserve||[])];s.crSeen??=[...owned];
 for(const id of owned){if(s.crSeen.includes(id))continue;s.crSeen.push(id);const k=s.crSeen.length;if(rand(s,7001+k)<TUNE.cursedRelicChance){const pool=TUNE.cursedRelicPool,c=pool[Math.floor(rand(s,9001+k)*pool.length)];C?.addCurse(s,c);(s.crCurses??=[]).push([id,c]);}}}

/* 6) Loja com Menos Opções: 2 recrutas e 1 relíquia, também depois de renovar. */
function trimShop(s){if(!active(s,'smallshop')||s.phase!=='shop'||!s.offers)return;if(Array.isArray(s.offers.cards))s.offers.cards=s.offers.cards.slice(0,TUNE.smallShopCards);if(Array.isArray(s.offers.artifacts))s.offers.artifacts=s.offers.artifacts.slice(0,TUNE.smallShopRelics);}
for(const fn of ['rerollOffers']){const f=G[fn];if(f)G[fn]=function(s,...a){const r=f.call(this,s,...a);trimShop(s);return r;};}
if(T?.refreshShop){const f=T.refreshShop;T.refreshShop=function(s,...a){const r=f.call(this,s,...a);trimShop(s);return r;};}

/* 7) Derrota Custa Ouro: o ouro base da vitória (comum, elite, ordem, raid) perde 1/3 por rodada perdida; 3 ou mais zeram.
 *    Bônus (Caçador de Elites, eventos) não mudam: a marca é posta depois de encounterWin e consumida pelo ouro da vitória. */
if(P?.encounterWin){const ew=P.encounterWin;P.encounterWin=function(s){const r=ew(s);if(active(s,'lostgold')&&s.current?.type!=='boss'&&!s.eventEncounter)s.lgPending=s.score?.[1]||0;return r;};}
if(T?.gold){const g0=T.gold;T.gold=function(s,base){if(s&&active(s,'lostgold')&&s.lgPending!==undefined&&s.lgPending!==null){const L=s.lgPending;s.lgPending=null;const k=Math.max(0,1-L*TUNE.lostGoldPerRound+1e-9);const out=g0(s,base*(k<1e-6?0:k));s.lgLost=(s.lgLost||0)+Math.round(base*(1-(k<1e-6?0:k)));return out;}return g0(s,base);};}

/* Ganchos de navegação: forma do mapa do mapa 1, decks reforçados, maldições e loja. */
const enter=G.enter;G.enter=function(s,id){if(s&&!s.training&&!s.tutorialReplay&&!s.challenges&&G.available(s).some(n=>n.id===id))CH.start(s);if(s?.challenges)shapeMap(s);curseSweep(s);if(s)s.lgPending=null;const r=enter(s,id);if(r){if(active(s,'reinforceddecks'))reinforce(s);trimShop(s);}return r;};
for(const fn of ['leave','commitBag','claimRelic','buy','skipUpgrade']){const f=G[fn];if(typeof f==='function')G[fn]=function(s,...a){const r=f.call(this,s,...a);curseSweep(s);return r;};}
if(P?.finish){const fin=P.finish;P.finish=function(s,...a){curseSweep(s);return fin.call(this,s,...a);};}

root.JourneyChallengesEndgame={NEW,scaleOf,shapeMap,reinforce,curseSweep,trimShop,RANK};
})(typeof globalThis!=='undefined'?globalThis:this);
