# Tabela de alterações do checkpoint GJ-v50-BAL-CP3

Uma alteração por linha, sempre comparada à **publicação 50** (commit `aed07ed`). Total: **51** alterações.

| nº | Área | Arquivo | Item | Antes (v50) | Depois (CP3) | Motivo / resultado |
|---:|---|---|---|---|---|---|
| 1 | Árvore/XP | `dist/tree-engine.js` | Modelo de XP | XP banca no perfil ao abrir a árvore pós-boss; nível = XP/10 (máx. 50); pontos = nível × 10; saldo não gasto fica para sempre | XP da run é gasto 1 XP = 1 ponto nas janelas da árvore; a sobra passa para a próxima janela da mesma run e é perdida no fim da run (vitória, derrota ou abandono); sem banco permanente | Regra obrigatória do Carlos (Foco 1) |
| 2 | Árvore/XP | `dist/tree-engine.js` | Janela da árvore no mapa | só depois do boss | abre sozinha depois da 6ª luta de cada mapa (camada 9 no mapa 1, 8 nos mapas 2 e 3), uma vez por mapa, além da janela pós-boss; nó comprado vale na hora | Gargalo do mapa 1 (Foco 3, opção B2) |
| 3 | Árvore/XP | `dist/tree-engine.js` | XP por encontro | luta 2/2/1 e boss 4/4/6 (mapas 1/2/3) | peso × mapa: luta 1, elite/ordem/Titans 2, boss 4, True Boss 6, Secret Boss 8; × 1/2/3 (luta 1/2/3, elite 2/4/6, boss 4/8/12, True Boss 18, Secret Boss 24) | XP crescente; jogar até o fim sempre rende mais por encontro que abandonar |
| 4 | Árvore/XP | `dist/tree-engine.js` | Nível exibido | XP total/10, máximo 50 | número de nós comprados (0 a 60) | Árvore completa alcançável (Foco 2) |
| 5 | Árvore/XP | `dist/tree-engine.js` | Reset (redistribuir) | devolvia todos os pontos do nível, inclusive nunca investidos | fora da run, devolve só o custo dos nós comprados para um orçamento de redistribuição; a sobra é perdida ao começar a run | Regra obrigatória do Carlos |
| 6 | Árvore/XP | `dist/tree-engine.js` | XP → diamante | 1 diamante a cada 20 XP acima do nível 50 | 1 diamante a cada 20 XP só com a árvore completa (60 nós) | Decisão do Carlos |
| 7 | Árvore/XP | `dist/tree-engine.js` | Save do perfil da árvore | versão 1 com totalXp | versão 2: nós comprados mantidos, sem reconstruir saldo pelo histórico; histórico (ganho/gasto/perdido) só estatística | Saves antigos ignorados (só playtest do Carlos) |
| 8 | Árvore/XP | `dist/tree-data.js` | Custo do 2º anel (16 nós) | 10 | 8 (pow_atk_2, pow_atk_3, pow_atk_5, pow_crit_2, vit_hp_2, vit_hp_3, vit_hp_4, def_armor_2, def_armor_3, def_armor_4, agi_rate_2, agi_rate_3, agi_rate_4, exp_gold_2, exp_shop_1, exp_shop_2); árvore completa 1.151 → 1.119 | A janela do mapa 1 (8 a 10 XP) passa a comprar 1 nó por mais runs |
| 9 | Bosses | `dist/boss-engine.js` | Tabela de ajuste (só inimigo) | — | JOURNEY_BOSS_TUNE: multiplicador por mapa, por boss e da forma 2 do True Boss; não afeta as 17 cartas de boss do jogador | Bosses com dificuldade próxima; mapa 1 < 2 < 3 |
| 10 | Bosses | `dist/boss-engine.js` | Força dos bosses por mapa | ×1 / ×1 / ×1 | ×1,037 / ×0,965 / ×1,198 (vida e ataque do líder) | Mapa 3 mais forte que o mapa 2 para o mesmo jogador |
| 11 | Bosses | `dist/boss-engine.js` | Marechal (Ironbound) | vida ×1, ataque ×1 | vida ×0,975, ataque ×0,975 | Cada boss a ±5 pontos da média do mapa (laboratório pareado) |
| 12 | Bosses | `dist/boss-engine.js` | Xogum (Ironbound) | vida ×1, ataque ×1 | vida ×1,14, ataque ×1,14 | Cada boss a ±5 pontos da média do mapa (laboratório pareado) |
| 13 | Bosses | `dist/boss-engine.js` | Jarl Rúnico (Ironbound) | vida ×1, ataque ×1 | vida ×0,957, ataque ×0,957 | Cada boss a ±5 pontos da média do mapa (laboratório pareado) |
| 14 | Bosses | `dist/boss-engine.js` | Pistoleiro (Ironbound) | vida ×1, ataque ×1 | vida ×1,326, ataque ×1,326 | Cada boss a ±5 pontos da média do mapa (laboratório pareado) |
| 15 | Bosses | `dist/boss-engine.js` | Rainha Pirata (Ironbound) | vida ×1, ataque ×1 | vida ×1,068, ataque ×1,068 | Cada boss a ±5 pontos da média do mapa (laboratório pareado) |
| 16 | Bosses | `dist/boss-engine.js` | Oráculo (Ironbound) | vida ×1, ataque ×1 | vida ×0,928, ataque ×0,928 | Cada boss a ±5 pontos da média do mapa (laboratório pareado) |
| 17 | Bosses | `dist/boss-engine.js` | Senhor dos Cervos (Ironbound) | vida ×1, ataque ×1 | vida ×0,796, ataque ×0,796 | Cada boss a ±5 pontos da média do mapa (laboratório pareado) |
| 18 | Bosses | `dist/boss-engine.js` | Rei Goblin (Blackfang) | vida ×1, ataque ×1 | vida ×1,899, ataque ×1,899 | Cada boss a ±5 pontos da média do mapa (laboratório pareado) |
| 19 | Bosses | `dist/boss-engine.js` | Rei Troll (Blackfang) | vida ×1, ataque ×1 | vida ×1,182, ataque ×1,182 | Cada boss a ±5 pontos da média do mapa (laboratório pareado) |
| 20 | Bosses | `dist/boss-engine.js` | Imperador Orc (Blackfang) | vida ×1, ataque ×1 | vida ×0,587, ataque ×0,587 | Cada boss a ±5 pontos da média do mapa (laboratório pareado) |
| 21 | Bosses | `dist/boss-engine.js` | Rainha Meowri (Dawncrest) | vida ×1, ataque ×1 | vida ×1,211, ataque ×1,211 | Cada boss a ±5 pontos da média do mapa (laboratório pareado) |
| 22 | Bosses | `dist/boss-engine.js` | Líder Centauro (Dawncrest) | vida ×1, ataque ×1 | vida ×0,991, ataque ×0,991 | Cada boss a ±5 pontos da média do mapa (laboratório pareado) |
| 23 | Bosses | `dist/boss-engine.js` | Rei High Elf (Dawncrest) | vida ×1, ataque ×1 | vida ×0,898, ataque ×0,898 | Cada boss a ±5 pontos da média do mapa (laboratório pareado) |
| 24 | Bosses | `dist/boss-engine.js` | Rei Forest Elf (Dawncrest) | vida ×1, ataque ×1 | vida ×1,87, ataque ×1,87 | Cada boss a ±5 pontos da média do mapa (laboratório pareado) |
| 25 | Bosses | `dist/boss-engine.js` | Andarilho (True Boss Ironbound) | forma 1 ×1; forma 2 vida ×1, dano ×1 | forma 1 vida/ataque ×1,409; forma 2 vida ×1,409, dano ×1,409 (estrutura mantida: 2 vitórias + forma 2, limite de 5 derrotas) | True Boss ~10 pontos mais difícil que o boss comum do mapa 3 |
| 26 | Bosses | `dist/boss-engine.js` | Rei Dark Elf (True Boss Blackfang) | forma 1 ×1; forma 2 vida ×1, dano ×1 | forma 1 vida/ataque ×1,208; forma 2 vida ×1,208, dano ×1,208 (estrutura mantida: 2 vitórias + forma 2, limite de 5 derrotas) | True Boss ~10 pontos mais difícil que o boss comum do mapa 3 |
| 27 | Bosses | `dist/boss-engine.js` | Rainha Fada (True Boss Dawncrest) | forma 1 ×1; forma 2 vida ×1, dano ×1 | forma 1 vida/ataque ×1,039; forma 2 vida ×1,039, dano ×1,039 (estrutura mantida: 2 vitórias + forma 2, limite de 5 derrotas) | True Boss ~10 pontos mais difícil que o boss comum do mapa 3 |
| 28 | Auras | `dist/supports-b.js` | Cura zero | todos os 10 suportes curavam | só Priestess, Flower Fairy, Elf Harpist e Shaman curam; nos outros 6 a cura é 0: sem pulso, número, gatilho "ao curar" nem texto de cura | Identidade (Foco 4) |
| 29 | Auras | `dist/supports-b.js` | Sage | +48% habilidade, −26% dano recebido, cura 9,5% a cada 3 s | −45% dano recebido (sem cura) | Decisão do Carlos; força no laboratório igual à de hoje |
| 30 | Auras | `dist/supports-b.js` | Bard | +26% dano, +22% habilidade, cura 2,2% | +34% dano | Um buff; força restaurada |
| 31 | Auras | `dist/supports-b.js` | Snow Troll | −28% dano recebido, cura 7% | −42% dano recebido | Um buff; força restaurada |
| 32 | Auras | `dist/supports-b.js` | Feline Arcanist | +29% vel. ataque, cura 4,8% | +35% vel. ataque | Um buff; força restaurada |
| 33 | Auras | `dist/supports-b.js` | Feline Drummer | +34% vel. ataque, +46% movimento, cura 3,4% | +46% vel. ataque | Um buff; força restaurada |
| 34 | Auras | `dist/supports-b.js` | Goblin King | +32% dano, +27% vel. ataque, cura 4% | +32% dano, +27% vel. ataque (sem cura) | Boss pode ter mais de um buff |
| 35 | Decks | `dist/decks-p3.js` | Lâminas do Oriente | 3 Shinobi, 2 Ronin, 3 Fighter, 3 Martial Artist | −1 Shinobi, −1 Ronin, +1 Fighter, +1 Martial Artist | 1ª vitória run 10 → 20 |
| 36 | Decks | `dist/decks-p3.js` | Vanguarda da Aurora | 2 Swordsman, 3 Lancer | −1 Swordsman, +1 Lancer | run 11 → 20 |
| 37 | Decks | `dist/decks-p3.js` | Lei do Gatilho | 3 Cowboy, 3 Fighter, 2 Miner, 2 Sheriff | −1 Cowboy, −1 Fighter, +1 Miner, +1 Sheriff | run 23 → 20 |
| 38 | Decks | `dist/decks-p3.js` | Executores | 3 Cowboy, 2 Musketeer | −1 Cowboy, +1 Musketeer | run 25 → 22 |
| 39 | Decks | `dist/decks-p3.js` | Círculo Verdejante | 3 Bear Druid, 2 Lancer | −1 Bear Druid, +1 Lancer | run 10 → 14 |
| 40 | Decks | `dist/decks-p3.js` | Círculo Arcano | 3 Bastion, 3 Warrior, 3 Mage, 3 Sorceress, 2 Sage, 0 Lancer | −1 Sorceress, −1 Mage, −1 Sage, +1 Warrior, +1 Bastion, +1 Lancer | run 9 → 19 (com o Sage novo) |
| 41 | Desafios | `dist/challenges.js` | Fúria das Raids | raids +30% vida, +10% dano | raids +15% vida, +5% dano (texto PT/EN atualizado) | Efeito −15 → −9,5 pontos (meta −5 a −10) |
| 42 | Desafios | `dist/challenges.js` | Recursos Escassos | −1 energia nas 2 primeiras rodadas contra bosses | −1 energia na 1ª rodada contra bosses (texto PT/EN atualizado) | Efeito −15 → −8 pontos |
| 43 | Vantagens | `dist/advantages.js` | Treino Prévio | 1 carta com upgrade 2 e 1 com upgrade 1 | 2 cartas com upgrade 1 (texto PT/EN atualizado) | Efeito +13 → +9 pontos (exceção até +9) |
| 44 | Testes | `tests/xp-r3.cjs` | Novo | — | regras do modelo R3 (tabela de XP, 6 janelas, sobra na run, perda no fim, derrota mantém nós, respec, fechamento único, anti-farm, diamante só com árvore completa) | Aceitação do Foco 1-3 |
| 45 | Testes | `tests/auras-r3.cjs` | Novo | — | curadores curam pela SPEC; 6 auras sem cura não geram cura nem texto; 1 buff cada (Goblin King 2) | Aceitação do Foco 4 |
| 46 | Testes | `tests/challenges-p5.cjs` | Só expectativas | regras/valores da v50 | regras/valores do CP3 | Modelo R3, auras, desafios, vantagens e bosses |
| 47 | Testes | `tests/advantages-p5.cjs` | Só expectativas | regras/valores da v50 | regras/valores do CP3 | Modelo R3, auras, desafios, vantagens e bosses |
| 48 | Testes | `tests/tree-v51.cjs` | Só expectativas | regras/valores da v50 | regras/valores do CP3 | Modelo R3, auras, desafios, vantagens e bosses |
| 49 | Testes | `tests/fixes-v52.cjs` | Só expectativas | regras/valores da v50 | regras/valores do CP3 | Modelo R3, auras, desafios, vantagens e bosses |
| 50 | Testes | `tests/balance-p2.cjs` | Só expectativas | regras/valores da v50 | regras/valores do CP3 | Modelo R3, auras, desafios, vantagens e bosses |
| 51 | Testes | `tests/bosses-v50.cjs` | Só expectativas | regras/valores da v50 | regras/valores do CP3 | Modelo R3, auras, desafios, vantagens e bosses |
