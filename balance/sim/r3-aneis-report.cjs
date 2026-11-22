/* Etapa 3: carreiras com custo por anel vs CP3 (mesmos decks e seeds). Uso: node r3-aneis-report.cjs <dir novo> <dir CP3> */
'use strict';
const fs = require('fs'), path = require('path');
const DECKS = ['vanguard', 'fireline', 'corsair', 'blades', 'balanced', 'swift', 'dark_court', 'goblin_horde', 'dawncrest_choir', 'centaur_charge'];
const load = dir => { const C = []; for (const f of fs.readdirSync(dir).filter(f => /^car_.*\.jsonl$/.test(f))) { const d = f.replace(/^car_|_\d+\.jsonl$/g, ''); if (!DECKS.includes(d)) continue; const r = fs.readFileSync(path.join(dir, f), 'utf8').split('\n').filter(Boolean).map(JSON.parse).filter(x => x.run <= 40); if (r.length) C.push(r); } return C; };
const med = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor((s.length - 1) / 2)] : NaN; };
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(p * (s.length - 1))]; };
for (const [name, dir] of [['Anéis', process.argv[2]], ['CP3', process.argv[3]]]) {
  const C = load(dir); if (!C.length) continue;
  const at = k => C.map(c => (c.find(x => x.run === k) || c[c.length - 1]).nodesAfter);
  const fw = C.map(c => (c.find(x => x.result === 'victory') || {}).run || 99), fwN = C.map(c => (c.find(x => x.result === 'victory') || {}).nodesBefore ?? NaN).filter(x => !isNaN(x));
  const full = C.map(c => (c.find(x => x.nodesAfter >= 60) || {}).run || 99);
  console.log(`\n== ${name}: ${C.length} carreiras`);
  console.log('nós ao fim da run (mediana [p10-p90]):', [1, 2, 3, 4, 5, 8, 10, 13, 15, 20, 25, 30, 40].map(k => `r${k} ${med(at(k))} [${pct(at(k), .1)}-${pct(at(k), .9)}]`).join('  '));
  console.log(`1ª vitória: run ${med(fw)} (p10 ${pct(fw, .1)}, p90 ${pct(fw, .9)}) com ${med(fwN)} nós (p10 ${pct(fwN, .1)}, p90 ${pct(fwN, .9)}) | árvore completa: run ${med(full)} (p90 ${pct(full, .9)}; 99 = não completou até a run 40)`);
  const where = k => { const t = {}; for (const c of C) { const x = c.find(y => y.run === k); if (!x) continue; const w = x.result === 'victory' ? 'vitória' : 'mapa ' + x.act; t[w] = (t[w] || 0) + 1; } return Object.entries(t).map(([a, b]) => a + ' ' + Math.round(100 * b / C.length) + '%').join(', '); };
  for (const k of [1, 2, 3, 5, 8, 12]) console.log(` run ${k}: termina em ${where(k)}`);
}
