# Grand Journey v18 — Fusion, reserve and individual skill triggers

2026-10-23. Updates the existing Site; retains its audience and existing profile/run cards.

## Temporary fusion

- Pay each card's current energy cost to deploy to the field or the six-cell reserve.
- Third paid copy automatically fuses with two deployed copies. No spare cell needed to complete fusion.
- Fused unit remains at the oldest deployed field copy's current position; otherwise at the oldest reserve copy.
- One tier, one formation/trait slot. Original three cards remain individually identified, excluded from draw/discard while linked.
- Average each constituent's upgraded stats; multiply health, attack, defense and skill power by 1.75. Rate uses average attacks per second, not average intervals. No fusion increase to attack speed, movement, critical chance, range or trigger threshold.
- Fusion persists through rounds and JSON saves, expires between confrontations. Removing it returns all three cards to discard; energy refund is sum of floor(individual current cost / 2).
- Free field/reserve moves and swaps respect current round capacity. Reserve does not fight or contribute traits.
- Golden sprite outline in preparation/combat and reserve border; short convergence particles, white flash and expanding ring. Reduced motion respected.
- Sound: unmodified power_up_sound_v1_0.ogg by Spring Spring / Julie Damsgaard, CC0. Source: https://opengameart.org/content/power-up-sound-effects . Included at assets/fusion-spring-spring-v1.ogg with in-game attribution.

## Decks and AI

- Maximum four copies per character in run/custom decks, recruiting, shops and hacks.
- New borrowed decks: eight characters, first four core types ×3, next four ×2. Core types prioritize existing face portraits, then original roster order. Preview and collection unlocking use actual multiplicities.
- Enemy decks use the same distribution. AI pays all costs, stores units, fuses and rearranges the strongest paid formation.
- Existing saved runs keep their cards; existing deck access and collection are retained. Already deployed triples fuse on migration.

## Skills

Approved table is implemented in `Game.SKILL_TRIGGERS` for all 38 characters.

- Basic attack count, incoming impact count (basic or skill, including blocks), elapsed combat time, actual basic damage dealt to health/shields, plus Shaolin's fourth-basic block and Viking's health condition.
- Damage thresholds: starting round attack ×4 or ×4.5. Excludes own skill damage and overkill; simultaneous damage is proportionally attributed. Multiple basic area targets contribute damage, but one basic attack gives one attack-count increment.
- Continuous damage can explicitly opt out of impact counts via `dot`; no such damage assigned to current roster.
- Cavalier starts with full charge and recharges every six basics. Opening/repeated charge can be interrupted by control.
- Charges reset on skill activation. Time advances through stun; execution waits for action availability. New round restores initial charge.
- Hourglass: one random eligible ally gains 50% initial charge; integer attack/impact counts round down. Cavalier already starts full; passive conditions are ineligible.
- UI: segmented attack/impact bars, continuous time/damage bars, updated trigger labels and removal of outdated attack-count prefixes in skill descriptions.

## Verification

`node tests/systems-v18.cjs`: paid fusion, no free third card, bench/field/full capacity, refunds, upgraded means, single tier, save/reset, damage and shield accounting, stun/time, repeated Cavalier, Hourglass, all roster skills and AI simulations.
Browser preview: deck distribution, field/reserve movement and free costs, explicit isolated imported fusion scenario, golden outline, reloading save and combat rendering. Physical Android playtest and subjective sound mix remain user validation.
