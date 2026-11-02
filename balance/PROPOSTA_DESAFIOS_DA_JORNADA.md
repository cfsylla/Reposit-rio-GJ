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

## 2. Os 15 desafios (intensidade inicial, uma só por desafio)

| # | Desafio | Efeito |
|---|---|---|
| 1 | Veteranos | Inimigos comuns: +2 upgrades |
| 2 | Tropas Resistentes | Vida dos inimigos +15% |
| 3 | Ataques Implacáveis | Dano dos inimigos +15% |
| 4 | Comandantes Preparados | Elites, ordens e bosses: +1 relíquia e +2 upgrades |
| 5 | Líderes Inteiros | Líderes de boss sem a redução de vida e ataque |
| 6 | Reforços Inimigos | +1 unidade inimiga em lutas comuns e elites (não vale para bosses e raids) |
| 7 | Fúria das Raids | Vida das raids +25% |
| 8 | Mercado Inflacionado | Preços da loja +25% |
| 9 | Bolsa Leve | Ouro por vitória −25% |
| 10 | Recursos Escassos | −1 de energia no preparo de cada rodada |
| 11 | Bagagem Limitada | 3 casas da bolsa de relíquias bloqueadas |
| 12 | Escolhas Escassas | Ofertas de cartas com 1 opção a menos |
| 13 | Árvore Contida | Árvore limitada a 90 pontos a menos durante a run |
| 14 | **Relíquias Escassas** *(substitui "Sem Preparo", que dependia dos espaços de preparativos)* | Escolhas de relíquia com 1 opção a menos |
| 15 | Caminho Amaldiçoado | Começa com 2 maldições Fardo |

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
   - o boss secreto precisa ser **mais forte que os outros true bosses**;
   - a run do Desafio Final tem **os 15 desafios ativos**, e essa é a condição para ativá-lo.

## 7. Em aberto

- Desafio Final: ordem dos true bosses, conteúdo do boss secreto (personagem, arte, mecânicas) e recompensa extra.
- Calibração: custo de cada desafio (em medição) e valor de cada vantagem.
