# Mantícora — validação v46

Base v45. Escopo: adicionar Mantícora/Filhote ao Treinamento e à run; preservar outras raids, saves, perfil e acesso. Artes 1000625816 (filhote) e 1000625817 (chefe) copiadas byte a byte.

## Simulações completas

- Treinamento: 10 decks × oito seeds × U0/U1 = 160 raids. U0: 27/80 vitórias (26 R5, uma R3). U1: 72/80 (56 R5, 15 R4, uma R3).
- Run: 10 decks × quatro seeds × três posições = 120 fixtures. Primeira raid: 40/40 (19 R3, 18 R4, três R5); segunda: 35/40 (nove R4, 25 R5, uma R3); Boss: 7/40 (todas R5).
- Nenhuma atingiu o limite diagnóstico de 1200s do script; o jogo não tem esse limite. Valores provisórios para testar a mecânica, sem alterar o balanceamento das outras espécies. Fixtures de run usam upgrades/relíquias predefinidos; não simulam a economia e decisões de uma run inteira.
- Resultados por deck no JSON desta versão. Script: KINDS=manticore SEEDS=8 node tests/raid-balance-v45.cjs; repetir com SCENARIO=3/6/9 e SEEDS=4 para posições.

## Contratos

- manticore-v46: geometrias das linhas/direções fixas, evitar dano atrás do chefe, cruzamentos sem dano duplicado, marca apenas em R4, prioridade/expiração da caçada, velocidade e retorno ao normal, snapshot com salva em andamento, uma reposição R5/máximo dois filhotes, escala nas três posições e entrada real na run com prêmio idempotente.
- monsters-v42 ampliado para nove: todas as fases, HP persistente, aliados revividos, sem timeout, snapshots, recompensas e isolamento do roster.
- map-v43 ampliado para nove: 1.000 rotas sem repetição, todas as nove espécies elegíveis a Boss, saves determinísticos e reparo de nós futuros repetidos.
- raids-v45: mecânicas e traduções das espécies anteriores.
- raid-v41: projétil/impacto, retomada e quatro velocidades; legacy-replay-v39: 60 replays normais/elite/Boss de decks inalterados.

QA de navegador em 320×640 e 360×740, preparação R4 e salva. Verificar página fixa, ações visíveis, artes e ausência de erros do renderer. Não houve teste físico em Android. Arquivos temporários de QA removidos antes de publicar.
