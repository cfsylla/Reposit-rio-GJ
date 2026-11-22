# Prompt para o Claude — nova base real v65

Vamos continuar o balanceamento do endgame de Grand Journey a partir deste pacote. Ele contém o código real publicado na v65, não apenas os patches propostos ou os dados do laboratório antigo.

1. Substitua a base de simulação CP4/v57 por este motor. Preserve IDs e carregue todos os módulos na ordem de `dist/index.html`, usando `tests/cp4-engine.cjs`.
2. Rode a verificação selecionada e confira a exportação atual. Informe quais testes executou e qualquer limitação do ambiente.
3. Considere os novos fatores de boss dos mapas 2/3, a revisão dos 17 heróis (exclusiva de hero_*), as 24 raridades, a Trap do Ranger, os pesos de relíquias em nós/eventos, a Caravana e a progressão corrigida da Espada Adormecida.
4. Configure e documente as premissas de endgame: coleção e decks disponíveis, árvore permanente, vantagens/desafios, upgrades, fusões, relíquias equipadas, rota e composição do inimigo. Não trate o estado de Treino como equivalente a uma carreira.
5. Separe avaliações de boss normal, True Boss forma I, True Boss forma II e Titans. Não aplique o novo perfil de herói ao respectivo boss. Os fatores de mapa não devem ser reaplicados a uma estatística que já os contém.
6. Faça suas análises/simulações sobre essa base e devolva conclusões com amostra, sementes e cenário reproduzível. Alterações propostas devem vir em diff/patch pequeno, com arquivos, valores antes/depois, motivo e evidências; não reenviar uma base antiga inteira.
7. Não implementar Secret Boss/Desafio Final nem converter ideias pendentes em mecânicas. A lista do documento de projeto diferencia publicado de pendente. Os dez VFX da v65 são apenas visuais.

Primeiro confirme que sua base carregada reproduz: boss map [1.037,1.10,1.35]; 17 hero_* custo 4/Ultra; Oracle skillScale 3.946; Fairy 2.256; carta First Wayfarer cleave e boss light; Ranger range145/recuo55/área+10%; 102 milestones. Depois prossiga com o trabalho de balanceamento do endgame combinado com Carlos.
