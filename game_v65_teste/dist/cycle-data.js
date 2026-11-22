(function(root){'use strict';
function ids(s,kind){switch(kind){case'run':return s.cards.map(c=>c.uid);case'draw':return [...s.draw];case'discard':return [...s.discard];case'hand':return [...s.hand];case'bound':return [...s.board,...s.bench].filter(Boolean).flatMap(id=>s.fusions?.[id]||[id]);default:return [];}}
function cards(s,kind){return ids(s,kind).map(id=>s.cards.find(c=>c.uid===id)).filter(Boolean).map(c=>({...c}));}
root.CycleData={ids,cards};if(typeof module!=='undefined')module.exports=root.CycleData;
})(typeof globalThis!=='undefined'?globalThis:this);
