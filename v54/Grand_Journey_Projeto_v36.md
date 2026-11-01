# Grand Journey — fonte de continuidade do projeto

Versão de conteúdo: **v36**. Criador e Game Designer: **Carlos Felipe Sylla**. Este documento consolida a implementação e as decisões deste chat até a adoção da VT323. Substitui as referências v17/v25 e os documentos posteriores que acumulavam históricos contraditórios. O código atual é a autoridade para números e regras; as propostas futuras estão separadas abaixo.

## 1. Identidade, entrega e autorização

Grand Journey é um auto-battler roguelite de cartas, single-player, pensado para celular na vertical. Referências: Rift Wars no combate e caminhos de Slay the Spire. Estratégia por composição, posicionamento, sinergias, cartas e relíquias. Interface em azul-marinho e dourado; anime chibi em cartas/menus e pixel art no campo.

- Site existente: https://grand-journey.soundbat256.chatgpt.site
- Project ID: `appgprj_6ad92678b86081918ef5cc54c09cc04f`.
- Entrega web estática com HTML, JS, CSS e mídia separados. Não é um projeto Godot; não confundir com Arkin/Deckmon.
- Preservar a audiência customizada, o proprietário e os convidados existentes. Não criar outro Site para continuar este projeto.
- Português nas conversas e documentação; inglês como idioma padrão do jogo, com PT-BR selecionável e persistente.
- **Só implementar/publicar quando Carlos autorizar explicitamente uma atualização.** Relatos de bugs, novas ideias, preferências e pedidos de “ainda não faça” ficam pendentes. Nunca publicar automaticamente ao receber um relato.
- Respostas curtas; não pedir novamente permissões já concedidas. Quando houver autorização, completar implementação, verificação e publicação.

## 2. Tipografia e padrões permanentes de interface

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

Confrontos normais/elites terminam quando qualquer lado vence **três rodadas**; Boss exige **quatro**. Empates não dão ponto; não há limite fixo de rodadas. Uma rodada tem preparo sem cronômetro e combate automático. O inimigo permanece oculto até o início do combate.

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
- Velocidades: **×1, ×1,5 e ×2**, persistentes entre rodadas/confrontos e ao recarregar neste navegador. Não reintroduzir ×3.
- Alvo básico: inimigo mais próximo, salvo provocação e regras específicas de skill.
- Aos 40 segundos simulados, dano ×5; aos 120, empate. Relógio acompanha a velocidade.
- Danos/curas do mesmo passo resolvidos em conjunto. Escudos absorvem antes da vida. Crítico básico ×1,5; chance até 75%; defesa usa `100/(100+defesa efetiva)`; redução adicional combinada limitada a 65%.
- A cada rodada, unidades vinculadas revivem com vida cheia; formação, banco e fusão permanecem. Efeitos temporários e carga são reiniciados conforme a skill/relíquias. Novo confronto limpa campo/banco/fusões/mão/congelamento/energia; mantém cartas originais, upgrades, ouro e relíquias da run.

## 4. Cartas, ciclo, upgrades e fusão

- Deck emprestado/customizado começa com 20 cartas; máximo de **quatro cópias físicas por personagem**, somando níveis e constituintes de fusão. A run pode crescer além de 20.
- Decks emprestados usam oito tipos com multiplicidades 3/3/3/3/2/2/2/2. Perfil novo começa com Vanguarda da passagem e libera Encontro de caminhos/Ventos do acaso por Primeiros passos.
- Mão de até quatro cartas. Cartas pagas no campo/banco ficam vinculadas, fora de compra/descarte, mesmo derrotadas. Quando a compra acaba, embaralhar o descarte. Não revelar a ordem futura no Card Cycle.
- Refresh Hand custa uma energia e pode repetir enquanto houver saldo/mão. Descarta e recompõe até quatro, respeitando os vínculos.
- Freeze é gratuito e disponível só no preparo. Preserva a mão restante para a próxima rodada, compra apenas as vagas e desativa no novo preparo. Confronto novo limpa a opção.
- Retirar unidade envia ao descarte e reembolsa metade do custo arredondada para baixo. Fusões devolvem as três cartas e a soma dos três reembolsos individuais.
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

## 6. Blackfang — implementado e oculto até desbloquear

São 55 personagens: 38 do roster anterior e **17 Blackfang**. Blackfang não é uma pendência de implementação.

- Duas forças opcionais nas camadas 5/10, sorteadas sem repetir entre Incursão Goblin, Vanguarda Brutal e Companhia Sombria.
- Vencer as duas forças Blackfang distintas habilita o Boss **Corte Blackfang / Rei Goblin** na camada 15. Contar vitórias de confronto, sem duplicar ao recarregar ou ganhar outra rodada.
- Com zero/uma vitória, usar o fallback já implementado; não criar Dawncrest/monstro inexistente como substituição.
- Primeira vitória contra o Boss Blackfang desbloqueia permanentemente o catálogo/booster Blackfang. **Não entregar cópia grátis da carta do Boss nem outra carta.**
- Antes disso, ocultar cartas e referências dos pools/listagens do jogador: loja permanente, coleção, boosters, contadores, previews, Hacks, treino, recrutamento e loja da run. Consulta dos inimigos encontrados é permitida.
- Run guarda disponibilidade no começo (`blackfangAvailable`); desbloquear afeta pools de novas runs. Não alterar retroativamente a disponibilidade da run em andamento.
- `campaignRoute` usa ato 1 e estrutura para futura expansão. Saves anteriores sem essa estrutura preservam o mapa antigo.
- Ícone/brasão do nó não deve ter o quadrado vermelho externo removido na v28.

Nomes corrigidos e IDs: Goblin Montador (`goblin_rider`), Orc Lutadora (`orc_fighter`), Nobre Elfo Sombrio (`dark_elf_noble`). Troll azul segurando pedra = `troll` (antigo “Ogro”); Troll da Caverna = `cave_troll` (antigo “Troll guerreiro”); Troll das Neves = `snow_troll` (antigo “Troll ancião”); Troll da Montanha = `mountain_troll` (antigo “Minotauro”). Usar os assets reais aprovados; não inventar personagens pelo desenho.

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

Save local ao navegador/aparelho/origem, sem sincronização entre dispositivos. Perfil schema 1; estado da run e `gameVersion` seguem 20 por compatibilidade, apesar do conteúdo v36. Manter export/import JSON, recuperação local/IndexedDB e marcadores de reset. Batalha interrompida retorna ao preparo. Preservar vínculos, banco, fusões, ordem de implantação, Bag, mão congelada, tutorial e rota. Não apagar save inválido sem tentativa de recuperação válida.

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

Vencer rodada dá um ponto. Vencer confronto completa o limiar real (três normal/elite, quatro Boss). Usar o fluxo normal de resultado/relatórios/recompensa/progressão, uma vez. Não inventar dano para o relatório nem premiar rodada como confronto.

Tutorial guiado em três rodadas: posicionamento, traits, energia, capacidade, ataques/especial/velocidade, banco, arraste, retirada, refresh, informação, View deck, Card Cycle, freeze/fusão, mapa e Bag. Durante a espera do combate, mensagem/escurecimento somem após três segundos reais; ao encerrar a rodada o fluxo retorna. Realce acompanha o elemento correto durante animação/rolagem, inclusive Confirm bag. Vital Stone guiada é recompensa temporária única. Replay é isolado e restaura a run original; pode concluir Primeiros passos sem dar recursos/estatísticas.

Resultado: placar e próxima ação acima de quatro tabelas em grade 2×2 (dano causado/recebido de cada equipe). Rodadas intermediárias mostram a rodada; encerramento mostra acumulado do confronto. Cópias separadas e identificadas; ordenar por dano. Contar dano efetivo à vida, excluindo escudo e excesso.

## 11. Bugs resolvidos e limites de verificação

- Animação experimental do Warrior da v27 foi rejeitada/removida. **Warrior usa sprite estático**; não reintegrar animações de outros chats automaticamente.
- v30: caminhada com desvio evita aliados e não transfere empurrão ao alvo. Knockback de skills continua separado.
- v32: corpo a corpo parado sem bater era causado por distância `34.00000000000001` versus alcance 34. Comparação ganhou tolerância `1e-7`. Testes anteriores reproduziram 10/24 falhas; 576 combinações corrigidas atacam/carregam, incluindo Warrior/Fighter contra trolls. Não aumentar alcance de forma perceptível.
- Troll da Caverna: mantém regeneração real de 2% da vida máxima/segundo após três segundos sem dano à vida. Exibição acumula cura efetiva e limita texto/efeito a cada 0,5s simulado; não gerar spam de +0 ou efeitos com vida cheia. Não nerfar a cura para consertar a apresentação.
- Retrato Dark Elf Warrior e arte Dark Elf Noble tinham arquivos vazios, restaurados na v31. Orc Berserker recebeu retrato reexportado/versionado na v33; o original decodificava localmente, causa exata no Android não reproduzida.
- Browser QA foi feito em larguras de celular via iframe, sem Android físico. Não tratar isso como garantia de correção definitiva no aparelho.

## 12. Pendências futuras — não autorizadas por este documento

| Tema | Decisão registrada |
| --- | --- |
| Três atos/mapas | Expandir depois de desenvolver os sistemas com um mapa só. Cada ato terá um boss; o terceiro terá o final boss. Não expandir automaticamente. |
| Dawncrest e monstros | Ainda não implementados. Artes em outros chats não autorizam integração, fichas ou novos bosses. |
| Energia para iniciar run | Ideia validada: custo 5, capacidade 30, recuperação +1 a cada três minutos. Não implementada. Separada da energia de combate. |
| Hack de energia | Futuro junto do sistema de energia da run. Não implementado. |
| Login diário | Sequência: +1 diamante nos dias 1–6, +7 no dia 7. Faltar um dia reinicia. Popup do prêmio, dia atual e próximos prêmios. Não implementado. |
| Essência / excedentes | Nome escolhido: **Essência**. Queimar cópias excedentes para comprar cosméticos/skins em aba do Shop; escolher skin na Collection. **Menor prioridade de todas**; não implementado. |
| Outros | Skill tree/expansão da Bag, bônus permanentes, histórico analítico, sincronização e PWA/offline continuam futuros. |

Não há correção deste chat deixada propositalmente pendente ao fechar a v36. Novos bugs relatados depois da entrega devem ser registrados e só implementados com autorização.

## 13. Retomada técnica no novo Work

Reutilizar o Site e sua fonte Git pelo plugin Sites. Ler `AGENTS.md` e este documento. No ambiente anterior o checkout era `/workspace/scratch/ee390afa69ac/site-review`; esse caminho pode não existir na próxima sessão. Se ausente, abrir a fonte do mesmo Project ID, sem recriar o Site. As pastas `project_sources`/`upload` eram anexos de sessão, não a fonte de produção.

| Arquivo | Responsabilidade |
| --- | --- |
| `.openai/hosting.json` | identidade do Site e diretório estático `dist` |
| `dist/game-0.js` | engine, dados, combate, rota, progressão |
| `dist/game-1.js`, `blackfang-assets.js` | referências de mídia dos personagens |
| `dist/game-2.js` | apresentação de sprites/retratos |
| `dist/game-4.js` | canvas e efeitos/textos de combate |
| `dist/game-5.js` | I18n e tradução de callouts |
| `dist/game-7.js` | interface principal, saves, menus, Hacks e relatórios |
| `dist/game-8.js` | arraste do elenco |
| `dist/game-9.js`, `vfx-data.js` | atlas de efeitos |
| `dist/game-10.js`, `tutorial-flow.js` | tutorial e coach |
| `dist/bag-drag.js` | arraste da Bag |
| `dist/battle-speed.js` | opções e persistência da velocidade |
| `dist/cycle-data.js` | identificação das cartas por pilha |
| `dist/training-engine.js`, `training-ui.js` | treino isolado e interface |
| `dist/style.css`, `index.html` | estilos, fontes, ordem de scripts, versão/cache |
| `scripts/blackfang-data-v26.json` | dados de origem e assets Blackfang |
| `tests/*.cjs` | regressões focadas por sistema/versão |

Usar o fluxo Sites para abrir a fonte, editar, verificar, sincronizar Git, empacotar e publicar versão salva. Não vazar credenciais. Preservar audiência. Número da versão da hospedagem é diferente de v36; copiar IDs opacos das respostas/manifesto. Não depender do histórico longo deste chat ou dos documentos v17/v25 para contradizer decisões aqui consolidadas.

Executar testes apropriados à alteração. Casos úteis: `tests/revisions-v33.cjs` (Hacks e idiomas), `tests/training-v31.cjs`, `tests/revisions-v32.cjs` (melee/regen/velocidade), `tests/blackfang-v26.cjs`, `tests/interface-v28.cjs`, `tests/update-v29.cjs` e `tests/tutorial-v25.cjs`. Não repetir testes amplos sem motivo. Fixtures de QA devem sair antes de empacotar.

Os anexos seguintes são extraídos do código da v36 para evitar copiar tabelas antigas. Contêm conteúdo Blackfang oculto: são documentação de desenvolvimento e não devem aparecer para o jogador antes do desbloqueio.


## Anexo A — Atributos-base dos 55 personagens

Valores sem upgrades, fusão, traits, relíquias ou escala inimiga. Alcance e velocidade em coordenadas lógicas da simulação. C/U/R/UR são raridades, não ranks de fusão.

| ID | Personagem | Raridade | Energia | Vida | Ataque | Defesa | Ataques/s | Movimento | Crítico | Alcance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| warrior | Warrior | C | 2 | 290 | 27 | 26 | 0.93 | 49 | 7% | 34 |
| lancer | Lancer | C | 2 | 230 | 27 | 26 | 0.93 | 60 | 7% | 62 |
| bastion | Bastion | C | 3 | 360 | 20 | 52 | 0.61 | 30 | 3% | 34 |
| shinobi | Shinobi | R | 3 | 180 | 35 | 8 | 1.47 | 74 | 25% | 34 |
| kinoichi | Kinoichi | U | 3 | 180 | 27 | 16 | 1.16 | 74 | 18% | 62 |
| samurai | Samurai | U | 3 | 290 | 35 | 38 | 0.74 | 49 | 12% | 34 |
| omnamusha | OmnaMusha | U | 3 | 230 | 27 | 26 | 1.47 | 60 | 18% | 34 |
| ronin | Ronin | R | 3 | 230 | 45 | 16 | 0.74 | 49 | 25% | 34 |
| fighter | Fighter | C | 2 | 290 | 27 | 16 | 1.47 | 60 | 12% | 34 |
| martial_artist | Martial Artist | C | 2 | 230 | 27 | 26 | 1.16 | 60 | 7% | 62 |
| shaolin | Shaolin | UR | 3 | 290 | 20 | 38 | 0.93 | 49 | 3% | 34 |
| cowboy | Cowboy | C | 2 | 230 | 27 | 16 | 1.16 | 49 | 25% | 145 |
| gunner | Gunner | C | 3 | 180 | 35 | 8 | 0.93 | 49 | 18% | 180 |
| miner | Miner | C | 2 | 290 | 35 | 16 | 0.74 | 39 | 7% | 62 |
| pirate_captain | Pirate Captain | R | 4 | 290 | 27 | 26 | 0.93 | 49 | 12% | 145 |
| pirate | Pirate | C | 2 | 230 | 27 | 16 | 1.16 | 60 | 18% | 34 |
| cannoneer | Cannoneer | C | 4 | 290 | 45 | 26 | 0.61 | 30 | 3% | 180 |
| ranger | Ranger | C | 2 | 230 | 27 | 16 | 0.93 | 60 | 12% | 145 |
| archer | Archer | C | 2 | 180 | 20 | 8 | 1.47 | 60 | 12% | 180 |
| crossbowman | Crossbowman | C | 3 | 230 | 45 | 26 | 0.61 | 39 | 18% | 180 |
| mage | Mage | C | 4 | 180 | 27 | 8 | 0.74 | 39 | 3% | 145 |
| sorceress | Sorceress | R | 4 | 180 | 20 | 8 | 0.93 | 49 | 7% | 145 |
| sage | Sage | UR | 3 | 230 | 14 | 26 | 0.74 | 30 | 3% | 145 |
| priestess | Priestess | U | 4 | 180 | 20 | 16 | 0.93 | 49 | 3% | 145 |
| cavalier | Cavalier | R | 4 | 360 | 35 | 38 | 0.74 | 74 | 7% | 62 |
| musketeer | Musketeer | U | 3 | 230 | 45 | 26 | 0.61 | 39 | 12% | 180 |
| swordsman | Swordsman | U | 3 | 290 | 45 | 16 | 0.74 | 49 | 12% | 62 |
| duelist | Duelist | R | 3 | 230 | 27 | 16 | 1.47 | 60 | 25% | 34 |
| viking | Viking | C | 3 | 290 | 35 | 26 | 0.74 | 49 | 12% | 34 |
| shieldmaiden | Shieldmaiden | U | 3 | 290 | 20 | 38 | 0.93 | 49 | 7% | 34 |
| shaman | Shaman | R | 4 | 230 | 20 | 16 | 0.93 | 49 | 3% | 145 |
| berserker | Berserker | U | 3 | 290 | 35 | 8 | 1.16 | 60 | 12% | 34 |
| huntress | Huntress | U | 3 | 230 | 35 | 16 | 0.93 | 60 | 18% | 145 |
| glutton | Glutton | C | 3 | 360 | 27 | 26 | 0.61 | 30 | 3% | 34 |
| bear_druid | Bear Druid | R | 4 | 360 | 35 | 38 | 0.74 | 49 | 7% | 62 |
| eagle_druid | Eagle Druid | R | 3 | 180 | 27 | 8 | 1.16 | 74 | 18% | 34 |
| pirate_admiral | Pirate Admiral | UR | 4 | 360 | 45 | 38 | 0.61 | 30 | 7% | 62 |
| shackled_pirate | Shackled Pirate | C | 2 | 290 | 35 | 16 | 0.74 | 39 | 7% | 62 |
| goblin_spearman | Goblin Lanceiro | C | 2 | 180 | 27 | 8 | 1.16 | 60 | 12% | 62 |
| goblin_archer | Goblin Arqueiro | C | 2 | 180 | 20 | 8 | 1.16 | 60 | 12% | 180 |
| goblin_rider | Goblin Montador | U | 3 | 290 | 27 | 26 | 0.93 | 74 | 7% | 62 |
| goblin_brute | Goblin Bruto | U | 3 | 290 | 35 | 16 | 0.93 | 49 | 7% | 34 |
| goblin_bomber | Goblin Bombardeiro | R | 3 | 180 | 35 | 8 | 0.61 | 60 | 12% | 145 |
| goblin_king | Rei Goblin | UR | 4 | 360 | 20 | 26 | 0.74 | 30 | 3% | 145 |
| orc_warrior | Orc Guerreiro | C | 3 | 290 | 27 | 38 | 0.74 | 39 | 7% | 34 |
| orc_berserker | Orc Berserker | U | 3 | 290 | 35 | 16 | 1.16 | 60 | 12% | 34 |
| orc_fighter | Orc Lutadora | U | 3 | 230 | 27 | 16 | 1.47 | 60 | 18% | 34 |
| cave_troll | Troll da Caverna | U | 3 | 360 | 35 | 16 | 0.74 | 49 | 7% | 62 |
| snow_troll | Troll das Neves | R | 4 | 290 | 20 | 26 | 0.74 | 39 | 3% | 145 |
| troll | Troll | R | 4 | 360 | 45 | 38 | 0.61 | 30 | 3% | 62 |
| mountain_troll | Troll da Montanha | R | 4 | 360 | 45 | 26 | 0.61 | 49 | 7% | 62 |
| dark_elf_noble | Nobre Elfo Sombrio | R | 3 | 230 | 35 | 16 | 1.16 | 60 | 25% | 34 |
| dark_elf_archer | Arqueiro Elfo Sombrio | U | 3 | 180 | 35 | 8 | 0.93 | 60 | 18% | 180 |
| dark_elf_warrior | Guerreiro Elfo Sombrio | U | 3 | 290 | 35 | 38 | 0.74 | 49 | 12% | 62 |
| dark_elf_mage | Mago Elfo Sombrio | R | 4 | 180 | 27 | 8 | 0.74 | 39 | 7% | 145 |

## Anexo B — Skills, gatilhos e traits

Nomes e descrições abaixo refletem os dados brutos; a interface traduz EN/PT-BR. Skills que possuem passiva/condição especial não devem ser reescritas como gatilho de ataques apenas.

### Warrior (`warrior`)

- Ordem: roster base; facção de origem: dawn.
- Traits: Atacante · Defensor · Disciplinado.
- Skill: **Golpe circular** (active). Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Gira a espada e acerta todos os inimigos próximos. Mantém a habilidade atual como referência de dano em área.

### Lancer (`lancer`)

- Ordem: roster base; facção de origem: dawn.
- Traits: Atacante · Defensor · Ágil.
- Skill: **Investida da aurora** (active). Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Avança em linha curta até o alvo, perfurando inimigos no trajeto. O alvo final é empurrado para trás.

### Bastion (`bastion`)

- Ordem: roster base; facção de origem: dawn.
- Traits: Defensor · Guardião · Disciplinado.
- Skill: **Aqui ninguém passa** (active). Gatilho: `{"kind": "received", "limit": 6, "startFull": false}`.
- Efeito: Bate o escudo, afasta inimigos próximos e provoca os atingidos por 2 segundos, fazendo-os priorizar Bastion.

### Shinobi (`shinobi`)

- Ordem: roster base; facção de origem: east.
- Traits: Atacante · Ágil · Disciplinado.
- Skill: **Passo das sombras** (active). Gatilho: `{"kind": "time", "limit": 6, "startFull": false}`.
- Efeito: Teletransporta-se para trás do alvo atual e desfere um golpe. Se o espaço estiver ocupado, usa o ponto livre mais próximo.

### Kinoichi (`kinoichi`)

- Ordem: roster base; facção de origem: east.
- Traits: Atacante · Ágil · Aventureiro.
- Skill: **Corrente da lua** (active). Gatilho: `{"kind": "time", "limit": 7, "startFull": false}`.
- Efeito: Lança a corrente no inimigo mais distante dentro do alcance da skill e o puxa para perto, interrompendo sua ação atual.

### Samurai (`samurai`)

- Ordem: roster base; facção de origem: east.
- Traits: Atacante · Defensor · Disciplinado.
- Skill: **Corte do horizonte** (active). Gatilho: `{"kind": "damage", "limit": 4.5, "startFull": false}`.
- Efeito: Atravessa o alvo em uma arrancada reta, cortando os inimigos no percurso e terminando logo depois dele.

### OmnaMusha (`omnamusha`)

- Ordem: roster base; facção de origem: east.
- Traits: Atacante · Ágil · Disciplinado.
- Skill: **Dança das lâminas** (active). Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Desloca-se para uma lateral livre do alvo, corta e cruza para a outra lateral com um segundo corte. Não atravessa a arena inteira.

### Ronin (`ronin`)

- Ordem: roster base; facção de origem: east.
- Traits: Atacante · Disciplinado · Aventureiro.
- Skill: **Passo do contra-ataque** (active). Gatilho: `{"kind": "received", "limit": 3, "startFull": false}`.
- Efeito: Após resolver o terceiro golpe, dá um passo lateral e contra-ataca o agressor se ele estiver ao alcance da espada. O passo não anula o dano recebido.

### Fighter (`fighter`)

- Ordem: roster base; facção de origem: east.
- Traits: Atacante · Ágil · Disciplinado.
- Skill: **Combo ascendente** (active). Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Desfere dois socos no alvo e termina com um golpe que o empurra. Avança até a nova posição para manter a pressão.

### Martial Artist (`martial_artist`)

- Ordem: roster base; facção de origem: east.
- Traits: Atacante · Ágil · Guardião.
- Skill: **Varredura do dragão** (active). Gatilho: `{"kind": "received", "limit": 4, "startFull": false}`.
- Efeito: Gira o bastão em um arco frontal, atingindo e afastando os inimigos acertados. Depois recua um passo para recuperar distância.

### Shaolin (`shaolin`)

- Ordem: roster base; facção de origem: east.
- Traits: Defensor · Guardião · Disciplinado.
- Skill: **Postura serena** (passive). Gatilho: `{"kind": "block", "limit": 4, "startFull": false}`.
- Efeito: Bloqueia completamente o quarto ataque básico. Mantém a habilidade atual; dano de skill e efeitos contínuos não entram na contagem.

### Cowboy (`cowboy`)

- Ordem: roster base; facção de origem: west.
- Traits: Atirador · Atacante · Aventureiro.
- Skill: **Bala ricocheteante** (active). Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Atira no alvo atual e faz a bala ricochetear em até dois outros inimigos próximos. Cada inimigo pode ser atingido uma única vez.

### Gunner (`gunner`)

- Ordem: roster base; facção de origem: west.
- Traits: Atirador · Ágil · Aventureiro.
- Skill: **Disparo de recuo** (active). Gatilho: `{"kind": "received", "limit": 4, "startFull": false}`.
- Efeito: Recua um trecho curto na direção oposta ao alvo enquanto dispara um tiro potente. Se estiver junto à borda, busca espaço lateral.

### Miner (`miner`)

- Ordem: roster base; facção de origem: west.
- Traits: Atirador · Defensor · Aventureiro.
- Skill: **Pavio curto** (active). Gatilho: `{"kind": "time", "limit": 7, "startFull": false}`.
- Efeito: Arremessa dinamite na posição atual do alvo. Após 1 segundo ela explode, causando dano em área e empurrando inimigos para fora do centro.

### Pirate Captain (`pirate_captain`)

- Ordem: roster base; facção de origem: sea.
- Traits: Atacante · Guardião · Aventureiro.
- Skill: **Bandeira de abordagem** (active). Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: Crava uma bandeira em sua posição. Por 4 segundos, aliados dentro da área recebem velocidade de ataque e proteção contra deslocamentos forçados.

### Pirate (`pirate`)

- Ordem: roster base; facção de origem: sea.
- Traits: Atacante · Ágil · Aventureiro.
- Skill: **Gancho de abordagem** (active). Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Prende o gancho no alvo atual, puxa o próprio corpo até ele e golpeia. Se já estiver corpo a corpo, passa para um flanco livre antes do golpe.

### Cannoneer (`cannoneer`)

- Ordem: roster base; facção de origem: sea.
- Traits: Atirador · Defensor · Aventureiro.
- Skill: **Tiro de dispersão** (active). Gatilho: `{"kind": "damage", "limit": 4.5, "startFull": false}`.
- Efeito: Dispara uma bala explosiva no alvo atual. A explosão atinge uma área e arremessa os atingidos para longe do ponto de impacto.

### Ranger (`ranger`)

- Ordem: roster base; facção de origem: verdant.
- Traits: Atirador · Disciplinado · Guardião.
- Skill: **Armadilha de caçador** (active). Gatilho: `{"kind": "time", "limit": 6, "startFull": false}`.
- Efeito: Coloca uma armadilha no chão à sua frente. O primeiro inimigo que entrar nela recebe dano e fica imobilizado por 1,5 segundo; a armadilha dura até 5 segundos.

### Archer (`archer`)

- Ordem: roster base; facção de origem: verdant.
- Traits: Atirador · Ágil · Aventureiro.
- Skill: **Chuva persistente** (active). Gatilho: `{"kind": "attacks", "limit": 6, "startFull": false}`.
- Efeito: Marca uma área na posição atual do alvo. Flechas caem em três ondas durante 2 segundos; inimigos podem entrar ou sair da zona.

### Crossbowman (`crossbowman`)

- Ordem: roster base; facção de origem: verdant.
- Traits: Atirador · Atacante · Disciplinado.
- Skill: **Virote de contenção** (active). Gatilho: `{"kind": "damage", "limit": 4, "startFull": false}`.
- Efeito: Dispara um virote que atravessa os inimigos em linha. O primeiro atingido fica imobilizado por 1 segundo; os demais recebem o dano.

### Mage (`mage`)

- Ordem: roster base; facção de origem: arcane.
- Traits: Arcano · Atacante · Disciplinado.
- Skill: **Orbes astrais** (active). Gatilho: `{"kind": "time", "limit": 7, "startFull": false}`.
- Efeito: Invoca três orbes que orbitam ao seu redor. Cada um dos próximos três ataques básicos lança um orbe no alvo, causando uma pequena explosão no impacto. Os orbes não recarregam a própria skill.

### Sorceress (`sorceress`)

- Ordem: roster base; facção de origem: arcane.
- Traits: Arcano · Ágil · Aventureiro.
- Skill: **Vórtice esmeralda** (active). Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: Abre um vórtice na posição atual do alvo. Durante 1,5 segundo, ele puxa gradualmente inimigos próximos para o centro e então explode.

### Sage (`sage`)

- Ordem: roster base; facção de origem: arcane.
- Traits: Arcano · Guardião · Disciplinado.
- Skill: **Resgate arcano** (active). Gatilho: `{"kind": "time", "limit": 7, "startFull": false}`.
- Efeito: Teletransporta o outro aliado com menor percentual de vida para um ponto livre na retaguarda e concede um escudo temporário. Se estiver sozinho, recebe apenas o escudo.

### Priestess (`priestess`)

- Ordem: roster base; facção de origem: arcane.
- Traits: Arcano · Guardião · Aventureiro.
- Skill: **Santuário de luz** (active). Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: Cria uma área sagrada em sua posição por 4 segundos. Aliados dentro dela recebem pequenas curas periódicas; na criação, remove um efeito negativo de cada aliado na área.

### Cavalier (`cavalier`)

- Ordem: roster base; facção de origem: dawn.
- Traits: Atacante · Defensor · Disciplinado.
- Skill: **Royal Charge** (active). Gatilho: `{"kind": "attacks", "limit": 6, "startFull": true}`.
- Efeito: Once per round, charge the nearest enemy. On contact, replace the opening basic attack with a strike for 180% attack and stun for 1 second. Control effects interrupt the charge.

### Musketeer (`musketeer`)

- Ordem: roster base; facção de origem: dawn.
- Traits: Atirador · Defensor · Disciplinado.
- Skill: **Armorbreaker Shot** (active). Gatilho: `{"kind": "attacks", "limit": 4, "startFull": false}`.
- Efeito: After 4 basic attacks, shoot the current target for 220% attack, ignoring 50% defense. Remain in position.

### Swordsman (`swordsman`)

- Ordem: roster base; facção de origem: dawn.
- Traits: Atacante · Ágil · Aventureiro.
- Skill: **Sundering Slash** (active). Gatilho: `{"kind": "damage", "limit": 4, "startFull": false}`.
- Efeito: After 5 basic attacks, slash a 90-degree cone over a range of 85, dealing 170% attack and reducing defense by 20% for 3 seconds. Repeated effects refresh duration.

### Duelist (`duelist`)

- Ordem: roster base; facção de origem: dawn.
- Traits: Atacante · Ágil · Disciplinado.
- Skill: **Perfect Riposte** (active). Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: After 5 basic attacks, take a defensive stance for 2 seconds. Block the next basic attack and counter for 180% attack if the attacker is within melee range. Skills are not blocked.

### Viking (`viking`)

- Ordem: roster base; facção de origem: north.
- Traits: Atacante · Defensor · Aventureiro.
- Skill: **Battle Fury** (passive). Gatilho: `{"kind": "health", "limit": 0.5, "startFull": false}`.
- Efeito: Attack 30% faster while at or below 50% health. The bonus ends when health rises above 50%.

### Shieldmaiden (`shieldmaiden`)

- Ordem: roster base; facção de origem: north.
- Traits: Defensor · Guardião · Aventureiro.
- Skill: **Stand Together** (active). Gatilho: `{"kind": "received", "limit": 5, "startFull": false}`.
- Efeito: After 5 basic attacks, shield yourself and the other ally with the lowest health percentage within 100 range for 15% of your maximum health for 4 seconds. Repeated shields keep the larger amount and refresh duration.

### Shaman (`shaman`)

- Ordem: roster base; facção de origem: north.
- Traits: Arcano · Guardião · Aventureiro.
- Skill: **Ancestral Totem** (active). Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: After 6 basic attacks, place a totem at your position for 5 seconds. Allies within 85 range attack 15% faster and recover 1% of their maximum health each second. One totem per caster; bonuses do not stack. Totems cannot be attacked and use no unit slot.

### Berserker (`berserker`)

- Ordem: roster base; facção de origem: north.
- Traits: Atacante · Ágil · Aventureiro.
- Skill: **Bloodied Axes** (active). Gatilho: `{"kind": "damage", "limit": 4, "startFull": false}`.
- Efeito: After 5 basic attacks, strike the current target twice for 90% attack each. Recover 25% of the actual health damage dealt by these strikes; shields and excess damage do not count.

### Huntress (`huntress`)

- Ordem: roster base; facção de origem: north.
- Traits: Atirador · Ágil · Aventureiro.
- Skill: **Marked Prey** (active). Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: After 5 basic attacks, throw a spear for 150% attack and mark the target for 4 seconds. The target takes 15% more damage from allied basic attacks. Repeated marks refresh duration without stacking.

### Glutton (`glutton`)

- Ordem: roster base; facção de origem: north.
- Traits: Defensor · Guardião · Aventureiro.
- Skill: **Snack Break** (active). Gatilho: `{"kind": "received", "limit": 6, "startFull": false}`.
- Efeito: After 4 basic attacks, recover 20% of your maximum health, up to full health.

### Bear Druid (`bear_druid`)

- Ordem: roster base; facção de origem: verdant.
- Traits: Arcano · Defensor · Guardião.
- Skill: **Ursine Roar** (active). Gatilho: `{"kind": "received", "limit": 5, "startFull": false}`.
- Efeito: After 5 basic attacks, reduce the attack of enemies within 85 range by 20% for 3 seconds and take 15% less damage for 3 seconds. Repeated effects refresh duration; total damage reduction is capped at 65%.

### Eagle Druid (`eagle_druid`)

- Ordem: roster base; facção de origem: verdant.
- Traits: Arcano · Ágil · Aventureiro.
- Skill: **Skyfall** (active). Gatilho: `{"kind": "time", "limit": 6, "startFull": false}`.
- Efeito: After 5 basic attacks, leap to the farthest enemy within 180 range and deal 170% attack in a radius of 35 on landing. Land in the nearest free space and remain there. You can take damage during the leap.

### Pirate Admiral (`pirate_admiral`)

- Ordem: roster base; facção de origem: sea.
- Traits: Atacante · Defensor · Aventureiro.
- Skill: **Deckbreaker** (active). Gatilho: `{"kind": "received", "limit": 6, "startFull": false}`.
- Efeito: After 5 basic attacks, slam the ground at the current target, dealing 200% attack within 65 range of impact and stunning enemies for 1 second.

### Shackled Pirate (`shackled_pirate`)

- Ordem: roster base; facção de origem: sea.
- Traits: Atacante · Guardião · Aventureiro.
- Skill: **Chain Sweep** (active). Gatilho: `{"kind": "received", "limit": 4, "startFull": false}`.
- Efeito: After 5 basic attacks, swing the chain around yourself, dealing 150% attack within 65 range and slowing enemy movement by 30% for 3 seconds. Repeated slows refresh duration without stacking.

### Goblin Lanceiro (`goblin_spearman`)

- Ordem: Blackfang; facção de origem: blackfang.
- Traits: Atacante · Ágil · Aventureiro.
- Skill: **Estocada traiçoeira** (active). Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Causa 160% do ataque ao alvo e recua 35 unidades.

### Goblin Arqueiro (`goblin_archer`)

- Ordem: Blackfang; facção de origem: blackfang.
- Traits: Atirador · Ágil · Aventureiro.
- Skill: **Flecha farpada** (active). Gatilho: `{"kind": "attacks", "limit": 6, "startFull": false}`.
- Efeito: Causa 140% do ataque e reduz o movimento do alvo em 30% por 3 segundos.

### Goblin Montador (`goblin_rider`)

- Ordem: Blackfang; facção de origem: blackfang.
- Traits: Atacante · Defensor · Ágil.
- Skill: **Atropelo** (active). Gatilho: `{"kind": "attacks", "limit": 6, "startFull": true}`.
- Efeito: Começa carregado. Avança pelo chão, causa 160% do ataque e empurra o alvo 45 unidades, acompanhando o avanço. Controle interrompe a investida.

### Goblin Bruto (`goblin_brute`)

- Ordem: Blackfang; facção de origem: blackfang.
- Traits: Atacante · Defensor · Aventureiro.
- Skill: **Pancada brutal** (active). Gatilho: `{"kind": "received", "limit": 5, "startFull": false}`.
- Efeito: Causa 170% do ataque ao alvo e atordoa por 0,8 segundo.

### Goblin Bombardeiro (`goblin_bomber`)

- Ordem: Blackfang; facção de origem: blackfang.
- Traits: Atirador · Ágil · Aventureiro.
- Skill: **Bomba incendiária** (active). Gatilho: `{"kind": "time", "limit": 7, "startFull": false}`.
- Efeito: Após 1 segundo, a bomba explode por 150% do ataque em raio 55. Deixa fogo por 3 segundos, causando 20% do ataque por segundo.

### Rei Goblin (`goblin_king`)

- Ordem: Blackfang; facção de origem: blackfang.
- Traits: Defensor · Guardião · Aventureiro.
- Skill: **Ordem do rei** (active). Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: Aliados em raio 110, incluindo o rei, recebem +15% de ataque e velocidade de ataque por 4 segundos. Rei, liteira e carregadores são uma unidade.

### Orc Guerreiro (`orc_warrior`)

- Ordem: Blackfang; facção de origem: blackfang.
- Traits: Atacante · Defensor · Disciplinado.
- Skill: **Escudo de guerra** (active). Gatilho: `{"kind": "received", "limit": 5, "startFull": false}`.
- Efeito: Recebe escudo de 15% da própria vida máxima por 4 segundos e empurra o alvo em alcance curto 30 unidades.

### Orc Berserker (`orc_berserker`)

- Ordem: Blackfang; facção de origem: blackfang.
- Traits: Atacante · Ágil · Aventureiro.
- Skill: **Caçada sangrenta** (active). Gatilho: `{"kind": "damage", "limit": 4, "startFull": false}`.
- Efeito: Avança até o inimigo com menor percentual de vida em alcance 120 e golpeia por 180% do ataque. Sem candidato, usa o alvo atual.

### Orc Lutadora (`orc_fighter`)

- Ordem: Blackfang; facção de origem: blackfang.
- Traits: Atacante · Ágil · Disciplinado.
- Skill: **Lâminas cruzadas** (active). Gatilho: `{"kind": "attacks", "limit": 6, "startFull": false}`.
- Efeito: Dois cortes no alvo, cada um por 100% do ataque, ignorando 25% da defesa.

### Troll da Caverna (`cave_troll`)

- Ordem: Blackfang; facção de origem: blackfang.
- Traits: Atacante · Defensor · Guardião.
- Skill: **Carne regenerativa** (passive). Gatilho: `{"kind": "passive", "limit": 0, "startFull": false}`.
- Efeito: Após 3 segundos sem receber dano à vida, regenera 2% da vida máxima por segundo. Novo dano à vida interrompe a regeneração.

### Troll das Neves (`snow_troll`)

- Ordem: Blackfang; facção de origem: blackfang.
- Traits: Arcano · Defensor · Guardião.
- Skill: **Proteção ancestral** (active). Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: Cura a si e aliados em raio 85 em 8% da vida máxima de cada um e concede 10% de redução de dano por 3 segundos.

### Troll (`troll`)

- Ordem: Blackfang; facção de origem: blackfang.
- Traits: Defensor · Guardião · Aventureiro.
- Skill: **Queda da rocha** (active). Gatilho: `{"kind": "received", "limit": 6, "startFull": false}`.
- Efeito: Atinge o chão junto ao alvo por 180% do ataque em raio 65 e imobiliza por 1,2 segundo.

### Troll da Montanha (`mountain_troll`)

- Ordem: Blackfang; facção de origem: blackfang.
- Traits: Atacante · Defensor · Aventureiro.
- Skill: **Investida demolidora** (active). Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: Avança até 120 unidades rumo ao alvo. Atinge cada inimigo no trajeto uma vez por 170% do ataque e o empurra 45 unidades.

### Nobre Elfo Sombrio (`dark_elf_noble`)

- Ordem: Blackfang; facção de origem: blackfang.
- Traits: Atacante · Ágil · Disciplinado.
- Skill: **Passo sombrio** (active). Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Teleporta para um espaço livre atrás do alvo e golpeia por 180% do ataque. Sem invulnerabilidade.

### Arqueiro Elfo Sombrio (`dark_elf_archer`)

- Ordem: Blackfang; facção de origem: blackfang.
- Traits: Atirador · Ágil · Disciplinado.
- Skill: **Flecha executora** (active). Gatilho: `{"kind": "attacks", "limit": 5, "startFull": false}`.
- Efeito: Atira no inimigo com menor percentual de vida em alcance 180 por 180% do ataque, ou 240% se estiver abaixo de 30% de vida.

### Guerreiro Elfo Sombrio (`dark_elf_warrior`)

- Ordem: Blackfang; facção de origem: blackfang.
- Traits: Atacante · Defensor · Disciplinado.
- Skill: **Guarda punitiva** (active). Gatilho: `{"kind": "received", "limit": 5, "startFull": false}`.
- Efeito: Corta um cone de 90 graus e alcance 85 por 160% do ataque. Recebe 20% de redução de dano por 3 segundos.

### Mago Elfo Sombrio (`dark_elf_mage`)

- Ordem: Blackfang; facção de origem: blackfang.
- Traits: Arcano · Atacante · Disciplinado.
- Skill: **Grilhões arcanos** (active). Gatilho: `{"kind": "time", "limit": 8, "startFull": false}`.
- Efeito: Atinge uma área de raio 55 na posição do alvo por 150% do ataque e imobiliza por 1,5 segundo.

## Anexo C — Relíquias

| ID | Relíquia | Preço-base na run | Forma | Raridade | Efeito |
| --- | --- | --- | --- | --- | --- |
| banner | Estandarte antigo | 30 | L3 | C | Todos os aliados têm +8% de ataque. |
| heart | Pedra vital | 30 | domino | C | Todos os aliados têm +10% de vida. |
| scope | Lente do viajante | 30 | domino | C | Atiradores ganham +15% de ataque. |
| tome | Tomo das estrelas | 35 | T | R | Arcanos ganham +25% de poder de habilidade. |
| boots | Botas do vento | 30 | L3 | U | Ágeis ganham +20% de movimento e +10% de velocidade de ataque. |
| shield | Selo de proteção | 30 | L3 | C | Defensores recebem 10% menos dano. |
| precision | Medalhão da precisão | 35 | dot | U | Todos os aliados: +5 pontos percentuais de chance crítica. Até +20 pontos por esta relíquia. |
| hourglass | Ampulheta de combate | 40 | P | UR | Uma unidade aliada aleatória elegível começa cada rodada com 50% da carga da habilidade. Contagens inteiras arredondam para baixo. Não acumula. |
| recovery | Broche da recuperação | 40 | square | R | Todos os aliados vivos recuperam 1% da vida máxima a cada 3 segundos. Até 3% por pulso. |
| merchant | Moeda do mercador | 35 | line3 | U | Cartas e relíquias na loja custam 15% menos. Desconto máximo de 30%; preço arredondado para cima. |
| quickstart | Quick Start | 30 | line3 | U | Gain 2 extra energy in the first preparation of each encounter. |
| spark | Everlasting Spark | 40 | L5 | UR | Gain 1 extra energy in every preparation, including the first. |
| luckycharm | Lucky Charm | 30 | domino | C | Gain 20% more run gold from rewards. Does not affect diamonds or refunds. |
| plating | Reinforced Plating | 30 | square | U | All allies take 5% less damage. |
| laststand | Last Stand | 40 | T | UR | Once per round, the first ally taking lethal damage survives with 1 health. |
| repulsion | Repulsion Seal | 35 | S | R | Once per round, the first ally crossing 15% health pushes nearby enemies away. |
| fang | Vampiric Fang | 35 | L4 | R | Basic attacks heal their attacker for 5% of health damage dealt. |
| execution | Executioner’s Mark | 30 | L3 | U | Deal 15% more damage to enemies below 30% health. |
| ember | Vengeful Ember | 35 | T | R | Each fallen ally grants survivors 5% more attack damage this round, up to 15%. |
| bell | Opening Bell | 30 | line3 | C | All allies attack 15% faster during the first 5 seconds of each round. |

## Anexo D — Decks e catálogos

Cada deck emprestado abaixo usa os quatro primeiros tipos três vezes e os quatro últimos duas vezes. Desbloqueios constam no anexo de milestones.

| ID | Deck emprestado | Relíquia inicial | Tipos em ordem |
| --- | --- | --- | --- |
| vanguard | Vanguarda da passagem | banner | Warrior, Bastion, Lancer, Samurai, Ronin, Fighter, Sage, Archer |
| balanced | Encontro de caminhos | heart | Warrior, Cowboy, Mage, Priestess, Fighter, Kinoichi, Ranger, Bastion |
| swift | Ventos do acaso | boots | Shinobi, OmnaMusha, Martial Artist, Kinoichi, Gunner, Pirate, Archer, Shaolin |
| arcane | Pacto dos guardiões | recovery | Sorceress, Bastion, Priestess, Mage, Sage, Lancer, Shaolin, Crossbowman |
| outlaws | Companhia da estrada | merchant | Pirate Captain, Cannoneer, Gunner, Pirate, Cowboy, Miner, Ranger, Warrior |
| fortress | Fortaleza viva | shield | Bastion, Shaolin, Warrior, Lancer, Samurai, Sage, Priestess, Ranger |
| blades | Dança das lâminas | precision | Shinobi, Kinoichi, OmnaMusha, Ronin, Samurai, Fighter, Martial Artist, Pirate |
| fireline | Linha de fogo | scope | Cowboy, Gunner, Miner, Cannoneer, Crossbowman, Ranger, Archer, Bastion |
| astral | Círculo astral | tome | Mage, Sorceress, Sage, Priestess, Bastion, Shaolin, Warrior, Samurai |
| corsair | Companhia corsária | hourglass | Pirate Captain, Pirate, Cannoneer, Cowboy, Gunner, Miner, Kinoichi, Martial Artist |

### Forças Blackfang e Boss

| ID | Nome | Estratégia | Tipos |
| --- | --- | --- | --- |
| blackfang_goblins | Incursão Goblin | swift | Goblin Lanceiro, Goblin Arqueiro, Goblin Montador, Goblin Bombardeiro, Goblin Bruto, Orc Guerreiro, Orc Lutadora, Troll das Neves |
| blackfang_brutal | Vanguarda Brutal | fortress | Orc Guerreiro, Orc Berserker, Troll da Caverna, Troll, Goblin Bruto, Troll da Montanha, Troll das Neves, Goblin Bombardeiro |
| blackfang_shadows | Companhia Sombria | blades | Nobre Elfo Sombrio, Arqueiro Elfo Sombrio, Guerreiro Elfo Sombrio, Orc Lutadora, Mago Elfo Sombrio, Orc Guerreiro, Troll das Neves, Goblin Montador |
| blackfang_boss | Corte Blackfang | fortress | Rei Goblin, Orc Guerreiro, Goblin Bombardeiro, Guerreiro Elfo Sombrio, Troll da Montanha, Troll das Neves, Arqueiro Elfo Sombrio, Goblin Montador |

### Boosters cadastrados

Cadastro não significa acesso em perfil novo. Usar os filtros de Progress e os milestones, especialmente para Blackfang.

| ID | Nome | Preço em diamantes | Tipos elegíveis |
| --- | --- | --- | --- |
| first | First Horizons | 7 | Warrior, Lancer, Bastion, Shinobi, Kinoichi, Samurai, OmnaMusha, Ronin, Fighter, Martial Artist, Shaolin, Cowboy, Gunner, Miner, Pirate Captain, Pirate, Cannoneer, Ranger, Archer, Crossbowman, Mage, Sorceress, Sage, Priestess, Cavalier, Musketeer, Swordsman, Duelist, Viking, Shieldmaiden, Shaman, Berserker, Huntress, Glutton, Bear Druid, Eagle Druid, Pirate Admiral, Shackled Pirate |
| east | Legends of the East | 7 | Shinobi, Kinoichi, Samurai, OmnaMusha, Ronin, Fighter, Martial Artist, Shaolin |
| frontier | Frontier & Free Seas | 7 | Cowboy, Gunner, Miner, Pirate Captain, Pirate, Cannoneer, Pirate Admiral, Shackled Pirate, Bear Druid, Eagle Druid |
| oaths | Oaths & Mysteries | 7 | Warrior, Lancer, Bastion, Cavalier, Musketeer, Swordsman, Duelist, Ranger, Archer, Crossbowman, Bear Druid, Eagle Druid, Mage, Sorceress, Sage, Priestess |
| blackfang | Blackfang | 7 | Goblin Lanceiro, Goblin Arqueiro, Goblin Montador, Goblin Bruto, Goblin Bombardeiro, Rei Goblin, Orc Guerreiro, Orc Berserker, Orc Lutadora, Troll da Caverna, Troll das Neves, Troll, Troll da Montanha, Nobre Elfo Sombrio, Arqueiro Elfo Sombrio, Guerreiro Elfo Sombrio, Mago Elfo Sombrio |
| north | Northern Blood | 7 | Viking, Shieldmaiden, Shaman, Berserker, Huntress, Glutton |

### Raridades

| Raridade | Peso-base | Preço de carta permanente |
| --- | --- | --- |
| Comum | 0.65 | 10 |
| Incomum | 0.23 | 15 |
| Rara | 0.1 | 20 |
| Ultra rara | 0.02 | 25 |

## Anexo E — Milestones e eventos

Condições e recompensas de cadastro; registros e concessões devem seguir Progress, sem repetições por reload.

| ID | Condição | Meta | Recompensa cadastrada |
| --- | --- | --- | --- |
| firstSteps | Concluir o tutorial ou vencer seu primeiro confronto | 1 | {"decks": ["balanced", "swift"]} |
| northern | Vencer 3 confrontos com 3 personagens diferentes de Frostborn Clans em uma run | 3 | {"booster": "north"} |
| journeys | Encerrar 3 runs com pelo menos 5 nós concluídos | 3 | {"deck": "outlaws", "relic": "heart"} |
| elite | Derrotar um elite | 1 | {"deck": "blades", "relic": "precision"} |
| events | Resolver 3 eventos em uma run | 3 | {"deck": "corsair", "relic": "hourglass"} |
| spender | Gastar 30 de ouro em uma run | 30 | {"relic": "merchant"} |
| boss | Derrotar o Boss | 1 | {"deck": "arcane", "relic": "recovery", "booster": "oaths"} |
| sweeps | Vencer 3 confrontos sem perder rodadas em uma run | 3 | {"deck": "fortress", "relic": "shield"} |
| shooters | Vencer 3 confrontos com 3 Atiradores diferentes em uma run | 3 | {"deck": "fireline", "relic": "scope"} |
| arcanists | Vencer 3 confrontos com 3 Arcanos diferentes em uma run | 3 | {"deck": "astral", "relic": "tome"} |
| decks | Derrotar 3 baralhos inimigos diferentes | 3 | {"booster": "frontier", "relic": "banner"} |
| eastern | Vencer 3 confrontos com 3 Legends of the East diferentes em uma run | 3 | {"booster": "east", "relic": "boots"} |

### Eventos

| ID | Evento | Descrição |
| --- | --- | --- |
| cofre | Cofre amaldiçoado | 55% de ganhar uma relíquia; 45% de perder uma carta aleatória. |
| resgate | Viajante aprisionado | 70% de escolher um recruta entre três; 30% de perder uma carta aleatória. |
| altar | Altar da renovação | Sacrifique primeiro uma carta escolhida e melhore duas outras cartas diferentes em um nível cada. |
| caravana | Caravana desaparecida | 60% de ganhar 18 de ouro; 40% de perder 10 de ouro. |
| mercador | Mercador encapuzado | Pague 12 de ouro: 60% de receber uma relíquia; 40% de receber um recruta aleatório. |
| dojo | Treinamento proibido | Escolha uma carta e pague 10 de ouro: 75% de melhorá-la; 25% de perdê-la. |
| santuario | Santuário dos viajantes | Entregue uma relíquia escolhida e recrute dois personagens entre as ofertas apresentadas. |
| forja | Forja instável | Entregue uma relíquia: 70% de receber outra diferente; 30% de perder a relíquia sem recompensa. |
| mestre | Desafio do mestre | Escolha uma carta: 65% de ganhar um upgrade nela e 8 de ouro; 35% de perder essa carta. |
| aposta | Mesa de apostas | Aposte 12 de ouro: 55% de receber 30 de ouro; 45% de perder a aposta. |
| contrabando | Contrabandista | 70% de escolher um recruta com upgrade 1; 30% de perder uma relíquia aleatória. |
| despedida | Contrato de despedida | Remova uma carta escolhida do baralho e receba 20 de ouro. |
| tesouro | Tesouro vigiado | 60% de ganhar uma relíquia; 40% de enfrentar guardiões comuns. Vencendo, recebe a relíquia. |
| profanado | Santuário profanado | 50% de escolher uma entre três relíquias; 50% de enfrentar inimigos com +5% nos atributos. A vitória concede a mesma escolha. |
| ataque | Caravana sob ataque | 40% de escolher um recruta; 60% de enfrentar saqueadores. Vencendo, escolhe o recruta e recebe 10 de ouro. |
| camara | Câmara do campeão | 30% de ganhar uma relíquia e 20 de ouro; 70% de enfrentar um elite com +5% nos atributos. A vitória concede a relíquia e os 20 de ouro. |

## Anexo F — Cenários

22 cenários puramente visuais, sem bônus de terreno. Sortear por confronto, manter entre rodadas, salvar escolha e evitar repetição consecutiva quando houver alternativas. Elites/Boss usam pool compatível com o inimigo.

Mapeamento atual de pools (IDs de assets):

```json
{
  "enemy_dawn16": [
    "5203",
    "5209",
    "5210",
    "5351"
  ],
  "enemy_north16": [
    "5205",
    "5211",
    "5349",
    "5340"
  ],
  "enemy_verdant16": [
    "5217",
    "5333",
    "5214",
    "5205"
  ],
  "enemy_sea16": [
    "5216",
    "5220",
    "5233",
    "5341"
  ],
  "vanguard": [
    "5209",
    "5210",
    "5351",
    "5206"
  ],
  "balanced": [
    "5214",
    "5210",
    "5209",
    "5217"
  ],
  "swift": [
    "5206",
    "5349",
    "5217",
    "5340"
  ],
  "arcane": [
    "5350",
    "5203",
    "5261",
    "5333"
  ],
  "outlaws": [
    "5204",
    "5341",
    "5216",
    "5233"
  ],
  "fortress": [
    "5209",
    "5261",
    "5351",
    "5210"
  ],
  "blades": [
    "5206",
    "5340",
    "5349",
    "5211"
  ],
  "fireline": [
    "5204",
    "5341",
    "5351",
    "5210"
  ],
  "astral": [
    "5350",
    "5203",
    "5261",
    "5215"
  ],
  "corsair": [
    "5216",
    "5220",
    "5233",
    "5341"
  ],
  "blackfang": [
    "5342",
    "5270",
    "5215",
    "5351"
  ],
  "second_order": [
    "5333",
    "5203",
    "5217",
    "5209"
  ],
  "creature": [
    "5215",
    "5211",
    "5217",
    "5205",
    "5233"
  ]
}
```

## Validação da entrega v36

Fonte VT323 com todos os acentos de PT-BR e dígitos verificados no cmap. Navegador em largura de celular: botões VT323 Regular 400, título Georgia Bold 700, Card Cycle em três colunas. Rodapés e ausência de overflow conferidos. Sintaxe JavaScript dos arquivos alterados e git diff --check. Sem teste em Android físico. Nenhuma regra de combate/progressão alterada por esta versão.
