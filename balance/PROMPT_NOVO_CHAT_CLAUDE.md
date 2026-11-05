# Prompt para o novo chat do Claude Code: rodada 3 de balanceamento do Grand Journey

> Cole o texto abaixo (da linha "Contexto" até o fim) no início do novo chat, junto com os arquivos do projeto principal e o prompt do ChatGPT.

---

## Contexto

Sou o Carlos. Estamos balanceando o jogo **Grand Journey** (autobattler de cartas para navegador e celular, em JavaScript puro). O projeto principal é desenvolvido no **ChatGPT**. O balanceamento é feito com você, no Claude Code, numa cópia do jogo, e cada rodada vira um **checkpoint** que o ChatGPT integra no projeto principal.

Já fechamos 2 checkpoints:
- **GJ-v54-BAL-CP1** (02/11/2026): personagens, traits, suportes, 24 decks e curva de dificuldade.
- **GJ-v54-BAL-CP2** (03/11/2026): curva recalibrada; árvore permanente com modelo de nível (limite 50, reset, nós finais ×1,5, 13 nós revisados); correção do filtro de relíquias inimigas; 9 decks revisados; **Desafios da Jornada** (15 desafios, insígnias, requisitos do Desafio Final); **15 Vantagens**.

Agora começa uma **nova rodada**. Junto com este prompt, estou mandando:
1. os **arquivos atuais do projeto principal**, já com o CP2 integrado pelo ChatGPT, e possivelmente com outras mudanças feitas em paralelo;
2. o **prompt que o ChatGPT montou** para esta rodada.

## Onde está o trabalho anterior

- **Repositório:** `cfsylla/Reposit-rio-GJ`, branch **`claude/continue-previous-work-ccibom`**. Se a sua branch de trabalho for outra, faça `git fetch` dessa branch e parta dela, porque o histórico completo está lá.
- **Estrutura:**
  - `v54/`: a v54 original, intacta, que serve de referência. As mídias (`dist/assets`, cerca de 191 MB) **não** estão no repositório.
  - `game/`: cópia balanceada no estado do CP2.
  - `game_p5/`: cópia de teste, idêntica a `game/` no CP2.
  - `balance/sim/`: o simulador e os scripts (detalhes abaixo).
  - `balance/checkpoint_CP1/` e `balance/checkpoint_CP2/`: os pacotes entregues. **Leia primeiro `balance/checkpoint_CP2/`**: `LEIA_ME_CP2.md`, `CHECKPOINT_CP2.md`, `PENDENCIAS_CP2.md`, `INTEGRACAO_CHATGPT_CP2.md` e `TABELA_ALTERACOES_CP2.md`.
  - `balance/out/`: resultados das simulações (JSONL), PDFs e logs.
  - `balance/PROPOSTA_DESAFIOS_DA_JORNADA.md`, `balance/RESPOSTA_PROPOSTAS_CHATGPT.md` e `balance/referencia_*`: histórico do desenho do pós-jogo.

## Primeira tarefa (antes de qualquer balanceamento)

1. **Comparar os arquivos do projeto principal com o CP2** (`game/` ou `balance/checkpoint_CP2/arquivos_alterados/`). Verificar se o CP2 foi integrado inteiro e certo, o que mudou em paralelo e o que pode afetar o balanceamento.
2. **Montar a nova base de trabalho** a partir dos arquivos do projeto principal, sem descartar o que o ChatGPT fez.
3. Rodar `node scripts/validate-balance-base.cjs` (10 etapas no CP2) e os testes `tests/challenges-p5.cjs` e `tests/advantages-p5.cjs` nessa base.
4. Ler o prompt do ChatGPT, me dizer **o que entendeu, o que conflita com o que já definimos e o que precisa da minha decisão**, e propor um plano antes de executar.

## O simulador (`balance/sim/`)

Ele roda o **motor real do jogo** sem interface. `engine.cjs` carrega os módulos na ordem de `index.html`.

**Variáveis de ambiente:**
- `GJ_ROOT=<cópia>` escolhe a cópia do jogo.
- `GJ_TREE_VARIANT=<arquivo.json>` aplica variações sem mexer no jogo: força por mapa, tabela de XP, custos de nós e ajustes de desafios (`challengeTune`), vantagens (`advTune`) e nós da árvore (`treeTune`).

| Script | Para que serve |
|---|---|
| `run.cjs` | Uma run completa por seed. Opções: `--decks`, `--seeds`, `--tree none/cap250/cap500`, `--challenges a,b`, `--advantages a,b ou all`, `--out arquivo.jsonl` |
| `career.cjs` / `career-batch.sh` / `career-report.cjs` | Carreiras com árvore persistente: 1ª vitória e em que run o jogador chega a cada nível |
| `postgame.cjs` | Escada dos Desafios: carreiras depois da 1ª vitória, nos caminhos fácil e difícil |
| `screen-batch.sh` + `screen-report.cjs` | Triagem (5 decks × 40 seeds) e validação (24 decks × 20 seeds) de candidatos |
| `postgame-matrix.cjs`, `matrix-cp2.cjs` | Geram os PDFs em matriz (cada célula = % de runs que chegaram vivas a cada ponto da run) |
| `deck-review.cjs` | Vitória por deck, com intervalo de confiança |
| `treelab.cjs`, `lab.cjs` | Laboratórios de força de nós e de personagens |
| `limits.sh`, `combos.sh` | Teste do limite (tudo ativo) e das combinações perigosas |
| `suite.sh` | Suíte completa de testes (mesmo método do CP1) |

**Jogador simulado:** preparo "smart" (no nível da IA do jogo), rota gulosa, eventos seguros e loja equilibrada. Ele é **mais fraco que um humano** e escolhe mal em vantagens de escolha, então os resultados são indicadores e não prova final. Quando uma peça depende de escolha, explique a regra que o simulador usa.

**Para gerar PDF:** o Playwright/Chromium já está instalado. O padrão usado é gerar HTML e imprimir com `page.pdf` em A4 paisagem.

## Como eu trabalho (preferências)

1. **Sempre em português**, de forma clara e direta. Explique termos técnicos.
2. **Nada é aplicado sem a minha aprovação.** Proponha com números, eu aprovo e você aplica. Para ajustes de valor dentro de um conceito já aprovado, pode iterar sozinho. **Mudança de conceito** (a ideia da peça) precisa de aprovação.
3. **Meça antes de afirmar.** Mostre a margem de erro e não force conclusão dentro do ruído.
4. **Método de triagem:** primeiro 5 decks × 40 seeds (`balance/out/logs/triagem_decks.txt`: Lâminas do Oriente, Círculo Verdejante, Lei do Gatilho, Presas Negras e Galope Centauro). O que passar vai para os 24 decks × 20 seeds.
5. **Entregas parciais** durante simulações longas. Exemplo: decks comuns primeiro, depois Blackfang, depois Dawncrest. Me diga sempre o **tempo estimado**.
6. **Gosto de matrizes em PDF** (formato da matriz deck × avanço) e de **resumos em tabela**: nome, efeito, impacto e status (aprovado, revisando ou eliminar).
7. **Não rode etapas seguintes sozinho** sem eu autorizar. Quando eu autorizar algo condicionado ("se tudo passar, siga"), respeite a condição.
8. **Commit e push frequentes** na branch de trabalho, com mensagens claras.
9. No fim da rodada, gere um **pacote de checkpoint no formato do CP2**: LEIA-ME, CHECKPOINT, TABELA DE ALTERAÇÕES, INTEGRAÇÃO com mensagem pronta para o ChatGPT, PENDÊNCIAS, patch contra o checkpoint anterior e contra a v54, arquivos alterados, validação, manifesto SHA-256 e ZIP.

## Regras e metas já definidas (não mudar sem me consultar)

**Jogo base:**
- 1ª vitória entre as runs **15 e 20**, com cerca de metade da árvore (nível 25);
- jogo base com a árvore no nível 25 entre **50% e 60%** de vitória.

**Desafios da Jornada:**
- nível = quantidade de desafios ativos;
- acesso sequencial;
- 1 insígnia por nível inédito;
- cada desafio sozinho dificulta de **5 a 10** pontos de vitória (exceções de 3 a 12);
- tudo medido com a árvore no nível 25.

**Vantagens:**
- cada insígnia compra 1, e todas ficam sempre ativas;
- cada vantagem sozinha facilita de **3 a 7** pontos (exceções de 1 a 9);
- nenhuma pode ser negativa, exceto as aprovadas por decisão minha: Olho Treinado, Limpeza e Fusão Eficiente.

**Desafio Final:**
- exige o nível 15 vencido, os 15 desafios concluídos e os 3 true bosses;
- a run tem os 15 desafios ativos;
- sequência: o true boss da ordem do jogador, depois os outros 2 em ordem aleatória, e por fim o boss secreto, que precisa ser **mais forte que os outros true bosses**;
- o conteúdo do boss secreto é do projeto principal.

**Outras decisões:**
- saves antigos são ignorados (só eu faço playtest);
- sem liberação retroativa de decks;
- decks emprestados são liberados por milestone ou por 25 diamantes;
- a Corte Sombria fica forte, como recompensa;
- telas, arte, tradução e hospedagem são do projeto principal.

## Lições práticas do ambiente (evitam erros)

- **Simulações longas:** rode com `nohup setsid <script> > log 2>&1 < /dev/null &` e acompanhe com uma espera em segundo plano. As tarefas em segundo plano do Claude Code são encerradas depois de 2 horas.
- **Nunca use `pkill -f` com um padrão que apareça no seu próprio comando**, porque ele mata o próprio shell. Pegue os PIDs com `ps` e mate um por um.
- **Laços de espera com `pgrep -f "<texto>"`** podem detectar a si mesmos. Prefira esperar por um marcador no log, por exemplo `until grep -q "DONE" log`.
- **`rsync` não existe** no ambiente. Use `cp -a origem/. destino/`.
- **Mudar arquivos do jogo enquanto uma simulação roda** contamina os resultados. Pare as simulações antes, ou use outra cópia.
- **Os testes que procuram mídias** (`revisions-v33`, `roster-v37`, `vfx-v21`) falham por ambiente, já que as mídias não estão no repositório. 12 outros testes já falhavam desde o CP1 (histórico git e interface antiga). A classificação está em `balance/checkpoint_CP2/validacao/README_VALIDACAO_CP2.md`.
- **O GitHub recusa o push de tags** neste ambiente. Os commits na branch bastam.

## Pendências conhecidas (de `PENDENCIAS_CP2.md`)

- **Ainda não revisado:**
  - especiais de Expedição da árvore;
  - economia de eventos, maldições e missões;
  - relíquias do jogador;
  - mecânicas internas de raids e true bosses;
  - economia permanente (diamantes, boosters, coleção).
- **A conferir em playtest:** Mão Planejada, Preparação Flexível, Olho Treinado, Limpeza e Fusão Eficiente.
- **Ritmo do pós-jogo:** de 1 a 3 runs por nível de desafio. Decidi manter assim no CP2.

Comece pela "Primeira tarefa" e me traga o diagnóstico antes de qualquer alteração.
