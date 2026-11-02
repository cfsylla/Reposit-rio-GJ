# Validação do checkpoint GJ-v54-BAL-CP1

Toda a validação foi rodada na **versão entregue**: uma cópia limpa da v54 (commit `9b8bff1085f72112d492fd40ffba6c1ab63011b7`) com `checkpoint_balanceamento.patch` aplicado por `git apply -p1`. As mídias são as da v54, sem alteração.

**Ambiente:** Node v22.23.4 (o pacote v54 recomenda o 24), Linux, 02/11/2026.

## 1. Validação oficial

```
node scripts/validate-balance-base.cjs
```

**Resultado:** PASS nas 8 etapas, em 11,4 s. Log em `validate-balance-base.log`.

As 8 etapas:
1. P1/P2;
2. P3;
3. P4;
4. traits-v54;
5. bosses-v50;
6. tree-v51;
7. content-v53;
8. exportação dos dados.

## 2. Suíte completa (`tests/*.cjs`)

**Comando:** cada teste em processo próprio, com limite de 600 s:

```
timeout 600 node -r ./dist/game-0.js -r ./dist/balance-p1.js -r ./dist/decks-p3.js -r ./dist/enemy-decks-p4.js tests/<teste>.cjs
```

**Resultado:** 43 testes, **33 passam e 13 falham**. Log em `suite_completa.log`.

Classificação das falhas:

| Teste | Falha | Já falhava na v54? | Classificação |
|---|---|---|---|
| combat-replay-v21, legacy-replay-v37, legacy-replay-v39, interface-v28, revisions-v32 | `git show <commit antigo>` | Sim | **Ambiente:** dependem do histórico git original, que não vem no pacote |
| setup-v19, setup-v20-1 | `classList.contains is not a function` | Sim | Simulação de interface (DOM) antiga. Histórico |
| tutorial-guard-v23, tutorial-ui-v24 | `MutationObserver is not defined` | Sim | Simulação de interface (DOM) antiga. Histórico |
| pending-v22 | `rerollButton is not defined` | Sim | Trecho de interface antigo. Histórico |
| blackfang-v26 | `s.offers` nulo | Sim | Supõe a loja na camada 3 do mapa, o que não vale desde a v43. Histórico |
| **bosses-v50** (isolado) | Cenário fixo de 15 s: a equipe de teste não chega a ferir a forma 2 de um boss | **Não** (passa na v54) | **Sensibilidade do cenário fixo.** Rodado sozinho, o teste não carrega `traits-v54` nem `supports-b`. Com os suportes da v54, que agora são passivos, e os novos valores, a equipe fixa do teste causa menos dano nesse intervalo curto. Na validação oficial, que carrega todos os módulos, o teste **passa**. Pendência: adaptar o teste antigo (ver `PENDENCIAS_BALANCEAMENTO.md`) |
| **raid-balance-v42** | Tempo esgotado (600 s) | Não | **Só tempo.** O teste roda para cada deck emprestado, e os decks passaram de 10 para 24. Rodado sem limite, terminou com sucesso (rc=0) em 10 min 31 s. Log em `raid-balance-v42_sem_limite.log`. É um relatório, sem verificações de equilíbrio |

Os testes `raid-balance-v39/41/42/45` são relatórios com equipe e escala fixas. **Não provam balanceamento.**

## 3. Simulações na versão entregue

### Matriz deck × avanço (`matriz_CP1/`)

- **Volume:** 24 decks × 20 seeds × 3 estados de árvore = **1.440 runs**.
- **Simulador:** `simulador/run.cjs`, sobre o motor real do jogo, carregado na ordem de `index.html`.
- **Jogador simulado:**
  - preparo "smart" (joga no nível da IA do jogo);
  - rota gulosa;
  - eventos seguros;
  - loja equilibrada (compra relíquias e upgrades).
- **Seeds:** 1 a 20, fixas.
- **Passo:** 1/60 s.
- **Árvores:**
  - `none` = vazia;
  - `mid25` = intermediária, 25 nós (~270 XP);
  - `full` = 60 nós.
- **Comandos:** os 72 estão em `matriz_CP1/jobs.txt`. `<v54_limpa+patch>` é a pasta da cópia.
- **Resumo:** `MATRIZ_CP1.md` e `Matriz_deck_x_avanco_CP1.pdf`.

| Árvore | Passa do mapa 1 | Passa do mapa 2 | Vence a run |
|---|---|---|---|
| Vazia | 52% | 10% | 4% |
| Intermediária | 94% | 60% | **43%** (meta 40% a 50%) |
| Completa | 98% | 92% | 83% |

Com a árvore intermediária, por deck: de 25% (Lei do Gatilho, Fortaleza, Tripulação Salgada, Peles Verdes, Galope Centauro) a 80% (Coro de Guerra).

**Para reproduzir uma linha:**

```
GJ_ROOT=<pasta da v54 com o patch> node simulador/run.cjs --decks vanguard --seeds 1-20 --events safe --shop balanced --tree mid25 --out saida.jsonl
```

Rodar a partir da raiz do repositório de trabalho, com `simulador/` em `balance/sim/`.

### Limitações

- A política simulada é mais fraca que um humano e não usa estratégias de longo prazo.
- Não houve QA visual nem playtest humano.
- Os resultados são **indicadores** de dificuldade. **Não são prova de balanceamento final.**

## 4. Evidências históricas (calibração)

Em `dados_simulacoes/`. São os dados brutos (JSONL) das baterias que embasaram as aprovações:

| Pasta | Bateria |
|---|---|
| `lab_p1b` | Laboratório de força dos personagens, com a P1 aplicada |
| `traits_p1` | Laboratório de traits, com os valores P1 |
| `final_p2` | Mecânicas P2 e suportes |
| `decks_final` | Torneio de decks, 24 × 24 × 6 seeds |
| `relic1` | Teste das regras de relíquias inimigas R0 / R1 / R2 |
| `matrix_v23` | Matriz feita na calibração: V23 **sem** a R1, ou seja, com a regra de relíquias da v54. Substituída por `matriz_CP1` |

Em `relatorios_historicos/` estão os relatórios RELATORIO_00 a 12 e os PDFs enviados durante o trabalho. São **históricos**: em caso de diferença, vale o CP1. As variantes V0 a V22 aparecem nesses relatórios, mas **não** fazem parte da entrega.

`simulador/` traz os scripts usados: o motor headless, a política, as runs, os laboratórios, a matriz e os geradores de tabela. Não é código do jogo e não deve ser integrado.
