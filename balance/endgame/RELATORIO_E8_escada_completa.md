# Escada com tudo junto: desafios, vantagens, escala e árvore (6 blocos de 3)

23/11/2026. Cópia `game_v65_teste`. Amostra: 10 decks × 15 seeds por nível, 2.700 runs. Margem de cerca de ±7 pontos perto de 25% e de ±4 perto de 5%.
- **Nível N:** N desafios. Os blocos anteriores ficam inteiros, e os do bloco atual são sorteados.
- **Vantagens:** N − 1, uma por Insígnia, com a mesma regra de blocos.
- **Árvore:** 300 + 115 × (N − 1) de XP (cada run anterior vencida).
- **Escala:** +2% por desafio.

| Nível | Vitória | Escada anterior (vantagens antigas, da mais forte para a mais fraca) | Chega ao mapa 3 | Onde mais perde |
|---|---|---|---|---|
| 1 | 24% | 24% | 65% | boss do mapa 3 |
| 2 | 29% | 27% | 60% | elite do mapa 2 |
| 3 | 23% | 31% | 54% | elite do mapa 2 |
| 4 | 19% | 18% | 48% | elites dos mapas 1 e 2 |
| 5 | 19% | 22% | 42% | elites dos mapas 1 e 2 |
| 6 | 21% | 9% | 42% | elites dos mapas 1 e 2 |
| 7 | 9% | 9% | 21% | elite do mapa 1 |
| 8 | 7% | 12% | 30% | elite do mapa 1 |
| 9 | 8% | 9% | 21% | elite do mapa 1 |
| 10 | 4% | 10% | 14% | elite do mapa 1 |
| 11 | 6% | 5% | 13% | elite do mapa 1 |
| 12 | 13% | 21% | 22% | elites dos mapas 1 e 2 |
| 13 | 17% | 22% | 33% | elite do mapa 1 |
| 14 | 13% | 16% | 28% | elite do mapa 1 |
| 15 | 13% | 9% | 25% | elite do mapa 1 |
| 16 | 9% | 5% | 23% | elite do mapa 1 |
| 17 | 5% | 3% | 21% | elite do mapa 1 |
| 18 | 5% | 3% | 20% | elite do mapa 1 |

## Estimativa (tabela somada) contra a medição, no fim de cada bloco
| Bloco | Nível | Estimado | Medido |
|---|---|---|---|
| 1 | 3 | 38% | 23% |
| 2 | 6 | 51% | 21% |
| 3 | 9 | 55% | 8% |
| 4 | 12 | 59% | 13% |
| 5 | 15 | 53% | 13% |
| 6 | 18 | 44% | 5% |

## Leitura
1. **A soma isolada foi otimista**, como previsto: a diferença chega a 40 pontos. Os efeitos se multiplicam. O formato da curva até se parece com o estimado (cai, depois sobe por volta dos níveis 12 e 13, e cai no fim), mas fica num patamar bem mais baixo.
2. **As vantagens novas e revistas mudaram pouco a curva.** Ela fica parecida com a da escada anterior, que usava as vantagens antigas da mais forte para a mais fraca.
3. **A parede são as elites e as ordens do mapa 1**, a partir do nível 5:
   - nos níveis 7 a 18, de 47 a 76 das 150 runs morrem numa elite do mapa 1;
   - as que mais matam são as **ordens** (Dawncrest e Blackfang, camadas 4 e 9) e as elites convertidas por Mais Elites (camadas 2 e 7);
   - **Comandantes** (+2 relíquias e +2 upgrades em elites, ordens e bosses) é o desafio que mais pesa nisso: nos níveis 4 a 6, a morte em elite do mapa 1 vai de 14% sem ele para 26% com ele.
4. **O jogador não chega ao fim da run.** Do nível 7 em diante, só 13 a 33% chegam ao mapa 3. A dificuldade do endgame está concentrada no começo da run, não nos bosses.
