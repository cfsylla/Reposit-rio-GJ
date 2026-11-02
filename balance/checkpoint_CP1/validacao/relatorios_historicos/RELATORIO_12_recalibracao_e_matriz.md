# Recalibração (V23), regra de relíquias e matriz deck × avanço

## 1. Correção importante de método

O jogador simulado **travava no evento Arena**. Depois da 1ª vitória, o evento pergunta se o jogador quer arriscar uma elite, e o simulador não respondia. Cerca de 14% das runs paravam ali e eram contadas como "não venceu".

Era limitação do meu simulador, **não do jogo**. Já foi corrigido e conferido: zero runs travadas nas baterias novas.

Efeito: o V19 que você aprovou era **mais fácil do que os números mostravam**. Com 25 nós, ele vence ~62% das runs, acima da meta de 40% a 50%. Por isso recalibrei.

## 2. Mudanças do V19 (aprovado) para o V23 (recalibrado)

| Item | V19 | V23 | Por quê |
|---|---|---|---|
| Ouro por vitória (mapa 1 / 2 / 3) | 15 / 18 / 21 | **14 / 16 / 18** | Com o erro corrigido, sobrava folga |
| Boss comum: upgrades a menos que a curva | −3 / −6 / −8 | **−3 / −4 / −6** | Idem |
| Equipe do boss de ordem: upgrades a menos | −4 / −9 / −10 | **−4 / −7 / −8** | Idem |
| Força extra por mapa | ×1 / ×1,03 / ×1,06 | **×1 / ×1,10 / ×1,16** | Endurece só os mapas 2 e 3, onde morre quem tem árvore |
| Início de cada mapa | 0,82 | **0,80** | Alivia um pouco o mapa 1 para quem não tem árvore |
| Relíquias de elites e bosses inimigos | teto 1 / 2 / 3 | **sua regra (R1)**: sorteio entre 1 e n−1, limitado pela bolsa | Ver seção 4 |

Os demais itens aprovados continuam iguais:
- curva de ~1 upgrade por luta;
- elite +1 upgrade;
- líderes −20% (Rei Troll −35%; Rainha Meowri e Líder Centauro −25%);
- upgrade na loja 10 e 16;
- raids dos mapas 2 e 3 com vida ×1,25 e dano ×1,1;
- decks inimigos por mapa;
- correção do bug do Lanceiro invocado.

## 3. Resultado do V23

| Árvore | Passa mapa 1 | Passa mapa 2 | Vence a run | Meta |
|---|---|---|---|---|
| Vazia | 51% | 9% | **3%** | 5% a 10% (um pouco abaixo) |
| Intermediária (25 nós) | 94% | 60% | **43%** | 40% a 50% ✓ |
| Completa (60 nós) | 98% | 93% | **84%** | — |

Base: 24 decks × 20 runs em cada estado de árvore, 1.440 runs no total.

A árvore vazia ficou um pouco abaixo da meta porque **a árvore dá uma vantagem muito grande**. Sem ela, o jogador passa do mapa 1 em metade das runs, mas os mapas 2 e 3 estão calibrados para quem já tem nós comprados. Se eu deixasse o jogo mais fácil para quem não tem árvore, ele ficaria fácil demais para quem tem. O equilíbrio certo sai na **próxima etapa (árvore e XP)**, que vai medir quanto cada nó vale.

## 4. Relíquias de elites, ordens e bosses inimigos

**O que a v54 faz hoje:**
- para cada oportunidade de relíquia que o jogador viu, o inimigo tem 33% de chance de ganhar uma;
- no mínimo 1;
- o limite é a bolsa de 16 casas, que já existia no código.

Isso **não é exatamente a regra que você descreveu** (sorteio entre 1 e n). Fica registrado como diferença entre o documento e o código.

**Testes**, com n = relíquias que o jogador poderia ter = 1 inicial + oportunidades:

| Regra | Relíquias inimigas por luta (mapa 1 → 3) | Árvore vazia: vence | 20 nós: vence |
|---|---|---|---|
| v54 (33% por oportunidade) | 1,0 → 2,7 | 11% | 42% |
| **R1: sorteio entre 1 e n−1** | 1,5 → 3,5 | 7% | 42% |
| R2: sorteio entre 1 e n−2 | 1,1 → 3,4 | 8% | 46% |

A quantidade de relíquias inimigas pesa pouco no resultado, porque cada relíquia é um bônus pequeno. **Recomendo a R1**: é a mais próxima da sua regra, dá variedade e não fica forte demais. O limite da bolsa continua valendo.

## 5. Bosses com menos upgrades que a batalha normal (sua pergunta sobre os itens 3 e 4)

Sim, o boss tem menos upgrades que a curva naquele ponto. Mesmo assim, **ele continua sendo a luta mais difícil do mapa**, porque:
- exige 4 vitórias de rodada;
- é um deck completo, com sinergia (um dos 24 decks emprestados), ou uma equipe com 4 cópias de cada personagem, líder e mecânicas próprias;
- tem o maior bônus de força do mapa;
- tem relíquias.

Na matriz, o **boss do mapa 2 é o ponto onde a curva mais cai**: de 81% para 60% com a árvore intermediária.

Quando testei os bosses com os mesmos upgrades das batalhas normais (V6), eles derrotavam o jogador em 34% a 51% das vezes, e a run ficava quase impossível de terminar.

## 6. Matriz deck × avanço

Está no PDF à parte (Matriz_deck_x_avanco). Destaques com a árvore intermediária:
- **Média:** 100% → 94% (boss do mapa 1) → 81% → **60% (boss do mapa 2)** → 51% → **43% vence**.
- **Mais fortes:** Coro de Guerra (80%), Lâminas do Oriente (65%), Corte Sombria (60%).
- **Mais fracos:** Lei do Gatilho, Fortaleza, Tripulação Salgada e Presas Negras (25%).
- Cada célula tem 20 runs, então a margem é de cerca de ±10 pontos. Diferenças pequenas entre decks não são confiáveis; as grandes, sim.

## 7. Decisões

1. Aprovar os valores recalibrados do V23 (seção 2).
2. Aprovar a regra de relíquias **R1** (seção 4).
3. Depois disso, aplico tudo na cópia balanceada. A seguir:
   - revisão leve dos decks extremos (Coro de Guerra, e Lei do Gatilho / Fortaleza / Tripulação Salgada / Presas Negras);
   - etapa da **árvore e XP**, que também resolve a diferença entre a árvore vazia e a intermediária.
