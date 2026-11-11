# Pendências do checkpoint GJ-v50-BAL-CP4

O que **não** deve ser aplicado a partir deste pacote, e as decisões em aberto.

## 1. Não aplicar
- O simulador do Claude (`balance/sim/`) e os dados brutos de medição (`balance/out/`).
- A proposta de **economia permanente** (`balance/rodada3/economia/PROPOSTA_ECONOMIA_R3.md`): em decisão.
- Variantes de teste (`balance/rodada3/variants/`): só valem para o simulador.

## 2. Decisões em aberto
| Tema | Situação |
|---|---|
| Recovery Brooch | o texto diz 5% a cada 3 s, mas o jogo limita a cura a 4,5% (`pulseHeal` máx. 0,045 em `game-0.js`). Corrigir o texto ou tirar o teto |
| Horde Totem e Guardian's Aegis | pela conta, bem abaixo do patamar da rara (~−2,5 e ~−2,8 lutas); mantidos por decisão do Carlos |
| Raider's Compass | abaixo do patamar da comum; mantida por decisão do Carlos |
| Travelers' Mirror, Everlasting Spark, Siege Sling | mantidos; o robô de simulação não sabe usar bem (escolhas do jogador, energia, cantos da bolsa) |
| Relíquias de nicho | estimativas com margem grande; medir só nos decks com o trait quando houver nova rodada de medição |
| Preço das relíquias | só as 6 relíquias que mudaram de raridade tiveram o preço ajustado (comum 30, incomum 35); as demais mantêm o preço antigo |
| Escada de dificuldade | calibrada antes das relíquias novas e da regra de ativação; precisa ser revista pelo playtest |
| Desafios e Vantagens | medição final (escada de combinações, "tudo ligado" ~50–70% com árvore completa) pendente |
| Secret Boss | a definir |

## 3. Riscos conhecidos (por não haver testes)
- A regra de ativação pode deixar alguma unidade sem disparar a habilidade se a condição dela nunca valer numa formação específica (ex.: curador sem aliado abaixo de 95%; investida sem alvo no alcance). Anotar no playtest.
- Testes de `tests/` com valores fixos foram atualizados para as definições de 10/11, mas **não foram executados**; a suíte tinha 18 falhas antigas (as mesmas da v50) na última execução (09/11).
- As 17 cartas-herói de boss usam regra simples (cura: aliado < 95%; demais: alvo no alcance).

## Ideias do Carlos a partir dos playtests (11/11) — anotadas, nada implementado

1. **Recrutas com upgrade por mapa.** Motivo: o jogador evita recrutar, porque uma carta nova sem sinergia piora a chance de vitória.
   - Mapa 1: chance de o recruta vir com +1 de upgrade.
   - Mapa 2: recrutas vêm com +1 de upgrade.
   - Mapa 3: recrutas vêm com +2 de upgrade. (A mensagem dizia "mapa 2, +2"; entendido como mapa 3, a confirmar.)
   - A definir: se vale só para o nó de recrutamento ou também para recrutas de eventos e da loja; o valor da chance no mapa 1.
2. **Relíquias mais raras a cada mapa.** A chance de raridade das relíquias oferecidas aumenta do mapa 1 para o 3.
   - A definir: os pesos de raridade por mapa; se vale para recompensa, loja e eventos; se o preço na loja acompanha.

Outros pontos da análise das runs 1-11 (`balance/rodada3/relatorios/R3_playtests_CP4_runs1-11.md`), também pendentes de decisão:
- Boss do mapa 2 (Orc) com fator ×0,70, mais fraco que a entrada do próprio mapa.
- Boss 3 derrotado 0 vezes antes da 1ª vitória (meta 2-3).
- Mapa 3 sem loja na rota da run 11 (terminou com 200 de ouro parado).

## Bug na versão publicada (11/11): desafio Reforços Inimigos sem efeito
- Run Vanguard (vitória, desafio ativo): em todas as lutas comuns e elites o inimigo teve o mesmo número de unidades do jogador (2v2, 3v3, 4v4). O código de referência do CP4 dá +1 unidade e +2 de energia ao inimigo.
- Mensagem para o ChatGPT: `BUG_REFORCOS_CHATGPT.md`.
