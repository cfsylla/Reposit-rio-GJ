# Análise das baterias do endgame. Uso:
#   python3 analise.py ref <dir>            -> etapa 1: vitória por configuração e árvore (24 decks × 20 seeds)
#   python3 analise.py isolado <dir> [base] -> etapa 3: efeito pareado de cada peça contra a base (mesmo deck e seed)
import json,glob,os,sys,math,collections
def load(fn):
  out={}
  for l in open(fn):
    r=json.loads(l);out[(r['deck'],r['seed'])]=r
  return out
def files(d):
  g=collections.defaultdict(dict)
  for fn in glob.glob(d+'/*.jsonl'):
    b=os.path.basename(fn)[:-6];name,tree,deck=b.split('_',2)[0],b.split('_')[1],'_'.join(b.split('_')[2:])
    g[(name,tree)].update(load(fn))
  return g
def win(r):return r['result']=='victory'
def reach(r,a):return max([f['act'] for f in r['fights']]+[0])>=a
def ref(d):
  g=files(d);trees=sorted({t for _,t in g},key=lambda t:int(t[5:]));names=['base','adv','ch15','ch15adv']
  print('| Configuração | '+' | '.join(t.replace('nodes','')+' nós' for t in trees)+' |');print('|---|'+'---|'*len(trees))
  for n in names:
    cells=[]
    for t in trees:
      R=list(g.get((n,t),{}).values());
      if not R:cells.append('—');continue
      p=sum(map(win,R))/len(R);cells.append(f'{100*p:.0f}% (n={len(R)})')
    print(f'| {n} | '+' | '.join(cells)+' |')
  print();print('Chegam ao mapa 2 / mapa 3 / vencem (base):')
  for t in trees:
    R=list(g.get(('base',t),{}).values());print(t,f'{100*sum(reach(r,2) for r in R)/len(R):.0f}% / {100*sum(reach(r,3) for r in R)/len(R):.0f}% / {100*sum(map(win,R))/len(R):.0f}%')
def isolado(d,base='base'):
  g=files(d);rows=[]
  for (n,t),R in g.items():
    if n in(base,'calib'):continue
    B=g.get((base,t),{});keys=[k for k in R if k in B]
    if not keys:continue
    diffs=[win(R[k])-win(B[k]) for k in keys];m=sum(diffs)/len(diffs);sd=math.sqrt(sum((x-m)**2 for x in diffs)/max(1,len(diffs)-1));se=sd/math.sqrt(len(diffs))
    pb=sum(win(B[k]) for k in keys)/len(keys);pr=sum(win(R[k]) for k in keys)/len(keys)
    rows.append((n,t,len(keys),100*pb,100*pr,100*m,196*se))
  rows.sort(key=lambda x:x[5])
  print('| Peça | Árvore | Runs | Base | Com a peça | Efeito (pontos) | Margem ±1,96 EP |');print('|---|---|---|---|---|---|---|')
  for n,t,k,pb,pr,m,e in rows:print(f'| {n} | {t[5:]} | {k} | {pb:.0f}% | {pr:.0f}% | {m:+.1f} | ±{e:.1f} |')
if __name__=='__main__':
  {'ref':ref,'isolado':isolado}[sys.argv[1]](*sys.argv[2:])
