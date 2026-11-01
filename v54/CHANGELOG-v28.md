# v28 — restore Warrior and fix v26 interface issues

Warrior sprite/renderer restored from v26; v27 atlas and animation script removed from the deployed application. Portraits, cards, combat rules, Blackfang progression and saves preserved.

Blackfang nodes no longer have a red square background or outside border. Original circular node treatment remains.

Relic Bag supports pointer drag/drop on mouse, touch and pen, from inventory/reserve into the grid, within the grid, and back to inventory. Preserve the grabbed occupied-cell offset and rotation. Preview actual occupied cells in green/red. Invalid/outside/cancelled moves retain the original draft position. During combat the Bag remains read-only. Confirmation/cancellation retain the existing transaction model.

Click placement attempts a valid geometric fit before selecting the occupant under an empty shape origin. Last Stand can be inserted alongside Hourglass without removing it.

Card Cycle uses a dedicated card-with-circular-arrows icon; View Deck keeps its original deck icon.

Active combat synergies remain in a non-collapsing accessible HUD row. Round-start counts persist through deaths; explicit empty state replaces an absent row when no trait is active.

Validated with the Last Stand/Hourglass example, all relic rotations and grab offsets, invalid drops and draft/confirmed state isolation; Blackfang and tutorial regressions; browser drag from grid and inventory, confirmation/reopen, original Warrior combat, synergy counts 2/2/3, and transparent Blackfang node backing. Physical Android touch validation remains pending.
