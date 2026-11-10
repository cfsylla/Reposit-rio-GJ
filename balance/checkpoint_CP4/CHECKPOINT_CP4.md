# Checkpoint GJ-v50-BAL-CP4 (10/11/2026)

## 1. Resumo
O CP4 junta tudo o que mudou na cópia de teste depois do CP3 e foi aprovado pelo Carlos, para **playtest**:
- **Relíquias:** 43 relíquias (25 revistas + 18 novas), com as definições do Carlos de 10/11 (efeito, raridade e formato pelo método "efeito − custo do formato = patamar da raridade").
- **Combate:** a habilidade só dispara com **alvo válido**; sem alvo, a unidade guarda a carga.
- **Escada de dificuldade** (força por barreira, raids, Titã), **True Bosses**, **árvore** (custo por anel, básicos ×3, janela na derrota), **cura dos suportes** e **Desafios/Vantagens** recalibrados (08/11).
- Nome da ordem na tela: **Grand Union** (antes Ironbound).

**Importante:** depois das definições de 10/11 **nada foi testado nem simulado** (decisão do Carlos, que vai validar pelo playtest). As únicas checagens foram: sintaxe dos arquivos, o jogo carregando e os patches gerando arquivos idênticos.

## 2. O que mudou (detalhe na `TABELA_ALTERACOES_CP4.md`)

| Tema | Mudança |
|---|---|
| Suportes | Cura = % da vida de quem cura (~5 de vida/s no nível 0): Fada a cada 2 s, Xamã 3 s, Sacerdotisa 4 s, Harpista 5 s; ±10%; teto por pulso nos bosses de raid |
| Árvore | Custo = 8 × tipo × anel (total 1.754; nó mais caro 56); básicos dos anéis 1–2 com efeito ×3; janela da árvore na derrota (sem penalidade) |
| Escada | Vida e ataque dos inimigos por barreira: ordens ×1,12/1,12/1,20; entrada dos mapas 2–3 ×1,118/1,24; boss ×1,022/1,071/1,20; raids ×1,30/1,37/1,46; Titã como boss ×1,04 |
| True Bosses | Primeiro Andarilho ×1,489, Dark Elf ×1,275, Fada ×1,738 (~12–15 pontos abaixo do boss do mapa 3) |
| Desafios | Recalibrados para −7 a −12 pontos cada |
| Vantagens | Juros, Caçador de Elites e Bênção do Caminho para +2 a +7 pontos |
| Relíquias | 43 relíquias, 6 categorias, 8 formatos novos; valores, raridades e mecânicas de 10/11 (seção 3) |
| Ativação de habilidade | Só com alvo válido (seção 4) |
| Nome | Ironbound → Grand Union na tela |

## 3. Relíquias (definições do Carlos, 10/11)
**Patamares por raridade** (lutas vencidas a mais por run, 10 nós): comum +1,5 · incomum +2 · rara +3 · ultra +4. A raridade define quanto a relíquia melhora a run; efeito e formato variam para chegar lá. Os valores abaixo vêm de **contas** (curva dos bônus puros e custo medido dos formatos), não de medição final.

| Raridade | Relíquias e efeito principal |
|---|---|
| Comum (11) | Placas (escudo 11% por 6 s) · Sino (+17% de velocidade nos primeiros 4 s) · Medalhão (dominó; +10 pts de crítico, crítico carrega 12%) · Espada (+1,5% e +1,5% por elite, até 9%) · Marca (+22% contra alvos < 30%, abate carrega 15%) · Amuleto da sorte (+21% de ouro) · Luneta · Selo de proteção (−15% de dano e agro 120 nos primeiros 6 s) · Ampulheta da paciência (2 acúmulos, 1 a cada 2 s, máx. 5) · Bandeira solitária (−15% de dano e +10% de dano isolado) · Bússola |
| Incomum (14) | Estandarte (+8% de ataque) · Pedra vital (+8% de vida) · Contrato (+20/+40 de ouro) · Mercador (−26% na loja) · Ídolo (+14% por maldição, até 42%) · Grito de guerra (3%) · Martelo (+25% no 1º golpe) · Botas (esquiva 2 ataques, +20% de velocidade nos 4 primeiros golpes, atordoa 1 s) · Arranque · Forja · Código de honra · Raiz de ferro · Amuleto amplificador · Estandarte do capitão |
| Rara (13) | Selo de repulsão (11,5%, 0,8 s) · Coração colossal (+12,5% de vida) · Corrente (43%) · Presa (13%/26%) · Brasa · Broche · Brasão · Espelho · Bênção (escudo 10%) · Totem da horda (+3% de dano por Blackfang caído) · Égide (aura 140, +10% de movimento dos Protetores) · Tomo (começa pronto, −20% de carga, +25% de poder) · Grimório |
| Ultra (5) | Last Stand (1 de vida, invulnerável 2 s) · Ampulheta de combate (90%) · Centelha · Eco (30%) · Funda |

A lista completa, com textos, está em `referencia/DEFINICOES_R3_10-11.md` e na tabela de alterações.

## 4. Ativação de habilidade (regra nova)
Antes: com a carga cheia, a habilidade disparava na hora contra o inimigo mais próximo, a qualquer distância (por isso habilidades saíam antes do contato). Agora:

| Tipo de habilidade | Só dispara quando |
|---|---|
| Golpe/tiro e zona no alvo, buff em si | o inimigo-alvo está no alcance de ataque |
| Investida | o alvo está a até alcance + 100 |
| Linha/cone/frente | o alvo está no comprimento da linha/cone daquela habilidade |
| Área em volta de si | há inimigo dentro da área |
| Buff/escudo em aliados | há aliado no raio e inimigo a até 100 de algum deles |
| Cura | há aliado abaixo de **95%** da vida no raio |

Vale para as 63 habilidades ativas dos 77 jogáveis e para as 17 cartas-herói de boss, dos dois lados. Os pulsos dos suportes continuam como estavam. Regras por unidade em `referencia/HABILIDADES_ATIVACAO_R3.md`.

## 5. O que não foi medido
- Nada depois de 10/11: relíquias com as definições finais, ativação de habilidade, mecânicas novas (Botas, Paciência, Selo, Totem, Égide, Tomo, Bandeira, Placas com duração).
- A escada (1ª vitória ~run 15) foi calibrada **antes** das relíquias novas e da regra de ativação. A dificuldade real do CP4 é desconhecida.
- Desafios e Vantagens: medição final pendente.
- Relíquias de nicho: estimativas com margem grande (±1,5 a ±2 lutas).

## 6. Roteiro sugerido de playtest
1. **Dificuldade geral:** em quantas runs vem a 1ª vitória e em que mapa as runs terminam (comparar com o CP3, que ficou fácil demais).
2. **Habilidades:** conferir que as habilidades saem no momento certo (com alvo), sem disparos no vazio; ver se alguma unidade "trava" sem disparar.
3. **Relíquias:** anotar quais parecem fortes ou fracas demais para a raridade, e se a bolsa enche (custo dos formatos).
4. **Mecânicas novas:** Botas (EVADE), Paciência, Selo, Tomo, Totem, Bandeira, Placas.
5. **Textos:** nomes Grand Union e textos das relíquias em PT e EN.

## 7. Validação técnica
Ver `validacao/README_VALIDACAO_CP4.md`: sintaxe OK nos 64 arquivos de `dist/`; motor e página carregam (erros só de imagens/fontes ausentes, iguais na v50); patches conferidos. **Suíte de testes e simulações não executadas.**
