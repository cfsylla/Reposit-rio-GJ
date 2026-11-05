const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const frames=[],events={};let roots=[];
function node(cls,top=0,left=0){return {id:'',tagName:'DIV',className:cls,classList:cls.split(' '),scrollHeight:1200,clientHeight:300,scrollWidth:600,clientWidth:300,scrollTop:top,scrollLeft:left};}
function panel(title,top=0,left=0){const content=node('journey-panel-content',top,left),r=node('modal');r.querySelector=s=>s==='h2'?{textContent:title}:null;r.querySelectorAll=s=>s==='*'||s==='div'?[content]:[];return r;}
const ctx={S:null,JourneyActs:{act:()=>1},document:{querySelectorAll:()=>roots},window:{addEventListener:(n,f)=>events[n]=f},requestAnimationFrame:f=>frames.push(f),show:()=>{},openModal:title=>roots=[panel(title)],closeModal:()=>{roots=[];}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/menu-scroll.js','utf8'),ctx);const tick=()=>{while(frames.length)frames.shift()();};
ctx.openModal('Advantages');tick();let c=roots[0].querySelectorAll('*')[0];c.scrollTop=720;c.scrollLeft=110;events.click();ctx.openModal('Advantages');tick();c=roots[0].querySelectorAll('*')[0];assert.equal(c.scrollTop,720);assert.equal(c.scrollLeft,110);
ctx.openModal('Trait');tick();assert.equal(roots[0].querySelectorAll('*')[0].scrollTop,0);ctx.openModal('Advantages');tick();assert.equal(roots[0].querySelectorAll('*')[0].scrollTop,720);
// A new unnamed menu uses the shared path without a per-menu whitelist.
ctx.openModal('A future menu');tick();roots[0].querySelectorAll('*')[0].scrollTop=455;ctx.openModal('A future menu');tick();assert.equal(roots[0].querySelectorAll('*')[0].scrollTop,455);
ctx.S={seed:12,current:{id:'new'}};ctx.openModal('Advantages');tick();assert.equal(roots[0].querySelectorAll('*')[0].scrollTop,0,'separate run context');
ctx.openModal('Intentional tutorial scroll');tick();events.pointerdown();roots[0].querySelectorAll('*')[0].scrollTop=640;ctx.JourneyMenuScroll.capture(true);tick();assert.equal(roots[0].querySelectorAll('*')[0].scrollTop,640,'intentional tutorial scrolling is accepted during the click transaction');
ctx.JourneyMenuScroll.reset();assert.equal(ctx.JourneyMenuScroll.audit().length,1);
console.log('PASS shared scroll continuity: both axes across rebuild, nested return, automatic future menus, separate run contexts. Browser checks cover real layout/clamping and focus.');
