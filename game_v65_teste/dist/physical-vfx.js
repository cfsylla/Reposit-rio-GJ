/* Approved own-art physical effects. Presentation hooks only; no RNG or damage mutation. */
(function(root){'use strict';
const clips={"physical-slash":{"src":"assets/vfx/grand-journey/gj_fx_a01_corte_basico_v002.png","frames":6,"cell":96,"pixel":true,"angle":0,"durations":[50,50,60,50,60,50],"contact":100},"physical-heavy-slash":{"src":"assets/vfx/grand-journey/gj_fx_a02_corte_pesado_v001.png","frames":6,"cell":96,"pixel":true,"angle":0,"durations":[60,50,80,60,60,50],"contact":110},"physical-circular":{"src":"assets/vfx/grand-journey/gj_fx_a02_circular_v001.png","frames":6,"cell":96,"pixel":true,"angle":0,"durations":[50,60,70,60,60,50],"contact":110},"physical-thrust":{"src":"assets/vfx/grand-journey/gj_fx_a03_estocada_v001.png","frames":6,"cell":96,"pixel":true,"angle":0,"durations":[40,40,60,60,60,40],"contact":80},"physical-light-hit":{"src":"assets/vfx/grand-journey/gj_fx_a04_impacto_leve_v001.png","frames":6,"cell":96,"pixel":true,"angle":0,"durations":[30,30,40,40,50,30],"contact":60},"physical-heavy-hit":{"src":"assets/vfx/grand-journey/gj_fx_a05_impacto_pesado_v001.png","frames":6,"cell":96,"pixel":true,"angle":0,"durations":[40,50,70,60,70,50],"contact":90},"physical-ground":{"src":"assets/vfx/grand-journey/gj_fx_a06_impacto_chao_v001.png","frames":6,"cell":96,"pixel":true,"angle":0,"durations":[40,50,70,70,90,80],"contact":90},"physical-crit":{"src":"assets/vfx/grand-journey/gj_fx_a07_critico_v001.png","frames":6,"cell":96,"pixel":true,"angle":0,"durations":[20,30,40,40,40,30],"contact":50},"physical-cross":{"src":"assets/vfx/grand-journey/gj_fx_a08_cruzado_v001.png","frames":8,"cell":96,"pixel":true,"angle":0,"durations":[50,50,60,60,60,60,60,40],"contact":0},"physical-combo2":{"src":"assets/vfx/grand-journey/gj_fx_a08_combo2_v001.png","frames":6,"cell":96,"pixel":true,"angle":0,"durations":[40,50,60,60,60,50],"contact":0}};
const thrust=new Set(['lancer','cavalier','goblin_spearman','goblin_rider','elf_halberdier','woodland_lancer','centaur_lancer','blackfang_guardian']);
const blunt=new Set(['bastion','goblin_brute','cave_troll','troll','mountain_troll','woodland_flailer','shackled_pirate']);
const heavy=new Set(['samurai','viking','berserker','orc_berserker','swordsman','pirate_admiral']);
function baseType(type){if(type.startsWith('hero_')||type.startsWith('boss_'))return root.JourneyBosses?.D[type.replace(/^(hero_|boss_)/,'').replace(/_2$/,'')]?.base||type;return type;}
function frameAt(key,elapsed,start=0,end){const a=clips[key];if(!a)return -1;end??=a.frames;let ms=elapsed*1000;for(let i=start;i<end;i++){if(ms<a.durations[i]-1e-7)return i;ms-=a.durations[i];}return -1;}
function decorate(b,a,t,e,options={}){
 if(!e||options.dot)return;
 const type=baseType(a.type),mode=root.JourneyBossCards?.cards[a.type]?.mode||(a.type.startsWith('boss_')?root.JourneyBosses?.D[a.type.slice(5)]?.mode:null);
 e.vfxSource=a.uid;e.vfxTarget=t.uid;e.vfxTime=b.time;
 if(e.crit){const c=clips['physical-crit'],life=(c.durations.reduce((a,n)=>a+n,0)-c.contact)/1000;b.effects.push({kind:'physical',vfxKey:'physical-crit',vfxStart:2,vfxEnd:6,x:e.tx,y:e.ty,vfxSize:43*(e.targetRaid?1.4:1),life,full:life});e.critVisualHandled=true;}
 if(e.kind!=='slash')return;
 let key='physical-slash',x=e.tx,y=e.ty,size=e.skill?56:37,start=2,end=6,angle=0;
 if(e.weapon==='punch'||type==='orc_fighter'){key=e.skill?'physical-heavy-hit':'physical-light-hit';size=e.skill?55:36;}
 else if(thrust.has(type)){key='physical-thrust';angle=Math.atan2(e.ty-e.y,e.tx-e.x);}
 else if(blunt.has(type)){key='physical-heavy-hit';size=e.skill?64:43;}
 else if(e.skill||heavy.has(type))key='physical-heavy-slash';
 // One circular sweep around the source, regardless of the number of actual targets.
 if(e.skill&&type==='warrior'&&!a.type.startsWith('hero_')&&!a.type.startsWith('boss_')){key='physical-circular';x=a.x;y=a.y-8;size=128;}
 if(e.skill&&(type==='troll'||type==='pirate_admiral'||type==='eagle_druid'||mode==='slam')){key='physical-ground';x=mode==='slam'?t.x:a.x;y=mode==='slam'?t.y:a.y;size=mode==='slam'?140:type==='eagle_druid'?80:130;}
 if(e.skill&&a.type==='berserker'){key='physical-combo2';start=0;}
 if(e.skill&&a.type==='omnamusha'){
  key='physical-cross';const second=(b.zones||[]).some(z=>z.kind==='cross'&&z.owner===a&&z.life<=0);start=second?4:0;end=second?8:4;size=70;
 }
 // Keep the approved descending silhouette; mirror blade arcs for a source on the right.
 const flip=['physical-slash','physical-heavy-slash','physical-combo2','physical-cross'].includes(key)&&e.tx<e.x;
 const previous=b.effects.find(v=>v!==e&&v.vfxKey===key&&v.vfxSource===a.uid&&v.vfxTime===b.time&&(key==='physical-circular'||key==='physical-ground'||v.vfxTarget===t.uid));
 if(previous&&(key==='physical-combo2'||key==='physical-circular'||key==='physical-ground')){e.vfxSkip=true;return;}
 size*=e.targetRaid?1.4:1;
 if(key==='physical-thrust'){// Contact point in the approved cell is (77,48), not its centre.
  const offset=(77-48)*size/96;x-=Math.cos(angle)*offset;y-=Math.sin(angle)*offset;
 }
 const duration=clips[key].durations.slice(start,end).reduce((s,n)=>s+n,0)/1000;
 Object.assign(e,{vfxKey:key,vfxStart:start,vfxEnd:end,vfxX:x,vfxY:y,vfxSize:size,vfxAngle:angle,vfxFlip:flip,life:duration,full:duration});
}
root.JourneyPhysicalVfx={clips,frameAt,decorate};
})(globalThis);
