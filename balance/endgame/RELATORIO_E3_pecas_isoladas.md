# Endgame, etapa 3: cada peça sozinha (22/11/2026)

**Base:** cópia de teste `game_v65_teste` (v65 + `challenges-endgame.js`). Conferência: a base da cópia de teste deu **o mesmo resultado da v65** (41%, mesmas 480 runs). O módulo novo não muda nada quando está desligado.
**Método:** 20 nós (início do endgame), 24 decks × 20 seeds = 480 runs por peça, **pareado** (mesmo deck e mesma seed com e sem a peça). Margem = ±1,96 erro-padrão da diferença.
**Meta:** −5 a −10 pontos (exceções −3 a −12).
**Reprodução:** `balance/out/endgame/e3_jobs.txt` → `e3_ref/`; tabela com `python3 balance/endgame/analise.py isolado balance/out/endgame/e3_ref`.

## 1. Resultado (base com 20 nós: 41%)

| Peça | Efeito | Margem | Situação |
|---|---|---|---|
| Reforços Inimigos | **−36,9** | ±4,6 | **muito acima** (ajuste na etapa 3b) |
| Fadiga da Jornada −6% | −27,9 | ±4,3 | muito acima |
| Fadiga da Jornada −5% | −23,5 | ±4,2 | muito acima |
| Fadiga da Jornada −4% | −17,1 | ±4,0 | acima (ajuste na etapa 3b: −2% e −3%) |
| Comandantes Preparados | −12,1 | ±5,5 | limite da exceção |
| Tropas Resistentes | −9,8 | ±3,1 | na meta |
| Deck Pesado | −8,1 | ±5,3 | na meta |
| Ataques Implacáveis | −6,0 | ±3,3 | na meta |
| Recursos Escassos | −5,4 | ±4,2 | na meta |
| Mercado Inflacionado | −5,4 | ±4,3 | na meta |
| Fúria das Raids | −5,0 | ±2,7 | na meta |
| Caminho Amaldiçoado | −4,8 | ±5,8 | exceção |
| Veteranos | −4,6 | ±2,4 | exceção |
| **Decks Reforçados** (novo) | −4,6 | ±5,3 | exceção |
| Bosses Implacáveis | −4,2 | ±2,9 | exceção |
| Bolsa Leve | −4,0 | ±4,1 | exceção |
| Energia Dissipada | −3,8 | ±3,1 | exceção |
| Bagagem Limitada | −2,5 | ±4,5 | abaixo |
| **Derrota Custa Ouro** (novo) | −2,5 | ±3,0 | abaixo |
| Relíquias Escassas | −0,6 | ±5,5 | abaixo |
| **Menos Apoio no Mapa** (novo) | +0,2 | ±5,4 | ≈ 0 (ajuste na etapa 3b: 2 camadas) |
| **Loja com Menos Opções** (novo) | +3,8 | ±3,4 | ≈ 0 ou positivo |
| **Relíquias Amaldiçoadas** (novo) | +4,0 | ±5,1 | ≈ 0 (ajuste na etapa 3b: 50% e 66%) |
| **Mais Elites no Mapa** (novo) | +4,4 | ±5,7 | ≈ 0 (ajuste na etapa 3b: 3 camadas) |

## 2. Por que alguns candidatos novos ficaram perto de zero

| Peça | O que mudou na run (média por run) | Leitura |
|---|---|---|
| Mais Elites | elites simples: 1,6 → 6,4; derrotas em elite: 1% → 10% | O risco aparece (+9 pontos de runs perdidas em elites), mas quase só em runs que **já iam morrer** depois (no mapa 3). Para o simulador, a elite filtra menos que o boss e o True Boss |
| Relíquias Amaldiçoadas | 0,7 maldição por run | Fardo e Correntes são leves, e o simulador remove maldições na loja quando sobra ouro |
| Menos Apoio | ouro: 442 → 476; relíquias: 4,9 → 4,4 | As batalhas extras dão ouro e XP e compensam o apoio perdido |
| Loja com Menos Opções | quase nada | O simulador compra pouco na loja e não aproveita a variedade. **Não dá para medir pelo simulador; precisa de playtest** |
| Derrota Custa Ouro | perde pouco ouro | O simulador perde poucas rodadas nas lutas que vence |

**Limite do simulador:** peças de escolha e de economia (loja, ouro, maldições) pesam menos para ele do que para um humano. Já as de combate (Reforços, Fadiga) ele sente muito.

## 3. Calibração com as suas campanhas (C1, C3 e C4)
Comparação por tipo de luta (`balance/endgame/calib/comparar.py`): % de lutas perdidas e rodadas perdidas por luta.

| Luta | Você com 10 a 19 nós | Simulador com 15 nós | Simulador com 20 nós |
|---|---|---|---|
| Boss do mapa 1 | 0% · 1,0 | 4% · 0,9 | 1% · 0,4 |
| Boss do mapa 2 | 0% · 1,0 | 21% · 1,5 | 8% · 0,8 |
| Ordem do mapa 2 | 0% · 0,1 | 7% · 0,5 | 1% · 0,2 |
| Elite do mapa 2 | 0% · 0,3 | 2% · 0,2 | 1% · 0,1 |

- **Nas barreiras principais (bosses e ordens), você com 10 a 19 nós joga como o simulador com cerca de 20 nós.** Ou seja, o humano vale uns **5 nós a mais** que o simulador.
- No começo do endgame (você com 17 a 21 nós), o simulador equivalente teria uns 22 a 26 nós: entre 41% (20 nós) e 65% (30 nós) de vitória na base. **Com 20 nós, o simulador é uma régua um pouco mais difícil que a sua.**
- Nas raids, você perde mais que o simulador (com 0 a 9 nós: 25% contra 4%).
- **Amostra humana pequena:** de 1 a 12 lutas por célula. Serve como ordem de grandeza.
- **Repetição das lutas reais:** não é viável, porque os saves não guardam quais unidades estavam fundidas.
