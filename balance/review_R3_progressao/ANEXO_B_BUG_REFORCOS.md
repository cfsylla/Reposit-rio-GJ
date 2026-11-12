Encontrei um bug no desafio **Reforços Inimigos** (`reinforcements`) na versão publicada (build `v56-CP4`). O desafio fica ativo, mas não coloca a unidade extra em campo.

**O que o save mostra (run Vanguard de 11/11, vitória)**
- `run.challenges = ["reinforcements"]`, e todas as lutas comuns e elites têm a fonte `challenge:reinforcements` em `enemyScaleSources`. Ou seja, o jogo sabe que o desafio está ativo.
- Mesmo assim, a formação inimiga em `rounds[i].enemy.formation` tem **o mesmo número de unidades do jogador em todas as 24 lutas comuns e elites**: 2v2 no round 1, 3v3 no round 2 e 4v4 no round 3. Com o desafio, o esperado é 2v3, 3v4 e 4v5.
- A run anterior, sem desafio (Fireline), tem exatamente as mesmas contagens. O desafio não teve nenhum efeito.

**Como deveria funcionar (código de referência do CP4)**
- `challenges.js`: `extraUnits(s)` devolve 1 quando `reinforcements` está ativo, não é raid nem boss, e `s.round >= TUNE.reinforceFromRound` (que vale 1).
- `challenges.js`: `energy(s, true)` dá **+2 de energia** ao inimigo quando `extraUnits(s)` vale 1, para ele conseguir pagar a unidade extra.
- `game-0.js`: `maxUnits(s, true)` = `min(6, round + 1)` + `extraUnits(s)`. Esse é o limite de unidades em campo do inimigo.
- `game-0.js`: em `enemies(s)`, a IA coloca unidades enquanto `on.length < maxUnits(s, true)`. A energia do inimigo vem de `energyIncome(s, true)`, que soma `JourneyChallenges.energy(s, true)`.

**O que conferir na versão publicada**
1. Se `maxUnits(s, true)` ainda soma `JourneyChallenges.extraUnits(s)`, e se `enemies()` usa `maxUnits(s, true)`, e não `maxUnits(s)`, para o limite do inimigo.
2. Se `energyIncome(s, true)` ainda soma `JourneyChallenges.energy(s, true)`.
3. Se algum passo depois de `enemies()` corta a formação inimiga para o tamanho da formação do jogador (por exemplo, na montagem da batalha ou no registro do save).
4. Se `bossFight(s)` não está dando verdadeiro em lutas comuns. Ele usa `s.current?.type === 'boss' || !!JourneyBosses.deck(s)`.

**Pedido**
- Corrigir para que, com o desafio ativo, lutas comuns e elites tenham +1 unidade inimiga desde o round 1. Bosses, True Bosses e raids continuam sem a unidade extra.
- Conferir os outros desafios que mexem no inimigo da mesma forma: Veteranos, Comandantes, Tropas Resistentes, Ataques Implacáveis, Bosses Implacáveis, Fúria das Raids e Recursos Escassos. Para cada um, me diga se o efeito aparece de fato na luta.

No final, me mande os arquivos alterados e um item de `encounters[]` de luta comum com o desafio ativo, mostrando 2v3 no round 1.
