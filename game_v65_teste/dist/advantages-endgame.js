/* Endgame (teste, 22/11/2026): vantagens novas e ajustes que dependem dos desafios do endgame.
 * Carregado depois de challenges-endgame.js.
 * - Troféu de Boss: cada boss de mapa vencido dá +3% de vida e ataque às unidades do jogador até o fim da run.
 * - Vitória Limpa: vencer um confronto sem perder rodada dá +8 de ouro (bônus; não é afetado por Derrota Custa Ouro).
 * - Emboscada: na 1ª rodada de cada confronto (exceto bosses e raids), o inimigo coloca 1 unidade a menos (mínimo 1).
 * - Olho Treinado: 1 renovação grátis também em todo nó de recrutamento.
 * - Segunda Chance: também nas raids (o motor da raid não chama Progress.finish) e conta a rodada extra em Derrota Custa Ouro. */
(function(root){'use strict';
const G=root.Game,P=root.Progress,T=root.JourneyTree,A=root.JourneyActs,AD=root.JourneyAdvantages,CH=root.JourneyChallenges;
if(!AD)return;
const TUNE=Object.assign(AD.TUNE,{trophyHp:.03,trophyAtk:.03,cleanGold:8,ambushUnits:1,...(root.JOURNEY_ADVANTAGE_TUNE||{})});
const NEW=[
 {id:'boss_trophy',en:'Boss Trophy',pt:'Troféu de Boss',enDesc:'Each map boss defeated grants all your units +3% health and attack until the end of the run.',ptDesc:'Cada boss de mapa vencido dá +3% de vida e ataque a todas as suas unidades até o fim da run.'},
 {id:'clean_victory',en:'Clean Victory',pt:'Vitória Limpa',enDesc:'Winning a confrontation without losing a round grants +8 gold.',ptDesc:'Vencer um confronto sem perder rodada concede +8 de ouro.'},
 {id:'ambush',en:'Ambush',pt:'Emboscada',enDesc:'In the first round of each confrontation (except bosses), the enemy fields 1 fewer unit.',ptDesc:'Na 1ª rodada de cada confronto (exceto bosses), o inimigo coloca 1 unidade a menos.'},
];
for(const a of NEW)if(!AD.BY[a.id]){AD.LIST.push(a);AD.BY[a.id]=a;}
const has=AD.has,act=s=>A?.act(s)||1;
const isBoss=s=>s.current?.type==='boss'||!!s.bossEncounter;

/* Troféu de Boss: conta na 1ª chamada de vitória do boss de cada mapa (antes da sessão da árvore). */
const finish=P.finish;P.finish=function(s,reason){
 if(reason==='victory'&&has(s,'boss_trophy')&&s.adv&&s.current?.type==='boss'&&!s.meta?.ended){s.adv.trophies??=[];if(!s.adv.trophies.includes(act(s)))s.adv.trophies.push(act(s));}
 return finish(s,reason);};
if(T?.stats){const stats=T.stats;T.stats=function(st,c,s,enemy){st=stats(st,c,s,enemy)||st;const k=!enemy&&has(s,'boss_trophy')?(s.adv?.trophies?.length||0):0;if(k){st.hp*=1+TUNE.trophyHp*k;st.atk*=1+TUNE.trophyAtk*k;}return st;};}

/* Vitória Limpa e Segunda Chance em Derrota Custa Ouro. A marca de Derrota Custa Ouro (s.lgPending) é posta pelo
 * encounterWin de challenges-endgame; o bônus é pago sem consumi-la. */
const ew=P.encounterWin;P.encounterWin=function(s){
 const clean=(s.score?.[1]||0)===0,before=s.meta?.encounters?.length||0,r=ew(s),recorded=(s.meta?.encounters?.length||0)>before;
 if(recorded&&s.adv?.secondAt!=null&&s.adv.secondAt===s.encounters&&s.lgPending!=null)s.lgPending+=1;
 if(recorded&&clean&&has(s,'clean_victory')&&!s.eventEncounter){const L=s.lgPending;s.lgPending=null;G.rewardGold?G.rewardGold(s,TUNE.cleanGold):(s.gold+=TUNE.cleanGold);s.lgPending=L;s.adv.clean=(s.adv.clean||0)+1;}
 return r;};

/* Emboscada: o limite de unidades do inimigo usa JourneyChallenges.extraUnits (Reforços); aqui ele desconta 1 na 1ª rodada. */
if(CH?.extraUnits){const xu=CH.extraUnits;CH.extraUnits=function(s){const base=xu(s)||0;if(has(s,'ambush')&&(s.round||1)===1&&!s.raid&&!isBoss(s)&&!s.training)return base-TUNE.ambushUnits;return base;};}

/* Olho Treinado no nó de recrutamento: 1 renovação grátis por nó. */
function canRerollRecruit(s){return has(s,'trained_eye')&&!!s.adv&&s.phase==='recruit'&&Array.isArray(s.offers)&&s.offers.length>0&&!(s.adv.eyeRecruit||[]).includes(act(s)+':'+s.current?.id);}
function rerollRecruit(s){if(!canRerollRecruit(s))return false;const out=G.choices(s,s.offers.length,s.offers);if(!out.length)return false;s.offers=out;G.setRecruitLevels?.(s,out);(s.adv.eyeRecruit??=[]).push(act(s)+':'+s.current.id);return true;}

/* Segunda Chance nas raids: raid-engine marca 'defeat' sem passar por Progress.finish. */
const gf=G.finish;G.finish=function(s,result){const r=gf(s,result);if(s.raid&&s.phase==='defeat'&&AD.TUNE.secondMode==='extra')AD.secondChance(s);return r;};

root.JourneyAdvantagesEndgame={NEW,canRerollRecruit,rerollRecruit};
Object.assign(AD,{canRerollRecruit,rerollRecruit});
})(typeof globalThis!=='undefined'?globalThis:this);
