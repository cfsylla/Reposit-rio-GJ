# Checkpoint GJ-v50-BAL-CP3 (07/11/2026)

Base: publicação 50 (commit `aed07ed`, v56 interna). Tudo aprovado pelo Carlos durante a rodada 3.

## 1. Resumo
1. **XP e árvore (obrigatório):** o XP é um recurso da run, gasto 1:1 nas janelas da árvore. A sobra passa entre janelas e mapas da mesma run e é perdida no fim da run. Não há banco permanente. O reset devolve só o investimento. A árvore inteira (60 nós) passa a ser alcançável.
2. **Janela no meio do mapa:** a árvore abre sozinha depois da **6ª luta** de cada mapa, além da janela pós-boss. Os nós comprados valem na hora.
3. **XP por encontro:** peso × mapa (luta 1, elite/ordem/Titans 2, boss 4, True Boss 6, Secret Boss 8; × 1/2/3).
4. **2º anel da árvore:** 16 nós de custo 10 → 8 (a janela do mapa 1 sempre compra 1 nó nas primeiras runs).
5. **Bosses:** ajustados só nos dados de inimigo. Ficam com dificuldade próxima dentro de cada mapa, mais difíceis do mapa 1 para o 3, e com o True Boss mais forte que o boss comum.
6. **Auras:** só Priestess, Flower Fairy, Elf Harpist e Shaman curam. Os outros 6 suportes têm 1 buff sem cura (o Goblin King mantém 2). Os valores foram compensados no laboratório.
7. **Decks:** 6 decks ajustados para a 1ª vitória ficar entre as runs 12 e 22.
8. **Desafios e Vantagens:** 3 valores ajustados (Fúria das Raids, Recursos Escassos e Treino Prévio).

## 2. Metas e resultados (validação final)
Jogador simulado no nível da IA do jogo, sem Desafios e sem Vantagens. Um humano tende a ir melhor.

| Meta (Carlos) | Resultado | |
|---|---|---|
| 1ª vitória entre as runs 15 e 20 | **run 18** (mediana; p10 10, p90 23), 24 decks × 4 carreiras × 50 runs | ✅ |
| 50% a 60% de vitória com metade da árvore (30 nós) | **58% ±4** (24 decks × 20 seeds) | ✅ |
| Árvore completa alcançável | 60 nós por volta da run 32 (mediana); custo total 1.119 | ✅ |
| Desafio sozinho: −5 a −10 pontos | 15 de 15 na faixa (30 nós, 5 decks × 40 seeds, pareado) | ✅ |
| Vantagem sozinha: +3 a +7 (exceções +1 a +9) | 12 na meta/exceção; Limpeza, Fusão Eficiente e Olho Treinado ≈ 0 (negativas aprovadas); Preparação Flexível +9,5 (mantida por decisão) | ✅ |

| Árvore (nós) | 0 | 15 | 30 | 45 | 60 |
|---|---:|---:|---:|---:|---:|
| Vitória na run | 1% | 11% | **58%** | 76% | 97% |
| Passa o boss do mapa 1 | 37% | 70% | 97% | 99% | 100% |

Antes (v50, mesma medição): 1% / 12% / 64% / 84% / 98%; passava o boss 1 em 38% com árvore vazia.

**Nota:** a validação completa foi feita antes das duas últimas decisões do Carlos: o Sage com −45% de dano e o Círculo Arcano com −1 Sage +1 Lancer. O Círculo Arcano foi conferido depois (run 19, 8 carreiras). O Carlos dispensou refazer a validação completa.

## 3. Bosses (laboratório pareado: o mesmo jogador enfrenta todos os bosses)
| | Antes | Depois | Meta |
|---|---|---|---|
| Média dos bosses comuns com 30 nós (mapas 1/2/3) | 95 / 88 / 89% | **96 / 90 / 84%** | mapa 1 > 2 > 3 |
| Diferença entre bosses no mapa 1 (15 nós) | 45% a 97% | 59% a 80% | — |
| Cada boss com 30 nós | até 26 pontos da média | ±5 da média | ±5 ✅ |
| True Bosses com 30 nós (Andarilho / Dark Elf / Fada) | 99 / 97 / 80% | **72 / 76 / 74%** | ~73%, cerca de 10 abaixo do boss comum ✅ |

Os True Bosses mantêm a estrutura do encontro (2 vitórias na forma 1 + forma 2, limite de 5 derrotas). Ficam mais difíceis pelos atributos, sem encurtar a luta.

## 4. Regras vigentes
- **Janelas da árvore:** 6 por run (depois da 6ª luta e depois do boss, em cada mapa). Todas as compras são permanentes.
- **XP:** a sobra passa para a próxima janela da mesma run e é perdida no fim da run. Abrir, fechar ou reabrir a tela, recarregar o save ou repetir a conclusão não duplica XP (chave por encontro e fechamento único por janela).
- **Reset ("Redistribuir árvore"), fora da run:** devolve o custo dos nós num orçamento de redistribuição. A sobra é perdida ao iniciar a run. Um novo reset devolve só o que está comprado.
- **Abandonar run:** não cria XP; o XP não gasto é perdido.
- **Nível exibido** = nós comprados (0 a 60).
- **Diamantes:** o XP só vira diamante (1 a cada 20) com a árvore completa.
- Mantidos da v50: 95 milestones, desbloqueios por ordem e True Boss, 17 cartas de bosses (intactas), raids, IDs e saves.

## 5. Validação técnica
- Patch contra a v50 conferido: uma v50 limpa com o patch fica idêntica a `arquivos_alterados/`.
- `scripts/validate-balance-base.cjs`: **PASS** (todas as etapas).
- Testes novos: `xp-r3.cjs` e `auras-r3.cjs`, **PASS**. Expectativas atualizadas em 6 testes, todos **PASS**.
- Suíte completa (61 testes, cada um rodado sozinho): 43 PASS; os 18 que falham são **os mesmos que já falhavam na v50** (assets ausentes, módulos parciais, histórico). Nenhuma regressão. Lista em `validacao/README_VALIDACAO_CP3.md`.

## 6. Revisado / não revisado
**Revisado:** XP, árvore e janelas; custo do 2º anel; bosses comuns e True Bosses de Ironbound, Blackfang e Dawncrest; auras; 6 decks; 15 desafios; 15 vantagens.
**Não revisado:**
- raids e Titans como boss de mapa (sistema de vida persistente; ficaram fora do laboratório);
- Secret Boss e Desafio Final (conteúdo a definir no projeto principal);
- economia permanente (proposta em decisão);
- relíquias do jogador; eventos e maldições;
- decks mantidos fortes por decisão: Corte Sombria, Linha de Fogo e Coro de Dawncrest.
