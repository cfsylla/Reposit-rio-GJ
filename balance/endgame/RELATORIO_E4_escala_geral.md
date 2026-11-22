# Endgame, etapa 4: escala geral por nível (22/11/2026)

**Base:** `game_v65_teste`. Reforços Inimigos a partir da 4ª rodada (etapa 3b); os outros desafios com os valores da v65.
**Amostra:** 10 decks de teste (vanguard, fireline, corsair, blades, balanced, swift, dark_court, goblin_horde, dawncrest_choir, centaur_charge) × 15 seeds = **150 runs por célula** (margem de cerca de ±8 pontos).
**Premissas, a partir das suas campanhas:**
- **Árvore no início do nível N:** 300 + 115 × (N − 1) de XP. Equivale a cerca de 20 nós no nível 1 e à árvore completa no nível 15.
- **Vantagens:** N − 1 compradas, na ordem do impacto medido no CP4 (Preparação Flexível, Experiência de Elite, Energia Guardada, Bênção do Caminho, Mão Planejada, Bolsa Cheia, Relíquia de Viagem, Segunda Chance, Caçador de Elites, Treino Prévio, Ensaio, Limpeza, Juros, Fusão Eficiente, Olho Treinado).
- **Desafios:** os N primeiros desta ordem, que intercala fortes e fracos pela etapa 3: Reforços, Relíquias Escassas, Comandantes, Bagagem, Tropas, Energia Dissipada, Deck Pesado, Bolsa Leve, Ataques, Bosses Implacáveis, Recursos Escassos, Veteranos, Mercado, Caminho Amaldiçoado, Fúria das Raids. **Essa ordem é provisória:** os blocos são a etapa 5, decisão sua.
- **Escala geral p:** 0%, 1%, 2% ou 3% de vida, ataque e defesa dos inimigos por desafio ativo.

**Reprodução:** `balance/sim/eg-e4-jobs.sh 4 balance/out/endgame/e4_jobs.txt` → `eg-batch.sh` → `balance/out/endgame/e4_ref/`.

## 1. Escada com desafios (N desafios + escala p): vitória na run

| Nível N | Árvore | p = 0% | p = 1% | p = 2% | p = 3% |
|---|---|---|---|---|---|
| 1 | ~20 nós, 0 vantagens | 35% | 33% | 29% | 27% |
| 3 | ~27 nós, 2 vantagens | **73%** | 59% | 41% | 32% |
| 5 | ~35 nós, 4 vantagens | 70% | 56% | 38% | 26% |
| 8 | ~45 nós, 7 vantagens | 69% | 47% | 23% | 10% |
| 10 | ~51 nós, 9 vantagens | 69% | 40% | 18% | 5% |
| 12 | ~56 nós, 11 vantagens | **95%** | 79% | 40% | 17% |
| 15 | completa, 14 vantagens | **96%** | 80% | 43% | 6% |

## 2. Só a escala (sem desafios, mesmas vantagens e árvore)

| Nível N | p = 0% | p = 1% | p = 2% | p = 3% |
|---|---|---|---|---|
| 1 | 37% | 37% | 33% | 33% |
| 3 | 80% | 73% | 69% | 60% |
| 5 | 91% | 84% | 82% | 72% |
| 8 | 97% | 95% | 91% | 80% |
| 10 | 99% | 96% | 91% | 81% |
| 12 | 100% | 98% | 95% | 89% |
| 15 | 100% | 100% | 99% | 88% |

## 3. Leitura
1. **O começo fácil se confirma no simulador.** Do nível 1 para o nível 3, a vitória **sobe** de 35% para 73% (sem escala), mesmo com 2 desafios a mais. O motivo é que o jogador ganha, ao mesmo tempo, cerca de 7 nós e as 2 vantagens mais fortes. Sem desafios, só a árvore e as vantagens levam a vitória de 37% para 80%.
2. **A escala sozinha não resolve esse salto.** Com 1% a 3%, o nível 3 ainda fica mais fácil que o nível 1 (59% contra 33% com p = 1%; 41% contra 29% com p = 2%). Para corrigir o começo, será preciso mexer também nos blocos (desafios fortes primeiro) ou nas vantagens (as mais fortes, mais tarde). É matéria da etapa 5.
3. **O fim também fica fácil sem escala:** do nível 10 para o 12, a vitória sobe de 69% para 95%. A árvore se completa (de 51 para 60 nós), e os últimos desafios da ordem são os mais fracos.
4. **Meta de 50% a 70% no nível 15 (árvore completa, tudo ligado):**

   | p | Vitória no nível 15 |
   |---|---|
   | 1% | 80% (acima da meta) |
   | 2% | 43% (abaixo da meta) |
   | **≈ 1,5%** | **cerca de 60%** (interpolação, ainda não medido) |

5. **Meio da escada com 1,5%:** nos níveis 8 a 10, o simulador ficaria perto de 30%. Como você joga como um simulador com uns 5 nós a mais, deve ficar mais alto.
6. **A forma da curva importa mais que o valor de p.** Uma escala linear pesa pouco no começo (quando o jogador mais cresce) e bastante no meio. Opções para a etapa 5:
   - p de 1,5% com blocos que começam pelos desafios mais fortes;
   - um bônus fixo ao abrir o endgame (por exemplo, +5% já no nível 1);
   - vantagens mais caras no começo.

## 4. Onde a run termina (escada, níveis 5, 10 e 15)

| Nível | p = 0% | p = 2% |
|---|---|---|
| 5 | True Boss 8%, ordem do mapa 3 7%, boss do mapa 2 5% | True Boss 11%, boss do mapa 2 11%, ordem do mapa 3 10% |
| 10 | True Boss 7%, ordem do mapa 3 7%, boss do mapa 3 7% | boss do mapa 2 15%, ordem do mapa 3 15%, boss do mapa 3 8% |
| 15 | quase nunca | boss do mapa 3 9%, True Boss 8%, entrada do mapa 3 8%, boss do mapa 2 8%, boss do mapa 1 7% |

Com a escala, as derrotas se espalham pelos três mapas, em vez de se concentrarem no True Boss.
