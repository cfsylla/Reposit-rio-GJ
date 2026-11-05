const fs=require('node:fs'),vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');const ctx={console};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);for(const f of ['game-1','blackfang-assets','roster-v37-assets','raid-assets','monster-assets','boss-assets','ironbound-assets','portrait-renderer'])vm.runInContext(fs.readFileSync('dist/'+f+'.js','utf8'),ctx);
const expected={warrior:'7326aca5ace7c661fe52',lancer:'ef0b9f82dfe7772a25eb',bastion:'b508e3f4f3713962e1e4',shinobi:'14176e85ce6989317219',kinoichi:'15e946145b0ea8759f63',samurai:'fae305c8884c51931488',omnamusha:'979d521e3d3482e0d22c',ronin:'e95b6e8d251f57a6cc9a',fighter:'471955a384952d081220',martial_artist:'362b565c5df56bb3edea',shaolin:'41f635e7c03ec54ec6f4',cowboy:'d3a27afd3a78c6a55afb',gunner:'c47a89c43177e3acccdf',miner:'bffe0db8700d9f9e0c67',pirate_captain:'4aa4af88d733b56781ec',pirate:'b8a9ce79cbf9f85cac53',cannoneer:'0ccf03733edb803169b8'};
for(const[id,hash]of Object.entries(expected)){const a=ctx.CharacterAssets[id];assert.equal(a.portrait,'assets/'+hash+'.webp',id+' must keep supplied head portrait');assert.notEqual(a.portrait,a.art,id+' must never use full-body art for head portrait');}
assert.deepEqual([...ctx.JourneyPortraits.IDS].sort(),Object.keys(expected).sort());
// A dark pixel enclosed by the character survives; only the edge-connected matte clears.
const pixels=new Uint8ClampedArray(7*7*4).fill(255);for(let i=0;i<49;i++){const x=i%7,y=Math.floor(i/7);if(!x||!y||x===6||y===6||i===24){pixels[i*4]=pixels[i*4+1]=pixels[i*4+2]=0;}}assert.equal(ctx.JourneyPortraits.clearConnectedMatte(pixels,7,7),24);assert.equal(pixels[3],0);assert.equal(pixels[24*4+3],255);assert.equal(pixels[8*4+3],255);
const result=cp.spawnSync('python',['-c',`import sys,json
from PIL import Image
payload=json.load(sys.stdin);m=payload['assets'];legacy=set(payload['legacy']);n=0;l=0
for k,a in m.items():
 p=a.get('portrait')
 if not p or p.endswith('.svg'):continue
 im=Image.open('dist/'+p).convert('RGBA');alpha=im.getchannel('A')
 if k in legacy:
  assert .9<im.width/im.height<1.1,k+' is not headshot framing'
  rgb=im.convert('RGB');corners=[rgb.getpixel((0,0)),rgb.getpixel((im.width-1,0)),rgb.getpixel((0,im.height-1)),rgb.getpixel((im.width-1,im.height-1))]
  assert any(max(v)<=12 for v in corners),k+' matte must be connected to an image edge'
  l+=1
 else:
  assert alpha.getextrema()[0]==0,k
  assert sum(alpha.histogram()[:255])/(im.width*im.height)>.05,k
  n+=1
print(str(n)+' alpha portraits and '+str(l)+' original headshots with runtime connected-matte renderer verified')`],{input:JSON.stringify({assets:ctx.CharacterAssets,legacy:Object.keys(expected)}),encoding:'utf8'});if(result.status)throw Error(result.stderr);console.log(result.stdout.trim());
