/* Builds a difficulty variant (testing copy) from the balanced copy.
 * Usage: node balance/sim/apply-difficulty.cjs <outDir> '<json>'
 * json: { curve:{steps:[[stage,n]...], eliteExtra, bossExtra}, gold:[g1,g2,g3] (by act) | null,
 *         upgrade:[c01,c12] | null, power:[p1,p2,p3] | null, scale:{start,per,max} | null, relicCap:[a1,a2,a3] | null } */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const [out, json] = process.argv.slice(2); const V = JSON.parse(json);
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
cp.execSync(`cp -r game/dist ${out}/dist && rm -f ${out}/dist/assets`);
const g0 = path.join(out, 'dist/game-0.js'), ae = path.join(out, 'dist/acts-engine.js');
const rep = (f, a, b) => { let s = fs.readFileSync(f, 'utf8'); if (s.split(a).length !== 2) throw Error('not unique: ' + a.slice(0, 50)); fs.writeFileSync(f, s.replace(a, b)); };
if (V.curve) cp.execSync(`node balance/sim/apply-curve.cjs ${g0} '${JSON.stringify({ l1: V.curve.steps, l2: [], eliteExtra: V.curve.eliteExtra, bossExtra: V.curve.bossExtra })}'`);
if (V.gold) rep(g0, 'function battleReward(stage){return stage<=3?10:stage<=6?12:14;}', `function battleReward(stage){return ${JSON.stringify(V.gold)}[Math.min(3,Math.ceil(stage/9))-1];}`);
if (V.upgrade) rep(g0, "kind==='upgrade'?(c&&c.level<2?(c.level===0?12:20):0)", `kind==='upgrade'?(c&&c.level<2?(c.level===0?${V.upgrade[0]}:${V.upgrade[1]}):0)`);
if (V.scale) rep(g0, 'let scale=(.86+Math.min(8,(root.JourneyActs?.localStage(s)||s.mapBattles||1)-1)*.02)', `let scale=(${V.scale.start}+Math.min(${V.scale.max},(root.JourneyActs?.localStage(s)||s.mapBattles||1)-1)*${V.scale.per})`);
if (V.power) { rep(ae, 'power:1.12', 'power:' + V.power[1]); rep(ae, 'power:1.25', 'power:' + V.power[2]); }
if (V.relicCap) rep(g0, 'count=Math.max(1,tests.filter(Boolean).length)', `count=Math.min(${JSON.stringify(V.relicCap)}[Math.min(3,Math.ceil((s.mapBattles||1)/9))-1],Math.max(1,tests.filter(Boolean).length))`);
if (V.bossLeader) fs.appendFileSync(path.join(out, 'dist/boss-engine.js'), '\n/* difficulty variant: team-boss leader (form 1) hp/atk multipliers */for(const id of Object.keys(globalThis.JourneyBosses.D)){const u=globalThis.Game.BY["boss_"+id];if(u){u.hp=Math.round(u.hp*' + V.bossLeader[0] + ');u.atk=Math.round(u.atk*' + V.bossLeader[1] + ');}}\n');
fs.writeFileSync(path.join(out, 'variant.json'), JSON.stringify(V, null, 1));
console.log('variant', out);
