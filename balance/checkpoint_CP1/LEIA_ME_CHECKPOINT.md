# LEIA-ME: checkpoint de balanceamento GJ-v54-BAL-CP1

| Campo | Valor |
|---|---|
| Identificador | **GJ-v54-BAL-CP1** (checkpoint 1 do balanceamento). **Não** é número de versão do jogo |
| Data | 02/11/2026 |
| Base | Grand Journey **v54**, commit `9b8bff1085f72112d492fd40ffba6c1ab63011b7` |
| Tipo | Entrega **parcial**: o balanceamento continua depois deste ponto |
| Repositório de trabalho do Claude | branch `claude/grand-journey-balance-idrq2n`, tag local **`bal-cp1`** |

## 1. Por onde começar

1. **Carlos:** leia `CHECKPOINT_BALANCEAMENTO.md`, que é o resumo do que mudou e do que foi medido.
2. **ChatGPT (integração):** envie a mensagem pronta da seção 9 de `INTEGRACAO_CHATGPT.md` junto com este pacote.
3. **Próxima janela do Claude:** envie este pacote e diga "continuar a partir do checkpoint GJ-v54-BAL-CP1".

## 2. Conteúdo do pacote

| Arquivo / pasta | Para que serve |
|---|---|
| `LEIA_ME_CHECKPOINT.md` | Este arquivo |
| `CHECKPOINT_CP1_resumo.pdf` | Os 4 documentos principais (LEIA-ME, CHECKPOINT, PENDÊNCIAS, INTEGRAÇÃO) num PDF para ler no celular |
| `CHECKPOINT_BALANCEAMENTO.md` | Identificação, base, resumo, regras vigentes, validação, o que foi e o que não foi revisado |
| `TABELA_ALTERACOES.md` / `.csv` | Uma alteração por linha (178 linhas), com sistema, entidade, arquivo, valor original, valor novo, tipo (design ou numérico), situação, justificativa, validação e dependências |
| `INTEGRACAO_CHATGPT.md` | Arquivos novos e alterados, ordem de carga, trechos modificados, impacto em saves, conflitos possíveis, testes e mensagem pronta |
| `PENDENCIAS_BALANCEAMENTO.md` | O que **não** deve ser aplicado: trabalho em andamento, experimentos, itens descartados, decisões em aberto |
| `Grand_Journey_Projeto_v54_CP1.md` | Documento do projeto v54 com as regras vigentes do CP1 marcadas. Os trechos antigos substituídos ficam indicados como históricos |
| `checkpoint_balanceamento.patch` | Diff completo **contra a v54 original** (24 arquivos). Aplicar na raiz do projeto com `git apply -p1 checkpoint_balanceamento.patch` |
| `arquivos_alterados/` | Os 24 arquivos já alterados, nos mesmos caminhos relativos do projeto (`dist/`, `tests/`, `scripts/`, `balanceamento/`) |
| `validacao/` | Comandos, logs, resultados dos testes e das simulações, falhas conhecidas e o simulador usado (ver `validacao/README_VALIDACAO.md`) |
| `MANIFESTO_SHA256.txt` | Hash SHA-256 de cada arquivo do pacote. Para conferir: `sha256sum -c MANIFESTO_SHA256.txt`, dentro da pasta |

Conferido: o patch, aplicado numa v54 limpa, gera arquivos **idênticos** aos de `arquivos_alterados/`. A validação e as simulações finais foram rodadas nessa cópia (v54 limpa + patch).

## 3. Dependências

- O conjunto deve entrar **inteiro**. P4 foi calibrado em cima de P1, P2 e P3, e os testes novos verificam os 4 juntos.
- Os 4 módulos novos de `dist/` precisam das tags `<script>` em `dist/index.html`, na ordem descrita em `INTEGRACAO_CHATGPT.md`, seção 4.
- Não há dependência de arte, tradução geral, interface ou hospedagem. Nenhum arquivo foi removido ou renomeado, e nenhum ID foi alterado.

## 4. Continuidade

- Este checkpoint é o **ponto de referência** para a próxima entrega. A próxima mostrará somente o que mudar **depois** do GJ-v54-BAL-CP1, com uma comparação contra este pacote, além do diff acumulado contra a v54.
- Documentos anteriores ficam como **histórico** e são substituídos por este pacote:
  - `PACOTE_BALANCEAMENTO_P1-P4` e `Grand_Journey_balanceamento_P1-P4.zip`;
  - relatórios `RELATORIO_00` a `RELATORIO_12` e seus PDFs.

  Em caso de diferença, vale o CP1.
- O envio ao GitHub continua bloqueado nesta sessão (erro 403). Para continuar o trabalho numa janela nova, guarde também o arquivo de backup da sessão (`Backup_sessao_balanceamento_CP1.zip`), que contém o histórico completo do repositório de trabalho.
