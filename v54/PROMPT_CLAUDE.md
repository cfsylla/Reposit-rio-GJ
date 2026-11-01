# Prompt para enviar ao Claude Code

Você vai me ajudar no balanceamento integrado de Grand Journey, meu auto-battler roguelite de cartas. Extraí o arquivo `Grand_Journey_v54_Completo.zip`; trabalhe na pasta extraída `Grand_Journey_v54_Completo`.

O ZIP já contém o jogo completo com código JavaScript/HTML/CSS editável, todos os assets, testes, `Grand_Journey_Projeto_v54.md`, instruções `LEIA_ME_CLAUDE.md`, `CLAUDE.md` e dados de apoio. Não preciso que acesse meu ChatGPT ou o site hospedado. O código em `dist/` é o código-fonte real, não um build que exige recuperar outro repositório.

Leia primeiro `CLAUDE.md`, `LEIA_ME_CLAUDE.md` e o documento v54. Confira a integridade e a ordem de carga em `dist/index.html`. A base é o commit9b8bff1085f72112d492fd40ffba6c1ab63011b7. Informe qualquer arquivo faltante antes de iniciar análises que dependam dele.

Meu desenvolvimento principal continuará no ChatGPT em paralelo. Não publique nem altere o site principal. Inicialmente não altere parâmetros do jogo; você pode criar scripts de análise e testes separados. Após minha aprovação, poderá mudar valores somente nesta cópia.

Objetivo: balancear personagens, habilidades, upgrades/fusões, traits, relíquias/bolsa, maldições/eventos, ouro/lojas/recrutamento/recompensas, inimigos, três mapas, elites/bosses/raids/true bosses e árvore permanente/XP. Quero uma progressão interessante e várias composições viáveis, sem apagar a identidade dos personagens ou transformar todas as equipes em equivalentes.

Use o motor real. O ponto de partida é `node scripts/validate-balance-base.cjs`; leia o runner e os testes. Use os arquivos e funções existentes para suas simulações. Não recrie o combate com fórmulas aproximadas nem substitua regras difíceis por atalhos. Se não conseguir executar, explique a limitação e entregue somente análise estática identificada como tal.

O JSON em `balanceamento/dados_base_v54.json` é apoio para tabelas, não substitui a lógica. Pode regenerá-lo com `node scripts/export-balance-data.cjs` depois de alterações aprovadas.

Pontos importantes:
- O começo já pareceu aceitável, mas o final excessivamente difícil. Compare upgrades/relíquias inimigos com o que a economia realmente permite ao jogador naquele ponto, incluindo oportunidades de loja e caminhos.
- A v54 revisou traits e reduziu habilidades individuais de autocura/proteção. Investigue loops de escudo/sobrevivência, invencibilidade prática, composições dominantes e efeitos irrelevantes.
- Velocidade de ataque também aumenta frequência de especiais carregados por ataques. Considere o efeito indireto.
- Contar personagens diferentes em campo para traits, não cópias repetidas; seguir os patamares e congelamento de tier documentados.
- Comparar perfis sem árvore, intermediários e avançados com os nodes explicitados.
- Raids mantêm HP do chefe entre rodadas e permitem desenvolver o deck ao longo do confronto. Não avaliar a raid inteira por uma rodada isolada.
- Eventos precisam ser comparados aos valores reais de loja: custo, risco, probabilidade, perda, alvo escolhido e impacto posterior. Valor esperado isolado não basta.
- Avaliar também mão, compra, energia, implantação/banco, fusão, posicionamento, carga de especial, escolhas de rota, limite de cópias e encaixe real de relíquias.
- Fixtures com recursos ilimitados/vitórias forçadas servem para testar regras, não representam runs normais. Não use esses resultados como taxa real de vitória.
- Separe problema de balanceamento de bug, erro de fixture ou limitação da política de IA. Não assuma que derrota de uma IA fraca prova fraqueza da composição.

Faça em etapas:
1. Inventário das regras, parâmetros e arquivos; registrar divergências entre código e documentação.
2. Executar os testes relevantes e registrar a linha de base.
3. Propor metas de dificuldade e cenários para validarmos; não assumir sozinho uma taxa ideal de vitória.
4. Criar simulações reproduzíveis com seeds e políticas explícitas, usando o motor real. Cobrir lutas isoladas e progressão econômica; declarar o que não foi simulado.
5. Medir antes de sugerir ajustes. Testar variedade de composições, raridades, níveis, posição, relíquias e perfis, evitando conclusões só por DPS teórico.
6. Apresentar problemas priorizados e alterações graduais para minha aprovação.
7. Se aprovadas, aplicar os ajustes nesta cópia e repetir os mesmos cenários/seeds, com amostra e condições equivalentes.

Entregue:
- Diagnóstico conciso com prioridades e limitações.
- Comandos, seeds, políticas e resultados efetivamente executados, sem inventar números.
- Tabela: ID, parâmetro, arquivo/função, valor original, valor proposto, justificativa e evidência.
- Após aprovação: diff dos arquivos e scripts/testes novos, preservando a base original para comparação.
- Resumo de integração para o ChatGPT aplicar somente as alterações aprovadas à versão mais recente. Evite substituir o projeto inteiro e sobrescrever desenvolvimento paralelo.

Comece confirmando os arquivos e a versão encontrados, como executar o motor real e qual será a primeira bateria de análises. Ainda não modifique os valores de balanceamento.
