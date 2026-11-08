/* PDF consolidado das relíquias (24 decks, 0/10/23 nós). Uso: node balance/sim/r3-relatorio-reliquias.cjs <saída.html> */
'use strict';
const fs = require('fs'), path = require('path'), R = 'balance/out/rodada3';
process.env.GJ_ROOT ||= 'game_r3';
const log = console.log; console.log = () => {}; const E = require('./engine.cjs'); console.log = log;
const ENMAP = (() => { const m = /const EN=(\{.*?\});/s.exec(fs.readFileSync('game_r3/dist/decks-p3.js', 'utf8')); try { return JSON.parse(m[1]); } catch { return {}; } })();
const DECK = Object.fromEntries(E.G.DECKS.map(d => [d.id, ENMAP[d.name] || d.name])), FAC = Object.fromEntries(E.G.DECKS.map(d => [d.id, d.order === 'blackfang' ? 'Blackfang' : d.order === 'dawncrest' ? 'Dawncrest' : 'Ironbound']));
const AR = Object.fromEntries(E.G.ARTIFACTS.map(a => [a.id, a])), RAR = ['comum', 'incomum', 'rara', 'ultra rara'];
const DESC = a => typeof a.desc === 'string' ? a.desc : (a.desc?.pt || a.desc?.en || '');
const jl = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(JSON.parse) : [];
const PFX = process.env.PREFIX || 'rel'; // rel = medição de 08/11 (25 relíquias); rel2 = depois da proposta (43)
const TREES = ['0', '10', '23'].map(t => [t, ['', '_ib', '_bf', '_dc'].map(f => PFX + f + '_' + t)]);
const met = r => ({ v: r.result === 'victory' ? 1 : 0, w: r.wins || 0, m2: r.result === 'victory' || (r.deathAt?.act ?? 0) >= 2 ? 1 : 0, m3: r.result === 'victory' || (r.deathAt?.act ?? 0) >= 3 ? 1 : 0 });
const load = (dirs, file) => dirs.flatMap(d => jl(path.join(R, d, file)));
const D = {}; // D[tree] = { base: Map, cfg: { id: [records] } }
for (const [t, dirs] of TREES) { const base = new Map(load(dirs, 'base_-.jsonl').map(r => [r.deck + '|' + r.seed, r])); const cfg = {};
  const files = new Set(dirs.flatMap(d => fs.existsSync(path.join(R, d)) ? fs.readdirSync(path.join(R, d)).filter(f => f.endsWith('.jsonl') && f !== 'base_-.jsonl') : []));
  for (const f of files) cfg[f.replace('.jsonl', '').replace(/^rel_/, '').replace(/_-$/, '')] = load(dirs, f); D[t] = { base, cfg }; }
const delta = (t, id, k, filt = () => true) => { const X = []; for (const r of D[t].cfg[id] || []) { if (!filt(r)) continue; const b = D[t].base.get(r.deck + '|' + r.seed); if (b) X.push(met(r)[k] - met(b)[k]); } const n = X.length, m = X.reduce((a, b) => a + b, 0) / Math.max(1, n), sd = Math.sqrt(X.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, n - 1)); return { m, e: 1.96 * sd / Math.sqrt(Math.max(1, n)), n }; };
const baseAvg = (t, k) => { const B = [...D[t].base.values()]; return B.reduce((a, r) => a + met(r)[k], 0) / B.length; };
let h = ''; const sec = (t, c = '') => { h += `<h2 class="${c}">${t}</h2>`; }, p = t => { h += `<p>${t}</p>`; };
const table = (head, rows, cls = '') => { h += `<table class="${cls}"><tr>${head.map(x => `<th>${x}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => typeof c === 'object' && c ? `<td style="${c.s || ''}" class="${c.c || ''}">${c.v}</td>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`; };
const sg = (x, d = 1) => (x >= 0 ? '+' : '') + x.toFixed(d);
const col = (x, scale) => `background:hsl(${x >= 0 ? 120 : 0},60%,${Math.max(55, 96 - Math.min(1, Math.abs(x) / scale) * 40)}%)`;
const RELICS = E.G.ARTIFACTS.map(a => a.id);
const gold = { w10: delta('10', 'ouro35', 'w').m, v23: 100 * delta('23', 'ouro35', 'v').m };
const S = RELICS.map(id => ({ id, a: AR[id], w0: delta('0', id, 'w'), w10: delta('10', id, 'w'), v10: delta('10', id, 'v'), v23: delta('23', id, 'v'), w23: delta('23', id, 'w') }));
const score = s => (s.w10.m / Math.max(.1, gold.w10) + 100 * s.v23.m / Math.max(1, gold.v23)) / 2;
const BAND = [[.8, 1.2], [1.1, 1.5], [1.4, 1.9], [1.8, 2.5]]; // faixa × ouro por raridade (Carlos 08/11)
for (const s of S) { s.sc = score(s); s.tier = s.sc >= 1.5 ? 'forte' : s.sc >= .6 ? 'média' : s.sc >= .2 ? 'fraca' : 'nula/negativa'; const [lo, hi] = BAND[s.a.rarity]; s.band = s.sc < lo ? 'abaixo' : s.sc > hi ? 'acima' : 'na faixa'; }
S.sort((a, b) => b.sc - a.sc);
// ---------- capa
const nb = t => D[t].base.size;
h += `<h1>Grand Journey · Relíquias: o que temos hoje</h1><p class="sub">08/11/2026 · game_r3 (escada da etapa 4 + raids ajustadas) · laboratório pareado: o mesmo deck e seed com e sem a relíquia equipada desde o início · 24 decks × 20 seeds × 0/10/23 nós (${nb('0') + nb('10') + nb('23')} runs base + ${Object.keys(D['10'].cfg).length} configurações)</p>`;
const top = S.filter(s => s.tier === 'forte').map(s => s.a.name), bot = S.filter(s => s.tier === 'nula/negativa').map(s => s.a.name);
h += `<div class="box"><b>Resumo.</b> As relíquias pesam muito: sem nenhuma, a vitória com 23 nós cai <b>${sg(100 * delta('23', 'semreliquia', 'v').m, 0)} pontos</b> e, com 10 nós, o jogador vence <b>${sg(delta('10', 'semreliquia', 'w').m)} lutas</b>. Mas a força está concentrada em poucas: <b>${top.join(', ')}</b>. Já <b>${bot.length}</b> das ${S.length} rendem menos que 35 de ouro ou nada. Raridade e preço não acompanham a força, e a bolsa passa a ser limite a partir de ~10 nós.</div>`;
h += `<h3>Achados principais</h3><ol class="dec">
<li><b>Concentração:</b> as relíquias gerais de vida/ataque (Pedra Vital, Colossal Heart, Estandarte) e a <b>Dormant Sword</b> (que vira +12% de ataque) dominam. A Dormant Sword chega a ${sg(100 * S.find(s => s.id === 'dormant_sword').v23.m, 0)} pontos de vitória com 23 nós.</li>
<li><b>Raridade invertida:</b> várias raras e ultra raras ficam entre as piores (Travelers' Mirror, Repulsion Seal, Ampulheta de Combate, Last Stand), e comuns baratas entre as melhores. Ver seção 4.</li>
<li><b>Nicho:</b> Tomo, Botas, Selo de Proteção, Luneta e Profane Idol só rendem no deck certo (seção 5), mas são oferecidas a qualquer deck.</li>
<li><b>Economia:</b> Lucky Charm e Moeda do Mercador não compensam o espaço na bolsa.</li>
<li><b>Captain's Standard:</b> efeito ≈ 0 mesmo com a melhor escolha, porque o jogo já garante uma unidade na primeira mão sem a relíquia. Problema de conceito.</li>
<li><b>Bolsa:</b> a partir de 10 nós, ~1 em cada 4 ou 5 escolhas de relíquia não tem opção que caiba. Uma relíquia fraca ocupa espaço de uma boa, e por isso aparece com valor negativo.</li>
<li><b>Nomes:</b> no jogo, metade das relíquias tem nome em português e metade em inglês.</li></ol>`;
// ---------- 1 peso total
sec('1. Quanto as relíquias pesam (24 decks)', 'first');
table(['Árvore', 'Base: lutas vencidas', 'Base: vitória', 'Sem relíquias: Δ lutas', 'Sem relíquias: Δ vitória', '+35 de ouro: Δ lutas', '+35 de ouro: Δ vitória', 'Relíquias ao fim da run (base)', 'Escolhas sem opção que caiba'], TREES.map(([t]) => { const B = [...D[t].base.values()], off = B.reduce((a, r) => a + (r.relicOffers || 0), 0), nf = B.reduce((a, r) => a + (r.relicNoFit || 0), 0); const nr = delta(t, 'semreliquia', 'w'), nv = delta(t, 'semreliquia', 'v'), gw = delta(t, 'ouro35', 'w'), gv = delta(t, 'ouro35', 'v');
  return [t + ' nós', baseAvg(t, 'w').toFixed(1), Math.round(100 * baseAvg(t, 'v')) + '%', sg(nr.m) + ' ±' + nr.e.toFixed(1), sg(100 * nv.m, 0) + ' ±' + (100 * nv.e).toFixed(0), sg(gw.m) + ' ±' + gw.e.toFixed(1), sg(100 * gv.m, 0) + ' ±' + (100 * gv.e).toFixed(0), (B.reduce((a, r) => a + (r.relics?.length || 0), 0) / B.length).toFixed(1), off ? Math.round(100 * nf / off) + '%' : '—']; }));
p('Com 0 nós quase ninguém vence a run; ali a medida útil é <b>lutas vencidas</b> (avanço). Com 23 nós a medida útil é <b>vitória</b>. "+35 de ouro" é a régua de preço: o que o ouro médio de uma relíquia renderia em cartas e upgrades.');
// ---------- 2 tabela principal
sec('2. Cada relíquia equipada desde o início (pareado, 24 decks × 20 seeds)');
table(['Relíquia', 'Raridade', 'Preço', 'Formato', 'Δ lutas 0 nós', 'Δ lutas 10 nós', 'Δ vitória 10 nós', 'Δ vitória 23 nós', '× ouro', 'Faixa da raridade'], S.map(s => [{ v: s.a.name, c: 'n' }, RAR[s.a.rarity], s.a.price, s.a.shape, { v: sg(s.w0.m, 2), s: col(s.w0.m, 1.5) }, { v: sg(s.w10.m, 2) + ' <small>±' + s.w10.e.toFixed(1) + '</small>', s: col(s.w10.m, 2) }, { v: sg(100 * s.v10.m, 0), s: col(100 * s.v10.m, 8) }, { v: sg(100 * s.v23.m, 0) + ' <small>±' + (100 * s.v23.e).toFixed(0) + '</small>', s: col(100 * s.v23.m, 12) }, s.sc.toFixed(1), { v: s.band + ' <small>(' + BAND[s.a.rarity].join('–') + ')</small>', s: s.band === 'na faixa' ? 'background:#cfe9cf' : s.band === 'acima' ? 'background:#f9e7b0' : 'background:#f6d5c8' }]), 'small');
p(`<b>× ouro</b> = efeito da relíquia dividido pelo efeito de +35 de ouro (média entre lutas com 10 nós e vitória com 23 nós). 1,0 = vale o mesmo que o ouro. Classes: forte ≥ 1,5; média 0,6–1,5; fraca 0,2–0,6; nula/negativa < 0,2. Margem típica: ±1,3 luta (10 nós) e ±8 pontos (23 nós) por relíquia; diferenças menores que isso não são conclusivas.`);
h += '<h3>O que cada relíquia faz</h3>';
table(['Relíquia', 'Efeito (texto do jogo)'], S.map(s => [{ v: s.a.name, c: 'n' }, { v: DESC(s.a), c: 'desc' }]), 'small');
// ---------- 3 por facção
sec('3. Por facção dos decks (Δ lutas com 10 nós · Δ vitória com 23 nós)');
const facs = ['Ironbound', 'Blackfang', 'Dawncrest'];
table(['Relíquia', ...facs.map(f => f + '<br>lutas 10'), ...facs.map(f => f + '<br>vitória 23')], S.map(s => [{ v: s.a.name, c: 'n' }, ...facs.map(f => { const x = delta('10', s.id, 'w', r => FAC[r.deck] === f).m; return { v: sg(x), s: col(x, 2.5) }; }), ...facs.map(f => { const x = 100 * delta('23', s.id, 'v', r => FAC[r.deck] === f).m; return { v: sg(x, 0), s: col(x, 15) }; })]), 'small');
p('Decks por facção: Ironbound 15, Blackfang 4, Dawncrest 5. Com poucos decks por facção (Blackfang, Dawncrest) a margem é maior.');
// ---------- 4 raridade
sec('4. Raridade e preço × força');
table(['Raridade', 'Relíquias', 'Preço', 'Média × ouro', 'Fortes', 'Médias', 'Fracas', 'Nulas/negativas'], [0, 1, 2, 3].map(r => { const X = S.filter(s => s.a.rarity === r); return [RAR[r], X.length, [...new Set(X.map(s => s.a.price))].join('/'), (X.reduce((a, s) => a + s.sc, 0) / X.length).toFixed(2), ...['forte', 'média', 'fraca', 'nula/negativa'].map(t => X.filter(s => s.tier === t).map(s => s.a.name).join(', ') || '—')]; }), 'small');
// ---------- 5 sinergia por deck
sec('5. Sinergia por deck (Δ lutas vencidas, média de 10 e 23 nós)');
const decks = [...new Set([...D['10'].base.values()].map(r => r.deck))].sort((a, b) => FAC[a].localeCompare(FAC[b]) || DECK[a].localeCompare(DECK[b]));
const syn = (id, d) => { const a = delta('10', id, 'w', r => r.deck === d), b = delta('23', id, 'w', r => r.deck === d); return (a.m + b.m) / 2; };
for (const part of [decks.slice(0, 12), decks.slice(12)]) {
  table(['Relíquia', ...part.map(d => `<span class="vert">${DECK[d]}</span>`)], S.map(s => [{ v: s.a.name, c: 'n' }, ...part.map(d => { const x = syn(s.id, d); return { v: sg(x), s: col(x, 3) }; })]), 'tiny');
}
p('Cada célula: 40 runs (20 seeds × 2 árvores), margem de cerca de ±2 lutas. Use para padrões: por exemplo, Tomo forte em decks de conjuradores e Luneta em decks à distância.');
// ---------- 6 bolsa e formato
sec('6. Formato na bolsa');
const shapes = [...new Set(S.map(s => s.a.shape))];
table(['Formato', 'Relíquias', 'Média × ouro'], shapes.map(sh => { const X = S.filter(s => s.a.shape === sh); return [sh, X.map(s => s.a.name).join(', '), (X.reduce((a, s) => a + s.sc, 0) / X.length).toFixed(2)]; }), 'small');
p('O formato não acompanha a força: há relíquias fortes em formatos pequenos (Pedra Vital, dominó) e fracas em formatos grandes (Travelers\' Mirror, quadrado). Com a bolsa apertando a partir de 10 nós, o formato pesa no custo real.');
// ---------- 7 limitações
sec('7. Como ler e limitações');
h += `<ul><li>A relíquia é equipada desde o início da run: mede a força dela ao longo da run inteira, não o momento em que ela aparece para escolha.</li>
<li>O jogador simulado escolhe as outras relíquias por uma lista fixa; o valor negativo de uma relíquia inútil mostra o custo de ocupar a bolsa.</li>
<li>Captain's Standard foi medido com o simulador escolhendo a unidade de maior custo (melhor caso simples).</li>
<li>Relíquias permanentes compradas com diamante e relíquias dos inimigos ficam para depois (economia e desafio Comandantes).</li></ul>`;
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>GJ Relíquias</title><style>
body{font-family:"DejaVu Sans",Arial,sans-serif;color:#1b2430;margin:0;font-size:9pt;line-height:1.35}h1{font-size:16pt;color:#12324a;border-bottom:2px solid #c9a24a;padding-bottom:4px;margin:0 0 4px}.sub{color:#556;margin:0 0 10px}
h2{font-size:12.5pt;color:#12324a;margin:6px 0 6px;border-left:4px solid #c9a24a;padding-left:6px;page-break-before:always}h3{font-size:10pt;color:#12324a;margin:10px 0 4px}p{margin:5px 0}
table{border-collapse:collapse;width:100%;margin:4px 0 8px}tr{page-break-inside:avoid}th,td{border:1px solid #c8d0d8;padding:3px 4px;text-align:center}th{background:#e9eef3}
table.small{font-size:8pt}table.tiny{font-size:6.8pt}table.tiny td,table.tiny th{padding:2px 2px}td.n{text-align:left;white-space:nowrap}td.desc{text-align:left;font-size:7.5pt;color:#334}
.vert{writing-mode:vertical-rl;transform:rotate(180deg);white-space:nowrap;display:inline-block;max-height:90px}small{color:#667}
.box{background:#f3f6f9;border:1px solid #c8d0d8;border-left:4px solid #12324a;padding:6px 8px;margin:6px 0}ol.dec li{margin:3px 0}</style></head><body>${h}</body></html>`;
fs.writeFileSync(process.argv[2], html); console.log('wrote', process.argv[2]);
