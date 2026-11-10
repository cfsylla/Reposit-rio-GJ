/* Approved playtest progression: order gates, 95 milestones, one-time diamond ledger. */
(function(root){'use strict';
const G=root.Game,P=root.Progress,A=root.JourneyActs,T=root.JourneyTree,C=root.JourneyChallenges,AD=root.JourneyAdvantages;
const orders={blackfang:'Blackfang',dawncrest:'Dawncrest',ironbound:'Grand Union',monsters:'Titans'};
const unique=(xs,id)=>{if(!xs.includes(id))xs.push(id);};
function facts(){const p=P.profile;return p.milestoneProgress??={version:1,paid:[],bossMaps:{},allBossOrders:[],trueOrders:[],wonDecks:[],titans:[],training:false,customBuilt:false,customFive:false,customWon:false,bagFull:false,firstFusion:false,threeFused:false,treeBest:0,advBest:0,challengeBest:0,secretBoss:false};}
function bossCardsUnlocked(order){return !!P.profile.bossOrders?.includes(order);}
function grantBossCards(order){const p=P.profile;p.bossOrders??=[];unique(p.bossOrders,order);for(const [id,c]of Object.entries(root.JourneyBossCards.cards)){if(root.JourneyBosses.D[c.boss].order!==order||p.catalogCards.includes(id))continue;p.catalogCards.push(id);p.unlockHistory.push({kind:'card',id,at:new Date().toISOString()});}unique(facts().trueOrders,order);}
const titanIds=['tree','colossus','slime','dragon','hydra','kraken','lich','naga','manticore'];
function historyFacts(history){const f=facts();for(const h of history||[]){if(titanIds.includes(h.raidKind))unique(f.titans,h.raidKind);for(const e of h.orderEncounters||[])if(e.order==='monsters'&&titanIds.includes(e.raidKind))unique(f.titans,e.raidKind);if(!orders[h.order]||!Number.isInteger(h.act)||h.act<1||h.act>3)continue;f.bossMaps[h.order]??=[];unique(f.bossMaps[h.order],h.act);if(h.trueBoss){unique(f.trueOrders,h.order);if(h.order!=='monsters')grantBossCards(h.order);}}
 for(const order of Object.keys(orders))if([1,2,3].every(act=>history?.some(h=>h.act===act&&h.order===order)))unique(f.allBossOrders,order);
}
function finishedFacts(run){const f=facts();historyFacts(run.actHistory);if(run.reason!=='victory')return;if(G.DECKS.some(d=>d.id===run.deck))unique(f.wonDecks,run.deck);if(run.deck?.startsWith('custom-'))f.customWon=true;f.challengeBest=Math.max(f.challengeBest,(run.completedChallenges||[]).length,run.challengeLevel||0);}
let migrating=false;
function migrate(){const p=P.profile,f=facts();if(p.orderGateVersion===1||migrating)return;migrating=true;p.bossOrders??=[];
 for(const run of p.runs||[])finishedFacts(run);
 for(const order of ['blackfang','dawncrest']){const proven=(p.runs||[]).some(r=>r.reason==='victory'&&r.actHistory?.some(h=>h.act===3&&h.order===order))||!!p.stats['trueBoss_'+order];p[order+'Unlocked']=proven;if(p.stats['trueBoss_'+order])grantBossCards(order);}
 p.orderGateVersion=1;migrating=false;
}
function bossWon(s){if(!eligible(s)||s.current?.type!=='boss')return;const order=s.current.campaign,act=A.act(s),history=[...(s.journey?.history||[]).filter(h=>h.act!==act),{act,order,trueBoss:!!s.current.trueBoss,bossId:s.current.bossId,raidKind:s.current.raidKind}];historyFacts(history);if(s.current.trueBoss&&order!=='monsters'&&orders[order])grantBossCards(order);if(s.current.secretBoss||s.secretBossEncounter)facts().secretBoss=true;}
function eligible(s){return !!s&&!s.training&&!s.tutorialReplay;}
const factions=Object.entries(root.JourneyTraits.D).filter(([,d])=>d.category==='faction').map(([id])=>id);
const factionCards=id=>G.UNITS.filter(u=>!u.enemyOnly&&u.kind!=='curse'&&u.traits?.[0]===id);
const relics=G.ARTIFACTS.filter(a=>!a.enemyOnly);
const allTree=T.D.nodes.filter(n=>n.id!=='origin');
function add(id,en,pt,goal,kind,extra={}){P.MILESTONES.push({id,en,pt,goal,metric:'v56:'+id,kind,...extra});}
for(const d of G.DECKS)add('win_deck_'+d.id,'Win a run with '+(root.JourneyDecksP3.EN[d.name]||d.name),'Vencer uma run com '+d.name,1,'deck',{deckTarget:d.id});
for(const [order,name]of Object.entries(orders)){for(const act of [1,2,3])add('boss_'+order+'_map'+act,'Defeat the '+name+' Boss on map '+act,'Derrotar o Boss '+name+' no mapa '+act,1,'bossMap',{order,act});add('boss_'+order+'_all','Defeat '+name+' Bosses on all three maps in one run','Derrotar os Bosses '+name+' nos três mapas em uma única run',1,'allBoss',{order});}
add('bag_full','Fill every available Relic Bag cell','Preencher todos os espaços disponíveis da bolsa de relíquias',1,'bag');
for(const faction of factions)add('collection_'+faction,'Complete the '+faction+' card collection','Completar a coleção de cartas de '+faction,factionCards(faction).length,'collection',{faction});
add('collection_relics','Complete the relic collection','Completar a coleção de relíquias',relics.length,'relics');
add('training_first','Play a training battle','Fazer um combate de treinamento',1,'training');
add('custom_build','Build a complete custom deck','Montar um deck custom completo',1,'customBuilt');
add('custom_five','Complete five nodes on map 1 with a custom deck','Concluir cinco nós no mapa 1 com um deck custom',1,'customFive');
add('custom_win','Win all three maps with a custom deck','Vencer os três mapas com um deck custom',1,'customWon');
for(const pct of [25,50,75,100])add('tree_'+pct,'Fully acquire '+pct+'% of skill tree nodes','Adquirir completamente '+pct+'% dos nós da skill tree',Math.ceil(allTree.length*pct/100),'tree',{pct});
add('run_first_win','Win a run for the first time','Vencer uma run pela primeira vez',1,'firstWin');
for(const n of [5,10,15]){add('advantages_'+n,'Activate '+n+' Journey Advantages together','Ativar '+n+' Vantagens da Jornada simultaneamente',n,'advantages');add('challenges_'+n,'Win a run with '+n+' active Journey Challenges','Vencer uma run com '+n+' Desafios da Jornada ativos',n,'challenges');}
add('secret_boss','Defeat the Secret Boss','Derrotar o Secret Boss',1,'secret');
for(const [order,name]of Object.entries(orders))add('true_'+order,'Defeat the '+name+' True Boss','Derrotar o True Boss '+name,1,'trueBoss',{order});
add('titans_all','Defeat all nine different Titans','Derrotar os nove Titans diferentes',9,'titans');
add('fusion_first','Perform your first fusion','Realizar a primeira fusão',1,'firstFusion');
add('fusion_three','Finish an encounter with three fused units on the field','Terminar um confronto com três unidades fundidas em campo',1,'threeFused');
add('decks_all','Win a run with every borrowed deck','Vencer uma run com cada um dos decks emprestados',G.DECKS.length,'allDecks');
if(P.MILESTONES.length!==95)throw Error('Expected 95 milestones, got '+P.MILESTONES.length);
function progress(m){const f=facts(),p=P.profile;if(!m.kind)return P.metric(m.metric);switch(m.kind){case'deck':return +f.wonDecks.includes(m.deckTarget);case'bossMap':return +(f.bossMaps[m.order]||[]).includes(m.act);case'allBoss':return +f.allBossOrders.includes(m.order);case'bag':return +f.bagFull;case'collection':return factionCards(m.faction).filter(u=>(p.cards[u.id]||0)>0).length;case'relics':return relics.filter(r=>p.relics[r.id]).length;case'training':return +f.training;case'customBuilt':return +f.customBuilt;case'customFive':return +f.customFive;case'customWon':return +f.customWon;case'tree':return f.treeBest;case'firstWin':return +(p.stats.wins>0);case'advantages':return f.advBest;case'challenges':return f.challengeBest;case'secret':return +f.secretBoss;case'trueBoss':return +f.trueOrders.includes(m.order);case'titans':return f.titans.length;case'firstFusion':return +f.firstFusion;case'threeFused':return +f.threeFused;case'allDecks':return f.wonDecks.length;}return 0;}
function beforeCheck(){migrate();const f=facts(),p=P.profile;f.paid??=[];f.treeBest=Math.max(f.treeBest,T.profile().unlocked.length);f.advBest=Math.max(f.advBest,AD.owned().length);f.challengeBest=Math.max(f.challengeBest,...C.profile().won,0);if(p.customDecks.some(d=>d&&!P.validateCustom(d)))f.customBuilt=true;for(const run of p.runs||[]){finishedFacts(run);if(run.deck?.startsWith('custom-')&&run.completed?.filter(n=>!n.id.startsWith('a2_')&&!n.id.startsWith('a3_')).length>=5)f.customFive=true;}}
function afterCheck(){const f=facts(),p=P.profile;for(const m of P.MILESTONES)if(p.milestones.includes(m.id)&&!f.paid.includes(m.id)){f.paid.push(m.id);p.diamonds+=1;} }
function observe(s){if(!eligible(s))return;const f=facts();if(s.deck?.startsWith('custom-')&&(A.act(s)>1||(s.meta?.completed||[]).length>=5))f.customFive=true;if(s.fusionSerial>0)f.firstFusion=true;
 const items=s.bag?.items||[];if(items.length&&items.every(it=>s.artifacts.includes(it.id))&&G.bagValid(items,s)){const cells=new Set();for(const it of items)for(const [dx,dy]of G.relicShape(it.id,it.rotation))cells.add((it.y+dy)*4+it.x+dx);if(cells.size===G.bagCapacity(s))f.bagFull=true;}
 if(s.meta?.ended&&s.meta.reason==='victory')finishedFacts({...s.meta,deck:s.deck,actHistory:s.journey?.history,challengeLevel:s.challengeLevel??s.challenges?.length??0,completedChallenges:s.challenges||[]});
}
function encounter(s){if(!eligible(s))return;observe(s);if(s.current?.campaign==='monsters'&&['tree','colossus','slime','dragon','hydra','kraken','lich','naga','manticore'].includes(s.current.raidKind))unique(facts().titans,s.current.raidKind);if(s.board.filter(uid=>uid&&s.fusions?.[uid]).length>=3)facts().threeFused=true;}
function hidden(m){const p=P.profile;if(m.kind==='secret')return !facts().secretBoss;if(m.kind==='deck')return !p.decks.includes(m.deckTarget);if(m.kind==='collection'){const cards=factionCards(m.faction),order=cards[0]?.order;return order==='blackfang'&&!p.blackfangUnlocked||order==='dawncrest'&&!p.dawncrestUnlocked;}return false;}
const oldMetric=P.metric;P.metric=function(metric){if(metric?.startsWith('v56:')){const m=P.MILESTONES.find(m=>m.metric===metric);return m?progress(m):0;}return oldMetric(metric);};
const load=P.load;P.load=function(...args){const p=load(...args);P.check();return p;};
const checkAction=(obj,key,after)=>{const old=obj[key];if(!old)return;obj[key]=function(...args){const result=old.apply(this,args);if(result!==false&&result!==null){after?.(args,result);P.check();}return result;};};
for(const key of ['commitBag','takeRelic','receiveRelic','deploy','transfer','fuse'])checkAction(G,key,args=>observe(args[0]));
checkAction(P,'saveCustom',()=>{const p=P.profile;if(p.customDecks.some(d=>d&&!P.validateCustom(d)))facts().customBuilt=true;});
checkAction(T,'buy');checkAction(AD,'buy');
const create=G.createBattle;G.createBattle=function(s){const b=create(s);if(b){if(s.training)facts().training=true;else observe(s);P.check();}return b;};
const onEnd=P.onRunEnd;P.onRunEnd=function(s){onEnd?.(s);observe(s);P.check();if(s.meta){s.meta.unlocks=P.profile.unlockHistory.slice(s.meta.unlockStart||0);const r=P.profile.runs.find(r=>r.id===s.meta.id);if(r)r.unlocks=[...s.meta.unlocks];}};
const continueRun=T.continueRun;T.continueRun=function(s){const result=continueRun(s);observe(s);P.check();if(s.meta?.ended){s.meta.unlocks=P.profile.unlockHistory.slice(s.meta.unlockStart||0);const r=P.profile.runs.find(r=>r.id===s.meta.id);if(r)r.unlocks=[...s.meta.unlocks];}return result;};
root.JourneyProgression={bossCardsUnlocked,bossWon,migrate,grantBossCards};
root.JourneyMilestones={facts,progress,beforeCheck,afterCheck,observe,encounter,hidden,factions,factionCards,allTree};
P.check();
})(globalThis);
