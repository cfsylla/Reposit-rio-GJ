/* Approved playtest progression: order gates, 102 milestones, one-time diamond ledger. */
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
function bossWon(s){if(!eligible(s)||s.current?.type!=='boss')return;const order=s.current.campaign,act=A.act(s),history=[...(s.journey?.history||[]).filter(h=>h.act!==act),{act,order,trueBoss:!!s.current.trueBoss,bossId:s.current.bossId,raidKind:s.current.raidKind}];if(act<=2)P.profile.stats['map'+act+'Bosses']=1;historyFacts(history);if(s.current.trueBoss&&order!=='monsters'&&orders[order])grantBossCards(order);if(s.current.secretBoss||s.secretBossEncounter)facts().secretBoss=true;}
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
const removed=new Set(['northern','eastern','shooters','arcanists','journeys','decks']);
for(let i=P.MILESTONES.length-1;i>=0;i--){
 const m=P.MILESTONES[i];
 if(removed.has(m.id)){P.MILESTONES.splice(i,1);continue;}
 for(const key of ['deck','decks','relic','booster'])delete m[key];
}
const milestones=Object.fromEntries(P.MILESTONES.map(m=>[m.id,m]));
Object.assign(milestones.firstSteps,{en:'Win your first encounter',pt:'Vencer o primeiro confronto',metric:'firstCombatWin'});
Object.assign(milestones.boss,{en:'Defeat the boss of map 1',pt:'Derrotar o boss do mapa 1',metric:'map1Bosses',mapUnlock:2});
milestones.map2boss.mapUnlock=3;
for(const [id,en,pt,goal,kind] of [
 ['recruit_three','Recruit 3 cards in one run','Recrutar 3 cartas em uma run',3,'recruited'],
 ['card_level2','Upgrade a card to level 2','Levar uma carta ao nível 2',1,'level2'],
 ['spender_100','Spend 100 gold in one run','Gastar 100 de ouro em uma run',100,'spent'],
 ['order_pair','Win both fights of one order on a map','Vencer as duas lutas da mesma ordem em um mapa',1,'orderPair'],
 ['elites_three','Win 3 elite encounters in one run','Vencer 3 elites em uma run',3,'elites'],
 ['sweeps_six','Win 6 encounters without losing a round in one run','Vencer 6 confrontos sem perder rodadas em uma run',6,'sweeps'],
 ['raid_win','Win a Raid','Vencer uma Raid',1,'raidWon'],
 ['map3_entries','Win the first two fights of map 3','Vencer as duas lutas de entrada do mapa 3',1,'map3Entries'],
 ['challenges_1','Win a run with 1 active Journey Challenge','Vencer uma run com 1 Desafio da Jornada ativo',1,'challenges'],
 ['challenges_3','Win a run with 3 active Journey Challenges','Vencer uma run com 3 Desafios da Jornada ativos',3,'challenges'],
 ['shop_relics_two','Buy 2 relics at shops in one run','Comprar 2 relíquias na loja em uma run',2,'shopRelics'],
 ['xp_forty','Earn 40 skill tree XP in one run','Ganhar 40 de XP da árvore em uma run',40,'xpGained'],
 ['recruits_map3','Win a map 3 encounter with 2 recruited cards in the field','Vencer um confronto do mapa 3 com 2 cartas recrutadas em campo',1,'recruitsMap3']
]){add(id,en,pt,goal,kind);milestones[id]=P.MILESTONES.at(-1);}
for(const [id,deck] of Object.entries({
 fusion_first:'blades',elite:'executioners',recruit_three:'corsair',order_pair:'fortress',boss_ironbound_map1:'quake',
 fusion_three:'verdant',boss_blackfang_map2:'keen',boss_dawncrest_map2:'arcane',boss_monsters_map2:'swift',
 boss_ironbound_map2:'astral',tree_25:'north',map3_entries:'fireline',
 boss_blackfang_map3:'greenskins',boss_blackfang_all:'goblin_horde',true_blackfang:'blackfang_war',win_deck_goblin_horde:'dark_court',
 boss_dawncrest_map3:'dawncrest_choir',boss_dawncrest_all:'meowri_band',true_dawncrest:'high_court',
 win_deck_high_court:'centaur_charge',win_deck_centaur_charge:'forest_guard'
}))milestones[id].deck=deck;
for(const [id,booster] of Object.entries({
 firstSteps:'bst_dawnward',spender:'bst_frontier',sweeps:'bst_ironwall',events:'bst_east',
 card_level2:'bst_heavy',spender_100:'bst_sharp',bag_full:'bst_verdant_arcane',elites_three:'bst_hunters',
 raid_win:'bst_northern',sweeps_six:'bst_mystic',win_deck_greenskins:'bst_goblin',win_deck_blackfang_war:'bst_shadows',
 win_deck_dawncrest_choir:'bst_wildhearts',win_deck_meowri_band:'bst_elven'
}))milestones[id].booster=booster;
for(const [id,relic] of Object.entries({
 training_first:'luckycharm',custom_five:'compass',boss_monsters_map1:'dormant_sword',
 custom_build:'captain_standard',boss_blackfang_map1:'profane_idol',boss_dawncrest_map1:'contract',
 shop_relics_two:'merchant',xp_forty:'grimoire',recruits_map3:'travelers_mirror'
}))milestones[id].relic=relic;
if(P.MILESTONES.length!==102)throw Error('Expected 102 milestones, got '+P.MILESTONES.length);
const displayRows=[
 ["firstSteps", "Win your first encounter", "Vencer o primeiro confronto", "Booster Pack: Dawnward Order", "Booster: Dawnward Order"],
 ["fusion_first", "Perform your first fusion", "Realizar a primeira fusão", "Retail Deck: Blades of the East", "Deck emprestado: Blades of the East"],
 ["training_first", "Play a training battle", "Fazer um combate de treinamento", "Relic: Lucky Charm", "Relíquia: Lucky Charm"],
 ["elite", "Defeat an elite", "Derrotar um elite", "Retail Deck: Executioners", "Deck emprestado: Executioners"],
 ["spender", "Spend 30 gold in one run", "Gastar 30 de ouro em uma run", "Booster Pack: Frontier & Free Seas", "Booster: Frontier & Free Seas"],
 ["sweeps", "Win 3 encounters without losing a round in one run", "Vencer 3 confrontos sem perder rodadas em uma run", "Booster Pack: Iron Wall", "Booster: Iron Wall"],
 ["events", "Resolve 3 events in one run", "Resolver 3 eventos em uma run", "Booster Pack: Legends of the East", "Booster: Legends of the East"],
 ["recruit_three", "Recruit 3 cards in one run", "Recrutar 3 cartas em uma run", "Retail Deck: Salt Crew", "Deck emprestado: Salt Crew"],
 ["card_level2", "Raise a card to upgrade level 2", "Levar uma carta ao upgrade nível 2", "Booster Pack: Heavy Hitters", "Booster: Heavy Hitters"],
 ["order_pair", "Win both order encounters of the same order on one map", "Vencer as 2 lutas de ordem de uma mesma ordem em um mapa", "Retail Deck: Fortress", "Deck emprestado: Fortress"],
 ["shop_relics_two", "Buy 2 relics at shops in one run", "Comprar 2 relíquias na loja em uma run", "Relic: Merchant's Coin", "Relíquia: Moeda do mercador"],
 ["spender_100", "Spend 100 gold in one run", "Gastar 100 de ouro em uma run", "Booster Pack: Sharpshooters", "Booster: Sharpshooters"],
 ["elites_three", "Defeat 3 elites in one run", "Derrotar 3 elites em uma run", "Booster Pack: Hunters & Raiders", "Booster: Hunters & Raiders"],
 ["boss", "Defeat the boss of map 1", "Derrotar o boss do mapa 1", "Unlocks Map 2", "Libera o Mapa 2"],
 ["boss_blackfang_map1", "Defeat the {Blackfang} Boss on map 1", "Derrotar o Boss {Blackfang} no mapa 1", "Relic: Profane Idol", "Relíquia: Ídolo profano"],
 ["boss_dawncrest_map1", "Defeat the {Dawncrest} Boss on map 1", "Derrotar o Boss {Dawncrest} no mapa 1", "Relic: Mercenary Contract", "Relíquia: Contrato do mercenário"],
 ["boss_monsters_map1", "Defeat the Titans Boss on map 1", "Derrotar o Boss Titans no mapa 1", "Relic: Dormant Sword", "Relíquia: Espada adormecida"],
 ["boss_ironbound_map1", "Defeat the Grand Union Boss on map 1", "Derrotar o Boss da Grand Union no mapa 1", "Retail Deck: Earthquake", "Deck emprestado: Earthquake"],
 ["raid_win", "Win a Raid", "Vencer uma Raid", "Booster Pack: Northern Wilds", "Booster: Northern Wilds"],
 ["bag_full", "Fill every available Relic Bag cell", "Preencher todas as casas disponíveis da bolsa de relíquias", "Booster Pack: Verdant & Arcane", "Booster: Verdant & Arcane"],
 ["fusion_three", "Finish an encounter with three fused units on the field", "Terminar um confronto com três unidades fundidas em campo", "Retail Deck: Verdant Circle", "Deck emprestado: Verdant Circle"],
 ["sweeps_six", "Win 6 encounters without losing a round in one run", "Vencer 6 confrontos sem perder rodadas em uma run", "Booster Pack: Mystic Support", "Booster: Mystic Support"],
 ["custom_build", "Build a complete custom deck", "Montar um deck custom completo", "Relic: Captain's Standard", "Relíquia: Estandarte do capitão"],
 ["custom_five", "Complete five nodes on map 1 with a custom deck", "Concluir cinco nós no mapa 1 com um deck custom", "Relic: Raider's Compass", "Relíquia: Bússola do saqueador"],
 ["map2boss", "Defeat the boss of map 2", "Derrotar o boss do mapa 2", "Unlocks Map 3", "Libera o Mapa 3"],
 ["boss_ironbound_map2", "Defeat the Grand Union Boss on map 2", "Derrotar o Boss da Grand Union no mapa 2", "Retail Deck: War Choir", "Deck emprestado: War Choir"],
 ["boss_blackfang_map2", "Defeat the {Blackfang} Boss on map 2", "Derrotar o Boss {Blackfang} no mapa 2", "Retail Deck: Keen Edge", "Deck emprestado: Keen Edge"],
 ["boss_dawncrest_map2", "Defeat the {Dawncrest} Boss on map 2", "Derrotar o Boss {Dawncrest} no mapa 2", "Retail Deck: Arcane Circle", "Deck emprestado: Arcane Circle"],
 ["boss_monsters_map2", "Defeat the Titans Boss on map 2", "Derrotar o Boss Titans no mapa 2", "Retail Deck: Winds of Chance", "Deck emprestado: Winds of Chance"],
 ["map3_entries", "Win both entry encounters of map 3", "Vencer as 2 lutas de entrada do mapa 3", "Retail Deck: Fireline", "Deck emprestado: Fireline"],
 ["xp_forty", "Earn 40 tree XP in one run", "Ganhar 40 de XP da árvore em uma run", "Relic: Apprentice's Grimoire", "Relíquia: Grimório do aprendiz"],
 ["recruits_map3", "Win a map 3 encounter with 2 recruited cards on the field", "Vencer um confronto do mapa 3 com 2 cartas recrutadas em campo", "Relic: Travelers' Mirror", "Relíquia: Espelho do viajante"],
 ["tree_25", "Fully acquire 25% of skill tree nodes", "Adquirir 25% dos nós da árvore", "Retail Deck: Northern Blood", "Deck emprestado: Northern Blood"],
 ["run_first_win", "Win a run for the first time", "Vencer uma run pela primeira vez"],
 ["boss_blackfang_map3", "Defeat the {Blackfang} Boss on map 3", "Derrotar o Boss {Blackfang} no mapa 3", "Reveals the order + Retail Deck: {Greenskins}", "Revela a ordem + Deck emprestado: {Greenskins}"],
 ["boss_dawncrest_map3", "Defeat the {Dawncrest} Boss on map 3", "Derrotar o Boss {Dawncrest} no mapa 3", "Reveals the order + Retail Deck: {Dawncrest Choir}", "Revela a ordem + Deck emprestado: {Dawncrest Choir}"],
 ["boss_ironbound_map3", "Defeat the Grand Union Boss on map 3", "Derrotar o Boss da Grand Union no mapa 3"],
 ["boss_monsters_map3", "Defeat the Titans Boss on map 3", "Derrotar o Boss Titans no mapa 3"],
 ["challenges_1", "Win a run with 1 active Journey Challenge", "Vencer uma run com 1 Desafio da Jornada ativo"],
 ["win_deck_vanguard", "Win a run with Dawn Vanguard", "Vencer uma run com Dawn Vanguard"],
 ["win_deck_balanced", "Win a run with Crossing Paths", "Vencer uma run com Crossing Paths"],
 ["win_deck_outlaws", "Win a run with Trigger Law", "Vencer uma run com Trigger Law"],
 ["win_deck_blades", "Win a run with Blades of the East", "Vencer uma run com Blades of the East"],
 ["win_deck_executioners", "Win a run with Executioners", "Vencer uma run com Executioners"],
 ["win_deck_quake", "Win a run with Earthquake", "Vencer uma run com Earthquake"],
 ["win_deck_keen", "Win a run with Keen Edge", "Vencer uma run com Keen Edge"],
 ["win_deck_corsair", "Win a run with Salt Crew", "Vencer uma run com Salt Crew"],
 ["win_deck_fortress", "Win a run with Fortress", "Vencer uma run com Fortress"],
 ["win_deck_verdant", "Win a run with Verdant Circle", "Vencer uma run com Verdant Circle"],
 ["win_deck_arcane", "Win a run with Arcane Circle", "Vencer uma run com Arcane Circle"],
 ["win_deck_swift", "Win a run with Winds of Chance", "Vencer uma run com Winds of Chance"],
 ["win_deck_astral", "Win a run with War Choir", "Vencer uma run com War Choir"],
 ["win_deck_north", "Win a run with Northern Blood", "Vencer uma run com Northern Blood"],
 ["win_deck_fireline", "Win a run with Fireline", "Vencer uma run com Fireline"],
 ["win_deck_greenskins", "Win a run with {Greenskins}", "Vencer uma run com {Greenskins}", "Booster Pack: {Goblin Raiders}", "Booster: {Goblin Raiders}"],
 ["win_deck_dawncrest_choir", "Win a run with {Dawncrest Choir}", "Vencer uma run com {Dawncrest Choir}", "Booster Pack: {Wild Hearts}", "Booster: {Wild Hearts}"],
 ["challenges_3", "Win a run with 3 active Journey Challenges", "Vencer uma run com 3 Desafios da Jornada ativos"],
 ["true_blackfang", "Defeat the {Blackfang} True Boss", "Derrotar o True Boss {Blackfang}", "Retail Deck: {Blackfang War}", "Deck emprestado: {Blackfang War}"],
 ["true_dawncrest", "Defeat the {Dawncrest} True Boss", "Derrotar o True Boss {Dawncrest}", "Retail Deck: {High Court}", "Deck emprestado: {High Court}"],
 ["true_ironbound", "Defeat the Grand Union True Boss", "Derrotar o True Boss da Grand Union"],
 ["true_monsters", "Defeat the Titans True Boss", "Derrotar o True Boss Titans"],
 ["boss_blackfang_all", "Defeat {Blackfang} Bosses on all three maps in one run", "Derrotar os Bosses {Blackfang} nos três mapas em uma run", "Retail Deck: {Goblin Horde}", "Deck emprestado: {Goblin Horde}"],
 ["boss_dawncrest_all", "Defeat {Dawncrest} Bosses on all three maps in one run", "Derrotar os Bosses {Dawncrest} nos três mapas em uma run", "Retail Deck: {Meowri Band}", "Deck emprestado: {Meowri Band}"],
 ["boss_ironbound_all", "Defeat Grand Union Bosses on all three maps in one run", "Derrotar os Bosses da Grand Union nos três mapas em uma run"],
 ["boss_monsters_all", "Defeat Titans Bosses on all three maps in one run", "Derrotar os Bosses Titans nos três mapas em uma run"],
 ["win_deck_blackfang_war", "Win a run with {Blackfang War}", "Vencer uma run com {Blackfang War}", "Booster Pack: {Shadows & Stone}", "Booster: {Shadows & Stone}"],
 ["win_deck_high_court", "Win a run with {High Court}", "Vencer uma run com {High Court}", "Retail Deck: {Centaur Charge}", "Deck emprestado: {Centaur Charge}"],
 ["win_deck_goblin_horde", "Win a run with {Goblin Horde}", "Vencer uma run com {Goblin Horde}", "Retail Deck: {Dark Court}", "Deck emprestado: {Dark Court}"],
 ["win_deck_centaur_charge", "Win a run with {Centaur Charge}", "Vencer uma run com {Centaur Charge}", "Retail Deck: {Forest Guard}", "Deck emprestado: {Forest Guard}"],
 ["win_deck_meowri_band", "Win a run with {Meowri Band}", "Vencer uma run com {Meowri Band}", "Booster Pack: {Elven Courts}", "Booster: {Elven Courts}"],
 ["win_deck_dark_court", "Win a run with {Dark Court}", "Vencer uma run com {Dark Court}"],
 ["win_deck_forest_guard", "Win a run with {Forest Guard}", "Vencer uma run com {Forest Guard}"],
 ["challenges_5", "Win a run with 5 active Journey Challenges", "Vencer uma run com 5 Desafios da Jornada ativos"],
 ["advantages_5", "Activate 5 Journey Advantages together", "Ativar 5 Vantagens da Jornada simultaneamente"],
 ["tree_50", "Fully acquire 50% of skill tree nodes", "Adquirir 50% dos nós da árvore"],
 ["custom_win", "Win all three maps with a custom deck", "Vencer os três mapas com um deck custom"],
 ["collection_Dawnward Order", "Complete the Dawnward Order card collection", "Completar a coleção de cartas de Dawnward Order"],
 ["collection_Legends of the East", "Complete the Legends of the East card collection", "Completar a coleção de cartas de Legends of the East"],
 ["collection_Wild West", "Complete the Wild West card collection", "Completar a coleção de cartas de Wild West"],
 ["collection_Seasalt Crew", "Complete the Seasalt Crew card collection", "Completar a coleção de cartas de Seasalt Crew"],
 ["collection_Verdant Covenant", "Complete the Verdant Covenant card collection", "Completar a coleção de cartas de Verdant Covenant"],
 ["collection_Arcane", "Complete the Arcane card collection", "Completar a coleção de cartas de Arcane"],
 ["collection_Frostborn Clans", "Complete the Frostborn Clans card collection", "Completar a coleção de cartas de Frostborn Clans"],
 ["collection_Goblin", "Complete the {Goblin} card collection", "Completar a coleção de cartas de {Goblin}"],
 ["collection_Orc", "Complete the {Orc} card collection", "Completar a coleção de cartas de {Orc}"],
 ["collection_Troll", "Complete the {Troll} card collection", "Completar a coleção de cartas de {Troll}"],
 ["collection_Dark Elf", "Complete the {Dark Elf} card collection", "Completar a coleção de cartas de {Dark Elf}"],
 ["collection_Meowri", "Complete the {Meowri} card collection", "Completar a coleção de cartas de {Meowri}"],
 ["collection_High Elf", "Complete the {High Elf} card collection", "Completar a coleção de cartas de {High Elf}"],
 ["collection_Forest Elf", "Complete the {Forest Elf} card collection", "Completar a coleção de cartas de {Forest Elf}"],
 ["collection_Fairy", "Complete the {Fairy} card collection", "Completar a coleção de cartas de {Fairy}"],
 ["collection_Centaur", "Complete the {Centaur} card collection", "Completar a coleção de cartas de {Centaur}"],
 ["collection_relics", "Complete the relic collection", "Completar a coleção de relíquias"],
 ["titans_all", "Defeat all nine different Titans", "Derrotar os nove Titans diferentes"],
 ["tree_75", "Fully acquire 75% of skill tree nodes", "Adquirir 75% dos nós da árvore"],
 ["advantages_10", "Activate 10 Journey Advantages together", "Ativar 10 Vantagens da Jornada simultaneamente"],
 ["challenges_10", "Win a run with 10 active Journey Challenges", "Vencer uma run com 10 Desafios da Jornada ativos"],
 ["decks_all", "Win a run with every Retail Deck", "Vencer uma run com cada deck emprestado"],
 ["tree_100", "Fully acquire 100% of skill tree nodes", "Adquirir 100% dos nós da árvore"],
 ["advantages_15", "Activate 15 Journey Advantages together", "Ativar 15 Vantagens da Jornada simultaneamente"],
 ["challenges_15", "Win a run with 15 active Journey Challenges", "Vencer uma run com 15 Desafios da Jornada ativos"],
 ["secret_boss", "Defeat the Secret Boss", "Derrotar o Secret Boss (fora da integração)"]
];
if(new Set(displayRows.map(([id])=>id)).size!==P.MILESTONES.length)throw Error('Invalid milestone display order');
P.MILESTONES.splice(0,P.MILESTONES.length,...displayRows.map(([id,en,pt,rewardEn,rewardPt])=>{
 const m=milestones[id];
 if(!m)throw Error('Unknown milestone '+id);
 const deck=G.DECKS.find(d=>d.id===m.deckTarget);
 const order=m.order||deck?.order||(m.faction&&factionCards(m.faction)[0]?.order);
 return Object.assign(m,{en,pt,rewardEn,rewardPt,displayOrder:order});
}));
function displayText(m,value,mask=true){
 const order=m.displayOrder;
 const concealed=mask&&['blackfang','dawncrest'].includes(order)&&!P.profile[order+'Unlocked'];
 return (value||'').replace(/\{([^{}]+)\}/g,(_,name)=>concealed?'?????':name);
}
function progress(m){const f=facts(),p=P.profile;if(!m.kind)return p.stats[m.metric]??P.metric(m.metric);switch(m.kind){
 case'shopRelics':return f.shopRelics||0;case'xpGained':return f.xpGained||0;case'recruitsMap3':return +!!f.recruitsMap3;
 case'recruited':return f.recruited||0;case'level2':return +!!f.level2;case'spent':return p.stats.bestSpent;
 case'orderPair':return +!!f.orderPair;case'elites':return f.elites||0;case'sweeps':return p.stats.bestSweeps;
 case'raidWon':return +!!f.raidWon;case'map3Entries':return +!!f.map3Entries;
 case'deck':return +f.wonDecks.includes(m.deckTarget);case'bossMap':return +(f.bossMaps[m.order]||[]).includes(m.act);case'allBoss':return +f.allBossOrders.includes(m.order);case'bag':return +f.bagFull;case'collection':return factionCards(m.faction).filter(u=>(p.cards[u.id]||0)>0).length;case'relics':return relics.filter(r=>p.relics[r.id]).length;case'training':return +f.training;case'customBuilt':return +f.customBuilt;case'customFive':return +f.customFive;case'customWon':return +f.customWon;case'tree':return f.treeBest;case'firstWin':return +(p.stats.wins>0);case'advantages':return f.advBest;case'challenges':return f.challengeBest;case'secret':return +f.secretBoss;case'trueBoss':return +f.trueOrders.includes(m.order);case'titans':return f.titans.length;case'firstFusion':return +f.firstFusion;case'threeFused':return +f.threeFused;case'allDecks':return f.wonDecks.length;}return 0;}
function beforeCheck(){const f=facts(),p=P.profile;f.paid??=[];f.treeBest=Math.max(f.treeBest,T.profile().unlocked.length);f.advBest=Math.max(f.advBest,AD.owned().length);f.challengeBest=Math.max(f.challengeBest,...C.profile().won,0);if(p.customDecks.some(d=>d&&!P.validateCustom(d)))f.customBuilt=true;for(const run of p.runs||[]){finishedFacts(run);if(run.deck?.startsWith('custom-')&&run.completed?.filter(n=>!n.id.startsWith('a2_')&&!n.id.startsWith('a3_')).length>=5)f.customFive=true;}}
function afterCheck(){const f=facts(),p=P.profile;for(const m of P.MILESTONES)if(p.milestones.includes(m.id)&&!f.paid.includes(m.id)){f.paid.push(m.id);p.diamonds+=1;} }
function observe(s){if(!eligible(s))return;const f=facts();
 f.shopRelics=Math.max(f.shopRelics||0,s.meta?.shopRelics||0);
 f.xpGained=Math.max(f.xpGained||0,s.journey?.tree?.gain||0);
 f.recruited=Math.max(f.recruited||0,s.meta?.recruited||0);
 f.elites=Math.max(f.elites||0,s.meta?.elites||0);
 if(s.cards.some(c=>c.level>=2))f.level2=true;
 if(Object.values(A.currentCounts(s)).some(n=>n>=2))f.orderPair=true;
 if(s.deck?.startsWith('custom-')&&(A.act(s)>1||(s.meta?.completed||[]).length>=5))f.customFive=true;if(s.fusionSerial>0)f.firstFusion=true;
 const items=s.bag?.items||[];if(items.length&&items.every(it=>s.artifacts.includes(it.id))&&G.bagValid(items,s)){const cells=new Set();for(const it of items)for(const [dx,dy]of G.relicShape(it.id,it.rotation))cells.add((it.y+dy)*4+it.x+dx);if(cells.size===G.bagCapacity(s))f.bagFull=true;}
 if(s.meta?.ended&&s.meta.reason==='victory')finishedFacts({...s.meta,deck:s.deck,actHistory:s.journey?.history,challengeLevel:s.challengeLevel??s.challenges?.length??0,completedChallenges:s.challenges||[]});
}
function encounter(s){if(!eligible(s))return;observe(s);
 if(A.act(s)===3&&s.board.filter(uid=>uid&&G.card(s,uid)?.recruited).length>=2)facts().recruitsMap3=true;
 if(s.raid&&s.current?.type!=='boss')facts().raidWon=true;
 if(!s.eventEncounter&&A.act(s)===3&&A.localStage(s)===2)facts().map3Entries=true;
 if(s.current?.campaign==='monsters'&&['tree','colossus','slime','dragon','hydra','kraken','lich','naga','manticore'].includes(s.current.raidKind))unique(facts().titans,s.current.raidKind);if(s.board.filter(uid=>uid&&s.fusions?.[uid]).length>=3)facts().threeFused=true;}
function hidden(m){const p=P.profile;if(m.kind==='secret')return !facts().secretBoss;if(m.kind==='deck')return !p.decks.includes(m.deckTarget);if(m.order&&['blackfang','dawncrest'].includes(m.order))return !p[m.order+'Unlocked'];if(m.kind==='collection'){const cards=factionCards(m.faction),order=cards[0]?.order;return order==='blackfang'&&!p.blackfangUnlocked||order==='dawncrest'&&!p.dawncrestUnlocked;}return false;}
const oldMetric=P.metric;P.metric=function(metric){if(metric?.startsWith('v56:')){const m=P.MILESTONES.find(m=>m.metric===metric);return m?progress(m):0;}return oldMetric(metric);};
const load=P.load;P.load=function(...args){const p=load(...args);P.check();return p;};
const checkAction=(obj,key,after)=>{const old=obj[key];if(!old)return;obj[key]=function(...args){const result=old.apply(this,args);if(result!==false&&result!==null){after?.(args,result);P.check();}return result;};};
for(const key of ['commitBag','takeRelic','receiveRelic','deploy','transfer','fuse'])checkAction(G,key,args=>observe(args[0]));
checkAction(P,'saveCustom',()=>{const p=P.profile;if(p.customDecks.some(d=>d&&!P.validateCustom(d)))facts().customBuilt=true;});
checkAction(T,'buy');checkAction(AD,'buy');
const create=G.createBattle;G.createBattle=function(s){const b=create(s);if(b){if(s.training)facts().training=true;else observe(s);P.check();}return b;};
const onEnd=P.onRunEnd;P.onRunEnd=function(s){onEnd?.(s);observe(s);P.check();if(s.meta){s.meta.unlocks=P.profile.unlockHistory.slice(s.meta.unlockStart||0);const r=P.profile.runs.find(r=>r.id===s.meta.id);if(r)r.unlocks=[...s.meta.unlocks];}};
const continueRun=T.continueRun;T.continueRun=function(s){const result=continueRun(s);observe(s);P.check();if(s.meta?.ended){s.meta.unlocks=P.profile.unlockHistory.slice(s.meta.unlockStart||0);const r=P.profile.runs.find(r=>r.id===s.meta.id);if(r)r.unlocks=[...s.meta.unlocks];}return result;};
root.JourneyProgression={bossCardsUnlocked,bossWon,grantBossCards};
root.JourneyMilestones={displayText,facts,progress,beforeCheck,afterCheck,observe,encounter,hidden,factions,factionCards,allTree};
P.check();
})(globalThis);
