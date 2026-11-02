# Etapa 4 — Pacote final de dificuldade e economia (V19), para aprovação

Metas aprovadas por Carlos, para o jogador simulado:
- árvore intermediária = **20 a 30 nós** (de 60) → vencer **40% a 50%** das runs;
- árvore vazia → vencer **5% a 10%**;
- quem quiser mais dificuldade terá o modo de desafio depois do boss final (ainda será implementado).

Testado na cópia balanceada (P1 + P2 + P3 + Fearless V4):
- jogador simulado competente;
- 15 decks base;
- 20 runs por deck em cada estado de árvore (900 runs no total).

## Resultado

| Árvore | Passa mapa 1 | Passa mapa 2 | Vence | Meta |
|---|---|---|---|---|
| Vazia | 47% | 15% | **9%** | 5% a 10% ✓ |
| 20 nós | 76% | 53% | **42%** | — |
| 30 nós | 83% | 64% | **55%** | — |
| ≈ 25 nós (interpolado) | — | — | **≈ 48%** | 40% a 50% ✓ |
| *Hoje (v54 balanceada, 8 nós)* | *5%* | *0%* | *0%* | — |

**Derrota por tipo de luta (20 e 30 nós):**

| Tipo de luta | Derrota |
|---|---|
| Batalhas | 0% a 2% |
| Elites | 3% a 4% |
| Ordens | 1% a 4% |
| Raids | 0% a 1% |
| Boss comum | 1% a 5% |
| Bosses de equipe | 0% a 17% |
| Boss de monstros do mapa 1 | 20% |

**Sem árvore:**

| Tipo de luta | Derrota |
|---|---|
| Elites | 12% a 19% |
| Ordens | 6% a 11% |
| Boss comum | 12% a 22% |

O mapa 1 mata mais; daí em diante, o jogador cresce.

## Tabela de ajustes propostos

| # | Sistema | Onde (arquivo / função) | Hoje (v54) | Proposta |
|---|---|---|---|---|
| 1 | Curva de upgrades dos inimigos (aprovada) | `game-0.js` / `makeAI` | 0 / 12 / 20 cartas com upgrade em degraus; tudo no mapa 1 | ~1 upgrade por luta: luta N tem N−2 upgrades; máximo 26 (todas L1 + 6 L2) no fim do mapa 3 |
| 2 | Elites | `makeAI` | só ~1/3 dos tipos com upgrade 1 | curva **+1** upgrade |
| 3 | Boss comum (deck emprestado) | `makeAI` | igual à batalha normal | curva **−3 / −6 / −8** (mapa 1 / 2 / 3) |
| 4 | Equipe dos bosses de ordem | `makeAI` | igual à batalha normal | curva **−4 / −9 / −10**; Rei Troll mais −3 |
| 5 | Líder dos bosses de ordem | `boss-engine.js` / `D` | vida e ataque base | **−20%** em todos; Rei Troll −35%; Rainha Meowri e Líder Centauro −25% |
| 6 | Ouro por vitória | `game-0.js` / `battleReward` | 10 / 12 / 14 (pelo nº de lutas: até 3 / até 6 / depois) | **15 / 18 / 21** por mapa |
| 7 | Upgrade na loja | `game-0.js` / `price` | 12 e 20 | **10 e 16** |
| 8 | Força por mapa | `acts-engine.js` / `SPEC.power` | ×1 / ×1,12 / ×1,25 | **×1 / ×1,03 / ×1,06** |
| 9 | Crescimento dentro do mapa | `game-0.js` / `createBattle` | começa em 0,86 e +2% por luta (até +16%) | começa em **0,82** e +2% por luta (até +16%) |
| 10 | Relíquias de elites e bosses inimigos | `game-0.js` / `rollEnemyRelics` | crescem sem limite durante a run | no máximo **1 / 2 / 3** por mapa |
| 11 | Raids | `acts-engine.js` / `attachRun` | escala por posição × força do mapa | mapa 1 sem mudança; mapas 2 e 3 com **vida ×1,25 e dano ×1,1** |
| 12 | Decks inimigos por mapa (ideia aprovada) | `makeAI` + dados | batalhas normais sorteiam 10 personagens quaisquer | 4 decks temáticos por mapa (12 no total) |
| 13 | **Bug** | `boss-engine.js` / `freshMinion` | o Lanceiro invocado pelo Rei Goblin nasce com "carga 0" e usa o especial **60 vezes por segundo** | a unidade invocada recebe a carga normal do especial |

O item 13 é um **bug da v54 original** (confirmado: na v54, esse Lanceiro sozinho causa 922 de dano numa rodada). Só ele fazia o Rei Goblin derrotar 71% a 88% dos jogadores.

## Observações para depois

1. **Diferença entre decks nas runs (20 e 30 nós):**

| Deck | Vence |
|---|---|
| Coro de Guerra (suportes) | 80% |
| Executores | 63% |
| Lâminas | 60% |
| Tripulação Salgada | 28% |
| Golpe Certeiro | 30% |

   Os demais ficam entre 43% e 58%. Isso confirma o alerta da etapa P2: decks de suporte rendem muito numa run real. Proponho uma revisão leve depois de aplicar o pacote.
2. O boss de monstros do mapa 1 (20% de derrota) pode receber um ajuste fino.
3. A economia de eventos, a árvore (custo de XP e valor dos nós) e a camada de diamantes/coleção são as etapas seguintes.

## Reprodução

```sh
node balance/sim/apply-difficulty.cjs balance/work/diff/V19 '<ver balance/work/diff/V19/variant.json>'
GJ_ROOT=balance/work/diff/V19 node balance/sim/run.cjs --decks vanguard --seeds 1-20 --events safe --shop balanced --tree mid20
node balance/sim/diff-report.cjs balance/out/diff15 V19_none V19_mid20 V19_mid30
```
