Olá! Segue o pacote **Review R3: cartas** (raridades e cartas de herói), aprovado por mim a partir do novo laboratório de personagens que rodei com o Claude.

**Arquivos**
- `ANEXO_1_RARIDADES.md` + `raridades.json`: 24 personagens mudam de raridade (no JSON: id → raridade, com 0 = Comum, 1 = Incomum, 2 = Rara, 3 = Ultra).
- `ANEXO_2_HEROIS.md` + `herois.json`: nova versão das 17 cartas de herói (`hero_*`), com atributos por personalidade.

**Autorização**
- Pode implementar as duas partes.
- **Não publique ainda.**
- Não é preciso compatibilidade com saves antigos: eu reseto o progresso a cada atualização.
- Não mexa em preços de diamante. O preço de cada carta continua vindo da raridade (10, 15, 20, 25).

## 1. Raridades
- Aplique as 24 raridades do `raridades.json` nos personagens jogáveis. No código de referência a raridade vem de `cardTiers` (em `game-0.js`) e dos ajustes de balanceamento, então confira onde fica na fonte publicada.
- **Não mude nenhum atributo de combate.** É só a raridade.
- Por consequência, mudam automaticamente o preço na loja de diamantes, as chances nos boosters, a chance do drop de catálogo e as ofertas de "cartas raras" dos eventos. Isso é esperado.

## 2. Cartas de herói
- **Valem só para as cartas de herói (`hero_*`), geradas em `boss-cards.js`.** As versões de boss (líder, formas e True Boss) **não podem mudar**.
- **Atributos:** para cada herói do `herois.json`, use exatamente `hp`, `atk`, `defense`, `rate` (segundos entre ataques), `speed`, `crit`, `cost` = 4, `rarity` = 3 (Ultra) e `trigger.limit` (carga da habilidade em segundos).
- **`skillScale`:** é o multiplicador do poder da habilidade. No código de referência, `unit.skill = nível × skillScale`, e as habilidades dos heróis multiplicam dano, cura e escudo por `u.skill`. Só o Grand Oracle (×3,95) e a Fairy Queen (×2,26) têm valor diferente de 1.
- **First Wayfarer (`hero_ib_wayfarer`):** a habilidade da **carta** passa a ser `cleave` (golpe de 180% ATQ no alvo e 90% ATQ em inimigos a até 70 dele), em vez de `light`. Hoje o efeito lê o modo da habilidade em `JourneyBosses.D[boss].mode`, então troque **só na carta** (por exemplo, guardando o modo em `cards[id].mode` e usando esse valor no efeito). O boss First Wayfarer continua com a habilidade atual.
- **Textos das habilidades:**
  - Meowri Queen: o texto do `volley` passa a dizer "três golpes" (EN "three strikes") em vez de "três tiros".
  - First Wayfarer: usa o texto de `cleave`.
  - Grand Oracle e Fairy Queen: os textos devem mostrar os valores já multiplicados. Oracle: "golpeia por ~630% ATQ e cura o aliado mais ferido em 32% PV máximo". Fairy: "cura os 2 aliados mais feridos em 23% PV máximo e dá escudo de 23% por 4 s".
  - Para os outros heróis, os percentuais do texto não mudam.
- **Notas de 1 a 5 (`ratings`):** continuam as mesmas. Os novos atributos foram montados a partir delas.

## O que me devolver
1. Os arquivos e trechos alterados.
2. Confirmação de que as versões de boss não mudaram (vida, ataque e habilidade do boss First Wayfarer, por exemplo).
3. Uma lista dos 17 heróis com os atributos que ficaram no jogo, para eu conferir com o `herois.json`.
4. O que ficou diferente do pedido, e por quê.
