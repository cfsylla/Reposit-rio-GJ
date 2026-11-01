require('../dist/game-0.js');require('../dist/training-engine.js');require('../dist/raid-engine.js');const G=Game,R=JourneyRaid;
const results=[];
for(const deck of ['vanguard','balanced','swift','arcane','fireline','fortress'])for(const level of [0,1])for(let seed=1;seed<=8;seed++){
 const cfg=Training.defaults();cfg.player=Training.side(deck);cfg.player.cards.forEach(c=>c.level=level);const s=R.build(cfg,seed);let final;
 for(let round=1;round<=5;round++){
  // Simple affordable-hand policy, supports fusion and fills reserve after the field.
  for(let pass=0;pass<4;pass++)for(const id of [...s.hand]){const card=G.card(s,id),unit=G.BY[card.type];let positions=unit.range>100?[10,14,11,13,12,5,9,6,8,7,0,4,1,3,2]:[0,4,1,3,2,5,9,6,8,7,10,14,11,13,12];let pos=positions.find(i=>!s.board[i]);if(s.board.filter(Boolean).length<G.maxUnits(s)&&pos!==undefined)G.deploy(s,id,pos);else{const i=s.bench.indexOf(null);if(i>=0)G.deploy(s,id,i,'bench');}}
  // Promote reserve survivors when capacity expands.
  for(let i=0;i<s.bench.length&&s.board.filter(Boolean).length<G.maxUnits(s);i++)if(s.bench[i]){const p=s.board.indexOf(null);G.transfer(s,'bench',i,'field',p);}
  const b=G.createBattle(s);if(!b)throw Error('No player');while(!b.result)G.step(b,1/30);G.finish(s,b.result);final={deck,level,seed,round,hp:Math.round(s.raid.hp),result:s.phase};if(s.phase!=='roundResult')break;G.nextRound(s);
 }results.push(final);
}
for(const deck of ['vanguard','balanced','swift','arcane','fireline','fortress'])for(const level of [0,1]){const rows=results.filter(r=>r.deck===deck&&r.level===level),wins=rows.filter(r=>r.result==='victory');console.log(JSON.stringify({deck,level,wins:wins.length,rounds:wins.map(r=>r.round),remaining:Math.round(rows.reduce((n,r)=>n+r.hp,0)/rows.length)}));}
