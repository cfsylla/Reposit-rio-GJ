# E10/E11: fator de mapa por marco da carreira (23/11/2026)

Teste só na cópia `game_v65_teste` (`JOURNEY_MAP_TUNE` em `acts-engine.js`). Cada mapa sobe uma vez, no marco dele:

| Versão | Mapa 1 (após liberar mapa 2) | Mapa 2 (após liberar mapa 3) | Mapa 3 (após 1ª vitória) |
|---|---|---|---|
| hoje | 1,00 | 1,16 | 1,235 |
| leve | 1,06 | 1,20 | 1,30 |
| média | 1,10 | 1,22 | 1,36 |
| forte | 1,13 | 1,23 | 1,42 |

- **Endgame (E10):** escada 6×3, níveis 1 a 18, escala de 1%, árvore pela escada. 10 decks × 15 seeds por nível. "hoje" = E9.
- **Jogo base (E11):** árvores de 5, 10 e 15 nós, 10 decks × 24 seeds.
  - Com `GJ_MAPS=2`: vitória = vencer o boss do mapa 2.
  - Com `GJ_MAPS=3`, sem vitória: vitória = vencer a run.

Script: `balance/endgame/analise_mapa.py`.

## Endgame: vitória por nível

| Nível | hoje | leve | média | forte |
|---|---|---|---|---|
| 1 | 26% | 15% | 7% | 5% |
| 2 | 37% | 23% | 15% | 12% |
| 3 | 34% | 17% | 16% | 9% |
| 4 | 25% | 18% | 13% | 5% |
| 5 | 32% | 21% | 13% | 6% |
| 6 | 37% | 23% | 12% | 7% |
| 7 | 21% | 10% | 5% | 3% |
| 8 | 27% | 15% | 7% | 5% |
| 9 | 21% | 13% | 7% | 3% |
| 10 | 18% | 8% | 6% | 3% |
| 11 | 25% | 15% | 11% | 6% |
| 12 | 36% | 25% | 21% | 12% |
| 13 | 45% | 33% | 24% | 17% |
| 14 | 48% | 27% | 21% | 13% |
| 15 | 41% | 29% | 18% | 17% |
| 16 | 44% | 27% | 19% | 16% |
| 17 | 34% | 26% | 17% | 10% |
| 18 | 32% | 21% | 17% | 13% |
| **Média** | **32.4%** | **20.4%** | **13.8%** | **9.0%** |

## Endgame: vitória por faixa de níveis

| Níveis | hoje | leve | média | forte |
|---|---|---|---|---|
| 1–3 | 32% | 19% | 13% | 9% |
| 4–6 | 31% | 21% | 12% | 6% |
| 7–9 | 23% | 13% | 7% | 4% |
| 10–12 | 26% | 16% | 12% | 7% |
| 13–15 | 45% | 29% | 21% | 16% |
| 16–18 | 37% | 25% | 18% | 13% |

## Endgame: onde morre (% das runs, todos os níveis)

| Local | hoje | leve | média | forte |
|---|---|---|---|---|
| mapa 1 battle | 0.3% | 0.6% | 0.7% | 1.0% |
| mapa 1 boss | 2.6% | 4.3% | 4.8% | 5.4% |
| mapa 1 elite | 11.5% | 21.5% | 29.8% | 36.8% |
| mapa 1 raid | 0.1% | 0.5% | 0.7% | 1.2% |
| mapa 2 battle | 5.9% | 5.8% | 5.6% | 4.6% |
| mapa 2 boss | 4.0% | 4.0% | 3.8% | 3.1% |
| mapa 2 elite | 16.4% | 17.2% | 16.2% | 14.3% |
| mapa 2 raid | 0.1% | 0.3% | 0.3% | 0.3% |
| mapa 3 battle | 8.8% | 9.4% | 9.3% | 11.1% |
| mapa 3 boss | 6.3% | 5.8% | 4.9% | 3.9% |
| mapa 3 elite | 11.4% | 10.1% | 9.9% | 9.1% |
| mapa 3 raid | 0.1% | 0.2% | 0.3% | 0.3% |
| **morre no mapa 1/2/3** | 15/26/27 | 27/27/26 | 36/26/24 | 44/22/24 |

## Jogo base, mapa 2 liberado: vence o boss do mapa 2

| Nós | hoje | leve | média | forte |
|---|---|---|---|---|
| 5 | 12% | 7% | 4% | 3% |
| 10 | 33% | 30% | 24% | 22% |
| 15 | 57% | 50% | 46% | 42% |

Onde morre (todos os nós):

| Local | hoje | leve | média | forte |
|---|---|---|---|---|
| mapa 1 battle | 0.0% | 0.7% | 1.2% | 2.1% |
| mapa 1 boss | 9.9% | 16.7% | 19.6% | 20.8% |
| mapa 1 elite | 7.9% | 14.3% | 21.5% | 25.3% |
| mapa 1 raid | 5.4% | 9.0% | 11.5% | 13.9% |
| mapa 2 battle | 12.6% | 7.6% | 4.6% | 3.2% |
| mapa 2 boss | 12.4% | 9.4% | 7.9% | 5.1% |
| mapa 2 elite | 11.2% | 7.5% | 4.6% | 3.6% |
| mapa 2 raid | 6.5% | 5.8% | 4.3% | 3.5% |

## Jogo base, mapa 3 liberado (sem vitória): vence a run

| Nós | hoje | leve | média | forte |
|---|---|---|---|---|
| 5 | 2% | 1% | 0% | 0% |
| 10 | 5% | 3% | 2% | 3% |
| 15 | 18% | 14% | 13% | 12% |

Onde morre (todos os nós):

| Local | hoje | leve | média | forte |
|---|---|---|---|---|
| mapa 1 battle | 0.0% | 0.7% | 1.2% | 2.1% |
| mapa 1 boss | 9.9% | 16.7% | 19.6% | 20.8% |
| mapa 1 elite | 7.9% | 14.3% | 21.5% | 25.3% |
| mapa 1 raid | 5.4% | 9.0% | 11.5% | 13.9% |
| mapa 2 battle | 12.6% | 11.2% | 9.7% | 7.8% |
| mapa 2 boss | 12.8% | 10.1% | 8.3% | 6.4% |
| mapa 2 elite | 11.2% | 9.7% | 6.9% | 5.3% |
| mapa 2 raid | 6.5% | 5.7% | 4.2% | 3.8% |
| mapa 3 battle | 3.5% | 2.8% | 1.4% | 1.4% |
| mapa 3 boss | 14.6% | 9.3% | 7.1% | 6.2% |
| mapa 3 elite | 5.6% | 3.5% | 2.6% | 1.7% |
| mapa 3 raid | 1.5% | 1.0% | 0.6% | 0.3% |

## Leitura

1. **O mapa 1 domina o efeito.** No endgame, as mortes em elite do mapa 1 vão de 11,5% para 21,5%, 29,8% e 36,8% das runs (leve, média, forte).
   - A média da escada cai de 32% para 20%, 14% e 9%.
   - Mesmo a versão leve (×1,06) tira cerca de 12 pontos de todos os níveis.
2. **O mapa 3 mais forte quase não aparece.** As runs morrem antes de chegar nele. As mortes no mapa 3 até caem, por falta de runs que cheguem lá.
3. **Jogo base:**
   - O boss do mapa 2 com 5 nós cai de 12% para 7%, 4% e 3%; com 15 nós, de 57% para 50%, 46% e 42%.
   - A 1ª vitória com 15 nós cai de 18% para 14%, 13% e 12%. Atrasa, como era aceitável.
4. **O simulador e o humano discordam nos mapas 1 e 2.** O humano passa quase sem perder rodada. O simulador, no endgame de hoje, já morre 11,5% em elites do mapa 1. Por isso a queda medida aqui é o teto do impacto, não a previsão para o humano.
