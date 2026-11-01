# Grand Journey — instruções para Claude Code

Este pacote é uma cópia isolada da v54 de Carlos Felipe Sylla para balanceamento. Comece lendo `LEIA_ME_CLAUDE.md` e `Grand_Journey_Projeto_v54.md`. O pedido detalhado está em `PROMPT_CLAUDE.md`.

- Não publicar, alterar audiência ou conectar ao repositório/site principal. O `.openai/hosting.json` foi preservado por fidelidade da exportação, não como autorização de publicação.
- Primeiro auditar e diagnosticar. Não alterar parâmetros do jogo antes de aprovação de Carlos; pode criar scripts novos de análise e simulação separados.
- Usar o motor real. Não reconstruir um simulador aproximado que omita energia, mão, carga, alvo, posição, upgrades, fusão, defesa, traits, bolsa, árvore ou fases de raid.
- Separar simulação executada de hipótese e proposta; registrar seeds, política de decisão, comandos, tempos, limites e tamanho da amostra.
- Não usar hacks/fixtures de recursos ilimitados como prova de dificuldade real. Distinguir unidade/rodada/confronto/raid/run e perfil permanente.
- Preservar mecânicas aprovadas, IDs estáveis, interface e compatibilidade de saves. Propor mudanças estruturais e metas de vitória separadamente.
- Base original tem 77 personagens, 25 relíquias, 22 eventos regulares e 29 traits (16 facções, 7 atributos, 6 temperamentos). Fairy tem identidade, sem bônus coletivo. Blackfang/Dawncrest são ordens.
- Patamares 2/4, Orc/Centaur 2/3, personagens distintos em campo, fixos ao iniciar rodada. Duplicatas/banco não elevam tier. Detalhes v54 no código e documento.
- Não há trait de ataque rápido ou autocura; itens/skills/árvore ainda podem tê-los. Velocidade de ataque pode acelerar especial por ataques.
- A documentação histórica e testes de versões anteriores não sobrepõem regras atuais. Divergência código/documento deve ser registrada, não corrigida silenciosamente.
- Sem global page scrolling; três colunas em menus de cartas; VT323 Regular 400, wordmark Georgia e tagline Nunito. Nenhuma mudança visual é necessária neste trabalho.
- Se aprovado, trabalhar em cópia/branch local e entregar apenas alterações próprias, relatório, tabela antes/depois e patch aplicável à base v54. Desenvolvimento paralelo no ChatGPT pode avançar, então nunca devolver substituição indiscriminada da pasta inteira como integração.
- Código estático em `dist/` é fonte real, sem etapa de build. `node scripts/validate-balance-base.cjs` é a validação selecionada. Ler scripts e testes antes de extrair conclusões.
