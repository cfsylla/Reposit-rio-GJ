# Etapa P2 — 7 mecânicas de traits e suportes "modelo B" (testados, aguardando aprovação dos valores)

Base dos testes: a cópia balanceada com a P1 já aplicada (`game/`). Cada novidade foi montada numa cópia experimental separada. A v54 e a cópia balanceada não foram alteradas.

## 1. Mecânicas novas de traits

Método: o mesmo teste de "trait ligado × desligado", nas **mesmas** 3 combinações de personagens, comparando a cópia balanceada atual com a cópia experimental.
- Ganho = quanto o time inteiro fica mais forte.
- Ruído: cerca de ±1 ponto.

| Trait | Mecânica nova | Valores finais propostos | 2 membros: antes → depois | 4 membros: antes → depois |
|---|---|---|---|---|
| Legends of the East | cada 4º básico causa dano extra e mantém ignorar 25% / 40% da defesa | +50% / +60% de dano | +0,0% → +2,2% | +0,8% → +4,4% |
| Goblin | ataque extra por **outro** Goblin diferente vivo (até 3) | +8% por Goblin | +0,1% → +1,4% | +2,2% → +5,9% |
| Trailblazer | movimento menor; o primeiro golpe depois de se deslocar (30+ de distância) causa dano extra, no máximo a cada 4 s | movimento +15% / +25%; golpe +45% / +65% | −1,3% → +1,0% | −0,4% → +3,2% |
| Protector | aliados a até 90 de um protetor vivo recebem menos dano. Vale o protetor mais forte, não acumula | 5% / 10% | +2,4% → +2,4% | +1,3% → +5,8% |
| Patient | a cada 3 s de luta: defesa e ataque extras, acumulando até 3 vezes | DEF +8% / +15% e ATQ +4% / +8% por acúmulo | +0,2% → +2,5% | +2,1% → +7,7% |
| Fearless | dano extra sempre, que dobra abaixo de 40% de vida | +12% / +15% | +0,7% → +1,7% | +1,7% → +8,3% |
| Arcane (alternativa) | especiais dos membros sempre mais fortes | +15% / +30% | +0,7% → +0,8% | **+4,6% → +3,1% (pior)** |

**Recomendação:**
- Aprovar as 6 primeiras.
- **Descartar a alternativa do Arcane** e manter o ajuste numérico que já foi aprovado (40% / 60%), que mediu melhor.

Com 2 membros, todo trait rende pouco, porque só 2 personagens recebem o efeito. Aumentei os valores do 1º patamar numa 2ª passada (Legends, Goblin, Trailblazer, Fearless) e eles subiram cerca de 1 ponto. Passar disso faria o 1º patamar quase igual ao 2º.

Observação: o Protector deixa de provocar inimigos. A provocação antiga é substituída pela redução de dano em área.

## 2. Suportes no modelo B

Como você pediu, a habilidade deles **vira passiva**. As habilidades ativas antigas saem: Santuário da Priestess, Canção da Harpista, Pólen da Fada etc. Agora cada suporte tem uma aura com raio de 120 que:
1. **cura** os aliados dentro dela em X% da vida máxima a cada Y segundos. O próprio suporte recebe metade, mantendo o nerf de autocura;
2. dá um **bônus W** aos aliados dentro dela enquanto o suporte estiver vivo;
3. **fica perto dos aliados**: o suporte se mantém cerca de 60 atrás da linha da frente e acompanha o avanço, em vez de partir para cima dos inimigos. Continua atirando em quem estiver ao alcance.

Valores calibrados para cada suporte atingir a meta de custo e raridade **que ele já tem**. Custo e raridade não mudaram.

| Suporte | Custo / raridade | Cura | A cada | Bônus W na aura | Índice antes → depois (meta) | Upgrade máx. | Fundido |
|---|---|---|---|---|---|---|---|
| Priestess | 4 / Incomum | 6,3% | 2 s | redução de dano 16% | 1,00 → **1,10** (1,10) | 1,16 | 1,25 |
| Harpista | 4 / Ultra rara | 11,5% | 2 s | velocidade de ataque +23% | 0,96 → **1,13** (1,14) | 1,20 | 1,26 |
| Fada das Flores | 3 / Rara | 9% | 2 s | poder de habilidade +28% | 0,94 → **1,06** (1,08) | 1,11 | 1,16 |
| Troll das Neves | 4 / Rara | 6,2% | 2 s | redução de dano 25% | 0,97 → **1,12** (1,12) | 1,22 | 1,32 |
| Shaman | 4 / Rara | 4,5% | 2 s | velocidade de ataque +34% | 0,99 → **1,11** (1,12) | 1,21 | 1,29 |
| Sage | 3 / Ultra rara | 8% | 3 s | poder de habilidade +40% e redução de dano 22% | 0,95 → **1,06** (1,10) | 1,14 | 1,22 |
| Feiticeiro Meowri | 3 / Rara | 4,8% | 3 s | velocidade de ataque +29% | 0,99 → **1,08** (1,08) | 1,16 | 1,22 |
| Barda | 3 / Incomum | 2% | 3 s | ataque +24% e poder de habilidade +20% | 0,97 → **1,05** (1,06) | 1,10 | 1,16 |
| Rei Goblin | 4 / Ultra rara | 4% | 3 s | ataque +32% e velocidade de ataque +27% | 0,98 → **1,14** (1,14) | 1,30 | 1,37 |
| Percussionista Meowri | 3 / Rara | 3,2% | 3 s | velocidade de ataque +32% e movimento +43% | 0,97 → **1,08** (1,08) | 1,12 | 1,22 |

Cura e bônus crescem com upgrade e fusão, mas **pela metade** do crescimento normal do poder de habilidade. Isso evita que um suporte fundido fique desproporcional.

### Travas de segurança (de onde vieram)

O teste de estresse usou times cheios de suportes fundidos com upgrade máximo, inclusive em espelho dos dois lados. A primeira versão revelou dois problemas, já corrigidos:

1. **Bônus empilhando.** Sage, Rei Goblin e Barda juntos venciam em 1,9 s. Regra: **o mesmo atributo vindo de suportes diferentes não se soma; vale o maior.** É a mesma lógica dos totens que não acumulam.
2. **Ciclo de realimentação.** O bônus de poder de habilidade de um suporte fortalecia a aura de outro suporte, e a dele mesmo, sem parar. Regra: **a força da aura usa só o poder base do suporte**, nunca bônus recebidos.

Depois das correções:
- Nenhuma luta terminou empatada por tempo (120 s).
- A luta mais longa terminou em cerca de 50 s, por causa do aumento de dano a partir dos 40 s. Na v54, os espelhos já duravam cerca de 43 s.
- Ponto de atenção para a etapa dos decks: times com 4 suportes fundidos venceram times de dano fundidos. Falta medir se isso vale o custo de montar 4 fusões numa run real.

## 3. O que preciso que você aprove

1. As 6 mecânicas de traits com os valores finais acima, e o descarte da alternativa do Arcane.
2. Os suportes no modelo B com os valores da tabela, incluindo:
   - a troca da habilidade ativa pela aura passiva;
   - as duas travas de segurança;
   - o crescimento pela metade com upgrade e fusão.

Depois da aprovação, aplico tudo na cópia balanceada, escrevo os textos novos de traits e habilidades em inglês e português, atualizo os testes e sigo para a etapa dos **decks**.

## Reprodução

```sh
node balance/sim/apply-mech.cjs <copia>/dist/traits-v54.js '{"legends":[0.5,0.6],"goblin":[0.08,0.08],"trail":[0.45,0.65],"fearless":[0.12,0.15]}'
GJ_ROOT=<copia> node balance/sim/traitlab.cjs --mode trait --only "Goblin" --combos 3
GJ_ROOT=balance/work/supports_b node balance/sim/lab.cjs --seeds 3 --levels 0,2,F --units priestess
GJ_ROOT=balance/work/supports_b node balance/sim/stress.cjs
```
Protótipo dos suportes: `balance/work/supports_b/dist/supports-b.js`.
