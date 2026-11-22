# Briefing de balanceamento — Grand Journey, publicação 50

Data: 05/11/2026. Fonte publicada: `aed07ed41c8a002ab1d149882e068b7a7f6c4415`.

## 1. Autoridade e escopo

O diretório `fonte_v50/` é um retrato do código publicado 50. A identificação interna de conteúdo é v56. A análise deve partir desta base, preservando desenvolvimentos paralelos; documentos v45 e checkpoints CP1/CP2 são históricos. O nome `tests/bosses-v50.cjs` é histórico e não identifica a publicação atual.

Este pedido autoriza preparar material e avaliar propostas no Claude. Não autoriza alterar a versão publicada no Work. Valores, simulações e patches produzidos pelo Claude precisam de integração e aprovação posteriores.

## 2. Regra de XP reafirmada pelo usuário — requisito obrigatório

- O XP ganho na run é um recurso para investir na árvore nas oportunidades de uso disponíveis durante a própria run.
- Ao encerrar uma oportunidade de investimento e continuar a jornada, todo saldo não utilizado é descartado. Não guardar sobras para o próximo mapa, a próxima janela ou outra run.
- Nodes comprados e seus benefícios permanecem adquiridos. A regra de descarte não apaga o investimento já feito.
- Se o jogador morrer/abandonar antes de gastar o XP acumulado, esse XP não investido é perdido.
- Na operação de reset/redistribuição pelo menu, pode realocar o orçamento dos nodes já adquiridos. Devolver o investimento efetivo, não todo o XP histórico ganho, nem valores descartados em oportunidades anteriores.
- Antes de iniciar a nova run, o jogador pode redistribuir. Se iniciar a run deixando saldo não gasto nesse processo, esse saldo é perdido.
- Não introduzir compensações que anulem a regra, como converter automaticamente toda sobra em pontos permanentes, reconstruir saldo pelo nível histórico ou manter um medidor fracionário permanente que seja um banco disfarçado do mesmo XP.

### Terminologia do reset

O usuário descreveu "reset da run pelo menu" com redistribuição dos pontos. No código atual, `JourneyTree.reset(s)` é um respec da árvore, permitido sem run ativa. Tratar como redistribuição antes da próxima run. Se o menu também oferecer abandono/reset de run, distinguir as duas operações: abandono não cria XP; respec devolve só o investimento existente. Indicar claramente os nomes e o fluxo propostos para evitar confusão, sem usar essa ambiguidade para manter saldo indefinidamente.

### Exemplos de aceitação (unidades finais a definir na proposta)

1. Janela com orçamento equivalente a 20: gastar 14 e continuar implica perder os 6 restantes; a janela seguinte começa só com o recurso novo ganho depois disso.
2. Reset devolve 30 de investimento efetivo. Realocar 22 e começar a run implica perder os 8 restantes. Novo reset não pode recriar esses 8.
3. O simples ato de abrir/fechar/reabrir uma tela, recarregar o save, repetir conclusão ou voltar pelo menu não duplica XP nem pagamento.
4. Morrer antes da primeira oportunidade mantém somente os nodes comprados em runs anteriores.
5. Caso haja conversão XP→pontos, explicitar o descarte do saldo de ambas as representações: não aceitar acumulação equivalente com outro nome.
6. Progressão de nível pode usar um histórico para exibição, mas esse histórico não pode recriar saldo já perdido nem gerar recompensas duplicadas por respec.

## 3. Divergência verificada na versão publicada 50

Arquivos principais: `dist/tree-engine.js`, `dist/tree-data.js`, `dist/tree-ui.js`, `dist/acts-engine.js`.

O código atual não segue a regra acima:

- `bank(s)` transfere todo XP da run para `profile.skillTree.totalXp` ao acessar a árvore após um boss.
- `level()` usa XP total bancado / 10, com limite 50.
- `points()` retorna nível × 10.
- `available()` retorna esses pontos menos o custo dos nodes adquiridos; o saldo permanece disponível.
- `continueRun(s)` fecha a sessão, mas não descarta esses pontos disponíveis do perfil.
- `reset(s)` limpa os nodes, e `available()` volta a disponibilizar todos os pontos derivados do nível, inclusive saldos nunca investidos.
- Acima do nível máximo, o XP excedente hoje gera diamantes a cada 20 XP. Essa conversão não resolve a compra dos nodes restantes.

### Impossibilidade matemática atual

| Parâmetro extraído do código | Valor |
|---|---:|
| Nodes compráveis, excluindo origem | 60 |
| Soma dos custos de todos os nodes | 1.151 pontos |
| Custo do node mais caro | 54 pontos |
| Nível máximo | 50 |
| Pontos concedidos por nível | 10 |
| Máximo de pontos concedidos pelo sistema atual | 500 |
| Diferença para completar a árvore | 651 pontos |

Os marcos de 75%/100% da árvore e a motivação de longo prazo precisam ser avaliados junto com essa limitação, sem supor que o cap já foi resolvido.

XP atual por combate elegível: mapas 1/2/3 = 2/2/1. XP de boss = 4/4/6. O total por rota depende dos encontros efetivamente vencidos; não usar esses valores como total fixo por mapa.

## 4. Modelo de progressão a avaliar — ainda não decidido

O usuário sugere um medidor que libera recurso de XP/pontos, enquanto o nível fica vinculado à liberação de nodes na árvore. Comparar pelo menos:

- Medidor de XP da run → orçamento de compra nas janelas, com nível ligado aos nodes adquiridos ou ao investimento efetivo.
- Nível com cap separado da capacidade de continuar ganhando recurso para completar a árvore.
- Alternativa mais simples que cumpra descarte, permita respec e garanta que todos os nodes sejam alcançáveis.

Para cada opção, definir:

1. O que é XP, ponto disponível, ponto investido, nível e histórico; quais valores são temporários e quais permanentes.
2. Quando o recurso é ganho, convertido, gasto, descartado, reembolsado e persistido.
3. Se o nível considera nodes atuais, nodes únicos já comprados ou investimento histórico; evitar farm de níveis/recompensas pelo reset.
4. Como ganhar o necessário para chegar a 100% da árvore após alcançar o nível máximo.
5. O destino do XP quando a árvore estiver de fato completa. Não manter automaticamente a conversão para diamantes apenas porque o nível bateu o cap.
6. Um custo de node não pode exigir um saldo impossível de reunir em uma janela. Com descarte, revisar custos altos (até 54 hoje), frequência das janelas e orçamento devolvido no respec. Evitar exigir resets repetitivos como única estratégia viável de progressão.
7. Migração dos saves: preservar investimento legítimo e aquisições, explicitar a conversão do sistema antigo e impedir duplicação.

Não escolher automaticamente uma dessas alternativas como decisão aprovada. Apresentar comparação e recomendação.

## 5. Acesso à árvore no meio do mapa — proposta para simulação

### Problema relatado

Terminar o primeiro mapa é a maior barreira percebida. Antes de derrotar o primeiro boss, o jogador não consegue investir no XP daquela tentativa; ao perder, repete com a mesma árvore. É preciso testar esse relato, não tratá-lo como estatística já medida.

### Proposta do usuário

Um node de acesso à árvore em cada um dos três mapas, provavelmente depois do node/etapa 8, além das oportunidades pós-boss. São **nodes no mapa que abrem a árvore**, não três novos upgrades da skill tree.

Comparar:

- A: fluxo publicado, apenas pós-boss (baseline).
- B: janela adicional após a oitava etapa de cada mapa, mantendo a pós-boss.
- C: alternativa de posição/frequência caso B antecipe poder demais ou chegue tarde para novatos.

Avaliar checkpoint obrigatório versus opção de rota: se for opcional e o jogador o perder, o problema original pode continuar. Especificar se substitui um node de serviço existente ou adiciona uma camada; evitar remover silenciosamente combates/XP ou mudar o número de batalhas ao comparar.

Definir quando começa a valer o node comprado: a intenção é ajudar no restante da mesma run, inclusive antes do primeiro boss. Em toda janela deve ser aplicada a regra de gastar ou perder a sobra. Ao derrotar o boss, só o XP ganho desde a última janela deve estar disponível.

Simular os efeitos em mapa 1, 2 e 3, elites, todos os bosses/True Bosses, decks emprestados/custom, rotas Titans e desafios/vantagens. Não resolver o primeiro mapa inflando apenas o terceiro ou criando vitória automática após o primeiro acesso.

Preservar IDs e desenho de rotas dos saves existentes. Caso o formato de mapa mude, descrever migração/versionamento em vez de inserir índices cegamente no mapa de uma run salva.

## 6. Emissores de aura — revisão de identidade e sustain

Arquivo autoritativo: `dist/supports-b.js`. Hoje os dez emissores têm `heal > 0` e buff. A cura é percentual da vida máxima do alvo a cada intervalo; buffs são reaplicados continuamente dentro do raio. Todos têm raio 120. A aura não afeta seu próprio emissor; emissores diferentes somam efeitos; crescimento da aura usa metade do crescimento normal de poder base de habilidade e evita realimentação por buffs recebidos.

| ID | Cura atual por pulso | Intervalo | Buff atual |
|---|---:|---:|---|
| `priestess` | 6,8% PV máximo | 2 s | −17% dano recebido |
| `elf_harpist` | 11,5% | 2 s | +23% velocidade de ataque |
| `flower_fairy` | 11% | 2 s | +35% poder de habilidade |
| `snow_troll` | 7% | 2 s | −28% dano recebido |
| `shaman` | 5,6% | 2 s | +43% velocidade de ataque |
| `sage` | 9,5% | 3 s | +48% poder de habilidade; −26% dano recebido |
| `feline_arcanist` | 4,8% | 3 s | +29% velocidade de ataque |
| `bard` | 2,2% | 3 s | +26% dano; +22% poder de habilidade |
| `goblin_king` | 4% | 3 s | +32% dano; +27% velocidade de ataque |
| `feline_drummer` | 3,4% | 3 s | +34% velocidade de ataque; +46% movimento |

### Diretriz definida

- **Priestess e Flower Fairy:** cura faz sentido; podem continuar como curadoras.
- **Bard e Sage:** a aura base não deve curar. Podem continuar como suportes de buff; revisar seus valores dentro dessa identidade.
- **Outros seis:** avaliar individualmente e justificar quem cura. Não foi decidido que todos mantêm ou que todos perdem cura.
- Não compensar automaticamente toda cura removida com regeneração, escudo ou redução de dano que recriem o mesmo excesso de sustain.
- Separar aura base de curas legitimamente causadas por relíquias/traits/efeitos externos.

### Verificações necessárias

- Com aliado ferido, sem outras fontes de cura, Bard/Sage não geram cura própria; seus buffs continuam funcionando.
- `heal: 0` deve ser suportado sem texto "cura 0%", números de cura, barras/pulsos ou gatilhos falsos de "ao curar".
- Priestess/Fairy continuam curando corretamente e respeitando modificadores e limitações.
- Atualizar descrições PT/EN e interface para auras de buff puro, cura pura ou mistas conforme aprovado.
- Medir cura efetiva, overheal, uptime, dano mitigado, contribuição ofensiva, custo de energia, fusão, upgrades, múltiplos emissores e adversários usando os mesmos suportes.
- Diferenciar o personagem base `goblin_king` (aura) do líder inimigo `boss_goblin` e da carta `hero_goblin`: possuem comportamentos próprios.

## 7. Preservar a versão 50 como base

- 24 decks emprestados e custom decks; 16 facções nos traits.
- 95 milestones: todos dão 1 diamante uma única vez; os 13 antigos preservam seus desbloqueios adicionais.
- Cartas dos bosses de Ironbound, Blackfang e Dawncrest: compra em grupo somente após derrotar o True Boss da respectiva ordem.
- Demais cartas de Blackfang/Dawncrest: abrir coleção/booster após derrotar o boss do mapa 3 daquela ordem, normal ou True Boss.
- 17 cartas de bosses com stats próprios, separados das versões inimigas; são provisórios e também precisam de avaliação no balanceamento geral.
- Titans, minions e segundas formas não viram cartas jogáveis.
- Raids com vida persistente; True Bosses com duas formas; composição das equipes, perdas e transições conforme o código real.
- Desafios e vantagens, economia de diamantes/Insígnia, relíquias, eventos/maldições, traits, fusões e movimento.
- Retratos corrigidos, navegação/scroll, refresh sem recompor slots vendidos e demais correções de interface.
- O Secret Boss e Desafio Final não foram implementados. Só há milestone reservado/oculto para Secret Boss; não simular seu combate como se já existisse.

## 8. Simulações e entregáveis solicitados

1. Reproduzir a base publicada antes de alterar parâmetros; usar a ordem dos scripts em `dist/index.html`.
2. Separar implementação de análise: documentar baseline, cada variante, parâmetros, seeds, quantidade de simulações e limitações da IA/simulador.
3. Medir probabilidade de atingir a primeira janela, derrotar cada boss e concluir cada mapa/run; incluir perfil iniciante com árvore zerada e estágios de 25/50/75/100%.
4. Medir runs/confrontos necessários para o primeiro upgrade e para os patamares da árvore, XP ganho/gasto/descartado e dependência de respec.
5. Verificar matematicamente a alcançabilidade de todos os 60 nodes, sem farm infinito de recurso por reset e sem bloqueio no cap.
6. Testar vitória/derrota, abandonar/reset, menu, nova run com saldo de respec, fechamento de cada janela, save/load e conclusão repetida.
7. Avaliar mudanças de aura isoladamente e em conjunto com as novas oportunidades de árvore.
8. Cobrir os 24 decks, as 17 cartas de bosses e rotas das quatro ordens, sem confundir stats de carta com stats de inimigo.
9. Entregar tabelas antes/depois, diagnóstico, alternativas e recomendação; indicar o que é correção obrigatória e o que requer decisão do Carlos.
10. Se produzir patch, devolver por arquivo/trecho contra o commit da base, com testes novos e expectativas antigas que precisarão ser atualizadas. Não reintroduzir módulos/dados históricos sobre a versão 50.

Nenhum resultado do Claude equivale a implementação/publicação no jogo. A aprovação e a integração ficam no ChatGPT Work.
