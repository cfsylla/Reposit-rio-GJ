# Análise E10/E11 (fator de mapa por marco). Uso: python3 analise_mapa.py <dir out/endgame>
import json,glob,os,sys,collections
D=sys.argv[1]
def load(pat):
  g=collections.defaultdict(list)
  for fn in glob.glob(pat):
    pre=os.path.basename(fn).split('_')[0]
    for l in open(fn):g[pre].append(json.loads(l))
  return g
eg=load(D+'/e9_ref/A63N*.jsonl');eg.update(load(D+'/e10_ref/M*.jsonl'))
V=[('hoje','A63N'),('leve','MlN'),('média','MmN'),('forte','MfN')]
def w(R):return 100*sum(r['result']=='victory' for r in R)/len(R) if R else float('nan')
print('## Endgame: vitória por nível\n');print('| Nível | '+' | '.join(n for n,_ in V)+' |');print('|---|'+'---|'*len(V))
tot={n:[] for n,_ in V}
for L in range(1,19):
  cells=[]
  for n,p in V:
    R=eg.get(f'{p}{L:02d}',[]);tot[n]+=R;cells.append(f'{w(R):.0f}%')
  print(f'| {L} | '+' | '.join(cells)+' |')
print('| **Média** | '+' | '.join(f'**{w(tot[n]):.1f}%**' for n,_ in V)+' |')
print('\n## Endgame: vitória por faixa de níveis\n');print('| Níveis | '+' | '.join(n for n,_ in V)+' |');print('|---|'+'---|'*len(V))
for a,b in[(1,3),(4,6),(7,9),(10,12),(13,15),(16,18)]:
  print(f'| {a}–{b} | '+' | '.join(f"{w([r for L in range(a,b+1) for r in eg.get(f'{p}{L:02d}',[])]):.0f}%" for n,p in V)+' |')
def where(r):
  d=r.get('deathAt')
  if not d:return None
  t=d['type'];t='raid' if d.get('raid') else t
  return f"mapa {d['act']} {t}"
print('\n## Endgame: onde morre (% das runs, todos os níveis)\n')
keys=sorted({where(r) for n,_ in V for r in tot[n] if where(r)})
print('| Local | '+' | '.join(n for n,_ in V)+' |');print('|---|'+'---|'*len(V))
for k in keys:print(f'| {k} | '+' | '.join(f"{100*sum(where(r)==k for r in tot[n])/len(tot[n]):.1f}%" for n,_ in V)+' |')
print('| **morre no mapa 1/2/3** | '+' | '.join('/'.join(f"{100*sum((r.get('deathAt') or {}).get('act')==a for r in tot[n])/len(tot[n]):.0f}" for a in(1,2,3)) for n,_ in V)+' |')
base=load(D+'/e11_ref/B*.jsonl')
for m,txt in[(2,'Jogo base, mapa 2 liberado: vence o boss do mapa 2'),(3,'Jogo base, mapa 3 liberado (sem vitória): vence a run')]:
  print(f'\n## {txt}\n');print('| Nós | hoje | leve | média | forte |');print('|---|---|---|---|---|')
  for k in(5,10,15):
    print(f'| {k} | '+' | '.join(f"{w(base.get(f'B{m}{v}n{k}',[])):.0f}%" for v in('hoje','leve','media','forte'))+' |')
  print('\nOnde morre (todos os nós):\n');print('| Local | hoje | leve | média | forte |');print('|---|---|---|---|---|')
  allv={v:sum((base.get(f'B{m}{v}n{k}',[]) for k in(5,10,15)),[]) for v in('hoje','leve','media','forte')}
  ks=sorted({where(r) for R in allv.values() for r in R if where(r)})
  for kk in ks:print(f'| {kk} | '+' | '.join(f"{100*sum(where(r)==kk for r in R)/len(R):.1f}%" for R in allv.values())+' |')
