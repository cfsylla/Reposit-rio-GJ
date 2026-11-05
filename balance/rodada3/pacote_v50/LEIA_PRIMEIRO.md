# Grand Journey — publicação 50 para Claude

Anexe este ZIP no Claude e peça para ler `PROMPT_PARA_CLAUDE.md` e `BRIEFING_BALANCEAMENTO.md`. Eles distinguem regras obrigatórias de propostas ainda em avaliação.

## Identificação

- Publicação Sites **50**; identificação interna **v56**.
- Commit: `aed07ed41c8a002ab1d149882e068b7a7f6c4415`.
- `fonte_v50/` contém os arquivos extraídos diretamente desse commit; hashes em `MANIFESTO_V50.json`.
- Nenhuma mudança de XP, mapa ou aura foi aplicada neste pacote ou no jogo.
- Dados históricos CP1/CP2, documentos antigos e exportador desatualizado foram omitidos para não misturar bases.

## Conteúdo e limites

Código JS/HTML/CSS publicado, scripts e testes textuais; documentação atual; loader e exportador específicos desta versão; `DADOS_V50.json` regenerável.

Artes, áudio, fontes binárias e screenshots foram omitidos: este é um pacote de balanceamento para simulação, não uma distribuição visual completa para hospedar/jogar. Referências a assets permanecem originais. Testes de existência de imagens e QA visual exigem a distribuição completa.

## Uso com Node.js 24 ou compatível

Na raiz do pacote:

```bash
node exportar_dados_v50.cjs
```

Para carregar o motor em um simulador:

```javascript
const E = require('./carregar_motor_v50.cjs');
const G = E.Game;
```

Verificações da base:

```bash
cd fonte_v50
node scripts/validate-balance-base.cjs
node tests/progression-v56.cjs
node tests/integration-cp2.cjs
```

O runner seleciona testes históricos compatíveis. Alguns testes antigos carregam apenas parte dos módulos por desenho; para novos testes, usar o loader fornecido ou a ordem atual de scripts em `dist/index.html`. Não rodar todos os testes históricos como se fossem contratos atuais. `tests/ironbound-v55.cjs` e testes de retrato exigem imagens não incluídas.

O extrato JSON não substitui o código para lógica dinâmica, gatilhos, cálculo de atributos ou simulações.

## Entrega

Produzir recomendações, simulações reproduzíveis e, se solicitado, patch por trecho contra esta fonte. Resultados do Claude não equivalem a código integrado. Implementação e publicação ficam no ChatGPT Work após aprovação do Carlos.
