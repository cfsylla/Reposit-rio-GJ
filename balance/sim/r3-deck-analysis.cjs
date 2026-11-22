/* Round 3 deck spread analysis from existing data (no new runs).
 * Usage: node balance/sim/r3-deck-analysis.cjs <careers dir> <matrix dir> [decks.json] */
'use strict';
const fs = require('fs'), path = require('path');
const [cdir, mdir, deckFile = 'balance/decks/decks_CP2.json'] = process.argv.slice(2);
const DK = JSON.parse(fs.readFileSync(deckFile, 'utf8')).decks, by = Object.fromEntries(DK.map(d => [d.id, d]));
const CP2_L25 = { vanguard: 43, balanced: 37, swift: 63, arcane: 43, outlaws: 33, fortress: 43, blades: 67, fireline: 60, astral: 63, corsair: 43, north: 37, verdant: 57, keen: 63, quake: 40, executioners: 50, goblin_horde: 53, greenskins: 43, dark_court: 80, blackfang_war: 57, meowri_band: 60, high_court: 40, forest_guard: 60, centaur_charge: 53, dawncrest_choir: 50 };
const load = f => fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
const car = {}; for (const f of fs.readdirSync(cdir).filter(f => /^car_.*jsonl$/.test(f))) { const r = load(path.join(cdir, f)); (car[r[0].deck] ??= []).push(r); }
const mat = {}; for (const t of ['nodes15', 'nodes30', 'nodes45']) for (const r of load(path.join(mdir, `mat_${t}.jsonl`))) ((mat[r.deck] ??= {})[t] ??= []).push(r);
const med = v => { const a = v.filter(x => x != null).sort((x, y) => x - y); return a.length ? a[Math.floor((a.length - 1) / 2)] : 99; };
const win = R => R.filter(r => r.result === 'victory').length / R.length;
const rows = Object.keys(car).map(d => {
  const fw = med(car[d].map(r => r.find(x => x.result === 'victory')?.run ?? null));
  const R = mat[d].nodes30, dead = R.filter(r => r.result !== 'victory');
  const seg = { m1: 0, b1: 0, m2: 0, b2: 0, m3: 0, b3: 0 }; const killers = {};
  for (const r of dead) { const k = ['m', 'b'][r.deathAt?.type === 'boss' ? 1 : 0] + r.act; seg[k]++; if (r.deathAt?.type === 'boss') { const n = `M${r.act} ${r.deathAt.campaign || '?'}${r.deathAt.raid ? '/' + r.deathAt.raid : ''}`; killers[n] = (killers[n] || 0) + 1; } }
  const top = Object.entries(killers).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k, v]) => k + ' ×' + v).join(', ');
  const dd = by[d]; const counts = Object.entries(dd.counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => v + ' ' + k).join(', ');
  return { d, name: dd.name, order: dd.order || 'comum', fw, w15: win(mat[d].nodes15), w30: win(R), w45: win(mat[d].nodes45), cp2: CP2_L25[d], seg, n: R.length, top, relic: dd.startRelic, counts };
}).sort((a, b) => a.fw - b.fw);
const pc = x => Math.round(100 * x) + '%';
console.log('deck|ordem|1ª vitória (run)|vitória 15n|30n|45n|CP2 nível 25|mortes com 30 nós (M1 lutas/M1 boss/M2/B2/M3/B3)|bosses que mais derrotam|relíquia|composição');
for (const r of rows) console.log([r.name, r.order, r.fw === 99 ? '—' : r.fw, pc(r.w15), pc(r.w30), pc(r.w45), r.cp2 + '%', Object.values(r.seg).join('/'), r.top, r.relic, r.counts].join('|'));
