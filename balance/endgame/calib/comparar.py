# Calibração: compara o jogador simulado (base v65, árvore N nós) com as campanhas humanas (C1, C3, C4) por tipo de luta e mapa.
# Métricas por luta: derrota (a run acaba ali) e rodadas perdidas. Humano filtrado por faixa de nós da árvore no início da run.
import json,glob,collections,sys
TRUE={'ib_wayfarer'}
def cat_sim(f):
  if f.get('event'):return 'event'
  if f['campaign']=='monsters':return 'titan' if f['type']=='boss' else 'raid'
  if f['type']=='boss':return 'trueBoss' if f['act']==3 and f.get('bossId') in TRUE else 'boss'
  if f['type']=='elite':return 'order' if f['campaign'] in ('blackfang','dawncrest') else 'elite'
  return 'entry' if (f['act']>1 and (f.get('stageLocal') or 9)<=2) or (f['act']==1 and (f.get('stageGlobal') or 9)<=2) else 'normal'
def agg(rows):
  a=collections.defaultdict(lambda:[0,0,0])
  for cat,act,lost,dead in rows:k=(cat,act);a[k][0]+=1;a[k][1]+=dead;a[k][2]+=lost
  return a
def sim(pattern):
  rows=[]
  for fn in glob.glob(pattern):
    for l in open(fn):
      r=json.loads(l)
      for f in r['fights']:
        lost=sum(1 for x in f['rounds'] if x['r']!='win');rows.append((cat_sim(f),f['act'],lost,int(f['result']=='loss')))
  return agg(rows)
def hum(lo,hi):
  H=json.load(open('balance/endgame/calib/humano_lutas.json'));rows=[]
  for x in H:
    if x['challenges'] or x['cat'] is None or not(lo<=x['nodes']<=hi):continue
    rows.append((x['cat'],x['act'],x['lost'],int(x['result'] in('defeat','loss'))))
  return agg(rows)
if __name__=='__main__':
  base=sys.argv[1] if len(sys.argv)>1 else 'balance/out/endgame'
  S={n:sim(f'{base}/e3_ref/calib_nodes{n}_*.jsonl') if n!=20 else sim(f'{base}/e1_ref/base_nodes20_*.jsonl') for n in (10,15,20)}
  Hs={'0-9':hum(0,9),'10-19':hum(10,19),'20-45':hum(20,45)}
  cats=['entry','normal','elite','order','raid','boss','titan','trueBoss']
  print('categoria mapa | humano 0-9 / 10-19 / 20-45 nós (lutas, % derrota, rodadas perdidas por luta) | simulador 10 / 15 / 20 nós')
  for c in cats:
    for a in (1,2,3):
      def fmt(d):v=d.get((c,a));return '—' if not v else f'{v[0]}, {100*v[1]/v[0]:.0f}%, {v[2]/v[0]:.2f}'
      print(f'{c} {a} | '+' / '.join(fmt(Hs[k]) for k in Hs)+' | '+' / '.join(fmt(S[n]) for n in S))
