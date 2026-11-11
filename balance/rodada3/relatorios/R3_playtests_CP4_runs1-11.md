# Playtests do CP4: análise das runs 1 a 11

Fonte: o save de 11/11, 03:56. Ele é cumulativo e traz as 11 runs da conta. Fiz só leitura do save, sem nenhuma simulação.
Só a run 11 tem os campos novos do save (versão 2). Nas runs 1 a 10, a luta da derrota não foi gravada, então o ponto de morte é **o nó seguinte ao último concluído**.

## 1. Onde cada run terminou

| Run | Deck | Nós concluídos | Onde terminou | Elites | Bosses | XP da árvore (ganho/gasto) | Relíquias |
|---|---|---|---|---|---|---|---|
| 1 | Vanguard | 4 | mapa 1, nó 4 | 0 | 0 | 2/0 | 2 |
| 2 | Swift | 7 | mapa 1, nó 7 | 2 | 0 | 6/0 | 3 |
| 3 | Balanced | 9 | mapa 1, nó 9 | 2 | 0 | 6/0 | 4 |
| 4 | Outlaws | 4 | mapa 1, nó 4 | 0 | 0 | 2/0 | 2 |
| 5 | Blades | 14 | **boss 1** | 3 | 0 | 11/8 | 4 |
| 6 | Executioners | 21 | mapa 2, nó 6 | 3 | 1 | 24/24 | 4 |
| 7 | Blades | 15 | **entrada do mapa 2** | 3 | 1 | 15/8 | 3 |
| 8 | Verdant | 25 | mapa 2, nó 10 | 5 | 1 | 31/24 | 5 |
| 9 | Astral | 18 | mapa 2, nó 3 | 2 | 1 | 18/16 | 3 |
| 10 | Keen | 41 | mapa 3, nó 11 | 10 | 2 | 76/64 | 5 |
| 11 | Fireline | 45 | **vitória (True Boss Dark Elf)** | 12 | 3 | 106/100 | 5 |

- **Runs 1 a 4:** o XP foi perdido porque não chegou a 8, o preço do nó mais barato da árvore. Não houve erro de compra.
- **Comparação com a escada do simulador (nós da árvore no início da run):** você começou a run 10 com 10 nós, a mesma meta do simulador para a run 10. Começou a run 11 com 14, a meta do simulador para a run 12. A progressão da árvore está **exatamente na curva**.

## 2. Comparação com as metas

| Meta (simulador, CP3/R3) | Você no CP4 | Situação |
|---|---|---|
| 1ª vitória: mediana na run 15 (p10 = 8, p90 = 21) | run 11 | ✅ dentro da faixa, um pouco cedo |
| Run 3: termina mais na ordem do mapa 1 | mapa 1, nó 9 (região da ordem) | ✅ |
| Run 5: termina mais no boss 1 (40%) | boss 1 | ✅ |
| Run 8: entrada do mapa 2 (28%), ordem do mapa 1, boss 2 | mapa 2, nó 10 | ✅ |
| Run 10: mapa 2 (23%), boss 3 (18%), vitória (18%) | mapa 3, nó 11 | ✅ um pouco à frente |
| Derrotas no boss 3 antes da 1ª vitória: meta 2 a 3 | 0 (a run 10 morreu antes do boss 3) | ⚠️ como no simulador (1) |

- **Fireline:** é o deck que o simulador marcou como o mais forte (1ª vitória na run 7, por decisão sua). Vencer na run 11 com ela é coerente.
- **Ressalva:** é uma conta só, com 11 runs. É um sinal, não uma confirmação estatística.

## 3. Dificuldade por mapa (lutas vencidas, todas as runs)

| Mapa | Tipo | Lutas | Apertadas (perdeu ao menos 1 round) | Rounds perdidos |
|---|---|---|---|---|
| 1 | comum | 48 | 5 (10%) | 5 |
| 1 | elite/ordem | 24 | 6 (25%) | 13 |
| 1 | boss | 6 | 4 (67%) | 10 |
| 2 | comum/entrada | 16 | **7 (44%)** | 10 |
| 2 | elite/ordem | 12 | 5 (42%) | 9 |
| 2 | boss | 2 | 0 | 0 |
| 3 | comum/entrada | 9 | 0 | 0 |
| 3 | elite/ordem | 6 | 2 (33%) | 2 |
| 3 | True Boss | 1 | 1 | 3 (formas 1 e 2) |

- **Boss 1:** é uma barreira de verdade (67% das lutas foram apertadas), como planejado.
- **Mapa 2:** é o trecho mais duro. As lutas de entrada e de ordem concentram as derrotas de rounds, e 4 das 10 derrotas foram no mapa 2.
- **Boss 2 está mais fácil que a sua entrada:** as 2 lutas terminaram 4×0. Na run 11, o multiplicador do boss Orc é **×0,70 de vida e dano**, contra ×1,25 do boss Troll no mapa 1. A fonte `boss:orc` vale 0,566. ⚠️ Esse fator do boss do mapa 2 precisa ser conferido; pode ser intencional, por o Orc ter atributos base maiores.
- **Mapa 3:** só as runs 10 e 11 chegaram, ambas com time forte. As lutas comuns foram todas 3×0. As ordens (×1,20) foram as únicas que tomaram round (3×1 duas vezes).

## 4. A run da vitória (run 11, Fireline), com os campos novos

**Multiplicador do inimigo (vida e dano) por luta**
- **Mapa 1:** ×0,80 a 0,94 nas lutas comuns e elites; ordens ×1,01; boss ×1,25.
- **Mapa 2:** entrada ×1,04 a 1,06; ordens ×1,09 e ×1,20; boss ×0,70.
- **Mapa 3:** entrada ×1,23 a 1,26; ordens ×1,27 e ×1,39; True Boss ×2,26.
- **Só tomou round em 3 lutas:** as duas ordens do mapa 3 (3×1) e o True Boss. Lá, perdeu 2 rounds para a forma 1, venceu 2, perdeu 1 para a forma 2 e venceu a forma 2.
- **Lutas mais apertadas que venceu:** boss do mapa 2 (round 3 com 5,5% de vida restante), última luta comum do mapa 2 (15%) e a 2ª ordem do mapa 3 (24,7% no round final).

**Habilidades (regra "só com alvo válido")**

| Unidade | Lutas | Disparos | Tempo segurando a carga (total da run) | Dano | Abates |
|---|---|---|---|---|---|
| Ranger | 26 | 106 | 2,0 s | 37 178 | 66 |
| Musketeer | 26 | 76 | 3,0 s | 35 852 | 85 |
| Cannoneer | 24 | 68 | 4,5 s | 34 264 | 68 |
| Bastion | 26 | 131 | 6,3 s | 13 317 (recebeu 31 337) | 25 |
| Crossbowman | 9 | 14 | 0 s | 6 732 | 21 |

- **A regra de ativação funciona:** no máximo 6 s de espera por unidade em 26 lutas, e nenhuma unidade travou.
- **Bastion faz o papel de tanque:** recebeu 58% do dano tomado pelo time.

**Bolsa e relíquias**
- **Bolsa:** 15 de 16 casas ocupadas.
- **Relíquias:** Scope (diagonal 2), Quickstart (linha 3), Spark (L4), Aegis (quadrado) e Precision (dominó).
- **Ofertas de relíquia na run:** Quickstart (em vez de Honor e Patience), Spark (em vez de Captain Standard e Boots) e Precision (em vez de Captain Standard e Last Stand).
- **Na loja:** comprou Aegis por 40.

**Ouro**
- **Ganho por luta:** 18 no mapa 1, 21 no mapa 2 e 23 a 24 no mapa 3.
- **Lojas:** gastou tudo em cada loja dos mapas 1 e 2 (de 109 a 115 de uma vez).
- **⚠️ Mapa 3:** a rota não tinha loja (batalha, evento, upgrade e relíquia). A run terminou com **200 de ouro sem uso**, o teto. Vale decidir se o mapa 3 precisa garantir ao menos uma loja no caminho.

**Árvore:** começou com 14 nós e comprou 5 na run (Armadura 3 e 4, Velocidade de Ataque 3 e 4, Escudos Fortes), 4 deles na janela do boss.

## 5. Problemas encontrados nos campos novos do save (para o ChatGPT)
1. **`fusion` com nível igual antes e depois:** 8 registros como bastion 1→1 e ranger 2→2. Ou é ganho de XP sem subir de nível (falta um campo dizendo isso), ou é erro de registro.
2. **`shopOffer`:** é gravado a cada compra ou rolagem, e não uma vez por visita. Funciona, mas falta marcar quando a lista é nova (rolagem). Sugestão: campo `reroll: true`.
3. **`eventChoice`:** aparece em dobro. Primeiro com `chosen: null`, quando o evento abre, e depois com a escolha. Funciona, mas o primeiro registro é redundante.
4. **`relicOffer` com `source: "discovery"`:** são desbloqueios de catálogo, não ofertas da run. Estão certos, mas é bom documentar.
5. **`enemyScale` do True Boss:** na luta, ele vale ×2,26 (fontes mapa, True Boss e o próprio boss). No round 1, vale ×1,42 (fontes mapa, stage 9 e True Boss), e o líder tem o seu próprio ×2,26. É coerente, mas a regra precisa ser documentada: o valor da luta é o do líder, e o do round vale para os acompanhantes.
6. **`playtestGold`:** campo que não estava no pedido. Sem problema; só documentar.

## 6. Conclusões
1. **Dificuldade geral dentro do esperado:** a 1ª vitória veio na run 11, dentro da faixa 8–21, e a árvore está na curva do simulador.
2. **A curva por mapa funciona como planejado:** boss 1 e entrada do mapa 2 são as barreiras, e o mapa 2 é o mais duro.
3. **Pontos para decisão sua, sem urgência:**
   - **Boss do mapa 2:** ficou ×0,70, mais fraco que a entrada do próprio mapa. Conferir o fator `boss:orc`.
   - **Boss 3:** derrotou 0 vezes antes da 1ª vitória (meta 2–3), igual ao simulador (1).
   - **Mapa 3 sem loja garantida:** ouro acumulado sem uso.
4. **A regra de ativação de habilidade está validada no jogo real:** sem travamentos.
