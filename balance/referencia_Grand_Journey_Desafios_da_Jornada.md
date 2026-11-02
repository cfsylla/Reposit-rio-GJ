# Grand Journey — Desafios da Jornada

Documento de ideias • 02/11/2026

**Situação:** proposta para desenvolvimento futuro. Este documento não autoriza implementação, publicação ou inclusão no balanceamento em andamento.

## 1. Conceito definido

Após vencer uma run completa pela primeira vez, concluindo o mapa 3, o jogador desbloqueia um sistema de desafios opcionais. Antes das próximas runs, escolhe quais modificadores quer ativar para tornar a jornada mais difícil e aumentar seu nível de dificuldade.

As referências indicadas pelo usuário são Hades e Astral Ascent. O objetivo é prolongar a progressão após a primeira vitória e permitir que o jogador escolha como será desafiado.

O nome **Desafios da Jornada** é a sugestão de nome usada nesta discussão.

## 2. Estrutura sugerida — ainda depende de validação

- Cada modificador acrescenta pontos ao nível total de desafio.
- Um mesmo modificador pode ter graus, com efeitos progressivamente mais fortes e maior pontuação.
- A seleção acontece antes de iniciar a run, com descrição dos efeitos e indicação do nível total.
- A dificuldade normal permanece disponível, sem desafios ativos.

Não foram definidos valores, quantidade de graus, pontuação por desafio ou regras de combinação.

## 3. Modificadores sugeridos

Os nomes e efeitos abaixo são exemplos apresentados pelo assistente. Ainda não são um catálogo aprovado.

| Nome provisório | Efeito proposto |
| --- | --- |
| Tropas resistentes | Aumenta a vida dos inimigos. |
| Ataques implacáveis | Aumenta o dano causado pelos inimigos. |
| Reforços inimigos | Acrescenta unidades aos encontros inimigos. |
| Recursos escassos | Reduz a energia disponível durante a preparação. |
| Mercado inflacionado | Aumenta os preços em ouro nas lojas da run. |
| Bagagem limitada | Bloqueia algumas células do relic bag. |
| Caminho amaldiçoado | Faz a run começar com uma carta negativa no deck. |
| Comandantes preparados | Concede melhorias específicas a elites e bosses. |

Reforços precisam respeitar as regras de ocupação do campo; a aplicação em raids e nos diferentes tipos de boss ainda precisa ser desenhada. Energia e espaço de bolsa exigem atenção às combinações para manter escolhas viáveis.

## 4. Progressão e recompensas sugeridas

Foi sugerido conceder recompensas por vencer níveis inéditos de desafio, por exemplo milestones, títulos e cosméticos. Tipos de recompensa, critérios de conquista e eventual repetição ainda não foram aprovados.

Também permanece em aberto se a progressão será pelo nível total, por modificadores específicos ou por uma combinação dos dois.

## 5. Pontos para decidir antes de implementar

- Catálogo inicial de desafios e graus de cada um.
- Pontuação, limites e combinações permitidas.
- Tratamento de combates normais, elites, bosses e raids.
- Efeito das combinações sobre energia, deck, bolsa e economia.
- Regras de registro das vitórias e recompensas.
- Interação com a skill tree permanente e os diferentes estados de progressão do jogador.

Esses pontos são decisões futuras, não requisitos já validados.

## 6. Momento de desenvolvimento e balanceamento

Na conversa, o assistente sugeriu desenvolver o sistema depois das mecânicas principais e do balanceamento base. Essa prioridade foi uma sugestão, sem confirmação específica posterior do usuário.

Para uma futura avaliação, recomenda-se separar as medições da dificuldade normal das medições com desafios ativos. O balanceamento atual não deve pressupor que esses modificadores já existam. Valores e combinações deverão ser avaliados quando o sistema tiver escopo aprovado.

## 7. Verificação sobre o envio ao Claude

**Conclusão disponível em 02/11/2026: não foi encontrado registro de envio desta ideia ao Claude para balanceamento.**

Foram consultados:

- O histórico recuperado da preparação do balanceamento, que informa que o prompt original ao Claude não mencionava os Desafios da Jornada.
- O documento de projeto v45 disponível neste projeto, que não registra o sistema.
- O arquivo `CHECKPOINT_CP1_resumo.pdf`, referente ao GJ-v54-BAL-CP1, que descreve os blocos P1–P4, pendências e mensagem de integração, sem mencionar o sistema de desafios opcionais pós-vitória.
- O relatório `INTEGRACAO_CP1_CHATGPT.md`, que também não o inclui no escopo integrado nem nas pendências descritas.

O ajuste de curva de dificuldade do bloco P4 trata do balanceamento base e não comprova a inclusão dos Desafios da Jornada.

Essa verificação cobre os registros acessíveis. Não certifica o conteúdo integral de uma conversa externa no Claude nem eventuais envios feitos fora desses registros.

Nenhum material foi enviado ao Claude durante a elaboração deste documento. Nenhuma alteração no jogo foi realizada.
