# Vantagens isoladas (e7): efeito pareado (mesmo deck e seed) contra a base, 20 nós.
import json,glob,math,collections,re
D=collections.defaultdict(dict)
for f in glob.glob('balance/out/endgame/e7_ref/*.jsonl'):
    name=re.match(r'.*/(.+?)_nodes20_',f)[1]
    for l in open(f):
        r=json.loads(l);D[name][(r['deck'],r['seed'])]=r
win=lambda r:r['result']=='victory'
B=D['base'];pb=sum(map(win,B.values()))/len(B)
print(f'base {100*pb:.1f}% (n={len(B)})')
out=[]
for a,R in D.items():
    if a=='base':continue
    k=[x for x in R if x in B];d=[win(R[x])-win(B[x]) for x in k];m=sum(d)/len(d)
    sd=math.sqrt(sum((x-m)**2 for x in d)/(len(d)-1));se=sd/math.sqrt(len(d))
    use=collections.Counter()
    for x in k:
        for kk,v in (R[x].get('advUse') or {}).items():use[kk]+=v
    out.append((m,a,100*sum(win(R[x]) for x in k)/len(k),1.96*se,len(k),{kk:round(v/len(k),2) for kk,v in use.items() if v}))
for m,a,p,e,n,u in sorted(out,reverse=True):print(f'{a:18s} {100*m:+5.1f} ±{100*e:.1f}  ({p:.1f}%, n={n}) {u}')
