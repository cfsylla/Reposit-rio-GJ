/* PROTOTYPE — Support model B (approved direction, values under test). Load after traits-v54.js.
 * Each listed support becomes a passive aura unit:
 *  - every `every` seconds, heals allies within `radius` (including itself at half value) by `heal` x their max HP x skill power;
 *  - while alive, allies within `radius` (including itself) receive the stat bonus `buff` (scaled by skill power),
 *    through the engine's own timed bonus system (keys: atk, haste, skill, speed, guard = damage reduction);
 *  - positioning: holds a point behind its frontline allies instead of walking toward enemies; still shoots enemies in range.
 * Auras never stack per stat: for each stat, only the strongest support aura applies. Aura strength uses base skill power. Healing uses Game.heal (healing modifiers apply). */
(function (root) {
  'use strict';
  const G = root.Game, T = root.JourneyTraits, Tree = root.JourneyTree;
  const SPEC = { // values calibrated with balance/sim/tune.cjs (lab index = cost/rarity target)
    priestess: { radius: 120, every: 2, heal: .063, buff: { guard: .16 } },
    elf_harpist: { radius: 120, every: 2, heal: .115, buff: { haste: .23 } },
    flower_fairy: { radius: 120, every: 2, heal: .09, buff: { skill: .28 } },
    snow_troll: { radius: 120, every: 2, heal: .062, buff: { guard: .25 } },
    shaman: { radius: 120, every: 2, heal: .045, buff: { haste: .34 } },
    sage: { radius: 120, every: 3, heal: .08, buff: { skill: .40, guard: .22 } },
    feline_arcanist: { radius: 120, every: 3, heal: .048, buff: { haste: .29 } },
    bard: { radius: 120, every: 3, heal: .02, buff: { atk: .24, skill: .20 } },
    goblin_king: { radius: 120, every: 3, heal: .04, buff: { atk: .32, haste: .27 } },
    feline_drummer: { radius: 120, every: 3, heal: .032, buff: { haste: .32, speed: .43 } },
  };
  // Upgrade/fusion growth is softened (half of the skill-power growth) to avoid runaway sustain.
  const growth = u => 1 + ((u.baseSkill ?? u.skill ?? 1) - 1) * .5; // base skill power: received buffs never feed auras
  for (const id of Object.keys(SPEC)) if (G.BY[id]) G.BY[id].kind = 'passive';
  const tune = u => (u.side === 0 && root.SUPPORT_B_TUNE && root.SUPPORT_B_TUNE[u.type]) || 1; // testing knob only
  const dist = (a, c) => Math.hypot(a.x - c.x, a.y - c.y);
  const beforeStep = T.beforeStep;
  T.beforeStep = function (b, dt) {
    beforeStep(b, dt);
    const living = b.units.filter(u => u.hp > 0);
    for (const s of living) {
      const sp = SPEC[s.type]; if (!sp || s.raidBoss) continue;
      const k = growth(s) * tune(s), allies = living.filter(v => v.side === s.side);
      for (const v of allies) if (dist(s, v) <= sp.radius) { const vals = {}; for (const [key, x] of Object.entries(sp.buff)) vals[key] = x * k; for (const [key, x] of Object.entries(vals)) G.grant(v, 'supportB_' + key, .2, { [key]: x }); } // same stat from different supports: strongest only
      // Positioning: stay ~60 behind the frontline allies' centre unless an enemy is already in range.
      if (s.stun > 0 || s.motion) continue;
      const foes = living.filter(v => v.side !== s.side);
      const inRange = foes.some(v => dist(v, s) - (v.bodyRadius || 0) <= s.range + 1e-7);
      const others = allies.filter(v => v !== s && !SPEC[v.type]), front = others.filter(v => v.range <= 62);
      const ref = front.length ? front : others; if (!ref.length) continue;
      const cx = ref.reduce((n, v) => n + v.x, 0) / ref.length, cy = ref.reduce((n, v) => n + v.y, 0) / ref.length + (s.side ? -60 : 60);
      const d = Math.hypot(cx - s.x, cy - s.y);
      if (d > 25) { const step = Math.min(d, s.speed * dt); s.motion = { x: s.x + (cx - s.x) / d * step, y: s.y + (cy - s.y) / d * step, life: dt }; }
      else if (!inRange) s.motion = { x: s.x, y: s.y, life: dt }; // hold position instead of advancing
    }
  };
  const settle = Tree.beforeSettle;
  Tree.beforeSettle = function (b, living, pending) {
    settle(b, living, pending);
    for (const s of living) {
      const sp = SPEC[s.type]; if (!sp || s.hp <= 0 || s.raidBoss) continue;
      const last = s.supportBLast ?? 0; if (b.time - last < sp.every) continue; s.supportBLast = b.time;
      const k = growth(s) * tune(s);
      for (const v of living) if (v.side === s.side && v.hp > 0 && dist(s, v) <= sp.radius) G.heal(b, v, v.maxhp * sp.heal * k * (v === s ? .5 : 1), pending, s);
    }
  };
  root.JourneySupportB = { SPEC };
})(typeof globalThis !== 'undefined' ? globalThis : this);
