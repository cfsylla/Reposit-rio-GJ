/* R3 relíquias (Carlos 08/11/2026): 15 relíquias novas e os efeitos novos das relíquias existentes que não cabem em game-0.
 * Proposta: balance/rodada3/reliquias/PROPOSTA_RELIQUIAS_R3.md. Valores em root.JOURNEY_RELIC_TUNE (o simulador pode sobrescrever).
 * As 15 novas são só do jogador (playerOnly): o conjunto de relíquias dos inimigos não muda. */
(function(root){'use strict';
const G=root.Game,T=root.JourneyTraits,C=root.JourneyContent,Tree=root.JourneyTree;
const RT=root.JOURNEY_RELIC_TUNE=root.JOURNEY_RELIC_TUNE||{};
const DEF={tomeCharge:.30,sentinelTaunt:3,sentinelRange:120,precisionCharge:.10,executionCharge:.15,echoRefund:.60,chainCharge:.20,compass:1,devastatorBonus:.60,devastatorStun:.5,warcryHeal:.04,ironrootAt:.50,ironrootShield:.10,patienceT:3,aegisRange:140,loneReduction:.15,amplifier:1.4,hordeCharge:.15,hordeMax:3,dawnShield:.06,platingShield:.08};
for(const [k,v] of Object.entries(DEF))if(RT[k]===undefined)RT[k]=v;
// id, nome EN, nome PT, raridade, formato, ícone, texto EN, texto PT, categoria
const NEW=[
 ['echo','Arcane Echo','Eco arcano',3,'L5','✺','The first skill each ally uses in each round refunds 60% of its charge.','A primeira habilidade que cada aliado usa em cada rodada devolve 60% da carga.','rhythm'],
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
const TEXT={
 banner:['Ancient Banner','Estandarte antigo','All allies gain +8% attack.','Todos os aliados têm +8% de ataque.'],
 heart:['Vital Stone','Pedra vital','All allies gain +10% health.','Todos os aliados têm +10% de vida.'],
 scope:['Marksman’s Scope','Luneta do atirador','Ranged allies gain +15% attack. The first basic attack of each one in each round is a critical hit.','Aliados com ataque à distância ganham +15% de ataque. O primeiro ataque básico de cada um em cada rodada é crítico.'],
 tome:['Tome of Stars','Tomo das estrelas','Spellcasters gain +25% skill power and start each round with 30% charge.','Conjuradores ganham +25% de poder de habilidade e começam cada rodada com 30% da carga.'],
 boots:['Wind Boots','Botas do vento','Trailblazers gain +20% movement and +15% attack speed. The first basic attack of each Trailblazer in each round stuns for 0.5s.','Desbravadores ganham +20% de movimento e +15% de velocidade de ataque. O primeiro ataque básico de cada Desbravador em cada rodada atordoa por 0,5 s.'],
 shield:['Warding Seal','Selo de proteção','Sentinels take 10% less damage and draw the attacks of nearby enemies during the first 3s of each round.','Sentinelas recebem 10% menos dano e atraem os ataques dos inimigos próximos nos 3 primeiros segundos de cada rodada.'],
 precision:['Precision Medallion','Medalhão da precisão','All allies gain +5 percentage points of critical chance. Each critical hit charges 10% of the attacker skill.','Todos os aliados ganham +5 pontos percentuais de chance de crítico. Cada crítico carrega 10% da habilidade de quem acertou.'],
 hourglass:['Combat Hourglass','Ampulheta de combate','All allies with an active skill start each round with 30% charge.','Todos os aliados com habilidade ativa começam cada rodada com 30% da carga.'],
 recovery:['Recovery Brooch','Broche da recuperação','All living allies recover 1.5% of their maximum health every 3 seconds; below 40% health, they recover twice as much.','Todos os aliados vivos recuperam 1,5% da vida máxima a cada 3 segundos; abaixo de 40% de vida, recuperam o dobro.'],
 merchant:['Merchant’s Coin','Moeda do mercador','Cards and relics in shops cost 25% less, and the first reroll in each shop is free.','Cartas e relíquias na loja custam 25% menos, e a primeira renovação de cada loja é grátis.'],
 quickstart:['Quick Start','Arranque rápido','Gain 3 extra energy in the first preparation of each encounter.','Receba 3 de energia extra na primeira preparação de cada confronto.'],
 spark:['Everlasting Spark','Centelha eterna','Gain 1 extra energy in every preparation, including the first.','Receba 1 de energia extra em toda preparação, incluindo a primeira.'],
 luckycharm:['Lucky Charm','Amuleto da sorte','Gain 35% more run gold from rewards. Does not affect diamonds or refunds.','Receba 35% mais ouro da run em recompensas. Não afeta diamantes nem reembolsos.'],
 plating:['Reinforced Plating','Placas reforçadas','At the start of each round, all allies gain a shield of 8% of their maximum health.','No início de cada rodada, todos os aliados ganham escudo de 8% da vida máxima.'],
 laststand:['Last Stand','Última resistência','Once per round, the first ally taking lethal damage survives with 30% health and is invulnerable for 2s.','Uma vez por rodada, o primeiro aliado a receber dano letal fica com 30% da vida e invulnerável por 2 s.'],
 repulsion:['Repulsion Seal','Selo de repulsão','Once per round, the first ally dropping below 30% health pushes nearby enemies away, stuns them for 1.5s and gains a 20% shield.','Uma vez por rodada, o primeiro aliado a cair abaixo de 30% de vida empurra e atordoa por 1,5 s os inimigos próximos e ganha escudo de 20%.'],
 fang:['Vampiric Fang','Presa vampírica','Basic attacks heal their attacker for 10% of the health damage dealt (20% against bosses).','Ataques básicos curam o atacante em 10% do dano causado à vida (20% contra bosses).'],
 execution:['Executioner’s Mark','Marca do executor','Deal 20% more damage to enemies below 30% health. Defeating an enemy charges 15% of the attacker skill.','Cause 20% mais dano a inimigos abaixo de 30% de vida. Derrotar um inimigo carrega 15% da habilidade de quem derrotou.'],
 ember:['Vengeful Ember','Brasa vingativa','Each fallen ally grants the survivors 10% more attack damage and a 5% shield this round, up to 3 times.','Cada aliado derrotado concede aos sobreviventes 10% mais dano de ataque e escudo de 5% nesta rodada, até 3 vezes.'],
 bell:['Opening Bell','Sino de abertura','All allies attack 15% faster during the first 5 seconds of each round.','Todos os aliados atacam 15% mais rápido nos primeiros 5 segundos de cada rodada.'],
 captain_standard:['Captain’s Standard','Estandarte do capitão','Choose a physical unit card to guarantee in the first hand of each encounter. Deployment still costs energy.','Escolha uma carta de unidade física para garantir na primeira mão de cada confronto. Posicionar continua custando energia.'],
 profane_idol:['Profane Idol','Ídolo profano','When equipped, adds 1 Exhaustion to your run deck (once). All allies gain +6% attack per curse in your run deck, up to +30%.','Ao equipar, adiciona 1 Exaustão ao deck da run (uma vez). Aliados recebem +6% de ataque por maldição no deck da run, até +30%.'],
 colossal_heart:['Colossal Heart','Coração colossal','All allies gain +15% health. The first hand of each encounter has 3 cards instead of 4.','Aliados recebem +15% de vida. A primeira mão de cada confronto tem 3 cartas em vez de 4.'],
 dormant_sword:['Dormant Sword','Espada adormecida','All allies gain +2% attack, plus 2% for each elite encounter won with this relic equipped, up to +10%. Bosses do not count.','Aliados recebem +2% de ataque, e mais 2% a cada confronto de elite vencido com ela equipada, até +10%. Bosses não contam.'],
 travelers_mirror:['Travelers’ Mirror','Espelho dos viajantes','Recruited cards come with +1 upgrade (up to level 2). Shop purchases and duplication do not trigger this.','Cartas recrutadas vêm com +1 upgrade (até o nível 2). Compras na loja e duplicações não ativam.']
};
const g=typeof window!=='undefined'?window:globalThis,EXTRA=g.I18N_EXTRA=g.I18N_EXTRA||{};
for(const a of G.ARTIFACTS){const t=TEXT[a.id];if(t){a.name=t[0];a.namePT=t[1];a.desc=t[2];a.descPT=t[3];}if(a.namePT&&a.name)EXTRA[a.namePT]=a.name;if(a.descPT&&a.desc)EXTRA[a.descPT]=a.desc;}
// categorias das existentes (Carlos 08/11)
const CAT={banner:'offense',dormant_sword:'offense',ember:'offense',execution:'offense',precision:'offense',heart:'defense',colossal_heart:'defense',plating:'defense',recovery:'defense',fang:'defense',laststand:'defense',repulsion:'defense',spark:'rhythm',quickstart:'rhythm',bell:'rhythm',hourglass:'rhythm',captain_standard:'deck',travelers_mirror:'deck',profane_idol:'deck',luckycharm:'economy',merchant:'economy',scope:'synergy',tome:'synergy',boots:'synergy',shield:'synergy'};
for(const a of G.ARTIFACTS)if(!a.category&&CAT[a.id])a.category=CAT[a.id];
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
    if(has(b,side,'patience')&&rank(u,'Patient'))u.r3PatientT=RT.patienceT;}}
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
// Bússola do saqueador: +1 opção nas escolhas de carta
if(Tree?.offerCount){const offerCount=Tree.offerCount;Tree.offerCount=function(s,n){const v=offerCount.apply(this,arguments);return v+(s?.artifacts?.includes('compass')?RT.compass:0);};}
// Ídolo profano: ao equipar pela 1ª vez na run, adiciona 1 Exaustão ao deck
const commit=G.commitBag;G.commitBag=function(s,items){const ok=commit.apply(this,arguments);if(ok&&s.artifacts.includes('profane_idol')&&C?.addCurse){const st=C.state?.(s)||(s.content??={});if(!st.idolCurse){st.idolCurse=true;C.addCurse(s,'exhaustion');}}return ok;};
})(typeof window!=='undefined'?window:globalThis);
