/* Re-syncs deck contents (counts/ids/faces/startRelic) of game/dist/decks-p3.js from balance/decks/decks_P3_final.json. */
const fs = require('fs'), p = 'game/dist/decks-p3.js'; let s = fs.readFileSync(p, 'utf8');
const F = JSON.parse(fs.readFileSync('balance/decks/decks_P3_final.json')).decks;
const i = s.indexOf('const DECKS=') + 'const DECKS='.length, j = s.indexOf(';\nconst EN=');
const D = JSON.parse(s.slice(i, j));
for (const d of D) { const f = F.find(x => x.id === d.id); d.counts = f.counts; d.ids = Object.entries(f.counts).sort((a, b) => b[1] - a[1]).map(x => x[0]); d.faces = d.ids.slice(0, 3); d.startRelic = f.startRelic; }
s = s.slice(0, i) + JSON.stringify(D) + s.slice(j); fs.writeFileSync(p, s); console.log('synced', D.length);
