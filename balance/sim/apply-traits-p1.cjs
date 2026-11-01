/* Builds the experimental trait proposal P1 (testing copy only). Usage: node balance/sim/apply-traits-p1.cjs <traits-v54.js> */
const fs = require('fs'), f = process.argv[2]; let s = fs.readFileSync(f, 'utf8');
const R = [["val(u,'Meowri',.75,1.5)", "val(u,'Meowri',.25,.5)", 1],
["val(a,'Legends of the East',.25,.4)", "val(a,'Legends of the East',.5,.8)", 1],
["val(u,'Arcane',.15,.25)", "val(u,'Arcane',.4,.6)", 1],
["val(u,'Fearless',.2,.4)", "val(u,'Fearless',.3,.5)", 1], ["u.hp/u.maxhp<.4?val(u,'Fearless'", "u.hp/u.maxhp<.5?val(u,'Fearless'", 1],
["rank(u,'Patient')&&b.time>=10", "rank(u,'Patient')&&b.time>=5", 1],
["val(a,'Dark Elf',.15,.25)", "val(a,'Dark Elf',.3,.45)", 1],
["val(a,'Orc',.04,.06)", "val(a,'Orc',.06,.09)", 1],
["val(a,'Troll',5,4)", "val(a,'Troll',3,2)", 2],
["val(t,'Goblin',.04,.06)", "val(t,'Goblin',.05,.08)", 1],
["val(u,'High Elf',.10,.15)", "val(u,'High Elf',.15,.22)", 1],
["case'Devastator':st.atk*=v?1.2:1.1", "case'Devastator':st.atk*=v?1.2:1.15", 1],
["case'Sentinel':st.defense*=v?1.8:1.4", "case'Sentinel':st.defense*=v?1.8:1.6", 1],
["case'Unyielding':st.hp*=v?1.3:1.15", "case'Unyielding':st.hp*=v?1.3:1.2", 1],
["st.crit+(v?.4:.2)", "st.crit+(v?.4:.25)", 1],
["case'Lookout':st.range*=v?1.2:1.1", "case'Lookout':st.range*=v?1.2:1.15", 1]];
for (const [a, b, n] of R) { const k = s.split(a).length - 1; if (k !== n) throw Error('match ' + k + ' ' + a); s = s.split(a).join(b); }
fs.writeFileSync(f, s); console.log('applied', R.length);
