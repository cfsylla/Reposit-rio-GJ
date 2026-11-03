# Briefing para o ChatGPT: revisão de Desafios e Vantagens fora da curva

**Grand Journey, pós-jogo (Desafios da Jornada).** Preparado pelo Claude em 03/11/2026, a pedido de Carlos.
**O que se pede:** ideias para **corrigir ou substituir** as peças fora da faixa (seção 4). Para cada uma, de 2 a 3 alternativas, seguindo as regras da seção 2. **Não implementar nada**: as ideias voltam para Carlos aprovar e para o Claude medir em simulação.

## 1. Como o sistema funciona (regras confirmadas)

- O pós-jogo é liberado na **1ª vitória** numa run completa. Nesse momento, o jogador tem a árvore permanente por volta do **nível 25 de 50**. A árvore continua crescendo depois: o nível 50 chega umas 5 runs após a 1ª vitória.
- **15 Desafios** que deixam a run mais difícil. O **nível da run = quantidade de desafios ativos**. O acesso é sequencial: vencer com N desafios libera o nível N+1, até 15.
- Cada **1ª vitória num nível novo** dá **1 Insígnia**, e cada Insígnia compra **1 das 15 Vantagens**, na ordem que o jogador quiser. Todas as vantagens compradas ficam sempre ativas, em qualquer run (menos treino e tutorial).
- **Princípio:** cada desafio pesa mais do que cada vantagem ajuda. Assim, cada nível novo fica um pouco mais difícil, mesmo com a vantagem nova.
- O **Desafio Final** (boss secreto) exige vencer o nível 15 e ter concluído todos os desafios. Ele não faz parte desta revisão.

## 2. Regras para as ideias novas

1. **Uma intensidade só por peça.** Não existem graus.
2. **Legível em uma linha.** O jogador entende o efeito sem precisar de tabela.
3. **Não repetir efeito** de outra peça nem de um nó da árvore permanente (lista na seção 6).
4. **Sem telas novas complexas.** Escolhas simples no início da run são aceitáveis (já existem em Gêmeo e Relíquia Escolhida).
5. **Desafios não podem tornar a run impossível** quando combinados. Cuidado com combinações que zeram a energia, o campo ou a bolsa.
6. **Vantagens não podem ser negativas** em nenhuma situação. Atenção: **pôr cartas extras no deck tende a atrapalhar**, porque o deck tem 20 cartas e cada carta a mais dilui a mão. O teste do "Deck Pesado" (+1 carta fraca) mostrou isso, e as vantagens que acrescentam cartas saíram negativas.
7. Preferir efeitos que o motor já sabe fazer (seção 5). Efeitos novos são possíveis, mas custam mais para implementar e testar.

## 3. Metas de impacto (definidas por Carlos)

Medido com a árvore no nível 25, cada peça ativada sozinha. "Pontos" = pontos percentuais na chance de vencer a run. O jogo base, sem nada ativo, vence 58% das runs.

| Peça | Faixa ideal | Exceções aceitas |
|---|---|---|
| Desafio | dificulta **5 a 10** pontos | 3 a 12 |
| Vantagem | facilita **3 a 7** pontos | 1 a 9 |

Margem de medição: cerca de ±5 pontos por peça (480 runs cada, 24 decks).

## 4. Peças fora da faixa (precisam de revisão)

| Peça | Tipo | Efeito atual | Impacto medido | Quando pesa | Problema |
|---|---|---|---|---|---|
| **Árvore Contida** | Desafio | A árvore fica limitada a 50 pontos a menos durante a run | **−19** | mapa 2 e boss do mapa 2 | Forte demais. No nível 25, 50 pontos são 20% da árvore |
| **Deck Pesado** | Desafio | Começa a run com +1 carta comum fraca aleatória | **−13** | mapa 2 e boss final | Forte demais. Uma carta só já pesa muito; não dá para reduzir mais sem mudar a ideia |
| **Segunda Chance** | Vantagem | 1 vez por run, perder um confronto (exceto boss) não encerra a run: ele recomeça | **+13** | mapas 2 e 3 | Forte demais |
| **Limpeza** | Vantagem | Uma remoção de carta grátis na 1ª loja de cada mapa | **0** | — | Sem efeito |
| **Olho Treinado** | Vantagem | 1 vez por mapa, renova uma escolha de relíquia | **−2** | mapa 3 | Negativa ou nula (talvez o jogador simulado escolha mal) |
| **Gêmeo** | Vantagem | No início da run, escolhe 1 carta do deck para duplicar | **−3** | — | Negativa: carta extra dilui o deck |
| **Relíquia Escolhida** | Vantagem | No início, pode trocar a relíquia inicial por uma de 3 opções | **−3** | mapa 3 | Negativa ou nula (a relíquia original do deck costuma combinar com ele) |
| **Reforço** | Vantagem | +1 cópia de uma carta aleatória do deck | **−5** | mapa 3 | Negativa: carta extra dilui o deck |

**No limite de baixo** (dentro das exceções, mas candidatas a reforço, se houver boa ideia): vantagens **Ensaio, Mão Firme, Bênção do Caminho e Juros (+1)** e **Treino Prévio (+2)**; desafios **Fúria das Raids e Bolsa Leve (−4)**.

## 5. O que o motor já sabe alterar com facilidade

**Inimigos:** vida e dano (por tipo de luta: comum, elite, boss, raid); upgrades por luta; relíquias de elites e bosses; unidades em campo; energia do inimigo; vitórias de rodada exigidas.
**Jogador na luta:** energia por rodada (por rodada ou por tipo de luta); cartas na mão; limite de unidades em campo; atributos (vida, ataque, defesa, velocidade de ataque, crítico, poder de habilidade); escudos e curas no início da rodada.
**Economia da run:** ouro por vitória; ouro inicial; preços da loja (cartas, upgrades, remoções e relíquias separadamente); quantidade de ofertas de cartas e de relíquias; ouro ao vencer elite ou boss.
**Deck e relíquias:** upgrade de cartas no início ou ao entrar num mapa; trocar cartas (tirar uma e pôr outra); maldições (Fardo, Exaustão, Correntes, Mau Presságio); casas da bolsa de relíquias; relíquias iniciais.
**Árvore:** pontos ativos durante a run.
**Regras de run:** refazer um confronto perdido; cura ou bônus entre mapas.

## 6. Para não repetir

**Desafios atuais (15):** Veteranos (comuns +3 upgrades), Tropas Resistentes (vida inimiga +3%), Ataques Implacáveis (dano inimigo +4%), Comandantes Preparados (elites e bosses +1 relíquia e +2 upgrades), Bosses Implacáveis (bosses de mapa +8% vida e dano), Reforços Inimigos (+1 unidade inimiga a partir da 2ª rodada), Fúria das Raids (raids +30% vida e +10% dano), Mercado Inflacionado (loja +15%), Bolsa Leve (ouro −15%), Recursos Escassos (−1 energia nas 2 primeiras rodadas contra bosses), Bagagem Limitada (3 casas da bolsa bloqueadas), Deck Pesado, Árvore Contida, Relíquias Escassas (escolhas de relíquia com 1 opção), Caminho Amaldiçoado (maldição Exaustão).

**Vantagens atuais (15):** Relíquia de Viagem (+1 relíquia comum inicial), Treino Prévio (2 cartas com upgrade), Reforço, Gêmeo, Bolsa Cheia (+20 de ouro inicial), Relíquia Escolhida, Olho Treinado, Ensaio (1ª carta comprada em cada loja vem com upgrade), Mão Firme (+1 carta na 1ª rodada), Energia Guardada (+1 energia na 1ª rodada), Limpeza, Bênção do Caminho (upgrade aleatório ao entrar nos mapas 2 e 3), Juros (10% do ouro ao vencer cada boss, máx. 15), Caçador de Elites (+12 de ouro por elite), Segunda Chance.

**Nós da árvore (efeitos especiais):** +dano no 1º ataque básico com atordoamento; +dano contra alvos abaixo de 30% e carga de especial ao derrotar; ignorar defesa; 1ª skill com +dano e "Exposto"; cura ao cair abaixo de 40%; 1ª skill cura o usuário e o aliado mais ferido; escudo abaixo de 25%; −dano nos primeiros 6 s; escudo inicial no aliado com mais vida; escudo e +dano na 1ª morte aliada; +velocidade nos 3 primeiros ataques; +velocidade por abate; começar com carga de especial; +velocidade a cada 3 skills do time. **Expedição:** renovar ofertas da loja; +1 candidato no recrutamento; desconto no 1º upgrade; 1ª carta do mapa mais barata; +1 opção de relíquia; ouro ao entrar no mapa; +2 casas na bolsa; 2 escolhas no 1º recrutamento.

## 7. Formato de resposta pedido

Para cada peça da seção 4:
- **2 a 3 alternativas**, cada uma com:
  - nome;
  - efeito em uma linha (PT);
  - por que deve cair na faixa;
  - riscos de combinação.
- Indicar a **alternativa preferida**.

Opcional: sugestões para as peças no limite de baixo.
