'use strict';
const FX_IMAGES={};for(let key of ['spark','magic','muzzle','smoke']){let im=new Image();im.src=(key==='magic'?PA.spark:PA[key])||'';FX_IMAGES[key]=im;}
const RED_SPRITES={};
function redSprite(type){if(RED_SPRITES[type])return RED_SPRITES[type];let im=IM[type];if(!im?.complete||!im.naturalWidth)return null;let canvas=document.createElement('canvas');let f=Math.min(1,(CA[type]?.scale||.1)*(88/112)*Math.min(3,window.devicePixelRatio||1));canvas.width=Math.max(1,Math.ceil(im.naturalWidth*f));canvas.height=Math.max(1,Math.ceil(im.naturalHeight*f));let c=canvas.getContext('2d');c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(im,0,0,canvas.width,canvas.height);c.globalCompositeOperation='source-in';c.fillStyle='#f45160';c.fillRect(0,0,canvas.width,canvas.height);return RED_SPRITES[type]=canvas;}

function fitArena(){let stage=document.querySelector('.arena-stage');if(!stage?.clientHeight)return;let field=stage.querySelector('.field');if(!field)return;let w=Math.min(stage.clientWidth,stage.clientHeight*430/540);field.style.width=Math.floor(w)+'px';field.style.height=Math.floor(w*540/430)+'px';field.querySelectorAll('canvas').forEach(canvas=>{let c=setupCanvas(canvas);if(canvas.id==='field')paintBase(c);if(canvas.id==='range-overlay')paintRange(c);});}
if(window.addEventListener){window.addEventListener('resize',fitArena);window.visualViewport?.addEventListener('resize',fitArena);}
function paintArea(c,e,preview=false){
 let f=preview?1:Math.max(0,e.life/(e.full||.5));c.save();c.globalAlpha=preview?.6:.18+.35*f;c.strokeStyle=e.color;c.fillStyle=e.color;c.lineWidth=preview?1.3:1.7;c.beginPath();
 if(e.shape==='line'){let dx=e.tx-e.x,dy=e.ty-e.y,n=Math.hypot(dx,dy)||1,ux=dx/n,uy=dy/n,w=e.width/2;c.moveTo(e.x-uy*w,e.y+ux*w);c.lineTo(e.x+ux*e.length-uy*w,e.y+uy*e.length+ux*w);c.lineTo(e.x+ux*e.length+uy*w,e.y+uy*e.length-ux*w);c.lineTo(e.x+uy*w,e.y-ux*w);c.closePath();}
 else if(e.shape==='cone'){let a=Math.atan2(e.ty-e.y,e.tx-e.x);c.moveTo(e.x,e.y);c.arc(e.x,e.y,e.r,a-e.angle,a+e.angle);c.closePath();}
 else c.arc(e.x,e.y,e.r,0,Math.PI*2);
 c.stroke();c.globalAlpha=preview?.08:.04+.10*f;c.fill();c.restore();
}
function drawParticle(c,key,x,y,size,alpha=1,angle=0){let im=FX_IMAGES[key];if(!im?.complete||!im.naturalWidth)return;c.save();c.globalAlpha=alpha;c.translate(x,y);c.rotate(angle);c.drawImage(im,-size/2,-size/2,size,size);c.restore();}
function paintEffects(c,effects){
 for(let e of effects){if(e.kind==='area')continue;let p=Math.min(1,Math.max(0,1-e.life/(e.full||.85))),alpha=Math.min(1,e.life*4);c.save();
 if(e.kind==='text'){
  let label=e.text.length>7,x=Math.max(label?85:20,Math.min(label?345:410,e.x+(e.vx||0)*p)),y=e.y-(e.vy||30)*p-Math.sin(p*Math.PI)*8;
  c.globalAlpha=alpha;c.font=(e.emphasis?'20px':label?'10px':'15px')+' VT323, sans-serif';c.textAlign='center';c.lineJoin='round';c.strokeStyle='#101e2c';c.lineWidth=3.5;c.strokeText(I18n.combatText(e.text),x,y);c.fillStyle=e.color;c.fillText(I18n.combatText(e.text),x,y);if(e.text==='BLOQUEIO'){c.fillStyle='#8cbcd8';c.beginPath();c.moveTo(x-36,y-10);c.lineTo(x-42,y-12);c.lineTo(x-48,y-10);c.lineTo(x-48,y-3);c.lineTo(x-42,y+2);c.lineTo(x-36,y-3);c.closePath();c.fill();}
 }else if(e.kind==='projectile'){
  let x=e.x+(e.tx-e.x)*p,y=e.y+(e.ty-e.y)*p,angle=Math.atan2(e.ty-e.y,e.tx-e.x);c.strokeStyle=e.weapon==='magic'?'#bca5e6':'#f5de9c';c.lineWidth=e.skill?3:1.7;c.beginPath();c.moveTo(x-Math.cos(angle)*14,y-Math.sin(angle)*14);c.lineTo(x,y);c.stroke();
  if(e.weapon==='arrow'){c.save();c.translate(x,y);c.rotate(angle);c.fillStyle='#dbbe84';c.fillRect(-10,-1,17,2);c.fillStyle='#eef2d8';c.beginPath();c.moveTo(9,0);c.lineTo(2,-4);c.lineTo(2,4);c.closePath();c.fill();c.restore();}
  else if(e.weapon==='magic')drawParticle(c,'magic',x,y,e.skill?33:19,alpha,angle+p*3);
  else {drawParticle(c,'muzzle',e.x,e.y,28,Math.max(0,1-p*3),angle);drawParticle(c,e.weapon==='explosion'?'smoke':'spark',e.tx,e.ty,e.weapon==='explosion'?80:24,p,angle);}
 }else if(e.kind==='slash'){
  c.globalAlpha=alpha;
  if(e.weapon==='punch'){drawParticle(c,'spark',e.tx,e.ty,25+p*20,alpha);c.strokeStyle='#ffe5ae';c.lineWidth=2;c.beginPath();c.arc(e.tx,e.ty,6+p*13,0,Math.PI*2);c.stroke();}
  else{let a=Math.atan2(e.ty-e.y,e.tx-e.x),r=e.skill?29:19;c.strokeStyle=e.skill?'#ffe1a1':'#d9eced';c.lineWidth=e.skill?5:3;c.beginPath();c.arc(e.tx,e.ty,r,a-1.9+p*.5,a+.6+p*.5);c.stroke();drawParticle(c,'spark',e.tx,e.ty,16+p*18,alpha);}
 }else if(e.kind==='ring'||e.kind==='heal'){
  c.globalAlpha=alpha;c.strokeStyle=e.color;c.lineWidth=2;c.beginPath();c.ellipse(e.x,e.y+5,22+p*22,8+p*9,0,0,Math.PI*2);c.stroke();
  for(let i=0;i<4;i++){let a=i*Math.PI/2+p*2,x=e.x+Math.cos(a)*(17+p*15),y=e.y-20+Math.sin(a)*(12+p*10)-p*20;if(e.kind==='heal'){c.fillStyle='#b0f2c4';c.fillRect(x-1,y-4,3,9);c.fillRect(x-4,y-1,9,3);}else drawParticle(c,'magic',x,y,12,alpha,a);}
 }
 c.restore();
 }
}

function setupCanvas(canvas){const rect=canvas.getBoundingClientRect(),dpr=Math.min(3,window.devicePixelRatio||1),w=Math.max(430,Math.round(rect.width*dpr)),h=Math.round(w*540/430);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}const c=canvas.getContext('2d');c.setTransform(w/430,0,0,h/540,0,0);return c;}
function paintZones(c,b){for(let z of b.zones||[]){let colors={dawnSong:'#f3d99b',banner:'#e6c56d',sanctuary:'#9ce3bc',rain:'#b6dcf5',vortex:'#ad8cdc',dynamite:'#ee9f67',firebomb:'#ee9f67',burning:'#ef7044',trap:'#dcbb75',cross:'#9cd9ef',totem:'#c6a5ea',skyfall:'#e6c56d'};paintArea(c,{...z,shape:'circle',color:colors[z.kind],life:1,full:1});c.save();c.strokeStyle=colors[z.kind];c.fillStyle=colors[z.kind];c.globalAlpha=.85;if(z.kind==='vortex'){for(let i=0;i<3;i++){let a=b.time*3+i*2.094;c.beginPath();c.arc(z.x,z.y,z.r*.6,a,a+1.3);c.stroke();}}if(z.kind==='totem'){c.fillRect(z.x-5,z.y-28,10,28);c.fillRect(z.x-12,z.y-25,24,5);drawParticle(c,'magic',z.x,z.y-31,19);}
if(z.kind==='banner'){c.fillRect(z.x-2,z.y-55,3,55);c.beginPath();c.moveTo(z.x+1,z.y-55);c.lineTo(z.x+26,z.y-50);c.lineTo(z.x+1,z.y-33);c.fill();}if(z.kind==='trap'){c.beginPath();c.moveTo(z.x-12,z.y-8);c.lineTo(z.x+12,z.y+8);c.moveTo(z.x+12,z.y-8);c.lineTo(z.x-12,z.y+8);c.stroke();}if(z.kind==='firebomb'||z.kind==='dynamite'){c.font='14px VT323';c.textAlign='center';c.fillText('!',z.x,z.y);}c.restore();}}
function paintUnitSkills(c,b){for(let u of b.units.filter(v=>v.hp>0)){if(u.shield>0){c.save();c.strokeStyle='#b0ddff';c.globalAlpha=.8;c.beginPath();c.ellipse(u.x,u.y-25,28,43,0,0,Math.PI*2);c.stroke();c.restore();}for(let i=0;i<(u.orbs||0);i++){let a=b.time*2+i*Math.PI*2/3;drawParticle(c,'spark',u.x+Math.cos(a)*30,u.y-28+Math.sin(a)*14,17,1,a);}}}
