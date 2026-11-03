# Proposta: Desafios da Jornada, Insígnias e Vantagens (pós-CP1)

**Versão 3 (02/11/2026).** Segue as regras confirmadas na **revisão 2** do documento de ideias (`referencia_Grand_Journey_Desafios_da_Jornada_rev2.md`) e as decisões de Carlos nesta sessão:
- 15 desafios e 15 vantagens;
- as vantagens compradas ficam todas ativas: não há espaços nem escolha entre elas;
- o Desafio Final (boss secreto) é o último desbloqueio.

**Situação:**
- **Desafios:** aprovados e implementados na cópia de teste (`game_p5/dist/challenges.js`), com intensidade inicial a calibrar.
- **Vantagens:** aprovadas e implementadas na cópia de teste (`game_p5/dist/advantages.js`). Batedor saiu e foi substituído por **Caçador de Elites** (aprovado).
- **Testes:** `tests/challenges-p5.cjs` e `tests/advantages-p5.cjs`. A validação oficial passa nas 10 etapas.

## 1. Regras (revisão 2)

| Regra | Definição |
|---|---|
| Desbloqueio | 1ª vitória numa run completa (boss do mapa 3). Libera o nível 1 |
| Nível da run | **Quantidade de desafios ativos.** Sem graus e sem pesos |
| Acesso | Sequencial: vencer com N desafios libera o nível N+1, até 15 |
| Escolha | Combinação livre, até o nível liberado |
| Insígnia | **1** na 1ª vitória de cada nível inédito. Repetir um nível não rende outra, mesmo com outra combinação |
| Conclusão individual | Cada desafio ativo numa run **vencida** fica concluído |
| Derrota | Não muda nada |
| Desafio Final | Exige os 3 true bosses vencidos, os 15 desafios concluídos e o nível máximo alcançado. Sequência: 3 true bosses e depois o boss secreto. Dá um milestone de conclusão máxima. *(O encontro ainda não foi implementado: depende do conteúdo do boss secreto.)* |

**Consequência para o balanceamento:** como cada desafio vale 1 nível, **todos precisam pesar parecido**. A meta é que cada desafio, sozinho, tire de 4 a 7 pontos de vitória do jogador no limite da árvore. A medição está em andamento. Os que saírem da faixa terão a intensidade ajustada.

## 2. Os 15 desafios (calibrados: cada um custa de 4 a 8 pontos de vitória no jogo base com a árvore no limite)

| # | Desafio | Efeito |
|---|---|---|
| 1 | Veteranos | Inimigos comuns: +3 upgrades |
| 2 | Tropas Resistentes | Vida dos inimigos +3% |
| 3 | Ataques Implacáveis | Dano dos inimigos +4% |
| 4 | Comandantes Preparados | Elites, ordens e bosses: +1 relíquia e +2 upgrades |
| 5 | **Bosses Implacáveis** *(substitui Líderes Inteiros; regra final aprovada em 02/11)* | Bosses de mapa (time e líder) com +8% de vida e de dano |
| 6 | Reforços Inimigos | A partir da 2ª rodada, inimigos comuns e elites colocam +1 unidade em campo |
| 7 | Fúria das Raids | Raids com +30% de vida e +10% de dano |
| 8 | Mercado Inflacionado | Preços da loja +15% |
| 9 | Bolsa Leve | Ouro por vitória −15% |
| 10 | Recursos Escassos | −1 de energia nas 2 primeiras rodadas contra bosses |
| 11 | Bagagem Limitada | 3 casas da bolsa de relíquias bloqueadas |
| 12 | **Deck Pesado** *(substitui Escolhas Escassas, aprovado em 02/11)* | Começa a run com +1 carta comum fraca aleatória no deck (comum de custo 2) |
| 13 | Árvore Contida | Árvore limitada a 50 pontos a menos durante a run |
| 14 | Relíquias Escassas | Escolhas de relíquia com 2 opções a menos (mínimo 1) |
| 15 | Caminho Amaldiçoado | Começa com a maldição Exaustão |

Histórico da calibração: `balance/out/chal1` a `chal7`. Custos finais: Veteranos 4, Tropas 5, Ataques 5, Comandantes 5, Bosses 7, Reforços 7, Raids 5, Mercado 6, Bolsa 5, Recursos 7, Bagagem 4, Deck Pesado 5, Árvore 5, Relíquias 4, Caminho 8 (margem de ±5). Conferir de novo depois dos ajustes finais da base (decks e árvore).

## 3. As 15 vantagens (ideias para aprovação)

**Como funciona:**
- Cada insígnia compra **1 vantagem**, na ordem que o jogador quiser.
- Ao vencer os 15 níveis, o jogador tem as 15 vantagens.
- Todas as vantagens compradas ficam ativas em todas as runs, inclusive na dificuldade normal.
- São separadas da árvore e não repetem efeitos de nós.

**Meta de força:** cada vantagem vale de **+2 a +3 pontos de vitória**, menos que um desafio (de 4 a 7). Assim cada nível novo fica um pouco mais difícil que o anterior, mesmo com a vantagem nova.

| # | Vantagem | Efeito | Sugestão de origem |
|---|---|---|---|
| 1 | **Relíquia de Viagem** | Começa a run com +1 relíquia comum aleatória que caiba na bolsa | Carlos |
| 2 | **Treino Prévio** | 2 cartas aleatórias do deck começam com upgrade 1 | Carlos |
| 3 | **Reforço** | +1 cópia de uma carta aleatória do deck (respeita o máximo de 4) | Carlos |
| 4 | **Gêmeo** | Escolhe 1 carta do deck para duplicar no início da run (respeita o máximo de 4) | Carlos |
| 5 | **Bolsa Cheia** | +20 de ouro inicial | Claude |
| 6 | **Relíquia Escolhida** | Escolhe a relíquia inicial entre 3 opções, em vez de receber a do deck | Claude |
| 7 | **Olho Treinado** | Uma vez por mapa, renova uma escolha de relíquia | Claude |
| 8 | **Ensaio** | A 1ª carta comprada em cada loja vem com upgrade 1 | Claude |
| 9 | **Mão Firme** | +1 carta na mão na 1ª rodada de cada confronto | Claude |
| 10 | **Energia Guardada** | +1 de energia na 1ª rodada de cada confronto | Claude |
| 11 | **Limpeza** | Uma remoção de carta grátis na 1ª loja de cada mapa | Claude |
| 12 | **Bênção do Caminho** | Ao entrar nos mapas 2 e 3, 1 carta aleatória do deck recebe upgrade | Claude |
| 13 | **Juros** | Ao vencer o boss de cada mapa, +10% do ouro guardado (máx. +15) | Claude |
| 14 | **Caçador de Elites** *(aprovada; substitui Batedor, que saiu porque Carlos vai mostrar a última rodada inimiga na interface)* | Vencer uma elite concede +12 de ouro | Claude |
| 15 | **Segunda Chance** | Uma vez por run, perder um confronto (exceto boss) não encerra a run: o confronto recomeça do zero | Claude |

Notas:
- **Segunda Chance** é a mais forte. Se a medição confirmar, ela pode ganhar uma restrição (por exemplo, só nos mapas 1 e 2) ou passar a exigir um nível mínimo vencido para ser comprada.
- **Gêmeo** e **Relíquia Escolhida** pedem uma tela de escolha no início da run (interface do projeto principal).

## 4. Dados no save (campos opcionais)

| Dado | Campo |
|---|---|
| XP acumulado da árvore | `profile.skillTree.totalXp` |
| Desafios | `profile.challenges = { unlocked, available, won: [níveis], completed: [ids], selected: [ids], final }` |
| Desafios da run | `s.challenges = [ids]`, fixados ao entrar no 1º nó |
| Insígnias | `profile.insignia` |
| Vantagens | `profile.advantages = [ids]` (a implementar) |

## 5. Telas (projeto principal)

- **Árvore:** nível e pontos, barra até o próximo nível e botão Redistribuir, fora da run.
- **Antes da run:** lista dos 15 desafios com marca de concluído, contador "N de M" (nível liberado) e o nível que a run terá.
- **Fim da run:** nível vencido, insígnia ganha e desafios concluídos nesta run.
- **Vantagens:** loja com as 15 vantagens, insígnias disponíveis e as já compradas.
- **Desafio Final:** aparece bloqueado, com os 3 requisitos e o progresso de cada um, sem revelar o boss.

## 6. Decisões tomadas (02/11/2026)

1. **Relíquias Escassas** substitui Sem Preparo: aprovado.
2. **Vantagens:** aprovadas, menos Batedor. A 14ª é **Caçador de Elites** (aprovada).
3. **XP acima do nível 30:** vira diamantes, **1 diamante a cada 20 XP** excedente (implementado).
4. **Saves antigos:** ignorados, porque só Carlos faz playtests. A migração especial foi removida.
5. **Desafio Final:**
   - **Liberação:** só depois de vencer tudo: nível 15 vencido, os 15 desafios concluídos e os 3 true bosses (Blackfang, Dawncrest e Monstros) derrotados. A run do Desafio Final tem os 15 desafios ativos.
   - **Sequência:** primeiro o true boss da ordem que o jogador seguiu nas 6 batalhas de ordem; depois os outros dois, em ordem aleatória; por último o boss secreto.
   - **Boss secreto:** mais forte que os outros true bosses. Arte, mecânica e conteúdo ficam com o projeto principal. O Claude calibra e só faz ajustes com aprovação. Ainda não foi criado.
   - **Recompensa extra:** ainda não implementada no projeto principal.
   - Implementado na cópia de teste: verificação dos requisitos (`finalRequirements`) e registro dos 3 true bosses (o jogo só registrava 2). A sequência de confrontos será implementada quando o boss secreto existir.
6. **Filtro de relíquias inimigas:** corrigido. As relíquias scope, tome, boots e shield agora chegam aos inimigos que têm cartas compatíveis.
7. **Decks emprestados:** liberados por milestone ou por 25 diamantes. Conferido: os 24 decks já seguem essa regra, sem mudança.
8. **Liberação retroativa de decks** (herdada do CP1): não haverá. Encerrado.
9. **Barras da ficha (`ratings`):** o campo existe só nos dados dos personagens, e nenhum código do jogo o lê, então o jogador não o vê. Serão recalculadas a partir dos atributos reais e entregues no CP2, com baixa prioridade.
10. **Curva base: BC_B** (aprovada em 02/11): 2 XP por luta nos mapas 1 e 2 e força ×1 / ×1,16 / ×1,235. **Meta da 1ª vitória revista para as runs 15 a 20.** Medido: 1ª vitória na run 17, nível 30 na run 18 e jogo base no limite em 59%.
11. **Entrega:** o CP2 sai completo (opção A), depois de calibrar a curva base, os desafios e as vantagens, e de simular a escada dos níveis 1 a 15.

## 7. Em aberto

- Conteúdo do boss secreto (projeto principal) e recompensa extra.
- Calibração: custo de cada desafio (em medição) e valor de cada vantagem.

## 8. Metas de impacto (definidas por Carlos em 03/11/2026)

Medidas com a árvore no **nível 25**, o momento em que o pós-jogo começa (1ª vitória), com cada peça ativada sozinha:

| Peça | Faixa ideal | Exceções aceitas |
|---|---|---|
| **Desafio** | dificulta de **5 a 10** pontos de vitória | de 3 a 12 |
| **Vantagem** | facilita de **3 a 7** pontos de vitória | de 1 a 9 |

- **Não pode haver vantagem negativa**, nem desafio que tire 20 pontos.
- É esperado que algumas peças sejam melhores que outras, desde que fiquem dentro da faixa.
- As peças muito fora da curva serão revistas: ajustadas, trocadas ou substituídas por ideias novas (o ChatGPT pode sugerir).
- A escada (etapa 2) e as combinações e o limite (etapa 3) só rodam depois dessa revisão e com a autorização de Carlos.
