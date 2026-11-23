# Endgame (Desafios da Jornada): pacote de integração para o ChatGPT

**Versão:** 23/11/2026. **Base:** v65 (pacote leve, commit `b0e45f18`).
**Aprovação:** todos os valores foram decididos e aprovados por Carlos.
**Referência de implementação:** cópia de teste `game_v65_teste/`. As diferenças em relação à v65 estão em `endgame_vs_v65.patch` e na pasta `arquivos_alterados/`.

A implementação de referência foi escrita para medir no simulador, não para ser publicada. Ela funciona e está testada, mas os ganchos podem ser reescritos no estilo do projeto. **O que vale é o comportamento descrito aqui.**

---

## 1. Regras gerais

### 1.1 Escala de força inimiga
- **+1% de vida, ataque e defesa dos inimigos por desafio ativo** na run (nível 18 = +18%).
- Vale para **todo combate** (comum, elite, ordem, raid e Titã) e **todo boss** (boss de mapa e as duas formas do True Boss).
- **Conta:** a quantidade de desafios ativos na run.
- **Pontos de entrada no código:**
  - `JourneyChallenges.enemyStats` (fora das raids);
  - o fator de escala da raid (`JourneyRaid.initialize`), em vida, dano e lacaios. É ele que cobre as raids, os Titãs e a 2ª forma do True Boss. **Nas raids, a defesa não muda** (confirmado em 23/11).
- **Telemetria do save:** fontes `challenge:globalScale` e `challenge:fortified` (já incluídas em `playtest-save.js`).

### 1.2 Catálogo e blocos de desafios
- **18 desafios ativos**, em **6 blocos de 3**. O nível máximo é 18.
- **Os blocos acumulam.** O nível N tem N desafios:
  - todos os desafios dos blocos anteriores ficam ligados;
  - o jogador escolhe livremente os do bloco atual.
- **Abertura do bloco seguinte:** vencer o nível que fecha o bloco atual (3, 6, 9, 12 e 15) libera o nível seguinte, que já pertence ao bloco seguinte.
- **Remoção:** não é possível tirar um desafio de um bloco anterior enquanto houver desafio do bloco seguinte ligado.
- **Insígnia:** 1 por nível vencido pela 1ª vez. Isso não mudou.
- **Reserva:** 5 desafios saem do catálogo, mas o código fica (`reserve: true`): Tropas Resistentes, Ataques Implacáveis, Fúria das Raids, Recursos Escassos e Relíquias Escassas.

| Bloco | Níveis | Desafios |
|---|---|---|
| 1 | 1–3 | Reforços Inimigos, Inimigos Fortalecidos, Mais Elites no Mapa |
| 2 | 4–6 | Comandantes Preparados, Fadiga da Jornada, Relíquias Amaldiçoadas |
| 3 | 7–9 | Menos Apoio no Mapa, Deck Pesado, Loja com Menos Opções |
| 4 | 10–12 | Mercado Inflacionado, Caminho Amaldiçoado, Bosses Implacáveis |
| 5 | 13–15 | Bolsa Leve, Veteranos, Energia Dissipada |
| 6 | 16–18 | Decks Reforçados, Derrota Custa Ouro, Bagagem Limitada |

### 1.3 Blocos de vantagens
- **18 vantagens**, em **6 blocos de 3**. Cada vantagem custa 1 Insígnia, como hoje.
- **Abertura:** o bloco seguinte abre quando o atual está inteiro, ou seja, na 4ª, 7ª, 10ª, 13ª e 16ª Insígnia.
- **Escolha:** livre dentro do bloco aberto.
- **Desativação** (devolve a Insígnia): não pode desativar uma vantagem de bloco anterior enquanto houver vantagem do bloco seguinte ativa.

| Bloco | Vantagens |
|---|---|
| 1 | Experiência de Elite, Caçador de Elites, Emboscada |
| 2 | Limpeza, Olho Treinado, Relíquia de Viagem |
| 3 | Segunda Chance, Preparação Flexível, Mão Planejada |
| 4 | Troféu de Boss, Bolsa Cheia, Juros |
| 5 | Vitória Limpa, Energia Guardada, Fusão Eficiente |
| 6 | Bênção do Caminho, Treino Prévio, Ensaio |

### 1.4 Interface (a fazer)
- **Tela de desafios:**
  - mostrar os blocos;
  - mostrar o cadeado e o requisito de cada bloco fechado ("vença o nível X");
  - **não mostrar o peso** de cada desafio. O jogador não deve saber quanto cada um pesa.
- **Tela de vantagens:** mostrar os blocos, o cadeado e o requisito ("tenha todas as vantagens do bloco anterior").
- **Decks Reforçados:** nas elites e nos bosses afetados, mostrar o nome do deck seguido de "Deck Reforçado". Ao inspecionar o inimigo, mostrar as cartas trocadas.
- **Segunda Chance:** ao ativar, mostrar "Segunda Chance" na tela de resultado da rodada. O motor marca `s.secondChanceNotice = true`.

---

## 2. Desafios (efeito final)

### Desafios novos
| Desafio | Efeito |
|---|---|
| **Inimigos Fortalecidos** | Une Tropas Resistentes e Ataques Implacáveis. Inimigos com **+10% de vida e +8% de dano**, **multiplicados** pela escala (com 1 desafio: +11,1% de vida e +9,08% de ataque). **Não vale nas raids**, como Tropas Resistentes e Ataques Implacáveis |
| **Mais Elites no Mapa** | Em cada mapa, **2 camadas inteiras de batalhas simples** viram elite (todas as pistas da camada). Ordens não contam. Nunca a 1ª batalha do mapa, nunca 2 camadas vizinhas, nunca a camada logo antes do boss. A camada de apoio convertida por Menos Apoio pode virar elite. As elites convertidas dão a recompensa normal de elite |
| **Relíquias Amaldiçoadas** | Cada relíquia obtida tem **⅓ de chance** (texto: 33%) de adicionar uma maldição ao deck, **Fardo ou Correntes** (sorteada). Não contam a relíquia inicial nem a de Relíquia de Viagem. As maldições contam para o Ídolo profano |
| **Fadiga da Jornada** | Unidades do jogador com **−3% de ataque, vida, defesa e velocidade de ataque**. Não mexe na árvore |
| **Decks Reforçados** | **Elites e bosses** trocam as **2 cartas mais fracas** do deck (ranking do laboratório `lab2`, tabela `RANK` em `challenges-endgame.js`) pelas **2 mais fortes da mesma facção** que não estão no deck. Se não houver, entram as da mesma trait. Times com 4 cópias por personagem trocam 1 personagem. Obrigatório quando o desafio está ativo |
| **Menos Apoio no Mapa** | Em cada mapa, **2 camadas de apoio** (loja, upgrade, evento, relíquia ou recrutamento) viram **camadas de batalhas**. O número de camadas não muda. Nunca a camada logo antes do boss |
| **Loja com Menos Opções** | A loja oferece **2 recrutas e 1 relíquia** (hoje: 3 e 2), também depois do refresh |
| **Derrota Custa Ouro** | Cada rodada perdida tira **⅓ do ouro base da vitória** (texto: 33%) daquela luta: 3×1 perde 33%, 3×2 perde 66%, e 3 ou mais derrotas zeram. Vale em qualquer luta. Nas raids e na 2ª forma do True Boss, cada derrota conta como rodada perdida. **Bônus** (Caçador de Elites, Vitória Limpa) **não são afetados** |

### Desafios atuais com valor alterado
| Desafio | Antes (v65) | Agora |
|---|---|---|
| Reforços Inimigos | a partir da 1ª rodada | **a partir da 3ª rodada**, inimigos comuns e elites colocam +1 unidade |
| Bolsa Leve | −27% de ouro por vitória | **−30%** |
| Bagagem Limitada | 5 casas | **4 casas: a fileira de baixo da bolsa** |

### Desafios atuais sem mudança
Comandantes Preparados (+2 relíquias e +2 upgrades em elites, ordens e bosses), Bosses Implacáveis (+7% de vida e de dano), Mercado Inflacionado (+30%), Deck Pesado (+2 cartas básicas genéricas), Caminho Amaldiçoado (2 Exaustão), Energia Dissipada (−1 da energia que sobra a cada rodada) e Veteranos (+8 upgrades nos inimigos comuns).

---

## 3. Vantagens (efeito final)

### Vantagens novas
| Vantagem | Efeito |
|---|---|
| **Troféu de Boss** | Cada **boss de mapa** vencido dá **+3% de vida e ataque** a todas as unidades do jogador até o fim da run (cumulativo) |
| **Vitória Limpa** | Vencer um confronto **sem perder rodada** dá **+8 de ouro**. É bônus: não é afetado por Derrota Custa Ouro |
| **Emboscada** | Na **1ª rodada** de cada confronto (exceto bosses e raids), o inimigo coloca **1 unidade a menos** (mínimo 1). Na referência, isso é feito descontando 1 de `JourneyChallenges.extraUnits` |

### Vantagens revistas
| Vantagem | Antes | Agora |
|---|---|---|
| **Preparação Flexível** | 1 renovação grátis da mão por rodada | **1 por confronto** |
| **Bolsa Cheia** | +20 de ouro inicial | **+40** |
| **Segunda Chance** | 1 vez por run, perder um confronto (exceto boss) repete a última rodada | 1 vez por run, perder **qualquer confronto, inclusive boss, raid, Titã e 2ª forma do True Boss**, dá **mais uma rodada**: o limite de derrotas sobe em 1 (por exemplo, elite em x:3 joga até perder a 4ª). A rodada extra perdida conta para Derrota Custa Ouro. Mostrar "Segunda Chance" na tela |
| **Limpeza** | 1 remoção grátis na 1ª loja de cada mapa | **1 remoção grátis em cada loja** |
| **Olho Treinado** | 1 renovação grátis em toda escolha de relíquia | 1 renovação grátis em toda escolha de relíquia **e em todo nó de recrutamento** (não vale na loja nem na escolha de carta depois das lutas) |

### Vantagens sem mudança
Experiência de Elite, Caçador de Elites, Relíquia de Viagem, Mão Planejada, Juros, Energia Guardada, Fusão Eficiente, Bênção do Caminho, Treino Prévio e Ensaio.

---

## 4. Onde está cada coisa na referência
| Arquivo | Conteúdo |
|---|---|
| `dist/challenges.js` | Catálogo (com `reserve`), novos valores de Reforços, Bolsa Leve e Bagagem, `catalog()`, `maxLevel()`, regra dos blocos (`blocks`, `blockValid`, `blockOf`) em `select` e `toggle` |
| `dist/challenges-endgame.js` (novo) | Escala geral, os 8 desafios novos, `TUNE` com os valores, blocos de desafios |
| `dist/advantages.js` | Textos e valores revistos; Limpeza por loja; Segunda Chance nova (`secondChance`) |
| `dist/advantages-endgame.js` (novo) | Troféu de Boss, Vitória Limpa, Emboscada, Olho Treinado no recrutamento, Segunda Chance nas raids, blocos de vantagens |
| `dist/index.html` | Carrega `challenges-endgame.js` e `advantages-endgame.js` depois de `advantages.js` |
| `dist/playtest-save.js` | Fontes `challenge:fortified` e `challenge:globalScale` na telemetria |
| `tests/challenges-endgame.cjs`, `tests/advantages-endgame.cjs` (novos) | Testes de comportamento (PASS) |
| `tests/playtest-save.cjs` | Atualizado para o catálogo novo (PASS) |

**Verificação:** `node scripts/verificar-v65.cjs` dá PASS, e os dois testes novos também. O teste antigo `tests/challenges-p5.cjs`, que já não fazia parte da verificação, falha por esperar o catálogo antigo. É esperado.

---

## 5. Resultado no simulador (para referência)
Escada completa:
- níveis 1 a 18;
- desafios e vantagens pelos blocos acima, com a escolha dentro do bloco sorteada;
- árvore com a XP de quem venceu todas as runs anteriores;
- escala de +1%.

O alvo de Carlos é **40 a 70% de vitória para o humano**. O simulador joga cerca de 10 pontos pior, então o alvo nele é de 30 a 60%.

| Nível | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Vitória (simulador) | 26 | 37 | 34 | 25 | 32 | 37 | 21 | 27 | 21 | 18 | 25 | 36 | 45 | 48 | 41 | 44 | 34 | 32 |

**Ponto a validar em playtest:** o vale dos níveis 7 a 11.
