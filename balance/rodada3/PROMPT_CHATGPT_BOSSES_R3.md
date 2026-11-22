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
2. Confirmação no save exportado.
   - Na luta contra o boss do mapa 2, a fonte `boss:<id>` de `enemyScaleSources` (que hoje junta o fator do mapa e o fator do boss) deve subir na proporção 1,10 / 0,965 (+14%).
   - No mapa 3, deve subir na proporção 1,35 / 1,198 (+12,7%).
   - Exemplo: o boss Orc no mapa 2 passa de cerca de 0,566 para cerca de 0,645.
