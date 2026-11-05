"""Compile selected licensed effects. Usage: python scripts/import-vfx-v21.py SOURCE_WORKSPACE."""
import sys,zipfile,io,json,re,shutil
from pathlib import Path
from PIL import Image
root=Path(sys.argv[1]);dest=Path('dist/assets/vfx');dest.mkdir(parents=True,exist_ok=True);meta={};origins=[]
def pack(key,images,source,pixel=False,angle=0):
 images=[im.convert('RGBA') for im in images];w=max(im.width for im in images);h=max(im.height for im in images)
 frames=[]
 for im in images:
  tile=Image.new('RGBA',(w,h));tile.alpha_composite(im,((w-im.width)//2,(h-im.height)//2));frames.append(tile)
 bounds=[im.getbbox() for im in frames if im.getbbox()]
 if not bounds:raise ValueError(key)
 bbox=(min(b[0] for b in bounds),min(b[1] for b in bounds),max(b[2] for b in bounds),max(b[3] for b in bounds));cell=64 if pixel else 96;sheet=Image.new('RGBA',(cell*len(frames),cell))
 for i,im in enumerate(frames):
  im=im.crop(bbox);im.thumbnail((cell,cell),Image.Resampling.NEAREST if pixel else Image.Resampling.LANCZOS);sheet.alpha_composite(im,(i*cell+(cell-im.width)//2,(cell-im.height)//2))
 sheet.save(dest/(key+'.png'),optimize=True);meta[key]={'src':'assets/vfx/'+key+'.png','frames':len(frames),'cell':cell,'pixel':pixel,'angle':angle};origins.append({'effect':key,'source':source})
def read(z,n):return Image.open(io.BytesIO(z.read(n)))
def sequence(file,key,select,source,pixel=False):
 with zipfile.ZipFile(root/file) as z:
  names=sorted([n for n in z.namelist() if select(n)],key=lambda n:[int(t) if t.isdigit() else t for t in re.split(r'(\d+)',n)]);pack(key,[read(z,n) for n in names],source,pixel)
def strip(file,key,path,cell,source,pixel=True):
 with zipfile.ZipFile(root/file) as z:
  im=read(z,path);pack(key,[im.crop((x,0,x+cell,cell)) for x in range(0,im.width,cell)],source,pixel)
base='Grand_Journey_VFX/';extra='Grand_Journey_VFX_Complementos/'
sequence(base+'Cethiel_Weapon_Slash.zip','slash',lambda n:n.startswith('Classic/1/') and n.endswith('.png'),'Cethiel — Weapon Slash')
sequence(base+'Cethiel_Arcane_Magic.zip','arcane',lambda n:n.startswith('01/') and n.endswith('.png'),'Cethiel — Arcane Magic')
sequence(extra+'Pixel_Holy.zip','heal',lambda n:n.startswith('Heal/Frames/') and n.endswith('.png'),'Sentient Dream Studio — Pixel Holy',True)
sequence(extra+'Angel_Shield.zip','shield-emblem',lambda n:n=='AngelShieldEffect_03.png','Cethiel — Angel Shield')
pre='Robot Warfare Asset Pack 22-11-24/Effects/'
for key,path,cell in [('hit','hit-sparks.png',8),('bullet-hit','bullet-impacts.png',8),('muzzle','muzzle-flashes.png',8)]:strip(base+'Matt_Walkden_Robot_Warfare.zip',key,pre+path,cell,'Matt Walkden — Robot Warfare')
strip(base+'Ansimuz_Explosion_Animations.zip','explosion','explosion pack 1/Explosions pack/explosion-1-a/spritesheet.png',32,'Ansimuz — Explosion Animations')
with zipfile.ZipFile(root/(extra+'Ranged_Icons_6.zip')) as z:
 for key,n in [('arrow','32x32/ammo/arrow_02.png'),('bolt','32x32/ammo/bolt.png')]:pack(key,[read(z,n)],'AntumDeluge compilation / Dungeon Crawl Stone Soup — CC0 Ranged Icons',True,-2.356194490192345)
with zipfile.ZipFile(root/(extra+'Cooked_FX.zip')) as z:
 mapping={'crit':'combat/crit','ground':'combat/ground_slam_top','blood':'combat/blood_top_red','shield':'magic/shield','buff':'status/buff','debuff':'status/debuff','stun':'status/stun','poison':'status/poison','burn':'status/burn','dash':'movement/dash','dust':'movement/dust_top','poof':'movement/poof_top','portal':'nature/portal','sparkles':'pickup_ui/level_up'}
 manifest=json.loads(z.read('Cooked_FX_FREE/Pixel/anims.json'))
 for key,n in mapping.items():
  data=manifest[n];im=read(z,'Cooked_FX_FREE/Pixel/PNG_1x/'+n+'.png');cell=data['cell'];pack(key,[im.crop((i*cell,0,(i+1)*cell,cell)) for i in range(data['frames'])],'The Cooked Works — Cooked FX Pixel',True)
 for name in ['LICENSE.pdf','README.pdf']:(dest/('Cooked_FX_'+name)).write_bytes(z.read('Cooked_FX_FREE/'+name))
with zipfile.ZipFile(root/(extra+'Pixel_Holy.zip')) as z:(dest/'Pixel_Holy_LICENSE.txt').write_bytes(z.read('README.txt'))
with zipfile.ZipFile(root/(base+'Kenney_Particle_Pack.zip')) as z:
 pack('fusion-spark',[read(z,'PNG (Transparent)/spark_01.png')],'Kenney — Particle Pack')
Path('dist/vfx-data.js').write_text('const VFX_ATLAS='+json.dumps(meta,separators=(',',':'))+';\n');(dest/'sources.json').write_text(json.dumps(origins,indent=2))
shutil.copyfile(root/'Grand_Journey_Creditos_VFX_Completos.md',dest/'CREDITS.md')
print(len(meta),'effects compiled;',sum(p.stat().st_size for p in dest.glob('*.png')),'PNG bytes')
