# Endgame, etapa 1: referência na v65 (22/11/2026)

**Base:** v65 (`game_v65`, código publicado). Simulador `balance/sim/run.cjs` com os 3 mapas liberados (premissa do endgame), preparo "smart", rota gulosa, eventos seguros e loja equilibrada.
**Amostra:** 24 decks × 20 seeds = **480 runs por célula** (margem de cerca de ±4 pontos). A árvore cresce durante a run (`--treebuy all`).
**Configurações:** base (nada ligado), todas as 15 vantagens, os 15 desafios atuais, e os 15 desafios + as 15 vantagens.
**Reprodução:** `balance/out/endgame/e1_jobs.txt` → `balance/sim/eg-batch.sh` → `balance/out/endgame/e1_ref/`; tabela com `python3 balance/endgame/analise.py ref balance/out/endgame/e1_ref`.

## 1. Vitória na run

| Configuração | 20 nós | 30 nós | 45 nós | 60 nós |
|---|---|---|---|---|
| Base | 41% | 65% | 84% | 99% |
| Todas as vantagens | 80% | 89% | 97% | 100% |
| 15 desafios | 0% | 0% | 0% | 9% |
| 15 desafios + todas as vantagens | 0% | 1% | 14% | **78%** |

## 2. Onde a run termina (20 nós)

| Configuração | Principais derrotas (% das runs) |
|---|---|
| Base | True Boss 20%, boss do mapa 3 12%, ordem do mapa 3 9%, boss do mapa 2 7% |
| Todas as vantagens | True Boss 10%, boss do mapa 3 5%, boss do mapa 2 4% |
| 15 desafios + vantagens | ordem do mapa 1 31%, entrada do mapa 2 15%, boss do mapa 1 13%, ordem do mapa 2 13%, elite do mapa 1 11% |

## 3. Leitura
1. **Nível 15 com tudo:** com a árvore completa e todas as vantagens, os 15 desafios atuais vencem **78%**. A meta é de 50% a 70%: faltam cerca de 10 a 25 pontos. É aí que a escala geral deve agir.
2. **Os 15 desafios da v65 pesam muito mais que na medição de 08/11** (que dava 69% com 23 nós e vantagens). Os valores foram recalibrados para cima depois dela (−7 a −12 cada). Somados, eles derrubam a vitória para 0% até 30 nós.
3. **As vantagens valem muito com pouca árvore:** +39 pontos com 20 nós, +24 com 30. Com a árvore completa, quase nada.
4. **O jogador simulado perde em lugares diferentes do humano:** no simulador, sem desafios, as derrotas vêm do mapa 3 (True Boss e boss). Nas suas campanhas, o mapa 1 (boss, ordens e raids) foi o maior filtro. A calibração com as campanhas (seção 4) vai medir essa diferença.

## 4. Calibração com as campanhas
Fica pronta com a etapa 3, que inclui as runs da base com 10 e 15 nós. Script: `balance/endgame/calib/comparar.py`.
**Limitação registrada:** não dá para repetir as suas lutas no motor da v65, porque os saves não guardam quais unidades estavam fundidas. A fusão é o maior salto de força do jogo. Se for útil, pedir ao ChatGPT para gravar no save, por unidade em campo, se ela está fundida.
