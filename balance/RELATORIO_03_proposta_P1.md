# Proposta P1 — Personagens, área, suportes e traits (para aprovação)

Nada foi aplicado ao jogo. Todos os números de "depois" foram **medidos** no laboratório com o combate real. Para isso, usei um arquivo de proposta aplicado só durante a simulação (`balance/out/proposal_p1_units.json`) e uma cópia experimental dos traits (`balance/work/traits_p1/`).

## 1. Regra-guia: curva de força por custo e raridade

Sua regra: carta mais cara e mais rara = mais forte. Transformei isso em uma meta numérica para o índice do laboratório (1,00 = ajuda igual a um lutador comum de custo 2):

**Alvo = 1,00 + 0,04 por ponto de custo acima de 2 + 0,02 por nível de raridade**

| | Comum | Incomum | Rara | Ultra rara |
|---|---|---|---|---|
| Custo 2 | 1,00 | 1,02 | 1,04 | 1,06 |
| Custo 3 | 1,04 | 1,06 | 1,08 | 1,10 |
| Custo 4 | 1,08 | 1,10 | 1,12 | 1,14 |

- Tolerância: ±0,03. Dentro disso não mexi.
- Custo pesa o dobro da raridade, porque energia limita a run inteira e a raridade só limita a frequência com que a carta aparece.
- **Hoje a raridade não tem relação nenhuma com a força.** Várias Ultra raras (Harpista, Rei Goblin, Sage) estão entre as mais fracas.
- Situação atual: 40 personagens abaixo do alvo, 28 dentro, 9 acima.

**Decisão sua:** aprovar essa curva, ou pedir uma mais "inclinada" (cartas caras bem mais fortes) ou mais "plana".

## 2. Ataques em área

Testei contra um "enxame" de 6 inimigos corpo a corpo, situação em que a área deveria brilhar.

- Unidades com área **pequena** no ataque básico (Lancer, Miner, Mage, Kinoichi, Martial Artist, Goblin Bombardeiro) ficam normais: índice entre 0,97 e 1,07.
- O problema são três unidades com **área grande + controle**:

| Unidade | Índice normal | Índice contra enxame | Por quê |
|---|---|---|---|
| Cannoneer | 1,30 | **1,56** | básico com área 65 + especial de raio 95 que empurra |
| Pirate Admiral | 1,12 | **1,31** | especial em área que atordoa |
| Troll | 1,09 | **1,23** | especial em área que imobiliza |

- Admiral e Troll ficam dentro da curva no teste normal (custo 4, Ultra rara/Rara). Proponho só o Cannoneer agora e observar os outros dois nos testes de deck.

## 3. Ajustes de personagens (33) — medidos

Como ler:
- **Negrito** = muda.
- "Poder de habilidade ×" = força da habilidade especial. Hoje não existe um campo para isso por personagem. Implementar exige **uma pequena mudança de código**: um campo opcional por personagem, padrão 1. Isso é uma proposta técnica separada. Os demais ajustes são só números.
- Índices "Upgrade máx." e "Fundido" mostram que a melhora continua proporcional quando a carta evolui.

Resultado: **32 de 33 dentro do alvo**. O Archer só muda de raridade e ficou em 1,07 contra alvo 1,02. Se continuar forte nos decks, proponho −10% de vida e ataque.

| Personagem | Custo | Raridade | Vida | Ataque | Poder de habilidade | Outros | Índice antes → depois (alvo) | Upgrade máx. depois | Fundido depois |
|---|---|---|---|---|---|---|---|---|---|
| Cannoneer (`cannoneer`) | 4 | **Comum → Rara** | **290 → 247** | **45 → 38** | **×0.85** | área do básico 65 → 50 | 1.30 → 1.13 (1.12) | 1.61 → 1.38 | 1.79 → 1.54 |
| Fighter (`fighter`) | 2 | Comum | **290 → 232** | **27 → 22** | - | - | 1.07 → 0.99 (1.00) | 1.20 → 1.07 | 1.30 → 1.18 |
| Cowboy (`cowboy`) | **2 → 3** | Comum | **230 → 184** | **27 → 22** | - | - | 1.11 → 1.05 (1.04) | 1.28 → 1.18 | 1.46 → 1.30 |
| Shackled Pirate (`shackled_pirate`) | 2 | Comum | **290 → 247** | **35 → 30** | - | - | 1.07 → 0.98 (1.00) | 1.18 → 1.13 | 1.42 → 1.32 |
| Arqueiro Alto Elfo (`elf_archer`) | 2 | Comum | **180 → 144** | **27 → 22** | - | - | 1.05 → 1.03 (1.00) | 1.17 → 1.12 | 1.26 → 1.17 |
| Archer (`archer`) | 2 | **Comum → Incomum** | 180 | 20 | - | - | 1.05 → 1.07 (1.02) | 1.15 → 1.16 | 1.29 → 1.30 |
| Bear Druid (`bear_druid`) | **4 → 3** | Rara | **360 → 432** | **35 → 42** | - | - | 1.04 → 1.09 (1.08) | 1.14 → 1.23 | 1.27 → 1.37 |
| Samurai (`samurai`) | 3 | Incomum | **290 → 348** | **35 → 42** | - | - | 1.02 → 1.06 (1.06) | 1.13 → 1.19 | 1.26 → 1.33 |
| OmnaMusha (`omnamusha`) | 3 | Incomum | **230 → 253** | **27 → 30** | - | - | 1.02 → 1.06 (1.06) | 1.10 → 1.14 | 1.27 → 1.33 |
| Gladiador (`gladiator`) | 3 | **Incomum → Comum** | **290 → 363** | **27 → 34** | - | - | 0.99 → 1.04 (1.04) | 1.13 → 1.22 | 1.26 → 1.42 |
| Mage (`mage`) | **4 → 3** | Comum | **180 → 216** | **27 → 32** | **×1.2** | - | 0.99 → 1.06 (1.04) | 1.09 → 1.17 | 1.19 → 1.29 |
| Cavaleiro Centauro (`centaur_lancer`) | **4 → 3** | Rara | **360 → 414** | **35 → 40** | - | - | 1.03 → 1.09 (1.08) | 1.17 → 1.23 | 1.31 → 1.40 |
| Troll da Montanha (`mountain_troll`) | 4 | Rara | **360 → 414** | **45 → 52** | - | - | 1.07 → 1.13 (1.12) | 1.19 → 1.27 | 1.38 → 1.45 |
| Shaolin (`shaolin`) | 3 | **Ultra rara → Incomum** | **290 → 406** | **20 → 28** | - | - | 1.01 → 1.09 (1.06) | 1.07 → 1.20 | 1.17 → 1.35 |
| Shieldmaiden (`shieldmaiden`) | 3 | Incomum | **290 → 348** | **20 → 24** | - | - | 1.01 → 1.07 (1.06) | 1.10 → 1.17 | 1.24 → 1.33 |
| Pirate Captain (`pirate_captain`) | **4 → 3** | Rara | **290 → 363** | **27 → 34** | - | - | 1.03 → 1.09 (1.08) | 1.15 → 1.23 | 1.25 → 1.37 |
| Predador Elfo da Floresta (`woodland_predator`) | 3 | **Rara → Incomum** | **230 → 288** | **27 → 34** | - | - | 1.01 → 1.08 (1.06) | 1.10 → 1.21 | 1.22 → 1.34 |
| Goblin Bombardeiro (`goblin_bomber`) | 3 | Rara | **180 → 225** | **35 → 44** | - | - | 1.02 → 1.11 (1.08) | 1.12 → 1.22 | 1.23 → 1.36 |
| Guardião Elfo Negro (`blackfang_guardian`) | **4 → 3** | Rara | **360 → 450** | **27 → 34** | - | - | 1.02 → 1.07 (1.08) | 1.16 → 1.25 | 1.36 → 1.51 |
| Cavalier (`cavalier`) | 4 | Rara | **360 → 432** | **35 → 42** | - | - | 1.06 → 1.10 (1.12) | 1.21 → 1.28 | 1.38 → 1.50 |
| Guerreiro Alto Elfo (`elf_guardian`) | 3 | Incomum | **360 → 432** | **20 → 24** | - | - | 1.00 → 1.06 (1.06) | 1.08 → 1.16 | 1.18 → 1.27 |
| Kinoichi (`kinoichi`) | **3 → 2** | Incomum | **180 → 243** | **27 → 36** | **×1.35** | - | 0.96 → 1.04 (1.02) | 1.05 → 1.16 | 1.13 → 1.30 |
| Orc Guerreiro (`orc_warrior`) | 3 | Comum | **290 → 363** | **27 → 34** | - | - | 0.98 → 1.06 (1.04) | 1.07 → 1.15 | 1.18 → 1.30 |
| Duelist (`duelist`) | 3 | Rara | **230 → 288** | **27 → 34** | - | - | 1.01 → 1.06 (1.08) | 1.14 → 1.19 | 1.21 → 1.30 |
| Goblin Montador (`goblin_rider`) | 3 | Incomum | **290 → 363** | **27 → 34** | - | - | 0.99 → 1.05 (1.06) | 1.06 → 1.13 | 1.23 → 1.35 |
| Ronin (`ronin`) | 3 | **Rara → Incomum** | **230 → 299** | **45 → 59** | - | - | 0.99 → 1.04 (1.06) | 1.08 → 1.17 | 1.18 → 1.32 |
| Nobre Elfo Sombrio (`dark_elf_noble`) | 3 | Rara | **230 → 288** | **35 → 44** | - | - | 1.01 → 1.08 (1.08) | 1.17 → 1.24 | 1.25 → 1.42 |
| Gatuno Meowri (`feline_rogue`) | 3 | Incomum | **180 → 216** | **35 → 42** | - | - | 0.98 → 1.06 (1.06) | 1.08 → 1.17 | 1.24 → 1.34 |
| Shinobi (`shinobi`) | 3 | **Rara → Incomum** | **180 → 225** | **35 → 44** | - | - | 0.98 → 1.05 (1.06) | 1.08 → 1.15 | 1.22 → 1.33 |
| Orc Lutadora (`orc_fighter`) | **3 → 2** | Incomum | **230 → 299** | **27 → 35** | - | - | 0.94 → 1.01 (1.02) | 1.06 → 1.16 | 1.13 → 1.31 |
| Mago Elfo Sombrio (`dark_elf_mage`) | **4 → 3** | Rara | **180 → 288** | **27 → 43** | **×1.6** | - | 0.98 → 1.08 (1.08) | 1.05 → 1.20 | 1.11 → 1.37 |
| Eagle Druid (`eagle_druid`) | **3 → 2** | Rara | **180 → 306** | **27 → 46** | **×1.7** | - | 0.94 → 1.05 (1.04) | 0.96 → 1.13 | 1.06 → 1.31 |
| Sorceress (`sorceress`) | **4 → 3** | Rara | **180 → 261** | **20 → 29** | **×1.45** | - | 0.97 → 1.06 (1.08) | 1.08 → 1.21 | 1.17 → 1.36 |

Observações:
- **Mudanças de custo** (Cowboy 2→3; Sorceress, Mage, Dark Elf Mage, Pirate Captain, Bear Druid, Centaur Lancer, Blackfang Guardian 4→3; Eagle Druid, Kinoichi, Orc Lutadora 3→2) mexem na curva de energia dos decks atuais. Vou medir isso na etapa dos decks.
- **Mudanças de raridade** alteram a frequência em lojas e recrutamento, e também os boosters da coleção, que usam diamantes. Por isso entram como decisões suas, separadas.
- Os inimigos usam os mesmos personagens. Fortalecer cartas fracas também fortalece inimigos. A dificuldade geral será recalibrada na etapa das runs.
- Eagle Druid (precisa de +70% mesmo custando 2), Dark Elf Mage (+60%), Sorceress (+45%) e Shaolin (+40%) mostram habilidades fracas, não só números baixos. São candidatos a revisão de habilidade no futuro, se você quiser. Os números acima funcionam como solução provisória.

## 4. Suportes e curandeiros — precisam de mudança de mecânica

O que medi:
- Uma luta dura cerca de 13 s. Os suportes só agem pela primeira vez aos 7–9 s.
- Curandeiros curam só **10 a 40 de vida por luta**. Um Cowboy causa 380 de dano, e o time tem cerca de 1.300 de vida.
- Do fundo do campo, o raio da cura (85–110) mal alcança a linha da frente (130 de distância).
- Testes feitos:

| Teste | Resultado |
|---|---|
| Cura ×1,5 | nenhum efeito |
| Agir aos 4 s | +0,00 a +0,06 |
| Cura ×4 + agir aos 4 s + no meio do campo | Priestess 1,08 e Shaman 1,12; Harpista, Fada e Sage seguem em 1,00 |
| Agir no início da rodada (ou aos 5 s) + força ×1,5–2 | Rei Goblin 1,05, Feiticeiro Meowri 1,04; o resto entre 0,96 e 1,03 (alvo 1,06 a 1,14) |

Conclusão: **com o ritmo atual das lutas, curar quase não muda o resultado.** Para um suporte ser forte e justificar ser caro e raro, como você descreveu, ele precisa agir de outra forma. Opções de design, que eu protótipo e meço se você aprovar:

- **S-A — Ação imediata.** Suportes de bônus e escudo (Barda, Rei Goblin, Percussionista, Sage, Feiticeiro Meowri, Shaman) agem no início da rodada, com valores maiores.
- **S-B — Aura contínua.** Enquanto o suporte estiver vivo, aliados próximos ganham um efeito permanente (ex.: Barda +10% ATQ; Priestess regenera 1,5% de vida/s). O suporte vira um alvo importante para o inimigo.
- **S-C — Escudo de abertura.** Curandeiros dão escudo aos aliados da linha da frente no início da rodada e repetem a cada 8 s, em vez de curar depois que o dano já aconteceu.
- **S-D — Barato e útil.** Manter a mecânica e baixar custo e raridade até a força atual.

Recomendação: **S-C para curandeiros e S-A para os de bônus**. Custo e raridade seguem a curva depois de medidos. Tudo com limites para evitar ciclos de invencibilidade, o teto de 65% de redução continua valendo.

## 5. Traits

### 5.1 Ajustes numéricos (P1) — medidos

| Trait | Mudança | Ganho com 2 membros: antes → depois | Ganho com 4: antes → depois |
|---|---|---|---|
| Meowri | imunidade após salvar 0,75/1,5 s → **0,25/0,5 s** | +5,1% → +2,2% | **+23,7% → +10,0%** |
| Troll | golpe forte a cada 6º/5º básico → **4º/3º** | +1,5% → +2,9% | +1,6% → +6,1% |
| High Elf | escudo 10/15% → **15/22%** | +0,8% → +1,5% | +3,9% → +5,8% |
| Dark Elf | ignora defesa 15/25% → **30/45%** | +0,6% → +1,4% | +1,4% → +3,3% |
| Orc | redução de defesa por acúmulo 4/6% → **6/9%** | +0,5% → −0,1% | +1,5% → +3,1% |
| Arcane | bônus no próximo especial 15/25% → **40/60%** | +0,2% → +0,2% | +0,8% → +4,0% |
| Devastator (2 membros) | ATQ +10% → **+15%** | +2,2% → +3,3% | sem mudança |
| Sentinel (2 membros) | DEF +40% → **+60%** | +2,6% → +4,5% | sem mudança |
| Unyielding (2 membros) | Vida +15% → **+20%** | +1,6% → +4,1% | sem mudança |
| Predator (2 membros) | crítico +20 → **+25** pontos | +2,6% → +3,2% | sem mudança |
| Lookout (2 membros) | alcance +10% → **+15%** | +1,2% → +2,6% | sem mudança |

Ruído: cerca de ±1 ponto percentual.

### 5.2 Traits que números não resolvem (mudança de mecânica, aprovação separada)

Mesmo com números bem maiores, estes continuam com ganho abaixo de 3%:

| Trait | Problema | Proposta de mecânica |
|---|---|---|
| Legends of the East (+1,6%) | ignorar defesa rende pouco, porque as defesas são baixas | Cada 4º básico causa **+35%/+60% de dano** e ignora 25%/40% da defesa |
| Fearless (+2,4%) | só age com vida baixa, e aí a unidade já está morrendo | **+8%/+15% de dano sempre**, que dobra abaixo de 40% de vida |
| Patient (+2,2%) | a defesa só chega aos 10 s, e a luta acaba aos 13 s. Testei 5 s: ainda fraco | A cada 3 s de luta: **+8%/+15% DEF e +4%/+8% ATQ**, acumula até 3 vezes |
| Trailblazer (−0,5%) | correr mais faz a unidade chegar sozinha e morrer antes | **Primeiro golpe após se deslocar causa +30%/+50%** (no máximo a cada 4 s) |
| Goblin (+1,5%) | redução de dano por proximidade é pequena | **+4%/+7% de ATQ por Goblin diferente vivo** |
| Protector (+1,9%) | a provocação raramente acontece | **Aliados a até 90 recebem 5%/10% menos dano** (não acumula entre protetores) |
| Arcane (alternativa) | o bônus só vale para um especial | **Especiais de membros têm +15%/+30% de poder** (como o Tomo, mas só para o grupo) |

Wild West, Seasalt, Verdant, Forest Elf, Dawnward, Frostborn, Centaur, Demolisher, Impulsive, Ruthless e Audacious ficaram razoáveis e não mexi.

## 6. O que você precisa aprovar

1. A curva de força (seção 1).
2. A tabela dos 33 personagens (seção 3), item por item se preferir. Inclui o campo técnico "poder de habilidade".
3. As mudanças de custo e de raridade, separadamente.
4. A direção para os suportes (S-A, S-B, S-C ou S-D), para eu prototipar e medir.
5. Os ajustes numéricos de traits (5.1).
6. Quais das mecânicas novas de traits (5.2) devo prototipar e medir.

## Reprodução

```sh
node balance/sim/tune.cjs --plan balance/out/tune1/plan1.json --out res.jsonl          # busca do multiplicador
node balance/sim/build-proposal.cjs balance/out/tune1/all.jsonl > proposal.json        # montagem P1
GJ_OV_TESTED_ONLY=1 GJ_OVERRIDES=balance/out/proposal_p1_units.json node balance/sim/lab.cjs --levels 0,2,F --units cannoneer
node balance/sim/swarm.cjs cannoneer,pirate_admiral,troll                               # teste de área
node balance/sim/apply-traits-p1.cjs <copia>/dist/traits-v54.js                         # traits P1
GJ_ROOT=balance/work/traits_p1 node balance/sim/traitlab.cjs --mode trait --only Meowri --combos 2
```
