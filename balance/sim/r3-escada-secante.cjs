/* Etapa 4: passo de secante entre duas iterações (mesmas metas do r3-escada-tune.cjs).
 * Para cada barreira: desvio médio de logit (medido - meta) em A e em B -> interpola ln(k) para desvio 0.
 * Uso: node r3-escada-secante.cjs <dirA> <varA.json> <dirB> <varB.json> <próxima.json> */
'use strict';
const fs = require('fs'), path = require('path');
const [dA, vA, dB, vB, nextF] = process.argv.slice(2);
const src = fs.readFileSync(path.join(__dirname, 'r3-escada-tune.cjs'), 'utf8');
const META = eval('(' + /const META = (\{[\s\S]*?\n\});/.exec(src)[1] + ')');
const ORD = ['blackfang', 'dawncrest'];
const kind = (f, i) => f.type === 'boss' ? 'boss' : ORD.includes(f.campaign) ? 'ordem' : (f.raid || f.campaign === 'monsters') ? 'raid' : (f.act >= 2 && i < 2) ? 'entrada' : 'comuns';
const logit = p => { p = Math.min(.99, Math.max(.01, p)); return Math.log(p / (1 - p)); };
function cells(dir) { const cell = {}; for (const f of fs.readdirSync(dir).filter(f => /^m1\.0_.*\.jsonl$/.test(f))) { const n = f === 'm1.0_none.jsonl' ? 0 : Number(/nodes(\d+)/.exec(f)[1]);
  for (const l of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) { if (!l.trim()) continue; const r = JSON.parse(l), idx = {}; for (const x of r.fights) { if (x.event) continue; const i = idx[x.act] = (idx[x.act] ?? -1) + 1; const k = x.act + ':' + kind(x, i) + '|' + n; const o = (cell[k] ??= { n: 0, w: 0 }); o.n++; if (x.result === 'win') o.w++; } } } return cell; }
// desvio só nos estados presentes nas duas iterações com amostra suficiente
function dev(cA, cB, bar) { let a = 0, b = 0, w = 0; const det = []; for (const [n, t] of Object.entries(META[bar])) { const x = cA[bar + '|' + n], y = cB[bar + '|' + n]; if (!x || !y || x.n < 15 || y.n < 15) continue; const m = Math.min(x.n, y.n); a += m * (logit(x.w / x.n) - logit(t / 100)); b += m * (logit(y.w / y.n) - logit(t / 100)); w += m; det.push(`${n}n ${Math.round(100 * x.w / x.n)}->${Math.round(100 * y.w / y.n)}/${t}`); } return w ? { a: a / w, b: b / w, det } : null; }
const A = JSON.parse(fs.readFileSync(vA, 'utf8')), B = JSON.parse(fs.readFileSync(vB, 'utf8')), cA = cells(dA), cB = cells(dB);
const get = (V, bar) => { const a = Number(bar[0]) - 1; if (bar.endsWith(':boss')) return (V.barrierTune?.boss || [1, 1, 1])[a]; const key = bar.includes('ordem') ? 'order' : 'entrance'; return (V.barrierTune || { order: [1, 1, 1], entrance: [1, 1, 1] })[key][a]; };
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const N = JSON.parse(JSON.stringify(B)), rep = [];
for (const bar of Object.keys(META).filter(b => !ONLY || ONLY.includes(b))) {
  const d = dev(cA, cB, bar), ka = get(A, bar), kb = get(B, bar); if (!d) { rep.push(bar + ' sem dados'); continue; }
  let lk; if (Math.abs(Math.log(kb / ka)) > 1e-6 && Math.abs(d.b - d.a) > .05) lk = Math.log(kb) - d.b * (Math.log(kb) - Math.log(ka)) / (d.b - d.a); else lk = Math.log(kb) + d.b / 2.5;
  lk = Math.min(Math.log(kb) + .25, Math.max(Math.log(kb) - .25, lk)); const k = +Math.exp(lk).toFixed(3);
  const a = Number(bar[0]) - 1; if (bar.endsWith(':boss')) (N.barrierTune.boss ??= [1, 1, 1])[a] = k; else N.barrierTune[bar.includes('ordem') ? 'order' : 'entrance'][a] = k;
  rep.push(`${bar.padEnd(10)} ${d.det.join('  ')} | desvio ${d.a.toFixed(2)} -> ${d.b.toFixed(2)} | k ${ka} -> ${kb} -> ${k}`);
}
N.note = 'etapa 4 secante ' + new Date().toISOString(); fs.writeFileSync(nextF, JSON.stringify(N, null, 1)); console.log(rep.join('\n'));
