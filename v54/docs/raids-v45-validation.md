# Validação das quatro raids — v45

Base v43 recuperada do Git. Artes originais, oito espécies inimigas, 77 personagens jogáveis. Estas simulações são diagnóstico de implementação e calibração inicial; não representam balanceamento final nem economia/decisões humanas de uma run completa.

## Treinamento

10 decks × oito seeds × U0/U1 × quatro espécies = **640 simulações de raids completas**. Compra/energia e posicionamento automático simples; até cinco rodadas. Resultados finais após calibração inicial de Kraken/Lich:

| Raid | Vitórias U0 | Vitórias U1 |
|---|---:|---:|
| Hidra | 29/80 | 72/80 |
| Kraken | 32/80 | 71/80 |
| Lich | 32/80 | 72/80 |
| Naga | 10/80 | 53/80 |

A maioria das vitórias ocorreu nas rodadas 4 e 5. Nenhuma simulação de treino atingiu o limite de diagnóstico. Relatório JSON inclui resultados por deck e rodadas.

## Run — fixtures por posição

**480 cenários**, com 10 decks, quatro seeds e modificadores de primeira raid/segunda raid/Boss. Os perfis usam upgrades e relíquias definidos no script, sem simular decisões/economia de um percurso inteiro.

| Raid | Primeira raid | Segunda raid | Boss |
|---|---:|---:|---:|
| Hidra | 40/40 | 33/40 | 11/40 |
| Kraken | 40/40 | 35/40 | 6/40 |
| Lich | 40/40 | 33/40 | 9/40 |
| Naga | 40/40 | 24/40 | 3/40 |

A fixture Hidra/arcane/seed 2 no Boss passou o limite inicial de diagnóstico de 600s; foi retomada em simulação mais longa e venceu na rodada 3 aos **633,2s**. Não era travamento. Limite diagnóstico do script v45: 1200s. O jogo não tem esse limite. Mantidos os percentuais de posição anteriores: primeira raid HP48%/dano72%/lacaios72%; segunda HP82%/dano93%/lacaios93%; Boss HP135%/dano115%/lacaios115%. A dificuldade por etapa e o caso de combate longo permanecem dados para o balanceamento integrado futuro.

## Contratos e regressões

- `raids-v45`: cabeças dependentes de lacaios, marcas fixas e ácido, puxão somente de vivos, ressurreição limitada/uma por corpo e corrida com a reposição R5 (máximo dois lacaios vivos), prioridade da morte do chefe, snapshot de ritual, veneno com teto/expiração/esquiva, cone petrificante e entrada real das quatro espécies na run.
- `monsters-v42`, ampliado: oito espécies, cinco fases, vida persistente/aliados revividos, derrota após cinco perdas, ausência de timeout, snapshots determinísticos, prêmios idempotentes e roster isolado.
- `map-v43`, ampliado: 1.000 seeds, três espécies distintas na rota, todas as oito elegíveis a Boss, estabilidade de save, reparo de futuro nó repetido e raid pulada não contada como jogada.
- `raid-v39`, `raid-v40`, `raid-v41`, `training-v31`, `update-v38`: mecânicas anteriores, tiros/impactos, velocidades, isolamento de treinamento, fusão e movimentação.
- `legacy-replay-v39`: 60 replays normais/elite/Boss de decks sem alteração.
- Navegador gerenciado: preparação R4 em 320×640 e 360×740, botão Combater dentro do viewport, altura da página igual ao viewport, sprites carregados, placar e quatro velocidades visíveis. Ritual do Lich e marcas do Kraken conferidos no campo; seletor normal com oito raids. Sem teste em Android físico.

Arquivos temporários de QA não integram a publicação. Nenhum ajuste nos quatro monstros anteriores, perfil, audiência, traits, economia, mapas adicionais ou skill tree.
