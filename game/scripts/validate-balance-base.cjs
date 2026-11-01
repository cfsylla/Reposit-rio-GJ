/* Export-only convenience runner. Does not modify game sources or grant progression. */
const {spawnSync}=require('node:child_process');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const full=['game-0','training-engine','raid-engine','monster-engine','acts-engine','boss-engine','map-variety','tree-data','tree-engine','journey-debug','content-v53','traits-v54'];
const boss=['game-0','training-engine','raid-engine','monster-engine','acts-engine','map-notes','boss-engine','traits-v54'];
const jobs=[
 ['Traits v54',['tests/traits-v54.cjs']],
 ['Events/curses/relics v53',['tests/content-v53.cjs']],
 ['History/navigation/animation v52',['tests/fixes-v52.cjs']],
 ['Tree with current v54 modules',['-e',full.map(f=>`require('./dist/${f}.js')`).join(';')+";require('./tests/tree-v51.cjs')"]],
 ['Boss mechanics with v54 traits (legacy victory flow, no tree session)',['-e',boss.map(f=>`require('./dist/${f}.js')`).join(';')+";require('./tests/bosses-v50.cjs')"]]
];
for(const [label,args]of jobs){console.log('\nCHECK: '+label);const r=spawnSync(process.execPath,args,{cwd:root,stdio:'inherit'});if(r.error)throw r.error;if(r.status!==0)process.exit(r.status||1);}
console.log('\nPASS: selected exported v54 mechanics checks. This is not a balance certification.');
