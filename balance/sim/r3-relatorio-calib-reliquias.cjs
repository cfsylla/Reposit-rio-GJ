/* PDF da calibração das relíquias gerais (Carlos 09/11): passos 2–5, valores finais gravados, conferência 23 nós,
 * parciais por facção e carreiras. Uso: node balance/sim/r3-relatorio-calib-reliquias.cjs <saída.html> */
'use strict';
const fs = require('fs'), path = require('path'), R = 'balance/out/rodada3';
process.env.GJ_ROOT ||= 'game_r3'; delete process.env.GJ_TREE_VARIANT;
const log = console.log; console.log = () => {}; const E = require('./engine.cjs'); console.log = log;
const AR = Object.fromEntries(E.G.ARTIFACTS.map(a => [a.id, a])), RAR = ['comum', 'incomum', 'rara', 'ultra rara'];
const BAND = [[0.8, 1.2], [1.1, 1.5], [1.4, 1.9], [1.8, 2.5]];
const ENMAP = (() => { const m = /const EN=(\{.*?\});/s.exec(fs.readFileSync('game_r3/dist/decks-p3.js', 'utf8')); try { return JSON.parse(m[1]); } catch { return {}; } })();
const DECK = Object.fromEntries(E.G.DECKS.map(d => [d.id, ENMAP[d.name] || d.name])), FAC = Object.fromEntries(E.G.DECKS.map(d => [d.id, d.order === 'blackfang' ? 'Blackfang' : d.order === 'dawncrest' ? 'Dawncrest' : 'Ironbound']));
const jl = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(JSON.parse) : [];
const met = r => ({ v: r.result === 'victory' ? 1 : 0, w: r.wins || 0 });
function delta(dir, file, k, filt = () => true) {
  const base = new Map(jl(path.join(R, dir, 'base_-.jsonl')).map(r => [r.deck + '|' + r.seed, r])); const X = [];
  for (const r of jl(path.join(R, dir, file + '.jsonl'))) { if (!filt(r)) continue; const b = base.get(r.deck + '|' + r.seed); if (b) X.push(met(r)[k] - met(b)[k]); }
  const n = X.length; if (!n) return null; const m = X.reduce((a, b) => a + b, 0) / n, sd = Math.sqrt(X.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, n - 1));
  return { m, e: 1.96 * sd / Math.sqrt(n), n };
}
const STEPS = [['rel2_10', 'antes (valores originais, 20 seeds)'], ['relc2_10', 'passo 2'], ['relc3_10', 'passo 3'], ['relc4_10', 'passo 4'], ['relc5_10', 'passo 5']];
const gold = Object.fromEntries(STEPS.map(([d]) => [d, delta(d, 'ouro35_-', 'w')?.m]));
const POOL = ['relc2_10', 'relc3_10', 'relc4_10', 'relc5_10'].map(d => gold[d]).filter(Boolean), GP = POOL.reduce((a, b) => a + b, 0) / POOL.length;
const IDS = 'banner heart luckycharm bell dormant_sword precision plating execution merchant profane_idol contract colossal_heart recovery ember fang repulsion chain laststand hourglass echo sling'.split(' ');
// passo em que o valor final foi medido
const FINALSTEP = Object.fromEntries(IDS.map(id => [id, ['banner', 'heart', 'profane_idol', 'repulsion', 'laststand'].includes(id) ? 'relc4_10' : id === 'echo' ? 'relc5_10' : 'relc3_10']));
const KNOBS = { banner: ['banner'], heart: ['heart'], luckycharm: ['lucky'], bell: ['bell'], dormant_sword: ['swordBase', 'swordStep', 'swordCap'], precision: ['precisionCrit', 'precisionCharge'], plating: ['platingShield'], execution: ['execution', 'executionCharge'], merchant: ['merchant'], profane_idol: ['idol', 'idolCap'], contract: ['contractElite', 'contractBoss'], colossal_heart: ['colossal'], recovery: ['recovery'], ember: ['emberAtk', 'emberShield'], fang: ['fang'], repulsion: ['repulsionShield', 'repulsionStun'], chain: ['chainCharge'], laststand: ['laststandHp', 'laststandInvuln'], hourglass: ['hourglass'], echo: ['echoRefund'], sling: ['slingDamage', 'slingStun', 'slingDelay', 'slingInvuln'] };
const ORIG = JSON.parse(fs.readFileSync('balance/rodada3/variants/rel_original.json', 'utf8')).relicTune, FIN = JSON.parse(fs.readFileSync('balance/rodada3/variants/rel_final.json', 'utf8')).relicTune;
const SEC = new Set(['repulsionStun', 'laststandInvuln', 'slingStun', 'slingDelay', 'slingInvuln']), INT = new Set(['contractElite', 'contractBoss']);
const fv = (k, v) => v === undefined ? '—' : INT.has(k) ? String(v) : SEC.has(k) ? String(v).replace('.', ',') + ' s' : (Math.round(v * 1000) / 10 + '%').replace('.', ',');
const f2 = x => x == null || isNaN(x) ? '—' : x.toFixed(2).replace('.', ','), f1 = x => x == null ? '—' : (x >= 0 ? '+' : '') + x.toFixed(1).replace('.', ',');
const inBand = (x, r) => x >= BAND[r][0] && x <= BAND[r][1], cls = (x, r) => x == null ? '' : inBand(x, r) ? 'ok' : (x >= BAND[r][0] - .1 && x <= BAND[r][1] + .1) ? 'near' : 'bad';
const FMT = id => { const f = E.G.RELIC_FORMATS[id], c = (E.G.relicShape?.(id) || []).length; return f ? `${f} (${c})` : '—'; };
const FNAME = { dot: 'ponto', domino: 'dominó', line3: 'linha 3', line4: 'linha 4', L3: 'L3', L4: 'L4', L5: 'L5', T: 'T', S: 'S', square: 'quadrado', P: 'P', diag2: 'diagonal 2', diag3: 'diagonal 3', bridge: 'ponte', cross: 'cruz', U: 'U', stairs: 'escada', knight: 'cavalo' };
const FMTPT = id => { const f = E.G.RELIC_FORMATS[id], c = (E.G.relicShape?.(id) || []).length; return f ? `${FNAME[f] || f} (${c})` : '—'; };
let h = ''; const sec = t => { h += `<h2>${t}</h2>`; }, p = t => { h += `<p>${t}</p>`; };
const D = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
h += `<h1>Grand Journey · Relíquias: calibração e valores gravados</h1><p class="sub">${D} · game_r3 · 21 relíquias gerais · régua: × ouro = Δ lutas vencidas (10 nós) ÷ Δ lutas do +35 de ouro, pareado (mesmo deck e seed) · 10 decks de teste × 40 seeds</p>`;
// ---------- resumo
const fin = IDS.map(id => { const d = FINALSTEP[id], w = delta(d, 'rel_' + id, 'w'), r = AR[id].rarity; return { id, r, w, xs: w && w.m / gold[d], xp: w && w.m / GP }; });
const nOk = fin.filter(x => inBand(x.xp, x.r)).length, nOkS = fin.filter(x => inBand(x.xs, x.r)).length;
h += `<div class="box"><b>Resumo</b><ul>
<li>Valores finais <b>gravados no jogo</b> (game_r3/dist/game-0.js e relics-r3.js), arredondados para números apresentáveis (variante <code>rel_final.json</code>).</li>
<li><b>43 relíquias no jogo: 21 gerais calibradas nesta etapa; 22 ficaram fora por decisão do Carlos (09/11) e seguem com os valores de 08/11</b> — lista completa na seção 1b.</li><li><b>${nOk} de 21</b> relíquias na faixa da raridade pela régua média dos passos 2–5 (+35 de ouro = ${f2(GP)} lutas); ${nOkS} de 21 pela régua do próprio passo. A régua do ouro oscilou entre ${f2(Math.min(...POOL))} e ${f2(Math.max(...POOL))} lutas de um passo para outro (±0,6 de margem), por isso a régua média é a referência mais estável.</li>
<li>Conceitos novos aprovados (09/11): Ampulheta começa com a habilidade pronta; Eco Arcano devolve carga em toda habilidade (calibrado para <b>70%</b>); Funda de Cerco com 1 s de atraso, cai invulnerável 1 s, atordoa 1,5 s, sem escudo.</li>
<li><b>Carreiras</b> (seção 6): 1ª vitória na run 15 com 17 nós e árvore completa na run 39 (antes: run 18, 18 nós, árvore não completava até a run 40) — de volta à meta aprovada.</li><li><b>Outros 14 decks</b> (seção 5): mesma ordem geral; com a régua deles (+35 de ouro = 1,29 lutas, mais baixa) as comuns e incomuns ficam um pouco acima da faixa; Eco, Last Stand e as raras de combate ficam na faixa. Blackfang (2 decks) ganha menos com quase todas.</li><li><b>Para decisão:</b> Funda de Cerco e Ampulheta ficam abaixo da faixa por motivo de conceito/simulador (seção 4); Moeda do Mercador e Broche de Recuperação ficaram no teto de valor da calibração.</li></ul></div>`;
// ---------- tabela final
h += `<h2 class="cont">1. Valores finais gravados</h2>`;
h += `<table class="small"><tr><th>Relíquia</th><th>Raridade</th><th>Formato (casas)</th><th>Faixa × ouro</th><th>Valores antes → gravados</th><th>Medido em</th><th>Δ lutas (10 nós)</th><th>× ouro (régua do passo)</th><th>× ouro (régua média)</th></tr>`;
for (const x of fin) { const ks = KNOBS[x.id]; h += `<tr><td class="n">${AR[x.id].name}</td><td>${RAR[x.r]}</td><td>${FMTPT(x.id)}</td><td>${f2(BAND[x.r][0])}–${f2(BAND[x.r][1])}</td><td class="n">${ks.map(k => `${k} ${fv(k, ORIG[k])} → <b>${fv(k, FIN[k])}</b>`).join('<br>')}</td><td>${STEPS.find(s => s[0] === FINALSTEP[x.id])[1]}</td><td>${x.w ? f1(x.w.m) + ' ±' + x.w.e.toFixed(1).replace('.', ',') : '—'}</td><td class="${cls(x.xs, x.r)}">${f2(x.xs)}</td><td class="${cls(x.xp, x.r)}">${f2(x.xp)}</td></tr>`; }
h += `</table><p><small>Medido com os valores antes do arredondamento (diferença de até 0,5 ponto percentual). Verde = na faixa · amarelo = até 0,1 fora · vermelho = fora. Ampulheta antes = 30% da carga; Eco antes = 60% só na primeira habilidade; Funda antes = sem atraso, atordoa 0,5 s.</small></p>`;
h += `<h3>Textos no jogo (PT)</h3><table class="small"><tr><th>Relíquia</th><th>Texto</th></tr>${fin.map(x => `<tr><td class="n">${AR[x.id].name}</td><td class="desc">${AR[x.id].descPT || AR[x.id].desc}</td></tr>`).join('')}</table><p><small>Textos lidos do jogo depois da gravação (montados da tabela de valores).</small></p>`;
// ---------- evolução
sec('1b. As outras 22 relíquias (fora desta calibração, valores de 08/11)');
const OUT = { nicho: ['scope', 'tome', 'boots', 'shield', 'devastator', 'warcry', 'ironroot', 'patience', 'aegis', 'lone', 'amplifier'], coringa: ['houses', 'honor', 'talents'], ordem: ['horde', 'dawn'], inteiro: ['quickstart', 'spark', 'compass', 'travelers_mirror'], estandarte: ['captain_standard'], grimorio: ['grimoire'] };
const WHY = { nicho: 'nicho (sinergia de trait) — não ajustado agora', coringa: 'coringa (+1 membro, valor inteiro)', ordem: 'Totem da Horda / Bênção da Aurora — fora desta etapa', inteiro: 'valor inteiro (energia, opções, upgrade)', estandarte: 'Estandarte do Capitão — depende da escolha da carta', grimorio: 'Grimório — efeito só aparece nas carreiras (XP)' };
const CATPT = { offense: 'Ofensiva', defense: 'Defensiva', rhythm: 'Ritmo', deck: 'Deck e mão', economy: 'Economia', synergy: 'Sinergia' };
const g08 = gold['rel2_10'];
p(`Medição de referência: laboratório de 08/11 depois da proposta (rel2_10: 10 decks de teste, 20 seeds, 10 nós; +35 de ouro = ${f2(g08)} lutas). <b>Atenção:</b> nos 10 decks de teste as relíquias de sinergia só valem para os decks que têm o trait (o resultado médio subestima o nicho), e desde então as relíquias gerais (inclusive as dos inimigos) mudaram, então os números servem só de referência.`);
h += `<table class="small"><tr><th>Relíquia</th><th>Raridade</th><th>Formato (casas)</th><th>Categoria</th><th>Motivo de ficar fora</th><th>Texto atual (PT)</th><th>Δ lutas 08/11</th><th>× ouro 08/11</th></tr>`;
for (const [k, ids] of Object.entries(OUT)) for (const id of ids) { const a = AR[id]; if (!a) continue; const w = delta('rel2_10', 'rel_' + id, 'w'); const x = w && w.m / g08; h += `<tr><td class="n">${a.name}</td><td>${RAR[a.rarity]}</td><td>${FMTPT(id)}</td><td>${CATPT[a.category] || a.category || ''}</td><td class="desc">${WHY[k]}</td><td class="desc">${a.descPT || a.desc}</td><td>${w ? f1(w.m) + ' ±' + w.e.toFixed(1).replace('.', ',') : '—'}</td><td class="${cls(x, a.rarity)}">${w ? f2(x) : '—'}</td></tr>`; }
h += `</table><p><small>Total: 21 calibradas + ${Object.values(OUT).flat().length} fora = ${21 + Object.values(OUT).flat().length} relíquias (o jogo tem ${E.G.ARTIFACTS.length}).</small></p>`;
sec('1c. Formatos na bolsa (4×4 = 16 casas)');
p('Os formatos não fizeram parte desta calibração: são os decididos em 08/11 (proposta, seção 11) e não mudaram. O efeito do formato entra só indiretamente na medição: a relíquia começa equipada e ocupa espaço, então cabem menos relíquias depois (nos testes todas couberam no início; nas runs base, 10–11% das escolhas de relíquia não tinham nenhuma opção que coubesse).');
{ const rows = [0, 1, 2, 3].map(r => { const L = E.G.ARTIFACTS.filter(a => a.rarity === r), cs = L.map(a => (E.G.relicShape?.(a.id) || []).length); return { r, L, avg: cs.reduce((a, b) => a + b, 0) / cs.length, min: Math.min(...cs), max: Math.max(...cs) }; });
  h += `<table class="small"><tr><th>Raridade</th><th>Relíquias</th><th>Casas (média · mín–máx)</th><th>Relíquias e formatos</th></tr>${rows.map(x => `<tr><td>${RAR[x.r]}</td><td>${x.L.length}</td><td>${x.avg.toFixed(1).replace('.', ',')} · ${x.min}–${x.max}</td><td class="desc">${x.L.map(a => `${a.name}: ${FMTPT(a.id)}`).join(' · ')}</td></tr>`).join('')}</table>`;
  const used = new Set(E.G.ARTIFACTS.map(a => E.G.RELIC_FORMATS[a.id])); p(`Formatos em uso: ${[...used].map(f => FNAME[f] || f).join(', ')}. Mapeados sem uso: escada, cavalo.`); }
sec('2. Evolução por passo (× ouro, régua do próprio passo)');
h += `<table class="small"><tr><th>Relíquia</th><th>Raridade</th>${STEPS.map(s => `<th>${s[1]}</th>`).join('')}</tr><tr><td class="n"><i>+35 de ouro (lutas)</i></td><td></td>${STEPS.map(s => `<td>${f2(gold[s[0]])}</td>`).join('')}</tr>`;
for (const id of IDS) { const r = AR[id].rarity; h += `<tr><td class="n">${AR[id].name}</td><td>${RAR[r]}</td>${STEPS.map(([d]) => { const w = delta(d, 'rel_' + id, 'w'); const x = w && w.m / gold[d]; return `<td class="${cls(x, r)}">${w ? f2(x) : ''}</td>`; }).join('')}</tr>`; }
h += `</table><p><small>Passo 4 mediu só Banner, Vital Stone, Profane Idol, Repulsion Seal, Last Stand, Eco e Funda (as demais ficaram com os valores do passo 3). Passo 5 mediu só Eco (70%) e Funda (dano 486%).</small></p>`;
// ---------- 23 nós
sec('3. Conferência com 23 nós (valores finais)');
const g23 = delta('relfinal_23', 'ouro35_-', 'v'), b23 = jl(path.join(R, 'relfinal_23', 'base_-.jsonl'));
if (b23.length) {
  p(`Base: ${b23.length} runs, vitória ${(100 * b23.filter(r => r.result === 'victory').length / b23.length).toFixed(0)}%. +35 de ouro: ${f1(100 * g23.m)} pontos de vitória. Com 23 nós a régua de vitórias é instável (ver passos anteriores); serve para conferir a ordem e se nada ficou absurdo (sem cores de faixa nesta tabela).`);
  h += `<table class="small"><tr><th>Relíquia</th><th>Raridade</th><th>Δ vitória (pts)</th><th>Δ lutas vencidas</th><th>× ouro (vitória)</th></tr>`;
  const rows = IDS.map(id => ({ id, v: delta('relfinal_23', 'rel_' + id, 'v'), w: delta('relfinal_23', 'rel_' + id, 'w') })).filter(x => x.v).sort((a, b) => b.v.m - a.v.m);
  for (const x of rows) { const r = AR[x.id].rarity, xr = x.v.m / g23.m; h += `<tr><td class="n">${AR[x.id].name}</td><td>${RAR[r]}</td><td>${f1(100 * x.v.m)} ±${(100 * x.v.e).toFixed(1).replace('.', ',')}</td><td>${f1(x.w.m)}</td><td>${f2(xr)}</td></tr>`; }
  const sr = delta('relfinal_23', 'semreliquia_-', 'v'); h += `<tr><td class="n"><i>sem relíquias</i></td><td></td><td>${sr ? f1(100 * sr.m) : '—'}</td><td></td><td></td></tr></table>`;
} else p('Conferência com 23 nós não disponível.');
// ---------- conceitos
sec('4. Conceitos novos e o que o simulador mostra');
h += `<table class="small"><tr><th>Relíquia</th><th>O que foi verificado</th><th>Leitura</th></tr>
<tr><td class="n">Combat Hourglass (100%)</td><td class="desc">Todas as unidades com habilidade ativa começam prontas (3 de 3 no teste). Em lutas de teste as habilidades disparam em 0,02 s, antes das linhas se encontrarem.</td><td class="desc">Parte do valor se perde: habilidades de alcance curto saem antes de haver alvo perto. × ouro ~0,6 com 100% (o máximo possível). <b>Para decisão:</b> manter como rara de ritmo, ou mudar o gatilho (ex.: pronta no primeiro contato, ou +X% de dano na primeira habilidade).</td></tr>
<tr><td class="n">Arcane Echo</td><td class="desc">Confirmado: cada habilidade devolve a fração da carga (medido ganho médio de 30% com 30%).</td><td class="desc">30% ≈ sem efeito; 54% → × ouro 1,3–1,6; <b>70% → 2,3–2,7</b> (na faixa pela régua média). Gravado 70%.</td></tr>
<tr><td class="n">Siege Sling</td><td class="desc">Nas runs simuladas o jogador robô quase nunca coloca unidades nos cantos da última linha: 52 arremessos em 261 lutas (~0,2 por luta, máximo 2), e metade das arremessadas morre na luta.</td><td class="desc">× ouro ≈ 0 com 150% e com 486% de dano: o simulador mede o posicionamento do robô, não a relíquia. Gravado o conceito (150%, 1 s, 1 s, 1,5 s). <b>Para decisão:</b> ensinar o robô a montar os cantos quando tem a Funda, ou rever o gatilho (ex.: unidades da última linha inteira).</td></tr>
<tr><td class="n">Merchant’s Coin · Recovery Brooch</td><td class="desc">Chegaram ao teto de valor da calibração (Mercador 50% de desconto; Broche 5%).</td><td class="desc">Abaixo da faixa (Mercador perto). Subir mais exigiria mudar o formato do efeito.</td></tr></table>`;
// ---------- facções
sec('5. Parciais por facção (outros 14 decks, 10 nós)');
const OD = 'relfinal_outros_10', ob = jl(path.join(R, OD, 'base_-.jsonl'));
if (ob.length) {
  const facs = ['Ironbound', 'Blackfang', 'Dawncrest'];
  const g14 = delta(OD, 'ouro35_-', 'w').m;
  p(`Valores finais, ${ob.length} runs base (${[...new Set(ob.map(r => r.deck))].length} decks fora dos 10 de teste, 20 seeds). Por facção mostramos o <b>Δ lutas vencidas</b> (com 2–3 decks a régua do ouro por facção não é confiável: em Blackfang deu negativa). A última coluna é o × ouro dos 14 decks juntos, com a régua deles (+35 de ouro = ${f2(g14)} lutas).`);
  h += `<table class="small"><tr><th>Relíquia</th><th>Raridade</th>${facs.map(f => `<th>${f} · Δ lutas<br><small>${[...new Set(ob.filter(r => FAC[r.deck] === f).map(r => DECK[r.deck]))].join(', ')}</small></th>`).join('')}<th>14 decks · × ouro</th></tr>`;
  h += `<tr><td class="n"><i>+35 de ouro</i></td><td></td>${facs.map(f => { const w = delta(OD, 'ouro35_-', 'w', r => FAC[r.deck] === f); return `<td>${w ? f1(w.m) + ' ±' + w.e.toFixed(1).replace('.', ',') : '—'}</td>`; }).join('')}<td>1,00</td></tr>`;
  for (const id of IDS) { const r = AR[id].rarity; h += `<tr><td class="n">${AR[id].name}</td><td>${RAR[r]}</td>${facs.map(f => { const w = delta(OD, 'rel_' + id, 'w', rr => FAC[rr.deck] === f); return `<td>${w ? f1(w.m) : '—'}</td>`; }).join('')}${(() => { const w = delta(OD, 'rel_' + id, 'w'); const x = w && w.m / g14; return `<td class="${cls(x, r)}">${w ? f2(x) : '—'}</td>`; })()}</tr>`; }
  h += `</table>`;
} else p('Parciais por facção não rodadas nesta etapa.');
// ---------- carreiras
sec('6. Carreiras: a escada com as relíquias novas');
const CR = path.join(R, 'etapa4_car_reliquias_final', 'RELATORIO.txt'), CO = path.join(R, 'etapa4_car_raid_livre', 'RELATORIO.txt');
const first = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n== ')[1]?.split('\n').slice(0, 9).join('\n') : null;
if (fs.existsSync(CR)) { p('10 decks de teste × 4 carreiras × 40 runs, escolha livre de caminho. Comparação com as carreiras de 08/11 (raids ajustadas, relíquias antigas).');
  h += `<table class="small"><tr><th>Antes (08/11, relíquias antigas)</th><th>Agora (relíquias gravadas)</th></tr><tr><td class="desc"><pre>${first(CO)}</pre></td><td class="desc"><pre>${first(CR)}</pre></td></tr></table>`;
} else p('Carreiras não disponíveis.');
sec('7. Notas de método');
h += `<ul><li>Cada relíquia é medida começando a run com ela equipada; o restante da run (lojas, outras relíquias, árvore com 10 nós) é igual ao da base, mesmo deck e seed.</li>
<li>Passo de calibração amortecido: valor × (meta/medido)^0,75, com limites por botão; relíquias já na faixa foram congeladas a partir do passo 4.</li>
<li>As relíquias dos inimigos usam a mesma tabela, então a base de cada passo também muda (por isso a régua do ouro oscila).</li>
<li>Fora desta etapa (decisão do Carlos): relíquias de nicho, Totem da Horda, Bênção da Aurora, valores inteiros (Centelha, Arranque, Bússola, coringa, Espelho), Estandarte do Capitão e Grimório.</li></ul>`;
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>GJ Relíquias calibração</title><style>
body{font-family:"DejaVu Sans",Arial,sans-serif;color:#1b2430;margin:0;font-size:9pt;line-height:1.35}h1{font-size:16pt;color:#12324a;border-bottom:2px solid #c9a24a;padding-bottom:4px;margin:0 0 4px}.sub{color:#556;margin:0 0 10px}
h2{font-size:12.5pt;color:#12324a;margin:6px 0 6px;border-left:4px solid #c9a24a;padding-left:6px;page-break-before:always}h2.cont{page-break-before:avoid;margin-top:14px}h3{font-size:10pt;color:#12324a;margin:10px 0 4px}p{margin:5px 0}
table{border-collapse:collapse;width:100%;margin:4px 0 8px}tr{page-break-inside:avoid}th,td{border:1px solid #c8d0d8;padding:3px 4px;text-align:center}th{background:#e9eef3}
table.small{font-size:8pt}td.n{text-align:left;white-space:nowrap}td.desc{text-align:left;font-size:7.5pt;color:#334}pre{font-size:7pt;white-space:pre-wrap;margin:0}
td.ok{background:#dff1e1}td.near{background:#fbf1cf}td.bad{background:#f7dcdc}small{color:#667}code{font-size:8pt}
.box{background:#f3f6f9;border:1px solid #c8d0d8;border-left:4px solid #12324a;padding:6px 8px;margin:6px 0}</style></head><body>${h}</body></html>`;
fs.writeFileSync(process.argv[2], html); console.log('wrote', process.argv[2]);
