/* Collectible first forms. Provisional player balance, intentionally independent from enemy stats. */
(function(root){'use strict';
const G=root.Game,P=root.Progress,B=root.JourneyBosses,T=root.JourneyTraits,CA=root.CharacterAssets;
const modes={goblin:'volley',troll:'slam',orc:'cleave',meowri:'volley',centaur:'cleave',highelf:'light',forestelf:'roots',darkelf:'cleave',fairy:'heal'};
const text={"guard": ["Strike for 160% ATK and shield the two weakest allies for 10% of their maximum HP for 4s.", "Golpeia por 160% ATQ e protege os dois aliados mais feridos com escudo de 10% PV máximo por 4s."], "cleave": ["Strike the target for 180% ATK and nearby enemies within 70 for 90% ATK.", "Golpeia o alvo por 180% ATQ e inimigos a até 70 dele por 90% ATQ."], "slam": ["Strike enemies within 70 of the target for 140% ATK and stun them for 0.6s.", "Atinge inimigos a até 70 do alvo por 140% ATQ e atordoa por 0,6s."], "volley": ["Fire three shots at the target, each dealing 65% ATK.", "Dispara três tiros no alvo, cada um causando 65% ATQ."], "light": ["Strike for 160% ATK and heal the weakest ally for 8% of their maximum HP.", "Golpeia por 160% ATQ e cura o aliado mais ferido em 8% PV máximo."], "roots": ["Strike enemies within 70 of the target for 100% ATK and root them for 1.2s.", "Atinge inimigos a até 70 do alvo por 100% ATQ e enraíza por 1,2s."], "heal": ["Heal and shield the two weakest allies for 10% of their maximum HP; shields last 4s.", "Cura e protege os dois aliados mais feridos em 10% PV máximo; escudos duram 4s."]};
const cards={};
for(const [boss,d]of Object.entries(B.D)){
 if(d.order==='monsters')continue;
 const id='hero_'+boss,base=G.BY[d.base],mode=d.mode||modes[boss],a={...T.assignments[d.base]};
 if(boss==='ib_hartlord'){a.faction='Verdant Covenant';a.attribute='Trailblazer';a.temperament='Protector';}
 const u={...base,id,bossCard:boss,enemyOnly:false,order:d.order,faction:boss==='ib_hartlord'?'verdant':base.faction,name:d.en,namePT:d.pt,hp:mode==='slam'||mode==='guard'?280:mode==='heal'||mode==='light'?190:230,atk:mode==='volley'?25:mode==='heal'?18:30,defense:mode==='guard'?22:mode==='slam'?17:10,rate:1.2,range:d.range,speed:base.speed||45,cost:d.true?4:3,rarity:3,kind:'active',trigger:{kind:'time',limit:10},ability:d.skillEn,abilityPT:d.skillPt,detail:text[mode][0],detailPT:text[mode][1],traits:[a.faction,a.attribute,a.temperament]};
 G.UNITS.push(u);G.BY[id]=u;T.assignments[id]=a;cards[id]={boss,mode};CA[id]={...CA['boss_'+boss]};
 P.FACTIONS[u.faction]?.ids.push(id);
}
function effect(b,u,target,targets,allies,pending,boss){const mode=B.D[boss].mode||modes[boss],power=u.atk*(u.skill||1),near=targets.filter(t=>Math.hypot(t.x-target.x,t.y-target.y)<=70),weak=allies.slice().sort((a,c)=>a.hp/a.maxhp-c.hp/c.maxhp);const hit=(t,k,status)=>{G.hit(b,u,t,power*k,pending,true);if(status)pending.push({target:t,status});};const shield=t=>T.shield(b,t,t.maxhp*.1*(u.skill||1),4);
 switch(mode){case'guard':hit(target,1.6);weak.slice(0,2).forEach(shield);break;case'cleave':near.forEach(t=>hit(t,t===target?1.8:.9));break;case'slam':near.forEach(t=>hit(t,1.4,{stun:.6}));break;case'volley':for(let i=0;i<3;i++)hit(target,.65);break;case'light':hit(target,1.6);if(weak[0])pending.push({target:weak[0],heal:weak[0].maxhp*.08*(u.skill||1)});break;case'roots':near.forEach(t=>hit(t,1,{root:1.2}));break;case'heal':weak.slice(0,2).forEach(t=>{pending.push({target:t,heal:t.maxhp*.1*(u.skill||1)});shield(t);});break;}
}
function activate(b,u,target,targets,living,pending){const c=cards[u.type];if(!c)return;effect(b,u,target,targets,living.filter(t=>t.side===u.side),pending,c.boss);}
const fresh=G.fresh;G.fresh=function(...args){const s=fresh(...args);s.bossCardsAvailable=Object.keys(cards).filter(id=>P.visibleCard(id)&&(P.profile.catalogCards.includes(id)||P.profile.cards[id]>0));return s;};
root.JourneyBossCards={cards,effect,activate};
})(globalThis);
