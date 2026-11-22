const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('dist/game-10.js','utf8'),start=source.indexOf('const MenuTourPages='),end=source.indexOf('function tutorialBeginMap()',start);
let actions=[];const ctx={$:()=>({querySelectorAll:()=>actions.map(act=>({matches:selector=>selector.replace(/["']/g,'')==='[data-act='+act+']'}))})};vm.createContext(ctx);vm.runInContext(source.slice(start,end),ctx);
const ids=()=>Array.from(ctx.menuTourPages(),p=>p[4].replace(/^\[data-act="|"\]$/g,''));
const first=['new','training-config','meta-custom','meta-collection','meta-shop','meta-milestones','meta-profile','tree-open'];
actions=first;assert.deepEqual(ids(),first,'first-run tour follows visible menu order');
actions=[...first,'cp2-advantages'];assert.deepEqual(ids(),actions,'only unlocked advantages appear');
actions=['continue',...first.slice(0,7),'pack-resume','tree-open','cp2-advantages'];assert.deepEqual(ids(),actions,'conditional menu entries follow their actual DOM position');
actions=['meta-profile','new','meta-collection','tree-open'];assert.deepEqual(ids(),actions,'future rearrangement does not require a second hardcoded sequence');
for(const page of ctx.menuTourPages()){assert(page.slice(0,4).every(t=>typeof t==='string'&&t.length),'all text present in EN and PT-BR');}
actions=[];assert.deepEqual(ids(),[],'no missing target spotlight');
console.log('PASS menu tour: visible DOM order, first-run and postgame, conditional continue/booster, reordered menus, EN/PT-BR and absent targets.');
