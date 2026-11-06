# LEIA-ME: checkpoint de balanceamento GJ-v50-BAL-CP3

| Campo | Valor |
|---|---|
| Identificador | **GJ-v50-BAL-CP3**, checkpoint 3 do balanceamento. **Não** é número de versão do jogo |
| Data | 07/11/2026 |
| Base | Grand Journey **publicação 50** (commit `aed07ed41c8a002ab1d149882e068b7a7f6c4415`, identificação interna v56), que já contém o CP2 integrado |
| Repositório de trabalho | `cfsylla/Reposit-rio-GJ`, branch `ccr-189ed62b-9mch05` (cópia de teste `game_r3/`; a v50 intacta está em `v50/`) |

## 1. Por onde começar
1. **Carlos:** leia `CHECKPOINT_CP3.md` (ou `CHECKPOINT_CP3_resumo.pdf` no celular).
2. **ChatGPT (integração):** envie a mensagem pronta da seção 11 de `INTEGRACAO_CHATGPT_CP3.md` junto com este pacote.
3. **Próxima janela do Claude:** diga "continuar a partir do checkpoint GJ-v50-BAL-CP3". O histórico completo está na branch acima.

## 2. Conteúdo do pacote

| Arquivo / pasta | Para que serve |
|---|---|
| `LEIA_ME_CP3.md` | Este arquivo |
| `CHECKPOINT_CP3_resumo.pdf` | Os 4 documentos principais num PDF |
| `CHECKPOINT_CP3.md` | Resumo, metas e resultados, regras vigentes, validação, o que foi e o que não foi revisado |
| `TABELA_ALTERACOES_CP3.md` / `.csv` | Uma alteração por linha (51), sempre comparada à v50 |
| `INTEGRACAO_CHATGPT_CP3.md` | Arquivos, trechos modificados, saves, telas, conflitos possíveis, testes e mensagem pronta |
| `PENDENCIAS_CP3.md` | O que **não** deve ser aplicado: decisões em aberto, conteúdo a cargo do projeto principal, playtest |
| `checkpoint_CP3_vs_v50.patch` | Diff contra a publicação 50 (15 arquivos) |
| `arquivos_alterados/` | Os arquivos finais nos mesmos caminhos do projeto (`dist/`, `tests/`) e `balanceamento/` (dados exportados e exportador) |
| `validacao/` | Logs dos testes, README da validação e PDFs das simulações |
| `MANIFESTO_SHA256.txt` | Hash SHA-256 de cada arquivo. Conferir com `sha256sum -c MANIFESTO_SHA256.txt` dentro da pasta |

**Conferido:** o patch, aplicado numa cópia limpa da publicação 50, gera arquivos **idênticos** aos de `arquivos_alterados/` (e à cópia de teste `game_r3/`).

## 3. Dependências
- O conjunto deve entrar **inteiro**: a dificuldade foi calibrada com o modelo de XP, a janela da árvore, o custo do 2º anel, os bosses, as auras e os decks juntos; desafios e vantagens foram medidos sobre tudo isso.
- Nenhum arquivo novo em `dist/`; nenhuma tag nova em `index.html`; nenhum arquivo removido ou renomeado; nenhum ID alterado.
- Saves antigos: decisão do Carlos de ignorar (só ele faz playtest). Os nós comprados são mantidos; nenhum saldo de XP é reconstruído.

## 4. Continuidade
- Este checkpoint é o **ponto de referência** para a próxima entrega. CP1 e CP2 ficam como histórico.
- A proposta de **economia permanente** (`balance/rodada3/economia/PROPOSTA_ECONOMIA_R3.md`) **não** faz parte deste pacote: está em decisão.
