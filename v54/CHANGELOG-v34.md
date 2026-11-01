# Grand Journey v34

## Tipografia
- Pixelify Sans no jogo inteiro, incluindo textos de menu, cartas, HUD, números e nomes de skills desenhados no canvas.
- Regular 400 para texto corrido e Bold 700 para títulos, nomes de cartas e botões. Pesos anteriores acima de 700 normalizados para o intervalo real da fonte.
- Fonte variável completa fornecida localmente e pré-carregada; sem requisição ao Google Fonts ao jogar. Aviso SIL OFL incluído e crédito no menu do jogo.
- Todos os caracteres acentuados em português e algarismos verificados no cmap do arquivo. Corpo regular e títulos/botões em negrito conferidos no navegador.

## Correção e padrões
- Card Cycle em três colunas também abaixo de 390px: removida a exceção que deixava as pilhas em duas colunas.
- Removida também a exceção de duas colunas dos menus meta-card-grid a 360px, mantendo coleção/custom deck/Hacks consistentes com o padrão pedido.
- Rodapés opacos da v33 preservados e conferidos depois da mudança da fonte.
- Convenções permanentes registradas no AGENTS.md para futuras alterações: menus de cartas em três colunas, rodapés opacos até a borda inferior e área segura, última linha acessível.

## Validação
- Sintaxe dos scripts alterados e git diff --check.
- Navegador: Card Cycle com três colunas de 84,33px em 360px e 107,66px em 430px, sem overflow horizontal; treino e custom deck com três colunas de 102px em 360px. Treino em PT-BR, títulos em 700 e nomes de cartas em PixelifySans. Rodapés até y=780 e última linha acessível; HUD sem overflow horizontal.
- Nenhum teste em Android físico. As regras de combate e progressão permanecem as anteriores.
