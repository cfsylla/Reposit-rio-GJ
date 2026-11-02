/* Enemy upgrade curve prototypes (testing copies only).
 * Usage: node balance/sim/apply-curve.cjs <dist/game-0.js> <curveJSON>
 * curveJSON: { l1: [[stage, count],...], l2: [[stage, count],...], eliteExtra: n, bossExtra: n }
 *  - normal enemies: the first L2(stage) cards are level 2, the next L1(stage) cards level 1 (cards ordered by deck type order);
 *  - elites: same curve + eliteExtra more upgrade steps (prefer boosted types), so elites are never weaker than normals;
 *  - bosses: same curve + bossExtra. Stage = global encounter count (s.mapBattles), as today. */
'use strict';
const fs = require('fs'); const [f, json] = process.argv.slice(2); let s = fs.readFileSync(f, 'utf8');
const C = JSON.parse(json);
const old = "level:elite&&!boss?(stage>=4&&boostedTypes.includes(type)?1:0):stage>=9?(i<2?2:1):stage>=7?1:stage>=4&&i<4?1:0})));";
if (!s.includes(old)) throw Error('makeAI level expression not found');
s = s.replace(old, "level:0})));{const C=" + JSON.stringify(C) + ",at=t=>t.reduce((n,[st,c])=>stage>=st?c:n,0);let up=at(C.l1)+at(C.l2)*2+(elite&&!boss?C.eliteExtra||0:0)+(boss?(x=>Array.isArray(x)?x[Math.min(3,Math.ceil(stage/9))-1]:x||0)(bossDeck&&C.teamBossExtra!==undefined?C.teamBossExtra:C.bossExtra)+(C.perBoss?.[s.current?.bossId]||0):0);" +
  "const order=[...cards].sort((a,b)=>(boostedTypes.includes(b.type)-boostedTypes.includes(a.type))||0);" +
  "for(const pass of [1,2])for(const c of order){if(up<=0)break;if(c.level===pass-1&&(pass===1||up>0)){c.level=pass;up--;}}}");
fs.writeFileSync(f, s); console.log('curve applied', JSON.stringify(C));
