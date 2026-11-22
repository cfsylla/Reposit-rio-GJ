"""Extrai dados de todas as campanhas de playtest (um save final por campanha) para análise.
Uso: python3 -I r3-analise-playtests.py <saida.json>"""
import json, sys, os
from datetime import datetime as D
B = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'playtests')
CAMP = [
    ('H1', 'Histórica 1', 'pré-CP4 (CP2/CP3)', 'historico/Grand_Journey_Save_2026-11-06T22-46-40-650Z.json'),
    ('H2', 'Histórica 2', 'pré-CP4 (CP3)', 'historico/Grand_Journey_Save_2026-11-07T22-42-52-960Z.json'),
    ('H3', 'Histórica 3', 'pré-CP4 (CP3)', 'historico/Grand_Journey_Save_2026-11-08T00-00-50-165Z.json'),
    ('C1', 'Campanha 1', 'CP4 (v56)', 'historico/Grand_Journey_Save_2026-11-12T01-28-26-289Z.json'),
    ('C2', 'Campanha 2 (new game)', 'CP4 (v56)', 'historico/Grand_Journey_Save_2026-11-12T09-44-55-149Z.json'),
    ('C3', 'Carreira v57-R3', 'v57-R3', 'carreira_v57_R3/save_run_ate10_2026-11-16.json'),
    ('C4', 'Campanha 20/11', 'v57-R3 + bosses 2/3', 'carreira_v58/Grand_Journey_Save_2026-11-21T01-25-02-111Z.json'),
]
P = lambda s: D.fromisoformat(s.replace('Z', '+00:00'))
def act_of(k): return 3 if k.startswith('a3') else 2 if k.startswith('a2') else 1
rows, camps = [], []
for cid, nome, ver, f in CAMP:
    d = json.load(open(os.path.join(B, f))); p = d['profile']; runs = p['runs']
    tree_total = len((p.get('skillTree') or {}).get('unlocked') or [])
    tot_min = 0; first_win = None; first_win_min = None; cum_diam = 0
    for i, r in enumerate(runs, 1):
        ts = sorted([P(x['at']) for x in r.get('events', []) + r.get('choices', []) + r.get('unlocks', []) if isinstance(x, dict) and x.get('at')] + [P(r['startedAt']), P(r['endedAt'])])
        act = sum(min((b - a).total_seconds() / 60, 5) for a, b in zip(ts, ts[1:]))
        raw = (P(r['endedAt']) - P(r['startedAt'])).total_seconds() / 60
        tot_min += act
        comp = r['completed']; last = comp[-1]['id'] if comp else '-'
        encs = r['encounters']
        maps = sorted({e.get('act') or act_of(e['key']) for e in encs}) or [1]
        de = [e for e in encs if e.get('result') == 'defeat']
        reason = r.get('reason')
        if reason == 'victory': fim = 'vitória'
        elif reason == 'chapterWin': fim = 'vitória de capítulo (libera mapa %d)' % ((r.get('chapterWin') or {}).get('unlockedMap') or (max(maps) + 1))
        elif de:
            e = de[0]; fim = 'derrota · mapa %d · %s · %s · %d×%d' % (e.get('act') or act_of(e['key']), e.get('barrier') or e['type'], e.get('deck') or '-', e['score'][0], e['score'][1])
        else:
            nxt = comp[-1]['layer'] + 1 if comp else 0
            fim = 'derrota · mapa %d · após o nó %s (luta não registrada)' % (act_of(last) if comp else 1, last)
        bosses = [e for e in encs if e['type'] == 'boss']
        xp = r.get('treeXp') or {}
        tn = r.get('treeNodes')
        cum_diam += r.get('diamonds') or 0
        if reason == 'victory' and not first_win: first_win, first_win_min = i, tot_min
        unl = r.get('unlocks') or []
        rows.append({
            'camp': cid, 'campanha': nome, 'versao': ver, 'run': i, 'data': r['startedAt'][:10], 'deck': r.get('deck'),
            'resultado': reason, 'fim': fim, 'mapa_max': max(maps), 'nos': len(comp), 'lutas': len(encs),
            'elites': r.get('elites'), 'bosses_vencidos': r.get('bosses'),
            'bosses': '; '.join('m%s %s %d×%d' % (e.get('act') or act_of(e['key']), (e.get('barrier') or ''), e['score'][0], e['score'][1]) for e in bosses),
            'arvore_inicio': len(tn) if tn is not None else None, 'nos_comprados': len(r.get('treeBought') or []) if r.get('treeBought') is not None else None,
            'xp_ganho': xp.get('gained'), 'xp_gasto': xp.get('spent'), 'xp_perdido': xp.get('lost'),
            'diamantes': r.get('diamonds'), 'diamantes_bonus': r.get('bonusDiamonds'), 'diamantes_acum': cum_diam,
            'ouro_gasto': r.get('spent'), 'ouro_final': r.get('finalGold'),
            'reliquias': len(r.get('relics') or []), 'reliquias_ids': ', '.join(r.get('relics') or []),
            'cartas_fim': len([c for c in (r.get('finalCards') or []) if c.get('type') not in ('exhaustion', 'burden', 'chains', 'ill_omen')]),
            'cartas_nivel2': len([c for c in (r.get('finalCards') or []) if c.get('level') == 2]),
            'desafios': ', '.join(r.get('challenges') or []), 'vantagens': ', '.join(r.get('advantages') or []),
            'desbloqueios': len(unl), 'desbloqueios_ids': ', '.join('%s:%s' % (u.get('kind'), u.get('id')) for u in unl if u.get('kind') != 'milestone'),
            'marcos': len([u for u in unl if u.get('kind') == 'milestone']),
            'drops_catalogo': len([c for c in r.get('choices', []) if c.get('kind') == 'catalogDrop']),
            'min_ativos': round(act, 1), 'min_relogio': round(raw, 1), 'horas_acum': round(tot_min / 60, 2),
        })
    st = p.get('stats') or {}; mp = p.get('milestoneProgress') or {}
    run_d = sum(r.get('diamonds') or 0 for r in runs)
    owned_cards = sum((p.get('cards') or {}).values()); owned_relics = sum((p.get('relics') or {}).values())
    camps.append({'camp': cid, 'campanha': nome, 'versao': ver, 'runs': len(runs), 'vitorias': st.get('wins'),
        'primeira_vitoria_run': first_win, 'horas_ate_1a_vitoria': round(first_win_min / 60, 2) if first_win_min else None,
        'horas_total': round(tot_min / 60, 2), 'arvore_final': tree_total, 'decks': len(p.get('decks') or []),
        'marcos': len(p.get('milestones') or []), 'diamantes_runs': run_d, 'diamantes_saldo': p.get('diamonds'),
        'marcos_pagos': len(mp.get('paid') or []), 'cartas_possuidas': owned_cards, 'tipos_cartas': len(p.get('cards') or {}),
        'reliquias_possuidas': owned_relics, 'catalogo_cartas': len(p.get('catalogCards') or []), 'catalogo_reliquias': len(p.get('catalogRelics') or []),
        'boosters': len(p.get('boosters') or []), 'insignias': p.get('insignia'), 'bosses_total': st.get('bosses'), 'elites_total': st.get('elites')})
json.dump({'runs': rows, 'campanhas': camps}, open(sys.argv[1], 'w'), ensure_ascii=False, indent=1)
for c in camps: print(c)
