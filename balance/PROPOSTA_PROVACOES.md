# Proposta: Provações, Insígnias e Preparativos (pós-CP1)

**Situação:** proposta para aprovação de Carlos. Nada aplicado. Os valores são pontos de partida e serão calibrados por simulação depois da aprovação da lista.

## 1. Visão geral

| Sistema | O que é | Quando aparece |
|---|---|---|
| **Nível da árvore** (aprovado) | Nível = XP acumulado ÷ 10, até 30. Cada nível vale 10 pontos de árvore. Reset gratuito fora da run | Desde o início |
| **Provações** | Regras de dificuldade que o jogador escolhe antes da run. Cada regra vale pontos. A soma é o **Nível de Provação** da run | Depois da 1ª vitória |
| **Insígnias** | Moeda nova, ganha **só** em vitórias com Nível de Provação ≥ 1 | Junto com as Provações |
| **Preparativos** | Bônus de início de run comprados com insígnias, em espaços limitados | Depois da 1ª insígnia |

Princípio: **força controlada**. A árvore tem teto (30 níveis), e os preparativos têm poucos espaços. O jogo base (Provação 0) é calibrado para o jogador no teto da árvore com os espaços de preparativos cheios. As Provações são a única forma de ir além.

## 2. Provações (lista proposta)

Cada regra tem 1 a 3 graus. O jogador liga as que quiser. **Pontos totais possíveis: 32.**

| # | Provação | Efeito por grau | Graus | Pontos por grau | Parâmetro do motor que já existe |
|---|---|---|---|---|---|
| 1 | **Veteranos** | Inimigos comuns têm +1 upgrade | 3 | 1 | Curva de upgrades (`makeAI`) |
| 2 | **Elite de Guerra** | Elites ganham +1 relíquia e +1 upgrade | 2 | 1 | `rollEnemyRelics`, curva elite +1 |
| 3 | **Líderes Inteiros** | Líderes de boss perdem a redução (×0,80 → ×0,90 → ×1,00) | 2 | 2 | Bloco dos líderes em `boss-engine.js` |
| 4 | **Mercado Caro** | Preços da loja +15% | 2 | 1 | `price()` |
| 5 | **Bolsa Leve** | Ouro por vitória −15% | 2 | 1 | `battleReward()` |
| 6 | **Território Hostil** | Força inimiga dos mapas 2 e 3 +5% | 3 | 2 | `SPEC.power` |
| 7 | **Arsenal Inimigo** | +1 relíquia para elites, ordens e bosses | 2 | 1 | `rollEnemyRelics` (limite da bolsa mantido) |
| 8 | **Fúria das Raids** | Raids: vida +15% | 2 | 1 | Multiplicadores de raid (`attachRun`) |
| 9 | **Escolhas Escassas** | Recrutamento e recompensas de carta oferecem 1 opção a menos | 1 | 2 | `choices()` |
| 10 | **Árvore Contida** | Árvore limitada a −60 pontos por grau durante a run | 2 | 2 | Pontos de árvore (modelo de nível) |
| 11 | **Sem Preparo** | −1 espaço de preparativo | 2 | 1 | Preparativos (novo) |
| 12 | **Fardo Inicial** | Começa a run com 1 maldição | 2 | 1 | Maldições de eventos (`JourneyContent`) |

Notas:
- **Não muda o mapa 1 da Provação 0.** As Provações são opcionais, então o alívio do jogador novo continua intacto.
- Cada regra é **legível em uma linha** e mexe em algo que o jogador vê (preço, ouro, relíquias inimigas, opções).
- A calibração vai medir quantos pontos de vitória cada grau tira. A meta é **cada ponto custar entre 3 e 6 pontos de vitória** para um jogador no teto, de forma que o valor em pontos seja honesto. Regras fora disso terão os pontos corrigidos.
- Nenhuma regra é "mais do mesmo" com outro nome: a 1, a 6 e a 3 mexem em lutas comuns, mapas finais e bosses, respectivamente.

## 3. Insígnias

**Ganho por vitória com Provação P ≥ 1:**
1. **Vitória:** `1 + floor(P / 4)` insígnias. Ex.: P = 4 → 2; P = 12 → 4.
2. **Recorde do deck:** se P for maior que o recorde daquele deck, ganha `5 × (P − recorde)`. Ex.: primeira vitória com Fortaleza em P = 6 → +30. Depois, P = 8 → +10.

Efeitos:
- Com 24 decks, o recorde por deck incentiva jogar **todos os decks** em dificuldade maior, não só o mais forte.
- O total de recordes possíveis é 24 × 32 × 5 = **3.840 insígnias**, o teto prático da economia.
- **Selo do deck:** a tela de decks mostra o recorde de Provação de cada deck (reconhecimento).

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
- A calibração do jogo base (Provação 0) considera **2 espaços** equipados com preparativos fortes. Os espaços 3 e 4 são compensados pelas Provações, porque só quem já ganha insígnias chega neles.

## 5. Dados no save (resumo técnico)

Tudo em campos **opcionais**, sem alterar IDs nem a versão do envelope principal:

| Dado | Campo |
|---|---|
| XP acumulado | `profile.skillTree.totalXp` |
| Provações selecionadas | `profile.trials = { selected: {id: grau}, record: {deckId: P} }` |
| Provações da run | `s.trials = {id: grau}`, fixadas no início da run |
| Insígnias | `profile.insignia` |
| Preparativos | `profile.preparations = { owned: [], equipped: [], slots: 2 }` |

## 6. Telas (a cargo do projeto principal)

- **Árvore:** nível e pontos (ex.: "Nível 23 · 12 pontos livres"), barra até o próximo nível e botão **Redistribuir**, fora da run.
- **Antes da run:** painel de Provações com o total de pontos e a recompensa prevista, e os espaços de preparativos.
- **Fim da run:** insígnias ganhas e novo recorde do deck.
- **Tela de decks:** selo de recorde de Provação por deck.

## 7. Decisões para Carlos

1. Aprovar a **lista de Provações** (tirar, trocar ou adicionar regras).
2. Aprovar a **fórmula das insígnias**.
3. Aprovar a **lista e os custos dos preparativos**, e os espaços (2 iniciais, até 4).
4. **XP acima do nível 30:** converter em diamantes (1 a cada 20 XP) ou não.
5. **Saves antigos** com mais de 300 pontos de nós: no modelo implementado, a árvore é **resetada com reembolso** e um aviso é registrado. Alternativa: manter os nós comprados acima do limite.
