# Grand Journey: balanceamento final do jogo base

Documento de consulta do trabalho de balanceamento do **jogo base** feito com o Claude, do CP1 à Review R3 (02/11 a 22/11/2026).
**O balanceamento do jogo base foi encerrado pelo Carlos em 22/11/2026.** O endgame continua em outro chat, com acesso a este repositório.

- **Repositório:** `cfsylla/Reposit-rio-GJ`, branch `ccr-fc0114d7-9l2urp`.
- **Divisão de trabalho:** o jogo publicado é implementado pelo ChatGPT no projeto principal (Sites). O Claude analisa, simula e propõe.
- **Cópia de referência no repositório:** `game_r3/dist` corresponde ao CP4. **Não tem** as mudanças feitas depois pelo ChatGPT (v57: Review R3 de progressão; bosses; cartas).

---

## 1. Resultado final (playtests do Carlos)

| Carreira | Versão | 1ª vitória | Tempo ativo até a 1ª vitória |
|---|---|---|---|
| 1ª campanha | CP4 (v56) | run 11 | ~3,4 h |
| Carreira v57-R3 | v57 (trava de mapas, marcos novos) | run 7 | ~2,4 h |
| Campanha de 20/11 | v57 + bosses dos mapas 2 e 3 mais fortes | run 7 | ~2,8 h |

- **Conclusão do Carlos:** jogo base bem balanceado, com a 1ª vitória por volta da run 7 e cerca de 2h30 de jogo.
- **Duração típica de uma run:**

  | Tipo de run | Tempo ativo |
  |---|---|
  | Derrota no mapa 1 | 5 a 15 min |
  | Vitória de capítulo ou derrota no mapa 2 | 15 a 35 min |
  | Run completa | 35 a 45 min |

- **Meta do simulador:** 1ª vitória mediana na run 15–18. Ela usa um jogador que não aprende. O humano experiente chega antes, e isso foi aceito.
- Os saves e as análises estão em `balance/playtests/` e `balance/rodada3/relatorios/` (seção 12).

---

## 2. Linha do tempo

| Etapa | Data | Base | Conteúdo principal | Documento |
|---|---|---|---|---|
| CP1 | 02/11 | v54 | personagens (curva de força), traits, suportes modelo B, 24 decks, dificuldade e economia P4 | `checkpoint_CP1/CHECKPOINT_BALANCEAMENTO.md` |
| CP2 | 03/11 | v54 + CP1 | curva, árvore por nível, 9 decks, 15 Desafios, 15 Vantagens | `checkpoint_CP2/CHECKPOINT_CP2.md` |
| CP3 | 07/11 | publicação 50 (v56) | XP como recurso da run, janelas da árvore, bosses e True Bosses, auras, 6 decks | `checkpoint_CP3/CHECKPOINT_CP3.md` |
| CP4 | 10/11 | v50 + CP3 | 43 relíquias, habilidade só com alvo válido, escada por barreira, árvore por anel, cura dos suportes, Grand Union | `checkpoint_CP4/CHECKPOINT_CP4.md` |
| Review R3 de progressão | 12–14/11 | v56/CP4 publicado | trava de mapas, marcos, boosters, loja de diamantes, ordens, raridade de relíquia por mapa | `review_R3_progressao/` |
| Bosses dos mapas 2 e 3 | 16/11 | v57 | fator por mapa 1,037 / **1,10** / **1,35** | `rodada3/PROMPT_CHATGPT_BOSSES_R3.md` |
| Review R3 de cartas | 20/11 | código atual | 24 raridades e 17 heróis | `review_R3_cartas/` |

---

## 3. Personagens, traits e suportes

### 3.1 Curva de força (CP1)
- **Força-alvo** = 1,00 + 0,04 × (custo − 2) + 0,02 × raridade.
- No CP1, 33 personagens foram ajustados em custo, raridade, vida, ataque, área e `skillScale`.
- **Laboratório:** o personagem substitui um lutador neutro num time de 5 e enfrenta 6 tipos de adversário. Índice 1,00 = igual ao neutro.

### 3.2 Ranking atual e revisão de raridade (20/11)
- **Ranking:** laboratório no código atual (`lab2`, 9 seeds). Cobre 94 cartas (77 personagens + 17 heróis), com 12 medições por carta: níveis 0, 1 e 2, fundido, cada trait no 1º e no 2º patamar, e todos os traits juntos.
- **Planilha completa:** `rodada3/relatorios/R3_ranking_personagens_lab2.xlsx`.
- **Achados:**
  - a raridade quase não acompanhava a força;
  - os suportes ficaram fortes depois da cura nova (Shaman e Sage no top 3);
  - a fusão é o maior salto de poder (+0,10 a +0,38);
  - os traits sozinhos rendem pouco (+0,00 a +0,04 cada).
- **Revisão de raridade aprovada:** 24 personagens mudam de raridade (`rodada3/relatorios/R3_raridades_final.md`). Distribuição dos 77 personagens:

  | | Comum | Incomum | Rara | Ultra |
  |---|---|---|---|---|
  | Antes | 24 | 28 | 21 | 4 |
  | Depois | 24 | 31 | 17 | 5 |

  - **Sobem:** Archer (Ultra), Cannoneer (Ultra), Ranger e Martial Artist (Rara), entre outros.
  - **Descem:** Cavalier, Sorceress, Troll da Montanha e Fada das Flores (Comum); Harpista Alta Elfa (Ultra → Incomum, decisão do Carlos), entre outros.
  - A raridade não muda o combate. Muda o preço na loja de diamantes (10, 15, 20, 25), as chances nos boosters, o drop de catálogo e os eventos de "cartas raras".
- **Ranger:** existe uma alteração planejada da armadilha (arremesso, recuo de 55, área +10%). Medida no laboratório, ela muda pouco: 1,02 → 1,02 no nível 0 e +0,03 fundido. Ainda **não** está implementada no jogo.

### 3.3 Traits
- **CP1:** valores revistos (Meowri, Troll, High Elf, Dark Elf, Orc, Arcane e o 1º patamar de Devastator, Sentinel, Unyielding, Predator e Lookout).
- **CP1:** mecânicas novas (Legends of the East, Goblin, Trailblazer, Protector, Patient e Fearless V4).
- A tabela atual dos 29 traits está na aba "Traits" da planilha do ranking.

### 3.4 Suportes
- **CP1 (modelo B):** aura passiva com raio de 120. O emissor não é afetado; auras de suportes diferentes somam; o teto de redução de dano é 65%.
- **CP3:** só **Priestess, Flower Fairy, Elf Harpist e Shaman** curam. Os outros 6 suportes têm 1 buff cada (o Goblin King mantém 2).
- **CP4:** a cura vira % da vida de quem cura (~5 de vida/s no nível 0). Ritmo: Fada a cada 2 s, Xamã 3 s, Sacerdotisa 4 s, Harpista 5 s, com ±10%. Há teto por pulso nos bosses de raid.

### 3.5 Habilidade só com alvo válido (CP4)
A carga cheia fica guardada até existir um alvo válido:

| Tipo de habilidade | Só dispara quando |
|---|---|
| Golpe, tiro, zona ou buff em si | o alvo está no alcance de ataque |
| Investida | o alvo está a até alcance + 100 |
| Linha ou cone | o alvo está no comprimento da linha ou do cone |
| Área em volta de si | há inimigo dentro da área |
| Buff ou escudo em aliados | há aliado no raio e inimigo a até 100 de algum deles |
| Cura | há aliado abaixo de **95%** da vida |

- Vale para as 63 habilidades ativas e para as 17 cartas de herói.
- Os pulsos dos suportes não mudaram.
- **Validado em playtest:** nenhuma unidade travou; o máximo foi 6 s de espera somados numa run. Detalhe por unidade em `rodada3/reliquias/HABILIDADES_ATIVACAO_R3.md`.

### 3.6 Cartas de herói (Review R3 de cartas, 20/11)
- **Base para todos os 17:** Ultra, **custo 4** e atributos por personalidade, a partir das notas de 1 a 5 que cada herói herda.
- **Carga da habilidade por papel:** suporte 5 s (Oracle e Fairy: 4 s), lutador, rápido e atirador 6 s, tanque 7 s. Antes era 10 s para todos.
- **Força:** índice no nível 0 de **~1,15** para todos. Antes ia de 0,92 a 1,02.
- **Suportes:** a força está na habilidade, não no corpo.
  - Grand Oracle: cura 32% da vida máxima do aliado mais ferido.
  - Fairy Queen: cura de 23% e escudo de 23% em 2 aliados.
- **First Wayfarer:** a carta passa a usar *cleave*; o boss continua igual.
- **As versões de boss não mudam.**
- Tabela e JSON em `rodada3/relatorios/R3_herois_nova_versao.md` e `.json`. Enviado ao ChatGPT em `review_R3_cartas/`.

---

## 4. Relíquias (CP4)
- **43 relíquias.** Método: efeito − custo do formato = patamar da raridade.
- **Patamares** (lutas vencidas a mais por run, com 10 nós): comum +1,5, incomum +2, rara +3, ultra +4.
- **Custo dos formatos** (10 nós): ponto 0,57, 2 casas ~0,66, 3 casas ~0,80, 4 casas ~1,0, U/P/L5 ~1,15, cruz 1,70 lutas.
- **Definições do Carlos (10/11):** `rodada3/reliquias/DEFINICOES_R3_10-11.md`. Relatórios em `rodada3/relatorios/R3_reliquias_*.pdf`.
- **Pool dos inimigos (Review R3, Anexo C):**
  - 14 relíquias de combate entram no pool dos inimigos, com filtro de traits;
  - ultras (Eco e Funda) só no mapa 3 e em bosses;
  - Horde Totem e Dawn's Blessing só no pool da própria ordem;
  - 9 relíquias de economia ou de escolha do jogador são liberadas por marco.
- **Raridade por mapa nas ofertas da run:**

  | Mapa | Comum | Incomum | Rara | Ultra |
  |---|---|---|---|---|
  | 1 | 70% | 22% | 8% | 0% |
  | 2 | 50% | 30% | 15% | 5% |
  | 3 | 35% | 30% | 25% | 10% |

  ⚠️ Na v57 isso valia só na loja (bug relatado, seção 11).

---

## 5. Dificuldade: curva, escada e bosses

### 5.1 Escada de barreiras (CP4, `JOURNEY_BARRIER_TUNE`)
Multiplicador de vida e ataque dos inimigos por barreira, nos mapas 1 / 2 / 3:

| Barreira | Multiplicador |
|---|---|
| Ordens | ×1,12 / 1,12 / 1,20 |
| Entrada dos mapas 2 e 3 (2 primeiras lutas) | ×1,118 / 1,24 |
| Luta de boss | ×1,022 / 1,071 / 1,20 |
| Raids | ×1,30 / 1,37 / 1,46 |
| Titã como boss | ×1,04 |

- **Força do mapa:** ×1 / ×1,16 / ×1,235.
- **Escala dentro do mapa:** 0,80 + 0,02 por luta.
- **Ouro por vitória:** 18 a 24 por luta, conforme o mapa (v57).

### 5.2 Bosses (`JOURNEY_BOSS_TUNE`)
- **Fator por mapa:** **1,037 / 1,10 / 1,35** (mapas 1 / 2 / 3). Os mapas 2 e 3 subiram em 16/11, porque não paravam o jogador; antes eram 0,965 e 1,198.
- **Fator próprio de cada boss** (calibrado na R3): iguala os bosses do mesmo mapa a ±5 pontos com 30 nós. Exemplos: Orc 0,59, Goblin 1,90, Forest Elf 1,87.
  - Um fator baixo significa que o atributo-base do boss é alto, **não** que o boss é fraco.
- **True Bosses:** ~12 a 15 pontos abaixo do boss comum do mapa 3. Andarilho ×1,489, Dark Elf ×1,275, Fada ×1,738.
- **Encontro do True Boss:** 2 vitórias na forma 1, depois a forma 2 no formato de raid, com limite de 5 derrotas. O placar 3×3 é vitória (2 pontos na forma 1 + derrotar a forma 2).
- **Comparação dos bosses do mesmo mapa (21/11):** no simulador ficam a ±5 pontos com 30 nós; com 15 nós a diferença é maior (59% a 80% no mapa 1). Nos playtests, só o **Imperador Orc no mapa 1** mostrou sinal de ser mais difícil (2 derrotas em 3). O Carlos decidiu não ajustar.
- **Relatórios:** `rodada3/RELATORIO_R3_03_bosses.md` e `rodada3/BOSSLAB_R3_v1.txt`.

### 5.3 Desafios e Vantagens (valores do CP4)
- **Desafios:** recalibrados para −7 a −12 pontos de vitória cada. Valores em `game_r3/dist/challenges.js` (`JOURNEY_CHALLENGE_TUNE`):

  | Desafio | Valor | Desafio | Valor |
  |---|---|---|---|
  | Veteranos | 8 | Fúria das Raids | +25% / +8% |
  | Tropas Resistentes | +10% | Mercado Inflacionado | +30% |
  | Ataques Implacáveis | +8% | Bolsa Leve | −27% |
  | Comandantes | +2 / +2 | Bagagem Limitada | 5 casas |
  | Bosses Implacáveis | +7% | Caminho Amaldiçoado | 2× Exaustão |
  | Reforços Inimigos | desde a 1ª rodada | Deck Pesado | +2 cartas |
  | Energia Dissipada | −1 | Recursos Escassos | 1ª rodada |
  | Relíquias Escassas | −2 | | |

- **Bug corrigido na v57:** o Reforços Inimigos não tinha efeito. Validado no playtest: 2v3, 3v4, 4v5.
- **Vantagens:** Juros 100% até 150, Caçador de Elites +20 e Bênção do Caminho 2× upgrade 1. As demais estão como no CP2.
- **Medição final isolada e escada de combinações:** ficaram **pendentes**. Pertencem ao endgame.

---

## 6. Árvore e XP
- **XP:** é um recurso da run, gasto 1:1 nas janelas da árvore. A sobra passa entre janelas da mesma run e é perdida no fim da run. **Não há banco permanente.**
- **Janelas:** depois da 6ª luta de cada mapa, depois do boss de cada mapa e na derrota (CP4). Todas as compras são permanentes.
- **XP por encontro:**

  | Encontro | Mapas 1 / 2 / 3 |
  |---|---|
  | Luta comum | 1 / 2 / 3 |
  | Elite, ordem ou raid | 2 / 4 / 6 |
  | Boss | 6 / 10 / 12 (v56) |
  | True Boss | 18 |

- **Custo:** 8 × tipo × anel, total de 1.754; o nó mais caro custa 56. Os básicos dos anéis 1 e 2 têm efeito ×3. São 60 nós.
- **Diamantes:** o XP só vira diamante (1 a cada 20) com a árvore completa.
- **Playtest:** a árvore cresce cerca de 2× mais rápido que no simulador (17 nós na run 8). Foi aceito.

---

## 7. Decks emprestados
- **24 decks.** Força medida pela 1ª vitória mediana no simulador (`out/rodada3/etapa5/DECKS_CARREIRAS.md`).
- **Decks iniciais (Review R3):** Dawn Vanguard, Crossing Paths e Trigger Law. O Winds of Chance saiu, por ser forte demais para o começo.
- **Ordem de exibição** (do mais fraco ao mais forte):
  - Grand Union: Dawn Vanguard → Crossing Paths → Blades of the East → Trigger Law → Executioners → Earthquake → Keen Edge → Salt Crew → Fortress → Verdant Circle → Arcane Circle → Winds of Chance → War Choir → Northern Blood → Fireline;
  - depois, em blocos próprios, Blackfang e Dawncrest (`review_R3_progressao/ANEXO_D_ORDEM_E_TEXTOS.md`).
- **Fortes:** Fireline, War Choir e Northern Blood são liberados nos marcos mais difíceis antes da 1ª vitória. Eles não influenciaram a 1ª vitória nos playtests.
- **Compra direta de deck por 25 diamantes:** continua. Será revista na economia.

---

## 8. Progressão (Review R3, 12–14/11)
- **Trava de mapas:** a run 1 tem só o mapa 1. Vencer o boss do mapa 1 encerra a run com **vitória de capítulo** e libera o mapa 2; o mesmo vale para o mapa 2. A vitória de capítulo não conta como vitória de run.
- **Marcos (102):**
  - orientam, não obrigam;
  - 1 diamante cada;
  - **no máximo 1 item por marco**: 44 liberam algo (22 da Grand Union, 13 das ordens, 9 relíquias) e 2 liberam o mapa seguinte;
  - saíram os 4 marcos de facção e os 2 passivos;
  - os textos dizem o tipo do item: Booster Pack, Retail Deck ou Relic.
- **Loja de diamantes:** cartas e relíquias só entram no catálogo pelo **drop do inimigo enfrentado** (elite, ordem ou boss). Nas elites, há 50% de chance de +1 diamante em vez do drop. Comprar sempre custa diamante.
- **Boosters (14):**
  - 5 de facção: Dawnward Order, Legends of the East, Frontier & Free Seas, Verdant & Arcane, Northern Wilds;
  - 5 mistos por papel: Iron Wall, Heavy Hitters, Sharpshooters, Hunters & Raiders, Mystic Support;
  - 4 de ordem: Goblin Raiders, Shadows & Stone, Wild Hearts, Elven Courts;
  - preço de 7 diamantes; liberados só por marco.
- **Blackfang e Dawncrest:**
  - vencer o boss da ordem no mapa 3 revela a ordem e libera 1 deck;
  - os outros decks vêm em sequência, do mais fraco ao mais forte;
  - as cartas de boss (hero) entram no catálogo pelo True Boss da ordem;
  - nos marcos, o nome aparece como "?????" até a revelação; na run nada é ocultado.
- **Recrutas com upgrade:** mapa 1 com 25% de chance de +1; mapa 2 com +1; mapa 3 com +2. Vale para recrutamento e eventos.

---

## 9. Ferramentas (para reprodução)
- **Simulador** em `balance/sim/`, carregando a cópia do jogo por `GJ_ROOT` (por exemplo, `GJ_ROOT=../../game_r3`):
  - `run.cjs`, `engine.cjs`, `career.cjs`, `policy.cjs`: runs e carreiras;
  - `lab.cjs`: laboratório de personagens;
  - `lab2.cjs`: laboratório com níveis, fusão, traits forçados (`--configs`), sobrescrita de atributos (`GJ_UNIT_OVERRIDES`) e troca de habilidade de herói (`GJ_HERO_MODE`);
  - `r3-lab2-run.sh` e `r3-lab2-planilha.py`: ranking e planilha;
  - `r3-herois-calib2.py` e `r3-herois-calib3.py`: calibração dos heróis;
  - `traitlab.cjs`, bosslab (`r3-bosslab-*`), carreiras (`r3-car-run.sh`), escada (`r3-escada-*`).
- **Dados das rodadas:** `balance/out/` (por exemplo, `out/lab2_r3/`).
- **Leitura de saves:** formato `grand-journey`, schema 2. `profile.runs[]` traz `encounters[]` (com `rounds`, `units`, `enemyScaleSources`), `choices[]`, `actHistory` e `treeXp`.

---

## 10. O que ficou fora do jogo base (para o endgame e a economia)
- **Economia permanente:** preço de cartas, relíquias, boosters e decks em diamante; diamantes por marco; XP excedente; login diário. Os diamantes recebidos por run estão registrados em `checkpoint_CP4/PENDENCIAS_CP4.md`.
- **Desafios e Vantagens:** medição final isolada e escada de combinações (23 a 60 nós).
- **Secret Boss e Desafio Final:** não implementados.
- **Raids e Titãs:** mecânicas internas não revisadas.
- **Imperador Orc no mapa 1:** observar.
- **Ranger:** decidir se a armadilha planejada entra; com a mudança ele ganha pouco.

---

## 11. Pendências de implementação no ChatGPT (status em 22/11)

| Item | Situação |
|---|---|
| Review R3 de progressão (trava de mapas, marcos, boosters, loja, ordens) | implementado na v57 e validado no playtest |
| Bug do Reforços Inimigos | corrigido na v57 |
| Bosses dos mapas 2 e 3 (1,10 / 1,35) | implementado e confirmado no save de 20/11 |
| **Raridade de relíquia por mapa nos nós de relíquia e eventos** | **bug: na v57 valia só na loja.** Correção pedida junto com o prompt dos bosses; confirmar |
| **Nível das cartas em `recruitOffer` no save** | pedido; confirmar |
| **Review R3 de cartas (24 raridades e 17 heróis)** | pacote `GJ-R3-Review-Cartas.zip` enviado; confirmar a implementação |

---

## 12. Índice de documentos
| Tema | Arquivo |
|---|---|
| Checkpoints | `checkpoint_CP1/` a `checkpoint_CP4/` (checkpoint, tabela de alterações, integração, pendências, validação) |
| Rodada 3: continuidade e decisões | `rodada3/CONTINUIDADE_R3.md`, `rodada3/DECISOES_R3.md`, `rodada3/RESUMO_ETAPAS_2-5.md` |
| Relíquias | `rodada3/reliquias/`, `rodada3/relatorios/R3_reliquias_*.pdf` |
| Bosses | `rodada3/RELATORIO_R3_03_bosses.md`, `rodada3/PROMPT_CHATGPT_BOSSES_R3.md` |
| Review R3 de progressão | `review_R3_progressao/` (documento principal e anexos A a D) |
| Review R3 de cartas | `review_R3_cartas/` |
| Ranking, raridades e heróis | `rodada3/relatorios/R3_ranking_personagens_lab2.xlsx`, `R3_proposta_raridades.md`, `R3_raridades_final.md`, `R3_herois_nova_versao.md` |
| Análise de todas as campanhas (para endgame e economia) | `rodada3/relatorios/R3_playtests_campanhas.md` e `.xlsx` |
| Playtests | `rodada3/relatorios/R3_playtests_CP4_runs1-11.md`, `R3_carreira_v57_runs1-9.md`; saves em `playtests/carreira_v57_R3/` e `playtests/carreira_v58/` |
| Desafios e Vantagens | `rodada3/relatorios/R3_desafios_vantagens.pdf`, `BRIEFING_CHATGPT_DESAFIOS_VANTAGENS.md` |
