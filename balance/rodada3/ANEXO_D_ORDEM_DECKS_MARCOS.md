# Anexo D: ordem dos decks e dos marcos (proposta, 14/11)

Status: **proposta para aprovação do Carlos**. Ainda não está no pacote enviado.

## 1. Ordem dos decks (do mais fraco para o mais forte)
- A força vem da 1ª vitória mediana no simulador: quanto maior a run, mais fraco o deck.
- O Dawn Vanguard fica em 1º por decisão do Carlos.
- Em caso de empate, vem antes o deck que é liberado antes.

**Grand Union**
| # | Deck | ID | 1ª vitória (sim.) | Como libera |
|---|---|---|---|---|
| 1 | Dawn Vanguard | `vanguard` | 17 | inicial |
| 2 | Crossing Paths | `balanced` | 19 | inicial |
| 3 | Blades of the East | `blades` | 17 | 1ª fusão |
| 4 | Trigger Law | `outlaws` | 16 | inicial |
| 5 | Executioners | `executioners` | 15 | derrotar um elite |
| 6 | Earthquake | `quake` | 14 | Boss da Grand Union no mapa 1 |
| 7 | Keen Edge | `keen` | 14 | Boss Blackfang no mapa 2 |
| 8 | Salt Crew | `corsair` | 13 | recrutar 3 cartas |
| 9 | Fortress | `fortress` | 12 | 2 ordens da mesma ordem num mapa |
| 10 | Verdant Circle | `verdant` | 12 | 3 unidades fundidas |
| 11 | Arcane Circle | `arcane` | 11 | Boss Dawncrest no mapa 2 |
| 12 | Winds of Chance | `swift` | 10 | Boss Titans no mapa 2 |
| 13 | War Choir | `astral` | 9 | Boss da Grand Union no mapa 2 |
| 14 | Northern Blood | `north` | 9 | árvore 25% |
| 15 | Fireline | `fireline` | 7 | 2 entradas do mapa 3 |

**Blackfang** (aparece depois da revelação, em bloco próprio)
| # | Deck | ID | 1ª vitória (sim.) |
|---|---|---|---|
| 16 | Greenskins | `greenskins` | 19 |
| 17 | Blackfang War | `blackfang_war` | 14 |
| 18 | Goblin Horde | `goblin_horde` | 13 |
| 19 | Dark Court | `dark_court` | 9 |

**Dawncrest** (aparece depois da revelação, em bloco próprio)
| # | Deck | ID | 1ª vitória (sim.) |
|---|---|---|---|
| 20 | Dawncrest Choir | `dawncrest_choir` | 18 |
| 21 | High Court | `high_court` | 15 |
| 22 | Centaur Charge | `centaur_charge` | 13 |
| 23 | Meowri Band | `meowri_band` | 12 |
| 24 | Forest Guard | `forest_guard` | 9 |

## 2. Ajuste sugerido nas sequências das ordens (para liberar do mais fraco ao mais forte)
**Blackfang:** troca só os dois últimos itens.
| Marco | Antes | Sugestão |
|---|---|---|
| Vencer uma run com Blackfang War | deck Dark Court | **booster Shadows & Stone** |
| Vencer uma run com Goblin Horde | booster Shadows & Stone | **deck Dark Court** |

Sequência final: Greenskins (19) → Blackfang War (14) → Goblin Horde (13) → Dark Court (9).

**Dawncrest:** reordena a sequência.
| Marco | Antes | Sugestão |
|---|---|---|
| Derrotar o True Boss Dawncrest | deck Meowri Band | **deck High Court** |
| Derrotar os Bosses Dawncrest nos 3 mapas | deck High Court | **deck Meowri Band** |
| Vencer uma run com High Court | booster Elven Courts | **deck Centaur Charge** |
| Vencer uma run com Meowri Band | deck Centaur Charge | **booster Elven Courts** |
| Vencer uma run com Centaur Charge | deck Forest Guard | deck Forest Guard (igual) |

Sequência final: Dawncrest Choir (18) → High Court (15) → Centaur Charge (13) → Meowri Band (12) → Forest Guard (9).

## 3. Ordem provável dos marcos (102)
- A ordem segue a liberação provável para um jogador novo, já com a trava de mapas.
- A última coluna mostra em que run o Carlos cumpriu o marco na campanha 1 (sem a trava). "novo" é marco que ainda não existe. "—" é marco ainda não cumprido.
- "6*": cumprido na run 6 da campanha 1, mas deve sair antes, porque é marco de mapa 1.
- As tabelas abaixo mostram as sequências das ordens **antes** do ajuste da seção 2.

### Fase 1: mapa 1 (runs 1 a 3, aprox.)
| # | ID | Marco | Libera | Saiu na run (campanha 1) |
|---|---|---|---|---|
| 1 | `firstSteps` | Vencer o 1º confronto | booster Dawnward Order | 1 |
| 2 | `fusion_first` | Realizar a 1ª fusão | deck Blades of the East | 1 |
| 3 | `training_first` | Fazer um combate de treinamento | relíquia Lucky Charm | qualquer |
| 4 | `elite` | Derrotar um elite | deck Executioners | 2 |
| 5 | `spender` | Gastar 30 de ouro em uma run | booster Frontier & Free Seas | 2 |
| 6 | `sweeps` | Vencer 3 confrontos sem perder round em uma run | booster Iron Wall | 2 |
| 7 | `events` | Resolver 3 eventos em uma run | booster Legends of the East | 6* |
| 8 | `recruit_three` | Recrutar 3 cartas em uma run | deck Salt Crew | novo |
| 9 | `card_level2` | Levar uma carta ao nível 2 | booster Heavy Hitters | novo |
| 10 | `order_pair` | Vencer as 2 lutas de ordem de uma mesma ordem em um mapa | deck Fortress | novo |
| 11 | `shop_relics_two` | Comprar 2 relíquias na loja em uma run | relíquia Merchant's Coin | novo |
| 12 | `spender_100` | Gastar 100 de ouro em uma run | booster Sharpshooters | novo |
| 13 | `elites_three` | Vencer 3 elites em uma run | booster Hunters & Raiders | novo |

### Fase 2: boss do mapa 1 (runs 3 a 8, aprox.)
| # | ID | Marco | Libera | Saiu na run (campanha 1) |
|---|---|---|---|---|
| 14 | `boss` | Derrotar o boss do mapa 1 | libera o mapa 2 | 6 |
| 15 | `boss_blackfang_map1` | Derrotar o Boss ????? (Blackfang) no mapa 1 | relíquia Profane Idol | 6 |
| 16 | `boss_dawncrest_map1` | Derrotar o Boss ????? (Dawncrest) no mapa 1 | relíquia Mercenary Contract | 7 |
| 17 | `boss_monsters_map1` | Derrotar o Boss Titans no mapa 1 | relíquia Dormant Sword | 8 |
| 18 | `boss_ironbound_map1` | Derrotar o Boss da Grand Union no mapa 1 | deck Earthquake | 9 |

### Fase 3: mapa 2 (runs 6 a 10, aprox.)
| # | ID | Marco | Libera | Saiu na run (campanha 1) |
|---|---|---|---|---|
| 19 | `raid_win` | Vencer uma Raid | booster Northern Wilds | novo |
| 20 | `bag_full` | Preencher toda a bolsa de relíquias | booster Verdant & Arcane | 9 |
| 21 | `fusion_three` | Terminar um confronto com 3 unidades fundidas | deck Verdant Circle | 9 |
| 22 | `sweeps_six` | Vencer 6 confrontos sem perder round em uma run | booster Mystic Support | novo |
| 23 | `custom_build` | Montar um deck custom completo | relíquia Captain's Standard | — |
| 24 | `custom_five` | Concluir 5 nós no mapa 1 com deck custom | relíquia Raider's Compass | — |
| 25 | `map2boss` | Derrotar o boss do mapa 2 | libera o mapa 3 | 10 |
| 26 | `boss_ironbound_map2` | Derrotar o Boss da Grand Union no mapa 2 | deck War Choir | 10 |
| 27 | `boss_blackfang_map2` | Derrotar o Boss ????? (Blackfang) no mapa 2 | deck Keen Edge | 11 |
| 28 | `boss_dawncrest_map2` | Derrotar o Boss ????? (Dawncrest) no mapa 2 | deck Arcane Circle | — |
| 29 | `boss_monsters_map2` | Derrotar o Boss Titans no mapa 2 | deck Winds of Chance | — |

### Fase 4: mapa 3 e 1ª vitória (runs 10 a 15, aprox.)
| # | ID | Marco | Libera | Saiu na run (campanha 1) |
|---|---|---|---|---|
| 30 | `map3_entries` | Vencer as 2 lutas de entrada do mapa 3 | deck Fireline | 10 |
| 31 | `xp_forty` | Ganhar 40 de XP da árvore em uma run | relíquia Apprentice's Grimoire | 10 |
| 32 | `recruits_map3` | Vencer um confronto do mapa 3 com 2 cartas recrutadas em campo | relíquia Traveler's Mirror | novo |
| 33 | `tree_25` | Adquirir 25% dos nós da árvore | deck Northern Blood | ~11 |
| 34 | `run_first_win` | Vencer uma run pela primeira vez | — | 11 |

### Fase 5: pós-jogo, revelação das ordens e vitórias com decks (runs 11 a 25, aprox.)
| # | ID | Marco | Libera | Saiu na run (campanha 1) |
|---|---|---|---|---|
| 35 | `boss_blackfang_map3` | Derrotar o Boss Blackfang no mapa 3 | revela Blackfang + deck Greenskins | 11 |
| 36 | `boss_dawncrest_map3` | Derrotar o Boss Dawncrest no mapa 3 | revela Dawncrest + deck Dawncrest Choir | — |
| 37 | `boss_ironbound_map3` | Derrotar o Boss da Grand Union no mapa 3 | — | — |
| 38 | `boss_monsters_map3` | Derrotar o Boss Titans no mapa 3 | — | — |
| 39 | `challenges_1` | Vencer uma run com 1 Desafio ativo | — | 12 |
| 40 | `win_deck_vanguard` | Vencer uma run com Dawn Vanguard | — | 12 |
| 41 | `win_deck_balanced` | Vencer uma run com Crossing Paths | — | — |
| 42 | `win_deck_outlaws` | Vencer uma run com Trigger Law | — | — |
| 43 | `win_deck_blades` | Vencer uma run com Blades of the East | — | — |
| 44 | `win_deck_executioners` | Vencer uma run com Executioners | — | — |
| 45 | `win_deck_corsair` | Vencer uma run com Salt Crew | — | — |
| 46 | `win_deck_fortress` | Vencer uma run com Fortress | — | — |
| 47 | `win_deck_quake` | Vencer uma run com Earthquake | — | — |
| 48 | `win_deck_verdant` | Vencer uma run com Verdant Circle | — | — |
| 49 | `win_deck_keen` | Vencer uma run com Keen Edge | — | — |
| 50 | `win_deck_arcane` | Vencer uma run com Arcane Circle | — | — |
| 51 | `win_deck_swift` | Vencer uma run com Winds of Chance | — | — |
| 52 | `win_deck_astral` | Vencer uma run com War Choir | — | — |
| 53 | `win_deck_north` | Vencer uma run com Northern Blood | — | — |
| 54 | `win_deck_fireline` | Vencer uma run com Fireline | — | 11 |
| 55 | `win_deck_greenskins` | Vencer uma run com Greenskins | booster Goblin Raiders | — |
| 56 | `win_deck_dawncrest_choir` | Vencer uma run com Dawncrest Choir | booster Wild Hearts | — |
| 57 | `challenges_3` | Vencer uma run com 3 Desafios ativos | — | — |

### Fase 6: True Bosses e as ordens completas (runs 15 a 35, aprox.)
| # | ID | Marco | Libera | Saiu na run (campanha 1) |
|---|---|---|---|---|
| 58 | `true_blackfang` | Derrotar o True Boss Blackfang | deck Blackfang War (+ cartas de boss) | 11 |
| 59 | `true_dawncrest` | Derrotar o True Boss Dawncrest | deck Meowri Band (+ cartas de boss) | — |
| 60 | `true_ironbound` | Derrotar o True Boss da Grand Union | — (cartas de boss) | — |
| 61 | `true_monsters` | Derrotar o True Boss Titans | — | — |
| 62 | `boss_blackfang_all` | Derrotar os Bosses Blackfang nos 3 mapas em uma run | deck Goblin Horde | — |
| 63 | `boss_dawncrest_all` | Derrotar os Bosses Dawncrest nos 3 mapas em uma run | deck High Court | — |
| 64 | `boss_ironbound_all` | Derrotar os Bosses da Grand Union nos 3 mapas em uma run | — | — |
| 65 | `boss_monsters_all` | Derrotar os Bosses Titans nos 3 mapas em uma run | — | — |
| 66 | `win_deck_goblin_horde` | Vencer uma run com Goblin Horde | booster Shadows & Stone | — |
| 67 | `win_deck_high_court` | Vencer uma run com High Court | booster Elven Courts | — |
| 68 | `win_deck_blackfang_war` | Vencer uma run com Blackfang War | deck Dark Court | — |
| 69 | `win_deck_meowri_band` | Vencer uma run com Meowri Band | deck Centaur Charge | — |
| 70 | `win_deck_centaur_charge` | Vencer uma run com Centaur Charge | deck Forest Guard | — |
| 71 | `win_deck_dark_court` | Vencer uma run com Dark Court | — | — |
| 72 | `win_deck_forest_guard` | Vencer uma run com Forest Guard | — | — |
| 73 | `challenges_5` | Vencer uma run com 5 Desafios ativos | — | — |
| 74 | `advantages_5` | Ativar 5 Vantagens juntas | — | — |
| 75 | `tree_50` | Adquirir 50% dos nós da árvore | — | — |
| 76 | `custom_win` | Vencer os 3 mapas com um deck custom | — | — |

### Fase 7: coleção e conclusão (runs 30+)
| # | ID | Marco | Libera | Saiu na run (campanha 1) |
|---|---|---|---|---|
| 77 | `collection_Dawnward Order` | Completar a coleção de Dawnward Order | — | — |
| 78 | `collection_Legends of the East` | Completar a coleção de Legends of the East | — | — |
| 79 | `collection_Wild West` | Completar a coleção de Wild West | — | — |
| 80 | `collection_Seasalt Crew` | Completar a coleção de Seasalt Crew | — | — |
| 81 | `collection_Verdant Covenant` | Completar a coleção de Verdant Covenant | — | — |
| 82 | `collection_Arcane` | Completar a coleção de Arcane | — | — |
| 83 | `collection_Frostborn Clans` | Completar a coleção de Frostborn Clans | — | — |
| 84 | `collection_Goblin` | Completar a coleção de Goblin | — | — |
| 85 | `collection_Orc` | Completar a coleção de Orc | — | — |
| 86 | `collection_Troll` | Completar a coleção de Troll | — | — |
| 87 | `collection_Dark Elf` | Completar a coleção de Dark Elf | — | — |
| 88 | `collection_Meowri` | Completar a coleção de Meowri | — | — |
| 89 | `collection_High Elf` | Completar a coleção de High Elf | — | — |
| 90 | `collection_Forest Elf` | Completar a coleção de Forest Elf | — | — |
| 91 | `collection_Fairy` | Completar a coleção de Fairy | — | — |
| 92 | `collection_Centaur` | Completar a coleção de Centaur | — | — |
| 93 | `collection_relics` | Completar a coleção de relíquias | — | — |
| 94 | `titans_all` | Derrotar os nove Titans diferentes | — | — |
| 95 | `tree_75` | Adquirir 75% dos nós da árvore | — | — |
| 96 | `advantages_10` | Ativar 10 Vantagens juntas | — | — |
| 97 | `challenges_10` | Vencer uma run com 10 Desafios ativos | — | — |
| 98 | `decks_all` | Vencer uma run com cada deck emprestado | — | — |
| 99 | `tree_100` | Adquirir 100% dos nós da árvore | — | — |
| 100 | `advantages_15` | Ativar 15 Vantagens juntas | — | — |
| 101 | `challenges_15` | Vencer uma run com 15 Desafios ativos | — | — |
| 102 | `secret_boss` | Derrotar o Secret Boss (fora da integração) | — | — |
