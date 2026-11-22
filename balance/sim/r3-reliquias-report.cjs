/* Relatório do laboratório de relíquias (parciais). Uso: node r3-reliquias-report.cjs <dir> [<dir> ...]
 * Pareado com a base (mesmo deck e seed): Δ vitória (pontos), Δ lutas vencidas, Δ chega ao mapa 2 / 3.
 * Também: sem relíquias, +35 de ouro, e ofertas de relíquia sem espaço na bolsa (runs base). */
'use strict';
const fs = require('fs'), path = require('path');
process.env.GJ_ROOT ||= 'game_r3';
const log = console.log; console.log = () => {}; const E = require('./engine.cjs'); console.log = log;
const AR = Object.fromEntries(E.G.ARTIFACTS.map(a => [a.id, a]));
const RAR = ['comum', 'incomum', 'rara', 'ultra'];
const jl = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(JSON.parse) : [];
const met = r => ({ v: r.result === 'victory' ? 1 : 0, w: r.wins || 0, m2: r.result === 'victory' || (r.deathAt?.act ?? 0) >= 2 ? 1 : 0, m3: r.result === 'victory' || (r.deathAt?.act ?? 0) >= 3 ? 1 : 0 });
for (const dir of process.argv.slice(2)) {
  const base = Object.fromEntries(jl(path.join(dir, 'base_-.jsonl')).map(r => [r.deck + '|' + r.seed, met(r)]));
  const nb = Object.keys(base).length; if (!nb) { console.log(dir, 'sem base ainda'); continue; }
  const avg = k => Object.values(base).reduce((a, x) => a + x[k], 0) / nb;
  console.log(`\n=== ${dir} | base: ${nb} runs, vitória ${(100 * avg('v')).toFixed(0)}%, lutas vencidas ${avg('w').toFixed(1)}, chega M2 ${(100 * avg('m2')).toFixed(0)}%, M3 ${(100 * avg('m3')).toFixed(0)}%`);
  const B = jl(path.join(dir, 'base_-.jsonl')), off = B.reduce((a, r) => a + (r.relicOffers || 0), 0), nf = B.reduce((a, r) => a + (r.relicNoFit || 0), 0);
  console.log(`bolsa (runs base): ${off} escolhas de relíquia, ${nf} sem nenhuma opção que coubesse (${off ? (100 * nf / off).toFixed(0) : 0}%); relíquias ao fim da run: ${(B.reduce((a, r) => a + (r.relics?.length || 0), 0) / B.length).toFixed(1)}`);
  const rows = [];
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.jsonl') && f !== 'base_-.jsonl')) {
    const R = jl(path.join(dir, f)); if (!R.length) continue;
    const id = f.replace('.jsonl', '').replace(/^rel_/, '').replace(/_-$/, '');
    const d = { v: [], w: [], m2: [], m3: [] }; let fail = 0;
    for (const r of R) { const b = base[r.deck + '|' + r.seed]; if (!b) continue; if (String(r.forcedRelic || '').startsWith('nao-coube')) fail++; const m = met(r); for (const k of Object.keys(d)) d[k].push(m[k] - b[k]); }
    const n = d.v.length, mean = a => a.reduce((x, y) => x + y, 0) / a.length, se = a => { const m = mean(a); return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / (a.length - 1) / a.length); };
    rows.push({ id, n, fail, dv: 100 * mean(d.v), ev: 196 * se(d.v), dw: mean(d.w), ew: 1.96 * se(d.w), d2: 100 * mean(d.m2), d3: 100 * mean(d.m3) });
  }
  rows.sort((a, b) => b.dw - a.dw);
  console.log('| Relíquia | Raridade | Preço | Casas | Δ vitória (pts) | Δ lutas vencidas | Δ chega M2 | Δ chega M3 | n | não coube |');
  console.log('|---|---|---|---|---|---|---|---|---|---|');
  for (const r of rows) { const a = AR[r.id]; console.log(`| ${a ? a.name || r.id : r.id === 'semreliquia' ? '**SEM RELÍQUIAS**' : r.id === 'ouro35' ? '**+35 de ouro**' : r.id} | ${a ? RAR[a.rarity] : ''} | ${a ? a.price : ''} | ${a ? a.shape : ''} | ${r.dv >= 0 ? '+' : ''}${r.dv.toFixed(1)} ±${r.ev.toFixed(1)} | ${r.dw >= 0 ? '+' : ''}${r.dw.toFixed(2)} ±${r.ew.toFixed(2)} | ${r.d2 >= 0 ? '+' : ''}${r.d2.toFixed(0)} | ${r.d3 >= 0 ? '+' : ''}${r.d3.toFixed(0)} | ${r.n} | ${r.fail || ''} |`); }
}
