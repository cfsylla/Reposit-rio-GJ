# Checkpoint de balanceamento GJ-v54-BAL-CP1 (entrega parcial)

| Campo | Valor |
|---|---|
| Identificador | **GJ-v54-BAL-CP1** — checkpoint 1 do balanceamento. Não é um número de versão do jogo |
| Data | 02/11/2026 |
| Base | Grand Journey **v54**, commit `9b8bff1085f72112d492fd40ffba6c1ab63011b7` |
| Repositório de trabalho do Claude | commit do pacote registrado em `LEIA_ME_CHECKPOINT.md`; tag local `bal-cp1` |
| Situação | **Parcial.** O balanceamento continua. Nada aqui é definitivo |

## 1. Base realmente utilizada

- Os 7 ZIPs da v54 foram extraídos. **572 de 572 arquivos conferem** com `MANIFESTO_SHA256.json` (version 54, commit acima).
- Os únicos extras eram o próprio manifesto e `LEIA_ME_7_PARTES.md`.
- Diferenças de ambiente:
  - Node 22.23.4 (o pacote recomenda o 24); a validação passou;
  - as mídias foram mantidas fora do repositório de trabalho, mas idênticas.
- Esta entrega compara **sempre contra a v54 original**, e não contra iterações intermediárias.

## 2. Resumo do que está incluído (aprovado e implementado)

| Bloco | Conteúdo | Aprovação de Carlos |
|---|---|---|
| **P1 — Personagens** | Curva-alvo de força (custo e raridade). 33 personagens ajustados, com custo, raridade, vida, ataque, área e novo campo `skillScale`. Detalhe linha a linha em `TABELA_ALTERACOES` | 33 ajustes e mudanças de custo/raridade aprovados |
| **P1 — Traits (valores)** | Meowri, Troll, High Elf, Dark Elf, Orc, Arcane e o 1º patamar de Devastator, Sentinel, Unyielding, Predator e Lookout | Aprovado |
| **P2 — Traits (mecânicas)** | Legends of the East, Goblin, Trailblazer, Protector, Patient e Fearless (versão V4, com crítico garantido) | Aprovado. A alternativa do Arcane foi descartada |
| **P2 — Suportes modelo B** | 10 suportes com aura passiva (cura periódica e bônus); emissor não afetado; auras de suportes diferentes somam; sem realimentação; posicionamento atrás da frente | Aprovado, com as regras definidas por Carlos |
| **P3 — Decks** | 24 decks (10 IDs antigos com conteúdo novo e 14 novos), formato `counts`, relíquias iniciais, desbloqueio por milestones e bosses de ordem, migração de saves, elites sem decks de ordem, nomes EN | Aprovado |
| **P4 — Dificuldade e economia** | Curva de upgrades inimigos gradual; elite +1; descontos nos bosses; líderes mais fracos; ouro 14/16/18; upgrade 10/16; força ×1/×1,10/×1,16; escala do mapa 0,80; raids dos mapas 2 e 3 ×1,25/×1,1; decks inimigos temáticos por mapa; regra de relíquias inimigas R1 | Aprovado (V23 + R1) |
| **Bug da v54** | Lacaio invocado (Lanceiro do Rei Goblin) com carga de especial 0, usando o especial a cada quadro | Aprovado |

Valores e regras completas: `TABELA_ALTERACOES.md` / `.csv`, com 178 linhas, uma alteração por linha.

## 3. Regras e valores vigentes neste checkpoint

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

## 4. O que foi validado

Detalhes em `validacao/`.

**Funcionamento:**
- `node scripts/validate-balance-base.cjs` → **PASS** (8 etapas), rodado na cópia gerada pelo patch sobre uma v54 limpa.
- Suíte completa: ver `validacao/suite_completa.log` e a classificação das falhas conhecidas.

**Simulações:** jogador simulado = política no nível da IA do jogo, que aceita eventos seguros e compra relíquias. Seeds fixas e 1/60 s por passo.

| Bateria | O que mediu | Volume |
|---|---|---|
| Laboratório de personagens e traits | Índice de força | 77 × 3 níveis; 28 traits |
| Torneio de decks | Todos contra todos | 24 × 24 × 6 seeds |
| Runs por deck | Abertura e avanço | 40 seeds |
| Matriz final | Deck × avanço | 24 decks × 20 seeds × 3 estados de árvore = 1.440 runs |

Resultado da matriz final (V23):

| Árvore | Vence a run |
|---|---|
| Vazia | 3% |
| Intermediária (25 nós) | **43%** |
| Completa (60 nós) | 84% |

**Importante:** isso **não é prova de balanceamento final**. A política simulada é mais fraca que um humano, e não houve QA visual nem playtest humano neste checkpoint.

## 5. Revisado × não revisado

| Situação | Sistemas |
|---|---|
| **Revisado neste checkpoint** | Personagens (atributos, custo, raridade), traits, suportes, decks emprestados, decks inimigos das batalhas normais, curva de dificuldade, bosses de equipe (líder e equipe), raids (só multiplicadores), ouro de vitória, preço de upgrade na loja, relíquias de inimigos |
| **Ainda não revisado** | Árvore e XP (custos e valores); economia de eventos e probabilidades; preços de relíquias e loja de cartas; maldições; true bosses (forma 2); raids (mecânicas internas); economia permanente (diamantes, boosters, coleção); relíquias do jogador; recrutamento |
| **Precisa de playtest humano** | Todos os itens P2 (sensação dos novos traits e das auras), ritmo da curva P4, legibilidade das auras e textos novos na interface |

## 6. Impacto em saves

Ver `INTEGRACAO_CHATGPT.md`, seção 6.
