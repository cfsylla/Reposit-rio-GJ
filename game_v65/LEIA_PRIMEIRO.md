# Grand Journey v65 — pacote para balanceamento do endgame

Base: v65 publicada, commit `b0e45f183d384eb946038363c4b4f5e7dc1d250a`. Não é uma proposta: este é o código integrado no jogo. Use este motor como nova base, em vez de reaplicar patches antigos sobre CP4/v57.

## Comece por aqui

1. Leia `PROMPT_PARA_CLAUDE.md`, `MUDANCAS_POS_CP4.md` e `VERSAO.json`.
2. Execute `node scripts/verificar-v65.cjs` na raiz do pacote.
3. Consulte `dados/dados_atuais_v65.json` ou regenere com `node scripts/exportar-dados-v65.cjs`.
4. Para simular, carregue `const {G,P}=require('./tests/cp4-engine.cjs')`. Esse loader segue a ordem de scripts do `dist/index.html` até os módulos de UI. Carregar só `game-0.js` perde ajustes posteriores, heróis, raridades, relíquias e progressão.
5. O código é a fonte de verdade. O JSON é um apoio estático: funções e condições dinâmicas não são serializadas. Números em títulos/nomes históricos (`v53`, `v54`, `v56`, `v57`) não significam que esses módulos estejam desatualizados.

## Conteúdo

- `dist/`: fonte exata da publicação, com motor e UI. No pacote COMPLETO, inclui todas as mídias publicadas. No pacote LEVE, contém todos os arquivos de código/texto e omite as mídias pesadas. Os dez pequenos atlas físicos aprovados são mantidos para executar os testes de regressão.
- `tests/`: testes e fixtures do repositório. `scripts/verificar-v65.cjs` seleciona os testes efetivamente validados; outros testes históricos podem ter expectativas antigas.
- `dados/`: exportação do motor carregado na ordem atual.
- `dados_aprovados/`: JSONs aprovados das 24 raridades e 17 heróis, para conferência.
- `docs/PROJETO_ATUAL_v65.md`: documento de continuidade; roadmap/pendências não são implementação.
- `docs/EFEITOS_INTEGRADOS_v65.md`: integração visual; efeitos não alteram resultados.
- `MANIFESTO_SHA256.json`: hashes dos arquivos e classificação da variante. `ORIGINAIS_PUBLICADOS_SHA256.json`: hashes dos arquivos dist exatamente publicados.

## Abrir o jogo (pacote completo)

Na raiz extraída, rode `python3 -m http.server 8000 --directory dist` e abra `http://localhost:8000/`. Não precisa instalar dependências ou compilar. Para análises de motor, use Node.js (validado em Node 24).

O pacote leve executa o motor e os testes selecionados sem as mídias pesadas; a interface visual e testes específicos de mídia exigem o pacote completo. Ele usa exatamente os mesmos JS, JSON, CSS e HTML.

## Limites desta entrega

Este pacote não inclui saves pessoais, resultados de campanhas recentes, credenciais, configuração de acesso ou histórico Git. Progresso permanente e condições de desbloqueio devem ser configurados explicitamente nas simulações; Treino não representa automaticamente uma carreira endgame.

Snapshots e exportadores antigos CP1/CP2 foram omitidos para evitar usar dados superados. Não foi adicionado Secret Boss, Desafio Final, nem novas propostas de desafios. Não publique alterações: a integração das sugestões do Claude ocorre no ChatGPT Work após autorização de Carlos.
