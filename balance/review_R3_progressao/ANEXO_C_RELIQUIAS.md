# Anexo C: liberação das 25 relíquias fora do pool dos inimigos (aprovado por Carlos, 12/11)

## Contexto
- Na v56, 25 das 43 relíquias estão fora do pool dos inimigos: 23 marcadas como `playerOnly`, mais Merchant's Coin e Lucky Charm, que o filtro exclui.
- Pela regra da seção 5 (relíquia só entra no catálogo pelo drop de uma relíquia **usada pelo inimigo**), essas 25 nunca poderiam ser liberadas para compra.
- Este anexo define o destino de cada uma e **substitui** qualquer ponto em conflito com a seção 5.

## Regra
1. **14 relíquias entram no pool dos inimigos da Grand Union e de Titans.**
   - Elas passam a ser liberadas para compra pelo drop normal (seção 5).
   - Tirar o `playerOnly` dessas 14.
   - O filtro de traits vale como já vale para Scope, Tome, Boots e Shield: o inimigo só recebe a relíquia se o deck dele atender à condição da tabela.
2. **Relíquias ultra (Arcane Echo e Siege Sling) nos inimigos:**
   - só no **mapa 3** e em **bosses**;
   - nos mapas 1 e 2, fora dos bosses, inimigos não recebem ultras.
3. **A quantidade de relíquias por inimigo não muda.** Muda só o pool de onde elas saem.
4. **As 2 relíquias exclusivas de ordem entram só no pool dos decks inimigos da própria ordem.**
   - O drop só pode liberá-las depois que a ordem for revelada, com a mesma trava das cartas da ordem.
   - Antes disso, o drop sorteia outra coisa.
5. **As outras 9 relíquias continuam fora do pool dos inimigos.**
   - Elas são liberadas para compra por **marco**, 1 relíquia por marco.
   - A raridade acompanha a dificuldade do marco.

## 1. Entram no pool dos inimigos (14)
| ID | Relíquia | Raridade | Condição no deck inimigo |
|---|---|---|---|
| `lone` | Lonely Banner | comum | ter Audaciosos |
| `patience` | Hourglass of Patience | comum | ter Pacientes |
| `devastator` | Devastator's Hammer | incomum | ter Devastadores |
| `warcry` | War Cry | incomum | ter Destemidos |
| `ironroot` | Iron Root | incomum | ter Inabaláveis |
| `amplifier` | Amplifying Amulet | incomum | ter suportes com aura |
| `honor` | Code of Honor | incomum | — |
| `talents` | Forge of Talents | incomum | — |
| `chain` | Chain of Command | rara | — |
| `houses` | Crest of Houses | rara | — |
| `aegis` | Guardian's Aegis | rara | ter Protetores |
| `colossal_heart` | Colossal Heart | rara | — (a IA também compra a 1ª mão com 3 cartas) |
| `echo` | Arcane Echo | ultra | — (só no mapa 3 e em bosses) |
| `sling` | Siege Sling | ultra | — (só no mapa 3 e em bosses) |

## 2. Exclusivas de ordem (2)
| ID | Relíquia | Pool | Pode ser liberada para compra |
|---|---|---|---|
| `horde` | Horde Totem | só nos decks inimigos de Blackfang | depois que Blackfang for revelada |
| `dawn` | Dawn's Blessing | só nos decks inimigos de Dawncrest | depois que Dawncrest for revelada |

## 3. Liberadas por marco (9)
| ID | Relíquia | Raridade | Marco | Situação do marco |
|---|---|---|---|---|
| `luckycharm` | Lucky Charm | comum | Fazer um combate de treinamento (`training_first`) | já existe |
| `compass` | Raider's Compass | comum | Concluir 5 nós no mapa 1 com deck custom (`custom_five`) | já existe |
| `dormant_sword` | Dormant Sword | comum | Derrotar o Boss Titans no mapa 1 (`boss_monsters_map1`) | já existe |
| `captain_standard` | Captain's Standard | incomum | Montar um deck custom completo (`custom_build`) | já existe |
| `profane_idol` | Profane Idol | incomum | Derrotar o Boss Blackfang no mapa 1 (`boss_blackfang_map1`) | já existe ("?????" até a revelação) |
| `contract` | Mercenary Contract | incomum | Derrotar o Boss Dawncrest no mapa 1 (`boss_dawncrest_map1`) | já existe ("?????" até a revelação) |
| `merchant` | Merchant's Coin | incomum | **Novo:** Comprar 2 relíquias na loja em uma run (`shop_relics_two`) | novo |
| `grimoire` | Apprentice's Grimoire | rara | **Novo:** Ganhar 40 de XP da árvore em uma run (`xp_forty`) | novo |
| `travelers_mirror` | Traveler's Mirror | rara | **Novo:** Vencer um confronto do mapa 3 com 2 cartas recrutadas em campo (`recruits_map3`) | novo |

- Os IDs dos marcos novos são sugestões.
- Os 6 marcos que já existem deixam de dar só diamante e passam a liberar a relíquia.
- **Excepcionalmente, estas 9 relíquias são liberadas por marco.** A regra geral da seção 5 continua: cartas, as outras relíquias e boosters não vêm de marco além do que está no Anexo A.

## Contagem atualizada dos marcos
99 + 3 novos = **102 marcos**:
- **44 liberam algo:** 22 decks e boosters da Grand Union, 13 de Blackfang e Dawncrest, e 9 relíquias;
- **2 liberam só o mapa seguinte;**
- **56 dão só o diamante.**
