# Grand Journey — continuidade v39

Data: 28/10/2026. Base de código: v38, commit 551824427b001a32e8fdb602660576f8d752ca35. Complementa a documentação v36 e os registros `release-v37.md` e `release-v38.md`. Em divergências, o código atual e as decisões posteriores do usuário prevalecem.

## Identidade e autorização

- Site único: https://grand-journey.soundbat256.chatgpt.site
- Project ID: `appgprj_6ad92678b86081918ef5cc54c09cc04f`.
- Preservar fonte Git, saves e audiência customizada existente. Nunca criar outro Site para continuar o projeto.
- Implementar/publicar somente atualizações explicitamente autorizadas. Relatos, ideias e preferências ficam pendentes.
- Esta atualização autoriza somente a primeira raid, no Treinamento. A inclusão na rota da run fica para uma atualização futura.

## Estado herdado e preservado

- 77 personagens jogáveis, com Blackfang e Dawncrest ocultos até derrotar seus bosses; desbloquear não concede cópia grátis do boss.
- Treino configurável, rerolls pagos, Card Cycle detalhado, fusão e Bag por arraste, velocidades persistentes ×1/×1,5/×2, Hacks de rodada/confronto.
- v38: retorno à mão com restituição da energia paga, somente no setup de entrada e após a última reciclagem; reciclar ou iniciar combate invalida retornos anteriores. Inclui desfazer fusão elegível e instrução no tutorial.
- v38: desvio de movimentação para sair de bloqueios côncavos de aliados; filtros de ordem e raça no mesmo nível; nomes corrigidos conforme `release-v38.md`. Não reintroduzir a animação rejeitada do Warrior.
- Interface VT323 Regular 400, botões e canvas incluídos; GRAND JOURNEY Georgia Bold, subtítulo Nunito. Três colunas nos menus de cartas, inclusive mobile. Rodapés opacos até a safe area; última linha acessível. Seletores próprios do jogo.
- Schema da run 20 e perfil 1 preservados.

## Raid — Árvore ancestral corrompida

Acesso: Treinamento → configurar **Sua equipe** → **Raid — Árvore ancestral** → Iniciar nova raid. Usa o deck escolhido, seus níveis de melhoria e relíquias configuradas. Configurações do inimigo e quantidade de vitórias do treino normal não se aplicam. Não concede recursos, recompensas, desbloqueios nem progresso permanente; preserva a run em andamento.

- Vitória imediata ao zerar a vida do chefe, mesmo com Brotos vivos. Se chefe e último aliado morrerem no mesmo passo, vitória do jogador.
- Cada rodada dura até 60 segundos simulados ou até a eliminação dos aliados/chefe. As velocidades existentes controlam o tempo simulado. Não há o multiplicador global de dano aos 40 s dos combates normais.
- Chefe vivo ao fim da rodada ganha um ponto; cinco pontos encerram o confronto com derrota.
- Vida restante e curas efetivamente recebidas persistem. Não há cura automática na mudança de fase.
- Aliados revivem com vida cheia; campo, banco, cartas vinculadas, fusões e desenvolvimento do deck permanecem. Mantém energia acumulada, renda, compra, reciclagem e freeze. Capacidade: 2/3/4/5/6.
- Status, escudos e cargas reiniciam como nos combates existentes. Brotos sobreviventes não acumulam entre rodadas.
- Árvore fixa em (215,95), fundo central; ataques básicos à distância. Imune a deslocamento; outros efeitos de controle seguem o motor. IA própria, sem deck, compras ou energia.

| Rodada | Fase | Formação e novidade |
|---|---|---|
| 1 | Despertar | Somente Árvore, ataque básico |
| 2 | Brotação | Árvore + dois Brotos na frente |
| 3 | Raízes profundas | Mesma formação + raízes |
| 4 | Seiva corrompida | Raízes + cura canalizada pelos Brotos |
| 5 | Última floração | Todas as anteriores + uma reposição aos 28 s, somente para completar dois Brotos vivos |

Raízes: marca uma posição fixa sob um aliado vivo escolhido aleatoriamente. O alvo pode sair da marca; a marca não o acompanha. Após aviso, dano em área e imobilização. A raiz impede movimento voluntário, inclusive deslocamento de skills, mas permite ataques e efeitos das habilidades. Sem controle manual durante a luta.

Seiva: ligações visuais aos Brotos que estavam vivos ao iniciar a canalização; somente os que continuam vivos ao concluir contribuem. Mortes são resolvidas antes da cura. Não ressuscita o chefe. Sem Brotos não inicia cura; limita a cura efetiva total por rodada. Durante a canalização a Árvore suspende ataques básicos. Morte do chefe e fim da rodada têm precedência sobre a conclusão da cura.

## Valores iniciais ajustáveis

Fonte: `dist/raid-engine.js`, objeto `JourneyRaid.CONFIG`. Cada raid copia os valores ao iniciar; alterar o balanceamento não altera silenciosamente uma raid já salva.

| Parâmetro | Valor inicial |
|---|---:|
| Vida / ataque / defesa da Árvore | 12.500 / 24 / 20 |
| Intervalo de ataque / alcance da Árvore | 1,7 s / 650 |
| Vida / ataque / defesa do Broto | 310 / 18 / 12 |
| Intervalo / movimento / alcance do Broto | 1,35 s / 38 / 34 |
| Crítico de ambos | 0% |
| Primeiro aviso de raiz / intervalo | 8 s / 10 s |
| Aviso / raio / dano bruto / imobilização | 1,5 s / 46 / 38 / 1,5 s |
| Primeira canalização / intervalo / duração | 13 s / 18 s / 3 s |
| Cura por Broto / limite efetivo por rodada | 120 / 480 PV |
| Reposição única na fase 5 / máximo vivo | 28 s / 2 Brotos |
| Tempo por rodada / derrotas permitidas | 60 s simulados / encerra na quinta |

Dano passa pela defesa/reduções normais; valores de dano acima são brutos. Objetivo: vitória na quarta/quinta rodada com deck adequado; composições fortes podem vencer antes. Este é balanceamento inicial, não definitivo.

Amostra reproduzível: `node tests/raid-balance-v39.cjs`, 96 simulações (6 decks × níveis 0/1 × 8 seeds), política simples de jogar cartas acessíveis, preencher banco, promover unidades e permitir fusões. Não representa decisões humanas ótimas ou piores casos.

| Deck sem upgrades | Vitórias / 8 | Rodadas das vitórias |
|---|---|---|
| Vanguard | 8 | 3–5 |
| Balanced | 8 | 3–4, principalmente 4 |
| Swift | 8 | 4 |
| Arcane | 7 | 4–5 |
| Fireline | 8 | 3–4 |
| Fortress | 7 | 3–5 |

Ajustar após jogar com composições reais. Não compensar a dificuldade da raid alterando silenciosamente cartas ou nodes da run.

## Interface, artes e persistência

- Preparação revela posições do chefe e minions; exceção restrita à raid.
- HUD apresenta nome, vida atual/máxima persistente, pontos do monstro 0/5–5/5 e fase com novidades.
- Relatório separa dano efetivo no chefe, dano nos Brotos, cura efetiva e vida restante; detalha dano por aliado e mantém os painéis anteriores de dano causado/recebido.
- Textos novos em EN/PT-BR. Pixel arts fornecidas para o campo; ilustrações anime somente como retratos no relatório. Nenhuma arte anime usada como sprite de combate.
- Save separado no mesmo navegador: `grand-journey-raid-v39`, envelope versão 1. Retomada em Treinamento → Retomar raid salva. Combate retomado começa pausado.
- Salva estado do deck e combate juntos, incluindo HP, temporizadores, marcas, canalização, reposição, referências entre unidades e estado do gerador aleatório. Checkpoint aproximadamente a cada 0,5 s durante combate, em ações relevantes e ao ocultar/sair da página.
- Fechamento abrupto pode perder o trecho posterior ao último checkpoint; retomada prossegue daquele checkpoint sem somar novamente dano/cura/pontos. `battleSerial` torna o registro de estatísticas idempotente.
- Um slot de raid; iniciar outra substitui a anterior. O backup/exportação normal continua cobrindo run/perfil; o checkpoint da raid é local e separado.

## Arquivos e validação

- `dist/raid-engine.js`: configuração, inimigos exclusivos, fases, vitória/derrota, cura, raízes, reposição e serialização.
- `dist/raid-ui.js`: entrada no treino, HUD, formação revelada, visuais, relatórios e retomada.
- `dist/raid-assets.js` e `dist/assets/raid-*.png`: artes fornecidas.
- `dist/game-0.js`: hooks condicionais à raid; dano normal, IA normal e resultados normais preservados.
- `dist/game-7.js`: montagem de combate retomado pausado e pixel art da raid.
- `tests/raid-v39.cjs`: fases, persistência, morte simultânea real, timeout nas três velocidades, ausência de frenzy, raízes, cura por sobreviventes/limite, reposição, retomada determinística, idempotência, freeze, fusões/banco.
- `tests/legacy-replay-v39.cjs`: 60 replays de normais/elites/bosses comparados exatamente com a v38 (vida, dano, posição, carga, tempo e resultado).
- Suítes atuais v38, movimento v30, treino v31, roster v37, sistemas v18, freeze v20, tutorial v24/v25 e outras passaram.
- Sete testes históricos já falham também na v38: setup-v19, setup-v20-1 (mock classList incompleto), tutorial-guard-v23/tutorial-ui-v24 (mock MutationObserver ausente), pending-v22 (mock rerollButton ausente), combat-replay-v21/legacy-replay-v37 (expectativas de movimentação anteriores à v38). Não reescrever mecânicas atuais para atender snapshots antigos.
- QA visual em navegador com viewport móvel e saves isolados em memória; sem validação em Android físico.

## Roster de monstros fechado

Nove duplas exclusivas dos encontros inimigos, nunca cartas do jogador/coleção/boosters/decks:

1. Dragão ancestral / Wyvern.
2. Kraken / Cria tentacular.
3. Rainha naga / Homem-serpente.
4. Hidra do pântano / Basilisco do pântano — substituem aranhas.
5. Colosso de pedra / Golem de pedra.
6. Árvore ancestral corrompida / Broto carnívoro — única dupla implementada nesta atualização.
7. Rei slime / Slime.
8. Lorde lich / Esqueleto guerreiro.
9. Mantícora / Filhote de mantícora — filhote substitui Escorpião gigante.

## Pendências não autorizadas nesta atualização

- Integrar raid à run; implementar demais monstros.
- Primeiro balanceamento conjunto de cartas e dificuldade dos nodes: avaliar salto de U1 da 7ª batalha versus ouro, shops e upgrades possíveis do jogador.
- Revisão de traits ainda em discussão. Classes podem focar stats; alcance e área podem beneficiar somente ataques comuns de unidades compatíveis. Arcano rejeitado como proposta de classe; atenção à carga mais rápida de skill com velocidade de ataque/Duelista. Especializações, raças/facções focadas em mecânicas ficam em hold. Não atribuir traits novas agora. Avaliar thresholds 2/4 ou 3/4 para seis unidades.
- Três atos, cada um com boss; terceiro final boss.
- Energia para run e Hack correspondente; login diário; Essência para excedentes/cosméticos, menor prioridade.


## Decisões posteriores à publicação v39 — pendentes de implementação

Regra de identidade para TODO o jogo: a tela inteira é fixa e nunca deve rolar. Somente menus/painéis delimitados dentro da tela podem ter rolagem. Botões de continuar, combater, confirmar e voltar devem permanecer visíveis e acessíveis sem rolar, em uma faixa de layout fora do conteúdo rolável. Validar toda tela nova ou alterada com conteúdo máximo e viewport mobile; não reintroduzir rolagem global para resolver excesso de informação.

Pendências relatadas no teste da raid:
- Remover encerramento por tempo: rodada termina com morte de todos os aliados ou derrota do chefe.
- Reduzir HUD: preservar vida, energia, capacidade usada/máxima e sinergias; remover explicações de fases/mecânicas e placares redundantes.
- Corrigir área ocupada/distância de contato da Árvore para impedir personagens sobrepostos ao tronco.
- Corrigir botão de continuar que ficou abaixo da área visível na rodada 3. A arena inteira não pode rolar para alcançá-lo.

Apenas esta regra/documentação foi registrada; as correções de gameplay/interface e sua publicação aguardam autorização de atualização.
