# Carreira nova v57-R3: análise das runs 1 a 9 (16/11)

Fonte: os saves da carreira em `balance/playtests/carreira_v57_R3/`. O último save é cumulativo e traz as 9 runs. Build `v57-R3`, já com a Review R3 implementada pelo ChatGPT.
Método: só leitura dos saves, sem simulação.

## 1. Resumo
- **1ª vitória na run 7.** Depois de 2 vitórias de capítulo (runs 2 e 6) e 4 derrotas.
- **A árvore cresce cerca de 2× mais rápido que na curva do simulador.**
- **Quase todo o Review R3 funciona como pedido.** A exceção é a raridade das relíquias por mapa, que não está sendo aplicada nas ofertas de relíquia (seção 5).
- **Os marcos liberam rápido demais no começo:** 8 dos 10 boosters e 3 decks saíram nas runs 1 e 2.
- **Com Blackfang nos 3 mapas, a ordem libera 3 decks na mesma run.**

## 2. As runs
| Run | Deck | Desafio | Resultado | Onde terminou | Nós | Árvore no início | XP (ganho/gasto/perdido) | Diamantes |
|---|---|---|---|---|---|---|---|---|
| 1 | Dawn Vanguard | — | derrota | elite do mapa 1 (Arcane Circle, 1×3) | 12 | 0 | 9 / 8 / 1 | 9 |
| 2 | Crossing Paths | — | **vitória de capítulo** | boss do mapa 1 (libera o mapa 2) | 15 | 1 | 18 / 16 / 2 | 16 |
| 3 | Blades of the East | — | derrota | Raid do mapa 2 (0×5) | 25 | 3 | 34 / 32 / 2 | 26 |
| 4 | Trigger Law | — | derrota | 1ª ordem do mapa 2 (Sentinels, 0×3) | 18 | 7 | 21 / 16 / 5 | 16 |
| 5 | Executioners | — | derrota | boss do mapa 1 (Blackfang, 1×4) | 14 | 9 | 11 / 8 / 3 | 13 |
| 6 | Fortress | — | **vitória de capítulo** | boss do mapa 2 (libera o mapa 3) | 30 | 10 | 47 / 32 / 15 | 29 |
| 7 | Keen Edge | — | **vitória** | boss da Grand Union no mapa 3 (4×1) | 45 | 12 | 99 / 80 / 19 | 49 |
| 8 | Verdant Circle | Reforços Inimigos | derrota | 2ª ordem do mapa 1 (Woodlands, 0×3) | 9 | 17 | 7 / 0 / 7 | 7 |
| 9 | deck custom | Bagagem Limitada | **vitória** | True Boss Blackfang (3×3, formas 1 e 2) | 45 | 17 | 100 / 72 / 28 | 44 |

O XP perdido no fim das runs **não é bug.** As janelas abriram normalmente, inclusive depois do boss do mapa 2 na vitória de capítulo da run 6. O que sobrou era menos que o preço do próximo nó (16 ou 24).

## 3. Comparação com as metas
| Meta | Carreira v57-R3 | Situação |
|---|---|---|
| 1ª vitória: mediana na run 15 (p10 = 8, p90 = 21) | run 7 | ⚠️ antes do p10 |
| Árvore no início da run (simulador: run 5 ≈ 3 nós, run 8 ≈ 7, run 10 ≈ 10) | run 5 = 9, run 8 = 17 | ⚠️ cerca de 2× mais rápida |
| Com a trava de mapas, a vitória mais cedo possível é na run 3 | 1ª vitória na run 7 | a trava segurou 4 runs |

**Como ler esses números**
1. É a 3ª campanha do Carlos. A meta foi calibrada com o jogador simulado, que não aprende.
2. Os decks fortes (Fireline, War Choir, Northern Blood) foram liberados **durante** a run 7. Não influenciaram a 1ª vitória, como planejado. A vitória veio com a Keen Edge, um deck médio.
3. **A árvore é o ponto mais claro.** Em runs que vão longe, o XP por run é alto (34, 47, 99, 100), e o jogador chega à run 7 com 12 nós. O simulador chega a 12 nós só por volta da run 11.
4. A dificuldade de chegar à 1ª vitória vem de uma combinação: a árvore acelerada, o jogador experiente e o mapa 3 sem resistência (seção 4).

## 4. Dificuldade por tipo de luta (todas as runs)
| Mapa | Tipo | Lutas | Apertadas | Derrotas |
|---|---|---|---|---|
| 1 | entrada / comum | 40 | 5 | 0 |
| 1 | elite | 12 | 4 | 1 |
| 1 | ordem | 16 | 5 | 1 (com Reforços) |
| 1 | boss | 6 | **4** | 1 |
| 1 | raid / titã | 3 | 3 | 0 |
| 2 | entrada / comum | 20 | 3 | 0 |
| 2 | elite | 6 | 1 | 0 |
| 2 | ordem | 7 | 3 | 1 |
| 2 | raid | 1 | 1 | 1 |
| 2 | boss | 3 | 2 | 0 |
| 3 | todas | 18 | 6 | 0 |

- **Mapa 1:** o boss segue como a barreira principal, com 4 de 6 lutas apertadas e 1 derrota.
- **Mapa 2:** as derrotas vêm das ordens e das raids. As lutas comuns não pesam (0 apertadas em 10).
- **Mapa 3:** só 2 runs chegaram, e as duas venceram, sem nenhuma derrota.

## 5. Conferência do Review R3 no jogo
| Item | Situação | Evidência |
|---|---|---|
| Trava de mapas e vitória de capítulo | ✅ | runs 1 e 2 só no mapa 1. Vitórias de capítulo nas runs 2 (libera o mapa 2) e 6 (libera o mapa 3) |
| Decks iniciais (Dawn Vanguard, Crossing Paths, Trigger Law) | ✅ | |
| Marcos liberam 1 item cada | ✅ | linha do tempo dos desbloqueios |
| Revelação e sequência de Blackfang | ✅ | run 9: revela + Greenskins, True Boss → Blackfang War + 4 cartas de boss, 3 mapas → Goblin Horde |
| Drop só de cartas e relíquias do inimigo enfrentado | ✅ | 18 de 19 drops conferidos. Em 1 caso (Archer do deck War Choir), a carta não estava em campo, mas faz parte do deck |
| "Descoberta" só com relíquias do inimigo | ✅ | todas as escolhas de descoberta só tinham relíquias daquele inimigo |
| Reforços Inimigos | ✅ | run 8: 2v3, 3v4, 4v5 e 5v6 em todas as lutas comuns e elites |
| Bagagem Limitada | ✅ | run 9: bolsa com 11 casas |
| Ultras dos inimigos só no mapa 3 e em bosses | ✅ | 7 ultras, todas em bosses ou em elites do mapa 3 |
| **Raridade das relíquias por mapa** | ❌ **não aplicada** | Ofertas de relíquia do mapa 1 (nós de relíquia e eventos): 36% comuns, 36% incomuns, 20% raras e **8% ultras** (5 ofertas: Siege Sling 2×, Arcane Echo 2× e Everlasting Spark). O pedido era 70/22/8/**0**. Na loja do mapa 1 a distribuição está mais perto (74/16/10/0) |
| Recrutas com upgrade por mapa | ❓ não dá para conferir | `recruitOffer` não grava o nível das cartas oferecidas |

## 6. Ritmo de desbloqueio dos marcos
| Run | O que liberou |
|---|---|
| 1 | decks Blades, Executioners e Fortress. Boosters Dawnward Order, Iron Wall e **Mystic Support** |
| 2 | boosters Frontier & Free Seas, **Hunters & Raiders**, **Sharpshooters** e **Heavy Hitters**. Relíquias Merchant's Coin e Profane Idol. Mapa 2 |
| 3 | relíquia Mercenary Contract |
| 4 | booster Northern Wilds. Relíquia Dormant Sword |
| 5 | booster Legends of the East |
| 6 | decks Verdant Circle e Keen Edge. Booster Verdant & Arcane. Relíquia Grimoire. Mapa 3 |
| 7 | decks War Choir, Northern Blood, Fireline e Salt Crew (todos na run da 1ª vitória) |
| 9 | relíquia Raider's Compass. Decks Greenskins, Blackfang War e Goblin Horde. 4 cartas de boss |

**Pontos para decisão**
1. **Marcos mais fáceis do que o estimado.** "6 vitórias sem perder round", "2 ordens da mesma ordem", "3 elites", "gastar 100", "comprar 2 relíquias" e "carta no nível 2" saíram todos nas runs 1 e 2. Com isso, 8 dos 10 boosters estavam liberados na run 2.
   - **Opções:** subir os limites (por exemplo, 8 vitórias sem perder round, 5 elites, gastar 150), ou mover esses boosters para marcos mais difíceis.
2. **Marcos que saíram tarde:** "3 eventos" (run 5) e "recrutar 3 cartas" (run 7). Mostram que você evita eventos e recrutamento. Isso combina com a ideia dos recrutas com upgrade, que ainda não deu para conferir.
3. **3 decks de Blackfang na mesma run.** Seguindo Blackfang nos 3 mapas e vencendo o True Boss, a run cumpre de uma vez "boss no mapa 3", "True Boss" e "bosses nos 3 mapas".
   - **Opção:** trocar "bosses nos 3 mapas" por um marco que exija outra run (por exemplo, "vencer uma run com Greenskins") e mover o deck.
   - O mesmo vai acontecer com Dawncrest.

## 7. Economia (só registro, para a economia permanente)
- **Diamantes recebidos nas runs:** 209 no total (9, 16, 26, 16, 13, 29, 49, 7 e 44). Saldo atual: 138.
- **Compras na loja de diamantes:** 13 tipos de carta (44 cópias) e 2 relíquias, para o deck custom.
- **Catálogo:** 12 cartas e 18 relíquias liberadas para compra, mais as 4 cartas de boss de Blackfang.

## 8. Pedidos ao ChatGPT que saem desta análise
1. **Bug:** aplicar a raridade por mapa (70/22/8/0, 50/30/15/5, 35/30/25/10) também nas ofertas dos **nós de relíquia e dos eventos**, não só na loja. Hoje aparecem ultras no mapa 1.
2. **Save:** gravar em `recruitOffer` o nível de upgrade de cada carta oferecida, para conferir os recrutas com upgrade.

Os pontos 1 e 3 da seção 6 e o ritmo da árvore dependem de decisão do Carlos.
