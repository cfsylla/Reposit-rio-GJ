'use strict';
(function(){
 const N=JourneyMapNotes,NS='http://www.w3.org/2000/svg';
 let enabled=false,active=null,surface=null,toggle=null,erase=null;
 const pencil='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16-1 5 5-1L21 7l-4-4ZM14 6l4 4"/></svg>';
 const rubber='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 14 10-11 8 8-9 10H9ZM7 10l8 8M12 21h10"/></svg>';
 function line(points){const p=document.createElementNS(NS,'path');p.setAttribute('d',N.path(points));return p;}
 function buttons(){if(!toggle)return;toggle.setAttribute('aria-pressed',String(enabled));toggle.classList.toggle('active',enabled);surface.classList.toggle('drawing',enabled);erase.disabled=!active&&!N.strokes(S).length;}
 function finish(){if(!active)return;const stroke=active;active=null;if(stroke.state===S&&stroke.act===JourneyActs.act(S)){N.add(S,stroke.points);save();}try{if(stroke.surface.hasPointerCapture(stroke.id))stroke.surface.releasePointerCapture(stroke.id);}catch{}buttons();}
 function sample(e){const r=surface.getBoundingClientRect();return N.point((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);}
 function begin(e){if(!e.isPrimary||e.button!==0||!surface)return;finish();active={id:e.pointerId,state:S,act:JourneyActs.act(S),surface,points:[sample(e)],line:null};active.line=line(active.points);surface.append(active.line);try{surface.setPointerCapture(e.pointerId);}catch{}buttons();}
 function move(e){if(!active||e.pointerId!==active.id)return;if(!surface.isConnected||active.state!==S){finish();return;}const p=sample(e),prev=active.points.at(-1);if(Math.hypot((p[0]-prev[0])*430,(p[1]-prev[1])*1390)<2)return;active.points.push(p);active.line.setAttribute('d',N.path(active.points));}
 const previousMap=mapView;mapView=function(){finish();enabled=false;previousMap();const map=document.querySelector('.journey-map');if(!map)return;surface=document.createElementNS(NS,'svg');surface.classList.add('map-notes');surface.setAttribute('viewBox','0 0 430 1390');surface.setAttribute('preserveAspectRatio','none');surface.setAttribute('aria-hidden','true');for(const pts of N.strokes(S))surface.append(line(pts));map.append(surface);
  const toolbar=document.querySelector('.map-toolbar'),deck=toolbar.querySelector('[data-act="deck"]');
  const labelDraw=L('Draw','Desenhar'),labelErase=L('Clear drawing','Apagar desenho');
  deck.insertAdjacentHTML('beforebegin','<button type="button" class="icon map-note-icon" data-act="map-draw" aria-pressed="false" aria-label="'+labelDraw+'" title="'+labelDraw+'">'+pencil+'</button><button type="button" class="icon map-note-icon" data-act="map-erase" aria-label="'+labelErase+'" title="'+labelErase+'">'+rubber+'</button>');toggle=toolbar.querySelector('[data-act="map-draw"]');erase=toolbar.querySelector('[data-act="map-erase"]');buttons();
 };
 const previousGuard=JourneyTraining.guard;JourneyTraining.guard=function(e){
  const action=e.target.closest?.('[data-act]')?.dataset.act;
  if(e.type==='click'&&(action==='map-draw'||action==='map-erase')){e.preventDefault();e.stopImmediatePropagation();finish();if(action==='map-draw')enabled=!enabled;else {N.clear(S);surface.replaceChildren();save();}buttons();return true;}
  if(enabled&&e.target.closest?.('.journey-map')){if(e.type==='pointerdown')begin(e);if(e.type==='pointerdown'||e.type==='click'||e.type==='keydown'&&['Enter',' '].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();return true;}}
  return previousGuard(e);
 };
 window.addEventListener('pointermove',e=>{if(active&&e.pointerId===active.id){e.preventDefault();e.stopImmediatePropagation();move(e);}},{capture:true,passive:false});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])window.addEventListener(type,e=>{if(active&&e.pointerId===active.id){if(type==='pointerup')move(e);e.preventDefault();e.stopImmediatePropagation();finish();}},true);
 window.addEventListener('pagehide',finish);window.addEventListener('resize',finish);document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();});
 const previousImage=arenaImage;arenaImage=function(){if(!N.trueBoss(S))return previousImage();const url=new URL('assets/arena-true-final-v49.webp',document.baseURI).href;if(JOURNEY_ARENA.src!==url)JOURNEY_ARENA.src=url;return JOURNEY_ARENA;};
})();
