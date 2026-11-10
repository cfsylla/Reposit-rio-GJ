# Relíquias — definições do Carlos (10/11/2026), comuns e incomuns

Método: valor do efeito − custo do formato = patamar da raridade (comum +1,5 · incomum +2 · rara +3 · ultra +4 lutas por run, 10 nós).
Regra do Carlos: entre as opções que fecham o patamar, escolher a de maior chance de ficar dentro. Nada aplicado nem rodado; variante `variants/rel_carlos3.json`.

| Relíquia | Raridade | Formato | Efeito definido | Observação |
|---|---|---|---|---|
| Reinforced Plating | comum | quadrado (4) | Escudo de 11% da vida máxima no início de cada rodada, dura 6 s | 6 s é a duração já medida (mais segura que 13% por 4 s) |
| Opening Bell | comum | linha 3 (3) | +17% de velocidade de ataque nos primeiros 4 s de cada rodada | mais perto do ponto medido (20% por 5 s) |
| Precision Medallion | comum | **dominó (2)** | +10 pontos de crítico; cada crítico carrega 12% da habilidade de quem acertou | só crítico não fecha |
| Warding Seal | comum | L3 (3) | Sentinelas recebem 15% menos dano e atraem os ataques dos inimigos a até 120, ambos nos primeiros 6 s de cada rodada | código novo: redução só nos primeiros 6 s |
| Lonely Banner | comum | dominó (2) | Audacioso sem aliado vivo a até 90: −15% de dano recebido e +10% de dano causado | código novo: +10% de dano |
| Raider's Compass | comum | ponto (1) | +1 opção nas escolhas de carta (mantida) | abaixo do patamar; mantida por decisão |
| War Cry | incomum | dominó (2) | Cada crítico de um Destemido cura 3% da vida máxima dele | 4% mediu +2,7 (acima); 3% mais perto de +2 |
| Profane Idol | incomum | L3 (3) | +1 Exaustão ao equipar; +14% de ataque por maldição, até +42% | |
| Devastator's Hammer | incomum | L3 (3) | 1º ataque básico de cada Devastador por rodada: +25% de dano e atordoa 0,5 s (boss de raid, não) | estimativa mais incerta |
| Wind Boots | incomum | L3 (3) | Ver proposta abaixo (velocidade de ataque NÃO pode ser a luta inteira) | código novo: esquiva (mecanismo de bloqueio do Shaolin, texto "evade") e contagem de golpes |

Wind Boots — definida (Carlos 10/11): por rodada, cada Desbravador esquiva (evade) dos 2 primeiros ataques básicos recebidos; +10% de movimento; +20% de velocidade de ataque nos 4 primeiros golpes; o 1º ataque atordoa por 1 s (boss de raid, não). Estimativa ~+1,5 a +2 nos decks com Desbravadores — a medir.
Hourglass of Patience — definida (Carlos 10/11): Pacientes começam cada rodada com 2 acúmulos, ganham 1 acúmulo a cada 2 s (em vez de 3) e o máximo passa de 3 para 5. Estimativa ~+1,2 a +1,6 nos decks com Pacientes (comum, patamar +1,5). Código novo no trait Paciente (dois pontos: dano e DEF).
## Raras (Carlos 10/11) — parcial, com perguntas em aberto
| Relíquia | Definição | Observação |
|---|---|---|
| Travelers' Mirror | mantida (recrutadas vêm com +1 upgrade, até nível 2) | mede −1,9 abaixo do patamar com o robô (depende das escolhas do jogador) |
| Dawn's Blessing | escudo de 10% (em vez de 6%) da vida máxima para Dawncrest no início da rodada; renova no 1º abate | com 6% já mede +3,0 ±2,1 nos decks Dawncrest (no patamar); 10% estimado ~+4 (acima) |
| Horde Totem | efeito atual + **3% de dano por aliado Blackfang caído**, para todos os Blackfang vivos, sem limite | estimativa ~+0,5 nos decks Blackfang (abaixo, ~−2,5) |
| Guardian's Aegis | aura do Protetor 140 + **10% de velocidade de movimento para os Protetores** | estimativa ~0 a +0,3 (abaixo, ~−2,8) |
| Tome of Stars | conjuradores começam a rodada com a habilidade cheia, precisam de 20% menos carga e têm +25% de poder de habilidade | depende da mecânica nova abaixo |

## Mecânica nova (Carlos 10/11): habilidade só dispara com alvo válido
Hoje: com a carga cheia, a habilidade dispara na hora contra o inimigo mais próximo, a qualquer distância (game-0.js: `skillReady && canCast → activate(skillTarget)`). Pedido: só ativar quando houver alvo válido; senão, a unidade guarda a carga até encontrar a condição. Regras aprovadas (10/11): ferido = abaixo de 95%; investida = alcance + 100; buff em aliados = aliado no raio e inimigo a até 100. **Implementado em `game_r3/dist/game-0.js` (`skillValid`), ainda NÃO testado nem medido.** As 17 cartas-herói de boss (hero_*) seguem a regra antiga (ativam ao encher). Muda o combate de todas as unidades (jogador e inimigos): exige remedir a base (escada, bosses, relíquias).

## Ultra raras (Carlos 10/11) — todas mantidas
| Relíquia | Definição | Motivo |
|---|---|---|
| Combat Hourglass | mantida (começa com 90% da carga) | deve melhorar com a mecânica nova (habilidade espera alvo válido) |
| Everlasting Spark | mantida (+1 de energia em toda preparação) | boa; o robô provavelmente usa mal a energia extra |
| Arcane Echo | mantida (toda habilidade devolve 30% da carga) | deve melhorar com a mecânica nova |
| Siege Sling | mantida | — |
| Last Stand | 1 de vida e invulnerável 2 s (definido antes) | — |

## Implementação (10/11) — gravado no game_r3, NÃO testado nem medido
- Valores: `variants/rel_carlos3.json` gravado em game-0.js (RT) e relics-r3.js (DEF) com `r3-grava-reliquias.cjs`.
- Raridades: Estandarte e Pedra vital incomuns (35); Espada, Medalhão, Placas e Marca comuns (30). Medalhão em dominó.
- Mecânicas novas: Placas com duração; Selo só nos primeiros 6 s (redução + agro); Bandeira solitária +10% de dano; Paciência (2 acúmulos, a cada 2 s, máx. 5 — traits-v54.js); Botas (esquiva dos 2 primeiros básicos por rodada, +10% movimento, +20% vel. de ataque nos 4 primeiros golpes, atordoa 1 s); Totem da horda (+3% de dano por Blackfang caído); Égide (+10% de movimento dos Protetores); Tomo (começa pronta, −20% de carga, +25% de poder); Bênção 10%; Last Stand com 1 de vida.
- Habilidade só ativa com alvo válido: 73 habilidades + as 17 cartas-herói de boss (cura: aliado < 95%; demais: alvo no alcance).
- Testes que conferem valores antigos (relics-r3, systems-v18, content-v53) vão precisar de ajuste quando a suíte rodar.
