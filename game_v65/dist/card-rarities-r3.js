/* Approved R3 rarities (20 Nov 2026). Apply after enemy/hero construction so
 * enemy templates, combat attributes and hero profiles remain untouched. */
(function(root){'use strict';const G=root.Game;
const tiers={"dark_elf_warrior":0,"cave_troll":0,"berserker":0,"elf_harpist":1,"mountain_troll":0,"priestess":0,"flower_fairy":0,"sorceress":0,"cavalier":0,"dark_elf_mage":1,"duelist":1,"sheriff":1,"orc_warrior":1,"elf_archer":1,"mage":1,"goblin_archer":1,"crossbowman":1,"feline_fighter":1,"martial_artist":2,"ranger":2,"shaolin":2,"centaur_crossbow":2,"archer":3,"cannoneer":3};
for(const [id,rarity] of Object.entries(tiers))G.BY[id].rarity=rarity;
G.CARD_RARITIES_R3=tiers;
})(globalThis);
