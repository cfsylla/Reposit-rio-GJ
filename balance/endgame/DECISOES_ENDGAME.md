# Endgame: decisões e especificação dos Desafios da Jornada

Atualizado em 22/11/2026 (2ª rodada de decisões). Chat dedicado ao endgame.
**Nada foi simulado nem alterado no jogo.** A base de medição é a **v65** (pacote leve do ChatGPT, commit `b0e45f18`), guardada em `game_v65/`.

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

## 4. Decisões da 2ª rodada (22/11)
- **Começo do endgame:** considerar liberar os desafios **em blocos**, misturando fáceis e difíceis para manter o ritmo. O passo da escala (1% ou 3%) será decidido depois da medição.
- **Mais Elites:**
  - só **batalhas simples** viram elite. Ordens não são batalhas normais e ficam fora;
  - XP e drops a mais são aceitos: **mais risco, mais recompensa** (o jogador também pode perder a run).
- **Mais Elites + Menos Apoio:** as camadas de apoio convertidas em batalha **podem virar elite**.
- **Ídolo profano + Relíquias Amaldiçoadas:** as maldições do desafio **contam** para o Ídolo (mais risco, mais recompensa).
- **Fadiga da Jornada** (novo nome do debuff no jogador): testar de **−4% a −6%** em ataque, vida, defesa e velocidade de ataque.
- **Decks Reforçados:**
  - regra para teste: as 2 cartas mais fracas do deck (pelo ranking `lab2`) saem, e entram as 2 mais fortes da mesma facção ou trait que não estão no deck;
  - medir quanto o deck fica mais forte; ajuste fino depois;
  - **bosses entram também**;
  - decks com 4 cópias por personagem: trocar o personagem mais fraco ou com menos sinergia por um mais forte;
  - na tela: nome do deck + "Deck Reforçado".
- **Derrota Custa Ouro:** **−33% do ouro da vitória por rodada perdida**, em qualquer luta. Se a perda chegar a 100% ou mais, o ouro da vitória vai a zero. Exemplos: 3×1 perde 33%; 3×2 e 4×2 perdem 66%; 4×3 zera.
- **Loja com Menos Opções:** confirmada. 2 recrutas e 1 relíquia, também depois do refresh.

## 5. Decisões da 3ª rodada (22/11)
- **Mais Elites:** as 2 camadas são sorteadas entre as camadas de batalhas simples, **sem camadas vizinhas** e **sem a camada logo antes do boss**.
- **Derrota Custa Ouro:**
  - a perda vale **só para o ouro base da vitória**. Bônus como o do Caçador de Elites não são afetados;
  - nas raids e na forma 2 do True Boss, **cada derrota conta como rodada perdida**.

## 6. Decisões depois das etapas 1 a 4 (22/11)
- **Escala de força inimiga:** **+2% de vida, ataque e defesa por desafio ativo**, em todo combate e todo boss.
- **Fadiga da Jornada:** **−3%** em ataque, vida, defesa e velocidade de ataque das unidades do jogador.
- **Tropas Resistentes + Ataques Implacáveis:** viram **um desafio só** (vida e ataque dos inimigos). Valores a definir.
- **Reserva (saem do catálogo, podem voltar):** Recursos Escassos; Fúria das Raids (fácil de evitar: o jogador ativa o desafio e não segue os Monstros); Relíquias Escassas.
- **Bolsa Leve:** ouro por vitória **−30%**.
- **Bagagem Limitada:** bloqueia **4 casas** (a fileira de baixo). Com 5 o visual fica estranho.
- **Ainda em aberto:** Reforços Inimigos (rodada de início) e Menos Apoio (1 ou 2 camadas).
## 7. Decisões (22/11, depois da lista dos 22 desafios)
- **A faixa de −5 a −10 é referência**, não regra: nem todo desafio precisa ficar dentro dela.
- **Reforços Inimigos:** a partir da **3ª rodada** (medido: −17,5 com 20 nós).
- **Menos Apoio no Mapa:** **2 camadas** por mapa (−11,5).
- **Tropas + Ataques num desafio só**, mantendo **+10% de vida e +8% de dano** (efeito juntos ainda não medido).
- **Catálogo: 18 desafios**, em **3 blocos de 6**. O bloco seguinte só é liberado depois de vencer uma run com **o bloco atual inteiro ligado** (como no Astral Ascent).
- **Vantagens:** depois de validar os desafios. Também serão liberadas por blocos.
## 8. Regras dos blocos (22/11)
- **Blocos acumulam:**
  - bloco 1 = níveis 1 a 6, com escolha livre entre os 6 desafios;
  - bloco 2 = níveis 7 a 12, com o bloco 1 inteiro ligado + 1 a 6 desafios do bloco 2;
  - bloco 3 = níveis 13 a 18, com os blocos 1 e 2 inteiros + 1 a 6 desafios do bloco 3;
  - no nível máximo, tudo fica ligado.
- **Escolha livre dentro do bloco.** O jogador não sabe quanto cada desafio pesa.
- **Insígnia:** continua sendo 1 por nível inédito. Ao ganhar a 7ª Insígnia, libera o 2º bloco, e assim por diante (a confirmar: bloco de vantagens ou de desafios).
- **Blocos assimétricos:** o começo do endgame está fácil, e o jogador que avança fácil cresce a árvore e continua com facilidade. Os blocos precisam ser mais fortes no começo. Opção em estudo: 6 blocos de 3.
## 9. Pontos ainda abertos
1. **Catálogo:** são 15 desafios + 7 candidatos = 22 peças. Os 15 finais (e os blocos) saem depois da medição.
## 10. Vantagens: novas (22/11)
- **Aprovadas para entrar:** Troféu de Boss (cada boss de mapa vencido: +3% de vida e ataque até o fim da run) e Vitória Limpa (vencer um confronto sem perder rodada: +8 de ouro). Valores provisórios.
- **Emboscada** (antes "Primeiro Golpe": na 1ª rodada de cada confronto, exceto bosses, o inimigo coloca 1 unidade a menos): **entra no catálogo** no lugar da Final Union (pode ser forte; os testes vão dizer).
- **Final Union** (antes "Pureza"): patamar extra das traits, com efeito visual marcante (o símbolo da trait aparece no início da rodada; se várias ativarem, uma depois da outra). **Fica para depois**, precisa amadurecer. Motivos: só 2 facções têm 6 personagens recrutáveis (Fada 1, Orc e Centauro 3, Wild West, Troll e Forest Elf 4, outras 6 facções 5), e 6 personagens em campo só existem na 5ª rodada. Regra estudada: ≥ 4 personagens diferentes e todo o campo com a trait (relíquias de trait contam +1); força = patamar de 4 × 1,3.
- **Catálogo: 18 vantagens** = 15 atuais + Troféu de Boss + Vitória Limpa + Emboscada. Nada rodado ainda.
## 11. Vantagens atuais: revisão (22/11)
| Vantagem | Hoje | Novo |
|---|---|---|
| Preparação Flexível | 1 renovação grátis da mão por rodada | **1 renovação grátis da mão por confronto** |
| Bolsa Cheia | +20 de ouro inicial | **+40 de ouro inicial** |
| Segunda Chance | 1 vez por run, perder um confronto (exceto boss) repete só a última rodada; o inimigo perde 1 ponto | **1 vez por run, perder um confronto (inclusive boss) dá mais uma rodada**: o limite de derrotas sobe em 1 (ex.: elite em x:3 joga até perder a 4ª). Aparece na tela "Segunda Chance" |
| Limpeza | 1 remoção grátis na 1ª loja de cada mapa | **1 remoção grátis em cada loja** |
| Olho Treinado | 1 renovação grátis em toda escolha de relíquia | **1 renovação grátis em toda escolha de relíquia e de recrutamento** |
Nada rodado ainda.

- Confirmações: Segunda Chance igual em raids/Titãs/True Boss forma 2; rodada extra conta para Derrota Custa Ouro; Olho Treinado vale no nó de recrutamento.
## 12. Fechamento (23/11)
- **Escala de força inimiga: +1%** de vida, ataque e defesa por desafio ativo (substitui os 2% da seção 6). Medido: nível 18 com 32% no simulador, contra 5% com 2%.
- **Alvo de vitória:** 40 a 70% para o humano. O simulador joga cerca de 10 pontos pior, então o alvo nele é de 30 a 60%.
- **Sem teto e sem condições** do tipo "vale a partir do mapa 2".
- **Desafios:** 6 blocos de 3, cumulativos (seção 8 e pacote).
- **Vantagens:** 6 blocos de 3: Experiência de Elite, Caçador de Elites e Emboscada | Limpeza, Olho Treinado e Relíquia de Viagem | Segunda Chance, Preparação Flexível e Mão Planejada | Troféu de Boss, Bolsa Cheia e Juros | Vitória Limpa, Energia Guardada e Fusão Eficiente | Bênção do Caminho, Treino Prévio e Ensaio. O bloco seguinte abre com o atual inteiro (4ª, 7ª, 10ª, 13ª e 16ª Insígnia).
- **Pendente de validação em playtest:** o vale dos níveis 7 a 11 (18 a 27% no simulador). A campanha completa simulada fica para depois.
- **Final Union:** adiada.
- **Pacote para o ChatGPT:** `balance/endgame/pacote_endgame/`.
## 13. Playtest e pendências (23/11)
- **Run teste 1:** Linha de Fogo, nível 1 só com Mais Elites, 21 nós, sem vantagens. Vitória com 25 de 28 lutas por 3×0: muito fácil.
  - **Mais Elites ajuda** no simulador (+4 a +25).
  - **Linha de Fogo** é o deck mais forte: 60% com 20 nós no simulador, contra 41% na média.
- **Pendente, depois de mais runs:**
  - trocar Mais Elites (bloco 1) com Fadiga da Jornada (bloco 2);
  - decidir a Linha de Fogo (balanceamento de deck).
- **Ideia do Carlos, pendente:** cartas de boss (por exemplo, o Grand Oracle, muito forte) só entram em campo a partir da 4ª rodada, como emergência.
  - Nas lutas comuns e nas elites, a 4ª rodada só existe depois de uma derrota.
  - Nos bosses (4 vitórias), a 4ª rodada acontece sempre.
  - Falta definir a regra e medir.
- **Run teste 2 (próxima):** Blades (40% com 20 nós no simulador), nível 1 com Inimigos Fortalecidos, os mesmos 21 nós do início da run 1, sem vantagens.
- **Cartas de boss: nova regra de liberação (Carlos, 23/11).**
  - **Hoje** (`progression-v56.js`, `grantBossCards`): vencer o True Boss de uma ordem libera **de uma vez** todas as cartas de boss daquela ordem.
  - **Novo:** vencer o True Boss dá **acesso** às cartas. Cada carta só é liberada ao **vencer o boss dela**. Os bosses vencidos na própria run em que o True Boss caiu também liberam as cartas deles.
  - **Confirmado:**
    - o acesso vale **por ordem**: o True Boss da ordem X dá acesso só às cartas dos bosses da ordem X;
    - nos saves atuais, as cartas liberadas pela regra antiga **voltam a ficar bloqueadas** até vencer o boss de cada uma.
  - Entra no próximo pacote. Não montar pacote por enquanto: Carlos segue com os playtests.
