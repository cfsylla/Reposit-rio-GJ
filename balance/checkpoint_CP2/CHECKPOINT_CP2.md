# Checkpoint de balanceamento GJ-v54-BAL-CP2

| Campo | Valor |
|---|---|
| Identificador | **GJ-v54-BAL-CP2**, checkpoint 2 do balanceamento. Não é número de versão do jogo |
| Data | 03/11/2026 |
| Base | Grand Journey **v54** (commit `9b8bff1085f72112d492fd40ffba6c1ab63011b7`) + **GJ-v54-BAL-CP1** |
| Repositório de trabalho | `cfsylla/Reposit-rio-GJ`, branch `claude/continue-previous-work-ccibom`. Cópia balanceada em `game/`, idêntica a `game_p5/` |
| Situação | Tudo aprovado por Carlos. Pendências em `PENDENCIAS_CP2.md` |

## 1. O que entra (resumo)

| Bloco | Conteúdo |
|---|---|
| **Curva base** | Força inimiga dos mapas 2 e 3: ×1,16 e ×1,235 (no CP1, ×1,10 e ×1,16). XP em dobro nos mapas 1 e 2 |
| **Árvore: modelo de nível** | O nível é o XP guardado ÷ 10, até o **nível 50**. Cada nível dá 10 pontos. O XP é guardado na sessão da árvore depois de cada boss. Reset grátis fora da run. XP acima do nível 50 vira diamantes (1 a cada 20 XP) |
| **Árvore: custos** | Nós de profundidade 4 em diante (inclui todos os marcos) custam ×1,5. O jogador no nível 25 não tem nenhum desses nós, então a 1ª vitória não muda |
| **Árvore: nós** | 13 especiais e marcos com efeitos novos e mais criativos, mais Movimento (+4% de movimento e +1% de velocidade de ataque). Instinto de Sobrevivência mantido |
| **Correção** | O filtro de relíquias inimigas usava nomes de traits anteriores à v54. Agora scope, tome, boots e shield chegam aos inimigos compatíveis |
| **Decks** | 9 decks revisados. Corte Sombria mantida forte, como recompensa |
| **Desafios da Jornada** | Regras da revisão 2 do documento de ideias: nível = quantidade de desafios ativos, acesso sequencial, 1 insígnia por nível inédito e conclusão por desafio. 15 desafios calibrados. Requisitos do Desafio Final |
| **Vantagens** | 15 vantagens compradas com insígnias, sempre ativas. 3 delas aprovadas por decisão |
| **Barras da ficha** | `ratings` recalculadas para 11 dos 33 personagens ajustados no CP1. O campo não é lido pelo jogo |

Detalhes linha a linha (73 alterações) em `TABELA_ALTERACOES_CP2.md` e `.csv`.

## 2. Metas e resultados medidos

**Jogo base (sem desafios):**

| Medição | Meta | Resultado |
|---|---|---|
| 1ª vitória (carreiras simuladas) | runs 15 a 20 | **run 17** |
| Nível da árvore na 1ª vitória | cerca de metade da árvore | **nível 25** (mediana; metade dos jogadores entre o 19 e o 29) |
| Nível 50 (limite) | runs 17 a 23 | **run 23** |
| Vitória, árvore nível 25 | 50% a 60% | 52% a 58% (por medição) |
| Vitória, árvore nível 50 | sem meta fixa | 79% |

**Decks (árvore nível 25):**
- média de 52%;
- de 33% (Lei do Gatilho) a 80% (Corte Sombria);
- matriz completa em `validacao/Matriz_deck_x_avanco_CP2.pdf`.

**Desafios e vantagens:**
- medidos sozinhos, com a árvore no nível 25, em 24 decks × 20 seeds;
- **desafios**: −4 a −11 pontos de vitória (meta −5 a −10, exceções −3 a −12);
- **vantagens**: 0 a +7 (meta +3 a +7, exceções +1 a +9). As 3 com efeito perto de zero foram aprovadas por decisão.

**Escada (carreiras depois da 1ª vitória, 48 por caminho):**
- todos os 15 níveis são vencidos, de 1 a 3 runs por nível;
- caminho fácil: entre 53% e 75% por nível;
- caminho difícil: entre 30% e 67%.

**Limite (todos os desafios + todas as vantagens):**

| Árvore | Jogo base | Tudo ativo |
|---|---|---|
| nível 25 | 64% | 44% |
| nível 50 | 79% | 63% |

Leitura de Carlos: a run "mais difícil" mantém uma dificuldade parecida com a da 1ª vitória.

**Combinações perigosas:** nenhuma torna a run inviável. A pior ficou em 63%.

## 3. Regras vigentes (efeitos finais)

### Desafios da Jornada (15)
| # | Desafio | Efeito | Impacto |
|---|---|---|---|
| 1 | Veteranos | Inimigos comuns: +3 upgrades | −6 |
| 2 | Tropas Resistentes | Vida dos inimigos +3% | −7 |
| 3 | Ataques Implacáveis | Dano dos inimigos +4% | −7 |
| 4 | Comandantes Preparados | Elites, ordens e bosses: +1 relíquia e +1 upgrade | −9 |
| 5 | Bosses Implacáveis | Bosses de mapa (time e líder) +8% de vida e dano | −9 |
| 6 | Reforços Inimigos | A partir da 2ª rodada, comuns e elites colocam +1 unidade | −11 |
| 7 | Fúria das Raids | Raids +30% de vida e +10% de dano | −4 |
| 8 | Mercado Inflacionado | Loja +15% | −8 |
| 9 | Bolsa Leve | Ouro por vitória −20% | −10 |
| 10 | Recursos Escassos | −1 de energia nas 2 primeiras rodadas contra bosses | −9 |
| 11 | Bagagem Limitada | 3 casas da bolsa bloqueadas | −6 |
| 12 | Deck Pesado | +1 cópia de uma carta aleatória do próprio deck | −5 |
| 13 | Energia Dissipada | Perde 1 da energia que sobrar ao fim de cada rodada | −5 |
| 14 | Relíquias Escassas | Escolhas de relíquia com 1 opção | −9 |
| 15 | Caminho Amaldiçoado | Começa com a maldição Exaustão | −8 |

### Vantagens (15)
| # | Vantagem | Efeito | Impacto |
|---|---|---|---|
| 1 | Relíquia de Viagem | +1 relíquia comum aleatória no início | +7 |
| 2 | Treino Prévio | 1 carta com upgrade 2 e 1 com upgrade 1 no início | +7 |
| 3 | Preparação Flexível | 1 renovação grátis da mão por rodada | +3 |
| 4 | Fusão Eficiente | Toda fusão concluída devolve 1 de energia | 0 (por decisão) |
| 5 | Bolsa Cheia | +20 de ouro inicial | +4 |
| 6 | Experiência de Elite | +0,5% de vida e ataque por elite vencida, até o fim da run | +6 |
| 7 | Olho Treinado | 1 renovação grátis em toda escolha de relíquia | +1 (por decisão) |
| 8 | Ensaio | A 1ª carta comprada em cada loja vem com upgrade 2 | +1 |
| 9 | Mão Planejada | Carta escolhida começa na mão em confrontos alternados | +4 |
| 10 | Energia Guardada | +1 de energia na 1ª rodada | +4 |
| 11 | Limpeza | 1 remoção grátis na 1ª loja de cada mapa | 0 (por decisão) |
| 12 | Bênção do Caminho | Ao entrar nos mapas 2 e 3: 1 carta com upgrade 2 e 1 com upgrade 1 | +6 |
| 13 | Juros | Boss de cada mapa: 50% do ouro guardado (máx. 75) | +3 |
| 14 | Caçador de Elites | +12 de ouro por elite | +7 |
| 15 | Segunda Chance | 1 vez por run, perder um confronto (exceto boss) repete só a última rodada | +5 |

## 4. Validação

- `node scripts/validate-balance-base.cjs`: **PASS nas 10 etapas** (`validacao/validate-balance-base_CP2.log`).
- Suíte completa (`tests/*.cjs`, cada teste com limite de 600 s): `validacao/suite_completa_CP2.log`. Classificação em `validacao/README_VALIDACAO_CP2.md`.
- Os dois patches foram conferidos: aplicados numa v54 limpa e no CP1 limpo, geram arquivos idênticos aos da cópia balanceada.

**Simulações** (jogador simulado no nível da IA do jogo; um humano tende a ir melhor):
- matriz deck × avanço (2.160 runs);
- peças sozinhas (cerca de 15.000 runs);
- triagens e validações das peças revisadas;
- carreiras, escada e limite.

Resultados em `validacao/`. **Não são prova de balanceamento final:** não houve QA visual nem playtest humano.

## 5. Revisado × não revisado

| Situação | Sistemas |
|---|---|
| **Revisado no CP1** | Personagens, traits, suportes, decks, curva, bosses de equipe, multiplicadores de raid, ouro, preço de upgrade, relíquias inimigas |
| **Revisado no CP2** | Curva (de novo), árvore e XP (completo), filtro de relíquias inimigas, 9 decks, Desafios da Jornada, Vantagens, barras da ficha |
| **Ainda não revisado** | Especiais de Expedição da árvore (econômicos); economia de eventos, maldições e missões; relíquias do jogador (preço e formato); mecânicas internas de raids e true bosses; economia permanente (diamantes, boosters, coleção, recrutamento) |
| **Precisa de playtest humano** | Vantagens que dependem de escolha (Mão Planejada, Preparação Flexível, Olho Treinado, Limpeza, Fusão Eficiente); sensação dos nós novos da árvore; legibilidade das telas novas |
