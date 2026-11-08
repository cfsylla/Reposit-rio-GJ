/* Relatório PDF das etapas 2-5 da rodada 3 (08/11/2026). Uso: node balance/sim/r3-relatorio-pdf.cjs <saída.html>
 * Lê: carreiras (etapa4_car_jogo, etapa5/car, final/car do CP3), matriz 24 decks (etapa5/mat), laboratório de bosses
 * (etapa4_bosslab + etapa4_tb3) e desafios/vantagens (etapa5/pg com 23 nós; final/pg = CP3 com 30 nós). */
'use strict';
const fs = require('fs'), path = require('path');
const R = 'balance/out/rodada3';
process.env.GJ_ROOT ||= 'game_r3';
const log = console.log; console.log = () => {}; const E = require('./engine.cjs'); console.log = log;
// nomes dos decks em inglês (pedido do Carlos 08/11), do mapa EN de decks-p3.js
const ENMAP = (() => { const src = fs.readFileSync(path.join(process.env.GJ_ROOT, 'dist/decks-p3.js'), 'utf8'), m = /const EN=(\{.*?\});/s.exec(src); try { return JSON.parse(m[1]); } catch { return {}; } })();
const DECK = Object.fromEntries(E.G.DECKS.map(d => [d.id, ENMAP[d.name] || d.name]));
const CHN = Object.fromEntries(E.CH.LIST.map(c => [c.id, c.pt])), ADN = Object.fromEntries(E.AD.LIST.map(a => [a.id, a.pt]));
const TEST10 = ['vanguard', 'fireline', 'corsair', 'blades', 'balanced', 'swift', 'dark_court', 'goblin_horde', 'dawncrest_choir', 'centaur_charge'];
const jl = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(JSON.parse) : [];
const med = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor((s.length - 1) / 2)] : NaN; };
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(p * (s.length - 1))]; };
const P = x => Math.round(100 * x) + '%';
const heat = p => `background:hsl(${Math.round(p * 120)},62%,${p > .5 ? 80 : 85}%)`;
const careers = dir => { const C = []; for (const f of fs.readdirSync(dir).filter(f => /^car_.*\.jsonl$/.test(f))) { const r = jl(path.join(dir, f)).filter(x => x.run <= 40); if (r.length) C.push(r.sort((a, b) => a.run - b.run)); } return C; };
const first = c => c.find(r => r.result === 'victory');
const where = r => { if (r.result === 'victory') return 'Vitória'; const d = r.deathAt || {}; const k = d.type === 'boss' ? 'boss' : (d.campaign && d.campaign !== 'monsters') ? 'ordem' : d.raid ? 'raid' : 'lutas'; return `Mapa ${d.act} · ${k}`; };
let h = '';
const sec = (t, cls = '') => { h += `<h2 class="${cls}">${t}</h2>`; };
const table = (head, rows, cls = '') => { h += `<table class="${cls}"><tr>${head.map(x => `<th>${x}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => typeof c === 'object' && c ? `<td style="${c.s || ''}" class="${c.c || ''}">${c.v}</td>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`; };
const p = t => { h += `<p>${t}</p>`; };

// ---------- 1. capa e decisões
h += `<h1>Grand Journey · Rodada 3 pós-playtest · Etapas 2 a 5</h1><p class="sub">08/11/2026 · cópia de teste <b>game_r3</b> · branch ccr-189ed62b-9mch05 · jogador simulado no nível da régua humana (m 1,0 ≈ seu perfil 2)</p>`;
const C10 = careers(`${R}/etapa4_car_jogo`), C24 = careers(`${R}/etapa5/car`), CP3 = careers(`${R}/final/car`).filter(c => TEST10.includes(c[0].deck));
const fw10 = C10.map(c => first(c)?.run || 99), fwN10 = C10.map(c => first(c)?.nodesBefore).filter(x => x != null), fw24 = C24.map(c => first(c)?.run || 99);
const b3 = C10.map(c => { const i = c.findIndex(r => r.result === 'victory'); return (i < 0 ? c : c.slice(0, i)).filter(r => r.deathAt?.act === 3 && r.deathAt?.type === 'boss').length; });
const fullRun = C10.map(c => (c.find(r => r.nodesAfter >= 60) || {}).run || 99);
h += `<div class="box"><b>Resumo.</b> As barreiras agora estão nas lutas de ordem, na entrada dos mapas e nos bosses. Os básicos dos anéis 1 e 2 valem ×3 e há janela da árvore na derrota. Com isso, a 1ª vitória fica na <b>run ${med(fw10)}</b> com <b>${med(fwN10)} nós</b> (10 decks de teste) e na <b>run ${med(fw24)}</b> nos 24 decks.</div>`;
table(['Meta', 'Alvo', 'Resultado', ''], [
  ['1ª vitória (10 decks de teste)', 'runs 13–15', `run ${med(fw10)} (p10 ${pct(fw10, .1)}, p90 ${pct(fw10, .9)})`, { v: '✔', c: 'ok' }],
  ['Nós na 1ª vitória', '16–18', `${med(fwN10)} (p10 ${pct(fwN10, .1)}, p90 ${pct(fwN10, .9)})`, { v: '✔', c: 'ok' }],
  ['1ª vitória (24 decks)', '—', `run ${med(fw24)} (p10 ${pct(fw24, .1)}, p90 ${pct(fw24, .9)})`, { v: '✔', c: 'ok' }],
  ['Derrotas no boss 3 antes da 1ª vitória', '2–3', `${med(b3)} (p25 ${pct(b3, .25)}, p75 ${pct(b3, .75)})`, { v: '⚠ decisão 1', c: 'warn' }],
  ['Árvore completa', '~25–30 (conta dos anéis)', `run ${med(fullRun) === 99 ? '>40' : med(fullRun)}`, { v: '⚠ decisão 2', c: 'warn' }],
]);
h += `<h3>Decisões para você</h3><ol class="dec">
<li><b>Boss 3 derrota só ~1 vez antes da 1ª vitória</b> (meta 2–3). Proposta: boss 3 mais forte e mapas 2/3 um pouco mais fáceis, mantendo a 1ª vitória na mesma run.</li>
<li><b>Árvore completa por volta da run 40.</b> (a) manter (a coleção completa na proposta de economia fica na run ~43; o "zerado" do Hades fica entre as runs 40 e 60); (b) baratear os anéis 3 e 4.</li>
<li><b>Decks com 1ª vitória antes da run 10</b>: ver seção 4. ${DECK.fireline} e ${DECK.dark_court} já eram fortes por decisão. Ajustar ${DECK.astral}, ${DECK.forest_guard} e ${DECK.north}?</li>
<li><b>Desafios e vantagens</b> agora são medidos com 23 nós (59% de vitória). 5 desafios ficaram ≈ 0 (seção 7). Recalibrar?</li>
<li><b>Raids</b> continuam sem ajuste (o simulado vence quase 100% delas; nos seus playtests elas pressionavam).</li></ol>`;

// ---------- 2. mudanças
sec('1. O que mudou no jogo (todas aprovadas)', 'first');
table(['Etapa', 'Mudança', 'Arquivos'], [
  ['1', 'Cura em % da vida de quem cura, ritmo próprio (Fada 2 s, Xamã 3 s, Sacerdotisa 4 s, Harpista 5 s), ±10%; teto por pulso no Titan/True Boss; suportes inimigos não ficam atrás do boss', 'supports-b.js, game-0.js, boss-engine.js'],
  ['3', 'Custo por anel × tipo: anel 1 = 8 · anel 2 = 16 (1ª camada) / 24 básico / 36 especial · anel 3 = 30 / 45 / 53 (milestone) · anel 4 = 32 / 56. Total 1.754; máximo 56 (cabe numa run)', 'tree-data.js'],
  ['4', 'Básicos dos anéis 1 e 2 valem ×3 (ex.: +3% ataque, +9% vida, +6% defesa por nó)', 'tree-data.js'],
  ['4', 'Janela da árvore na derrota, sem penalidade: abre se o XP compra 1 nó; a sobra é perdida; abandonar não abre', 'tree-engine.js, tree-ui.js'],
  ['4', 'Força dos inimigos por barreira (vida e ataque): lutas de ordem ×1,12 / 1,12 / 1,20 · entrada (2 primeiras lutas) dos mapas 2 e 3 ×1,12 / 1,24 · luta de boss inteira ×1,02 / 1,07 / 1,20. Lutas comuns, raids e Titans sem mudança', 'acts-engine.js'],
  ['4', 'True Bosses mais fortes (forma 1 e forma 2): Andarilho ×1,49, Dark Elf ×1,28, Fada ×1,74 sobre a base', 'boss-engine.js'],
]);
p('Validação técnica: validador <b>PASS</b>. A suíte tem os mesmos 18 testes que já falhavam na v50, sem regressão. Testes novos: tree-rings-r3, defeat-window-r3, escada-r3. Expectativas atualizadas em tree-v51 e bosses-v50.');

// ---------- 3. escada nas carreiras
sec('2. Escada de barreiras: onde cada run termina (carreiras, 10 decks × 4 × 40 runs)');
const runs = [1, 2, 3, 4, 5, 6, 8, 10, 12, 13, 15, 18, 20, 25, 30];
const cols = ['Mapa 1 · lutas', 'Mapa 1 · ordem', 'Mapa 1 · boss', 'Mapa 2 · lutas', 'Mapa 2 · ordem', 'Mapa 2 · boss', 'Mapa 3 · lutas', 'Mapa 3 · ordem', 'Mapa 3 · boss', 'Vitória'];
table(['Run', 'Nós no início (mediana)', ...cols.map(c => c.replace(' · ', '<br>'))], runs.map(k => { const X = C10.map(c => c.find(r => r.run === k)).filter(Boolean), t = {}; for (const r of X) { const w = where(r).replace('raid', 'lutas'); t[w] = (t[w] || 0) + 1; }
  return [k, med(X.map(r => r.nodesBefore)), ...cols.map(c => { const v = (t[c] || 0) / X.length; return v ? { v: P(v), s: `background:rgba(200,80,60,${Math.min(.55, v * 1.4)})` } : ''; })]; }), 'small');
p('"lutas" = lutas comuns e elites (no mapa 2 e no mapa 3 inclui a entrada, as 2 primeiras lutas do mapa). Na run 1 ainda não há lutas de ordem; elas aparecem a partir da run 2.');
h += '<h3>Nós por run: escada nova × CP3 (mesmos decks e seeds)</h3>';
const nodesAt = (C, k) => C.map(c => (c.find(r => r.run === k) || c[c.length - 1]).nodesAfter);
table(['', ...[1, 2, 3, 5, 8, 10, 13, 15, 20, 25, 30, 40].map(k => 'run ' + k), '1ª vitória', 'nós na 1ª vitória'], [
  ['Nova (jogo atual)', ...[1, 2, 3, 5, 8, 10, 13, 15, 20, 25, 30, 40].map(k => med(nodesAt(C10, k))), 'run ' + med(fw10), med(fwN10)],
  ['CP3', ...[1, 2, 3, 5, 8, 10, 13, 15, 20, 25, 30, 40].map(k => med(nodesAt(CP3, k))), 'run ' + med(CP3.map(c => first(c)?.run || 99)), med(CP3.map(c => first(c)?.nodesBefore).filter(x => x != null))],
]);
const xpRows = [[1, 1], [2, 3], [4, 6], [7, 10], [11, 15], [16, 20], [21, 30]].map(([a, b]) => { const X = C10.flat().filter(r => r.run >= a && r.run <= b), n = X.length;
  return [`${a}–${b}`, med(X.map(r => r.nodesBefore)), (X.reduce((s, r) => s + r.xpR3.earned, 0) / n).toFixed(0), (X.reduce((s, r) => s + r.xpR3.spent, 0) / n).toFixed(0), P(X.filter(r => r.result === 'victory' || r.deathAt?.act >= 2).length / n), P(X.filter(r => r.result === 'victory' || r.deathAt?.act >= 3).length / n), P(X.filter(r => r.result === 'victory').length / n)]; });
h += '<h3>XP e avanço por faixa de runs</h3>'; table(['Runs', 'Nós no início', 'XP ganho', 'XP gasto', 'Chega ao mapa 2', 'Chega ao mapa 3', 'Vitória'], xpRows);

// ---------- 4. carreiras por deck
sec('3. Carreiras por deck (24 decks × 4 carreiras × 40 runs)');
const byDeck = {}; for (const c of C24) (byDeck[c[0].deck] ??= []).push(c);
const dRows = Object.entries(byDeck).map(([d, cs]) => { const fw = cs.map(c => first(c)?.run || 99), n = cs.map(c => first(c)?.nodesBefore ?? null).filter(x => x != null); return { d, m: med(fw), fw: fw.sort((a, b) => a - b), n: med(n), n10: med(cs.map(c => (c.find(r => r.run === 10) || {}).nodesAfter)) }; }).sort((a, b) => a.m - b.m);
table(['Deck', '1ª vitória (mediana)', 'Cada carreira', 'Nós na 1ª vitória', 'Nós após a run 10', ''], dRows.map(r => [{ v: DECK[r.d] || r.d, c: 'n' }, { v: r.m === 99 ? '>40' : 'run ' + r.m, s: r.m < 10 ? 'background:#f6d5c8' : r.m > 20 ? 'background:#f9e7b0' : 'background:#d9efd9' }, r.fw.map(x => x === 99 ? '>40' : x).join(', '), r.n, r.n10, r.m < 10 ? 'antes da run 10' : r.m > 20 ? 'depois da run 20' : '']));
p(`Todos os decks: mediana run ${med(fw24)} (p10 ${pct(fw24, .1)}, p90 ${pct(fw24, .9)}). Verde: entre as runs 10 e 20. Com 4 carreiras por deck, a margem é de cerca de ±3 runs.`);

// ---------- 5. matriz deck x árvore
const TREES = [['none', '0'], ['nodes4', '4'], ['nodes10', '10'], ['nodes18', '18'], ['nodes23', '23'], ['nodes30', '30'], ['nodes45', '45'], ['nodes60', '60']];
const M = Object.fromEntries(TREES.map(([t]) => [t, jl(`${R}/etapa5/mat/mat_${t}.jsonl`)]));
sec('4. Matriz deck × tamanho da árvore: vitória na run (20 seeds por célula)');
const decks = [...new Set(M.none.map(r => r.deck))];
const dm = (t, d, f) => { const X = M[t].filter(r => r.deck === d); return X.length ? X.filter(f).length / X.length : NaN; };
table(['Deck', ...TREES.map(([, n]) => n + ' nós')], [...decks.sort((a, b) => dm('nodes23', b, r => r.result === 'victory') - dm('nodes23', a, r => r.result === 'victory')).map(d => [{ v: DECK[d] || d, c: 'n' }, ...TREES.map(([t]) => { const v = dm(t, d, r => r.result === 'victory'); return isNaN(v) ? '' : { v: P(v), s: heat(v) }; })]),
  [{ v: '<b>Média</b>', c: 'n' }, ...TREES.map(([t]) => { const v = M[t].filter(r => r.result === 'victory').length / Math.max(1, M[t].length); return { v: '<b>' + P(v) + '</b>', s: heat(v) }; })]], 'small');
h += '<h3>Média dos 24 decks por tamanho da árvore</h3>';
const reach = (t, a) => M[t].filter(r => r.result === 'victory' || (r.deathAt?.act ?? 0) >= a).length / M[t].length;
const passB = (t, a) => { const X = M[t].filter(r => r.fights.some(f => f.act === a && f.type === 'boss')); return X.length ? X.filter(r => r.fights.some(f => f.act === a && f.type === 'boss' && f.result === 'win')).length / X.length : NaN; };
table(['', ...TREES.map(([, n]) => n + ' nós')], [
  ['Chega ao mapa 2', ...TREES.map(([t]) => ({ v: P(reach(t, 2)), s: heat(reach(t, 2)) }))],
  ['Chega ao mapa 3', ...TREES.map(([t]) => ({ v: P(reach(t, 3)), s: heat(reach(t, 3)) }))],
  ['Vence o boss 1 (se chega)', ...TREES.map(([t]) => isNaN(passB(t, 1)) ? '' : { v: P(passB(t, 1)), s: heat(passB(t, 1)) })],
  ['Vence o boss 2 (se chega)', ...TREES.map(([t]) => isNaN(passB(t, 2)) ? '' : { v: P(passB(t, 2)), s: heat(passB(t, 2)) })],
  ['Vence o boss 3 (se chega)', ...TREES.map(([t]) => isNaN(passB(t, 3)) ? '' : { v: P(passB(t, 3)), s: heat(passB(t, 3)) })],
  ['Vitória na run', ...TREES.map(([t]) => { const v = M[t].filter(r => r.result === 'victory').length / M[t].length; return { v: P(v), s: heat(v) }; })],
]);
p('Árvore montada pela ordem fixa de compra do simulador (ataque, vida, defesa, velocidade, depois os mais baratos). O CP3 tinha 58% de vitória com 30 nós; hoje esse nível fica perto dos 23 nós.');

// ---------- 6. barreiras por luta
sec('5. Passagem por tipo de luta e tamanho da árvore (24 decks)');
const ORD = ['blackfang', 'dawncrest'], kind = (f, i) => f.type === 'boss' ? 'boss' : ORD.includes(f.campaign) ? 'ordem' : (f.raid || f.campaign === 'monsters') ? 'raid' : (f.act >= 2 && i < 2) ? 'entrada' : 'comuns';
const KC = []; for (const a of [1, 2, 3]) for (const k of (a === 1 ? ['comuns', 'ordem', 'raid', 'boss'] : ['entrada', 'ordem', 'raid', 'comuns', 'boss'])) KC.push(a + ':' + k);
table(['Nós', ...KC.map(k => `M${k[0]}<br>${k.slice(2)}`)], TREES.map(([t, n]) => { const c = {}; for (const r of M[t]) { const idx = {}; for (const x of r.fights) { if (x.event) continue; const i = idx[x.act] = (idx[x.act] ?? -1) + 1; const k = x.act + ':' + kind(x, i); const o = (c[k] ??= { n: 0, w: 0 }); o.n++; if (x.result === 'win') o.w++; } }
  return [n, ...KC.map(k => c[k] && c[k].n >= 10 ? { v: P(c[k].w / c[k].n), s: heat(c[k].w / c[k].n) } : '')]; }), 'small');
p('Cada célula: lutas vencidas sobre lutas daquele tipo entre as runs que chegaram até ela. "Entrada" são as 2 primeiras lutas do mapa. Uma luta comum com 98% parece fácil, mas o mapa 1 tem umas 6 delas.');

// ---------- 7. True Boss
sec('6. Bosses do mapa 3 e True Bosses (laboratório pareado: o mesmo jogador enfrenta todos)');
const lab = (dir, only) => { const cell = {}; for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.startsWith('lab_') && f.endsWith('.jsonl')) : []) { const tr = /lab_(nodes\d+)_/.exec(f)[1]; for (const r of jl(path.join(dir, f))) for (const x of r.bossLab || []) { if (x.act !== 3 || !/^(win|loss)$/.test(x.res) || (only && !x.trueBoss)) continue; const k = tr + '|' + (x.trueBoss ? 'T' : 'N') + '|' + x.id; const c = (cell[k] ??= { w: 0, n: 0 }); c.n++; if (x.res === 'win') c.w++; } } return cell; };
const LN = lab(`${R}/etapa4_bosslab`), LT = lab(`${R}/etapa4_tb3`, true), LT0 = lab(`${R}/etapa4_bosslab`, true);
const regMean = tr => { const X = Object.entries(LN).filter(([k]) => k.startsWith(tr + '|N|')); return X.reduce((a, [, c]) => a + c.w, 0) / X.reduce((a, [, c]) => a + c.n, 0); };
const tbName = { ib_wayfarer: 'Andarilho (Ironbound)', darkelf: 'Dark Elf (Blackfang)', fairy: 'Fada (Dawncrest)' };
table(['', '18 nós', '23 nós'], [['Média dos bosses comuns do mapa 3', P(regMean('nodes18')), P(regMean('nodes23'))],
  ...Object.keys(tbName).map(id => [tbName[id] + ': antes → depois', `${P(LT0['nodes18|T|' + id].w / LT0['nodes18|T|' + id].n)} → <b>${P(LT['nodes18|T|' + id].w / LT['nodes18|T|' + id].n)}</b>`, `${P(LT0['nodes23|T|' + id].w / LT0['nodes23|T|' + id].n)} → <b>${P(LT['nodes23|T|' + id].w / LT['nodes23|T|' + id].n)}</b>`])]);
p('Meta: True Boss 12 a 15 pontos abaixo da média do boss comum do mapa 3 com a mesma árvore. "Antes" já inclui a correção da etapa 1, que deixou a Fada fácil. A estrutura do encontro não mudou (2 vitórias na forma 1, depois a forma 2, com limite de 5 derrotas).');
h += '<h3>Bosses comuns do mapa 3 (mesmo laboratório)</h3>';
const ids = [...new Set(Object.keys(LN).filter(k => k.includes('|N|')).map(k => k.split('|')[2]))].sort();
table(['Boss', '18 nós', '23 nós'], ids.map(id => [{ v: id.replace('ib_', 'Ironbound: '), c: 'n' }, ...['nodes18', 'nodes23'].map(t => { const c = LN[t + '|N|' + id]; return c ? { v: P(c.w / c.n), s: heat(c.w / c.n) } : ''; })]), 'small');

// ---------- 8. desafios e vantagens
sec('7. Desafios e vantagens: efeito de cada um sozinho (pareado, 5 decks × 40 seeds)');
const pg = (dir, tag) => { const base = Object.fromEntries(jl(`${dir}/none_-.jsonl`).map(r => [r.deck + '|' + r.seed, r.result === 'victory' ? 1 : 0])); const out = { base: Object.values(base).reduce((a, b) => a + b, 0) / Object.keys(base).length };
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /^(ch|ad)_.*\.jsonl$/.test(f)) : []) { const X = jl(`${dir}/${f}`), d = X.map(r => (r.result === 'victory' ? 1 : 0) - (base[r.deck + '|' + r.seed] ?? 0)), n = d.length, m = d.reduce((a, b) => a + b, 0) / n, sd = Math.sqrt(d.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1)); out[f.replace('.jsonl', '')] = { m: 100 * m, e: 196 * sd / Math.sqrt(n) }; } return out; };
const NOW = pg(`${R}/etapa5/pg`), OLD = pg(`${R}/final/pg`);
p(`Base hoje: <b>23 nós</b>, vitória <b>${P(NOW.base)}</b>. CP3: 30 nós, vitória ${P(OLD.base)}. Efeito = vitória com o item menos a base, nas mesmas seeds (pontos). A margem é ±1,96 erro pareado.`);
const status = (m, kind) => kind === 'ch' ? (m <= -5 && m >= -10 ? ['na meta', '#d9efd9'] : m <= -3 && m >= -12 ? ['exceção', '#f9e7b0'] : ['fora', '#f6d5c8']) : (m >= 3 && m <= 7 ? ['na meta', '#d9efd9'] : m >= 1 && m <= 9 ? ['exceção', '#f9e7b0'] : ['fora', '#f6d5c8']);
for (const kind of ['ch', 'ad']) {
  h += `<h3>${kind === 'ch' ? 'Desafios (meta −5 a −10; exceção −3 a −12)' : 'Vantagens (meta +3 a +7; exceção +1 a +9; Limpeza, Fusão Eficiente e Olho Treinado negativas já aprovadas)'}</h3>`;
  const keys = Object.keys(NOW).filter(k => k.startsWith(kind + '_')).sort((a, b) => NOW[a].m - NOW[b].m);
  table([kind === 'ch' ? 'Desafio' : 'Vantagem', 'Descrição', 'Hoje (23 nós)', 'Situação', 'CP3 (30 nós)'], keys.map(k => { const id = k.slice(3), [st, bg] = status(NOW[k].m, kind), def = (kind === 'ch' ? E.CH.LIST : E.AD.LIST).find(x => x.id === id);
    return [{ v: (kind === 'ch' ? CHN : ADN)[id] || id, c: 'n' }, { v: def?.ptDesc || '', c: 'desc' }, `${NOW[k].m >= 0 ? '+' : ''}${NOW[k].m.toFixed(1)} ±${NOW[k].e.toFixed(1)}`, { v: st, s: 'background:' + bg }, OLD[k] ? `${OLD[k].m >= 0 ? '+' : ''}${OLD[k].m.toFixed(1)}` : '—']; }), 'small');
}
p('Com 40 seeds por deck, a margem de cada item é de ±4 a ±9 pontos; diferenças menores que isso não são conclusivas. Os desafios que ficaram ≈ 0 (Veteranos, Reforços, Resistentes, Comandantes, Baralho Pesado) reforçam inimigos das lutas comuns e elites, que agora pesam menos do que as barreiras.');

// ---------- 9. limitações
sec('8. Como ler e limitações');
h += `<ul><li>O jogador simulado joga no nível da IA do jogo; na etapa 2 ele ficou perto do seu perfil 2 nas primeiras runs. Ele não aprende entre runs, e um humano tende a ir melhor.</li>
<li>As carreiras usam o jogo exatamente como está gravado em game_r3, sem variante.</li>
<li>Na matriz, cada célula tem 20 runs (margem de ±20 pontos por deck); as médias dos 24 decks são estáveis (±4).</li>
<li>Fora desta revisão: raids e Titans, Secret Boss, Desafio Final, economia permanente, eventos e maldições.</li></ul>`;

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>GJ Rodada 3 · Etapas 2 a 5</title><style>
body{font-family:"DejaVu Sans",Arial,sans-serif;color:#1b2430;margin:0;font-size:9pt;line-height:1.35}
h1{font-size:16pt;color:#12324a;border-bottom:2px solid #c9a24a;padding-bottom:4px;margin:0 0 4px}.sub{color:#556;margin:0 0 10px}
h2{font-size:12.5pt;color:#12324a;margin:6px 0 6px;page-break-before:always;border-left:4px solid #c9a24a;padding-left:6px}h2.first{page-break-before:always}
h3{font-size:10pt;color:#12324a;margin:10px 0 4px}p{margin:5px 0}
table{border-collapse:collapse;width:100%;margin:4px 0 8px;page-break-inside:auto}tr{page-break-inside:avoid}
th,td{border:1px solid #c8d0d8;padding:3px 5px;text-align:center;vertical-align:middle}th{background:#e9eef3;font-weight:bold}
table.small{font-size:8pt}td.n{text-align:left;white-space:nowrap}td.desc{text-align:left;font-size:7.5pt;color:#334}
td.ok{background:#d9efd9;font-weight:bold}td.warn{background:#f9e7b0;font-weight:bold}
.box{background:#f3f6f9;border:1px solid #c8d0d8;border-left:4px solid #12324a;padding:6px 8px;margin:6px 0}
ol.dec li{margin:3px 0}
</style></head><body>${h}</body></html>`;
fs.writeFileSync(process.argv[2], html); console.log('wrote', process.argv[2]);
