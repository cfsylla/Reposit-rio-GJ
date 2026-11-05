'use strict';
/* Shared menu continuity: rebuilds and nested detail views retain both scroll axes.
   New menus using show/openModal/journeyPanel participate automatically. */
(function(){
 const positions=new Map();let revision=0,transaction=false;
 function context(){return S?[S.seed,JourneyActs.act(S),S.current?.id||''].join(':'):'home';}
 function key(root){return context()+'|'+(root.id==='screen-content'?'screen':'modal')+'|'+(root.querySelector('h2')?.textContent.trim()||root.firstElementChild?.className||'')+'|'+(root.querySelector('.shop-tabs .chosen')?.dataset.id||'');}
 function roots(){return [...document.querySelectorAll('#screen-content,#overlay>.modal')];}
 function nodes(root){return [root,...root.querySelectorAll('*')].filter(el=>el===root||el.scrollHeight>el.clientHeight||el.scrollWidth>el.clientWidth||/scroll|content|filters/.test(el.className||''));}
 function nodeKey(el,root){if(el===root)return '$';if(el.id)return '#'+el.id;const cls=[...el.classList].filter(c=>!['chosen','active','selected'].includes(c)).join('.');const peers=[...root.querySelectorAll(el.tagName.toLowerCase())].filter(e=>[...e.classList].filter(c=>!['chosen','active','selected'].includes(c)).join('.')===cls);return el.tagName+'.'+cls+':'+peers.indexOf(el);}
 function capture(force=false){if(transaction&&!force)return;for(const root of roots()){positions.set(key(root),new Map(nodes(root).map(el=>[nodeKey(el,root),[el.scrollLeft,el.scrollTop]])));}while(positions.size>100)positions.delete(positions.keys().next().value);}
 function restore(){for(const root of roots()){const saved=positions.get(key(root));if(!saved)continue;for(const el of nodes(root)){const xy=saved.get(nodeKey(el,root));if(xy){el.scrollLeft=xy[0];el.scrollTop=xy[1];}}}}
 function after(){const n=++revision;restore();requestAnimationFrame(()=>{if(n===revision)restore();});}
 function begin(){if(!transaction){capture();transaction=true;}requestAnimationFrame(()=>{restore();transaction=false;});}
 window.addEventListener('pointerdown',begin,true);
 for(const name of ['click','keydown'])window.addEventListener(name,begin,true);
 const screen=show;show=function(html){capture();screen(html);after();};
 const modal=openModal;openModal=function(html){capture();modal(html);after();};
 const close=closeModal;closeModal=function(){capture();close();after();};
 if(globalThis.JourneyTraining){const guard=JourneyTraining.guard;JourneyTraining.guard=function(e){begin();return guard(e);};}
 globalThis.JourneyMenuScroll={begin,capture,restore,reset(){positions.clear();},audit(){return roots().map(root=>({key:key(root),offsets:nodes(root).map(el=>({node:nodeKey(el,root),x:el.scrollLeft,y:el.scrollTop}))}));}};
})();
