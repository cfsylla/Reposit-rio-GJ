# Rodada 3, Etapa 1: linha de base da v50 (sem alterações)

Data: 05/11/2026. Cópia: `game_v50/` (idêntica à publicação 50). Sem Desafios e sem Vantagens.
Jogador simulado "smart"; seeds 1-20 (24 decks) e 1-40 (triagem). Estados de árvore por número de nós (preset `nodesN`).
Scripts: `balance/sim/r3-baseline.sh`, `balance/sim/matrix-r3.cjs`, `balance/sim/html2pdf.cjs`. Dados: `balance/out/rodada3/etapa1/`.
PDFs: `balance/out/rodada3/pdf/R3_E1_triagem.pdf`, `R3_E1_matriz_deck_x_avanco_v50.pdf`.

## Vitória na run (24 decks × 20 seeds = 480 runs por estado)
| Grupo | Vazia | 15 nós | 30 nós | 45 nós | 60 nós |
|---|---:|---:|---:|---:|---:|
| Comuns (15) | 2% ±1 | 12% ±4 | 63% ±5 | 84% ±4 | 98% ±2 |
| Blackfang (4) | 0% ±1 | 3% ±3 | 54% ±11 | 80% ±9 | 100% ±1 |
| Dawncrest (5) | 1% ±2 | 20% ±8 | 75% ±8 | 88% ±6 | 98% ±3 |
| **Todos** | **1% ±1** | **12% ±3** | **64% ±4** | **84% ±3** | **98% ±1** |

Triagem (5 decks × 40 seeds): 1% / 8% / 57% ±7 / 80% / 98%.

## Meta e comparação com o CP2
- Meta: 50-60% com metade da árvore (30 nós). Medido: **64% ±4**, um pouco acima da faixa (a triagem deu 57%). Não ajustado (decisão do Carlos).
- Meta da 1ª vitória entre as runs 15 e 20: **não medida aqui**; depende do modelo de XP/nível novo (Etapa 2).
- CP2 (árvore vazia): passava o boss 1 em 52%; v50: **38%**. CP2 nível 25 (22 nós): 52%; v50 30 nós: 64%.

## Gargalo do mapa 1 (árvore vazia)
- 62% das runs não passam do mapa 1: 30% morrem nas lutas, **32% no boss**.
- O boss Ironbound do mapa 1 causa 128 das ~470 derrotas (27% das runs).
- XP perdido na derrota (nunca bancado, porque só se banca após o boss): ~10,7 XP por run com árvore vazia, cerca de 70% do XP ganho.

## XP
- Run vencida: 54 XP (mapa 1: 20, mapa 2: 20, mapa 3: 14).
- Árvore completa: 1.151 pontos ≈ 21 runs vencidas com aproveitamento perfeito, no modelo atual de 1 XP = 1 ponto.
- Com a árvore completa, o jogo base fica trivial (98%); o desafio do pós-jogo vem dos Desafios.
