// Verified regression set; these checks are not a balance certification.
'use strict';const {spawnSync}=require('node:child_process'),path=require('node:path');
const root=path.resolve(__dirname,'..');
for(const name of ['cards-r3','physical-vfx','ranger-trap-v63','skill-target-r3','progression-v56','playtest-save','menu-scroll','menu-tour','playtest-p3']){
 const r=spawnSync(process.execPath,['tests/'+name+'.cjs'],{cwd:root,stdio:'inherit'});if(r.error)throw r.error;if(r.status!==0)process.exit(r.status||1);
}console.log('PASS selected v65 regressions; run new campaigns for endgame balance.');
