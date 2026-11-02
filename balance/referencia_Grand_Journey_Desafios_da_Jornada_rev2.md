# Grand Journey — Desafios da Jornada

Revisão 2 • 02/11/2026 • Regras consolidadas para alinhamento com o Claude

**Escopo:** atualizar a especificação de design. Esta revisão não autoriza implementar ou publicar o sistema. As definições confirmadas abaixo substituem as sugestões conflitantes da versão anterior.

## 1. Conceito e desbloqueio

Após vencer uma run completa pela primeira vez, concluindo o mapa 3, o jogador desbloqueia os **Desafios da Jornada**. Antes das próximas runs, escolhe modificadores que tornam o jogo mais difícil. As referências de conceito são Hades e Astral Ascent.

O jogador precisa progredir gradualmente nos níveis de desafio: não pode ativar qualquer quantidade de modificadores logo após desbloquear o sistema.

## 2. Progressão confirmada

**O nível da run corresponde à quantidade de desafios ativos escolhidos.** Não há soma de pesos diferentes por modificador nesta definição.

- Ao desbloquear o sistema, o jogador tem acesso ao nível 1: pode escolher um desafio.
- Vencer a run com um desafio ativo supera o nível 1 e libera o nível 2.
- Vencer com dois desafios ativos supera o nível 2 e libera o nível 3, e assim sucessivamente até o máximo.
- O jogador escolhe livremente quais desafios combinar, respeitando o limite desbloqueado.
- Perder não avança o nível.
- Vencer novamente um nível inferior não permite pular a etapa seguinte.

É necessário distinguir **maior nível disponível** de **maior nível já vencido**. Por exemplo: vencer o nível 2 libera o nível 3, mas ainda não significa ter vencido o nível 3.

A quantidade máxima de níveis depende do catálogo final, ainda não definido. O catálogo de oito exemplos deste documento não estabelece um máximo de oito níveis.

## 3. Insígnia: recompensa e uso

**Insígnia** é o nome informado pelo usuário para a moeda que está sendo tratada no Claude.

- A primeira vitória em cada nível inédito concede **1 Insígnia**.
- Repetir um nível já vencido não concede outra Insígnia, mesmo escolhendo uma combinação diferente de desafios.
- A Insígnia pode ser usada para ativar uma vantagem em um sistema próprio, **separado da skill tree**.
- O desbloqueio do próximo nível vem da vitória; não depende de gastar a Insígnia.

### Exemplo confirmado

1. O jogador tem o nível 2 disponível e escolhe dois desafios.
2. Completa a run com esses dois desafios ativos.
3. Recebe uma Insígnia pela primeira vitória no nível 2.
4. Libera o nível 3, podendo escolher três desafios para a próxima etapa.
5. Pode usar a Insígnia para ativar uma vantagem.

Os efeitos, preços, duração e regras das vantagens não foram definidos nesta conversa. Não presumir que sejam nós da árvore, bônus permanentes ou vantagens de uso único. O catálogo deve ser conciliado com o que estiver sendo definido no Claude.

## 4. Conclusão dos desafios individuais

Além dos níveis vencidos, registrar quais modificadores já participaram de pelo menos uma **run completa vitoriosa**.

Isso permite distinguir dois avanços:

- **Progressão de nível:** vencer com a quantidade correspondente de desafios ativos.
- **Conclusão individual:** vencer uma run tendo aquele modificador ativo.

Só ativar um modificador ou perder uma run com ele não conta como conclusão. Vencer um nível repetido com uma combinação nova pode concluir modificadores individuais ainda pendentes, sem gerar outra Insígnia por esse nível.

## 5. Desafio Final e boss secreto

O **Desafio Final** é uma opção especial do sistema. Seu nome e apresentação não devem revelar explicitamente a identidade do boss secreto ou toda a sequência de inimigos.

### Requisitos cumulativos confirmados

O jogador só pode ativá-lo quando:

1. Já venceu runs derrotando cada um dos três true bosses: Blackfang, Dawncrest e Monstros. Essas vitórias podem ocorrer em runs diferentes.
2. Já concluiu todos os desafios regulares da Jornada: cada modificador participou de pelo menos uma run vitoriosa.
3. Já alcançou o nível máximo de desafio.

O próprio Desafio Final não entra na exigência de ter concluído todos os desafios regulares, evitando um requisito circular.

### Sequência confirmada

Com o Desafio Final ativo, ao chegar ao boss do mapa 3, o encerramento da run passa a ter os **três true bosses em sequência e, depois, o boss secreto**. A ordem entre os três true bosses ainda não foi definida.

Essa é uma sequência de quatro confrontos distintos, e não quatro rodadas de uma mesma batalha. O boss secreto é um confronto extra após os três true bosses. Não acrescentar outro boss comum antes dessa sequência sem uma decisão específica.

Vencer o boss secreto concede um **milestone de conclusão máxima**, marcando a superação do desafio final do jogo. Uma recompensa exclusiva adicional, como título ou cosmético, permanece como sugestão.

### Sugestão de funcionamento entre os confrontos

Manter o deck, upgrades e relíquias da run e iniciar cada confronto com a preparação normal de um novo confronto, incluindo suas regras de energia, mão e formação. Essa foi a proposta apresentada na conversa; seus detalhes devem ser confirmados antes da implementação.

## 6. Modificadores sugeridos, ainda não aprovados individualmente

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

Nomes, valores e efeitos são sugestões. A aplicação em raids e bosses, os limites do campo e a viabilidade de combinações precisam ser avaliados. Graus com pesos próprios por modificador não fazem parte da regra consolidada.

## 7. O que mudou em relação à versão anterior

| Tema | Versão anterior | Definição desta revisão |
| --- | --- | --- |
| Cálculo do nível | Sugestão de somar pontos, com possíveis graus por modificador. | Substituída: nível é a quantidade de desafios ativos. |
| Acesso à dificuldade | Progressão e limites estavam em aberto. | Progressão sequencial: vencer N desafios ativos libera N+1, até o máximo. |
| Escolha dos desafios | Seleção livre sem um limite de progressão definido. | Escolha livre da combinação, limitada ao nível desbloqueado. |
| Recompensa por nível | Milestones, títulos e cosméticos eram exemplos, sem regra fechada. | Uma Insígnia por primeira vitória em cada nível; vantagens em sistema separado da skill tree. Cosméticos continuam opcionais. |
| Repetição | Regras de repetição indefinidas. | Nível repetido não concede outra Insígnia, mesmo com combinação diferente. |
| Conclusão individual | Estava em aberto como acompanhar modificadores. | Cada desafio precisa participar de uma run vitoriosa para contar como concluído. |
| Boss secreto | Não existia na primeira versão do documento. | Desafio Final com três true bosses em sequência e, ao fim, boss secreto extra. |
| Acesso ao Desafio Final | Primeira sugestão exigia apenas vencer previamente os três true bosses. | Requisito ampliado: essas vitórias + todos os desafios regulares concluídos + nível máximo alcançado. |
| Milestone final | Não definido. | Concedido ao vencer o boss secreto no Desafio Final. |
| Situação do material no Claude | A versão anterior registrava ausência de evidência de envio. | O usuário agora informa que o documento foi enviado e que o Claude já trata a moeda como Insígnia. A ausência de evidência anterior não deve ser usada como descrição atual. |

A skill tree e suas regras de XP não são alteradas por esta revisão. Não confundir Insígnia com XP de run ou com Essência, moeda proposta para cópias excedentes.

## 8. Pontos ainda pendentes

- Catálogo final de desafios regulares, valores e nível máximo.
- Restrições de combinação, se necessárias, preservando a progressão até o máximo.
- Catálogo das vantagens compradas com Insígnias: custo, duração e regras de ativação.
- Ordem dos três true bosses, identidade e mecânicas do boss secreto.
- Confirmar o funcionamento da preparação entre os quatro confrontos.
- Definir se o Desafio Final ocupa uma vaga, se é uma opção adicional e quais desafios regulares precisam estar ativos nessa run.
- Definir se é necessário **vencer o nível máximo** antes de ativar o Desafio Final. O requisito confirmado foi **alcançar o nível máximo**; não acrescentar essa vitória obrigatória sem confirmação.
- Definir eventual Insígnia ou recompensa adicional pela vitória no Desafio Final, sem duplicar a recompensa de um nível já vencido.
- Detalhes de apresentação, persistência e recompensas adicionais do milestone final.

## 9. Orientação para continuidade no Claude

Usar as seções confirmadas desta revisão como referência de design, substituindo as sugestões conflitantes da primeira versão. Conciliar com as regras atuais do sistema de vantagens por Insígnias no trabalho do Claude; esse material externo não foi inspecionado nesta atualização.

A curva de dificuldade base do checkpoint GJ-v54-BAL-CP1 não equivale ao balanceamento dos Desafios da Jornada. Avaliar separadamente a dificuldade normal, os níveis de desafios e a sequência final, considerando a skill tree e as vantagens por Insígnias disponíveis em cada etapa.

Este documento foi atualizado para o usuário encaminhar ao Claude. Nenhum envio externo, implementação ou publicação foi realizado nesta atualização.
