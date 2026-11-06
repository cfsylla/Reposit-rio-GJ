# Pendências após o checkpoint GJ-v50-BAL-CP3

**Nada desta lista deve ser aplicado automaticamente no projeto principal.**

## 1. Conteúdo a cargo do projeto principal
- **Secret Boss e Desafio Final.** Para o Claude balancear, o projeto principal precisa definir:
  - personagem, formação, habilidades e formas;
  - quais 3 True Bosses contam (com o Ironbound, agora são 4 ordens com True Boss);
  - a estrutura da run (onde ficam os 4 confrontos; se há loja ou janela entre eles; se as derrotas se somam);
  - as regras do encontro;
  - a meta de dificuldade;
  - a recompensa.

  Já definido: o Secret Boss dá 24 XP (peso 8 × 3) e o campo `node.secretBoss` está reservado em `JourneyTree.kindOf`.
- **Telas** (especificação na seção 7 de `INTEGRACAO_CHATGPT_CP3.md`), incluindo a estrela no nó da 6ª luta.

## 2. Em decisão (Carlos)
- **Economia permanente:** proposta em `balance/rodada3/economia/PROPOSTA_ECONOMIA_R3.md`. Ela cobre booster com proteção de duplicata e fragmentos, recompensa diária, preços, fórmula de diamantes por run e conversão para a moeda de cosméticos. **Não aplicar.**
- **Compra com dinheiro real:** diamantes e moeda de cosméticos (a decidir).

## 3. Mantido por decisão (não é pendência de ajuste)
- Decks fortes: **Corte Sombria** (recompensa), **Linha de Fogo** (1ª vitória por volta da run 9; nenhuma das 6 versões testadas mudou isso) e **Coro de Dawncrest** (por volta da run 11).
- **Preparação Flexível:** +9,5 pontos, no limite da faixa de exceção.
- **Limpeza, Fusão Eficiente e Olho Treinado:** efeito em torno de 0 (negativas aprovadas no CP2).

## 4. Não revisado nesta rodada
- Raids e Titans como boss de mapa (sistema de vida persistente).
- Especiais de Expedição da árvore; economia de eventos, maldições e missões; relíquias do jogador.
- Diferença de 15 nós no mapa 1: Rei Forest Elf (59%), Senhor dos Cervos (61%) e Rei Troll (80%), contra média de 70%. Com 30 nós, todos ficam a ±5 da média. Mantido por decisão.

## 5. A conferir em playtest humano
- **Suportes:** o jogador simulado os põe pouco em campo (o Sage entrou em 25% das batalhas do Círculo Arcano). A força deles foi calibrada no laboratório de personagens, então confirmar a sensação com um humano.
- **Janela da 6ª luta:** se a compra antes do boss 1 resolve a sensação de "barreira do mapa 1" para o jogador novo.
- **True Boss:** se a luta longa, gastando de 3 a 4 das 5 derrotas permitidas, passa a sensação de "party completa no auge".
- **Vantagens que dependem de escolha:** Mão Planejada, Preparação Flexível e Olho Treinado.
