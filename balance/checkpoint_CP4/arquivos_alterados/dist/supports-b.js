/* Balance P2 — Support model B (approved by Carlos Felipe Sylla). Load after traits-v54.js.
 * Each listed support becomes a passive aura unit:
 *  - every `every` seconds, heals OTHER allies within `radius` by `heal` x their max HP (the emitter is never affected by its own aura);
 *  - while alive, OTHER allies within `radius` receive the stat bonus `buff`,
 *    through the engine's own timed bonus system (keys: atk, haste, skill, speed, guard = damage reduction);
 *  - positioning: holds a point behind its frontline allies instead of walking toward enemies; still shoots enemies in range.
 * Auras from different emitters add up (approved by Carlos). Aura strength uses the emitter's BASE skill power (received buffs never feed auras). Healing uses Game.heal (healing modifiers apply). */
(function (root) {
  'use strict';
  const G = root.Game, T = root.JourneyTraits, Tree = root.JourneyTree;
  /* GJ-R3 identity (Carlos 06/11/2026): only Priestess, Flower Fairy, Elf Harpist and Shaman heal; the other six are pure
   * buff auras (heal 0: no heal pulse, no heal numbers, no "on heal" triggers, no heal text). One buff per support; the
   * Goblin King (a boss) keeps two. Values = version B (provisional, character lab 06/11): remaining buff raised to restore
   * each support's lab index (Bard, Snow Troll, Feline Arcanist, Feline Drummer); Sage = damage reduction (Carlos 07/11: skill-only could not be compensated). */
  const SPEC = { // calibrated with balance/sim/tune.cjs: lab index = cost/rarity target (approved model B)
    priestess: { radius: 120, every: 4, heal: .1111, buff: { guard: .17 } },
    elf_harpist: { radius: 120, every: 5, heal: .1087, buff: { haste: .23 } },
    flower_fairy: { radius: 120, every: 2, heal: .0556, buff: { skill: .35 } },
    snow_troll: { radius: 120, every: 2, heal: 0, buff: { guard: .42 } },
    shaman: { radius: 120, every: 3, heal: .0652, buff: { haste: .43 } },
    sage: { radius: 120, every: 3, heal: 0, buff: { guard: .45 } },
    feline_arcanist: { radius: 120, every: 3, heal: 0, buff: { haste: .35 } },
    bard: { radius: 120, every: 3, heal: 0, buff: { atk: .34 } },
    goblin_king: { radius: 120, every: 3, heal: 0, buff: { atk: .32, haste: .27 } },
    feline_drummer: { radius: 120, every: 3, heal: 0, buff: { haste: .46 } },
  };
  /* R3 healing (Carlos 08/11/2026): a pulse heals a % of the HEALER's own max HP (about 15 HP per pulse at level 0, ~5 HP/s),
   * at its own rhythm (Fairy 2 s, Shaman 3 s, Priestess 4 s, Harpist 5 s; option B), random factor 0.9-1.1 from the battle RNG.
   * Upgrades raise it through the healer's HP. */
  if (root.SUPPORT_B_SPEC) for (const [id, o] of Object.entries(root.SUPPORT_B_SPEC)) SPEC[id] = { ...SPEC[id], ...o }; // testing variants only
  // Upgrade/fusion growth is softened (half of the skill-power growth) to avoid runaway sustain.
  const growth = u => 1 + ((u.baseSkill ?? u.skill ?? 1) - 1) * .5; // base skill power: received buffs never feed auras
  const NAMES = { guard: ['less damage taken', 'menos dano recebido'], haste: ['attack speed', 'velocidade de ataque'], skill: ['skill power', 'poder de habilidade'],
    atk: ['damage', 'dano'], speed: ['movement', 'movimento'] };
  const pct = x => Math.round(x * 1000) / 10;
  for (const [id, sp] of Object.entries(SPEC)) {
    const u = G.BY[id]; if (!u) continue;
    u.kind = 'passive'; u.trigger = { kind: 'passive', limit: 0, startFull: false }; u.charge = 0;
    const buffEN = Object.entries(sp.buff).map(([k, x]) => (k === 'guard' ? pct(x) + '% ' : '+' + pct(x) + '% ') + NAMES[k][0]).join(' and ');
    const br = x => String(pct(x)).replace('.', ',');
    const buffPT = Object.entries(sp.buff).map(([k, x]) => k === 'guard' ? br(x) + '% menos dano recebido' : '+' + br(x) + '% de ' + NAMES[k][1]).join(' e ');
    const healEN = sp.heal > 0 ? ` Every ${sp.every}s heals other allies inside it for ${pct(sp.heal)}% of this unit's max HP (±10%).` : '', healPT = sp.heal > 0 ? ` A cada ${sp.every}s cura os outros aliados dentro dela em ${br(sp.heal)}% da vida máxima desta unidade (±10%).` : '';
    u.detail = `Passive aura (radius ${sp.radius}).${healEN} Other allies inside gain ${buffEN}. Does not affect itself; auras from different supports add up. Keeps behind the frontline. Upgrades and fusion raise the aura by half the usual growth.`;
    u.detailPT = `Aura passiva (raio ${sp.radius}).${healPT} Outros aliados dentro dela recebem ${buffPT}. Não afeta a si mesmo; auras de suportes diferentes se somam. Fica atrás da linha de frente. Upgrade e fusão aumentam a aura pela metade do crescimento normal.`;
  }
  const tune = u => (u.side === 0 && root.SUPPORT_B_TUNE && root.SUPPORT_B_TUNE[u.type]) || 1; // testing knob only
  const dist = (a, c) => Math.hypot(a.x - c.x, a.y - c.y);
  const beforeStep = T.beforeStep;
  T.beforeStep = function (b, dt) {
    beforeStep(b, dt);
    const living = b.units.filter(u => u.hp > 0);
    for (const s of living) {
      const sp = SPEC[s.type]; if (!sp || s.raidBoss) continue;
      const k = growth(s) * tune(s), allies = living.filter(v => v.side === s.side);
      const R3r = sp.radius * (root.JourneyRelicsR3?.auraScale?.(b, s.side) || 1); // R3: Amuleto Amplificador
      for (const v of allies) if (v !== s && dist(s, v) <= R3r) { const vals = {}; for (const [key, x] of Object.entries(sp.buff)) vals[key] = x * k; G.grant(v, 'supportB_' + s.uid, .2, vals); } // each aura is its own bonus: auras from different emitters add up; the emitter is not affected
      // Positioning: stay ~60 behind the frontline allies' centre unless an enemy is already in range.
      if (s.stun > 0 || s.motion) continue;
      const foes = living.filter(v => v.side !== s.side);
      const inRange = foes.some(v => dist(v, s) - (v.bodyRadius || 0) <= s.range + 1e-7);
      // R3 fix: a stationary leader (raid boss / True Boss form 2, speed 0) is not a frontline to hide behind; alone with it, the
      // support stands in FRONT of it (toward the opponent), always inside the field, so it can be reached.
      const others = allies.filter(v => v !== s && !SPEC[v.type] && !v.raidBoss && v.speed > 0), front = others.filter(v => v.range <= 62);
      const anchor = allies.find(v => v !== s && (v.raidBoss || !(v.speed > 0)));
      const ref = front.length ? front : others; if (!ref.length && !anchor) continue;
      let cx = ref.length ? ref.reduce((n, v) => n + v.x, 0) / ref.length : anchor.x, cy = ref.length ? ref.reduce((n, v) => n + v.y, 0) / ref.length + (s.side ? -60 : 60) : anchor.y + (s.side ? 70 : -70);
      cx = Math.max(40, Math.min(390, cx)); cy = Math.max(80, Math.min(470, cy));
      const d = Math.hypot(cx - s.x, cy - s.y);
      if (d > 25) { const step = Math.min(d, s.speed * dt); s.motion = { x: s.x + (cx - s.x) / d * step, y: s.y + (cy - s.y) / d * step, life: dt }; }
      else if (!inRange) s.motion = { x: s.x, y: s.y, life: dt }; // hold position instead of advancing
    }
  };
  // Heals join the same pending list as other heals (resolved together with damage). Hook on the tree module when present,
  // otherwise on the boss module (both run right before settlement in Game.step).
  const host = Tree && Tree.beforeSettle ? Tree : root.JourneyBosses;
  const settle = host.beforeSettle;
  host.beforeSettle = function (b, living, pending) {
    settle.call(host, b, living, pending);
    for (const s of living) {
      const sp = SPEC[s.type]; if (!sp || !(sp.heal > 0) || s.hp <= 0 || s.raidBoss) continue; // pure buff auras never heal
      const last = s.supportBLast ?? 0; if (b.time - last < sp.every) continue; s.supportBLast = b.time;
      const rnd = () => .9 + .2 * (typeof b.random === 'function' ? b.random() : Math.random()); // battle RNG keeps replays deterministic
      const R3h = sp.radius * (root.JourneyRelicsR3?.auraScale?.(b, s.side) || 1);
      for (const v of living) if (v !== s && v.side === s.side && v.hp > 0 && dist(s, v) <= R3h) G.heal(b, v, s.maxhp * sp.heal * tune(s) * rnd(), pending, s); // % of the HEALER's max HP; emitter does not heal itself
    }
  };
  root.JourneySupportB = { SPEC };
})(typeof globalThis !== 'undefined' ? globalThis : this);
