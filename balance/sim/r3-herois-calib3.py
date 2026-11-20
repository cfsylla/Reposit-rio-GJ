"""Calibração 3: suportes (Grand Oracle, Fairy Queen). Vida, ataque e defesa do perfil × 1,2; carga 4 s;
o orçamento vai para o poder da habilidade (skillScale: cura, escudo e golpe), calibrado até o índice L0 = alvo."""
import json, subprocess, sys, os, math
from concurrent.futures import ThreadPoolExecutor
ALVO, SEEDS = float(sys.argv[1]), sys.argv[2]
D = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(D, '../out/lab2_r3/herois_calib3'); os.makedirs(OUT, exist_ok=True)
prof = json.load(open(os.path.join(D, '../out/lab2_r3/herois_perfil.json')))
K, LIMIT = 1.2, 4
def ov(h, s):
    p = prof[h]; return {h: {'hp': round(p['hp'] * K), 'atk': round(p['atk'] * K), 'defense': round(p['defense'] * K), 'rate': p['rate'], 'speed': p['speed'], 'crit': p['crit'],
        'skillScale': round(s, 3), 'cost': 4, 'rarity': 3, 'trigger': {'kind': 'time', 'limit': LIMIT}}}
def medir(h, s):
    env = dict(os.environ, GJ_ROOT=os.path.join(D, '../../game_r3'), GJ_UNIT_OVERRIDES=json.dumps(ov(h, s)))
    out = subprocess.run(['node', os.path.join(D, 'lab2.cjs'), '--seeds', SEEDS, '--units', h, '--configs', 'L0'], env=env, capture_output=True, text=True, cwd=D).stdout
    return float(out.strip().split('index')[-1])
def calib(h):
    log = []; s1, s2 = 1.5, 2.5
    i1 = medir(h, s1); log.append((s1, i1)); i2 = medir(h, s2); log.append((s2, i2))
    for _ in range(4):
        if abs(i2 - ALVO) <= 0.01: break
        sl = max((math.log(i2) - math.log(i1)) / (math.log(s2) - math.log(s1)) if i2 != i1 else 0.2, 0.03)
        s3 = min(8.0, max(0.8, s2 * math.exp((math.log(ALVO) - math.log(i2)) / sl)))
        i3 = medir(h, s3); log.append((s3, i3)); s1, i1, s2, i2 = s2, i2, s3, i3
    best = min(log, key=lambda x: abs(x[1] - ALVO))
    r = {'hero': h, 'skillScale': round(best[0], 3), 'index': best[1], 'log': log, 'stats': ov(h, best[0])[h]}
    open(os.path.join(OUT, h + '.json'), 'w').write(json.dumps(r)); print(h, r['skillScale'], round(r['index'], 3), log, flush=True); return r
with ThreadPoolExecutor(2) as ex: list(ex.map(calib, ['hero_ib_oracle', 'hero_fairy']))
