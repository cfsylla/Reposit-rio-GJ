/* R3 relíquias (Carlos 08/11/2026): 15 relíquias novas e os efeitos novos das relíquias existentes que não cabem em game-0.
 * Proposta: balance/rodada3/reliquias/PROPOSTA_RELIQUIAS_R3.md. Valores em root.JOURNEY_RELIC_TUNE (o simulador pode sobrescrever).
 * As 15 novas são só do jogador (playerOnly): o conjunto de relíquias dos inimigos não muda. */
(function(root){'use strict';
const G=root.Game,T=root.JourneyTraits,C=root.JourneyContent,Tree=root.JourneyTree;
const RT=root.JOURNEY_RELIC_TUNE=root.JOURNEY_RELIC_TUNE||{};
const DEF={slingDamage:1.5,slingStun:.5,contractElite:8,contractBoss:15,grimoireXp:.30,grimoireGold:.15,tomeCharge:.30,sentinelTaunt:3,sentinelRange:120,precisionCharge:.10,executionCharge:.15,echoRefund:.60,chainCharge:.20,compass:1,devastatorBonus:.60,devastatorStun:.5,warcryHeal:.04,ironrootAt:.50,ironrootShield:.10,patienceT:3,aegisRange:140,loneReduction:.15,amplifier:1.4,hordeCharge:.15,hordeMax:3,dawnShield:.06,platingShield:.08};
for(const [k,v] of Object.entries(DEF))if(RT[k]===undefined)RT[k]=v;
// id, nome EN, nome PT, raridade, formato, ícone, texto EN, texto PT, categoria
const NEW=[
 ['sling','Siege Sling','Funda de cerco',3,'cross','➶','At the start of each round, your units in the back-row corners are hurled onto the enemy back line, dealing 150% attack to the nearest enemy and stunning it for 0.5s.','No início de cada rodada, suas unidades nos cantos da última linha são arremessadas sobre a linha de fundo inimiga, causando 150% do ataque ao inimigo mais próximo e atordoando-o por 0,5 s.','offense'],
 ['contract','Mercenary Contract','Contrato do mercenário',1,'line4','✒','Gain +8 gold for each elite, order or Titan encounter won, and +15 for each boss.','Ganhe +8 de ouro a cada confronto vencido contra elite, ordem ou Titã, e +15 contra boss.','economy'],
 ['grimoire','Apprentice’s Grimoire','Grimório do aprendiz',2,'U','✎','Gain 30% more tree XP during the run, but 15% less gold from rewards.','Ganhe 30% mais XP da árvore durante a run, mas 15% menos ouro em recompensas.','economy'],
 ['echo','Arcane Echo','Eco arcano',3,'cross','✺','The first skill each ally uses in each round refunds 60% of its charge.','A primeira habilidade que cada aliado usa em cada rodada devolve 60% da carga.','rhythm'],
 ['chain','Chain of Command','Corrente de comando',2,'line3','⛓','When an ally uses its skill, the nearest other ally with an active skill gains 20% charge.','Quando um aliado usa a habilidade, o aliado mais próximo com habilidade ativa ganha 20% de carga.','rhythm'],
 ['compass','Raider’s Compass','Bússola do saqueador',0,'dot','✧','Card choices offer 1 more option.','Escolhas de carta oferecem 1 opção a mais.','deck'],
 ['houses','Crest of Houses','Brasão das casas',2,'T','⚜','Faction traits activate with one fewer member.','Traits de facção ativam com 1 membro a menos.','synergy'],
 ['honor','Code of Honor','Código de honra',1,'L3','☯','Temperament traits count one extra member.','Temperamentos contam 1 membro a mais para o patamar.','synergy'],
 ['talents','Forge of Talents','Forja dos talentos',1,'L3','⚒','Attribute traits count one extra member.','Atributos contam 1 membro a mais para o patamar.','synergy'],
 ['devastator','Devastator’s Hammer','Martelo do devastador',1,'L3','✸','The first basic attack of each Devastator in each round deals +60% damage and stuns for 0.5s.','O primeiro ataque básico de cada Devastador em cada rodada causa +60% de dano e atordoa por 0,5 s.','synergy'],
 ['warcry','War Cry','Grito de guerra',1,'domino','❢','Critical hits from Fearless allies heal them for 4% of their maximum health.','Críticos de aliados Destemidos curam 4% da vida máxima deles.','synergy'],
 ['ironroot','Iron Root','Raiz de ferro',1,'L3','♣','Unyielding allies ignore stuns. Once per round, an Unyielding ally dropping below 50% health gains a 10% shield.','Aliados Inabaláveis ignoram atordoamentos. Uma vez por rodada, um Inabalável que cai abaixo de 50% de vida ganha escudo de 10%.','synergy'],
 ['patience','Hourglass of Patience','Ampulheta da paciência',0,'domino','⧗','Patient allies start each round with 1 stack.','Aliados Pacientes começam cada rodada com 1 acúmulo.','synergy'],
 ['aegis','Guardian’s Aegis','Égide do guardião',2,'square','⛨','The Protector aura reaches 140 instead of 90.','A aura do Protetor alcança 140 em vez de 90.','synergy'],
 ['lone','Lonely Banner','Bandeira solitária',0,'domino','⚐','Isolated Audacious allies (no ally within 90) take 15% less damage.','Aliados Audaciosos isolados (sem aliado a até 90) recebem 15% menos dano.','synergy'],
 ['amplifier','Amplifying Amulet','Amuleto amplificador',1,'domino','◉','Your supports’ auras have +40% radius.','Auras dos seus suportes têm +40% de raio.','synergy'],
 ['horde','Horde Totem','Totem da horda',2,'T','♜','When a Blackfang ally falls, the other Blackfang allies gain 15% skill charge (up to 3 times per round).','Quando um aliado Blackfang cai, os outros Blackfang ganham 15% de carga da habilidade (até 3 vezes por rodada).','synergy'],
 ['dawn','Dawn’s Blessing','Bênção da aurora',2,'square','☀','Dawncrest allies start each round with a shield of 6% of their maximum health; defeating an enemy renews it (once per round).','Aliados Dawncrest começam cada rodada com escudo de 6% da vida máxima; derrotar um inimigo renova o escudo (1 vez por rodada).','synergy']
];
const PRICE=[30,35,40,40];
for(const [id,name,namePT,rarity,shape,icon,desc,descPT,category] of NEW){if(G.ARTIFACTS.some(a=>a.id===id))continue;G.ARTIFACTS.push({id,name,namePT,icon,desc,descPT,rarity,price:PRICE[rarity],shape,playerOnly:true,category});G.RELIC_FORMATS[id]=shape;}
// Textos finais das 25 existentes (nome e texto em EN e PT; Carlos 08/11: padronizar por idioma)
const P0=x=>Math.round(x*100)+'%',P1=x=>(Math.round(x*1000)/10)+'%',N=(x,pt)=>{const v=String(Math.round(x*100)/100);return pt?v.replace('.',','):v;};
const TEXT={
 banner:['Ancient Banner','Estandarte antigo',`All allies gain +${P0(RT.banner)} attack.`,`Todos os aliados têm +${P0(RT.banner)} de ataque.`],
 heart:['Vital Stone','Pedra vital',`All allies gain +${P0(RT.heart)} health.`,`Todos os aliados têm +${P0(RT.heart)} de vida.`],
 scope:['Marksman’s Scope','Luneta do atirador',`Ranged allies gain +${P0(RT.scope)} attack. The first basic attack of each one in each round is a critical hit.`,`Aliados com ataque à distância ganham +${P0(RT.scope)} de ataque. O primeiro ataque básico de cada um em cada rodada é crítico.`],
 tome:['Tome of Stars','Tomo das estrelas',`Spellcasters gain +${P0(RT.tome)} skill power and start each round with ${P0(RT.tomeCharge)} charge.`,`Conjuradores ganham +${P0(RT.tome)} de poder de habilidade e começam cada rodada com ${P0(RT.tomeCharge)} da carga.`],
 boots:['Wind Boots','Botas do vento',`Trailblazers gain +20% movement and +${P0(RT.bootsRate)} attack speed. The first basic attack of each Trailblazer in each round stuns for 0.5s.`,`Desbravadores ganham +20% de movimento e +${P0(RT.bootsRate)} de velocidade de ataque. O primeiro ataque básico de cada Desbravador em cada rodada atordoa por 0,5 s.`],
 shield:['Warding Seal','Selo de proteção',`Sentinels take ${P0(RT.shieldArmor)} less damage and draw the attacks of nearby enemies during the first ${N(RT.sentinelTaunt)}s of each round.`,`Sentinelas recebem ${P0(RT.shieldArmor)} menos dano e atraem os ataques dos inimigos próximos nos ${N(RT.sentinelTaunt,1)} primeiros segundos de cada rodada.`],
 precision:['Precision Medallion','Medalhão da precisão',`All allies gain +${N(RT.precisionCrit*100)} percentage points of critical chance. Each critical hit charges ${P0(RT.precisionCharge)} of the attacker skill.`,`Todos os aliados ganham +${N(RT.precisionCrit*100,1)} pontos percentuais de chance de crítico. Cada crítico carrega ${P0(RT.precisionCharge)} da habilidade de quem acertou.`],
 hourglass:['Combat Hourglass','Ampulheta de combate',`All allies with an active skill start each round with ${P0(RT.hourglass)} charge.`,`Todos os aliados com habilidade ativa começam cada rodada com ${P0(RT.hourglass)} da carga.`],
 recovery:['Recovery Brooch','Broche da recuperação',`All living allies recover ${P1(RT.recovery)} of their maximum health every 3 seconds; below ${P0(RT.recoveryLow)} health, they recover twice as much.`,`Todos os aliados vivos recuperam ${P1(RT.recovery).replace('.',',')} da vida máxima a cada 3 segundos; abaixo de ${P0(RT.recoveryLow)} de vida, recuperam o dobro.`],
 merchant:['Merchant’s Coin','Moeda do mercador',`Cards and relics in shops cost ${P0(RT.merchant)} less, and the first reroll in each shop is free.`,`Cartas e relíquias na loja custam ${P0(RT.merchant)} menos, e a primeira renovação de cada loja é grátis.`],
 quickstart:['Quick Start','Arranque rápido',`Gain ${RT.quickstart} extra energy in the first preparation of each encounter.`,`Receba ${RT.quickstart} de energia extra na primeira preparação de cada confronto.`],
 spark:['Everlasting Spark','Centelha eterna','Gain 1 extra energy in every preparation, including the first.','Receba 1 de energia extra em toda preparação, incluindo a primeira.'],
 luckycharm:['Lucky Charm','Amuleto da sorte',`Gain ${P0(RT.lucky)} more run gold from rewards. Does not affect diamonds or refunds.`,`Receba ${P0(RT.lucky)} mais ouro da run em recompensas. Não afeta diamantes nem reembolsos.`],
 plating:['Reinforced Plating','Placas reforçadas',`At the start of each round, all allies gain a shield of ${P0(RT.platingShield)} of their maximum health.`,`No início de cada rodada, todos os aliados ganham escudo de ${P0(RT.platingShield)} da vida máxima.`],
 laststand:['Last Stand','Última resistência',`Once per round, the first ally taking lethal damage survives with ${P0(RT.laststandHp)} health and is invulnerable for ${N(RT.laststandInvuln)}s.`,`Uma vez por rodada, o primeiro aliado a receber dano letal fica com ${P0(RT.laststandHp)} da vida e invulnerável por ${N(RT.laststandInvuln,1)} s.`],
 repulsion:['Repulsion Seal','Selo de repulsão',`Once per round, the first ally dropping below ${P0(RT.repulsionAt)} health pushes nearby enemies away, stuns them for ${N(RT.repulsionStun)}s and gains a ${P0(RT.repulsionShield)} shield.`,`Uma vez por rodada, o primeiro aliado a cair abaixo de ${P0(RT.repulsionAt)} de vida empurra e atordoa por ${N(RT.repulsionStun,1)} s os inimigos próximos e ganha escudo de ${P0(RT.repulsionShield)}.`],
 fang:['Vampiric Fang','Presa vampírica',`Basic attacks heal their attacker for ${P0(RT.fang)} of the health damage dealt (${P0(RT.fang*RT.fangBoss)} against bosses).`,`Ataques básicos curam o atacante em ${P0(RT.fang)} do dano causado à vida (${P0(RT.fang*RT.fangBoss)} contra bosses).`],
 execution:['Executioner’s Mark','Marca do executor',`Deal ${P0(RT.execution)} more damage to enemies below 30% health. Defeating an enemy charges ${P0(RT.executionCharge)} of the attacker skill.`,`Cause ${P0(RT.execution)} mais dano a inimigos abaixo de 30% de vida. Derrotar um inimigo carrega ${P0(RT.executionCharge)} da habilidade de quem derrotou.`],
 ember:['Vengeful Ember','Brasa vingativa',`Each fallen ally grants the survivors ${P0(RT.emberAtk)} more attack damage and a ${P0(RT.emberShield)} shield this round, up to 3 times.`,`Cada aliado derrotado concede aos sobreviventes ${P0(RT.emberAtk)} mais dano de ataque e escudo de ${P0(RT.emberShield)} nesta rodada, até 3 vezes.`],
 bell:['Opening Bell','Sino de abertura',`All allies attack ${P0(RT.bell)} faster during the first ${N(RT.bellTime)} seconds of each round.`,`Todos os aliados atacam ${P0(RT.bell)} mais rápido nos primeiros ${N(RT.bellTime,1)} segundos de cada rodada.`],
 captain_standard:['Captain’s Standard','Estandarte do capitão','Choose a physical unit card to guarantee in the first hand of each encounter. Deployment still costs energy.','Escolha uma carta de unidade física para garantir na primeira mão de cada confronto. Posicionar continua custando energia.'],
 profane_idol:['Profane Idol','Ídolo profano',`When equipped, adds 1 Exhaustion to your run deck (once). All allies gain +${P0(RT.idol??.06)} attack per curse in your run deck, up to +${P0(RT.idolCap??.30)}.`,`Ao equipar, adiciona 1 Exaustão ao deck da run (uma vez). Aliados recebem +${P0(RT.idol??.06)} de ataque por maldição no deck da run, até +${P0(RT.idolCap??.30)}.`],
 colossal_heart:['Colossal Heart','Coração colossal',`All allies gain +${P0(RT.colossal)} health. The first hand of each encounter has 3 cards instead of 4.`,`Aliados recebem +${P0(RT.colossal)} de vida. A primeira mão de cada confronto tem 3 cartas em vez de 4.`],
 dormant_sword:['Dormant Sword','Espada adormecida',`All allies gain +${P0(RT.swordBase??.02)} attack, plus ${P0(RT.swordStep??.02)} for each elite encounter won with this relic equipped, up to +${P0(RT.swordCap??.10)}. Bosses do not count.`,`Aliados recebem +${P0(RT.swordBase??.02)} de ataque, e mais ${P0(RT.swordStep??.02)} a cada confronto de elite vencido com ela equipada, até +${P0(RT.swordCap??.10)}. Bosses não contam.`],
 travelers_mirror:['Travelers’ Mirror','Espelho dos viajantes','Recruited cards come with +1 upgrade (up to level 2). Shop purchases and duplication do not trigger this.','Cartas recrutadas vêm com +1 upgrade (até o nível 2). Compras na loja e duplicações não ativam.'],
 echo:['Arcane Echo','Eco arcano',`The first skill each ally uses in each round refunds ${P0(RT.echoRefund)} of its charge.`,`A primeira habilidade que cada aliado usa em cada rodada devolve ${P0(RT.echoRefund)} da carga.`],
 chain:['Chain of Command','Corrente de comando',`When an ally uses its skill, the nearest other ally with an active skill gains ${P0(RT.chainCharge)} charge.`,`Quando um aliado usa a habilidade, o aliado mais próximo com habilidade ativa ganha ${P0(RT.chainCharge)} de carga.`],
 sling:['Siege Sling','Funda de cerco',`At the start of each round, your units in the back-row corners are hurled onto the enemy back line, dealing ${P0(RT.slingDamage)} attack to the nearest enemy and stunning it for ${N(RT.slingStun)}s.`,`No início de cada rodada, suas unidades nos cantos da última linha são arremessadas sobre a linha de fundo inimiga, causando ${P0(RT.slingDamage)} do ataque ao inimigo mais próximo e atordoando-o por ${N(RT.slingStun,1)} s.`],
 contract:['Mercenary Contract','Contrato do mercenário',`Gain +${RT.contractElite} gold for each elite, order or Titan encounter won, and +${RT.contractBoss} for each boss.`,`Ganhe +${RT.contractElite} de ouro a cada confronto vencido contra elite, ordem ou Titã, e +${RT.contractBoss} contra boss.`],
 grimoire:['Apprentice’s Grimoire','Grimório do aprendiz',`Gain ${P0(RT.grimoireXp)} more tree XP during the run, but ${P0(RT.grimoireGold)} less gold from rewards.`,`Ganhe ${P0(RT.grimoireXp)} mais XP da árvore durante a run, mas ${P0(RT.grimoireGold)} menos ouro em recompensas.`]
};
const g=typeof window!=='undefined'?window:globalThis,EXTRA=g.I18N_EXTRA=g.I18N_EXTRA||{};
for(const a of G.ARTIFACTS){const t=TEXT[a.id];if(t){a.name=t[0];a.namePT=t[1];a.desc=t[2];a.descPT=t[3];}if(a.namePT&&a.name)EXTRA[a.namePT]=a.name;if(a.descPT&&a.desc)EXTRA[a.descPT]=a.desc;}
// categorias das existentes (Carlos 08/11)
const CAT={banner:'offense',dormant_sword:'offense',ember:'offense',execution:'offense',precision:'offense',heart:'defense',colossal_heart:'defense',plating:'defense',recovery:'defense',fang:'defense',laststand:'defense',repulsion:'defense',spark:'rhythm',quickstart:'rhythm',bell:'rhythm',hourglass:'rhythm',captain_standard:'deck',travelers_mirror:'deck',profane_idol:'deck',luckycharm:'economy',merchant:'economy',scope:'synergy',tome:'synergy',boots:'synergy',shield:'synergy'};
for(const a of G.ARTIFACTS)if(!a.category&&CAT[a.id])a.category=CAT[a.id];
// Formatos novos (Carlos 08/11): Ampulheta = diagonal 3, Luneta = diagonal 2, Selo de repulsão = ponte. Mapeados sem uso: escada, cavalo.
const RESHAPE={hourglass:'diag3',scope:'diag2',repulsion:'bridge'};for(const [id,sh] of Object.entries(RESHAPE)){const a=G.ARTIFACTS.find(a=>a.id===id);if(a){a.shape=sh;G.RELIC_FORMATS[id]=sh;}}
const CATEGORIES={offense:{en:'Offense',pt:'Ofensiva'},defense:{en:'Defense',pt:'Defensiva'},rhythm:{en:'Rhythm',pt:'Ritmo'},deck:{en:'Deck and hand',pt:'Deck e mão'},economy:{en:'Economy',pt:'Economia'},synergy:{en:'Synergy',pt:'Sinergia'}};

const has=(b,side,id)=>!!b?.relics?.[side]?.includes(id);
const kind=u=>G.BY[u.type];
const charge=(u,frac)=>{const d=kind(u);if(!d||d.kind!=='active'||!(u.charge>0)||u.hp<=0)return;u.progress=Math.min(u.charge,(u.progress||0)+u.charge*frac);};
const rank=(u,id)=>T?.rank?T.rank(u,id):0;
const order=u=>kind(u)?.order||kind(u)?.faction;
const alive=b=>b.units.filter(u=>u.hp>0);
const addShield=(u,frac,time=6)=>{u.shield=(u.shield||0)+u.maxhp*frac;u.shieldTime=Math.max(u.shieldTime||0,time);};
function bump(counts,owned,enemy){const bonus={faction:owned.includes('houses')?1:0,temperament:owned.includes('honor')?1:0,attribute:owned.includes('talents')?1:0};if(!bonus.faction&&!bonus.temperament&&!bonus.attribute)return counts;
 const out={...counts};for(const id of Object.keys(out)){const cat=T?.D?.[id]?.category;if(cat&&bonus[cat]&&out[id]>0)out[id]+=bonus[cat];}return out;}
const API=root.JourneyRelicsR3={NEW,CATEGORIES,
 traitCounts(b,counts){for(const side of [0,1])counts[side]=bump(counts[side],b.relics?.[side]||[]);},
 statCounts(s,counts,enemy){return bump(counts,enemy?(s?.ai?.artifacts||[]):(s?.artifacts||[]));},
 protectorRange(b,side){return has(b,side,'aegis')?RT.aegisRange:90;},
 auraScale(b,side){return has(b,side,'amplifier')?RT.amplifier:1;}};

if(T){
 const beforeStep=T.beforeStep;T.beforeStep=function(b,dt){const r=beforeStep.apply(this,arguments);
  if(!b.r3Init){b.r3Init=true;b.r3Horde=[0,0];
   for(const u of b.units){const side=u.side;
    if(has(b,side,'tome')&&T.caster?.(kind(u)))charge(u,RT.tomeCharge);
    if(has(b,side,'plating'))addShield(u,RT.platingShield);
    if(has(b,side,'dawn')&&order(u)==='dawncrest')addShield(u,RT.dawnShield);
    if(has(b,side,'patience')&&rank(u,'Patient'))u.r3PatientT=RT.patienceT;}
   for(const side of [0,1])if(has(b,side,'sling')){const mine=alive(b).filter(u=>u.side===side),backY=side?Math.min(...mine.map(u=>u.y)):Math.max(...mine.map(u=>u.y)),corners=mine.filter(u=>u.y===backY&&(u.x<=65||u.x>=365));
    const foes=alive(b).filter(v=>v.side!==side&&!v.raidBoss);if(!foes.length)continue;const foeBack=side?Math.max(...foes.map(v=>v.y)):Math.min(...foes.map(v=>v.y));
    for(const u of corners){const t=foes.filter(v=>v.y===foeBack).sort((x,y)=>Math.abs(x.x-u.x)-Math.abs(y.x-u.x))[0]||foes[0];u.x=t.x+(u.x<t.x?-28:28);u.y=t.y+(side?28:-28);u.motion=null;const dmg=u.atk*RT.slingDamage;if(!t.r3Invuln&&!(T.immune?.(b,t)))t.hp=Math.max(1,t.hp-dmg);t.stun=Math.max(t.stun||0,RT.slingStun);u.r3Slung=true;G.announce?.(b,u,'SLING');}}}
  for(const u of alive(b)){
   if(u.r3EchoPending){u.r3EchoPending=false;charge(u,RT.echoRefund);}
   if(u.stun>0&&has(b,u.side,'ironroot')&&rank(u,'Unyielding'))u.stun=0;
   if(b.time<RT.sentinelTaunt&&has(b,u.side,'shield')&&rank(u,'Sentinel'))for(const v of alive(b))if(v.side!==u.side&&!v.raidBoss&&G.distance(u,v)<=RT.sentinelRange&&!(v.taunt>0)){v.tauntUid=u.uid;v.taunt=RT.sentinelTaunt-b.time;}}
  return r;};
 const immune=T.immune;T.immune=function(b,t){return (t.r3Invuln||0)>b.time||immune.apply(this,arguments);};
 const damage=T.damage;T.damage=function(b,a,t,n,skill,options){n=damage.apply(this,arguments)??n;if(!a||skill||options?.dot)return n;
  if(has(b,a.side,'boots')&&rank(a,'Trailblazer')&&!a.r3Boots){a.r3Boots=true;if(!t.raidBoss)t.stun=Math.max(t.stun||0,.5);}
  if(has(b,a.side,'devastator')&&rank(a,'Devastator')&&!a.r3Dev){a.r3Dev=true;n*=1+RT.devastatorBonus;if(!t.raidBoss)t.stun=Math.max(t.stun||0,RT.devastatorStun);}
  return n;};
 const crit=T.crit;T.crit=function(b,a,c){const v=crit.apply(this,arguments);if(a&&has(b,a.side,'scope')&&a.range>100&&!a.r3Scope){a.r3Scope=true;return 1;}return v;};
 const reduction=T.reduction;T.reduction=function(b,t,n){n=reduction.apply(this,arguments)??n;if(has(b,t.side,'lone')&&rank(t,'Audacious')&&!alive(b).some(v=>v!==t&&v.side===t.side&&G.distance(t,v)<=90))n=Math.min(.65,1-(1-n)*(1-RT.loneReduction));return n;};
 const afterSkill=T.afterSkill;T.afterSkill=function(b,u){const r=afterSkill.apply(this,arguments);
  if(has(b,u.side,'echo')&&!u.r3Echo){u.r3Echo=true;u.r3EchoPending=true;}
  if(has(b,u.side,'chain')){const near=alive(b).filter(v=>v!==u&&v.side===u.side&&kind(v)?.kind==='active').sort((x,y)=>G.distance(u,x)-G.distance(u,y))[0];if(near)charge(near,RT.chainCharge);}
  return r;};
 const healthLoss=T.healthLoss;T.healthLoss=function(b,u,amount){const r=healthLoss.apply(this,arguments);if(u.hp>0&&u.hp/u.maxhp<RT.ironrootAt&&!u.r3Iron&&has(b,u.side,'ironroot')&&rank(u,'Unyielding')){u.r3Iron=true;addShield(u,RT.ironrootShield);}return r;};
 const afterSettle=T.afterSettle;T.afterSettle=function(b,living,pending){const r=afterSettle.apply(this,arguments);
  for(const p of pending||[]){const src=p.source;if(!src||!p.damage)continue;
   if(p.crit){if(has(b,src.side,'precision'))charge(src,RT.precisionCharge);if(has(b,src.side,'warcry')&&rank(src,'Fearless')&&src.hp>0)src.hp=Math.min(src.maxhp,src.hp+src.maxhp*RT.warcryHeal);}
   const t=p.target;if(t&&t.hp<=0&&!t.r3Killed){t.r3Killed=true;
    if(has(b,src.side,'execution'))charge(src,RT.executionCharge);
    if(has(b,src.side,'dawn')&&order(src)==='dawncrest'&&!src.r3Dawn&&src.hp>0){src.r3Dawn=true;addShield(src,RT.dawnShield);}}}
  for(const u of b.units)if(u.hp<=0&&!u.r3Dead){u.r3Dead=true;const side=u.side;
   if(has(b,side,'horde')&&order(u)==='blackfang'&&(b.r3Horde?.[side]||0)<RT.hordeMax){b.r3Horde[side]++;for(const v of alive(b))if(v.side===side&&order(v)==='blackfang')charge(v,RT.hordeCharge);}}
  return r;};
}
// Contrato do mercenário: ouro extra por elite, ordem, Titã e boss vencidos
const P=root.Progress;if(P?.encounterWin){const win=P.encounterWin;P.encounterWin=function(s){const before=s?.meta?.encounters?.length||0,r=win.apply(this,arguments);if(s?.artifacts?.includes('contract')&&(s.meta?.encounters?.length||0)>before){const t=s.current?.type;const add=t==='boss'?RT.contractBoss:t==='elite'?RT.contractElite:0;if(add){s.gold+=add;s.r3ContractGold=(s.r3ContractGold||0)+add;}}return r;};}
// Bússola do saqueador: +1 opção nas escolhas de carta
if(Tree?.offerCount){const offerCount=Tree.offerCount;Tree.offerCount=function(s,n){const v=offerCount.apply(this,arguments);return v+(s?.artifacts?.includes('compass')?RT.compass:0);};}
// Ídolo profano: ao equipar pela 1ª vez na run, adiciona 1 Exaustão ao deck
const commit=G.commitBag;G.commitBag=function(s,items){const ok=commit.apply(this,arguments);if(ok&&s.artifacts.includes('profane_idol')&&C?.addCurse){const st=C.state?.(s)||(s.content??={});if(!st.idolCurse){st.idolCurse=true;C.addCurse(s,'exhaustion');}}return ok;};
})(typeof window!=='undefined'?window:globalThis);
