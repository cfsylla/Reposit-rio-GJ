'use strict';
const PA=window.PolishAssets||{};
const AudioSystem=(()=>{
 let ctx=null,buffers={},pending={},current=null,desired='menu',unlocked=false,paused=false,last={},active=0;
 let settings={music:.34,sfx:.65};try{Object.assign(settings,JSON.parse(localStorage.getItem('errantes-audio-v06')||'{}'));}catch{}
 const decode=key=>{if(buffers[key])return Promise.resolve(buffers[key]);if(pending[key])return pending[key];if(!ctx||!PA[key])return Promise.resolve(null);return pending[key]=fetch(PA[key]).then(r=>{if(!r.ok)throw Error('Audio unavailable');return r.arrayBuffer();}).then(bytes=>ctx.decodeAudioData(bytes)).then(b=>buffers[key]=b).catch(()=>{delete pending[key];return null;});};
 function music(){if(!unlocked||!ctx||current?.key===desired)return;let key=desired;decode(key).then(buffer=>{if(!buffer||key!==desired||current?.key===key)return;const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=buffer;source.loop=true;source.connect(gain);gain.connect(ctx.destination);gain.gain.setValueAtTime(0,ctx.currentTime);gain.gain.linearRampToValueAtTime(paused?0:settings.music,ctx.currentTime+.65);source.start();if(current){current.gain.gain.cancelScheduledValues(ctx.currentTime);current.gain.gain.setValueAtTime(current.gain.gain.value,ctx.currentTime);current.gain.gain.linearRampToValueAtTime(0,ctx.currentTime+.55);try{current.source.stop(ctx.currentTime+.6);}catch{}}current={key,source,gain};});}
 function unlock(){try{if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;ctx=new C();}unlocked=true;if(ctx.state==='suspended')ctx.resume().catch(()=>{});music();}catch{}}
 function scene(key){desired=key;music();}
 function play(key='click',volume=1,variation=true){if(!unlocked||!ctx||paused||settings.sfx<=0||active>=8)return;let now=ctx.currentTime;if(now-(last[key]||-1)<.07)return;last[key]=now;decode(key).then(b=>{if(!b||paused||active>=8)return;const src=ctx.createBufferSource(),gain=ctx.createGain();src.buffer=b;if(variation)src.playbackRate.value=.95+Math.random()*.1;gain.gain.value=Math.min(.85,settings.sfx*volume);src.connect(gain);gain.connect(ctx.destination);active++;src.onended=()=>{active--;src.disconnect();gain.disconnect();};src.start();});}
 function set(key,value){settings[key]=Math.max(0,Math.min(1,value));try{localStorage.setItem('errantes-audio-v06',JSON.stringify(settings));}catch{}if(current){current.gain.gain.cancelScheduledValues(ctx.currentTime);current.gain.gain.setTargetAtTime(paused?0:settings.music,ctx.currentTime,.08);}}
 function pause(value){paused=value;if(current&&ctx){current.gain.gain.cancelScheduledValues(ctx.currentTime);current.gain.gain.setTargetAtTime(paused?0:settings.music,ctx.currentTime,.1);}}
 function visibility(hidden){if(!ctx)return;if(hidden)ctx.suspend().catch(()=>{});else if(unlocked)ctx.resume().catch(()=>{});}
 return{unlock,scene,play,set,pause,visibility,settings,get context(){return ctx;},get track(){return current?.key;}};
})();
const Icon=(()=>{
 const paths={
 elite:'<path d="M4 4h24v12c0 8-12 14-12 14S4 24 4 16Z" fill="#6b543c" stroke="#edce80" stroke-width="2"/><path d="m8 8 16 16m0-16L8 24" fill="none" stroke="#ffe9ab" stroke-width="3"/><path d="m7 21 4 4m10-4 4 4" stroke="#a8d4d6" stroke-width="2"/>',

 hourglass:'<path fill="none" stroke="#d6b267" stroke-width="3" d="M7 2h18M7 30h18M9 3v6l14 14v6M23 3v6L9 23v6"/><path fill="#9ed6e3" d="m12 8 4 5 4-5Zm-1 19h10l-5-6Z"/>',
 book:'<path fill="#805e9c" stroke="#d4b77a" stroke-width="2" d="M3 5q8-4 13 0 6-4 13 0v23q-7-4-13 0-6-4-13 0Z"/><path stroke="#e5cd91" stroke-width="2" d="M16 5v23M6 9l6 1m-6 4 6 1m7-5 6-1"/>',
 banner:'<path stroke="#d9bd80" stroke-width="3" d="M7 1v30"/><path fill="#b95b58" stroke="#dfbb78" d="M9 3h20l-6 8 6 9H9Z"/><path fill="#f2da91" d="m18 6 2 4 5 1-4 3 1 4-4-3-4 3 1-4-3-3 5-1Z"/>',
 eye:'<path fill="#315c75" stroke="#d5bc79" stroke-width="2" d="M1 16Q16-4 31 16 16 36 1 16Z"/><circle cx="16" cy="16" r="7" fill="#83bfcd"/><circle cx="16" cy="16" r="3" fill="#113248"/>',
 coin:'<circle cx="16" cy="16" r="14" fill="#c99845" stroke="#f1d38c" stroke-width="2"/><circle cx="16" cy="16" r="10" fill="none" stroke="#987234" stroke-width="2"/><path fill="#ffe6a5" d="m16 6 5 10-5 10-5-10Z"/>',
 crown:'<path fill="#e0b45e" stroke="#f4d995" d="m3 7 7 7 6-11 6 11 7-7-3 20H6Z"/><path stroke="#96703c" stroke-width="3" d="M7 24h18"/><circle cx="16" cy="19" r="3" fill="#6bbcc6"/>',
 upgrade:'<path fill="#8fc3c3" stroke="#dfcb89" stroke-width="1" d="M16 1 30 15H21V31H11V15H2Z"/>',
 question:'<circle cx="16" cy="16" r="14" fill="#866a98" stroke="#dec78c" stroke-width="2"/><path fill="none" stroke="#fff0c6" stroke-width="3" d="M11 10q5-7 10 0 1 4-5 7v4m0 3v3"/>',

 heart:'<path fill="#d95964" d="M16 28 3 15C-3 3 12-2 16 7 23-2 37 4 29 16Z"/><path fill="#ffb1a7" d="M7 7Q4 9 6 12L10 7Z"/>',
 sword:'<path fill="#cedfee" d="m9 23 1-8L24 2l6 1-1 6-14 14Z"/><path fill="#7194aa" d="m13 19 14-15 1 4-14 14Z"/><path stroke="#e5b85f" stroke-width="4" d="m5 17 12 12"/><path stroke="#a76e38" stroke-width="5" d="m10 23-6 6"/>',
 shield:'<path fill="#e1b860" d="M3 5 16 1l13 4v13L16 31 3 18Z"/><path fill="#407fb0" d="m7 8 9-3 9 3v9l-9 10-9-10Z"/><path fill="#82bddb" d="M8 9v8l7 7V6Z"/>',
 haste:'<path stroke="#ea994e" stroke-width="3" d="M1 8h11M0 15h8M2 22h5"/><path fill="#c9e0ed" d="m10 25 3-11L27 1l4 1-2 6-13 17Z"/><path stroke="#efc56c" stroke-width="4" d="m9 19 10 10"/>',
 boot:'<path fill="#ce964b" d="m12 2 11 2-1 17 8 2v6H4v-7l7-3Z"/><path fill="#f0c672" d="m14 5 6 1-1 11-5-1Z"/><path stroke="#63472d" stroke-width="3" d="M5 29h25"/>',
 crit:'<path fill="#dc7454" d="m16 0 4 10 11-4-5 11 6 8-12-2-4 9-4-10-12 3 7-9-5-10 11 4Z"/><path fill="#ffde83" d="m16 7 3 7 7 2-7 3-3 7-3-7-7-3 7-2Z"/>',
 bolt:'<path fill="#bce9ff" d="m17 1-13 18h10l-1 12L29 12H19l4-11Z"/>',
 crosshair:'<circle cx="16" cy="16" r="10" fill="none" stroke="#e3c58d" stroke-width="3"/><path stroke="#f5e5bc" stroke-width="3" d="M16 0v10m0 12v10M0 16h10m12 0h10"/>',
 area:'<ellipse cx="16" cy="20" rx="14" ry="8" fill="#d8b36d44" stroke="#e1bf78" stroke-width="2"/><circle cx="11" cy="18" r="3" fill="#f0d8a6"/><circle cx="21" cy="18" r="3" fill="#f0d8a6"/>',
 scroll:'<path fill="#d9bd84" d="M7 3h20v7H22v19H4v-7h4Z"/><path fill="none" stroke="#8b6238" stroke-width="2" d="M12 9h8m-8 5h7m-7 5h6M5 23h17M24 4v5h5"/>',
 swords:'<path fill="#d2e1e6" d="m3 1 7 3 18 23-4 4L5 10Zm26 0-7 3L4 27l4 4 19-21Z"/><path stroke="#e4b661" stroke-width="3" d="m0 22 10 9m12-1 10-10"/>',
 tower:'<path fill="#9dbbd0" d="M5 2h5v6h4V2h5v6h4V2h5v11l-5 3v13H8V16l-4-3Z"/><path fill="#355a76" d="M13 29V19q4-6 8 0v10Z"/>',
 bow:'<path fill="none" stroke="#e2b96d" stroke-width="3" d="M8 2q27 14 0 28L12 16Z"/><path stroke="#c8dbe4" stroke-width="2" d="M2 16h28m-6-5 6 5-6 5"/>',
 star:'<path fill="#b99bdc" d="m16 0 4 11 12 5-12 4-4 12-4-12-12-4 12-5Z"/>',
 camp:'<path fill="#9fc59a" d="m16 2 15 27H1Z"/><path fill="#24483e" d="m16 13 8 16H8Z"/>',
 cycle:'<path fill="none" stroke="#e1c27c" stroke-width="2.5" stroke-linecap="round" d="M5 10a12 12 0 0 1 21-2m1 14A12 12 0 0 1 6 25"/><path fill="#e1c27c" d="m22 2 7 7-10 1ZM10 30l-7-7 10-1Z"/><rect x="11" y="10" width="10" height="13" rx="1.5" fill="#a8c9cf"/><path stroke="#274b58" stroke-width="1.5" d="M14 14h4m-4 4h4"/>',
 deck:'<rect x="5" y="2" width="21" height="26" rx="3" fill="#b89a62"/><rect x="8" y="5" width="15" height="20" rx="2" fill="#274b58"/><path fill="#e1c27c" d="m16 9 5 7-5 7-5-7Z"/>',
 units:'<circle cx="16" cy="8" r="6" fill="#c4d4b1"/><path fill="#87b5a2" d="M5 30v-8q11-13 22 0v8Z"/>',
 info:'<circle cx="16" cy="16" r="14" fill="#36616c" stroke="#bda674" stroke-width="2"/><path stroke="#f0dfb8" stroke-width="3" d="M16 14v11m0-18v3"/>',
 trash:'<path fill="none" stroke="#d8b58a" stroke-width="3" d="M7 8h18l-2 21H9ZM3 7h26M12 2h8m-7 10v12m6-12v12"/>',
 range:'<path fill="#cfe0e9" d="m7 24 1-7L23 2l6 1-1 6-16 16Z"/><path stroke="#e7b866" stroke-width="3" d="m4 19 11 11"/><path fill="none" stroke="#8fc6d6" stroke-width="2" d="M2 13A15 15 0 0 1 20 1"/>',
 longrange:'<path fill="none" stroke="#91c1d5" stroke-width="2" d="M2 24h28m-6-5 6 5-6 5M6 8h21m-5-5 6 5-6 5"/>'
 };
 return name=>{const art=typeof name==='string'&&name.startsWith('trait:')?globalThis.JourneyTraitArt?.[name.slice(6)]:null;if(art)return '<img class="ui-icon trait-art" src="'+art.path+'" alt="" aria-hidden="true" decoding="async">';return '<svg class="ui-icon" viewBox="0 0 32 32" aria-hidden="true">'+(paths[name]||paths.star)+'</svg>';};
})();
