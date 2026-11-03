/* Post-game matrices (same style as the deck x progress matrix):
 *  1. challenge x progress (each challenge alone)   2. advantage x progress (each Advantage alone)
 *  3. challenge ladder from post-game careers (easy / hard paths)   4. dangerous combinations
 * Usage: GJ_ROOT=game_p5 node balance/sim/postgame-matrix.cjs --chal dir --adv dir --ladder dir --combos dir --tree "nível 25" --out file.html
 * Any section whose directory is missing is skipped. Also writes <out>.orders.json (challenge cost order, advantage gain order). */
'use strict';
const fs = require('fs');
const E = require('./engine.cjs');
const a = {}; process.argv.slice(2).forEach((v, i, arr) => { if (i % 2 === 0) a[v.replace(/^--/, '')] = arr[i + 1]; });
const CP = [[3, 'Mapa 1<br>3ª luta'], [6, 'Mapa 1<br>6ª luta'], [9, 'Mapa 1<br>boss'], [12, 'Mapa 2<br>3ª luta'], [15, 'Mapa 2<br>6ª luta'], [18, 'Mapa 2<br>boss'], [21, 'Mapa 3<br>3ª luta'], [24, 'Mapa 3<br>6ª luta'], [27, 'Mapa 3 boss<br>= vence a run']];
const color = p => `hsl(${Math.round(p * 120)},65%,${p > .5 ? 82 : 86}%)`;
const alive = (R, k) => R.filter(r => r.wins >= k || r.result === 'victory').length / R.length;
const win = R => R.filter(r => r.result === 'victory').length / R.length;
const pct = p => Math.round(100 * p) + '%';
const readDir = dir => { const by = {}; if (!dir || !fs.existsSync(dir)) return null; for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.jsonl'))) { const key = f.slice(0, f.lastIndexOf('_')).replace(/_[a-z]+$/, m => m); const id = f.split('_')[0]; for (const l of fs.readFileSync(dir + '/' + f, 'utf8').split('\n')) if (l.trim()) (by[id] ??= []).push(JSON.parse(l)); } return by; };
// file names are <id>_<deck>.jsonl; ids may contain '_' (advantages), so match against known ids
function load(dir, ids) { if (!dir || !fs.existsSync(dir)) return null; const by = {}; for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.jsonl'))) { const id = ['none', ...ids].sort((x, y) => y.length - x.length).find(i => f.startsWith(i + '_')); if (!id) continue; for (const l of fs.readFileSync(dir + '/' + f, 'utf8').split('\n')) if (l.trim()) (by[id] ??= []).push(JSON.parse(l)); } return by; }
const row = (name, R, extra) => `<tr><td class="n">${name}</td>` + CP.map(([k]) => { const p = alive(R, k); return `<td style="background:${color(p)}">${pct(p)}</td>`; }).join('') + extra + '</tr>';
const head = (first, extra) => `<table><tr><th>${first}</th>${CP.map(c => '<th>' + c[1] + '</th>').join('')}${extra}</tr>`;
let html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Matriz pós-jogo</title><style>
@page{size:A4 landscape;margin:12mm}body{font-family:"DejaVu Sans",Arial,sans-serif;color:#1b2430;margin:0;font-size:9pt}h1{font-size:15pt;color:#12324a;border-bottom:2px solid #c9a24a;padding-bottom:4px}
h2{font-size:12pt;color:#12324a;margin:14px 0 6px;page-break-before:always}h2.first{page-break-before:auto}p{margin:4px 0}
table{border-collapse:collapse;width:100%;font-size:7.6pt}th,td{border:1px solid #c8d0d8;padding:2px 4px;text-align:center}th{background:#e9eef3}td.n{text-align:left;white-space:nowrap}tr.base td{font-weight:bold;border-bottom:2px solid #12324a}
.k{font-weight:bold}.ok{color:#1d6b2f}.bad{color:#9b2c2c}
</style></head><body><h1>Grand Journey: pós-jogo (Desafios da Jornada e Vantagens)</h1>
${a.note ? '<p style="background:#fff4d6;padding:4px"><b>' + a.note + '</b></p>' : ''}<p>Jogador simulado competente (joga no nível da IA do jogo; um humano tende a ir melhor). Mesmo estado de jogo da matriz de decks pós-CP1 (curva BC_B, árvore revisada, 9 decks revisados). Cada célula: porcentagem das runs que <b>venceram até aquele ponto</b>.</p>`;
// Where the effect shows: segment of the run where the survival curve departs most from the base curve.
const SEG = [[0, 3, 'início do mapa 1'], [3, 9, 'mapa 1 e seu boss'], [9, 15, 'mapa 2'], [15, 18, 'boss do mapa 2'], [18, 24, 'mapa 3'], [24, 27, 'boss final']];
function where(R, B, sign) { const d = k => sign * ((k ? alive(B, k) : 1) - (k ? alive(R, k) : 1)); const parts = SEG.map(([lo, hi, name]) => ({ name, v: d(hi) - d(lo) })).filter(x => x.v > .015).sort((x, y) => y.v - x.v);
  const tot = parts.reduce((t, x) => t + x.v, 0); if (!parts.length || tot < .02) return 'efeito pequeno demais para localizar'; const top = parts.filter(x => x.v >= tot * .25).slice(0, 2); return top.map(x => x.name + ' (' + Math.round(100 * x.v / tot) + '%)').join(', '); }
function fichas(title, list, B, sign, label) { let h = `<h2>${title}</h2><p>Impacto = ${label}. "Quando pesa" = trecho da run em que a curva se afasta do jogo base, com a parcela do efeito total em cada trecho.</p><table><tr><th>Nome</th><th style="width:44%">Efeito</th><th>Impacto</th><th>Quando pesa</th></tr>`;
  for (const x of list) h += `<tr><td class="n"><b>${x.name}</b></td><td style="text-align:left">${x.desc}</td><td class="k">${x.v >= 0 && sign < 0 ? '+' : ''}${x.v.toFixed(0)}</td><td style="text-align:left">${where(x.R, B, sign)}</td></tr>`;
  return h + '</table>'; }
const orders = {};
const fichaParts = [];
let first = true;
const C = load(a.chal, E.CH.LIST.map(c => c.id));
if (C?.none) {
  const base = win(C.none), list = E.CH.LIST.filter(c => C[c.id]).map(c => ({ c, R: C[c.id], cost: 100 * (base - win(C[c.id])) })).sort((x, y) => y.cost - x.cost);
  orders.challenges = [...list].sort((x, y) => x.cost - y.cost).map(x => x.c.id);
  html += `<h2 class="${first ? 'first' : ''}">1. Cada desafio sozinho × avanço (árvore no ${a.tree || 'nível 25'})</h2><p>${C.none.length} runs por linha. Custo = pontos de vitória a menos que o jogo base. Meta: 4 a 8 por desafio. Margem de cerca de ±6 pontos.</p>` + head('Desafio', '<th>Custo</th>');
  html += row('<b>Jogo base (sem desafio)</b>', C.none, '<td>—</td>').replace('<tr>', '<tr class="base">');
  for (const x of list) html += row(x.c.pt, x.R, `<td class="k ${x.cost < 4 ? 'bad' : x.cost > 8 ? 'bad' : 'ok'}">${x.cost.toFixed(0)}</td>`);
  html += '</table>'; first = false;
  fichaParts.push(fichas('Fichas dos desafios (árvore no ' + (a.tree || 'nível 25') + ')', list.map(x => ({ name: x.c.pt, desc: x.c.ptDesc, v: x.cost, R: x.R })), C.none, 1, 'pontos de vitória a menos que o jogo base'));
}
const A = load(a.adv, E.AD.LIST.map(x => x.id));
if (A?.none) {
  const base = win(A.none), list = E.AD.LIST.filter(x => A[x.id]).map(x => ({ x, R: A[x.id], gain: 100 * (win(A[x.id]) - base) })).sort((p, q) => q.gain - p.gain);
  orders.advantages = list.map(y => y.x.id);
  html += `<h2 class="${first ? 'first' : ''}">2. Cada vantagem sozinha × avanço (árvore no ${a.tree || 'nível 25'})</h2><p>Ganho = pontos de vitória a mais que o jogo base. Meta: +2 a +3 por vantagem (menos que o custo de um desafio). Margem de cerca de ±6 pontos.</p>` + head('Vantagem', '<th>Ganho</th>');
  html += row('<b>Jogo base (sem vantagem)</b>', A.none, '<td>—</td>').replace('<tr>', '<tr class="base">');
  for (const y of list) html += row(y.x.pt, y.R, `<td class="k">${y.gain >= 0 ? '+' : ''}${y.gain.toFixed(0)}</td>`);
  html += '</table>'; first = false;
  fichaParts.push(fichas('Fichas das vantagens (árvore no ' + (a.tree || 'nível 25') + ')', list.map(y => ({ name: y.x.pt, desc: y.x.ptDesc, v: y.gain, R: y.R })), A.none, -1, 'pontos de vitória a mais que o jogo base'));
}
html += fichaParts.join('');
if (a.ladder && fs.existsSync(a.ladder)) {
  const R = fs.readdirSync(a.ladder).filter(f => f.endsWith('.jsonl')).flatMap(f => fs.readFileSync(a.ladder + '/' + f, 'utf8').split('\n').filter(Boolean).map(JSON.parse));
  for (const path of ['easy', 'hard']) {
    const P = R.filter(r => r.path === path); if (!P.length) continue;
    const careers = {}; for (const r of P) (careers[r.deck + ':' + r.career] ??= []).push(r);
    const nCar = Object.keys(careers).length;
    html += `<h2>3${path === 'easy' ? 'a' : 'b'}. Escada dos Desafios: caminho ${path === 'easy' ? 'fácil (desafios mais leves primeiro, vantagens mais fortes primeiro)' : 'difícil (desafios mais pesados primeiro, vantagens mais fracas primeiro)'}</h2>
<p>Carreira simulada depois da 1ª vitória (${nCar} carreiras, árvore começando no nível 25 e crescendo com o XP). O jogador sempre tenta o maior nível liberado; cada vitória num nível novo libera o seguinte e compra 1 vantagem. "Runs até vencer" = runs gastas naquele nível (mediana entre as carreiras que o venceram).</p>` + head('Nível de desafio', '<th>Árvore (média)</th><th>Vantagens</th><th>Tentativas</th><th>Carreiras que venceram</th><th>Runs até vencer</th>');
    for (let n = 1; n <= 15; n++) {
      const L = P.filter(r => r.level === n); if (!L.length) continue;
      const per = Object.values(careers).map(rs => rs.filter(r => r.level === n)).filter(rs => rs.length), cleared = per.filter(rs => rs.some(r => r.cleared)).map(rs => rs.findIndex(r => r.cleared) + 1).sort((x, y) => x - y);
      const avgTree = Math.round(L.reduce((t, r) => t + r.treeLevel, 0) / L.length);
      html += row(`Nível ${n}: ${(L[0].active || []).slice(-1).map(id => E.CH.BY[id]?.pt || id)[0] || ''}`, L, `<td>${avgTree}</td><td>${L[0].advantages.length}</td><td>${L.length}</td><td>${cleared.length}/${nCar}</td><td>${cleared.length ? cleared[Math.floor(cleared.length / 2)] : '—'}</td>`);
    }
    html += '</table><p><small>A primeira coluna mostra o desafio acrescentado naquele nível. Chance por linha = chance de vencer cada tentativa naquele nível.</small></p>';
  }
}
const K = a.combos && fs.existsSync(a.combos) ? fs.readdirSync(a.combos).filter(f => f.endsWith('.jsonl')) : [];
if (K.length) {
  const by = {}; for (const f of K) { const id = f.split('__')[0]; for (const l of fs.readFileSync(a.combos + '/' + f, 'utf8').split('\n')) if (l.trim()) (by[id] ??= []).push(JSON.parse(l)); }
  const NAMES = { base: 'Jogo base', vant: 'Só as 15 vantagens', desaf: 'Só os 15 desafios', tudo: '15 desafios + 15 vantagens' };
  html += `<h2>4. No limite: todos os desafios e todas as vantagens</h2><p>${Object.values(by)[0].length} runs por linha (24 decks). "15 desafios + 15 vantagens" é a run do Desafio Final, sem o boss secreto.</p>` + head('Situação', '<th>Vence a run</th>');
  for (const [id, R] of Object.entries(by).sort()) { const [t, c] = id.split('_'); html += row(`Árvore nível ${t.slice(1)}: ${NAMES[c] || c}`, R, `<td class="k">${pct(win(R))}</td>`); }
  html += '</table>';
}
html += '</body></html>'; fs.writeFileSync(a.out, html); fs.writeFileSync(a.out + '.orders.json', JSON.stringify(orders, null, 1)); console.log('ok', a.out, Object.keys(orders));
