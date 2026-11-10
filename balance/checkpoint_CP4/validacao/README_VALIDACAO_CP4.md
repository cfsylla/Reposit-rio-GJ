# Validação do checkpoint GJ-v50-BAL-CP4

**Decisão do Carlos (10/11/2026):** não executar testes nem simulações; validar pelo playtest. Só foram feitas checagens que não jogam nenhuma luta.

| Checagem | Resultado |
|---|---|
| Sintaxe (`node --check`) dos 64 arquivos `.js` de `dist/` | OK, nenhum erro |
| Motor carrega na ordem do `index.html` e cria uma run | OK (43 relíquias, 94 unidades) |
| Página abre no Chromium (servidor local) | OK; os únicos erros são imagens e fontes ausentes nesta cópia do repositório (404), **iguais na v50 original**; nenhum erro de script |
| `checkpoint_CP4_vs_CP3.patch` aplicado numa cópia limpa do CP3 | arquivos idênticos ao CP4 |
| `checkpoint_CP4_vs_v50.patch` aplicado numa cópia limpa da v50 | arquivos idênticos ao CP4 |
| `arquivos_alterados/` | idênticos à cópia de teste `game_r3/` |

**Não executado:** suíte de testes (`tests/`), `validate-balance-base.cjs`, carreiras, laboratórios de relíquias, bosses e qualquer simulação.
Última execução da suíte (09/11, antes das definições de 10/11): 18 falhas, as mesmas da v50.

Registro completo: `checagens_CP4.log`.
