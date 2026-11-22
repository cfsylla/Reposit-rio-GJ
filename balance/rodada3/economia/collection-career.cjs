/* Collection progress per career (economy proposal). Income per run from the simulated careers (balance/out/rodada3/etapa3_car),
 * per-run diamonds by outcome (formula), + daily reward (2 runs per day assumed) + milestones (~1 per 2 runs early, capped 95).
 * All diamonds go to boosters (protected, 5 cards, guaranteed rare+, ultra pity 10, surplus -> fragments -> specific cards).
 * Usage: node collection-career.cjs <boosterPrice> <formula: atual|proposta> <daily per day> */
'use strict';
const fs = require('fs');
const [price = 4, formula = 'proposta', daily = 5] = process.argv.slice(2).map((x, i) => i === 1 ? x : Number(x));
const PER = { atual: { 1: 7.9, 2: 18.2, 3: 30.8, 4: 37.4 }, proposta: { 1: 5.6, 2: 13.3, 3: 22.0, 4: 27.4 } }[formula];
const d = 'balance/out/rodada3/etapa3_car', C = fs.readdirSync(d).filter(f => /^car_.*jsonl$/.test(f)).map(f => fs.readFileSync(d + '/' + f, 'utf8').trim().split('\n').map(JSON.parse));
const N = [24, 28, 21, 21], COP = 4, TOTAL = N.reduce((a, b) => a + b) * COP, W = [.62, .25, .10, .03], DUST = [1, 2, 5, 10], CRAFT = [5, 10, 25, 50];
let seed = 7; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
function career(rows) {
  const own = N.map(n => Array(n).fill(0)); let dia = 0, dust = 0, since = 0, owned = 0; const pct = [];
  for (let k = 0; k < 60; k++) { const r = rows[Math.min(k, rows.length - 1)]; dia += PER[r.result === 'victory' ? 4 : r.act] + daily / 2 + (k < 95 * 2 ? .5 : 0);
    while (dia >= price && owned < TOTAL) { dia -= price; let ult = false;
      for (let s = 0; s < 5; s++) { let x = rnd(), a = 0, t = 3; for (let i = 0; i < 4; i++) { a += W[i]; if (x < a) { t = i; break; } }
        if (s === 4 && t < 2) t = 2; if (s === 4 && since >= 9 && !ult) t = 3; if (t === 3) ult = true;
        const open = own[t].map((c, i) => i).filter(i => own[t][i] < COP); if (open.length) { own[t][open[Math.floor(rnd() * open.length)]]++; owned++; } else dust += DUST[t]; }
      since = ult ? 0 : since + 1;
      for (let t = 3; t >= 0; t--) for (let i = 0; i < N[t]; i++) while (own[t][i] < COP && dust >= CRAFT[t]) { dust -= CRAFT[t]; own[t][i]++; owned++; } }
    pct.push(owned / TOTAL); }
  return pct;
}
const P = C.map(career), med = k => { const v = P.map(p => p[k]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
const done = P.map(p => { const i = p.findIndex(x => x >= 1); return i < 0 ? 61 : i + 1; }).sort((a, b) => a - b);
console.log(`booster ${price} diamantes, fórmula ${formula}, diária ${daily}/dia | coleção (mediana): run 5 ${Math.round(100 * med(4))}%, run 10 ${Math.round(100 * med(9))}%, run 20 ${Math.round(100 * med(19))}%, run 30 ${Math.round(100 * med(29))}%, run 40 ${Math.round(100 * med(39))}% | completa na run ${done[Math.floor(done.length / 2)]} (p10 ${done[Math.floor(done.length * .1)]}, p90 ${done[Math.floor(done.length * .9)]})`);
