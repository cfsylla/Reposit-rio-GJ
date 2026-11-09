#!/usr/bin/env python3
"""R3 (Carlos 09/11): passa os valores restantes das relíquias para a tabela JOURNEY_RELIC_TUNE e
faz os textos (EN/PT) serem montados a partir dela. Uso: python3 balance/sim/r3-reliquias-param.py (da raiz)."""
import re
D = 'game_r3/dist/'

def edit(path, pairs):
    s = open(D + path, encoding='utf8').read()
    for a, b in pairs:
        assert s.count(a) == 1, (path, a[:70], s.count(a))
        s = s.replace(a, b)
    open(D + path, 'w', encoding='utf8').write(s)

edit('game-0.js', [
    ("const RT=root.JOURNEY_RELIC_TUNE={quickstart:3,", "const RT=root.JOURNEY_RELIC_TUNE={banner:.08,heart:.10,scope:.15,tome:.25,shieldArmor:.10,precisionCrit:.05,bell:.15,bellTime:5,colossal:.15,quickstart:3,"),
    ("st.crit+=Math.min(.20,arts(owner,'precision')*.05);", "st.crit+=Math.min(.20,arts(owner,'precision')*RT.precisionCrit);"),
    ("st.hp*=1+arts(owner,'heart')*.10;", "st.hp*=1+arts(owner,'heart')*RT.heart;"),
    ("st.atk*=1+arts(owner,'banner')*.08;", "st.atk*=1+arts(owner,'banner')*RT.banner;"),
    ("st.atk*=1+arts(owner,'scope')*.15;", "st.atk*=1+arts(owner,'scope')*RT.scope;"),
    ("st.skill+=arts(owner,'tome')*.25;", "st.skill+=arts(owner,'tome')*RT.tome;"),
    ("st.armor+=arts(owner,'shield')*.10;", "st.armor+=arts(owner,'shield')*RT.shieldArmor;"),
    ("(b.time<5&&combatHas(b,u.side,'bell')?1.15:1)", "(b.time<RT.bellTime&&combatHas(b,u.side,'bell')?1+RT.bell:1)"),
])
edit('content-v53.js', [
    ("if(active(s,'colossal_heart'))st.hp*=1.15;", "if(active(s,'colossal_heart'))st.hp*=1+(RT.colossal??.15);"),
])

# relics-r3.js: textos montados a partir da tabela
s = open(D + 'relics-r3.js', encoding='utf8').read()
i = s.index('const TEXT={'); j = s.index('};', i) + 2
TEMPLATE = r"""const P0=x=>Math.round(x*100)+'%',P1=x=>(Math.round(x*1000)/10)+'%',N=(x,pt)=>{const v=String(Math.round(x*100)/100);return pt?v.replace('.',','):v;};
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
};"""
s = s[:i] + TEMPLATE + s[j:]
open(D + 'relics-r3.js', 'w', encoding='utf8').write(s)
print('ok')
