# Integração do checkpoint GJ-v50-BAL-CP3 no projeto principal (ChatGPT)

## 1. Identificação

| Campo | Valor |
|---|---|
| Base | Grand Journey **publicação 50**, commit `aed07ed41c8a002ab1d149882e068b7a7f6c4415` (identificação interna v56), com o CP2 já integrado |
| Checkpoint anterior | **GJ-v54-BAL-CP2** (03/11/2026) |
| Este checkpoint | **GJ-v50-BAL-CP3** (07/11/2026). Não é número de versão do jogo |
| Repositório de trabalho | `cfsylla/Reposit-rio-GJ`, branch `ccr-189ed62b-9mch05` |

## 2. Escopo

**Incluído (tudo aprovado pelo Carlos):**
1. **Modelo de XP e árvore:** XP gasto nas janelas, sobra perdida no fim da run, reset que devolve só o investimento, nível = nós comprados, diamante só com a árvore completa.
2. **Janela da árvore depois da 6ª luta** de cada mapa, além da janela pós-boss.
3. **XP por encontro** = peso × mapa.
4. **2º anel da árvore** a custo 8.
5. **Bosses:** tabela de ajuste só para inimigos (por mapa, por boss e forma 2 dos True Bosses).
6. **Auras:** 6 suportes sem cura, 1 buff cada; o Goblin King mantém 2.
7. **6 decks** ajustados.
8. **3 valores** de Desafios e Vantagens.

**Excluído:**
- as telas (a seção 7 é a especificação);
- o Secret Boss e o Desafio Final;
- a proposta de economia permanente (em decisão);
- o simulador do Claude (`balance/sim/`) e os dados brutos.

## 3. Arquivos

| Situação | Arquivo |
|---|---|
| Alterado | `dist/tree-engine.js` (modelo de XP, janelas, respec, diamante) |
| Alterado | `dist/tree-data.js` (custo do 2º anel) |
| Alterado | `dist/boss-engine.js` (tabela `JOURNEY_BOSS_TUNE`) |
| Alterado | `dist/supports-b.js` (auras e textos) |
| Alterado | `dist/decks-p3.js` (6 decks) |
| Alterado | `dist/challenges.js` (Fúria das Raids, Recursos Escassos e textos) |
| Alterado | `dist/advantages.js` (Treino Prévio e texto) |
| **Novo** | `tests/xp-r3.cjs`, `tests/auras-r3.cjs` |
| Alterado (só expectativas) | `tests/challenges-p5.cjs`, `tests/advantages-p5.cjs`, `tests/tree-v51.cjs`, `tests/fixes-v52.cjs`, `tests/balance-p2.cjs`, `tests/bosses-v50.cjs` |
| Removido ou renomeado | **nenhum** |
| `index.html` | **sem mudança** (nenhum módulo novo) |

**Patch:** `checkpoint_CP3_vs_v50.patch`, em formato git, com caminhos relativos à raiz do projeto. Aplicar com `git apply -p1`. Conferido: numa v50 limpa, gera arquivos idênticos a `arquivos_alterados/`.

**Dados:** `arquivos_alterados/balanceamento/dados_checkpoint_CP3.json`, gerado por `exportar_dados_cp3.cjs`. Contém a tabela de XP, os custos, o ajuste dos bosses, as auras, os decks, os desafios e as vantagens.

## 4. Ordem de carga
Sem mudança. `tree-engine.js` agora intercepta também `Game.leave`, para abrir a janela depois da 6ª luta. Ele continua carregado antes de `content-v53.js`, que intercepta `G.leave` por cima. A ordem do `index.html` da v50 já está correta.

## 5. Trechos modificados

### 5.1 `dist/tree-engine.js`
- **Removidos do cálculo:** `totalXp`, `bank()`, `payOverflow()` e `overflowXp()`. As funções continuam exportadas por compatibilidade, mas não fazem nada: `bank()` devolve 0 e `overflowXp()` devolve 0.
- **Novo:** `JOURNEY_TREE_XP = { weights:{battle:1, special:2, boss:4, trueBoss:6, secretBoss:8}, mult:[1,2,3], midFight:6, xpPerDiamond:20 }`.
- **Novo:** `kindOf(node)` classifica o encontro:
  - elite ou `campaign` de blackfang, dawncrest ou monsters → `special`;
  - `node.trueBoss` → `trueBoss`;
  - `node.secretBoss` → `secretBoss` (campo reservado para o futuro Secret Boss).
- **Novo:** `xpFor(act, kind)`. Aceita também o booleano antigo (`true` = boss).
- **`award(s)`:** soma o XP da tabela ao saldo da run (`t.xp`). Se a árvore estiver completa, o XP vira diamante (1 a cada 20) e não entra no saldo.
- **Janela do meio do mapa:** um wrapper de `G.leave` abre a janela ao sair da camada `SPEC[act].fights[5]` (a 6ª luta), uma vez por mapa. Ela grava `t.session = {act, kind:'mid'}` e muda para `s.phase = 'tree'`.
- **Janela pós-boss:** grava `t.session = {act, boss, kind:'boss'}`, sem bancar XP.
- **`continueRun(s)`:**
  - janela `mid`: fecha (`t.midClosed`) e volta para `phase = 'map'`, mantendo o XP;
  - janela `boss`: fluxo da v50; no mapa 3, o XP restante é perdido.
- **`available(s)`:**
  - **com a run** e uma janela aberta: devolve `t.xp`, o XP da run;
  - **sem a run:** devolve o orçamento de redistribuição (`profile.skillTree.respec`).
- **`buy(s, id)`:** desconta do XP da run, ou do orçamento de redistribuição quando é fora da run.
- **`reset(null)`:** só fora da run. Soma o custo dos nós comprados ao orçamento de redistribuição.
- **`G.fresh`:** zera o orçamento de redistribuição que sobrou (sobra perdida).
- **Derrota e abandono:** o XP não gasto é perdido (`lose()`).
- **`level()`** = nós comprados. **`points(s)`** = gasto + disponível. **`nextLevelXp()`** = custo do nó conectado mais barato.
- **Perfil `skillTree` versão 2:** `{unlocked, purchases, respec, history:{earned, spent, lost, respecLost, diamonds}}`. Uma versão 1 é migrada mantendo os nós e descartando `totalXp`.

### 5.2 `dist/tree-data.js`
Os nós básicos do 2º anel passam a custar 8 em vez de 10: os de `start` com índice maior que 0 e os dos braços com profundidade menor que 4. São 16 nós. A árvore completa passa a custar 1.119.

### 5.3 `dist/boss-engine.js`
- **Novo:** `JOURNEY_BOSS_TUNE = {map, boss, true2}`. Os valores estão na tabela de alterações e no JSON.
- **Forma 1 (todos os líderes):** `hp = d.hp × power × map[act] × boss[id].hp` e `atk = d.atk × power × map[act] × boss[id].atk`.
- **Forma 2 do True Boss:** `R.initialize(s, 'true_'+id, {hp: true2[id].hp, damage: true2[id].damage, minions: 1}, true)`.
- **Não afeta** as cartas de boss do jogador (`boss-cards.js`).
- As habilidades dos líderes Ironbound continuam passando por `JourneyBossCards.effect` (a mesma função das cartas). Por isso o ajuste foi feito só em vida e ataque do inimigo.

### 5.4 `dist/supports-b.js`
- **SPEC:** cura 0 em Snow Troll, Sage, Feline Arcanist, Bard, Goblin King e Feline Drummer. Novos buffs:

  | Suporte | Buff |
  |---|---|
  | Sage | `guard .45` |
  | Bard | `atk .34` |
  | Snow Troll | `guard .42` |
  | Feline Arcanist | `haste .35` |
  | Feline Drummer | `haste .46` |
  | Goblin King | `atk .32`, `haste .27` |

- O pulso de cura é ignorado quando `heal` é 0. Assim, não aparecem entrada de cura, número, efeito visual nem gatilho "ao curar".
- `detail` / `detailPT`: a frase de cura só aparece quando `heal > 0`.
- **Novo (só para testes):** `SUPPORT_B_SPEC` permite sobrescrever valores antes da carga.

### 5.5 `dist/decks-p3.js`, `dist/challenges.js`, `dist/advantages.js`
Os valores estão na tabela de alterações. Os textos em PT e EN de Fúria das Raids, Recursos Escassos e Treino Prévio foram atualizados.

## 6. Saves e compatibilidade
- **Run salva no meio de um mapa:** `t.midClosed` e `t.session.kind` ficam dentro de `s.journey.tree`. Uma run da v50 recarregada no meio do mapa abre a janela ao sair da camada da 6ª luta, se ainda não passou por ela. Se já passou, não abre.
- **Uma janela aberta e salva** continua aberta ao recarregar, porque `phase = 'tree'` e a sessão vêm do save.
- **Perfil:** uma árvore versão 1 é migrada para a versão 2, mantendo os nós comprados. Não há saldo reconstruído.
- **XP não duplica:** abrir, fechar ou recarregar a tela, ou repetir a conclusão, não duplica XP. O controle usa a chave por encontro (`t.earned`) e o fechamento único por janela (`midClosed` e `closed`).
- **IDs:** nenhum ID mudou e os mapas não mudaram (nenhuma camada inserida ou removida).

## 7. Telas a ajustar (especificação)
1. **Árvore:**
   - **Saldo:** durante a janela, mostrar `T.available(S)`, passando a run. Hoje a tela chama `T.available()` sem a run, o que mostraria o orçamento de redistribuição. Fora da run, mostrar `T.available()` como "Orçamento de redistribuição".
   - **Nível:** "Nível X/60" (nós comprados), em vez de "X/50". Trocar a barra de próximo nível por "Próximo nó a partir de N" (`T.nextLevelXp()`).
   - **Tipo de janela:** pelo `T.ensure(S).session.kind`, mostrar "Janela do meio do mapa" (`mid`) ou "Janela pós-boss" (`boss`).
   - **Aviso:**
     - na janela do meio do mapa e nas pós-boss dos mapas 1 e 2: "O XP não gasto continua com você até o fim desta run";
     - na janela pós-boss do mapa 3: "O XP não gasto será perdido ao terminar a run".
2. **Redistribuir** (botão `tree-reset`, fora da run): o texto avisa que o orçamento devolvido precisa ser gasto antes da próxima run, ou será perdido.
3. **Mapa:** marcar o nó da **6ª luta** de cada mapa (camada `JourneyActs.SPEC[act].fights[5]`) com uma borda de **estrela**, indicando que a árvore abre depois dele.
4. **Fim da run:** mostrar o XP ganho, gasto e perdido nesta run. Fonte: `T.ensure(S).gain`, a soma das compras e `T.ensure(S).lost`.
5. **Cartas dos 6 suportes sem cura:** o texto já vem sem cura do `detail`/`detailPT`. Conferir os cartões, tooltips e barras (`ratings`) que mencionem cura.
6. **Abandonar run:** deixar claro que o XP não gasto é perdido e que os nós já comprados ficam.

## 8. Possíveis conflitos com o desenvolvimento paralelo
- Mudanças em `G.leave`, `P.finish`, `P.abandon`, `G.fresh` ou `A.advance` (os wrappers da árvore): **combine as intenções**.
- Qualquer código que leia `profile.skillTree.totalXp` ou chame `JourneyTree.bank()`. A interface antiga da árvore e possíveis milestones de "nível da árvore" precisam passar a usar `level()`, que agora conta os nós.
- Mudanças nos dados dos bosses (`boss-engine.js` e `ironbound-data.js`): os multiplicadores do `JOURNEY_BOSS_TUNE` valem sobre os valores base atuais.
- Novos suportes ou mudanças em `supports-b.js`: manter `heal: 0` como "sem cura".

## 9. Testes após integrar
1. `node scripts/validate-balance-base.cjs`: precisa dar **PASS em todas as etapas**. Resultado aqui: PASS.
2. Rodar isoladamente: `node tests/xp-r3.cjs`, `node tests/auras-r3.cjs`, `node tests/challenges-p5.cjs`, `node tests/advantages-p5.cjs`, `node tests/integration-cp2.cjs` e `node tests/progression-v56.cjs`.
   - O `xp-r3.cjs` usa o simulador do repositório de balanceamento (`balance/sim/run.cjs`) para jogar runs inteiras.
   - Se o projeto principal não tiver essa pasta, rode-o no repositório de balanceamento ou troque o `playRun` pelo equivalente do projeto.
3. **QA manual:**
   - abrir a janela depois da 6ª luta no mapa 1 e comprar um nó de custo 8;
   - conferir que o nó vale na luta seguinte;
   - perder no boss 1 e conferir que o nó ficou;
   - vencer e conferir o XP que passa para a próxima janela;
   - no fim da run, conferir a perda do XP restante;
   - redistribuir fora da run, gastar parte, começar a run e conferir a perda da sobra;
   - recarregar o save com uma janela aberta;
   - conferir os textos em PT e EN dos 6 suportes e dos 3 itens de desafios e vantagens.

## 10. Testes antigos que mudaram (só expectativas)
| Teste | O que mudou |
|---|---|
| `challenges-p5` | Fúria das Raids (1,15/1,05); Recursos Escassos (só a 1ª rodada); compra fora da run usa o orçamento de redistribuição; bloco do modelo de nível substituído pelo modelo R3 |
| `advantages-p5` | Treino Prévio (2 cartas com upgrade 1); XP → diamante só com a árvore completa |
| `tree-v51` | janela depois da 6ª luta no percurso; XP continua na run; compra usa o XP da run; reconstrução de XP pelos encontros |
| `fixes-v52` | janela depois da 6ª luta no percurso; XP do boss do mapa 3 = 12 |
| `balance-p2` | valores de aura lidos da SPEC (Bard +34%) |
| `bosses-v50` | vida da forma 2 do True Boss × ajuste |

## 11. Mensagem pronta para enviar ao ChatGPT

> Segue o checkpoint **GJ-v50-BAL-CP3** do balanceamento feito no Claude, sobre a **publicação 50** (commit aed07ed41c8a002ab1d149882e068b7a7f6c4415). Ele traz:
> - o **modelo de XP** da rodada: XP gasto nas janelas da árvore, sobra perdida no fim da run, reset que devolve só o investimento, árvore completa alcançável;
> - a **janela da árvore depois da 6ª luta** de cada mapa;
> - o **XP por encontro** (peso × mapa) e o 2º anel da árvore a custo 8;
> - o **ajuste dos bosses** (só dados de inimigo), com os True Bosses mais fortes;
> - as **auras**: 6 suportes sem cura, com 1 buff cada;
> - **6 decks** ajustados e **3 valores** de Desafios e Vantagens.
>
> Antes de integrar, **compare com o código atual do projeto**, que pode ter mudado em paralelo. Aplique por trecho, conforme `INTEGRACAO_CHATGPT_CP3.md`, usando `checkpoint_CP3_vs_v50.patch`. Não substitua arquivos inteiros às cegas e preserve IDs, saves e o que foi desenvolvido depois da publicação 50. Rode `node scripts/validate-balance-base.cjs` e os testes da seção 9.
>
> As telas estão especificadas na seção 7 e ficam com você, incluindo a estrela no nó da 6ª luta. O Secret Boss e a economia permanente não fazem parte deste pacote. O que está em `PENDENCIAS_CP3.md` **não** deve ser aplicado. **Não publique** sem minha autorização. Ao terminar, me informe o que integrou, os conflitos encontrados e como resolveu, para eu levar o estado atualizado de volta ao Claude.
