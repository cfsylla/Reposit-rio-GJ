/* Final deck table (markdown). Tournament rows from balance/out/decks_final matrices, with re-tested rows from later rounds. */
'use strict';
const fs = require('fs'); const { G } = require('./engine.cjs');
const D = JSON.parse(fs.readFileSync('balance/decks/decks_P3_final.json')).decks, dir = 'balance/out/decks_final';
const M = fs.readdirSync(dir).filter(f => f.startsWith('matrix_')).flatMap(f => fs.readFileSync(dir + '/' + f, 'utf8').trim().split('\n').map(JSON.parse));
const T = {}; for (const r of M) { (T[r.a] ??= { w: 0, n: 0 }); T[r.a].w += r.wins; T[r.a].n += r.seeds; }
const row = f => { const m = fs.readFileSync(f, 'utf8').trim().split('\n').map(JSON.parse); return { w: m.reduce((n, r) => n + r.wins, 0), n: m.reduce((n, r) => n + r.seeds, 0) }; };
T.vanguard = row('balance/out/decks5/m_v.jsonl'); T.greenskins = row('balance/out/decks5/m_g.jsonl');
T.executioners = row('balance/out/decks6/m_ex_b.jsonl'); T.blades = row('balance/out/decks6/m_bl_b.jsonl'); T.outlaws = row('balance/out/decks6/m_ou_c.jsonl');
const UNLOCK = { vanguard: 'Inicial', balanced: 'Primeiros passos (já existe)', swift: 'Primeiros passos (já existe)', keen: 'Derrotar um elite', fortress: 'Encerrar 3 runs com 5+ nós', verdant: 'Resolver 3 eventos em uma run', outlaws: 'Gastar 30 de ouro em uma run', executioners: 'Vencer 3 confrontos sem perder rodada em uma run', fireline: '3 atiradores diferentes em 3 confrontos', arcane: '3 conjuradores diferentes em 3 confrontos', astral: 'Derrotar o Boss', corsair: 'Derrotar 3 baralhos inimigos diferentes', north: '3 Frostborn diferentes em 3 confrontos', blades: '3 Legends of the East diferentes em 3 confrontos', quake: '**NOVO:** derrotar o boss do mapa 2', greenskins: 'Derrotar o boss Blackfang', goblin_horde: 'Derrotar o boss Blackfang', dark_court: 'Derrotar o true boss Blackfang (Rei Dark Elf)', blackfang_war: 'Derrotar o true boss Blackfang (Rei Dark Elf)', meowri_band: 'Derrotar o boss Dawncrest', high_court: 'Derrotar o boss Dawncrest', forest_guard: 'Derrotar a true boss Dawncrest (Rainha Fada)', centaur_charge: 'Derrotar a true boss Dawncrest (Rainha Fada)', dawncrest_choir: 'Derrotar a true boss Dawncrest (Rainha Fada)' };
const R = id => { const rows = fs.readFileSync(dir + '/new_' + id + '.jsonl', 'utf8').trim().split('\n').map(JSON.parse); return { first: rows.filter(r => r.fights[0].result === 'loss').length / rows.length, wins: rows.reduce((n, r) => n + r.wins, 0) / rows.length }; };
const relic = id => G.ARTIFACTS.find(a => a.id === id)?.name || id;
console.log('| # | Deck | Ideia | Cartas | Relíquia inicial | Desbloqueio | Torneio | Perde a 1ª luta | Lutas vencidas na run (média) |');
console.log('|---|---|---|---|---|---|---|---|---|');
D.forEach((d, i) => { const r = R(d.id), t = T[d.id]; const cards = Object.entries(d.counts).map(([id, n]) => n + '× ' + G.BY[id].name).join(', ');
  console.log(`| ${i + 1} | **${d.name}** (\`${d.id}\`)${d.order ? ' — ' + d.order : ''} | ${d.theme} | ${cards} | ${relic(d.startRelic)} | ${UNLOCK[d.id]} | ${(100 * t.w / t.n).toFixed(0)}% | ${(100 * r.first).toFixed(0)}% | ${r.wins.toFixed(1)} |`); });
const vals = D.map(d => 100 * T[d.id].w / T[d.id].n); console.error('torneio min', Math.min(...vals).toFixed(0), 'max', Math.max(...vals).toFixed(0));
