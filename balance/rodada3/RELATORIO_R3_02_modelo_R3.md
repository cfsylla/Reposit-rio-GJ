# Rodada 3, Etapa 2: modelo R3 (janela da 6ª luta + XP por encontro × mapa)

Data: 05/11/2026. Cópia de teste: `game_r3/` (v50 + patch em `dist/tree-engine.js`). PDF: `balance/out/rodada3/pdf/R3_E2_modelo_R3.pdf`.
Teste de regras: `game_r3/tests/xp-r3.cjs` (PASS). Dados: `balance/out/rodada3/etapa2_tri/` (triagem), `etapa2_full/` (24 decks).

## Regras implementadas (decisões do Carlos)
- XP = peso × mapa: luta 1, elite/ordem/Titans 2, boss 4, True Boss 6, Secret Boss 8; ×1/×2/×3.
- Janelas: depois da 6ª luta de cada mapa (camada 9 no mapa 1, 8 nos mapas 2 e 3) e depois de cada boss.
- 1 XP = 1 ponto. A sobra passa para a próxima janela da mesma run; é perdida no fim da run (vitória, derrota, abandono).
- Respec fora da run devolve só o custo dos nós; a sobra é perdida ao iniciar a run. Nível exibido = nós comprados.
- XP vira diamante (1 por 20) só com a árvore completa.

## Testes
- `xp-r3.cjs`: PASS. `progression-v56`, `integration-cp2`, `validate-balance-base`: PASS.
- `challenges-p5` e `advantages-p5`: falham onde testam o modelo antigo (`totalXp`, `bank`, XP excedente). Precisam ser atualizados.

## Carreiras (24 decks × 4 carreiras × 50 runs)
| Indicador | Mediana (p10-p90) |
|---|---|
| 1ª vitória | run 19 (10-34): dentro da meta 15-20 no geral |
| Nós no início da run da 1ª vitória | 19 |
| 15 / 30 / 45 / 60 nós | runs 16 / 21 / 25 / 33 |
| XP por run: ganho / gasto / perdido | 56 / 22 / 9 (o ganho inclui as runs com a árvore completa, em que o XP vira diamante) |
| Vitória por faixa de runs | 1-5: 0% · 6-10: 3% · 11-15: 13% · 16-20: 38% · 21-30: 63% · 31-50: 90% |

Dispersão por deck grande: 1ª vitória de 9 (Corte Sombria) a 37 (Lei do Gatilho); 8 decks antes da run 15 e 9 depois da 20.

## Janelas (triagem, antes da árvore completa)
| Janela | XP médio | Nós por janela |
|---|---:|---:|
| Mapa 1, 6ª luta | 8,4 | 0,13 |
| Mapa 1, boss | 13,9 | 0,35 |
| Mapa 2, 6ª luta | 26,3 | 0,76 |
| Mapa 2, boss | 29,8 | 0,56 |
| Mapa 3, 6ª luta | 40,9 | 1,02 |
| Mapa 3, boss | 32,7 | 0,75 |

Problema: depois das runs 1-5 (os 5 nós de custo 8), a janela do mapa 1 quase nunca compra, porque o 2º anel custa 10. Nas runs 6-10, só 43% passam do boss 1.

## Matriz com a árvore fixa (24 decks × 20 seeds; compra tudo que der nas janelas)
| Árvore | Passa boss 1 (v50 → R3) | Vence (v50 → R3) |
|---|---|---|
| vazia | 38% → 39% | 1% → 1% |
| 15 nós | 72% → 72% | 12% → 13% |
| 30 nós | 96% → 96% | 64% → 66% ±4 |
| 45 nós | 99% → 99% | 84% → 84% |
| 60 nós | 100% → 100% | 98% → 98% |

Na mesma run, os nós comprados nas janelas mudam pouco a chance de vitória (+0 a 2 pontos). O efeito do modelo está no ritmo da carreira.
