/* Builds an HTML heatmap (deck x progress) for 3 tree states. Usage: node matrix-html.cjs <dir> <decks.json> <out.html> */
'use strict';
const fs = require('fs'); const [dir, deckFile, out] = process.argv.slice(2);
const D = JSON.parse(fs.readFileSync(deckFile, 'utf8')).decks;
const CP = [[3, 'Mapa 1<br>3ª luta'], [6, 'Mapa 1<br>6ª luta'], [9, 'Mapa 1<br>boss'], [12, 'Mapa 2<br>3ª luta'], [15, 'Mapa 2<br>6ª luta'], [18, 'Mapa 2<br>boss'], [21, 'Mapa 3<br>3ª luta'], [24, 'Mapa 3<br>6ª luta'], [27, 'Mapa 3 boss<br>= vence a run']];
const TREES = [['none', 'Árvore vazia (0 nós)'], ['mid25', 'Árvore intermediária (25 nós, ~270 XP)'], ['full', 'Árvore completa (60 nós)']];
const color = p => { const h = Math.round(p * 120); return `hsl(${h},65%,${p > .5 ? 82 : 86}%)`; };
let html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Matriz deck x avanço</title><style>
body{font-family:"DejaVu Sans",Arial,sans-serif;color:#1b2430;margin:0;font-size:9pt}h1{font-size:15pt;color:#12324a;border-bottom:2px solid #c9a24a;padding-bottom:4px}
h2{font-size:12pt;color:#12324a;margin:14px 0 6px;page-break-before:always}h2.first{page-break-before:auto}p{margin:4px 0}
table{border-collapse:collapse;width:100%;font-size:8pt}th,td{border:1px solid #c8d0d8;padding:3px 4px;text-align:center}th{background:#e9eef3}td.n{text-align:left;white-space:nowrap}tr.avg td{font-weight:bold;border-top:2px solid #12324a}
</style></head><body><h1>Grand Journey — chance de seguir vivo em cada ponto da run</h1>
<p>Pacote de dificuldade <b>V23</b> + P1, P2, P3. Jogador simulado competente (joga no nível da IA do jogo; um humano tende a ir melhor). 20 runs por deck e por estado de árvore (1.440 runs no total).</p>
<p>Cada célula: porcentagem das runs que <b>venceram até aquele ponto</b>. A última coluna é a chance de vencer a run. Decks de ordem (Blackfang/Dawncrest) só ficam disponíveis depois do boss da ordem, então normalmente são usados com árvore intermediária ou completa.</p>`;
TREES.forEach(([t, title], ti) => {
  html += `<h2 class="${ti ? '' : 'first'}">${title}</h2><table><tr><th>Deck</th>${CP.map(c => '<th>' + c[1] + '</th>').join('')}</tr>`;
  const all = [];
  for (const d of D) {
    const f = `${dir}/${t}_${d.id}.jsonl`; if (!fs.existsSync(f)) continue;
    const R = fs.readFileSync(f, 'utf8').trim().split('\n').map(JSON.parse); all.push(...R);
    html += `<tr><td class="n">${d.name}${d.order ? ' <small>(' + d.order + ')</small>' : ''}</td>` + CP.map(([k]) => { const p = R.filter(r => r.wins >= k || r.result === 'victory').length / R.length; return `<td style="background:${color(p)}">${Math.round(100 * p)}%</td>`; }).join('') + '</tr>';
  }
  html += '<tr class="avg"><td class="n">Média</td>' + CP.map(([k]) => { const p = all.filter(r => r.wins >= k || r.result === 'victory').length / all.length; return `<td style="background:${color(p)}">${Math.round(100 * p)}%</td>`; }).join('') + '</tr></table>';
});
html += '</body></html>'; fs.writeFileSync(out, html); console.log('ok', out);
