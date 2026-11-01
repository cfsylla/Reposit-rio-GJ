# Etapa 4 — Pacote de dificuldade e economia (proposta, testado)

Novo conceito informado por Carlos: depois de vencer o boss final, abre-se um **modo de desafio** (ainda será implementado) para quem quiser mais dificuldade. Portanto, **a run normal precisa ser vencível com a árvore intermediária.** A curva gradual (curva 1) já está aprovada.

Todos os testes usaram a cópia balanceada (P1 + P2 + P3 + Fearless V4):
- jogador simulado competente (aceita eventos seguros e compra relíquias);
- 15 decks base, 10 runs por deck em cada linha (150 runs por linha).

## O que cada passo mudou (árvore intermediária de 8 nós)

| Versão | O que entrou | Passa mapa 1 | Passa mapa 2 | Vence |
|---|---|---|---|---|
| Hoje | — | 5% | 0% | 0% |
| Curva 1 (aprovada) | inimigo ganha ~1 upgrade por luta; elite +3; boss +4 | 23% | 4% | 1% |
| V1 | elite +1 e boss +2 em vez de +3 / +4 | 28% | 3% | 0% |
| V2 | + ouro por vitória 10/12/14 → **15/18/21** (por mapa) | 30% | 3% | 0% |
| V3 | + upgrade na loja 12/20 → **10/16** | 33% | 6% | 0% |
| V4 | + força extra por mapa ×1,12 / ×1,25 → ×1,06 / ×1,12 | 33% | 11% | 5% |
| V5 | + início de cada mapa um pouco mais fraco (0,86 → 0,82) e limite de relíquias inimigas 1 / 2 / 3 por mapa | 48% | 13% | 9% |
| V9 | + boss com menos upgrades que a curva | 69% | 25% | 18% |
| **V11** | + desconto do boss por mapa (−3 / −6 / −8), líder dos bosses de ordem −20%, força por mapa ×1 / ×1,03 / ×1,06 | 64% | 26% | **21%** |

## V11 em cada estado da árvore

| Árvore | XP investido (aprox.) | Passa mapa 1 | Passa mapa 2 | Vence |
|---|---|---|---|---|
| Vazia | 0 | 35% | 9% | 6% |
| Intermediária pequena (8 nós) | 70 XP, ~5 runs | 64% | 26% | 21% |
| **Intermediária (15 nós)** | **140 XP, ~8 a 10 runs** | 78% | 47% | **38%** |

## O pacote V11 em palavras simples

**(a) Economia do jogador**
- Ouro por vitória: 10 / 12 / 14 → **15 / 18 / 21** (mapa 1 / 2 / 3).
- Upgrade na loja: 12 e 20 → **10 e 16**.

**(b) Elites, ordens e bosses**
- Elites: a curva + 1 upgrade. Ficam sempre um pouco acima da batalha normal.
- Boss comum (um deck emprestado): curva **−3 / −6 / −8** upgrades por mapa. Ele já é um deck bem montado e precisa de 4 vitórias.
- Boss de ordem (Rei Goblin, Rei Troll, Imperador Orc, Rainha Meowri, etc.): **líder com −20% de vida e ataque**. O Rei Troll e o Imperador Orc derrotavam o jogador em 91% das vezes no mapa 2.
- Relíquias de elites e bosses inimigos: no máximo **1 / 2 / 3** por mapa. Hoje o número cresce sem limite ao longo da run.

**(c) Força por mapa**
- Multiplicador de força dos inimigos: ×1 / ×1,12 / ×1,25 → **×1 / ×1,03 / ×1,06**. A dificuldade passa a vir dos upgrades, que crescem aos poucos, e não de um salto de atributos.
- Começo de cada mapa um pouco mais fraco (0,86 → 0,82), mantendo o crescimento de +2% por luta dentro do mapa.

## Achados que ainda vou tratar

1. **As raids parecem fáceis demais.** Em 146 raids simuladas, o jogador nunca perdeu. Preciso medir quantas rodadas cada uma leva e quanta vida sobra.
2. **O boss do mapa 1 pode ter ficado fácil** (cerca de 5% de derrota). Vou ajustar junto da definição de "intermediária".
3. As **ordens Dawncrest do mapa 1 (~10%)** e as **Blackfang do mapa 2 (~18%)** ainda são as lutas comuns mais perigosas.
4. Os **decks inimigos temáticos por mapa** (já aprovados como ideia) ainda não entraram nesses testes.

## Decisões para Carlos

1. **O que é "árvore intermediária"?** Proponho **15 nós (~140 XP, umas 8 a 10 runs)**.
2. **Meta:** com essa árvore, o jogador simulado vencer **~40% a 50%** das runs (um humano deve ir melhor), e com a árvore vazia **~5% a 10%**. Hoje está em 38% e 6%.
3. **Aprovar a direção do pacote V11.** Os valores finais saem depois da rodada fina, que vai incluir raids, decks inimigos por mapa e a meta escolhida.
