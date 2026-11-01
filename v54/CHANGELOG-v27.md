# v27 — Warrior animation experiment

Warrior alone uses 16 generated, articulated frames: 4 idle, 4 walk/run, 4 attack, 4 hurt. Reference identity, transparent background, constant scale and fixed feet anchor.

Idle runs in preparation and combat; movement follows actual displacement; basic attack and skill-cast counters trigger attack; effective health damage triggers recoil. Controller state is presentation-only, per-unit and separate from the combat state/save. Both sides and fused Warriors use the same atlas. Pause freezes the selected frame; ×1/×2/×3 follow simulation time; reduced-motion preference selects a static frame. Failed atlas loading retains the original sprite.

No combat-engine changes, stat/balance changes, new abilities, save schema changes or audience changes. Existing Warrior anime portraits/cards and every other character remain unchanged.

Still pending and not included: remove red Blackfang node backing; Relic Bag drag/drop and empty-origin-cell placement; distinct Card Cycle icon; investigate intermittently missing active traits.

Validation: animation controller transitions and isolation; alpha/atlas bounds; existing Blackfang and tutorial regression checks; browser visual QA of preparation, movement, fighting, damage and pause. Android-specific validation remains pending.
