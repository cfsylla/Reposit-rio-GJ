# Grand Journey — fonte atual de continuidade do projeto

**Estado consolidado em 20/11/2026. v65 publicada no Sites, com CP4, Review R3, Anexos A/C/D e ajustes posteriores.**

Criador e Game Designer: **Carlos Felipe Sylla**. O arquivo mantém o nome histórico para continuidade nas fontes do projeto. Use a fonte publicada e as decisões mais recentes quando houver divergência com documentos de versões anteriores.

## 1. Estado atual, fonte e publicação

| Campo | Estado confirmado |
| --- | --- |
| Projeto | Grand Journey – Game Dev |
| Jogo | Auto-battler roguelite de cartas, single-player, vertical |
| Entrega atual | Web estática: HTML, JS, CSS e mídia separados; não é o projeto Godot/Deckmon |
| Site | https://grand-journey.cfsylla.chatgpt.site |
| Sites project_id | `appgprj_6ad92678b86081918ef5cc54c09cc04f` |
| Conteúdo de desenvolvimento | **CP4, Review R3 e atualizações até a v65** |
| Último commit integrado e publicado | `b0e45f183d384eb946038363c4b4f5e7dc1d250a` |
| Versão publicada no serviço Sites | **65**. A numeração do serviço é a referência de publicação; títulos e tags internos podem conservar identificadores históricos. |
| Publicação | Autorizada por Carlos e concluída em 20/11/2026 |
| CP1 anterior | `1f5d37b98dd32991450600e9e911b0bbcfcfbd3c`, versão 43 do Sites |
| Base original da v54 | `9b8bff1085f72112d492fd40ffba6c1ab63011b7` |
| Acesso | Preservar acesso customizado, proprietário e convidados existentes |
| Próximo trabalho | Roadmap da seção 12 e detalhamento das seções 18–20; pedidos para anotar permanecem pendentes de execução |

### Entregas recentes

- **CP3** estabeleceu a árvore com XP da run e seis janelas regulares, com compras permanentes. **CP4** adicionou a janela de derrota, alvos válidos para skills carregadas, revisão de emissores de aura e o catálogo de 43 relíquias.
- **v55** adicionou sinergias nas ofertas de eventos, bloqueio das relíquias exclusivas de Blackfang e Dawncrest até a liberação de seus decks, e caminhada, ataque básico e habilidade para Shinobi, Kinoichi e Samurai.
- **v56** adicionou indicação visual de XP insuficiente na árvore, ajustou as recompensas de XP dos bosses dos mapas 1 e 2, integrou as três animações de OmnaMusha, limpou fundos residuais de Lancer e Warrior e ampliou o save exportado para análise de playtest.
- As cartas de boss de Grand Union, Blackfang e Dawncrest ficam disponíveis após derrotar o True Boss da ordem. As cartas base de Blackfang e Dawncrest ficam disponíveis após vencer o boss daquela ordem no mapa 3. A coleção, os decks e os 102 milestones seguem as regras da fonte publicada, com 1 diamante por milestone.

### Publicações posteriores à v56

- **v57–v60** — Review R3 e Anexos A/C/D, 102 milestones, distribuição de decks/boosters/relíquias, ordenação e textos EN/PT. Anexo D prevalece sobre A e C em conflitos. Boosters antigos substituídos pelos novos, liberados por milestones. Decks emprestados sem compra direta por 25 diamantes. Raids de Titans sem relíquias. Animações de Ronin, Fighter, Martial Artist, Shaolin, Cowboy e Gunner integradas, com correção da identificação Ronin/Shaolin e da direção vertical da animação compartilhada observada na Lancer.
- **v61** — Vanguarda da Aurora como primeiro deck do tutorial; Encontro de Caminhos e Lei do Gatilho utilizáveis após encerrar essa run por vitória ou derrota. Pop-ups dos mapas 2 e 3; desbloqueios automáticos e milestones da run em vitória/derrota, incluindo raids; personagens desbloqueados na loja com anime de corpo inteiro. Chave do Prisioneiro em nó único alcançável a pelo menos quatro camadas. Traits exclusivos de ordens ocultos até revelação. Arraste na bolsa reduzida corrigido; Espada Adormecida com texto do bônus até +9%; mão vazia preserva layout; texto “3 paid copies = fusion” removido.
- **v62** — `JOURNEY_BOSS_TUNE.map = [1.037, 1.10, 1.35]`, em `dist/boss-engine.js`, linha 21 nessa publicação. Fatores individuais, barreira e `true2` preservados. Primeira forma dos True Bosses usa o fator do mapa 3. Pesos de relíquias por mapa aplicados aos nós e ofertas genéricas de eventos, respeitando garantias explícitas de raridade/forja. Save inclui `recruitOffer.offeredLevels`, mapeando ID para upgrade oferecido; Caravana concede o upgrade mostrado.
- Validação do JSON exportado na v62 — fonte `boss:orc` de vida/dano: mapa 1, 0,608719 preservado; mapa 2, 0,566455 → 0,645700 (+13,99%); mapa 3, 0,703226 → 0,792450 (+12,69%). Primeira forma de Darkelf no mapa 3: 1,527450 → 1,721250. Os testes não substituem novas campanhas de playtest humano.

- **v63 (20/11/2026)** — Filtros de relíquias por efeito em coleção, loja permanente, loja da run, bolsa, treino, escolha de relíquia inicial do deck customizado e ofertas de nós/eventos. Categorias incluem vida, cura, ataque, defesa, escudo, energia, velocidade de ataque, movimento, crítico, habilidades, traits, economia/XP, deck e controle. Uma relíquia pode pertencer a múltiplas categorias. Filtrar não altera ofertas, preços ou peças da bolsa.
- **Ranger v63** — Trap arremessada até alcance médio (145 unidades), com recuo de 55 unidades. Colisão durante a trajetória ativa no primeiro inimigo, incluindo o volume de Titans. Sem colisão, permanece no destino até ativar/expirar. Área circular de ativação aumentada em 10% (raio 20 × √1,10 ≈ 20,976). Dano 160% do poder de ataque escalável e imobilização de 1,5 s preservados; uma ativação, um inimigo. Tempo total de até 5 s. Velocidade do arremesso adotada na implementação: 450 unidades/s.
- **Registro de arte** — Carlos forneceu a logo oficial de Grand Union em 20/11/2026. Original preservado no repositório em `art-source/grand-union/logo-approved.png`. Criação da arte concluída; aplicação do emblema nas telas segue pendente.

### Forma de trabalhar

- Toda implementação, integração e publicação acontece exclusivamente no ChatGPT Work.
- O Claude faz análises, simulações e balanceamento. Algo testado no Claude não está automaticamente integrado ao jogo.
- Implementar e publicar somente dentro do escopo explicitamente autorizado por Carlos. Relatos de bugs, discussões, sugestões e pedidos para “anotar” não autorizam alterações.
- Distinguir sempre: **implementado localmente**, **salvo**, **publicado**, **definido/aprovado para futuro** e **em discussão**. Não confundir aprovação de design com execução autorizada.
- Não pedir novamente uma autorização já concedida para o mesmo escopo. Respeitar restrições como “não publicar” e “não implementar o Desafio Final”.
- Antes de editar, recuperar a fonte atual do Site, ler `AGENTS.md` e verificar commits posteriores. Não confiar na existência de checkouts temporários antigos.
- Integrar pacotes por trecho, combinando intenções e preservando IDs, desenvolvimentos paralelos, descoberta de ordens e saves, salvo dispensa explícita.
- Carlos dispensou compatibilidade com saves antigos **na atualização CP2**. Isso não autoriza apagar saves nem dispensar compatibilidade automaticamente em futuras atualizações.
- Não criar outro Site. Não alterar audiência sem pedido.
- Conversa/documentação em português; jogo padrão em inglês e PT-BR selecionável e persistente.

## 2. Interface e identidade — regras permanentes

- **A página/tela inteira nunca pode rolar.** Somente painéis internos delimitados podem rolar.
- Ações principais — Combater, Continuar, Confirmar, Voltar — devem permanecer acessíveis em linha separada do conteúdo rolável.
- Rodapés opacos até a borda inferior e safe area. Nada de cartas ou conteúdo atrás/abaixo dos botões; última linha do conteúdo alcançável.
- Interface e canvas usam **VT323 Regular 400**, com fonte local. Wordmark GRAND JOURNEY em **Georgia**; tagline em **Nunito**. Não reaplicar Pixelify Sans globalmente.
- Menus de consulta/escolha de cartas usam **três colunas** nas larguras mobile suportadas, incluindo coleção, custom deck, treino, Hacks e Card Cycle. Preservar a mão de quatro cartas e as grades próprias de combate.
- Seletores usam janelas do jogo; evitar menus/select nativos do celular.
- Toque longo abre informações e não deve gerar ação residual de compra/implantação ao soltar. Detalhes de fusão são prévia, sem conceder fusão real.
- Preservar idiomas, acentos, textos de skills em combate e os ícones distintos de ciclo/deck.
- Manter consulta de cartas e relíquias nas escolhas. Não expor sistemas ainda não descobertos.
- Não reintroduzir a animação rejeitada do Warrior; novas animações/artes exigem validação própria. Preservar a trilha e identidade audiovisual existentes.
- Validar conteúdo longo, preparação de raid R3+, rodapés e tamanhos mobile. Ícones próprios dos traits e destaque do efeito já foram integrados; revisão adicional de legibilidade fica no polimento contínuo.

## 3. Run, mapas e encerramento

**Implementado e publicado:** três mapas, 15 camadas por mapa e nove confrontos de caminho por mapa, além dos combates opcionais de eventos. Os layouts diferem: mapa 2 chega a quatro nós por camada e mapa 3 a cinco.

- Duas oportunidades de encontro de cada ordem em cada mapa; escolhas e caminhos determinam o boss.
- Aleatoriedade dos conteúdos/lados dos nós implementada, preservando geometria e rotas possíveis.
- As espécies de raids enfrentadas não se repetem ao longo da run, considerando os mapas e seus bosses.
- Planejamento de rota por desenho livre implementado: desenhar/apagar, persistir por mapa e ao reabrir, limpar em nova run. Traços não mudam conexões nem regras de acesso.
- Deck, upgrades e relíquias da run seguem entre mapas. Novo confronto tem preparação normal e reinicia suas próprias mão, energia, formação e fusões.
- Perder um confronto normalmente encerra a run, ressalvadas exceções implementadas como Segunda Chance.
- Perfil novo começa com mapa 1. Vencer seu boss encerra a run e libera mapa 2. Em uma run posterior, vencer o boss do mapa 2 encerra e libera mapa 3. Com todos liberados, as runs podem atravessar os três mapas. O desbloqueio exibe “Map 2/3 unlocked!” / “Mapa 2/3 desbloqueado!” e “Continue your journey to the portal.” / “Continue sua jornada até o portal.”
- Vencer o boss do mapa 3 encerra a run normalmente. **Não há sequência do Desafio Final nesta versão.**

### Bosses condicionais e True Bosses existentes

- Nos três mapas, vencer os dois encontros da mesma ordem naquele mapa direciona o boss para essa ordem.
- O True Boss exige continuidade da mesma ordem ao longo dos três mapas; conferir os detalhes na fonte atual.
- Quando nenhuma rota de Blackfang, Dawncrest ou Titans é cumprida, o boss vem de Grand Union (ID interno `ironbound`).
- Blackfang, Dawncrest, Grand Union e Titans e seus True Bosses existentes não devem ser confundidos com o Secret Boss ou com o futuro Desafio Final.
- Os bosses existentes e suas transformações já estão implementados. Não voltar a tratá-los genericamente como conteúdo futuro por causa de documentos antigos.

## 4. Combate, cartas e fusão

Confrontos normais/elites de decks terminam com **três vitórias em rodadas**; bosses de decks, com **quatro**, para qualquer lado. Empates não pontuam. Raids têm regra própria.

| Rodada | Capacidade-base de campo | Renda-base de energia |
| --- | --- | --- |
| 1 | 2 | 5 |
| 2 | 3 | 4 |
| 3 | 4 | 5 |
| 4 | 5 | 6 |
| 5 | 6 | 7 |
| 6+ | 6 | Número da rodada + 2 |

Modificadores de traits, relíquias, árvore, desafios e vantagens podem alterar regras-base. A energia restante acumula sem teto de saldo. Não confundir renda/capacidade de combate com energia futura de acesso à run.

- Campo de 15 posições (5×3); banco de seis posições pagas. Banco não luta nem conta traits.
- Velocidades ×1, ×1,5, ×2 e ×3 persistentes. Aceleração não aumenta o passo máximo da simulação.
- Em confrontos de decks, dano ×5 aos 40s e empate aos 120s simulados. Raids não usam esse timeout/frenesi.
- Danos e curas do mesmo passo são resolvidos conjuntamente. Escudos absorvem antes da vida.
- Entre rodadas, formação, banco e fusões permanecem; unidades voltam com vida/carga inicial conforme suas regras. Novo confronto desfaz as fusões temporárias.
- Deck emprestado/customizado começa com 20 cartas, até quatro cópias físicas por personagem. A composição exata vem do deck atual; não assumir a antiga multiplicidade uniforme 3/3/3/3/2/2/2/2.
- Mão-base de quatro cartas. Cartas no campo/banco e constituintes de fusões ficam vinculadas, fora de compra/descarte. Reembaralhar descarte ao acabar a compra; não revelar ordem futura no Card Cycle.
- Refresh Hand custa uma energia, ressalvada Preparação Flexível. Freeze é grátis no preparo e mantém a mão restante para a próxima rodada, completando até quatro.
- Retirada normal manda ao descarte e reembolsa metade do custo arredondada para baixo. Voltar para a mão na mesma rodada de implantação devolve integralmente o pagamento; reciclar a mão bloqueia esse retorno.
- Upgrades por cópia: nível 1 +10%; nível 2 +25% total sobre a base. Não reduzem custo de energia nem alteram automaticamente gatilhos/durações/alcances fixos.
- Terceira cópia paga no campo/banco funde automaticamente. Fusão de um patamar, temporária, preserva identidades/upgrades e usa média dos atributos com multiplicador ×1,75 em vida/ataque/defesa/poder escalável. Não fundir só por possuir três cartas na mão/deck.
- Preservar posição mais antiga de campo ou, sem campo, a mais antiga do banco. Reversões devem conservar cartas, energia e vínculos.

## 5. Traits, roster e descoberta

**Revisão mecânica já implementada e balanceada no CP1:** 77 personagens jogáveis, 29 traits em três categorias — facção, atributo e temperamento — e três traits por personagem.

- Contagem por personagens distintos no campo; duplicatas não sobem o patamar. Banco/mão não contam.
- Maioria dos patamares: 2/4; Orc e Centaur usam 2/3. Efeitos e exceções devem ser consultados em `traits-v54.js`, não na antiga tabela de oito traits.
- Fearless V4 e dez suportes com auras passivas do modelo B estão integrados.
- Blackfang e Dawncrest são conteúdo existente. Preservar ocultação de catálogos/decks ainda não descobertos e posse prévia de decks legitimamente adquiridos.
- Filtros de ordem e raça/facção permanecem no mesmo nível, sem submenus ao tocar Blackfang/Dawncrest.
- Há 24 decks emprestados com composições explícitas e desbloqueios por progressão e milestones; nove foram revistos no CP2. IDs preservados. Não conceder liberações retroativas não aprovadas.
- Manter nomes e filtros consolidados: Meowri, High Elf, Forest Elf, Centaur e demais raças/ordens. Renomear exibição não autoriza alterar IDs internos antigos.
- Monstros de raid não são cartas do jogador. Usar emblemas próprios das ordens e Selo da Quimera nos nós.
- Ícones próprios dos traits e descrições com destaque do efeito integrados. Traits exclusivos de Blackfang/Dawncrest permanecem ocultos até revelar a respectiva ordem.

## 6. Relíquias, eventos, maldições e lojas

Ampliação da v53 implementada: cinco novas relíquias, quatro maldições e eventos/missões. O CP4 ampliou o catálogo para 43 relíquias. Os eventos incluem conteúdo de missão; não confundir eventos principais com seu desfecho interno.

### Relíquias e bolsa

- Bolsa-base 4×4, com formas conectadas e rotação de 90°, sem espelhamento. Expansão pela árvore e bloqueio por desafio modificam as casas disponíveis.
- Só peças equipadas no arranjo confirmado concedem efeito. Reserva é inativa. Relíquia inicial ocupa espaço.
- Ao receber relíquia, permitir encaixar, reservar ou recusar; preservar confirmação/cancelamento e validação de formas. Compra só cobra quando a aceitação é confirmada.
- Não gerar nova duplicata de relíquia equipada, reservada ou pendente.
- Totem da Horda e Bênção da Aurora entram nos sorteios após liberar os decks de Blackfang e Dawncrest, respectivamente. Relíquias já adquiridas são preservadas.
- Escolhas de personagens e relíquias em eventos mostram sinergia com o deck atual e permitem consultar detalhes antes de confirmar.
- Raids de Titans não recebem relíquias. O Anexo C define o destino das 25 relíquias antes excluídas do pool inimigo; Anexo D prevalece em conflitos de ordem/textos/recompensas.
- Ofertas genéricas de relíquias usam pesos comum/incomum/rara/ultra por mapa: 70/22/8/0, 50/30/15/5 e 35/30/25/10. Eventos de raridade explícita e forja respeitam suas garantias.
- IA usa relíquias compatíveis e um conjunto que caiba na bolsa; filtro pelos traits atuais foi corrigido no CP2.
- Preservar regra R1 de relíquias inimigas integrada no CP1 e sorteios estáveis por confronto.
- Reroll pago de loja/recrutamento: cinco de ouro, respeitando pools, limites e validação.
- Consultar carta não deve comprá-la. Ofertas mostram número de cópias físicas da run, inclusive as vinculadas à fusão.

### Maldições implementadas

| Carta | Mecânica |
| --- | --- |
| Fardo / Burden | Não jogável; ocupa vaga na mão até descarte/reciclagem e permanece no deck da run. |
| Exaustão / Exhaustion | Ao chegar à mão, perde até uma energia e vai ao descarte, sem compra substituta. |
| Correntes / Chains | Pagar uma energia afasta até o próximo confronto, sem outro benefício; ou permanece na mão. |
| Mau Presságio / Ill Omen | Cada cópia na mão reduz capacidade de campo em um, mínimo um; não remove unidades já posicionadas. |

São cartas da run, não posse permanente. Preservar interações com mão, freeze, refresh, remoção e reembaralhamento.

### O que continua pendente de revisão

Preço, formato e valor por casa das relíquias do jogador; economia de eventos/maldições/missões; efeitos econômicos de Expedição da árvore; revisão conjunta com vantagens, desafios e três mapas. A existência dos sistemas não equivale a revisão econômica concluída.

## 7. Raids e bosses existentes

As nove duplas já foram implementadas: Árvore/Broto, Colosso/Golem, Rei slime/Slime, Dragão/Wyvern, Hidra/Basilisco, Kraken/Cria tentacular, Lich/Esqueleto, Naga/Homem-serpente e Mantícora/Filhote.

- Vida do monstro persiste entre rodadas; aliados reconstituem sua equipe conforme o fluxo normal.
- Rodada termina pela derrota do monstro ou de todos os aliados; sem timeout e sem dano global ×5 aos 40s.
- Cinco rodadas perdidas encerram a raid. Morte simultânea do monstro e último aliado favorece a vitória do jogador.
- Mecânicas próprias, lacaios, evolução e hazards dependem de cada espécie. Não substituir detalhes do engine por uma progressão genérica.
- Snapshot de raid permite retomar combate com vida, tempo e efeitos preservados.
- Interface enxuta: placar padrão, rodada, nome/vida/barra e controles; sem painéis redundantes de dano ao boss/minions/cura ou explicações antecipando fases.
- Mecânicas internas de raids e True Bosses ainda não passaram por toda a revisão específica de balanceamento indicada pelo Claude, embora os multiplicadores e a curva já tenham sido trabalhados.

## 8. Árvore permanente e XP da run

- O jogador começa a run com 0 XP. Vitórias no mapa geram XP. Cada XP compra 1 ponto de custo da árvore.
- A primeira janela de cada mapa abre após o sexto confronto do caminho. A segunda abre ao vencer o boss. Na derrota, abre uma última janela quando há XP suficiente para um nó conectado.
- XP não gasto passa de uma janela para outra da mesma run. A sobra é perdida quando a run termina. Nós comprados permanecem ativos nas próximas runs.
- Nível exibido = quantidade de nós comprados, de 0 a 60, sem contar a origem. Com a árvore completa, cada 20 XP ganhos na run concedem 1 diamante.
- Redistribuição gratuita fora da run devolve o custo dos nós adquiridos. O orçamento de redistribuição restante é perdido ao iniciar a próxima run.
- A árvore distingue nós comprados, compráveis, conectados com XP insuficiente e bloqueados por pré-requisito. O detalhe de um nó conectado informa quanto XP falta quando a compra está indisponível.
- Confrontos comuns rendem 1/2/3 XP nos mapas 1/2/3. Elites, lutas de ordem e raids rendem 2/4/6 XP. Boss normal rende 6/10/12 XP e o True Boss do mapa 3 rende 18 XP. Combates de eventos não geram XP de árvore.

| Mapa | XP novo mínimo até a primeira janela | XP novo mínimo da primeira à segunda |
| --- | ---: | ---: |
| 1 | 8 | 8 |
| 2 | 14 | 14 |
| 3 | 18 | 18 |

Os mínimos consideram a rota com boss normal, sem bônus de XP e sem saldo acumulado de outra janela. A fonte de custos e efeitos é `dist/tree-data.js` e `dist/tree-engine.js`.

## 9. Desafios da Jornada e Insígnias — CP2 publicado

- Liberados após a primeira run completa vitoriosa, concluindo o mapa 3.
- Inicialmente nível 1 disponível; vencer com N desafios ativos libera N+1, até 15.
- Nível é a **quantidade de desafios ativos**, sem pesos diferentes. O jogador escolhe a combinação dentro do nível disponível, podendo jogar nível 0.
- Primeira vitória em cada nível inédito concede uma Insígnia. Repetição de nível não concede outra, mesmo com combinação diferente.
- Registrar individualmente desafios que participaram de uma run completa vitoriosa. Maior nível disponível e maior vencido são conceitos separados.
- Insígnia não é XP nem Essência. Serve para vantagens, em sistema separado da árvore.
- Seleção fica fixada por run; treino e replay do tutorial não recebem desafios/vantagens nem suas recompensas.
- Acesso atual: escolher deck e confirmar; após o desbloqueio, a tela de desafios aparece antes do mapa.
- Desafios e vantagens entram em vigor ao confirmar a jornada, permitindo consulta dos efeitos iniciais antes do primeiro nó. O catálogo atual está em revisão de design no outro chat e com o Claude; propostas não representam alterações já publicadas.

### Catálogo publicado — 15 desafios regulares

| ID | Desafio | Efeito publicado |
| --- | --- | --- |
| `veterans` | Veteranos | Inimigos comuns têm +8 upgrades. |
| `tough` | Tropas Resistentes | Vida dos inimigos +10%. |
| `relentless` | Ataques Implacáveis | Dano dos inimigos +8%. |
| `commanders` | Comandantes Preparados | Elites, ordens e bosses ganham +2 relíquias e +2 upgrades. |
| `bossrounds` | Bosses Implacáveis | Bosses de mapa (time e líder) têm +7% de vida e de dano. |
| `reinforcements` | Reforços Inimigos | Desde a 1ª rodada, inimigos comuns e elites colocam +1 unidade em campo. |
| `raidfury` | Fúria das Raids | Raids com +25% de vida e +8% de dano. |
| `inflation` | Mercado Inflacionado | Preços da loja +30%. |
| `lightpurse` | Bolsa Leve | Ouro por vitória −27%. |
| `scarce` | Recursos Escassos | −1 de energia na primeira rodada contra bosses. |
| `bag` | Bagagem Limitada | Bloqueia 5 casas da bolsa de relíquias. |
| `heavydeck` | Deck Pesado | Começa a run com +2 cartas básicas genéricas aleatórias (Warrior, Lancer, Fighter, Martial Artist, Miner, Pirate, Ranger ou Shackled Pirate). |
| `dissipate` | Energia Dissipada | Perde 1 da energia que sobrar ao fim de cada rodada. |
| `fewrelics` | Relíquias Escassas | Escolhas de relíquia oferecem 2 opções a menos (mínimo 1). |
| `cursed` | Caminho Amaldiçoado | Começa a run com 2 maldições Exaustão. |

## 10. Vantagens da Jornada — comportamento publicado

- Catálogo de 15 vantagens, cada uma por uma Insígnia, em sistema separado da árvore.
- Acesso pelo botão **Vantagens da Jornada** no menu principal, após a primeira vitória completa.
- As vantagens ativas são registradas ao confirmar a jornada. Alterações na seleção valem para a próxima run.
- Desativar uma vantagem devolve a Insígnia gasta. O botão de reset devolve as Insígnias de todas as vantagens ativas.
- Mão Planejada permite escolher uma carta antes da run; uma cópia existente começa na mão nos confrontos alternados, sem criar cópia nova.
- Olho Treinado permite renovação gratuita com consumo persistido no save, inclusive nas escolhas de eventos e recompensas, preservando restrições de raridade/forja.
- Limpeza vale na primeira loja do mapa; não usar ali não transfere a gratuidade para outra loja. Pode remover maldição gratuitamente.
- A Relíquia de Viagem (Travel Relic), o desafio Deck Pesado (Heavy Deck, ID `heavydeck`) e os demais efeitos iniciais entram em vigor ao confirmar a jornada. Seus efeitos já aparecem no deck, nas relíquias ou nos recursos, conforme o caso, antes do primeiro nó.

### Catálogo publicado — 15 vantagens

| ID | Vantagem | Efeito publicado |
| --- | --- | --- |
| `travel_relic` | Relíquia de Viagem | Começa cada run com +1 relíquia comum aleatória que caiba na bolsa. |
| `pretraining` | Treino Prévio | Duas cartas aleatórias do deck começam com upgrade 1. |
| `flex_prep` | Preparação Flexível | Uma vez por rodada, renova a mão de graça. |
| `efficient_fusion` | Fusão Eficiente | Toda fusão concluída devolve 1 de energia. |
| `full_purse` | Bolsa Cheia | +20 de ouro inicial. |
| `elite_experience` | Experiência de Elite | Cada elite vencida dá +0,5% de vida e ataque a todas as suas unidades até o fim da run. |
| `trained_eye` | Olho Treinado | 1 renovação grátis em toda escolha de relíquia. |
| `rehearsal` | Ensaio | A primeira carta comprada em cada loja vem com upgrade 2. |
| `planned_hand` | Mão Planejada | Antes da run, escolhe uma carta do deck: uma cópia começa na mão em confrontos alternados (1º, 3º, 5º...). |
| `saved_energy` | Energia Guardada | +1 de energia na primeira rodada de cada confronto. |
| `cleanse` | Limpeza | Uma remoção de carta grátis na primeira loja de cada mapa. |
| `path_blessing` | Bênção do Caminho | Ao entrar nos mapas 2 e 3, Duas cartas aleatórias do deck recebem upgrade 1. |
| `interest` | Juros | Vencer o boss de cada mapa concede 100% do ouro guardado (máx. 150). |
| `elite_hunter` | Caçador de Elites | Vencer uma elite concede +20 de ouro. |
| `second_chance` | Segunda Chance | Uma vez por run, perder um confronto (exceto bosses) repete só a última rodada: o placar continua e o inimigo perde 1 ponto. |

## 11. Secret Boss e Desafio Final — não implementados

Carlos excluiu explicitamente **tudo referente ao Secret Boss e ao Desafio Final** da integração CP2. Não integrar automaticamente funções, requisitos ou interface desses sistemas que existam no pacote do Claude. Não apresentar como liberados ao vencer o nível 15.

### Decisões confirmadas de design

Acesso pensado com requisitos cumulativos:

1. Ter vencido runs derrotando os três True Bosses — Blackfang, Dawncrest e Monstros, podendo ser em runs diferentes.
2. Ter concluído cada desafio regular em pelo menos uma run completa vitoriosa.
3. Ter alcançado o nível máximo de desafio.
4. Na run do Desafio Final, todos os desafios regulares devem estar ativos.

Ainda em aberto nesta continuidade: exigir também vitória prévia no nível máximo, além de alcançá-lo; apresentação/contagem do Desafio Final na seleção. O CP2 sugere vitória no máximo, mas isso não foi implementado nem deve resolver silenciosamente a decisão aberta.

Com o Desafio Final ativo, substituir o encerramento do mapa 3 por **três True Bosses em sequência e depois o Secret Boss**. São quatro confrontos independentes, não quatro rodadas de uma batalha. Não acrescentar boss comum antes.

- Manter deck, upgrades e relíquias da run entre os quatro confrontos.
- Cada confronto começa com a preparação normal de um novo confronto, respeitando energia, mão e formação normais.
- Preservar a surpresa. Vitória no Secret Boss concede milestone de conclusão máxima.
- Ordem dos True Bosses continua a fechar: o pacote do Claude sugere primeiro a ordem seguida na run e os outros dois aleatórios; não tratar essa sugestão como execução aprovada.
- Eventual Insígnia adicional, recompensa exclusiva, título ou cosmético ainda não definidos.

### Secret Boss: sequência visual aprovada

Entidades: **Primeiro Soberano**, **Devorador de Jornadas** e **Coração da Quimera**.

| Fase | Forma aprovada |
| --- | --- |
| 1 | Fusão dos três, primeira forma. |
| 2 | Três separados, primeiras formas, simultaneamente. |
| 3 | Três separados, segundas formas, simultaneamente. |

A fusão na segunda forma foi descartada. Não terminar nessa fusão nem criar quarta fase.

**Propostas ainda não aprovadas como dinâmica final:** mudar de fase a cada duas vitórias do jogador; formato de raid com barras individuais; duas etapas de vida por fase, dano persistente nas derrotas, incapacitação até derrubar o trio e limite compartilhado de derrotas. Não converter a proposta do ChatGPT em decisão de Carlos.

Fechar antes dos números: fim de rodada/fase/confronto, vida persistente versus duas vitórias por fase, mortes individuais, recuperação/reaparecimento, transições, progressão do jogador, limite de derrotas, habilidades, alvos e posicionamento. Claude calibra quando houver conteúdo implementado e autorizado.

## 12. Lista consolidada de pendências da versão publicada

A numeração histórica P01–P18 foi preservada. Novos pedidos constam como P19–P26. “Pendente” registra o trabalho solicitado ou discutido, sem autorizar implementação automaticamente.

| ID | Item | Situação em 18/11/2026 e escopo restante |
| --- | --- | --- |
| P01 | Efeitos iniciais da run | Entregue. Aplicação ao confirmar a jornada. |
| P02 | Redistribuição das vantagens | Entregue. Desativação e reset devolvem Insígnias. |
| P03 | Prévia de deck emprestado | Entregue. Cartas, relíquia inicial, traits e ordem de apresentação. |
| P04 | Vitória e derrota | Reformulação pendente. Vitória deve mostrar todos os personagens do deck, na referência de Pokémon após a Elite dos Quatro. Definir repetidos, fusões, upgrades e composição. Organizar estatísticas e recompensas. Desbloqueios automáticos e milestones da run já entregues na v61. |
| P05 | Profile e histórico | Pendente. Lista de runs e detalhes consultáveis, aproveitando coleta existente. Definir destaque de deck, resultado, mapas, bosses, desafios, recompensas e estatísticas. |
| P06 | Energia de acesso + Hack | Pendente. Proposta de custo 5, capacidade 30 e regeneração de 1/3min; revisar economia e persistência. |
| P07 | Login diário | Pendente. Proposta de sete dias (+1 diamante nos dias 1–6, +7 no dia 7; falta reinicia). Fechar virada do dia e persistência. |
| P08 | PWA e offline | Pendente. Instalação, cache e atualização. |
| P09 | Sincronização entre aparelhos | Futuro. Identificação e resolução de conflitos de save. |
| P10 | Polimento visual dos traits | Ícones próprios, efeito destacado e ocultação de ordens entregues. Manter revisão de legibilidade e consistência. |
| P11 | Economia de relíquias/eventos | Revisão pendente de preços, formatos, valor por casa, eventos, maldições, missões e Expedição. Pesos por mapa corrigidos na v62. |
| P12 | Economia permanente | Revisar diamantes, XP excedente, boosters, raridades, coleção e recrutamento. Relacionar à futura Essência e cosméticos. |
| P13 | Balanceamento integrado | Contínuo. Novos playtests de bosses 2/3, desafios, skills, movimentação, fusões, recompensas, rotas, saves, tutorial, idiomas e acessibilidade mobile. |
| P14 | Secret Boss | Pendente. Preservar três apresentações visuais aprovadas da seção 11. Fechar mecânica, skills e transições. |
| P15 | Desafio Final | Pendente. Consolidar revisão dos desafios; fechar acesso, ordem dos quatro confrontos, vitória/derrota, seleção, milestone e recompensas. |
| P16 | Essência e cosméticos | Pendente. Fontes, conversões, preços e seleção. Integrar planejamento ao Estrategista. |
| P17 | Alinhamento com Claude | Contínuo. Comunicar fonte integrada, publicações, decisões e diferenças de simulação. |
| P18 | Relíquias que somam traits | Entregue na preparação. Crest of Houses, Code of Honor e Forge of Talents mostram contribuição e patamar efetivo. Validar em regressões; membros continuam distintos e de campo. |
| P19 | Animações de personagens | Completar elenco, bosses, transformações, Titans e lacaios. Ver seção 18. |
| P20 | Efeitos de combate | Dez animações físicas aprovadas integradas e publicadas na v65 (A01 v002, A02 pesado/circular, A03–A07 e A08 cruzado/combo2). Demais famílias e skills permanecem pendentes. Ver seção 18 e documento de diretrizes. |
| P21 | Artes e logos | Logo final do jogo, ícones próprios de relíquias, aplicação do emblema Grand Union já fornecido, capas de boosters e artes das novas telas/conteúdos. Ver seção 19. |
| P22 | Lore | Consolidar, definir pontos de apresentação e revelação, escrever e integrar EN/PT. |
| P23 | Estrategista | Criar personagem do jogador, aparência editável, locais de apresentação e cosméticos desbloqueáveis. Ver seção 20. |
| P24 | Filtros de relíquias | Entregue na v63. Categorias por efeito em consultas e escolhas de relíquias, incluindo coleção, lojas, bolsa, treino e deck customizado. |
| P25 | Skill do Ranger | Implementada e publicada na v63. Arremesso medium range; inimigo na trajetória ativa a trap; recuo de 55 unidades igual ao da Gunner; área de ativação +10%; um único dano/efeito em um inimigo por trap. |
| P26 | Revisão dos Desafios da Jornada | Em discussão no outro chat e Claude. Consolidar proposta e balanceamento antes de integrar; articular com P15. |

### Expansões em discussão

| Item | Escopo discutido |
| --- | --- |
| PvP ao vivo | Um combate único entre dois jogadores, com deck e bolsa de relíquias customizados, no formato do modo Treino. A meta para o playtest é evitar custo inicial de servidor. A solução de conexão e sincronização da partida ainda está em aberto. |
| Novas ordens | Anões/mechas e Zodíaco são ideias de expansão. Elenco, mecânicas e entrada na jornada ainda estão em aberto. |

### Focos de playtest do CP2

- Mão Planejada, Preparação Flexível, Olho Treinado, Limpeza e Fusão Eficiente: dependência de escolhas humanas pode ser subestimada pelo simulador.
- Energia Dissipada pesa mais em decks Blackfang que na média.
- Avaliar jogo base, árvore iniciante/avançada, escada de desafios e combinações, sem exigir taxas idênticas entre decks.
- Ritmo de pós-jogo simulado de cerca de 15–30 runs para a escada foi mantido por decisão; não criar mudança de ritmo sem nova evidência/decisão.
- Mecânicas internas de raids e True Bosses ainda requerem revisão específica de balanceamento; a existência de testes não certifica sensação/dificuldade final.
- Conferir persistência no Android e retomada: o relato histórico de alternância de saves não tem causa definitivamente estabelecida; tratar como risco de validação, não como bug diagnosticado resolvido.

### Blocos históricos que já foram entregues

Não recolocar como implementação integralmente pendente:

- Aleatoriedade dos mapas e garantia de rotas.
- Nove raids, incluindo Mantícora/Filhote.
- Três mapas, transições e bosses/True Bosses existentes.
- Árvore permanente e XP da run com janelas de compra e redistribuição fora da run.
- Cartas negativas/maldições, eventos/missões e ampliação de relíquias da v53.
- Revisão mecânica dos traits em facção/atributo/temperamento.
- CP1: atributos/traits, Fearless V4, auras, decks/desbloqueios, curva/economia/bosses/raids e relíquias inimigas.
- CP2: curva revisada, árvore, nove decks, filtro de relíquias, 15 desafios regulares, 15 vantagens e suas telas regulares.

Um bloco entregue pode ter polimento ou balanceamento ainda pendente, conforme a tabela. Experimentos aposentados/descartados do Claude não são itens aprovados do roadmap.

## 13. Progressão, saves, tutorial e treino

- Coleção, boosters, diamantes, catálogos, milestones, custom decks e perfil são permanentes. Ouro/cartas/upgrades/relíquias da run não viram automaticamente posse da coleção.
- New game é reset com confirmação, diferente de abandonar ou iniciar outra run.
- Save local ao navegador/aparelho/origem; manter export/import JSON, recuperação local/IndexedDB e marcadores de reset. Sem sincronização hoje.
- A exportação `format: "grand-journey"` usa schema 2 e importa schemas 1 e 2. O schema interno do perfil continua em 1 e a versão interna da run continua em 20. Dados históricos anteriores à coleta podem omitir os novos campos.
- Backup de fim de run pode ser solicitado automaticamente e baixado manualmente; não afirmar que Android concluiu um download sem evidência.
- Preservar snapshots de raid com HP/tempo/efeitos e as regras de recuperação de combates de decks. Não reconstruir uma run ativa a partir de documento antigo.
- Treinamento gratuito, isolado, sem recompensas/progressão normal. Deck emprestado desbloqueado ou montagem, configurações independentes de jogador/inimigo, upgrades, relíquias e vitórias necessárias.
- Vanguarda da Aurora é o primeiro deck utilizável. Encontro de Caminhos e Lei do Gatilho ficam utilizáveis após encerrar a run do tutorial por vitória ou derrota. Concluir as instruções ou vencer o primeiro combate não libera os dois decks antecipadamente. “Primeiros Passos” é um único milestone, cumprido na primeira vitória em combate, com recompensa própria de booster.
- Tutorial guiado, banco/arraste, retirada/retorno à mão, refresh, informações, ciclo, freeze, fusão, mapa e bolsa já existentes. Replay preserva a run e não concede recursos indevidos.
- Hacks existentes: diamantes, ouro, cartas/relíquias da run, cura de vivos, carga de especiais, vencer rodada e vencer confronto. Hack de energia de acesso não existe ainda.
- `profile.runs[]` guarda build, seed, desafios, vantagens, nós iniciais e compras de nós. `encounters[]` inclui vitórias e derrotas, com escala e fontes por atributo, formação inicial, rodadas, reforços e métricas por unidade física e nível. Ajustes específicos aparecem na formação inimiga correspondente. A escala no topo resume a primeira rodada, priorizando o líder quando ele tem escala própria.
- A vida percentual compara a vida restante com o total no início da rodada. Empate é registrado como `draw`. A espera de habilidade mede o tempo em que a carga estava pronta, a unidade podia tentar ativar a habilidade e a checagem de alvo falhou.
- `recruitOffer` preserva `offered` com IDs e inclui `offeredLevels` com o nível por ID, inclusive eventos e Caravana. Dados anteriores podem não conter esse campo.
- `choices[]` guarda ofertas, compras, escolhas, fusões, upgrades e movimentos confirmados na bolsa. `completed[]` guarda ouro ganho, gasto e saldo ao fechar o nó.

## 14. Histórico da integração CP2

O CP2 foi aplicado por trecho sobre a fonte CP1 publicada, sem commits posteriores na recuperação feita para essa integração. Correções adicionais:

1. Conclusão pela sessão da árvore também registra desafios/Insígnias, apesar de referências anteriores de `Progress.finish` capturadas pelos módulos.
2. Registro idempotente de encerramento e recompensas; chamadas duplicadas de vitória não repetem os bônus de elites.
3. Vantagens são copiadas por run; compras posteriores não mudam a run ativa.
4. Mão Planejada escolhida antes do primeiro nó, com aplicação na primeira mão e contador de confrontos alternados sem avanço duplicado por compra adicional.
5. Renovação de Olho Treinado persistida no save, sem depender de propriedades de array descartadas pelo JSON.
6. Escolhas de eventos recebem Olho Treinado e Relíquias Escassas conforme as restrições aplicáveis; raridade/forja preservadas.
7. Limpeza restrita à primeira loja e aplicável à remoção de maldições; preço-base da remoção de maldição continua 40 quando não há benefício/modificador.
8. Candidatos aposentados removidos dos novos catálogos; nenhum requisito/interface do Desafio Final integrado.
9. Interface mobile, rodapés, idiomas e cache ajustados, incluindo reciclagem gratuita com energia zero.

Esses pontos podem produzir diferenças em simulações que usem apenas a cópia do Claude. Referência detalhada no repositório: `docs/INTEGRACAO_CP2_CHATGPT.md`. Esse relatório descreve a etapa anterior ao deploy; a publicação foi autorizada e concluída depois, conforme a seção 1 deste documento.

## 15. Fonte técnica e validação

Consultar o fonte do Site, não o repositório de simulação do Claude, para determinar o que o jogador recebe.

| Sistema | Referência no fonte atual |
| --- | --- |
| Regras-base e progressão | `dist/game-0.js` e módulos subsequentes |
| Composições/desbloqueios | `dist/decks-p3.js` |
| Mapas, curva e distribuição | `dist/acts-engine.js`, `dist/map-variety.js`, `dist/enemy-decks-p4.js` |
| Raids/bosses | `dist/raid-engine.js`, `dist/monster-engine.js`, `dist/boss-engine.js` |
| Traits e suportes | `dist/traits-v54.js`, `dist/supports-b.js`, `dist/balance-p1.js` |
| Árvore | `dist/tree-data.js`, `dist/tree-engine.js`, `dist/tree-ui.js` |
| Eventos/maldições/relíquias adicionais | `dist/content-v53.js`, `dist/content-ui-v53.js` |
| Desafios/vantagens e suas telas | `dist/challenges.js`, `dist/advantages.js`, `dist/postgame-ui.js` |
| Dados exportados CP2 | `balanceamento/dados_checkpoint_CP2.json`; código prevalece para lógica dinâmica |
| Relatório de integração | `docs/INTEGRACAO_CP2_CHATGPT.md` |
| Logs da integração | `docs/validation-cp2/` |

Não usar as antigas tabelas de atributos/skills/traits da v45 como valores atuais. CP1 e efeitos dinâmicos mudam atributos finais; uma tabela de dados-base exportados não incorpora necessariamente todos os modificadores de combate. Para mudanças de balanceamento, comparar dados e ganchos do engine atual.

### Verificações já executadas na integração

- `node scripts/validate-balance-base.cjs`: dez etapas aprovadas.
- `node tests/challenges-p5.cjs` e `node tests/advantages-p5.cjs`.
- `node tests/integration-cp2.cjs`: fluxo real dos três mapas, liberação, Insígnias únicas, duplicações, seleção por run, reroll persistido, Mão Planejada, fusão, Limpeza/maldições e eventos.
- Regressões `node tests/integration-cp1.cjs` e `node tests/save-compat-cp1.cjs`.
- Sintaxe e `git diff --check`.
- QA de navegador em prévia local: 320×568, 360×640, 390×844 e 430×932; árvore/descrições longas, seleção de cartas em três colunas, vantagens, eventos/relicário, resultados longos e raid na quarta rodada.

Essas verificações não substituem playtest humano prolongado, validação física em Android ou novas simulações de carreiras do Claude após as correções de integração.

## 16. Documentos de apoio e precedência

| Arquivo | Identidade conhecida / uso |
| --- | --- |
| Grand_Journey_Projeto_v56.md | `libfile_6b28435a6f6c8191b79ace5d35b9d090` · referência de continuidade da v56 publicada |
| GJ-v54-BAL-CP2.zip | `libfile_ea984c222e1081919c8827fe346a28d4`; pacote original, não representa sozinho o fonte publicado |
| CHECKPOINT_CP2_resumo.pdf | `libfile_2ca15497be288191a92851962f6e274c`; entrega/análises do Claude |
| INTEGRACAO_CP1_CHATGPT.md | `libfile_409b5b61bb5081918b8a080bf8c9a7f7`; relatório CP1 |
| GJ-v54-BAL-CP1.zip | `libfile_720ac1c7f9f0819185a68a12e234d895`; pacote original anterior |
| Grand_Journey_Desafios_da_Jornada.md | `libfile_4a801f1d85e0819183a55c4db23cabff`; design do pós-jogo; ler versão atual, com decisões posteriores prevalecendo |
| Grand_Journey_Projeto_v17.md e versões antigas | Históricos; não sobrescrevem decisões atuais nem o código publicado |

Precedência: instrução explícita mais recente de Carlos → decisões confirmadas nesta continuidade → fonte atual para comportamento implementado → documentação histórica de apoio. Quando código e requisito novo diferirem, registrar ambos e manter a correção pendente até autorização.

## 17. Exemplo de confronto exportado na v56

Item completo de `profile.runs[].encounters[]` gerado pelo teste de derrota em três rodadas da v56.

```json
{
  "key": "c1:1",
  "type": "battle",
  "deck": null,
  "relics": [],
  "score": [0, 3],
  "round": 3,
  "formation": [{"type": "warrior", "level": 0}],
  "event": false,
  "result": "defeat",
  "act": 1,
  "barrier": "entry",
  "enemyScale": {"hp": 0.88, "damage": 0.864, "attackSpeed": 1, "armor": 1, "skill": 1, "defense": 1, "speed": 1, "crit": 1, "minions": 1},
  "enemyScaleSources": [{"source": "map:1", "hp": 1, "damage": 1}, {"source": "stage:1", "hp": 0.8, "damage": 0.8}, {"source": "barrier:entry", "hp": 1, "damage": 1}, {"source": "challenge:tough", "hp": 1.1}, {"source": "challenge:relentless", "damage": 1.08}, {"source": "challenge:reinforcements", "addCards": 1}],
  "player": {"formation": [{"uid": "p1", "type": "warrior", "level": 0, "x": 65, "y": 475}], "relics": [{"id": "banner", "shape": "L3", "cells": [[0, 0], [1, 0], [1, 1]]}], "bagCellsUsed": 3, "bagCellsTotal": 16},
  "rounds": [
    {
      "player": {"formation": [{"uid": "p1", "type": "warrior", "level": 0, "x": 65, "y": 475}], "relics": [{"id": "banner", "shape": "L3", "cells": [[0, 0], [1, 0], [1, 1]]}], "bagCellsUsed": 3, "bagCellsTotal": 16},
      "enemy": {"formation": [{"uid": "e1_1", "type": "fighter", "level": 0, "x": 140, "y": 225}, {"uid": "e6_0", "type": "shaolin", "level": 0, "x": 215, "y": 225}], "reinforcements": []},
      "enemyScale": {"hp": 0.88, "damage": 0.864, "attackSpeed": 1, "armor": 1, "skill": 1, "defense": 1, "speed": 1, "crit": 1, "minions": 1},
      "enemyScaleSources": [{"source": "map:1", "hp": 1, "damage": 1}, {"source": "stage:1", "hp": 0.8, "damage": 0.8}, {"source": "barrier:entry", "hp": 1, "damage": 1}, {"source": "challenge:tough", "hp": 1.1}, {"source": "challenge:relentless", "damage": 1.08}, {"source": "challenge:reinforcements", "addCards": 1}],
      "round": 1,
      "winner": "enemy",
      "time": 2.2,
      "playerHpPct": 0,
      "enemyHpPct": 95.5,
      "playerAlive": 0,
      "enemyAlive": 2
    },
    {
      "player": {"formation": [{"uid": "p1", "type": "warrior", "level": 0, "x": 140, "y": 475}], "relics": [{"id": "banner", "shape": "L3", "cells": [[0, 0], [1, 0], [1, 1]]}], "bagCellsUsed": 3, "bagCellsTotal": 16},
      "enemy": {"formation": [{"uid": "e1_1", "type": "fighter", "level": 0, "x": 140, "y": 225}, {"uid": "e6_0", "type": "shaolin", "level": 0, "x": 215, "y": 225}, {"uid": "e7_0", "type": "gunner", "level": 0, "x": 215, "y": 95}], "reinforcements": []},
      "enemyScale": {"hp": 0.88, "damage": 0.864, "attackSpeed": 1, "armor": 1, "skill": 1, "defense": 1, "speed": 1, "crit": 1, "minions": 1},
      "enemyScaleSources": [{"source": "map:1", "hp": 1, "damage": 1}, {"source": "stage:1", "hp": 0.8, "damage": 0.8}, {"source": "barrier:entry", "hp": 1, "damage": 1}, {"source": "challenge:tough", "hp": 1.1}, {"source": "challenge:relentless", "damage": 1.08}, {"source": "challenge:reinforcements", "addCards": 1}],
      "round": 2,
      "winner": "enemy",
      "time": 2.1,
      "playerHpPct": 0,
      "enemyHpPct": 97.4,
      "playerAlive": 0,
      "enemyAlive": 3
    },
    {
      "player": {"formation": [{"uid": "p1", "type": "warrior", "level": 0, "x": 215, "y": 475}], "relics": [{"id": "banner", "shape": "L3", "cells": [[0, 0], [1, 0], [1, 1]]}], "bagCellsUsed": 3, "bagCellsTotal": 16},
      "enemy": {"formation": [{"uid": "e1_1", "type": "fighter", "level": 0, "x": 140, "y": 225}, {"uid": "e6_0", "type": "shaolin", "level": 0, "x": 215, "y": 225}, {"uid": "e3_1", "type": "shinobi", "level": 0, "x": 290, "y": 225}, {"uid": "e7_0", "type": "gunner", "level": 0, "x": 215, "y": 95}], "reinforcements": []},
      "enemyScale": {"hp": 0.88, "damage": 0.864, "attackSpeed": 1, "armor": 1, "skill": 1, "defense": 1, "speed": 1, "crit": 1, "minions": 1},
      "enemyScaleSources": [{"source": "map:1", "hp": 1, "damage": 1}, {"source": "stage:1", "hp": 0.8, "damage": 0.8}, {"source": "barrier:entry", "hp": 1, "damage": 1}, {"source": "challenge:tough", "hp": 1.1}, {"source": "challenge:relentless", "damage": 1.08}, {"source": "challenge:reinforcements", "addCards": 1}],
      "round": 3,
      "winner": "enemy",
      "time": 1.9,
      "playerHpPct": 0,
      "enemyHpPct": 100,
      "playerAlive": 0,
      "enemyAlive": 4
    }
  ],
  "units": [{"uid": "p1", "type": "warrior", "level": 0, "skillCasts": 0, "skillHeldTime": 0, "damageDealt": 48, "damageTaken": 3, "healing": 0, "kills": 0, "deaths": 3}]
}
```


## 18. Animações e efeitos — inventário e pendências

### Personagens

Treze personagens possuem animações próprias de caminhada, ataque e skill integradas na v62: Warrior, Lancer, Bastion, OmnaMusha, Shinobi, Kinoichi, Samurai, Ronin, Fighter, Martial Artist, Shaolin, Cowboy e Gunner.

Completar os demais personagens, depois bosses, transformações, Titans e lacaios. Validar direção, escala, transparência e sincronização do impacto. A representação estática ou movimentação básica existente não equivale a um conjunto próprio de animações.

### Efeitos

| Efeito | Estado atual e trabalho restante |
| --- | --- |
| Tiro | Clarão, trajetória e impacto existentes; revisar aparência, escala e variantes por arma. |
| Corte | Animação compartilhada existente; criar variantes de golpes e skills. |
| Soco, impacto e crítico | Recursos animados existentes; diferenciar golpes leves/pesados e contato com o chão. |
| Flecha e virote | Projéteis com trajetória; revisar lançamento e impacto próprio. |
| Magia | Projétil/impacto arcano genérico; diferenciar tipos de magia e skills. |
| Fumaça do Shinobi | Desaparecimento animado existente; revisar saída/chegada e sincronização do teleporte. |
| Chuva de flechas da Archer | Área e dano existentes; produzir animação própria da chuva de flechas. |
| Trap do Ranger | Representação simples; animar arremesso, instalação, ativação e desaparecimento, Mecânica P25 entregue na v63; polimento visual próprio continua pendente. |
| Explosões | Animação genérica; revisar dinamite, bomba e escalas. |
| Fogo persistente | Área e recurso de queimadura existentes; integrar chamas da área. |
| Cura e escudos | Animações existentes; revisar duração, intensidade e leitura. |
| Buffs e debuffs | Biblioteca e indicadores genéricos; diferenciar conforme necessidade de leitura. |
| Investidas e deslocamentos | Rastros/poeira existentes; sincronizar por movimento. |
| Totem do Shaman | Desenho simples; arte e animação próprias pendentes. |
| Estandarte do Pirate Captain | Desenho simples; estandarte e aura próprios pendentes. |
| Santuário da Priestess | Área existente; animação própria de cura/purificação pendente. |
| Vórtice da Sorceress | Círculos giratórios; vórtice próprio pendente. |
| Golpe cruzado da OmnaMusha | Movimento/área existentes; revisar cortes específicos. |
| Queda do Eagle Druid | Impacto no chão existente; revisar queda, contato e dissipação. |
| Skills de bosses e Titans | Efeitos/marcações existentes; completar inventário específico e produzir faltantes. |
| Fusão | Feedback visual/sonoro existente; polir transformação e leitura. |

Fontes de consulta: `dist/vfx-data.js`, `dist/game-4.js`, `dist/game-9.js`, `dist/combat-animation.js` e engines das skills. Existência de um recurso no atlas não garante uso específico em todas as skills.

## 19. Artes, identidade visual, lore e encerramento

- Criar logo final de Grand Journey e aplicações em abertura/cabeçalho, preservando a identidade tipográfica validada até nova aprovação.
- Criar ícones próprios de relíquias. Várias usam símbolos compartilhados e o fallback genérico de estrela.
- Logo de Grand Union fornecida por Carlos em 20/11/2026 e registrada no repositório. Aplicação nas telas ainda pendente; elas conservam o escudo genérico. Blackfang, Dawncrest, Titans e traits já possuem artes próprias.
- Revisar capas dos boosters, hoje com composição-base compartilhada. Revisão de símbolos dos nós é possibilidade de polimento, ainda sem decisão de estilo.
- Preparar ícone de instalação junto da entrega PWA.
- Vitória deve mostrar todos os personagens do deck, conforme referência de Pokémon após a Elite dos Quatro. Definir representação das cópias repetidas, fusões e upgrades, composição e método de montagem da imagem. Essa referência de vitória não muda as regras de combate.
- Reformular também a derrota e a organização de estatísticas/recompensas. A automação de Unlocks da v61 já está entregue.
- Inserir a lore no jogo: consolidar texto canônico, definir introdução, entradas de personagens/ordens/mapas/bosses e encerramentos, ritmo de revelação e segredo; escrever EN/PT e integrar.

## 20. Estrategista, cosméticos, Profile e filtros

### Estrategista

Pedido de Carlos em 18/11/2026: criar o personagem do jogador, chamado **Estrategista**, permitir editar sua aparência e desbloquear cosméticos. Definir identidade visual, aparência-base, peças/opções editáveis, locais onde aparece, persistência, condições de obtenção e seleção de cosméticos. Fontes e preços ainda não definidos. Relacionar à proposta histórica de Essência/cosméticos sem equiparar Essência, XP e Insígnias.

### Profile e histórico

Revisar a tela de Profile e criar histórico consultável de runs. A coleta detalhada no save já existe. Definir lista e detalhes com deck, resultado, mapas, bosses, desafios, recompensas e estatísticas, além do tratamento de runs antigas com campos ausentes.

### Filtros de relíquias

Implementado e publicado na v63. Filtros por efeito: vida/cura, ataque, defesa/escudo, energia, velocidade, crítico, skills, traits e economia. Uma relíquia pode aparecer em múltiplos filtros. Telas abrangidas: coleção, lojas, bolsa, treino, escolha inicial de relíquia customizada e ofertas de nós/eventos. Continuidade de rolagem validada em seleção no treino e filtros em EN/PT-BR.

### Sequência de trabalho sugerida

Sugestão de organização, sujeita à decisão de Carlos: desafios/Desafio Final → combate/animações/efeitos → fim de run/histórico/lore. Estrategista, cosméticos e economia podem ser planejados em conjunto. Esta sequência não é autorização de implementação.


## 21. Publicação v65 — cartas R3 e dez efeitos físicos aprovados (20/11/2026)

- Fonte publicada: `b0e45f183d384eb946038363c4b4f5e7dc1d250a`, Sites v65. A v64 continha a revisão das cartas salva sem publicação; foi incluída integralmente na v65.
- Raridades: 24 personagens conforme `review-inputs/cards-r3/raridades.json`; sem mudanças de combate nos personagens comuns. `dist/card-rarities-r3.js` aplica os valores finais após construir bosses/heróis. Preços por raridade mantidos em 10/15/20/25 diamantes.
- Heróis: 17 perfis de `herois.json` aplicados exclusivamente a `hero_*`, todos custo 4/Ultra, com carga, defesa, intervalo, movimento e crítico próprios. `ratings` preservadas. Grand Oracle usa skillScale 3,946; Fairy Queen, 2,256; textos mostram valores arredondados (~630%/32% e 23%/23%). First Wayfarer carta usa cleave (180% no alvo, 90% em inimigos até 70 dele); boss permanece light.
- Todos os templates de boss, formas II, definições e multiplicadores de mapa/boss permanecem idênticos à v63.
- Dez efeitos publicados: corte básico descendente A01 v002; A02 pesado e circular; A03 estocada; A04 impacto leve; A05 impacto pesado circular; A06 impacto de chão; A07 crítico; A08 cruzado e combo duplo. Arquivos originais aprovados em `dist/assets/vfx/grand-journey/`; proveniência em SOURCES.json; integração em `dist/physical-vfx.js` e `dist/game-9.js`.
- Reprodução acompanha o relógio do combate, pausa e velocidades ×1/×1,5/×2/×3. A01–A07 começam no frame de contato (3), pois o engine gera o evento no dano; frames de preparação permanecem nos atlas originais. Nenhum dano foi atrasado ou criado para acomodar arte. OmnaMusha reproduz segmentos separados nos dois acertos reais e omite o segundo se ele não acontecer. Berserker usa um efeito duplo para dois golpes simultâneos. Fighter permanece com impactos desarmados.
- Combo de três passagens, famílias B em diante e demais habilidades específicas continuam pendentes; dez efeitos aprovados não concluem toda a frente de VFX. Logo Grand Union continua registrada como fornecida, com aplicação nas telas pendente.
- Validação: testes de efeitos compararam estado/resultados de combate com e sem os visuais nas quatro velocidades; testes R3, skills, Ranger, progressão, exportação e menus passaram. Conferência visual em EN 360×640 e PT-BR 430×768, seis aliados na rodada 4 e múltiplos efeitos.
