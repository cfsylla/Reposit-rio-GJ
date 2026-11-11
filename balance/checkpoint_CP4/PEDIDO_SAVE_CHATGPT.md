Olá! Preciso que o arquivo de save do Grand Journey (exportação `format: "grand-journey"`) passe a registrar mais informações de cada run, para analisar os playtests do balanceamento (CP4). As regras abaixo valem para todas as mudanças.

**Regras gerais**
- Só **adicionar** campos. Nenhum campo existente muda de nome, de formato ou é removido.
- Subir `schema` de 1 para 2. O jogo precisa continuar lendo saves antigos (schema 1) sem erro; os campos novos ficam ausentes ou vazios.
- Nenhuma mudança de gameplay, balanceamento ou interface. É só registro.
- IDs internos como estão no código (ex.: `ironbound`, `blackfang_goblins`, `precision`), sem traduzir.
- Manter o tamanho do save razoável: números arredondados (1 casa decimal para tempo, inteiros para vida/dano/ouro) e sem logs quadro a quadro.

**1. Identificação da run** (em cada item de `profile.runs[]`)
- `build`: identificação da versão/checkpoint do jogo (ex.: `"v50-BAL-CP4"`).
- `seed`: semente da run.
- `challenges`: lista dos Desafios ativos; `advantages`: lista das Vantagens ativas.
- `treeNodes`: lista dos nós da árvore que estavam comprados no início da run.
- `treeBought`: nós da árvore comprados ao final desta run (id + custo).

**2. A luta da derrota**
Hoje a luta em que o jogador perde não é gravada em `encounters`. Ela deve ser gravada como as outras, com todos os campos (inclusive os novos abaixo) e `result: "defeat"`. As lutas vencidas recebem `result: "win"`.

**3. Novos campos em cada item de `encounters[]`**
- `act`: número do mapa (1, 2, 3).
- `barrier`: tipo da luta para a escada de dificuldade: `"normal"`, `"order"` (luta de ordem), `"entry"` (entrada de mapa), `"elite"`, `"raid"`, `"boss"`, `"titan"`, `"trueBoss"`, `"event"`.
- `enemyScale`: multiplicador de força do inimigo aplicado naquela luta (o fator da barreira, de `JOURNEY_BARRIER_TUNE`, e qualquer outro multiplicador ativo, como Desafios), já combinado num número.
- `player`: o lado do jogador na luta:
  - `formation`: cartas em campo, com `type`, `level` e posição (`slot` ou `x`/`y`).
  - `relics`: relíquias equipadas, cada uma com `id`, formato e casas ocupadas na bolsa (`cells`: lista de [linha, coluna]).
  - `bagCellsUsed` / `bagCellsTotal`: casas ocupadas e total da bolsa.
- `rounds`: lista, um item por round, com:
  - `winner`: `"player"` ou `"enemy"`.
  - `time`: duração do round em segundos.
  - `playerHpPct` / `enemyHpPct`: vida total restante de cada lado ao fim do round (% da vida inicial).
  - `playerAlive` / `enemyAlive`: unidades vivas ao fim do round.
- `units`: um item por unidade do jogador que lutou (somando todos os rounds da luta):
  - `type`, `level`;
  - `skillCasts`: quantas vezes a habilidade disparou;
  - `skillHeldTime`: tempo total (s) em que a carga estava cheia mas a habilidade esperava um alvo válido (regra `skillValid`);
  - `damageDealt`, `damageTaken`, `healing`, `kills`, `deaths`.

**4. Escolhas oferecidas e escolhidas**
Em `events[]` (ou em uma lista nova `choices[]`), registrar, com `node` e horário:
- `relicOffer`: relíquias oferecidas como recompensa (nó de relíquia, elite, boss, evento) e qual foi escolhida (ou nenhuma).
- `shopOffer`: itens que apareceram na loja (cartas, relíquias, serviços, com preço) e quais foram comprados.
- `recruitOffer`: cartas oferecidas no recrutamento e qual foi escolhida.
- `eventChoice`: o evento, as opções e a opção escolhida (hoje só aparece `eventAccepted`).
- `fusion`: cada fusão/upgrade de carta (tipo, nível antes e depois).
- `relicMoved`: quando uma relíquia é colocada, movida ou guardada na bolsa.

**5. Ouro por nó**
Em cada item de `completed[]`: `goldIn` (ouro ganho no nó), `goldOut` (gasto no nó) e `goldAfter` (ouro ao sair do nó).

**Resumo do que testar**
- Um save novo exportado traz `schema: 2` e todos os campos acima, inclusive a luta da derrota.
- Um save antigo (schema 1) ainda importa e funciona.
- O jogo se comporta exatamente igual a antes (nada de balanceamento foi tocado).

Por favor, me mande no final a lista dos arquivos alterados e um exemplo de um item de `encounters[]` completo, com os campos novos preenchidos.

---

## Adendo: respostas às duas dúvidas

**1. Formação e relíquias por round**
- O lado do jogador vai **em cada round**: `rounds[i].player`, com `formation`, `relics` (com `cells`), `bagCellsUsed` e `bagCellsTotal`. A estrutura é a mesma descrita para `player`.
- Pela mesma lógica, `rounds[i].enemy` traz a formação inimiga daquele round: `type`, `level`, posição e reforços, se houver.
- `encounters[].player` continua existindo e guarda o estado do **round 1**, para facilitar a leitura rápida.
- Se nada mudou entre um round e outro, pode repetir o conteúdo mesmo assim. Prefiro repetido a ter que reconstruir.

**2. enemyScale com bônus em atributos diferentes**
`enemyScale` passa a ser um **objeto**: um multiplicador final por atributo, já com todas as fontes combinadas. Ao lado dele vem a lista das fontes:

```json
"enemyScale": { "hp": 1.25, "damage": 1.12, "attackSpeed": 1.00, "armor": 1.00, "skill": 1.00 },
"enemyScaleSources": [
  { "source": "barrier:order",       "hp": 1.12, "damage": 1.12 },
  { "source": "challenge:veteranos", "hp": 1.08 },
  { "source": "challenge:comandantes", "addLevel": 2 }
]
```

- **Atributos:** use os que o código realmente modifica. Se houver outros além de `hp`, `damage`, `attackSpeed`, `armor` e `skill`, inclua com o nome do código. Atributo sem bônus fica `1`.
- **Bônus que não são multiplicador:** nível extra, cartas extras e rodadas extras no boss vão como soma na fonte (`addLevel`, `addCards`, `addRounds` ou o nome equivalente no código), e não entram no objeto `enemyScale`.
- **Nome das fontes:** `tipo:id`, por exemplo `barrier:order`, `barrier:entry`, `barrier:boss`, `challenge:<id>` ou `raid:<id>`.
