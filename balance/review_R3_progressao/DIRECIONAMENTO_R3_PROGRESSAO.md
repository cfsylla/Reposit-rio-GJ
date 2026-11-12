# Grand Journey: Review R3 de Progressão (direcionamento para o ChatGPT)

Aprovado por Carlos em 12/11/2026, a partir dos playtests do CP4 publicado (v56).
Base: a fonte atual do Site (v56). Os nomes de arquivo e de função citados são do código de referência do Claude; na fonte publicada podem estar em outro lugar.

**Regras deste pacote**
- Implementar tudo o que está aqui. Publicar só com autorização do Carlos.
- **Não é preciso compatibilidade com saves antigos.** O Carlos reseta o progresso a cada atualização.
- **Preços em diamante ficam como estão** (cartas e relíquias pelo preço atual; boosters novos a 7 diamantes). A economia permanente será revisada depois.
- Não mexer em Secret Boss nem em Desafio Final.

Índice:
1. Trava de mapas
2. Decks iniciais
3. Boosters
4. Marcos (Anexo A)
5. Liberação de cartas e relíquias na loja de diamantes
6. Blackfang e Dawncrest
7. Recrutas com upgrade por mapa
8. Raridade das relíquias por mapa
9. Bug: Reforços Inimigos e valores dos Desafios (Anexo B)
10. Ajustes nos campos do save
11. O que me devolver

---

## 1. Trava de mapas
- **Perfil novo:** só o mapa 1 está liberado. A run 1 tem só o mapa 1.
- **Vencer o boss do mapa 1 com o mapa 2 ainda bloqueado:**
  - a run termina;
  - o mapa 2 é liberado;
  - aparece uma tela de **vitória de capítulo** ("Mapa 2 liberado").
- **Vencer o boss do mapa 2 com o mapa 3 ainda bloqueado:** o mesmo, liberando o mapa 3.
- **Com os três mapas liberados:** a run segue como hoje (mapas 1, 2 e 3).
- **O que a vitória de capítulo conta:**
  - funcionam normalmente: XP da run, a janela da árvore do boss, diamantes, drops e marcos;
  - **não** conta como vitória de run: não cumpre "Vencer uma run pela primeira vez", não libera Desafios e Vantagens, e não conta para "vencer uma run com deck X".
- **Perder antes do boss:** nada é liberado.
- **Enquanto o mapa 3 não for liberado:** raids e True Bosses do mapa 3 não aparecem, porque o mapa 3 não existe na run.
- **Marcos dos bosses:**
  - "Derrotar o boss do mapa 1" (`boss`) libera **só o mapa 2**;
  - "Derrotar o boss do mapa 2" (`map2boss`) libera **só o mapa 3**;
  - os dois deixam de liberar decks e relíquias.

## 2. Decks iniciais
- **Disponíveis desde o início:** Dawn Vanguard (`vanguard`), Crossing Paths (`balanced`) e Trigger Law (`outlaws`).
- **Winds of Chance (`swift`):** deixa de ser deck inicial, por ser forte demais para o começo, e passa a ser liberado por marco (Anexo A).
- **"Primeiros Passos" (`firstSteps`):** deixa de liberar `balanced` e `swift`.

## 3. Boosters
- **Saem os boosters atuais:** `first` (First Horizons), `east`, `frontier`, `oaths`, `north`, `blackfang` e `dawncrest`.
- **Entram 14 boosters novos.** Os IDs são sugestões. Uma carta pode estar em mais de um booster. Preço: 7 diamantes cada.
- **Liberação para compra:** só por marco (Anexo A e seção 6).

**Grand Union: boosters de facção**

| ID sugerido | Nome | Cartas |
|---|---|---|
| `bst_dawnward` | Dawnward Order | warrior, lancer, bastion, gladiator, swordsman, musketeer, cavalier, duelist |
| `bst_east` | Legends of the East | fighter, martial_artist, shinobi, kinoichi, samurai, omnamusha, ronin, shaolin |
| `bst_frontier` | Frontier & Free Seas | cowboy, gunner, miner, sheriff, pirate, shackled_pirate, cannoneer, pirate_captain, pirate_admiral |
| `bst_verdant_arcane` | Verdant & Arcane | ranger, archer, crossbowman, bear_druid, eagle_druid, mage, priestess, bard, sorceress, sage |
| `bst_northern` | Northern Wilds | viking, glutton, shieldmaiden, berserker, huntress, shaman, bear_druid, eagle_druid |

**Grand Union: boosters mistos (por papel em combate; juntos cobrem as 41 cartas)**

| ID sugerido | Nome | Cartas |
|---|---|---|
| `bst_ironwall` | Iron Wall | bastion, gladiator, shaolin, shieldmaiden, bear_druid, pirate_admiral, fighter, shackled_pirate, glutton |
| `bst_heavy` | Heavy Hitters | warrior, swordsman, samurai, viking, berserker, lancer, kinoichi, martial_artist, miner, sorceress |
| `bst_sharp` | Sharpshooters | musketeer, ranger, archer, crossbowman, cowboy, gunner, huntress, cannoneer, mage |
| `bst_hunters` | Hunters & Raiders | shinobi, omnamusha, ronin, duelist, cavalier, pirate, eagle_druid, sheriff |
| `bst_mystic` | Mystic Support | sage, priestess, bard, shaman, pirate_captain, mage, sorceress, glutton |

**Ordens: as cartas de boss (hero) ficam fora dos boosters**

| ID sugerido | Ordem | Nome | Cartas |
|---|---|---|---|
| `bst_goblin` | Blackfang | Goblin Raiders | goblin_spearman, goblin_archer, goblin_rider, goblin_brute, goblin_bomber, goblin_king, orc_warrior, orc_berserker, orc_fighter |
| `bst_shadows` | Blackfang | Shadows & Stone | dark_elf_noble, dark_elf_archer, dark_elf_warrior, dark_elf_mage, blackfang_guardian, cave_troll, snow_troll, troll, mountain_troll |
| `bst_wildhearts` | Dawncrest | Wild Hearts | feline_swordsman, feline_rogue, feline_arcanist, feline_drummer, feline_fighter, centaur_crossbow, centaur_lancer, centaur_swordsman, flower_fairy |
| `bst_elven` | Dawncrest | Elven Courts | elf_noble, elf_guardian, elf_archer, elf_halberdier, elf_harpist, woodland_predator, woodland_lancer, woodland_scout, woodland_flailer |

## 4. Marcos
A tabela completa está no **Anexo A** (`ANEXO_A_MARCOS.md`).

**Regras**
- Os marcos **orientam, não obrigam**: o jogador vê todos e escolhe quais perseguir. Não criar fluxo forçado, ordem obrigatória nem destaque de "próximo marco".
- Cada marco dá 1 diamante (sem mudança) e libera **no máximo 1 item**: um deck emprestado ou um booster.
- **Marcos não liberam cartas nem relíquias.** Isso inclui tirar a liberação automática de `luckycharm` quando `bestSpent >= 30`.

**Marcos removidos (6)**

| ID | Marco |
|---|---|
| `northern` | 3 confrontos com 3 personagens de Frostborn Clans |
| `eastern` | 3 confrontos com 3 personagens de Legends of the East |
| `shooters` | 3 confrontos com 3 Atiradores |
| `arcanists` | 3 confrontos com 3 Arcanos |
| `journeys` | Encerrar 3 runs com pelo menos 5 nós |
| `decks` | Derrotar 3 decks inimigos diferentes |

**Marcos novos (10).** Os IDs são sugestões.

| ID sugerido | Marco |
|---|---|
| `recruit_three` | Recrutar 3 cartas em uma run |
| `card_level2` | Levar uma carta ao nível 2 |
| `spender_100` | Gastar 100 de ouro em uma run |
| `order_pair` | Vencer as 2 lutas de ordem de uma mesma ordem em um mapa |
| `elites_three` | Vencer 3 elites em uma run |
| `sweeps_six` | Vencer 6 confrontos sem perder round em uma run |
| `raid_win` | Vencer uma Raid |
| `map3_entries` | Vencer as 2 lutas de entrada do mapa 3 |
| `challenges_1` | Vencer uma run com 1 Desafio ativo |
| `challenges_3` | Vencer uma run com 3 Desafios ativos |

**Total:** 99 marcos. Os desbloqueios estão no Anexo A: 22 para a Grand Union (seção 3 do anexo) e 13 para as ordens (seção 6 do anexo).

## 5. Liberação de cartas e relíquias na loja de diamantes
**Regra do Carlos**
- Cartas e relíquias só entram no catálogo da loja de diamantes pelo **drop dos combates**. Liberar não é possuir: o item fica à venda.
- O jogador **nunca** recebe carta ou relíquia permanente sem gastar diamantes.
- Cartas, relíquias e boosters comprados servem para os decks custom.

**Como deve funcionar** (é a regra do `eliteReward` no código de referência)
1. Vale ao vencer uma **elite**, uma **luta de ordem** ou um **boss**.
2. **Só nas elites:** 50% de chance de +1 diamante em vez do drop. Isso **continua**.
3. Fora isso, libera **uma** destas:
   - uma carta do deck inimigo enfrentado que ainda não está no catálogo; ou
   - uma relíquia **usada por aquele inimigo** que ainda não está no catálogo.
4. Se o deck enfrentado já foi todo descoberto: +5 de ouro na run.

**Correções na v56**
- **A escolha de "descoberta" (`relicOffer` com `source: "discovery"`) mistura relíquias que o inimigo não usou.** Exemplos da run 11 do Carlos:
  - depois do boss do mapa 1, o inimigo tinha só Ember, e as opções foram Sling, Chain, Houses, War Cry, Patience, Aegis e Amplifier;
  - depois da 1ª ordem do mapa 2 (Ember, Spark e Boots), ele liberou Aegis.

  Corrigir: só cartas e relíquias **daquele inimigo** podem ser liberadas.
- **Tirar toda liberação de carta, relíquia ou booster vinda de marco.** Hoje acontece, por exemplo, com Precision ("elite"), Merchant ("spender"), Recovery ("boss"), Banner ("decks"), Boots ("eastern") e outras.
- **Mantém como está:**
  - as cartas de boss (hero) vão para o catálogo ao vencer o True Boss da ordem;
  - cartas e relíquias exclusivas de Blackfang e Dawncrest só entram no drop depois da revelação da ordem (seção 6).

## 6. Blackfang e Dawncrest
- **Revelação:** vencer o boss da ordem **no mapa 3** revela a ordem.
  - libera 1 deck, o mais fraco: Greenskins para Blackfang, Dawncrest Choir para Dawncrest;
  - as cartas e relíquias da ordem passam a entrar no drop e no recrutamento.
- **Sequência de marcos por ordem** (1 item por marco): está no Anexo A, seção 6.
  - Blackfang: 4 decks e 2 boosters.
  - Dawncrest: 5 decks e 2 boosters.
  - Os decks deixam de ser liberados em bloco (hoje são 2 pelo boss do mapa 3 e o resto pelo True Boss).
- **"?????" só nos marcos.** Antes da revelação, todo texto de marco que cita a ordem mostra "?????" no lugar do nome da ordem, dos decks e dos boosters dela. Por exemplo: "Derrotar o Boss ????? no mapa 2 → Keen Edge".
  - **Na run nada é ocultado:** mapa, lutas e inimigos mostram tudo normalmente.
  - Boosters, cartas e decks da ordem não precisam de "?????", porque só ficam visíveis depois de liberados.

## 7. Recrutas com upgrade por mapa
- **Onde vale:** nas cartas oferecidas nos **nós de recrutamento** e nos **recrutas de eventos**. Na loja não muda nada.
- **Mapa 1:** 25% de chance de cada carta oferecida vir com +1 de upgrade.
- **Mapa 2:** todas vêm com +1 de upgrade.
- **Mapa 3:** todas vêm com +2 de upgrade.
- **Por quê:** o jogador evita recrutar, porque uma carta nova sem upgrade e sem sinergia enfraquece o deck. O upgrade torna a carta recrutada útil nos mapas 2 e 3.
- **Na interface:** a oferta mostra o nível de upgrade da carta antes da escolha.

## 8. Raridade das relíquias por mapa
As ofertas de relíquia da run (recompensa, loja e eventos) passam a sortear a raridade com estes pesos:

| Mapa | Comum | Incomum | Rara | Ultra |
|---|---|---|---|---|
| 1 | 70% | 22% | 8% | 0% |
| 2 | 50% | 30% | 15% | 5% |
| 3 | 35% | 30% | 25% | 10% |

- Se não houver relíquia disponível da raridade sorteada, sortear a raridade vizinha (a de baixo primeiro).
- Os filtros atuais continuam: duplicatas, bolsa e relíquias exclusivas de ordem não liberada.
- Os valores são de partida e serão revistos no playtest.

## 9. Bug: Reforços Inimigos e valores dos Desafios
Detalhes no **Anexo B** (`ANEXO_B_BUG_REFORCOS.md`).
- Em duas runs vitoriosas do Carlos com `reinforcements` ativo, o inimigo teve o **mesmo** número de unidades do jogador em todos os rounds de lutas comuns e elites. O certo é +1 unidade inimiga **desde o 1º round** (decisão do Carlos de 08/11) e +2 de energia para o inimigo.
- Corrigir e conferir no jogo se **cada um dos 15 Desafios** tem efeito real na luta.
- O documento do projeto v56 lista valores antigos (por exemplo, Veteranos +3, Bolsa Leve −20%, Reforços "a partir da 2ª rodada"). A tela do jogo mostra os valores do CP4. Confirmar que o código usa os valores do CP4:

| Parâmetro | Valor CP4 |
|---|---|
| `veterans` | 8 |
| `commanders` / `commanderRelics` | 2 / 2 |
| `tough` | 0,10 |
| `relentless` | 0,08 |
| `bossStats` (Bosses Implacáveis) | 0,07 |
| `bossRounds` | 0 |
| `raidfury` / `raidDamage` | 0,25 / 0,08 |
| `inflation` | 0,30 |
| `lightpurse` | 0,27 |
| `bagCells` | 5 |
| `curses` | 2× Exaustão |
| `reinforceFromRound` | 1 |
| `heavyCards` | 2 (modo `pool`) |
| `dissipateMode` | `fixed` (1) |
| `scarceRounds` | 1 |
| `fewRelics` | 2 |

## 10. Ajustes nos campos do save
1. **`fusion`:** há registros com nível igual antes e depois (por exemplo, bastion 1→1, ranger 2→2). Corrigir o registro, ou incluir um campo que explique o caso (por exemplo, ganho sem subir de nível).
2. **`shopOffer`:** é gravado a cada compra ou rolagem. Incluir `reroll: true` quando a lista for nova por rolagem.
3. **`eventChoice`:** sai em dobro (abertura com `chosen: null` e depois a escolha). Gravar só a escolha confirmada.
4. **Novos registros:**
   - vitória de capítulo (`chapterWin`, com o mapa liberado);
   - drop de catálogo (`catalogDrop`, com tipo, id e o deck inimigo de origem);
   - liberação de booster e de deck por marco.

## 11. O que me devolver
1. A lista dos arquivos alterados e um resumo por seção (1 a 10).
2. A confirmação de que:
   - um perfil novo começa só com o mapa 1 e os 3 decks iniciais;
   - vencer o boss 1 encerra a run com vitória de capítulo e libera o mapa 2.
3. Um item de `encounters[]` de luta comum com Reforços ativo, mostrando 2v3 no round 1.
4. A lista final dos 99 marcos com o desbloqueio de cada um.
5. O que não foi possível implementar, ou o que ficou diferente do pedido, e por quê.
