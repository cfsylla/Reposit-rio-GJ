# Integração do checkpoint GJ-v54-BAL-CP1 no projeto principal (ChatGPT)

## 1. Identificação

| Campo | Valor |
|---|---|
| Base | Grand Journey **v54**, commit `9b8bff1085f72112d492fd40ffba6c1ab63011b7` |
| Checkpoint | **GJ-v54-BAL-CP1**, de 02/11/2026. Entrega **parcial**, não é número de versão |

## 2. Escopo

**Incluído:** somente itens aprovados e implementados:
- P1: personagens e valores de traits;
- P2: mecânicas de traits, Fearless V4 e suportes modelo B;
- P3: 24 decks, desbloqueios e migração;
- P4: dificuldade e economia V23, regra de relíquias inimigas R1 e correção do bug do lacaio.

**Excluído:**
- experimentos e variantes de teste (V0 a V22, alternativa do Arcane, versões antigas dos decks e dos suportes);
- o simulador do Claude;
- interface, artes, traduções gerais e hospedagem.

## 3. Arquivos

| Situação | Arquivo |
|---|---|
| **Novo** | `dist/balance-p1.js` |
| **Novo** | `dist/decks-p3.js` |
| **Novo** | `dist/enemy-decks-p4.js` |
| **Novo** | `dist/supports-b.js` |
| **Novo** | `tests/balance-p2.cjs` |
| **Novo** | `tests/decks-p3.cjs` |
| **Novo** | `tests/difficulty-p4.cjs` |
| **Novo** | `balanceamento/dados_checkpoint_CP1.json` (dados exportados do checkpoint) |
| Alterado | `dist/game-0.js` |
| Alterado | `dist/acts-engine.js` |
| Alterado | `dist/boss-engine.js` |
| Alterado | `dist/traits-v54.js` |
| Alterado | `dist/index.html` |
| Alterado (só expectativas) | `tests/traits-v54.cjs`, `systems-v18.cjs`, `roster-v37.cjs`, `acts-v47.cjs`, `content-v53.cjs`, `manticore-v46.cjs`, `monsters-v42.cjs`, `raids-v45.cjs`, `tree-v51.cjs` |
| Alterado | `scripts/validate-balance-base.cjs`, `scripts/export-balance-data.cjs` |
| Removido / renomeado | **nenhum** |

Patch completo: `checkpoint_balanceamento.patch`. Formato git, caminhos relativos à raiz do projeto, aplicar com `git apply -p1`.

Conferido: aplicado numa v54 limpa, o patch gera exatamente os arquivos de `arquivos_alterados/`.

## 4. Ordem de carga (`dist/index.html`)

`game-0` → **balance-p1** → **decks-p3** → `training-engine` → `raid-engine` → `monster-engine` → `acts-engine` → **enemy-decks-p4** → `boss-engine` → … → `traits-v54` → **supports-b** → (restante inalterado)

Motivo de cada posição:

| Módulo | Precisa vir depois de | Precisa vir antes de |
|---|---|---|
| `balance-p1.js` | `game-0.js` | qualquer cálculo de atributos |
| `decks-p3.js` | `balance-p1.js` (precisa de Progress, que está em `game-0.js`) | a interface |
| `enemy-decks-p4.js` | — (só define dados; precisa existir antes da 1ª batalha) | — |
| `supports-b.js` | `traits-v54.js` e `tree-engine.js` (envolve `JourneyTraits.beforeStep` e `JourneyTree.beforeSettle`) | — |

## 5. Blocos modificados nos arquivos compartilhados

Aplique **por trecho**, não por linha. Os trechos exatos estão no patch.

### `dist/game-0.js`
1. **`deckCards(d)`:** aceita `d.counts`. O formato antigo continua funcionando.
2. **`makeAI(s)`:**
   - (a) elites comuns sorteiam entre `DECKS` **sem** `order` e `ENEMY_DECKS`;
   - (b) batalha normal a partir da 2ª luta usa `JourneyEnemyDecks[ato]`;
   - (c) quantidade de cópias por `d.counts`;
   - (d) bloco de curva de upgrades (`const C={...}`), que substitui a fórmula antiga de níveis: curva N−2, elite +1, boss −3/−4/−6, boss de equipe −4/−7/−8, Rei Troll −3.
3. **`rollEnemyRelics()`:** quantidade = sorteio entre 1 e máx(1, n−1), com o limite da bolsa preservado.
4. **`battleReward(stage)`:** 14 / 16 / 18 por mapa.
5. **`price()`:** upgrade 10 / 16.
6. **`createBattle()`:** escala começa em 0,80.
7. **`stats()`:** `skill: m*(t.skillScale||1)`.

### `dist/acts-engine.js`
- `SPEC.power`: 1,10 e 1,16.
- `attachRun()`: multiplicadores de raid por ato, `[1, 1,25, 1,25]` para vida e `[1, 1,1, 1,1]` para dano e lacaios.

### `dist/boss-engine.js`
- `freshMinion()`: correção da carga do especial.
- Bloco **acrescentado no fim do arquivo**: multiplicadores dos líderes em `JourneyBosses.D`.

### `dist/traits-v54.js`
- Valores em `val(...)` e em `stats()`.
- Mecânicas novas em `damage()`, `reduction()`, `defense()` e `crit()`.
- Provocação do Protector desativada em `beforeStep()`.
- Textos EN/PT de 17 traits.

### `dist/index.html`
- 4 tags `<script>` novas.

## 6. Impacto em saves e compatibilidade

| Dado salvo | Efeito |
|---|---|
| **Coleção e cópias** | Sem mudança, porque IDs e contagens se mantêm. Mudanças de raridade (Cannoneer, Shaolin, Ronin, Shinobi, Gladiador, Archer, Predador Elfo da Floresta) afetam o **preço em diamantes** de compra da carta e a **chance nos boosters** dali em diante. Cópias já possuídas não mudam |
| **Moedas** (diamantes, ouro de run) | Sem mudança |
| **Decks customizados** | Continuam válidos (20 cartas, máximo 4 cópias, posse). Personagens com custo novo passam a custar o novo valor em combate |
| **Catálogos e desbloqueios** | Na carga do perfil, `decks-p3.js` libera os decks dos milestones **já concluídos** e os decks dos bosses de ordem já liberados (`blackfangUnlocked` / `dawncrestUnlocked`). Não duplica, porque só adiciona o que falta |
| **Milestones** | Concluídos: recebem o deck novo pela migração, uma vez. Em andamento: continuam com a mesma métrica. Novo "Derrotar o boss do mapa 2": a contagem começa no CP1, **sem retroatividade** |
| **True boss → decks** | A flag de vitória sobre o true boss só é registrada a partir do CP1. **Quem venceu true bosses antes não recebe esses decks automaticamente.** Pendente de decisão |
| **Árvore** | Nós e compras sem mudança |
| **Run em andamento** | Atributos, traits, auras, ouro por vitória, preço de upgrade, força do mapa e escala valem **imediatamente** a partir da próxima rodada ou confronto. O inimigo **já gerado** para o confronto atual mantém os níveis antigos; o próximo confronto usa a curva nova. O conteúdo do deck da run não muda (as cartas já estão na run) |
| **Combate salvo / retomado (raid)** | O snapshot guarda os atributos das unidades no momento salvo. Os suportes passam a se comportar como aura (passivos) depois da retomada. **Não foi testada uma retomada de snapshot criado na v54.** Recomendado: testar, ou pedir que o jogador termine a raid antes de atualizar |

Não foram criadas migrações além da de decks, que foi aprovada.

## 7. Possíveis conflitos com o desenvolvimento paralelo

- Qualquer mudança feita no ChatGPT em `makeAI`, `stats`, `battleReward`, `price`, `createBattle`, `rollEnemyRelics`, `SPEC.power`, `attachRun`, `freshMinion` ou nas funções de dano / defesa / redução / crítico de `traits-v54.js`. Combinar as duas intenções.
- Telas de deck e coleção: 24 decks em vez de 10, novos IDs e o campo `counts`.
- Milestones na interface: há 1 milestone novo, e vários passam a mostrar um deck como recompensa.
- Ficha de personagem: o campo `ratings` (estrelas) **não** foi atualizado para os 33 personagens ajustados.

## 8. Testes após integrar

1. `node scripts/validate-balance-base.cjs` → deve dar PASS nas 8 etapas.
2. Rodar `tests/balance-p2.cjs`, `tests/decks-p3.cjs` e `tests/difficulty-p4.cjs` isoladamente.
3. QA manual:
   - abrir as listas de decks e de milestones;
   - jogar o 1º confronto com Coro de Guerra para ver as auras;
   - enfrentar um boss de ordem;
   - retomar uma raid salva;
   - conferir os textos EN/PT dos traits e suportes.

## 9. Mensagem pronta para enviar ao ChatGPT

> Segue o checkpoint **GJ-v54-BAL-CP1** do balanceamento feito no Claude, sobre a base v54 (commit 9b8bff1085f72112d492fd40ffba6c1ab63011b7). É uma **entrega parcial**, com somente as alterações que aprovei: P1 (personagens e valores de traits), P2 (mecânicas de traits, Fearless V4 e suportes com aura), P3 (24 decks e desbloqueios) e P4 (curva de dificuldade, economia de ouro e upgrade, bosses, raids, decks inimigos por mapa, regra de relíquias inimigas e correção do bug do lacaio do Rei Goblin).
>
> Antes de integrar, **compare com o código atual do projeto**. Ele pode ter mudado em paralelo. Aplique por trecho, conforme `INTEGRACAO_CHATGPT.md`, sem substituir arquivos inteiros às cegas. Preserve IDs, saves e o que foi desenvolvido depois da v54. Rode `node scripts/validate-balance-base.cjs` e os 3 testes novos.
>
> O que está em `PENDENCIAS_BALANCEAMENTO.md` **não** deve ser aplicado. **Não publique** sem minha autorização. Ao terminar, me informe o que integrou, os conflitos encontrados e como resolveu, para eu levar o estado atualizado de volta ao Claude.
