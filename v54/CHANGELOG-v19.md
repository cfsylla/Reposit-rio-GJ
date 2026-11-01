# Grand Journey v19 — Setup gestures, energy and results

- Pointer-based drag and drop from hand to field/reserve, and free moves/swaps between deployed positions. Existing tap-to-select and tap-to-position remain available.
- Movement beyond 10px begins dragging. Holding still for 450ms opens inspection. Pointer cancellation, lost focus and outside/invalid drops do not spend energy or change the roster; release suppresses the synthetic click. Native browser image dragging is disabled in preparation.
- Drop hints show valid/invalid cells; paid deployment and automatic fusion use the same production rules as tapping, including full-field completion and all energy checks.
- Base income: first round 5, then round number +2 (4,5,6,...). Unspent energy accumulates without a cap. Relic bonuses are additive, same rules for the AI. Existing saved balance is not retroactively recalculated.
- Explicit View deck / Ver deck button in setup opens the actual run cards; Card Cycle remains a separate control.
- Round/encounter score now appears above the four damage tables. Removed the repeated result slogan and health-damage explanation, plus the text below the round score. Final outcome navigation, run statistics and rewards remain.
- v19 saves accept prior supported versions and preserve v18 recovery keys, profile data, cards and fusion links.

Validation: `node tests/systems-v18.cjs`, `node tests/setup-v19.cjs`, JavaScript syntax and asset reference checks. Browser QA: View deck, real mouse drag hand→field and field→reserve, tap reserve→field, result order. Physical Android touch remains user playtest.
