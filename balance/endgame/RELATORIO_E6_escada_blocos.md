# Parte 3: escada de níveis 1 a 18 com os desafios em blocos

22/11/2026. Cópia de teste `game_v65_teste` com os valores de 22/11 (escala +2% por desafio, Reforços na 3ª rodada, Fadiga −3%, Menos Apoio em 2 camadas, Inimigos Fortalecidos +10% de vida e +8% de dano, Bolsa −30%, Bagagem com 4 casas).
Foram 720 lotes, 10.800 runs: 10 decks × 15 seeds por célula. Margem de cerca de ±7 pontos nas células perto de 25% e de ±3 nas perto de 5%.

## Como foi medido
- **Nível N:** os blocos anteriores inteiros ficam ligados, mais um sorteio (por seed) dentro do bloco atual. É a escolha livre do jogador, sem saber o peso de cada desafio.
- **Árvore:** cresce com o nível, pela premissa de XP 300 + 115 × (N − 1). São cerca de 20 nós no nível 1, 40 no 6, 57 no 12 e 60 (completa) do 15 em diante.
- **s** = sem vantagens. **c** = com N − 1 vantagens, liberadas na ordem do mais útil para o menos útil (Preparação Flexível, Experiência de Elite, Energia Guardada…).
- **V63** = 6 blocos de 3. **V36** = 3 blocos de 6. A composição dos blocos está no relatório da parte 2.

## Vitória por nível (%)

| Nível | V63 s | V63 c | V36 s | V36 c |
|---|---|---|---|---|
| 1 | 24 | 24 | 23 | 23 |
| 2 | 15 | 27 | 38 | 43 |
| 3 | 17 | 31 | 33 | **55** |
| 4 | 5 | 18 | 14 | 34 |
| 5 | 5 | 22 | 4 | 21 |
| 6 | 3 | 9 | 0 | 19 |
| 7 | 0 | 9 | 1 | 17 |
| 8 | 0 | 12 | 0 | 16 |
| 9 | 0 | 9 | 0 | 13 |
| 10 | 0 | 10 | 0 | 11 |
| 11 | 1 | 5 | 0 | 13 |
| 12 | 0 | 21 | 0 | 16 |
| 13 | 0 | 22 | 0 | 25 |
| 14 | 1 | 16 | 0 | 10 |
| 15 | 0 | 9 | 0 | 7 |
| 16 | 0 | 5 | 0 | 6 |
| 17 | 0 | 3 | 0 | 1 |
| 18 | 0 | **3** | 0 | **3** |

Chegada ao 3º mapa (V63 c): 65, 61, 65, 41, 44, 27, 21, 29, 31, 27, 25, 43, 53, 41, 27, 25, 15 e 9%.

## Conclusões
1. **Está difícil demais, nos dois formatos.** Com vantagens, o simulador fica entre 5 e 22% do nível 4 ao 16 e chega a **3% no nível 18**. Na referência da etapa 1 (15 desafios antigos, todas as vantagens e 60 nós), ficava em 78%. A diferença vem de **+36% de escala** (18 × 2%), de Inimigos Fortalecidos e de Fadiga. Mesmo descontando a calibração (o humano joga cerca de 5 nós melhor que o simulador), o fim fica longe de algo jogável.
2. **O começo deixou de ser fácil.** O nível 1 tem 23 a 24% de vitória com 20 nós, contra 41% sem desafios. O problema relatado ("o começo do endgame fica fácil demais") está resolvido, mas com folga demais.
3. **A curva não é monótona.**
   - **V36 c** sobe do nível 1 para o 3 (23 → 55%). A árvore cresce, e Mais Elites e Loja, que são fáceis, entram cedo no sorteio.
   - **V63 c** tem um vale nos níveis 6 a 11 (5 a 12%) e um pico nos níveis 12 e 13 (21 a 22%), quando a árvore fecha e entram as vantagens fortes.
   - Para o jogador, isso aparece como paredes e depois alívio.
4. **Sem vantagens, o jogo fica impossível a partir do nível 5 ou 6**, nos dois formatos. Isso reforça a ideia de liberar as vantagens junto com os blocos de desafios.
5. **Peso de cada desafio dentro do bloco** (com o desafio contra sem ele, nos níveis em que o bloco está parcial; números indicativos, com amostra pequena):
   - **Mais Elites ajuda: +17 a +25 pontos**, em todos os cenários. Mais elites dão mais XP e mais drops, e isso compensa o risco. **Não funciona como desafio.**
   - Pesam mais: Inimigos Fortalecidos (−9 a −19), Fadiga (−3 a −19), Reforços (0 a −12) e Veteranos (−13 em V63 c).
   - Ajudam ou ficam em zero: Comandantes (+5/+10 em V63), Relíquias Amaldiçoadas (+4/+8, por causa do Ídolo), Maldição (+5/+9) e Loja (+4/+6 com vantagens).
6. **V36 é mais suave que V63** até o nível 13, porque mistura desafios fáceis no 1º bloco. **V63 cumpre melhor "começo forte"**, mas cria o vale dos níveis 6 a 11.

## O que isso sugere (para decisão; nada aplicado)
- **Escala:** +2% acumulado em 18 níveis é demais junto com os desafios fortes. Opções: voltar para +1% (+18% no nível 18), ou +2% com teto (por exemplo, +20%).
- **Mais Elites:** tirar a recompensa extra (as elites convertidas dão XP e drop de batalha comum) ou levar o desafio para a reserva.
- **Ajustar à alta os desafios que ajudam:** Relíquias Amaldiçoadas (o Ídolo transforma a maldição em bônus), Comandantes e Maldição.
- **Alvo:** definir a vitória esperada no nível 18 (com vantagens e árvore completa) e no nível 1. A seguir, calibro a escala para chegar nesse alvo.
