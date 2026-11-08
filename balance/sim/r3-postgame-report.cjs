/* Paired effect of each Challenge / Advantage alone vs baseline (same deck + seed). Usage: node r3-postgame-report.cjs <dir> */
'use strict';
const fs = require('fs'), path = require('path'); const dir = process.argv[2];
const load = f => fs.readFileSync(path.join(dir, f), 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
const base = Object.fromEntries(load('none_-.jsonl').map(r => [r.deck + '|' + r.seed, r.result === 'victory' ? 1 : 0]));
const bw = Object.values(base).reduce((a, b) => a + b, 0) / Object.keys(base).length;
console.log(`Base (${process.env.TREE_LABEL || "30 nós"}, 5 decks × 40 seeds): vitória ${(100 * bw).toFixed(1)}%  |  efeito = vitória com o item − base (pontos), margem ±1,96 erro pareado`);
const bands = { ch: [-10, -5, -12, -3], ad: [3, 7, 1, 9] };
for (const kind of ['ch', 'ad']) {
  console.log(kind === 'ch' ? '\nDESAFIOS (meta: −5 a −10; exceções −3 a −12)' : '\nVANTAGENS (meta: +3 a +7; exceções +1 a +9; negativas aprovadas: Olho Treinado, Limpeza, Fusão Eficiente)');
  for (const f of fs.readdirSync(dir).filter(f => f.startsWith(kind + '_') && f.endsWith('.jsonl')).sort()) {
    const R = load(f), d = R.map(r => (r.result === 'victory' ? 1 : 0) - (base[r.deck + '|' + r.seed] ?? 0)), n = d.length, m = d.reduce((a, b) => a + b, 0) / n;
    const sd = Math.sqrt(d.reduce((a, x) => a + (x - m) ** 2, 0) / (n - 1)), e = 100 * m, ci = 196 * sd / Math.sqrt(n);
    const [lo, hi, xlo, xhi] = kind === 'ch' ? [-10, -5, -12, -3] : [3, 7, 1, 9];
    const st = e >= lo && e <= hi ? 'na meta' : e >= xlo && e <= xhi ? 'faixa de exceção' : 'FORA';
    console.log(`  ${f.slice(3, -6).padEnd(18)} ${(e >= 0 ? '+' : '') + e.toFixed(1).padStart(5)} ±${ci.toFixed(1)}  ${st}`);
  }
}
