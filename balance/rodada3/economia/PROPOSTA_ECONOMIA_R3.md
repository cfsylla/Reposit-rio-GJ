# Grand Journey: proposta de economia permanente (coleção, loja, boosters, relíquias e diamantes)

Rodada 3, 06/11/2026. **Proposta para decisão do Carlos; nada foi aplicado no jogo.** Números calculados sobre a base `game_r3`
(modelo R3) e as carreiras simuladas. Scripts: `booster-montecarlo.cjs` e `collection-career.cjs` (nesta pasta).

## 1. Como está hoje (v50)

| Item | Hoje |
|---|---|
| Coleção | 94 cartas colecionáveis (24 comuns, 28 incomuns, 21 raras, 21 ultra raras) × até 4 cópias = 376 cópias; 25 relíquias permanentes; 24 decks emprestados |
| Diamantes por run | 1 a cada 2 nós concluídos + 1 por elite + 3 por boss. Média: derrota no mapa 1 = 8; mapa 2 = 18; mapa 3 = 31; vitória = 37 |
| Outras fontes | 95 milestones × 1 diamante (uma vez). Não há recompensa diária |
| Acumulado numa carreira (mediana) | 131 na run 10; 365 na run 20; 729 na run 30; 1.100 na run 40. Até completar a árvore (≈ run 30): ≈ 760 |
| Booster | 7 diamantes = 4 cartas. Raridade por carta: 65% / 23% / 10% / 2%. Sem proteção de duplicata, sem garantia |
| Carta avulsa | 10 / 15 / 20 / 25 diamantes por raridade; só aparece na loja depois de "descoberta" (elites) |
| Relíquia permanente | 10 / 15 / 20 / 25 por raridade (25 relíquias ≈ 410 diamantes) |
| Deck emprestado | 25 diamantes ou milestone; também libera sozinho quando a coleção tem as cópias e a relíquia |

### Diagnóstico
1. **O booster é muito mais barato que a carta avulsa**: 1,75 diamante por carta contra 10 a 25. A carta avulsa quase nunca vale a pena.
2. **O começo é rápido demais e o fim é quase impossível.** Com 60 diamantes após 5 runs, o jogador compra 8 boosters (32 cartas) e
   enche a coleção de comuns. Mas completar as 4 cópias das 21 ultra raras exige, sem proteção, **≈ 2.600 boosters** (Monte Carlo).
   A sensação de "diamante demais" vem do começo; no fim falta diamante, não sobra.
3. **Duplicatas não valem nada**: a 5ª cópia de uma comum é perdida.
4. Não há motivo para entrar no jogo sem jogar uma run (sem diária), e diamante não tem uso depois da coleção completa.

## 2. Referências (TCGs digitais e roguelikes)

| Jogo | Como ganha | Pacote | Proteção / duplicata | Carta específica | Lição para o GJ |
|---|---|---|---|---|---|
| Hearthstone | missões diárias (~40-100 ouro) e vitórias | 100 ouro, 5 cartas | proteção de duplicata; lendária garantida a cada 40 pacotes e nas 10 primeiras de cada coleção | pó: criar custa 40/100/400/1.600; desencantar devolve 5/20/100/400 (≈ 1/4 a 1/8) | garantia de raridade + moeda de duplicata |
| MTG Arena | missão diária (500-750 ouro) + vitórias | 1.000 ouro, 8 cartas | a 5ª cópia de rara/mítica não sai; depois de completar, excedente vira gema | coringas por raridade | proteção total de playset |
| Legends of Runeterra | subir nível de região, cofre semanal, expedições | — | cópia além do limite vira fragmento (comum 15, rara 75) | fragmentos e coringas | coleção pode ser completada só jogando; caminho por região |
| Marvel Snap | missões; 50 créditos grátis por dia na loja | sem pacote | sem duplicata | coleção liberada em faixas, por nível de coleção | diária simples na loja |
| Pokémon TCG Pocket | 1 pacote grátis a cada 12 h (máx. 2 acumulados) | 5 cartas | pontos de pacote a cada abertura | pontos compram carta específica | diária por tempo + "pity" por pontos |
| Slay the Spire | pontuação de cada run, vencendo ou perdendo | — | — | — | desbloqueio por progresso, até em derrota |

Fontes: [Hearthstone: pó (wiki)](https://hearthstone.wiki.gg/wiki/Dust), [Hearthstone: guia de ouro (Icy Veins)](https://www.icy-veins.com/hearthstone/gold-guide),
[Hearthstone: proteção de duplicata](https://hearthstone.gamepedia.com/Duplicate_protection), [MTG Arena: economia (Draftsim)](https://draftsim.com/mtg-arena-economy/),
[MTG Arena: guia (MTGA Zone)](https://mtgazone.com/economy/), [Legends of Runeterra: fragmentos (wiki)](https://wiki.leagueoflegends.com/en-us/LoR:Shard),
[LoR: como completar a coleção (Mobalytics)](https://mobalytics.gg/blog/how-to-get-cards-legends-of-runeterra/), [Marvel Snap: economia (Daniel Friedman)](https://danielfriedman.substack.com/p/a-comprehensive-guide-to-the-marvel),
[Marvel Snap: créditos (Untapped)](https://blog.snap.untapped.gg/marvel-snap-wiki-credits), [Pokémon TCG Pocket: economia (Pokemon Zone)](https://www.pokemon-zone.com/articles/tcg-pocket-in-game-economy/),
[Pokémon TCG Pocket: pacotes (Serebii)](https://serebii.net/tcgpocket/boosterpacks.shtml), [Slay the Spire: mecânicas](https://saschb2b.github.io/game-mechanics/games/slay-the-spire/).
Os valores das referências vêm de guias de épocas diferentes e servem como ordem de grandeza.

## 3. Princípios propostos
1. **Coleção completa um pouco depois da árvore** (árvore ≈ run 30; meta da coleção ≈ run 40 a 45).
2. **Progresso garantido**: nenhum booster é "vazio" depois que as comuns completam (proteção + fragmentos + garantia de ultra).
3. **Começo mais lento que hoje, fim mais rápido que hoje.**
4. **Diamante sempre tem uso**: depois da coleção completa, vira moeda de cosmético.
5. **Liberação por progresso** (como regiões de Runeterra): cada facção/ordem libera seu booster ao ser descoberta na jornada; as regras atuais de ordem e True Boss continuam valendo.

## 4. Proposta (modelo recomendado)

### 4.1 Fontes de diamante
| Fonte | Hoje | Proposta |
|---|---|---|
| Run | 1 por 2 nós + 1 por elite + 3 por boss | **1 por 3 nós + 1 por elite + 2 por boss** (vitória ≈ 27; derrota no mapa 1 ≈ 6) |
| Recompensa diária | não existe | **5 diamantes por dia** ao entrar; calendário de 7 dias: o 7º dia dá 15 diamantes + 1 booster da facção que o jogador menos tem |
| Milestones | 1 por milestone | mantém (95 no total) |
| Compra com dinheiro real | não existe | opcional, a decidir; a calibração abaixo não depende dela |

### 4.2 Booster
| | Hoje | Proposta |
|---|---|---|
| Preço | 7 | **4 diamantes** |
| Cartas | 4 | **5** |
| Raridade por carta | 65 / 23 / 10 / 2% | **62 / 25 / 10 / 3%**, e a 5ª carta é rara ou melhor |
| Garantia | nenhuma | **ultra rara garantida a cada 10 boosters sem ultra** (contagem por booster de facção) |
| Duplicata | perdida | **proteção**: não sai a 5ª cópia enquanto houver carta incompleta naquela raridade; quando a raridade está completa, vira **fragmento** (1 / 2 / 5 / 10 por raridade) |

### 4.3 Carta específica (fragmentos, não diamante)
- Custo em fragmentos: **5 / 10 / 25 / 50** por raridade (próximo da proporção do Hearthstone, mais suave para uma coleção de 94 cartas).
- Fim da carta avulsa por diamante: hoje ela compete com o booster de forma incoerente.

### 4.4 Relíquias permanentes
- Continuam liberadas por elite e milestone (como hoje) e compradas por diamante: **15 / 20 / 30 / 40** por raridade (hoje 10 a 25), porque agora são o principal destino do diamante além do booster.
- Loja de relíquias com **3 ofertas por dia** (renova na diária), entre as relíquias já liberadas e não compradas.

### 4.5 Decks emprestados
- Mantém: liberados por milestone ou por **25 diamantes** (sem liberação retroativa).

### 4.6 Moeda de cosmético
- Comprada com dinheiro real (a decidir) e **convertida a partir de diamantes só depois da coleção completa** (cartas e relíquias): 1 diamante = 1 moeda de cosmético. Antes disso, sem conversão (para o diamante não escapar da coleção).

## 5. Calibração (carreiras simuladas, mediana)

Coleção = 376 cópias (4 de cada uma das 94 cartas). Todo diamante vai para booster (relíquias e decks à parte).

| Booster | Fórmula da run | Diária | Coleção na run 10 / 20 / 30 / 40 | Completa na run |
|---|---|---|---|---|
| 7, como hoje (com proteção) | atual | — | 25 / 63 / 84 / 90% | 58 |
| **4 (recomendado)** | **proposta** | **5/dia** | **41 / 78 / 90 / 98%** | **43** (p10 37, p90 49) |
| 5 | proposta | 5/dia | 32 / 68 / 86 / 93% | 51 |
| 5 | proposta | 10/dia | 39 / 75 / 88 / 95% | 47 |

Sem proteção e sem garantia (modelo atual), completar as ultra raras exige ≈ 2.600 boosters; com a proposta, ≈ 250.
Hipóteses: 2 runs por dia para a diária; milestones ≈ 1 a cada 2 runs; o jogador simulado gasta todo diamante em booster.

## 6. Decisões para o Carlos
1. Preço do booster: 4 (coleção ≈ run 43) ou 5 (≈ run 47 a 51).
2. Valor da diária e do calendário de 7 dias.
3. Fórmula de diamantes por run (proposta: 1 por 3 nós + 1 por elite + 2 por boss).
4. Fragmentos como única forma de comprar carta específica (fim da carta avulsa por diamante).
5. Preço das relíquias (15 a 40) e loja de relíquias com 3 ofertas por dia.
6. Conversão diamante → cosmético só com a coleção completa, 1:1.
7. Dinheiro real: diamantes e moeda de cosmético (a decidir; não muda a calibração do jogador que não paga).
