# Grand Journey v33

## Correções
- Retrato do Orc Berserker reexportado da imagem enviada, com novo caminho versionado. Referências de runtime e dados-fonte atualizadas. O arquivo anterior decodifica localmente; a causa exata da falha observada no Android não foi reproduzida. O novo arquivo carregou no navegador com 548 × 548 pixels.
- Rodapés do editor de treino, escolha de relíquias do treino e custom deck agora ficam em uma linha própria fora da rolagem, com fundo opaco até a borda inferior e área segura. A última linha de cartas permanece acessível. Revisão dos seletores sticky/fixed também corrigiu o fundo do rodapé da prévia de deck no modal.
- Nomes de skills no canvas respeitam EN/PT-BR também quando chegam em maiúsculas. Tradução usa as mesmas frases canônicas das informações das cartas; números e o indicador de bloqueio permanecem funcionais.

## Hacks
- Vencer rodada: encerra o combate ativo com um ponto para o jogador.
- Vencer confronto: completa as vitórias necessárias do confronto atual, respeitando três rodadas em encontros normais e quatro no boss.
- Ambos estão disponíveis durante o combate, inclusive pausado. Usam o fluxo normal de resultado, relatório, recompensas e progressão, com proteção contra execução duplicada. O dano do relatório não é inventado pelo hack.

## Validação
- tests/revisions-v33.cjs: hacks normal/boss/treino, rejeição fora do combate, recompensa apenas uma vez e os nomes das 55 skills em EN/PT-BR.
- Regressões v29, treino v31 e combate/velocidades v32 passaram; sintaxe JavaScript e git diff --check passaram.
- Navegador em iframe de 360 × 780: rodapés do treino, relíquias e custom deck até y=780, últimos controles acessíveis acima do rodapé; prévia de deck opaca; retrato decodificado; hacks ao clicar resultaram em 1:0 e 3:0, com dez de ouro apenas ao vencer o confronto. Sem teste em Android físico.

Energia de run, login diário e Hack de energia continuam fora desta atualização. Acessos e formato de saves preservados.
