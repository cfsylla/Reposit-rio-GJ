# Grand Journey v23 — Interactive first encounter

New profiles start with only the Vanguard borrowed deck. The First Steps milestone unlocks Balanced and Swift after completing the lesson or winning the first encounter after skipping. Existing profiles retain their unlocks and receive migration credit; collection ownership is unchanged.

The first Vanguard encounter has a fixed opening hand and a fixed Warrior opponent. The guide teaches card selection, placement, traits, energy/field limits, automatic combat, skill charge, speed, second-round income, paid reserve, free transfer and hand freeze. It advances from actual game actions, guards unrelated clicks and invalid lesson drag destinations, and always offers Skip. Selection-only steps safely reselect after reload. A contextual fusion explanation appears when a third paid copy is available.

How to Play includes Replay tutorial outside live combat. Replay keeps the original run as a serialized return state, awards no encounter stats/diamonds/losses, and restores the original run on completion or skip. Completing the replay may satisfy First Steps if still locked; milestones and deck unlocks are idempotent.

Coach text is bilingual, highlights the real controls without replacing draggable elements, and positions itself away from the current target. Updated stale help text for preparation-only hand freezing and unchanged upgrade energy cost.

Validation: tutorial-v23 and tutorial-guard-v23 cover actual game actions through round 2, fixed draws/opponent, conservation, milestone/skip paths, starter purchase gate, legacy migration, mid-lesson reload, replay isolation, click/drag restrictions and navigation. Existing system/setup/drag/freeze/traits/cost/Boss/VFX/combat replay checks pass. Browser QA completed the replay from How to Play through combat, reserve, freeze and return, checked irrelevant-click blocking, reload/resume and Skip returning the original R3 formation. No application console errors. Physical Android touch layout remains user playtest.

The save/state versions remain compatible: optional tutorial fields live in the run and onboarding fields in the profile. No profile reset or removal of existing unlocks.
