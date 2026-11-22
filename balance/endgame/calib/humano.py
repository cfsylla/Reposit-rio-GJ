# Extrai dos saves das campanhas C1 (CP4), C3 (v57) e C4 (v57+bosses) cada luta: campanha, run, nós da árvore no início da run,
# mapa, categoria (barrier), placar, resultado e desafios. Saída: humano_lutas.json
import json,sys
F={'C1':'balance/playtests/historico/Grand_Journey_Save_2026-11-12T01-28-26-289Z.json',
   'C3':'balance/playtests/carreira_v57_R3/save_run_ate10_2026-11-16.json',
   'C4':'balance/playtests/carreira_v58/Grand_Journey_Save_2026-11-21T01-25-02-111Z.json'}
out=[]
for c,f in F.items():
  d=json.load(open(f))
  for i,r in enumerate(d['profile']['runs'],1):
    n=len(r.get('treeNodes') or [])
    for e in r.get('encounters') or []:
      sc=e.get('score') or [0,0]
      out.append({'camp':c,'run':i,'nodes':n,'act':e.get('act'),'cat':e.get('barrier'),'type':e.get('type'),'won':sc[0],'lost':sc[1],
                  'result':e.get('result'),'challenges':r.get('challenges') or [],'deck':e.get('deck'),'rounds':len(e.get('rounds') or [])})
json.dump(out,open('balance/endgame/calib/humano_lutas.json','w'))
print(len(out),'lutas')
import collections
agg=collections.defaultdict(lambda:[0,0,0,0])
for x in out:
  if x['challenges']:continue
  k=(x['cat'],x['act']);a=agg[k];a[0]+=1;a[1]+=x['result']!='victory' and x['result']!='win';a[2]+=x['lost'];a[3]+=x['won']+x['lost']
for k in sorted(agg,key=str):a=agg[k];print(k,'lutas',a[0],'derrotas',a[1],'rodadas perdidas/luta %.2f'%(a[2]/a[0]),'taxa rodada perdida %.2f'%(a[2]/max(1,a[3])))
print(collections.Counter(x['result'] for x in out))
