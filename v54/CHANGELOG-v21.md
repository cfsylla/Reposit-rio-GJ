# Grand Journey v21 — Combat effects and setup feedback

- Imported 25 compact effect atlases from the nine approved packs. Basic attacks, critical hits, gunfire, arrows/bolts, magic, melee strikes, explosions, healing, protection, teleport and forced movement use the appropriate visual effects. Status effects only show for actual combat state; importing assets does not introduce new mechanics.
- Sprite rendering falls back to existing effects if an image has not loaded. Damage numbers remain visible; sprite draw work is bounded. PNG atlases total approximately 158 KiB.
- Credits in the game list every effect author, source and applicable license. Ship only the adapted assets used inside the game, with original license files; the downloaded restricted packs are not redistributed as asset packs.
- Event/custom-deck relic selectors give descriptions a separate row. Bag shape SVGs retain their intended size instead of inheriting large offer-icon dimensions.
- Touch aim is above the dragged card, horizontally centered on it. Highlight and release use the same coordinates. Original pickup position and mouse targeting are preserved.
- Dragging immediately shows the same trait preview as selecting a unit, including reserve-to-field previews. Cancel restores the previous selection without replacing the dragged DOM element.
- All upgrades keep the character's base energy cost. Paid deployments and fusion use that base cost; transfers remain free. Upgrade help is updated in both languages.

Validation: systems-v18, setup-v19, drag-origin-v19-1, freeze-v20, setup-v20-1, vfx-v21, traits-cost-v21 and combat-replay-v21. Eight baseline combat replays confirm that effect changes preserve combat damage, health, motion, skill charge and outcomes. Browser QA: production relic-selector markup, saved-game combat, no hand in battle, credit screen, no application console errors. Physical Android touch placement remains user playtest.

Save schema stays at v20 because no state fields change; existing runs/profile/recovery remain supported.
