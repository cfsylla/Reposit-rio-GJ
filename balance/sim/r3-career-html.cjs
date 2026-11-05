/* Appends a career section (from r3-career-report.cjs --json) to a matrix-r3 HTML file.
 * Usage: node balance/sim/r3-career-html.cjs <careers dir> <matrix.html> "<section title>" */
'use strict';
const fs = require('fs'), { execFileSync } = require('child_process');
const [dir, html, title] = process.argv.slice(2);
const rows = JSON.parse(execFileSync('node', [__dirname + '/r3-career-report.cjs', dir, '--json'], { encoding: 'utf8' }));
const med = v => { const a = v.filter(x => x != null).sort((x, y) => x - y); return a.length ? a[Math.floor((a.length - 1) / 2)] : '—'; };
const q = (v, p) => { const a = v.filter(x => x != null).sort((x, y) => x - y); return a.length ? a[Math.min(a.length - 1, Math.floor(p * a.length))] : '—'; };
const pc = v => v == null ? '—' : Math.round(100 * v) + '%';
const color = p => p == null ? '#fff' : `hsl(${Math.round(p * 120)},65%,${p > .5 ? 82 : 86}%)`;
const fwColor = r => { const m = med(r.firstWin); return m === '—' ? '#f4c7c3' : m >= 15 && m <= 20 ? '#c8ecc4' : m < 15 ? '#f6efc0' : '#f4c7c3'; };
rows.sort((a, b) => a.name === 'TODOS' ? 1 : b.name === 'TODOS' ? -1 : (med(a.firstWin) === '—' ? 99 : med(a.firstWin)) - (med(b.firstWin) === '—' ? 99 : med(b.firstWin)));
let s = `<h2>${title}</h2><p>Carreira = sequência de 50 runs com o mesmo deck, começando com a árvore vazia; os nós comprados ficam para as próximas runs. ${rows.find(r => r.name === 'TODOS').careers} carreiras. Verde na 1ª vitória = dentro da meta (runs 15 a 20); amarelo = antes; vermelho = depois.</p>
<table><tr><th>Deck</th><th>Carreiras</th><th>1ª vitória<br>mediana (p10–p90)</th><th>Nós no início<br>da 1ª vitória</th><th>Run com<br>15 nós</th><th>30 nós</th><th>45 nós</th><th>60 nós</th><th>XP por run<br>ganho / gasto / perdido</th><th>Janela mapa 1:<br>compra algo</th><th>Vitória<br>runs 1-5</th><th>6-10</th><th>11-15</th><th>16-20</th><th>21-30</th><th>31-50</th></tr>`;
for (const r of rows) s += `<tr${r.name === 'TODOS' ? ' class="avg"' : ''}><td class="n">${r.name === 'TODOS' ? 'Todos os decks' : r.name}</td><td>${r.careers}</td><td style="background:${fwColor(r)}">${med(r.firstWin)} (${q(r.firstWin, .1)}–${q(r.firstWin, .9)})</td><td>${med(r.firstWinNodes)}</td>${[15, 30, 45, 60].map(n => `<td>${med(r['n' + n])}</td>`).join('')}<td>${r.xp.map(x => x.toFixed(0)).join(' / ')}</td><td>${pc(r.mid1buy)}</td>${r.winBy.map(p => `<td style="background:${color(p)}">${pc(p)}</td>`).join('')}</tr>`;
s += '</table>';
const h = fs.readFileSync(html, 'utf8'); fs.writeFileSync(html, h.replace('<h2 class="first">', s.replace('<h2>', '<h2 class="first">') + '<h2>'));
console.log('careers section added to', html);
