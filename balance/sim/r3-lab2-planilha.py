"""Gera a planilha do ranking de personagens (lab2, R3) a partir de balance/out/lab2_r3/.
Uso: python3 -I r3-lab2-planilha.py <pasta lab2_r3> <saida.xlsx>"""
import json, sys, glob, os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter
from openpyxl.comments import Comment

D, OUT = sys.argv[1], sys.argv[2]
data = json.load(open(os.path.join(D, 'cartas.json')))
cards, traits = data['cards'], data['traits']
res = {}
for f in glob.glob(os.path.join(D, '*', 's*.jsonl')):
    for l in open(f):
        r = json.loads(l)
        res.setdefault(r['id'], {})[r['config']] = r['index']
RAR = ['Comum', 'Incomum', 'Rara', 'Ultra']
GRP_ORDER = ['Grand Union', 'Blackfang', 'Dawncrest', 'Heróis']
done = [i for i in cards if i in res and len(res[i]) >= (11 if cards[i]['grp'] == 'Heróis' else 12) - (2 if any(not traits.get(t, {}).get('thr') for t in cards[i]['traits']) else 0)]
rows = sorted(done, key=lambda i: -res[i]['L0'])

F = 'Arial'
hdr_font = Font(name=F, bold=True, color='FFFFFF'); hdr_fill = PatternFill('solid', fgColor='305496')
body = Font(name=F, size=10)
wb = Workbook()

# --- Leia-me
ws = wb.active; ws.title = 'Leia-me'
grupos = sorted({cards[i]['grp'] for i in done}, key=GRP_ORDER.index)
txt = [
    'Ranking de personagens: laboratório do simulador no código atual (game_r3, R3/CP4)',
    'Grupos incluídos nesta entrega: ' + ', '.join(grupos) + f' ({len(done)} cartas).',
    '',
    'Como cada número é medido',
    '• O personagem testado entra num time de 5 com 4 lutadores neutros e enfrenta 6 tipos de adversário (brawlers, shooters, fortress, assassins, area, sustain), em combate real do jogo.',
    '• Força = o quanto os inimigos podem ser reforçados e o time ainda vence. Índice = força com o personagem ÷ força com um lutador neutro no lugar dele. 1,00 = igual ao neutro.',
    '• 9 seeds por medição. Margem de erro ≈ ±0,02 a 0,03: diferenças menores que isso não são significativas.',
    '• Níveis: L0, L1 e L2 = upgrade 0, 1 e 2. F = fundido (3 cópias). Heróis não têm fusão.',
    '• Traits (nível 0): cada trait do personagem ativado sozinho no 1º e no 2º patamar (2 e 4 membros; Orc e Centaur 2 e 3), e os três traits juntos no 1º e no 2º patamar.',
    '  A ativação é forçada só para o personagem testado (sem colocar outros membros no time), para medir o que o trait dá a ele.',
    '',
    'Limitações',
    '• Traits que dependem de outros membros do time (por exemplo Goblin, Dawnward Order e auras de Protetor para aliados) aparecem com efeito ≈ 0, porque não há outros membros. Fairy não tem patamares.',
    '• Suportes e personagens de cura, aura ou buff ficam subavaliados: o laboratório mede o personagem lutando no lugar de um lutador, não o que ele dá ao time.',
    '• Sem relíquias, árvore ou desafios. Ranger medido na versão publicada (a armadilha planejada não está no jogo).',
    '',
    'Colunas calculadas',
    '• "Índice esperado" = 1 + 0,04 × (custo − 2) + 0,02 × raridade (curva do CP1). "Vs curva" = L0 − esperado (positivo = rende mais do que custa).',
    '• "Pos. geral" e "Pos. no grupo" são calculadas por fórmula a partir do índice L0.',
]
for i, t in enumerate(txt, 1):
    c = ws.cell(row=i, column=1, value=t); c.font = Font(name=F, bold=(i == 1 or t in ('Como cada número é medido', 'Limitações', 'Colunas calculadas')), size=12 if i == 1 else 10)
ws.column_dimensions['A'].width = 150

# --- Cartas
ws = wb.create_sheet('Ranking')
H = ['Pos. geral', 'Pos. no grupo', 'Grupo', 'Personagem', 'Índice L0', 'Índice esperado', 'Vs curva', 'Nome PT', 'ID', 'Facção/raça', 'Atributo', 'Temperamento',
     'Custo (energia)', 'Raridade', 'Vida', 'Ataque', 'Defesa', 'Intervalo de ataque (s)', 'Velocidade', 'Crítico', 'Alcance', 'Alcance (rótulo)', 'Área', 'Área (rótulo)',
     'Habilidade', 'Tipo', 'Carga da habilidade (s)', 'Descrição da habilidade',
     'Índice L1', 'Índice L2', 'Índice fundido',
     'Trait 1 · 1º patamar', 'Trait 1 · 2º patamar', 'Trait 2 · 1º patamar', 'Trait 2 · 2º patamar', 'Trait 3 · 1º patamar', 'Trait 3 · 2º patamar',
     'Todos os traits · 1º patamar', 'Todos os traits · 2º patamar']
IDX = ['Índice L0', 'Índice esperado', 'Índice L1', 'Índice L2', 'Índice fundido'] + [h for h in H if 'patamar' in h]
for j, h in enumerate(H, 1):
    c = ws.cell(row=1, column=j, value=h); c.font = hdr_font; c.fill = hdr_fill; c.alignment = Alignment(wrap_text=True, vertical='center')
col = {h: get_column_letter(j) for j, h in enumerate(H, 1)}
n = len(rows); last = n + 1
for r, i in enumerate(rows, 2):
    c, x = cards[i], res[i]
    t = c['traits'] + [''] * (3 - len(c['traits']))
    def tv(k, lvl):
        tn = t[k]
        if not tn or not traits.get(tn, {}).get('thr'): return None
        return x.get(f"T:{tn}:{traits[tn]['thr'][lvl]}")
    trig = c.get('trigger') or {}
    vals = {'Grupo': c['grp'], 'Personagem': c['name'], 'Nome PT': c['namePT'], 'ID': i, 'Facção/raça': t[0], 'Atributo': t[1], 'Temperamento': t[2],
            'Custo (energia)': c['cost'], 'Raridade': RAR[c['rarity']], 'Vida': c['hp'], 'Ataque': c['atk'], 'Defesa': c['def'], 'Intervalo de ataque (s)': c['rate'],
            'Velocidade': c['speed'], 'Crítico': c['crit'], 'Alcance': c['range'], 'Alcance (rótulo)': c['rangeLabel'], 'Área': c['area'], 'Área (rótulo)': c['areaLabel'],
            'Habilidade': c['ability'], 'Tipo': 'ativa' if c['kind'] == 'active' else 'passiva', 'Carga da habilidade (s)': trig.get('limit'),
            'Descrição da habilidade': c['detailPT'] or c['detail'], 'Índice L0': x.get('L0'), 'Índice L1': x.get('L1'), 'Índice L2': x.get('L2'), 'Índice fundido': x.get('F'),
            'Trait 1 · 1º patamar': tv(0, 0), 'Trait 1 · 2º patamar': tv(0, 1), 'Trait 2 · 1º patamar': tv(1, 0), 'Trait 2 · 2º patamar': tv(1, 1),
            'Trait 3 · 1º patamar': tv(2, 0), 'Trait 3 · 2º patamar': tv(2, 1), 'Todos os traits · 1º patamar': x.get('ALL:1'), 'Todos os traits · 2º patamar': x.get('ALL:2')}
    for h in H:
        cell = ws[f"{col[h]}{r}"]; cell.font = body
        if h in vals: cell.value = vals[h]
    L0 = f"{col['Índice L0']}{r}"
    ws[f"{col['Pos. geral']}{r}"] = f"=RANK({L0},${col['Índice L0']}$2:${col['Índice L0']}${last})"
    ws[f"{col['Pos. no grupo']}{r}"] = f"=COUNTIFS(${col['Grupo']}$2:${col['Grupo']}${last},{col['Grupo']}{r},${col['Índice L0']}$2:${col['Índice L0']}${last},\">\"&{L0})+1"
    ws[f"{col['Índice esperado']}{r}"] = f"=1+0.04*({col['Custo (energia)']}{r}-2)+0.02*MATCH({col['Raridade']}{r},{{\"Comum\",\"Incomum\",\"Rara\",\"Ultra\"}},0)-0.02"
    ws[f"{col['Vs curva']}{r}"] = f"={L0}-{col['Índice esperado']}{r}"
    for h in ('Pos. geral', 'Pos. no grupo', 'Índice esperado', 'Vs curva'): ws[f"{col[h]}{r}"].font = body
    for h in IDX: ws[f"{col[h]}{r}"].number_format = '0.00'
    ws[f"{col['Vs curva']}{r}"].number_format = '+0.00;-0.00;0.00'
    ws[f"{col['Crítico']}{r}"].number_format = '0%'
widths = {'Personagem': 18, 'Nome PT': 18, 'ID': 18, 'Habilidade': 22, 'Descrição da habilidade': 60, 'Grupo': 12, 'Facção/raça': 16, 'Atributo': 13, 'Temperamento': 13}
for h, L in col.items(): ws.column_dimensions[L].width = widths.get(h, 11)
ws.row_dimensions[1].height = 45; ws.freeze_panes = 'H2'; ws.auto_filter.ref = f"A1:{get_column_letter(len(H))}{last}"
ws[f"{col['Índice esperado']}1"].comment = Comment('Curva de força do CP1: 1 + 0,04 × (custo − 2) + 0,02 × raridade (Comum 0, Incomum 1, Rara 2, Ultra 3).', 'Claude')

# --- Traits
ws = wb.create_sheet('Traits')
for j, h in enumerate(['Trait', 'PT', 'Categoria', 'Patamares (membros)', 'Efeito'], 1):
    c = ws.cell(row=1, column=j, value=h); c.font = hdr_font; c.fill = hdr_fill
for r, (k, v) in enumerate(sorted(traits.items(), key=lambda kv: (kv[1]['cat'], kv[0])), 2):
    for j, val in enumerate([k, v['pt'], v['cat'], ' / '.join(map(str, v['thr'])) or '—', v['descPT'] or v['desc']], 1):
        ws.cell(row=r, column=j, value=val).font = body
for L, w in zip('ABCDE', (20, 20, 12, 18, 110)): ws.column_dimensions[L].width = w
wb.save(OUT)
print('cartas', len(done), 'grupos', grupos)
