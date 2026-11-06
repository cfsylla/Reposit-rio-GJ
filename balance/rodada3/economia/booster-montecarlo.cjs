/* Monte Carlo: boosters needed to complete the playset (4 copies of each of the 94 collectible cards).
 * Collection by rarity (v50): common 24, uncommon 28, rare 21, ultra rare 21. Usage: node booster-montecarlo.cjs */
'use strict';
const N = [24, 28, 21, 21], COPIES = 4, TRIALS = 400;
let seed = 12345; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
function run({ size, weights, guaranteeRare, dupProtect, pityUltra, dustValue, craftCost }) {
  const own = N.map(n => Array(n).fill(0)); let packs = 0, dust = 0, sinceUltra = 0;
  const done = () => own.every(r => r.every(c => c >= COPIES));
  while (!done() && packs < 20000) {
    packs++; let gotUltra = false;
    for (let slot = 0; slot < size; slot++) {
      let r; const x = rnd(); let acc = 0; r = 0; for (let i = 0; i < 4; i++) { acc += weights[i]; if (x < acc) { r = i; break; } r = i; }
      if (guaranteeRare && slot === size - 1 && r < 2) r = 2;
      if (pityUltra && slot === size - 1 && sinceUltra >= pityUltra - 1 && !gotUltra) r = 3;
      if (r === 3) gotUltra = true;
      let pool = own[r].map((c, i) => i); if (dupProtect) { const open = pool.filter(i => own[r][i] < COPIES); if (open.length) pool = open; }
      const i = pool[Math.floor(rnd() * pool.length)];
      if (own[r][i] >= COPIES) dust += dustValue ? dustValue[r] : 0; else own[r][i]++;
    }
    sinceUltra = gotUltra ? 0 : sinceUltra + 1;
    if (craftCost) for (let r = 3; r >= 0; r--) for (let i = 0; i < own[r].length; i++) while (own[r][i] < COPIES && dust >= craftCost[r]) { dust -= craftCost[r]; own[r][i]++; }
  }
  return packs;
}
const med = f => { const v = Array.from({ length: TRIALS }, f).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
const W = [.65, .23, .10, .02];
const cases = {
  'Atual (4 cartas, 65/23/10/2%, sem proteção)': { size: 4, weights: W },
  'Atual + proteção de duplicata': { size: 4, weights: W, dupProtect: true },
  'Proposta: 5 cartas, 1 rara+ garantida, proteção, garantia de ultra a cada 10': { size: 5, weights: [.62, .25, .10, .03], guaranteeRare: true, dupProtect: true, pityUltra: 10 },
  'Proposta + fragmentos (excedente vira fragmento; cartas compradas por fragmento)': { size: 5, weights: [.62, .25, .10, .03], guaranteeRare: true, dupProtect: true, pityUltra: 10, dustValue: [1, 2, 5, 10], craftCost: [5, 10, 25, 50] },
};
for (const [k, c] of Object.entries(cases)) console.log(k.padEnd(84), 'boosters (mediana):', med(() => run(c)));
