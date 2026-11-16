Olá! Preciso de um ajuste de dificuldade nos **bosses dos mapas 2 e 3**, a partir dos playtests da carreira v57-R3.

**Motivo**
- Nas três campanhas de playtest, os bosses dos mapas 2 e 3 não pararam o jogador nenhuma vez (0 derrotas em 6 lutas contra o boss do mapa 2, e o mesmo no mapa 3).
- O boss do mapa 1 funciona como barreira.
- O fator por mapa do boss do mapa 2 (0,965) hoje é menor que o do mapa 1 (1,037).

**O que mudar**
- No ajuste dos bosses (`JOURNEY_BOSS_TUNE`, no `boss-engine.js` do código de referência), alterar **só** o fator por mapa (`map`):

| Mapa | Hoje | Novo |
|---|---|---|
| 1 | 1,037 | 1,037 (sem mudança) |
| 2 | 0,965 | **1,10** |
| 3 | 1,198 | **1,35** |

- Ou seja: `map:[1.037, 1.10, 1.35]`.

**O que não muda**
- Os fatores próprios de cada boss (`boss[id]`), que igualam os bosses do mesmo mapa.
- O fator da barreira de boss (`barrier:boss`).
- Os valores da forma 2 dos True Bosses (`true2`).
- Raids, Titãs, lutas comuns e elites.
- O True Boss do mapa 3 já usa o fator do mapa 3, então sobe junto. Não precisa de ajuste à parte.

**Autorização**
- Pode implementar.
- **Não publique ainda.**

**O que me devolver**
1. O arquivo e a linha alterados.
2. Confirmação de que, num save novo, a luta contra o boss do mapa 2 mostra a fonte `map:2` com o valor novo em `enemyScaleSources` (o mesmo para o mapa 3).
