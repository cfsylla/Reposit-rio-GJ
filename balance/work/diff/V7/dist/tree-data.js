/* Stable node IDs; all branches can eventually be acquired. */
(function(root){'use strict';
const categories={power:{en:'Power',pt:'Poder',icon:'sword',color:'#e9928d',angle:-126},vitality:{en:'Vitality',pt:'Vitalidade',icon:'heart',color:'#e9a3bd',angle:90},protection:{en:'Protection',pt:'Proteção',icon:'shield',color:'#a6cf91',angle:162},agility:{en:'Agility',pt:'Agilidade',icon:'haste',color:'#87dbe3',angle:-54},expedition:{en:'Expedition',pt:'Expedição',icon:'bag',color:'#e7c080',angle:18}};
const nodes=[],by={};
function add(id,category,type,en,pt,enDesc,ptDesc,effect,icon){const n={id,category,type,en,pt,enDesc,ptDesc,effect,icon:icon||categories[category].icon,links:[],cost:0};nodes.push(n);by[id]=n;return id;}
function basic(cat,prefix,count,key,value,en,pt,icon){return Array.from({length:count},(_,i)=>add(prefix+(i+1),cat,'basic',en+' '+(i+1),pt+' '+(i+1),'+'+(value*100).toFixed(0)+(key==='crit'?' percentage point critical chance.':'% '+en.toLowerCase()+'.'),'+'+(value*100).toFixed(0)+(key==='crit'?' ponto percentual de chance de crítico.':'% '+pt.toLowerCase()+'.'),{[key]:value},icon));}
const pAtk=basic('power','pow_atk_',6,'atk',.01,'Attack','Ataque'),pCrit=basic('power','pow_crit_',2,'crit',.01,'Critical chance','Chance de crítico','crit'),pCD=basic('power','pow_cdamage_',2,'critDamage',.03,'Critical damage','Dano crítico','crit');
const vHP=basic('vitality','vit_hp_',6,'hp',.03,'Maximum health','Vida máxima'),vHeal=basic('vitality','vit_heal_',2,'heal',.03,'Healing received','Cura recebida','heart');
const dDef=basic('protection','def_armor_',6,'defense',.02,'Defense','Defesa'),dCC=basic('protection','def_control_',2,'control',.05,'Control resistance','Resistência a controle','shield');for(const id of dCC){by[id].enDesc='Control effects last 5% less time.';by[id].ptDesc='Efeitos de controle duram 5% menos tempo.';}
const aRate=basic('agility','agi_rate_',5,'haste',.01,'Attack speed','Velocidade de ataque'),aMove=basic('agility','agi_move_',3,'speed',.03,'Movement speed','Movimento','boot');
const eGold=basic('expedition','exp_gold_',2,'gold',.05,'Gold received','Ouro recebido','coin'),eShop=basic('expedition','exp_shop_',2,'discount',.03,'Shop discount','Desconto em lojas','coin');
const special=(id,c,en,pt,enD,ptD,icon)=>add(id,c,'special',en,pt,enD,ptD,{[id]:true},icon),mark=(id,c,en,pt,enD,ptD,icon)=>add(id,c,'milestone',en,pt,enD,ptD,{[id]:true},icon);
special('first_impact','power','First Impact','Primeiro impacto','Basic attacks deal 8% more damage to enemies at full health.','Ataques básicos causam +8% de dano em inimigos com vida cheia.');
special('execution','power','Execution','Execução','Deal 5% more damage to enemies below 30% health.','Causa +5% de dano em inimigos abaixo de 30% de vida.');
special('penetration','power','Penetration','Penetração','Basic attacks ignore 5% of the target’s defense.','Ataques básicos ignoram 5% da defesa do alvo.');
mark('devastating','power','Devastating Opening','Abertura devastadora','Each unit’s first offensive skill each round deals 15% more damage.','A primeira skill ofensiva de cada unidade na rodada causa +15% de dano.');
special('urgent_heal','vitality','Urgent Recovery','Recuperação urgente','Receive 10% more healing while below 40% health.','Recebe +10% de cura enquanto estiver abaixo de 40% de vida.');
special('second_wind','vitality','Second Wind','Segundo fôlego','The first skill activation each round heals its user for 3% maximum health.','A primeira ativação de skill na rodada cura seu usuário em 3% da vida máxima.');
mark('survival','vitality','Survival Instinct','Instinto de sobrevivência','Once per unit per round, surviving below 25% health grants an 8% maximum-health shield for 6s.','Uma vez por unidade por rodada, sobreviver abaixo de 25% de vida concede escudo de 8% da vida máxima por 6s.');
special('formation','protection','Defensive Formation','Formação defensiva','Take 5% less damage during the first 5s of each round.','Recebe −5% de dano nos primeiros 5s de cada rodada.');
special('strong_shields','protection','Reinforced Shields','Escudos reforçados','Shields received are 10% stronger.','Escudos recebidos são 10% maiores.');
mark('last_line','protection','Last Line','Última linha','The first allied death each round grants survivors a 5% maximum-health shield for 6s.','A primeira morte aliada na rodada concede aos sobreviventes escudo de 5% da vida máxima por 6s.');
special('sprint','agility','Fast Start','Arranque','Attack 8% faster until completing the first 3 basic attacks each round.','Ataca 8% mais rápido até concluir os 3 primeiros ataques básicos da rodada.');
special('momentum','agility','Momentum','Embalado','A movement skill grants its user 8% attack speed for 3s. Reapplying refreshes the duration.','Uma skill de deslocamento concede ao usuário +8% de velocidade de ataque por 3s. Reativar renova a duração.');
special('readiness','agility','Readiness','Prontidão','Start each round with 10% special charge. Does not affect passive or already fully charged skills.','Começa a rodada com 10% da barra de especial. Não afeta skills passivas ou que já começam carregadas.');
mark('rhythm','agility','Battle Rhythm','Ritmo de batalha','The first skill activation each round grants 10% attack speed for 4s.','A primeira ativação de skill da rodada concede +10% de velocidade de ataque por 4s.');
special('market','expedition','Market Research','Pesquisa de mercado','Refresh card offers once for free in each shop. Relic offers stay unchanged.','Renova as ofertas de cartas uma vez de graça por loja. As ofertas de relíquias são mantidas.','deck');
special('candidates','expedition','More Candidates','Mais candidatos','Recruitment nodes offer one extra candidate, respecting availability and copy limits.','Nodes de recrutamento oferecem um candidato adicional, respeitando disponibilidade e limite de cópias.','units');
special('training_deal','expedition','Training Deal','Treino negociado','The first paid card upgrade in each shop receives an additional 10% discount.','O primeiro upgrade pago de carta em cada loja recebe mais 10% de desconto.','upgrade');
special('planned_purchase','expedition','Planned Purchase','Compra planejada','The first card bought in each map costs 2 less gold. Minimum price: 1 gold.','A primeira carta comprada em cada mapa custa 2 ouros a menos. Preço mínimo: 1 ouro.','coin');
special('explorer','expedition','Explorer’s Eye','Olhar de explorador','Relic choice rewards offer one extra option when available.','Recompensas de escolha de relíquia oferecem uma opção adicional quando disponível.','star');
special('provisions','expedition','Provisions','Provisões','Receive 5 gold on entering each map.','Recebe 5 ouros ao entrar em cada mapa.','coin');
mark('expanded_bag','expedition','Expanded Bag','Bag expandida','Permanently adds two adjacent cells below the Relic Bag.','Adiciona permanentemente duas casas contíguas abaixo da bolsa de relíquias.','bag');
mark('caravan','expedition','Allied Caravan','Caravana aliada','At the first recruitment in each map, choose up to two different offers instead of one.','No primeiro recrutamento de cada mapa, escolhe até duas ofertas diferentes em vez de uma.','units');
const layouts={
 power:{start:[pAtk[0],pAtk[1]],arms:[[pAtk[2],'first_impact',pCrit[0],'execution',pAtk[3],'devastating'],[pAtk[4],pCrit[1],'penetration',pCD[0],pAtk[5],pCD[1]]]},
 vitality:{start:[vHP[0],vHP[1]],arms:[[vHP[2],'urgent_heal',vHeal[0],'survival'],[vHP[3],'second_wind',vHP[4],vHeal[1],vHP[5]]]},
 protection:{start:[dDef[0],dDef[1]],arms:[[dDef[2],'formation',dCC[0],'last_line'],[dDef[3],'strong_shields',dDef[4],dCC[1],dDef[5]]]},
 agility:{start:[aRate[0],aRate[1]],arms:[[aRate[2],'sprint',aMove[0],'rhythm',aMove[1]],[aRate[3],'momentum',aRate[4],'readiness',aMove[2]]]},
 expedition:{start:[eGold[0],eGold[1]],arms:[[eShop[0],'market','candidates','training_deal','expanded_bag'],[eShop[1],'planned_purchase','explorer','provisions','caravan']]}
};
const origin={id:'origin',type:'origin',x:560,y:560,links:[],cost:0,en:'Beginning',pt:'Início'};by.origin=origin;
function connect(a,b){if(!by[a].links.includes(b))by[a].links.push(b);if(!by[b].links.includes(a))by[b].links.push(a);}
function position(n,angle,radius){const a=angle*Math.PI/180;n.x=560+Math.cos(a)*radius;n.y=560+Math.sin(a)*radius;}
for(const [cat,l]of Object.entries(layouts)){const angle=categories[cat].angle;l.start.forEach((id,i)=>{const n=by[id];n.depth=i;n.cost=i?10:8;position(n,angle,95+i*75);connect(i?l.start[i-1]:'origin',id);});l.arms.forEach((arm,side)=>arm.forEach((id,i)=>{const n=by[id],depth=i+2;n.depth=depth;n.cost=n.type==='milestone'?(cat==='expedition'?36:32):n.type==='special'?14+Math.min(3,i)*2:depth>=4?12:10;position(n,angle+(side?1:-1)*(12+Math.sin(i*.8)*5),240+i*49);connect(i?arm[i-1]:l.start[1],id);}));}
const bridges=[[pAtk[3],aRate[2]],[pAtk[2],dDef[2]],[dDef[4],vHP[3]],[vHP[2],eShop[1]]];for(const [a,b]of bridges)connect(a,b);
root.JourneyTreeData={categories,nodes,by,origin,bridges};
})(typeof globalThis!=='undefined'?globalThis:this);
