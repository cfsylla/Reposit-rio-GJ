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
  const SPEC = { // calibrated with balance/sim/tune.cjs: lab index = cost/rarity target (approved model B)
    priestess: { radius: 120, every: 2, heal: .068, buff: { guard: .17 } },
    elf_harpist: { radius: 120, every: 2, heal: .115, buff: { haste: .23 } },
    flower_fairy: { radius: 120, every: 2, heal: .11, buff: { skill: .35 } },
    snow_troll: { radius: 120, every: 2, heal: .07, buff: { guard: .28 } },
    shaman: { radius: 120, every: 2, heal: .056, buff: { haste: .43 } },
    sage: { radius: 120, every: 3, heal: .095, buff: { skill: .48, guard: .26 } },
    feline_arcanist: { radius: 120, every: 3, heal: .048, buff: { haste: .29 } },
    bard: { radius: 120, every: 3, heal: .022, buff: { atk: .26, skill: .22 } },
    goblin_king: { radius: 120, every: 3, heal: .04, buff: { atk: .32, haste: .27 } },
    feline_drummer: { radius: 120, every: 3, heal: .034, buff: { haste: .34, speed: .46 } },
  };
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
    u.detail = `Passive aura (radius ${sp.radius}). Every ${sp.every}s heals other allies inside it for ${pct(sp.heal)}% max HP. Other allies inside gain ${buffEN}. Does not affect itself; auras from different supports add up. Keeps behind the frontline. Upgrades and fusion raise the aura by half the usual growth.`;
    u.detailPT = `Aura passiva (raio ${sp.radius}). A cada ${sp.every}s cura os outros aliados dentro dela em ${br(sp.heal)}% da vida máxima. Outros aliados dentro dela recebem ${buffPT}. Não afeta a si mesmo; auras de suportes diferentes se somam. Fica atrás da linha de frente. Upgrade e fusão aumentam a aura pela metade do crescimento normal.`;
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
      for (const v of allies) if (v !== s && dist(s, v) <= sp.radius) { const vals = {}; for (const [key, x] of Object.entries(sp.buff)) vals[key] = x * k; G.grant(v, 'supportB_' + s.uid, .2, vals); } // each aura is its own bonus: auras from different emitters add up; the emitter is not affected
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
  // Heals join the same pending list as other heals (resolved together with damage). Hook on the tree module when present,
  // otherwise on the boss module (both run right before settlement in Game.step).
  const host = Tree && Tree.beforeSettle ? Tree : root.JourneyBosses;
  const settle = host.beforeSettle;
  host.beforeSettle = function (b, living, pending) {
    settle.call(host, b, living, pending);
    for (const s of living) {
      const sp = SPEC[s.type]; if (!sp || s.hp <= 0 || s.raidBoss) continue;
      const last = s.supportBLast ?? 0; if (b.time - last < sp.every) continue; s.supportBLast = b.time;
      const k = growth(s) * tune(s);
      for (const v of living) if (v !== s && v.side === s.side && v.hp > 0 && dist(s, v) <= sp.radius) G.heal(b, v, v.maxhp * sp.heal * k, pending, s); // emitter does not heal itself
    }
  };
  root.JourneySupportB = { SPEC };
})(typeof globalThis !== 'undefined' ? globalThis : this);
