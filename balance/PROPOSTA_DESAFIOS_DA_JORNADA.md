# Proposta: Desafios da Jornada, Insígnias e Preparativos (pós-CP1)

**Versão 2:** alinhada ao documento `Grand_Journey_Desafios_da_Jornada.md` (02/11/2026): nome do sistema, desbloqueio na 1ª vitória no mapa 3, desafios Tropas Resistentes, Ataques Implacáveis, Recursos Escassos, Bagagem Limitada e Reforços Inimigos.

**Situação:** proposta para aprovação de Carlos. Nada aplicado. Os valores são pontos de partida e serão calibrados por simulação depois da aprovação da lista.

## 1. Visão geral

| Sistema | O que é | Quando aparece |
|---|---|---|
| **Nível da árvore** (aprovado) | Nível = XP acumulado ÷ 10, até 30. Cada nível vale 10 pontos de árvore. Reset gratuito fora da run | Desde o início |
| **Desafios da Jornada** | Desafios que o jogador escolhe antes da run. Cada desafio vale pontos. A soma é o **Nível de Desafio** da run | Depois da 1ª run vencida (boss do mapa 3) |
| **Insígnias** | Moeda nova, ganha **só** em vitórias com Nível de Desafio ≥ 1 | Junto com as Desafios |
| **Preparativos** | Bônus de início de run comprados com insígnias, em espaços limitados | Depois da 1ª insígnia |

Princípio: **força controlada**. A árvore tem teto (30 níveis), e os preparativos têm poucos espaços. O jogo base (Nível de Desafio 0) é calibrado para o jogador no teto da árvore com os espaços de preparativos cheios. As Desafios são a única forma de ir além.

## 2. Desafios (lista proposta)

Cada desafio tem 1 a 3 graus. O jogador liga os que quiser. A dificuldade normal (Nível de Desafio 0) continua disponível. **Pontos totais possíveis: 38.**

| # | Desafio | Efeito por grau | Graus | Pontos por grau | Parâmetro do motor | Origem |
|---|---|---|---|---|---|---|
| 1 | **Veteranos** | Inimigos comuns têm +1 upgrade | 3 | 1 | Curva de upgrades (`makeAI`) | Claude |
| 2 | **Tropas Resistentes** | Vida dos inimigos +8% | 3 | 1 | Escala do inimigo (`createBattle`) | Doc. ChatGPT |
| 3 | **Ataques Implacáveis** | Dano dos inimigos +8% | 3 | 1 | Escala do inimigo (`createBattle`) | Doc. ChatGPT |
| 4 | **Comandantes Preparados** | Elites, ordens e bosses: +1 relíquia e +1 upgrade | 2 | 1 | `rollEnemyRelics`, curva | Doc. ChatGPT + Claude |
| 5 | **Líderes Inteiros** | Líderes de boss perdem a redução (×0,80 → ×0,90 → ×1,00) | 2 | 2 | Líderes em `boss-engine.js` | Claude |
| 6 | **Reforços Inimigos** | +1 unidade inimiga em lutas normais e elites (respeita a ocupação do campo; não vale para bosses e raids) | 1 | 2 | Tabuleiro da IA (`makeAI`) | Doc. ChatGPT |
| 7 | **Fúria das Raids** | Raids: vida +15% | 2 | 1 | Multiplicadores de raid (`attachRun`) | Claude |
| 8 | **Mercado Inflacionado** | Preços da loja +15% | 2 | 1 | `price()` | Doc. ChatGPT |
| 9 | **Bolsa Leve** | Ouro por vitória −15% | 2 | 1 | `battleReward()` | Claude |
| 10 | **Recursos Escassos** | −1 de energia no preparo de cada rodada | 1 | 3 | Energia do preparo | Doc. ChatGPT |
| 11 | **Bagagem Limitada** | Bloqueia 2 casas da bolsa de relíquias | 2 | 1 | Bolsa (`ensureBag`) | Doc. ChatGPT |
| 12 | **Escolhas Escassas** | Recrutamento e recompensas de carta: 1 opção a menos | 1 | 2 | `choices()` | Claude |
| 13 | **Árvore Contida** | Árvore limitada a −60 pontos por grau durante a run | 2 | 2 | Pontos de árvore (modelo de nível) | Claude |
| 14 | **Sem Preparo** | −1 espaço de preparativo | 2 | 1 | Preparativos (novo) | Claude |
| 15 | **Caminho Amaldiçoado** | Começa a run com 1 carta negativa (maldição) no deck | 2 | 1 | Maldições (`JourneyContent`) | Doc. ChatGPT |

Notas:
- **A dificuldade normal não muda.** O alívio do mapa 1 para o jogador novo continua intacto.
- Cada desafio é **legível em uma linha** e mexe em algo que o jogador vê.
- **Calibração:** medir quantos pontos de vitória cada grau tira para um jogador no teto da árvore. A meta é **cada ponto custar de 3 a 6 pontos de vitória**. Desafios fora disso têm os pontos corrigidos.
- **Combinações a vigiar** (como alerta o documento): Recursos Escassos com Reforços Inimigos (falta de energia para responder a mais unidades); Bagagem Limitada com Comandantes Preparados; Escolhas Escassas com Caminho Amaldiçoado. A simulação vai medir as piores combinações. Se alguma ficar inviável, ela será bloqueada ou terá os graus limitados.
- **Bosses e raids:** só entram nos desafios 1 a 5 e 7. Reforços Inimigos fica fora deles até haver um desenho específico.

## 3. Insígnias

**Ganho por vitória com Nível de Desafio P ≥ 1:**
1. **Vitória:** `1 + floor(P / 4)` insígnias. Ex.: P = 4 → 2; P = 12 → 4.
2. **Recorde do deck:** se P for maior que o recorde daquele deck, ganha `5 × (P − recorde)`. Ex.: primeira vitória com Fortaleza em P = 6 → +30. Depois, P = 8 → +10.

Efeitos:
- Com 24 decks, o recorde por deck incentiva jogar **todos os decks** em dificuldade maior, não só o mais forte.
- O total de recordes possíveis é 24 × 38 × 5 = **4.560 insígnias**, o teto prático da economia.
- **Selo do deck:** a tela de decks mostra o recorde de Nível de Desafio de cada deck (reconhecimento).
- **Títulos e cosméticos** (sugestão do documento de ideias): títulos por vencer com um desafio no grau máximo (ex.: "Indomável" com Ataques Implacáveis 3) e por marcos de Nível de Desafio total (10, 20, 30, 38). Sem efeito em força.

**XP acima do nível 30:** continua sendo somado no perfil (já implementado como `overflowXp`). **Decisão em aberto:** converter em diamantes (sugestão: 1 diamante a cada 20 XP excedente) ou deixar sem uso.

## 4. Preparativos

**Espaços:** 2 no início. Comprar o 3º custa 150 insígnias, e o 4º custa 300.

Cada preparativo é desbloqueado uma vez com insígnias e depois **equipado** antes da run, sem custo por run.

| Preparativo | Efeito | Custo |
|---|---|---|
| **Relíquia de Viagem** | Começa com +1 relíquia comum aleatória que caiba na bolsa | 40 |
| **Treino Prévio** | 1 carta aleatória do deck começa com upgrade 1 | 40 |
| **Reforço** | +1 cópia de uma carta aleatória do deck (respeita o máximo de 4) | 50 |
| **Gêmeo** | Escolhe 1 carta do deck para duplicar (respeita o máximo de 4) | 80 |
| **Bolsa Cheia** | +15 de ouro inicial | 30 |
| **Olho Treinado** | 1 vez por mapa, renova uma escolha de relíquia | 60 |
| **Recruta Extra** | O 1º recrutamento de cada mapa oferece +1 candidato | 60 |
| **Ensaio** | A 1ª carta comprada em cada loja vem com upgrade 1 | 80 |

Notas:
- **Recruta Extra** e **Olho Treinado** se parecem com nós de Expedição da árvore (Mais Candidatos, Olhar de Explorador). Se forem aprovados aqui, os nós de Expedição serão revistos para não repetir efeitos.
- A calibração do jogo base (Nível de Desafio 0) considera **2 espaços** equipados com preparativos fortes. Os espaços 3 e 4 são compensados pelas Desafios, porque só quem já ganha insígnias chega neles.

## 5. Dados no save (resumo técnico)

Tudo em campos **opcionais**, sem alterar IDs nem a versão do envelope principal:

| Dado | Campo |
|---|---|
| XP acumulado | `profile.skillTree.totalXp` |
| Desafios selecionadas | `profile.trials = { selected: {id: grau}, record: {deckId: P} }` |
| Desafios da run | `s.trials = {id: grau}`, fixadas no início da run |
| Insígnias | `profile.insignia` |
| Preparativos | `profile.preparations = { owned: [], equipped: [], slots: 2 }` |

## 6. Telas (a cargo do projeto principal)

- **Árvore:** nível e pontos (ex.: "Nível 23 · 12 pontos livres"), barra até o próximo nível e botão **Redistribuir**, fora da run.
- **Antes da run:** painel de Desafios com o total de pontos e a recompensa prevista, e os espaços de preparativos.
- **Fim da run:** insígnias ganhas e novo recorde do deck.
- **Tela de decks:** selo de recorde de Nível de Desafio por deck.

## 7. Decisões para Carlos

1. Aprovar a **lista de Desafios** (tirar, trocar ou adicionar regras).
2. Aprovar a **fórmula das insígnias**.
3. Aprovar a **lista e os custos dos preparativos**, e os espaços (2 iniciais, até 4).
4. **XP acima do nível 30:** converter em diamantes (1 a cada 20 XP) ou não.
5. **Saves antigos** com mais de 300 pontos de nós: no modelo implementado, a árvore é **resetada com reembolso** e um aviso é registrado. Alternativa: manter os nós comprados acima do limite.
