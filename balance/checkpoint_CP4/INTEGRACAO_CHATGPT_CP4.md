# Integração do checkpoint GJ-v50-BAL-CP4 no projeto principal (ChatGPT)

## 1. Identificação

| Campo | Valor |
|---|---|
| Base | **CP3** (GJ-v50-BAL-CP3, 07/11/2026) sobre a **publicação 50**, commit `aed07ed41c8a002ab1d149882e068b7a7f6c4415` (identificação interna v56) |
| Checkpoint anterior | **GJ-v50-BAL-CP3** (07/11/2026) |
| Este checkpoint | **GJ-v50-BAL-CP4** (10/11/2026). Não é número de versão do jogo |
| Repositório de trabalho | `cfsylla/Reposit-rio-GJ`, branch `ccr-fc0114d7-9l2urp` |

## 2. Escopo

**Incluído (tudo aprovado pelo Carlos):**
1. **Cura dos suportes:** % da vida de quem cura, ritmo próprio (Fada 2 s, Xamã 3 s, Sacerdotisa 4 s, Harpista 5 s), ±10%, teto por pulso nos bosses de raid.
2. **Árvore:** custo por anel × tipo (total 1.754), básicos dos anéis 1–2 ×3, janela da árvore na derrota.
3. **Escada de dificuldade:** força dos inimigos por barreira (`JOURNEY_BARRIER_TUNE`), raids e Titã.
4. **True Bosses** recalibrados.
5. **Desafios e Vantagens** recalibrados.
6. **Relíquias:** 43 relíquias, 6 categorias, 8 formatos novos, valores/raridades/mecânicas de 10/11 (módulo novo `relics-r3.js`).
7. **Ativação de habilidade com alvo válido** (63 habilidades + 17 cartas-herói de boss).
8. **Nome Grand Union** na tela (IDs continuam `ironbound`).

**Excluído:** economia permanente, Secret Boss, o simulador do Claude (`balance/sim/`) e os dados brutos.

**Atenção:** nada das mudanças de 10/11 foi testado ou simulado (decisão do Carlos: validação por playtest).

## 3. Arquivos

| Situação | Arquivo |
|---|---|
| **Novo** | `dist/relics-r3.js` (relíquias novas, textos PT/EN, tabela `JOURNEY_RELIC_TUNE` complementar, formatos, raridades, efeitos de combate via ganchos de `JourneyTraits`) |
| Alterado | `dist/index.html` (1 tag: `relics-r3.js` antes de `encounter-memory.js`) |
| Alterado | `dist/game-0.js` (tabela `JOURNEY_RELIC_TUNE`, relíquias revistas, regra `skillValid`, esquiva no `hit`, nome Grand Union) |
| Alterado | `dist/traits-v54.js` (acúmulos do Paciente parametrizáveis pela relíquia) |
| Alterado | `dist/content-v53.js` (Ídolo, Espada, Espelho, Estandarte do capitão) |
| Alterado | `dist/game-5.js` (dicionário PT→EN dos textos novos) |
| Alterado | `dist/supports-b.js` (cura dos suportes) |
| Alterado | `dist/tree-data.js`, `dist/tree-engine.js`, `dist/tree-ui.js` (custos, básicos ×3, janela na derrota, XP do Grimório) |
| Alterado | `dist/acts-engine.js` (escada de barreiras, raids, Titã) |
| Alterado | `dist/boss-engine.js` (True Bosses, teto de cura) |
| Alterado | `dist/challenges.js`, `dist/advantages.js` (valores e textos) |
| Alterado (só texto) | `dist/acts-ui.js`, `dist/v52-ui.js`, `dist/traits-ui-v54.js`, `dist/progression-v56.js` (Grand Union) |
| **Novo** | `tests/relics-r3.cjs`, `tests/escada-r3.cjs`, `tests/defeat-window-r3.cjs`, `tests/tree-rings-r3.cjs` |
| Alterado (expectativas) | `tests/advantages-p5.cjs`, `tests/auras-r3.cjs`, `tests/balance-p2.cjs`, `tests/bosses-v50.cjs`, `tests/challenges-p5.cjs`, `tests/content-v53.cjs`, `tests/systems-v18.cjs`, `tests/tree-v51.cjs` |
| Removido ou renomeado | **nenhum** |

**Patches:** `checkpoint_CP4_vs_CP3.patch` (se o projeto já tem o CP3) e `checkpoint_CP4_vs_v50.patch` (CP3 + CP4 sobre a v50). Formato unificado, caminhos relativos à raiz do projeto; aplicar com `git apply -p1` ou `patch -p1`. Conferido: em cópias limpas, geram arquivos idênticos a `arquivos_alterados/`.

**Dados:** `arquivos_alterados/balanceamento/dados_checkpoint_CP4.json`, gerado por `exportar_dados_cp4.cjs` (árvore, bosses, suportes, decks, desafios, vantagens, escada, tabela e lista das 43 relíquias).

## 4. Ordem de carga
`relics-r3.js` entra logo antes de `encounter-memory.js` (depois de `game-0.js`, `content-v53.js`, `traits-v54.js` e `supports-b.js`, que ele estende). Ele:
- completa `JOURNEY_RELIC_TUNE` com os padrões que faltam (`DEF`) sem sobrescrever o que já existe;
- acrescenta as 18 relíquias novas em `Game.ARTIFACTS` e reescreve nome/texto das 25 antigas a partir da tabela;
- envolve `JourneyTraits.beforeStep`, `damage`, `crit`, `reduction`, `afterSkill`, `healthLoss`, `afterSettle` e `immune` (sempre chamando o original primeiro);
- expõe `JourneyRelicsR3` (inclui `evade`, chamado por `game-0.js` no `hit`).

## 5. Trechos modificados (principais)
- **`game-0.js` — ativação:** a condição de disparo passou de `skillReady(u)&&canCast` para `skillReady(u)&&canCast&&skillValid(b,u,skillTarget,targets,living)`. `SKILL_RULES` lista o tipo de cada habilidade; unidades sem regra (nenhuma jogável hoje) mantêm o comportamento antigo; cartas-herói usam a regra simples.
- **`game-0.js` — `hit`:** depois do bloqueio do Shaolin, `if(root.JourneyRelicsR3?.evade?.(b,a,t))return false;` (esquiva das Botas, texto "EVADE").
- **`game-0.js` — `stats`:** Botas só dão movimento permanente (a velocidade de ataque vai para os 4 primeiros golpes, em `relics-r3.js`); a armadura do Selo virou redução temporária (primeiros 6 s).
- **`traits-v54.js`:** os acúmulos do Paciente usam `u.r3PatientMax` (padrão 3) e `u.r3PatientEvery` (padrão 3 s).
- **`acts-engine.js`:** `power(s)` multiplica pela barreira (`JOURNEY_BARRIER_TUNE`); raids e Titã usam `raid`/`raidBoss`.
- **`tree-engine.js`:** `P.finish` abre a janela da árvore na derrota (uma vez, se o XP compra ≥1 nó); Grimório +30% de XP com fração acumulada.

## 6. Saves e compatibilidade
- **Decisão do Carlos: saves antigos ignorados.** Nós da árvore já comprados ficam; o custo novo vale para as próximas compras.
- IDs de relíquias, unidades, ordens e mapas não mudaram. A ordem continua `ironbound` em todo o código e nos saves; só o texto exibido mudou.
- Relíquias novas usam IDs novos; uma run antiga carregada simplesmente não as terá.

## 7. Telas a ajustar (especificação)
1. **Bolsa de relíquias:** conferir o desenho dos formatos novos (diagonal 2/3, ponte, linha 4, cruz, U, escada, cavalo) e o Medalhão em **dominó**.
2. **Loja/recompensas:** as 6 relíquias que mudaram de raridade (Estandarte e Pedra vital incomuns; Espada, Medalhão, Placas e Marca comuns) e o preço novo.
3. **Combate:** o rótulo **EVADE** (esquiva das Botas) e o rótulo **SLING** (Funda); conferir que não poluem a tela.
4. **Árvore:** a janela na derrota (texto "última chance de gastar o XP desta run").
5. **Nome Grand Union** em todas as telas que mostram o nome da ordem (mapa, coleção, progressão, filtros).

## 8. Possíveis conflitos com o desenvolvimento paralelo
- Qualquer mudança no laço de combate de `game-0.js` (trecho de `skillReady`/`activate`) ou na função `hit`: **combine as intenções** e mantenha `skillValid` e a chamada de `evade`.
- Novas unidades com habilidade ativa precisam de uma linha em `SKILL_RULES`; sem ela, disparam do jeito antigo.
- Novos ganchos em `JourneyTraits` (`damage`, `reduction`, `beforeStep`...): `relics-r3.js` os envolve; carregar depois dele quebra a cadeia se o arquivo novo sobrescrever sem chamar o anterior.
- Mudanças nos dados de relíquias em `game-0.js`/`content-v53.js`: os textos finais vêm de `relics-r3.js` (tabela `TEXT`).

## 9. Testes após integrar
Não foram executados neste checkpoint (decisão do Carlos). Quando integrar:
1. `node scripts/validate-balance-base.cjs`.
2. `node tests/relics-r3.cjs`, `escada-r3.cjs`, `defeat-window-r3.cjs`, `tree-rings-r3.cjs`, `systems-v18.cjs`, `content-v53.cjs` (os 4 primeiros usam o simulador `balance/sim/` do repositório de balanceamento; sem ele, trocar `playRun` pelo equivalente do projeto).
3. **QA manual:** uma run com cada relíquia nova de mecânica (Botas, Paciência, Selo, Tomo, Totem, Bandeira, Placas); conferir que habilidades não disparam longe do inimigo; textos PT/EN; nome Grand Union.

## 10. Testes antigos que mudaram (só expectativas)
| Teste | O que mudou |
|---|---|
| `systems-v18` | Ampulheta lê o valor da tabela (`JOURNEY_RELIC_TUNE.hourglass`) |
| `content-v53` | Ídolo, Coração colossal e Espada leem os valores da tabela |
| `challenges-p5`, `advantages-p5` | valores recalibrados de 08/11 |
| `tree-v51` | custos por anel |
| `auras-r3`, `balance-p2` | cura dos suportes em % da vida de quem cura |
| `bosses-v50` | True Bosses recalibrados |

## 11. Mensagem pronta para enviar ao ChatGPT

> Segue o checkpoint **GJ-v50-BAL-CP4** do balanceamento feito no Claude, sobre o **CP3** (publicação 50, commit aed07ed41c8a002ab1d149882e068b7a7f6c4415). Ele traz:
> - **43 relíquias** (25 revistas + 18 novas), com categorias, formatos novos, raridades e efeitos definidos por mim em 10/11, num módulo novo `dist/relics-r3.js` (1 tag nova no `index.html`);
> - a **ativação de habilidade com alvo válido**: com a carga cheia, a habilidade só dispara se houver alvo; senão a unidade guarda a carga;
> - a **escada de dificuldade** por barreira, raids e Titã, os **True Bosses** recalibrados, a **árvore** com custo por anel e janela na derrota, a **cura dos suportes** em % da vida de quem cura e **Desafios/Vantagens** recalibrados;
> - o nome da ordem Ironbound passa a ser **Grand Union** na tela (IDs continuam `ironbound`).
>
> Antes de integrar, **compare com o código atual do projeto**, que pode ter mudado em paralelo. Aplique por trecho, conforme `INTEGRACAO_CHATGPT_CP4.md`, usando `checkpoint_CP4_vs_CP3.patch` (ou o `_vs_v50` se o CP3 ainda não estiver integrado). Não substitua arquivos inteiros às cegas e preserve IDs, saves e o que foi desenvolvido depois. As mudanças **não foram testadas** neste checkpoint: rode os testes da seção 9 depois de integrar e me avise do que falhar.
>
> As telas estão especificadas na seção 7. O que está em `PENDENCIAS_CP4.md` **não** deve ser aplicado. **Não publique** sem minha autorização. Ao terminar, me informe o que integrou, os conflitos encontrados e como resolveu.
