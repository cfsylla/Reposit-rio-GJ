# Rodada 3 pós-playtest: resumo das etapas 2 a 5 (08/11/2026)

Tudo em `game_r3/` (branch `ccr-189ed62b-9mch05`). Jogador simulado = régua m 1,0 (≈ você no perfil 2).

## 1. O que entrou no jogo (aprovado por você)
| Etapa | Mudança | Arquivo |
|---|---|---|
| 1 | Cura em % da vida de quem cura, ritmo próprio (Fada 2 s, Xamã 3 s, Sacerdotisa 4 s, Harpista 5 s), ±10%; teto por pulso no Titan/True Boss; correção dos suportes atrás do boss | `supports-b.js`, `game-0.js`, `boss-engine.js` |
| 3 | Custo por anel × tipo: anel 1 = 8; anel 2 = 16 (1ª camada) / 24 / 36; anel 3 = 30 / 45 / 53; anel 4 = 32 / 56. Total 1.754, máximo 56 | `tree-data.js` |
| 4 | Básicos dos anéis 1 e 2 valem **×3** (ex.: +3% ataque, +9% vida) | `tree-data.js` |
| 4 | **Janela da árvore na derrota**, sem penalidade (abre se o XP compra 1 nó; a sobra é perdida; abandonar não abre) | `tree-engine.js`, `tree-ui.js` |
| 4 | Força dos inimigos por barreira: ordens ×1,12 / 1,12 / 1,20; entrada (2 primeiras lutas) dos mapas 2 e 3 ×1,12 / 1,24; luta de boss inteira ×1,02 / 1,07 / 1,20 (mapas 1/2/3). Raids, Titans e lutas comuns: sem mudança | `acts-engine.js` |
| 4 | True Bosses mais fortes (Fada estava 94–100% após a correção): agora ~12–15 pontos abaixo do boss comum do mapa 3 | `boss-engine.js` |

Testes novos: `tree-rings-r3`, `defeat-window-r3`, `escada-r3`. Expectativas atualizadas: `tree-v51` (valores dos básicos), `bosses-v50` (tempo do teste da Fada). Validador: **PASS**. Suíte: os mesmos 18 que já falhavam na v50; **nenhuma regressão**.

## 2. Resultado: carreiras (jogo gravado)
**10 decks de teste × 4 carreiras × 40 runs:**

| | Meta | Resultado |
|---|---|---|
| 1ª vitória (mediana) | runs 13–15 | **run 15** (p10 8, p90 21) |
| Nós na 1ª vitória | 16–18 | **17** (p10 11, p90 25) |
| Derrotas no boss 3 antes da 1ª vitória | 2–3 | **1** (p25 0, p75 1) ⚠️ |
| Árvore completa | (anéis: ~25–30) | **run ~40** ⚠️ |

Onde a run termina (mais comuns):
| Run | Nós | Termina em |
|---|---|---|
| 1 | 0 | boss 1 50%, lutas do mapa 1 33% (na run 1 ainda não há lutas de ordem) |
| 2 | 1 | boss 1 40%, ordem do mapa 1 23%, entrada do mapa 2 18% |
| 3 | 2 | ordem do mapa 1 53%, boss 1 25% |
| 5 | 3 | boss 1 40%, ordem do mapa 1 15%, mapa 2 13% |
| 8 | 7 | mapa 2 (entrada) 28%, ordem do mapa 1 25%, boss 2 15%, boss 3 13% |
| 10 | 10 | mapa 2 23%, boss 3 18%, **vitória 18%** |
| 12 | 14 | **vitória 23%**, mapa 2 20% |

**24 decks × 4 carreiras × 40 runs:** 1ª vitória mediana **run 14** (p10 9, p90 22). Nenhum deck acima de 20. Abaixo de 10: Linha de Fogo 7, Astral 9, Corte Sombria 9, Guarda da Floresta 9, Norte 9 (tabela em `balance/out/rodada3/etapa5/DECKS_CARREIRAS.md`).

## 3. True Boss (laboratório pareado, mesmo jogador)
| Nós | Boss comum mapa 3 | Andarilho | Dark Elf | Fada |
|---|---|---|---|---|
| 18 | 75% | 61% | 57% | 61% |
| 23 | 93% | 83% | 84% | 84% |

## 4. Desafios e Vantagens (só medição, 23 nós ≈ 57% de vitória)
(ver seção 6; nenhum valor foi alterado)

## 5. Decisões para você
1. **Boss 3 derrota só 1 vez antes da 1ª vitória** (meta 2–3). Para subir: boss 3 mais forte e mapa 2/3 mais fáceis (a 1ª vitória fica igual). Ajusto?
2. **Árvore completa por volta da run 40** (era ~26 na conta dos anéis, que supunha a escada ideal). Opções: (a) manter (combina com a coleção na run ~43 e "zerado" na run 40–60, como Hades); (b) baratear os anéis 3 e 4.
3. **5 decks com 1ª vitória antes da run 10** (Linha de Fogo e Corte Sombria já eram fortes por decisão). Ajusto Astral, Guarda da Floresta e Norte?
4. **Desafios e Vantagens** foram calibrados com 30 nós; agora a referência é ~23 nós. Ver seção 6 antes de decidir se recalibro.
5. Raids continuam fora do ajuste (o simulado passa ~100% delas; você sentia pressão).

## 6. Desafios e Vantagens: resultado
Base: 23 nós, 5 decks × 40 seeds (pareado), vitória **59%** (no CP3 eram 30 nós ≈ 58%). Nenhum valor foi alterado.

| Desafios | Efeito (pontos) | |
|---|---|---|
| Rodadas extras no boss, Implacável, Amaldiçoado, Dissipar, Bolsa Leve, Recursos Escassos, Inflação | −6 a −9 | ✅ na meta (7) |
| Bolsa, Poucas Relíquias, Fúria das Raids | −3 a −4,5 | exceção (3) |
| **Comandantes −1,5; Resistentes −2,5; Baralho Pesado +0,5; Reforços 0; Veteranos 0** | ≈ 0 | ⚠️ fora (5) |

| Vantagens | Efeito (pontos) | |
|---|---|---|
| Bolsa Cheia +4,5, Mão Planejada +5,5, Relíquia de Viagem +4 | +4 a +5,5 | ✅ na meta (3) |
| Experiência de Elite, Preparação Flexível, Bênção do Caminho, Energia Guardada +8; Caçador de Elites +1,5; Pré-treino +1; Ensaio +1; Segunda Chance +2,5 | +1 a +8 | exceção (8) |
| Limpeza 0, Fusão Eficiente −1, Olho Treinado −3,5 (negativas já aprovadas); **Juros −1** | ≤ 0 | fora (4) |

Os 5 desafios ≈ 0 mexem em inimigos de lutas comuns/elites, que agora pesam menos (as barreiras concentram a dificuldade nas ordens, entradas e bosses). Recalibrar os desafios é decisão sua (item 4 da seção 5).

## 7. Em espera (08/11): Desafios e Vantagens
Decisão do Carlos: as relíquias vêm antes (podem mudar a base da run). Já gravado no jogo: desafios recalibrados para −7 a −12 (Veteranos +8, Tropas Resistentes +10%, Ataques Implacáveis +8%, Comandantes +2/+2, Bosses Implacáveis +7%, Reforços desde a 1ª rodada, Fúria das Raids +25%/+8%, Mercado +30%, Bolsa Leve −27%, Bagagem 5 casas, Deck Pesado +2 cartas genéricas, Caminho Amaldiçoado 2× Exaustão) e vantagens (Juros 100% até 150, Caçador de Elites +20, Bênção do Caminho 2× upgrade 1). Pendente: medição final isolada, escada de combinações (23/30/45/60 nós) e PDF — refazer depois das relíquias. Relíquias Escassas não responde a valor (já no mínimo de 1 opção).
