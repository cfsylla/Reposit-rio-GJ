# Rodada 3: identidade das auras (Foco 4)

Regra (Carlos, 06/11): curam só Priestess, Flower Fairy, Elf Harpist e Shaman; os outros 6 são auras de buff puro (cura 0) com 1 buff
(o Goblin King mantém 2). Implementado em `game_r3/dist/supports-b.js`; teste `game_r3/tests/auras-r3.cjs` (PASS):
cura 0 não gera entrada de cura, número, pulso nem gatilho "ao curar"; o texto PT/EN só menciona cura quando há cura.

## Medição 1: runs completas (10 decks × 30 seeds, árvore fixa)
| | 15 nós V0 → A | 30 nós V0 → A |
|---|---|---|
| 6 decks afetados (média) | 18% → 15% | 58% → 55% |
| decks de controle (média) | 6% → 6% | 43% → 48% (inimigos também perderam a cura) |
| Círculo Arcano (2 Bard + 2 Sage) | 10% → 3% | 63% → 47% |

Limite: o jogador simulado escala pouco esses suportes (Sage em 25% das batalhas do Círculo Arcano, Bard em 2%), então mudanças
moderadas de valor quase não aparecem em runs completas. Por isso a compensação foi calibrada no laboratório de personagens.

## Medição 2: laboratório de personagens (índice de força; 1,00 = unidade neutra)
| Suporte | Hoje (V0) | A: só tira a cura | B: buff compensado | Valor B |
|---|---:|---:|---:|---|
| Bard | 1,04 / 1,09 | 1,00 / 1,04 | **1,04 / 1,08** | +34% dano (era +26% dano +22% habilidade + cura 2,2%) |
| Snow Troll | 1,13 / 1,25 | 1,03 / 1,11 | **1,11 / 1,24** | −42% dano recebido (era −28% + cura 7%) |
| Feline Arcanist | 1,05 / 1,13 | 1,03 / 1,09 | **1,05 / 1,10** | +35% vel. ataque (era +29% + cura 4,8%) |
| Feline Drummer | 1,08 / 1,12 | 1,03 / 1,08 | **1,09 / 1,12** | +46% vel. ataque (era +34% vel. ataque +46% movimento + cura 3,4%) |
| Goblin King | 1,12 / 1,23 | 1,10 / 1,21 | 1,10 / 1,21 | sem mudança (+32% dano, +27% vel. ataque) |
| **Sage (HOLD)** | 1,10 / 1,16 | **0,91 / 0,94** | 0,92–0,96 com habilidade até +130% | só habilidade não compensa; comparação: só −30% dano dá 1,01 / 1,06 |
| Priestess, Flower Fairy, Elf Harpist, Shaman | sem mudança | | | |
(níveis 0 / 2; 5 seeds por painel, 6 painéis de time)

## Decisão pendente: Sage
Com o buff só de poder de habilidade, o Sage fica mais fraco que uma unidade neutra em todos os tipos de time, mesmo com valores muito altos.
Opções: (a) trocar o buff do Sage para redução de dano; (b) manter habilidade e aceitar o Sage fraco; (c) habilidade + outro efeito sem cura.
Valor provisório no game_r3: +48% poder de habilidade.
