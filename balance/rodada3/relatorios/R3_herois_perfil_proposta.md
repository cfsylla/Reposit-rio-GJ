# Heróis — proposta de atributos por personalidade (R3, 20/11)

Status: **proposta para revisão do Carlos. Nada foi rodado nem aplicado.** As versões de boss não mudam.

## Como os números são montados
1. **Perfil**: cada herói já tem notas de 1 a 5 (vida, ataque, defesa, velocidade de ataque, movimento, crítico, habilidade), herdadas do personagem que o originou. Cada nota vira o **valor típico das cartas atuais com essa nota**:

| Nota | Vida | Ataque | Defesa | Intervalo de ataque (s) | Movimento | Crítico |
|---|---|---|---|---|---|---|
| 1 | 170 | 14 | 8 | 1.65 | 30 | 3% |
| 2 | 205 | 21 | 16 | 1.38 | 39 | 8% |
| 3 | 250 | 30 | 26 | 1.05 | 49 | 12% |
| 4 | 320 | 36 | 38 | 0.84 | 60 | 18% |
| 5 | 390 | 47 | 52 | 0.68 | 74 | 25% |

2. **Habilidade por papel**: carga de **5 s** (suporte), **6 s** (lutador, rápido, atirador) e **7 s** (tanque). Hoje é 10 s para todos. A nota de habilidade 5 (Grand Oracle) dá +25% de poder da habilidade.
3. **Orçamento de força**: vida, ataque e defesa do perfil são multiplicados por **um único fator por herói**, calibrado no laboratório até o índice L0 chegar a **1,15**. Velocidade de ataque, crítico e movimento ficam como no perfil (são a personalidade). A proporção entre os atributos não muda; só a escala.
4. **Custo 4 e Ultra** para todos.
5. **First Wayfarer**: habilidade troca de *light* (golpe + cura) para *cleave* (golpe de 180% ATQ no alvo e 90% ATQ em quem estiver a até 70). **Meowri Queen**: mantém *volley*, texto passa a dizer "três golpes" em vez de "três tiros".

## Perfil proposto (antes da calibração: valores com fator 1,0)
| Herói | Grupo | Papel | Habilidade | Vida | Ataque | Defesa | Intervalo (s) | Movimento | Crítico | Carga (s) | Hoje (vida / ataque / defesa / intervalo / crítico) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Marshal | Grand Union | Tanque | guard | 390 | 21 | 52 | 1.65 | 30 | 3% | 7 | 280 / 30 / 22 / 1.2 / — |
| Goblin King | Blackfang | Tanque | volley | 390 | 21 | 26 | 1.38 | 30 | 3% | 7 | 230 / 25 / 10 / 1.2 / — |
| Pirate Queen | Grand Union | Tanque | cleave | 320 | 47 | 38 | 1.65 | 30 | 8% | 7 | 230 / 30 / 10 / 1.2 / — |
| Troll King | Blackfang | Lutador pesado | slam | 390 | 47 | 26 | 1.38 | 49 | 3% | 6 | 280 / 30 / 17 / 1.2 / — |
| Shogun | Grand Union | Lutador pesado | cleave | 390 | 47 | 38 | 1.38 | 49 | 12% | 6 | 230 / 30 / 10 / 1.2 / — |
| Orc Emperor | Blackfang | Lutador pesado | cleave | 320 | 36 | 16 | 1.05 | 60 | 8% | 6 | 230 / 30 / 10 / 1.2 / — |
| Runic Jarl | Grand Union | Lutador pesado | slam | 250 | 36 | 26 | 1.38 | 49 | 12% | 6 | 280 / 30 / 17 / 1.2 / — |
| First Wayfarer | Grand Union | Lutador pesado | cleave (era light) | 250 | 47 | 16 | 1.38 | 49 | 12% | 6 | 190 / 30 / 10 / 1.2 / — |
| Meowri Queen | Dawncrest | Rápido/crítico | volley (3 golpes) | 250 | 30 | 26 | 0.84 | 60 | 12% | 6 | 230 / 25 / 10 / 1.2 / — |
| Dark Elf King | Blackfang | Rápido/crítico | cleave | 250 | 36 | 16 | 1.05 | 60 | 25% | 6 | 230 / 30 / 10 / 1.2 / — |
| Centaur Leader | Dawncrest | Rápido/crítico | cleave | 320 | 36 | 26 | 1.05 | 74 | 12% | 6 | 230 / 30 / 10 / 1.2 / — |
| Hart Lord | Grand Union | Rápido/crítico | roots | 320 | 36 | 38 | 1.38 | 74 | 8% | 6 | 230 / 30 / 10 / 1.2 / — |
| Frontier Legend | Grand Union | Atirador | volley | 320 | 36 | 26 | 1.05 | 74 | 18% | 6 | 230 / 25 / 10 / 1.2 / — |
| Forest Elf King | Dawncrest | Atirador | roots | 205 | 30 | 8 | 0.84 | 74 | 18% | 6 | 230 / 30 / 10 / 1.2 / — |
| High Elf King | Dawncrest | Atirador | light | 250 | 36 | 16 | 1.05 | 49 | 18% | 6 | 190 / 30 / 10 / 1.2 / — |
| Grand Oracle | Grand Union | Suporte | light | 250 | 14 | 26 | 1.38 | 30 | 3% | 5 | 190 / 30 / 10 / 1.2 / — |
| Fairy Queen | Dawncrest | Suporte | heal | 205 | 14 | 8 | 1.05 | 74 | 3% | 5 | 190 / 18 / 10 / 1.2 / — |

Depois da calibração, vida, ataque e defesa sobem (ou descem) pelo fator de cada herói; a tabela final virá com os valores calibrados e o índice medido.

## O que preciso do Carlos
1. Aprovar a tabela de perfis (ou ajustar a nota de algum herói, se ela não refletir o personagem).
2. Aprovar as cargas por papel (5 / 6 / 7 s).
3. Autorizar a calibração (cerca de 15 a 20 minutos).
