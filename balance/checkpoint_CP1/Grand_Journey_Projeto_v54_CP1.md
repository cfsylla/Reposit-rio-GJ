# Grand Journey — documento consolidado no checkpoint GJ-v54-BAL-CP1

Base: documento v54 (01/11/2026). Atualizado em 02/11/2026 para refletir **somente** o que está incluído no checkpoint de balanceamento GJ-v54-BAL-CP1. As seções afetadas têm um aviso "CP1" e apontam para as regras vigentes abaixo. Os documentos v26 a v46 e os changelogs continuam **históricos**.

## Regras vigentes CP1 (prevalecem sobre o texto v54 das seções indicadas)

### 3.1 Curva de força dos personagens (P1)

- **Alvo de força** = 1,00 + 0,04 × (custo − 2) + 0,02 × raridade.
- Exceções de custo 1 ou 5 são permitidas no futuro.
- Medido em laboratório: o personagem substitui um lutador neutro num time de 5, contra 6 tipos de adversário. 32 de 33 ficaram dentro do alvo ±0,03.

### 3.2 Traits

As descrições EN/PT do jogo foram atualizadas e são a referência. Destaques:

| Trait | Regra vigente |
|---|---|
| **Meowri** | Sobrevive ao golpe fatal; imunidade de 0,25 s / 0,5 s |
| **Troll** | Golpe forte a cada 4º / 3º básico |
| **Dark Elf** | Ignora 30% / 45% da defesa |
| **Orc** | 6% / 9% por acúmulo, até 30% / 45% |
| **High Elf** | Escudo de 15% / 22% |
| **Arcane** | Próximo especial +40% / +60% |
| **Legends of the East** | Cada 4º básico: +50% / +60% de dano e ignora 25% / 40% da defesa |
| **Goblin** | +8% de dano por outro Goblin diferente vivo (até 3) |
| **Trailblazer** | Movimento +15% / +25%; 1º básico depois de se deslocar 30+: +45% / +65% (no máximo a cada 4 s) |
| **Protector** | Aliados a até 90 de um Protetor vivo: −5% / −10% de dano recebido (vale o mais forte; não acumula) |
| **Patient** | A cada 3 s: DEF +8% / +15% e dano +4% / +8%, até 3 acúmulos |
| **Fearless** | A cada 3 / 2 básicos, crítico garantido; abaixo de 40% de vida, todo básico é crítico. Única exceção ao teto de 75% |

Atributos no 1º patamar:

| Atributo | 1º patamar |
|---|---|
| Devastator | ATQ +15% |
| Sentinel | DEF +60% |
| Unyielding | Vida +20% |
| Predator | Crítico +25 pontos |
| Lookout | Alcance +15% |

### 3.3 Suportes modelo B (`dist/supports-b.js`)

Raio de 120 para todos. Cura e bônus valem só para os **outros** aliados dentro da aura.

| Suporte | Cura (% vida máx.) | A cada | Bônus aos outros aliados |
|---|---|---|---|
| Priestess | 6,8% | 2 s | −17% dano recebido |
| Harpista | 11,5% | 2 s | +23% vel. de ataque |
| Fada das Flores | 11% | 2 s | +35% poder de habilidade |
| Troll das Neves | 7% | 2 s | −28% dano recebido |
| Shaman | 5,6% | 2 s | +43% vel. de ataque |
| Sage | 9,5% | 3 s | +48% poder de habilidade e −26% dano recebido |
| Feiticeiro Meowri | 4,8% | 3 s | +29% vel. de ataque |
| Barda | 2,2% | 3 s | +26% dano e +22% poder de habilidade |
| Rei Goblin | 4% | 3 s | +32% dano e +27% vel. de ataque |
| Percussionista Meowri | 3,4% | 3 s | +34% vel. de ataque e +46% movimento |

Regras gerais:
- força da aura = valor × (1 + (poder base − 1) × 0,5): upgrade e fusão crescem pela metade;
- o emissor não é afetado pela própria aura;
- auras de suportes diferentes se somam;
- bônus recebidos nunca aumentam a aura de quem os recebe;
- a redução de dano continua sujeita ao teto global de 65%.

### 3.4 Dificuldade e economia (P4)

| Item | Regra vigente |
|---|---|
| Upgrades dos inimigos | Luta N da run tem N−2 upgrades (mín. 0, máx. 26) |
| Elites | Curva +1 |
| Boss comum | Curva −3 / −4 / −6 (mapa 1 / 2 / 3) |
| Equipe do boss de ordem | Curva −4 / −7 / −8; Rei Troll −3 extra |
| Líderes de boss | ×0,80; Rei Troll ×0,65; Rainha Meowri e Líder Centauro ×0,75 |
| Ouro por vitória | 14 / 16 / 18 por mapa |
| Upgrade na loja | 10 e 16. Upgrades de eventos continuam 8 / 14 |
| Força dos inimigos por mapa | ×1 / ×1,10 / ×1,16 |
| Escala dentro do mapa | 0,80 + 0,02 × (luta do mapa − 1), até +0,16 |
| Raids | Mapas 2 e 3: vida ×1,25, dano e lacaios ×1,1 |
| Relíquias inimigas | Sorteio entre 1 e máx(1, n−1), n = 1 + oportunidades de relíquia vistas; limite da bolsa |
| Batalhas normais | Da 2ª luta em diante, um de 4 decks temáticos do mapa |

---

# Grand Journey — fonte de continuidade do projeto

Documento consolidado **v54 — 01/11/2026**. Criador e Game Designer: **Carlos Felipe Sylla**.

Este documento substitui a v45 para continuidade. Consolida a implementação v46–v54 e as decisões disponíveis no chat, sem considerar sugestões antigas como autorização para novas entregas. Versão de conteúdo do jogo e número da versão de hospedagem são contadores diferentes.

**Entrega v54:** três categorias de traits para os 77 personagens; efeitos de facção, atributo e temperamento; nerfs das habilidades individuais de autocura e proteção; preservação da posição horizontal dos filtros da coleção. Números são parâmetros iniciais de playtest, sujeitos ao balanceamento integrado.

## 1. Identidade, entrega e autorização

Grand Journey é um auto-battler roguelite de cartas, single-player, pensado para celular vertical. Referências de estrutura: Rift Wars e caminhos de Slay the Spire. Estratégia por composição, posicionamento, sinergias, cartas e relíquias. Interface azul-marinho/dourada; anime chibi nas cartas/menus e pixel art no campo.

- Site: https://grand-journey.cfsylla.chatgpt.site
- Project ID: `appgprj_6ad92678b86081918ef5cc54c09cc04f`.
- Aplicação web estática HTML/JS/CSS; não é Godot, Arkin ou Deckmon.
- Preservar o Site, audiência customizada, proprietário, convidados, coleção, desbloqueios e saves. Nunca criar um segundo Site para continuar o trabalho.
- Conversa e documentação em português; jogo padrão em inglês e opção PT-BR persistente.
- **Implementar/publicar somente após autorização explícita de Carlos.** Relatos, ideias e “ainda não faça” entram em pendências.
- Uma autorização de atualização inclui executar, validar e publicar aquele escopo; não pedir novamente a mesma permissão.
- Primeiro completar mecânicas novas, depois revisão integrada e balanceamento amplo. Corrigir regressões durante cada entrega.

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

## 3. Estado implementado e estrutura da run

> **CP1:** ouro por vitória passou a 14 / 16 / 18 por mapa. Inimigos: curva de upgrades gradual (N−2), força por mapa ×1 / ×1,10 / ×1,16, escala dentro do mapa 0,80 + 0,02 por luta, decks temáticos nas batalhas normais. Ver "Regras vigentes CP1" no topo.


Há **três atos/mapas**, cada um com 15 camadas e nove confrontos de caminho: 27 confrontos na run, além de combates opcionais de eventos. Perder um confronto encerra a run. Ouro inicial zero. Cada ato tem layout, rotas e cenário próprios.

O jogador escolhe rotas ligadas; posições horizontais das ordens e dos nodes de evento, loja, recrutamento, relíquia e upgrade variam por seed. Não fixar monstros à esquerda, Blackfang ao centro ou Dawncrest à direita. Sorteio mantém todas as posições alcançáveis, nove confrontos por rota e a possibilidade de enfrentar duas vezes a mesma ordem por mapa. O mapa já gerado é preservado no save.

| Mapa | Camadas de confronto (1–15) | Camadas de ordens | Multiplicador de força |
| --- | --- | --- | --- |
| 1 | 1, 3, 5, 6, 8, 10, 11, 13, 15 | 5, 10 | 1 |
| 2 | 1, 2, 4, 6, 7, 9, 11, 13, 15 | 4, 11 | 1.12 |
| 3 | 1, 3, 4, 6, 8, 9, 11, 12, 15 | 6, 12 | 1.25 |

Normais/elites: três vitórias de rodada; bosses de equipe: quatro, salvo fluxo dos true bosses. Empates não pontuam. Preparo sem cronômetro; adversário oculto até o combate, exceto raids e consultas permitidas.

| Rodada | Capacidade em campo | Renda-base de energia |
| --- | --- | --- |
| 1 | 2 | 5 |
| 2 | 3 | 4 |
| 3 | 4 | 5 |
| 4 | 5 | 6 |
| 5 | 6 | 7 |
| 6+ | 6 | rodada + 2 |

Saldo de energia acumula entre rodadas, sem teto; confronto novo reinicia a energia. Quick Start soma 2 na primeira preparação e Everlasting Spark soma 1 em todas. A IA segue pagamento, renda, banco e fusão.

Campo 5×3, banco de seis posições pagas. Banco não luta nem conta traits; transferir unidades já pagas é gratuito respeitando capacidade. Velocidades ×1/×1,5/×2/×3 persistentes, subpassos de até 1/60s. Normais/decks: dano ×5 aos 40s e empate aos 120s. Raids não têm esses limites.

Defesa: `100/(100+DEF efetiva)`. Crítico básico ×1,5 antes de modificadores; chance total máxima 75%. Reduções adicionais de dano combinadas até 65%. Dano e cura do mesmo passo resolvem juntos; escudos absorvem antes da vida. Relatório conta dano efetivo à vida, sem escudo ou excesso.

Unidades vinculadas revivem com vida cheia entre rodadas; posição, banco e fusão permanecem naquele confronto. Confronto novo limpa vínculos, formação, fusões e mão. Entre mapas persistem cartas/upgrades, ouro, relíquias/bolsa/reserva, maldições, missão e compras permanentes da árvore; resets normais de confronto se aplicam.

## 4. Cartas, ciclo, upgrades e fusão

> **CP1:** os decks emprestados agora são 24 e podem ter quantidades variáveis por personagem (`counts`, 20 cartas, no máximo 4 cópias). O formato 3/3/3/3/2/2/2/2 deixou de ser obrigatório.


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

## 5. Traits — regras v54

> **CP1:** valores e mecânicas de vários traits foram alterados (Meowri, Troll, High Elf, Dark Elf, Orc, Arcane, 1º patamar de 5 atributos, Legends of the East, Goblin, Trailblazer, Protector, Patient, Fearless). **As tabelas abaixo são históricas para esses traits**; vale a seção "Regras vigentes CP1" e o texto do jogo.


Cada personagem tem exatamente **uma facção, um atributo e um temperamento**. Blackfang/Dawncrest são ordens; não são traits de facção. Os oito traits antigos foram substituídos. As tabelas abaixo são a referência vigente.

Contam personagens diferentes em campo. Duplicatas, constituintes de fusão e banco não aumentam o patamar; todas as cópias elegíveis recebem o benefício. Patamares **2/4**, exceto **Orc e Centaur 2/3**. Fairy é identificação sem bônus coletivo no elenco atual de uma personagem. Patamar maior substitui o menor; somente membros do trait recebem o benefício.

Contagem e patamares são fixados ao iniciar a rodada e permanecem após mortes. Condições de proximidade, HP e tempo continuam dinâmicas. Unidades invocadas durante o combate não geram um novo patamar. Chefes de equipe herdam a identidade atualizada do seu personagem-base; monstros exclusivos continuam fora do roster jogável.

Não há trait de autocura, velocidade de ataque ou aceleração genérica da carga especial. Árvore, relíquias e habilidades podem conservar esses efeitos próprios.

### 5.1 Facções

| Trait EN / PT | Patamares | Efeito |
| --- | --- | --- |
| Dawnward Order / Dawnward Order | 2 / 4 | Formação próxima concede escudo inicial de 8% / 14% da vida máxima por 6s (alcance 100). |
| Legends of the East / Legends of the East | 2 / 4 | Cada quarto ataque básico ignora 25% / 40% da defesa. |
| Wild West / Wild West | 2 / 4 | Básicos consecutivos no mesmo alvo: +5% / +8% de dano por acúmulo, máximo 20% / 32%. |
| Seasalt Crew / Seasalt Crew | 2 / 4 | +12% / +20% de dano contra inimigos atingidos por outro pirata diferente nos últimos 2s. |
| Verdant Covenant / Verdant Covenant | 2 / 4 | Vegetação nas posições iniciais (raio 90): membros dentro recebem 10% / 18% menos dano. Sobreposição não acumula. |
| Arcane / Arcane | 2 / 4 | Um especial fortalece o próximo especial de outro membro em 15% / 25%. Um bônus pendente por equipe. |
| Frostborn Clans / Frostborn Clans | 2 / 4 | Cada Frostborn diferente que cai: +10% / +15% de dano aos sobreviventes, máximo 30% / 45%, nesta rodada. |
| Goblin / Goblin | 2 / 4 | Cada outro Goblin diferente vivo a até 100 concede redução de dano de 4% / 6%; máximo 12% / 18%. |
| Orc / Orc | 2 / 3 | Básicos retiram 4% / 6% de defesa por acúmulo compartilhado, máximo 20% / 30%, por 4s. Patamares: 2 / 3 Orcs. |
| Troll / Troll | 2 / 4 | Após 5 / 4 básicos, o próximo causa +50% de dano e reduz o ATQ do alvo em 15% por 3s. |
| Dark Elf / Dark Elf | 2 / 4 | Ignora 15% / 25% da defesa de inimigos mirando outro aliado. |
| Meowri / Meowri | 2 / 4 | Uma vez por rodada, sobrevive a dano fatal com 1 de vida e ganha imunidade a dano por 0,75s / 1,5s. |
| High Elf / High Elf | 2 / 4 | Primeiro especial de cada membro protege o outro High Elf mais ferido com 10% / 15% da vida máxima do conjurador por 4s. |
| Forest Elf / Forest Elf | 2 / 4 | Primeiro básico de cada membro contra cada inimigo causa +30% / +50% de dano por rodada. |
| Fairy / Fairy | — | Identificação de facção. Sem bônus coletivo com apenas uma personagem no elenco. |
| Centaur / Centaur | 2 / 3 | Após perder 25% / 20% da vida máxima, recua 60 / 80 e retorna a galope: próximo básico +50% / +80%. Intervalo mínimo 6s. Patamares 2 / 3. |

Precisões: escudo inicial Dawnward exige outro membro próximo. Wild West começa sem acúmulo no primeiro golpe e reinicia ao trocar o alvo principal; área não concede vários acúmulos no mesmo ataque. Seasalt exige outro tipo de pirata. Mortes Frostborn contam uma vez por tipo na rodada. Vegetação permanece no chão da posição inicial, sem acumular sobreposição. Orc compartilha até cinco acúmulos por alvo e renova 4s; shred ocorre antes da penetração. Troll fortalece o sexto/quinto básico, sem ataque adicional; ATQ −15% não acumula com debuff mais forte. High Elf protege outro membro com menor percentual de vida; sem outro alvo, não gera escudo próprio.

Centaur acumula dano efetivamente recebido à vida; não conta escudo, não acumula durante seu intervalo e fica vulnerável no recuo/retorno. Controle de stun/root/taunt interrompe a manobra; alvo morto pode ser substituído. Retorno usa alcance normal e fortalece apenas o próximo básico, sem ataque/carga gratuitos. Meowri salva uma vez por membro por rodada, antes de consumir Last Stand da relíquia. Arcane guarda um único bônus, consumido pelo especial de outro membro; não cria carga nem conjuração extra.

### 5.2 Atributos

| Trait EN / PT | Patamares | Efeito |
| --- | --- | --- |
| Devastator / Devastador | 2 / 4 | ATQ +10% / +20%. |
| Sentinel / Sentinela | 2 / 4 | DEF +40% / +80%. Não é redução direta de dano. |
| Unyielding / Inabalável | 2 / 4 | Vida máxima +15% / +30%. |
| Trailblazer / Desbravador | 2 / 4 | Movimento normal +25% / +50%. |
| Predator / Predador | 2 / 4 | Chance de crítico +20 / +40 pontos percentuais. Teto geral 75%. |
| Lookout / Atalaia | 2 / 4 | Alcance de ataques básicos à distância +10% / +20%. |
| Demolisher / Demolidor | 2 / 4 | Raio da área já existente no ataque básico +10% / +20%. Não altera áreas de especiais. |

Atalaia só foi distribuído a quem já tem ataque básico à distância; Demolidor só a quem já tem área no básico. O bônus de área não amplia skills com geometrias próprias. Movimento não acelera ataque nem carga. DEF não equivale ao mesmo percentual de redução direta de dano.

### 5.3 Temperamentos

| Trait EN / PT | Patamares | Efeito |
| --- | --- | --- |
| Audacious / Audacioso | 2 / 4 | Dano +15% / +25% sem outro aliado vivo a até 90. |
| Protector / Protetor | 2 / 4 | Uma vez por membro por rodada, aliado abaixo de 30% de vida a até 100 provoca inimigos a até 90 por 2s / 3s. |
| Ruthless / Impiedoso | 2 / 4 | Prioriza feridos no alcance básico; +15% / +25% de dano contra alvos abaixo de 30% de vida. |
| Impulsive / Impulsivo | 2 / 4 | Dano +20% / +35% nos primeiros 6s. |
| Patient / Paciente | 2 / 4 | Após 10s, DEF +40% / +80% até o fim da rodada. |
| Fearless / Destemido | 2 / 4 | Abaixo de 40% de vida, crítico +20 / +40 pontos percentuais. Teto geral 75%. |

Paciente aumenta defesa, não dano. Destemido aumenta chance de crítico, não dano. Impiedoso escolhe o menor percentual de vida dentro do alcance básico atual, respeitando provocação; não força perseguição a alvo fora do alcance nem troca o alvo próprio do especial. Protetor não provoca chefes de raid e não acumula provocações já ativas. Bônus condicionais novos de dano são somados entre si, antes das demais camadas existentes.

### 5.4 Distribuição dos 77 personagens

Nomes internos estáveis preservam saves, mesmo quando a tradução exibida difere. Cada linha representa um tipo de personagem, não uma cópia física.

| ID | Personagem | Facção | Atributo | Temperamento |
| --- | --- | --- | --- | --- |
| warrior | Warrior | Dawnward Order | Devastator | Fearless |
| lancer | Lancer | Dawnward Order | Demolisher | Impulsive |
| bastion | Bastion | Dawnward Order | Sentinel | Protector |
| shinobi | Shinobi | Legends of the East | Predator | Audacious |
| kinoichi | Kinoichi | Legends of the East | Demolisher | Ruthless |
| samurai | Samurai | Legends of the East | Devastator | Impulsive |
| omnamusha | OmnaMusha | Legends of the East | Predator | Audacious |
| ronin | Ronin | Legends of the East | Predator | Audacious |
| fighter | Fighter | Legends of the East | Unyielding | Fearless |
| martial_artist | Martial Artist | Legends of the East | Demolisher | Impulsive |
| shaolin | Shaolin | Legends of the East | Sentinel | Patient |
| cowboy | Cowboy | Wild West | Predator | Ruthless |
| gunner | Gunner | Wild West | Predator | Audacious |
| miner | Miner | Wild West | Demolisher | Patient |
| pirate_captain | Pirate Captain | Seasalt Crew | Unyielding | Protector |
| pirate | Pirate | Seasalt Crew | Trailblazer | Impulsive |
| cannoneer | Cannoneer | Seasalt Crew | Demolisher | Impulsive |
| ranger | Ranger | Verdant Covenant | Lookout | Patient |
| archer | Archer | Verdant Covenant | Lookout | Impulsive |
| crossbowman | Crossbowman | Verdant Covenant | Predator | Ruthless |
| mage | Mage | Arcane | Demolisher | Impulsive |
| sorceress | Sorceress | Arcane | Devastator | Impulsive |
| sage | Sage | Arcane | Unyielding | Protector |
| priestess | Priestess | Arcane | Unyielding | Patient |
| cavalier | Cavalier | Dawnward Order | Trailblazer | Impulsive |
| musketeer | Musketeer | Dawnward Order | Lookout | Ruthless |
| swordsman | Swordsman | Dawnward Order | Devastator | Fearless |
| duelist | Duelist | Dawnward Order | Predator | Audacious |
| viking | Viking | Frostborn Clans | Devastator | Fearless |
| shieldmaiden | Shieldmaiden | Frostborn Clans | Sentinel | Protector |
| shaman | Shaman | Frostborn Clans | Unyielding | Patient |
| berserker | Berserker | Frostborn Clans | Devastator | Fearless |
| huntress | Huntress | Frostborn Clans | Predator | Ruthless |
| glutton | Glutton | Frostborn Clans | Unyielding | Patient |
| bear_druid | Bear Druid | Verdant Covenant | Sentinel | Fearless |
| eagle_druid | Eagle Druid | Verdant Covenant | Trailblazer | Audacious |
| pirate_admiral | Pirate Admiral | Seasalt Crew | Sentinel | Patient |
| shackled_pirate | Shackled Pirate | Seasalt Crew | Unyielding | Fearless |
| goblin_spearman | Goblin Lanceiro | Goblin | Trailblazer | Ruthless |
| goblin_archer | Goblin Arqueiro | Goblin | Lookout | Ruthless |
| goblin_rider | Goblin Montador | Goblin | Trailblazer | Impulsive |
| goblin_brute | Goblin Bruto | Goblin | Unyielding | Fearless |
| goblin_bomber | Goblin Bombardeiro | Goblin | Demolisher | Impulsive |
| goblin_king | Rei Goblin | Goblin | Unyielding | Protector |
| orc_warrior | Orc Guerreiro | Orc | Sentinel | Protector |
| orc_berserker | Orc Berserker | Orc | Devastator | Fearless |
| orc_fighter | Orc Lutadora | Orc | Devastator | Ruthless |
| cave_troll | Troll da Caverna | Troll | Unyielding | Fearless |
| snow_troll | Troll das Neves | Troll | Unyielding | Protector |
| troll | Troll | Troll | Sentinel | Patient |
| mountain_troll | Troll da Montanha | Troll | Devastator | Impulsive |
| dark_elf_noble | Nobre Elfo Sombrio | Dark Elf | Predator | Audacious |
| dark_elf_archer | Arqueiro Elfo Sombrio | Dark Elf | Lookout | Ruthless |
| dark_elf_warrior | Guerreiro Elfo Sombrio | Dark Elf | Sentinel | Fearless |
| dark_elf_mage | Mago Elfo Sombrio | Dark Elf | Devastator | Patient |
| feline_swordsman | Espadachim Meowri | Meowri | Devastator | Fearless |
| feline_rogue | Gatuno Meowri | Meowri | Predator | Audacious |
| feline_arcanist | Feiticeiro Meowri | Meowri | Unyielding | Patient |
| feline_drummer | Percussionista Meowri | Meowri | Unyielding | Patient |
| feline_fighter | Lutador Meowri | Meowri | Trailblazer | Impulsive |
| elf_noble | Nobre Alto Elfo | High Elf | Predator | Ruthless |
| elf_guardian | Guerreiro Alto Elfo | High Elf | Sentinel | Protector |
| elf_archer | Arqueiro Alto Elfo | High Elf | Lookout | Patient |
| elf_halberdier | Lanceira Alta Elfa | High Elf | Devastator | Impulsive |
| woodland_predator | Predador Elfo da Floresta | Forest Elf | Predator | Ruthless |
| woodland_lancer | Guerreiro Elfo da Floresta | Forest Elf | Sentinel | Protector |
| woodland_scout | Batedor Elfo da Floresta | Forest Elf | Lookout | Audacious |
| woodland_flailer | Guardião Elfo da Floresta | Forest Elf | Devastator | Fearless |
| flower_fairy | Fada das Flores | Fairy | Trailblazer | Patient |
| elf_harpist | Harpista Alta Elfa | High Elf | Unyielding | Patient |
| centaur_crossbow | Caçadora Centaura | Centaur | Lookout | Audacious |
| centaur_lancer | Cavaleiro Centauro | Centaur | Trailblazer | Protector |
| centaur_swordsman | Espadachim Centauro | Centaur | Devastator | Audacious |
| sheriff | Xerife | Wild West | Trailblazer | Ruthless |
| bard | Barda | Arcane | Unyielding | Patient |
| gladiator | Gladiador | Dawnward Order | Sentinel | Fearless |
| blackfang_guardian | Guardião Elfo Negro | Dark Elf | Sentinel | Protector |

### 5.5 Interface e integração

A faixa de sinergias abre três grupos: Facção, Atributo e Temperamento, com número de traits ativos por grupo. Cada grupo oferece consulta de contagem, patamares e efeitos em janela delimitada do jogo. Ficha de personagem também permite consultar os três traits.

Relíquias antes dependentes de categorias removidas foram adaptadas: scope beneficia ataques básicos à distância; tome beneficia conjuradores; boots beneficia Desbravador; shield beneficia Sentinela. Marcos de três atiradores/conjuradores usam função de combate equivalente, preservando identidade/progresso do marco. Coleção mostra facção e, quando aplicável, ordem. Clique em filtro preserva a posição horizontal da barra e a posição da área de conteúdo quando possível.

## 6. Nerfs de autocura e proteção — v54

> **CP1:** Priestess, Harpista, Fada das Flores, Troll das Neves, Shaman, Sage, Feiticeiro Meowri, Barda, Rei Goblin e Percussionista Meowri passaram ao **modelo B** (aura passiva). As regras desses 10 personagens nesta seção são históricas.


Revisão de habilidades individuais do roster. Cura em outros aliados permanece no valor anterior; componente próprio foi reduzido. Cura de árvore/relíquia continua com sua regra própria. Escudos próprios não somam montantes ilimitados: reaplicar usa o maior montante/duração, sem soma. Habilidades protetoras listadas com intervalo mínimo de 6s continuam precisando da carga normal.

Recebimento de golpes só carrega habilidades quando houver dano efetivo à vida. Ataque totalmente absorvido pelo escudo não carrega novamente a proteção; dano contínuo não conta como golpe de carga. Isso corrige o ciclo de escudo praticamente permanente relatado no Orc Guerreiro.

| Personagem / ID | Regra atual |
| --- | --- |
| Orc Guerreiro / orc_warrior | Recebe escudo de 7,5% da vida máxima por 2,5s e empurra o alvo próximo 30. Intervalo mínimo 6s. Apenas golpes que ferem a vida carregam a habilidade. |
| Guardião Elfo Negro / blackfang_guardian | Atinge cone por 140% ATQ e provoca por 2s. Recebe escudo de 10% da vida máxima por 2,5s. Intervalo mínimo 6s. |
| Glutton / glutton | Recupera 10% da vida máxima, sem exceder o máximo. Intervalo mínimo 6s. |
| Berserker / berserker | Dois golpes de 90% ATQ. Recupera 12,5% do dano efetivo à vida, excluindo escudos e excesso de dano. |
| Troll da Caverna / cave_troll | Após 5s sem dano à vida, regenera 1% da vida máxima por segundo. Novo dano à vida interrompe a regeneração. |
| Troll das Neves / snow_troll | Cura aliados a até 85 em 8% da vida máxima (próprio: 4%). Redução de dano por 3s: aliados 10%, próprio 5%. Intervalo mínimo 6s. |
| Shaman / shaman | Cria totem por 5s (raio 85): +15% velocidade de ataque e cura de 1% da vida máxima por segundo aos aliados; autocura de 0,5%. Totens não acumulam. |
| Priestess / priestess | Cria santuário por 4s (raio 95). Cura por pulso: aliados 3,5% da vida máxima, próprio 1,75%. Remove um efeito negativo ao criar. |
| Harpista Alta Elfa / elf_harpist | Canaliza três pulsos em 3s. Cada um cura aliados a até 110 em 4% da vida máxima; próprio 2%. Atordoamento ou morte interrompe. |
| Fada das Flores / flower_fairy | Aproxima-se do aliado mais ferido, cura 12% da vida máxima dele (próprio: 6%) e remove lentidão e enraizamento. Sem ressurreição ou remoção de atordoamento. |
| Shieldmaiden / shieldmaiden | Protege a si com 7,5% da vida máxima do conjurador por 2,5s e um aliado ferido a até 100 com 15% por 4s. Intervalo mínimo 6s. |
| Sage / sage | Resgata o outro aliado mais ferido para a retaguarda e protege com 18% da vida máxima por 4s. Sozinho: escudo próprio de 9% por 2,5s. Intervalo mínimo 6s. |
| Feiticeiro Meowri / feline_arcanist | Protege o aliado mais ferido com 20% da vida máxima do conjurador por 4s (próprio: 10% por 2,5s). Enquanto protegido, +15% velocidade de ataque. Intervalo mínimo 6s. |
| Guerreiro Alto Elfo / elf_guardian | Após golpes básicos que ferem a vida, concede redução de dano por 3s: próprio 12,5%, outros aliados a até 85 15%. Intervalo mínimo 6s. |
| Bear Druid / bear_druid | Inimigos a até 85 perdem 20% ATQ por 3s; próprio recebe 7,5% menos dano por 3s. Intervalo mínimo 6s. |
| Guerreiro Elfo Sombrio / dark_elf_warrior | Corta cone (alcance 85) por 160% ATQ e recebe 10% menos dano por 3s. Intervalo mínimo 6s. |
| Duelist / duelist | Assume postura por 1,2s. Bloqueia próximo básico e contra-ataca por 180% ATQ em alcance corpo a corpo. Não bloqueia especiais. Intervalo mínimo 6s. |
| Shaolin / shaolin | Bloqueia cada sexto ataque básico recebido. Especiais e dano contínuo não são bloqueados. |

## 7. Ordens, bosses e raids

> **CP1:** líderes de boss de equipe ×0,80 (Rei Troll ×0,65; Rainha Meowri e Líder Centauro ×0,75); equipe com menos upgrades que a curva; raids dos mapas 2 e 3 com vida ×1,25 e dano ×1,1; correção do bug do lacaio invocado pelo Rei Goblin.


Blackfang e Dawncrest estão implementadas. Vencer as duas forças de uma mesma ordem no mapa ativa seu boss; uma rota mista não soma grupos diferentes. Desbloquear o catálogo exige derrotar o boss correspondente, sem cópia grátis. Antes disso ocultar pools de jogador em coleção, boosters, hacks, treino e lojas, preservando consulta do inimigo encontrado. Disponibilidade de run já iniciada é preservada.

Indicadores do mapa acumulam **x/6** pelos três mapas e abrem histórico por ato, incluindo confrontos vencidos. Boss daquele mapa continua dependendo das duas vitórias locais. True boss no terceiro mapa exige a mesma ordem nos bosses dos três atos. Formas são inimigos exclusivos e não entram nos 77 personagens ou boosters.

| Boss | Ordem | Condição / mecânica |
| --- | --- | --- |
| Rei Goblin | blackfang | Boss de equipe. A cada 10s, dispara uma salva de 140% ATQ e marca o alvo por 4s. Goblins causam +15% de dano nele. O primeiro aliado caído chama um lanceiro enquanto o Rei vive. |
| Rei Troll | blackfang | Boss de equipe. A cada 12s, prepara um golpe por 1,5s e atinge uma área frontal com 180% ATQ e atordoamento de 0,8s. Regenera 1% PV/s por 4s. Controle interrompe a preparação e a regeneração. |
| Imperador Orc | blackfang | Boss de equipe. A cada 6 ataques, golpeia com 220% ATQ e 110% nos próximos. Uma vez abaixo de 50% PV, aliados ganham +20% velocidade de ataque por 5s e o Imperador perde 25% DEF. |
| Rainha Meowri | dawncrest | Boss de equipe. A cada 8 ataques, avança até o inimigo mais distante, golpeia três vezes com 65% ATQ e recua. Meowri ganham 10 pontos percentuais de crítico por 4s. |
| Líder Centauro | dawncrest | Boss de equipe. A cada 11s, investe em linha com 160% ATQ e empurra inimigos. Centauros se movem 15% mais rápido enquanto o líder vive. A primeira carga concede escudo de 8% PV por 4s. |
| Rei High Elf | dawncrest | Boss de equipe. A cada 12s, causa 180% ATQ e protege o aliado mais ferido com escudo de 12% PV. Enquanto o Rei vive, a primeira habilidade ofensiva de cada aliado na rodada causa +15% de dano. |
| Rei Forest Elf | dawncrest | Boss de equipe. A cada 10s, raízes em área causam 100% ATQ e imobilizam por 1,2s. Aliados causam +15% de dano em inimigos enraizados enquanto o Rei vive. |
| Rei Dark Elf | blackfang | True boss, duas formas. Forma I: a cada 6 ataques, corta com 180% ATQ e reduz curas em 30% por 4s. Forma II: três selos reduzem o dano recebido em 10% cada. Quebre todos para expor o Rei por 6s. Um feixe anunciado atravessa a arena. |
| Rainha Fada | dawncrest | True boss, duas formas. Forma I: a cada 10s, cura e protege dois aliados. Forma II: duas auxiliares alternam cura e ataque. Derrote-as para enfraquecer a próxima explosão. A cura do boss é limitada a 5% PV máximo por rodada. |
| Quimera Primordial | monsters | True boss, duas formas. Forma I: comanda monstros menores e sopra fogo a cada 10s. Forma II: cada rodada anuncia uma cabeça dominante: cone de fogo, linha venenosa ou impacto próximo. Apenas uma cabeça age por vez. |
| Titã da Quimera | monsters | True boss, duas formas. Forma I: lidera monstros resistentes e golpeia a cada 12s. Forma II: ataques básicos acertados geram 1 instabilidade; habilidades ofensivas, 3. Aos 18, ajoelha por 6s, para de atacar e recebe +40% de dano. Pisões lentos e anunciados miram grupos. |

True bosses de duas formas têm transição preservada em save; a segunda forma usa vida persistente e fluxo de raid. Não remover as mecânicas das auxiliares da Fairy Queen: apenas o banner “Defeat the attendants” foi removido da arena.

### 7.1 Nove espécies de raid

Árvore/Broto, Colosso/Golem, Rei slime/Slime, Dragão/Wyvern, Hidra/Basilisco, Kraken/Cria, Lich/Esqueleto, Naga/Homem-serpente e Mantícora/Filhote. Artes fornecidas pelo usuário, mantidas sem redesenho. Fora de cartas, boosters e coleção.

Vida do chefe persiste entre rodadas; aliados revivem. Derrota após cinco rodadas perdidas. Sem timeout ou frenesi global. Vitória tem prioridade se morrer chefe e último aliado no mesmo passo. Minions não acumulam de uma rodada para outra; limite normal dois vivos. Chefe ancorado no fundo, contato pelo chão/corpo. Básico tem preparação de 0,45s, projétil de 0,22s e impacto na chegada.

Progressão comum: R1 solo; R2 dois lacaios; R3 especial; R4 evolução; R5 uma reposição limitada aos 28s. A condição própria do Rei slime exige eliminar toda a massa, inclusive minions destacados. As nove espécies são sorteadas sem repetição entre confrontos enfrentados na mesma run.

Escalas por posição antes do multiplicador de ato: primeira raid HP48%/dano72%/minions72%; segunda HP82%/dano93%/minions93%; boss HP135%/dano115%/minions115%. Não escalar defesa, alcance, intervalo ou movimento por posição. Sorteio não depende da força do jogador.

| Espécie | Especial / evolução |
| --- | --- |
| Árvore | Raízes marcadas em posição fixa; cura canalizada por Brotos vivos, limitada na rodada. |
| Colosso | Impacto de área anunciado; Golems vinculam armadura; duas quebras expõem núcleo e fortalecem/aceleram o chefe. |
| Rei slime | Divisão transfere vida do corpo a minions; retorno devolve só vida restante; ondas limitadas, poças em R4. Não criar vida ao dividir/reabsorver. |
| Dragão | Sopro em cone com direção fixada após aviso; fogo no chão em R4; Wyverns buscam retaguarda respeitando provocação. |
| Hidra | Salva com uma marca + basiliscos vivos, até três posições; ácido nas marcas em R4. |
| Kraken | Até duas marcas conforme crias vivas; imobiliza e passa a puxar atingidos em R4. |
| Lich | Ritual de ressurreição limitado por corpo; vulnerável enquanto canaliza; explosão no corpo em R4. |
| Naga | Cone petrificante com direção fixa; veneno limitado em cargas/duração. |
| Mantícora | Rajada de espinhos em faixas anunciadas; evolução e minions próprios, com limites de reposição. |

## 8. Relíquias, bolsa e economia

> **CP1:** upgrade na loja 10 / 16 (era 12 / 20). Relíquias de elites e bosses inimigos: sorteio entre 1 e n−1 (n = 1 + oportunidades de relíquia), limitado pela bolsa.


**25 relíquias**, com raridades próprias (não equivalentes entre si). Preço é o parâmetro efetivo do item; nem todo item do mesmo tier precisa ter preço idêntico. Forma na bolsa é independente da raridade. Apenas relíquias encaixadas e confirmadas dão bônus; reserva fica inativa.

Bolsa 4×4, 16 células; Marco Bag expandida acrescenta duas casas contíguas. Rotação em 90°, sem espelhamento. Arrastar preserva ponto de pega e footprint. Cancelar/posição inválida mantém arranjo confirmado. Compra de relíquia só cobra na aceitação confirmada, incluindo reserva; recusar não cobra. Não repetir item equipado/guardado/pendente. Concessão oferece encaixar, guardar ou recusar sem auto-reorganizar tudo.

Loja: cartas de custo 2/3/4 têm referência de 8/12/16 ouros, antes de descontos e upgrades. Upgrade 0→1 custa 12; 1→2 custa 20. Remover unidade comum custa 8; remover maldição custa 40. Reroll de loja/recrutamento custa 5, repetível, respeita pool e quatro cópias. Compra de carta exige botão próprio; consultar não compra.

| ID | Relíquia | Raridade | Ouro | Formato | Efeito |
| --- | --- | --- | --- | --- | --- |
| banner | Estandarte antigo | Comum | 30 | L3 | Todos os aliados têm +8% de ataque. |
| heart | Pedra vital | Comum | 30 | domino | Todos os aliados têm +10% de vida. |
| scope | Lente do viajante | Comum | 30 | domino | Aliados com ataque básico à distância recebem +15% ATQ. |
| tome | Tomo das estrelas | Rara | 35 | T | Conjuradores recebem +25% de poder de habilidade. |
| boots | Botas do vento | Incomum | 30 | L3 | Desbravadores recebem +20% movimento e +10% velocidade de ataque. |
| shield | Selo de proteção | Comum | 30 | L3 | Sentinelas recebem 10% menos dano. |
| precision | Medalhão da precisão | Incomum | 35 | dot | Todos os aliados: +5 pontos percentuais de chance crítica. Até +20 pontos por esta relíquia. |
| hourglass | Ampulheta de combate | Ultra rara | 40 | P | Uma unidade aliada aleatória elegível começa cada rodada com 50% da carga da habilidade. Contagens inteiras arredondam para baixo. Não acumula. |
| recovery | Broche da recuperação | Rara | 40 | square | Todos os aliados vivos recuperam 1% da vida máxima a cada 3 segundos. Até 3% por pulso. |
| merchant | Moeda do mercador | Incomum | 35 | line3 | Cartas e relíquias na loja custam 15% menos. Desconto máximo de 30%; preço arredondado para cima. |
| quickstart | Arranque rápido | Incomum | 30 | line3 | Receba 2 de energia extra na primeira preparação de cada confronto. |
| spark | Centelha eterna | Ultra rara | 40 | L5 | Receba 1 de energia extra em toda preparação, incluindo a primeira. |
| luckycharm | Amuleto da sorte | Comum | 30 | domino | Receba 20% mais ouro da run em recompensas. Não afeta diamantes ou reembolsos. |
| plating | Placas reforçadas | Incomum | 30 | square | Todos os aliados recebem 5% menos dano. |
| laststand | Última resistência | Ultra rara | 40 | T | Uma vez por rodada, o primeiro aliado a receber dano letal sobrevive com 1 de vida. |
| repulsion | Selo de repulsão | Rara | 35 | S | Uma vez por rodada, o primeiro aliado a cruzar 15% de vida empurra inimigos próximos. |
| fang | Presa vampírica | Rara | 35 | L4 | Ataques básicos curam o atacante em 5% do dano causado à vida. |
| execution | Marca do executor | Incomum | 30 | L3 | Cause 15% mais dano a inimigos abaixo de 30% de vida. |
| ember | Brasa vingativa | Rara | 35 | T | Cada aliado derrotado concede aos sobreviventes 5% mais dano de ataque nesta rodada, até 15%. |
| bell | Sino de abertura | Comum | 30 | line3 | Todos os aliados atacam 15% mais rápido nos primeiros 5 segundos de cada rodada. |
| captain_standard | Estandarte do capitão | Incomum | 35 | line3 | Escolha uma cópia do deck para a primeira mão de cada confronto. Posicionar continua custando energia. |
| profane_idol | Ídolo profano | Incomum | 35 | L3 | Aliados recebem +4% ATQ por maldição no deck da run, até +20%. |
| colossal_heart | Coração colossal | Rara | 40 | square | Aliados recebem +15% de vida. A primeira mão de cada confronto tem 3 cartas em vez de 4. |
| dormant_sword | Espada adormecida | Incomum | 35 | line3 | Aliados recebem +3% ATQ. Vença 2 confrontos de elite com ela equipada para substituir por +12% ATQ. Bosses não contam. |
| travelers_mirror | Espelho dos viajantes | Rara | 40 | square | Recrutar concede uma cópia extra com o mesmo upgrade, até 4 cópias. Compras na loja e duplicações não ativam. |

Coração colossal: +15% vida e primeira mão de três cartas. Ídolo profano conta maldições físicas, até +20% ATQ. Espada adormecida precisa estar equipada nas duas vitórias de elite, não conta boss; +12% substitui +3%. Estandarte escolhe uma cópia física e não torna implantação gratuita. Espelho só duplica recrutamento, preserva upgrade e limite de quatro; não duplica compra/duplicação de evento.

## 9. Cartas negativas e eventos — v53 mantida na v54

Maldições entram apenas no deck da run. Sem traits, unidade, fusão ou coleção permanente. Evento apresenta recompensa, custo, chance e consequência antes da confirmação. Escolhas são transações validadas novamente ao aceitar; resultado/rolagem não se repete ao recarregar.

| Carta | Efeito |
| --- | --- |
| Fardo / Burden | Injogável. Ocupa vaga na mão até descarte/reciclagem; continua no deck e pode voltar. Congelar preserva a carta. |
| Exaustão / Exhaustion | Ao comprar, consome até 1 energia disponível e vai ao descarte automaticamente. Não compra substituta: ocupa uma tentativa de compra mesmo sem energia. |
| Correntes / Chains | Pagar 1 energia afasta até o próximo confronto, sem benefício ou compra substituta; ou deixar ocupar a mão. |
| Mau Presságio / Ill Omen | Cada cópia na mão reduz em 1 o limite de campo, mínimo 1. Não retira quem já foi posicionado. |
| Chave de missão | Ocupa espaço no deck até encontro posterior possível, não necessariamente o próximo; é consumida na conclusão. Recompensa futura escolhida, sem coleção permanente. |

Primeira mão de confronto garante uma unidade disponível, sem compensar Exaustão com compra extra. Remover maldição na loja custa 40; Fonte permite uma escolhida grátis ou todas por 50. Reciclar não remove definitivamente. Segurança contra mão travada oferece saída do confronto, sem inventar compra grátis.

### 9.1 Critério econômico dos eventos

Referência: unidade comum a partir de 8, upgrade inicial 12, relíquia normalmente 30–40. Pacote misto custa **22**: 60% relíquia e 40% recruta. Upgrade seguro de evento custa 8/14 conforme nível; recrutamento custa 75% da referência; duplicação preserva upgrade e custa 75% do valor da cópia; relíquia conhecida em eventos indicados tem desconto de 10. Troca de relíquia por recrutas compensa diferença em ouro. Não cobrar mais por uma opção arriscada que por equivalente seguro de loja.

Nem todo risco é maldição: há perda de ouro/relíquia, luta normal/elite e sacrifício. Sempre permitir recusar/sair conforme fluxo da janela. Combate de evento derrotado encerra a run. Probabilidades e valores abaixo são implementados e provisórios para balanceamento.

#### Cofre amaldiçoado (`cofre`)

- Receber 8 ouros.

- Abrir: 55% relíquia escolhida; 45% Correntes, sem a relíquia.

#### Viajante aprisionado (`resgate`)

- Pagar pelo recruta escolhido — preço depende da seleção conforme fórmulas acima.

- Grátis: 70% recruta agora; 30% combate pelo mesmo recruta. Derrota encerra a run..

#### Altar da renovação (`altar`)

- Melhorar uma unidade escolhida — preço depende da seleção conforme fórmulas acima.

- Sacrificar uma unidade escolhida; melhorar outras duas unidades distintas.

#### Caravana perdida (`caravana`)

- Receber 8 ouros.

- 60% ganhar 28 ouros; 40% perder 10 ouros. Exige 10 ouros..

#### Mercador encapuzado (`mercador`)

- Comprar o recruta conhecido escolhido — preço depende da seleção conforme fórmulas acima.

- Pacote misterioso: 60% relíquia aleatória (30–40 ouros); 40% recruta aleatório (8–16 ouros) — 22 ouros.

#### Treino proibido (`dojo`)

- Upgrade garantido — preço depende da seleção conforme fórmulas acima.

- Grátis: 75% upgrade; 25% Mau Presságio, sem upgrade.

#### Santuário dos viajantes (`santuario`)

- Pagar por um recruta escolhido — preço depende da seleção conforme fórmulas acima.

- Trocar uma relíquia escolhida por dois recrutas exibidos +ouro cobrindo diferença de valor.

#### Forja instável (`forja`)

- Relíquia +10 ouros: escolher outra de raridade igual ou maior — 10 ouros.

- Oferecer relíquia: 70% substituta escolhida de raridade igual ou maior; 30% perder a relíquia oferecida.

#### Desafio do mestre (`mestre`)

- Pagar pelo upgrade garantido — preço depende da seleção conforme fórmulas acima.

- Combater por upgrade +12 ouros. Derrota encerra a run..

#### Mesa de apostas (`aposta`)

- Apostar 6: 75% receber 10 ouros no total; 25% perder aposta — 6 ouros.

- Apostar 12: 55% receber 30 ouros no total; 45% perder aposta — 12 ouros.

#### Contrabandista (`contrabando`)

- Comprar recruta escolhido no upgrade 1 — preço depende da seleção conforme fórmulas acima.

- Grátis: 70% recruta escolhido no upgrade 1; 30% perder relíquia aleatória, sem recruta.

#### Contrato de despedida (`despedida`)

- Remover unidade escolhida e receber 20 ouros. Não remove a última unidade..

- Remover uma maldição escolhida — 40 ouros.

#### Tesouro guardado (`tesouro`)

- Combater pela relíquia escolhida +10 ouros. Derrota encerra a run..

- 60% relíquia escolhida agora; 40% combate por ela, sem ouro. Derrota encerra a run..

#### Santuário profanado (`profanado`)

- Comprar a relíquia escolhida com desconto de 10 ouros — preço depende da seleção conforme fórmulas acima.

- 50% relíquia agora; 50% combate contra inimigos fortalecidos (+5%) por ela. Derrota encerra a run..

#### Caravana sob ataque (`ataque`)

- Pagar pelo recruta escolhido — preço depende da seleção conforme fórmulas acima.

- 40% recruta agora; 60% combate por recruta +10 ouros. Derrota encerra a run..

#### Câmara do campeão (`camara`)

- Comprar a relíquia escolhida com desconto de 10 ouros — preço depende da seleção conforme fórmulas acima.

- 30% relíquia +20 ouros agora; 70% combate de elite (+5%) pela mesma recompensa. Derrota encerra a run..

#### Lago dos reflexos (`reflexos`)

- Duplicar unidade escolhida, preservando upgrade — preço depende da seleção conforme fórmulas acima.

- Grátis: 65% duplicar escolhida com upgrade; 35% Fardo, sem duplicação.

#### Fonte da purificação (`purificacao`)

- Remover uma maldição escolhida grátis.

- Remover todas as maldições — 50 ouros.

#### Arena dos desafiantes (`arena`)

- Vencer combate por 15 ouros e decidir se arrisca em um confronto de elite.

- Receber 8 ouros do patrocinador sem combater.

#### Negociador das sombras (`sombras`)

- Receber 30 ouros +Fardo.

- Escolher relíquia rara +Exaustão.

#### Banquete dos mercenários (`banquete`)

- Próximo confronto: +5% vida, ATQ e DEF em todas as rodadas — 8 ouros.

- Próximo confronto: +15% vida, ATQ e DEF em todas as rodadas — 20 ouros.

#### A chave do prisioneiro (`chave`)

- Pagar 10 ouros pela chave de missão. Depois: recruta raro upgrade 1 OU relíquia rara — 10 ouros.

- Receber a mesma chave de missão +Correntes.

#### A porta do prisioneiro (`quest_end`)

- Libertar aliado raro escolhido no upgrade 1.

- Abrir tesouro: escolher relíquia rara.

A porta do prisioneiro é conclusão de missão, não um 23º evento independente no sorteio. A Fonte só aparece havendo maldição; missões e trocas exigem alvos/recompensas viáveis. O sorteio inclui oportunidades periódicas de tentação, sem aquisição obrigatória de maldição.

## 10. Árvore permanente e XP — implementada

Visual radial conectado inspirado no grid de FFX, cinco direções: Poder, Vitalidade, Proteção, Agilidade e Expedição. Origem gratuita. **60 nodes compráveis**, sem exclusividade e sem exigir voltar fisicamente pelo caminho para trocar de direção. Cada node exige ligação com algum desbloqueado; pontes permitem cruzamentos. Não exige fechar uma categoria ou mapa específico. Menu principal consulta; compra somente após boss.

XP começa em zero em cada run. Cada confronto de caminho não-boss dá 1 XP; boss dá 2/4/6 conforme ato. Total sem bônus adicionais: 10/12/14 por mapa, 36 na run. Combates extras de eventos não geram XP dessa contagem. Primeiro mapa concluído permite comprar um node inicial de custo 8 e guardar sobra.

Após cada boss abre a árvore, inclusive após boss do mapa 3, antes do resultado final. Compras são permanentes e aplicadas imediatamente à run atual; bônus comprado no fim do mapa 1 já vale no mapa 2. XP não gasto segue só até o próximo mapa da mesma run. Derrota/abandono/final após a última sessão zera o saldo. Não há transferência de saldo entre runs, só dos nodes comprados. Recompensas e conclusão são idempotentes.

| Categoria | Básicos | Especiais | Marcos | Total |
| --- | --- | --- | --- | --- |
| Poder | 10 | 3 | 1 | 14 |
| Vitalidade | 8 | 2 | 1 | 11 |
| Proteção | 8 | 2 | 1 | 11 |
| Agilidade | 8 | 3 | 1 | 12 |
| Expedição | 4 | 6 | 2 | 12 |

Custos iniciais 8 e 10; básicos posteriores 10/12; especiais 14–20 conforme profundidade; Marcos 32, ou 36 em Expedição. Patamares pequenos são intencionais: ATQ1%, HP3%, DEF2%, crítico1 ponto, dano crítico3%, haste1%, movimento3%, cura3%, resistência a controle5%, ouro5%, desconto3%. Velocidade de ataque permanece na árvore; sua remoção foi dos traits de atributo.

### Catálogo completo e conexões

IDs estáveis; links são bidirecionais e incluem `origin` quando ligados ao começo. Uma ligação desbloqueada basta para comprar. Sem reset de árvore implementado nesta entrega.

| ID | Ramo | Tipo | Nome | XP | Efeito | Conexões |
| --- | --- | --- | --- | --- | --- | --- |
| pow_atk_1 | Poder | Básico | Ataque 1 | 8 | +1% ataque. | origin, pow_atk_2 |
| pow_atk_2 | Poder | Básico | Ataque 2 | 10 | +1% ataque. | pow_atk_1, pow_atk_3, pow_atk_5 |
| pow_atk_3 | Poder | Básico | Ataque 3 | 10 | +1% ataque. | pow_atk_2, first_impact, def_armor_3 |
| pow_atk_4 | Poder | Básico | Ataque 4 | 12 | +1% ataque. | execution, devastating, agi_rate_3 |
| pow_atk_5 | Poder | Básico | Ataque 5 | 10 | +1% ataque. | pow_atk_2, pow_crit_2 |
| pow_atk_6 | Poder | Básico | Ataque 6 | 12 | +1% ataque. | pow_cdamage_1, pow_cdamage_2 |
| pow_crit_1 | Poder | Básico | Chance de crítico 1 | 12 | +1 ponto percentual de chance de crítico. | first_impact, execution |
| pow_crit_2 | Poder | Básico | Chance de crítico 2 | 10 | +1 ponto percentual de chance de crítico. | pow_atk_5, penetration |
| pow_cdamage_1 | Poder | Básico | Dano crítico 1 | 12 | +3% dano crítico. | penetration, pow_atk_6 |
| pow_cdamage_2 | Poder | Básico | Dano crítico 2 | 12 | +3% dano crítico. | pow_atk_6 |
| vit_hp_1 | Vitalidade | Básico | Vida máxima 1 | 8 | +3% vida máxima. | origin, vit_hp_2 |
| vit_hp_2 | Vitalidade | Básico | Vida máxima 2 | 10 | +3% vida máxima. | vit_hp_1, vit_hp_3, vit_hp_4 |
| vit_hp_3 | Vitalidade | Básico | Vida máxima 3 | 10 | +3% vida máxima. | vit_hp_2, urgent_heal, exp_shop_2 |
| vit_hp_4 | Vitalidade | Básico | Vida máxima 4 | 10 | +3% vida máxima. | vit_hp_2, second_wind, def_armor_5 |
| vit_hp_5 | Vitalidade | Básico | Vida máxima 5 | 12 | +3% vida máxima. | second_wind, vit_heal_2 |
| vit_hp_6 | Vitalidade | Básico | Vida máxima 6 | 12 | +3% vida máxima. | vit_heal_2 |
| vit_heal_1 | Vitalidade | Básico | Cura recebida 1 | 12 | +3% cura recebida. | urgent_heal, survival |
| vit_heal_2 | Vitalidade | Básico | Cura recebida 2 | 12 | +3% cura recebida. | vit_hp_5, vit_hp_6 |
| def_armor_1 | Proteção | Básico | Defesa 1 | 8 | +2% defesa. | origin, def_armor_2 |
| def_armor_2 | Proteção | Básico | Defesa 2 | 10 | +2% defesa. | def_armor_1, def_armor_3, def_armor_4 |
| def_armor_3 | Proteção | Básico | Defesa 3 | 10 | +2% defesa. | def_armor_2, formation, pow_atk_3 |
| def_armor_4 | Proteção | Básico | Defesa 4 | 10 | +2% defesa. | def_armor_2, strong_shields |
| def_armor_5 | Proteção | Básico | Defesa 5 | 12 | +2% defesa. | strong_shields, def_control_2, vit_hp_4 |
| def_armor_6 | Proteção | Básico | Defesa 6 | 12 | +2% defesa. | def_control_2 |
| def_control_1 | Proteção | Básico | Resistência a controle 1 | 12 | Efeitos de controle duram 5% menos tempo. | formation, last_line |
| def_control_2 | Proteção | Básico | Resistência a controle 2 | 12 | Efeitos de controle duram 5% menos tempo. | def_armor_5, def_armor_6 |
| agi_rate_1 | Agilidade | Básico | Velocidade de ataque 1 | 8 | +1% velocidade de ataque. | origin, agi_rate_2 |
| agi_rate_2 | Agilidade | Básico | Velocidade de ataque 2 | 10 | +1% velocidade de ataque. | agi_rate_1, agi_rate_3, agi_rate_4 |
| agi_rate_3 | Agilidade | Básico | Velocidade de ataque 3 | 10 | +1% velocidade de ataque. | agi_rate_2, sprint, pow_atk_4 |
| agi_rate_4 | Agilidade | Básico | Velocidade de ataque 4 | 10 | +1% velocidade de ataque. | agi_rate_2, momentum |
| agi_rate_5 | Agilidade | Básico | Velocidade de ataque 5 | 12 | +1% velocidade de ataque. | momentum, readiness |
| agi_move_1 | Agilidade | Básico | Movimento 1 | 12 | +3% movimento. | sprint, rhythm |
| agi_move_2 | Agilidade | Básico | Movimento 2 | 12 | +3% movimento. | rhythm |
| agi_move_3 | Agilidade | Básico | Movimento 3 | 12 | +3% movimento. | readiness |
| exp_gold_1 | Expedição | Básico | Ouro recebido 1 | 8 | +5% ouro recebido. | origin, exp_gold_2 |
| exp_gold_2 | Expedição | Básico | Ouro recebido 2 | 10 | +5% ouro recebido. | exp_gold_1, exp_shop_1, exp_shop_2 |
| exp_shop_1 | Expedição | Básico | Desconto em lojas 1 | 10 | +3% desconto em lojas. | exp_gold_2, market |
| exp_shop_2 | Expedição | Básico | Desconto em lojas 2 | 10 | +3% desconto em lojas. | exp_gold_2, planned_purchase, vit_hp_3 |
| first_impact | Poder | Especial | Primeiro impacto | 16 | Ataques básicos causam +8% de dano em inimigos com vida cheia. | pow_atk_3, pow_crit_1 |
| execution | Poder | Especial | Execução | 20 | Causa +5% de dano em inimigos abaixo de 30% de vida. | pow_crit_1, pow_atk_4 |
| penetration | Poder | Especial | Penetração | 18 | Ataques básicos ignoram 5% da defesa do alvo. | pow_crit_2, pow_cdamage_1 |
| devastating | Poder | Marco | Abertura devastadora | 32 | A primeira skill ofensiva de cada unidade na rodada causa +15% de dano. | pow_atk_4 |
| urgent_heal | Vitalidade | Especial | Recuperação urgente | 16 | Recebe +10% de cura enquanto estiver abaixo de 40% de vida. | vit_hp_3, vit_heal_1 |
| second_wind | Vitalidade | Especial | Segundo fôlego | 16 | A primeira ativação de skill na rodada cura seu usuário em 3% da vida máxima. | vit_hp_4, vit_hp_5 |
| survival | Vitalidade | Marco | Instinto de sobrevivência | 32 | Uma vez por unidade por rodada, sobreviver abaixo de 25% de vida concede escudo de 8% da vida máxima por 6s. | vit_heal_1 |
| formation | Proteção | Especial | Formação defensiva | 16 | Recebe −5% de dano nos primeiros 5s de cada rodada. | def_armor_3, def_control_1 |
| strong_shields | Proteção | Especial | Escudos reforçados | 16 | Escudos recebidos são 10% maiores. | def_armor_4, def_armor_5 |
| last_line | Proteção | Marco | Última linha | 32 | A primeira morte aliada na rodada concede aos sobreviventes escudo de 5% da vida máxima por 6s. | def_control_1 |
| sprint | Agilidade | Especial | Arranque | 16 | Ataca 8% mais rápido até concluir os 3 primeiros ataques básicos da rodada. | agi_rate_3, agi_move_1 |
| momentum | Agilidade | Especial | Embalado | 16 | Uma skill de deslocamento concede ao usuário +8% de velocidade de ataque por 3s. Reativar renova a duração. | agi_rate_4, agi_rate_5 |
| readiness | Agilidade | Especial | Prontidão | 20 | Começa a rodada com 10% da barra de especial. Não afeta skills passivas ou que já começam carregadas. | agi_rate_5, agi_move_3 |
| rhythm | Agilidade | Marco | Ritmo de batalha | 32 | A primeira ativação de skill da rodada concede +10% de velocidade de ataque por 4s. | agi_move_1, agi_move_2 |
| market | Expedição | Especial | Pesquisa de mercado | 16 | Renova as ofertas de cartas uma vez de graça por loja. As ofertas de relíquias são mantidas. | exp_shop_1, candidates |
| candidates | Expedição | Especial | Mais candidatos | 18 | Nodes de recrutamento oferecem um candidato adicional, respeitando disponibilidade e limite de cópias. | market, training_deal |
| training_deal | Expedição | Especial | Treino negociado | 20 | O primeiro upgrade pago de carta em cada loja recebe mais 10% de desconto. | candidates, expanded_bag |
| planned_purchase | Expedição | Especial | Compra planejada | 16 | A primeira carta comprada em cada mapa custa 2 ouros a menos. Preço mínimo: 1 ouro. | exp_shop_2, explorer |
| explorer | Expedição | Especial | Olhar de explorador | 18 | Recompensas de escolha de relíquia oferecem uma opção adicional quando disponível. | planned_purchase, provisions |
| provisions | Expedição | Especial | Provisões | 20 | Recebe 5 ouros ao entrar em cada mapa. | explorer, caravan |
| expanded_bag | Expedição | Marco | Bag expandida | 36 | Adiciona permanentemente duas casas contíguas abaixo da bolsa de relíquias. | training_deal |
| caravan | Expedição | Marco | Caravana aliada | 36 | No primeiro recrutamento de cada mapa, escolhe até duas ofertas diferentes em vez de uma. | provisions |

## 11. Coleção, progressão, treinamento, hacks e persistência

> **CP1:** novos desbloqueios de deck por milestones e bosses de ordem, migração para saves com milestones concluídos e o milestone novo "Derrotar o boss do mapa 2". Ver INTEGRACAO_CHATGPT.md, seção 6.


### Perfil e saves

Coleção, boosters, diamantes, catálogos, milestones, dez espaços de custom decks e perfil são permanentes. Ouro/cartas/upgrades/relíquias recebidos na run são temporários; não viram posse da coleção. Milestones concedem seus desbloqueios uma única vez. New game é reset com confirmação, diferente de abandonar run ou começar outra.

Save local ao navegador/aparelho/origem, sem sincronização entre dispositivos. Perfil schema 1; estado da run e `gameVersion` seguem 20 por compatibilidade, independentemente do número do conteúdo. Manter export/import JSON, recuperação local/IndexedDB e marcadores de reset. Combate normal interrompido segue recuperação existente para preparo. Raid usa snapshot para retomar o combate pausado, mantendo HP, tempo e efeitos; ver seção 11. Preservar vínculos, banco, fusões, ordem de implantação, Bag, mão congelada, tutorial e rota. Não apagar save inválido sem tentativa de recuperação válida.

Fim de run solicita backup JSON e permite download manual; não afirmar que Android concluiu o download. Relato antigo de alternância entre saves antigos/novos segue como risco de playtest, sem causa definitivamente confirmada no Android. Não prometer PWA/offline ou persistência entre aparelhos: a entrega inicial requer rede/acesso ao Site.

### Treinamento

Modo gratuito e isolado. Não gasta recursos nem concede ouro/diamantes/coleção/milestones/estatísticas da run. Preserva a run normal ao entrar, sair, exportar ou recarregar.

- Cada lado escolhe deck emprestado desbloqueado ou monta 20 cartas de personagens já revelados, até quatro cópias, sem consumir cópias da coleção.
- Upgrades individuais 0/1/2, melhoria de todas e relíquias por lado respeitando 4×4. Sem relíquias é válido.
- Dificuldade normal/elite/boss; escolher de uma a dez vitórias de rodada para terminar. Upgrades/relics selecionados aplicados exatamente; dificuldade usa escala existente da IA.
- Cartas embaralhadas/compradas normalmente; **não fixar as mesmas compras**. Repetir usa a mesma configuração e um novo embaralhamento. Alterar configuração retorna preenchido; opção de menu principal.
- Editor em três colunas, estilo compacto do Hack de cartas. Todas as escolhas abrem janelas do jogo.
- Hacks permanentes são bloqueados no treino; não abrir acesso a diamantes/coleção por esse modo.

### Hacks, tutorial e relatórios

Hacks implementados: +10 diamantes, +100 ouro da run, escolher cartas/relíquias para a run, curar todos os aliados vivos em campo, encher especiais de aliados ativos, **vencer rodada** e **vencer confronto**. Cura não revive nem afeta inimigos; especial não modifica passivas. Seleção de cartas/relíquias da run é bloqueada durante combate; vitória/cura/especial funcionam no combate ativo, inclusive pausado.

Em combates de decks, vencer rodada dá um ponto e vencer confronto completa o limiar real (três normal/elite, quatro Boss). Em raid, usar o Hack de vitória elimina o monstro pelo fluxo próprio, sem inventar uma vitória de rodada que não derrota o chefe. Usar o fluxo normal de resultado/relatórios/recompensa/progressão, uma vez. Não inventar dano para o relatório nem premiar rodada como confronto.

Tutorial guiado em três rodadas: posicionamento, traits, energia, capacidade, ataques/especial/velocidade, banco, arraste, retirada, refresh, informação, View deck, Card Cycle, freeze/fusão, mapa e Bag. Durante a espera do combate, mensagem/escurecimento somem após três segundos reais; ao encerrar a rodada o fluxo retorna. Realce acompanha o elemento correto durante animação/rolagem, inclusive Confirm bag. Vital Stone guiada é recompensa temporária única. Replay é isolado e restaura a run original; pode concluir Primeiros passos sem dar recursos/estatísticas.

Resultado: placar e próxima ação acima de quatro tabelas em grade 2×2 (dano causado/recebido de cada equipe). Rodadas intermediárias mostram a rodada; encerramento mostra acumulado do confronto. Cópias separadas e identificadas; ordenar por dano. Contar dano efetivo à vida, excluindo escudo e excesso.

Atualizações posteriores à v45 já implementadas: hacks para avançar/selecionar mapa e node de teste, além das vitórias. Saltos não concedem falsas recompensas, XP, vitórias de ordem ou marcos. Contadores x/6 têm histórico por mapa. Menu da árvore e escolhas usam janelas na linguagem visual do jogo, sem select nativo do Android. Goblin Rider tem sprite no campo e feedback de ataque dos monstros foi revisado.

Treino inclui as nove raids; nenhum teste deve conceder coleção/diamantes indevidos. Tutorial/replay permanece isolado. Salvar/importar/exportar conserva perfil e unlocks. Envelope principal compatível versão 20; conteúdo de eventos opcional schema1; árvore e traits adicionam dados opcionais. Snapshot de raid conserva PRNG, projéteis, áreas, estados temporários, patamares da rodada, mortes Frostborn, alvos/contadores e recuo Centaur. Retomada fica pausada. Snapshot sem combate ativo também é válido. Saves antigos de raid recebem os novos dados sem reconstruir mapa; uma partida nova é a referência recomendada de playtest da revisão.

## 12. Pendências e ordem recomendada

Itens abaixo não fazem parte automática da autorização v54. Solicitar definição/autorização quando chegar a etapa.

1. Playtest do bloco atual: maldições/eventos/relíquias, três mapas/árvore, novos traits e nerfs. Registrar bugs concretos e ajustar quando autorizado.
2. Energia para iniciar runs: proposta histórica custo 5, capacidade 30 e +1 a cada três minutos; separada da energia de combate, com hack de teste. Fechar persistência e comportamento de relógio antes de implementar.
3. Login diário: proposta dias 1–6 +1 diamante, dia 7 +7; ausência reinicia. Virada de dia e recuperação ainda precisam ser consolidadas.
4. Histórico analítico de runs para escolhas, composições, derrotas e economia. Os registros/estatísticas existentes não equivalem a um histórico analítico completo.
5. PWA/offline e sincronização entre aparelhos, como entregas distintas; tratar cache/atualizações e conflitos de save.
6. Revisão geral: combate, movimentação, skills, fusões, economia, recompensas, rotas, saves, tutorial, idiomas, acessibilidade e tela fixa.
7. Balanceamento integrado por perfis iniciante/avançado, incluindo upgrades inimigos versus ouro/lojas reais, escalas de raid, árvore e combinações de traits. Simulações isoladas não demonstram dificuldade correta da run inteira.
8. Essência e cosméticos por excedentes, menor prioridade; rendimentos/preços e cópias preservadas ainda não fechados. Novas ordens/facções só com definição própria.

Não reintroduzir a animação rejeitada do Warrior. Animações novas dependem de arte e validação. Não substituir pixel art por arte anime provisória. Não transformar uma opção de playtest em mudança permanente sem autorização.

## 13. Base técnica e validação da v54

Fonte real é o repositório vinculado ao Site. Recuperar HEAD publicado antes de editar; não retomar checkout v40/v43/v45 antigo. Arquivos `dist/index.html`, `game-0.js`, `game-5.js`, `game-7.js`, `style.css`, módulos de treino/raids/monstros/atos/bosses/mapas/árvore/conteúdo e os novos `traits-v54.js`/`traits-ui-v54.js`. Evitar renomear módulos históricos apenas pela versão da entrega.

Novos traits são dados de combate serializáveis; preservar os IDs das cartas, skills, marcos e compras. Exportar helpers de combate não deve dar acesso a novas recompensas. Nunca guardar credenciais na documentação ou no repositório.

Validações: 77 distribuições / 29 traits; patamares dos sete atributos; condições das facções/temperamentos; nerfs e carga por dano real; 30 simulações variadas; restauração determinística de raid; compatibilidade de snapshot sem combate; todos os 11 bosses e quatro transformações; ciclo de XP nos três mapas; 3.000 mapas e alcance das ordens. Testes de conteúdo v53, árvore v51 e correções v52 preservados. QA de interface em 320×640, 360×740 e 430×800, com ações acessíveis e rolagem interna. Sem ensaio físico em Android e sem afirmar balanceamento final.

## 14. Atributos-base e habilidades do roster

> **CP1:** 33 personagens tiveram custo, raridade, vida, ataque, área ou poder de habilidade alterados (`dist/balance-p1.js`). **A tabela abaixo é histórica para eles**; os valores vigentes estão em TABELA_ALTERACOES e em `balanceamento/dados_checkpoint_CP1.json`.


Dados-base sem upgrade, fusão, árvore, relíquias ou traits ativos. Intervalo é em segundos; ataques/s = 1/intervalo. Poder de skill pode escalar por upgrade/fusão, mas gatilhos e durações não escalam automaticamente. Descrições mantêm o texto cadastrado quando não houve revisão neste bloco.

| ID | Nome | Energia | Raridade | HP | ATQ | DEF | Intervalo | Movimento | Crítico | Alcance | Área básica |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| warrior | Warrior | 2 | Comum | 290 | 27 | 26 | 1.08 | 49 | 7% | 34 | 0 |
| lancer | Lancer | 2 | Comum | 230 | 27 | 26 | 1.08 | 60 | 7% | 62 | 35 |
| bastion | Bastion | 3 | Comum | 360 | 20 | 52 | 1.65 | 30 | 3% | 34 | 0 |
| shinobi | Shinobi | 3 | Rara | 180 | 35 | 8 | 0.68 | 74 | 25% | 34 | 0 |
| kinoichi | Kinoichi | 3 | Incomum | 180 | 27 | 16 | 0.86 | 74 | 18% | 62 | 35 |
| samurai | Samurai | 3 | Incomum | 290 | 35 | 38 | 1.35 | 49 | 12% | 34 | 0 |
| omnamusha | OmnaMusha | 3 | Incomum | 230 | 27 | 26 | 0.68 | 60 | 18% | 34 | 0 |
| ronin | Ronin | 3 | Rara | 230 | 45 | 16 | 1.35 | 49 | 25% | 34 | 0 |
| fighter | Fighter | 2 | Comum | 290 | 27 | 16 | 0.68 | 60 | 12% | 34 | 0 |
| martial_artist | Martial Artist | 2 | Comum | 230 | 27 | 26 | 0.86 | 60 | 7% | 62 | 35 |
| shaolin | Shaolin | 3 | Ultra rara | 290 | 20 | 38 | 1.08 | 49 | 3% | 34 | 0 |
| cowboy | Cowboy | 2 | Comum | 230 | 27 | 16 | 0.86 | 49 | 25% | 145 | 0 |
| gunner | Gunner | 3 | Comum | 180 | 35 | 8 | 1.08 | 49 | 18% | 180 | 0 |
| miner | Miner | 2 | Comum | 290 | 35 | 16 | 1.35 | 39 | 7% | 62 | 35 |
| pirate_captain | Pirate Captain | 4 | Rara | 290 | 27 | 26 | 1.08 | 49 | 12% | 145 | 0 |
| pirate | Pirate | 2 | Comum | 230 | 27 | 16 | 0.86 | 60 | 18% | 34 | 0 |
| cannoneer | Cannoneer | 4 | Comum | 290 | 45 | 26 | 1.65 | 30 | 3% | 180 | 65 |
| ranger | Ranger | 2 | Comum | 230 | 27 | 16 | 1.08 | 60 | 12% | 145 | 0 |
| archer | Archer | 2 | Comum | 180 | 20 | 8 | 0.68 | 60 | 12% | 180 | 0 |
| crossbowman | Crossbowman | 3 | Comum | 230 | 45 | 26 | 1.65 | 39 | 18% | 180 | 0 |
| mage | Mage | 4 | Comum | 180 | 27 | 8 | 1.35 | 39 | 3% | 145 | 35 |
| sorceress | Sorceress | 4 | Rara | 180 | 20 | 8 | 1.08 | 49 | 7% | 145 | 0 |
| sage | Sage | 3 | Ultra rara | 230 | 14 | 26 | 1.35 | 30 | 3% | 145 | 0 |
| priestess | Priestess | 4 | Incomum | 180 | 20 | 16 | 1.08 | 49 | 3% | 145 | 0 |
| cavalier | Cavalier | 4 | Rara | 360 | 35 | 38 | 1.3513513513513513 | 74 | 7% | 62 | 0 |
| musketeer | Musketeer | 3 | Incomum | 230 | 45 | 26 | 1.639344262295082 | 39 | 12% | 180 | 0 |
| swordsman | Swordsman | 3 | Incomum | 290 | 45 | 16 | 1.3513513513513513 | 49 | 12% | 62 | 0 |
| duelist | Duelist | 3 | Rara | 230 | 27 | 16 | 0.6802721088435374 | 60 | 25% | 34 | 0 |
| viking | Viking | 3 | Comum | 290 | 35 | 26 | 1.3513513513513513 | 49 | 12% | 34 | 0 |
| shieldmaiden | Shieldmaiden | 3 | Incomum | 290 | 20 | 38 | 1.075268817204301 | 49 | 7% | 34 | 0 |
| shaman | Shaman | 4 | Rara | 230 | 20 | 16 | 1.075268817204301 | 49 | 3% | 145 | 0 |
| berserker | Berserker | 3 | Incomum | 290 | 35 | 8 | 0.8620689655172414 | 60 | 12% | 34 | 0 |
| huntress | Huntress | 3 | Incomum | 230 | 35 | 16 | 1.075268817204301 | 60 | 18% | 145 | 0 |
| glutton | Glutton | 3 | Comum | 360 | 27 | 26 | 1.639344262295082 | 30 | 3% | 34 | 0 |
| bear_druid | Bear Druid | 4 | Rara | 360 | 35 | 38 | 1.3513513513513513 | 49 | 7% | 62 | 0 |
| eagle_druid | Eagle Druid | 3 | Rara | 180 | 27 | 8 | 0.8620689655172414 | 74 | 18% | 34 | 0 |
| pirate_admiral | Pirate Admiral | 4 | Ultra rara | 360 | 45 | 38 | 1.639344262295082 | 30 | 7% | 62 | 0 |
| shackled_pirate | Shackled Pirate | 2 | Comum | 290 | 35 | 16 | 1.3513513513513513 | 39 | 7% | 62 | 0 |
| goblin_spearman | Goblin Lanceiro | 2 | Comum | 180 | 27 | 8 | 0.8620689655172414 | 60 | 12% | 62 | 0 |
| goblin_archer | Goblin Arqueiro | 2 | Comum | 180 | 20 | 8 | 0.8620689655172414 | 60 | 12% | 180 | 0 |
| goblin_rider | Goblin Montador | 3 | Incomum | 290 | 27 | 26 | 1.075268817204301 | 74 | 7% | 62 | 0 |
| goblin_brute | Goblin Bruto | 3 | Incomum | 290 | 35 | 16 | 1.075268817204301 | 49 | 7% | 34 | 0 |
| goblin_bomber | Goblin Bombardeiro | 3 | Rara | 180 | 35 | 8 | 1.639344262295082 | 60 | 12% | 145 | 35 |
| goblin_king | Rei Goblin | 4 | Ultra rara | 360 | 20 | 26 | 1.3513513513513513 | 30 | 3% | 145 | 0 |
| orc_warrior | Orc Guerreiro | 3 | Comum | 290 | 27 | 38 | 1.3513513513513513 | 39 | 7% | 34 | 0 |
| orc_berserker | Orc Berserker | 3 | Incomum | 290 | 35 | 16 | 0.8620689655172414 | 60 | 12% | 34 | 0 |
| orc_fighter | Orc Lutadora | 3 | Incomum | 230 | 27 | 16 | 0.6802721088435374 | 60 | 18% | 34 | 0 |
| cave_troll | Troll da Caverna | 3 | Incomum | 360 | 35 | 16 | 1.3513513513513513 | 49 | 7% | 62 | 0 |
| snow_troll | Troll das Neves | 4 | Rara | 290 | 20 | 26 | 1.3513513513513513 | 39 | 3% | 145 | 0 |
| troll | Troll | 4 | Rara | 360 | 45 | 38 | 1.639344262295082 | 30 | 3% | 62 | 0 |
| mountain_troll | Troll da Montanha | 4 | Rara | 360 | 45 | 26 | 1.639344262295082 | 49 | 7% | 62 | 0 |
| dark_elf_noble | Nobre Elfo Sombrio | 3 | Rara | 230 | 35 | 16 | 0.8620689655172414 | 60 | 25% | 34 | 0 |
| dark_elf_archer | Arqueiro Elfo Sombrio | 3 | Incomum | 180 | 35 | 8 | 1.075268817204301 | 60 | 18% | 180 | 0 |
| dark_elf_warrior | Guerreiro Elfo Sombrio | 3 | Incomum | 290 | 35 | 38 | 1.3513513513513513 | 49 | 12% | 62 | 0 |
| dark_elf_mage | Mago Elfo Sombrio | 4 | Rara | 180 | 27 | 8 | 1.3513513513513513 | 39 | 7% | 145 | 0 |
| feline_swordsman | Espadachim Meowri | 2 | Comum | 230 | 27 | 26 | 0.8620689655172414 | 60 | 12% | 34 | 0 |
| feline_rogue | Gatuno Meowri | 3 | Incomum | 180 | 35 | 8 | 0.6802721088435374 | 74 | 25% | 34 | 0 |
| feline_arcanist | Feiticeiro Meowri | 3 | Rara | 180 | 20 | 16 | 1.075268817204301 | 49 | 7% | 145 | 0 |
| feline_drummer | Percussionista Meowri | 3 | Rara | 230 | 14 | 16 | 1.3513513513513513 | 49 | 3% | 145 | 0 |
| feline_fighter | Lutador Meowri | 2 | Comum | 230 | 27 | 16 | 0.6802721088435374 | 60 | 12% | 34 | 0 |
| elf_noble | Nobre Alto Elfo | 3 | Rara | 230 | 35 | 16 | 1.075268817204301 | 49 | 18% | 145 | 0 |
| elf_guardian | Guerreiro Alto Elfo | 3 | Incomum | 360 | 20 | 38 | 1.3513513513513513 | 39 | 7% | 34 | 0 |
| elf_archer | Arqueiro Alto Elfo | 2 | Comum | 180 | 27 | 8 | 0.8620689655172414 | 60 | 12% | 180 | 0 |
| elf_halberdier | Lanceira Alta Elfa | 3 | Incomum | 290 | 35 | 26 | 1.075268817204301 | 49 | 7% | 62 | 0 |
| woodland_predator | Predador Elfo da Floresta | 3 | Rara | 230 | 27 | 16 | 0.6802721088435374 | 74 | 18% | 34 | 0 |
| woodland_lancer | Guerreiro Elfo da Floresta | 2 | Comum | 230 | 27 | 26 | 1.075268817204301 | 60 | 7% | 62 | 0 |
| woodland_scout | Batedor Elfo da Floresta | 3 | Incomum | 180 | 27 | 8 | 0.8620689655172414 | 74 | 18% | 180 | 0 |
| woodland_flailer | Guardião Elfo da Floresta | 3 | Incomum | 290 | 35 | 26 | 1.3513513513513513 | 49 | 12% | 62 | 0 |
| flower_fairy | Fada das Flores | 3 | Rara | 180 | 14 | 8 | 1.075268817204301 | 74 | 3% | 145 | 0 |
| elf_harpist | Harpista Alta Elfa | 4 | Ultra rara | 230 | 14 | 16 | 1.3513513513513513 | 49 | 3% | 145 | 0 |
| centaur_crossbow | Caçadora Centaura | 3 | Incomum | 230 | 35 | 16 | 1.075268817204301 | 74 | 12% | 180 | 0 |
| centaur_lancer | Cavaleiro Centauro | 4 | Rara | 360 | 35 | 38 | 1.3513513513513513 | 74 | 7% | 62 | 0 |
| centaur_swordsman | Espadachim Centauro | 3 | Comum | 290 | 35 | 26 | 1.075268817204301 | 74 | 12% | 34 | 0 |
| sheriff | Xerife | 4 | Rara | 290 | 35 | 26 | 1.075268817204301 | 74 | 18% | 145 | 0 |
| bard | Barda | 3 | Incomum | 230 | 14 | 16 | 1.3513513513513513 | 49 | 3% | 145 | 0 |
| gladiator | Gladiador | 3 | Incomum | 290 | 27 | 38 | 1.075268817204301 | 39 | 7% | 62 | 0 |
| blackfang_guardian | Guardião Elfo Negro | 4 | Rara | 360 | 27 | 38 | 1.3513513513513513 | 30 | 7% | 62 | 0 |

### Warrior (`warrior`)

Habilidade: **Golpe circular**. Gatilho técnico: `{"kind": "attacks", "limit": 5, "startFull": false}`.

Gira a espada e acerta todos os inimigos próximos. Mantém a habilidade atual como referência de dano em área.

### Lancer (`lancer`)

Habilidade: **Investida da aurora**. Gatilho técnico: `{"kind": "attacks", "limit": 5, "startFull": false}`.

Avança em linha curta até o alvo, perfurando inimigos no trajeto. O alvo final é empurrado para trás.

### Bastion (`bastion`)

Habilidade: **Aqui ninguém passa**. Gatilho técnico: `{"kind": "received", "limit": 6, "startFull": false}`.

Bate o escudo, afasta inimigos próximos e provoca os atingidos por 2 segundos, fazendo-os priorizar Bastion.

### Shinobi (`shinobi`)

Habilidade: **Passo das sombras**. Gatilho técnico: `{"kind": "time", "limit": 6, "startFull": false}`.

Teletransporta-se para trás do alvo atual e desfere um golpe. Se o espaço estiver ocupado, usa o ponto livre mais próximo.

### Kinoichi (`kinoichi`)

Habilidade: **Corrente da lua**. Gatilho técnico: `{"kind": "time", "limit": 7, "startFull": false}`.

Lança a corrente no inimigo mais distante dentro do alcance da skill e o puxa para perto, interrompendo sua ação atual.

### Samurai (`samurai`)

Habilidade: **Corte do horizonte**. Gatilho técnico: `{"kind": "damage", "limit": 4.5, "startFull": false}`.

Atravessa o alvo em uma arrancada reta, cortando os inimigos no percurso e terminando logo depois dele.

### OmnaMusha (`omnamusha`)

Habilidade: **Dança das lâminas**. Gatilho técnico: `{"kind": "attacks", "limit": 5, "startFull": false}`.

Desloca-se para uma lateral livre do alvo, corta e cruza para a outra lateral com um segundo corte. Não atravessa a arena inteira.

### Ronin (`ronin`)

Habilidade: **Passo do contra-ataque**. Gatilho técnico: `{"kind": "received", "limit": 3, "startFull": false}`.

Após resolver o terceiro golpe, dá um passo lateral e contra-ataca o agressor se ele estiver ao alcance da espada. O passo não anula o dano recebido.

### Fighter (`fighter`)

Habilidade: **Combo ascendente**. Gatilho técnico: `{"kind": "attacks", "limit": 5, "startFull": false}`.

Desfere dois socos no alvo e termina com um golpe que o empurra. Avança até a nova posição para manter a pressão.

### Martial Artist (`martial_artist`)

Habilidade: **Varredura do dragão**. Gatilho técnico: `{"kind": "received", "limit": 4, "startFull": false}`.

Gira o bastão em um arco frontal, atingindo e afastando os inimigos acertados. Depois recua um passo para recuperar distância.

### Shaolin (`shaolin`)

Habilidade: **Postura serena**. Gatilho técnico: `{"kind": "block", "limit": 6, "startFull": false}`.

Bloqueia cada sexto ataque básico recebido. Especiais e dano contínuo não são bloqueados.

### Cowboy (`cowboy`)

Habilidade: **Bala ricocheteante**. Gatilho técnico: `{"kind": "attacks", "limit": 5, "startFull": false}`.

Atira no alvo atual e faz a bala ricochetear em até dois outros inimigos próximos. Cada inimigo pode ser atingido uma única vez.

### Gunner (`gunner`)

Habilidade: **Disparo de recuo**. Gatilho técnico: `{"kind": "received", "limit": 4, "startFull": false}`.

Recua um trecho curto na direção oposta ao alvo enquanto dispara um tiro potente. Se estiver junto à borda, busca espaço lateral.

### Miner (`miner`)

Habilidade: **Pavio curto**. Gatilho técnico: `{"kind": "time", "limit": 7, "startFull": false}`.

Arremessa dinamite na posição atual do alvo. Após 1 segundo ela explode, causando dano em área e empurrando inimigos para fora do centro.

### Pirate Captain (`pirate_captain`)

Habilidade: **Bandeira de abordagem**. Gatilho técnico: `{"kind": "time", "limit": 8, "startFull": false}`.

Crava uma bandeira em sua posição. Por 4 segundos, aliados dentro da área recebem velocidade de ataque e proteção contra deslocamentos forçados.

### Pirate (`pirate`)

Habilidade: **Gancho de abordagem**. Gatilho técnico: `{"kind": "attacks", "limit": 5, "startFull": false}`.

Prende o gancho no alvo atual, puxa o próprio corpo até ele e golpeia. Se já estiver corpo a corpo, passa para um flanco livre antes do golpe.

### Cannoneer (`cannoneer`)

Habilidade: **Tiro de dispersão**. Gatilho técnico: `{"kind": "damage", "limit": 4.5, "startFull": false}`.

Dispara uma bala explosiva no alvo atual. A explosão atinge uma área e arremessa os atingidos para longe do ponto de impacto.

### Ranger (`ranger`)

Habilidade: **Armadilha de caçador**. Gatilho técnico: `{"kind": "time", "limit": 6, "startFull": false}`.

Coloca uma armadilha no chão à sua frente. O primeiro inimigo que entrar nela recebe dano e fica imobilizado por 1,5 segundo; a armadilha dura até 5 segundos.

### Archer (`archer`)

Habilidade: **Chuva persistente**. Gatilho técnico: `{"kind": "attacks", "limit": 6, "startFull": false}`.

Marca uma área na posição atual do alvo. Flechas caem em três ondas durante 2 segundos; inimigos podem entrar ou sair da zona.

### Crossbowman (`crossbowman`)

Habilidade: **Virote de contenção**. Gatilho técnico: `{"kind": "damage", "limit": 4, "startFull": false}`.

Dispara um virote que atravessa os inimigos em linha. O primeiro atingido fica imobilizado por 1 segundo; os demais recebem o dano.

### Mage (`mage`)

Habilidade: **Orbes astrais**. Gatilho técnico: `{"kind": "time", "limit": 7, "startFull": false}`.

Invoca três orbes que orbitam ao seu redor. Cada um dos próximos três ataques básicos lança um orbe no alvo, causando uma pequena explosão no impacto. Os orbes não recarregam a própria skill.

### Sorceress (`sorceress`)

Habilidade: **Vórtice esmeralda**. Gatilho técnico: `{"kind": "time", "limit": 8, "startFull": false}`.

Abre um vórtice na posição atual do alvo. Durante 1,5 segundo, ele puxa gradualmente inimigos próximos para o centro e então explode.

### Sage (`sage`)

Habilidade: **Resgate arcano**. Gatilho técnico: `{"kind": "time", "limit": 7, "startFull": false}`.

Resgata o outro aliado mais ferido para a retaguarda e protege com 18% da vida máxima por 4s. Sozinho: escudo próprio de 9% por 2,5s. Intervalo mínimo 6s.

### Priestess (`priestess`)

Habilidade: **Santuário de luz**. Gatilho técnico: `{"kind": "time", "limit": 8, "startFull": false}`.

Cria santuário por 4s (raio 95). Cura por pulso: aliados 3,5% da vida máxima, próprio 1,75%. Remove um efeito negativo ao criar.

### Cavalier (`cavalier`)

Habilidade: **Royal Charge**. Gatilho técnico: `{"kind": "attacks", "limit": 6, "startFull": true}`.

Once per round, charge the nearest enemy. On contact, replace the opening basic attack with a strike for 180% attack and stun for 1 second. Control effects interrupt the charge.

### Musketeer (`musketeer`)

Habilidade: **Armorbreaker Shot**. Gatilho técnico: `{"kind": "attacks", "limit": 4, "startFull": false}`.

After 4 basic attacks, shoot the current target for 220% attack, ignoring 50% defense. Remain in position.

### Swordsman (`swordsman`)

Habilidade: **Sundering Slash**. Gatilho técnico: `{"kind": "damage", "limit": 4, "startFull": false}`.

After 5 basic attacks, slash a 90-degree cone over a range of 85, dealing 170% attack and reducing defense by 20% for 3 seconds. Repeated effects refresh duration.

### Duelist (`duelist`)

Habilidade: **Perfect Riposte**. Gatilho técnico: `{"kind": "attacks", "limit": 5, "startFull": false}`.

Assume postura por 1,2s. Bloqueia próximo básico e contra-ataca por 180% ATQ em alcance corpo a corpo. Não bloqueia especiais. Intervalo mínimo 6s.

### Viking (`viking`)

Habilidade: **Battle Fury**. Gatilho técnico: `{"kind": "health", "limit": 0.5, "startFull": false}`.

Attack 30% faster while at or below 50% health. The bonus ends when health rises above 50%.

### Shieldmaiden (`shieldmaiden`)

Habilidade: **Stand Together**. Gatilho técnico: `{"kind": "received", "limit": 5, "startFull": false}`.

Protege a si com 7,5% da vida máxima do conjurador por 2,5s e um aliado ferido a até 100 com 15% por 4s. Intervalo mínimo 6s.

### Shaman (`shaman`)

Habilidade: **Ancestral Totem**. Gatilho técnico: `{"kind": "time", "limit": 8, "startFull": false}`.

Cria totem por 5s (raio 85): +15% velocidade de ataque e cura de 1% da vida máxima por segundo aos aliados; autocura de 0,5%. Totens não acumulam.

### Berserker (`berserker`)

Habilidade: **Bloodied Axes**. Gatilho técnico: `{"kind": "damage", "limit": 4, "startFull": false}`.

Dois golpes de 90% ATQ. Recupera 12,5% do dano efetivo à vida, excluindo escudos e excesso de dano.

### Huntress (`huntress`)

Habilidade: **Marked Prey**. Gatilho técnico: `{"kind": "attacks", "limit": 5, "startFull": false}`.

After 5 basic attacks, throw a spear for 150% attack and mark the target for 4 seconds. The target takes 15% more damage from allied basic attacks. Repeated marks refresh duration without stacking.

### Glutton (`glutton`)

Habilidade: **Snack Break**. Gatilho técnico: `{"kind": "received", "limit": 6, "startFull": false}`.

Recupera 10% da vida máxima, sem exceder o máximo. Intervalo mínimo 6s.

### Bear Druid (`bear_druid`)

Habilidade: **Ursine Roar**. Gatilho técnico: `{"kind": "received", "limit": 5, "startFull": false}`.

Inimigos a até 85 perdem 20% ATQ por 3s; próprio recebe 7,5% menos dano por 3s. Intervalo mínimo 6s.

### Eagle Druid (`eagle_druid`)

Habilidade: **Skyfall**. Gatilho técnico: `{"kind": "time", "limit": 6, "startFull": false}`.

After 5 basic attacks, leap to the farthest enemy within 180 range and deal 170% attack in a radius of 35 on landing. Land in the nearest free space and remain there. You can take damage during the leap.

### Pirate Admiral (`pirate_admiral`)

Habilidade: **Deckbreaker**. Gatilho técnico: `{"kind": "received", "limit": 6, "startFull": false}`.

After 5 basic attacks, slam the ground at the current target, dealing 200% attack within 65 range of impact and stunning enemies for 1 second.

### Shackled Pirate (`shackled_pirate`)

Habilidade: **Chain Sweep**. Gatilho técnico: `{"kind": "received", "limit": 4, "startFull": false}`.

After 5 basic attacks, swing the chain around yourself, dealing 150% attack within 65 range and slowing enemy movement by 30% for 3 seconds. Repeated slows refresh duration without stacking.

### Goblin Lanceiro (`goblin_spearman`)

Habilidade: **Estocada traiçoeira**. Gatilho técnico: `{"kind": "attacks", "limit": 5, "startFull": false}`.

Causa 160% do ataque ao alvo e recua 35 unidades.

### Goblin Arqueiro (`goblin_archer`)

Habilidade: **Flecha farpada**. Gatilho técnico: `{"kind": "attacks", "limit": 6, "startFull": false}`.

Causa 140% do ataque e reduz o movimento do alvo em 30% por 3 segundos.

### Goblin Montador (`goblin_rider`)

Habilidade: **Atropelo**. Gatilho técnico: `{"kind": "attacks", "limit": 6, "startFull": true}`.

Começa carregado. Avança pelo chão, causa 160% do ataque e empurra o alvo 45 unidades, acompanhando o avanço. Controle interrompe a investida.

### Goblin Bruto (`goblin_brute`)

Habilidade: **Pancada brutal**. Gatilho técnico: `{"kind": "received", "limit": 5, "startFull": false}`.

Causa 170% do ataque ao alvo e atordoa por 0,8 segundo.

### Goblin Bombardeiro (`goblin_bomber`)

Habilidade: **Bomba incendiária**. Gatilho técnico: `{"kind": "time", "limit": 7, "startFull": false}`.

Após 1 segundo, a bomba explode por 150% do ataque em raio 55. Deixa fogo por 3 segundos, causando 20% do ataque por segundo.

### Rei Goblin (`goblin_king`)

Habilidade: **Ordem do rei**. Gatilho técnico: `{"kind": "time", "limit": 8, "startFull": false}`.

Aliados em raio 110, incluindo o rei, recebem +15% de ataque e velocidade de ataque por 4 segundos. Rei, liteira e carregadores são uma unidade.

### Orc Guerreiro (`orc_warrior`)

Habilidade: **Escudo de guerra**. Gatilho técnico: `{"kind": "received", "limit": 5, "startFull": false}`.

Recebe escudo de 7,5% da vida máxima por 2,5s e empurra o alvo próximo 30. Intervalo mínimo 6s. Apenas golpes que ferem a vida carregam a habilidade.

### Orc Berserker (`orc_berserker`)

Habilidade: **Caçada sangrenta**. Gatilho técnico: `{"kind": "damage", "limit": 4, "startFull": false}`.

Avança até o inimigo com menor percentual de vida em alcance 120 e golpeia por 180% do ataque. Sem candidato, usa o alvo atual.

### Orc Lutadora (`orc_fighter`)

Habilidade: **Lâminas cruzadas**. Gatilho técnico: `{"kind": "attacks", "limit": 6, "startFull": false}`.

Dois cortes no alvo, cada um por 100% do ataque, ignorando 25% da defesa.

### Troll da Caverna (`cave_troll`)

Habilidade: **Carne regenerativa**. Gatilho técnico: `{"kind": "passive", "limit": 0, "startFull": false}`.

Após 5s sem dano à vida, regenera 1% da vida máxima por segundo. Novo dano à vida interrompe a regeneração.

### Troll das Neves (`snow_troll`)

Habilidade: **Proteção ancestral**. Gatilho técnico: `{"kind": "time", "limit": 8, "startFull": false}`.

Cura aliados a até 85 em 8% da vida máxima (próprio: 4%). Redução de dano por 3s: aliados 10%, próprio 5%. Intervalo mínimo 6s.

### Troll (`troll`)

Habilidade: **Queda da rocha**. Gatilho técnico: `{"kind": "received", "limit": 6, "startFull": false}`.

Atinge o chão junto ao alvo por 180% do ataque em raio 65 e imobiliza por 1,2 segundo.

### Troll da Montanha (`mountain_troll`)

Habilidade: **Investida demolidora**. Gatilho técnico: `{"kind": "time", "limit": 8, "startFull": false}`.

Avança até 120 unidades rumo ao alvo. Atinge cada inimigo no trajeto uma vez por 170% do ataque e o empurra 45 unidades.

### Nobre Elfo Sombrio (`dark_elf_noble`)

Habilidade: **Passo sombrio**. Gatilho técnico: `{"kind": "attacks", "limit": 5, "startFull": false}`.

Teleporta para um espaço livre atrás do alvo e golpeia por 180% do ataque. Sem invulnerabilidade.

### Arqueiro Elfo Sombrio (`dark_elf_archer`)

Habilidade: **Flecha executora**. Gatilho técnico: `{"kind": "attacks", "limit": 5, "startFull": false}`.

Atira no inimigo com menor percentual de vida em alcance 180 por 180% do ataque, ou 240% se estiver abaixo de 30% de vida.

### Guerreiro Elfo Sombrio (`dark_elf_warrior`)

Habilidade: **Guarda punitiva**. Gatilho técnico: `{"kind": "received", "limit": 5, "startFull": false}`.

Corta cone (alcance 85) por 160% ATQ e recebe 10% menos dano por 3s. Intervalo mínimo 6s.

### Mago Elfo Sombrio (`dark_elf_mage`)

Habilidade: **Grilhões arcanos**. Gatilho técnico: `{"kind": "time", "limit": 8, "startFull": false}`.

Atinge uma área de raio 55 na posição do alvo por 150% do ataque e imobiliza por 1,5 segundo.

### Espadachim Meowri (`feline_swordsman`)

Habilidade: **Estocada audaz**. Gatilho técnico: `{"kind": "attacks", "limit": 5, "startFull": false}`.

Causa 160% do ataque ao alvo e ganha 20% de velocidade de ataque por 3 segundos.

### Gatuno Meowri (`feline_rogue`)

Habilidade: **Salto traiçoeiro**. Gatilho técnico: `{"kind": "attacks", "limit": 6, "startFull": false}`.

Salta atrás do alvo e desfere dois golpes de 90% do ataque; cada golpe causa 110% se o alvo estiver mirando outro aliado.

### Feiticeiro Meowri (`feline_arcanist`)

Habilidade: **Égide esmeralda**. Gatilho técnico: `{"kind": "time", "limit": 7, "startFull": false}`.

Protege o aliado mais ferido com 20% da vida máxima do conjurador por 4s (próprio: 10% por 2,5s). Enquanto protegido, +15% velocidade de ataque. Intervalo mínimo 6s.

### Percussionista Meowri (`feline_drummer`)

Habilidade: **Ritmo da marcha**. Gatilho técnico: `{"kind": "time", "limit": 8, "startFull": false}`.

Aliados em raio de 110, incluindo o conjurador, ganham 15% de velocidade de ataque e 20% de movimento por 4 segundos.

### Lutador Meowri (`feline_fighter`)

Habilidade: **Sequência de garras**. Gatilho técnico: `{"kind": "attacks", "limit": 6, "startFull": false}`.

Desfere três golpes de 65% do ataque. O último empurra o alvo 30 unidades e o lutador o acompanha.

### Nobre Alto Elfo (`elf_noble`)

Habilidade: **Disparo de comando**. Gatilho técnico: `{"kind": "attacks", "limit": 5, "startFull": false}`.

Dispara por 180% do ataque. Os dois outros aliados mais próximos ganham 15% de ataque por 3 segundos, sem mudar seus alvos.

### Guerreiro Alto Elfo (`elf_guardian`)

Habilidade: **Muralha rubra**. Gatilho técnico: `{"kind": "received", "limit": 5, "startFull": false}`.

Após golpes básicos que ferem a vida, concede redução de dano por 3s: próprio 12,5%, outros aliados a até 85 15%. Intervalo mínimo 6s.

### Arqueiro Alto Elfo (`elf_archer`)

Habilidade: **Flecha solar**. Gatilho técnico: `{"kind": "attacks", "limit": 6, "startFull": false}`.

Atinge até três inimigos em linha: o primeiro recebe 170% do ataque e os demais, 100%.

### Lanceira Alta Elfa (`elf_halberdier`)

Habilidade: **Varredura da aurora**. Gatilho técnico: `{"kind": "attacks", "limit": 5, "startFull": false}`.

Causa 160% do ataque em cone frontal de alcance 85 e empurra os alvos 35 unidades. Permanece no lugar.

### Predador Elfo da Floresta (`woodland_predator`)

Habilidade: **Caçada implacável**. Gatilho técnico: `{"kind": "passive", "limit": 0, "startFull": false}`.

Cada ataque básico consecutivo no mesmo alvo concede 5% de velocidade de ataque, até 30%. Trocar de alvo reinicia o bônus.

### Guerreiro Elfo da Floresta (`woodland_lancer`)

Habilidade: **Ponta dupla**. Gatilho técnico: `{"kind": "attacks", "limit": 5, "startFull": false}`.

Causa 150% do ataque ao alvo principal e 100% a um segundo inimigo próximo. Sem segundo alvo, não há golpe adicional.

### Batedor Elfo da Floresta (`woodland_scout`)

Habilidade: **Disparo evasivo**. Gatilho técnico: `{"kind": "time", "limit": 6, "startFull": false}`.

Recua 45 unidades e dispara por 150% do ataque, reduzindo o movimento do alvo em 30% por 3 segundos.

### Guardião Elfo da Floresta (`woodland_flailer`)

Habilidade: **Quebra-guarda**. Gatilho técnico: `{"kind": "attacks", "limit": 5, "startFull": false}`.

Causa 180% do ataque e reduz a defesa em 25% por 4 segundos. O golpe causa 50% de dano adicional somente à parcela absorvida por escudos.

### Fada das Flores (`flower_fairy`)

Habilidade: **Pólen restaurador**. Gatilho técnico: `{"kind": "time", "limit": 7, "startFull": false}`.

Aproxima-se do aliado mais ferido, cura 12% da vida máxima dele (próprio: 6%) e remove lentidão e enraizamento. Sem ressurreição ou remoção de atordoamento.

### Harpista Alta Elfa (`elf_harpist`)

Habilidade: **Canção do alvorecer**. Gatilho técnico: `{"kind": "time", "limit": 9, "startFull": false}`.

Canaliza três pulsos em 3s. Cada um cura aliados a até 110 em 4% da vida máxima; próprio 2%. Atordoamento ou morte interrompe.

### Caçadora Centaura (`centaur_crossbow`)

Habilidade: **Rajada a galope**. Gatilho técnico: `{"kind": "attacks", "limit": 5, "startFull": false}`.

Desloca-se 50 unidades lateralmente enquanto dispara três tiros de 70% do ataque no alvo. Continua vulnerável durante o movimento.

### Cavaleiro Centauro (`centaur_lancer`)

Habilidade: **Investida protetora**. Gatilho técnico: `{"kind": "time", "limit": 8, "startFull": false}`.

Avança até 120 unidades contra o inimigo próximo do outro aliado com menor percentual de vida, causa 170% do ataque e provoca por 2 segundos. Sem alvo elegível, busca o alvo atual.

### Espadachim Centauro (`centaur_swordsman`)

Habilidade: **Corte de passagem**. Gatilho técnico: `{"kind": "attacks", "limit": 6, "startFull": false}`.

Atravessa o alvo, causa 170% do ataque e termina 45 unidades atrás dele, em espaço livre. Atinge apenas esse alvo.

### Xerife (`sheriff`)

Habilidade: **Laço da lei**. Gatilho técnico: `{"kind": "time", "limit": 7, "startFull": false}`.

Laça o inimigo mais distante em alcance 180, puxa até 60 unidades, dispara por 160% do ataque e enraíza por 1 segundo. Cavalo e cavaleiro são uma unidade.

### Barda (`bard`)

Habilidade: **Balada heroica**. Gatilho técnico: `{"kind": "time", "limit": 8, "startFull": false}`.

Aliados em raio de 110, incluindo a Barda, ganham 15% de ataque e 20% de poder de habilidade por 4 segundos. Ataques básicos são notas musicais.

### Gladiador (`gladiator`)

Habilidade: **Resposta da arena**. Gatilho técnico: `{"kind": "received", "limit": 5, "startFull": false}`.

Após receber 5 ataques básicos, contra-ataca o agressor em alcance 62, ou o alvo atual nesse alcance, por 180% do ataque e reduz seu ataque em 20% por 3 segundos.

### Guardião Elfo Negro (`blackfang_guardian`)

Habilidade: **Bastião sombrio**. Gatilho técnico: `{"kind": "received", "limit": 6, "startFull": false}`.

Atinge cone por 140% ATQ e provoca por 2s. Recebe escudo de 10% da vida máxima por 2,5s. Intervalo mínimo 6s.

## 15. Registro de continuidade

v46: nona raid Mantícora/Filhote. v47: três atos. v48–v50: cenários, notas do mapa e bosses/formas. v51: árvore permanente e variedade dos nodes. v52: ajustes de interface, hacks, histórico de ordens e sprites/feedback. v53: cartas negativas, cinco relíquias novas e revisão de eventos/economia. v54: três categorias de traits, distribuição completa, nerfs de autocura/proteção e filtros sem salto horizontal.

Esta consolidação é a base para novas conversas do projeto. Efeitos aprovados e implementados estão separados das próximas propostas. Em caso de divergência numérica, conferir o código da versão publicada e registrar a correção documental; não inventar decisões ausentes do chat.
