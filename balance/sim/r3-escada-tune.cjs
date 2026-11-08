/* Etapa 4: um passo de calibração da escada. Lê a matriz (r3-regua-run.sh) e move cada barreira para a meta por tamanho de árvore.
 * Modelo: logit(passagem) cai b*ln(k) quando vida e ataque dos inimigos daquela barreira são multiplicados por k.
 * Uso: node r3-escada-tune.cjs <dir> <variante atual.json> <próxima.json> [b=2.5] */
'use strict';
const fs = require('fs'), path = require('path');
const [dir, curF, nextF, bArg = '2.5'] = process.argv.slice(2), b = Number(bArg);
const cur = JSON.parse(fs.readFileSync(curF, 'utf8'));
const BT = cur.barrierTune || { order: [1, 1, 1], entrance: [1, 1, 1], other: [1, 1, 1], entranceFights: 2 };
const BOSS = cur.bossTune || (() => { process.env.GJ_ROOT = process.env.GJ_ROOT || 'game_r3'; delete process.env.GJ_TREE_VARIANT; require('./engine.cjs'); return JSON.parse(JSON.stringify(globalThis.JOURNEY_BOSS_TUNE)); })();
// metas de passagem por luta (%), por nós (Carlos 08/11/2026, escada de barreiras)
const META = {
  '1:ordem': { 0: 80, 2: 84, 4: 88, 7: 92, 10: 95, 13: 97 }, // revisado após carreiras it6 (mapa 1 travava a escada)
  '1:boss': { 0: 40, 2: 50, 4: 60, 7: 72, 10: 85, 13: 90, 18: 95 },
  '2:entrada': { 0: 70, 2: 75, 4: 80, 7: 87, 10: 92, 13: 95 },
  '2:ordem': { 2: 65, 4: 70, 7: 78, 10: 85, 13: 90, 18: 95 },
  '2:boss': { 4: 35, 7: 50, 10: 62, 13: 72, 18: 85, 23: 92 },
  '3:entrada': { 7: 75, 10: 80, 13: 85, 18: 90, 23: 95 },
  '3:ordem': { 10: 65, 13: 72, 18: 80, 23: 88, 28: 93 },
  '3:boss': { 13: 15, 18: 22, 23: 32, 28: 45, 33: 58 },
};
const ORD = ['blackfang', 'dawncrest'];
const kind = (f, i) => f.type === 'boss' ? 'boss' : ORD.includes(f.campaign) ? 'ordem' : (f.raid || f.campaign === 'monsters') ? 'raid' : (f.act >= 2 && i < 2) ? 'entrada' : 'comuns';
const logit = p => { p = Math.min(.99, Math.max(.01, p)); return Math.log(p / (1 - p)); };
const cell = {};
for (const f of fs.readdirSync(dir).filter(f => /^m1\.0_.*\.jsonl$/.test(f))) {
  const n = f === 'm1.0_none.jsonl' ? 0 : Number(/nodes(\d+)/.exec(f)[1]);
  for (const l of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) { if (!l.trim()) continue; const r = JSON.parse(l), idx = {};
    for (const x of r.fights) { if (x.event) continue; const i = idx[x.act] = (idx[x.act] ?? -1) + 1; const k = x.act + ':' + kind(x, i) + '|' + n; const o = (cell[k] ??= { n: 0, w: 0 }); o.n++; if (x.result === 'win') o.w++; } }
}
const clamp = k => Math.min(1.6, Math.max(.7, k)), rep = [];
const knob = { '1:ordem': ['order', 0], '2:ordem': ['order', 1], '3:ordem': ['order', 2], '2:entrada': ['entrance', 1], '3:entrada': ['entrance', 2] };
const next = { barrierTune: JSON.parse(JSON.stringify(BT)), bossTune: JSON.parse(JSON.stringify(BOSS)) };
for (const [bar, meta] of Object.entries(META)) {
  let num = 0, den = 0; const det = [];
  for (const [n, t] of Object.entries(meta)) { const c = cell[bar + '|' + n]; if (!c || c.n < 15) continue; const p = c.w / c.n; det.push(`${n}n ${Math.round(100 * p)}/${t}`); if (p > .995 && t >= 95) continue; num += c.n * (logit(p) - logit(t / 100)); den += c.n; }
  if (!den) { rep.push(`${bar.padEnd(10)} sem dados`); continue; }
  const k = clamp(Math.exp(num / den / b));
  if (bar.endsWith(':boss')) { const a = Number(bar[0]) - 1; next.bossTune.map[a] = +(next.bossTune.map[a] * k).toFixed(3); rep.push(`${bar.padEnd(10)} ${det.join('  ')}  -> boss mapa ${a + 1} x${k.toFixed(3)} = ${next.bossTune.map[a]}`); }
  else { const [key, a] = knob[bar]; next.barrierTune[key][a] = +(next.barrierTune[key][a] * k).toFixed(3); rep.push(`${bar.padEnd(10)} ${det.join('  ')}  -> ${key}[${a + 1}] x${k.toFixed(3)} = ${next.barrierTune[key][a]}`); }
}
fs.writeFileSync(nextF, JSON.stringify({ ...cur, note: 'etapa 4 passo ' + new Date().toISOString(), ...next }, null, 1));
console.log(rep.join('\n'));
