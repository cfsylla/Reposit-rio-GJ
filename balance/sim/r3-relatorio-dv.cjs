/* Relatório PDF focado em Desafios e Vantagens (somados e isolados), 08/11/2026. Uso: node balance/sim/r3-relatorio-dv.cjs <saída.html> */
'use strict';
const fs = require('fs'), path = require('path'), R = 'balance/out/rodada3';
process.env.GJ_ROOT ||= 'game_r3';
const log = console.log; console.log = () => {}; const E = require('./engine.cjs'); console.log = log;
const CH = E.CH.LIST, AD = E.AD.LIST;
const jl = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(JSON.parse) : [];
const P = x => Math.round(100 * x) + '%', heat = p => `background:hsl(${Math.round(p * 120)},62%,${p > .5 ? 80 : 85}%)`;
let h = ''; const sec = (t, c = '') => { h += `<h2 class="${c}">${t}</h2>`; }, p = t => { h += `<p>${t}</p>`; };
const table = (head, rows, cls = '') => { h += `<table class="${cls}"><tr>${head.map(x => `<th>${x}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => typeof c === 'object' && c ? `<td style="${c.s || ''}" class="${c.c || ''}">${c.v}</td>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`; };
// ---- somados
const TREES = [['nodes23', '23 nós'], ['nodes30', '30 nós'], ['nodes45', '45 nós'], ['nodes60', '60 nós (árvore completa)']];
const CFG = [['base', 'Nada ligado (base)'], ['adv', 'Todas as 15 vantagens'], ['ch5adv', '5 desafios + todas as vantagens'], ['ch10adv', '10 desafios + todas as vantagens'], ['ch15adv', '15 desafios + todas as vantagens'], ['ch15', '15 desafios, sem vantagens']];
const W = {}; for (const [c] of CFG) for (const [t] of TREES) { const L = jl(`${R}/combo/${c}_${t}.jsonl`); W[c + t] = L.length ? L.filter(r => r.result === 'victory').length / L.length : NaN; }
h += `<h1>Grand Journey · Desafios e Vantagens: somados e isolados</h1><p class="sub">08/11/2026 · game_r3 com a escada da etapa 4 (raids ainda como hoje) · jogador simulado no nível da régua humana</p>`;
h += `<div class="box"><b>Em uma frase:</b> com todas as vantagens, os 15 desafios juntos quase não mudam a chance de vencer (${P(W.ch15advnodes23)} contra ${P(W.basenodes23)} com 23 nós; ${P(W.ch15advnodes60)} com a árvore completa). Sem vantagens, os 15 desafios derrubam a vitória para ${P(W.ch15nodes23)} com 23 nós, mas a árvore completa ainda vence ${P(W.ch15nodes60)}.</div>`;
sec('1. Tudo somado: vitória na run (10 decks de teste × 20 seeds = 200 runs por célula)', 'first0');
table(['Configuração', ...TREES.map(t => t[1])], CFG.map(([c, n]) => [{ v: n, c: 'n' }, ...TREES.map(([t]) => isNaN(W[c + t]) ? '' : { v: P(W[c + t]), s: heat(W[c + t]) })]));
p('Desafios acumulados na ordem da lista do jogo: 5 = Veteranos, Tropas Resistentes, Ataques Implacáveis, Comandantes Preparados, Bosses Implacáveis; 10 = + Reforços Inimigos, Fúria das Raids, Mercado Inflacionado, Bolsa Leve, Recursos Escassos; 15 = + Bagagem Limitada, Deck Pesado, Energia Dissipada, Relíquias Escassas, Caminho Amaldiçoado. Margem de cada célula: cerca de ±6 pontos.');
h += '<h3>Efeito de cada bloco (pontos de vitória)</h3>';
const d = (a, b, t) => (100 * (W[a + t] - W[b + t])).toFixed(0);
table(['', ...TREES.map(t => t[1])], [
  ['Todas as vantagens (contra a base)', ...TREES.map(([t]) => '+' + d('adv', 'base', t))],
  ['15 desafios sem vantagens (contra a base)', ...TREES.map(([t]) => d('ch15', 'base', t))],
  ['15 desafios com vantagens (contra só vantagens)', ...TREES.map(([t]) => d('ch15adv', 'adv', t))],
  ['15 desafios + vantagens (contra a base)', ...TREES.map(([t]) => d('ch15adv', 'base', t))],
]);
// ---- isolados e soma
const pg = dir => { const base = Object.fromEntries(jl(`${dir}/none_-.jsonl`).map(r => [r.deck + '|' + r.seed, r.result === 'victory' ? 1 : 0])); const out = { base: Object.values(base).reduce((a, b) => a + b, 0) / Math.max(1, Object.keys(base).length) };
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /^(ch|ad)_.*\.jsonl$/.test(f)) : []) { const X = jl(`${dir}/${f}`), dd = X.map(r => (r.result === 'victory' ? 1 : 0) - (base[r.deck + '|' + r.seed] ?? 0)), n = dd.length, m = dd.reduce((a, b) => a + b, 0) / n, sd = Math.sqrt(dd.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1)); out[f.replace('.jsonl', '')] = { m: 100 * m, e: 196 * sd / Math.sqrt(n) }; } return out; };
const NOW = pg(`${R}/etapa5/pg`), OLD = pg(`${R}/final/pg`);
const sumOf = k => Object.entries(NOW).filter(([x]) => x.startsWith(k + '_')).reduce((a, [, v]) => a + v.m, 0);
sec('2. Soma dos efeitos isolados × efeito real de tudo junto');
table(['', 'Soma dos 15 efeitos isolados (23 nós, 5 decks de triagem)', 'Efeito real de tudo junto (23 nós, 10 decks de teste)'], [
  ['Desafios', sumOf('ch').toFixed(0) + ' pontos', d('ch15', 'base', 'nodes23') + ' pontos'],
  ['Vantagens', '+' + sumOf('ad').toFixed(0) + ' pontos', '+' + d('adv', 'base', 'nodes23') + ' pontos'],
]);
p('Os efeitos não se somam de forma linear: a vitória fica presa entre 0% e 100%. Com a base em ~60–70%, as vantagens só podem subir uns 30 pontos, e os desafios só podem descer uns 65. O efeito real mostra o que o jogador sente com tudo ligado.');
const status = (m, k) => k === 'ch' ? (m <= -5 && m >= -10 ? ['na meta', '#d9efd9'] : m <= -3 && m >= -12 ? ['exceção', '#f9e7b0'] : ['fora', '#f6d5c8']) : (m >= 3 && m <= 7 ? ['na meta', '#d9efd9'] : m >= 1 && m <= 9 ? ['exceção', '#f9e7b0'] : ['fora', '#f6d5c8']);
for (const k of ['ch', 'ad']) {
  sec(k === 'ch' ? '3. Cada desafio sozinho (meta −5 a −10; exceção −3 a −12)' : '4. Cada vantagem sozinha (meta +3 a +7; exceção +1 a +9; Limpeza, Fusão Eficiente e Olho Treinado: negativas aprovadas)');
  p(`Pareado: mesmo deck e mesma seed com e sem o item. 5 decks de triagem × 40 seeds. Base hoje: 23 nós, ${P(NOW.base)}. CP3: 30 nós, ${P(OLD.base)}.`);
  const L = k === 'ch' ? CH : AD, keys = L.map(x => k + '_' + x.id).filter(x => NOW[x]).sort((a, b) => NOW[a].m - NOW[b].m);
  table([k === 'ch' ? 'Desafio' : 'Vantagem', 'O que faz', 'Hoje (23 nós)', 'Situação', 'CP3 (30 nós)'], keys.map(x => { const def = L.find(y => k + '_' + y.id === x), [st, bg] = status(NOW[x].m, k);
    return [{ v: def.pt, c: 'n' }, { v: def.ptDesc, c: 'desc' }, `${NOW[x].m >= 0 ? '+' : ''}${NOW[x].m.toFixed(1)} ±${NOW[x].e.toFixed(1)}`, { v: st, s: 'background:' + bg }, OLD[x] ? `${OLD[x].m >= 0 ? '+' : ''}${OLD[x].m.toFixed(1)}` : '—']; }), 'small');
}
sec('5. Pontos para decidir');
h += `<ol class="dec">
<li><b>Vantagens anulam os desafios.</b> Com todas as vantagens, os 15 desafios juntos tiram só ${-d('ch15adv', 'adv', 'nodes23')} pontos com 23 nós e quase nada com a árvore completa. Qual deve ser a meta de vitória com <b>tudo ligado</b> (15 desafios + todas as vantagens) e árvore completa? Hoje: ${P(W.ch15advnodes60)}.</li>
<li><b>Árvore completa vence quase tudo:</b> ${P(W.ch15nodes60)} mesmo com os 15 desafios e sem vantagens. Os desafios deveriam ser o conteúdo de fim de jogo; hoje eles quase não pesam para quem completou a árvore.</li>
<li><b>Desafios isolados ≈ 0:</b> Veteranos, Reforços Inimigos, Tropas Resistentes, Comandantes Preparados e Deck Pesado. Mexem em inimigos das lutas comuns, que pesam pouco na escada nova.</li>
<li><b>Juros</b> ficou em −1 (sem efeito).</li>
<li>Estes números usam as raids de hoje. Se as raids forem ajustadas, refaço a medição.</li></ol>`;
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>GJ Desafios e Vantagens</title><style>
body{font-family:"DejaVu Sans",Arial,sans-serif;color:#1b2430;margin:0;font-size:9pt;line-height:1.35}h1{font-size:16pt;color:#12324a;border-bottom:2px solid #c9a24a;padding-bottom:4px;margin:0 0 4px}.sub{color:#556;margin:0 0 10px}
h2{font-size:12.5pt;color:#12324a;margin:12px 0 6px;border-left:4px solid #c9a24a;padding-left:6px}h3{font-size:10pt;color:#12324a;margin:10px 0 4px}p{margin:5px 0}
table{border-collapse:collapse;width:100%;margin:4px 0 8px}tr{page-break-inside:avoid}th,td{border:1px solid #c8d0d8;padding:3px 5px;text-align:center}th{background:#e9eef3}
table.small{font-size:8pt}td.n{text-align:left;white-space:nowrap}td.desc{text-align:left;font-size:7.5pt;color:#334}.box{background:#f3f6f9;border:1px solid #c8d0d8;border-left:4px solid #12324a;padding:6px 8px;margin:6px 0}
h2:nth-of-type(3),h2:nth-of-type(4),h2:nth-of-type(5){page-break-before:always}ol.dec li{margin:4px 0}</style></head><body>${h}</body></html>`;
fs.writeFileSync(process.argv[2], html); console.log('wrote', process.argv[2]);
