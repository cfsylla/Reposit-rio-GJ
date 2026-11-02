# Etapa 4 — Dificuldade dos mapas: diagnóstico e primeira proposta de curva

Tudo foi medido na cópia balanceada, com P1, P2, P3 e Fearless V4 aplicados. A curva nova roda só em cópia de teste.

## O jogador simulado ficou mais competente

O jogador simulado agora:
- aceita eventos seguros;
- compra relíquias que cabem na bolsa antes de gastar tudo em upgrade.

Foram testados os 15 decks base, 20 runs cada, em três estados de árvore permanente:

| Estado da árvore | Nós comprados |
|---|---|
| Vazia | nenhum |
| Intermediária | 8 nós iniciais |
| Avançada | quase todos, exceto os 2 Marcos de Expedição |

## Por que a run é tão difícil hoje

**1. Cada derrota encerra a run.** Para vencer as 27 lutas, o jogador precisa ganhar cerca de 95% de cada luta. Com 15% de derrota por luta, só 1 run em 80 chegaria ao fim.

**2. A curva de upgrades inimigos sobe em degraus e se concentra no mapa 1.** Ela é contada pela run inteira:

| Lutas da run | Cartas inimigas com upgrade |
|---|---|
| 1ª a 3ª | 0 |
| 4ª a 6ª | 12 de 20 |
| 7ª e 8ª | 20 de 20 |
| 9ª em diante | 20, sendo 6 no upgrade máximo; não muda mais até o fim do jogo |

Com o ouro real, o jogador tem 1,6 carta com upgrade na 4ª luta e cerca de 4,5 no boss do mapa 1.

**3. Elites mais fáceis que batalhas normais.** As elites só melhoram cerca de 1/3 dos tipos, e só até o 1º upgrade.

## Proposta "curva 1"

- Os inimigos ganham cerca de **1 upgrade por luta**, distribuído pelos 3 mapas:
  - fim do mapa 1: 7 upgrades;
  - fim do mapa 2: cerca de 16;
  - fim do mapa 3: todas as cartas com upgrade e 6 no máximo.
- **Elite = curva + 3 upgrades.** **Boss = curva + 4.**

Resultado com o jogador competente:

| Árvore | Curva atual: passa mapa 1 | Curva atual: passa mapa 2 | Curva atual: vence | Curva 1: passa mapa 1 | Curva 1: passa mapa 2 | Curva 1: vence |
|---|---|---|---|---|---|---|
| Vazia | 1% | 0% | 0% | 7% | 0% | 0% |
| Intermediária | 5% | 0% | 0% | 20% | 2% | 0% |
| Avançada | 59% | 22% | 12% | 83% | 52% | 28% |

Derrota por luta no mapa 1, sem árvore:

| Luta | Curva atual | Curva 1 |
|---|---|---|
| 4ª luta (camada 5) | 40% | 19% |
| Batalha da camada 10 | 53% | 22% |
| Elite | 27% a 35% | 40% a 49% (agora mais difícil que a batalha normal, como deve ser) |
| Ordem Dawncrest | 11% a 24% | 19% a 36% |
| Boss do mapa 1 | 88% | 63% |

As batalhas normais ficaram muito mais justas. As **barreiras restantes no mapa 1** são as elites, as ordens Dawncrest e o boss.

## Decisões para Carlos

1. **Meta de dificuldade.** O jogador simulado joga como a IA do jogo, ou seja, pior que um humano experiente. Sugestão de metas *para o simulado*:

| Árvore | Passa do mapa 1 | Vence a run |
|---|---|---|
| Vazia | cerca de 50% | cerca de 5% a 10% |
| Intermediária | — | cerca de 15% a 25% |
| Avançada | — | cerca de 40% a 50% |

   Para um humano, esses números seriam maiores.

2. **Aprovar a direção da curva 1:** crescimento gradual, com elite e boss acima da batalha normal.

3. **Alavancas para a próxima rodada.** Recomendo combinar as três:
   - (a) mais ouro por luta ou upgrade mais barato;
   - (b) suavizar elites, ordens e boss do mapa 1;
   - (c) ajustar o multiplicador de força por mapa (hoje ×1, ×1,12 e ×1,25).
