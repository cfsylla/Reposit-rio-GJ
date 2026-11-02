/* Relic Bag: geometry uses occupied cells, never a bounding-box collision. */
(function(root){'use strict';
 let context=null,held=null,suppressUntil=0;
 function proposal(draft,key,x,y,grab=[0,0]){
  const item=draft?.find(it=>it.key===key);if(!item)return null;
  const trial={...item,x:x-grab[0],y:y-grab[1]};
  const valid=root.Game.bagValid([...draft.filter(it=>it.key!==key&&it.x!==null),trial],context?.owner?.());
  return{trial,valid,cells:root.Game.relicShape(item.id,item.rotation).map(([dx,dy])=>[trial.x+dx,trial.y+dy])};
 }
 function place(draft,key,x,y,grab=[0,0]){const p=proposal(draft,key,x,y,grab);if(!p?.valid)return false;Object.assign(draft.find(it=>it.key===key),p.trial);return true;}
 function owner(draft,pos){return draft?.find(it=>{const mask=root.Game.bagMask(it,context?.owner?.());return mask!==null&&(mask&(1<<pos));});}
 function clearPreview(){document.querySelectorAll('.bag-drop-valid,.bag-drop-invalid').forEach(el=>el.classList.remove('bag-drop-valid','bag-drop-invalid'));document.querySelector('.bag-inventory')?.classList.remove('bag-store-target');}
 function geometry(){const cells=[...document.querySelectorAll('.bag-grid .bag-cell')];if(![16,18].includes(cells.length))return null;const rect=cells[0].getBoundingClientRect(),next=cells[1].getBoundingClientRect();return{cells,rect,pitch:next.left-rect.left,grid:document.querySelector('.bag-grid').getBoundingClientRect()};}
 function aim(e,g){const x=Math.floor((e.clientX-g.rect.left)/g.pitch),y=Math.floor((e.clientY-g.rect.top)/g.pitch);return x>=0&&x<4&&y>=0&&y<Math.ceil(g.cells.length/4)&&e.clientX>=g.grid.left&&e.clientX<=g.grid.right&&e.clientY>=g.grid.top&&e.clientY<=g.grid.bottom?{x,y}:null;}
 function update(e){const g=geometry();if(!held?.ghost||!g)return;held.ghost.style.left=(e.clientX-held.grab[0]*g.pitch-held.offsetX)+'px';held.ghost.style.top=(e.clientY-held.grab[1]*g.pitch-held.offsetY)+'px';clearPreview();held.aim=aim(e,g);const inv=document.querySelector('.bag-inventory')?.getBoundingClientRect();held.store=!!inv&&e.clientX>=inv.left&&e.clientX<=inv.right&&e.clientY>=inv.top&&e.clientY<=inv.bottom;if(held.store)document.querySelector('.bag-inventory').classList.add('bag-store-target');if(!held.aim)return;const p=proposal(context.draft(),held.key,held.aim.x,held.aim.y,held.grab);if(p)for(const [x,y]of p.cells)if(x>=0&&x<4&&y>=0&&y<5)g.cells[y*4+x]?.classList.add(p.valid?'bag-drop-valid':'bag-drop-invalid');}
 function start(e){const g=geometry(),draft=context.draft(),item=draft?.find(it=>it.key===held.key);if(!g||!item)return;held.active=true;context.select(held.key);const ghost=document.createElement('div');ghost.className='bag-drag-ghost';ghost.setAttribute('aria-hidden','true');for(const [x,y]of root.Game.relicShape(item.id,item.rotation)){const cell=document.createElement('span');cell.style.cssText='left:'+x*g.pitch+'px;top:'+y*g.pitch+'px;width:'+g.rect.width+'px;height:'+g.rect.height+'px';cell.innerHTML=context.icon(item.id);ghost.appendChild(cell);}document.body.appendChild(ghost);held.ghost=ghost;document.body.classList.add('bag-dragging');for(const cell of document.querySelectorAll('[data-owner],[data-act="bag-select"]'))if((cell.dataset.owner||cell.dataset.key)===held.key)cell.classList.add('bag-drag-source');try{held.el.setPointerCapture(held.pointer);}catch{}update(e);}
 function cleanup(){if(!held)return;held.ghost?.remove();held.el?.classList.remove('bag-drag-source');document.querySelectorAll('.bag-drag-source').forEach(el=>el.classList.remove('bag-drag-source'));clearPreview();document.body.classList.remove('bag-dragging');try{if(held.el.hasPointerCapture(held.pointer))held.el.releasePointerCapture(held.pointer);}catch{}held=null;}
 if(typeof document!=='undefined'){
  root.addEventListener('click',e=>{if(Date.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
  root.addEventListener('pointerdown',e=>{
   if(!context||context.readOnly()||e.button!==0||!e.isPrimary||!document.querySelector('.bag-modal'))return;
   const el=e.target.closest('[data-act="bag-cell"],[data-act="bag-select"]');if(!el)return;
   const draft=context.draft(),pos=Number(el.dataset.pos),item=el.dataset.act==='bag-cell'?owner(draft,pos):draft?.find(it=>it.key===el.dataset.key);if(!item)return;
   const cells=root.Game.relicShape(item.id,item.rotation),g=geometry();if(!g)return;
   let grab=[...cells].sort((a,b)=>a[1]-b[1]||a[0]-b[0])[0],offsetX=g.rect.width/2,offsetY=g.rect.height/2;
   if(el.dataset.act==='bag-cell'){grab=[pos%4-item.x,Math.floor(pos/4)-item.y];const r=el.getBoundingClientRect();offsetX=e.clientX-r.left;offsetY=e.clientY-r.top;}
   else{const svg=e.target.closest('.shape-stamp');if(svg){const r=svg.getBoundingClientRect(),w=Math.max(...cells.map(p=>p[0]))+1,h=Math.max(...cells.map(p=>p[1]))+1;const scale=Math.min(r.width/w,r.height/h),gx=(e.clientX-r.left-(r.width-w*scale)/2)/scale,gy=(e.clientY-r.top-(r.height-h*scale)/2)/scale;grab=[...cells].sort((a,b)=>Math.hypot(a[0]+.5-gx,a[1]+.5-gy)-Math.hypot(b[0]+.5-gx,b[1]+.5-gy))[0];}}
   held={key:item.key,el,pointer:e.pointerId,startX:e.clientX,startY:e.clientY,grab,offsetX,offsetY,active:false};
  },true);
  root.addEventListener('pointermove',e=>{if(!held||e.pointerId!==held.pointer)return;if(context.readOnly()||!document.querySelector('.bag-modal')){cleanup();return;}if(!held.active&&Math.hypot(e.clientX-held.startX,e.clientY-held.startY)>8)start(e);if(held?.active){e.preventDefault();e.stopImmediatePropagation();update(e);}}, {capture:true,passive:false});
  root.addEventListener('pointerup',e=>{if(!held||e.pointerId!==held.pointer)return;if(!held.active){cleanup();return;}e.preventDefault();e.stopImmediatePropagation();update(e);const draft=context.draft(),live=!!draft&&!!document.querySelector('.bag-modal');let changed=false;if(!context.readOnly()&&draft&&document.querySelector('.bag-modal')){if(held.aim)changed=place(draft,held.key,held.aim.x,held.aim.y,held.grab);else if(held.store){const it=draft.find(it=>it.key===held.key);if(it){it.x=null;it.y=null;changed=true;}}}const invalid=!!held.aim&&!changed;suppressUntil=Date.now()+400;cleanup();if(invalid)context.invalid();if(live)context.render();},true);
  root.addEventListener('pointercancel',()=>cleanup(),true);root.addEventListener('keydown',e=>{if(e.key==='Escape'&&held?.active){e.preventDefault();cleanup();}},true);
  document.addEventListener('dragstart',e=>{if(e.target.closest('.bag-cell,.bag-item'))e.preventDefault();});
 }
 const api={proposal,place,owner,attach:ctx=>{context=ctx;}};root.BagDrag=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
