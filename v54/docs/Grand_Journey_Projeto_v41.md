# Grand Journey — continuidade v41

29/10/2026. Mesmo Site/projeto e audiência; base v40. As regras e pendências não tratadas de v39/v40 permanecem. Atualização autorizada: balanceamento da Árvore, feedback de ataque, ×3, placar e resultado enxuto.

## Alterações

- Placar padrão 0:0 restaurado na preparação/combate, centralizado no topo. Mantém barra de vida simplificada, sem descrições de fase.
- Resultado sem painel extra de dano ao chefe/Brotos/cura e sem texto explicativo abaixo da vida. Mantém relatórios padrão de dano e ações no rodapé fixo. Dados detalhados continuam internos para testes, sem painel duplicado.
- Velocidades persistentes ×1/×1,5/×2/×3, com quatro botões dividindo a área dos três anteriores. Mantém passos de simulação de até 1/60 s, sem aumentar o tamanho do passo ao acelerar.
- Ataque básico da Árvore: brilho de preparação no núcleo por 0,45 s, projétil violeta por 0,22 s, impacto visível no alvo. Dano resolvido na chegada. Alvo morto cancela o tiro; chefe morto encerra imediatamente a raid. Marcações de raízes e ligações de cura permanecem. Ataques em andamento são serializados e retomados sem duplicação.
- Sem timeout/frenzy na raid; limite de cinco rodadas perdidas, HP persistente, formação/fusões/banco, no treino sem recompensas. Sem mudanças nas cartas nem nos nodes da run.

## Balanceamento

| Parâmetro | v40 | v41 |
|---|---:|---:|
| Vida da Árvore | 12.500 | 17.000 |
| Ataque / intervalo | 24 / 1,7 s | 52 / 1,5 s |
| Vida / ataque dos Brotos | 310 / 18 | 400 / 34 |
| Primeiro aviso / intervalo de raiz | 8 / 10 s | 6 / 9 s |
| Dano bruto de raiz | 38 | 70 |
| Primeira canalização / intervalo | 13 / 18 s | 12 / 16 s |
| Cura por Broto / limite efetivo por rodada | 120 / 480 | 160 / 800 |

Defesas, alcance, velocidade dos Brotos, raio/aviso/imobilização da raiz, canalização de 3 s e reposição única aos 28 s mantidos. Configuração em JourneyRaid.CONFIG. **Uma raid já iniciada conserva seu balanceamento salvo; iniciar uma nova para testar os novos valores.** Saves preservados.

## Comparação de decks

320 simulações finais: 10 decks × 2 níveis × 16 seeds. Cada linha tem 16 tentativas. Nível U1 significa todas as 20 cartas já com U1, um cenário de equipe melhorada, não economia real da run. IA de teste simples: joga cartas acessíveis, tenta fusões, preenche banco e promove unidades. Não representa decisões humanas ótimas nem prova de equilíbrio definitivo.

Baseline v40 sem limite de tempo: 320/320 vitórias. Após ajuste v41: 48/160 sem upgrades (30%); 130/160 com todas U1 (81,25%). Composições fortes de sustentação/disparo seguem favorecidas, porém passam pelas fases finais. Reavaliar após jogar; não buscar taxa idêntica entre decks.

| Deck | Sem upgrades | Todas U1 | Rodadas das vitórias sem upgrades |
|---|---:|---:|---|
| Vanguard | 7/16 | 13/16 | 5 |
| Balanced | 3/16 | 14/16 | 5 |
| Swift | 1/16 | 11/16 | 5 |
| Arcane | 2/16 | 7/16 | 3–5 |
| Outlaws | 1/16 | 13/16 | 5 |
| Fortress | 11/16 | 16/16 | 4–5 |
| Blades | 5/16 | 15/16 | 5 |
| Fireline | 14/16 | 16/16 | 4–5 |
| Astral | 2/16 | 11/16 | 5 |
| Corsair | 2/16 | 14/16 | 5 |

Três vitórias ocorreram na terceira rodada (Arcane sem upgrades, Arcane U1 e Astral U1); todas as demais aconteceram na quarta ou quinta. O passo das simulações finais é 1/60 s, igual ao máximo usado pela interface. Nenhuma simulação atingiu o limite diagnóstico de 600 s; esse limite existe somente no script de teste, nunca no jogo.

Reprodução: node tests/raid-balance-v41.cjs. Aceita overrides via variável RAID_CONFIG para explorar valores sem editar a configuração do jogo. Artefato bruto: raid-balance-v41.jsonl.

## Validação

- raid-v41: atraso real até impacto, estado salvo com projétil em trânsito, dano aplicado uma única vez e quatro velocidades determinísticas; persistência de ×3.
- raid-v40: sem limite de tempo, migração, contato e prioridade de vitória.
- raid-v39: fixtures históricas com seus valores originais, mantendo cobertura de HP, fases, raízes, cura, reposição, fusões/banco/freeze e idempotência.
- 60 replays normais/elites/bosses sem diferenças frente à v38; treino v31 e retorno/movimento v38.
- QA visual mobile 360×740 e 320×640 isolado em memória, com controles de velocidade encaixados, placar e ações de resultado sempre visíveis; sem Android físico. Tela inteira fixa, rolagem apenas de painéis, ações fora deles. Respeitar AGENTS.md em toda atualização.

Pendências: avaliação humana do balanceamento; outros monstros e futura integração de raid na run; revisão de traits; balanceamento conjunto de cartas/nodes; demais itens de continuidade anteriores. Não implementar/publicar novos itens sem autorização.
