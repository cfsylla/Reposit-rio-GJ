/* Static unit table (no simulation): raw sheet numbers at level 0.
 * dps = atk / interval * (1 + crit*0.5)   (basic attacks only, single target, before defense)
 * ehp = hp * (1 + def/100)                (defense formula 100/(100+DEF))
 * Usage: node balance/sim/static-units.cjs > file.csv */
'use strict';
const { G } = require('./engine.cjs');
const R = ['Comum', 'Incomum', 'Rara', 'Ultra rara'];
console.log('id,name,cost,rarity,faction,attribute,temperament,hp,atk,def,interval,move,crit,range,area,dps,ehp,dps_per_cost,ehp_per_cost,trigger,limit,first_skill_s_est');
for (const u of G.UNITS) {
  const dps = u.atk / u.rate * (1 + u.crit * .5), ehp = u.hp * (1 + u.defense / 100);
  const t = u.trigger, first = t.kind === 'attacks' ? t.limit * u.rate : t.kind === 'time' ? t.limit : '';
  console.log([u.id, u.name, u.cost, R[u.rarity], ...u.traits, u.hp, u.atk, u.defense, u.rate.toFixed(2), u.speed, Math.round(u.crit * 100) + '%', u.range, u.area,
    dps.toFixed(1), ehp.toFixed(0), (dps / u.cost).toFixed(1), (ehp / u.cost).toFixed(0), t.kind, t.limit, typeof first === 'number' ? first.toFixed(1) : ''].join(','));
}
