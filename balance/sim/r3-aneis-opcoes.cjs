const log=console.log;console.log=()=>{};const {career,BASE}=require('./r3-ritmo-calc.cjs');console.log=log;
const D=global.JourneyTreeData;const ringOf=n=>n.depth<=1?0:n.depth<=3?1:n.depth<=5?2:3;
for(const F of [[1,2,3,4],[1,2,3.5,4.5],[1,2.5,3.5,4.5],[1,2.5,4,4.5],[1,3,4,4.5]]){const tf={basic:1,special:1.5,milestone:1.5};const cost=n=>Math.round(8*tf[n.type]*F[ringOf(n)]);
const c=career({...BASE,cost});const runOf=k=>c.out.findIndex(x=>x>=k)+1;const tab=F.map((f,i)=>[8*f,12*f].map(Math.round).join('/')).join('  ');
console.log(F.join('/'),'| custos (básico/especial) por anel:',tab,'| nós runs 1/2/5/9/13:',[1,2,5,9,13].map(r=>c.out[r-1]).join('/'),'| fecha anel 1/2/3:',[10,30,50].map(runOf).join('/'),'| completa run',c.full,'| total',c.total);}
