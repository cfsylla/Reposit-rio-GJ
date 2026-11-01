# v54 validation — 2026-11-01

Scope: faction/attribute/temperament traits for 77 playable characters, individual self-heal/protection nerfs, collection horizontal filter preservation. Existing source v53 was opened from the published branch before editing.

## Automated checks

- `node tests/traits-v54.cjs`: 77 assignments, 29 definitions, all seven attribute types at both thresholds, faction and temperament conditions, unique-type counts, Centaur retreat/interrupt/next-basic behavior, self-vs-ally healing, shields, health-only received charge, protective cooldown, Shaolin blocking frequency, 30 real combat simulations, no non-finite unit stats.
- Same suite verifies enemy leader identities contain no removed traits, null-battle snapshots, deterministic active raid replay, and Meowri immunity against direct environmental pending damage.
- `tests/tree-v51.cjs`, preloaded with content-v53 and traits-v54: 3,000 maps, reachable order pairs, three-act/final-boss XP lifecycle, permanent purchases, same-run branch switching and deterministic active raid restore with all tree bonuses.
- `tests/bosses-v50.cjs`, preloaded with traits-v54 (without tree-engine, because this legacy suite expects immediate final victory): all 11 boss definitions, four second-form transitions, live skills, capped formations, deterministic snapshots, persistent boss HP and one-time rewards.
- `node tests/content-v53.cjs`: all 22 events, both offers across 20 seeds, success/failure exclusivity, quest across maps, Mirror/Caravan, four curses, five new relics and transactions.
- `node tests/fixes-v52.cjs`: cumulative/legacy order history and debug navigation without fabricated rewards, real raid attack animation paths.
- `git diff --check`: clean.

## Browser QA

Managed local preview; disposable authored fixtures removed before packaging. Actual UI controls were clicked.

- Collection bar moved to scrollLeft=500; clicking Blackfang preserved scrollLeft=500.
- Orc detail showed 7.5% self-shield for 2.5 seconds, six-second minimum interval, health-only charge. Trait detail used the game dialog and returned to the character sheet.
- Preparation checked at 320×640 and 430×800: html scroll dimensions equal viewport; Fight footer inside viewport (bottom632.5/792.5).
- 360×740 live Hydra round4: all three trait-category buttons, boss HP, speed and pause controls present; no page overflow; no application console errors observed.
- Temperament category opens bounded scrolling list with fixed opaque Back footer; active Protector count matches three distinct types.

Screenshots: `tests/evidence-traits-v54.jpg`, `tests/evidence-combat-v54.jpg`. Tests are not a complete economy/balance study, nor a physical Android test. Trait percentages and skill nerfs remain playtest parameters.
