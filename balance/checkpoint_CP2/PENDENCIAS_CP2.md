# Pendências de balanceamento após o checkpoint GJ-v54-BAL-CP2

**Nada desta lista deve ser aplicado automaticamente no projeto principal.**

## 1. Conteúdo a cargo do projeto principal
- **Boss secreto (Desafio Final):**
  - personagem, arte, mecânicas e a sequência dos 4 confrontos: primeiro o true boss da ordem que o jogador seguiu nas 6 batalhas de ordem, depois os outros 2 em ordem aleatória, e por fim o boss secreto;
  - regra já definida: ele precisa ser **mais forte que os outros true bosses**;
  - o Claude calibra quando o conteúdo existir.
- **Recompensa extra do Desafio Final** e títulos ou cosméticos.
- **Telas novas** (especificação na seção 7 de `INTEGRACAO_CHATGPT_CP2.md`).

## 2. A conferir em playtest humano
- **Vantagens que dependem de escolha**, cujo efeito medido pode estar subestimado:

  | Vantagem | Impacto medido |
  |---|---|
  | Mão Planejada | +4. Negativo nos decks Blackfang com a regra de escolha do jogador simulado |
  | Preparação Flexível | +3 |
  | Olho Treinado | +1 |
  | Limpeza | 0 |
  | Fusão Eficiente | 0 |

- **Energia Dissipada** pesa mais nos decks Blackfang (−11) do que na média (−5).
- **Ritmo do pós-jogo:** a escada sai em umas 15 a 30 runs (1 a 3 por nível). Carlos decidiu manter assim.

## 3. Experimentos não aprovados (só na área de trabalho do Claude)
- **Desafios aposentados:**
  - Árvore Contida (−19);
  - Líderes Inteiros e Escolhas Escassas (sem efeito);
  - Sem Preparo (dependia de espaços de preparativo).
- **Reserva para o lugar da Energia Dissipada:** Cópia Obrigatória, duplicar 2 cartas (−11).
- **Candidatos descartados:** Relíquia Trocada (−18), Bosses com 5 ou 6 vitórias de rodada (sem efeito) e as versões intermediárias de cada peça. Todos registrados em `balance/out/triagem` e `balance/out/valid`.
- **Vantagens aposentadas:** Reforço, Gêmeo, Relíquia Escolhida e Mão Firme. Os ids continuam no código só para saves e testes.
- **Curvas testadas e não escolhidas:** P0, P1, P2, BC_A e BC_C. Custo dos nós finais: ×1,25 e ×2.

## 4. Decisões já tomadas (registro)
- Sem liberação retroativa de decks.
- Decks emprestados liberados por milestone ou por 25 diamantes.
- As barras da ficha (`ratings`) não são vistas pelo jogador. Foram recalculadas só para manter os dados coerentes.
- Saves antigos ignorados.

## 5. Próximas análises possíveis
1. Especiais de Expedição da árvore (efeito econômico).
2. Economia de eventos, maldições e missões.
3. Relíquias do jogador: preço, formato e valor por casa.
4. Economia permanente: diamantes (agora com o XP excedente), boosters, raridades e coleção.
5. Calibração do boss secreto, quando existir.
