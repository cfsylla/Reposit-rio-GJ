"""Extract per-run human metrics from Grand Journey saves (read-only). Usage: python3 -I human-metrics.py out.json save1.json save2.json"""
import json, sys
out, *saves = sys.argv[1:]
rows = []
for f in saves:
    d = json.load(open(f)); p = d['profile']
    purchases = [x for x in p['skillTree']['purchases'] if not x.get('reset')]
    for i, r in enumerate(p['runs']):
        if len(r['encounters']) <= 1 and r['reason'] != 'victory': continue  # abandoned/tutorial skip
        enc = r['encounters']; seed = None
        wins = sum(1 for e in enc if (e['score'][0] >= 3 and e['type'] != 'boss') or (e['type'] == 'boss' and e['score'][0] >= 4) or (e['type'] == 'elite' and e.get('deck') is None and e['score'][0] >= 1 and e['score'][1] < 5))
        orders = [e for e in enc if e['type'] == 'elite' and e.get('deck') and ('blackfang' in e['deck'] or 'dawncrest' in e['deck'])]
        elites = [e for e in enc if e['type'] == 'elite' and e.get('deck')]
        raids = [e for e in enc if e['type'] == 'elite' and e.get('deck') is None]
        bosses = [e for e in enc if e['type'] == 'boss']
        rows.append(dict(save=f.split('/')[-1][:40], run=i + 1, deck=r['deck'], reason=r['reason'], encounters=len(enc), fightsWon=wins,
            orderFights=len(orders), orderRoundsLost=sum(e['score'][1] for e in orders), order3_0=sum(1 for e in orders if e['score'] == [3, 0]),
            eliteFights=len(elites), eliteRoundsLost=sum(e['score'][1] for e in elites), elite3_0=sum(1 for e in elites if e['score'] == [3, 0]),
            raidRoundsToWin=[e['score'][0] + e['score'][1] for e in raids], bossScores=[e['score'] for e in bosses],
            maps=len(r.get('actHistory', [])) + (0 if r['reason'] == 'victory' else 1), treeXp=r.get('treeXp')))
json.dump(rows, open(out, 'w'), indent=1)
for x in rows: print(x['run'], x['deck'], x['reason'], 'lutas', x['encounters'], '| ordem', x['orderFights'], '3-0:', x['order3_0'], 'rodadas perdidas', x['orderRoundsLost'], '| elites', x['eliteFights'], 'perdidas', x['eliteRoundsLost'], '| raids', x['raidRoundsToWin'], '| bosses', x['bossScores'], '| xp', x['treeXp'])
