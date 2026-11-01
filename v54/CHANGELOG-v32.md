# Grand Journey v32

## Ajustes pedidos
- Velocidades: ×1, ×1,5 e ×2. A opção permanece entre rodadas, confrontos e ao recarregar, como preferência deste navegador. Nenhum débito ou sistema de energia para run foi adicionado.
- Tutorial de velocidade atualizado; aceita ×1,5 ou ×2 para continuar.
- Montagem dos times do treino em três colunas, inclusive na largura de 360px, com o estilo compacto do Hack de cartas. Controles de cópias e melhorias preservados.
- Decks, dificuldade, vitórias, melhoria individual e melhoria de todo o deck agora abrem janelas próprias do jogo. Nenhum seletor nativo permanece nas telas do treino. Configurações anteriores continuam disponíveis.

## Bugs investigados e corrigidos
- Ataques corpo a corpo: a caminhada pode terminar a 34,00000000000001 unidades de um alvo, embora o alcance nominal seja 34. A comparação estrita mantinha a unidade tentando andar com um deslocamento menor que a precisão das coordenadas; ela nunca atacava nem carregava o especial. Incluída tolerância numérica de 0,0000001 unidade na comparação de alcance. Não muda alcance de forma perceptível, colisão ou dano.
- Reprodução anterior: 10/24 ângulos apresentaram dano zero. Após a correção, 576 combinações de Warrior/Fighter, Troll/Troll da Caverna, equipes e passos de simulação atacam e carregam, sem deslocar o alvo por caminhada. Ambos ativam seus especiais reais.
- Regeneração do Troll da Caverna: mantida cura fracionária de 2% da vida máxima por segundo após três segundos sem dano à vida. A exibição agora acumula cura efetiva e gera números/efeitos no máximo duas vezes por segundo da simulação; vida cheia não gera +0 nem efeitos. Cura direta também deixa de exibir +0. O teste comparativo manteve exatamente a vida final e reduziu 420 notificações para 14 em dez segundos.

## Validação
Testes v32, Blackfang v26, movimentação v30, treinamento v31 e tutorial v25 passaram. No navegador: grade de 3 × 102px em viewport de 360px sem overflow; janelas de deck, melhoria individual, dificuldade e vitórias; nenhuma tag select; ×1,5 mantido na rodada seguinte e após recarregar; ×2 também mantido na rodada seguinte. Teste em largura de celular, sem Android físico.

Mantém saves, progressão, acessos, treino gratuito e conteúdo oculto. Energia de run, recompensa de login, Hack de energia, Dawncrest, monstros e expansão para três atos não entraram nesta versão.
