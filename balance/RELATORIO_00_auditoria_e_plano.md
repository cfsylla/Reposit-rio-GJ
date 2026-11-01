# Grand Journey v54 — Etapa 0: auditoria, linha de base e plano da 1ª bateria

Analista: Claude (balanceamento e simulação). Data: 01/11/2026. Nenhum parâmetro do jogo foi alterado.

## 1. Conteúdo e versão confirmados

- 7 ZIPs independentes, extraídos na mesma pasta → `Grand_Journey_v54_Completo/` (574 arquivos, 196 MB).
- `MANIFESTO_SHA256.json`: `version: 54`, `source_commit: 9b8bff1085f72112d492fd40ffba6c1ab63011b7`.
  **572/572 arquivos conferem byte a byte.** Nenhum faltante, nenhum divergente. Os únicos extras são o próprio manifesto e `LEIA_ME_7_PARTES.md`.
- `dist/index.html`: título “Grand Journey v54”, todos os scripts com `?v=54` (exceto `vfx-data.js?v=21`, histórico e coerente com o arquivo). Todos os 43 scripts referenciados existem.
- Ordem de carga do motor (scripts não-UI): `game-0 → training-engine → raid-engine → monster-engine → acts-engine → boss-engine → map-variety → tree-data → tree-engine → journey-debug → content-v53 → traits-v54 → map-notes → cycle-data → …` Os módulos posteriores **envolvem** funções do `Game` (ex.: `acts-engine` envolve `fresh/enter/finish`, `tree-engine` envolve `createBattle/buy/recruit/shopService`). Por isso o harness carrega exatamente essa ordem.
- Contagens conferidas no motor: 77 personagens, 25 relíquias, 10 decks emprestados, 4 decks inimigos genéricos, 29 traits.
- Repositório de trabalho: commit `06b97df` = v54 intacta (código, documentos, testes, scripts). Mídias binárias (191 MB) não versionadas; continuam idênticas no ZIP e verificáveis pelo manifesto.

## 2. Testes

Node local: **v22.23.4** (pacote recomenda 24). A validação selecionada passou integralmente:

```
node scripts/validate-balance-base.cjs   → PASS nas 5 etapas (8,8 s)
```

Suite histórica completa (cada teste em processo próprio, `tests/*.cjs`): **32 passam, 11 falham.** Classificação das falhas:

| Teste | Falha | Classificação |
|---|---|---|
| combat-replay-v21, legacy-replay-v37, legacy-replay-v39, interface-v28, revisions-v32 | `git show <commit antigo>` | **Limitação de ambiente**: dependem do histórico git original, ausente no pacote. Não é bug. |
| setup-v19, setup-v20-1 | `target.classList.contains is not a function` | Mock de DOM antigo; UI evoluiu. Histórico. |
| tutorial-guard-v23, tutorial-ui-v24 | `MutationObserver is not defined` | Mock de DOM antigo. Histórico. |
| pending-v22 | `rerollButton is not defined` | Extrai trecho de UI que hoje usa função nova. Histórico. |
| blackfang-v26 | `s.offers` nulo | Supõe loja na camada 3 do mapa (pré-variação de mapa v43). Histórico. A regra Blackfang que o teste quer verificar foi reproduzida à parte e se mantém. |

Os testes `raid-balance-v39/41/42/45` passam, mas são **relatórios** com equipe fixa/escala fixa, não asserções de equilíbrio (confirmam a ressalva do pacote).

## 3. Mapa de sistemas → código (parâmetros ajustáveis)

| Sistema | Arquivo / função | Parâmetros principais |
|---|---|---|
| Unidades (77) | `game-0.js` `UNITS`, `stats()` | hp, atk, defense, rate, speed, crit, range, area, cost, rarity, trigger/charge |
| Skills | `game-0.js` `activate()`, `SKILL_TRIGGERS`, `skillLimit()`; nerfs v54 em `traits-v54.js` `nerfs` | multiplicadores, durações, intervalos mínimos |
| Upgrade/fusão | `upgradeBonus()` (+10%/+25%), `FUSION_BONUS=.75`, `fuse()` | |
| Energia/campo | `energyIncome()`, `maxUnits()`, `refreshHand()`, `refund()` | renda 5/4/5/6/7/r+2, campo 2…6 |
| Traits (29) | `traits-v54.js` `D`, `assignments`, hooks | valores por patamar |
| IA inimiga | `game-0.js` `makeAI()`, `aiValue()`, `enemies()` | níveis por etapa, decks, `boostedTypes` |
| Escala inimiga | `createBattle()` `scale=(.86+min(8,etapaLocal-1)*.02)*poder` ; `acts-engine` `SPEC.power` 1/1.12/1.25 | |
| Relíquias inimigas | `enemyRelicPool()`, `rollEnemyRelics()` (33% por oportunidade) | |
| Ouro | `battleReward()` 10/12/14, `rewardGold()`, `price()`, `rerollOffers()` (5) | |
| Eventos/maldições | `content-v53.js` `options/accept/recruitPrice/upgradePrice/unitValue` | custos, chances |
| Relíquias (25) | `game-0.js` `ARTIFACTS`, `RELIC_FORMATS`; 5 novas em `content-v53.js` | preço, formato, efeito |
| Árvore | `tree-data.js` (60 nodes), `tree-engine.js` | custos XP, efeitos |
| Atos/mapa | `acts-engine.js` `SPEC`, `generate()`; `map-variety.js` | camadas, elites 24%, ordens |
| Raids | `raid-engine.js` `CONFIG/SPECS/scaling()`, `monster-engine.js` | HP/dano/minions por posição |
| Bosses | `boss-engine.js` `D` | 11 bosses, formas |

## 4. Método: harness de simulação sobre o motor real

Criado em `balance/sim/` (não toca em `v54/`; `GJ_ROOT` aponta para a cópia a testar):

- `engine.cjs` — carrega os módulos reais na ordem do `index.html`.
- `policy.cjs` — políticas explícitas do jogador. Toda ação passa pela API do jogo (`deploy`, `transfer`, `refreshHand`, `buy`, `shopService`, `enter`, `commitBag`, `C.accept`…), então energia, mão, banco, fusão, limite de 4 cópias, formato da bolsa e preços são impostos pelo próprio jogo. Nenhuma política lê ordem de compra, mão inimiga ou rolagens futuras.
  - preparo `basic` (como a IA normal), `smart` (completa patamares, prioriza fusão, garante linha de frente, recicla mão travada), `ai-normal`/`ai-elite` (réplica da heurística do próprio jogo, só para calibrar).
  - rota `greedy` / `safe` / `order` / `random`; eventos `decline` / `safe` / `risk` / `first`; árvore `none` / `intermediate` / `advanced`.
- `run.cjs` — run completa: perfil novo por run, `G.fresh(deck, seed)`, mapa, lutas (`createBattle → step(1/60) → finish → nextRound`), loja, recrutamento, upgrade, relicário, eventos, sessão de árvore após boss, transição de ato. Grava JSONL por run/luta.
- `mirror.cjs` — calibração em modo Treino (mesmo deck dos dois lados).
- `summarize.cjs` — tabelas.
- Opção `--forcewin 1` = **fixture**: registra o resultado real de cada rodada, mas trata a rodada como vencida para a run continuar. Serve só para observar exposição (inimigos e economia em etapas tardias); **nunca** como taxa de vitória.

Custo medido: ~0,2–3 s por run completa → ~3.000 runs/hora em 4 núcleos. Viável fazer amostras grandes.

**Calibração da política (Treino, espelho, 10 decks × 30 seeds, elite, nível 0):** taxa de vitória de rodada do jogador — smart 73,6%, basic 73,3%, réplica da IA elite 73,0%, réplica da IA normal 77,0% (o treino elite escala o inimigo em 0,92, daí >50%). Conclusão: as políticas atuais jogam **no nível da IA do jogo**, não abaixo. Um jogador humano competente deve jogar melhor; portanto taxas absolutas desta política são **limite inferior**. Uma política mais competente faz parte da bateria 1.

## 5. Piloto (validação do método — não é o diagnóstico)

Amostras pequenas, uma política (smart/greedy/decline/sem árvore). Servem para validar o harness e orientar a bateria; números serão refeitos com amostra maior e mais políticas.

**P1 — 200 runs reais (10 decks × seeds 1–20).** Nenhuma vitória; 5% concluíram o mapa 1. Perda na 1ª luta do mapa 1 por deck: astral 19/20, arcane 13/20, fortress 9/20, … balanced 1/20, fireline 0/20.

**P2 — 100 runs fixture `--forcewin` (10 × seeds 1–10)**, taxa REAL de vitória por rodada:

| Ato | Batalha normal | Elite comum | Ordem Blackfang | Ordem Dawncrest | Boss |
|---|---|---|---|---|---|
| 1 | 54% | 60% | 78% | 65% | 19% |
| 2 | **28%** | 48% | 69% | 50% | 24% |
| 3 | 33% | 57% | 67% | 58% | 25% |

(Raids excluídas desta tabela: o fixture não representa raid.) Batalha normal por deck no ato 1: fireline 92%, balanced 66%, corsair 65%, vanguard 64% … arcane 27%, astral 17%.

### Hipóteses que o piloto levantou (a confirmar na bateria 1)

1. **Níveis inimigos usam etapa global, escala usa etapa local.** `makeAI` usa `stage = s.mapBattles` (acumulado na run), enquanto `createBattle` usa `localStage` do ato. Resultado medido: a partir da 1ª luta do mapa 2 todo inimigo normal já tem 14 cartas L1 + 6 L2 (máximo da tabela), e isso não muda até o fim. Com o ouro real, o jogador da política tinha ~5 L1/0,2 L2 nesse ponto. Também a recompensa de ouro (`battleReward(s.mapBattles)`) trava em 14 a partir do mapa 2. **Não documentado; precisa da sua confirmação se é intencional** → classificado como *inconsistência a confirmar*, não corrigido.
2. **Elites mais fáceis que batalhas normais nos atos 2–3.** Elites só melhoram `boostedTypes` (≈1/3 dos tipos) para L1 e nunca L2; normais recebem o upgrade total acima. A relação esperada (elite > normal) se inverte.
3. **Relíquias inimigas legadas: `enemyRelicPool()` filtra scope/tome/boots/shield pelos nomes antigos (`Atirador`, `Arcano`, `Ágil`, `Defensor`).** Com os traits v54 essas 4 relíquias **nunca** são dadas a inimigos. O documento (§5.5) diz que as relíquias foram adaptadas. → *provável bug de implementação* (efeito pequeno, mas real).
4. **`relicOpportunities` cresce ao *ver* uma opção de relíquia**, não ao escolhê-la, e acumula na run inteira: elites/bosses do ato 3 chegam com ~2,5–2,8 relíquias em média. Não documentado; anotar como parâmetro.
5. **Abertura de decks caros.** arcane/astral (custo médio 3,35, 9 cartas de custo 4) normalmente posicionam 1 unidade na rodada 1 (energia 5, campo 2) contra 2 unidades baratas. Precisa de uma política que poupe energia para separar “problema do deck” de “problema da política”.
6. A política gastou quase todo o ouro em upgrades (242 de 320 por run no fixture) e nunca comprou relíquia na loja — é viés da política de loja, será variado.

## 6. Limitações atuais

- Política de rota míope (só a próxima camada); eventos ainda só `decline` no piloto.
- Raids no fixture `--forcewin` não são válidas (vencer “à força” encerra o chefe); raids serão medidas apenas em runs reais e no confronto completo isolado.
- Sem política humana “especialista”; resultados absolutos são limite inferior.
- Node 22 em vez de 24 (validação passou; sem diferença observada).

## 7. Plano da bateria 1 (próxima etapa, sem alterar valores)

Ordem pedida: análise estática → mecânicas → rodadas → confrontos → raids → runs. Amostras-alvo e seeds fixos (registrados no JSONL):

1. **Estática** — tabelas dos 77 (custo, raridade, DPS bruto, EHP por defesa, alcance, gatilho, tempo até 1º especial com e sem velocidade de ataque), traits por número de portadores e custo de ativação, decks (curva de custo, sinergias acessíveis), relíquias por célula ocupada, árvore (valor por XP), eventos vs. preço de loja (custo de oportunidade).
2. **Mecânicas isoladas (fixtures identificadas)** — loops de escudo/cura/bloqueio dos 18 personagens do §6 e de bosses; controle encadeado; aceleração de especial por velocidade de ataque (bell, boots, árvore, Shaman, Feiticeiro Meowri).
3. **Rodadas** — duelos 1×1 e 3×3 por função (tanque, dano corpo-a-corpo, alcance, área, suporte) em níveis 0/1/2/fusão, com e sem trait ativo: unidade de valor por custo e por vaga. ~77×6 cenários × 20 seeds.
4. **Confrontos** — matriz deck×deck no treino (10×10×30) e deck × etapa de inimigo real (normal/elite/ordem/boss por ato) com estados de jogador reconstruídos a partir das runs reais.
5. **Raids completas** — 9 espécies × 3 posições (1ª/2ª/boss) × ato × deck, com o jogador desenvolvendo o deck entre rodadas (mão, energia, fusões), 20 seeds.
6. **Runs** — 10 decks × 3 perfis de árvore × 3 políticas de rota × 3 de eventos × 2 de loja, 50 seeds cada célula prioritária (~3–5 mil runs), mais uma política “competente” (poupa energia para abrir com 2 unidades, escolhe rota com olhar de 2 camadas, compra relíquia quando cabe e o ganho por ouro supera upgrade).

Métricas: vitória/derrota/empate por rodada e confronto, duração, sobreviventes, dano/cura/escudo efetivo (usando `recordBattleStats`), energia recebida/gasta/sobrando, ouro por fonte e destino, níveis/fusões/patamares por etapa, causa e etapa da derrota, desagregado por deck, adversário e perfil.

## 8. Decisões que preciso de você

1. **Item 5.1**: o uso de `mapBattles` acumulado para os níveis das cartas inimigas e para o ouro de batalha é intencional? (Se não for, é a candidata nº 1 para a queixa “o final ficou excessivamente difícil” — mas só proporei ajuste depois de medir.)
2. **Metas de dificuldade** (não vou assumir sozinho). Sugestão para validarmos depois da bateria 1: probabilidade de vencer a run para uma política competente sem árvore ~10–20%, perfil intermediário ~25–35%, avançado ~40–55%; nenhum deck emprestado abaixo de metade da média; nenhuma batalha normal mais difícil que a elite do mesmo ato.
3. Posso tratar a correção do item 5.3 (nomes legados no filtro de relíquias inimigas) como **bug** a propor na tabela de ajustes, separado de balanceamento?

## Reprodução

```sh
node v54/scripts/validate-balance-base.cjs                         # linha de base
node balance/sim/mirror.cjs --prep smart --difficulty elite --seeds 1-30
balance/sim/batch.sh balance/out/b1 1-20 --prep smart --route greedy --events decline
balance/sim/batch.sh balance/out/fx1 1-10 --prep smart --route greedy --events decline --forcewin 1   # fixture
node balance/sim/summarize.cjs balance/out/b1/all.jsonl
```
