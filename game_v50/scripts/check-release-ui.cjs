const fs=require('node:fs'),assert=require('node:assert/strict'),cp=require('node:child_process');
assert(!fs.existsSync('dist/__qa.html'),'Remove the disposable QA page before packaging');
for(const name of ['menu-scroll','encounter-memory','playtest-p2-ui','playtest-p3-engine','playtest-p3-ui','enemy-inspect-ui']){assert(fs.readFileSync('dist/index.html','utf8').includes(name+'.js'));cp.execFileSync(process.execPath,['--check','dist/'+name+'.js']);}
for(const file of ['tests/menu-scroll.cjs','tests/encounter-memory.cjs','tests/playtest-p3.cjs','tests/portrait-alpha.cjs'])cp.execFileSync(process.execPath,[file],{stdio:'inherit'});
console.log('PASS release UI: production modules loaded, syntax valid, no disposable QA page, navigation and enemy memory regression checks passed.');
