(function(root){'use strict';
function active(s){return s?.tutorial?.mode==='guided'&&!!s.tutorial.initialized;}
function reconcile(s,selection){if(!active(s))return null;const t=s.tutorial,has=(list,id)=>!!id&&list.includes(id);let step=t.step;
 if(s.phase==='prep'&&s.round===1&&['combat','speed','watch'].includes(step))step='fight';
 if(['select-warrior','place-warrior'].includes(step)){if(has(s.board,t.warrior))step='traits';else if(t.warrior&&selection?.uid===t.warrior)step='place-warrior';else step='select-warrior';}
 if(['select-lancer','place-lancer'].includes(step)){if(has(s.board,t.lancer))step='energy';else if(t.lancer&&selection?.uid===t.lancer)step='place-lancer';else step='select-lancer';}
 if(step==='fight'&&s.phase==='battle')step='combat';
 if(['combat','speed','watch'].includes(step)&&s.phase==='roundResult')step='result';
 if(step==='result'&&s.phase==='prep'&&s.round>=2)step='select-reserve';
 if(['select-reserve','place-reserve','select-bench','transfer'].includes(step)){
  t.reserve??=s.hand.find(id=>root.Game.card(s,id)?.type==='fighter');
  if(has(s.board,t.reserve)&&t.dragged)step='remove-select';else if(has(s.board,t.reserve))step='drag-again';else if(has(s.bench,t.reserve)){if(selection?.kind==='bench'&&s.bench[selection.pos]===t.reserve)step='transfer';else step='select-bench';}
  else if(t.reserve&&selection?.uid===t.reserve)step='place-reserve';else step='select-reserve';
 }
 if(step==='freeze'&&s.handFrozen)step='fight2';
 if(step==='fight2'&&s.phase==='battle')step='watch2';
 if(step==='watch2'&&s.phase==='prep')step='fight2';
 if(step==='watch2'&&s.phase==='roundResult')step='result2';
 if(step==='result2'&&s.phase==='prep'&&s.round>=3)step='fusion';
 if(step==='fusion'&&s.fusions?.[t.warrior]?.length===3)step='fusion-done';
 if(step==='fight3'&&s.phase==='battle')step='watch3';
 if(step==='watch3'&&s.phase==='prep')step='fight3';
 if(step==='watch3'&&s.phase==='roundResult')step='result3';
 if(step==='result3'&&s.phase==='prep')step='fight3';
 if(step==='drag-again'&&t.dragged)step='remove-select';
 if(step==='remove-select'&&selection?.kind==='field'&&s.board[selection.pos]===t.reserve)step='remove-unit';
 if(step==='remove-unit'&&!has(s.board,t.reserve))step='removed';else if(step==='remove-unit'&&!selection)step='remove-select';
 if(step==='inspect'&&!selection)step='inspect-select';
 if(step==='refresh'&&t.refreshed)step='inspect-select';
 if(step==='inspect-select'&&selection?.kind==='hand')step='inspect';
 if(step==='second-copy'&&s.bench.some(id=>root.Game.card(s,id)?.type==='warrior'))step='freeze';
 if(['defeat','victory','encounterWin'].includes(s.phase))step='complete';
 t.step=step;return step;
}
function next(s){if(!active(s))return;const map={traits:'select-lancer',energy:'return-info','return-info':'fight',combat:'speed',removed:'refresh','inspect-read':'deck','deck-read':'piles','piles-read':'second-copy','fusion-done':'fight3'};if(map[s.tutorial.step])s.tutorial.step=map[s.tutorial.step];}
function grantRelic(s){if(!active(s)||s.tutorial.rewardGranted)return false;const G=root.Game;G.ensureBag(s);const id=['heart','scope','boots'].find(id=>!G.ownedRelics(s).includes(id));if(!id||!G.receiveRelic(s,id))return false;const items=[...s.bag.items,...s.reserve.map((id,i)=>({id,key:'stock'+i,rotation:0,x:null,y:null})),{id,key:'tutorial-reward',rotation:0,x:null,y:null}];if(!G.commitBag(s,items))return false;s.tutorial.rewardRelic=id;s.tutorial.rewardGranted=true;return true;}
root.TutorialFlow={active,reconcile,next,grantRelic};if(typeof module!=='undefined')module.exports=root.TutorialFlow;
})(typeof globalThis!=='undefined'?globalThis:this);
