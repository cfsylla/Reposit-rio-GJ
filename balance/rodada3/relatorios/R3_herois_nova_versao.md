# Cartas de herói — nova versão (R3, 20/11)

Pedido do Carlos: todos os heróis **Ultra**, **custo 4**, com atributos e habilidade de carta de fim de jogo. **As versões de boss não mudam**: as cartas `hero_*` são geradas à parte em `boss-cards.js` (o próprio código diz que são independentes dos bosses).

## Regra aplicada a todos
- Custo **4** (antes 3, exceto Dark Elf King, Fairy Queen e First Wayfarer, que já eram 4). Raridade Ultra (sem mudança).
- **Carga da habilidade: 7 s** (antes 10 s).
- **Intervalo de ataque: 1,0 s** (antes 1,2 s).
- **Vida e ataque** multiplicados por um fator próprio de cada herói, calibrado no laboratório até o índice no nível 0 chegar a **1,15** (meta; margem ±0,01). O dano da habilidade sobe junto, porque usa o ataque. Defesa, velocidade, alcance e o efeito da habilidade não mudam.
- Referência: Cannoneer 1,16 e Pirate Admiral 1,11 são os personagens mais fortes do jogo hoje; os heróis passam a ficar nessa faixa.

## Tabela
| Grupo | Herói | ID | Tipo de habilidade | Vida | Ataque | Fator | Índice L0 antes | **Índice L0 depois** |
|---|---|---|---|---|---|---|---|---|
| Grand Union | Frontier Legend | `hero_ib_gunslinger` | volley | 230 → **391** | 25 → **42** | ×1.70 | 0.98 | **1.15** |
| Grand Union | Hart Lord | `hero_ib_hartlord` | roots | 230 → **427** | 30 → **56** | ×1.86 | 0.96 | **1.15** |
| Grand Union | Runic Jarl | `hero_ib_jarl` | slam | 280 → **520** | 30 → **56** | ×1.86 | 0.96 | **1.15** |
| Grand Union | Marshal | `hero_ib_marshal` | guard | 280 → **476** | 30 → **51** | ×1.70 | 1.00 | **1.16** |
| Grand Union | Grand Oracle | `hero_ib_oracle` | light | 190 → **323** | 30 → **51** | ×1.70 | 0.97 | **1.14** |
| Grand Union | Pirate Queen | `hero_ib_piratequeen` | cleave | 230 → **434** | 30 → **57** | ×1.89 | 0.97 | **1.15** |
| Grand Union | Shogun | `hero_ib_shogun` | cleave | 230 → **455** | 30 → **59** | ×1.98 | 0.95 | **1.16** |
| Grand Union | First Wayfarer | `hero_ib_wayfarer` | light | 190 → **423** | 30 → **67** | ×2.23 | 0.92 | **1.14** |
| Blackfang | Dark Elf King | `hero_darkelf` | cleave | 230 → **447** | 30 → **58** | ×1.94 | 0.95 | **1.15** |
| Blackfang | Goblin King | `hero_goblin` | volley | 230 → **444** | 25 → **48** | ×1.93 | 0.95 | **1.16** |
| Blackfang | Orc Emperor | `hero_orc` | cleave | 230 → **434** | 30 → **57** | ×1.89 | 0.95 | **1.15** |
| Blackfang | Troll King | `hero_troll` | slam | 280 → **476** | 30 → **51** | ×1.70 | 0.97 | **1.14** |
| Dawncrest | Centaur Leader | `hero_centaur` | cleave | 230 → **420** | 30 → **55** | ×1.83 | 0.96 | **1.15** |
| Dawncrest | Fairy Queen | `hero_fairy` | heal | 190 → **444** | 18 → **42** | ×2.34 | 0.97 | **1.15** |
| Dawncrest | Forest Elf King | `hero_forestelf` | roots | 230 → **330** | 30 → **43** | ×1.44 | 1.02 | **1.15** |
| Dawncrest | High Elf King | `hero_highelf` | light | 190 → **289** | 30 → **46** | ×1.52 | 0.99 | **1.14** |
| Dawncrest | Meowri Queen | `hero_meowri` | volley | 230 → **551** | 25 → **60** | ×2.40 | 0.92 | **1.15** |

Defesa, alcance e velocidade de movimento ficam iguais aos de hoje.
Medição: laboratório de personagens (9 seeds, sem relíquias nem árvore), no código atual. Dados em `balance/out/lab2_r3/herois_calib/`.
