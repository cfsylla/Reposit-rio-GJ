# Aplicação da P1 aprovada — o que mudou, onde e como integrar

Aprovado por Carlos:
- curva de força (pode haver exceções de custo 1 ou 5, se necessário);
- os 33 ajustes de personagens;
- as mudanças de custo e de raridade;
- os ajustes numéricos de 11 traits.

Aplicado na pasta `game/`, que é uma cópia balanceada. A v54 original continua intacta em `v54/`.

## Arquivos alterados (só 4)

| Arquivo | Mudança |
|---|---|
| `dist/balance-p1.js` (**novo**) | Tabela com custo, raridade, vida, ataque, área e `skillScale` dos 33 personagens |
| `dist/index.html` | Carrega `balance-p1.js` logo depois de `game-0.js` |
| `dist/game-0.js` | Em `stats()`: o poder da habilidade passa a ser multiplicado por `t.skillScale` (padrão 1). Uma única linha |
| `dist/traits-v54.js` | Valores de Meowri, Troll, High Elf, Dark Elf, Orc, Arcane e do 1º patamar de Devastator, Sentinel, Unyielding, Predator e Lookout, mais os textos EN/PT correspondentes |

Patch aplicável sobre a v54: `balance/entrega/P1_dist.diff`.

## Testes

- `node scripts/validate-balance-base.cjs` na cópia: **PASS nas 5 etapas**.
- Os mesmos testes com `balance-p1.js` pré-carregado: PASS.
- Em `tests/traits-v54.cjs`, só foram atualizados os **valores esperados** dos traits aprovados. A lógica do teste não mudou. Patch: `balance/entrega/P1_tests.diff`.

## Riscos e observações para integrar na versão do ChatGPT

- IDs e saves não mudam. As cartas salvas guardam só tipo e nível; os atributos vêm da tabela.
- As "estrelas" de atributos mostradas na ficha (`ratings`) **não** foram atualizadas, porque interface está fora do escopo. A ficha pode mostrar estrelas antigas para os 33 personagens.
- Mudar raridade altera a frequência de oferta em lojas e recrutamento, e os boosters da coleção.
- Mudar custo altera a curva de energia dos decks atuais. Isso será medido na etapa dos decks.
- Os inimigos usam os mesmos personagens e também ficam com os novos valores.
- Se a versão do ChatGPT já tiver mexido em `stats()` ou em `traits-v54.js`, aplique as mudanças por busca do trecho, não por número de linha. O patch mostra o trecho exato.
