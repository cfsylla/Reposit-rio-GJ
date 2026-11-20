# Cartas de herói — versão final calibrada por personalidade (R3, 20/11)

Aprovado pelo Carlos: perfil pelas notas de cada herói, carga por papel (5/6/7 s), custo 4, Ultra, First Wayfarer com *cleave*, Meowri Queen com texto "três golpes". **Versões de boss não mudam.** Esta versão substitui a de multiplicador só em vida e ataque.

Calibração: vida, ataque e defesa do perfil × fator do herói, até o índice L0 = 1,15 (margem ±0,01). Intervalo de ataque, movimento, crítico, carga e poder da habilidade = perfil.

| Herói | Papel | Habilidade | Vida | Ataque | Defesa | Intervalo (s) | Movimento | Crítico | Carga (s) | Poder da hab. | Fator | Índice L0 antes → **depois** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Marshal | Tanque | guard | 577 | 31 | 77 | 1.65 | 30 | 3% | 7 | — | ×1.48 | 1.00 → **1.15** |
| Goblin King | Tanque | volley | 726 | 39 | 48 | 1.38 | 30 | 3% | 7 | — | ×1.86 | 0.95 → **1.15** |
| Pirate Queen | Tanque | cleave | 431 | 63 | 51 | 1.65 | 30 | 8% | 7 | — | ×1.34 | 0.97 → **1.15** |
| Troll King | Lutador pesado | slam | 497 | 60 | 33 | 1.38 | 49 | 3% | 6 | — | ×1.27 | 0.97 → **1.15** |
| Shogun | Lutador pesado | cleave | 470 | 57 | 46 | 1.38 | 49 | 12% | 6 | — | ×1.21 | 0.95 → **1.15** |
| Orc Emperor | Lutador pesado | cleave | 457 | 51 | 23 | 1.05 | 60 | 8% | 6 | — | ×1.43 | 0.95 → **1.14** |
| Runic Jarl | Lutador pesado | slam | 435 | 63 | 45 | 1.38 | 49 | 12% | 6 | — | ×1.74 | 0.96 → **1.15** |
| First Wayfarer | Lutador pesado | cleave (era light) | 435 | 82 | 28 | 1.38 | 49 | 12% | 6 | — | ×1.74 | 0.92 → **1.15** |
| Meowri Queen | Rápido/crítico | volley (3 golpes) | 414 | 50 | 43 | 0.84 | 60 | 12% | 6 | — | ×1.66 | 0.92 → **1.14** |
| Dark Elf King | Rápido/crítico | cleave | 385 | 55 | 25 | 1.05 | 60 | 25% | 6 | — | ×1.54 | 0.95 → **1.14** |
| Centaur Leader | Rápido/crítico | cleave | 432 | 49 | 35 | 1.05 | 74 | 12% | 6 | — | ×1.35 | 0.96 → **1.15** |
| Hart Lord | Rápido/crítico | roots | 429 | 48 | 51 | 1.38 | 74 | 8% | 6 | — | ×1.34 | 0.96 → **1.15** |
| Frontier Legend | Atirador | volley | 365 | 41 | 30 | 1.05 | 74 | 18% | 6 | — | ×1.14 | 0.98 → **1.16** |
| Forest Elf King | Atirador | roots | 270 | 39 | 11 | 0.84 | 74 | 18% | 6 | — | ×1.32 | 1.02 → **1.16** |
| High Elf King | Atirador | light | 293 | 42 | 19 | 1.05 | 49 | 18% | 6 | — | ×1.17 | 0.99 → **1.15** |
| Grand Oracle | Suporte | light | 558 | 31 | 58 | 1.38 | 30 | 3% | 5 | +25% | ×2.23 | 0.97 → **1.14** |
| Fairy Queen | Suporte | heal | 481 | 33 | 19 | 1.05 | 74 | 3% | 5 | — | ×2.35 | 0.97 → **1.15** |

## Ponto de atenção: suportes
Grand Oracle e Fairy Queen precisaram de fator ×2,2–2,3 (o ataque baixo deles quase não conta no laboratório). Com isso viraram os mais resistentes da lista (Oracle 558 de vida e 58 de defesa), o que foge do papel de suporte.
Alternativa: manter vida e defesa do perfil (fator ~1,2) e colocar o orçamento na **habilidade** (cura e escudo maiores, carga menor). Precisa de decisão do Carlos e de nova calibração só para os dois.

Dados: `balance/out/lab2_r3/herois_calib2/`. Defesa, alcance e velocidade de movimento seguem o perfil; ID e versões de boss inalterados.
