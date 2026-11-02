'use strict';
// Presentation only: sprites never change combat timing, targeting or damage.
const VFX_IMAGES={};for(const [key,atlas] of Object.entries(VFX_ATLAS)){const im=new Image();im.src=atlas.src;VFX_IMAGES[key]=im;}
function paintVfx(c,key,x,y,size,progress=0,angle=0,alpha=1,loop=false){const a=VFX_ATLAS[key],im=VFX_IMAGES[key];if(!a||!im?.complete||!im.naturalWidth)return false;const p=loop?((progress%1)+1)%1:Math.max(0,Math.min(.9999,progress)),frame=Math.floor(p*a.frames);c.save();c.globalAlpha*=alpha;c.imageSmoothingEnabled=!a.pixel;c.translate(x,y);c.rotate(angle-(a.angle||0));c.drawImage(im,frame*a.cell,0,a.cell,a.cell,-size/2,-size/2,size,size);c.restore();return true;}
const paintFallbackEffects=paintEffects;
paintEffects=function(c,effects){
 const fallback=[];let budget=100;
 for(const e of effects){if(e.kind==='area')continue;if(e.kind==='text'){fallback.push(e);if(e.text==='BLOQUEIO'||e.text==='RIPOSTE')paintVfx(c,'shield-emblem',e.x,e.y-12,34,0,0,.95);continue;}if(budget--<=0)continue;
 const p=Math.max(0,Math.min(.999,1-e.life/(e.full||.5))),alpha=Math.min(1,e.life*7),impactScale=e.targetRaid?1.65:1,angle=Math.atan2((e.ty??e.y)-e.y,(e.tx??e.x)-e.x);let drawn=false;
 if(e.kind==='projectile'){
  const travel=Math.min(1,p/.4),x=e.x+(e.tx-e.x)*travel,y=e.y+(e.ty-e.y)*travel;
  if(e.weapon==='music'){c.save();c.globalAlpha*=alpha;c.strokeStyle='#e4c8ff';c.fillStyle='#e4c8ff';c.lineWidth=2;c.beginPath();c.ellipse(x-3,y+3,4,2.7,-.3,0,Math.PI*2);c.fill();c.beginPath();c.moveTo(x,y+2);c.lineTo(x,y-10);c.lineTo(x+6,y-8);c.stroke();c.restore();continue;}
  if(travel<1){if(e.weapon==='arrow')drawn=paintVfx(c,e.type==='crossbowman'?'bolt':'arrow',x,y,e.skill?25:21,0,angle,alpha);else if(e.weapon==='magic')drawn=paintVfx(c,'arcane',x,y,e.skill?31:20,p,angle+Math.PI/2,alpha,true);else{c.save();c.strokeStyle='#ffe8a9';c.lineWidth=e.skill?3:2;c.beginPath();c.moveTo(x-Math.cos(angle)*8,y-Math.sin(angle)*8);c.lineTo(x,y);c.stroke();c.restore();drawn=true;}}
  if(e.weapon==='shot'||e.weapon==='explosion'){paintVfx(c,'muzzle',e.x,e.y,e.skill?30:21,Math.min(.99,p*3),angle,Math.max(0,1-p*3));}
  if(travel===1){const key=e.weapon==='explosion'?'explosion':e.weapon==='magic'?'arcane':'bullet-hit';drawn=paintVfx(c,key,e.tx,e.ty,(e.weapon==='explosion'?(e.skill?88:50):e.skill?37:24)*impactScale,(p-.4)/.6,0,alpha);if(e.crit)paintVfx(c,'crit',e.tx,e.ty,40,(p-.4)/.6,0,.75*alpha);}
 }else if(e.kind==='slash'){drawn=paintVfx(c,e.weapon==='punch'?'hit':'slash',e.tx,e.ty,(e.skill?54:31)*impactScale,p,angle,alpha);if(e.crit)paintVfx(c,'crit',e.tx,e.ty,42,p,0,alpha*.8);}
 else if(e.kind==='heal')drawn=paintVfx(c,'heal',e.x,e.y-25,63,p,0,alpha);
 else if(e.kind==='ring')continue;
 else if(e.kind==='teleport')drawn=paintVfx(c,'poof',e.x,e.y-14,62,p,0,alpha);
 else if(e.kind==='dash')drawn=paintVfx(c,'dash',e.x+(e.tx-e.x)*p,e.y+(e.ty-e.y)*p,46,p,angle,alpha*.65);
 if(!drawn)fallback.push(e);
 }
 paintFallbackEffects(c,fallback);
};
const paintFallbackUnitSkills=paintUnitSkills;
paintUnitSkills=function(c,b){paintFallbackUnitSkills(c,b);for(const u of b.units){if(u.hp<=0)continue;const phase=b.time*.9+u.x*.01;
 if(u.shield>0){paintVfx(c,'shield',u.x,u.y-23,74,phase,0,.24,true);paintVfx(c,'shield-emblem',u.x-28,u.y-25,20,0,0,.95);}
 if(u.stun>0)paintVfx(c,'stun',u.x,u.y-88,29,phase,0,.95,true);
 if(u.guardBreak>0||u.breakTime>0||u.atkDown>0||u.slow>0||u.root>0)paintVfx(c,'debuff',u.x+27,u.y-15,24,phase,0,.7,true);
 if(u.motion||u.charging)paintVfx(c,'dust',u.x,u.y+5,37,phase*2,0,.5,true);
 // These remain available for status additions; only actual status state may show them.
 if(u.poison>0)paintVfx(c,'poison',u.x,u.y-17,36,phase,0,.6,true);
 if(u.burn>0)paintVfx(c,'burn',u.x,u.y-17,36,phase,0,.6,true);
 }};
const paintFallbackZones=paintZones;
paintZones=function(c,b){paintFallbackZones(c,b);for(const z of b.zones||[]){if(z.kind==='skyfall')paintVfx(c,'ground',z.x,z.y,70,1-z.life/z.full,0,.75);}};
