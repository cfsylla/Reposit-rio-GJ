/* Permanent profile unlocks. XP is earned in the run and banked into the profile level at each boss tree session
 * (unbanked XP is lost on defeat). GJ-v54-BAL post-CP1 level model: profile level = banked XP / 10 (max 30);
 * each level grants 10 tree points; nodes cost points; free reset outside a run. */
(function(root){'use strict';
const G=root.Game,P=root.Progress,A=root.JourneyActs,D=root.JourneyTreeData;
/* GJ-v54-BAL post-CP1: tree special/milestone effects (values tuned in the tree lab). */
const TUNE=root.JOURNEY_TREE_TUNE={firstImpact:.35,impactStun:.3,execution:.20,executionCharge:.20,penetration:.10,penetrationCrit:.25,devastating:.45,exposed:.12,secondWind:.04,urgentHeal:.06,formationFront:.10,formationBack:.05,openingShield:.12,lastLine:.08,vengeance:.15,sprint:.25,momentum:.20,readiness:.25,rhythm:.20,rhythmEvery:3,...(root.JOURNEY_TREE_TUNE||{})};
const LEVEL=root.JOURNEY_TREE_LEVEL={xpPerLevel:10,pointsPerLevel:10,maxLevel:30,xpFight:[2,2,1],xpBoss:[4,4,6],xpPerDiamond:20,...(root.JOURNEY_TREE_LEVEL||{})};
function xpFor(act,boss){return (boss?LEVEL.xpBoss:LEVEL.xpFight)[Math.max(0,Math.min(2,act-1))];}
function costOf(ids){return ids.reduce((t,id)=>t+(D.by[id]?.cost||0),0);}
function profile(){const p=P.profile;if(!p.skillTree||p.skillTree.version!==1)p.skillTree={version:1,unlocked:[],purchases:[]};const st=p.skillTree;st.unlocked=[...new Set((st.unlocked||[]).filter(id=>D.by[id]&&id!=='origin'))];st.purchases??=[];
 // Old saves (only Carlos's playtests; approved to ignore): banked XP starts at the XP already spent on owned nodes.
 if(!Number.isFinite(st.totalXp)){st.totalXp=costOf(st.unlocked);st.overflowPaid=Math.floor(Math.max(0,st.totalXp-LEVEL.maxLevel*LEVEL.xpPerLevel)/LEVEL.xpPerDiamond);}
 return st;}
function level(){return Math.min(LEVEL.maxLevel,Math.floor(profile().totalXp/LEVEL.xpPerLevel));}
function points(){return level()*LEVEL.pointsPerLevel;}
function spent(){return costOf(profile().unlocked);}
function available(){return points()-spent();}
function overflowXp(){return Math.max(0,profile().totalXp-LEVEL.maxLevel*LEVEL.xpPerLevel);}
function nextLevelXp(){const st=profile();return level()>=LEVEL.maxLevel?0:(level()+1)*LEVEL.xpPerLevel-st.totalXp;}
/* XP above the level cap becomes diamonds: 1 diamond per 20 overflow XP (approved). */
function payOverflow(){const st=profile(),due=Math.floor(overflowXp()/LEVEL.xpPerDiamond),paid=st.overflowPaid||0;if(due>paid){P.profile.diamonds=(P.profile.diamonds||0)+due-paid;st.overflowPaid=due;}}
function bank(s){const t=ensure(s);if(!t||!t.xp)return 0;const x=t.xp;profile().totalXp+=x;t.xp=0;t.banked=(t.banked||0)+x;payOverflow();return x;}
function eligible(s){return !!s&&!s.training&&!s.tutorialReplay;}
function ensure(s){if(!eligible(s))return null;const j=A.ensure(s);if(!j)return null;if(!j.tree){j.tree={version:1,xp:0,earned:[],closed:[],shops:{},firstRecruit:[],firstCard:[],provisionMaps:[],session:null,goldCarry:0};if(!s.meta?.ended)for(const e of s.meta?.encounters||[]){if(e.event)continue;const node=e.key.slice(0,e.key.lastIndexOf(':')),act=node.startsWith('a3_')?3:node.startsWith('a2_')?2:1,key=act+':'+node;if(j.tree.earned.includes(key))continue;j.tree.earned.push(key);j.tree.xp+=xpFor(act,e.type==='boss');}}
 const t=j.tree;t.xp=Math.max(0,Number.isFinite(t.xp)?Math.floor(t.xp):0);t.earned??=[];t.closed??=[];t.shops??={};t.firstRecruit??=[];t.firstCard??=[];t.provisionMaps??=[];return t;}
function activeNodes(s){const u=profile().unlocked;return root.JourneyChallenges?.treeNodes(s,u)||u;}
function has(s,id){return eligible(s)&&activeNodes(s).includes(id);}
function bonuses(s){const out={};if(!eligible(s))return out;for(const id of activeNodes(s))for(const [key,v]of Object.entries(D.by[id].effect))out[key]=typeof v==='number'?(out[key]||0)+v:true;return out;}
function connected(id){const n=D.by[id];return !!n&&n.id!=='origin'&&n.links.some(id=>id==='origin'||profile().unlocked.includes(id));}
function buying(s){const t=ensure(s);return !!(t?.session&&s.phase==='tree'&&!s.meta?.ended&&t.session.act===A.act(s));}
function editable(s){return s?buying(s):true;}
function buy(s,id){const n=D.by[id],p=profile();if(!editable(s)||!n||n.id==='origin'||p.unlocked.includes(id)||!connected(id)||available()<n.cost)return false;p.unlocked.push(id);p.purchases.push({id,cost:n.cost,run:s?.seed??null,act:s?A.act(s):null});if(id==='expanded_bag'&&s)G.ensureBag(s);return true;}
/* Free reset, only outside a run (the menu calls it with no active run). Refunds every point. */
function reset(s){if(s)return false;const p=profile(),refund=spent();if(!refund)return false;p.purchases.push({reset:true,refund});p.unlocked=[];return true;}
function grantEntry(s){const t=ensure(s),a=A.act(s);if(!t||!has(s,'provisions')||t.provisionMaps.includes(a)||s.meta?.ended)return;t.provisionMaps.push(a);s.gold+=5;s.lastGoldReward=5;}
function award(s){const t=ensure(s);if(!t||s.meta?.ended||s.eventEncounter||!G.isFight(s.current))return 0;const a=A.act(s),key=a+':'+s.current.id;if(t.earned.includes(key))return 0;const xp=xpFor(a,s.current.type==='boss');t.earned.push(key);t.xp+=xp;t.lastAward=xp;return xp;}
const load=P.load;P.load=function(...args){const p=load(...args);profile();return p;};profile();
const fresh=G.fresh;G.fresh=function(...args){const s=fresh(...args);ensure(s);grantEntry(s);return s;};
const encounter=P.encounterWin;P.encounterWin=function(s){const t=ensure(s),before=s.meta?.encounters?.length||0,r=encounter(s);if((s.meta?.encounters?.length||0)>before)award(s);return r;};
const finish=P.finish;P.finish=function(s,reason){const t=ensure(s);if(t&&reason==='victory'&&!s.meta?.ended&&s.current?.type==='boss'&&!t.closed.includes(A.act(s))){A.recordBoss(s);t.session??={act:A.act(s),boss:s.current.id};bank(s);s.phase='tree';return false;}if(t&&reason!=='victory'){t.xp=0;t.session=null;t.goldCarry=0;}return finish(s,reason);};
const abandon=P.abandon;P.abandon=function(s){const result=abandon(s);if(result){const t=ensure(s);if(t){t.xp=0;t.session=null;t.goldCarry=0;}}return result;};
function continueRun(s){if(!buying(s))return false;const t=ensure(s),act=A.act(s);t.closed.push(act);t.session=null;if(act===3){t.xp=0;s.phase='victory';}finish(s,'victory');if(act<3){if(s.phase!=='actComplete')return false;return A.advance(s);}return s.phase==='victory';}
function resume(s){const t=ensure(s);if(t&&s.phase==='actComplete'&&!t.closed.includes(A.act(s))){t.session={act:A.act(s),boss:s.current.id};bank(s);s.phase='tree';}return t;}
const advance=A.advance;A.advance=function(s){if(buying(s))return false;const ok=advance(s);if(ok)grantEntry(s);return ok;};
function stats(st,c,s,enemy){if(enemy||!eligible(s))return st;const v=bonuses(s);for(const k of ['hp','atk','defense','speed'])st[k]*=1+(v[k]||0);st.rate/=1+(v.haste||0);st.crit=Math.min(.75,st.crit+(v.crit||0));if(v.critDamage)st.treeCritDamage=v.critDamage;return st;}
const create=G.createBattle;G.createBattle=function(s){const b=create(s);if(!b||!eligible(s)||!profile().unlocked.length)return b;const v=bonuses(s);b.tree={bonuses:v,fallen:false,queue:[]};for(const u of b.units.filter(u=>u.side===0)){u.treeSkillAt=-1;if(v.readiness&&G.BY[u.type].kind==='active'&&!G.BY[u.type].trigger.startFull)u.progress=Math.min(u.charge,(u.progress||0)+u.charge*TUNE.readiness);}if(v.strong_shields){const mine=b.units.filter(u=>u.side===0&&u.hp>0);const tank=mine.reduce((best,u)=>!best||u.maxhp>best.maxhp?u:best,null);if(tank){tank.shield=Math.max(tank.shield||0,tank.maxhp*TUNE.openingShield*1.1);tank.shieldTime=Math.max(tank.shieldTime||0,6);}}return b;};
function hit(b,a,t,n,skill,options){const v=b.tree?.bonuses;if(!v)return n;if(a.side===0){
 if(v.first_impact&&!skill&&!options.dot&&a.hits===1){n*=1+TUNE.firstImpact;if(!a.treeImpactStun){a.treeImpactStun=true;b.tree.queue.push({target:t,status:{stun:TUNE.impactStun}});}}
 if(v.execution&&t.hp/t.maxhp<.3)n*=1+TUNE.execution;
 if(v.devastating&&(t.treeExposedUntil||0)>b.time)n*=1+TUNE.exposed;
 if(v.devastating&&skill&&!options.dot&&(a.skillCasts||0)>0){if(!a.treeFirstOffensiveCast)a.treeFirstOffensiveCast=a.skillCasts;if(a.skillCasts===a.treeFirstOffensiveCast){n*=1+TUNE.devastating;t.treeExposedUntil=b.time+3;}}
 if(v.last_line&&(a.treeVengeUntil||0)>b.time)n*=1+TUNE.vengeance;}
 if(t.side===0&&v.formation&&b.time<6)n*=1-(G.BY[t.type].range>100?TUNE.formationBack:TUNE.formationFront);return n;}
function ignore(b,a,skill,current,crit){return b.tree?.bonuses.penetration&&a.side===0&&!skill?1-(1-current)*(1-(crit?TUNE.penetrationCrit:TUNE.penetration)):current;}
function haste(b,u){const v=b.tree?.bonuses;if(!v||u.side)return 1;return 1+(v.sprint&&u.hits<3?TUNE.sprint:0)+(v.momentum?Math.min(3,u.treeKills||0)*TUNE.momentum:0)+(v.rhythm?Math.min(2,(b.tree.rhythm||[]).filter(x=>x>b.time).length)*TUNE.rhythm:0);}
function skill(b,u,pending){const v=b.tree?.bonuses;if(!v||u.side)return;u.treeSkillAt=b.time;
 if(!u.treeFirstSkill){u.treeFirstSkill=true;if(v.second_wind){pending.push({target:u,heal:u.maxhp*TUNE.secondWind});const hurt=b.units.filter(x=>x.side===0&&x.hp>0&&x!==u).sort((x,y)=>x.hp/x.maxhp-y.hp/y.maxhp)[0];if(hurt)pending.push({target:hurt,heal:hurt.maxhp*TUNE.secondWind});}}
 if(v.rhythm){b.tree.casts=(b.tree.casts||0)+1;if(b.tree.casts%TUNE.rhythmEvery===0){b.tree.rhythm=(b.tree.rhythm||[]).filter(x=>x>b.time).slice(-1);b.tree.rhythm.push(b.time+4);}}}
function moved(b,u,forced){}
function shield(b,u,n){return n*(u.side===0&&b.tree?.bonuses.strong_shields?1.1:1);}
function giveShield(b,u,n){u.shield=Math.max(u.shield||0,shield(b,u,n));u.shieldTime=Math.max(u.shieldTime||0,6);b.effects.push({kind:'heal',x:u.x,y:u.y,color:'#b2dfea',life:.6,full:.6});}
function healing(b,u){const v=b.tree?.bonuses;if(!v||u.side)return 1;return 1+(v.heal||0);}
function beforeSettle(b,living,pending){const v=b.tree?.bonuses;if(!v)return;
 if(b.tree.queue.length){for(const q of b.tree.queue)if(q.target.hp>0)pending.push(q);b.tree.queue=[];}
 if(v.execution||v.momentum){for(const p of pending)if(p.damage&&p.source&&p.target.side===1)p.target.treeLastHit=p.source;}
 const dt=Math.max(0,b.time-(b.tree.lastTime??b.time));b.tree.lastTime=b.time;
 if(v.urgent_heal&&dt>0)for(const u of living)if(u.side===0&&(u.treeRegenUntil||0)>b.time)pending.push({target:u,heal:u.maxhp*TUNE.urgentHeal/3*dt,passiveRegen:true});for(const p of pending)if(p.target.side===0&&p.status&&v.control){p.status={...p.status};for(const k of ['stun','root','slow','taunt'])if(p.status[k])p.status[k]*=1-v.control;}}
function threshold(b,u,old){const tv=b.tree?.bonuses;if(!u.side&&tv?.urgent_heal&&!u.treeUrgentUsed&&u.hp>0&&old/u.maxhp>=.4&&u.hp/u.maxhp<.4){u.treeUrgentUsed=true;u.treeRegenUntil=b.time+3;}if(u.side||!b.tree?.bonuses.survival||u.treeSurvivalUsed||u.hp<=0||u.hp/u.maxhp>=.25)return;u.treeSurvivalUsed=true;giveShield(b,u,u.maxhp*.08);}
function afterSettle(b){const v=b.tree?.bonuses;if(!v)return;
 if(v.execution||v.momentum)for(const e of b.units)if(e.side===1&&e.hp<=0&&!e.treeCounted){e.treeCounted=true;const k=e.treeLastHit;if(k&&k.side===0&&k.hp>0){if(v.momentum)k.treeKills=(k.treeKills||0)+1;if(v.execution&&k.charge&&G.BY[k.type].kind==='active')k.progress=Math.min(k.charge,(k.progress||0)+k.charge*TUNE.executionCharge);}}
 if(!v.last_line||b.tree.fallen||!b.units.some(u=>!u.side&&u.hp<=0))return;b.tree.fallen=true;for(const u of b.units.filter(u=>!u.side&&u.hp>0)){giveShield(b,u,u.maxhp*TUNE.lastLine);u.treeVengeUntil=b.time+5;}}
function price(s,kind,base,merchant){const v=bonuses(s),shop=s.current?.type==='shop',t=shop?ensure(s):null,state=shopState(s);let discount=merchant+(v.discount||0);if(shop&&kind==='upgrade'&&v.training_deal&&!state.upgradeUsed)discount+=.1;let amount=Math.max(1,Math.ceil(base*(1-discount)-1e-9));if(shop&&kind==='cards'&&v.planned_purchase&&!t.firstCard.includes(A.act(s)))amount=Math.max(1,amount-2);return amount;}
function gold(s,base){const v=bonuses(s);if(!v.gold)return Math.round(base);const t=ensure(s),raw=base*(1+v.gold)+(t.goldCarry||0),amount=Math.floor(raw+1e-9);t.goldCarry=raw-amount;return amount;}
function shopState(s){const t=ensure(s);if(!t||s.current?.type!=='shop')return {};return t.shops[s.current.id]??={freeUsed:false,upgradeUsed:false};}
function refreshShop(s){if(s?.phase!=='shop'||!has(s,'market')||shopState(s).freeUsed)return false;s.offers.cards=G.choices(s);shopState(s).freeUsed=true;return true;}
const service=G.shopService;G.shopService=function(s,kind,id){const ok=service(s,kind,id);if(ok&&kind==='upgrade')shopState(s).upgradeUsed=true;return ok;};
const purchase=G.buy;G.buy=function(s,kind,index){const ok=purchase(s,kind,index);if(ok&&kind==='cards'){const t=ensure(s);if(t&&!t.firstCard.includes(A.act(s)))t.firstCard.push(A.act(s));}return ok;};
function recruitState(s){const t=ensure(s);if(!t||s.current?.type!=='recruit')return null;if(t.recruit?.id===s.current.id)return t.recruit;const a=A.act(s),bonus=has(s,'caravan')&&!t.firstRecruit.includes(a);if(bonus)t.firstRecruit.push(a);return t.recruit={id:s.current.id,remaining:bonus?2:1,chosen:[],bonus};}
const enter=G.enter;G.enter=function(s,id){const ok=enter(s,id);if(ok&&s.phase==='recruit')recruitState(s);return ok;};
const recruit=G.recruit;G.recruit=function(s,id){if(!has(s,'caravan'))return recruit(s,id);const state=recruitState(s);if(s.phase!=='recruit'||!state||!s.offers.includes(id)||state.chosen.includes(id)||G.copies(s,id)>=G.MAX_COPIES)return false;G.newCard(s,id);state.chosen.push(id);state.remaining--;s.offers=s.offers.filter(type=>type!==id&&G.copies(s,type)<G.MAX_COPIES);if(state.remaining<=0||!s.offers.length)G.leave(s);return true;};
function offerExclusions(s){const t=ensure(s);return s.current?.type==='recruit'&&t?.recruit?.id===s.current.id?t.recruit.chosen:[];}
function offerCount(s,n){return n+(s.current?.type==='recruit'&&has(s,'candidates')?1:0);}
function relicCount(s,n){return n+(has(s,'explorer')?1:0);}
root.JourneyTree={D,LEVEL,xpFor,level,points,spent,available,overflowXp,payOverflow,nextLevelXp,bank,editable,reset,profile,eligible,ensure,has,bonuses,connected,buying,buy,award,continueRun,resume,grantEntry,stats,hit,ignore,haste,skill,moved,shield,healing,beforeSettle,threshold,afterSettle,price,gold,shopState,refreshShop,recruitState,offerExclusions,offerCount,relicCount};
})(typeof globalThis!=='undefined'?globalThis:this);
