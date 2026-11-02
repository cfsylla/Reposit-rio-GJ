/* Export-only convenience runner. Does not modify game sources or grant progression. */
const {spawnSync}=require('node:child_process');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const full=['game-0','balance-p1','decks-p3','training-engine','raid-engine','monster-engine','acts-engine','enemy-decks-p4','boss-engine','map-variety','tree-data','tree-engine','journey-debug','content-v53','traits-v54','supports-b'];
const boss=['game-0','balance-p1','decks-p3','training-engine','raid-engine','monster-engine','acts-engine','enemy-decks-p4','map-notes','boss-engine','traits-v54','supports-b'];
const pre=['-r','./dist/game-0.js','-r','./dist/balance-p1.js','-r','./dist/decks-p3.js'];
const jobs=[
 ['Balance P1/P2 (data, supports model B, new trait mechanics)',['tests/balance-p2.cjs']],
 ['Balance P3 (24 decks, unlocks, save migration)',['tests/decks-p3.cjs']],
 ['Balance P4 (difficulty curve, economy, bosses, enemy decks, relic rule, minion fix)',['tests/difficulty-p4.cjs']],
 ['Traits v54 (+P1/P2 values)',[...pre,'-e',full.map(f=>`require('./dist/${f}.js')`).join(';')+";require('./tests/traits-v54.cjs')"]],
 ['Events/curses/relics v53',[...pre,'tests/content-v53.cjs']],
 ['History/navigation/animation v52',[...pre,'tests/fixes-v52.cjs']],
 ['Tree with current v54 modules',['-e',full.map(f=>`require('./dist/${f}.js')`).join(';')+";require('./tests/tree-v51.cjs')"]],
 ['Boss mechanics with v54 traits (legacy victory flow, no tree session)',['-e',boss.map(f=>`require('./dist/${f}.js')`).join(';')+";require('./tests/bosses-v50.cjs')"]]
];
for(const [label,args]of jobs){console.log('\nCHECK: '+label);const r=spawnSync(process.execPath,args,{cwd:root,stdio:'inherit'});if(r.error)throw r.error;if(r.status!==0)process.exit(r.status||1);}
console.log('\nPASS: selected exported v54 mechanics checks. This is not a balance certification.');
