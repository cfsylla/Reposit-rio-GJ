# LEIA-ME: checkpoint de balanceamento GJ-v50-BAL-CP4

| Campo | Valor |
|---|---|
| Identificador | **GJ-v50-BAL-CP4**, checkpoint 4 do balanceamento. **Não** é número de versão do jogo |
| Data | 10/11/2026 |
| Base | **CP3** (GJ-v50-BAL-CP3, 07/11/2026), que por sua vez é a **publicação 50** (commit `aed07ed41c8a002ab1d149882e068b7a7f6c4415`, identificação interna v56) + CP3 |
| Repositório de trabalho | `cfsylla/Reposit-rio-GJ`, branch `ccr-fc0114d7-9l2urp` (cópia de teste `game_r3/`; a v50 intacta está em `v50/`) |
| Objetivo | **Playtest do Carlos.** As mudanças de 10/11 (relíquias, ativação de habilidade, mecânicas novas) não foram testadas nem simuladas, por decisão do Carlos |

## 1. Por onde começar
1. **Carlos:** leia `CHECKPOINT_CP4.md` (ou `CHECKPOINT_CP4_resumo.pdf` no celular).
2. **ChatGPT (integração):** envie a mensagem pronta da seção 11 de `INTEGRACAO_CHATGPT_CP4.md` junto com este pacote.
3. **Próxima janela do Claude:** diga "continuar a partir do checkpoint GJ-v50-BAL-CP4". O histórico completo está na branch acima.

## 2. Conteúdo do pacote

| Arquivo / pasta | Para que serve |
|---|---|
| `LEIA_ME_CP4.md` | Este arquivo |
| `CHECKPOINT_CP4_resumo.pdf` | Os 4 documentos principais num PDF |
| `CHECKPOINT_CP4.md` | Resumo, o que mudou, regras vigentes, o que não foi medido, roteiro de playtest |
| `TABELA_ALTERACOES_CP4.md` / `.csv` | Uma alteração por linha (79), sempre comparada ao CP3 |
| `INTEGRACAO_CHATGPT_CP4.md` | Arquivos, trechos modificados, saves, telas, conflitos possíveis, testes e mensagem pronta |
| `PENDENCIAS_CP4.md` | O que **não** deve ser aplicado e as decisões em aberto |
| `checkpoint_CP4_vs_CP3.patch` | Diff contra o CP3 (18 arquivos de `dist/` e 12 de `tests/`) |
| `checkpoint_CP4_vs_v50.patch` | Diff contra a publicação 50 (CP3 + CP4 juntos) |
| `arquivos_alterados/` | Os arquivos finais nos mesmos caminhos do projeto (`dist/`, `tests/`) e `balanceamento/` (dados exportados e exportador) |
| `referencia/` | Definições das 43 relíquias (10/11) e regras de ativação das habilidades |
| `validacao/` | Registro das checagens feitas (sintaxe, carregamento, patches) e README da validação |
| `MANIFESTO_SHA256.txt` | Hash SHA-256 de cada arquivo. Conferir com `sha256sum -c MANIFESTO_SHA256.txt` dentro da pasta |

**Conferido:** os dois patches, aplicados em cópias limpas do CP3 e da publicação 50, geram arquivos **idênticos** aos de `arquivos_alterados/` (e à cópia de teste `game_r3/`).

## 3. Dependências
- O conjunto deve entrar **inteiro**: relíquias, ativação de habilidade, escada, árvore, suportes e desafios/vantagens foram montados juntos.
- **1 arquivo novo** em `dist/`: `relics-r3.js`, com **1 tag nova** no `index.html` (logo antes de `encounter-memory.js`).
- Nenhum arquivo removido ou renomeado; nenhum ID alterado (a ordem continua com ID `ironbound`; só o nome na tela virou **Grand Union**).
- Saves antigos: decisão do Carlos de ignorar.

## 4. Continuidade
- Este checkpoint é o **ponto de referência** para o playtest. CP1, CP2 e CP3 ficam como histórico.
- Os números de dificuldade medidos antes (CP3 e carreiras de 09/11) **não valem mais** para este estado: ele muda relíquias e a ativação de habilidades de todas as unidades.
- Economia permanente, Secret Boss e a medição final de Desafios e Vantagens **não** fazem parte deste pacote.
