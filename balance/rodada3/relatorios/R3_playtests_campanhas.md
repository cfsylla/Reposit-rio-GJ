# Playtests do jogo base: análise das campanhas e runs (22/11/2026)

**Para que serve:** base para balancear o que ficou pendente: endgame, economia permanente, Desafios e Vantagens.
**Fonte:** o save mais recente de cada campanha, em `balance/playtests/`. Só leitura dos saves, sem simulação.
**Dados completos:** `R3_playtests_campanhas.xlsx`, com as abas Campanhas, Runs (uma linha por run, 37 colunas), Por tipo de fim e Economia. As médias e os custos são calculados por fórmula.

**Tempo ativo:** é a soma dos intervalos entre ações registradas na run, com cada intervalo limitado a 5 minutos. Assim, pausas e noites com a run aberta não entram. Lutas longas sem nenhuma ação registrada podem ficar subcontadas.

## 1. Campanhas
| | Versão | Runs | Vitórias | 1ª vitória | Horas até a 1ª vitória | Horas no total | Árvore no fim | Decks | Marcos | Diamantes (runs + marcos) | Saldo |
|---|---|---|---|---|---|---|---|---|---|---|---|
| H1 | pré-CP4 (CP2/CP3) | 6 | 1 | run 5 | 1,3 | 1,4 | 4 | 18 | 18 | 60 + 18 | 78 |
| H2 | pré-CP4 (CP3) | 4 | 1 | run 4 | 2,8 | 2,8 | 28 | 18 | 25 | 169 + 25 | 194 |
| H3 | pré-CP4 (CP3) | 5 | 0 | — | — | 0,8 | 4 | 11 | 11 | 50 + 11 | 61 |
| **C1** | CP4 (v56) | 13 | 3 | **run 11** | **3,4** | 5,1 | 25 | 20 | 31 | 268 + 31 | 299 |
| C2 | CP4 (v56), new game | 3 | 0 | — | — | 0,9 | 9 | 13 | 14 | 67 + 14 | 81 |
| **C3** | v57-R3 | 9 | 2 | **run 7** | **2,4** | 3,3 | 21 | 15 | 36 | 209 + 36 | 138 (gastou ~107) |
| **C4** | v57-R3 + bosses 2/3 | 7 | 1 | **run 7** | **2,8** | 2,8 | 21 | 13 | 33 | 176 + 33 | 209 |

- **Como ler as campanhas:**
  - H1 a H3 são de versões antigas, com save simplificado (sem árvore por run e sem a luta da derrota), e servem só de histórico;
  - **C1, C3 e C4 são a referência do jogo base atual;**
  - C2 tem só 3 runs.
- **Compras com diamante:** só na C3 (13 tipos de carta, 44 cópias e 2 relíquias, para o deck custom). Nas outras campanhas o saldo é igual a tudo o que foi ganho.

## 2. Runs das campanhas de referência
Árvore = nós da árvore no início da run. Diamantes = os da tela de fim de run, sem contar os marcos.

**C1 (CP4)**
| Run | Deck | Onde terminou | Nós | XP ganho | Diamantes | Minutos |
|---|---|---|---|---|---|---|
| 1 | Dawn Vanguard | mapa 1, depois do nó 4 | 4 | 2 | 2 | 6 |
| 2 | Winds of Chance | mapa 1, nó 7 | 7 | 6 | 6 | 6 |
| 3 | Crossing Paths | mapa 1, nó 9 | 9 | 6 | 6 | 13 |
| 4 | Trigger Law | mapa 1, nó 4 | 4 | 2 | 2 | 5 |
| 5 | Blades of the East | boss do mapa 1 | 14 | 11 | 11 | 14 |
| 6 | Executioners | mapa 2, nó 6 | 21 | 24 | 17 | 21 |
| 7 | Blades of the East | entrada do mapa 2 | 15 | 15 | 14 | 16 |
| 8 | Verdant Circle | mapa 2, nó 10 | 25 | 31 | 22 | 22 |
| 9 | War Choir | mapa 2, nó 3 | 18 | 18 | 16 | 19 |
| 10 | Keen Edge | mapa 3, nó 11 | 41 | 76 | 41 | 46 |
| 11 | Fireline | **vitória** (True Boss Dark Elf, 3×3) | 45 | 106 | 47 | 34 |
| 12 | Dawn Vanguard (Reforços*) | vitória | 45 | 93 | 42 | 55 |
| 13 | Dark Court (Reforços* + Veteranos) | vitória | 45 | 91 | 42 | 49 |

\* Na v56, o Reforços Inimigos não tinha efeito (bug).

**C3 (v57-R3)**
| Run | Deck | Árvore | Onde terminou | Nós | XP ganho | Diamantes | Minutos |
|---|---|---|---|---|---|---|---|
| 1 | Dawn Vanguard | 0 | elite do mapa 1 (Arcane Circle, 1×3) | 12 | 9 | 9 | 15 |
| 2 | Crossing Paths | 1 | **vitória de capítulo** (libera o mapa 2) | 15 | 18 | 16 | 13 |
| 3 | Blades of the East | 3 | raid do mapa 2 (0×5) | 25 | 34 | 26 | 20 |
| 4 | Trigger Law | 7 | ordem do mapa 2 (Sentinels, 0×3) | 18 | 21 | 16 | 14 |
| 5 | Executioners | 9 | boss do mapa 1 (Blackfang, 1×4) | 14 | 11 | 13 | 11 |
| 6 | Fortress | 10 | **vitória de capítulo** (libera o mapa 3) | 30 | 47 | 29 | 33 |
| 7 | Keen Edge | 12 | **vitória** | 45 | 99 | 49 | 38 |
| 8 | Verdant Circle (Reforços) | 17 | ordem do mapa 1 (Woodlands, 0×3) | 9 | 7 | 7 | 8 |
| 9 | deck custom (Bagagem Limitada) | 17 | **vitória** (True Boss Blackfang, 3×3) | 45 | 100 | 44 | 45 |

**C4 (v57-R3 com bosses dos mapas 2 e 3 mais fortes)**
| Run | Deck | Árvore | Onde terminou | Nós | XP ganho | Diamantes | Minutos |
|---|---|---|---|---|---|---|---|
| 1 | Dawn Vanguard | 0 | **vitória de capítulo** (boss Dawncrest, 4×3) | 15 | 18 | 14 | 10 |
| 2 | Crossing Paths | 2 | boss do mapa 1 (Blackfang, 2×4) | 14 | 10 | 10 | 11 |
| 3 | Blades of the East | 3 | raid do mapa 1 (0×5) | 9 | 7 | 7 | 8 |
| 4 | Trigger Law | 3 | Titã no boss do mapa 2 (0×5) | 29 | 42 | 28 | 26 |
| 5 | Executioners | 8 | **vitória de capítulo** (boss Blackfang no mapa 2, 4×3) | 30 | 48 | 30 | 25 |
| 6 | Keen Edge | 12 | ordem do mapa 3 (Blackfang Shadows, 2×3) | 41 | 77 | 36 | 49 |
| 7 | Dawn Vanguard | 16 | **vitória** (True Boss da Grand Union, 3×3) | 45 | 107 | 51 | 37 |

## 3. Padrões por tipo de fim de run (C1 a C4)
| Fim da run | Runs | Diamantes | Minutos | Nós | XP ganho | Elites | Ouro gasto |
|---|---|---|---|---|---|---|---|
| Derrota no mapa 1 | 12 | 7,7 | 10 | 10 | 7,7 | 1,8 | 41 |
| Derrota no mapa 2 | 7 | 20,6 | 19 | 22 | 27 | 4,4 | 150 |
| Vitória de capítulo | 4 | 22 | 20 | 22,5 | 33 | 4,5 | 122 |
| Derrota no mapa 3 | 3 | 40 | 43 | 42 | 79 | 9,7 | 406 |
| Vitória | 6 | 46 | 43 | 45 | 99 | 10,3 | 425 |

- **Onde as runs terminam:** derrotas no mapa 1 são as mais comuns (12 de 32), e as causas variam:
  - o boss do mapa 1, sobretudo o Imperador Orc;
  - as ordens;
  - as raids e o Titã (5 derrotas por 0×5 em 4 campanhas).
- **Raids e Titãs:** são a barreira mais dura que **não foi revisada**. Toda derrota nelas foi por 0×5.
- **True Bosses:** 4 vitórias e 1 derrota (0×5, na C2). Todas as vitórias foram por 3×3: as duas formas vencidas.
- **Desafios depois da 1ª vitória:** a C1 venceu com 1 e com 2 desafios, mas na v56 o Reforços não funcionava. A C3 perdeu no mapa 1 com o Reforços já corrigido e venceu com Bagagem Limitada.

## 4. Para o balanceamento pendente

### 4.1 Economia permanente (diamantes)
| Medida | Valor observado |
|---|---|
| Diamantes por hora de jogo | **~70** (C1 59; C3 74; C4 75) |
| Diamantes por run (média) | derrota no mapa 1: 8 · mapa 2: 21 · vitória de capítulo: 22 · mapa 3: 40 · vitória: 46 |
| Diamantes até a 1ª vitória | C3: ~190 (runs) + ~30 (marcos); C4: 176 + 33 |
| Diamantes de marcos | ~1 a cada 7 a 10 minutos no começo; 31 a 36 marcos até a 1ª vitória |
| Diamante por XP excedente | só com a árvore completa (nenhuma campanha chegou lá) |

**Preços atuais na loja de diamantes:**

| Item | Preço |
|---|---|
| Carta | 10 / 15 / 20 / 25 por raridade |
| Relíquia | 10 / 15 / 20 / 25 por raridade, 1 cópia |
| Deck emprestado | 25 |
| Booster (4 cartas) | 7 |

**Custos com as raridades novas:**

| Compra | Custo | Horas de jogo, só com o ganho das runs |
|---|---|---|
| 1 cópia de cada carta (94, com os heróis) | **1.595** | |
| 43 relíquias | **705** | |
| Coleção completa | **2.300** | **~33 h** |
| 1 cópia de cada carta da Grand Union (41) | 610 | ~9 h |
| Deck custom de 20 cartas da Grand Union, comprado avulso (preço médio 14,9) | ~300 | ~4 h |

**Pontos para a decisão da economia:**
1. **O booster é muito mais barato por carta** que a compra avulsa: 7 por 4 cartas, ou 1,75 por carta, contra 10 a 25. Ou o booster fica mais caro, ou a compra avulsa é a forma de escolher a carta e o booster é a forma barata e aleatória. Isso precisa de decisão de design.
2. **33 h para completar a coleção:** é perto da meta de "pós-jogo de 15 a 30 runs" do projeto, mas sem contar boosters. Com boosters, cai bastante.
3. **Os diamantes começam a ser gastos tarde:** só na C3 houve compras, e só para o deck custom. Nas outras campanhas o saldo acumulou (299 na C1). A loja de diamantes ainda não pesa nas decisões do jogador antes da 1ª vitória.
4. **Comprar deck por 25** é barato perto do ganho de ~70 por hora. Com isso, os decks fortes ficam acessíveis antes do marco correspondente.

### 4.2 Árvore (endgame)
| Medida | Valor observado |
|---|---|
| XP por hora | **~100** (C1 95; C3 105; C4 110) |
| XP por run vitoriosa | ~100 |
| Árvore na 1ª vitória | 12 a 16 nós no início da run da vitória; 17 a 21 nós ao fim dela |
| XP perdido (sobra no fim da run) | 8% a 24% do ganho; mais alto em derrotas e quando o próximo nó é caro |
| Árvore completa (60 nós, custo 1.754 no CP4) | as campanhas gastaram ~270 a 420 de XP até agora; faltam **~1.330 a 1.490**, cerca de **13 a 15 h** ou 15 runs vitoriosas |

- **A árvore cresce mais rápido que no simulador** (17 nós na run 8 da C3). Foi aceito para o jogo base.
- No endgame, vale decidir se as 13 a 15 h até a árvore completa casam com o ritmo dos Desafios: hoje, 1 nível de desafio a cada 1 a 3 runs.

### 4.3 Desafios, Vantagens e conteúdo de endgame
- **Dados ainda insuficientes:** só 4 runs com desafio, e as duas da C1 rodaram com o Reforços quebrado. Os Desafios e as Vantagens precisam de uma carreira de playtest própria, de preferência com o Reforços corrigido e níveis de desafio crescentes.
- **Raids e Titãs (5 derrotas por 0×5):** é a revisão pendente de maior impacto no jogo base e também no endgame (Fúria das Raids, Titãs, marco "9 Titãs").
- **True Bosses:** 4 de 5 vencidos, todos por 3×3. A primeira tentativa costuma vencer. Combina com a meta de ~73% do CP3/CP4.
- **Cartas de boss (heróis):** só a C3 e a C4 liberaram heróis (Blackfang e Grand Union). Com a versão nova, ultra e custo 4, os heróis passam a ser um objetivo do endgame. Vale medir o custo em diamantes para comprar os 17 (425).

### 4.4 Liberação de conteúdo (até a 1ª vitória)
| | C3 (v57) | C4 (v57 + bosses) |
|---|---|---|
| Decks liberados | 12 (na run 7) | 13 |
| Marcos | 36 de 102 | 33 de 102 |
| Catálogo: cartas / relíquias | 12 / 18 | 23 / 15 |
| Boosters | 10 de 10 da Grand Union | 10 de 10 |

- Os boosters da Grand Union saem quase todos cedo, nas runs 1 e 2, porque os marcos fáceis estão abaixo da estimativa (ver o relatório da carreira v57).
- O catálogo cresce devagar (12 a 23 cartas até a 1ª vitória), porque depende do drop de elites, ordens e bosses. Isso limita o deck custom no começo do endgame.

## 5. Lacunas de dados (pedir ao ChatGPT, se forem úteis)
1. **Origem dos diamantes:** um registro por entrada (marco, run, bônus de elite, árvore completa). Hoje dá para deduzir, mas não ver.
2. **Gastos:** um registro de cada compra na loja de diamantes, com o que foi comprado, o preço e o momento. Hoje só aparece o que o jogador possui.
3. **Boosters abertos:** registro de cada booster aberto e das cartas que saíram.
4. **Nível das cartas oferecidas no recrutamento:** já pedido.
