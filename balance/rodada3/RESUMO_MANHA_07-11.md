# Rodada 3: resumo do trabalho da noite (06 → 07/11/2026)

Tudo em `game_r3/` (cópia de teste; a v50 em `v50/` está intacta). Nada foi integrado no jogo publicado. O pacote CP3 **não** foi montado (aguarda autorização).

## Deu certo
| Item | Resultado | Meta |
|---|---|---|
| 1ª vitória, 24 decks (96 carreiras) | **run 18** (p10 10 – p90 23) | runs 15–20 ✅ |
| Vitória com 30 nós (24 decks × 20 seeds) | **58% ±4** | 50–60% ✅ |
| Árvore completa | run 32 (mediana) | — |
| Auras: 6 suportes sem cura, 1 buff cada | versão B aplicada (provisória): Bard +34% dano, Snow Troll −42% dano recebido, Feline Arcanist +35% vel. ataque, Feline Drummer +46% vel. ataque; Goblin King igual; força no laboratório de volta ao nível atual | ✅ (aprovar valores) |
| Desafios (15) com 30 nós | todos entre −5 e −10 depois de 2 ajustes: Fúria das Raids (+15% vida, +5% dano; era +30%/+10%) e Recursos Escassos (só 1ª rodada; eram 2) | ✅ (aprovar valores) |
| Vantagens (15) com 30 nós | 11 na meta ou na faixa de exceção; Treino Prévio ajustado para 2 cartas com upgrade 1 (+9, limite da exceção); Limpeza, Fusão Eficiente e Olho Treinado ≈ 0 (negativas aprovadas) | ✅ (ver Preparação Flexível) |

## Em espera (hold)
| Item | Situação | Opções |
|---|---|---|
| **Sage** | só poder de habilidade deixa o Sage mais fraco que uma unidade neutra (índice 0,91–0,96, mesmo com +130%) | (a) trocar o buff para redução de dano (índice 1,01); (b) manter fraco; (c) habilidade + outro efeito sem cura |
| **Linha de Fogo** | 1ª vitória na run 9 em todas as 6 versões testadas (até 4 trocas e troca de relíquia) | deck original mantido; decidir: deck forte como recompensa, ou mudança de identidade |
| **Coro de Dawncrest** | ficou mais rápido com as auras B: run 11 (8 carreiras; era 19); 85% com 30 nós | ajustar o deck (−1 Feline Drummer?) ou o valor do Drummer |
| **Preparação Flexível** | +9,5 ±8,6 (limite da exceção, margem grande) | manter ou reduzir |

## Proposta para decidir
- **Economia permanente**: `balance/rodada3/economia/PROPOSTA_ECONOMIA_R3.md` (diagnóstico, referências de TCGs, modelo de booster com proteção/fragmentos/garantia, recompensa diária, conversão para cosmético, calibração por carreira).

## Relatórios desta rodada
`RELATORIO_R3_00` (base v50) · `01` (linha de base) · `02` (modelo R3) · `03` (bosses) · `04` (decks) · `05` (auras) · `DECISOES_R3.md` ·
PDF final: `balance/out/rodada3/pdf/R3_FINAL_validacao.pdf`.

## Testes
- Novos (PASS): `game_r3/tests/xp-r3.cjs`, `game_r3/tests/auras-r3.cjs`. PASS: `progression-v56`, `integration-cp2`.
- Expectativas antigas a atualizar no projeto principal: `challenges-p5` e `advantages-p5` (modelo de XP antigo: `totalXp`, `bank`, excedente → diamante), `fixes-v52` (não conhece a janela da 6ª luta), `balance-p2` (valor antigo do Bard +26%).
