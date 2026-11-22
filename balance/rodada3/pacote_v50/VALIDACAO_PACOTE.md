# Validação do pacote

- 137 arquivos de fonte conferidos por SHA-256 contra o commit publicado.
- Loader segue a ordem real do index; exportação contém 24 decks e 95 milestones.
- Auditoria reproduzida: 60 nodes, custo total 1.151, orçamento máximo atual 500.
- `scripts/validate-balance-base.cjs`: aprovado no pacote sem assets.
- `tests/progression-v56.cjs`: aprovado no pacote.
- `tests/integration-cp2.cjs`: aprovado no pacote.
- Nenhuma simulação das propostas novas foi executada: esse é o trabalho solicitado ao Claude.
- Nenhuma alteração no jogo foi feita para montar este pacote.
