# Habilidades: regra de ativação proposta (10/11, para aprovação)

Regra do Carlos: a habilidade só ativa com alvo válido; senão a unidade guarda a carga.
Classificação automática pelo código de cada habilidade (game-0.js, activate); revisar os marcados.

## golpe/tiro no alvo (24)
Condição: inimigo-alvo dentro do alcance de ataque

- Espadachim Meowri (feline_swordsman, alcance 34)
- Lutador Meowri (feline_fighter, alcance 34)
- Nobre Alto Elfo (elf_noble, alcance 145)
- Batedor Elfo da Floresta (woodland_scout, alcance 180)
- Guardião Elfo da Floresta (woodland_flailer, alcance 62)
- Caçadora Centaura (centaur_crossbow, alcance 180)
- Goblin Lanceiro (goblin_spearman, alcance 62)
- Goblin Arqueiro (goblin_archer, alcance 180)
- Goblin Bruto (goblin_brute, alcance 34)
- Orc Berserker (orc_berserker, alcance 34)
- Orc Lutadora (orc_fighter, alcance 34)
- Troll (troll, alcance 62)
- Arqueiro Elfo Sombrio (dark_elf_archer, alcance 180)
- Mago Elfo Sombrio (dark_elf_mage, alcance 145)
- Musketeer (musketeer, alcance 180)
- Berserker (berserker, alcance 34)
- Huntress (huntress, alcance 145)
- Pirate Admiral (pirate_admiral, alcance 62)
- Shackled Pirate (shackled_pirate, alcance 62)
- Kinoichi (kinoichi, alcance 62)
- Fighter (fighter, alcance 34)
- Gunner (gunner, alcance 180)
- Pirate (pirate, alcance 34)
- Cannoneer (cannoneer, alcance 180)

## investida no alvo (6)
Condição: inimigo-alvo a até o alcance de investida (alcance de ataque + ~100)

- Gatuno Meowri (feline_rogue, alcance 34)
- Espadachim Centauro (centaur_swordsman, alcance 34)
- Nobre Elfo Sombrio (dark_elf_noble, alcance 34)
- Shinobi (shinobi, alcance 34)
- Samurai (samurai, alcance 34)
- OmnaMusha (omnamusha, alcance 34)

## buff/escudo em aliados (8)
Condição: aliado no raio e inimigo perto da formação

- Feiticeiro Meowri (feline_arcanist, alcance 145)
- Percussionista Meowri (feline_drummer, alcance 145)
- Guerreiro Alto Elfo (elf_guardian, alcance 34)
- Cavaleiro Centauro (centaur_lancer, alcance 62)
- Barda (bard, alcance 145)
- Rei Goblin (goblin_king, alcance 145)
- Shieldmaiden (shieldmaiden, alcance 34)
- Sage (sage, alcance 145)

## linha/cone/frente (9)
Condição: ≥1 inimigo dentro da linha/cone

- Arqueiro Alto Elfo (elf_archer, alcance 180)
- Lanceira Alta Elfa (elf_halberdier, alcance 62)
- Guardião Elfo Negro (blackfang_guardian, alcance 62)
- Troll da Montanha (mountain_troll, alcance 62)
- Guerreiro Elfo Sombrio (dark_elf_warrior, alcance 62)
- Swordsman (swordsman, alcance 62)
- Lancer (lancer, alcance 62)
- Martial Artist (martial_artist, alcance 62)
- Crossbowman (crossbowman, alcance 180)

## área (7)
Condição: ≥1 inimigo dentro da área

- Guerreiro Elfo da Floresta (woodland_lancer, alcance 62)
- Xerife (sheriff, alcance 145)
- Gladiador (gladiator, alcance 62)
- Bear Druid (bear_druid, alcance 62)
- Warrior (warrior, alcance 34)
- Bastion (bastion, alcance 34)
- Cowboy (cowboy, alcance 145)

## cura (3)
Condição: aliado ferido (<90%) no raio

- Fada das Flores (flower_fairy, alcance 145)
- Troll das Neves (snow_troll, alcance 145)
- Glutton (glutton, alcance 34)

## zona/invocação (10)
Condição: ≥1 inimigo dentro do alcance da zona

- Harpista Alta Elfa (elf_harpist, alcance 145)
- Goblin Bombardeiro (goblin_bomber, alcance 145)
- Shaman (shaman, alcance 145)
- Eagle Druid (eagle_druid, alcance 34)
- Miner (miner, alcance 62)
- Pirate Captain (pirate_captain, alcance 145)
- Ranger (ranger, alcance 145)
- Archer (archer, alcance 180)
- Sorceress (sorceress, alcance 145)
- Priestess (priestess, alcance 145)

## outro (revisar) (6)
Condição: revisar à mão

- Goblin Montador (goblin_rider, alcance 62)
- Orc Guerreiro (orc_warrior, alcance 34)
- Cavalier (cavalier, alcance 62)
- Ronin (ronin, alcance 34)
- Duelist (duelist, alcance 34)
- Mage (mage, alcance 145)


## Revisão manual (10/11) — substitui a classificação automática destas
| Unidade | Habilidade (código) | Tipo | Condição |
|---|---|---|---|
| goblin_rider, cavalier | carga (charging) | investida no alvo | inimigo-alvo a até alcance de investida |
| eagle_druid | salta até inimigo a até 180 e cria zona | investida no alvo | inimigo a até 180 |
| ronin | contra-ataque em quem o atacou | golpe no alvo | inimigo dentro do alcance de ataque |
| orc_warrior | escudo em si | buff em si | inimigo dentro do alcance de ataque |
| duelist | postura de riposte | buff em si | inimigo dentro do alcance de ataque |
| mage | 3 orbes | buff em si (projéteis) | inimigo dentro do alcance de ataque |
| goblin_bomber, miner, archer, sorceress | zona de dano na posição do alvo | zona no alvo | inimigo-alvo dentro do alcance de ataque |
| ranger | armadilha à frente | zona à frente | inimigo dentro do alcance de ataque |
| elf_harpist, shaman, pirate_captain | aura/zona de apoio em volta de si | buff em aliados | aliado no raio e inimigo perto da formação |
| bard | balada nos aliados a até 110 | buff em aliados | aliado no raio e inimigo perto da formação |
| priestess | santuário (cura + limpa controle) | cura | aliado ferido ou sob controle no raio |
| flower_fairy | cura o aliado mais ferido | cura | aliado ferido (<90%) |
| snow_troll | cura aliados a até 85 | cura | aliado ferido no raio |
| glutton | cura a si | cura em si | própria vida < 90% |
| sage | escudo no aliado mais ferido | escudo em aliado ferido | aliado ferido (<90%) |
