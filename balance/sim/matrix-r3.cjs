/* Round 3 deck x progress matrix (v50 base). Same cell format as matrix-cp2.cjs.
 * Usage: node balance/sim/matrix-r3.cjs <dir> <prefix> <decks.json> <out.html> "<title>" "<state note>"
 * Reads every <dir>/<prefix>_<tree>_*.jsonl for tree in none,nodes15,nodes30,nodes45,nodes60 (missing states are skipped). */
'use strict';
const fs = require('fs'), path = require('path');
const [dir, prefix, deckFile, out, title, note] = process.argv.slice(2);
const DECKS = JSON.parse(fs.readFileSync(deckFile, 'utf8')).decks;
const CP = [[3, 'Mapa 1<br>3ª luta'], [6, 'Mapa 1<br>6ª luta'], [9, 'Mapa 1<br>boss'], [12, 'Mapa 2<br>3ª luta'], [15, 'Mapa 2<br>6ª luta'], [18, 'Mapa 2<br>boss'], [21, 'Mapa 3<br>3ª luta'], [24, 'Mapa 3<br>6ª luta'], [27, 'Mapa 3 boss<br>= vence a run']];
const TREES = [['none', 'Árvore vazia (0 nós): jogador novo'], ['nodes15', 'Árvore em 25% (15 nós, 142 pontos)'], ['nodes30', 'Árvore em 50% (30 nós, 344 pontos): referência da 1ª vitória'], ['nodes45', 'Árvore em 75% (45 nós, 623 pontos)'], ['nodes60', 'Árvore completa (60 nós, 1.151 pontos)']];
const color = p => `hsl(${Math.round(p * 120)},65%,${p > .5 ? 82 : 86}%)`;
const pct = p => Math.round(100 * p) + '%';
const alive = (R, k) => R.filter(r => r.wins >= k || r.result === 'victory').length / R.length;
const win = R => R.filter(r => r.result === 'victory').length / R.length;
const ci = R => Math.round(196 * Math.sqrt(Math.max(win(R) * (1 - win(R)), .25 / R.length) / R.length));
const files = fs.readdirSync(dir).filter(f => f.startsWith(prefix + '_') && f.endsWith('.jsonl'));
const data = {}; // tree -> deck -> runs
for (const [t] of TREES) for (const f of files.filter(f => f.startsWith(`${prefix}_${t}_`))) for (const l of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) if (l.trim()) { const r = JSON.parse(l); ((data[t] ??= {})[r.deck] ??= []).push(r); }
const states = TREES.filter(([t]) => data[t]);
const decks = DECKS.filter(d => states.some(([t]) => data[t][d.id]));
const label = d => d.name + (d.order ? ` <small>(${d.order})</small>` : '');
const total = states.reduce((n, [t]) => n + Object.values(data[t]).reduce((a, R) => a + R.length, 0), 0);
const perCell = (() => { const R = data[states[0][0]][decks[0].id]; return R ? R.length : 0; })();
let html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${title}</title><style>
@page{size:A4 landscape;margin:12mm}body{font-family:"DejaVu Sans",Arial,sans-serif;color:#1b2430;margin:0;font-size:9pt}h1{font-size:15pt;color:#12324a;border-bottom:2px solid #c9a24a;padding-bottom:4px}
h2{font-size:12pt;color:#12324a;margin:14px 0 6px;page-break-before:always}h2.first{page-break-before:auto}h3{font-size:10pt;color:#12324a;margin:10px 0 4px}p{margin:4px 0}
table{border-collapse:collapse;width:100%;font-size:7.6pt}th,td{border:1px solid #c8d0d8;padding:2px 4px;text-align:center}th{background:#e9eef3}td.n{text-align:left;white-space:nowrap}tr.avg td{font-weight:bold;border-top:2px solid #12324a}
.half{display:inline-block;vertical-align:top;width:49%}
</style></head><body><h1>${title}</h1>
<p><b>Estado medido:</b> ${note}</p>
<p>Jogador simulado competente (joga no nível da IA do jogo; um humano tende a ir melhor). ${perCell} runs por deck e por estado de árvore (${total.toLocaleString('pt-BR')} runs). Margem por deck de cerca de ±${Math.round(98 / Math.sqrt(perCell || 1))} pontos; a média é bem mais precisa.</p>
<p>Cada célula: porcentagem das runs que <b>venceram até aquele ponto</b>. A última coluna é a chance de vencer a run. O simulador ainda compra nós com o XP ganho depois de cada boss (regra publicada), então o estado da árvore é o do início da run.</p>`;
// summary page
html += `<h2 class="first">Resumo: média dos decks por estado de árvore</h2><table><tr><th>Estado da árvore</th>${CP.map(c => `<th>${c[1]}</th>`).join('')}<th>Vitória ± margem</th></tr>`;
for (const [t, name] of states) { const all = decks.flatMap(d => data[t][d.id] || []); html += `<tr><td class="n">${name}</td>${CP.map(([k]) => { const p = alive(all, k); return `<td style="background:${color(p)}">${pct(p)}</td>`; }).join('')}<td>${pct(win(all))} ±${ci(all)}</td></tr>`; }
html += `</table>`;
// deaths and XP
html += `<div class="half"><h3>Onde as runs terminam (derrotas)</h3><table><tr><th>Estado</th><th>Mapa 1 lutas</th><th>Mapa 1 boss</th><th>Mapa 2 lutas</th><th>Mapa 2 boss</th><th>Mapa 3 lutas</th><th>Mapa 3 boss</th></tr>`;
for (const [t, name] of states) { const all = decks.flatMap(d => data[t][d.id] || []), n = all.length, c = Array(6).fill(0);
  for (const r of all) if (r.result !== 'victory' && r.deathAt) c[(r.act - 1) * 2 + (r.deathAt.type === 'boss' ? 1 : 0)]++;
  html += `<tr><td class="n">${name.split(':')[0]}</td>${c.map(x => `<td>${pct(x / n)}</td>`).join('')}</tr>`; }
html += `</table></div> <div class="half"><h3>Boss que derrota o jogador (todas as derrotas em boss)</h3><table><tr><th>Estado</th><th>Boss</th><th>Derrotas</th></tr>`;
for (const [t, name] of states) { const all = decks.flatMap(d => data[t][d.id] || []), m = {};
  for (const r of all) if (r.result !== 'victory' && r.deathAt?.type === 'boss') { const k = `Mapa ${r.act}: ${r.deathAt.campaign || 'genérico'}${r.deathAt.raid ? ' / ' + r.deathAt.raid : ''}`; m[k] = (m[k] || 0) + 1; }
  const top = Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 4); html += top.map(([k, v], i) => `<tr>${i ? '' : `<td class="n" rowspan="${top.length}">${name.split(':')[0]}</td>`}<td class="n">${k}</td><td>${v}</td></tr>`).join(''); }
html += `</table></div>`;
html += `<h3>XP ganho na run (média por run, regra publicada: luta 2/2/1, boss 4/4/6)</h3><table><tr><th>Estado</th><th>Mapa 1</th><th>Mapa 2</th><th>Mapa 3</th><th>Total</th><th>Runs vencidas: total</th><th>Perdido na derrota (não bancado)</th></tr>`;
for (const [t, name] of states) { const all = decks.flatMap(d => data[t][d.id] || []).filter(r => r.xpFight), n = all.length || 1, m = i => all.reduce((a, r) => a + r.xpFight[i] + r.xpBoss[i], 0) / n;
  const v = all.filter(r => r.result === 'victory'), vt = v.length ? v.reduce((a, r) => a + r.xpFight.reduce((x, y) => x + y) + r.xpBoss.reduce((x, y) => x + y), 0) / v.length : 0;
  const lost = all.filter(r => r.result !== 'victory').reduce((a, r) => a + r.xpFight[r.act - 1] + r.xpBoss[r.act - 1], 0) / n;
  html += `<tr><td class="n">${name.split(':')[0]}</td><td>${m(0).toFixed(1)}</td><td>${m(1).toFixed(1)}</td><td>${m(2).toFixed(1)}</td><td>${(m(0) + m(1) + m(2)).toFixed(1)}</td><td>${vt.toFixed(1)}</td><td>${lost.toFixed(1)}</td></tr>`; }
html += `</table>`;
// win by deck across states
html += `<h2>Chance de vencer a run, por deck e estado de árvore</h2><table><tr><th>Deck</th>${states.map(([t, n]) => `<th>${n.split(':')[0].replace('Árvore ', '')}</th>`).join('')}</tr>`;
const tot = states.map(() => []);
for (const d of decks) html += `<tr><td class="n">${label(d)}</td>${states.map(([t], i) => { const R = data[t][d.id]; if (!R) return '<td>—</td>'; tot[i].push(...R); const p = win(R); return `<td style="background:${color(p)}">${pct(p)}</td>`; }).join('')}</tr>`;
html += `<tr class="avg"><td class="n">Média</td>${tot.map(R => `<td>${R.length ? pct(win(R)) : '—'}</td>`).join('')}</tr></table>`;
// one page per tree state
for (const [t, name] of states) {
  html += `<h2>${name}</h2><table><tr><th>Deck</th>${CP.map(c => `<th>${c[1]}</th>`).join('')}</tr>`; const all = [];
  for (const d of decks) { const R = data[t][d.id]; if (!R) continue; all.push(...R); html += `<tr><td class="n">${label(d)}</td>${CP.map(([k]) => { const p = alive(R, k); return `<td style="background:${color(p)}">${pct(p)}</td>`; }).join('')}</tr>`; }
  html += `<tr class="avg"><td class="n">Média</td>${CP.map(([k]) => `<td>${pct(alive(all, k))}</td>`).join('')}</tr></table>`;
}
fs.writeFileSync(out, html + '</body></html>');
console.log('wrote', out, total, 'runs');
