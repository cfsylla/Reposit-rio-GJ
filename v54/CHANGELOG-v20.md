# Grand Journey v20 — Optional hand freeze

- Free freeze toggle in preparation and battle. Remaining cards are retained for the next round; only empty hand capacity is drawn, up to four cards.
- Freeze clears after the next preparation. Unfrozen cards follow the existing discard cycle. New confrontations reset the toggle.
- Blue frost outline and snowflake mark frozen cards. Combat shows a read-only hand with the toggle; updating it does not restart combat.
- Save schema v20 retains earlier supported saves and v19 recovery keys. Drag origin behavior is unchanged.

Validation: systems-v18, setup-v19, drag-origin-v19-1 and freeze-v20 test suites; JavaScript syntax checks. Browser QA verifies setup toggle, visual state and battle toggle.
