# Grand Journey — Pacote de balanceamento P1 a P4 (para integrar na base atual)

Autor do design: **Carlos Felipe Sylla**. Análise e implementação: Claude (sessão de balanceamento).

- Base de partida: **v54**, commit `9b8bff1085f72112d492fd40ffba6c1ab63011b7`.
- Tudo foi **aprovado por Carlos, item por item**.
- Este pacote contém **somente** as alterações de balanceamento. Ele não mexe em interface, artes, traduções gerais nem hospedagem.

## 0. Como integrar (para o ChatGPT)

1. **Não substituir o projeto inteiro.** Aplicar as mudanças sobre a versão mais recente do repositório.
2. Arquivos **novos**: copiar como estão. São independentes:
   - `dist/balance-p1.js`
   - `dist/decks-p3.js`
   - `dist/enemy-decks-p4.js`
   - `dist/supports-b.js`
   - `tests/balance-p2.cjs`
   - `tests/decks-p3.cjs`
   - `tests/difficulty-p4.cjs`
3. Arquivos **alterados**: aplicar pelo **trecho**, não pelo número de linha. Os trechos exatos estão em `v54_para_balanceado_dist.diff` e `v54_para_balanceado_tests_scripts.diff`.
   - `dist/game-0.js`
   - `dist/acts-engine.js`
   - `dist/boss-engine.js`
   - `dist/traits-v54.js`
   - `dist/index.html`
4. Se a versão atual já tiver alterado algum desses trechos, combinar as duas mudanças, preservando a intenção descrita nas tabelas abaixo.
5. Ordem de carga no `index.html`:

   `game-0` → **balance-p1** → **decks-p3** → … → `acts-engine` → **enemy-decks-p4** → … → `traits-v54` → **supports-b** → …

6. Validar com `node scripts/validate-balance-base.cjs`. Na cópia balanceada, o resultado foi **PASS nas 8 etapas**.
7. IDs de cartas, relíquias, traits, nós e os 10 decks antigos foram preservados. Saves antigos continuam válidos, e há migração automática dos desbloqueios de deck.
8. **Fora deste pacote, a fazer pelo ChatGPT se desejar:**
   - as "estrelas" (`ratings`) de atributos mostradas na ficha dos 33 personagens ajustados não foram atualizadas;
   - não há telas novas para os decks.

## P1 — Curva de força, personagens e traits numéricos

**Regra aprovada.** Força-alvo de cada personagem = 1,00 + 0,04 por ponto de custo acima de 2 + 0,02 por nível de raridade. Exceções de custo 1 ou 5 são permitidas.

**Implementação:**
- `dist/balance-p1.js`: tabela com custo, raridade, vida, ataque, área e `skillScale` de 33 personagens.
- `dist/game-0.js`, função `stats()`: o poder de habilidade passa a ser multiplicado por `t.skillScale` (padrão 1).

**Mudanças de custo e raridade incluídas na tabela:**
- Cannoneer: Comum → Rara, área 65 → 50.
- Cowboy: custo 2 → 3.
- Custo 4 → 3: Sorceress, Mage, Mago Elfo Sombrio, Pirate Captain, Bear Druid, Cavaleiro Centauro, Guardião Elfo Negro.
- Custo 3 → 2: Eagle Druid, Kinoichi, Orc Lutadora.
- Raridade: Shaolin, Ronin, Shinobi e Predador Elfo da Floresta → Incomum; Gladiador → Comum; Archer → Incomum.

**Traits numéricos (`traits-v54.js`, valores e textos EN/PT):**

| Trait | Mudança |
|---|---|
| Meowri | imunidade 0,75/1,5 s → 0,25/0,5 s |
| Troll | golpe forte a cada 4º/3º básico (era 6º/5º) |
| High Elf | escudo 15%/22% (era 10%/15%) |
| Dark Elf | ignora defesa 30%/45% (era 15%/25%) |
| Orc | 6%/9% por acúmulo, máximo 30%/45% |
| Arcane | próximo especial +40%/60% (era 15%/25%) |
| Devastator, 1º patamar | ATQ +15% |
| Sentinel, 1º patamar | DEF +60% |
| Unyielding, 1º patamar | Vida +20% |
| Predator, 1º patamar | crítico +25 |
| Lookout, 1º patamar | alcance +15% |

## P2 — Mecânicas de traits e suportes (modelo B)

**Seis traits com mecânica nova (`traits-v54.js`, textos EN/PT atualizados):**

| Trait | Mecânica nova |
|---|---|
| Legends of the East | cada 4º básico causa +50%/+60% de dano e ignora 25%/40% da defesa |
| Goblin | +8% de dano por outro Goblin diferente vivo (até 3). A redução de dano por proximidade foi retirada |
| Trailblazer | movimento +15%/+25%; o 1º básico depois de se deslocar 30+ causa +45%/+65% (no máximo a cada 4 s) |
| Protector | aliados a até 90 de um Protetor vivo recebem 5%/10% menos dano. Vale o mais forte, não acumula. A provocação antiga foi retirada |
| Patient | a cada 3 s: DEF +8%/+15% e dano +4%/+8%, acumulando até 3 vezes |
| Fearless (V4) | a cada 3/2 básicos, o golpe é crítico garantido; abaixo de 40% de vida, todo básico é crítico. É a única exceção ao teto de 75% de crítico |

**Suportes modelo B (`dist/supports-b.js`).** Priestess, Harpista, Fada das Flores, Troll das Neves, Shaman, Sage, Feiticeiro Meowri, Barda, Rei Goblin e Percussionista Meowri passam a ter **aura passiva** (raio 120):
- cura os **outros** aliados dentro da aura a cada X s;
- dá um bônus de atributo aos **outros** aliados dentro da aura;
- o suporte se mantém ~60 atrás da linha da frente.

Regras de segurança:
- o emissor não é afetado pela própria aura;
- auras de suportes diferentes se somam;
- a força da aura usa o poder **base** do suporte, sem realimentação;
- upgrade e fusão aumentam a aura pela metade do crescimento normal.

Os valores de cada suporte estão no próprio arquivo. O texto da habilidade (EN/PT) é gerado a partir dos valores.

## P3 — 24 decks e desbloqueios (`dist/decks-p3.js`)

- **Os 10 IDs antigos foram mantidos com conteúdo novo, e há 14 decks novos.** Formato com `counts` (cópias por personagem; 20 cartas; no máximo 4 cópias).
  - Em `game-0.js`, `deckCards()` passou a aceitar `counts`.
  - Também em `game-0.js`, `makeAI()` respeita `counts` e **não sorteia decks de ordem como elites comuns**, para não revelar personagens bloqueados.
- **Desbloqueios:**
  - milestones existentes que não liberavam nada passam a liberar decks;
  - novo milestone **"Derrotar o boss do mapa 2"**, que libera Terremoto;
  - boss de ordem libera 2 decks;
  - true boss da ordem libera os demais.
- **Migração de saves:** decks de milestones já concluídos são liberados ao carregar o perfil.
- Nomes e descrições dos decks em PT, com tradução EN registrada no dicionário `I18n.words`.

## P4 — Dificuldade e economia (pacote V23 + regra de relíquias R1)

Meta aprovada: com **árvore intermediária (20 a 30 nós)**, o jogador terminar a run. Quem quiser mais desafio terá o modo de desafio após o boss final (não implementado).

| # | Onde | Antes (v54) | Agora |
|---|---|---|---|
| 1 | `game-0.js` / `makeAI` | upgrades inimigos em degraus: 12 cartas na 4ª luta, 20 na 7ª, máximo na 9ª | **~1 upgrade por luta**: luta N tem N−2 upgrades, até 26 (todas L1 + 6 L2) no fim do mapa 3 |
| 2 | idem | elites com upgrade em só ~1/3 dos tipos | elite = curva **+1** |
| 3 | idem | boss = batalha normal | boss comum = curva **−3/−4/−6** (mapa 1/2/3) |
| 4 | idem | idem | equipe do boss de ordem = curva **−4/−7/−8**; Rei Troll −3 extra |
| 5 | `boss-engine.js` (bloco no fim) | líderes com valores-base | líderes **−20%** de vida e ataque; Rei Troll −35%; Rainha Meowri e Líder Centauro −25% |
| 6 | `game-0.js` / `battleReward` | 10/12/14 (por nº de lutas) | **14/16/18** por mapa |
| 7 | `game-0.js` / `price` | upgrade na loja 12 e 20 | **10 e 16** (upgrades de eventos sem mudança) |
| 8 | `acts-engine.js` / `SPEC.power` | ×1 / ×1,12 / ×1,25 | **×1 / ×1,10 / ×1,16** |
| 9 | `game-0.js` / `createBattle` | escala começa em 0,86 (+2% por luta, até +16%) | começa em **0,80** (+2% por luta, até +16%) |
| 10 | `game-0.js` / `rollEnemyRelics` | 33% por oportunidade de relíquia, mínimo 1 | **regra de Carlos (R1): sorteio entre 1 e n−1**, n = 1 inicial + oportunidades. Continua limitado pela bolsa |
| 11 | `acts-engine.js` / `attachRun` | escala da raid × força do mapa | mapas 2 e 3: vida **×1,25**, dano **×1,1** |
| 12 | `dist/enemy-decks-p4.js` + `makeAI` | batalha normal sorteava 10 personagens quaisquer | **4 decks temáticos por mapa** (12 no total), a partir da 2ª luta |
| 13 | `boss-engine.js` / `freshMinion` | **bug da v54**: o Lanceiro invocado pelo Rei Goblin nascia com carga 0 e usava o especial a cada quadro (60×/s) | a unidade invocada recebe a carga normal do especial |

**Resultado medido** com o jogador simulado (joga no nível da IA do jogo; um humano tende a ir melhor). Foram 1.440 runs, 24 decks × 20 runs × 3 estados de árvore:

| Árvore | Passa do mapa 1 | Passa do mapa 2 | Vence a run |
|---|---|---|---|
| Vazia | 51% | 9% | 3% |
| Intermediária (25 nós) | 94% | 60% | **43%** |
| Completa (60 nós) | 98% | 93% | 84% |

## Testes alterados

Em todos os casos só foram atualizados os **valores esperados** que mudaram por decisão aprovada:

| Teste | Ajuste |
|---|---|
| `traits-v54` | novos valores e mecânicas de traits |
| `systems-v18` | novo formato de deck com `counts` |
| `roster-v37` | valores da P1 |
| `acts-v47` | multiplicador das raids |
| `content-v53` | preço do upgrade na loja |
| `manticore-v46`, `monsters-v42`, `raids-v45` | ouro por vitória |
| `tree-v51` | preço do upgrade com desconto da árvore |

`scripts/validate-balance-base.cjs` carrega os módulos novos e roda os 3 testes novos.

**Limitações conhecidas dos testes:**
- `bosses-v50`, rodado sozinho sem traits, falha num cenário fixo de 15 s contra as formas 2 do Rei Dark Elf e da Rainha Fada. Na validação oficial, com todos os módulos, passa.
- Testes históricos que dependem do histórico git antigo ou de simulações de interface antigas já falhavam na v54 exportada.

## Ainda pendente (próximas etapas, não incluídas)

1. **Revisão leve dos decks nos extremos** (Coro de Guerra forte; Lei do Gatilho, Fortaleza, Tripulação Salgada e Presas Negras fracos).
2. **Árvore permanente e XP:** a árvore hoje dá uma vantagem muito grande. Sem árvore, a vitória fica em 3% (meta 5% a 10%).
3. Economia dos eventos, relíquias da loja, diamantes e coleção.
4. Diferença registrada entre documento e código: na v54, o filtro de relíquias de inimigos ainda usa nomes antigos de traits (`Atirador`, `Arcano`, `Ágil`, `Defensor`). Por isso scope, tome, boots e shield **nunca** aparecem para inimigos. Não foi alterado; aguarda decisão.
