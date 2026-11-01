# Grand Journey v54 — projeto completo para balanceamento

Criador/game designer: Carlos Felipe Sylla. Exportado em 01/11/2026.
Base exata: commit `9b8bff1085f72112d492fd40ffba6c1ab63011b7`, conteúdo v54, hospedagem versão42.

Este é o código integral da versão publicada, com HTML, JavaScript legível/editável, CSS, imagens, sprites, fontes, músicas, testes e documentos. Não existe um projeto Godot ou fonte TypeScript separado a compilar: os próprios arquivos em `dist/` são o código-fonte entregue ao navegador. A divisão `game-0.js` a `game-10.js` e módulos adicionais é a organização real atual. Não renomeie/reconstrua tudo antes de analisar.

## Começar

1. Extraia o ZIP inteiro em uma pasta.
2. Abra a pasta `Grand_Journey_v54_Completo` no Claude Code.
3. Peça que leia `CLAUDE.md`, este arquivo e `Grand_Journey_Projeto_v54.md`.
4. O prompt pronto está em `PROMPT_CLAUDE.md`.

## Abrir o jogo localmente

Na raiz extraída, execute:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

No Windows, se necessário, substitua `python3` por `py`.
Abra `http://127.0.0.1:8000/` no navegador e pressione START para habilitar áudio/iniciar.
Não exige login ChatGPT, credenciais Sites, conta de hospedagem nem serviço remoto para executar o jogo local. O login do site publicado pertence à hospedagem e não faz parte do código estático.
Use um servidor HTTP local: abrir index.html por file:// não é a forma de verificação recomendada.
Perfil e progresso locais usam armazenamento do navegador, independente do site publicado. O pacote não contém saves pessoais, convidados ou credenciais.

## Testes sem navegador

Recomendação de referência: Node.js24 (runtime usado nesta exportação). Python3 só é necessário para o servidor local. Os testes selecionados usam módulos nativos do Node, sem npm install.

```sh
node scripts/validate-balance-base.cjs
```

O comando roda suites relevantes em processos separados. Algumas suites históricas têm pressupostos de versões antigas; não basta executar todos os testes com todos os módulos indiscriminadamente. O runner informa como carrega o teste de bosses sem o fluxo posterior de compra na árvore, e o de árvore com os módulos v54.
Testes de comportamento não demonstram que os números estejam equilibrados. Há fixtures com recursos artificiais e vitórias forçadas para testar fluxo; não use essas fixtures como evidência de dificuldade de runs reais.

## Dados de apoio

`balanceamento/dados_base_v54.json` exporta os registros atuais de personagens, traits, skills, relíquias, eventos, árvore, bosses/raids e configurações de atos/decks. Funções/probabilidades dinâmicas e a resolução real permanecem no código; o JSON não é um simulador substituto.

```sh
node scripts/export-balance-data.cjs
```

Depois de mudar valores em uma cópia de trabalho, esse comando atualiza o JSON para comparação. Guarde o original do ZIP intacto ou faça um commit inicial local.

## Onde procurar

- `dist/game-0.js`: dados e núcleo, deck/mão/energia, stats, IA, combate, skills, loja e progressão de perfil.
- `dist/traits-v54.js`: 29 traits, distribuição dos 77 personagens, mecânicas e nerfs individuais.
- `dist/content-v53.js`: cartas negativas, cinco relíquias adicionais e revisão dos 22 eventos/decisões.
- `dist/tree-data.js`, `tree-engine.js`: nodes, links, custos, XP e bônus permanentes.
- `dist/acts-engine.js`, `map-variety.js`: três atos, escalas, rotas e sorteio horizontal.
- `dist/raid-engine.js`, `monster-engine.js`, `boss-engine.js`: raids, nove espécies, líderes e transformações.
- `dist/training-engine.js`: treino isolado. `journey-debug.js`: hacks, que não representam economia real.
- `dist/index.html`: ordem de carga autoritativa de todos os scripts/UI.
- `dist/assets/`, `art-source/`: mídias e referências do projeto, com licenças distribuídas preservadas.
- `tests/`: testes reais. `docs/`: registros históricos de validação.
- `Grand_Journey_Projeto_v54.md`: documento vigente. Documentos v26–v36/roster-v37 e changelogs são históricos, não sobrepõem a v54.
- `MANIFESTO_SHA256.json`: hashes dos arquivos exportados e das instruções; permite comparar com a base original.

## Escopo paralelo

Não editar/publicar o site principal. Propor alterações inicialmente; após aprovação de Carlos, alterar somente esta cópia. Devolver tabela de parâmetros, diff e comandos/resultados reproduzíveis. Preservar IDs e saves. Mudanças de interface pedidas após a v54 (ícones exclusivos, efeito do trait em fonte maior e texto genérico menor) ainda não fazem parte desta base: estão pendentes de implementação aqui e não pertencem ao escopo de balanceamento.


Capturas internas de QA foram omitidas; todos os códigos, testes e assets de execução foram preservados.
