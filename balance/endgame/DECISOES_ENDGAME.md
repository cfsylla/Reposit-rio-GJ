# Endgame: decisões e especificação dos Desafios da Jornada

Atualizado em 22/11/2026. Chat dedicado ao endgame.
**Nada foi simulado nem alterado no jogo.** Aguardando o pacote do jogo atualizado, enviado pelo ChatGPT, para montar a base de medição.

## 1. Ponto de partida do endgame (decisão do Carlos)
- **O endgame começa na 1ª vitória:** run 7 a 11, árvore com **17 a 21 nós** (cerca de 1/3 dos 60 nós).
- As medições passam a usar **20 nós** como estado inicial, no lugar de 23.
- **Ritmo observado nos playtests:**
  - cerca de 100 de XP por run vencida;
  - faltam cerca de 1.330 a 1.490 de XP para a árvore completa, ou seja, cerca de 15 runs vencidas;
  - 1 nível de desafio a cada 1 a 3 runs.
- **Problema relatado:** depois da 1ª vitória, o começo do endgame fica fácil demais. Isso não pode acontecer.

## 2. Escala geral (decisão do Carlos)
- **+1% de ataque, +1% de vida e +1% de defesa nos inimigos para cada desafio ativo**, qualquer que seja o desafio.
- Vale para **todo tipo de combate** (comum, elite, ordem, raid e Titã) e **todo tipo de boss** (boss de mapa e as duas formas do True Boss).
- O nível 0 fica sem bônus. Conta a quantidade de desafios ativos na run, não o nível mais alto desbloqueado.
- **Objetivo:** o jogo fica mais forte no mesmo ritmo em que o jogador fica mais forte.
- **Notas técnicas:**
  - **Raids e forma 2 do True Boss:** a função dos desafios que mexe nos atributos dos inimigos (`enemyStats`) não roda nas raids (o código só a chama fora delas). A escala precisa entrar também pelo fator de escala da raid (`R.initialize`), em vida e dano.
  - **Defesa:** o dano recebido é multiplicado por 100 ÷ (100 + defesa). +15% de defesa em uma unidade com defesa 26 reduz o dano recebido em cerca de 3%. O efeito da defesa é pequeno e maior nos tanques.

## 3. Candidatos: especificação atual (nenhum entra nem sai do catálogo por enquanto)

| Candidato | Especificação |
|---|---|
| **Mais Elites no Mapa** | Por mapa, **2 camadas de batalha inteiras** (todas as pistas) viram elite, obrigatoriamente. Nunca a 1ª batalha do mapa. A versão por chance (25%, até 2 nós) foi rejeitada: o jogador podia fugir do desafio |
| **Relíquias Amaldiçoadas** | 33% de chance por relíquia obtida. Não contam a relíquia inicial nem a da vantagem Relíquia de Viagem. Maldição sorteada entre Fardo e Correntes (sem Exaustão nem Mau Presságio). **Aprovado** |
| **Árvore de Skill Podre** (nome a mudar) | **Não mexe na árvore.** É um debuff fixo, em %, nas unidades do jogador (ataque, vida, defesa e velocidade de ataque) |
| **Decks Reforçados** | **Vai ser feito; não é opcional.** Elites e bosses usam versões mais fortes dos próprios decks. O jogador **vê** o desafio (dá a sensação de desafio, não só número). Método a definir (seção 4) |
| **Menos Apoio no Mapa** | Por mapa, **1 camada de apoio vira camada de batalhas** (por exemplo, loja, upgrade e evento viram 3 batalhas). O número de camadas não muda. Os outros efeitos de batalha valem nessas lutas. **Nunca a última camada antes do boss** |
| **Loja com Menos Opções** | A loja mostra **2 recrutas e 1 relíquia** (hoje: 3 e 2) |
| **Derrota Custa Ouro** (revisto) | A perda de rodadas reduz o ouro da vitória: vencer por 3×1 perde 33% do ouro da luta; por 3×2, 66% |

## 4. Pontos abertos (para decisão)
1. **Mais Elites:** sortear as 2 camadas entre as batalhas elegíveis? Evitar 2 camadas vizinhas? Excluir as camadas com nós de ordem e a camada logo antes do boss?
2. **Mais Elites + Menos Apoio:** as camadas de apoio convertidas em batalha podem virar elite?
3. **Relíquias Amaldiçoadas + Ídolo profano:** as maldições do desafio contam para o bônus do Ídolo?
4. **Debuff no jogador:** nome novo e valor (hipótese de teste: 4% a 6% nos 4 atributos).
5. **Decks Reforçados:** método (troca das cartas mais fracas pelo ranking `lab2`, ajuste de cópias para fusão, ou listas feitas à mão), o que fazer com os bosses de ordem (time com 4 cópias) e como mostrar na tela.
6. **Derrota Custa Ouro:** regra nos bosses (vitória com 4) e nas raids (limite de 5 derrotas). Proposta: perda = rodadas perdidas ÷ rodadas necessárias para vencer. Decidir se vale só para o ouro base da vitória ou também para os bônus (por exemplo, Caçador de Elites).
7. **Catálogo:** são 15 desafios + 7 candidatos = 22 peças. Os 15 finais saem depois da medição.
