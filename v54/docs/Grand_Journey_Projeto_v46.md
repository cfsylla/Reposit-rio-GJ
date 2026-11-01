# Grand Journey — fonte de continuidade do projeto

Documento de continuidade **v46 — 30/10/2026 (data local)**. Criador e Game Designer: **Carlos Felipe Sylla**.

**Conteúdo v46: Mantícora/Filhote de mantícora integrada ao Treinamento e à run, completando as nove duplas de raid.** Base v45, commit `238d661671e9d7463d115316e037019693e048d7`. Artes pixel originais enviadas copiadas sem alteração. As oito raids anteriores e seus números foram preservados.

**Próxima etapa proposta: três mapas/atos; depois skill tree e XP da run.** A implementação da Mantícora foi autorizada; este documento não autoriza implementar/publicar os próximos itens.

Premissa do roadmap: primeiro fechar as mecânicas que ainda não existem, depois revisar/completar os sistemas existentes, por último fazer o balanceamento amplo. Corrigir bloqueios e regressões durante cada implementação continua necessário.

## 1. Identidade, entrega e autorização

Grand Journey é um auto-battler roguelite de cartas, single-player, pensado para celular na vertical. Referências: Rift Wars no combate e caminhos de Slay the Spire. Estratégia por composição, posicionamento, sinergias, cartas e relíquias. Interface em azul-marinho e dourado; anime chibi em cartas/menus e pixel art no campo.

- Site existente: https://grand-journey.cfsylla.chatgpt.site
- Project ID: `appgprj_6ad92678b86081918ef5cc54c09cc04f`.
- Entrega web estática com HTML, JS, CSS e mídia separados. Não é um projeto Godot; não confundir com Arkin/Deckmon.
- Preservar a audiência customizada, o proprietário e os convidados existentes. Não criar outro Site para continuar este projeto.
- Português nas conversas e documentação; inglês como idioma padrão do jogo, com PT-BR selecionável e persistente.
- **Só implementar/publicar quando Carlos autorizar explicitamente uma atualização.** Relatos de bugs, novas ideias, preferências e pedidos de “ainda não faça” ficam pendentes. Nunca publicar automaticamente ao receber um relato.
- Respostas curtas; não pedir novamente permissões já concedidas. Quando houver autorização, completar implementação, verificação e publicação.

## 2. Tipografia e padrões permanentes de interface

- **A tela inteira do jogo nunca pode rolar.** Apenas menus/painéis delimitados dentro dela podem ter rolagem. Ações principais (Combater, Continuar, Confirmar, Voltar) ficam em uma linha separada e sempre acessível. Vale para telas novas e alteradas, todas as rodadas e viewports suportadas. Não resolver excesso de informação fazendo a arena/página inteira rolar. Validar especialmente preparo R3+, resultados longos e 320×640/360×740.

- **VT323 Regular 400** é a fonte aprovada para a interface, incluindo botões, títulos internos, cartas, números e textos do canvas. Usar o peso nativo, conforme a segunda opção do comparativo aprovado. Arquivo local: `dist/assets/vt323-v36.ttf`; licença: `dist/assets/vt323-OFL.txt` (SIL OFL 1.1, Peter Hull). Não depender do Google Fonts durante o jogo.
- O título **GRAND JOURNEY** mantém **Georgia Bold**; o subtítulo mantém **Nunito** (alias `JourneyOriginal`). Não mudar a identidade do título junto com futuras avaliações da fonte da interface.
- Pixelify Sans em negrito foi rejeitada nos botões; não voltar a aplicá-la globalmente sem nova decisão.
- Menus de consulta/escolha de cartas usam **três colunas**, inclusive em 360px: coleção, custom deck, Hacks, treino, Card Cycle etc. A mão de quatro cartas e as grades de combate mantêm seus formatos próprios.
- Rodapés de ações devem ter **fundo opaco até a borda inferior e safe area**, sem cartas ou conteúdo aparecendo atrás ou abaixo dos botões. Preferir uma linha fora da área de rolagem (`screen-footer`, montada por `mountScreenFooter`). A última linha de conteúdo precisa ficar totalmente acessível.
- Seleções usam janelas próprias do jogo. **Nunca usar select/menu nativo do celular** para escolher decks, níveis, dificuldade ou opções equivalentes.
- Ícones de Card Cycle e View deck são distintos. Campo mostra capacidade com destaque; banco usa o ícone de unidades em vez do texto Reserve.
- Pressionar carta/unidade por aproximadamente 450ms é atalho para **abrir** informações. A janela permanece aberta depois de soltar. Bloquear clique residual sem selecionar, pagar ou posicionar ao soltar.
- Informações permitem consultar atributos da unidade fundida. Não conceder fusão real ao abrir a prévia.
- Textos de skills no combate seguem EN/PT-BR também em maiúsculas, via `I18n.combatText`.

## 3. Estrutura de run e confrontos

A implementação atual usa **um ato/mapa**. Run com 15 camadas e nove confrontos de caminho nas camadas 1, 3, 5, 6, 8, 10, 11, 13 e 15. As demais camadas oferecem desenvolvimento. Eventos podem gerar combates adicionais. O mapa mostra ícones e conexões, com nomes na legenda/consulta. Ouro inicial: zero. Perder um confronto encerra a run.

Confrontos normais/elites terminam quando qualquer lado vence **três rodadas**; Boss exige **quatro**. Empates não dão ponto; não há limite fixo de rodadas. Uma rodada tem preparo sem cronômetro e combate automático. O inimigo permanece oculto até o início do combate. **Raids são exceção:** chefe/minions aparecem no preparo e têm regras próprias, descritas na seção 11.

| Rodada | Capacidade de campo por lado | Renda-base de energia |
| --- | --- | --- |
| 1 | 2 | 5 |
| 2 | 3 | 4 |
| 3 | 4 | 5 |
| 4 | 5 | 6 |
| 5 | 6 | 7 |
| 6+ | 6 | número da rodada + 2 |

Saldo restante acumula com a renda seguinte, sem teto. Novo confronto reinicia em cinco antes dos bônus de relíquias. Quick Start adiciona dois na primeira rodada; Everlasting Spark adiciona um em todas. IA segue as regras de pagamento, renda, banco e fusão.

- Campo: cinco colunas por três linhas, 15 posições; máximo de seis unidades conforme a rodada.
- Banco: seis posições pagas; unidades no banco não lutam nem contam traits. Transferir/trocar unidades já pagas é gratuito, respeitando a capacidade do campo.
- Velocidades: **×1, ×1,5, ×2 e ×3**, persistentes entre rodadas/confrontos e ao recarregar neste navegador. Os quatro botões dividem o espaço anteriormente usado por três. Passos de simulação de até 1/60 s; acelerar não aumenta o passo.
- Alvo básico: inimigo mais próximo, salvo provocação e regras específicas de skill.
- Em combates normais/elites/bosses de decks: aos 40 segundos simulados, dano ×5; aos 120, empate. Relógio acompanha a velocidade. **Raids não têm limite de tempo nem esse multiplicador.**
- Danos/curas do mesmo passo resolvidos em conjunto. Escudos absorvem antes da vida. Crítico básico ×1,5; chance até 75%; defesa usa `100/(100+defesa efetiva)`; redução adicional combinada limitada a 65%.
- A cada rodada, unidades vinculadas revivem com vida cheia; formação, banco e fusão permanecem. Efeitos temporários e carga são reiniciados conforme a skill/relíquias. Novo confronto limpa campo/banco/fusões/mão/congelamento/energia; mantém cartas originais, upgrades, ouro e relíquias da run.

## 4. Cartas, ciclo, upgrades e fusão

- Deck emprestado/customizado começa com 20 cartas; máximo de **quatro cópias físicas por personagem**, somando níveis e constituintes de fusão. A run pode crescer além de 20.
- Decks emprestados usam oito tipos com multiplicidades 3/3/3/3/2/2/2/2. Perfil novo começa com Vanguarda da passagem e libera Encontro de caminhos/Ventos do acaso por Primeiros passos.
- Mão de até quatro cartas. Cartas pagas no campo/banco ficam vinculadas, fora de compra/descarte, mesmo derrotadas. Quando a compra acaba, embaralhar o descarte. Não revelar a ordem futura no Card Cycle.
- Refresh Hand custa uma energia e pode repetir enquanto houver saldo/mão. Descarta e recompõe até quatro, respeitando os vínculos.
- Freeze é gratuito e disponível só no preparo. Preserva a mão restante para a próxima rodada, compra apenas as vagas e desativa no novo preparo. Confronto novo limpa a opção.
- Retirada normal envia ao descarte e reembolsa metade do custo arredondada para baixo. Fusões devolvem as três cartas e a soma dos três reembolsos individuais.
- **Voltar para a mão:** no preparo da mesma rodada em que a unidade saiu da mão, permite desfazer a implantação e recuperar toda a energia paga. Não vale para unidades implantadas em rodadas anteriores, mesmo no banco. Usar Refresh Hand bloqueia esse retorno. Preservar as regras de conservação e reversão de fusão já implementadas; tutorial inclui essa opção.
- Card Cycle abre uma janela para cada contador: run inteira, draw, discard, hand e bound. Bound inclui todas as cópias constituintes de fusão e identifica campo/banco. Listas ordenadas por personagem/nível, sem expor a sequência de compra; vazios têm mensagem; detalhes retornam à pilha/resumo.
- Até dois upgrades por cópia: +10% no nível 1 e +25% total sobre a base no nível 2. Melhoram atributos e poder escalável da skill. **Custo de energia não muda com upgrade.** Quantidades, gatilhos, alcance e duração fixos não aumentam automaticamente.
- A terceira cópia **paga**, no campo/banco, funde com as outras duas; três no deck/mão não bastam. Um único patamar de fusão. Média dos atributos melhorados das três cópias; vida/ataque/defesa/poder de skill ×1,75. Frequência usa a média de ataques por segundo. Movimento/crítico/alcance/gatilho não recebem bônus extra de fusão.
- A fusão ocupa uma casa e permanece na posição de campo mais antiga; se só houver banco, na posição da mais antiga do banco. Guarda as três identidades/upgrades e não consome coleção. Persiste no confronto e desfaz no próximo.

## 5. Traits

Cada unidade tem três traits. Contar somente personagens distintos no campo: duplicatas não aumentam o patamar. Dois tipos ativam o primeiro patamar; três ativam o segundo; todas as cópias elegíveis recebem o bônus. Snapshot no início da rodada persiste após mortes e aparece durante combate. Banco/mão não contam.

| Trait | Bônus com dois / três tipos |
| --- | --- |
| Atacante | ataque +12% / +24% |
| Defensor | vida +15% / +30% |
| Atirador | velocidade de ataque +12% / +24% |
| Arcano | poder de skill +20% / +40% |
| Ágil | movimento +20% / +40% |
| Disciplinado | dano recebido −8% / −16% |
| Aventureiro | ataque e vida +6% / +12% |
| Guardião | regeneração de 0,6% / 1,2% de vida por segundo |

## 6. Ordens, roster, filtros e desbloqueios

Roster jogável atual: **77 personagens**. Blackfang e Dawncrest já implementados; não tratá-los como futuros. As nove duplas de monstros implementadas são exclusivas dos encontros inimigos, fora do roster de cartas do jogador.

- Blackfang e Dawncrest têm forças opcionais nas camadas 5 e 10. Vencer as duas forças de uma mesma ordem ativa seu boss na camada 15. Boss de deck mantém condição de quatro vitórias de rodada.
- Derrotar o boss da respectiva ordem desbloqueia permanentemente seu catálogo/booster. Antes disso, ocultar referências dos pools e listagens do jogador: coleção, lojas, boosters, previews, Hacks, treino e ofertas da run. Consultar o inimigo encontrado é permitido.
- Desbloqueio **não dá cópia grátis do boss nem outra carta**. Preservar posse e disponibilidades das runs já iniciadas; não reconstruir mapas antigos.
- Com zero/uma vitória de ordem, manter o fallback existente. Rota mista não ativa uma ordem por somar vitórias de grupos diferentes.
- Filtros de ordem e raça/facção são do **mesmo nível**, sem submenus ao clicar em Blackfang/Dawncrest.
- Blackfang, Goblin, Orc, Dark Elf e Troll. Dawncrest, High Elf, Forest Elf, Fairy, Centaur e Meowri.
- Nomes consolidados: Dark Elf Guardian; Feline → Meowri; Meowri Arcanist → Meowri Sorcerer; Elven → High Elf; High Elf Guardian → Warrior; Halberdier → Lancer; Woodland → Forest Elf; Forest Elf Lancer → Warrior; Flailer → Guardian; High Elf Harpist; Centaur Hunter; Centaur Knight.
- Ícones do mapa usam os emblemas pixel art enviados: nó escuro Blackfang, símbolo branco/dourado Dawncrest e Selo da Quimera roxo para Monstros. Mesmo emblema no boss, com destaque de borda. Não voltar aos desenhos genéricos ou sprites individuais dos monstros nos nós. Legenda usa os emblemas correspondentes.
- Regra da v43: nenhuma espécie de raid se repete na mesma run, incluindo o boss. Detalhes na seção 11.

## 7. Relíquias, Bag, lojas e recrutamento

20 relíquias. Bolsa fixa 4×4/16 células; peças conectadas com rotações de 90°, sem espelhar. Só o encaixe confirmado concede efeito. Reserva da run é inativa e não ocupa células. Relíquia inicial começa encaixada. Formato e raridade são independentes.

- Arrastar peças na grade e entre reserva/grade; preservar ponto de pega, rotação e footprint ocupado. Uma origem vazia do formato pode coincidir com outra peça sem bloquear um encaixe válido. Não exigir tirar a Ampulheta para posicionar Last Stand onde as células ocupadas cabem.
- Posição inválida/cancelamento não altera o arranjo confirmado. Confirm bag valida; Cancel preserva. Descarte pede confirmação e só afeta a edição até confirmar.
- Receber relíquia abre decisão: encaixar, aceitar na reserva ou recusar. Não reorganizar tudo automaticamente ao receber.
- Compra só cobra ao confirmar aceitação, na grade ou reserva. Recusar não cobra nem remove a oferta. Não gerar duplicatas que já estejam equipadas, guardadas ou pendentes.
- IA equipa automaticamente um conjunto que caiba em 4×4; reserva não dá efeito.
- Relíquias dos elites/Boss usam as regras existentes de oportunidades de relíquia; preservar sorteios e evitar repetir concessão ao recarregar.
- Loja/recrutamento da run têm reroll pago de **cinco de ouro**, repetível, respeitando pools e limites de cópias. Na loja recicla cartas/relíquias, mantendo serviços. Falta de saldo, falta de opções ou relíquia pendente não cobra.
- Comprar carta exige botão Comprar; consulta da carta não compra. Ofertas mostram cópias físicas da run, incluindo fusões. Saldo fica visível durante rolagem.

## 8. Progressão permanente e saves

Coleção, boosters, diamantes, catálogos, milestones, dez espaços de custom decks e perfil são permanentes. Ouro/cartas/upgrades/relíquias recebidos na run são temporários; não viram posse da coleção. Milestones concedem seus desbloqueios uma única vez. New game é reset com confirmação, diferente de abandonar run ou começar outra.

Save local ao navegador/aparelho/origem, sem sincronização entre dispositivos. Perfil schema 1; estado da run e `gameVersion` seguem 20 por compatibilidade, independentemente do número do conteúdo. Manter export/import JSON, recuperação local/IndexedDB e marcadores de reset. Combate normal interrompido segue recuperação existente para preparo. Raid usa snapshot para retomar o combate pausado, mantendo HP, tempo e efeitos; ver seção 11. Preservar vínculos, banco, fusões, ordem de implantação, Bag, mão congelada, tutorial e rota. Não apagar save inválido sem tentativa de recuperação válida.

Fim de run solicita backup JSON e permite download manual; não afirmar que Android concluiu o download. Relato antigo de alternância entre saves antigos/novos segue como risco de playtest, sem causa definitivamente confirmada no Android. Não prometer PWA/offline ou persistência entre aparelhos: a entrega inicial requer rede/acesso ao Site.

## 9. Treinamento — implementado

Modo gratuito e isolado. Não gasta recursos nem concede ouro/diamantes/coleção/milestones/estatísticas da run. Preserva a run normal ao entrar, sair, exportar ou recarregar.

- Cada lado escolhe deck emprestado desbloqueado ou monta 20 cartas de personagens já revelados, até quatro cópias, sem consumir cópias da coleção.
- Upgrades individuais 0/1/2, melhoria de todas e relíquias por lado respeitando 4×4. Sem relíquias é válido.
- Dificuldade normal/elite/boss; escolher de uma a dez vitórias de rodada para terminar. Upgrades/relics selecionados aplicados exatamente; dificuldade usa escala existente da IA.
- Cartas embaralhadas/compradas normalmente; **não fixar as mesmas compras**. Repetir usa a mesma configuração e um novo embaralhamento. Alterar configuração retorna preenchido; opção de menu principal.
- Editor em três colunas, estilo compacto do Hack de cartas. Todas as escolhas abrem janelas do jogo.
- Hacks permanentes são bloqueados no treino; não abrir acesso a diamantes/coleção por esse modo.

## 10. Hacks, tutorial e relatórios

Hacks implementados: +10 diamantes, +100 ouro da run, escolher cartas/relíquias para a run, curar todos os aliados vivos em campo, encher especiais de aliados ativos, **vencer rodada** e **vencer confronto**. Cura não revive nem afeta inimigos; especial não modifica passivas. Seleção de cartas/relíquias da run é bloqueada durante combate; vitória/cura/especial funcionam no combate ativo, inclusive pausado.

Em combates de decks, vencer rodada dá um ponto e vencer confronto completa o limiar real (três normal/elite, quatro Boss). Em raid, usar o Hack de vitória elimina o monstro pelo fluxo próprio, sem inventar uma vitória de rodada que não derrota o chefe. Usar o fluxo normal de resultado/relatórios/recompensa/progressão, uma vez. Não inventar dano para o relatório nem premiar rodada como confronto.

Tutorial guiado em três rodadas: posicionamento, traits, energia, capacidade, ataques/especial/velocidade, banco, arraste, retirada, refresh, informação, View deck, Card Cycle, freeze/fusão, mapa e Bag. Durante a espera do combate, mensagem/escurecimento somem após três segundos reais; ao encerrar a rodada o fluxo retorna. Realce acompanha o elemento correto durante animação/rolagem, inclusive Confirm bag. Vital Stone guiada é recompensa temporária única. Replay é isolado e restaura a run original; pode concluir Primeiros passos sem dar recursos/estatísticas.

Resultado: placar e próxima ação acima de quatro tabelas em grade 2×2 (dano causado/recebido de cada equipe). Rodadas intermediárias mostram a rodada; encerramento mostra acumulado do confronto. Cópias separadas e identificadas; ordenar por dano. Contar dano efetivo à vida, excluindo escudo e excesso.

## 11. Raids — estado implementado e regras consolidadas

Quatro raids originais, somadas às quatro da expansão v45, completas no Treinamento e na rota da run: **Árvore ancestral corrompida/Broto carnívoro; Colosso de pedra/Golem de pedra; Rei slime/Slime; Dragão ancestral/Wyvern.** Não são cartas disponíveis ao jogador e não entram em boosters, coleção, decks ou recompensas de carta.

### Regras comuns

- Chefe tem uma barra longa de vida que persiste entre rodadas, incluindo cura efetivamente recebida. Perder rodada não apaga dano causado.
- A rodada só termina com a derrota de todos os aliados ou com a derrota do monstro. **Não há encerramento por 60 segundos**, nem multiplicador global de dano aos 40 s. Cronômetro apenas informativo.
- Derrota no confronto quando o monstro vence cinco rodadas. Vitória tem prioridade se chefe e último aliado morrerem no mesmo passo.
- Aliados revivem com vida cheia entre rodadas. Campo, banco, vínculos, fusões, desenvolvimento do deck e regras normais de energia/renda/refresh/freeze permanecem. Capacidade 2/3/4/5/6.
- Minions sobreviventes não acumulam entre rodadas; reconstruir a formação da fase. Limite de dois minions vivos por vez nas espécies atuais.
- Chefes fixos no fundo central, alcance básico 650, ancoragem na base da arte e margem de corpo 30. Contato melee/skills usa o chão/corpo, não o centro da imagem. Não reintroduzir unidades sobrepostas no centro do sprite do chefe.
- Ataque básico com preparação de 0,45 s, projétil de 0,22 s e dano/impacto na chegada. Feedback visível com cor da espécie. Alvo morto cancela tiro; vitória encerra sem esperar minions, exceto a massa destacada do Rei slime descrita abaixo.

### Fases

| Raid | Rodada 1 | Rodada 2 | Rodada 3 | Rodada 4 | Rodada 5 |
|---|---|---|---|---|---|
| Árvore | Chefe sozinho | Dois Brotos | Raízes marcadas em ponto fixo | Cura canalizada por Brotos vivos, limitada por rodada | Uma reposição aos 28 s até dois Brotos vivos |
| Colosso | Chefe sozinho | Dois Golems e armadura vinculada | Impacto de área telegrafado | Núcleo exposto após quebra dos dois Golems fortalece/acelera o chefe | Uma reposição aos 28 s; não restaura armadura quebrada |
| Rei slime | Chefe sozinho | Destaca massa em dois Slimes | Ondas limitadas de divisão e retorno | Slimes mortos deixam poças | Tentativa extra de reposição aos 28 s, respeitando o limite de ondas/dois vivos |
| Dragão | Chefe sozinho | Duas Wyverns buscando retaguarda | Sopro em cone com direção fixada após aviso | Sopro deixa fogo no chão | Sopro mais frequente e uma reposição aos 28 s |

Colosso: recebe 45%/80%/140% do dano conforme zero/um/dois Golems tenham caído. Quebras persistem naquela rodada, inclusive após reposição. Núcleo exposto na fase 4+ concede ataque ×1,3 e intervalo básico ×0,7.

Rei slime: barra representa a soma da vida do corpo e dos Slimes de massa destacados. Dividir retira exatamente a vida criada no minion; retornar apenas transfere vida restante, sem gerar cura ou vida nova. Corpo zerado com massa viva é reconstruído por transferência de até um ponto dessa massa; vitória exige zerar o total. Até quatro ondas, incluindo inicial/reposição. Dano simultâneo precede reabsorção: Slime morto na chegada não devolve vida.

### Valores iniciais — conteúdo v42/v43

| Espécie | HP chefe | ATK | DEF | Intervalo básico | HP minion | ATK minion | DEF minion | Movimento minion |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Árvore | 17.000 | 52 | 20 | 1,50 s | 400 | 34 | 12 | 38 |
| Colosso | 15.500 | 50 | 24 | 1,65 s | 400 | 30 | 30 | 32 |
| Rei slime | 18.000 | 54 | 14 | 1,45 s | 480 | 30 | 8 | 40 |
| Dragão | 15.500 | 48 | 22 | 1,60 s | 350 | 26 | 12 | 68 |

Minions: intervalo 1,35 s, alcance 34, sem crítico. Chefes: movimento zero, sem crítico.

- Árvore: raízes aos 6 s/depois a cada 9 s; aviso 1,5 s, raio 46, dano 70, imobilização 1,5 s permitindo ataque/skill. Cura aos 12 s/depois 16 s, canal de 3 s, 160 por Broto ainda vivo ao concluir; teto 800 por rodada.
- Colosso: impacto aos 7 s/depois 10 s; aviso 1,2 s, raio 65, dano 85 e stun 0,6 s.
- Slime: divisão a cada 17 s, retorno após 10 s a velocidade 48. Poças duram 5 s, raio 52, dano 14 por tick de 0,75 s e lentidão renovada de 1 s.
- Dragão: sopro aos 7 s/depois 12 s (9 s na fase 5); aviso 1,35 s, dano 95, meio ângulo 0,42 rad, comprimento 600. Fogo dura 6 s, raio 55, dano 16 por tick de 0,75 s. Wyvern respeita provocação ao buscar a retaguarda.

### Integração na run, acesso e interface

Nas runs novas desde v42, camadas 5 e 10 oferecem raid no ramo esquerdo, Blackfang no central e Dawncrest no direito. São **duas raids completas antes do boss**. Vencer ambas ativa um monstro como boss da camada 15. Uma raid e um confronto de outra ordem não ativam boss monstro. Mapas anteriores sem esses nós são preservados.

| Posição | HP chefe | ATK/dano de mecânicas/cura | HP e ATK minions |
|---|---:|---:|---:|
| Primeira raid, batalha 3 | 48% | 72% | 72% |
| Segunda raid, batalha 6 | 82% | 93% | 93% |
| Boss, batalha 9 | 135% | 115% | 115% |

Escala depende da posição, não da força do jogador. Defesa, alcance, intervalos e movimento não escalam por etapa. Qualquer espécie pode aparecer em qualquer posição. Configuração copiada ao iniciar e preservada no save.

**Não repetir espécie na run:** duas raids intermediárias distintas; boss sorteado entre espécies ainda não enfrentadas. Escolha determinística por seed. Raids ignoradas não contam como enfrentadas. Corrigir boss futuro repetido de save v42 sem reconstruir mapa, apagar progresso ou alterar confronto já iniciado.

Treinamento usa equipe/upgrades/relíquias configurados, escolhe entre as nove raids e não concede recompensas. Run usa ouro/progresso normais, sem recompensa extra por rodada perdida, sem carta de monstro e sem desbloqueio indevido de Blackfang/Dawncrest.

HUD enxuto: placar padrão, rodada, cronômetro, nome e HP atual/máximo/barra. Sem duplicação de placar/derrotas, texto de fase ou explicação do que vai acontecer. Resultado mantém relatórios padrão, sem painel extra redundante de dano ao chefe/minions/cura ou texto abaixo da barra. Botões principais sempre no rodapé fixo.

### Persistência e validação já executada

Treino mantém a chave compatível `grand-journey-raid-v39`; ausência de kind em save antigo implica Árvore. Raid da run usa snapshot `raidBattle` junto do perfil/estado no envelope principal, incluindo exportação/importação. Checkpoint a cada 500 ms e ao ocultar/sair; retomada pausada conserva PRNG, projéteis, marcas, canal, poças, rachaduras, ondas e massa. Registro/finalização idempotentes evitam dano, cura ou recompensa duplicados.

Entregas anteriores registraram 1.120 simulações de raids sem travamentos, 60 replays normais/elites/bosses de decks sem mudança e 1.000 seeds com três monstros distintos na rota. QA de navegador em 320×640 e 360×740; sem teste físico em Android. Essas verificações **não equivalem a balanceamento final** nem a simular toda a economia/decisão humana de uma run.

### Expansão v45 — novas quatro duplas

Todas seguem: R1 solo, R2 dois lacaios, R3 especial, R4 evolução, R5 uma reposição em 28s. HP do chefe persiste; aliados voltam com vida cheia; cinco derrotas encerram; vitória imediata ao matar o chefe; sem timeout/frenesi global. Sorteio usa nove espécies, evita repetir confrontos já jogados e conserva os modificadores por posição existentes.

| Raid | R3 | R4 | Valores base provisórios |
|---|---|---|---|
| Hidra/Basilisco | Salva com 1 + basiliscos vivos, até três marcas distintas fixas; matar lacaios reduz a salva | Ácido nas marcas por 4s, tick 0,75s | HP 16.500; ATK 50; DEF 18; básico 1,6s; especial 74, intervalo 11s, aviso 1,3s, raio 36; ácido 12/tick |
| Kraken/Cria | Até duas marcas fixas de impacto; depende das crias vivas; imobiliza 0,75s | Puxa atingidos vivos até 46 unidades em direção ao chefe, respeitando contato no chão | HP 17.500; ATK 54; DEF 20; básico 1,65s; especial 82, intervalo 12s, aviso 1,4s, raio 54 |
| Lich/Esqueleto | Ritual de 2,2s ressuscita esqueletos mortos a 65% HP, no máximo dois por rodada e uma vez por corpo; chefe para básicos e recebe +35% dano no ritual | Ressurreição gera explosão no local do corpo, anunciado pelo ritual | HP 17.000; ATK 56; DEF 16; básico 1,5s; espera 12s entre rituais; explosão 62, raio 52 |
| Naga/Homem-serpente | Cone petrificante com direção fixa, 60 dano e imobilização 1,6s | Cone aplica duas cargas de veneno; básicos dos homens-serpente já aplicam uma carga desde R2 | HP 16.500; ATK 48; DEF 18; básico 1,55s; cone intervalo 13s/aviso 1,5s/meio ângulo 0,36; veneno cap 3, duração 5s, 9/carga por segundo |

Marcas, cones, projéteis, impactos, linhas do ritual e indicadores de veneno ficam no campo. Sem painel explicativo adicional no HUD. Dano de marcas sobrepostas não é duplicado no mesmo impacto. Ressurreição/puxão são resolvidos depois do dano simultâneo e nunca revivem chefe/unidades já eliminados indevidamente. Cargas de ressurreição não se renovam ao longo da rodada; reposição R5 é separada e limitada a uma.

### Expansão v46 — Mantícora e filhote

- R1: chefe sozinho; R2: dois filhotes, que buscam o aliado com menor porcentagem de vida, respeitando provocação/controle do combate.
- R3: cauda dispara três linhas de espinhos, sinalizadas no chão por 1,4s. Direções ficam fixas quando o aviso começa. Alcance 510, meia largura 15, direções central e ±0,3 rad. Atingido recebe 80 de dano uma única vez por salva, mesmo se linhas se cruzarem.
- R4: quem for atingido pela salva fica marcado por 6s; filhotes priorizam presas marcadas e recebem velocidade de movimento ×1,3 enquanto houver uma presa marcada viva. Ataques que falham não aplicam marca. Marcas expiram e desaparecem ao morrer o alvo; sem bônus de dano oculto.
- R5: uma reposição em 28s, completando até dois filhotes vivos. Nenhum limite de tempo, mantendo vida persistente e derrota após cinco perdas.
- Valores base provisórios: chefe HP 17.000, ATK 54, DEF 18, intervalo básico 1,55s; filhote HP 370, ATK 30, DEF 12, intervalo básico 1,35s, velocidade 54; especial a partir de 7s, intervalo 12s. Aplicados os mesmos modificadores de posição das demais raids.
- Feedback: linhas tracejadas antes da salva, traços de impacto e mira sobre presas. Apenas sinais relevantes no campo; HUD permanece enxuto.
- Nove espécies elegíveis em qualquer posição; sorteio sem repetir o que já foi enfrentado na run. Monstros continuam inimigos exclusivos, sem virar cartas jogáveis.
- Testes e resultados por deck: `docs/manticore-v46-validation.md` e `docs/manticore-v46-results.json`.

## 12. Pendências e ordem de avanço proposta

Esta é a ordem consolidada após a correção do usuário: **mecânicas novas primeiro; revisão/expansão do existente depois; balanceamento amplo por último.** A lista orienta o planejamento. Não é autorização automática para implementar/publicar cada item.

| Ordem | Bloco pendente | Entrega/limite de escopo |
|---|---|---|
| **1 — próxima etapa** | **Três atos/mapas** | Transições, Boss por mapa e final após o terceiro. Duas raids completas antes do Boss; preservar espécies já enfrentadas durante toda a run. Definir o que persiste entre mapas. |
| **2** | **Skill tree permanente + XP da run** | Compra apenas após cada Boss, inclusive o terceiro; seguir o conceito validado da seção 13. Definir ramos, custos, fontes de XP, Bag, limites e reset. |
| **3** | **Cartas negativas/maldições + eventos necessários** | Run somente; definir mão, energia insuficiente, congelamento, reciclagem, remoção e reembaralhamento. Sugestões de cartas não são fichas aprovadas. |
| **4** | **Energia para iniciar runs + Hack** | Custo 5, capacidade 30, +1 a cada três minutos. Separada da energia de combate. |
| **5** | **Login diário** | Dias 1–6: +1 diamante; dia 7: +7. Ausência reinicia. Definir virada de dia/save. |
| **6** | **Histórico analítico de runs** | Escolhas, composições, resultados e desempenho para playtest e balanceamento futuro. |
| **7** | **PWA/offline e sincronização** | Entregas distintas, incluindo atualização/cache e conflitos de save entre aparelhos. |
| **8** | **Revisão de traits existentes** | Classes, raças/ordens, especializações, requisitos e distribuição; revisão após mecânicas novas. |
| **9** | **Revisar/ampliar relíquias e eventos** | Considerar skill tree, maldições e três atos; referências/sugestões ainda exigem avaliação. |
| **10** | **Revisão geral** | Combate, skills, movimentação, fusões, economia, recompensas, rotas, saves, tutorial, idiomas, acessibilidade e tela fixa. |
| **11** | **Balanceamento integrado** | Todos os sistemas juntos. Valores iniciais ajustáveis não substituem esta etapa. |
| **12 — menor prioridade** | **Essência e cosméticos** | Queimar excedentes por Essência; cosméticos na Shop e seleção na Collection. Rendimento, preços e cópias preservadas ainda não definidos; quatro cópias é sugestão. |

Corrigir bloqueios e regressões enquanto cada item é desenvolvido continua obrigatório; isso não antecipa a revisão geral nem o balanceamento amplo. Usar valores provisórios ajustáveis para testar novas mecânicas sem tratá-los como resultado definitivo.

### Decisões pendentes da revisão de traits (item 8)

- Traits de classe focadas em atributos; sem distribuir por personagem antes de fechar nomes/efeitos.
- Considerar vida, ataque, defesa/redução de dano, movimento, velocidade de ataque, chance de crítico, alcance e área de ataques comuns e carregamento de especial.
- **Alcance e área são elegíveis:** atribuir apenas a personagens em que façam sentido, como Cowboy/Gunner para alcance e Miner/Lancer para área. Não aplicar automaticamente às skills.
- Revisar/remover Arcano; aumentar genericamente poder de skill pode ter resultados muito diferentes conforme a habilidade.
- Duelista/carga mais rápida interage com frequência de hits e pode exigir rever quantidade de hits para carregar habilidades no balanceamento.
- Energia de compra/combate como trait fica em hold. Não confundir com barra de especial ou energia de acesso à run.
- Especializações e raças/ordens tendem a focar mecânicas, incluindo músicos e deslocamento à retaguarda; ainda sem fichas/valores finais aprovados.
- Campo tem seis unidades; avaliar patamares 2/4 ou 3/4 por trait conforme o efeito. Patamares atuais 2/3 só mudam após autorização de revisão.

### Pontos obrigatórios do futuro balanceamento (item 13)

O usuário considera começo aceitável e reta final excessivamente difícil. Inimigos das batalhas 4–6 podem ter várias cartas U1 e, da 7ª em diante, o upgrade é generalizado. Comparar com quantos U1/U2 o jogador realmente consegue obter nas mesmas etapas, considerando pior/melhor cenário, rotas com lojas e todo ouro aplicado em upgrades. Equilibrar **nodes e economia**, não apenas cartas.

Reavaliar também percentuais das raids por posição. Fixtures de v42 tiveram todas as equipes de referência vencendo a primeira raid e só 12,5–20% vencendo o boss; não eram runs completas de economia. Não usar esses números como prova de dificuldade correta. A árvore permanente alterará a força de perfis iniciantes/avançados e precisa entrar na avaliação final.

## 13. Skill tree e XP — conceito validado, ainda não implementado

- Toda run começa com zero XP; acumula durante a run.
- Compra de upgrades permanentes somente imediatamente após derrotar o Boss de cada mapa, inclusive o mapa 3, antes do encerramento.
- Menu principal permite consultar a árvore, sem comprar.
- XP não gasta segue ao próximo mapa da mesma run. Ao perder, todo saldo é perdido, inclusive sobras de mapas anteriores. Não passa para outra run.
- Somente os upgrades adquiridos são permanentes/protegidos. Substitui a antiga sugestão de proteger saldo de mapas vencidos.
- Várias ramificações e nodes de custos diferentes, com pré-requisitos próprios; não bloquear nodes por conclusão de mapas específicos.
- Pendentes: fontes/quantidades de XP, custos, ramos, pré-requisitos, limites, reset, relação com a expansão da Bag e destino do saldo final depois do mapa 3. Aplicação imediata à run atual foi sugerida, não confirmada separadamente.

## 14. Estado técnico e retomada segura

- Site e projeto preservados: https://grand-journey.cfsylla.chatgpt.site ; `appgprj_6ad92678b86081918ef5cc54c09cc04f`.
- A fonte v43 correta foi recuperada antes da v45; a v46 reabriu a fonte publicada v45 pelo fluxo Git. A discrepância com o checkout v40 registrada na v44 foi resolvida; nunca usar aquele checkout antigo como base.
- A v46 inclui nove raids, sem alterar o roster de 77 personagens jogáveis nem os saves/perfis/acessos existentes. A numeração de hospedagem é distinta da numeração de conteúdo; consultar Sites para commit/versão publicada.
- Arquivos centrais da expansão: `monster-engine.js`, `monster-ui.js`, `monster-assets.js`, sorteio em `game-0.js`, traduções em `game-5.js` e cache em `index.html`.
- Preservar o fluxo de snapshot existente; arrays de marcas, venenos, puxões, corpos do ritual e cargas limitadas são serializáveis e usam o mesmo PRNG.
- Verificações: suites raids v39–41, monsters-v42 (ampliada para nove), map-v43 (nove espécies), manticore-v46, raids-v45, training-v31, update-v38 e 60 replays legados. QA móvel em 320×640 e 360×740, sem dispositivo Android físico. Detalhes e resultados quantitativos em `docs/raids-v45-validation.md`.

## 15. Limites e pendências de arte

Não reintroduzir a animação rejeitada do Warrior. Futuras animações exigem nova arte/validação; não são parte do roadmap mecânico aprovado nesta conversa.

Roster final de nove duplas, todas implementadas: Árvore/Broto, Colosso/Golem, Rei slime/Slime, Dragão/Wyvern, Hidra/Basilisco, Kraken/Cria, Lich/Esqueleto, Naga/Homem-serpente e Mantícora/Filhote. Usar pixel arts aprovadas; não substituir por anime provisória. Hidra/Basilisco substituíram aranhas; Filhote substituiu Escorpião gigante.

As ideias de maldições, mais eventos e mais relíquias são conhecidas pelo contexto disponibilizado do chat de mecânicas. A íntegra desse outro chat não estava acessível ao consolidar este documento; não inventar fichas, nomes ou decisões finais para sugestões ainda não recuperadas.

## 16. Dados de referência de personagens e relíquias

Os anexos abaixo preservam os dados disponíveis do roster de 77 personagens/20 relíquias da fonte v40 recuperada, sem o conteúdo exclusivo de raids. As entregas v41–v43 registradas nesta conversa não alteraram esses atributos de personagens. Conferir contra a fonte v43 correta antes de usá-los para implementação ou balanceamento; não tratá-los como revisão nova aprovada.

### Atributos-base dos 77 personagens

| ID | Nome | Energia | HP | ATK | DEF | Intervalo de ataque | Movimento | Crítico | Alcance |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| warrior | Warrior | 2 | 290 | 27 | 26 | 1.08 | 49 | 0.07 | 34 |
| lancer | Lancer | 2 | 230 | 27 | 26 | 1.08 | 60 | 0.07 | 62 |
| bastion | Bastion | 3 | 360 | 20 | 52 | 1.65 | 30 | 0.03 | 34 |
| shinobi | Shinobi | 3 | 180 | 35 | 8 | 0.68 | 74 | 0.25 | 34 |
| kinoichi | Kinoichi | 3 | 180 | 27 | 16 | 0.86 | 74 | 0.18 | 62 |
| samurai | Samurai | 3 | 290 | 35 | 38 | 1.35 | 49 | 0.12 | 34 |
| omnamusha | OmnaMusha | 3 | 230 | 27 | 26 | 0.68 | 60 | 0.18 | 34 |
| ronin | Ronin | 3 | 230 | 45 | 16 | 1.35 | 49 | 0.25 | 34 |
| fighter | Fighter | 2 | 290 | 27 | 16 | 0.68 | 60 | 0.12 | 34 |
| martial_artist | Martial Artist | 2 | 230 | 27 | 26 | 0.86 | 60 | 0.07 | 62 |
| shaolin | Shaolin | 3 | 290 | 20 | 38 | 1.08 | 49 | 0.03 | 34 |
| cowboy | Cowboy | 2 | 230 | 27 | 16 | 0.86 | 49 | 0.25 | 145 |
| gunner | Gunner | 3 | 180 | 35 | 8 | 1.08 | 49 | 0.18 | 180 |
| miner | Miner | 2 | 290 | 35 | 16 | 1.35 | 39 | 0.07 | 62 |
| pirate_captain | Pirate Captain | 4 | 290 | 27 | 26 | 1.08 | 49 | 0.12 | 145 |
| pirate | Pirate | 2 | 230 | 27 | 16 | 0.86 | 60 | 0.18 | 34 |
| cannoneer | Cannoneer | 4 | 290 | 45 | 26 | 1.65 | 30 | 0.03 | 180 |
| ranger | Ranger | 2 | 230 | 27 | 16 | 1.08 | 60 | 0.12 | 145 |
| archer | Archer | 2 | 180 | 20 | 8 | 0.68 | 60 | 0.12 | 180 |
| crossbowman | Crossbowman | 3 | 230 | 45 | 26 | 1.65 | 39 | 0.18 | 180 |
| mage | Mage | 4 | 180 | 27 | 8 | 1.35 | 39 | 0.03 | 145 |
| sorceress | Sorceress | 4 | 180 | 20 | 8 | 1.08 | 49 | 0.07 | 145 |
| sage | Sage | 3 | 230 | 14 | 26 | 1.35 | 30 | 0.03 | 145 |
| priestess | Priestess | 4 | 180 | 20 | 16 | 1.08 | 49 | 0.03 | 145 |
| cavalier | Cavalier | 4 | 360 | 35 | 38 | 1.3513513513513513 | 74 | 0.07 | 62 |
| musketeer | Musketeer | 3 | 230 | 45 | 26 | 1.639344262295082 | 39 | 0.12 | 180 |
| swordsman | Swordsman | 3 | 290 | 45 | 16 | 1.3513513513513513 | 49 | 0.12 | 62 |
| duelist | Duelist | 3 | 230 | 27 | 16 | 0.6802721088435374 | 60 | 0.25 | 34 |
| viking | Viking | 3 | 290 | 35 | 26 | 1.3513513513513513 | 49 | 0.12 | 34 |
| shieldmaiden | Shieldmaiden | 3 | 290 | 20 | 38 | 1.075268817204301 | 49 | 0.07 | 34 |
| shaman | Shaman | 4 | 230 | 20 | 16 | 1.075268817204301 | 49 | 0.03 | 145 |
| berserker | Berserker | 3 | 290 | 35 | 8 | 0.8620689655172414 | 60 | 0.12 | 34 |
| huntress | Huntress | 3 | 230 | 35 | 16 | 1.075268817204301 | 60 | 0.18 | 145 |
| glutton | Glutton | 3 | 360 | 27 | 26 | 1.639344262295082 | 30 | 0.03 | 34 |
| bear_druid | Bear Druid | 4 | 360 | 35 | 38 | 1.3513513513513513 | 49 | 0.07 | 62 |
| eagle_druid | Eagle Druid | 3 | 180 | 27 | 8 | 0.8620689655172414 | 74 | 0.18 | 34 |
| pirate_admiral | Pirate Admiral | 4 | 360 | 45 | 38 | 1.639344262295082 | 30 | 0.07 | 62 |
| shackled_pirate | Shackled Pirate | 2 | 290 | 35 | 16 | 1.3513513513513513 | 39 | 0.07 | 62 |
| goblin_spearman | Goblin Lanceiro | 2 | 180 | 27 | 8 | 0.8620689655172414 | 60 | 0.12 | 62 |
| goblin_archer | Goblin Arqueiro | 2 | 180 | 20 | 8 | 0.8620689655172414 | 60 | 0.12 | 180 |
| goblin_rider | Goblin Montador | 3 | 290 | 27 | 26 | 1.075268817204301 | 74 | 0.07 | 62 |
| goblin_brute | Goblin Bruto | 3 | 290 | 35 | 16 | 1.075268817204301 | 49 | 0.07 | 34 |
| goblin_bomber | Goblin Bombardeiro | 3 | 180 | 35 | 8 | 1.639344262295082 | 60 | 0.12 | 145 |
| goblin_king | Rei Goblin | 4 | 360 | 20 | 26 | 1.3513513513513513 | 30 | 0.03 | 145 |
| orc_warrior | Orc Guerreiro | 3 | 290 | 27 | 38 | 1.3513513513513513 | 39 | 0.07 | 34 |
| orc_berserker | Orc Berserker | 3 | 290 | 35 | 16 | 0.8620689655172414 | 60 | 0.12 | 34 |
| orc_fighter | Orc Lutadora | 3 | 230 | 27 | 16 | 0.6802721088435374 | 60 | 0.18 | 34 |
| cave_troll | Troll da Caverna | 3 | 360 | 35 | 16 | 1.3513513513513513 | 49 | 0.07 | 62 |
| snow_troll | Troll das Neves | 4 | 290 | 20 | 26 | 1.3513513513513513 | 39 | 0.03 | 145 |
| troll | Troll | 4 | 360 | 45 | 38 | 1.639344262295082 | 30 | 0.03 | 62 |
| mountain_troll | Troll da Montanha | 4 | 360 | 45 | 26 | 1.639344262295082 | 49 | 0.07 | 62 |
| dark_elf_noble | Nobre Elfo Sombrio | 3 | 230 | 35 | 16 | 0.8620689655172414 | 60 | 0.25 | 34 |
| dark_elf_archer | Arqueiro Elfo Sombrio | 3 | 180 | 35 | 8 | 1.075268817204301 | 60 | 0.18 | 180 |
| dark_elf_warrior | Guerreiro Elfo Sombrio | 3 | 290 | 35 | 38 | 1.3513513513513513 | 49 | 0.12 | 62 |
| dark_elf_mage | Mago Elfo Sombrio | 4 | 180 | 27 | 8 | 1.3513513513513513 | 39 | 0.07 | 145 |
| feline_swordsman | Espadachim Meowri | 2 | 230 | 27 | 26 | 0.8620689655172414 | 60 | 0.12 | 34 |
| feline_rogue | Gatuno Meowri | 3 | 180 | 35 | 8 | 0.6802721088435374 | 74 | 0.25 | 34 |
| feline_arcanist | Feiticeiro Meowri | 3 | 180 | 20 | 16 | 1.075268817204301 | 49 | 0.07 | 145 |
| feline_drummer | Percussionista Meowri | 3 | 230 | 14 | 16 | 1.3513513513513513 | 49 | 0.03 | 145 |
| feline_fighter | Lutador Meowri | 2 | 230 | 27 | 16 | 0.6802721088435374 | 60 | 0.12 | 34 |
| elf_noble | Nobre Alto Elfo | 3 | 230 | 35 | 16 | 1.075268817204301 | 49 | 0.18 | 145 |
| elf_guardian | Guerreiro Alto Elfo | 3 | 360 | 20 | 38 | 1.3513513513513513 | 39 | 0.07 | 34 |
| elf_archer | Arqueiro Alto Elfo | 2 | 180 | 27 | 8 | 0.8620689655172414 | 60 | 0.12 | 180 |
| elf_halberdier | Lanceira Alta Elfa | 3 | 290 | 35 | 26 | 1.075268817204301 | 49 | 0.07 | 62 |
| woodland_predator | Predador Elfo da Floresta | 3 | 230 | 27 | 16 | 0.6802721088435374 | 74 | 0.18 | 34 |
| woodland_lancer | Guerreiro Elfo da Floresta | 2 | 230 | 27 | 26 | 1.075268817204301 | 60 | 0.07 | 62 |
| woodland_scout | Batedor Elfo da Floresta | 3 | 180 | 27 | 8 | 0.8620689655172414 | 74 | 0.18 | 180 |
| woodland_flailer | Guardião Elfo da Floresta | 3 | 290 | 35 | 26 | 1.3513513513513513 | 49 | 0.12 | 62 |
| flower_fairy | Fada das Flores | 3 | 180 | 14 | 8 | 1.075268817204301 | 74 | 0.03 | 145 |
| elf_harpist | Harpista Alta Elfa | 4 | 230 | 14 | 16 | 1.3513513513513513 | 49 | 0.03 | 145 |
| centaur_crossbow | Caçadora Centaura | 3 | 230 | 35 | 16 | 1.075268817204301 | 74 | 0.12 | 180 |
| centaur_lancer | Cavaleiro Centauro | 4 | 360 | 35 | 38 | 1.3513513513513513 | 74 | 0.07 | 62 |
| centaur_swordsman | Espadachim Centauro | 3 | 290 | 35 | 26 | 1.075268817204301 | 74 | 0.12 | 34 |
| sheriff | Xerife | 4 | 290 | 35 | 26 | 1.075268817204301 | 74 | 0.18 | 145 |
| bard | Barda | 3 | 230 | 14 | 16 | 1.3513513513513513 | 49 | 0.03 | 145 |
| gladiator | Gladiador | 3 | 290 | 27 | 38 | 1.075268817204301 | 39 | 0.07 | 62 |
| blackfang_guardian | Guardião Elfo Negro | 4 | 360 | 27 | 38 | 1.3513513513513513 | 30 | 0.07 | 62 |

### Skills, gatilhos e traits atuais

#### Warrior (`warrior`)

- Traits: Atacante, Defensor, Disciplinado.
- Skill: **Golpe circular** (active).
- Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Gira a espada e acerta todos os inimigos próximos. Mantém a habilidade atual como referência de dano em área.

#### Lancer (`lancer`)

- Traits: Atacante, Defensor, Ágil.
- Skill: **Investida da aurora** (active).
- Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Avança em linha curta até o alvo, perfurando inimigos no trajeto. O alvo final é empurrado para trás.

#### Bastion (`bastion`)

- Traits: Defensor, Guardião, Disciplinado.
- Skill: **Aqui ninguém passa** (active).
- Gatilho: `{"kind": "received", "limit": 6, "startFull": false}`.
- Efeito: Bate o escudo, afasta inimigos próximos e provoca os atingidos por 2 segundos, fazendo-os priorizar Bastion.

#### Shinobi (`shinobi`)

- Traits: Atacante, Ágil, Disciplinado.
- Skill: **Passo das sombras** (active).
- Gatilho: `{"kind": "time", "limit": 6, "startFull": false}`.
- Efeito: Teletransporta-se para trás do alvo atual e desfere um golpe. Se o espaço estiver ocupado, usa o ponto livre mais próximo.

#### Kinoichi (`kinoichi`)

- Traits: Atacante, Ágil, Aventureiro.
- Skill: **Corrente da lua** (active).
- Gatilho: `{"kind": "time", "limit": 7, "startFull": false}`.
- Efeito: Lança a corrente no inimigo mais distante dentro do alcance da skill e o puxa para perto, interrompendo sua ação atual.

#### Samurai (`samurai`)

- Traits: Atacante, Defensor, Disciplinado.
- Skill: **Corte do horizonte** (active).
- Gatilho: `{"kind": "damage", "limit": 4.5, "startFull": false}`.
- Efeito: Atravessa o alvo em uma arrancada reta, cortando os inimigos no percurso e terminando logo depois dele.

#### OmnaMusha (`omnamusha`)

- Traits: Atacante, Ágil, Disciplinado.
- Skill: **Dança das lâminas** (active).
- Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Desloca-se para uma lateral livre do alvo, corta e cruza para a outra lateral com um segundo corte. Não atravessa a arena inteira.

#### Ronin (`ronin`)

- Traits: Atacante, Disciplinado, Aventureiro.
- Skill: **Passo do contra-ataque** (active).
- Gatilho: `{"kind": "received", "limit": 3, "startFull": false}`.
- Efeito: Após resolver o terceiro golpe, dá um passo lateral e contra-ataca o agressor se ele estiver ao alcance da espada. O passo não anula o dano recebido.

#### Fighter (`fighter`)

- Traits: Atacante, Ágil, Disciplinado.
- Skill: **Combo ascendente** (active).
- Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Desfere dois socos no alvo e termina com um golpe que o empurra. Avança até a nova posição para manter a pressão.

#### Martial Artist (`martial_artist`)

- Traits: Atacante, Ágil, Guardião.
- Skill: **Varredura do dragão** (active).
- Gatilho: `{"kind": "received", "limit": 4, "startFull": false}`.
- Efeito: Gira o bastão em um arco frontal, atingindo e afastando os inimigos acertados. Depois recua um passo para recuperar distância.

#### Shaolin (`shaolin`)

- Traits: Defensor, Guardião, Disciplinado.
- Skill: **Postura serena** (passive).
- Gatilho: `{"kind": "block", "limit": 4, "startFull": false}`.
- Efeito: Bloqueia completamente o quarto ataque básico. Mantém a habilidade atual; dano de skill e efeitos contínuos não entram na contagem.

#### Cowboy (`cowboy`)

- Traits: Atirador, Atacante, Aventureiro.
- Skill: **Bala ricocheteante** (active).
- Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Atira no alvo atual e faz a bala ricochetear em até dois outros inimigos próximos. Cada inimigo pode ser atingido uma única vez.

#### Gunner (`gunner`)

- Traits: Atirador, Ágil, Aventureiro.
- Skill: **Disparo de recuo** (active).
- Gatilho: `{"kind": "received", "limit": 4, "startFull": false}`.
- Efeito: Recua um trecho curto na direção oposta ao alvo enquanto dispara um tiro potente. Se estiver junto à borda, busca espaço lateral.

#### Miner (`miner`)

- Traits: Atirador, Defensor, Aventureiro.
- Skill: **Pavio curto** (active).
- Gatilho: `{"kind": "time", "limit": 7, "startFull": false}`.
- Efeito: Arremessa dinamite na posição atual do alvo. Após 1 segundo ela explode, causando dano em área e empurrando inimigos para fora do centro.

#### Pirate Captain (`pirate_captain`)

- Traits: Atacante, Guardião, Aventureiro.
- Skill: **Bandeira de abordagem** (active).
- Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: Crava uma bandeira em sua posição. Por 4 segundos, aliados dentro da área recebem velocidade de ataque e proteção contra deslocamentos forçados.

#### Pirate (`pirate`)

- Traits: Atacante, Ágil, Aventureiro.
- Skill: **Gancho de abordagem** (active).
- Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Prende o gancho no alvo atual, puxa o próprio corpo até ele e golpeia. Se já estiver corpo a corpo, passa para um flanco livre antes do golpe.

#### Cannoneer (`cannoneer`)

- Traits: Atirador, Defensor, Aventureiro.
- Skill: **Tiro de dispersão** (active).
- Gatilho: `{"kind": "damage", "limit": 4.5, "startFull": false}`.
- Efeito: Dispara uma bala explosiva no alvo atual. A explosão atinge uma área e arremessa os atingidos para longe do ponto de impacto.

#### Ranger (`ranger`)

- Traits: Atirador, Disciplinado, Guardião.
- Skill: **Armadilha de caçador** (active).
- Gatilho: `{"kind": "time", "limit": 6, "startFull": false}`.
- Efeito: Coloca uma armadilha no chão à sua frente. O primeiro inimigo que entrar nela recebe dano e fica imobilizado por 1,5 segundo; a armadilha dura até 5 segundos.

#### Archer (`archer`)

- Traits: Atirador, Ágil, Aventureiro.
- Skill: **Chuva persistente** (active).
- Gatilho: `{"kind": "attacks", "limit": 6, "startFull": false}`.
- Efeito: Marca uma área na posição atual do alvo. Flechas caem em três ondas durante 2 segundos; inimigos podem entrar ou sair da zona.

#### Crossbowman (`crossbowman`)

- Traits: Atirador, Atacante, Disciplinado.
- Skill: **Virote de contenção** (active).
- Gatilho: `{"kind": "damage", "limit": 4, "startFull": false}`.
- Efeito: Dispara um virote que atravessa os inimigos em linha. O primeiro atingido fica imobilizado por 1 segundo; os demais recebem o dano.

#### Mage (`mage`)

- Traits: Arcano, Atacante, Disciplinado.
- Skill: **Orbes astrais** (active).
- Gatilho: `{"kind": "time", "limit": 7, "startFull": false}`.
- Efeito: Invoca três orbes que orbitam ao seu redor. Cada um dos próximos três ataques básicos lança um orbe no alvo, causando uma pequena explosão no impacto. Os orbes não recarregam a própria skill.

#### Sorceress (`sorceress`)

- Traits: Arcano, Ágil, Aventureiro.
- Skill: **Vórtice esmeralda** (active).
- Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: Abre um vórtice na posição atual do alvo. Durante 1,5 segundo, ele puxa gradualmente inimigos próximos para o centro e então explode.

#### Sage (`sage`)

- Traits: Arcano, Guardião, Disciplinado.
- Skill: **Resgate arcano** (active).
- Gatilho: `{"kind": "time", "limit": 7, "startFull": false}`.
- Efeito: Teletransporta o outro aliado com menor percentual de vida para um ponto livre na retaguarda e concede um escudo temporário. Se estiver sozinho, recebe apenas o escudo.

#### Priestess (`priestess`)

- Traits: Arcano, Guardião, Aventureiro.
- Skill: **Santuário de luz** (active).
- Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: Cria uma área sagrada em sua posição por 4 segundos. Aliados dentro dela recebem pequenas curas periódicas; na criação, remove um efeito negativo de cada aliado na área.

#### Cavalier (`cavalier`)

- Traits: Atacante, Defensor, Disciplinado.
- Skill: **Royal Charge** (active).
- Gatilho: `{"kind": "attacks", "limit": 6, "startFull": true}`.
- Efeito: Once per round, charge the nearest enemy. On contact, replace the opening basic attack with a strike for 180% attack and stun for 1 second. Control effects interrupt the charge.

#### Musketeer (`musketeer`)

- Traits: Atirador, Defensor, Disciplinado.
- Skill: **Armorbreaker Shot** (active).
- Gatilho: `{"kind": "attacks", "limit": 4, "startFull": false}`.
- Efeito: After 4 basic attacks, shoot the current target for 220% attack, ignoring 50% defense. Remain in position.

#### Swordsman (`swordsman`)

- Traits: Atacante, Ágil, Aventureiro.
- Skill: **Sundering Slash** (active).
- Gatilho: `{"kind": "damage", "limit": 4, "startFull": false}`.
- Efeito: After 5 basic attacks, slash a 90-degree cone over a range of 85, dealing 170% attack and reducing defense by 20% for 3 seconds. Repeated effects refresh duration.

#### Duelist (`duelist`)

- Traits: Atacante, Ágil, Disciplinado.
- Skill: **Perfect Riposte** (active).
- Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: After 5 basic attacks, take a defensive stance for 2 seconds. Block the next basic attack and counter for 180% attack if the attacker is within melee range. Skills are not blocked.

#### Viking (`viking`)

- Traits: Atacante, Defensor, Aventureiro.
- Skill: **Battle Fury** (passive).
- Gatilho: `{"kind": "health", "limit": 0.5, "startFull": false}`.
- Efeito: Attack 30% faster while at or below 50% health. The bonus ends when health rises above 50%.

#### Shieldmaiden (`shieldmaiden`)

- Traits: Defensor, Guardião, Aventureiro.
- Skill: **Stand Together** (active).
- Gatilho: `{"kind": "received", "limit": 5, "startFull": false}`.
- Efeito: After 5 basic attacks, shield yourself and the other ally with the lowest health percentage within 100 range for 15% of your maximum health for 4 seconds. Repeated shields keep the larger amount and refresh duration.

#### Shaman (`shaman`)

- Traits: Arcano, Guardião, Aventureiro.
- Skill: **Ancestral Totem** (active).
- Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: After 6 basic attacks, place a totem at your position for 5 seconds. Allies within 85 range attack 15% faster and recover 1% of their maximum health each second. One totem per caster; bonuses do not stack. Totems cannot be attacked and use no unit slot.

#### Berserker (`berserker`)

- Traits: Atacante, Ágil, Aventureiro.
- Skill: **Bloodied Axes** (active).
- Gatilho: `{"kind": "damage", "limit": 4, "startFull": false}`.
- Efeito: After 5 basic attacks, strike the current target twice for 90% attack each. Recover 25% of the actual health damage dealt by these strikes; shields and excess damage do not count.

#### Huntress (`huntress`)

- Traits: Atirador, Ágil, Aventureiro.
- Skill: **Marked Prey** (active).
- Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: After 5 basic attacks, throw a spear for 150% attack and mark the target for 4 seconds. The target takes 15% more damage from allied basic attacks. Repeated marks refresh duration without stacking.

#### Glutton (`glutton`)

- Traits: Defensor, Guardião, Aventureiro.
- Skill: **Snack Break** (active).
- Gatilho: `{"kind": "received", "limit": 6, "startFull": false}`.
- Efeito: After 4 basic attacks, recover 20% of your maximum health, up to full health.

#### Bear Druid (`bear_druid`)

- Traits: Arcano, Defensor, Guardião.
- Skill: **Ursine Roar** (active).
- Gatilho: `{"kind": "received", "limit": 5, "startFull": false}`.
- Efeito: After 5 basic attacks, reduce the attack of enemies within 85 range by 20% for 3 seconds and take 15% less damage for 3 seconds. Repeated effects refresh duration; total damage reduction is capped at 65%.

#### Eagle Druid (`eagle_druid`)

- Traits: Arcano, Ágil, Aventureiro.
- Skill: **Skyfall** (active).
- Gatilho: `{"kind": "time", "limit": 6, "startFull": false}`.
- Efeito: After 5 basic attacks, leap to the farthest enemy within 180 range and deal 170% attack in a radius of 35 on landing. Land in the nearest free space and remain there. You can take damage during the leap.

#### Pirate Admiral (`pirate_admiral`)

- Traits: Atacante, Defensor, Aventureiro.
- Skill: **Deckbreaker** (active).
- Gatilho: `{"kind": "received", "limit": 6, "startFull": false}`.
- Efeito: After 5 basic attacks, slam the ground at the current target, dealing 200% attack within 65 range of impact and stunning enemies for 1 second.

#### Shackled Pirate (`shackled_pirate`)

- Traits: Atacante, Guardião, Aventureiro.
- Skill: **Chain Sweep** (active).
- Gatilho: `{"kind": "received", "limit": 4, "startFull": false}`.
- Efeito: After 5 basic attacks, swing the chain around yourself, dealing 150% attack within 65 range and slowing enemy movement by 30% for 3 seconds. Repeated slows refresh duration without stacking.

#### Goblin Lanceiro (`goblin_spearman`)

- Traits: Atacante, Ágil, Aventureiro.
- Skill: **Estocada traiçoeira** (active).
- Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Causa 160% do ataque ao alvo e recua 35 unidades.

#### Goblin Arqueiro (`goblin_archer`)

- Traits: Atirador, Ágil, Aventureiro.
- Skill: **Flecha farpada** (active).
- Gatilho: `{"kind": "attacks", "limit": 6, "startFull": false}`.
- Efeito: Causa 140% do ataque e reduz o movimento do alvo em 30% por 3 segundos.

#### Goblin Montador (`goblin_rider`)

- Traits: Atacante, Defensor, Ágil.
- Skill: **Atropelo** (active).
- Gatilho: `{"kind": "attacks", "limit": 6, "startFull": true}`.
- Efeito: Começa carregado. Avança pelo chão, causa 160% do ataque e empurra o alvo 45 unidades, acompanhando o avanço. Controle interrompe a investida.

#### Goblin Bruto (`goblin_brute`)

- Traits: Atacante, Defensor, Aventureiro.
- Skill: **Pancada brutal** (active).
- Gatilho: `{"kind": "received", "limit": 5, "startFull": false}`.
- Efeito: Causa 170% do ataque ao alvo e atordoa por 0,8 segundo.

#### Goblin Bombardeiro (`goblin_bomber`)

- Traits: Atirador, Ágil, Aventureiro.
- Skill: **Bomba incendiária** (active).
- Gatilho: `{"kind": "time", "limit": 7, "startFull": false}`.
- Efeito: Após 1 segundo, a bomba explode por 150% do ataque em raio 55. Deixa fogo por 3 segundos, causando 20% do ataque por segundo.

#### Rei Goblin (`goblin_king`)

- Traits: Defensor, Guardião, Aventureiro.
- Skill: **Ordem do rei** (active).
- Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: Aliados em raio 110, incluindo o rei, recebem +15% de ataque e velocidade de ataque por 4 segundos. Rei, liteira e carregadores são uma unidade.

#### Orc Guerreiro (`orc_warrior`)

- Traits: Atacante, Defensor, Disciplinado.
- Skill: **Escudo de guerra** (active).
- Gatilho: `{"kind": "received", "limit": 5, "startFull": false}`.
- Efeito: Recebe escudo de 15% da própria vida máxima por 4 segundos e empurra o alvo em alcance curto 30 unidades.

#### Orc Berserker (`orc_berserker`)

- Traits: Atacante, Ágil, Aventureiro.
- Skill: **Caçada sangrenta** (active).
- Gatilho: `{"kind": "damage", "limit": 4, "startFull": false}`.
- Efeito: Avança até o inimigo com menor percentual de vida em alcance 120 e golpeia por 180% do ataque. Sem candidato, usa o alvo atual.

#### Orc Lutadora (`orc_fighter`)

- Traits: Atacante, Ágil, Disciplinado.
- Skill: **Lâminas cruzadas** (active).
- Gatilho: `{"kind": "attacks", "limit": 6, "startFull": false}`.
- Efeito: Dois cortes no alvo, cada um por 100% do ataque, ignorando 25% da defesa.

#### Troll da Caverna (`cave_troll`)

- Traits: Atacante, Defensor, Guardião.
- Skill: **Carne regenerativa** (passive).
- Gatilho: `{"kind": "passive", "limit": 0, "startFull": false}`.
- Efeito: Após 3 segundos sem receber dano à vida, regenera 2% da vida máxima por segundo. Novo dano à vida interrompe a regeneração.

#### Troll das Neves (`snow_troll`)

- Traits: Arcano, Defensor, Guardião.
- Skill: **Proteção ancestral** (active).
- Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: Cura a si e aliados em raio 85 em 8% da vida máxima de cada um e concede 10% de redução de dano por 3 segundos.

#### Troll (`troll`)

- Traits: Defensor, Guardião, Aventureiro.
- Skill: **Queda da rocha** (active).
- Gatilho: `{"kind": "received", "limit": 6, "startFull": false}`.
- Efeito: Atinge o chão junto ao alvo por 180% do ataque em raio 65 e imobiliza por 1,2 segundo.

#### Troll da Montanha (`mountain_troll`)

- Traits: Atacante, Defensor, Aventureiro.
- Skill: **Investida demolidora** (active).
- Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: Avança até 120 unidades rumo ao alvo. Atinge cada inimigo no trajeto uma vez por 170% do ataque e o empurra 45 unidades.

#### Nobre Elfo Sombrio (`dark_elf_noble`)

- Traits: Atacante, Ágil, Disciplinado.
- Skill: **Passo sombrio** (active).
- Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Teleporta para um espaço livre atrás do alvo e golpeia por 180% do ataque. Sem invulnerabilidade.

#### Arqueiro Elfo Sombrio (`dark_elf_archer`)

- Traits: Atirador, Ágil, Disciplinado.
- Skill: **Flecha executora** (active).
- Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Atira no inimigo com menor percentual de vida em alcance 180 por 180% do ataque, ou 240% se estiver abaixo de 30% de vida.

#### Guerreiro Elfo Sombrio (`dark_elf_warrior`)

- Traits: Atacante, Defensor, Disciplinado.
- Skill: **Guarda punitiva** (active).
- Gatilho: `{"kind": "received", "limit": 5, "startFull": false}`.
- Efeito: Corta um cone de 90 graus e alcance 85 por 160% do ataque. Recebe 20% de redução de dano por 3 segundos.

#### Mago Elfo Sombrio (`dark_elf_mage`)

- Traits: Arcano, Atacante, Disciplinado.
- Skill: **Grilhões arcanos** (active).
- Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: Atinge uma área de raio 55 na posição do alvo por 150% do ataque e imobiliza por 1,5 segundo.

#### Espadachim Meowri (`feline_swordsman`)

- Traits: Atacante, Ágil, Aventureiro.
- Skill: **Estocada audaz** (active).
- Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Causa 160% do ataque ao alvo e ganha 20% de velocidade de ataque por 3 segundos.

#### Gatuno Meowri (`feline_rogue`)

- Traits: Atacante, Ágil, Disciplinado.
- Skill: **Salto traiçoeiro** (active).
- Gatilho: `{"kind": "attacks", "limit": 6, "startFull": false}`.
- Efeito: Salta atrás do alvo e desfere dois golpes de 90% do ataque; cada golpe causa 110% se o alvo estiver mirando outro aliado.

#### Feiticeiro Meowri (`feline_arcanist`)

- Traits: Arcano, Guardião, Disciplinado.
- Skill: **Égide esmeralda** (active).
- Gatilho: `{"kind": "time", "limit": 7, "startFull": false}`.
- Efeito: Protege o aliado com menor percentual de vida com escudo de 20% da vida máxima do conjurador por 4 segundos. Enquanto o escudo durar, o protegido ganha 15% de velocidade de ataque.

#### Percussionista Meowri (`feline_drummer`)

- Traits: Arcano, Ágil, Aventureiro.
- Skill: **Ritmo da marcha** (active).
- Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: Aliados em raio de 110, incluindo o conjurador, ganham 15% de velocidade de ataque e 20% de movimento por 4 segundos.

#### Lutador Meowri (`feline_fighter`)

- Traits: Atacante, Ágil, Guardião.
- Skill: **Sequência de garras** (active).
- Gatilho: `{"kind": "attacks", "limit": 6, "startFull": false}`.
- Efeito: Desfere três golpes de 65% do ataque. O último empurra o alvo 30 unidades e o lutador o acompanha.

#### Nobre Alto Elfo (`elf_noble`)

- Traits: Atirador, Disciplinado, Aventureiro.
- Skill: **Disparo de comando** (active).
- Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Dispara por 180% do ataque. Os dois outros aliados mais próximos ganham 15% de ataque por 3 segundos, sem mudar seus alvos.

#### Guerreiro Alto Elfo (`elf_guardian`)

- Traits: Defensor, Guardião, Disciplinado.
- Skill: **Muralha rubra** (active).
- Gatilho: `{"kind": "received", "limit": 5, "startFull": false}`.
- Efeito: Após receber 5 ataques básicos, reduz o próprio dano recebido em 25% e o dos outros aliados em raio de 85 em 15%, por 3 segundos.

#### Arqueiro Alto Elfo (`elf_archer`)

- Traits: Atirador, Atacante, Disciplinado.
- Skill: **Flecha solar** (active).
- Gatilho: `{"kind": "attacks", "limit": 6, "startFull": false}`.
- Efeito: Atinge até três inimigos em linha: o primeiro recebe 170% do ataque e os demais, 100%.

#### Lanceira Alta Elfa (`elf_halberdier`)

- Traits: Atacante, Defensor, Disciplinado.
- Skill: **Varredura da aurora** (active).
- Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Causa 160% do ataque em cone frontal de alcance 85 e empurra os alvos 35 unidades. Permanece no lugar.

#### Predador Elfo da Floresta (`woodland_predator`)

- Traits: Atacante, Ágil, Aventureiro.
- Skill: **Caçada implacável** (passive).
- Gatilho: `{"kind": "passive", "limit": 0, "startFull": false}`.
- Efeito: Cada ataque básico consecutivo no mesmo alvo concede 5% de velocidade de ataque, até 30%. Trocar de alvo reinicia o bônus.

#### Guerreiro Elfo da Floresta (`woodland_lancer`)

- Traits: Atacante, Defensor, Ágil.
- Skill: **Ponta dupla** (active).
- Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Causa 150% do ataque ao alvo principal e 100% a um segundo inimigo próximo. Sem segundo alvo, não há golpe adicional.

#### Batedor Elfo da Floresta (`woodland_scout`)

- Traits: Atirador, Ágil, Aventureiro.
- Skill: **Disparo evasivo** (active).
- Gatilho: `{"kind": "time", "limit": 6, "startFull": false}`.
- Efeito: Recua 45 unidades e dispara por 150% do ataque, reduzindo o movimento do alvo em 30% por 3 segundos.

#### Guardião Elfo da Floresta (`woodland_flailer`)

- Traits: Atacante, Defensor, Aventureiro.
- Skill: **Quebra-guarda** (active).
- Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Causa 180% do ataque e reduz a defesa em 25% por 4 segundos. O golpe causa 50% de dano adicional somente à parcela absorvida por escudos.

#### Fada das Flores (`flower_fairy`)

- Traits: Arcano, Ágil, Guardião.
- Skill: **Pólen restaurador** (active).
- Gatilho: `{"kind": "time", "limit": 7, "startFull": false}`.
- Efeito: Move-se para perto do aliado com menor percentual de vida, cura 12% da vida máxima dele e remove lentidão e enraizamento. Não remove atordoamento nem revive.

#### Harpista Alta Elfa (`elf_harpist`)

- Traits: Arcano, Guardião, Disciplinado.
- Skill: **Canção do alvorecer** (active).
- Gatilho: `{"kind": "time", "limit": 9, "startFull": false}`.
- Efeito: Canaliza três pulsos durante 3 segundos. Cada pulso cura 4% da vida máxima dos aliados em raio de 110. Atordoamento ou morte interrompem os pulsos restantes.

#### Caçadora Centaura (`centaur_crossbow`)

- Traits: Atirador, Ágil, Disciplinado.
- Skill: **Rajada a galope** (active).
- Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Desloca-se 50 unidades lateralmente enquanto dispara três tiros de 70% do ataque no alvo. Continua vulnerável durante o movimento.

#### Cavaleiro Centauro (`centaur_lancer`)

- Traits: Atacante, Defensor, Guardião.
- Skill: **Investida protetora** (active).
- Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: Avança até 120 unidades contra o inimigo próximo do outro aliado com menor percentual de vida, causa 170% do ataque e provoca por 2 segundos. Sem alvo elegível, busca o alvo atual.

#### Espadachim Centauro (`centaur_swordsman`)

- Traits: Atacante, Ágil, Aventureiro.
- Skill: **Corte de passagem** (active).
- Gatilho: `{"kind": "attacks", "limit": 6, "startFull": false}`.
- Efeito: Atravessa o alvo, causa 170% do ataque e termina 45 unidades atrás dele, em espaço livre. Atinge apenas esse alvo.

#### Xerife (`sheriff`)

- Traits: Atirador, Disciplinado, Aventureiro.
- Skill: **Laço da lei** (active).
- Gatilho: `{"kind": "time", "limit": 7, "startFull": false}`.
- Efeito: Laça o inimigo mais distante em alcance 180, puxa até 60 unidades, dispara por 160% do ataque e enraíza por 1 segundo. Cavalo e cavaleiro são uma unidade.

#### Barda (`bard`)

- Traits: Arcano, Guardião, Aventureiro.
- Skill: **Balada heroica** (active).
- Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: Aliados em raio de 110, incluindo a Barda, ganham 15% de ataque e 20% de poder de habilidade por 4 segundos. Ataques básicos são notas musicais.

#### Gladiador (`gladiator`)

- Traits: Atacante, Defensor, Disciplinado.
- Skill: **Resposta da arena** (active).
- Gatilho: `{"kind": "received", "limit": 5, "startFull": false}`.
- Efeito: Após receber 5 ataques básicos, contra-ataca o agressor em alcance 62, ou o alvo atual nesse alcance, por 180% do ataque e reduz seu ataque em 20% por 3 segundos.

#### Guardião Elfo Negro (`blackfang_guardian`)

- Traits: Defensor, Guardião, Disciplinado.
- Skill: **Bastião sombrio** (active).
- Gatilho: `{"kind": "received", "limit": 6, "startFull": false}`.
- Efeito: Após receber 6 ataques básicos, causa 140% do ataque em cone frontal de alcance 85 e provoca os atingidos por 2 segundos. Recebe escudo de 20% da própria vida máxima por 4 segundos.

### Relíquias existentes

| ID | Nome | Efeito |
|---|---|---|
| banner | Estandarte antigo | Todos os aliados têm +8% de ataque. |
| heart | Pedra vital | Todos os aliados têm +10% de vida. |
| scope | Lente do viajante | Atiradores ganham +15% de ataque. |
| tome | Tomo das estrelas | Arcanos ganham +25% de poder de habilidade. |
| boots | Botas do vento | Ágeis ganham +20% de movimento e +10% de velocidade de ataque. |
| shield | Selo de proteção | Defensores recebem 10% menos dano. |
| precision | Medalhão da precisão | Todos os aliados: +5 pontos percentuais de chance crítica. Até +20 pontos por esta relíquia. |
| hourglass | Ampulheta de combate | Uma unidade aliada aleatória elegível começa cada rodada com 50% da carga da habilidade. Contagens inteiras arredondam para baixo. Não acumula. |
| recovery | Broche da recuperação | Todos os aliados vivos recuperam 1% da vida máxima a cada 3 segundos. Até 3% por pulso. |
| merchant | Moeda do mercador | Cartas e relíquias na loja custam 15% menos. Desconto máximo de 30%; preço arredondado para cima. |
| quickstart | Quick Start | Gain 2 extra energy in the first preparation of each encounter. |
| spark | Everlasting Spark | Gain 1 extra energy in every preparation, including the first. |
| luckycharm | Lucky Charm | Gain 20% more run gold from rewards. Does not affect diamonds or refunds. |
| plating | Reinforced Plating | All allies take 5% less damage. |
| laststand | Last Stand | Once per round, the first ally taking lethal damage survives with 1 health. |
| repulsion | Repulsion Seal | Once per round, the first ally crossing 15% health pushes nearby enemies away. |
| fang | Vampiric Fang | Basic attacks heal their attacker for 5% of health damage dealt. |
| execution | Executioner’s Mark | Deal 15% more damage to enemies below 30% health. |
| ember | Vengeful Ember | Each fallen ally grants survivors 5% more attack damage this round, up to 15%. |
| bell | Opening Bell | All allies attack 15% faster during the first 5 seconds of each round. |

### Decks emprestados existentes

| ID | Nome |
|---|---|
| vanguard | Vanguarda da passagem |
| balanced | Encontro de caminhos |
| swift | Ventos do acaso |
| arcane | Pacto dos guardiões |
| outlaws | Companhia da estrada |
| fortress | Fortaleza viva |
| blades | Dança das lâminas |
| fireline | Linha de fogo |
| astral | Círculo astral |
| corsair | Companhia corsária |

## 17. Registro desta atualização

Atualização documental de 30/10/2026: skill tree identificada como próxima etapa; roadmap corrigido segundo a premissa do usuário; maldições/eventos adicionados; raids e traits classificados como sistemas existentes; balanceamento amplo por último; regras v43 e limites de procedência consolidados. Nenhuma alteração de jogo, save, acesso ou publicação efetuada.
