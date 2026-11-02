# Pendências de balanceamento após o checkpoint GJ-v54-BAL-CP1

**Nada desta lista deve ser aplicado automaticamente no projeto principal.**

## 1. Trabalho em andamento

- **Revisão leve dos decks nos extremos.** Medida com a árvore intermediária:
  - Coro de Guerra vence 80% das runs (forte);
  - Lei do Gatilho, Fortaleza, Tripulação Salgada, Peles Verdes e Galope Centauro vencem 25% (fracos).
  - Com 20 runs por deck, cada número varia cerca de ±10 pontos. Exemplo: Presas Negras deu 25% na medição sem R1 e 55% na versão entregue. A revisão vai usar mais seeds.
- **Árvore permanente e XP.** A árvore dá uma vantagem muito grande. Sem árvore, o jogador vence 4% das runs, abaixo da meta de 5% a 10%. Próxima etapa.

## 2. Experimentos não aprovados

Existem apenas na área de trabalho do Claude e **não** estão no pacote:
- variantes de dificuldade V0 a V22;
- teto fixo de relíquias inimigas 1 / 2 / 3;
- versões antigas dos decks (v1 a v5 e candidatos);
- variantes de suporte (ação imediata, versão sem soma de auras, versão que afetava o emissor);
- versões V1 a V3 do Fearless.

## 3. Descartados ou substituídos

| Item | Situação |
|---|---|
| Alternativa do Arcane (poder fixo +15% / +30%) | Descartada por Carlos |
| Fearless P2 (dano extra) | Substituído pela V4 (crítico garantido) |
| Regra de auras "mesmo atributo não soma" | Substituída: auras de suportes diferentes somam |
| Aura afetando o emissor | Substituída: emissor não é afetado |
| Pacotes V11 / V19 | Substituídos pelo V23. O V19 foi calibrado com um erro do simulador (travamento no evento Arena), já corrigido |

## 4. Decisões em aberto

1. **Retroatividade de desbloqueios.**
   - O milestone novo "Derrotar o boss do mapa 2" e os decks liberados pelo true boss não contam vitórias anteriores ao CP1.
   - Opções: aceitar assim, ou criar uma migração que leia o histórico de runs (`profile.runs[].actHistory`).
   - **Bloqueia:** só a liberação retroativa desses 4 decks (Terremoto e os 3 decks do true boss Dawncrest / 2 do Blackfang).
2. **Compra de decks com diamantes.** Os decks também continuam compráveis por 25 diamantes (regra da v54 que não foi alterada) e pela coleção. Decidir se os decks novos só saem por milestone.
3. **Filtro de relíquias de inimigos (v54).** `enemyRelicPool` ainda usa nomes antigos de traits (`Atirador`, `Arcano`, `Ágil`, `Defensor`), então scope, tome, boots e shield **nunca** aparecem para inimigos. Corrigir para os nomes atuais? Muda a dificuldade, então precisa ser recalibrado junto.
4. **Árvore vazia abaixo da meta** (4% contra 5% a 10%). Resolver pela árvore, que é o plano, ou pela curva.
5. **Estrelas da ficha (`ratings`).** Não foram atualizadas para os 33 personagens ajustados. É interface, fica a cargo do projeto principal.

## 5. Ajustes aprovados ainda incompletos

- **QA visual e playtest humano** dos itens P2 (auras, textos) e P3 (listas de decks e milestones).
- **Retomada de raid salva** antes do CP1, com suportes que viraram passivos: não foi testada.
- **`bosses-v50`**: falha quando rodado isoladamente sem `traits-v54` (cenário fixo de 15 s contra as formas 2). Passa na validação oficial. Avaliar se o teste antigo deve ser adaptado.

## 6. Próximas análises planejadas

1. Árvore e XP: valor de cada nó, custos, XP por mapa e perfis de jogador.
2. Economia de eventos (valor esperado e risco contra a loja), maldições e missões.
3. Relíquias do jogador: preço, formato na bolsa e valor por célula.
4. Raids e true bosses: mecânicas internas.
5. Economia permanente: diamantes, boosters, raridades e coleção.
6. Nova matriz deck × avanço depois de cada etapa, para comparação antes e depois.
