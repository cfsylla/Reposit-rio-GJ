# Grand Journey — continuidade v42

29/10/2026. Base: conteúdo v41 publicado, commit `765064c7501ed6fb4d075aa82b60ee9cfa52e10e`. Mesmo projeto `appgprj_6ad92678b86081918ef5cc54c09cc04f`, Site https://grand-journey.cfsylla.chatgpt.site, fonte e audiência preservadas. v42 complementa v39–v41; pendências anteriores não tratadas permanecem pendentes.

## Escopo autorizado e acesso

- Implementadas três duplas: Colosso de pedra/Golem de pedra, Rei slime/Slime e Dragão ancestral/Wyvern. A Árvore/Brotos de v41 permanece. Manticora adiada: pixel art ainda indisponível.
- Quatro raids selecionáveis no Treinamento, com equipe/melhorias/relíquias escolhidas, sem recompensas. Configuração do adversário não determina a raid.
- Em **novas runs**, camadas 5 e 10 têm uma opção de raid completa no ramo esquerdo, mantendo Blackfang e Dawncrest nos outros dois ramos. Cada raid usa até cinco rodadas; não é confronto apenas contra minions. Duas vitórias nas raids transformam o boss da camada 15 em outro encontro completo de monstro.
- As duas espécies intermediárias são distintas e sorteadas deterministicamente pela seed entre as quatro disponíveis. Boss também é sorteado entre as quatro e pode repetir espécie. Nenhuma espécie tem posição fixa de dificuldade.
- Rota mista (uma raid e um confronto Blackfang/Dawncrest) não ativa boss monstro. As rotas de duas vitórias de Blackfang/Dawncrest continuam funcionando.
- Mapas de runs já salvas não são reconstruídos: para a nova rota é necessário iniciar uma run nova. Saves, coleção e desbloqueios existentes continuam preservados.
- Monstros são exclusivos do inimigo: entram somente em `Game.BY`, não em `Game.UNITS`, boosters, coleção, custom decks ou recompensas de cartas. Roster jogável continua com 77 personagens. Vencer monstro não desbloqueia Blackfang/Dawncrest nem dá carta de boss.

## Regras comuns

Vida restante persiste entre rodadas. Aliados revivem com vida cheia; campo, banco, vínculos, fusões, energia, renda, compras, freeze e capacidade 2/3/4/5/6 seguem as regras existentes. Cinco rodadas perdidas encerram a raid (e a run quando nela). Sem limite de tempo e sem multiplicador global de dano aos 40 segundos. O cronômetro é apenas informativo. Vitória tem prioridade sobre morte simultânea do último aliado.

Chefes fixos no fundo central, alcance básico 650; contato/collision no chão com raio 30. Ataques básicos mantêm aviso de 0,45 s, projétil de 0,22 s e impacto/dano na chegada, agora com cores de cada monstro. Velocidades persistentes ×1/×1,5/×2/×3 e passo máximo 1/60 s preservados.

Na run há ouro normal de confronto (10 na terceira batalha e 12 na sexta), progresso/milestones usuais e encerramento normal da run no boss ou derrota. Sem recompensa por rodada perdida. Treinamento permanece sem recompensas. Finalização protegida pela fase do estado para não repetir ouro/progresso ao retomar.

## Cinco fases e mecânicas

Todas começam com chefe sozinho; fase 2 passa a ter dois minions. Só as espécies abaixo estão implementadas.

| Monstro | Fase 3 | Fase 4 | Fase 5 |
|---|---|---|---|
| Árvore | Raízes em ponto fixo, aviso e imobilização | Cura canalizada por Brotos vivos, com teto por rodada | Uma reposição aos 28 s, apenas até dois Brotos vivos |
| Colosso | Impacto no chão marcado: área e atordoamento breve | Matar os dois Golems expõe núcleo e acelera/fortalece chefe | Uma reposição aos 28 s até dois Golems; rachaduras não se fecham |
| Rei slime | Até quatro ondas limitadas de divisão; Slimes tentam retornar ao corpo | Slimes mortos deixam poças que causam dano e lentidão | Uma tentativa extra de reposição aos 28 s, dentro do limite de quatro ondas e dois vivos |
| Dragão | Sopro em cone com direção fixa após aviso | Sopro deixa área de fogo no ponto marcado | Sopro mais frequente e uma reposição de Wyverns aos 28 s até dois vivos |

Colosso: desde fase 2, recebe 45% do dano antes de quebra, 80% após um Golem cair e 140% após os dois. Quebras permanecem naquela rodada mesmo com reposição. Fase 4+, núcleo exposto aumenta ataque em 30% e reduz intervalo básico para 70%.

Rei slime: barra representa **vida total do corpo e da massa destacada**. Criar Slime retira a mesma vida do corpo; retornar transfere apenas a vida que sobreviveu. Não é cura e não aumenta a barra. Cada divisão transfere até o HP do minion ou 20% da vida disponível do corpo, preservando pelo menos 1 no corpo. Se o corpo cai com massa viva, 1 ponto é transferido dela para reconstruí-lo; vitória exige zerar toda a massa. Sem minions sobreviventes acumulados entre rodadas. Dano simultâneo é aplicado antes da reabsorção; Slime morto na chegada não devolve vida.

Wyverns: procuram a unidade mais ao fundo (maior y), respeitando provocação. O cone não acompanha o alvo após o aviso. Não há controles manuais durante combate.

## Valores iniciais ajustáveis

Referência de treino em `dist/raid-engine.js` (Árvore/comuns) e `dist/monster-engine.js` (`SPECS`, `scaling`). Configuração copiada para cada raid ao iniciar e preservada no checkpoint.

| Espécie | Vida chefe | Ataque | Defesa | Intervalo básico | Vida minion | Ataque minion | Defesa minion | Movimento minion |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Árvore | 17.000 | 52 | 20 | 1,50 s | 400 | 34 | 12 | 38 |
| Colosso | 15.500 | 50 | 24 | 1,65 s | 400 | 30 | 30 | 32 |
| Rei slime | 18.000 | 54 | 14 | 1,45 s | 480 | 30 | 8 | 40 |
| Dragão | 15.500 | 48 | 22 | 1,60 s | 350 | 26 | 12 | 68 |

Minions: intervalo 1,35 s, alcance 34, sem crítico. Chefes: movimento zero, sem crítico.

- Árvore: raízes primeiro aos 6 s, a cada 9 s, aviso 1,5 s, raio 46, dano 70, imobilização 1,5 s. Cura primeiro aos 12 s, a cada 16 s, canal 3 s, 160 por Broto vivo ao concluir, teto 800 por rodada. Igual v41.
- Colosso: primeiro impacto aos 7 s, depois a cada 10 s; aviso 1,2 s, raio 65, dano 85, stun 0,6 s.
- Slime: divisão periódica a cada 17 s; retorno começa após 10 s a velocidade 48. Até quatro ondas (inclui inicial e reposição), máximo dois vivos. Poças duram 5 s, raio 52, dano 14 por tick de 0,75 s, lentidão 1 s renovada nos ticks.
- Dragão: primeiro sopro aos 7 s, depois a cada 12 s (9 s na fase 5); aviso 1,35 s, dano 95, meio ângulo 0,42 rad, comprimento 600. Fogo dura 6 s, raio 55, dano 16 por tick de 0,75 s.

| Posição na run | Vida chefe | Ataque/dano de mecânicas/cura | Vida e ataque dos minions |
|---|---:|---:|---:|
| Primeira raid, batalha 3 | 48% | 72% | 72% |
| Segunda raid, batalha 6 | 82% | 93% | 93% |
| Boss, batalha 9 | 135% | 115% | 115% |

Defesa, alcance, intervalos e movimento não escalam por etapa. Os percentuais dependem apenas da posição, nunca da força atual do jogador. Ajustes de espécie e posição são separados. Estes são valores iniciais de playtest, não balanceamento definitivo da economia da run.

## Interface, artes e persistência

- Mantida interface enxuta: nome/vida numérica/barra, placar padrão e cronômetro. Sem descrição de fases ou painel redundante de dano/cura da raid. Relatórios padrão de unidades preservados.
- Seletor de raid em janela própria, com quatro artes e nomes EN/PT-BR. Ícones de monstros no mapa, legenda e progresso Monstros 1/2; modal do nó deixa claro o encontro e a condição de derrota.
- Rodapés opacos fora da área rolável, botões de Combater/Continuar sempre visíveis. Regra de página fixa, VT323 400, título Georgia e subtítulo Nunito preservados.
- Seis pixel arts recebidas nesta atualização usadas nos novos chefes/minions, com transparência original e ancoragem inferior. Arquivos `dist/assets/raid_*` e dimensões/escala em `monster-assets.js`. Não foi criada arte substituta.
- Artes adicionais de Esqueleto/Lich/Kraken/Cria tentacular recebidas mas não integradas. Não estão no escopo desta versão. Demais raids aguardam autorização/mecânicas/artes.
- Treinamento continua usando a chave existente `grand-journey-raid-v39`, compatível com saves de Árvore sem campo `kind` (fallback tree).
- Raid da run salva snapshot de combate **junto com estado e perfil** no envelope principal `raidBattle`, em armazenamento local/backup e IndexedDB existentes. Checkpoint de pintura a cada 500 ms e ao ocultar/sair. Exportação/importação incluem snapshot. Menu principal retém combate pendente; Continuar retoma pausado.
- Snapshot mantém PRNG, projéteis, marcas, canal, poças, rachaduras, ondas, massa e referências de unidades; finalização e registro idempotentes evitam repetir dano/cura/recompensas. Rodadas concluídas salvam estado sem combate ativo.

## Validação

- `tests/monsters-v42.cjs`: quatro espécies fora do roster; 40 seeds de mapa, sorteio/ativação das duas raids e boss; 20 formações/fases; armadura/núcleo/reposição; conservação de massa, retorno único e morte na chegada; cone fixo; checkpoints deterministas de todas as espécies; ausência de timeout após 61 s; persistência/reviver/derrota na quinta rodada; entrada real na run, percentuais, ouro e finalização sem duplicação.
- Suites anteriores `raid-v39`, `raid-v40`, `raid-v41`, `training-v31`, `update-v38` aprovadas. `legacy-replay-v39`: 60 replays normais/elite/boss de decks idênticos à base v38.
- QA no navegador em fixtures isoladas de 360×740 e 320×640, sem tocar perfil real: preparação R3, combate das três espécies, efeitos, seletor/entrada real do Treinamento, mapa/modal, resultado/continuar com rodapé fixo e retomada de run em 00:07 mantendo vida. No tamanho 320×640, altura global/rolável 640/640; Combater e Continuar dentro do viewport.
- Não houve validação física em aparelho Android. Perfis de simulação abaixo não reproduzem toda a tomada de decisão ou economia de uma run real.

## Simulações de dificuldade

1.120 raids automatizadas: 640 de treino (10 decks × 4 espécies × U0/U1 × 8 seeds) e 480 fixtures de etapas de run (10 decks × 4 espécies × 3 etapas × 4 seeds). Política de compras/posicionamento automática, não ótima. Limite diagnóstico de 600 s por rodada apenas no script: **zero travamentos observados**. O jogo não impõe esse limite.

Treino: U0 todas as cartas sem upgrade; U1 todas as cartas com um upgrade. Mantém relíquia inicial e compras/fusões normais durante cinco rodadas. Resultados por deck e média agregada dependem dessas condições, não são taxa de vitória humana.

| Monstro | Vitórias U0 | Rodada média nas vitórias U0 | Vitórias U1 | Rodada média nas vitórias U1 |
|---|---:|---:|---:|---:|
| Árvore | 22/80 | 4.91 | 71/80 | 4.77 |
| Colosso | 24/80 | 4.83 | 70/80 | 4.61 |
| Rei slime | 25/80 | 4.96 | 69/80 | 4.86 |
| Dragão | 17/80 | 4.76 | 60/80 | 4.65 |

Detalhe por deck (vitórias em 8 seeds, U0 / U1):

| Deck | Árvore | Colosso | Rei slime | Dragão |
|---|---:|---:|---:|---:|
| vanguard | 4 / 7 | 5 / 7 | 5 / 7 | 3 / 7 |
| balanced | 0 / 7 | 1 / 7 | 0 / 7 | 0 / 3 |
| swift | 0 / 6 | 0 / 8 | 0 / 7 | 1 / 7 |
| arcane | 1 / 5 | 1 / 3 | 2 / 3 | 1 / 3 |
| outlaws | 1 / 8 | 2 / 8 | 2 / 7 | 1 / 6 |
| fortress | 5 / 8 | 3 / 7 | 5 / 8 | 3 / 7 |
| blades | 3 / 8 | 3 / 8 | 2 / 8 | 3 / 8 |
| fireline | 6 / 8 | 7 / 8 | 7 / 8 | 3 / 8 |
| astral | 1 / 6 | 0 / 6 | 1 / 6 | 0 / 3 |
| corsair | 1 / 8 | 2 / 8 | 1 / 8 | 2 / 8 |

Fixtures de run: etapa 3 com duas cartas U1 e relíquia inicial; etapa 6 com seis cartas U1 e coração; etapa 9 com dez U1, duas delas U2, e coração/recuperação/precisão. São equipes de referência montadas para comparação, não uma simulação completa de lojas/ouro/rotas. Todas começam o confronto com desenvolvimento e capacidade normais das rodadas 1–5.

| Monstro | Etapa 3 | Etapa 6 | Boss etapa 9 |
|---|---:|---:|---:|
| Árvore | 40/40 | 34/40 | 6/40 |
| Colosso | 40/40 | 33/40 | 8/40 |
| Rei slime | 40/40 | 34/40 | 6/40 |
| Dragão | 40/40 | 29/40 | 5/40 |

A primeira etapa foi vencida por todas essas equipes de referência (médias de 3,1–3,6 rodadas); a segunda ficou entre 72,5% e 85%; o boss entre 12,5% e 20%. Boss é intencionalmente mais exigente, mas esses resultados deixam **atenção para playtest da economia e upgrades reais** antes de concluir que sua dificuldade está correta. O mesmo cuidado vale para a diferença de desempenho de decks. Não há alegação de balanceamento final.

Dados completos reproduzíveis: `docs/raid-balance-v42-training.jsonl`, `raid-balance-v42-stage3.jsonl`, `raid-balance-v42-stage6.jsonl`, `raid-balance-v42-stage9.jsonl`. Script `tests/raid-balance-v42.cjs`, opções `SEEDS` e `SCENARIO` (training/3/6/9).

## Continuidade

Próximo balanceamento deve avaliar cartas **e nodes/economia/upgrades**; não basta igualar stats de personagens. Revisão de traits de classe ainda é projeto separado e não foi implementada. Manticora, Kraken, Rainha naga, Hidra e Lorde lich permanecem pendentes. Não ampliar escopo ou publicar novas alterações sem autorização do usuário. Manter rigorosamente AGENTS.md e identidade de tela fixa.
