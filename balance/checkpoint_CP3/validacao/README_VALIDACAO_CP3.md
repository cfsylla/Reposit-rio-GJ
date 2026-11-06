# Validação do checkpoint GJ-v50-BAL-CP3

## 1. Patch
`checkpoint_CP3_vs_v50.patch` aplicado com `git apply -p1` numa cópia limpa da publicação 50: resultado **idêntico** à cópia de teste `game_r3/` e a `arquivos_alterados/`.

## 2. Validador da base
`node scripts/validate-balance-base.cjs` em `game_r3/`: **PASS** em todas as etapas. Log: `validate-balance-base_CP3.log`.

## 3. Testes principais
`testes_principais_CP3.log`: xp-r3, auras-r3, challenges-p5, advantages-p5, integration-cp2 e progression-v56, todos **PASS**.

## 4. Suíte completa (cada teste rodado sozinho)
Comparação v50 × CP3 em `suite_v50_vs_CP3.txt`:

| v50 → CP3 | Testes |
|---|---:|
| PASS → PASS | 41 |
| FAIL → FAIL | 18 |
| novo → PASS | 2 (xp-r3, auras-r3) |
| PASS → FAIL | **0** |

Os 18 que falham **já falhavam na v50 publicada**, rodados sozinhos:
`acts-v47.cjs`, `blackfang-v26.cjs`, `combat-replay-v21.cjs`, `interface-v28.cjs`, `ironbound-v55.cjs`, `legacy-replay-v37.cjs`, `legacy-replay-v39.cjs`, `monsters-v42.cjs`, `pending-v22.cjs`, `playtest-p1.cjs`, `portrait-alpha.cjs`, `revisions-v32.cjs`, `revisions-v33.cjs`, `roster-v37.cjs`, `setup-v19.cjs`, `setup-v20-1.cjs`, `tree-v51.cjs`, `vfx-v21.cjs`.

As causas vêm de antes desta rodada: imagens que não estão no pacote; testes que carregam só parte dos módulos; histórico de interface ou git. O `tree-v51` passa dentro do validador (com os módulos atuais) e falha sozinho, igual à v50.

## 5. Simulações (PDFs nesta pasta)
| PDF | Conteúdo |
|---|---|
| `R3_FINAL_validacao.pdf` | Validação final: carreiras (24 decks × 4 × 50 runs) e matriz deck × avanço (24 decks × 20 seeds × 5 estados de árvore) |
| `R3_E1_matriz_deck_x_avanco_v50.pdf` | Linha de base da v50 sem alterações |
| `R3_E2_modelo_R3.pdf` | Modelo de XP R3 antes do ajuste dos bosses e decks |

Relatórios de cada etapa: `balance/rodada3/RELATORIO_R3_00` a `05`, `DECISOES_R3.md` e `RESUMO_MANHA_07-11.md` (no repositório).

**Limitações:** o jogador simulado joga no nível da IA do jogo; um humano tende a ir melhor. A margem por deck é de cerca de ±20 pontos com 20 seeds. As carreiras têm 4 a 8 por deck, com margem de cerca de ±3 runs na mediana.
