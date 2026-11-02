/* Deck x progress matrix for the post-CP1 state (tree level model): 3 tree levels + comparison with CP1.
 * Usage: node balance/sim/matrix-cp2.cjs <dir> <decks.json> <cp1dir> <out.html>
 * <dir> holds none_/cap250_/cap500_<deck>.jsonl; <cp1dir> holds CP1 none_/mid25_/full_<deck>.jsonl. */
'use strict';
const fs = require('fs'); const [dir, deckFile, cp1, out] = process.argv.slice(2);
const D = JSON.parse(fs.readFileSync(deckFile, 'utf8')).decks;
const CP = [[3, 'Mapa 1<br>3ª luta'], [6, 'Mapa 1<br>6ª luta'], [9, 'Mapa 1<br>boss'], [12, 'Mapa 2<br>3ª luta'], [15, 'Mapa 2<br>6ª luta'], [18, 'Mapa 2<br>boss'], [21, 'Mapa 3<br>3ª luta'], [24, 'Mapa 3<br>6ª luta'], [27, 'Mapa 3 boss<br>= vence a run']];
const TREES = [['none', 'Árvore vazia (nível 0): jogador novo'], ['cap250', 'Árvore no nível 25 (250 pontos): momento típico da 1ª vitória'], ['cap500', 'Árvore no nível 50 (limite, 500 pontos): pós-jogo, sem desafios']];
const color = p => `hsl(${Math.round(p * 120)},65%,${p > .5 ? 82 : 86}%)`;
const load = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse) : null;
const alive = (R, k) => R.filter(r => r.wins >= k || r.result === 'victory').length / R.length;
const win = R => R.filter(r => r.result === 'victory').length / R.length;
const pct = p => Math.round(100 * p) + '%';
const changed = d => d.cp2_change ? ' <small>✎</small>' : '';
let n = 0; for (const [t] of TREES) for (const d of D) { const R = load(`${dir}/${t}_${d.id}.jsonl`); if (R) n += R.length; }
let html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Matriz deck x avanço CP2</title><style>
@page{size:A4 landscape;margin:12mm}body{font-family:"DejaVu Sans",Arial,sans-serif;color:#1b2430;margin:0;font-size:9pt}h1{font-size:15pt;color:#12324a;border-bottom:2px solid #c9a24a;padding-bottom:4px}
h2{font-size:12pt;color:#12324a;margin:14px 0 6px;page-break-before:always}h2.first{page-break-before:auto}p{margin:4px 0}
table{border-collapse:collapse;width:100%;font-size:8pt}th,td{border:1px solid #c8d0d8;padding:3px 4px;text-align:center}th{background:#e9eef3}td.n{text-align:left;white-space:nowrap}tr.avg td{font-weight:bold;border-top:2px solid #12324a}
.up{color:#1d6b2f;font-weight:bold}.down{color:#9b2c2c;font-weight:bold}
</style></head><body><h1>Grand Journey: chance de seguir vivo em cada ponto da run (pós-CP1)</h1>
<p><b>Estado medido:</b> CP1 + árvore revisada (modelo de nível, limite 50, 13 nós novos), curva BC_B (força ×1 / ×1,16 / ×1,235; XP em dobro nos mapas 1 e 2), filtro de relíquias inimigas corrigido e 9 decks revisados (marcados com ✎). Sem Desafios e sem Vantagens.</p>
<p>Jogador simulado competente (joga no nível da IA do jogo; um humano tende a ir melhor). 30 runs por deck e por estado de árvore (${n.toLocaleString('pt-BR')} runs). Margem de cerca de ±17 pontos por deck; a média é bem mais precisa.</p>
<p>Cada célula: porcentagem das runs que <b>venceram até aquele ponto</b>. A última coluna é a chance de vencer a run. Decks de ordem (Blackfang / Dawncrest) só ficam disponíveis depois do boss da ordem, então normalmente são usados com a árvore mais avançada.</p>`;
TREES.forEach(([t, title], ti) => {
  html += `<h2 class="${ti ? '' : 'first'}">${title}</h2><table><tr><th>Deck</th>${CP.map(c => '<th>' + c[1] + '</th>').join('')}</tr>`;
  const all = [];
  for (const d of D) {
    const R = load(`${dir}/${t}_${d.id}.jsonl`); if (!R) continue; all.push(...R);
    html += `<tr><td class="n">${d.name}${d.order ? ' <small>(' + d.order + ')</small>' : ''}${changed(d)}</td>` + CP.map(([k]) => { const p = alive(R, k); return `<td style="background:${color(p)}">${pct(p)}</td>`; }).join('') + '</tr>';
  }
  html += '<tr class="avg"><td class="n">Média</td>' + CP.map(([k]) => { const p = alive(all, k); return `<td style="background:${color(p)}">${pct(p)}</td>`; }).join('') + '</tr></table>';
});
// Comparison with CP1 (final column: win the run)
html += `<h2>Comparação com o CP1: chance de vencer a run</h2><p>CP1: árvore vazia / intermediária (25 nós, ~270 XP) / completa (60 nós), 20 runs por célula. Atual: nível 0 / 25 / 50, 30 runs por célula. Os estados de árvore não são idênticos (o modelo de nível mudou), então compare a tendência, não o número exato.</p>
<table><tr><th>Deck</th><th>CP1 vazia</th><th>Atual nível 0</th><th>CP1 intermediária</th><th>Atual nível 25</th><th>CP1 completa</th><th>Atual nível 50</th><th>Mudança no deck (pós-CP1)</th></tr>`;
const pairs = [['none', 'none'], ['mid25', 'cap250'], ['full', 'cap500']];
const tot = pairs.map(() => [[], []]);
for (const d of D) {
  const cells = pairs.map(([a, b], i) => { const A = load(`${cp1}/${a}_${d.id}.jsonl`), B = load(`${dir}/${b}_${d.id}.jsonl`); if (A) tot[i][0].push(...A); if (B) tot[i][1].push(...B);
    const pa = A ? win(A) : null, pb = B ? win(B) : null, cls = pa === null || pb === null ? '' : pb - pa > .1 ? 'up' : pa - pb > .1 ? 'down' : '';
    return `<td style="background:${pa === null ? '#fff' : color(pa)}">${pa === null ? '—' : pct(pa)}</td><td class="${cls}" style="background:${pb === null ? '#fff' : color(pb)}">${pb === null ? '—' : pct(pb)}</td>`; }).join('');
  const ch = d.cp2_change ? Object.entries(d.cp2_change).map(([k, v]) => k === 'relíquia' ? 'relíquia: ' + v : (v > 0 ? '+' : '') + v + ' ' + k).join(', ') : '';
  html += `<tr><td class="n">${d.name}</td>${cells}<td style="text-align:left">${ch}</td></tr>`;
}
html += '<tr class="avg"><td class="n">Média</td>' + tot.map(([A, B]) => `<td>${A.length ? pct(win(A)) : '—'}</td><td>${B.length ? pct(win(B)) : '—'}</td>`).join('') + '<td></td></tr></table>';
html += '</body></html>'; fs.writeFileSync(out, html); console.log('ok', out, n, 'runs');
