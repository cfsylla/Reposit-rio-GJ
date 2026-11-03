# Resposta às 5 propostas do ChatGPT (Desafios e Vantagens da Jornada)

**Claude, 03/11/2026.** Teste na cópia de balanceamento (`game_p5/`); nada foi integrado ao projeto principal.

**Método:**
- Cada peça foi ativada sozinha, com a árvore no **nível 25**, que é o momento da 1ª vitória e da abertura do pós-jogo.
- **Triagem:** 5 decks × 40 seeds (Lâminas do Oriente, Círculo Verdejante, Lei do Gatilho, Presas Negras e Galope Centauro). Margem de cerca de ±7 pontos.
- **Validação:** 24 decks × 20 seeds, 480 runs. Margem de cerca de ±5 pontos.
- **Jogo base:** 58% de vitória.
- **Metas:** desafio −5 a −10 (exceções −3 a −12); vantagem +3 a +7 (exceções +1 a +9).
- **Diferenças entre decks:** com 20 runs por deck, a margem por deck individual é de cerca de ±20. Por isso, as diferenças abaixo são dadas **por grupo de decks** (15 comuns, 4 Blackfang e 5 Dawncrest). Números de um deck só servem apenas como sinal.

**Combinações:** como combinado com Carlos, as combinações (Energia Dissipada com Energia Guardada e Recursos Escassos; Experiência de Elite com Caçador de Elites; etc.) e a escada dos 15 níveis rodam **só depois** que todas as peças forem aprovadas. Hoje falta a Fusão Eficiente. As interações abaixo são análise de regra, ainda não medidas.

---

## 1. Desafio Energia Dissipada (substitui Árvore Contida)

1. **Versões testadas (triagem):**

   | Versão | Impacto |
   |---|---|
   | Perde metade da sobra, arredondando a perda para cima | −11,5 |
   | **Perde 1 fixo** | **−8,5** |
   | Guarda no máximo 2 | −2,0 |

   Validação da versão **perde 1 fixo** com os 24 decks: **−5,4**.
2. **Impacto e decks:**
   - **Blackfang −11**, comuns −5, Dawncrest −2.
   - Os decks Blackfang sentem mais (Presas Negras −20). Provavelmente são decks que acumulam energia para jogar cartas caras.
   - Os Dawncrest quase não sentem.
3. **Interações e abuso:**
   - **Energia Guardada** (+1 na 1ª rodada) não conflita: a perda acontece no fim da rodada e o bônus entra no começo.
   - **Recursos Escassos** (−1 nas rodadas 1 e 2 contra bosses) soma pressão nas lutas de boss. É candidata a combinação perigosa no teste de combinações.
   - Não há abuso possível, porque é um desafio.
4. **Recomendação:** **perde 1 da energia que sobrar ao fim de cada rodada.** Fica na faixa ideal (−5,4), é a regra mais simples de ler, e a perda nunca passa de 1 por rodada.
5. **Limitações:** o jogador simulado não planeja guardar energia de propósito. Um humano que joga acumulando energia deve sentir mais. Conferir em teste manual, principalmente com decks Blackfang.

## 2. Vantagem Preparação Flexível (substitui Reforço)

1. **Versões testadas:**

   | Versão | Triagem | Validação (24 decks) |
   |---|---|---|
   | 1 renovação grátis por confronto | +2,0 | −1,5 |
   | **1 renovação grátis por rodada** | +4,0 | **+2,7** |
2. **Impacto e decks:**
   - Dawncrest +7, Blackfang +5, comuns +1.
   - Funciona melhor em decks com fusões e combinações de traits, que dependem de achar a peça certa.
3. **Interações e abuso:**
   - Usa as regras normais de renovação, só sem o custo. Não acrescenta cartas.
   - Por ser 1 por rodada, não dá para "pescar" várias vezes.
   - Não vi abuso.
4. **Recomendação:** **uma vez por rodada, renova a mão de graça.** Fica na exceção aceita (+2,7).
5. **Limitações:**
   - Regra do jogador simulado: renova a partir da 2ª rodada quando nenhuma carta da mão funde ou combina com uma unidade já em campo ou no banco; em qualquer rodada, renova quando não tem nenhuma carta jogável.
   - A 1ª versão dessa regra renovava sempre na rodada 1 e deu resultado negativo. Foi corrigida.
   - Um humano escolhe melhor quando renovar, então o benefício real deve ser **maior**. Conferir em teste manual.

## 3. Vantagem Fusão Eficiente (substitui Gêmeo): **conceito esgotado, precisa de decisão**

1. **Versões testadas:**
   - 1ª fusão da rodada devolve 1 de energia: triagem −0,5, validação **0,0**;
   - 1ª fusão da rodada devolve 2: −0,5;
   - toda fusão devolve 1: −0,5.
2. **Impacto e decks:** **0 exato em todos os grupos.**
   - As runs com e sem a vantagem saem praticamente idênticas. A energia devolvida quase nunca é usada.
   - Na hora da fusão, o jogador normalmente já gastou o que queria, ou não tem mais carta para jogar.
3. **Interações e abuso:** a fusão só conta quando é concluída, e cada uma só dá o bônus uma vez. Não dá para repetir o ganho movendo unidades.
4. **Recomendação:** **não aprovar como está.** Pela regra do prompt ("sinalizar antes de alterar a mecânica central"), a decisão é de Carlos. Possíveis caminhos, que mudam o conceito:
   - a) a fusão **custa 1 de energia a menos**, em vez de devolver depois;
   - b) a unidade fundida ganha **+X% de atributos**;
   - c) a energia devolvida **passa para a rodada seguinte**;
   - d) pedir outra vantagem ao ChatGPT.
5. **Limitações:** o jogador simulado funde sempre que pode, e usa a energia antes de fundir. Um humano até poderia planejar a ordem (fundir primeiro para ganhar energia e depois jogar), mas o ganho tende a ser pequeno.

## 4. Vantagem Mão Planejada (substitui Mão Firme)

1. **Versões testadas:**

   | Versão | Impacto |
   |---|---|
   | Todo confronto, escolha ruim do jogador simulado | −13 (ver limitações) |
   | Todo confronto, escolha corrigida | +11 (triagem) |
   | Só elites e bosses | +2,0 (triagem) |
   | **Confrontos alternados (1º, 3º, 5º...)** | **+4,5** (triagem), **+3,7** (validação) |
2. **Impacto e decks:**
   - Comuns +6, Dawncrest +6, **Blackfang −6**.
   - Nos decks Blackfang, a carta escolhida pela regra (a de mais cópias e valor) costuma não ser a peça que define o deck. Exemplo: Horda Goblin −15.
3. **Interações e abuso:**
   - Combina com Preparação Flexível: dá para renovar a mão sem perder a carta garantida, porque ela já veio na mão inicial.
   - Nenhuma cópia é criada.
   - Não vi abuso.
4. **Recomendação:** **escolhe uma carta do deck, e uma cópia começa na mão em confrontos alternados.** Fica na faixa ideal (+3,7). Em todos os confrontos ela é forte demais (+11).
5. **Limitações:**
   - É **a vantagem que mais depende da escolha do jogador.**
   - Regra do jogador simulado: escolhe a carta com mais cópias e mais valor (a mesma regra que ele usa para escolher upgrades).
   - Com a regra antiga, que preferia cartas com 2 cópias para fusão, o resultado foi −13. Isso mostra o quanto a escolha importa.
   - Um humano que escolhe a peça principal deve tirar **mais** que +3,7. Conferir em teste manual, principalmente nos decks Blackfang.

## 5. Vantagem Experiência de Elite (substitui Relíquia Escolhida)

1. **Versões testadas (triagem):**

   | Versão | Impacto |
   |---|---|
   | +3% por elite | **+34,5** |
   | +1,5% por elite | +22 |
   | +1% por elite | +17,5 |
   | +1% por elite, máx. 3 elites | +9,5 |
   | **+0,5% por elite** | +8,5 (triagem), **+6,0** (validação) |
   | +0,3% por elite | +4,0 (triagem) |

   A soma dos bônus é aditiva, sem crescimento composto.
2. **Impacto e decks:**
   - Dawncrest +8, comuns +7, Blackfang +1.
   - **Bem mais forte do que parece:** como a dificuldade é muito sensível à força do time, +3% por elite (cerca de +20% numa run com 6 a 7 elites) praticamente garante a vitória.
3. **Interações e abuso:**
   - Com **Caçador de Elites** (+12 de ouro por elite), as rotas cheias de elites passam a valer muito mais: ouro e força ao mesmo tempo.
   - O jogador simulado escolhe a rota pelo caminho guloso, então já passa por elites. Um humano que procure elites de propósito acumula mais.
   - O limite natural é a quantidade de elites no mapa.
4. **Recomendação:** **cada elite vencida dá +0,5% de vida e ataque a todas as unidades até o fim da run.** Fica na faixa ideal (+6,0).
   - Alternativa, se Carlos preferir um número "redondo" no texto: +1% por elite, com máximo de 3 acúmulos (+9,5 na triagem, no limite da exceção).
5. **Limitações:**
   - Medir em teste manual uma rota que busca elites de propósito.
   - O texto "+0,5%" pode parecer pequeno para o jogador, embora o efeito seja relevante. É uma questão de apresentação na interface.

---

## Situação geral após esta rodada

- **Desafios:** 15 de 15 aprovados (Energia Dissipada entra no lugar da Árvore Contida).
- **Vantagens:** 14 de 15 aprovadas. **Fusão Eficiente pendente** (ver item 3).
- Etapas 2 e 3 (escada e combinações): aguardam a decisão sobre a Fusão Eficiente.
- Relatórios:
  - `balance/out/postgame/Resumo_desafios_vantagens_FINAL.pdf`;
  - `balance/out/postgame/Posjogo_etapa1_FINAL.pdf` (fichas e matrizes do catálogo final).
