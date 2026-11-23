/* Save telemetry observes the run without consuming gameplay randomness. */
(function(root){
'use strict';
const G=root.Game,P=root.Progress,A=root.JourneyActs,T=root.JourneyTree;
const exportSchema=2,build='v57-R3', statKeys=['hp','damage','attackSpeed','armor','skill','defense','speed','crit','minions'];
const active=s=>!!s?.meta&&!s.meta.ended&&!s.training&&!s.tutorialReplay;
const clone=o=>JSON.parse(JSON.stringify(o));
const time=n=>Math.round(n*10)/10;
const coord=n=>Math.round(n*10000)/10000;
const node=s=>s.eventEncounter?.base?.id||s.current?.id||s.content?.questPending;
function validExport(raw){
 const profile=raw?.profile;
 return raw?.format==='grand-journey'&&[1,exportSchema].includes(raw.schema)&&profile?.schema===1&&
  Number.isFinite(profile.diamonds)&&profile.diamonds>=0&&!!profile.cards&&!!profile.relics&&
  Array.isArray(profile.decks)&&Array.isArray(profile.catalogCards)&&Array.isArray(profile.runs)&&
  (!raw.state||[11,12,13,14,15,16,17,18,19,20].includes(raw.state.version));
}
function choice(s,kind,data){
 if(!active(s)||!node(s))return;
 const entry={kind,node:node(s),at:new Date().toISOString(),...data};
 (s.meta.choices??=[]).push(entry);
 return entry;
}
function piece(item){
 return {id:item.id,shape:G.RELIC_FORMATS[item.id],cells:G.relicShape(item.id,item.rotation).map(([x,y])=>[item.y+y,item.x+x])};
}
function bag(s){
 return [...(s.bag?.items||[]).map(piece),...(s.reserve||[]).map(id=>({id,shape:G.RELIC_FORMATS[id],cells:[]}))];
}
function bagChanged(s,before){
 const after=bag(s),old=new Map(before.map(p=>[p.id,p]));
 for(const p of after){
  const prev=old.get(p.id);
  if(JSON.stringify(prev?.cells)!==JSON.stringify(p.cells))choice(s,'relicMoved',{id:p.id,from:prev?.cells??null,to:p.cells});
 }
}
function formation(unit){
 return {uid:unit.uid,type:unit.type,level:unit.level||0,x:time(unit.x),y:time(unit.y)};
}
function barrier(s){
 const n=s.current;
 if(n.trueBoss)return 'trueBoss';
 if(s.eventEncounter||n.eventFight)return 'event';
 if(s.raid)return n.type==='boss'?'titan':'raid';
 if(n.type==='boss')return 'boss';
 if(['blackfang','dawncrest'].includes(n.campaign))return 'order';
 if(A.localStage(s)<=A.BARRIER.entranceFights)return 'entry';
 return n.type==='elite'?'elite':'normal';
}
function sources(s){
 const act=A.act(s),kind=barrier(s),C=root.JourneyChallenges,c=C.TUNE,raid=s.raid;
 const list=[{source:'map:'+act,hp:A.mapPower?.(act)??A.SPEC[act].power,damage:A.mapPower?.(act)??A.SPEC[act].power}];
 if(raid){
  return raid.scaleSources||[{source:'raid:'+raid.kind,...raid.scale}];
 }else{
  const stage=0.8+Math.min(8,A.localStage(s)-1)*0.02;
  list.push({source:'stage:'+A.localStage(s),hp:stage,damage:stage});
  list.push({source:'barrier:'+kind,hp:A.barrier(s),damage:A.barrier(s)});
  if(C.active(s,'tough'))list.push({source:'challenge:tough',hp:1+c.tough});
  if(C.active(s,'relentless'))list.push({source:'challenge:relentless',damage:1+c.relentless});
  if(C.active(s,'fortified'))list.push({source:'challenge:fortified',hp:1+c.fortifiedHp,damage:1+c.fortifiedAtk});
  {const k=root.JourneyChallengesEndgame?.scaleOf?.(s)||1;if(k!==1)list.push({source:'challenge:globalScale',hp:k,damage:k,defense:k});}
  if(c.bossStats&&C.active(s,'bossrounds')&&s.current.type==='boss'&&!s.current.trueBoss)list.push({source:'challenge:bossrounds',hp:1+c.bossStats,damage:1+c.bossStats});
  const elite=['boss','elite'].includes(s.current.type),addLevel=C.upgrades(s,elite,s.current.type==='boss');
  if(addLevel)list.push({source:'challenge:'+(elite?'commanders':'veterans'),addLevel});
  const addRounds=C.extraBossRounds(s),addCards=C.extraUnits(s);
  if(addRounds)list.push({source:'challenge:bossrounds',addRounds});
  if(addCards)list.push({source:'challenge:reinforcements',addCards});
 }
 return list;
}
function scale(list){
 return Object.fromEntries(statKeys.map(key=>[key,coord(list.reduce((value,source)=>value*(source[key]??1),1))]));
}
function startRound(s,b){
 if(!active(s)||!s.current)return;
 const relics=(s.bag?.items||[]).map(piece),player=b.units.filter(u=>!u.side),enemy=b.units.filter(u=>u.side);
 const enemyScaleSources=sources(s),enemyScale=scale(enemyScaleSources);
 for(const u of enemy){
  const adjustments=u.telemetryModifiers;
  if(adjustments?.length)u.telemetryScale=u.uid==='boss-leader'?adjustments:[...enemyScaleSources,...adjustments];
  if(s.raid&&!u.raidBoss)u.telemetryScale=b.boss?.form===2?[]:[{source:'raid:'+s.raid.kind,hp:enemyScale.minions,damage:enemyScale.minions}];
 }
 b.playtest={
  player:{formation:player.map(formation),relics,bagCellsUsed:relics.reduce((n,p)=>n+p.cells.length,0),bagCellsTotal:G.bagCapacity(s)},
  enemy:{formation:enemy.map(u=>({...formation(u),...(u.telemetryScale?{enemyScaleSources:u.telemetryScale,enemyScale:scale(u.telemetryScale)}:{})})),reinforcements:[]},
  initialHp:[player,enemy].map(units=>units.reduce((n,u)=>n+u.hp,0)),
  enemyScale,enemyScaleSources
 };
}
function reinforcements(b){
 const data=b.playtest?.enemy;if(!data)return;
 for(const unit of b.units)if(unit.side&&!data.formation.some(u=>u.uid===unit.uid)&&!data.reinforcements.some(u=>u.uid===unit.uid)){
  data.reinforcements.push({...formation(unit),time:time(b.time)});
 }
}
function round(s,b){
 if(!active(s)||!b?.playtest)return;
 const key=s.current.id+':'+s.encounters,meta=s.meta;
 const log=meta.playtestBattle?.key===key?meta.playtestBattle:(meta.playtestBattle={key,rounds:[],units:{}});
 if(log.rounds.some(r=>r.round===s.round))return;
 reinforcements(b);
 const {initialHp,...details}=b.playtest;
 const sides=[b.units.filter(u=>!u.side),b.units.filter(u=>u.side)];
 const hp=(side)=>initialHp[side]?time(100*sides[side].reduce((n,u)=>n+Math.max(0,u.hp),0)/initialHp[side]):null;
 log.rounds.push({...details,round:s.round,winner:{win:'player',loss:'enemy',draw:'draw'}[b.result],time:time(b.time),
  playerHpPct:hp(0),enemyHpPct:hp(1),playerAlive:sides[0].filter(u=>u.hp>0).length,enemyAlive:sides[1].filter(u=>u.hp>0).length});
 for(const u of sides[0]){
  const id=u.uid+':'+(u.level||0),row=log.units[id]??={uid:u.uid,type:u.type,level:u.level||0};
  for(const key of ['skillCasts','skillHeldTime','damageDealt','damageTaken','healing','kills','deaths'])row[key]=(row[key]||0)+(u[key]||0);
 }
}
function encounter(s,entry,result){
 if(!active(s))return;
 const pending=s.meta.playtestBattle,log=pending?.key===entry.key?pending:null,first=log?.rounds[0],rounds=log?.rounds||[];
 const leader=first?.enemy.formation.find(u=>u.uid==='boss-leader');
 Object.assign(entry,{result,act:A.act(s),barrier:barrier(s),
  ...(first?{enemyScale:leader?.enemyScale||first.enemyScale,enemyScaleSources:leader?.enemyScaleSources||first.enemyScaleSources,player:first.player}:{}),rounds,
  units:Object.values(log?.units||{}).map(u=>({...u,damageDealt:Math.round(u.damageDealt),damageTaken:Math.round(u.damageTaken),healing:Math.round(u.healing),skillHeldTime:time(u.skillHeldTime)}))});
 delete s.meta.playtestBattle;
}
function defeat(s){
 if(!active(s)||s.phase!=='defeat'||!s.current||!G.isFight(s.current))return;
 const key=s.current.id+':'+s.encounters;
 if(s.meta.encounters.some(e=>e.key===key))return;
 const entry={key,type:s.current.type,deck:s.ai?.deckId||null,relics:[...(s.ai?.artifacts||[])],score:[...s.score],round:s.round,
  formation:s.board.filter(Boolean).map(id=>G.card(s,id)).filter(Boolean).map(c=>({type:c.type,level:c.level})),event:!!s.eventEncounter};
 encounter(s,entry,'defeat');
 s.meta.encounters.push(entry);
}
function startRun(s){
 if(!active(s)||s.meta.build)return;
 Object.assign(s.meta,{build,seed:s.seed,treeNodes:[...T.profile().unlocked],treeBought:[],choices:[]});
}
function settings(s){
 if(!active(s))return;
 if(s.challenges)s.meta.challenges??=[...s.challenges];
 if(s.adv)s.meta.advantages??=[...s.adv.owned];
}
function treeBought(s,id,cost){if(active(s))(s.meta.treeBought??=[]).push({id,cost});}
function goldStart(s,before){
 if(!active(s)||!node(s))return;
 s.meta.playtestGold={node:node(s),before,spent:s.meta.spent,extraOut:0};
}
function extraOut(s,amount){
 if(active(s)&&s.meta.playtestGold?.node===node(s))s.meta.playtestGold.extraOut+=amount;
}
function goldClose(s){
 const start=s.meta?.playtestGold;
 if(!active(s)||!start||start.node!==node(s))return;
 const entry=s.meta.completed.find(e=>e.id===start.node);
 if(!entry)return;
 const out=s.meta.spent-start.spent+start.extraOut,delta=s.gold-start.before;
 Object.assign(entry,{goldIn:Math.max(0,delta+out),goldOut:Math.max(out,-delta),goldAfter:s.gold});
}
function shopItems(s){
 const items=['cards','artifacts'].flatMap(kind=>(s.offers[kind]||[]).filter(Boolean).map(id=>({kind,id,price:G.price(s,kind,id)})));
 for(const kind of ['upgrade','remove'])for(const c of s.cards){
  const curse=root.JourneyContent.isCurse(c);
  if(kind==='upgrade'&&(curse||c.level>=2)||kind==='remove'&&!curse&&root.JourneyContent.units(s).length<=1)continue;
  items.push({kind,id:c.uid,type:c.type,price:G.price(s,kind,c.uid)});
 }
 return items;
}
function offer(s,kind,items,event=null,offeredLevels=null){
 if(!active(s)||!items?.length)return;
 const entries=s.meta.choices||[],last=entries.findLast(e=>e.kind===kind&&e.node===node(s));
 if(last&&!last.source&&JSON.stringify(last.offered)===JSON.stringify(items)&&JSON.stringify(last.offeredLevels??null)===JSON.stringify(offeredLevels))return last;
 return choice(s,kind,{...(event?{event}:{}),offered:clone(items),...(offeredLevels?{offeredLevels}:{}),chosen:kind==='shopOffer'?[]:null});
}
function selectOffer(s,kind,value){
 if(!active(s))return;
 const entry=(s.meta.choices||[]).findLast(e=>e.kind===kind&&e.node===node(s));
 if(!entry)return;
 if(kind==='shopOffer')entry.chosen.push(value);else entry.chosen=value;
 entry.chosenAt=new Date().toISOString();
}
function eventOptions(s){
 const content=root.JourneyContent;
 return content.options(s).map(o=>({id:o.code,cost:o.cost,fields:Object.fromEntries(o.fields.map(key=>[key,content.pickList(s,key)]))}));
}
function recruitOffer(s,ids,base=0,event=null){
 if(!ids?.length)return;
 return offer(s,'recruitOffer',ids,event,Object.fromEntries(ids.map(id=>[id,G.recruitLevel(s,id,base)])));
}
function offers(s){
 if(!active(s))return;
 if(s.phase==='shop'){
  const last=s.meta.choices?.findLast(e=>e.kind==='shopOffer'&&e.node===node(s));
  const items=shopItems(s);
  if(!last||items.some(item=>!last.offered.some(p=>p.kind===item.kind&&p.id===item.id&&p.price===item.price)))offer(s,'shopOffer',items);
 }
 if(s.phase==='recruit')recruitOffer(s,s.offers);
 if(s.phase==='relic')offer(s,'relicOffer',s.offers);
 if(s.phase==='eventReward'){
  if(s.eventPending?.relic)offer(s,'relicOffer',s.eventPending.artifactOptions);
  if(s.eventPending?.cards)recruitOffer(s,s.eventPending.cardOptions,s.eventPending.level,s.offers.eventId);
 }
}
function eventRelicOffer(s,fields){
 const ids=fields.filter(key=>key!=='relic'&&key.toLowerCase().includes('relic')).flatMap(key=>root.JourneyContent.pickList(s,key));
 if(ids.length)offer(s,'relicOffer',[...new Set(ids)]);
}
function relicAwarded(s,id){
 const last=(s.meta?.choices||[]).findLast(e=>e.kind==='relicOffer'&&e.node===node(s));
 if(last&&last.source!=='discovery'&&last.offered.includes(id))last.chosen=id;
 else choice(s,'relicOffer',{offered:[id],chosen:id});
}
function upgrade(s,card,from){
 if(card&&card.level!==from)choice(s,'fusion',{type:card.type,uid:card.uid,from,to:card.level});
}
function cardLevels(s){return active(s)?new Map(s.cards.map(c=>[c.uid,c.level])):null;}
function changedLevels(s,levels){if(levels)for(const c of s.cards)if(levels.has(c.uid))upgrade(s,c,levels.get(c.uid));}
const attach=P.attach;
P.attach=function(s){const result=attach(s);startRun(s);return result;};
for(const engine of [root.JourneyChallenges,root.JourneyAdvantages]){
 const start=engine.start;
 engine.start=function(s){const result=start(s);settings(s);return result;};
}
const enter=G.enter;
G.enter=function(s,id){const gold=s.gold,result=enter(s,id);if(result){settings(s);goldStart(s,gold);offers(s);}return result;};
const create=G.createBattle;
G.createBattle=function(s){const b=create(s);if(b)startRound(s,b);return b;};
const finish=P.finish;
P.finish=function(s,reason){
 settings(s);
 if(reason!=='abandoned'&&s.current?.type==='boss'&&s.meta?.completed.some(e=>e.id===node(s)))goldClose(s);
 return finish(s,reason);
};
const leave=G.leave;
G.leave=function(s){goldClose(s);return leave(s);};
const service=G.shopService;
G.shopService=function(s,kind,uid){
 const c=G.card(s,uid),level=c?.level,price=c?G.price(s,kind,uid):null;
 offers(s);
 const result=service(s,kind,uid);
 if(result){selectOffer(s,'shopOffer',{kind,id:uid,type:c.type,price});upgrade(s,c,level);root.JourneyMilestones?.observe(s);P.check();}
 return result;
};
const commit=G.commitBag;
G.commitBag=function(s,items){
 const before=active(s)?bag(s):null,p=s.pendingRelic;
 if(p?.source==='shop')offers(s);
 const result=commit(s,items);
 if(result&&before){
  if(p?.source==='shop'&&items.some(i=>i.id===p.id))selectOffer(s,'shopOffer',{kind:'artifacts',id:p.id,price:p.price});
  bagChanged(s,before);
 }
 return result;
};
for(const [engine,key] of [[G,'rerollOffers'],[root.JourneyPlaytest,'refreshRelics'],[root.JourneyAdvantages,'rerollRelic']]){
 const refresh=engine[key];
 engine[key]=function(s,...args){
  offers(s);
  if(key==='rerollRelic'&&args[0]&&s.offers?.content)eventRelicOffer(s,[args[0]]);
  const result=refresh(s,...args);
  if(result){
   if(key==='rerollOffers'&&s.phase==='shop')choice(s,'shopOffer',{offered:shopItems(s),chosen:[],reroll:true});
   else offers(s);
   if(key==='rerollRelic'&&args[0]&&s.offers?.content)eventRelicOffer(s,[args[0]]);
  }
  return result;
 };
}
const content=root.JourneyContent,accept=content.accept;
content.accept=function(s,code){
 if(!active(s))return accept(s,code);
 const levels=cardLevels(s),event=s.offers?.eventId,selection={...s.offers?.content?.selection};
 const choices=eventOptions(s),option=choices.find(o=>o.id===code);
 const fields=Object.keys(option?.fields||{}).filter(key=>['recruit','recruit2','rareRecruit'].includes(key));
 const ids=[...new Set(fields.flatMap(key=>option.fields[key]))];
 const base=fields.includes('rareRecruit')||event==='contrabando'?1:0;
 const offeredLevels=Object.fromEntries(ids.map(id=>[id,G.recruitLevel(s,id,base,!(event==='santuario'&&code==='trade'&&selection.relic==='travelers_mirror'))]));
 const result=accept(s,code);
 if(result){
  if(ids.length){
   const entry=offer(s,'recruitOffer',ids,event,offeredLevels);
   const selected=fields.map(key=>selection[key]);
   entry.chosen=selected.length===1?selected[0]:selected;
   entry.chosenAt=new Date().toISOString();
  }
  choice(s,'eventChoice',{event,offered:choices,chosen:code,selection,chosenAt:new Date().toISOString()});
  changedLevels(s,levels);root.JourneyMilestones?.observe(s);P.check();
 }
 return result;
};
const fightWon=content.fightWon;
content.fightWon=function(s){const levels=cardLevels(s),result=fightWon(s);changedLevels(s,levels);offers(s);return result;};
root.JourneyTelemetry={exportSchema,validExport,choice,offer,offers,selectOffer,encounter,reinforcements,round,defeat,treeBought,upgrade,extraOut,goldClose,eventRelicOffer,relicAwarded};
})(globalThis);
