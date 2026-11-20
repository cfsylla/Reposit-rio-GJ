"""Calibração 2 dos heróis (perfil por personalidade): vida, ataque e defesa do perfil × k; intervalo, movimento, crítico,
carga e poder de habilidade fixos pelo perfil; custo 4. First Wayfarer com habilidade cleave. Uso: python3 -I r3-herois-calib2.py <alvo> <seeds>"""
import json, subprocess, sys, os, math
from concurrent.futures import ThreadPoolExecutor
ALVO, SEEDS = float(sys.argv[1]), sys.argv[2]
D = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(D, '../out/lab2_r3/herois_calib2'); os.makedirs(OUT, exist_ok=True)
prof = json.load(open(os.path.join(D, '../out/lab2_r3/herois_perfil.json')))
def ov(h, k):
    p = prof[h]; return {h: {'hp': round(p['hp'] * k), 'atk': round(p['atk'] * k), 'defense': round(p['defense'] * k), 'rate': p['rate'], 'speed': p['speed'], 'crit': p['crit'],
        'skillScale': p['skill'], 'cost': 4, 'rarity': 3, 'trigger': {'kind': 'time', 'limit': p['limit']}}}
def medir(h, k):
    env = dict(os.environ, GJ_ROOT=os.path.join(D, '../../game_r3'), GJ_UNIT_OVERRIDES=json.dumps(ov(h, k)), GJ_HERO_MODE=json.dumps({'hero_ib_wayfarer': 'cleave'}))
    out = subprocess.run(['node', os.path.join(D, 'lab2.cjs'), '--seeds', SEEDS, '--units', h, '--configs', 'L0'], env=env, capture_output=True, text=True, cwd=D).stdout
    return float(out.strip().split('index')[-1])
def calib(h):
    log = []; k1, k2 = 1.2, 1.6
    i1 = medir(h, k1); log.append((k1, i1)); i2 = medir(h, k2); log.append((k2, i2))
    for _ in range(3):
        if abs(i2 - ALVO) <= 0.01: break
        s = max((math.log(i2) - math.log(i1)) / (math.log(k2) - math.log(k1)) if i2 != i1 else 0.3, 0.05)
        k3 = min(4.0, max(0.6, k2 * math.exp((math.log(ALVO) - math.log(i2)) / s)))
        i3 = medir(h, k3); log.append((k3, i3)); k1, i1, k2, i2 = k2, i2, k3, i3
    best = min(log, key=lambda x: abs(x[1] - ALVO))
    r = {'hero': h, 'k': round(best[0], 3), 'index': best[1], 'log': log, 'stats': ov(h, best[0])[h]}
    open(os.path.join(OUT, h + '.json'), 'w').write(json.dumps(r)); print(h, r['k'], round(r['index'], 3), flush=True); return r
with ThreadPoolExecutor(4) as ex: list(ex.map(calib, list(prof)))
