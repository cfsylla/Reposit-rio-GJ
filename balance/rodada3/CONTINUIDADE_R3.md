# Continuidade da Rodada 3 (para retomar numa conversa nova)

Atualizado em 09/11/2026. Repositório `cfsylla/Reposit-rio-GJ`, branch `ccr-fc0114d7-9l2urp` (antes `ccr-189ed62b-9mch05`). Cópia de trabalho do jogo: `game_r3/`
(base: publicação 50). Para retomar, diga ao Claude: **"continuar a partir de balance/rodada3/CONTINUIDADE_R3.md"**.

## Regras de trabalho do Carlos
- Responder **sempre em português**. Nada é aplicado sem aprovação (ajuste de valores dentro de um conceito aprovado pode ser iterado).
- **"Não rode nada"** = não simular até ele dizer "pode rodar". Avisar antes de avançar de etapa; nesta etapa ele pediu para **não avançar sem autorização**.
- Medir antes de afirmar; entregas parciais com previsão de tempo; tabelas e PDF; commit + push na branch a cada passo.
- Decks nos relatórios com **nome em inglês**.

## Estado atual do jogo (`game_r3`) — tudo aprovado e gravado
| Tema | O que está no jogo | Onde |
|---|---|---|
| Cura dos suportes | % da vida de quem cura; Fada 2 s, Xamã 3 s, Sacerdotisa 4 s, Harpista 5 s; ±10%; teto por pulso no Titan/True Boss | `supports-b.js`, `game-0.js` |
| Árvore | Custo por anel × tipo (8 / 16-24-36 / 30-45-53 / 32-56; total 1.754); básicos dos anéis 1-2 ×3; **janela da árvore na derrota** sem penalidade | `tree-data.js`, `tree-engine.js`, `tree-ui.js` |
| Escada de barreiras | Força dos inimigos por barreira (ordens, entrada dos mapas 2-3, luta de boss inteira); **raids ×1,30/1,37/1,46** e **Titã como boss ×1,04** | `acts-engine.js` (`JOURNEY_BARRIER_TUNE`) |
| True Bosses | ~12–15 pontos abaixo do boss 3 (Andarilho 1,49, Dark Elf 1,28, Fada 1,74) | `boss-engine.js` |
| Desafios / Vantagens | Recalibrados (−7 a −12 / +2 a +7) e gravados; **medição final em espera** (depois das relíquias) | `challenges.js`, `advantages.js` |
| Relíquias | **43 relíquias** (25 revistas + 18 novas), 6 categorias, 8 formatos novos, textos PT/EN montados da tabela `JOURNEY_RELIC_TUNE` | `relics-r3.js` (arquivo novo + 1 tag no `index.html`), `game-0.js`, `content-v53.js`, `traits-v54.js`, `supports-b.js`, `game-5.js` (dicionário extra) |

Resultado da escada (carreiras, antes das relíquias): 1ª vitória run ~15 (escolha livre de caminho; 18 com raids ajustadas), 17–18 nós, árvore completa ~run 40 (aprovado).

## Relíquias: onde estamos
- Proposta e decisões: `balance/rodada3/reliquias/PROPOSTA_RELIQUIAS_R3.md` (seções 1–11).
- Medição "o que temos hoje" (25 antigas): `balance/rodada3/relatorios/R3_reliquias.pdf`.
- **Calibração em andamento** (decisão do Carlos 09/11): só nos **10 decks de teste**, só relíquias **gerais**; **nicho não é ajustado agora**; Totem da Horda e Bênção da Aurora fora desta etapa; valores inteiros (Centelha, Arranque, Bússola, coringa, Espelho), Estandarte do Capitão e Grimório (só nas carreiras) fora.
- Régua: × ouro (efeito ÷ efeito de +35 de ouro), medido em **lutas vencidas com 10 nós** (23 nós tem régua instável). Faixas: comum 0,8–1,2 · incomum 1,1–1,5 · rara 1,4–1,9 · ultra 1,8–2,5.
- **Passo 2 concluído** (variante `balance/rodada3/variants/rel_c2.json`, dados `balance/out/rodada3/relc2_10`): 9 de 21 na faixa, 4 perto.
- **09/11 (Carlos): conceitos novos das 3 ultras aprovados e implementados no código** (nada rodado):
  - Ampulheta: começa com a **habilidade pronta** (`hourglass: 1`; fixo, sai da calibração).
  - Eco Arcano: **toda** habilidade devolve **30%** da carga (`echoRefund: .30`; calibrável, teto 70%).
  - Funda de Cerco: arremesso **1 s depois** do início da rodada (para não cair no meio da frente inimiga), cai **invulnerável por 1 s**, atordoa **1,5 s**, **sem escudo** (`slingDelay`, `slingInvuln`, `slingStun` fixos; só `slingDamage` calibrável).
  - Arquivos: `game_r3/dist/relics-r3.js`, `game_r3/dist/game-0.js` (Ampulheta 100%), testes `relics-r3.cjs` e `systems-v18.cjs` atualizados (**ainda não rodados**), `rel_c3.json` com os conceitos novos, `r3-reliquias-calib.cjs` com os botões novos.
- Tempos medidos (4 núcleos): 10 nós × 40 seeds × 24 configurações ≈ 35 min; 23 nós × 20 seeds ≈ 20 min (40 seeds ≈ 40 min); carreiras 10 decks ≈ 10–15 min; parcial por facção (0/10/23 nós) ≈ 15–20 min cada.
- **Aguardando autorização do Carlos** ("não rode nada ainda") para:
  1. **Passo 3** (variante `rel_c3.json` já calculada) + conceitos novos propostos para 3 ultra raras: Ampulheta = começa com a habilidade pronta (100%); Eco Arcano = toda habilidade devolve 30% da carga; Funda de Cerco = ao cair ganha escudo 30% + 1 s invulnerável, atordoamento 1,5 s.
  2. Conferência com 23 nós; depois gravar os valores no jogo (`game-0.js` RT), parciais por facção (Ironbound / Blackfang / Dawncrest) e PDF consolidado; carreiras para conferir a escada (as relíquias dos inimigos também mudaram).

## Pendências depois das relíquias
1. Desafios e Vantagens: medição final isolada, escada de combinações (1 desafio, 1+1… até 15+15; 23/30/45/60 nós), meta "tudo ligado" ~50–70% com árvore completa; PDF. Scripts prontos: `r3-dv-escada.sh`, `r3-postgame-tree.sh`.
2. Novo pacote de checkpoint (CP4) no formato do CP3, quando o Carlos autorizar.
3. Para depois: economia permanente (proposta em `balance/rodada3/economia/`), Secret Boss (a definir), playtest do Carlos.

## Ferramentas principais (`balance/sim/`)
- `r3-reliquias.sh <árvore> <saída>` (env `DECKS`, `SEEDS`, `RELICS`, `GJ_TREE_VARIANT`) · `r3-reliquias-calib.cjs` (env `METRIC=w10`) · `r3-reliquias-report.cjs` · `r3-relatorio-reliquias.cjs` (env `PREFIX`) → `html2pdf.cjs`.
- Escada/carreiras: `r3-car-run.sh`, `r3-escada-iter.sh`, `r3-escada-report.cjs`, `r3-barreiras.cjs`, `r3-raid-iter.sh`, `r3-raid-report.cjs`, `r3-deck-careers.cjs`.
- Testes: `game_r3/tests/relics-r3.cjs`, `escada-r3.cjs`, `defeat-window-r3.cjs`, `tree-rings-r3.cjs`; validador `game_r3/scripts/validate-balance-base.cjs`. A suíte tem 18 falhas antigas (as mesmas da v50).
- Cuidado: jobs longos devem rodar com o mecanismo de segundo plano da sessão (não com `&`), em blocos de até 2 h.
