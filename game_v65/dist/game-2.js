(function(root){'use strict';
const CACHE={};
function tint(hex,f){let n=parseInt(hex.slice(1),16),v=[n>>16,n>>8&255,n&255].map(x=>Math.max(0,Math.min(255,Math.round(x*f))));return '#'+v.map(x=>x.toString(16).padStart(2,'0')).join('');}
function sprite(type,pose='idle'){if(root.CharacterAssets&&root.CharacterAssets[type])return assetSprite(type);pose=typeof pose==='string'?pose:'idle';let cacheKey=type+pose;if(CACHE[cacheKey])return CACHE[cacheKey];let t=Game.BY[type],v=t.variant,W=40,H=48,g=Array.from({length:H},()=>Array(W).fill(''));
let pal={o:'#101b2b',c:t.color,d:tint(t.color,.58),m:tint(t.color,.8),h:tint(t.color,1.3),s:v?'#d9a585':'#e6b897',q:v?'#a96f60':'#ba806b',f:'#ffe0b5',k:v?'#533a4a':'#30303b',a:'#dab575',z:'#8d654c',l:'#fff1c6',w:'#cfddd9',n:'#8099a5',r:'#bc5865',j:'#f19381',p:'#303f54',b:'#795749',e:'#87e3c3',u:'#c6a9e9'};
function r(x,y,w,h,c){for(let j=Math.max(0,y);j<Math.min(H,y+h);j++)for(let i=Math.max(0,x);i<Math.min(W,x+w);i++)g[j][i]=c;}
function pixel(x,y,c){r(x,y,1,1,c);}function line(x1,y1,x2,y2,c){let dx=Math.abs(x2-x1),sx=x1<x2?1:-1,dy=-Math.abs(y2-y1),sy=y1<y2?1:-1,err=dx+dy;while(true){pixel(x1,y1,c);if(x1===x2&&y1===y2)break;let z=2*err;if(z>=dy){err+=dy;x1+=sx;}if(z<=dx){err+=dx;y1+=sy;}}}
const attack=pose==='attack',step=pose==='walk';let leg=step?2:0,fat=type==='warrior_b';
// Back layers: cape, hair and equipment give each class a distinct silhouette.
if(['mage','witch','priest'].includes(t.family)){r(13,23,16,18,'d');r(12,36,20,5,'d');r(13,38,19,2,'m');}
if(t.family==='ninja'){r(26,15,7,3,'r');r(30,18,5,3,'r');r(33,17,3,2,'j');}
if(v&&['archer','cowboy','priest'].includes(t.family)){r(24,13,7,17,'k');r(27,25,3,8,'z');}
// Feet and trousers.
r(13-leg,34,6,9,'p');r(24+leg,34,6,9,'p');r(14-leg,34,2,7,'n');r(24+leg,34,2,7,'d');r(10-leg,42,9,3,'o');r(22+leg,42,10,3,'o');r(11-leg,42,7,1,'z');r(23+leg,42,7,1,'z');
// Jacket / tunic.
r(fat?10:14,23,fat?22:14,14,'c');r(fat?10:14,26,fat?5:3,10,'h');r(fat?27:24,25,fat?5:4,11,'d');r(13,35,17,3,'p');r(13,35,17,1,'a');r(20,35,3,3,'a');r(20,35,2,1,'l');
// Relaxed left arm and forward hand.
r(9,25,6,9,'m');r(9,25,2,6,'h');r(9,33,6,5,'s');r(9,36,6,2,'q');r(28,24,5,9,'c');r(31,26,3,6,'d');r(29,32,5,5,'s');r(31,34,3,3,'q');
// Face: larger expressive head, hair and a left-facing highlight.
r(15,8,14,15,'k');r(13,12,4,8,'s');r(16,10,11,13,'s');r(14,15,2,5,'f');r(25,12,3,10,'q');r(17,22,7,3,'s');r(16,8,12,5,'k');r(14,10,3,4,'k');r(26,10,3,8,'k');r(16,15,2,2,'o');r(22,15,2,2,'o');pixel(16,14,'f');pixel(22,14,'f');r(18,20,4,1,'q');r(27,16,2,3,'s');
if(t.family==='warrior'){
if(fat){r(14,8,15,5,'n');r(13,11,3,8,'n');r(26,10,4,10,'n');r(16,7,11,3,'h');r(16,22,11,3,'n');r(13,25,16,4,'w');r(14,25,14,2,'n');r(6,28,11,12,'n');r(5,30,13,7,'n');r(8,28,6,12,'c');r(10,29,2,9,'a');r(7,31,8,2,'a');r(30,23,3,16,'z');r(29,22,5,5,'w');}
else{r(14,7,15,7,'n');r(14,8,13,2,'w');r(14,12,3,8,'n');r(26,12,3,7,'d');r(19,3,4,5,'a');r(20,2,2,5,'r');r(15,24,13,8,'n');r(16,24,3,7,'w');r(25,25,3,7,'d');r(32,12,3,24,'n');r(32,12,1,22,'l');r(30,34,7,2,'a');r(33,36,2,5,'z');if(attack){r(31,12,5,21,'');line(31,31,5,14,'n');line(30,30,5,13,'w');line(30,29,6,13,'l');r(28,29,5,3,'a');}}
}
if(t.family==='ninja'){
r(14,8,15,7,'d');r(15,9,13,2,'m');r(14,13,16,2,'c');r(14,18,14,5,'d');r(16,19,10,1,'m');r(15,24,13,10,'d');r(15,24,3,8,'m');line(14,25,28,33,'a');
if(v){r(15,4,10,5,'k');r(25,5,6,4,'r');r(29,7,5,6,'k');r(11,7,4,16,'k');r(10,20,4,4,'k');r(29,30,8,2,'w');line(30,30,34,26,'n');line(32,27,32,33,'l');line(29,30,35,30,'l');if(attack){r(4,29,8,2,'w');line(8,26,8,34,'l');}}
else{r(31,19,2,20,'w');r(31,19,1,18,'l');r(28,36,8,2,'a');r(31,38,2,5,'z');if(attack){r(31,19,2,17,'');line(31,32,9,18,'w');line(30,32,8,18,'l');}}
}
if(t.family==='cowboy'){
r(13,7,16,5,'b');r(14,4,13,5,'b');r(16,4,8,2,'a');r(12,10,18,3,'z');r(8,12,26,3,'b');r(9,12,23,1,'a');r(17,24,9,3,'r');r(20,27,4,4,'r');r(14,27,3,7,'b');r(26,27,3,7,'b');r(29,29,8,3,'n');r(30,29,8,1,'w');r(30,32,3,4,'z');pixel(18,29,'a');if(v){r(12,16,3,11,'k');r(12,24,3,5,'z');r(11,28,5,2,'r');}else{r(16,19,7,2,'k');pixel(14,19,'k');}if(attack){r(36,28,3,5,'a');r(37,26,2,7,'l');pixel(39,29,'j');}
}
if(t.family==='mage'){
r(12,9,20,4,'c');r(14,5,14,5,'m');r(17,2,8,5,'c');r(19,0,4,4,'c');r(18,2,2,5,'h');r(13,10,17,2,'a');r(13,29,16,12,'c');r(14,30,3,10,'h');r(26,28,3,12,'d');r(13,40,17,2,'a');r(19,26,3,14,'a');r(33,15,2,29,'z');r(31,10,6,7,'n');r(32,11,4,5,'e');r(32,11,2,2,'l');r(34,13,2,2,'h');if(!v){r(15,19,11,5,'w');r(17,23,7,4,'w');r(19,26,3,2,'n');}else{r(11,14,4,12,'a');r(26,14,4,12,'a');r(11,25,3,3,'a');}if(attack){r(29,6,2,2,'l');r(36,9,3,3,'e');r(30,18,2,2,'e');}
}
if(t.family==='monk'){
r(14,11,15,3,'r');r(14,11,9,1,'j');r(28,12,8,2,'r');r(32,14,5,2,'r');r(15,25,7,10,'s');r(17,25,2,8,'f');line(22,24,18,35,'a');r(9,30,6,5,'w');r(10,31,5,1,'n');r(29,28,6,6,'w');r(30,29,4,1,'n');r(13,35,16,3,'r');r(21,37,3,5,'r');
if(v){r(18,3,9,5,'k');r(20,2,5,2,'k');r(25,7,6,4,'k');r(23,4,3,1,'a');}else{r(14,7,15,3,'k');r(16,6,11,2,'k');r(11,8,5,3,'k');}
if(attack){r(7,24,6,7,'s');r(3,24,6,5,'s');r(3,25,6,3,'w');}
}
if(t.family==='witch'){
r(12,9,20,4,'d');r(15,5,13,5,'c');r(18,1,5,5,'d');r(20,2,2,4,'h');r(13,11,16,2,'u');r(11,13,4,14,'k');r(27,13,4,16,'k');r(13,28,17,14,'d');r(14,29,4,11,'c');r(13,39,17,3,'m');r(19,25,5,10,'c');pixel(20,27,'l');r(33,18,2,26,'z');r(30,12,8,8,'d');r(31,13,6,6,'u');r(32,14,3,3,'l');if(!v){r(16,20,9,5,'k');r(18,24,5,3,'k');r(29,28,7,6,'b');r(30,29,5,3,'u');}else{r(12,22,4,9,'u');r(27,20,3,12,'u');pixel(16,15,'u');pixel(22,15,'u');}if(attack){r(2,26,5,5,'u');r(3,27,3,3,'l');r(6,22,2,2,'u');}
}
if(t.family==='archer'){
r(12,8,18,6,'d');r(14,5,13,5,'c');r(15,6,4,4,'h');r(12,13,3,11,'c');r(26,12,4,13,'d');r(13,24,16,5,'m');line(14,24,27,35,'z');line(13,25,26,36,'a');r(31,18,3,4,'a');r(34,22,2,12,'a');r(31,34,3,5,'a');line(31,18,31,39,'w');r(25,28,13,1,'z');pixel(37,28,'w');r(29,11,3,12,'b');r(29,8,1,5,'w');r(32,10,1,5,'w');if(v){r(11,13,3,16,'k');r(11,28,3,5,'a');}else{r(16,18,7,4,'q');}if(attack){r(25,28,13,1,'');r(4,26,10,1,'w');pixel(3,26,'a');}
}
if(t.family==='priest'){
r(13,8,17,6,'w');r(16,4,11,5,'w');r(19,3,5,3,'w');r(16,5,4,4,'l');r(20,5,2,9,'a');r(17,8,8,2,'a');r(12,25,18,5,'w');r(14,29,15,13,'w');r(15,30,3,10,'l');r(25,31,4,11,'n');r(20,25,3,16,'a');r(14,40,15,2,'a');r(33,17,2,27,'a');r(29,19,10,2,'a');r(32,13,4,8,'a');r(33,14,2,5,'l');if(v){r(10,11,4,20,'w');r(28,11,4,20,'w');r(11,30,3,3,'a');}else{r(16,20,8,4,'n');r(17,23,5,3,'w');}if(attack){r(3,24,2,6,'e');r(1,26,6,2,'e');pixel(4,25,'l');}
}
// A one-pixel contour keeps silhouettes crisp on both grass and dark card frames.
let copy=g.map(row=>row.slice());for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(copy[y][x])for(let [dx,dy]of[[0,1],[0,-1],[1,0],[-1,0]]){let a=x+dx,b=y+dy;if(a>=0&&a<W&&b>=0&&b<H&&!copy[b][a])g[b][a]='o';}
let body='';for(let y=0;y<H;y++){let x=0;while(x<W){let code=g[y][x];if(!code){x++;continue;}let n=x+1;while(n<W&&g[y][n]===code)n++;body+='<rect x="'+x+'" y="'+y+'" width="'+(n-x)+'" height="1" fill="'+pal[code]+'"/>';x=n;}}
return CACHE[cacheKey]='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 48" shape-rendering="crispEdges" aria-hidden="true">'+body+'</svg>';}
function icon(name){const icons={sword:'M7 2H9V10H11V12H5V10H7ZM7 12H9V15H7Z',shield:'M3 2H13V10L8 15 3 10ZM5 4V9L8 12 11 9V4Z',bow:'M5 1H8V3H10V5H12V11H10V13H8V15H5V13H7V11H9V5H7V3H5ZM4 3H5V13H4ZM2 7H12V9H2Z',star:'M7 1H9V5H11V7H15V9H11V11H9V15H7V11H5V9H1V7H5V5H7Z',heart:'M2 3H6V5H10V3H14V5H15V9H13V11H11V13H9V15H7V13H5V11H3V9H1V5H2Z',bolt:'M8 1H13L9 6H13L5 15H3L7 9H3Z',coin:'M5 1H11V3H13V5H15V11H13V13H11V15H5V13H3V11H1V5H3V3H5ZM6 4V12H8V4Z',camp:'M7 2H9L15 14H1ZM7 7L4 12H12L9 7Z',crown:'M2 4L5 7 8 2 11 7 14 4V13H2ZM4 14H12V16H4Z',scroll:'M4 1H13V3H15V6H12V14H3V12H1V9H4ZM6 4V6H10V4ZM6 8V10H10V8Z',plus:'M6 1H10V6H15V10H10V15H6V10H1V6H6Z',upgrade:'M7 1H9V3H11V5H13V7H10V15H6V7H3V5H5V3H7Z',question:'M4 1H12V3H14V7H12V9H10V11H6V7H10V5H6V7H2V3H4ZM6 13H10V16H6Z'};return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="'+(icons[name]||icons.star)+'"/></svg>';}
function landscape(){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 190" shape-rendering="crispEdges" class="landscape" aria-hidden="true"><path fill="#152e3a" d="M0 0H400V190H0Z"/><path fill="#bb9571" d="M250 15H288V22H298V49H288V57H250V49H241V22H250Z"/><path fill="#243f47" d="M0 100H25V83H45V66H65V83H85V94H105V71H125V45H145V71H166V90H187V72H207V91H231V76H256V53H272V37H286V62H309V80H335V61H357V81H380V94H400V190H0Z"/><path fill="#34504d" d="M0 135H45V117H78V106H110V126H143V115H183V101H213V121H249V112H290V100H320V111H350V128H400V190H0Z"/><path fill="#132e32" d="M0 161H57V144H85V135H99V158H140V148H181V161H228V145H270V161H310V141H344V130H359V155H400V190H0Z"/><path fill="#0c2028" d="M5 105H17V190H5ZM0 110H24V116H0ZM0 124H27V133H0ZM369 94H381V190H369ZM357 115H393V125H357ZM350 136H400V149H350Z"/><path fill="#c3ac7c" d="M183 178H220V183H231V190H166V184H183Z"/><path fill="#b6c3a0" d="M25 24H28V27H25ZM74 11H76V13H74ZM122 32H125V35H122ZM190 17H192V19H190ZM339 26H342V29H339ZM366 9H368V11H366Z"/></svg>';}
function assetSprite(type){let a=root.CharacterAssets[type],x=48-a.anchor[0]*a.scale,y=110-a.anchor[1]*a.scale;return '<span class="supplied-sprite" aria-hidden="true"><img src="'+a.sprite+'" alt="" draggable="false" style="left:'+x/96*100+'%;top:'+y/112*100+'%;width:'+a.size[0]*a.scale/96*100+'%;height:'+a.size[1]*a.scale/112*100+'%"></span>';}
function portrait(type){let a=root.CharacterAssets&&root.CharacterAssets[type];return a?'<img class="supplied-portrait" src="'+a.portrait+'" alt="" draggable="false">':sprite(type);}
root.Pixels={sprite,portrait,icon,landscape};if(typeof module!=='undefined')module.exports={sprite,portrait,icon,landscape};
})(typeof globalThis!=='undefined'?globalThis:this);
