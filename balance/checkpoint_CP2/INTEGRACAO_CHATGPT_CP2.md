# Integração do checkpoint GJ-v54-BAL-CP2 no projeto principal (ChatGPT)

## 1. Identificação

| Campo | Valor |
|---|---|
| Base | Grand Journey **v54**, commit `9b8bff1085f72112d492fd40ffba6c1ab63011b7` |
| Checkpoint anterior | **GJ-v54-BAL-CP1** (02/11/2026) |
| Este checkpoint | **GJ-v54-BAL-CP2** (03/11/2026). Entrega **completa do pós-CP1**. Não é número de versão do jogo |
| Repositório de trabalho | `cfsylla/Reposit-rio-GJ`, branch `claude/continue-previous-work-ccibom` |

## 2. Escopo

**Incluído (tudo aprovado por Carlos):**
1. **Curva de dificuldade:**
   - força inimiga dos mapas 2 e 3 passa para ×1,16 e ×1,235;
   - XP em dobro nos mapas 1 e 2.
2. **Árvore permanente:**
   - modelo de nível: o XP acumulado vira nível, cada nível dá 10 pontos, limite no nível 50, reset grátis fora da run;
   - nós finais custam ×1,5;
   - 13 especiais e marcos com efeitos novos, mais os básicos de Movimento;
   - XP acima do limite vira diamantes.
3. **Correção:** o filtro de relíquias inimigas usava nomes de traits anteriores à v54.
4. **Decks:** 9 decks revisados.
5. **Desafios da Jornada:** sistema completo, com 15 desafios, insígnias, conclusão por desafio e requisitos do Desafio Final.
6. **Vantagens:** 15 vantagens compradas com insígnias.
7. **Dados:** barras da ficha (`ratings`) recalculadas para 11 personagens.

**Excluído:**
- as telas (seção 7 é a especificação);
- o conteúdo do **boss secreto** e a sequência de confrontos do Desafio Final;
- o simulador do Claude (`balance/sim/`) e os dados brutos das simulações;
- variantes e candidatos que não foram aprovados.

## 3. Arquivos

### Contra o CP1 (o que mudou depois do CP1)

| Situação | Arquivo |
|---|---|
| **Novo** | `dist/challenges.js` (Desafios da Jornada) |
| **Novo** | `dist/advantages.js` (Vantagens) |
| **Novo** | `tests/challenges-p5.cjs`, `tests/advantages-p5.cjs` |
| **Novo** | `balanceamento/dados_checkpoint_CP2.json` (substitui `dados_checkpoint_CP1.json`) |
| Alterado | `dist/game-0.js`, `dist/tree-engine.js`, `dist/tree-data.js`, `dist/acts-engine.js`, `dist/boss-engine.js`, `dist/decks-p3.js`, `dist/index.html` |
| Alterado (só expectativas) | `tests/tree-v51.cjs`, `tests/fixes-v52.cjs`, `tests/difficulty-p4.cjs` |
| Alterado | `scripts/validate-balance-base.cjs` (10 etapas), `scripts/export-balance-data.cjs` (dados CP2) |
| Removido ou renomeado | **nenhum** |

### Patches
- **`checkpoint_CP2_vs_CP1.patch`**: só o que mudou depois do CP1 (17 arquivos). **Use este** se o CP1 já está integrado.
- **`checkpoint_CP2_vs_v54.patch`**: diff acumulado contra a v54 original (31 arquivos).
- Os dois estão no formato git, com caminhos relativos à raiz do projeto. Aplicar com `git apply -p1 <patch>`.
- **Conferido:** aplicados numa v54 limpa e no CP1 limpo, os dois geram arquivos **idênticos** aos de `arquivos_alterados/`.

## 4. Ordem de carga (`dist/index.html`)

Duas tags novas, **logo depois de `supports-b.js`**:

```html
<script defer src="supports-b.js?v=54"></script><script defer src="challenges.js?v=54"></script><script defer src="advantages.js?v=54"></script>
```

| Módulo | Precisa vir depois de | Por quê |
|---|---|---|
| `challenges.js` | `game-0`, `tree-engine`, `content-v53`, `raid-engine`/`monster-engine`, `boss-engine`, `supports-b` | Envolve `JourneyTree.price/gold/relicCount`, `JourneyRaid.initialize`, `Progress.finish/encounterWin`, `Game.enter` |
| `advantages.js` | `challenges.js` | Envolve `Game.enter/buy/shopService/refreshHand/deploy`, `JourneyContent.draw`, `JourneyTree.price/stats`, `JourneyActs.advance`, `Progress.finish/encounterWin` |

## 5. Trechos modificados nos arquivos compartilhados

Aplique **por trecho**, não por linha. Os trechos exatos estão no patch.

**`dist/game-0.js`** (ganchos opcionais `root.JourneyChallenges?.…` e `root.JourneyAdvantages?.…`; sem os módulos, o jogo se comporta como antes):
1. `makeAI`: soma `JourneyChallenges.upgrades(s, elite, boss)` aos upgrades inimigos.
2. `rollEnemyRelics`: soma `JourneyChallenges.enemyRelics(s)` à quantidade.
3. `enemyRelicPool`: **correção** com a nova função `enemyRelicFits(id, cards)`. Usa as mesmas condições dos efeitos: scope para unidades à distância, tome para conjuradores, boots para Trailblazer e shield para Sentinel.
4. `add()` dentro de `createBattle`: `JourneyChallenges.enemyStats(s, c, st)` depois da escala inimiga.
5. `maxUnits`: soma `JourneyChallenges.extraUnits(s)` para o inimigo.
6. `energyIncome`: soma `JourneyChallenges.energy(s, enemy)` e `JourneyAdvantages.energy(s, enemy)`.
7. `bagCapacity` e `bagMask`: casas bloqueadas por `JourneyChallenges.bagBlocked` e `cellBlocked`. O limite da bolsa expandida passou a usar `JourneyTree.has(owner, 'expanded_bag')`.
8. `ignore`: a chamada de `JourneyTree.ignore` recebe também `crit` (Penetração).
9. `winsNeeded`: soma `JourneyChallenges.extraBossRounds(s)`. Hoje é 0: o desafio Bosses Implacáveis passou a usar +8% de atributos.
10. `nextRound`: `JourneyChallenges.roundEnd(s)` antes de `prepare` (Energia Dissipada).
11. Dados `UNITS[].ratings`: 11 personagens com barras recalculadas.

**`dist/tree-engine.js`:**
- modelo de nível (`LEVEL`, `level`, `points`, `spent`, `available`, `bank`, `reset`, `overflowXp`, `payOverflow`);
- `buy(s, id)` usa pontos e vale na sessão da árvore depois do boss, ou fora da run com `s = null`;
- XP por luta pela tabela `xpFor`;
- `bank()` na sessão da árvore e no `resume`;
- `activeNodes()` (Árvore Contida, mantida só como candidata aposentada);
- tabela `TUNE` e os efeitos novos dos nós em `hit`, `ignore`, `haste`, `skill`, `beforeSettle`, `threshold`, `afterSettle` e `createBattle`;
- `moved()` ficou vazio, porque o Embalado agora é por abate;
- `healing()` não tem mais o bônus da Recuperação Urgente.

**`dist/tree-data.js`:**
- textos EN/PT dos 13 especiais e marcos;
- Movimento passa a +4% de movimento e +1% de velocidade de ataque;
- custo ×1,5 nos nós de profundidade 4 em diante.

**`dist/acts-engine.js`:** `SPEC[2].power = 1.16`, `SPEC[3].power = 1.235`.

**`dist/boss-engine.js`:** guarda a tabela de redução dos líderes em `JourneyBosses.leaderCut`. Só leitura.

**`dist/decks-p3.js`:** `counts` e `startRelic` dos 9 decks revisados (ver a tabela de alterações).

**`dist/index.html`:** 2 tags `<script>` novas.

## 6. Impacto em saves e compatibilidade

| Dado salvo | Efeito |
|---|---|
| Árvore (`profile.skillTree`) | Campo novo e opcional `totalXp`. Em saves antigos ele começa igual ao custo dos nós já comprados. **Não há reset.** Carlos decidiu ignorar saves antigos, porque só ele faz playtest. Campo `overflowPaid` (diamantes já pagos pelo XP excedente) |
| XP da run (`journey.tree.xp`) | Passa a ser guardado no perfil na sessão da árvore depois de cada boss (`banked`). Derrota antes do boss perde o XP não guardado, como antes |
| Desafios | Campo novo e opcional `profile.challenges = { unlocked, available, won: [níveis], completed: [ids], selected: [ids], final }`. Run: `s.challenges = [ids]`, fixado ao entrar no 1º nó, **nunca em treino ou replay do tutorial** |
| Insígnias e vantagens | `profile.insignia` (número) e `profile.advantages` (ids). Por run: `s.adv` (uso de cada vantagem) |
| True bosses | `profile.stats.trueBoss_monsters` passa a ser registrado. Antes, só Blackfang e Dawncrest |
| Decks | IDs inalterados. Custom decks continuam válidos |
| Run em andamento | Curva, nós e XP valem a partir do próximo confronto. Desafios e vantagens só a partir da próxima run (são fixados no 1º nó) |

## 7. Telas a criar ou ajustar (especificação)

1. **Árvore:**
   - mostrar **nível e pontos**, por exemplo "Nível 23 · 12 pontos livres";
   - barra até o próximo nível;
   - botão **Redistribuir**, só fora da run (`JourneyTree.reset(null)`);
   - comprar nós fora da run com `JourneyTree.buy(null, id)`;
   - aviso de "XP excedente convertido em diamantes".
2. **Antes da run (Desafios da Jornada):**
   - aparece só depois da 1ª vitória;
   - lista dos 15 desafios com marca de concluído;
   - contador "**N de M**", onde M é o nível liberado (`profile.challenges.available`);
   - seleção com `JourneyChallenges.toggle(id)` ou `select(ids)`;
   - mostrar o nível que a run terá.
3. **Fim da run:** nível vencido, insígnia ganha (`s.meta.insignia`) e desafios concluídos.
4. **Loja de vantagens:** as 15 vantagens, insígnias disponíveis, compra com `JourneyAdvantages.buy(id)` e marca das já compradas.
5. **Escolhas no início da run:** **Mão Planejada** escolhe 1 carta do deck (`JourneyAdvantages.plannedOptions(s)` e `choosePlanned(s, type)`).
6. **Olho Treinado:** botão "renovar" nas escolhas de relíquia, enquanto `JourneyAdvantages.canReroll(s)`, chamando `rerollRelic(s)`.
7. **Desafio Final:**
   - aparece bloqueado, mostrando os 3 requisitos e o progresso de cada um (`JourneyChallenges.finalRequirements()`);
   - **sem revelar o boss**;
   - o encontro em si depende do conteúdo do boss secreto (seção 2).

## 8. Possíveis conflitos com o desenvolvimento paralelo

- Qualquer mudança feita no ChatGPT em `makeAI`, `rollEnemyRelics`, `enemyRelicPool`, `createBattle`, `maxUnits`, `energyIncome`, `bagCapacity`/`bagMask`, `winsNeeded` ou `nextRound` (`game-0.js`), ou no fluxo de compra e XP de `tree-engine.js`. **Combine as duas intenções.**
- **Tela da árvore:** hoje ela mostra o XP da run (`T.ensure(S).xp`). Com o modelo de nível, ela deve mostrar `JourneyTree.level()`, `available()` e `nextLevelXp()`.
- **Telas de deck:** 9 decks mudaram de composição. Os IDs continuam os mesmos.

## 9. Testes após integrar

1. `node scripts/validate-balance-base.cjs` precisa dar **PASS nas 10 etapas**. Resultado aqui: 10 de 10.
2. Rodar isoladamente: `node tests/challenges-p5.cjs` e `node tests/advantages-p5.cjs`.
3. **QA manual:**
   - comprar e redistribuir a árvore fora da run;
   - vencer a 1ª run e conferir a liberação dos desafios;
   - jogar uma run com 2 ou 3 desafios e conferir a insígnia;
   - comprar vantagens e conferir a Mão Planejada (escolha) e o Olho Treinado (renovar);
   - conferir os textos EN/PT dos nós, desafios e vantagens;
   - **vantagens que dependem do jogador:** Olho Treinado, Limpeza, Fusão Eficiente, Mão Planejada e Preparação Flexível.

## 10. Mensagem pronta para enviar ao ChatGPT

> Segue o checkpoint **GJ-v54-BAL-CP2** do balanceamento feito no Claude, sobre o CP1 (base v54, commit 9b8bff1085f72112d492fd40ffba6c1ab63011b7). Ele traz:
> - a curva de dificuldade recalibrada;
> - a árvore permanente com modelo de nível (limite 50, reset grátis, nós finais mais caros e 13 nós revisados);
> - a correção do filtro de relíquias inimigas;
> - 9 decks revisados;
> - os **Desafios da Jornada** completos (15 desafios, insígnias e requisitos do Desafio Final);
> - as **15 Vantagens**.
>
> Antes de integrar, **compare com o código atual do projeto**, que pode ter mudado em paralelo. Aplique por trecho, conforme `INTEGRACAO_CHATGPT_CP2.md`, usando `checkpoint_CP2_vs_CP1.patch` se o CP1 já estiver integrado. Não substitua arquivos inteiros às cegas e preserve IDs, saves e o que foi desenvolvido depois do CP1. Rode `node scripts/validate-balance-base.cjs` (10 etapas) e os 2 testes novos.
>
> As telas estão especificadas na seção 7 e ficam com você. O boss secreto não faz parte deste pacote. O que está em `PENDENCIAS_CP2.md` **não** deve ser aplicado. **Não publique** sem minha autorização. Ao terminar, me informe o que integrou, os conflitos encontrados e como resolveu, para eu levar o estado atualizado de volta ao Claude.
