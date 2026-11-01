/* Fearless crit variants (testing copies). Usage: node apply-fearless-crit.cjs <traits-v54.js> <variant V1|V2|V3>
 * Removes the P2 damage version and makes every Nth basic a guaranteed critical hit (exception to the 75% cap). */
'use strict';
const fs = require('fs'), [f, variant] = process.argv.slice(2); let s = fs.readFileSync(f, 'utf8');
const dmg = s.match(/if\(rank\(a,'Fearless'\)\)bonus\+=val\(a,'Fearless',[^;]*;/); if (!dmg) throw Error('P2 Fearless damage not found'); s = s.replace(dmg[0], '');
const every = { V4: "(u.hp/u.maxhp<.4?1:val(u,'Fearless',3,2))", V1: "val(u,'Fearless',4,3)", V2: "val(u,'Fearless',3,2)", V3: "(u.hp/u.maxhp<.4?2:val(u,'Fearless',4,3))" }[variant];
const a = 'function crit(b,u,n){return Math.min(.75,n);}'; if (!s.includes(a)) throw Error('crit() not found');
s = s.replace(a, `function crit(b,u,n){if(rank(u,'Fearless')&&(u.hits||0)>0&&u.hits%${every}===0)return 1;return Math.min(.75,n);}`);
fs.writeFileSync(f, s); console.log('Fearless', variant, every);
