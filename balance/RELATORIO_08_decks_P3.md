# Proposta P3 — 24 decks novos, milestones e decks inimigos por mapa

O que já estava decidido por você:
- manter os 10 IDs atuais com conteúdo novo;
- desbloquear os decks por milestones;
- permitir variações no formato (não só 3/3/3/3/2/2/2/2);
- propor decks inimigos.

Nada foi aplicado ao jogo ainda. Todos os testes usaram a cópia balanceada, que já tem P1, P2 e o Fearless V4.

## Como testei

1. **Runs completas:** 40 runs por deck, com o mesmo jogador simulado de sempre. São **960 runs com os decks novos** e 400 com os atuais, para comparar.
2. **Torneio:** cada deck enfrentou os outros 23 (e ele mesmo), 6 vezes cada, no modo Treino. O deck da linha é jogado pelo jogador simulado e o adversário pela IA do jogo.
   - O jogador simulado tem uma pequena vantagem nesse modo, por isso a **média do torneio é ~80%, não 50%**.
   - O que importa é a **diferença entre os decks**.
3. Foram **4 rodadas de ajuste**. A cada rodada, os decks muito acima ou muito abaixo trocavam algumas cartas e eram testados de novo.

## Resultado geral

| | Decks atuais | Decks novos |
|---|---|---|
| Perde a primeira luta da run | 8% | **2%** |
| Perde a 1ª rodada da 1ª luta | 33% | 21% |
| Lutas vencidas por run (média) | 3,2 | **4,1** |
| Decks com algum confronto "impossível" (vence menos de 20%) | — | 1 de 24 (Terremoto contra Círculo Verdejante) |
| Diferença entre o deck mais forte e o mais fraco no torneio | — | 74% a 92% (era 53% a 98% na 1ª versão) |

**Importante:** com o jogador simulado e sem árvore, nenhum deck vence a run. Isso não é problema dos decks. É a dificuldade geral dos mapas (os inimigos ficam fortes cedo demais), que é a próxima etapa do plano.

## Os 24 decks

| # | Deck | Ideia | Cartas | Relíquia inicial | Desbloqueio | Torneio | Perde a 1ª luta | Lutas vencidas na run (média) |
|---|---|---|---|---|---|---|---|---|
| 1 | **Vanguarda da Aurora** (`vanguard`) | Dawnward Order: frente sólida e escudo inicial | 3× Warrior, 3× Lancer, 3× Bastion, 3× Gladiador, 2× Swordsman, 2× Fighter, 2× Archer, 2× Ranger | Estandarte antigo | Inicial | 75% | 8% | 4.3 |
| 2 | **Encontro de Caminhos** (`balanced`) | Iniciante: um pouco de tudo, sem depender de combinação | 3× Fighter, 3× Warrior, 3× Ranger, 3× Bastion, 2× Samurai, 2× Crossbowman, 2× Priestess, 2× Gladiador | Pedra vital | Primeiros passos (já existe) | 81% | 0% | 4.5 |
| 3 | **Ventos do Acaso** (`swift`) | Impulsivo: explosão de dano nos primeiros segundos | 3× Lancer, 3× Martial Artist, 3× Pirate, 3× Archer, 2× Samurai, 2× Cavalier, 2× Mage, 2× Kinoichi | Opening Bell | Primeiros passos (já existe) | 92% | 0% | 4.5 |
| 4 | **Círculo Arcano** (`arcane`) | Arcane: especiais encadeados protegidos por suportes | 3× Bastion, 3× Warrior, 3× Mage, 3× Sorceress, 2× Gladiador, 2× Barda, 2× Sage, 2× Priestess | Tomo das estrelas | 3 conjuradores diferentes em 3 confrontos | 91% | 3% | 5.0 |
| 5 | **Lei do Gatilho** (`outlaws`) | Wild West + Predador: atiradores com crítico | 3× Cowboy, 3× Gunner, 2× Miner, 3× Fighter, 2× Xerife, 2× Crossbowman, 2× Bastion, 3× Gladiador | Medalhão da precisão | Gastar 30 de ouro em uma run | 75% | 8% | 3.5 |
| 6 | **Fortaleza** (`fortress`) | Sentinela: defesa altíssima, dano lento | 3× Bastion, 3× Shieldmaiden, 3× Gladiador, 3× Ranger, 2× Archer, 2× Priestess, 2× Lancer, 2× Warrior | Selo de proteção | Encerrar 3 runs com 5+ nós | 79% | 0% | 4.3 |
| 7 | **Lâminas do Oriente** (`blades`) | Legends of the East: assassinos e golpes rítmicos | 3× Shinobi, 2× OmnaMusha, 3× Samurai, 3× Fighter, 2× Ronin, 3× Martial Artist, 2× Kinoichi, 2× Shaolin | Medalhão da precisão | 3 Legends of the East diferentes em 3 confrontos | 91% | 0% | 4.7 |
| 8 | **Linha de Fogo** (`fireline`) | Muitos atiradores atrás de poucos defensores | 3× Ranger, 3× Archer, 3× Crossbowman, 3× Bastion, 2× Musketeer, 2× Gunner, 2× Cannoneer, 2× Warrior | Lente do viajante | 3 atiradores diferentes em 3 confrontos | 88% | 0% | 4.7 |
| 9 | **Coro de Guerra** (`astral`) | Suportes (Barda, Priestess, Sage) fortalecendo lutadores | 3× Warrior, 3× Swordsman, 3× Samurai, 3× Barda, 2× Berserker, 2× Priestess, 2× Sage, 2× Archer | Broche da recuperação | Derrotar o Boss | 85% | 0% | 5.2 |
| 10 | **Tripulação Salgada** (`corsair`) | Seasalt Crew: piratas atacando o mesmo alvo | 3× Pirate, 3× Shackled Pirate, 3× Pirate Captain, 3× Miner, 2× Cannoneer, 2× Pirate Admiral, 2× Gunner, 2× Archer | Ampulheta de combate | Derrotar 3 baralhos inimigos diferentes | 81% | 5% | 3.0 |
| 11 | **Clãs do Norte** (`north`) | Frostborn: ficam mais fortes quando aliados caem | 3× Viking, 3× Berserker, 3× Shieldmaiden, 3× Fighter, 3× Warrior, 2× Huntress, 2× Shaman, 1× Glutton | Vengeful Ember | 3 Frostborn diferentes em 3 confrontos | 75% | 3% | 3.8 |
| 12 | **Círculo Verdejante** (`verdant`) | Verdant Covenant: vegetação que reduz dano + druidas | 3× Ranger, 3× Archer, 3× Bear Druid, 3× Eagle Druid, 2× Crossbowman, 2× Lancer, 2× Priestess, 2× Fighter | Reinforced Plating | Resolver 3 eventos em uma run | 91% | 0% | 5.6 |
| 13 | **Golpe Certeiro** (`keen`) | Predador + Destemido: críticos em sequência | 3× Fighter, 3× Warrior, 3× Berserker, 3× Cowboy, 2× Swordsman, 2× Duelist, 2× Huntress, 2× Crossbowman | Medalhão da precisão | Derrotar um elite | 86% | 3% | 3.6 |
| 14 | **Terremoto** (`quake`) | Demolidor: ataques em área contra grupos | 3× Lancer, 3× Martial Artist, 3× Miner, 3× Kinoichi, 2× Bastion, 2× Mage, 2× Cannoneer, 2× Priestess | Estandarte antigo | **NOVO:** derrotar o boss do mapa 2 | 83% | 5% | 3.5 |
| 15 | **Executores** (`executioners`) | Impiedoso: focam e finalizam os feridos | 3× Kinoichi, 3× Cowboy, 2× Musketeer, 3× Gladiador, 2× Bastion, 2× Crossbowman, 2× Huntress, 2× Xerife, 1× Fighter | Executioner’s Mark | Vencer 3 confrontos sem perder rodada em uma run | 88% | 0% | 4.7 |
| 16 | **Horda Goblin** (`goblin_horde`) — blackfang | Goblin: quanto mais goblins vivos, mais dano | 3× Goblin Arqueiro, 3× Goblin Montador, 3× Goblin Bruto, 3× Guardião Elfo Negro, 2× Goblin Lanceiro, 2× Goblin Bombardeiro, 2× Rei Goblin, 2× Orc Berserker | Opening Bell | Derrotar o boss Blackfang | 80% | 0% | 4.1 |
| 17 | **Peles Verdes** (`greenskins`) — blackfang | Orc + Troll: quebram defesa e golpeiam forte | 3× Orc Guerreiro, 3× Orc Berserker, 2× Orc Lutadora, 2× Troll da Caverna, 2× Goblin Bruto, 3× Goblin Lanceiro, 2× Goblin Montador, 3× Goblin Arqueiro | Estandarte antigo | Derrotar o boss Blackfang | 77% | 5% | 3.5 |
| 18 | **Corte Sombria** (`dark_court`) — blackfang | Dark Elf: ignoram defesa de quem ataca aliados | 3× Nobre Elfo Sombrio, 3× Arqueiro Elfo Sombrio, 3× Guerreiro Elfo Sombrio, 3× Orc Guerreiro, 2× Mago Elfo Sombrio, 2× Guardião Elfo Negro, 2× Orc Lutadora, 2× Goblin Arqueiro | Medalhão da precisão | Derrotar o true boss Blackfang (Rei Dark Elf) | 84% | 5% | 4.1 |
| 19 | **Presas Negras** (`blackfang_war`) — blackfang | Blackfang misto: linha de frente pesada e Rei Goblin | 3× Orc Guerreiro, 3× Goblin Bruto, 3× Arqueiro Elfo Sombrio, 3× Goblin Arqueiro, 2× Troll, 2× Rei Goblin, 2× Nobre Elfo Sombrio, 2× Orc Berserker | Pedra vital | Derrotar o true boss Blackfang (Rei Dark Elf) | 85% | 10% | 3.4 |
| 20 | **Bando Meowri** (`meowri_band`) — dawncrest | Meowri: sobrevivem ao golpe fatal | 3× Espadachim Meowri, 3× Lutador Meowri, 3× Gatuno Meowri, 3× Guerreiro Elfo da Floresta, 2× Feiticeiro Meowri, 2× Percussionista Meowri, 2× Espadachim Centauro, 2× Arqueiro Alto Elfo | Last Stand | Derrotar o boss Dawncrest | 74% | 0% | 3.8 |
| 21 | **Corte Alta Élfica** (`high_court`) — dawncrest | High Elf: escudos encadeados + Harpista | 3× Nobre Alto Elfo, 3× Guerreiro Alto Elfo, 3× Arqueiro Alto Elfo, 3× Lanceira Alta Elfa, 3× Guerreiro Elfo da Floresta, 2× Fada das Flores, 2× Caçadora Centaura, 1× Harpista Alta Elfa | Broche da recuperação | Derrotar o boss Dawncrest | 88% | 3% | 3.9 |
| 22 | **Guarda da Floresta** (`forest_guard`) — dawncrest | Forest Elf: primeiro golpe devastador | 3× Predador Elfo da Floresta, 3× Guerreiro Elfo da Floresta, 3× Batedor Elfo da Floresta, 3× Guardião Elfo da Floresta, 2× Arqueiro Alto Elfo, 2× Nobre Alto Elfo, 2× Cavaleiro Centauro, 2× Guerreiro Alto Elfo | Lente do viajante | Derrotar a true boss Dawncrest (Rainha Fada) | 74% | 3% | 4.3 |
| 23 | **Galope Centauro** (`centaur_charge`) — dawncrest | Centaur + Desbravador: recuam e voltam a galope | 3× Caçadora Centaura, 3× Cavaleiro Centauro, 3× Espadachim Centauro, 3× Lutador Meowri, 2× Arqueiro Alto Elfo, 2× Batedor Elfo da Floresta, 2× Fada das Flores, 2× Guerreiro Alto Elfo | Botas do vento | Derrotar a true boss Dawncrest (Rainha Fada) | 78% | 8% | 3.3 |
| 24 | **Coro de Dawncrest** (`dawncrest_choir`) — dawncrest | Suportes de Dawncrest em volta de lutadores | 3× Espadachim Meowri, 3× Lanceira Alta Elfa, 3× Guardião Elfo da Floresta, 2× Percussionista Meowri, 2× Harpista Alta Elfa, 2× Fada das Flores, 3× Guerreiro Elfo da Floresta, 2× Espadachim Centauro | Pedra vital | Derrotar a true boss Dawncrest (Rainha Fada) | 81% | 0% | 3.7 |

O "Torneio" é a porcentagem de confrontos vencidos contra todos os outros decks (média ~83%). **Revisão a pedido de Carlos (rodada 6):** Executores 95% → 88% (Musketeer 3→2 e entra 1 Fighter no lugar de 1 carta), Lâminas do Oriente 93% → 91% (OmnaMusha 3→2, Martial Artist 2→3) e Lei do Gatilho 69% → 75% (Miner 3→2, Gladiador 2→3). Agora todos os 24 ficam entre 74% e 92%, sem confrontos "impossíveis" nesses três.


## Como as runs foram simuladas (resposta à pergunta de Carlos)

**O que entrou.** As runs usam o jogo inteiro, com as mesmas regras do jogo de verdade:
- o mapa com as rotas;
- batalhas, elites, ordens, raids e bosses;
- o crescimento dos inimigos ao longo da run;
- o ouro recebido;
- lojas (cartas, relíquias, upgrades, remoção de cartas);
- santuários de upgrade, recrutamento e relicário;
- a bolsa de relíquias com o formato real das peças;
- os eventos;
- a árvore depois de cada boss;
- a troca de mapa.

Nenhum combate foi simulado "fora" da run, e nenhum deck ficou parado no estado inicial.

**Quem joga é um jogador simulado simples.** Ele joga no nível da IA do jogo (foi medido) e tem estas limitações:
- **Rota:** olha só a próxima camada e prefere upgrade, loja, relíquia e recrutamento.
- **Eventos:** nesta bateria, ele **recusa todos**.
- **Loja:** prioriza upgrade; compra relíquia ou carta só se sobrar ouro.
- **Árvore:** começa vazia e compra nós depois de cada boss.
- **Combate:** posiciona como a IA do jogo e não planeja o futuro.

**Onde as runs terminam.** Quase todas acabam ainda no **mapa 1**:
- 73% morrem em batalhas normais;
- a maioria morre na camada 5, que é a 4ª luta.

O motivo está nos números de upgrade de cada lado:

| Luta do mapa 1 | Cartas do inimigo com upgrade | Cartas do jogador com upgrade | Derrotas |
|---|---|---|---|
| 1ª e 2ª | 0 | 0 a 1 | 3% a 6% |
| **4ª (camada 5)** | **12 de 20** | 1,6 | **41%** |
| 6ª | 20 de 20 | 3,0 | 52% |

Os inimigos ganham 12 upgrades de uma vez a partir da 4ª luta e 20 a partir da 6ª. Já o jogador, com o ouro real da run (cerca de 45 até morrer), consegue de 2 a 3 upgrades. Por isso o jogador simulado quase nunca chega às lojas e eventos dos mapas 2 e 3.

Isso confirma a principal suspeita do diagnóstico inicial: **a curva de upgrades dos inimigos cresce muito mais rápido do que a economia do jogador permite acompanhar.** É a próxima etapa.

Um jogador humano experiente joga melhor que esse simulado, então esses números são o "pior caso razoável". Mesmo assim, o salto de 0 para 12 upgrades na 4ª luta aparece para qualquer jogador.

## Desbloqueio por milestones

- **7 milestones que hoje não liberam nada** passam a liberar decks:
  - Derrotar um elite
  - Encerrar 3 runs com 5+ nós
  - Resolver 3 eventos em uma run
  - Gastar 30 de ouro em uma run
  - Vencer 3 confrontos sem perder rodada em uma run
  - 3 atiradores diferentes em 3 confrontos
  - 3 conjuradores diferentes em 3 confrontos
- **4 milestones que já liberam boosters** passam a liberar também um deck:
  - Derrotar o Boss
  - Derrotar 3 baralhos inimigos diferentes
  - 3 Frostborn diferentes em 3 confrontos
  - 3 Legends of the East diferentes em 3 confrontos
- **1 milestone novo:** derrotar o boss do mapa 2 → Terremoto.
- **Decks de ordem:** o boss da ordem libera 2 decks; o true boss libera os demais (2 de Blackfang e 3 de Dawncrest). É o mesmo momento em que as cartas dessas ordens ficam disponíveis.

Atenção para os saves: quem já completou um milestone antes da mudança não ganharia o deck novo automaticamente. Na implementação, é preciso uma verificação que libere esses decks ao carregar o perfil.

## Decks inimigos por mapa (proposta para a próxima etapa)

Hoje, as batalhas normais sorteiam 10 personagens quaisquer. A proposta é usar decks temáticos, com sinergia crescente por mapa. As elites continuam usando os decks emprestados, que agora são 24, e as ordens continuam com os decks próprios.

| Mapa | Deck inimigo | Ideia |
|---|---|---|
| 1 | Patrulha da Estrada, Saqueadores, Caçadores, Milícia do Vale | Simples, baratos, no máximo um trait de 2 membros |
| 2 | Guarnição da Aurora, Bando do Norte, Pistoleiros, Dojô | Uma facção com 4 membros e um suporte |
| 3 | Armada, Conclave, Bosque Antigo, Elite Imperial | Sinergia completa e suportes |

As cartas de cada um estão em `balance/decks/enemy_decks_p3_v1.json`. Eles serão **testados junto com a curva de dificuldade dos mapas**, porque decidem o quão difícil é cada mapa.

## O que muda tecnicamente (quando aplicar)

1. Os decks passam a aceitar a quantidade de cada carta (`counts`). Os 24 entram na lista de decks com a relíquia inicial de cada um.
2. Os milestones ganham os decks a liberar, mais o milestone novo do mapa 2.
3. Os bosses de ordem passam a liberar os decks de ordem.
4. Ajuste para saves antigos: liberar decks de milestones já completados.

## Decisões suas

1. Aprovar os 24 decks: lista, cartas e relíquias. Pode pedir trocas em qualquer deck.
2. Aprovar a tabela de desbloqueio.
3. Aprovar a ideia dos decks inimigos por mapa, para eu testar na etapa da dificuldade.

## Reprodução

```sh
GJ_ROOT=game GJ_DECKS=balance/decks/decks_P3_final.json node balance/sim/run.cjs --decks vanguard --seeds 1-40
GJ_ROOT=game node balance/sim/matrix.cjs --decks balance/decks/decks_P3_final.json --seeds 6 --only vanguard
node balance/sim/deck-report.cjs balance/out/decks4 balance/decks/decks_p3_v4.json
```
