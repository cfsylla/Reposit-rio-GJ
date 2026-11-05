> Histórico da v55. As condições de desbloqueio e recompensas foram substituídas pelas regras de `PROGRESSION_V56.md`.

# Ironbound e cartas de bosses — v55

Publicado com atributos provisórios para rebalanceamento. Os IDs `boss_*` são exclusivos de inimigos; as cartas `hero_*` possuem dados independentes.

## Encontros

Sem duas condições cumpridas de Titans, Blackfang ou Dawncrest, o boss será um dos sete líderes da Ironbound, evitando repetir o líder do mapa anterior. Se os bosses dos mapas 1 e 2 forem Ironbound e nenhuma outra ordem qualificar no mapa 3, o Primeiro Viajante será o True Boss. Forma I: duas vitórias. Forma II: raid com PV persistente, cinco derrotas totais entre formas.

## Cartas

Derrotar o respectivo boss libera a compra da carta na coleção, uma única vez. Usa o preço existente de carta ultra rara; comprar concede uma cópia. Novas runs registram os desbloqueios disponíveis ao iniciar. Titans, minions e segundas formas não têm cartas. Nenhuma cópia gratuita é concedida.

Todas as novas cartas: ultra raras, habilidade ativa a cada 10 s; melhorias e fusão seguem as regras existentes.

| ID | Carta | Facção | Custo | PV | ATQ | DEF | Ataques/s | Habilidade |
|---|---|---|---:|---:|---:|---:|---:|---|
| hero_goblin | Rei Goblin | Goblin / Unyielding / Protector | 3 | 230 | 25 | 10 | 0.83 | Dispara três tiros no alvo, cada um causando 65% ATQ. |
| hero_troll | Rei Troll | Troll / Devastator / Impulsive | 3 | 280 | 30 | 17 | 0.83 | Atinge inimigos a até 70 do alvo por 140% ATQ e atordoa por 0,6s. |
| hero_orc | Imperador Orc | Orc / Devastator / Fearless | 3 | 230 | 30 | 10 | 0.83 | Golpeia o alvo por 180% ATQ e inimigos a até 70 dele por 90% ATQ. |
| hero_meowri | Rainha Meowri | Meowri / Devastator / Fearless | 3 | 230 | 25 | 10 | 0.83 | Dispara três tiros no alvo, cada um causando 65% ATQ. |
| hero_centaur | Líder Centauro | Centaur / Devastator / Audacious | 3 | 230 | 30 | 10 | 0.83 | Golpeia o alvo por 180% ATQ e inimigos a até 70 dele por 90% ATQ. |
| hero_highelf | Rei High Elf | High Elf / Predator / Ruthless | 3 | 190 | 30 | 10 | 0.83 | Golpeia por 160% ATQ e cura o aliado mais ferido em 8% PV máximo. |
| hero_forestelf | Rei Forest Elf | Forest Elf / Lookout / Audacious | 3 | 230 | 30 | 10 | 0.83 | Atinge inimigos a até 70 do alvo por 100% ATQ e enraíza por 1,2s. |
| hero_darkelf | Rei Dark Elf | Dark Elf / Predator / Audacious | 4 | 230 | 30 | 10 | 0.83 | Golpeia o alvo por 180% ATQ e inimigos a até 70 dele por 90% ATQ. |
| hero_fairy | Rainha Fada | Fairy / Trailblazer / Patient | 4 | 190 | 18 | 10 | 0.83 | Cura e protege os dois aliados mais feridos em 10% PV máximo; escudos duram 4s. |
| hero_ib_marshal | Marechal | Dawnward Order / Sentinel / Protector | 3 | 280 | 30 | 22 | 0.83 | Golpeia por 160% ATQ e protege os dois aliados mais feridos com escudo de 10% PV máximo por 4s. |
| hero_ib_shogun | Xogum | Legends of the East / Devastator / Impulsive | 3 | 230 | 30 | 10 | 0.83 | Golpeia o alvo por 180% ATQ e inimigos a até 70 dele por 90% ATQ. |
| hero_ib_jarl | Jarl Rúnico | Frostborn Clans / Devastator / Fearless | 3 | 280 | 30 | 17 | 0.83 | Atinge inimigos a até 70 do alvo por 140% ATQ e atordoa por 0,6s. |
| hero_ib_gunslinger | Lenda da Fronteira | Wild West / Trailblazer / Ruthless | 3 | 230 | 25 | 10 | 0.83 | Dispara três tiros no alvo, cada um causando 65% ATQ. |
| hero_ib_piratequeen | Rainha Pirata | Seasalt Crew / Sentinel / Patient | 3 | 230 | 30 | 10 | 0.83 | Golpeia o alvo por 180% ATQ e inimigos a até 70 dele por 90% ATQ. |
| hero_ib_oracle | Grande Oráculo | Arcane / Unyielding / Protector | 3 | 190 | 30 | 10 | 0.83 | Golpeia por 160% ATQ e cura o aliado mais ferido em 8% PV máximo. |
| hero_ib_hartlord | Senhor dos Cervos | Verdant Covenant / Trailblazer / Protector | 3 | 230 | 30 | 10 | 0.83 | Atinge inimigos a até 70 do alvo por 100% ATQ e enraíza por 1,2s. |
| hero_ib_wayfarer | Primeiro Viajante | Dawnward Order / Devastator / Fearless | 4 | 190 | 30 | 10 | 0.83 | Golpeia por 160% ATQ e cura o aliado mais ferido em 8% PV máximo. |

## Validação

Testes: `tests/ironbound-v55.cjs`, suite de balanceamento existente, integração CP2, playtest P1/P3, continuidade de menus, memória de inimigos e 119 retratos transparentes. Verificação visual: 320×568, 360×640, 390×844 e 430×932, português/inglês, formas I e II, detalhe da carta.
