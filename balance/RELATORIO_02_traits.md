# Etapa 1b — Traits e personagens com sinergia (v54, sem alterações)

## Como foi o teste

Mesmo método da etapa 1: lutas reais com times fixos, aumentando a força dos inimigos até o time perder.

**Teste A — quanto vale cada trait.**
- Montei times com 2 e com 4 membros do trait (Orc e Centaur: 3), completados com colegas neutros até 5.
- Medi o mesmo time duas vezes: com o trait ligado e com o trait desligado, só no lado do jogador. Desligar o trait é um recurso do laboratório, não do jogo.
- Cada trait foi medido com 4 combinações diferentes de membros.
- O "ganho" é quanto o time inteiro fica mais forte por causa do trait. +10% = vence inimigos 10% mais fortes.

**Teste B — personagem dentro do time da própria facção.**
- O personagem, mais até 3 colegas da mesma facção, mais colegas neutros.
- Comparado com o mesmo time trocando o personagem por um colega neutro.
- Inclui o patamar de trait que ele ajuda a ativar.

Ruído: cerca de ±1 ponto percentual no ganho de trait e ±0,02 no índice.
Comandos: `node balance/sim/traitlab.cjs --mode trait --combos 4` e `--mode unit --combos 2`. Resultados em `balance/out/traits1/`.

## Ganho de cada trait

### Facções

| Trait | Personagens com o trait | Ganho com 2 | Ganho com 4 (Orc/Centaur: 3) | Variação no patamar maior (pior–melhor combinação) |
|---|---|---|---|---|
| Meowri | 5 | +4.9% | +23.9% | +14.7% a +30.6% |
| Verdant Covenant | 5 | +0.9% | +6.9% | +6.1% a +8.9% |
| Forest Elf | 4 | +1.8% | +4.6% | +4.6% a +4.6% |
| Seasalt Crew | 5 | +1.1% | +4.5% | +1.6% a +7.5% |
| Dawnward Order | 8 | +1.0% | +4.2% | +3.3% a +5.8% |
| Frostborn Clans | 6 | +0.1% | +3.9% | +3.1% a +5.2% |
| Centaur | 3 | +0.5% | +3.9% | +3.9% a +3.9% |
| High Elf | 5 | +0.9% | +3.9% | +2.9% a +4.8% |
| Wild West | 4 | +1.0% | +2.9% | +2.9% a +2.9% |
| Goblin | 6 | +0.2% | +2.5% | +1.3% a +5.0% |
| Troll | 4 | +0.7% | +1.6% | +1.6% a +1.6% |
| Orc | 3 | +0.8% | +1.5% | +1.5% a +1.5% |
| Dark Elf | 5 | +0.4% | +1.5% | +0.9% a +1.8% |
| Arcane | 5 | +0.3% | +1.0% | +0.4% a +2.0% |
| Legends of the East | 8 | +0.2% | +0.8% | +0.4% a +1.3% |

### Atributos

| Trait | Personagens com o trait | Ganho com 2 | Ganho com 4 (Orc/Centaur: 3) | Variação no patamar maior (pior–melhor combinação) |
|---|---|---|---|---|
| Sentinel | 12 | +4.0% | +10.0% | +7.7% a +11.8% |
| Demolisher | 7 | +0.0% | +9.1% | +1.8% a +13.1% |
| Unyielding | 15 | +2.1% | +9.0% | +6.5% a +10.2% |
| Devastator | 14 | +1.9% | +5.6% | +5.0% a +6.5% |
| Lookout | 8 | +1.6% | +4.8% | +3.1% a +7.1% |
| Predator | 12 | +2.6% | +4.5% | +2.9% a +5.9% |
| Trailblazer | 9 | -0.6% | -0.5% | -2.5% a +1.6% |

### Temperamentos

| Trait | Personagens com o trait | Ganho com 2 | Ganho com 4 (Orc/Centaur: 3) | Variação no patamar maior (pior–melhor combinação) |
|---|---|---|---|---|
| Impulsive | 14 | +1.8% | +7.1% | +5.6% a +9.8% |
| Ruthless | 12 | +1.2% | +5.9% | +2.6% a +9.2% |
| Audacious | 11 | +0.5% | +3.3% | +1.3% a +5.6% |
| Protector | 11 | +1.9% | +1.9% | +0.7% a +2.9% |
| Patient | 15 | +0.1% | +1.3% | +0.5% a +2.0% |
| Fearless | 14 | +0.6% | +0.8% | +0.0% a +2.2% |


### Personagens dentro do time da própria facção

| # | Personagem | Facção | Custo | Índice sozinho (etapa 1) | Índice no time da facção | Diferença |
|---|---|---|---|---|---|---|
| 1 | `cannoneer` | Seasalt Crew | 4 | 1.30 | 1.28 | -0.01 |
| 2 | `feline_rogue` | Meowri | 3 | 0.98 | 1.21 | +0.22 |
| 3 | `pirate_captain` | Seasalt Crew | 4 | 1.03 | 1.18 | +0.15 |
| 4 | `feline_fighter` | Meowri | 2 | 1.00 | 1.17 | +0.17 |
| 5 | `huntress` | Frostborn Clans | 3 | 1.09 | 1.16 | +0.07 |
| 6 | `cowboy` | Wild West | 2 | 1.11 | 1.16 | +0.05 |
| 7 | `feline_swordsman` | Meowri | 2 | 1.02 | 1.15 | +0.12 |
| 8 | `archer` | Verdant Covenant | 2 | 1.05 | 1.13 | +0.09 |
| 9 | `feline_arcanist` | Meowri | 3 | 0.99 | 1.12 | +0.13 |
| 10 | `pirate_admiral` | Seasalt Crew | 4 | 1.12 | 1.12 | -0.00 |
| 11 | `bear_druid` | Verdant Covenant | 4 | 1.04 | 1.12 | +0.07 |
| 12 | `sheriff` | Wild West | 4 | 1.09 | 1.12 | +0.02 |
| 13 | `crossbowman` | Verdant Covenant | 3 | 1.07 | 1.11 | +0.04 |
| 14 | `troll` | Troll | 4 | 1.09 | 1.10 | +0.01 |
| 15 | `elf_archer` | High Elf | 2 | 1.05 | 1.10 | +0.05 |
| 16 | `ranger` | Verdant Covenant | 2 | 1.01 | 1.09 | +0.07 |
| 17 | `centaur_crossbow` | Centaur | 3 | 1.08 | 1.09 | +0.00 |
| 18 | `gunner` | Wild West | 3 | 1.06 | 1.08 | +0.03 |
| 19 | `elf_halberdier` | High Elf | 3 | 1.04 | 1.07 | +0.03 |
| 20 | `dark_elf_archer` | Dark Elf | 3 | 1.09 | 1.07 | -0.02 |
| 21 | `musketeer` | Dawnward Order | 3 | 1.11 | 1.07 | -0.05 |
| 22 | `elf_noble` | High Elf | 3 | 1.10 | 1.06 | -0.04 |
| 23 | `goblin_brute` | Goblin | 3 | 1.08 | 1.06 | -0.02 |
| 24 | `dark_elf_warrior` | Dark Elf | 3 | 1.03 | 1.06 | +0.03 |
| 25 | `viking` | Frostborn Clans | 3 | 1.01 | 1.06 | +0.05 |
| 26 | `berserker` | Frostborn Clans | 3 | 1.05 | 1.06 | +0.01 |
| 27 | `mountain_troll` | Troll | 4 | 1.07 | 1.06 | -0.02 |
| 28 | `goblin_archer` | Goblin | 2 | 1.03 | 1.06 | +0.03 |
| 29 | `cavalier` | Dawnward Order | 4 | 1.06 | 1.06 | -0.00 |
| 30 | `feline_drummer` | Meowri | 3 | 0.97 | 1.06 | +0.09 |
| 31 | `lancer` | Dawnward Order | 2 | 1.01 | 1.06 | +0.05 |
| 32 | `fighter` | Legends of the East | 2 | 1.07 | 1.05 | -0.02 |
| 33 | `swordsman` | Dawnward Order | 3 | 1.05 | 1.05 | -0.00 |
| 34 | `blackfang_guardian` | Dark Elf | 4 | 1.02 | 1.05 | +0.03 |
| 35 | `omnamusha` | Legends of the East | 3 | 1.02 | 1.05 | +0.03 |
| 36 | `shaman` | Frostborn Clans | 4 | 0.99 | 1.05 | +0.06 |
| 37 | `glutton` | Frostborn Clans | 3 | 1.01 | 1.05 | +0.04 |
| 38 | `orc_berserker` | Orc | 3 | 1.06 | 1.05 | -0.01 |
| 39 | `goblin_rider` | Goblin | 3 | 0.99 | 1.04 | +0.05 |
| 40 | `cave_troll` | Troll | 3 | 1.03 | 1.04 | +0.01 |
| 41 | `mage` | Arcane | 4 | 0.99 | 1.04 | +0.04 |
| 42 | `goblin_bomber` | Goblin | 3 | 1.02 | 1.03 | +0.01 |
| 43 | `shieldmaiden` | Frostborn Clans | 3 | 1.01 | 1.03 | +0.02 |
| 44 | `gladiator` | Dawnward Order | 3 | 0.99 | 1.03 | +0.04 |
| 45 | `ronin` | Legends of the East | 3 | 0.99 | 1.03 | +0.04 |
| 46 | `woodland_flailer` | Forest Elf | 3 | 1.04 | 1.03 | -0.01 |
| 47 | `duelist` | Dawnward Order | 3 | 1.01 | 1.03 | +0.01 |
| 48 | `elf_guardian` | High Elf | 3 | 1.00 | 1.03 | +0.03 |
| 49 | `warrior` | Dawnward Order | 2 | 1.02 | 1.03 | +0.00 |
| 50 | `woodland_scout` | Forest Elf | 3 | 1.04 | 1.03 | -0.01 |
| 51 | `samurai` | Legends of the East | 3 | 1.02 | 1.02 | +0.00 |
| 52 | `bastion` | Dawnward Order | 3 | 1.03 | 1.02 | -0.01 |
| 53 | `miner` | Wild West | 2 | 1.02 | 1.02 | +0.00 |
| 54 | `martial_artist` | Legends of the East | 2 | 1.03 | 1.02 | -0.01 |
| 55 | `woodland_lancer` | Forest Elf | 2 | 0.97 | 1.02 | +0.04 |
| 56 | `centaur_lancer` | Centaur | 4 | 1.03 | 1.02 | -0.02 |
| 57 | `shackled_pirate` | Seasalt Crew | 2 | 1.07 | 1.02 | -0.05 |
| 58 | `orc_fighter` | Orc | 3 | 0.94 | 1.01 | +0.08 |
| 59 | `woodland_predator` | Forest Elf | 3 | 1.01 | 1.01 | +0.01 |
| 60 | `kinoichi` | Legends of the East | 3 | 0.96 | 1.01 | +0.05 |
| 61 | `pirate` | Seasalt Crew | 2 | 0.97 | 1.01 | +0.03 |
| 62 | `sorceress` | Arcane | 4 | 0.97 | 1.00 | +0.03 |
| 63 | `goblin_king` | Goblin | 4 | 0.98 | 0.99 | +0.01 |
| 64 | `dark_elf_noble` | Dark Elf | 3 | 1.01 | 0.99 | -0.01 |
| 65 | `eagle_druid` | Verdant Covenant | 3 | 0.94 | 0.99 | +0.05 |
| 66 | `centaur_swordsman` | Centaur | 3 | 1.04 | 0.99 | -0.05 |
| 67 | `shinobi` | Legends of the East | 3 | 0.98 | 0.99 | +0.01 |
| 68 | `goblin_spearman` | Goblin | 2 | 0.98 | 0.98 | +0.00 |
| 69 | `bard` | Arcane | 3 | 0.97 | 0.98 | +0.01 |
| 70 | `dark_elf_mage` | Dark Elf | 4 | 0.98 | 0.98 | -0.01 |
| 71 | `priestess` | Arcane | 4 | 1.00 | 0.97 | -0.03 |
| 72 | `snow_troll` | Troll | 4 | 0.97 | 0.97 | -0.00 |
| 73 | `orc_warrior` | Orc | 3 | 0.98 | 0.97 | -0.01 |
| 74 | `shaolin` | Legends of the East | 3 | 1.01 | 0.96 | -0.05 |
| 75 | `sage` | Arcane | 3 | 0.95 | 0.95 | -0.00 |
| 76 | `elf_harpist` | High Elf | 4 | 0.96 | 0.94 | -0.02 |
