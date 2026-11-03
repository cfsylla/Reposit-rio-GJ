# Validação do checkpoint GJ-v54-BAL-CP2

A validação foi rodada na **cópia balanceada `game/`**, que é idêntica ao resultado de aplicar `checkpoint_CP2_vs_v54.patch` numa v54 limpa. Isso foi conferido arquivo por arquivo.

**Ambiente:** Node v22.23.4, Linux, 03/11/2026. **Sem as mídias da v54** (`dist/assets`, cerca de 191 MB), que não estão no repositório de trabalho.

## 1. Validação oficial
`node scripts/validate-balance-base.cjs`: **PASS nas 10 etapas.** Log em `validate-balance-base_CP2.log`.

As 10 etapas:
1. P1/P2;
2. P3;
3. P4 (com a curva do CP2);
4. traits-v54;
5. content-v53;
6. fixes-v52;
7. tree-v51 (expectativas do CP2);
8. **Desafios da Jornada e modelo de nível** (novo);
9. **Vantagens e XP excedente** (novo);
10. bosses-v50.

## 2. Suíte completa
Cada teste roda num processo próprio, com limite de 600 s. Mesmo método do CP1:
`timeout 600 node -r ./dist/game-0.js -r ./dist/balance-p1.js -r ./dist/decks-p3.js -r ./dist/enemy-decks-p4.js tests/<teste>.cjs`

**Resultado: 48 testes, 33 passam e 15 falham.** Log em `suite_completa_CP2.log`. Nenhuma falha é causada pelo balanceamento.

| Teste | Falha | Já falhava no CP1? | Classificação |
|---|---|---|---|
| combat-replay-v21, legacy-replay-v37, legacy-replay-v39, revisions-v32 | `git show <commit antigo>` | Sim | **Ambiente:** dependem do histórico git original, que não vem no pacote |
| setup-v19, setup-v20-1, tutorial-guard-v23, tutorial-ui-v24, pending-v22, interface-v28 | simulação de interface (DOM) antiga | Sim | Histórico (como no CP1) |
| blackfang-v26 | supõe a loja na camada 3 do mapa | Sim | Histórico (como no CP1) |
| bosses-v50 (rodado isoladamente) | cenário fixo de 15 s | Sim | Sensibilidade do cenário fixo (como no CP1). **Passa na validação oficial** |
| **revisions-v33, roster-v37, vfx-v21** | `fs.existsSync('dist/assets/...')` | Não (passavam no CP1, que tinha as mídias) | **Ambiente: mídias ausentes.** Rodados com um substituto que finge a presença das mídias, **os 3 passam em todas as verificações** |
| raid-balance-v42 | — | No CP1 estourava o tempo (600 s) | **Agora passa** (435 s). É um relatório, sem verificações de equilíbrio |

## 3. Simulações
- **Jogador simulado:** preparo "smart" (no nível da IA do jogo), rota gulosa, eventos seguros, loja equilibrada.
- **Regras de escolha nas vantagens:**
  - Mão Planejada: escolhe a carta com mais cópias e mais valor;
  - Preparação Flexível: renova a partir da 2ª rodada quando nenhuma carta funde ou combina com o campo, ou quando não tem carta jogável;
  - Olho Treinado: renova só quando nenhuma relíquia cabe na bolsa ou todas são fracas.
- **Estados de árvore:** `cap250` (nível 25) e `cap500` (nível 50), alocados pela ordem de compra do simulador.

| Bateria | Volume | Arquivo |
|---|---|---|
| Matriz deck × avanço (níveis 0 / 25 / 50) | 2.160 runs | `Matriz_deck_x_avanco_CP2.pdf` |
| Peças sozinhas (15 desafios + 15 vantagens, nível 25) | 24 decks × 20 seeds por peça | `Posjogo_COMPLETO_v2.pdf` (fichas e matrizes) |
| Escada (carreiras pós-1ª vitória, caminhos fácil e difícil) | 48 carreiras por caminho | `Posjogo_COMPLETO_v2.pdf` |
| Limite (tudo ativo, níveis 25 e 50) | 240 runs por linha | `Posjogo_COMPLETO_v2.pdf` |
| Carreiras do jogo base (1ª vitória e nível 50) | 48 carreiras × 40 runs | `CARREIRAS_CP2.md` |
| Resumo de desafios e vantagens | — | `Resumo_desafios_vantagens_FINAL.pdf` |

**Limitações:** a política simulada é mais fraca que um humano e não planeja a longo prazo. Não houve QA visual nem playtest humano. Os resultados são **indicadores** de dificuldade e **não são prova de balanceamento final.**
