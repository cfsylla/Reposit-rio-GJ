/* Summaries of full-run JSONL output. Usage: node balance/sim/summarize.cjs file.jsonl [file2.jsonl ...] */
'use strict';
const fs = require('node:fs');
const rows = process.argv.slice(2).flatMap(f => fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l)));
const pct = (a, b) => b ? (100 * a / b).toFixed(0) + '%' : '-';
const by = (arr, k) => arr.reduce((m, x) => ((m[k(x)] ??= []).push(x), m), {});
console.log('runs', rows.length, 'policy', JSON.stringify(rows[0]?.policy));
const res = by(rows, r => r.result); console.log('results', Object.fromEntries(Object.entries(res).map(([k, v]) => [k, v.length])));
// Progress: path fights won (27 = full run)
const reach = n => rows.filter(r => r.wins >= n).length;
console.log('cleared act1 (>=9 wins):', pct(reach(9), rows.length), ' act2 (>=18):', pct(reach(18), rows.length), ' victory:', pct(rows.filter(r => r.result === 'victory').length, rows.length));
console.log('\nper deck: runs | mean path wins | act1 clear | act2 clear | victory');
for (const [d, v] of Object.entries(by(rows, r => r.deck))) console.log(d.padEnd(10), v.length, (v.reduce((n, r) => n + r.wins, 0) / v.length).toFixed(1).padStart(5), pct(v.filter(r => r.wins >= 9).length, v.length).padStart(5), pct(v.filter(r => r.wins >= 18).length, v.length).padStart(5), pct(v.filter(r => r.result === 'victory').length, v.length).padStart(5));
// Fight-level: win rate by act x type (encounter level; a 'loss' ends the run)
console.log('\nencounters: act/type -> played, lost (run-ending), loss rate');
const fights = rows.flatMap(r => r.fights.map(f => ({ ...f, deck: r.deck })));
const key = f => f.act + ' ' + (f.event ? 'event-' : '') + (f.type === 'elite' ? (f.campaign ? 'order-' + f.campaign : 'elite') : f.type === 'boss' ? 'boss-' + (f.campaign || 'default') : f.type);
for (const [k, v] of Object.entries(by(fights, key)).sort()) { const lost = v.filter(f => f.result === 'loss').length; console.log(k.padEnd(26), String(v.length).padStart(4), String(lost).padStart(4), pct(lost, v.length).padStart(5), ' roundsLost/played', (v.reduce((n, f) => n + f.rounds.filter(x => x.r === 'loss').length, 0) / v.length).toFixed(2), '/', (v.reduce((n, f) => n + f.rounds.length, 0) / v.length).toFixed(2)); }
console.log('\ndeath location by act:layer');
const deaths = by(rows.filter(r => r.deathAt), r => r.deathAt.act + ':' + String(r.deathAt.layer).padStart(2, '0') + ' ' + r.deathAt.type + (r.deathAt.campaign ? '/' + r.deathAt.campaign : ''));
for (const [k, v] of Object.entries(deaths).sort()) console.log(k.padEnd(28), v.length);
console.log('\neconomy (mean): goldIn', (rows.reduce((n, r) => n + r.goldIn, 0) / rows.length).toFixed(0), 'goldEnd', (rows.reduce((n, r) => n + r.goldEnd, 0) / rows.length).toFixed(0),
  'spent', JSON.stringify(Object.fromEntries(['upgrade', 'relic', 'card', 'removeCurse'].map(k => [k, (rows.reduce((n, r) => n + (r.spent[k] || 0), 0) / rows.length).toFixed(0)]))));
// player levels vs enemy levels by act (at fight time)
console.log('\nmean levels at fight start (player L1/L2 cards | enemy L1/L2 cards), normal battles:');
for (const [k, v] of Object.entries(by(fights.filter(f => f.type === 'battle' && f.enemyLevels && !f.event), f => f.act + ':' + String(f.layer).padStart(2, '0'))).sort())
  console.log(k, 'n=' + v.length, 'player', (v.reduce((n, f) => n + f.playerLevels[0], 0) / v.length).toFixed(1) + '/' + (v.reduce((n, f) => n + f.playerLevels[1], 0) / v.length).toFixed(1), '| enemy', (v.reduce((n, f) => n + f.enemyLevels[0], 0) / v.length).toFixed(1) + '/' + (v.reduce((n, f) => n + f.enemyLevels[1], 0) / v.length).toFixed(1), '| gold', (v.reduce((n, f) => n + f.gold, 0) / v.length).toFixed(0), 'relics', (v.reduce((n, f) => n + f.relics.length, 0) / v.length).toFixed(1), 'lossRate', pct(v.filter(f => f.result === 'loss').length, v.length));
