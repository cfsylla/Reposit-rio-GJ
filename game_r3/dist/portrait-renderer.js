/* Restore supplied headshots while compositing their connected black matte at display time.
 * Original art files stay byte-identical. Never substitutes full-body anime art. */
(function(root){'use strict';
const IDS=['warrior','lancer','bastion','shinobi','kinoichi','samurai','omnamusha','ronin','fighter','martial_artist','shaolin','cowboy','gunner','miner','pirate_captain','pirate','cannoneer'];
// Only near-black pixels connected to an outside edge are treated as background.
// Dark pixels inside the character's enclosed silhouette are preserved.
function clearConnectedMatte(pixels,width,height){
 const n=width*height,seen=new Uint8Array(n),queue=new Uint32Array(n);let head=0,tail=0;
 const add=i=>{if(seen[i])return;seen[i]=1;const p=i*4;if(pixels[p]<=12&&pixels[p+1]<=12&&pixels[p+2]<=12){queue[tail++]=i;}};
 for(let x=0;x<width;x++){add(x);add((height-1)*width+x);}for(let y=0;y<height;y++){add(y*width);add(y*width+width-1);}
 while(head<tail){const i=queue[head++],x=i%width;pixels[i*4+3]=0;if(x>0)add(i-1);if(x<width-1)add(i+1);if(i>=width)add(i-width);if(i<n-width)add(i+width);}
 return tail;
}
root.JourneyPortraits={IDS,clearConnectedMatte};
if(typeof module!=='undefined')module.exports=root.JourneyPortraits;
if(!root.document||!root.MutationObserver||!root.Image)return;
const sources=new Map(IDS.map(id=>[root.CharacterAssets[id].portrait,id])),cache=new Map();let pending=Promise.resolve();
function composite(src){if(cache.has(src))return cache.get(src);const task=pending.then(()=>new Promise(resolve=>{const im=new Image();im.onload=()=>{try{const canvas=document.createElement('canvas'),scale=Math.min(1,512/Math.max(im.naturalWidth,im.naturalHeight));canvas.width=Math.round(im.naturalWidth*scale);canvas.height=Math.round(im.naturalHeight*scale);const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(im,0,0,canvas.width,canvas.height);const data=ctx.getImageData(0,0,canvas.width,canvas.height);clearConnectedMatte(data.data,canvas.width,canvas.height);ctx.putImageData(data,0,0);resolve(canvas.toDataURL('image/png'));}catch{resolve(src);}};im.onerror=()=>resolve(src);im.src=src;}));cache.set(src,task);pending=task.then(()=>{});return task;}
function enhance(img){if(img.tagName!=='IMG'||img.dataset.portraitMatteApplied)return;const src=img.getAttribute('src')||'',entry=[...sources].find(([path])=>src===path||src.endsWith('/'+path));if(!entry)return;img.dataset.portraitMatteApplied='pending';composite(entry[0]).then(value=>{if(!img.isConnected)return;img.src=value;img.dataset.portraitMatteApplied='true';img.dataset.portraitCharacter=entry[1];});}
function scan(node){if(node.nodeType!==1)return;enhance(node);node.querySelectorAll('img').forEach(enhance);}
const observer=new MutationObserver(changes=>{for(const c of changes){if(c.type==='attributes')enhance(c.target);else c.addedNodes.forEach(scan);}});
function start(){observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});scan(document.documentElement);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(typeof globalThis!=='undefined'?globalThis:this);
