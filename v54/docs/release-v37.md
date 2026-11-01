# Grand Journey v37

Atualização autorizada: 22 personagens com as artes fornecidas e fichas aprovadas.

- 18 Dawncrest; Harpista Élfica como líder escolhida pelo criador.
- Xerife, Barda e Gladiador no catálogo geral.
- Guardião Blackfang integrado à ordem e a seus encontros.
- Novas runs: duas forças distintas da Dawncrest nas camadas 5 e 10; vencer ambas seleciona a Harpista para o boss final (4 vitórias). Derrotá-la revela coleção e booster próprio. Nenhuma cópia é concedida pelo desbloqueio.
- Vitórias de ordens diferentes não se combinam para liberar um boss.
- Runs existentes mantêm mapa e disponibilidade de cartas. Desbloqueios de ordem passam a valer para recrutamento em novas runs.
- 77 personagens totais: 41 gerais, 18 Blackfang e 18 Dawncrest.
- Bônus da mesma habilidade renovam o efeito; redução total de dano limitada a 65%. Curas não revivem. Movimento não concede invulnerabilidade.
- Novos gatilhos por ataques recebidos contam apenas ataques básicos que acertam.
- Nomes, descrições e chamadas de skills em EN/PT-BR.

Dados auditáveis: `roster-v37.json`; implementação: `dist/game-0.js`; artes: `dist/roster-v37-assets.js`.

## Preservado

Mesmo Site e Project ID; acesso customizado, proprietário e convidados inalterados. Saves continuam no formato v20 e perfil schema 1. VT323 Regular 400, Georgia no título, Nunito no subtítulo, três colunas no celular e menus próprios do jogo. Nenhuma animação nova do Warrior. Monstros, três atos, energia de run, login diário e Essência continuam pendentes.

## Validação

- 22 casos de integração v37: skills, bônus, escudos, canalização, progressão, idiomas, dados, assets e persistência legada.
- Oito replays determinísticos com o elenco anterior idênticos à v36.
- Suítes Blackfang, treino, revisões v32/v33, interface v28, movimento v30, update v29 e sistemas v18 passaram.
- Sintaxe de todos os arquivos JavaScript e git diff --check passaram.
- Prévia de 360px: catálogo de 41 personagens antes dos desbloqueios, três colunas, fichas dos três personagens gerais, última linha acessível e nenhuma rolagem horizontal.
- Testes históricos setup-v19, combat-replay-v21, tutorial-ui-v24, tutorial-guard-v23 e pending-v22 já falhavam na fonte v36; comparados separadamente com a fonte original e não alterados para mascarar essas falhas.
