# Approved physical VFX integration — v65

Includes all ten approved animations and the saved R3 card revision (v64): 24 rarity changes and 17 collectible hero profiles. Boss balance and combat mechanics remain unchanged.

## Assets and users

Own Grand Journey art recovered from the exact Library approvals in the effects document, sections 7.5–7.23. Original RGBA bytes are retained under `dist/assets/vfx/grand-journey/`. `SOURCES.json` records Library identity and original SHA-256. Historical third-party assets and credits remain separate.

| Clip | Approved file | Users / event |
| --- | --- | --- |
| A01 basic descending | gj_fx_a01_corte_basico_v002.png | Ordinary blade attacks |
| A02 heavy | gj_fx_a02_corte_pesado_v001.png | Heavy blade attacks and blade skills |
| A02 circular | gj_fx_a02_circular_v001.png | Warrior skill, one sweep per actual multi-target cast |
| A03 thrust | gj_fx_a03_estocada_v001.png | Lancer, Cavalier, spear/halberd users; aligned to actual target |
| A04 light impact | gj_fx_a04_impacto_leve_v001.png | Unarmed basic attacks |
| A05 heavy impact | gj_fx_a05_impacto_pesado_v001.png | Unarmed skills and blunt weapons, distinct from blades |
| A06 ground impact | gj_fx_a06_impacto_chao_v001.png | Troll, Pirate Admiral, Eagle Druid skyfall damage and collectible slam skills |
| A07 critical | gj_fx_a07_critico_v001.png | Actual critical hits, at the damage event; complements base effect |
| A08 crossed | gj_fx_a08_cruzado_v001.png | OmnaMusha: frames 1–4 on first actual hit, frames 5–8 on conditional second hit |
| A08 combo2 | gj_fx_a08_combo2_v001.png | Berserker: one two-trail visual for its simultaneous two-hit skill |

The triple-blade concept remains pending. Fighter keeps physical impacts; blade combos are not applied to unarmed characters. Projectile/magic families retain their current visuals, apart from the new accent on actual critical hits.

## Timing and integration adaptations

- Combat clock drives all clips, including pauses and 1/1.5/2/3x speed. Approved unequal per-frame durations are retained; no uniform-FPS approximation.
- The existing engine emits these effects on the damage event, with no pre-contact wind-up callback. For A01–A07, playback therefore begins on the approved contact frame (frame 3), followed by its original dissipation. The first two pre-contact frames remain in the original atlases and are not guessed or delayed into the actual damage event. No simulation event is postponed to accommodate art.
- A08 combo2 plays all six frames from the actual simultaneous hit event. A08 crossed plays two four-frame segments at their independent actual positions; no second visual is shown when the second hit is omitted.
- Thrust contact offset (77,48) is compensated relative to its (48,48) anchor; raid target visual scaling also scales this offset.
- Circular/ground effects are consolidated per source and simulation time. All actual damage events still execute separately. Critical overlays do not add damage.
- All ten PNGs are byte-identical to the approved originals; renderer uses nearest-neighbor scaling. Blade silhouettes may be mirrored for facing, ground perspective is retained.

## Verification

`physical-vfx.cjs` checks all atlas dimensions, unequal frame durations, mapping, single sweep/combo display, conditional crossed second hit, actual critical events, renderer nonmutation and identical gameplay unit state/results with hooks enabled/disabled at all four speeds. `cards-r3`, `skill-target-r3`, `ranger-trap-v63`, `progression-v56`, `playtest-save`, `menu-scroll`, `menu-tour`, `playtest-p3` passed. PNGs have RGBA transparency and distinct frames.

Browser QA: ten-clip gallery on light/dark backgrounds; real battle with six allies at round 4, at 360×640 (EN) and 430×768 (PT-BR), visible footer controls and multiple effects at contact. Speeds exercised in gallery/field; deterministic rendering and engine checks cover all four speeds. Temporary QA routes are removed from the publication archive.
