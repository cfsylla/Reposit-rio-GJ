# Grand Journey — Projeto e mecânicas atuais

Versão 27 · revisão documental de 25/10/2026 · Criador e Game Designer: Carlos Felipe Sylla

Este documento substitui integralmente o documento de mecânicas 0.1. Descreve a implementação publicada da versão 27, incluindo Blackfang e a primeira mecânica de rota, implementadas em um mapa. Três atos ficam planejados para depois de validar todos os sistemas. É a referência consolidada para continuar o projeto; decisões novas devem atualizar este arquivo em vez de manter regras contraditórias em versões antigas.

## 1. Identidade e entrega

Grand Journey é um jogo de estratégia roguelite para um jogador, com combate automático e 55 personagens cadastrados: 38 inicialmente visíveis e 17 Blackfang ocultos até derrotar o Boss da ordem. A concepção é de experiência single-player; a entrega atual é uma aplicação web estática hospedada, sem servidor de regras de combate. A referência de combate é Rift Wars; a estrutura de caminhos também se inspira em Slay the Spire. A estratégia está na escolha de cartas, posicionamento e sinergias.

Entrega atual: https://grand-journey.soundbat256.chatgpt.site — versão de jogo v27. Atualizações usam esse mesmo endereço, sem exigir download de um novo HTML. O site tem acesso restrito ao criador e aos quatro convidados de playtest já autorizados; preservar a audiência ao publicar.

Código, estilos e mídia são arquivos separados. O carregamento inicial requer acesso à rede e ao site; não há implementação de instalação/PWA ou garantia de funcionamento offline. O save é local ao navegador/aparelho e origem: não há sincronização de perfil entre dispositivos. Para migrar da v14 em arquivo para o site, exportar o JSON e importar em Profile → Import save.

Orientação principal: celular na vertical. Personagens em pixel art no combate e nas posições de preparo; artes anime nos menus e nas informações. Cenários, cartas e interface seguem fantasia ilustrada em azul-marinho e dourado.

Inglês é o idioma padrão. Menu → Language permite trocar para Português (Brasil), mantendo a preferência no navegador. A documentação de desenvolvimento permanece em português.

## 2. Jornada

- Dez baralhos emprestados de 20 cartas: oito personagens por deck; os quatro primeiros têm três cópias e os quatro seguintes, duas. Perfil novo começa somente com Vanguarda da passagem; Primeiros passos libera Encontro de caminhos e Ventos do acaso. Os outros sete seguem os desbloqueios da seção 16.
- Cada run tem 15 camadas, nove confrontos obrigatórios no caminho, incluindo o chefe na camada 15, e seis encontros de desenvolvimento.
- Camadas de combate: 1, 3, 5, 6, 8, 10, 11, 13 e 15. As outras camadas oferecem desenvolvimento.
- Eventos podem iniciar confrontos adicionais, sem consumir uma das nove batalhas do caminho.
- O mapa inteiro fica visível. Nós mostram ícones, sem nomes; há legenda acessível no cabeçalho. As conexões determinam quais opções estão acessíveis.
- O mapa possui 41 nós: início e chefe únicos; três opções nas camadas intermediárias. Caminhos seguem sua faixa e podem mudar para uma faixa adjacente em conexões distribuídas pelo percurso. Não é possível saltar livremente entre todos os nós.
- Nós disponíveis: confronto comum, elite, chefe, recrutamento, upgrade, evento, loja e relíquia.
- Perder qualquer confronto encerra a run. Há fusão temporária dentro do confronto, separada dos upgrades que duram a run; ver seção 4. A progressão permanente de perfil, catálogo e coleção é descrita na seção 16; os itens temporários da run não se transferem.
- Meta de duração: cerca de dez minutos; ainda depende de medir partidas reais, velocidade escolhida e tempo nas decisões.

## 3. Confrontos, rodadas e energia

Confrontos comuns e elites terminam quando um lado vence três rodadas. Boss exige quatro vitórias de rodada de qualquer lado; 3:3 continua. Rodada é uma fase de preparação seguida de batalha automática. Empates não pontuam e podem prolongar o confronto. Não há limite fixo de rodadas.

| Rodada | Máximo de unidades por lado | Energia recebida |
| --- | --- | --- |
| 1 | 2 | 5 |
| 2 | 3 | 4 |
| 3 | 4 | 5 |
| 4 | 5 | 6 |
| 5 | 6 | 7 |
| 6 em diante | 6 | Número da rodada + 2 |

Os valores acima são a renda-base, antes de relíquias. Quick Start concede +2 somente na primeira preparação de cada confronto; Everlasting Spark concede +1 em todas as preparações, inclusive a primeira. Ambas podem coexistir, resultando em 8 na primeira e 5, 6, 7… nas seguintes. A renda-base após a primeira rodada é número da rodada + 2. Jogador e inimigo calculam seus próprios bônus.

Saldo novo = saldo restante + energia recebida. Não há teto para o saldo. Cada novo confronto reinicia a energia: saldo zero antes do primeiro ganho de 5. As regras são iguais para jogador e IA.

No preparo, comprar apenas o necessário para completar uma mão de até quatro cartas; cartas preservadas pelo congelamento ocupam vagas. Durante o preparo, Refresh Hand custa uma energia: descarta toda a mão e compra até quatro cartas. Pode repetir enquanto houver energia e mão não vazia; respeita pilhas, reembaralhamento e cartas vinculadas ao campo. O jogador pode posicionar, mover, trocar e retirar unidades durante a preparação, sem cronômetro nessa etapa. Há banco pago de seis casas: não combate nem contribui para traits. Mover/trocar unidades já pagas entre campo e banco é gratuito, respeitando a capacidade de campo da rodada. O campo de cada equipe tem 15 casas, em cinco colunas e três linhas. A posição de cada casa corresponde à posição inicial usada pela simulação.

A composição e posição do inimigo são ocultas até começar a batalha. Depois do início, o jogador acompanha: pode pausar, consultar informações e alternar entre ×1, ×2 e ×3, mas não jogar cartas nem comandar unidades.

O alvo básico é o inimigo mais próximo. Skills podem usar regras próprias de alvo, como puxar o mais distante ou resgatar o aliado com menor percentual de vida. Provocação tem prioridade enquanto durar.

Aos 40 segundos de jogo, o dano passa a ×5. Aos 120 segundos, empate. O relógio acompanha a aceleração. Eliminação de um lado concede a rodada ao sobrevivente; eliminação simultânea empata. Danos e curas do mesmo passo são resolvidos em conjunto.

Entre rodadas, todas as unidades vinculadas, incluindo derrotadas, voltam com vida cheia. Formação, banco e fusões permanecem. Zonas, escudos, controles e efeitos temporários recomeçam; a carga volta ao valor inicial de cada skill (Cavalier começa cheio). A Ampulheta pode conceder 50% de carga inicial a outro aliado elegível. Entre confrontos, campo, banco, fusões, mão, congelamento e energia recomeçam; as cartas originais, ouro, upgrades e relíquias permanecem na run.

## 4. Cartas, banco, congelamento e fusão

### Ciclo e limite de cópias

- Carta paga no campo ou banco fica vinculada e sai das pilhas de compra/descarte. Derrota temporária não devolve a carta à mão.
- Fim da rodada descarta a mão não congelada. Ao acabar a compra, reembaralhar o descarte e continuar até completar quatro cartas, se houver cartas disponíveis.
- Máximo de quatro cópias físicas do mesmo personagem no baralho da run ou customizado, somando níveis e constituintes de fusão. Não há outro limite global de tamanho durante a run.
- Recrutamentos e compras criam cópias independentes. Upgrades e sacrifícios afetam a cópia escolhida.
- Retirar uma unidade devolve sua carta ao descarte e reembolsa metade do custo de energia, arredondada para baixo.
- Card Cycle mostra total da run, compra, descarte, mão e cartas vinculadas, incluindo as três cartas de cada fusão.

### Banco e interação

Banco de seis casas, separado da reserva de relíquias. Colocar carta da mão no banco paga seu custo inteiro, como no campo. Transferências e trocas de unidades já pagas são gratuitas. Apenas unidades no campo lutam e contam traits. Uma fusão ocupa uma casa e uma vaga de formação.

Toque seleciona e toque no destino posiciona. Arrastar também posiciona/transfere/troca; movimento maior que 10 px inicia o arraste. Segurar parado por cerca de 450 ms consulta informações. Cancelamento ou destino inválido não cobra energia. A cópia visual nasce na posição da carta, preserva o ponto de pega e não voa do canto da tela. No toque, a mira fica acima da carta arrastada e centralizada nela; realce e soltura usam a mesma coordenada. Prévia de traits aparece na seleção e no arraste, inclusive banco → campo, e é restaurada ao cancelar.

### Congelamento da mão

Alternância gratuita disponível somente no preparo. Mantém para a próxima rodada as cartas restantes na mão; comprar apenas as vagas até quatro. Ao entrar no próximo preparo, o congelamento é desativado e precisa ser escolhido novamente. Um confronto novo limpa a opção. Mão e controle não aparecem durante combate; o modelo também rejeita alternância nessa fase. Cartas congeladas usam borda azul e floco de neve. Refresh Hand continua custando uma energia e descarta/repõe a mão.

### Fusão temporária

A terceira cópia paga do mesmo personagem funde automaticamente com duas cópias já pagas no campo e/ou banco. Não basta possuir três no deck ou na mão. Não é preciso haver uma casa livre para pagar a terceira e concluir a fusão. Existe um único patamar; uma fusão não se funde novamente.

A unidade resultante permanece na posição da cópia de campo paga há mais tempo; se todas estavam no banco, usa a posição da mais antiga do banco. As três cartas conservam identidade e upgrades individuais e ficam vinculadas à fusão, fora da compra/descarte. Não são consumidas da coleção.

Calcular a média dos atributos já melhorados das três cópias. Vida, ataque, defesa e poder da skill recebem ×1,75. Frequência usa a média de ataques por segundo, convertida de volta ao intervalo; movimento, crítico, alcance e limite do gatilho não recebem bônus extra de fusão. Bônus de formação e relíquias seguem o cálculo normal de atributos. O dano final de skill pode combinar ataque e poder de habilidade.

Fusão persiste entre rodadas e no save do confronto. Ao retirar, devolver as três cartas ao descarte e reembolsar a soma de `floor(custo individual / 2)`. Ao começar outro confronto, desfazer fusões e reutilizar as três cartas originais com seus próprios upgrades. Outline dourado e efeito de convergência identificam a fusão; respeitar redução de movimento.

A IA também paga, usa banco, funde e rearranja sua formação; não ganha a terceira cópia gratuitamente.

## 5. Atributos e upgrades

Os 17 personagens Blackfang e suas fichas completas estão na seção 22. Notas de 1 a 5 indicam o perfil relativo, não o valor numérico em combate. A tabela abaixo registra os valores-base implementados, antes de upgrades, sinergias, relíquias e modificadores do inimigo.

| Personagem | Energia | Vida | Ataque | Defesa | Ataques/s | Movimento/s | Crítico | Alcance | Área básica |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Warrior | 2 | 290 | 27 | 26 | 0.93 | 49 | 7% | Corpo a corpo | Alvo único |
| Lancer | 2 | 230 | 27 | 26 | 0.93 | 60 | 7% | Curto | Área pequena |
| Bastion | 3 | 360 | 20 | 52 | 0.61 | 30 | 3% | Corpo a corpo | Alvo único |
| Shinobi | 3 | 180 | 35 | 8 | 1.47 | 74 | 25% | Corpo a corpo | Alvo único |
| Kinoichi | 3 | 180 | 27 | 16 | 1.16 | 74 | 18% | Curto | Área pequena |
| Samurai | 3 | 290 | 35 | 38 | 0.74 | 49 | 12% | Corpo a corpo | Alvo único |
| OmnaMusha | 3 | 230 | 27 | 26 | 1.47 | 60 | 18% | Corpo a corpo | Alvo único |
| Ronin | 3 | 230 | 45 | 16 | 0.74 | 49 | 25% | Corpo a corpo | Alvo único |
| Fighter | 2 | 290 | 27 | 16 | 1.47 | 60 | 12% | Corpo a corpo | Alvo único |
| Martial Artist | 2 | 230 | 27 | 26 | 1.16 | 60 | 7% | Curto | Área pequena |
| Shaolin | 3 | 290 | 20 | 38 | 0.93 | 49 | 3% | Corpo a corpo | Alvo único |
| Cowboy | 2 | 230 | 27 | 16 | 1.16 | 49 | 25% | Médio | Alvo único |
| Gunner | 3 | 180 | 35 | 8 | 0.93 | 49 | 18% | Longo | Alvo único |
| Miner | 2 | 290 | 35 | 16 | 0.74 | 39 | 7% | Curto | Área pequena |
| Pirate Captain | 4 | 290 | 27 | 26 | 0.93 | 49 | 12% | Médio | Alvo único |
| Pirate | 2 | 230 | 27 | 16 | 1.16 | 60 | 18% | Corpo a corpo | Alvo único |
| Cannoneer | 4 | 290 | 45 | 26 | 0.61 | 30 | 3% | Longo | Área média |
| Ranger | 2 | 230 | 27 | 16 | 0.93 | 60 | 12% | Médio | Alvo único |
| Archer | 2 | 180 | 20 | 8 | 1.47 | 60 | 12% | Longo | Alvo único |
| Crossbowman | 3 | 230 | 45 | 26 | 0.61 | 39 | 18% | Longo | Alvo único |
| Mage | 4 | 180 | 27 | 8 | 0.74 | 39 | 3% | Médio | Área pequena |
| Sorceress | 4 | 180 | 20 | 8 | 0.93 | 49 | 7% | Médio | Alvo único |
| Sage | 3 | 230 | 14 | 26 | 0.74 | 30 | 3% | Médio | Alvo único |
| Priestess | 4 | 180 | 20 | 16 | 0.93 | 49 | 3% | Médio | Alvo único |
| Cavalier | 4 | 360 | 35 | 38 | 0.74 | 74 | 7% | Curto | Alvo único |
| Musketeer | 3 | 230 | 45 | 26 | 0.61 | 39 | 12% | Longo | Alvo único |
| Swordsman | 3 | 290 | 45 | 16 | 0.74 | 49 | 12% | Curto | Alvo único |
| Duelist | 3 | 230 | 27 | 16 | 1.47 | 60 | 25% | Corpo a corpo | Alvo único |
| Viking | 3 | 290 | 35 | 26 | 0.74 | 49 | 12% | Corpo a corpo | Alvo único |
| Shieldmaiden | 3 | 290 | 20 | 38 | 0.93 | 49 | 7% | Corpo a corpo | Alvo único |
| Shaman | 4 | 230 | 20 | 16 | 0.93 | 49 | 3% | Médio | Alvo único |
| Berserker | 3 | 290 | 35 | 8 | 1.16 | 60 | 12% | Corpo a corpo | Alvo único |
| Huntress | 3 | 230 | 35 | 16 | 0.93 | 60 | 18% | Médio | Alvo único |
| Glutton | 3 | 360 | 27 | 26 | 0.61 | 30 | 3% | Corpo a corpo | Alvo único |
| Bear Druid | 4 | 360 | 35 | 38 | 0.74 | 49 | 7% | Curto | Alvo único |
| Eagle Druid | 3 | 180 | 27 | 8 | 1.16 | 74 | 18% | Corpo a corpo | Alvo único |
| Pirate Admiral | 4 | 360 | 45 | 38 | 0.61 | 30 | 7% | Curto | Alvo único |
| Shackled Pirate | 2 | 290 | 35 | 16 | 0.74 | 39 | 7% | Curto | Alvo único |

### Perfis relativos cadastrados

| Personagem | Vida | Ataque | Defesa | Vel. ataque | Movimento | Crítico | Skill |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Warrior | 4 | 3 | 3 | 3 | 3 | 2 | 3 |
| Lancer | 3 | 3 | 3 | 3 | 4 | 2 | 3 |
| Bastion | 5 | 2 | 5 | 1 | 1 | 1 | 4 |
| Shinobi | 2 | 4 | 1 | 5 | 5 | 5 | 4 |
| Kinoichi | 2 | 3 | 2 | 4 | 5 | 4 | 4 |
| Samurai | 4 | 4 | 4 | 2 | 3 | 3 | 4 |
| OmnaMusha | 3 | 3 | 3 | 5 | 4 | 4 | 3 |
| Ronin | 3 | 5 | 2 | 2 | 3 | 5 | 4 |
| Fighter | 4 | 3 | 2 | 5 | 4 | 3 | 3 |
| Martial Artist | 3 | 3 | 3 | 4 | 4 | 2 | 4 |
| Shaolin | 4 | 2 | 4 | 3 | 3 | 1 | 4 |
| Cowboy | 3 | 3 | 2 | 4 | 3 | 5 | 3 |
| Gunner | 2 | 4 | 1 | 3 | 3 | 4 | 3 |
| Miner | 4 | 4 | 2 | 2 | 2 | 2 | 3 |
| Pirate Captain | 4 | 3 | 3 | 3 | 3 | 3 | 5 |
| Pirate | 3 | 3 | 2 | 4 | 4 | 4 | 3 |
| Cannoneer | 4 | 5 | 3 | 1 | 1 | 1 | 4 |
| Ranger | 3 | 3 | 2 | 3 | 4 | 3 | 4 |
| Archer | 2 | 2 | 1 | 5 | 4 | 3 | 3 |
| Crossbowman | 3 | 5 | 3 | 1 | 2 | 4 | 3 |
| Mage | 2 | 3 | 1 | 2 | 2 | 1 | 5 |
| Sorceress | 2 | 2 | 1 | 3 | 3 | 2 | 5 |
| Sage | 3 | 1 | 3 | 2 | 1 | 1 | 5 |
| Priestess | 2 | 2 | 2 | 3 | 3 | 1 | 5 |
| Cavalier | 4 | 4 | 4 | 2 | 5 | 2 | 4 |
| Musketeer | 2 | 5 | 3 | 1 | 2 | 3 | 4 |
| Swordsman | 3 | 5 | 2 | 2 | 3 | 3 | 4 |
| Duelist | 2 | 3 | 2 | 5 | 4 | 5 | 4 |
| Viking | 3 | 4 | 3 | 2 | 3 | 3 | 4 |
| Shieldmaiden | 3 | 2 | 4 | 3 | 3 | 2 | 4 |
| Shaman | 2 | 2 | 2 | 3 | 3 | 1 | 4 |
| Berserker | 3 | 4 | 1 | 4 | 4 | 3 | 4 |
| Huntress | 2 | 4 | 2 | 3 | 4 | 4 | 4 |
| Glutton | 4 | 3 | 3 | 1 | 1 | 1 | 4 |
| Bear Druid | 4 | 4 | 4 | 2 | 3 | 2 | 4 |
| Eagle Druid | 1 | 3 | 1 | 4 | 5 | 4 | 4 |
| Pirate Admiral | 4 | 5 | 4 | 1 | 1 | 2 | 4 |
| Shackled Pirate | 3 | 4 | 2 | 2 | 2 | 2 | 4 |

Defesa: multiplicar dano por `100 / (100 + defesa efetiva)`. Crítico básico: ×1,5. Chance crítica limitada a 75%. Reduções adicionais são aplicadas depois da defesa, com teto combinado de 65%. Penetração reduz a defesa efetiva antes da fórmula. Escudos absorvem dano antes da vida.

Alcances lógicos: corpo a corpo 34, curto 62, médio 145 e longo 180. Ronin é corpo a corpo. Área básica pequena: raio 35; média: raio 65. Skills usam seus próprios raios e formatos.

Cada cópia recebe até dois upgrades: nível 1 = +10% total sobre a base; nível 2 = +25% total sobre a base. Não é +15% sobre o primeiro upgrade. Vida, ataque, defesa, movimento, crítico e frequência de ataques recebem o multiplicador. Intervalo entre ataques divide por 1,10 ou 1,25. Todos os níveis preservam o custo-base de energia do personagem, conforme a v21. Upgrades não reduzem custo; isso também vale para pagamento de cartas que completam fusão.

Poder escalável da habilidade também recebe o multiplicador do upgrade. Assim, uma skill que depende do ataque usa o ataque já melhorado e seu multiplicador de poder; a soma final de dano pode crescer mais que 25%. Durações, cargas, alcance, área, quantidade de alvos e regras fixas não crescem automaticamente. A nota de skill não é multiplicada novamente no cálculo.

## 6. Traits

Cada personagem tem três traits. Apenas IDs distintos na formação contam: duas cópias de Warrior contam como um Warrior. Dois personagens diferentes ativam o primeiro patamar; três ativam o segundo. Quatro a seis mantêm o segundo patamar. Todas as cópias com aquele trait recebem o bônus.

As sinergias são calculadas no início da rodada e permanecem até o fim, mesmo com mortes. Bônus locais e zonas das novas skills seguem suas próprias condições. Mão e descarte não contribuem.

| Trait | Efeito com 2 / 3 personagens distintos |
| --- | --- |
| Atacante | Ataque +12% / +24% |
| Defensor | Vida +15% / +30% |
| Atirador | Velocidade de ataque +12% / +24% |
| Arcano | Poder de habilidade +20% / +40% |
| Ágil | Movimento +20% / +40% |
| Disciplinado | Dano recebido −8% / −16% |
| Aventureiro | Ataque e vida +6% / +12% |
| Guardião | Regeneração de vida 0,6% / 1,2% por segundo |

| Personagem | Traits |
| --- | --- |
| Warrior | Atacante · Defensor · Disciplinado |
| Lancer | Atacante · Defensor · Ágil |
| Bastion | Defensor · Guardião · Disciplinado |
| Shinobi | Atacante · Ágil · Disciplinado |
| Kinoichi | Atacante · Ágil · Aventureiro |
| Samurai | Atacante · Defensor · Disciplinado |
| OmnaMusha | Atacante · Ágil · Disciplinado |
| Ronin | Atacante · Disciplinado · Aventureiro |
| Fighter | Atacante · Ágil · Disciplinado |
| Martial Artist | Atacante · Ágil · Guardião |
| Shaolin | Defensor · Guardião · Disciplinado |
| Cowboy | Atirador · Atacante · Aventureiro |
| Gunner | Atirador · Ágil · Aventureiro |
| Miner | Atirador · Defensor · Aventureiro |
| Pirate Captain | Atacante · Guardião · Aventureiro |
| Pirate | Atacante · Ágil · Aventureiro |
| Cannoneer | Atirador · Defensor · Aventureiro |
| Ranger | Atirador · Disciplinado · Guardião |
| Archer | Atirador · Ágil · Aventureiro |
| Crossbowman | Atirador · Atacante · Disciplinado |
| Mage | Arcano · Atacante · Disciplinado |
| Sorceress | Arcano · Ágil · Aventureiro |
| Sage | Arcano · Guardião · Disciplinado |
| Priestess | Arcano · Guardião · Aventureiro |
| Cavalier | Atacante · Defensor · Disciplinado |
| Musketeer | Atirador · Defensor · Disciplinado |
| Swordsman | Atacante · Ágil · Aventureiro |
| Duelist | Atacante · Ágil · Disciplinado |
| Viking | Atacante · Defensor · Aventureiro |
| Shieldmaiden | Defensor · Guardião · Aventureiro |
| Shaman | Arcano · Guardião · Aventureiro |
| Berserker | Atacante · Ágil · Aventureiro |
| Huntress | Atirador · Ágil · Aventureiro |
| Glutton | Defensor · Guardião · Aventureiro |
| Bear Druid | Arcano · Defensor · Guardião |
| Eagle Druid | Arcano · Ágil · Aventureiro |
| Pirate Admiral | Atacante · Defensor · Aventureiro |
| Shackled Pirate | Atacante · Guardião · Aventureiro |

## 7. Skills atuais

Cada personagem possui uma ativa ou passiva, com gatilho individual. A tabela registra `Game.SKILL_TRIGGERS` da v25. Ataques contam uma vez por básico, mesmo com vários alvos. Impactos recebidos incluem básicos e skills, mesmo bloqueados; dano contínuo pode excluir contagem, mas não há esse caso atribuído ao roster atual. Tempo usa segundos da simulação e continua durante atordoamento; executar a skill aguarda disponibilidade de ação. Gatilho de dano conta dano básico efetivamente aplicado à vida e escudos, excluindo excesso e dano da própria skill, e usa ataque no início da rodada × o fator indicado. Danos simultâneos são atribuídos proporcionalmente. A carga é consumida na ativação e reinicia em cada rodada. Passivas usam a condição indicada.

| Personagem | Habilidade cadastrada | Tipo / ativação | Funcionamento implementado |
| --- | --- | --- | --- |
| Warrior | Golpe circular | 5 ataques básicos | Gira a espada e acerta todos os inimigos próximos. Mantém a habilidade atual como referência de dano em área. |
| Lancer | Investida da aurora | 5 ataques básicos | Avança em linha curta até o alvo, perfurando inimigos no trajeto. O alvo final é empurrado para trás. |
| Bastion | Aqui ninguém passa | 6 impactos recebidos | Bate o escudo, afasta inimigos próximos e provoca os atingidos por 2 segundos, fazendo-os priorizar Bastion. |
| Shinobi | Passo das sombras | 6 s de combate | Teletransporta-se para trás do alvo atual e desfere um golpe. Se o espaço estiver ocupado, usa o ponto livre mais próximo. |
| Kinoichi | Corrente da lua | 7 s de combate | Lança a corrente no inimigo mais distante dentro do alcance da skill e o puxa para perto, interrompendo sua ação atual. |
| Samurai | Corte do horizonte | Dano básico = ataque inicial × 4.5 | Atravessa o alvo em uma arrancada reta, cortando os inimigos no percurso e terminando logo depois dele. |
| OmnaMusha | Dança das lâminas | 5 ataques básicos | Desloca-se para uma lateral livre do alvo, corta e cruza para a outra lateral com um segundo corte. Não atravessa a arena inteira. |
| Ronin | Passo do contra-ataque | 3 impactos recebidos | Após resolver o terceiro impacto recebido, dá um passo lateral e contra-ataca o agressor se estiver ao alcance. O passo não anula o dano recebido. |
| Fighter | Combo ascendente | 5 ataques básicos | Desfere dois socos no alvo e termina com um golpe que o empurra. Avança até a nova posição para manter a pressão. |
| Martial Artist | Varredura do dragão | 4 impactos recebidos | Gira o bastão em um arco frontal, atingindo e afastando os inimigos acertados. Depois recua um passo para recuperar distância. |
| Shaolin | Postura serena | Passiva: bloqueia cada 4º básico recebido | Bloqueia completamente o quarto ataque básico. Mantém a habilidade atual; dano de skill e efeitos contínuos não entram na contagem. |
| Cowboy | Bala ricocheteante | 5 ataques básicos | Atira no alvo atual e faz a bala ricochetear em até dois outros inimigos próximos. Cada inimigo pode ser atingido uma única vez. |
| Gunner | Disparo de recuo | 4 impactos recebidos | Recua um trecho curto na direção oposta ao alvo enquanto dispara um tiro potente. Se estiver junto à borda, busca espaço lateral. |
| Miner | Pavio curto | 7 s de combate | Arremessa dinamite na posição atual do alvo. Após 1 segundo ela explode, causando dano em área e empurrando inimigos para fora do centro. |
| Pirate Captain | Bandeira de abordagem | 8 s de combate | Crava uma bandeira em sua posição. Por 4 segundos, aliados dentro da área recebem velocidade de ataque e proteção contra deslocamentos forçados. |
| Pirate | Gancho de abordagem | 5 ataques básicos | Prende o gancho no alvo atual, puxa o próprio corpo até ele e golpeia. Se já estiver corpo a corpo, passa para um flanco livre antes do golpe. |
| Cannoneer | Tiro de dispersão | Dano básico = ataque inicial × 4.5 | Dispara uma bala explosiva no alvo atual. A explosão atinge uma área e arremessa os atingidos para longe do ponto de impacto. |
| Ranger | Armadilha de caçador | 6 s de combate | Coloca uma armadilha no chão à sua frente. O primeiro inimigo que entrar nela recebe dano e fica imobilizado por 1,5 segundo; a armadilha dura até 5 segundos. |
| Archer | Chuva persistente | 6 ataques básicos | Marca uma área na posição atual do alvo. Flechas caem em três ondas durante 2 segundos; inimigos podem entrar ou sair da zona. |
| Crossbowman | Virote de contenção | Dano básico = ataque inicial × 4 | Dispara um virote que atravessa os inimigos em linha. O primeiro atingido fica imobilizado por 1 segundo; os demais recebem o dano. |
| Mage | Orbes astrais | 7 s de combate | Invoca três orbes que orbitam ao seu redor. Cada um dos próximos três ataques básicos lança um orbe no alvo, causando uma pequena explosão no impacto. Os orbes não recarregam a própria skill. |
| Sorceress | Vórtice esmeralda | 8 s de combate | Abre um vórtice na posição atual do alvo. Durante 1,5 segundo, ele puxa gradualmente inimigos próximos para o centro e então explode. |
| Sage | Resgate arcano | 7 s de combate | Teletransporta o outro aliado com menor percentual de vida para um ponto livre na retaguarda e concede um escudo temporário. Se estiver sozinho, recebe apenas o escudo. |
| Priestess | Santuário de luz | 8 s de combate | Cria uma área sagrada em sua posição por 4 segundos. Aliados dentro dela recebem pequenas curas periódicas; na criação, remove um efeito negativo de cada aliado na área. |
| Cavalier | Royal Charge | 6 ataques básicos; começa com carga cheia | Investe no inimigo mais próximo, substituindo o básico de contato por 180% do ataque e atordoando por 1 s. Começa carregado e repete após seis básicos. Controle pode interromper a investida. |
| Musketeer | Armorbreaker Shot | 4 ataques básicos | Shoot the current target for 220% attack, ignoring 50% defense. Remain in position. |
| Swordsman | Sundering Slash | Dano básico = ataque inicial × 4 | Slash a 90-degree cone over a range of 85, dealing 170% attack and reducing defense by 20% for 3 seconds. Repeated effects refresh duration. |
| Duelist | Perfect Riposte | 5 ataques básicos | Take a defensive stance for 2 seconds. Block the next basic attack and counter for 180% attack if the attacker is within melee range. Skills are not blocked. |
| Viking | Battle Fury | Passiva: vida ≤50% | Attack 30% faster while at or below 50% health. The bonus ends when health rises above 50%. |
| Shieldmaiden | Stand Together | 5 impactos recebidos | Shield yourself and the other ally with the lowest health percentage within 100 range for 15% of your maximum health for 4 seconds. Repeated shields keep the larger amount and refresh duration. |
| Shaman | Ancestral Totem | 8 s de combate | Place a totem at your position for 5 seconds. Allies within 85 range attack 15% faster and recover 1% of their maximum health each second. One totem per caster; bonuses do not stack. Totems cannot be attacked and use no unit slot. |
| Berserker | Bloodied Axes | Dano básico = ataque inicial × 4 | Strike the current target twice for 90% attack each. Recover 25% of the actual health damage dealt by these strikes; shields and excess damage do not count. |
| Huntress | Marked Prey | 5 ataques básicos | Throw a spear for 150% attack and mark the target for 4 seconds. The target takes 15% more damage from allied basic attacks. Repeated marks refresh duration without stacking. |
| Glutton | Snack Break | 6 impactos recebidos | Recover 20% of your maximum health, up to full health. |
| Bear Druid | Ursine Roar | 5 impactos recebidos | Reduce the attack of enemies within 85 range by 20% for 3 seconds and take 15% less damage for 3 seconds. Repeated effects refresh duration; total damage reduction is capped at 65%. |
| Eagle Druid | Skyfall | 6 s de combate | Leap to the farthest enemy within 180 range and deal 170% attack in a radius of 35 on landing. Land in the nearest free space and remain there. You can take damage during the leap. |
| Pirate Admiral | Deckbreaker | 6 impactos recebidos | Slam the ground at the current target, dealing 200% attack within 65 range of impact and stunning enemies for 1 second. |
| Shackled Pirate | Chain Sweep | 4 impactos recebidos | Swing the chain around yourself, dealing 150% attack within 65 range and slowing enemy movement by 30% for 3 seconds. Repeated slows refresh duration without stacking. |


### Regras de movimento e controle

- Puxões, empurrões, recuos e avanços são limitados ao campo. Buscar posição livre próxima ao destino; encurtar ou cancelar o deslocamento se necessário.
- Movimentos rápidos têm interpolação curta; teleporte é imediato com sinalização visual. Nenhum desses movimentos concede invulnerabilidade por padrão.
- Atordoamento impede movimento e ataques, pausando o cooldown básico. Imobilização impede caminhar, mas permite atacar um alvo que já esteja ao alcance.
- Bandeira do Capitão protege aliados na área contra deslocamentos forçados; não bloqueia dano. Bônus de várias bandeiras usa o maior, sem somar.
- Rain, trap, dynamite, vortex, banner e sanctuary possuem duração e área próprias, visíveis no campo. Áreas permanecem ancoradas no ponto em que foram criadas.
- A armadilha é acionada pelo primeiro inimigo na área e desaparece. A chuva tem três pulsos. A dinamite explode após um segundo. O vórtice puxa gradualmente e explode ao terminar.
- Sanctuary remove um efeito negativo de cada aliado na área ao ser criado e cura periodicamente enquanto o aliado estiver dentro.
- Resgate do Sage concede escudo temporário; se estiver sozinho, concede apenas o escudo a si. Skills de cura não ressuscitam.
- Shaolin mantém o bloqueio de cada quarto ataque básico dirigido a ele. Ronin conta impactos recebidos (básicos ou skills, inclusive bloqueados) e só contra-ataca em alcance corpo a corpo.
- As antigas passivas de Bastion, Miner, Ranger, Crossbowman, Sage e Pirate Captain foram substituídas. Não continuam aplicadas em paralelo às novas skills.

## 8. Baralhos iniciais e IA

Cada deck novo possui oito personagens e 20 cartas. Os quatro primeiros abaixo têm três cópias cada; os quatro seguintes, duas. A ordem prioriza os retratos principais e depois o roster. Prévia, desbloqueio pela coleção e início da run usam essas multiplicidades reais. Runs antigas preservam suas cartas; não reconstruir o deck salvo.

| Baralho | Três cópias de cada | Duas cópias de cada |
| --- | --- | --- |
| Vanguarda da passagem | Warrior, Bastion, Lancer, Samurai | Ronin, Fighter, Sage, Archer |
| Encontro de caminhos | Warrior, Cowboy, Mage, Priestess | Fighter, Kinoichi, Ranger, Bastion |
| Ventos do acaso | Shinobi, OmnaMusha, Martial Artist, Kinoichi | Gunner, Pirate, Archer, Shaolin |
| Pacto dos guardiões | Sorceress, Bastion, Priestess, Mage | Sage, Lancer, Shaolin, Crossbowman |
| Companhia da estrada | Pirate Captain, Cannoneer, Gunner, Pirate | Cowboy, Miner, Ranger, Warrior |
| Fortaleza viva | Bastion, Shaolin, Warrior, Lancer | Samurai, Sage, Priestess, Ranger |
| Dança das lâminas | Shinobi, Kinoichi, OmnaMusha, Ronin | Samurai, Fighter, Martial Artist, Pirate |
| Linha de fogo | Cowboy, Gunner, Miner, Cannoneer | Crossbowman, Ranger, Archer, Bastion |
| Círculo astral | Mage, Sorceress, Sage, Priestess | Bastion, Shaolin, Warrior, Samurai |
| Companhia corsária | Pirate Captain, Pirate, Cannoneer, Cowboy | Gunner, Miner, Kinoichi, Martial Artist |

Encontros comuns usam composições variáveis, também com oito tipos e distribuição 3/3/3/3/2/2/2/2. Elites e Boss sorteiam entre dez decks emprestados e quatro temáticos inimigos. A heurística considera custo, traits nos patamares 2/3, diversidade, linha de frente, cópias já pagas e oportunidade de fusão. A IA compra e paga energia, ocupa banco, funde e transfere/troca para usar a formação paga mais forte, sem ler a formação oculta do jogador.

Progressão usa batalhas obrigatórias, não extras de evento. Elites sem Boss: nenhum upgrade antes da quarta; depois, tipos sorteados recebem nível 1 e os demais ficam em 0. O código sorteia `max(1, floor(pool.length/3))` tipos: em decks de oito, são dois tipos. Inimigos comuns: primeiros quatro tipos em nível 1 nas batalhas 4–6; todos em nível 1 nas 7–8; na nona, primeiros dois em nível 2 e os demais em 1. O Boss do fim do percurso usa essa última configuração. Vida/ataque recebem escala de etapa entre 86% e 102%. Bônus de evento +5% afeta somente os tipos em `boostedTypes`, inclusive frequência/poder de skill, sem ampliar área/alcance; não é bônus universal de elite. O sorteio comum parte de um pool de dez antes de recortar oito; eventuais tipos sorteados fora dos oito não são unidades adicionais.

### Decks temáticos inimigos

Exclusivos do pool de elites/Bosses; não são novos decks emprestados. Cada linha usa 20 cartas na distribuição acima.

| Deck inimigo | Estratégia | Três cópias de cada | Duas cópias de cada |
| --- | --- | --- | --- |
| Dawnward Expedition | vanguard | Cavalier, Musketeer, Swordsman, Duelist | Warrior, Lancer, Bastion, Ranger |
| Frostborn Warband | fortress | Viking, Shieldmaiden, Shaman, Berserker | Huntress, Glutton, Fighter, Warrior |
| Verdant Circle | arcane | Bear Druid, Eagle Druid, Ranger, Archer | Crossbowman, Sorceress, Priestess, Bastion |
| Seasalt Boarding Party | outlaws | Pirate Admiral, Shackled Pirate, Pirate Captain, Pirate | Cannoneer, Gunner, Cowboy, Miner |

Não representam as ordens de campanha. Blackfang possui três forças exclusivas e Boss condicional, detalhados na seção 22.

### Relíquias de elites

Uma vez por confronto elite, executar N testes independentes de 33%, onde N é a quantidade de oportunidades de relíquia acessíveis nas decisões anteriores da run. Cada sucesso tenta acrescentar uma relíquia; mínimo de uma mesmo com zero sucessos, respeitando o encaixe em 16 células. Novo elite = novo sorteio. Manter as relíquias durante todas as rodadas daquele confronto e no salvamento.

Uma oportunidade pode vir de um nó direto de relíquia ou evento viável que ofereça relíquia. Conta no máximo uma por decisão/camada, mesmo quando o jogador escolheu outra opção disponível. Caminhos inacessíveis e loja isolada não contam. Filtrar relíquias incompatíveis com a composição, excluir Merchant's Coin e Lucky Charm, impedir duplicatas e aceitar somente peças que caibam em uma Bag 4×4. O número de sucessos não permite ultrapassar essa capacidade. Inimigos comuns não recebem relíquias.

Relíquias inimigas ficam disponíveis para consulta após a primeira revelação do adversário. Abrir informações durante a luta pausa a batalha; fechar retoma somente se ela não estava pausada manualmente.

## 9. Economia

Ouro inicial: zero. Vitórias obrigatórias pagam 10 nas batalhas 1–3, 12 nas 4–6 e 14 nas 7–8: total de 94 antes do chefe, excluindo eventos e gastos. Chefe encerra a run e concede o bônus de diamantes e os desbloqueios permanentes descritos na seção 16.

| Item/serviço | Ouro |
| --- | --- |
| Carta de energia 2 / 3 / 4 | 8 / 12 / 16 |
| Upgrade de nível 0 para 1 na loja | 12 |
| Upgrade de nível 1 para 2 na loja | 20 |
| Remover uma cópia na loja | 8 |
| Relíquias | 30 / 35 / 40 conforme tabela |

Lucky Charm aumenta recompensas positivas de ouro em 20%, arredondadas para o inteiro mais próximo. Inclui vitórias, eventos e o bônus de deck completamente descoberto; não afeta diamantes, reembolsos nem custos. Os valores-base dos eventos permanecem os indicados antes de relíquias.

Merchant's Coin reduz preços de cartas, relíquias e serviços em 15% por cópia, com teto de 30%. Arredondar preço final para cima. Não remover a última carta do baralho.

## 10. Vinte relíquias e capacidade

Todas as relíquias têm efeito, raridade e formato independentes. Somente relíquias encaixadas na Bag confirmada ficam disponíveis para combate. A relíquia inicial do deck também ocupa espaço. Há reserva sem efeito; apenas as peças encaixadas ficam ativas. Não há bônus por posição/proximidade. Regras completas da Bag na seção 18.

Relíquia já carregada é excluída de novas ofertas e recompensas, incluindo a inicial e uma candidata pendente. Se for descartada, entregue ou perdida, volta a ser elegível. Coleção permanente e lista da run continuam independentes. Duplicatas antigas são preservadas na migração; não são geradas novas.

Preços abaixo são em ouro na loja da run, antes de desconto. Na loja permanente, C/U/R/UR custam respectivamente 10/15/20/25 diamantes.

| Relíquia | Raridade | Formato | Células | Ouro | Efeito |
| --- | --- | --- | ---: | ---: | --- |
| Estandarte antigo | C | L curto | 3 | 30 | Todos os aliados têm +8% de ataque. |
| Pedra vital | C | 1×2 | 2 | 30 | Todos os aliados têm +10% de vida. |
| Lente do viajante | C | 1×2 | 2 | 30 | Atiradores ganham +15% de ataque. |
| Tomo das estrelas | R | T | 4 | 35 | Arcanos ganham +25% de poder de habilidade. |
| Botas do vento | U | L curto | 3 | 30 | Ágeis ganham +20% de movimento e +10% de velocidade de ataque. |
| Selo de proteção | C | L curto | 3 | 30 | Defensores recebem 10% menos dano. |
| Medalhão da precisão | U | 1×1 | 1 | 35 | Todos os aliados: +5 pontos percentuais de chance crítica. Até +20 pontos por esta relíquia. |
| Ampulheta de combate | UR | P | 5 | 40 | Uma unidade aliada aleatória elegível começa cada rodada com 50% da carga da skill; contagens inteiras arredondam para baixo. Cavalier e passivas não são elegíveis. Não acumula. |
| Broche da recuperação | R | 2×2 | 4 | 40 | Todos os aliados vivos recuperam 1% da vida máxima a cada 3 segundos. Até 3% por pulso. |
| Moeda do mercador | U | 1×3 | 3 | 35 | Cartas e relíquias na loja custam 15% menos. Desconto máximo de 30%; preço arredondado para cima. |
| Quick Start | U | 1×3 | 3 | 30 | Receba 2 de energia extra na primeira preparação de cada confronto. |
| Everlasting Spark | UR | L longo | 5 | 40 | Receba 1 de energia extra em toda preparação, incluindo a primeira. |
| Lucky Charm | C | 1×2 | 2 | 30 | Receba 20% mais ouro da run em recompensas. Não afeta diamantes ou reembolsos. |
| Reinforced Plating | U | 2×2 | 4 | 30 | Todos os aliados recebem 5% menos dano. |
| Last Stand | UR | T | 4 | 40 | Uma vez por rodada, o primeiro aliado a receber dano letal sobrevive com 1 de vida. |
| Repulsion Seal | R | S | 4 | 35 | Uma vez por rodada, o primeiro aliado a cruzar 15% de vida empurra inimigos próximos. |
| Vampiric Fang | R | L médio | 4 | 35 | Ataques básicos curam o atacante em 5% do dano causado à vida. |
| Executioner’s Mark | U | L curto | 3 | 30 | Cause 15% mais dano a inimigos abaixo de 30% de vida. |
| Vengeful Ember | R | T | 4 | 35 | Cada aliado derrotado concede aos sobreviventes 5% mais dano de ataque nesta rodada, até 15%. |
| Opening Bell | C | 1×3 | 3 | 30 | Todos os aliados atacam 15% mais rápido nos primeiros 5 segundos de cada rodada. |

Distribuição: seis comuns, seis incomuns, cinco raras e três ultra raras. Raridade não concede bônus automático ao efeito.

Last Stand e Repulsion Seal são limitados a uma ativação **por equipe por rodada**, não uma por personagem. Last Stand atua após somar dano/cura do passo; em letais simultâneos, a primeira unidade na ordem da formação recebe a proteção. Repulsion Seal exige atravessar de acima de 15% para 15% ou menos e sobreviver; atinge inimigos em raio 90 com empurrão de 55 unidades, respeitando limites e proteção contra deslocamento. A sobrevivência por Last Stand pode acionar a repulsão.

Vampiric Fang cura apenas por dano de ataques básicos efetivamente aplicado à vida: escudos e excesso além da vida restante não geram cura. Skills e zonas não ativam roubo de vida. A cura participa do mesmo passo de resolução e não ressuscita derrotados de passos anteriores.

Executioner’s Mark considera a vida do alvo ao gerar cada golpe e afeta básicos e skills. Vengeful Ember conta mortes reais na equipe, até três, e aumenta o dano derivado dos ataques dos sobreviventes; não altera a snapshot de traits. Opening Bell usa segundos da simulação e deixa de acelerar ataques aos 5 segundos. Flags, bônus de mortes e duração reiniciam a cada rodada. Todos esses efeitos também funcionam para inimigos que carreguem a relíquia.

Reinforced Plating multiplica a parcela de dano restante por 0,95; a redução combinada adicional à defesa continua limitada a 65%. Precision, Recovery, Hourglass e desconto conservam os tetos antigos somente para compatibilidade com duplicatas herdadas.

## 11. Dezesseis eventos

Cada evento possui narrativa curta, ilustração própria, oportunidade em dourado, risco em coral e custo destacado. A ação é opcional; é possível recusar antes de pagar. Seleções de cartas e relíquias usam janelas visuais internas, sem listas nativas do celular. O jogo valida recursos e elegibilidade antes de resolver.

Confrontos de evento comuns/elites usam a disputa até três vitórias de rodada. Derrota encerra a run. A recompensa é apenas a indicada no evento; não acumula o pagamento comum das batalhas do caminho. Eventos sem recursos necessários ficam fora do sorteio. Priorizar eventos ainda não vistos.

### Cofre amaldiçoado

Entre as raízes de uma capela abandonada, um cofre pulsa com uma luz violeta. A fechadura se abre ao seu toque, mas as sombras nas paredes parecem escolher quem ficará para trás.

- Oportunidade: 55% de receber uma relíquia.
- Risco/consequência: 45% de perder uma carta aleatória do baralho.

### Viajante aprisionado

Um viajante pede ajuda de dentro de uma jaula quebrada. Ele promete apresentar companheiros dispostos a seguir sua jornada, mas o silêncio da mata sugere que os carcereiros ainda estão por perto.

- Oportunidade: 70% de escolher um recruta entre três opções.
- Risco/consequência: 30% de perder uma carta aleatória durante o resgate.

### Altar da renovação

A espada sobre o altar se desfaz em pequenas luzes, e duas chamas despertam entre as ruínas. Uma inscrição avisa: para fortalecer os que continuam, alguém precisa encerrar sua jornada aqui.

- Oportunidade: Melhorar duas outras cartas distintas em um nível cada.
- Risco/consequência: O sacrifício é definitivo e acontece antes dos upgrades.
- Custo/compromisso: Sacrificar uma carta escolhida do baralho.

### Caravana desaparecida

As rodas de uma caravana desapareceram sob a lama, mas ainda há ouro espalhado entre os caixotes. Enquanto o grupo vasculha os destroços, pegadas recentes revelam que vocês talvez não sejam os primeiros a chegar.

- Oportunidade: 60% de ganhar 18 de ouro.
- Risco/consequência: 40% de perder 10 de ouro.

### Mercador encapuzado

Na encruzilhada, um mercador encapuzado oferece um embrulho que se move sozinho. Ele garante que o conteúdo ajudará a expedição — embora não diga se carrega um objeto antigo ou um contrato com um novo companheiro.

- Oportunidade: 60% de receber uma relíquia; 40% de receber um recruta aleatório.
- Risco/consequência: O pagamento é feito antes de descobrir o conteúdo; nenhum resultado fica sem recompensa.
- Custo/compromisso: Pagar 12 de ouro.

### Treinamento proibido

Um círculo de treino ainda brilha no pátio de um dojo abandonado. Quem entrar poderá aprender uma técnica esquecida, mas as armas partidas ao redor contam o destino de quem tentou avançar cedo demais.

- Oportunidade: 75% de melhorar a carta escolhida em um nível.
- Risco/consequência: 25% de perder a carta escolhida.
- Custo/compromisso: Escolher uma carta e pagar 10 de ouro.

### Santuário dos viajantes

Dois viajantes se aquecem sob as lanternas do santuário e perguntam se há lugar na expedição. A guardiã aceita apresentá-los, desde que vocês deixem uma relíquia para proteger os próximos peregrinos.

- Oportunidade: Recrutar dois personagens entre as ofertas apresentadas antes da troca.
- Risco/consequência: A relíquia entregue deixa a expedição.
- Custo/compromisso: Entregar uma relíquia escolhida.

### Forja instável

Uma forja esquecida volta a arder quando uma relíquia se aproxima da bigorna. O metal pode assumir uma nova forma, mas a chama azul oscila como se estivesse prestes a consumir tudo.

- Oportunidade: 70% de receber outra relíquia diferente.
- Risco/consequência: 30% de perder a relíquia entregue sem receber outra.
- Custo/compromisso: Entregar uma relíquia escolhida.

### Desafio do mestre

Um velho mestre bloqueia os degraus do templo com seu bastão. Ele oferece conhecimento e algumas moedas a quem superar sua prova; quem falhar terá de abandonar a expedição e permanecer como aprendiz.

- Oportunidade: 65% de melhorar a carta escolhida em um nível e ganhar 8 de ouro.
- Risco/consequência: 35% de perder a carta escolhida.
- Custo/compromisso: Escolher uma carta para enfrentar a prova.

### Mesa de apostas

Uma mesa no fundo da estalagem silencia quando o grupo se aproxima. O apostador empurra os dados e um punhado de moedas para o centro: uma única jogada decide quem paga a próxima viagem.

- Oportunidade: 55% de receber 30 de ouro após apostar: lucro líquido de 18.
- Risco/consequência: 45% de perder os 12 de ouro apostados.
- Custo/compromisso: Apostar 12 de ouro.

### Contrabandista

Entre os caixotes do cais, um contrabandista apresenta um combatente que procura uma saída da cidade. A fuga parece simples, até que a luz de uma patrulha começa a varrer a água.

- Oportunidade: 70% de escolher um recruta com upgrade 1.
- Risco/consequência: 30% de perder uma relíquia aleatória durante a fuga.

### Contrato de despedida

Na bifurcação, um companheiro recebe uma proposta para escoltar mercadores por outro caminho. A separação será amigável, e os contratantes oferecem uma compensação para que a expedição siga em frente.

- Oportunidade: Receber 20 de ouro garantidos.
- Risco/consequência: A carta escolhida será removida definitivamente do baralho.
- Custo/compromisso: Escolher uma carta para deixar a expedição.

### Tesouro vigiado

Uma relíquia repousa entre dois guardiões imóveis. Talvez seus encantamentos tenham se apagado há séculos; talvez estejam apenas esperando que alguém toque no pedestal.

- Oportunidade: 60% de receber uma relíquia imediatamente.
- Risco/consequência: 40% de iniciar um combate comum. A vitória concede a relíquia; a derrota encerra a run.

### Santuário profanado

Três relíquias pairam sobre um altar rachado, cercadas por fios de névoa violeta. Romper o selo pode libertar seus tesouros — ou despertar os protetores que a corrupção tornou ainda mais fortes.

- Oportunidade: 50% de escolher uma entre três relíquias imediatamente.
- Risco/consequência: 50% de iniciar um combate com um terço dos personagens inimigos com +5% nos atributos. Vencendo, escolha entre as mesmas três relíquias; perder encerra a run.

### Caravana sob ataque

Uma carroça bloqueia a ponte enquanto saqueadores cercam os viajantes. Alguns já procuram uma rota de fuga, mas, se o grupo oferecer ajuda, um deles promete seguir com vocês quando tudo terminar.

- Oportunidade: 40% de escolher um recruta imediatamente.
- Risco/consequência: 60% de iniciar um combate. A vitória concede a escolha do recruta e mais 10 de ouro; a derrota encerra a run.

### Câmara do campeão

No fim de um salão monumental, um campeão guarda uma relíquia e um cofre dourado. Às vezes ele reconhece o valor dos visitantes e permite sua passagem; hoje, sua mão ainda repousa sobre a arma.

- Oportunidade: 30% de receber uma relíquia e 20 de ouro imediatamente.
- Risco/consequência: 70% de enfrentar um elite com +5% nos atributos do subconjunto de tipos sorteados (dois nos decks atuais de oito) e suas relíquias sorteadas. Vencer concede a relíquia e os 20 de ouro; perder encerra a run.


No altar, as duas cópias escolhidas para upgrade devem ser distintas e diferentes da sacrificada. O sacrifício é aplicado primeiro. No santuário, ofertas de recrutas aparecem antes de entregar a relíquia. Recrutas respeitam máximo de quatro cópias físicas, incluindo constituintes de fusão. Escolhas de recompensa são concluídas antes de seguir viagem.

## 12. Interface, áudio e apresentação

- Tela START antes do menu. Fonte serifada igual à do título; toque produz confirmação original com três notas ascendentes e libera a música.
- Menu: JRPG Epic Rock Battle Theme #1, HydroGene, CC0. O preparo usa a música do confronto que será iniciado, inclusive a trilha de Boss; não usa música de menu/mapa.
- Chefe: Determination, HydroGene, CC0.
- Confrontos comuns/elites: Hope, MintoDog, CC0. Mapa: It is dangerous to be lonely without a sword, Ragnar Random, CC0.
- Volume de música e efeitos ajustáveis e persistidos separadamente. Música transita entre cenas; pausar ou ocultar o jogo suspende o áudio da batalha.
- Cabeçalho fixo no menu, seleção de decks e mapa; conteúdo central pode rolar. Combate/preparo encaixam arena, mão, sinergias e controles na tela.
- Botão Fullscreen substitui o antigo ?. Guia disponível em Menu → How to Play. A disponibilidade de tela cheia depende do suporte do navegador.
- Menu principal sorteia três artes anime: personagem central maior e dois menores atrás. Não usar sprite pixel como substituto nessa composição.
- Cartas compactas: custo, retrato, nome, seis atributos numéricos sobre ícones discretos, alcance, área e três traits reduzidos. Skill fica na janela de detalhes.
- Janelas de personagem se ajustam à altura útil da tela, mantendo setas e Back visíveis. A descrição tem bloco menor, de duas a três linhas conforme a altura, e rolagem interna quando necessário. Setas para navegar entre personagens do elenco, cartas na prévia de deck e cópias do baralho durante a run. Prévia também permite navegar entre os dez decks.
- Na preparação, selecionar ou arrastar carta mostra projeção de traits sem gastar energia, além de alcance e área sobre o campo. Duplicata não aumenta contagem.
- No combate, sinergias ativas ficam visíveis. Não exibir a contagem textual dos dois exércitos nem as regras de 40/120 segundos no HUD.
- Canvas usa resolução interna proporcional à densidade de pixels do aparelho, até DPR 3, mantendo coordenadas lógicas 430×540. Sprites e máscara vermelha são desenhados a partir das imagens originais; o cenário usa amostragem suave.
- Efeitos distintos para corte, tiro, flecha, golpe, magia, explosão, cura, proteção, teleporte e deslocamento. São 25 atlas compactos, com fallback se a imagem não carregou; não alteram a simulação nem seu sorteio. Números de dano continuam visíveis, com flash vermelho. Removidas as setas verdes genéricas de anúncios de skill/status positivo; nome da skill, carga e efeitos pertinentes permanecem. Zonas e trajetos ficam visíveis.
- Créditos incluem Carlos Felipe Sylla como Creator & Game Designer e os autores/licenças dos assets.

## 13. Código e continuidade

A fonte publicada fica no repositório do Site, com diretório estático `dist/`: `index.html`, `style.css`, `game-0.js` a `game-10.js`, `tutorial-flow.js`, `vfx-data.js` e mídia em `assets/`. Regras, progressão, interface, idiomas, narrativas e assets estão distribuídos nesses arquivos. A pasta de desenvolvimento antiga pode conter scripts auxiliares, mas a fonte executada pelo site é a versão publicada no repositório.

Versão de conteúdo/interface: v27. Perfil schema 1; estado de run e `gameVersion` de save: 20, mantidos desde a v20 porque as revisões posteriores não exigiram novo schema. Não confundir esses números com a numeração de versões de hospedagem. Elenco de 55 personagens e 22 cenários; os 17 Blackfang ficam ocultos até a primeira vitória contra o Boss da ordem. Migrações e persistência na seção 17.

Só atualizar/publicar quando o criador solicitar explicitamente. Feedback isolado deve ser reunido antes de nova entrega. Manter o mesmo endereço e os acessos existentes. Não enviar ZIP. Gerar documentação consolidada quando solicitada; manter este documento como base de continuidade. Testes para o criador devem ser breves e escritos na conversa.

## 14. Validação e próximos ajustes

Limite: dez execuções de teste por atualização, incluindo tentativas que falharem. Sem amostragem estatística massiva. Validar com casos pequenos e determinísticos; se precisar ultrapassar o limite, consultar o criador antes.

Esta revisão é documental: comparação da base v17 com o código e os changelogs até v25. O commit conferido corresponde à última versão salva e à implantação concluída. Não houve mudança nem publicação do jogo nesta tarefa. As tabelas de atributos, traits, gatilhos e composições foram confrontadas com os dados atuais.

Os registros de desenvolvimento incluem testes de fusão paga, banco, reembolsos, conservação das cartas, gatilhos, IA, arraste, congelamento, custo dos upgrades, Boss, efeitos e tutorial. A v25 registra recompensa guiada idempotente, encaixe real na bolsa e navegação. Isso registra validações anteriores; não significa que todas foram executadas novamente nesta revisão.

Ainda confirmar no Android: arraste/mira, toque longo sem cliques residuais, rolagem/saldo, etapas guiadas, áudio, downloads e continuidade de save no mesmo navegador. Testes em Chromium não comprovam comportamento físico no aparelho. Persistência continua no radar do playtest, sem causa confirmada para relatos anteriores de alternância de saves.

Números são valores de teste: avaliar ritmo, duração total, fusão, gatilhos por dano/tempo/impactos, suportes, economia, elites, Boss em quatro vitórias e Bag. Próximo bloco autorizado como direção de desenvolvimento: cartas Blackfang e mecânica de rota, conforme seção 22.

## 15. Fontes e licenças

- HydroGene, CC0: https://opengameart.org/content/jrpg-epic-rock-battle-theme-1
- HydroGene, CC0: https://opengameart.org/content/determination-anime-style-music
- Kenney: sons de interface/impacto/RPG e partículas, CC0.
- Tabasco: Gunshot Sounds, CC0.
- Nunito: Nunito Project Authors, SIL OFL 1.1.
- Lilita One: Juan Montoreano, SIL OFL 1.1.
- Spring Spring / Julie Damsgaard, som de fusão CC0: https://opengameart.org/content/power-up-sound-effects
- VFX: Kenney, Matt Walkden, Ansimuz/Luis Zuno e Cethiel; projéteis da compilação AntumDeluge/Dungeon Crawl Stone Soup. Créditos e fontes em `dist/assets/vfx/CREDITS.md`. Pixel Holy Effects (Sentient Dream Studio) e Cooked FX (The Cooked Works) usam licenças próprias; preservar os termos originais e não redistribuir como pacotes avulsos. São 25 atlas adaptados; assets visuais não criam mecânicas/status novos.
- Artes de personagens fornecidas pelo criador do projeto; cenários e ilustrações de eventos gerados para Grand Journey. Som START sintetizado originalmente para o projeto.

## 16. Progressão permanente

### Perfil, propriedade e persistência

Perfil novo começa com zero diamantes, coleção vazia e somente Vanguarda da passagem liberado. Primeiros passos libera Encontro de caminhos e Ventos do acaso ao concluir o tutorial ou vencer o primeiro confronto após pular. Esses dois decks não podem ser comprados antes do milestone. Os outros sete seguem suas condições; todos podem ser inspecionados. Perfis antigos mantêm acessos e recebem crédito de migração de Primeiros passos, sem mudança de posse da coleção.

São estados diferentes: item liberado para compra; cópia própria na coleção; acesso ao deck emprestado. Liberar um deck não concede seus itens à coleção. Milestone ou compra de acesso permite usar o conjunto emprestado completo sem possuir as cartas/relíquia. Completar a coleção do deck também libera seu acesso: as multiplicidades reais do deck (três de cada um dos quatro tipos principais e duas dos outros quatro) e a relíquia inicial própria. Esse teste não considera upgrades temporários.

Cartas são cópias individuais, sem conversão automática. Excedentes além de três permanecem na coleção; o limite de três continua sendo regra de composição do baralho durante a run. A posse permanente de uma relíquia é registrada uma vez; não se compra uma segunda cópia permanente nesta versão. Itens de run nunca viram itens próprios automaticamente. Relíquias próprias podem iniciar runs de decks customizados, implementados na v12.

O perfil guarda estatísticas, melhores nós concluídos por deck, milestones, catálogos, inventário, última abertura de booster e registros estruturados das runs. Cada registro inclui motivo de encerramento, nós concluídos, confrontos, deck/relíquias inimigas, placares, formação vencedora, eventos aceitos, gastos, composição final e recompensa de diamantes. A tela de consulta histórica será desenvolvida depois.

Abandonar encerra como derrota no ponto atual. Conta nas estatísticas de runs encerradas e derrotas, mas os milestones verificam condições próprias: por exemplo, três runs encerradas com ao menos cinco nós concluídos. Progresso parcial válido é preservado. Não existe recompensa por apenas iniciar ou abandonar sem concluir nós.

Perfil schema 1 e run versão 20; conteúdo v25. Profile → Export save / Import save permite transportar perfil e run em JSON, com confirmação antes de substituir. O carregamento compara snapshots válidos e versões, incluindo recuperação independente; ver seção 17. Não importar automaticamente v10 sem perfil. O arquivo v10 e sua chave antiga não são apagados. Idioma e volumes mantêm suas preferências.

### Diamantes e loja permanente

| Ação / item | Valor |
| --- | ---: |
| Cada dois nós concluídos | 1 diamante |
| Cada elite derrotado, inclusive em evento | +1 diamante |
| Derrotar Boss | +3 diamantes |
| Booster — preço inicial de todos | 7 diamantes |
| Carta ou relíquia comum | 10 diamantes |
| Carta ou relíquia incomum | 15 diamantes |
| Carta ou relíquia rara | 20 diamantes |
| Carta ou relíquia ultra rara | 25 diamantes |
| Acesso a um deck emprestado bloqueado | 25 diamantes |

Pagamento de diamantes ocorre uma única vez ao encerrar a run, por vitória, derrota ou abandono: `floor(nós concluídos / 2) + elites vencidos + 3 × bosses vencidos`. Entrar num nó sem concluí-lo não conta. Vencer um confronto do mapa já conclui o nó para fins de recompensa, mesmo antes de clicar para voltar ao mapa. Lutas de evento contam dentro de um único nó de evento. Visitar e sair de loja, recrutamento ou evento recusado conclui o respectivo nó do percurso; evento recusado não conta no milestone de eventos aceitos.

Ouro e diamantes não se convertem. Preço por raridade vale para a loja permanente. A loja temporária continua usando ouro e preços definidos pelo custo de energia das cartas, como descrito na seção 9.

### Raridades e facções

Raridade é independente de energia, stats, upgrades e traits. Não concede bônus numérico. Exibir C, U, R ou UR à direita da barra do nome nas cartas e na janela de informações; os símbolos de estrelas nas tabelas abaixo apenas identificam os quatro níveis na documentação.

| Raridade | Personagens |
| --- | --- |
| Comum C — 17 | Warrior, Lancer, Bastion, Fighter, Martial Artist, Cowboy, Gunner, Miner, Pirate, Cannoneer, Ranger, Archer, Crossbowman, Mage, Viking, Glutton, Shackled Pirate |
| Incomum U — 9 | Kinoichi, Samurai, OmnaMusha, Priestess, Musketeer, Swordsman, Shieldmaiden, Berserker, Huntress |
| Rara R — 9 | Shinobi, Ronin, Pirate Captain, Sorceress, Cavalier, Duelist, Shaman, Bear Druid, Eagle Druid |
| Ultra rara UR — 3 | Shaolin, Sage, Pirate Admiral |

| Facção | Personagens |
| --- | --- |
| Dawnward Order | Warrior, Lancer, Bastion, Cavalier, Musketeer, Swordsman, Duelist |
| Legends of the East | Shinobi, Kinoichi, Samurai, OmnaMusha, Ronin, Fighter, Martial Artist, Shaolin |
| Wild West | Cowboy, Gunner, Miner |
| Seasalt Crew | Pirate Captain, Pirate, Cannoneer, Pirate Admiral, Shackled Pirate |
| Verdant Covenant | Ranger, Archer, Crossbowman, Bear Druid, Eagle Druid |
| Arcane | Mage, Sorceress, Sage, Priestess |
| Frostborn Clans | Viking, Shieldmaiden, Shaman, Berserker, Huntress, Glutton |

Facção serve para identidade, filtros e composição de conteúdo. Não gera sinergia de combate e não substitui o campo interno `family`, utilizado por efeitos de armas. Personagens futuros podem integrar facções existentes ou novas.

A raridade das 20 relíquias está consolidada na seção 10.

### Relíquias iniciais emprestadas

Cada nova run começa com uma relíquia fixa vinculada ao deck, sem conceder sua posse permanente. A prévia apresenta a descrição e os requisitos de acesso.

| Deck | Relíquia inicial |
| --- | --- |
| Vanguarda da passagem | Estandarte antigo |
| Encontro de caminhos | Pedra vital |
| Ventos do acaso | Botas do vento |
| Pacto dos guardiões | Broche da recuperação |
| Companhia da estrada | Moeda do mercador |
| Fortaleza viva | Selo de proteção |
| Dança das lâminas | Medalhão da precisão |
| Linha de fogo | Lente do viajante |
| Círculo astral | Tomo das estrelas |
| Companhia corsária | Ampulheta de combate |

### Catálogo por vitória contra deck inimigo

Uma vitória contra elite faz uma única escolha por confronto: 50% de conceder +1 diamante adicional ao encerrar a run; 50% de seguir o fluxo de descoberta abaixo. Esse bônus é adicional à recompensa-base de +1 diamante por elite derrotado. Aplica-se também aos elites de evento. Bosses seguem diretamente o fluxo de descoberta, sem essa escolha 50/50. O pool inclui os dez decks emprestados e os quatro decks temáticos. Nenhuma dessas recompensas ocorre por rodada.

Enquanto houver cartas desse deck ainda bloqueadas na loja, testar primeiro a descoberta rara de relíquia. A chance é um terço da probabilidade final da raridade mais alta presente no deck, usando os pesos dos boosters normalizados entre raridades presentes. Se o teste não ocorrer ou falhar, sortear uma carta ainda bloqueada: raridade primeiro, personagem depois. Cartas já liberadas são excluídas. A descoberta só libera compra, sem conceder cópia própria.

Se todas as cartas do deck já estiverem liberadas para compra, garantir uma relíquia utilizada pelo inimigo que ainda esteja bloqueada para compra. Se todas as cartas e todas as relíquias que esse inimigo utilizou já estiverem liberadas, conceder +5 de ouro da run. A posse das quantidades exigidas continua sendo necessária apenas para desbloquear um deck pela coleção. Esta regra de recompensa usa catálogo liberado, conforme a decisão mais recente.

Relíquias descobertas também apenas liberam compra. A Moeda do mercador e Lucky Charm ficam excluídos das relíquias inimigas; ambos são liberados para compra pelo milestone de gastar 30 de ouro. Isso também se aplica retroativamente a perfis que já o concluíram. As outras nove relíquias novas podem aparecer no conjunto utilizado por elites/Bosses e ser descobertas pelas regras normais. O sorteio e a descoberta do confronto ficam registrados para impedir repetição ao recarregar.

### Boosters e cascata

Cada booster concede quatro cópias individuais, sorteadas independentemente. Pode repetir personagem dentro da abertura e entregar cartas ainda não liberadas para compra direta. Receber no booster não libera automaticamente a compra individual. Não há garantia de raridade nem conversão de repetidas nesta versão.

| Booster | Pool atual | Liberação |
| --- | --- | --- |
| First Horizons | Todos os 38 personagens | Inicial |
| Legends of the East | 8 personagens de Legends of the East | Três vitórias com três personagens distintos da facção na formação vencedora, na mesma run |
| Frontier & Free Seas | 10: Wild West + Seasalt Crew + Bear Druid e Eagle Druid | Vencer três decks inimigos diferentes |
| Oaths & Mysteries | 16: Dawnward Order + Verdant Covenant + Arcane | Derrotar Boss |
| Northern Blood | 6 personagens Frostborn Clans | Três vitórias com três personagens distintos Frostborn Clans na formação vencedora, na mesma run |

Boosters podem ter pools por facção, por várias facções ou qualquer seleção temática. Cada um tem preço próprio configurável, inicialmente sete diamantes. Conteúdo e chances de boosters bloqueados também podem ser consultados.

Para cada carta, a cascata testa ultra rara primeiro, depois rara, depois incomum; comum é o resultado restante. Os testes condicionais são calculados a partir das chances finais, para não reduzi-las por engano:

| Raridade | Chance final no First Horizons | Teste condicional |
| --- | ---: | ---: |
| Ultra rara | 2% | 2% |
| Rara | 10% | 10/98 ≈ 10,2040816% após falha acima |
| Incomum | 23% | 23/88 ≈ 26,1363636% após falhas acima |
| Comum | 65% | Garantida após as três falhas |

Em boosters sem determinada raridade, removê-la e normalizar os pesos restantes. Nunca sortear uma categoria sem personagens. Dentro da raridade, todos os personagens do pool têm chances iguais. Adicionar personagens comuns não altera a chance final das raridades superiores. A consulta mostra chances finais por raridade e por personagem, além das cópias próprias.

Após cada revelação, mostrar ×N abaixo da carta, incluindo cópias anteriores e as reveladas até então; duplicatas futuras ainda ocultas não são antecipadas pelo contador. O perfil registra as quatro de imediato, mas o contador visual acompanha a revelação.

Abertura: comprar e debitar diamantes uma vez; registrar as quatro cartas e a posse antes de animar; revelar uma por toque, com código de raridade, brilho e som, em tela única com frente e verso do mesmo tamanho. Fechar ou recarregar não refaz sorteios nem perde as cartas. O menu oferece retomar abertura ainda não finalizada.

### Milestones iniciais de teste

Todos são concedidos uma vez. Recompensas de relíquias abaixo liberam a compra e não entregam o item; recompensas de deck concedem acesso emprestado, sem itens próprios.

| Condição | Recompensas |
| --- | --- |
| Concluir o tutorial ou vencer o primeiro confronto após pular | Encontro de caminhos e Ventos do acaso (Primeiros passos) |
| Encerrar três runs com cinco nós concluídos ou mais | Companhia da estrada; compra da Pedra vital |
| Derrotar um elite | Dança das lâminas; compra do Medalhão da precisão |
| Aceitar e resolver três eventos na mesma run | Companhia corsária; compra da Ampulheta de combate |
| Gastar 30 de ouro na mesma run | Compra da Moeda do mercador e de Lucky Charm |
| Derrotar Boss | Pacto dos guardiões; compra do Broche da recuperação; booster Oaths & Mysteries |
| Vencer três confrontos sem perder rodadas, na mesma run | Fortaleza viva; compra do Selo de proteção |
| Vencer três confrontos com três Atiradores distintos na formação vencedora, na mesma run | Linha de fogo; compra da Lente do viajante |
| Vencer três confrontos com três Arcanos distintos na formação vencedora, na mesma run | Círculo astral; compra do Tomo das estrelas |
| Vencer três decks inimigos diferentes, acumulado no perfil | Compra do Estandarte antigo; booster Frontier & Free Seas |
| Vencer três confrontos com três personagens distintos Legends of the East na formação vencedora, na mesma run | Compra das Botas do vento; booster Legends of the East |
| Vencer três confrontos com três personagens distintos Frostborn Clans na formação vencedora, na mesma run | Booster Northern Blood |

Empates não são derrotas de rodada. Para composição vencedora, considerar personagens distintos presentes no campo na rodada que decide o confronto; a morte durante a simulação não retira a carta da formação. Ouro perdido num evento não é gasto; preços pagos em lojas, serviços e eventos contam. Visitar e recusar evento não conta como evento resolvido para o milestone. Confrontos de evento participam das condições de vitória, sem adicionar um segundo nó.

### Próximos blocos

Skill tree, monstros, novas facções inimigas, branches de Boss, tela de histórico/análise de runs e uso de excedentes permanecem para próximos blocos. A Relic Bag foi implementada na v14. Decks customizados foram implementados na v12. Nenhum bônus permanente de stats foi introduzido.


## 17. Decks customizados, interface e persistência

### Deck customizado

Entrada própria **Custom decks** no menu principal, independente de Shop, Collection, Profile e Milestones. Disponível desde o início, mas depende de itens próprios para compor um deck válido. Há dez espaços gratuitos. Cada espaço pode ter nome de até 32 caracteres e ser criado, editado, salvo ou excluído. Excluir pede confirmação e remove apenas a lista, nunca os itens da coleção.

É permitido salvar rascunho incompleto para continuar depois. Para iniciar uma run, exigir exatamente 20 cartas, no máximo quatro cópias por personagem e quantidade igual ou menor que a coleção possui. Exigir uma relíquia inicial própria. Não há limite de facção ou de raridade. Os mesmos itens podem constar de vários decks salvos: listas não reservam nem consomem a coleção.

O editor preserva a posição de rolagem ao adicionar ou remover cópias. Não mostra diamantes; o seletor de relíquia acompanha o conteúdo e não fica sobre as cartas. O editor mostra cartas próprias, contadores por personagem, controles de adicionar/remover, total /20, potencial de traits e seleção visual da relíquia. Consultar detalhes não adiciona a carta. Regras de cópias, posse, tamanho e relíquia são validadas também no modelo, não apenas nos botões.

Ao iniciar, criar uma cópia independente da lista e da relíquia para a run. Upgrades, recrutas, remoções e relíquias temporárias não alteram a lista salva nem a coleção. Editar ou excluir a lista posteriormente não altera uma run em andamento. Iniciar outra run pede confirmação e encerra a anterior como derrota, pagando o progresso concluído.

Decks customizados não são inseridos no pool de decks de elites. Os inimigos usam os dez decks estratégicos e os quatro decks temáticos exclusivos da v16.

### Navegação e apresentação

- Menus principais separados: decks emprestados, Custom decks, Collection, Shop, Milestones e Profile. Não mostrar atalhos cruzados Profile/Collection/Shop no topo dessas telas.
- A opção Characters foi removida; Collection também é catálogo e permite inspecionar personagens ainda não possuídos.
- Shop mostra somente a aba escolhida: Boosters, Cards ou Relics. Home e abas ocupam linhas próprias fora do scroll, sem saltos nem sobreposição. Cartas com compra ainda não liberada têm retratos cinzas. Falta de diamantes não é confundida com falta de descoberta.
- Collection oferece All/Owned/Not owned, combináveis com facção; inspecionar continua possível.
- Conferência do baralho mostra nome do deck e total de cartas, incluindo nomes personalizados.
- Menu geral contém Return to game, How to Play, Language, Audio, Credits, Abandon run quando aplicável e Main menu. Não contém View deck, View relics, Enemy relics, Journey, Collection ou Permanent shop. Consultas de baralho/relíquias continuam nos controles próprios do mapa e combate.
- Deck emprestado bloqueado tem container cinza, retratos dessaturados e cadeado maior; pode ser inspecionado normalmente.
- Compra ou uso indisponível mantém aparência bloqueada, mas o toque produz feedback visual, som de erro e motivo específico. Falta de diamantes informa quantos faltam. Não executar a ação bloqueada.
- Carta mostra upgrade à esquerda da barra do nome: uma seta para nível 1; duas setas sobrepostas e deslocadas para nível 2. Raridade à direita, fixa: C, U, R, UR, com cor da raridade. Sem estrelas ou caixas sobre o retrato.
- A descrição de trait abre sobre a janela do personagem, preservando personagem, navegação e estado; fechar a trait retorna à mesma janela.
- Detalhes do personagem ocupam a área útil da janela. Setas, atributos e Back ficam visíveis; o texto da habilidade pode rolar dentro de um bloco menor. A altura é consistente entre personagens, com adaptação para telas pequenas.
- Recrutamento usa cartas e botão Details separado da confirmação Recruit. A janela permite navegar entre candidatos.
- Removido o rótulo “Sua formação · 5 × 3” do preparo.
- Consulta de booster mostra cartas com chances e quantidades possuídas primeiro; tabela de chances por raridade ao final. Regras explicativas permanecem no guia, não nessa tela.
- Abertura do booster é uma tela própria sem navegação cruzada nem scroll vertical. Quatro posições 2×2; frente e verso têm a mesma dimensão e proporção 3:4. Mantida a animação de virada, respeitando redução de movimento. O botão Reveal/Back to shop permanece visível.

### Desbloqueios e milestones

Cada novo desbloqueio ganha registro estruturado persistente: tipo, item e momento. Abrir a janela não consome esse histórico. Ao encerrar uma run, por vitória, derrota ou abandono, mostrar automaticamente **Unlocks** quando houver itens novos. A lista inclui cartas e relíquias disponíveis para comprar, decks liberados e boosters liberados. Pode ser reaberta pelo resultado da run. Milestones têm tela própria e suas condições/recompensas podem ser consultadas repetidamente.

Na migração de perfil v11, reconstruir o histórico geral a partir dos catálogos e acessos já liberados, marcando os registros como anteriores à v12. Não inventar datas nem atribuição a runs antigas quando a v11 não guardou essa informação. A lista por run usa o início do histórico registrado na criação da run; para run v11 em andamento, acompanhar novas descobertas a partir da migração.

### Salvamento e compatibilidade

Perfil schema 1; estado de run versão 20. Importar estados v11 a v20 com perfil válido. Conteúdo v21–v25 mantém esse schema; não exigir estado versão 26. Preservar saldo, coleção, catálogos, decks, milestones, histórico e booster pendente. A v13 concedeu +100 diamantes uma vez por perfil para teste, com marcador v13TestDiamonds; a v14 mantém o saldo existente e não concede novo bônus. Perfil novo da v14 começa com zero diamantes.

Persistência: snapshots de perfil/run juntos, savedAt e gameVersion. Gravar chave estável grand-journey-save e cópia da versão grand-journey-save-v20, ambas com backup anterior válido. Ao iniciar, consultar também v13 a v19 e backups, priorizando a versão de jogo mais recente entre snapshots válidos e depois o timestamp. A recuperação independente em IndexedDB usa grand-journey-recovery, store saves, registro latest. Não carregar automaticamente uma versão anterior sobre uma v20 válida. A importação escolhida pelo usuário continua sendo uma substituição explícita após confirmação.

Uma aba desatualizada que encontre snapshot mais novo não sobrescreve o progresso silenciosamente; pede reabertura. Verificar a gravação local, salvar ao ocultar/sair e avisar de falha. A cópia no banco é tentada independentemente da gravação local. Não sobrescrever salvamentos existentes inválidos sem recuperação válida.

Ao encerrar uma run, por vitória, derrota ou abandono, registrar recompensas uma vez e solicitar download automático de JSON com data/hora no nome. O navegador pode bloquear esse download; mostrar indicação para conferir Downloads e manter Download save na tela final e Export save no perfil. O jogo não afirma que o sistema operacional concluiu o download. Arquivo exportado é backup independente: apagá-lo não apaga progresso do navegador. Trocar de arquivo/origem pode exigir importar esse backup.

Migrar a Bag preservando posições válidas e mantendo excedentes na reserva sem efeito. Recompensas pendentes exigem decisão explícita de aceitar ou recusar. Nada é apagado automaticamente do jogador. Batalha interrompida retorna ao preparo. Preservar banco, vínculos das três cartas de fusão, ordem de implantação e flag de mão congelada. Na migração, formar triplas já pagas sem alterar as cartas originais. Campos opcionais de tutorial/onboarding mantêm compatibilidade e isolamento de replay. IA antiga mantém apenas um conjunto único que caiba, sem novo sorteio.

**Persistência segue no radar do playtest externo.** O criador relatou alternância entre saves antigos e novos, inclusive reaparecimento de progresso antes considerado perdido. A causa no Android não foi confirmada. Verificar continuidade no mesmo arquivo, backup automático e restauração após importação. Testes em Chromium não comprovam resolução definitiva no aparelho.

## 18. Relic Bag — regras atuais

- Grade 4×4, 16 células, fixa durante a run. Expansão por skill tree permanece futura.
- Peças conectadas, com rotação em passos de 90 graus, sem espelhamento. Raridade e forma são atributos separados.
- Relíquia inicial ocupa espaço e começa encaixada. Custom usa a relíquia própria escolhida como inicial.
- Apenas peças encaixadas na grade confirmada ficam ativas. A reserva guarda relíquias da run sem conceder efeitos e sem ocupar células.
- No mapa, preparo e demais decisões, o controle de relíquias abre a Bag. Durante o combate, permite consulta e pausa a simulação.
- Selecionar peça na lista ou grade; Rotate gira; Move retira da grade; tocar na grade posiciona o canto superior esquerdo do formato. Não sobrepor nem sair da grade.
- O jogador escolhe manualmente o que encaixar. Arrange continua disponível como ação explícita; obter uma relíquia não reorganiza automaticamente as peças atuais.
- Confirm bag valida as posições das peças encaixadas e mantém as demais na reserva. Cancel preserva a edição anteriormente confirmada.
- Descarte pede confirmação e afeta a edição até Confirm bag. Não remove a posse permanente.
- Receber relíquia abre a Bag com candidata pendente. Pode aceitá-la na reserva, encaixá-la ou recusá-la. Não é obrigatório descartar apenas por faltar espaço na grade.
- Na compra, o ouro só é debitado ao confirmar a aceitação, seja na grade ou na reserva. Recusar não cobra nem remove a oferta. A recompensa recusada não é concedida.
- Ofertas excluem relíquias na grade, reserva ou pendentes. Itens perdidos, entregues ou descartados voltam a ser elegíveis. Não gerar duplicatas novas.
- Eventos preservam recompensas e sorteios já resolvidos ao abrir a Bag. Perder/entregar relíquia procura também na reserva.
- Elites e Bosses usam encaixe automático em 4×4; somente o conjunto equipado participa do combate. Não usam reserva para conceder efeitos adicionais.
- Estado: `bag.items` guarda peças ativas com id, key, x, y, rotation; `artifacts` espelha seus IDs para efeitos. `reserve` guarda IDs inativos. `pendingRelic` guarda a oferta/recompensa em decisão.
- Na migração, preservar posições válidas e mandar itens excedentes/sem encaixe à reserva, sem apagar itens do jogador.

Formatos em orientação inicial, coordenadas (coluna, linha), origem no canto superior esquerdo:

| Formato | Células |
| --- | --- |
| 1×1 | (0,0) |
| 1×2 | (0,0), (1,0) |
| 1×3 | (0,0), (1,0), (2,0) |
| L curto | (0,0), (0,1), (1,1) |
| L médio | (0,0), (0,1), (0,2), (1,2) |
| L longo | (0,0), (0,1), (0,2), (0,3), (1,3) |
| T | (0,0), (1,0), (2,0), (1,1) |
| S | (1,0), (2,0), (0,1), (1,1) |
| 2×2 | (0,0), (1,0), (0,1), (1,1) |
| P | (0,0), (1,0), (0,1), (1,1), (0,2) |

Skill tree, criaturas independentes, segunda ordem, histórico analítico e consumo de excedentes continuam futuros. Não foram implementados bônus permanentes de atributos.


## 19. Relatórios de combate e consulta por toque longo

- Placar da rodada/confronto e botão de próxima rodada/continuação aparecem acima das tabelas. Removidos slogans e textos explicativos redundantes do resultado.
- Resultado contém quatro tabelas iguais em grade 2×2: dano causado e recebido por unidades do jogador; dano causado e recebido por unidades inimigas.
- Ordenar do maior para o menor. Cópias da mesma unidade aparecem separadas, com identificação própria; exibir nível quando aplicável.
- Contar dano efetivamente aplicado à vida, excluindo absorção por escudos e excesso além da vida restante.
- Rodadas intermediárias mostram dados da rodada; última mostra acumulado de todo o confronto, em vitória e derrota. O limiar real é três vitórias em comum/elite e quatro em Boss; 3:3 do Boss ainda usa relatório da rodada.
- Botão de próxima rodada ou continuação fica acima das tabelas. Tabelas têm rolagem interna; rolagem externa deve permitir alcançar o restante da tela.
- No preparo, View deck / Ver deck consulta as cartas reais da run; Card Cycle consulta as pilhas. Toque curto mantém seleção/posicionamento e arrastar é alternativa. Pressionar carta da mão ou unidade posicionada por cerca de 450 ms abre informações enquanto o dedo permanece pressionado.
- A janela aberta por toque longo é somente consulta: seus botões não recebem esse gesto. Soltar fecha e bloqueia o clique residual; não selecionar, posicionar ou comprar ao soltar.
- Ofertas de recrutamento mostram quantas cópias físicas do personagem existem na run, inclusive as três vinculadas a uma fusão; atualizar após aquisição. Isso vale para loja, nós, eventos, prévias e Hacks, sem substituir pelo total da coleção permanente.
- Na loja da run, cartão de recruta tem botão de informações e botão Comprar com preço. Tocar no restante do cartão não compra. Toque longo também consulta.
- Saldo da loja permanece no topo durante a rolagem de cartas e relíquias. Janelas de upgrade/remoção têm saldo próprio fixo no cabeçalho; compras atualizam o valor.

## 20. Cenários de batalha — regras mantidas desde a v17

22 imagens fornecidas pelo criador, convertidas para WebP para publicação. São visuais: **não há bônus de terreno nem alteração de colisão, atributos ou regras**.

Batalhas normais sorteiam entre todas as 22 imagens. Elites e Bosses sorteiam entre cenários compatíveis com o deck inimigo. O deck do jogador não determina o fundo. Um cenário pode pertencer a vários grupos.

Sortear uma vez por confronto, manter nas preparações e em todas as rodadas. Não repetir o cenário do confronto anterior da mesma run. Guardar cenário e número do confronto no save, preservando a escolha ao reabrir. Não se implementou sequência geográfica obrigatória nem alteração visual do mapa.

### Catálogo de cenários

| ID (final do arquivo original) | Descrição visual |
| --- | --- |
| 5203 | Praça de cidade celeste |
| 5206 | Vila oriental |
| 5205 | Montanhas envoltas em névoa |
| 5204 | Cidade do oeste |
| 5210 | Cidade medieval |
| 5209 | Exterior de castelo |
| 5211 | Planalto rochoso |
| 5216 | Convés de navio |
| 5215 | Caverna |
| 5214 | Campo aberto |
| 5217 | Clareira de floresta |
| 5261 | Salão de fortaleza |
| 5233 | Praia |
| 5220 | Convés com costa ao fundo |
| 5270 | Masmorra |
| 5341 | Porto |
| 5340 | Vila oriental noturna |
| 5333 | Floresta encantada |
| 5342 | Acampamento subterrâneo |
| 5349 | Mosteiro nas montanhas |
| 5350 | Observatório arcano |
| 5351 | Campo após um cerco |

### Vínculos atuais por deck inimigo

| Deck | Cenários elegíveis (IDs acima) |
| --- | --- |
| Dawnward Expedition | 5203, 5209, 5210, 5351 |
| Frostborn Warband | 5205, 5211, 5349, 5340 |
| Verdant Circle | 5217, 5333, 5214, 5205 |
| Seasalt Boarding Party | 5216, 5220, 5233, 5341 |
| Vanguarda da passagem | 5209, 5210, 5351, 5206 |
| Encontro de caminhos | 5214, 5210, 5209, 5217 |
| Ventos do acaso | 5206, 5349, 5217, 5340 |
| Pacto dos guardiões | 5350, 5203, 5261, 5333 |
| Companhia da estrada | 5204, 5341, 5216, 5233 |
| Fortaleza viva | 5209, 5261, 5351, 5210 |
| Dança das lâminas | 5206, 5340, 5349, 5211 |
| Linha de fogo | 5204, 5341, 5351, 5210 |
| Círculo astral | 5350, 5203, 5261, 5215 |
| Companhia corsária | 5216, 5220, 5233, 5341 |

Também existem grupos preparados para `blackfang` (5342, 5270, 5215, 5351), `second_order` (5333, 5203, 5217, 5209) e `creature` (5215, 5211, 5217, 5205, 5233). Esses vínculos são preparação técnica; não tornam as campanhas implementadas. As descrições do catálogo identificam as imagens e não são novos nomes oficiais mostrados ao jogador.

## 21. Ferramentas de playtest e New game

Hacks: +10 diamantes por acionamento; escolha de cartas para a run respeitando quatro cópias; escolha de relíquias para a run via Bag. Cartas/relíquias temporárias adicionadas não concedem posse permanente. Manipulação da run indisponível durante combate ativo.

New game pede confirmação e zera perfil, coleção, catálogos, decks customizados, progresso e run. Mantém preferências gerais de idioma/áudio. Registra limite de recuperação para impedir retorno de save anterior ao reset, substitui cópias de recuperação por um save limpo e solicita download desse backup. Download solicitado não garante gravação pelo Android; conferir Downloads. New game é diferente de iniciar outra expedição ou abandonar uma run.

## 22. Blackfang e rota — v26

Implementação aprovada em um único mapa. A expansão para três atos (três mapas, cada um com Boss, sendo o terceiro o Final Boss) fica futura. O desbloqueio Blackfang depende da vitória contra o Boss da ordem e não de encerrar a run.

### Rota e encontros

Nas camadas 5 e 10, a opção central é uma força elite Blackfang. As três faixas anteriores se conectam às opções dessa camada, permitindo enfrentar ou evitar a ordem. Sortear duas forças distintas entre Incursão Goblin, Vanguarda Brutal e Companhia Sombria. Cada baralho tem 20 cartas: quatro tipos com três cópias e quatro com duas. A composição inimiga só é revelada no combate.

Duas vitórias de confronto contra forças distintas elegem o Rei Goblin/Corte Blackfang para a camada 15. Zero ou uma vitória usa o Boss atual. Contar por ID do nó e da força; rodadas, derrotas e eventos não contam. Registrar rota, forças, escolha de Boss e cenário no save. Runs anteriores à v26 preservam o mapa e os encontros antigos.

Forças usam as regras atuais de elite; Boss exige quatro vitórias de rodada. A IA paga cartas, usa banco e fusão. O Boss prioriza colocar seu Rei, pagando normalmente. Rei, liteira e carregadores são uma única unidade; Goblin Montador e montaria também.

### Surpresa e obtenção

Antes da primeira vitória contra o Boss Blackfang, esconder os 17 personagens em Collection, loja permanente, boosters, recrutamentos, loja da run, custom decks, Hacks, navegação de fichas e sorteio das artes do menu. Não mostrar contador de cartas ocultas nem milestone antecipando o elenco. É permitida a inspeção de inimigos revelados durante o encontro.

Vencer o Boss libera o grupo da Collection e o booster Blackfang (7 diamantes, quatro cartas, probabilidades atuais por raridade). **Não conceder cópia da carta do Boss nem de qualquer outra carta.** Comprar individualmente continua dependendo da descoberta da carta pelas regras existentes. Os cinco boosters antigos preservam seus pools sem Blackfang; as cartas da ordem pertencem ao booster próprio.

Recrutamento, loja da run e Hacks recebem a elegibilidade no início da run, para aplicar a liberação a partir da próxima jornada. Elites anteriores ao desbloqueio não liberam compras de cartas ocultas; continuam recompensas de relíquia/ouro/diamante conforme as regras atuais. Vitória repetida não duplica o desbloqueio. New game volta a ocultar Blackfang.

### Personagens e valores-base

Nomes em português e inglês seguem as correções do criador. Raça e ordem são identidade; as três traits existentes geram as sinergias, sem bônus racial adicional. Todos seguem upgrades e fusão atuais.

| Personagem | Raça | Raridade | Energia | Vida | Ataque | Defesa | Ataques/s | Movimento | Crítico | Alcance | Traits |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Goblin Lanceiro | goblin | C | 2 | 180 | 27 | 8 | 1.16 | 60 | 12% | 62 | Atacante · Ágil · Aventureiro |
| Goblin Arqueiro | goblin | C | 2 | 180 | 20 | 8 | 1.16 | 60 | 12% | 180 | Atirador · Ágil · Aventureiro |
| Goblin Montador | goblin | I | 3 | 290 | 27 | 26 | 0.93 | 74 | 7% | 62 | Atacante · Defensor · Ágil |
| Goblin Bruto | goblin | I | 3 | 290 | 35 | 16 | 0.93 | 49 | 7% | 34 | Atacante · Defensor · Aventureiro |
| Goblin Bombardeiro | goblin | R | 3 | 180 | 35 | 8 | 0.61 | 60 | 12% | 145 | Atirador · Ágil · Aventureiro |
| Rei Goblin | goblin | UR | 4 | 360 | 20 | 26 | 0.74 | 30 | 3% | 145 | Defensor · Guardião · Aventureiro |
| Orc Guerreiro | orc | C | 3 | 290 | 27 | 38 | 0.74 | 39 | 7% | 34 | Atacante · Defensor · Disciplinado |
| Orc Berserker | orc | I | 3 | 290 | 35 | 16 | 1.16 | 60 | 12% | 34 | Atacante · Ágil · Aventureiro |
| Orc Lutadora | orc | I | 3 | 230 | 27 | 16 | 1.47 | 60 | 18% | 34 | Atacante · Ágil · Disciplinado |
| Troll da Caverna | troll | I | 3 | 360 | 35 | 16 | 0.74 | 49 | 7% | 62 | Atacante · Defensor · Guardião |
| Troll das Neves | troll | R | 4 | 290 | 20 | 26 | 0.74 | 39 | 3% | 145 | Arcano · Defensor · Guardião |
| Troll | troll | R | 4 | 360 | 45 | 38 | 0.61 | 30 | 3% | 62 | Defensor · Guardião · Aventureiro |
| Troll da Montanha | troll | R | 4 | 360 | 45 | 26 | 0.61 | 49 | 7% | 62 | Atacante · Defensor · Aventureiro |
| Nobre Elfo Sombrio | dark_elf | R | 3 | 230 | 35 | 16 | 1.16 | 60 | 25% | 34 | Atacante · Ágil · Disciplinado |
| Arqueiro Elfo Sombrio | dark_elf | I | 3 | 180 | 35 | 8 | 0.93 | 60 | 18% | 180 | Atirador · Ágil · Disciplinado |
| Guerreiro Elfo Sombrio | dark_elf | I | 3 | 290 | 35 | 38 | 0.74 | 49 | 12% | 62 | Atacante · Defensor · Disciplinado |
| Mago Elfo Sombrio | dark_elf | R | 4 | 180 | 27 | 8 | 0.74 | 39 | 7% | 145 | Arcano · Atacante · Disciplinado |

### Habilidades

| Personagem | Skill | Gatilho | Efeito |
|---|---|---|---|
| Goblin Lanceiro | Estocada traiçoeira | 5 attacks | Causa 160% do ataque ao alvo e recua 35 unidades. |
| Goblin Arqueiro | Flecha farpada | 6 attacks | Causa 140% do ataque e reduz o movimento do alvo em 30% por 3 segundos. |
| Goblin Montador | Atropelo | 6 attacks · começa carregado | Começa carregado. Avança pelo chão, causa 160% do ataque e empurra o alvo 45 unidades, acompanhando o avanço. Controle interrompe a investida. |
| Goblin Bruto | Pancada brutal | 5 received | Causa 170% do ataque ao alvo e atordoa por 0,8 segundo. |
| Goblin Bombardeiro | Bomba incendiária | 7 time | Após 1 segundo, a bomba explode por 150% do ataque em raio 55. Deixa fogo por 3 segundos, causando 20% do ataque por segundo. |
| Rei Goblin | Ordem do rei | 8 time | Aliados em raio 110, incluindo o rei, recebem +15% de ataque e velocidade de ataque por 4 segundos. Rei, liteira e carregadores são uma unidade. |
| Orc Guerreiro | Escudo de guerra | 5 received | Recebe escudo de 15% da própria vida máxima por 4 segundos e empurra o alvo em alcance curto 30 unidades. |
| Orc Berserker | Caçada sangrenta | 4 damage | Avança até o inimigo com menor percentual de vida em alcance 120 e golpeia por 180% do ataque. Sem candidato, usa o alvo atual. |
| Orc Lutadora | Lâminas cruzadas | 6 attacks | Dois cortes no alvo, cada um por 100% do ataque, ignorando 25% da defesa. |
| Troll da Caverna | Carne regenerativa | 0 passive | Após 3 segundos sem receber dano à vida, regenera 2% da vida máxima por segundo. Novo dano à vida interrompe a regeneração. |
| Troll das Neves | Proteção ancestral | 8 time | Cura a si e aliados em raio 85 em 8% da vida máxima de cada um e concede 10% de redução de dano por 3 segundos. |
| Troll | Queda da rocha | 6 received | Atinge o chão junto ao alvo por 180% do ataque em raio 65 e imobiliza por 1,2 segundo. |
| Troll da Montanha | Investida demolidora | 8 time | Avança até 120 unidades rumo ao alvo. Atinge cada inimigo no trajeto uma vez por 170% do ataque e o empurra 45 unidades. |
| Nobre Elfo Sombrio | Passo sombrio | 5 attacks | Teleporta para um espaço livre atrás do alvo e golpeia por 180% do ataque. Sem invulnerabilidade. |
| Arqueiro Elfo Sombrio | Flecha executora | 5 attacks | Atira no inimigo com menor percentual de vida em alcance 180 por 180% do ataque, ou 240% se estiver abaixo de 30% de vida. |
| Guerreiro Elfo Sombrio | Guarda punitiva | 5 received | Corta um cone de 90 graus e alcance 85 por 160% do ataque. Recebe 20% de redução de dano por 3 segundos. |
| Mago Elfo Sombrio | Grilhões arcanos | 8 time | Atinge uma área de raio 55 na posição do alvo por 150% do ataque e imobiliza por 1,5 segundo. |

### Baralhos

| Força | Três cópias de cada | Duas cópias de cada |
|---|---|---|
| Incursão Goblin | Goblin Lanceiro, Goblin Arqueiro, Goblin Montador, Goblin Bombardeiro | Goblin Bruto, Orc Guerreiro, Orc Lutadora, Troll das Neves |
| Vanguarda Brutal | Orc Guerreiro, Orc Berserker, Troll da Caverna, Troll | Goblin Bruto, Troll da Montanha, Troll das Neves, Goblin Bombardeiro |
| Companhia Sombria | Nobre Elfo Sombrio, Arqueiro Elfo Sombrio, Guerreiro Elfo Sombrio, Orc Lutadora | Mago Elfo Sombrio, Orc Guerreiro, Troll das Neves, Goblin Montador |
| Corte Blackfang | Rei Goblin, Orc Guerreiro, Goblin Bombardeiro, Guerreiro Elfo Sombrio | Troll da Montanha, Troll das Neves, Arqueiro Elfo Sombrio, Goblin Montador |

### Apresentação e cenários

Nós mostram marcador Blackfang e legenda de elite, sem prévia das cartas. Após a primeira vitória, exibir Blackfang 1/2; após a segunda, revelar o Boss. O brasão original não está entre os 51 assets recebidos nesta atualização: usar marcador heráldico provisório, sem tratá-lo como nova arte oficial.

Forças usam acampamento subterrâneo, masmorra, caverna e campo após um cerco. Boss também admite salão de fortaleza. Sortear uma vez por confronto, preservar em todas as rodadas e recargas, evitar repetição consecutiva. Sem bônus de terreno.

## 23. Estado consolidado e continuidade

Conteúdo v27. Um mapa de 15 camadas e nove confrontos. 55 personagens no motor (38 visíveis inicialmente + 17 Blackfang), sete facções de origem e o grupo Blackfang, dez decks emprestados, quatro temáticos inimigos anteriores, três forças Blackfang e seu Boss, dez espaços customizados, seis boosters (Blackfang oculto até liberar), 20 relíquias, 16 eventos e 22 cenários.

Compatibilidade mantida: perfil schema 1, run/gameVersion 20. Novos campos: profile.blackfangUnlocked, run.blackfangAvailable e run.campaignRoute (ato atual, forças e nós vencidos, Boss definido e vitória). Não converter runs anteriores em rotas Blackfang retroativamente.

Próximos blocos: validar Blackfang e rota no Android e balancear com playtest; segunda ordem e criaturas; depois expandir para três mapas/atos, cada um com Boss e o terceiro com Final Boss. Skill tree, bônus permanentes de atributos, histórico analítico, consumo de excedentes, sincronização e PWA/offline continuam futuros.

## 24. Tutorial e introdução ao menu — v25

### Primeiro confronto

Perfil novo inicia com Vanguarda da passagem. O primeiro confronto guiado tem mão inicial fixa e Warrior inimigo fixo. As etapas avançam por ações reais, protegem cliques/arrastes fora do objetivo e permitem pular. O fluxo percorre três rodadas para ensinar seleção/posicionamento, traits sem contagem de duplicatas, energia/capacidade, combate automático, carga de skills, velocidade, renda seguinte, banco pago e transferência gratuita.

Também ensina retirada com reembolso, Refresh Hand por uma energia, inspeção de stats/alcance/skill, View deck e Card Cycle. Exige arraste real do banco ao campo. Compras guiadas garantem três Warriors; a mão congelada preserva a terceira cópia e completa as vagas na rodada seguinte, demonstrando fusão paga entre campo e banco. Explica duração da fusão versus upgrades da run. Texto para o jogador deve descrever benefícios e ações; não reproduzir discussões internas de desenvolvimento.

Primeiros passos libera Encontro de caminhos e Ventos do acaso ao concluir o tutorial ou vencer o primeiro confronto após pular. Perfil antigo recebe crédito de migração e mantém desbloqueios. Etapas retomam após recarga; seleções necessárias são restabelecidas com segurança.

### Mapa e Bag

Após o confronto guiado, explicar os oito tipos de nó. Em Fortaleça sua equipe: recrutamento adiciona carta ao deck; upgrade melhora atributos e fortalece a habilidade. Não incluir ali observações de custo nem contagem de cópias.

Conceder Vital Stone/Pedra vital como recompensa garantida da run, uma única vez, guardada na reserva até o encaixe; não concede posse permanente. Depois das explicações, destacar o botão da Bag e exigir que o jogador o abra. Ensinar selecionar/girar/guardar/mover a relíquia inicial, selecionar/encaixar a nova recompensa sem sobreposição e confirmar. A concessão não se repete ao recarregar; pular antes dessa concessão não dá a recompensa guiada.

### Após a primeira run e replay

Ao voltar ao menu após a primeira run, apresentar tour opcional e único sobre moedas, decks emprestados, loja permanente, coleção, custom decks, milestones, perfil e backup.

Menu → How to Play permite Replay tutorial fora de combate ativo. Serializar a run original e restaurá-la ao terminar ou pular. Replay não concede estatísticas, diamantes, derrota nem itens à run original; pode concluir Primeiros passos se ainda bloqueado. Recompensa guiada e manipulação da Bag ficam isoladas no replay. Tour e desbloqueios são idempotentes. Guia e textos estão em inglês e português; a caixa de instrução evita cobrir o alvo sem substituir os elementos arrastáveis.

## 25. Teste de animação Warrior — v27

Warrior possui 16 quadros: quatro de idle, quatro de caminhada/corrida, quatro de ataque e quatro de reação ao dano. Arte pixel segue o sprite aprovado. Pés alinhados em ponto fixo, escala uniforme e fundo transparente.

Idle na preparação e combate. Caminhada segue deslocamento real; golpes básicos e skills acionam ataque. Dano efetivamente aplicado à vida aciona reação; cura e absorção total por escudo não acionam. Estado de animação fica fora do motor e save, por unidade. Pausar congela a animação; as velocidades seguem tempo de simulação. Preferência de movimento reduzido usa quadro estático. Falha no carregamento mantém o sprite original.

Vale para Warrior aliado, inimigo e fundido. Retratos anime/cartas e demais personagens continuam iguais. Não modifica atributos, dano, gatilhos, duração dos ataques, IA ou colisão. Teste reversível: remover a integração do atlas restaura o renderer anterior.

Permanecem pendentes para outra atualização: moldura vermelha quadrada Blackfang; arrastar relíquias e aceitar encaixes cujo canto vazio coincida com peça existente; ícone distinto de Card Cycle; investigação das traits ativas intermitentes no combate.
