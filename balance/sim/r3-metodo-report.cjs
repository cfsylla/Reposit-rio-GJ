/* Método novo das relíquias (Carlos 09/11): valor do efeito − custo do formato = patamar da raridade.
 * Lê balance/out/rodada3/metodo_10 (bônus puros + formatos vazios) e metodo_23 (formatos vazios) e as medições das relíquias.
 * Uso: node balance/sim/r3-metodo-report.cjs <saída.html> */
'use strict';
const fs = require('fs'), path = require('path'), R = 'balance/out/rodada3';
process.env.GJ_ROOT ||= 'game_r3'; delete process.env.GJ_TREE_VARIANT;
const log = console.log; console.log = () => {}; const E = require('./engine.cjs'); console.log = log;
const G = E.G, AR = Object.fromEntries(G.ARTIFACTS.map(a => [a.id, a]));
const RAR = ['comum', 'incomum', 'rara', 'ultra rara'], PAT = [1, 1.5, 2, 3], TOL = 0.4;
const FNAME = { dot: 'ponto', domino: 'dominó', diag2: 'diagonal 2', bridge: 'ponte', line3: 'linha 3', L3: 'L3', diag3: 'diagonal 3', square: 'quadrado', T: 'T', S: 'S', line4: 'linha 4', L4: 'L4', cross: 'cruz', U: 'U', P: 'P', L5: 'L5' };
const CELLS = f => ({ dot: 1, domino: 2, diag2: 2, bridge: 2, line3: 3, L3: 3, diag3: 3, square: 4, T: 4, S: 4, line4: 4, L4: 4, cross: 5, U: 5, P: 5, L5: 5 })[f];
const jl = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(JSON.parse) : [];
function delta(dir, file, k = 'w') {
  const base = new Map(jl(path.join(R, dir, 'base_-.jsonl')).concat(jl(path.join(R, dir, 'base.jsonl'))).map(r => [r.deck + '|' + r.seed, r])); const X = [];
  for (const r of jl(path.join(R, dir, file + '.jsonl'))) { const b = base.get(r.deck + '|' + r.seed); if (!b) continue; X.push(k === 'w' ? (r.wins || 0) - (b.wins || 0) : (r.result === 'victory') - (b.result === 'victory')); }
  const n = X.length; if (!n) return null; const m = X.reduce((a, b) => a + b, 0) / n, sd = Math.sqrt(X.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, n - 1));
  return { m, e: 1.96 * sd / Math.sqrt(n), n };
}
const f2 = x => x == null || isNaN(x) ? '—' : x.toFixed(2).replace('.', ','), s2 = x => x == null || isNaN(x) ? '—' : (x >= 0 ? '+' : '') + x.toFixed(2).replace('.', ',');
const pm = d => d ? `${s2(d.m)} <small>±${d.e.toFixed(2).replace('.', ',')}</small>` : '—';
// ---- 1. custo dos formatos
const FORMATS = Object.keys(FNAME);
const cost = {}; for (const t of ['10', '23']) { cost[t] = {}; for (const f of FORMATS) { const d = delta('metodo_' + t, 'vazia_' + f); cost[t][f] = d; } }
// custo por número de casas (média dos formatos com o mesmo número)
const byCells = t => { const o = {}; for (const f of FORMATS) { const d = cost[t][f]; if (!d) continue; (o[CELLS(f)] = o[CELLS(f)] || []).push(-d.m); } return Object.fromEntries(Object.entries(o).map(([c, L]) => [c, L.reduce((a, b) => a + b, 0) / L.length])); };
const C10 = byCells('10'), C23 = byCells('23');
const fcost = (f, t = '10') => cost[t][f] ? -cost[t][f].m : null; // custo = − Δ lutas (positivo = atrapalha)
// ---- 2. bônus puros
const BON = [['atk_0.05', '+5% ataque'], ['atk_0.1', '+10% ataque'], ['atk_0.2', '+20% ataque'], ['hp_0.1', '+10% vida'], ['hp_0.2', '+20% vida'], ['shield_0.1', 'escudo 10% no início da luta'], ['crit_0.1', '+10 pts de crítico'], ['speed_0.1', '+10% vel. de ataque'], ['skill_0.2', '+20% poder de habilidade'], ['charge_0.3', '30% de carga inicial']];
const bon = Object.fromEntries(BON.map(([k]) => [k, delta('metodo_10', 'bonus_' + k)]));
const gold = delta('metodo_10', 'ouro35');
const atk1 = bon['atk_0.1'] ? bon['atk_0.1'].m / 10 : null; // lutas por 1% de ataque
// ---- 3. relíquias
const GEN = 'banner heart luckycharm bell dormant_sword precision plating execution merchant profane_idol contract colossal_heart recovery ember fang repulsion chain laststand hourglass echo sling'.split(' ');
const SRC = id => ['banner', 'heart', 'profane_idol', 'repulsion', 'laststand'].includes(id) ? 'relc4_10' : id === 'echo' ? 'relc5_10' : GEN.includes(id) ? 'relc3_10' : 'rel2_10';
const rows = G.ARTIFACTS.map(a => { const f = G.RELIC_FORMATS[a.id], net = delta(SRC(a.id), 'rel_' + a.id), c = fcost(f), eff = net && c != null ? net.m + c : null, p = PAT[a.rarity];
  // formato que deixaria efeito − custo mais perto do patamar
  let best = null; if (eff != null) for (const g of FORMATS) { const cg = fcost(g); if (cg == null) continue; const diff = Math.abs(eff - cg - p); if (!best || diff < best.diff) best = { g, diff, net: eff - cg }; }
  return { id: a.id, a, f, net, c, eff, p, best, gen: GEN.includes(a.id) }; });
// ---- HTML
let h = ''; const sec = t => { h += `<h2>${t}</h2>`; }, p = t => { h += `<p>${t}</p>`; };
const D = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
h += `<h1>Grand Journey · Relíquias: método novo (efeito, casas, raridade)</h1><p class="sub">${D} · game_r3 · regra do Carlos (09/11): <b>valor do efeito − custo do formato = patamar da raridade</b> · unidade: lutas vencidas a mais por run (10 nós), pareado (mesmo deck e seed) · 10 decks de teste × 40 seeds</p>`;
h += `<div class="box"><b>Patamares (Carlos 09/11)</b>: comum +1 · incomum +1,5 · rara +2 · ultra rara +3 lutas por run, tolerância ±${String(TOL).replace('.', ',')}. A raridade define o patamar; efeito e formato variam para chegar nele.</div>`;
sec('1. Quanto custa cada formato (relíquias vazias, sem efeito)');
p('Cada linha é a run com uma relíquia <b>sem efeito</b> ocupando a bolsa desde o início. Δ negativo = o espaço ocupado atrapalhou (menos relíquias depois).');
h += `<table class="small"><tr><th>Formato</th><th>Casas</th><th>Δ lutas 10 nós</th><th>Δ lutas 23 nós</th><th>Δ vitória 23 nós (pts)</th></tr>`;
for (const f of FORMATS) { const v23 = delta('metodo_23', 'vazia_' + f, 'v'); h += `<tr><td class="n">${FNAME[f]}</td><td>${CELLS(f)}</td><td>${pm(cost['10'][f])}</td><td>${pm(cost['23'][f])}</td><td>${v23 ? s2(100 * v23.m) : '—'}</td></tr>`; }
h += `</table><p>Média por número de casas (custo = − Δ lutas): 10 nós ${Object.entries(C10).map(([c, v]) => `${c}: ${f2(v)}`).join(' · ')} | 23 nós ${Object.entries(C23).map(([c, v]) => `${c}: ${f2(v)}`).join(' · ')}</p>`;
sec('2. Quanto vale cada tipo de efeito (bônus puros, sem relíquia)');
p(`Bônus aplicado a todas as unidades do jogador, sem ocupar a bolsa. Referência: +35 de ouro no início = ${pm(gold)} lutas.`);
h += `<table class="small"><tr><th>Bônus</th><th>Δ lutas 10 nós</th><th>Equivale a (% de ataque)</th></tr>`;
for (const [k, n] of BON) { const d = bon[k]; h += `<tr><td class="n">${n}</td><td>${pm(d)}</td><td>${d && atk1 ? f2(d.m / atk1) + '%' : '—'}</td></tr>`; }
h += `</table>`;
sec('3. As 43 relíquias pela regra');
p('Δ medido = efeito − custo do formato atual (é o que a relíquia rende na run). Efeito = Δ medido + custo do formato. Coluna "formato que fecha" = formato cujo custo deixa efeito − custo mais perto do patamar (se nenhum chega, é o efeito que precisa mudar). Relíquias de nicho foram medidas em 08/11 nos 10 decks de teste, que em geral não têm o trait: o efeito delas aparece subestimado.');
h += `<table class="small"><tr><th>Relíquia</th><th>Raridade</th><th>Patamar</th><th>Formato atual</th><th>Δ medido</th><th>Custo do formato</th><th>Efeito</th><th>Situação</th><th>Formato que fecha</th><th>Fonte</th></tr>`;
for (const r of rows.sort((a, b) => a.a.rarity - b.a.rarity || (b.net?.m ?? -9) - (a.net?.m ?? -9))) {
  const st = !r.net ? '?' : r.net.m > r.p + TOL ? 'acima' : r.net.m < r.p - TOL ? 'abaixo' : 'ok', cl = st === 'ok' ? 'ok' : st === 'acima' ? 'bad' : 'near';
  const fix = !r.best ? '—' : r.best.diff <= TOL ? `${FNAME[r.best.g]} (${CELLS(r.best.g)}) → ${s2(r.best.net)}` : `nenhum: efeito ${r.eff > r.p ? 'alto' : 'baixo'} demais (${r.eff > r.p ? 'reduzir' : 'aumentar'} efeito)`;
  h += `<tr><td class="n">${r.a.name}</td><td>${RAR[r.a.rarity]}</td><td>${s2(r.p)}</td><td>${FNAME[r.f] || r.f} (${CELLS(r.f)})</td><td>${pm(r.net)}</td><td>${f2(r.c)}</td><td>${f2(r.eff)}</td><td class="${cl}">${st}</td><td class="desc">${st === 'ok' ? 'já está' : fix}</td><td>${r.gen ? 'gravado' : '08/11'}</td></tr>`;
}
h += `</table>`;
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>GJ Relíquias método</title><style>
body{font-family:"DejaVu Sans",Arial,sans-serif;color:#1b2430;margin:0;font-size:9pt;line-height:1.35}h1{font-size:16pt;color:#12324a;border-bottom:2px solid #c9a24a;padding-bottom:4px;margin:0 0 4px}.sub{color:#556;margin:0 0 10px}
h2{font-size:12.5pt;color:#12324a;margin:14px 0 6px;border-left:4px solid #c9a24a;padding-left:6px}p{margin:5px 0}
table{border-collapse:collapse;width:100%;margin:4px 0 8px}tr{page-break-inside:avoid}th,td{border:1px solid #c8d0d8;padding:3px 4px;text-align:center}th{background:#e9eef3}
table.small{font-size:8pt}td.n{text-align:left;white-space:nowrap}td.desc{text-align:left;font-size:7.5pt;color:#334}td.ok{background:#dff1e1}td.near{background:#fbf1cf}td.bad{background:#f7dcdc}small{color:#667}
.box{background:#f3f6f9;border:1px solid #c8d0d8;border-left:4px solid #12324a;padding:6px 8px;margin:6px 0}</style></head><body>${h}</body></html>`;
fs.writeFileSync(process.argv[2], html); console.log('wrote', process.argv[2]);
