# Grand Journey — continuidade v43

29/10/2026. Base v42, commit 153ba179c993df92983656adbd0ae0e63ccc340f. Mesmo Site https://grand-journey.cfsylla.chatgpt.site e projeto appgprj_6ad92678b86081918ef5cc54c09cc04f. Audiência, saves, fontes, regras e pendências anteriores preservados. Escopo expressamente autorizado: emblemas das três ordens e ausência de repetição de monstros na run.

## Emblemas aprovados

- Monstros: Selo da Quimera roxo, pixel art fornecida em 1000624333.png.
- Dawncrest: símbolo branco/dourado, pixel art 1000624335.png.
- Blackfang: nó entrelaçado escuro, pixel art 1000624337.png.

Originais copiados sem alteração para dist/assets/order-monsters-pixel.png, order-dawncrest-pixel.png e order-blackfang-pixel.png. Função compartilhada orderMark em game-7.js substitui os desenhos genéricos de Blackfang/Dawncrest e o sprite individual do monstro nos nós. Mesmos emblemas na legenda; previews de Blackfang/Dawncrest também passam a usar o símbolo correto. Preview de raid continua mostrando o monstro específico.

Área visual comum 36×36 nos nós, 32×32 na legenda; boss 44×44, mantendo seu destaque dourado com contorno duplo. Renderização pixelated e texto alternativo EN/PT-BR. Emblemas são apenas apresentação: não modificam tipo de encontro ou desbloqueios. Outros ícones do mapa permanecem.

## Monstros sem repetição

As duas raids intermediárias já eram distintas na v42. Agora o sorteio do boss exclui todas as espécies efetivamente enfrentadas nas raids intermediárias. Rota completa resulta em três monstros diferentes entre os quatro disponíveis. Todas as espécies continuam elegíveis em qualquer posição, sem hierarquia fixa de dificuldade.

Histórico recuperado de route e campaignRoute.monsterNodes, cruzado com os nós salvos. Uma opção de raid ignorada não conta como enfrentada. Sorteio determinístico por seed, sem consumir RNG da economia/combate. Escolha de boss já válida é mantida ao reler/retomar.

prepareRouteNode também evita repetição em um eventual nó intermediário futuro já salvo. Ao abrir o mapa, nós ainda não visitados são preparados: isso corrige um boss v42 pendente que repetiria um dos monstros enfrentados. Não reconstrói mapas, não apaga cartas/rotas e não altera uma raid já em preparação/combate. O encontro em andamento e seu snapshot continuam intactos; a regra vale para encontros futuros. Runs antigas sem nós de monstros não recebem nova rota.

## Validação

- tests/map-v43.cjs: 1.000 seeds, três monstros distintos, todas as quatro espécies possíveis no boss, escolha estável após serialização/retomada, reparo de boss v42 pendente, substituição de nó intermediário repetido e opção de raid ignorada não bloqueando espécie.
- tests/monsters-v42.cjs aprovado: progressão das raids, checkpoints, massa slime, fases, recompensas e demais mecânicas preservadas.
- tests/legacy-replay-v39.cjs: 60 replays normais/elite/boss de decks inalterados.
- QA isolado em 320×640: três emblemas corretos no mapa, boss com símbolo/destaque, legenda com imagens, altura global 640 e scrollHeight 640. Rolagem permanece somente no painel interno. Perfil real não usado. Não houve teste físico em Android.
- Sem alteração de balanceamento ou necessidade de repetir as simulações de dificuldade da v42.

As regras AGENTS.md continuam obrigatórias, sobretudo tela fixa, rodapés opacos, fontes aprovadas e autorização explícita para implementar/publicar. v43 substitui apenas a regra v42 que permitia repetição de espécie no boss; demais detalhes e pendências de v42 continuam válidos.
