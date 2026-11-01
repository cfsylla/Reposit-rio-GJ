# Aplicação da P2 aprovada — mecânicas de traits e suportes modelo B

Aprovado por Carlos:
- as 6 mecânicas novas de traits;
- o descarte da alternativa do Arcane, que segue com o ajuste numérico 40% / 60%;
- os suportes no modelo B, com duas regras pedidas por ele:
  - **a aura não afeta quem a emite** (nem bônus, nem cura);
  - **auras de suportes diferentes se somam** para quem está dentro de várias.

Tudo foi aplicado na cópia balanceada `game/`. A v54 original continua intacta em `v54/`.

## 1. Traits (já aplicados, com textos EN/PT atualizados)

| Trait | Efeito novo |
|---|---|
| Legends of the East | Cada 4º básico causa +50% / +60% de dano e ignora 25% / 40% da defesa |
| Goblin | +8% de dano por outro Goblin diferente vivo, até três (+24%) |
| Trailblazer | Movimento +15% / +25%. O primeiro básico depois de se deslocar pelo menos 30 causa +45% / +65% (no máximo a cada 4 s) |
| Protector | Aliados a até 90 de um Protetor vivo recebem 5% / 10% menos dano. Vale o mais forte, não acumula. A provocação antiga foi retirada |
| Patient | A cada 3 s: DEF +8% / +15% e dano +4% / +8%, acumulando até 3 vezes |
| Fearless | Dano +12% / +15%, que dobra abaixo de 40% de vida. O crítico extra antigo foi retirado |

Ganho medido de cada trait: ver o relatório P2 anterior.

## 2. Suportes modelo B (já aplicados)

Regras:
- A habilidade virou **aura passiva** de raio 120.
- A cada X segundos, cura os **outros** aliados dentro da aura.
- Dá bônus aos **outros** aliados dentro da aura.
- O suporte fica cerca de 60 atrás da linha da frente.
- Auras de suportes diferentes se somam.
- A força da aura usa só o poder **base** do suporte. Isso impede o efeito em cadeia em que um suporte fortalecia o outro sem parar.
- Upgrade e fusão aumentam a aura pela metade do crescimento normal.
- O texto da habilidade, em EN e PT, é gerado a partir dos próprios valores.

Valores **recalibrados** depois das duas regras novas. O índice final foi medido na cópia balanceada completa:

| Suporte | Custo / raridade | Cura | A cada | Bônus aos outros aliados | Índice v54 → final (meta) | Upgrade máx. | Fundido |
|---|---|---|---|---|---|---|---|
| Priestess | 4 / Incomum | 6,8% | 2 s | 17% menos dano recebido | 1,00 → **1,07** (1,10) | 1,14 | 1,21 |
| Harpista | 4 / Ultra rara | 11,5% | 2 s | +23% velocidade de ataque | 0,96 → **1,11** (1,14) | 1,17 | 1,20 |
| Fada das Flores | 3 / Rara | 11% | 2 s | +35% poder de habilidade | 0,94 → **1,07** (1,08) | 1,12 | 1,16 |
| Troll das Neves | 4 / Rara | 7% | 2 s | 28% menos dano recebido | 0,97 → **1,14** (1,12) | 1,26 | 1,35 |
| Shaman | 4 / Rara | 5,6% | 2 s | +43% velocidade de ataque | 0,99 → **1,13** (1,12) | 1,20 | 1,27 |
| Sage | 3 / Ultra rara | 9,5% | 3 s | +48% poder de habilidade e 26% menos dano | 0,95 → **1,11** (1,10) | 1,19 | 1,28 |
| Feiticeiro Meowri | 3 / Rara | 4,8% | 3 s | +29% velocidade de ataque | 0,99 → **1,05** (1,08) | 1,13 | 1,17 |
| Barda | 3 / Incomum | 2,2% | 3 s | +26% dano e +22% poder de habilidade | 0,97 → **1,05** (1,06) | 1,09 | 1,15 |
| Rei Goblin | 4 / Ultra rara | 4% | 3 s | +32% dano e +27% velocidade de ataque | 0,98 → **1,15** (1,14) | 1,25 | 1,30 |
| Percussionista Meowri | 3 / Rara | 3,4% | 3 s | +34% velocidade de ataque e +46% movimento | 0,97 → **1,08** (1,08) | 1,13 | 1,20 |

Todos estão dentro da tolerância de ±0,03.

**Teste de estresse** (times cheios de suportes fundidos com upgrade máximo, inclusive em espelho, com auras somando):
- **nenhum empate por tempo**;
- a luta mais longa durou 53,6 s, encerrada pelo aumento de dano aos 40 s;
- não houve lutas "instantâneas".

**Ponto aberto para a etapa dos decks:** os times de suporte fundidos vencem times de dano fundidos. Falta medir se montar 4 fusões de suporte é viável e vantajoso numa run real.

## 3. Arquivos (entrega para integração)

| Arquivo | Mudança |
|---|---|
| `dist/balance-p1.js` | (P1) dados de 33 personagens |
| `dist/supports-b.js` (**novo**) | Suportes modelo B: valores, regras, posicionamento e textos |
| `dist/index.html` | Carrega `balance-p1.js` depois de `game-0.js` e `supports-b.js` depois de `traits-v54.js` |
| `dist/game-0.js` | (P1) `skillScale` em `stats()` |
| `dist/traits-v54.js` | P1 numérico + 6 mecânicas novas + textos EN/PT |
| `tests/traits-v54.cjs` | Valores e mecânicas esperados atualizados |
| `tests/balance-p2.cjs` (**novo**) | Testa os dados, o `skillScale`, as regras das auras e o primeiro golpe do Trailblazer |
| `scripts/validate-balance-base.cjs` | Carrega os módulos novos e roda o teste novo |

Patches cumulativos sobre a v54:
- `balance/entrega/P1P2_dist.diff`
- `balance/entrega/P1P2_tests_scripts.diff`

**Validação:** `node scripts/validate-balance-base.cjs` em `game/` → **PASS nas 7 etapas**.

## Riscos para integrar

- `supports-b.js` envolve duas funções: `JourneyTraits.beforeStep` e `JourneyTree.beforeSettle` (ou `JourneyBosses.beforeSettle`, se a árvore não estiver carregada). Se a versão do ChatGPT mudou essas funções, conferir a ordem de carga.
- Os 10 suportes agora têm `kind: 'passive'`. Deixam de receber o efeito da Ampulheta e do nó "Prontidão", e não podem mais ter o especial "cheio" pelo hack.
- A IA inimiga usa os mesmos suportes, e eles também viram aura para os inimigos.
- As "estrelas" de atributos na ficha não foram atualizadas, porque interface está fora do escopo.
