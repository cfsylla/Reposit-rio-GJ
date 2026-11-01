/* Builds the 7 approved trait mechanic prototypes on top of the balanced copy (testing copy only).
 * Usage: node balance/sim/apply-mech.cjs <dist/traits-v54.js> [valuesJSON]
 * valuesJSON may override the tier values, e.g. {"legends":[.35,.6]} for tuning. */
'use strict';
const fs = require('fs'), f = process.argv[2]; let s = fs.readFileSync(f, 'utf8');
const V = Object.assign({ legends: [.35, .6], goblin: [.04, .07], trail: [.3, .5], trailMove: [1.15, 1.25], protector: [.05, .10], patientDef: [.08, .15], patientAtk: [.04, .08], fearless: [.08, .15], arcane: [.15, .30] }, JSON.parse(process.argv[3] || '{}'));
const v = (k, unit = 'a', name) => V[k] === null ? '0' : `val(${unit},'${name}',${V[k][0]},${V[k][1]})`;
const R = [
  // damage(): new bonuses (Legends, Goblin, Trailblazer, Patient, Fearless)
  ["const down=st.atkDownUntil>b.time?.15:0;n*=1+bonus;",
   `if(!skill&&rank(a,'Legends of the East')&&a.hits%4===0)bonus+=${v('legends', 'a', 'Legends of the East')};` +
   `if(rank(a,'Goblin')){const gs=new Set(members(b,a).filter(u=>u!==a&&u.hp>0&&u.type!==a.type&&rank(u,'Goblin')).map(u=>u.type));bonus+=Math.min(3,gs.size)*${v('goblin', 'a', 'Goblin')};}` +
   `if(!skill&&rank(a,'Trailblazer')){const p=st.trail,moved=!p||Math.hypot(a.x-p.x,a.y-p.y)>=30;if(moved&&b.time>=(st.trailReady||0)){bonus+=${v('trail', 'a', 'Trailblazer')};st.trailReady=b.time+4;}st.trail={x:a.x,y:a.y};}` +
   `if(rank(a,'Patient'))bonus+=Math.min(3,Math.floor(b.time/3))*${v('patientAtk', 'a', 'Patient')};` +
   `if(rank(a,'Fearless'))bonus+=${v('fearless', 'a', 'Fearless')}*(a.hp/a.maxhp<.4?2:1);` +
   "const down=st.atkDownUntil>b.time?.15:0;n*=1+bonus;"],
  // Goblin: old proximity damage reduction removed; Protector aura added (strongest nearby protector, no stacking)
  ["function reduction(b,t,n){let g=0;if(rank(t,'Goblin')){const set=new Set(members(b,t).filter(u=>u!==t&&u.type!==t.type&&rank(u,'Goblin')&&dist(u,t)<=100).map(u=>u.type));g=Math.min(3,set.size)*val(t,'Goblin',.04,.06);}",
   `function reduction(b,t,n){let g=0;{const pr=live(b).filter(u=>u.side===t.side&&rank(u,'Protector')&&dist(u,t)<=90);if(pr.length)g=Math.max(...pr.map(u=>${v('protector', 'u', 'Protector')}));}`],
  // Patient: stacking DEF every 3s (max 3) instead of DEF after 10s
  ["n*(rank(u,'Patient')&&b.time>=10?val(u,'Patient',1.4,1.8):1)", `n*(rank(u,'Patient')?1+Math.min(3,Math.floor(b.time/3))*${v('patientDef', 'u', 'Patient')}:1)`],
  // Fearless: crit part removed (now a damage bonus)
  ["return Math.min(.75,n+(u.hp/u.maxhp<.4?val(u,'Fearless',.2,.4):0));", "return Math.min(.75,n);"],
  // Protector: old low-HP taunt removed
  ["if(rank(u,'Protector')&&!st.protected){", "if(false&&rank(u,'Protector')&&!st.protected){"],
  // Trailblazer: smaller movement bonus
  ["case'Trailblazer':st.speed*=v?1.5:1.25;", `case'Trailblazer':st.speed*=v?${V.trailMove[1]}:${V.trailMove[0]};`],
  // Arcane alternative: permanent skill power for members; old relay disabled
  ["st.area=G.BY[c.type].area||0;if(!k)return st;", `st.area=G.BY[c.type].area||0;{const ar=tier(n,'Arcane');if(ar&&G.BY[c.type].traits.includes('Arcane'))st.skill*=1+(ar===2?${(V.arcane||[0,0])[1]}:${(V.arcane||[0,0])[0]});}if(!k)return st;`],
  ["bonus:val(u,'Arcane',.4,.6)}", "bonus:0}"],
];
// Arcane alternative is excluded when V.arcane === null (approved decision: keep the numeric relay 40/60%).
if (V.arcane === null) R.splice(R.length - 2, 2);
for (const [a, b] of R) { const k = s.split(a).length - 1; if (k !== 1) throw Error('match ' + k + ': ' + a.slice(0, 60)); s = s.replace(a, b); }
fs.writeFileSync(f, s); console.log('mechanics applied', R.length, JSON.stringify(V));
