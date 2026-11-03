# LEIA-ME: checkpoint de balanceamento GJ-v54-BAL-CP2

| Campo | Valor |
|---|---|
| Identificador | **GJ-v54-BAL-CP2**, checkpoint 2 do balanceamento. **Não** é número de versão do jogo |
| Data | 03/11/2026 |
| Base | Grand Journey **v54** (commit `9b8bff1085f72112d492fd40ffba6c1ab63011b7`) + **GJ-v54-BAL-CP1** |
| Repositório de trabalho | `cfsylla/Reposit-rio-GJ`, branch `claude/continue-previous-work-ccibom` |

## 1. Por onde começar
1. **Carlos:** leia `CHECKPOINT_CP2.md`, que resume o que mudou e o que foi medido.
2. **ChatGPT (integração):** envie a mensagem pronta da seção 10 de `INTEGRACAO_CHATGPT_CP2.md` junto com este pacote.
3. **Próxima janela do Claude:** diga "continuar a partir do checkpoint GJ-v54-BAL-CP2". O histórico completo está no GitHub, na branch acima.

## 2. Conteúdo do pacote

| Arquivo / pasta | Para que serve |
|---|---|
| `LEIA_ME_CP2.md` | Este arquivo |
| `CHECKPOINT_CP2_resumo.pdf` | Os 4 documentos principais num PDF, para ler no celular |
| `CHECKPOINT_CP2.md` | Resumo, metas e resultados, regras vigentes, validação, o que foi e o que não foi revisado |
| `TABELA_ALTERACOES_CP2.md` / `.csv` | Uma alteração por linha (73), sempre comparada ao CP1 |
| `INTEGRACAO_CHATGPT_CP2.md` | Arquivos, ordem de carga, trechos modificados, impacto em saves, especificação das telas, conflitos possíveis, testes e mensagem pronta |
| `PENDENCIAS_CP2.md` | O que **não** deve ser aplicado: conteúdo a cargo do projeto principal, playtest, experimentos e decisões |
| `checkpoint_CP2_vs_CP1.patch` | Só o que mudou depois do CP1 (17 arquivos). Use este se o CP1 já está integrado |
| `checkpoint_CP2_vs_v54.patch` | Diff acumulado contra a v54 original (31 arquivos) |
| `arquivos_alterados/` | Os arquivos finais, nos mesmos caminhos do projeto (`dist/`, `tests/`, `scripts/`, `balanceamento/`) |
| `validacao/` | Logs dos testes, README da validação e os PDFs das simulações (matriz deck × avanço, relatório completo do pós-jogo, resumo de desafios e vantagens) |
| `MANIFESTO_SHA256.txt` | Hash SHA-256 de cada arquivo. Para conferir, rode `sha256sum -c MANIFESTO_SHA256.txt` dentro da pasta |

**Conferido:** os dois patches, aplicados numa v54 limpa e no CP1 limpo, geram arquivos **idênticos** aos de `arquivos_alterados/`.

## 3. Dependências
- O conjunto deve entrar **inteiro**. A curva foi calibrada junto com a árvore, e os desafios e vantagens foram calibrados sobre os dois.
- Os 2 módulos novos (`challenges.js` e `advantages.js`) precisam das tags `<script>` em `dist/index.html`, logo depois de `supports-b.js`.
- Nenhum arquivo foi removido ou renomeado e nenhum ID foi alterado.

## 4. Continuidade
- Este checkpoint é o **ponto de referência** para a próxima entrega. O CP1 fica como histórico.
- Em caso de diferença entre documentos, vale o CP2.
