# Rodada 3, Etapa 0: base v50 e comparação com o CP2

Data: 05/11/2026. Base: publicação 50 (commit `aed07ed`, identificação interna v56).

## Estrutura
- `v50/`: publicação 50 intacta (referência). `game_v50/`: cópia de trabalho (hoje idêntica).
- `balance/rodada3/pacote_v50/`: documentos do pacote do ChatGPT (prompt, briefing, manifesto, loader).
- Simulador: `engine.cjs` carrega cópias v50+ na ordem do `index.html` até `game-2.js` (igual ao loader oficial);
  `run.cjs` aceita a ausência das APIs de Gêmeo/Relíquia Escolhida (vantagens retiradas).

## Validações na base (todas PASS)
`scripts/validate-balance-base.cjs`, `tests/progression-v56.cjs`, `tests/integration-cp2.cjs`, `tests/challenges-p5.cjs`, `tests/advantages-p5.cjs`.

## CP2 × v50: dados de balanceamento
| Bloco | Resultado |
|---|---|
| 115 personagens do CP2 | idênticos |
| Personagens novos | +26: 9 bosses Ironbound (`boss_ib_*`) e 17 cartas de bosses (`hero_*`) |
| Árvore (60 nós, custos), modelo de nível, curva dos mapas, XP | idênticos |
| 24 decks, traits, suportes (`supports-b.js`) | idênticos |
| 15 desafios, 15 vantagens (IDs e valores) | idênticos; candidatos retirados (incl. desafio que mexia na árvore) removidos do código |
| Vantagens | **mudança de conceito**: agora podem ser desativadas, devolvendo a insígnia (no CP2: sempre ativas) |
| Loja | refresh mantém o número de slots (não recompõe vendidos) |
| Bosses | **Ironbound vira a ordem padrão**: rota sem ordem enfrenta `ironbound_boss` em cada mapa e, no mapa 3, o True Boss `ib_wayfarer` (2 formas) se as 2 anteriores foram Ironbound |

## Medição rápida do impacto (5 decks de triagem × 20 seeds, jogador "smart")
| Árvore | Cópia | Passa boss 1 | Passa boss 2 | Vence a run |
|---|---|---:|---:|---:|
| vazia | CP2 | 57% ±10 | 11% | 7% ±5 |
| vazia | v50 | **34% ±9** | 3% | 2% ±3 |
| 250 pontos | CP2 | 99% ±2 | 88% | 64% ±9 |
| 250 pontos | v50 | 92% ±5 | 75% | **52% ±10** |

Mortes no boss do mapa 1 com árvore vazia: CP2 3 (genérico); v50 26 (Ironbound).
Com 250 pontos, 22 de 100 runs v50 chegaram ao True Boss Ironbound no mapa 3.
Conclusão: o boss Ironbound é a principal causa medida do gargalo do mapa 1 na v50. Amostra pequena; a linha de base completa é a Etapa 1.
