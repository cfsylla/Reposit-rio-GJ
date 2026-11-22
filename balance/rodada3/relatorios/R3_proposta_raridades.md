# Proposta de revisão de raridades (R3, a partir do laboratório de 20/11)

Fonte: `R3_ranking_personagens_lab2.xlsx`, o laboratório no código atual, com 9 seeds por medição.
Status: **proposta para decisão do Carlos.** Nada foi alterado no jogo.

## Método
1. **Força além do custo** = índice L0 − (1 + 0,04 × (custo − 2)). Ou seja, o quanto a carta rende além do que a energia dela já explica.
2. **Faixas de raridade** tiradas dos próprios dados, mantendo a quantidade atual de cada raridade (24 comuns, 28 incomuns, 21 raras e 4 ultras entre os 77 personagens):

   | Raridade | Força além do custo |
   |---|---|
   | Comum | até −0,024 |
   | Incomum | −0,024 a +0,016 |
   | Rara | +0,016 a +0,040 |
   | Ultra | acima de +0,040 |

3. **Só muda** a carta que ficou fora da faixa da raridade atual por mais que **0,015**, a margem de erro da medição. Quem está na fronteira mantém a raridade.
4. **No máximo 1 nível por carta** nesta revisão. Quando os dados apontam 2 ou mais níveis, isso aparece na coluna "Obs.".
5. **Heróis ficam de fora:** são todos ultra fixos. Veja a seção "Achado sobre os heróis".

## Situação hoje e depois da proposta
| Raridade | Hoje: cartas | Hoje: força média além do custo | Proposta: cartas | Proposta: força média |
|---|---|---|---|---|
| Comum | 24 | -0.022 | 20 | -0.038 |
| Incomum | 28 | -0.005 | 36 | -0.006 |
| Rara | 21 | +0.012 | 17 | +0.025 |
| Ultra | 4 | +0.016 | 4 | +0.047 |

- **Hoje** a raridade quase não acompanha a força: de comum a ultra a média sobe só 0,04, e há comuns mais fortes que várias raras.
- **Com a proposta**, a diferença entre as raridades fica mais clara.
- **24 mudanças** em 77 cartas: 12 sobem e 12 descem.

## Mudanças propostas

### Grand Union
| Personagem | Custo | Atual | **Proposta** | Índice L0 | Força além do custo | Preço (◇) | Obs. |
|---|---|---|---|---|---|---|---|
| Cannoneer | 4 | Rara | **Ultra** ↑ | 1.16 | +0.077 | 20 → 25 |  |
| Archer | 2 | Incomum | **Rara** ↑ | 1.04 | +0.042 | 15 → 20 | os dados apontam Ultra |
| Shaolin | 3 | Incomum | **Rara** ↑ | 1.07 | +0.033 | 15 → 20 |  |
| Ranger | 2 | Comum | **Incomum** ↑ | 1.02 | +0.022 | 10 → 15 | os dados apontam Rara; medido na versão publicada da armadilha |
| Martial Artist | 2 | Comum | **Incomum** ↑ | 1.02 | +0.018 | 10 → 15 | os dados apontam Rara |
| Crossbowman | 3 | Comum | **Incomum** ↑ | 1.04 | +0.004 | 10 → 15 |  |
| Mage | 3 | Comum | **Incomum** ↑ | 1.03 | -0.007 | 10 → 15 |  |
| Xerife | 4 | Rara | **Incomum** ↓ | 1.07 | -0.013 | 20 → 15 |  |
| Duelist | 3 | Rara | **Incomum** ↓ | 1.02 | -0.020 | 20 → 15 |  |
| Cavalier | 4 | Rara | **Incomum** ↓ | 1.06 | -0.024 | 20 → 15 | os dados apontam Comum |
| Sorceress | 3 | Rara | **Incomum** ↓ | 1.01 | -0.027 | 20 → 15 | os dados apontam Comum |
| Priestess | 4 | Incomum | **Comum** ↓ | 1.04 | -0.041 | 15 → 10 |  |
| Berserker | 3 | Incomum | **Comum** ↓ | 0.99 | -0.049 | 15 → 10 |  |

### Blackfang
| Personagem | Custo | Atual | **Proposta** | Índice L0 | Força além do custo | Preço (◇) | Obs. |
|---|---|---|---|---|---|---|---|
| Goblin Arqueiro | 2 | Comum | **Incomum** ↑ | 1.00 | +0.002 | 10 → 15 |  |
| Orc Guerreiro | 3 | Comum | **Incomum** ↑ | 1.03 | -0.009 | 10 → 15 |  |
| Mago Elfo Sombrio | 3 | Rara | **Incomum** ↓ | 1.02 | -0.024 | 20 → 15 |  |
| Troll da Montanha | 4 | Rara | **Incomum** ↓ | 1.04 | -0.043 | 20 → 15 | os dados apontam Comum |
| Troll da Caverna | 3 | Incomum | **Comum** ↓ | 0.99 | -0.051 | 15 → 10 |  |
| Guerreiro Elfo Sombrio | 3 | Incomum | **Comum** ↓ | 0.99 | -0.054 | 15 → 10 |  |

### Dawncrest
| Personagem | Custo | Atual | **Proposta** | Índice L0 | Força além do custo | Preço (◇) | Obs. |
|---|---|---|---|---|---|---|---|
| Caçadora Centaura | 3 | Incomum | **Rara** ↑ | 1.07 | +0.035 | 15 → 20 |  |
| Lutador Meowri | 2 | Comum | **Incomum** ↑ | 1.01 | +0.011 | 10 → 15 |  |
| Arqueiro Alto Elfo | 2 | Comum | **Incomum** ↑ | 0.99 | -0.007 | 10 → 15 |  |
| Fada das Flores | 3 | Rara | **Incomum** ↓ | 1.00 | -0.040 | 20 → 15 | os dados apontam Comum |
| Harpista Alta Elfa | 4 | Ultra | **Rara** ↓ | 1.03 | -0.047 | 25 → 20 | os dados apontam Comum |

## Efeito fora do combate (não muda o balanceamento das lutas)
- **Preço na loja de diamantes:** 10, 15, 20 ou 25 por raridade, conforme a coluna Preço.
- **Boosters:** a chance de cada carta sair muda com a raridade (65% / 23% / 10% / 2%, divididos entre as cartas daquela raridade no booster).
- **Drop de catálogo:** a chance de o drop ser relíquia depende da carta mais rara do deck inimigo. Muda pouco.
- **Eventos de "cartas raras":** passam a oferecer as novas raras (entram Archer, Shaolin, Caçadora Centaura e Cannoneer ultra; saem Xerife, Duelist, Cavalier, Sorceress, Mago Elfo Sombrio, Troll da Montanha e Fada das Flores).

## Achado sobre os heróis (cartas de boss)
Os 17 heróis são todos ultra, mas **todos ficaram entre os mais fracos do ranking**: índice L0 de 0,92 a 1,02, e no fundido não sobem muito. Ficaram de 0,08 a 0,22 abaixo da curva esperada. O mais forte é o Forest Elf King (1,02); os mais fracos são o First Wayfarer e a Meowri Queen (0,92).
- Isso não se resolve com raridade: herói é recompensa de True Boss e deveria ser forte.
- **Sugestão:** revisar os atributos e as habilidades dos heróis numa etapa própria. Por exemplo, mirar a faixa dos ultras (+0,04 além do custo) e medir de novo no laboratório.

## Pontos para decisão
1. Aprovar a lista inteira, ou carta por carta.
2. Nos casos em que os dados apontam 2 níveis (Archer, Ranger, Martial Artist, Cavalier, Sorceress, Troll da Montanha, Fada das Flores e Harpista), mudar já 2 níveis ou ficar em 1 nível por enquanto.
3. **Harpista Alta Elfa** (ultra, a mais abaixo da curva entre os não heróis) e **Fada das Flores**: as duas são suportes. Dá para baixar a raridade, como na proposta, ou manter a raridade e reforçar os atributos.
4. Abrir uma revisão de atributos dos heróis.
