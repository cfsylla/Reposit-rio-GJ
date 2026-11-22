/* Calibração das relíquias (Carlos 09/11): 10 decks de teste, só relíquias gerais (nicho, Estandarte do capitão,
 * valores inteiros, coringa e Grimório ficam fora). × ouro = média de (Δ lutas 10 nós ÷ Δ lutas do +35 de ouro) e
 * (Δ vitória 23 nós ÷ Δ vitória do +35 de ouro). Meta = centro da faixa da raridade. Supõe efeito ≈ proporcional ao valor.
 * Uso: node r3-reliquias-calib.cjs <dir10> <dir23> <tune atual.json|-> <próxima.json> */
'use strict';
const fs = require('fs'), path = require('path');
const [d10, d23, curF, nextF] = process.argv.slice(2);
process.env.GJ_ROOT ||= 'game_r3'; delete process.env.GJ_TREE_VARIANT;
const log = console.log; console.log = () => {}; const E = require('./engine.cjs'); console.log = log;
const RT0 = { ...globalThis.JOURNEY_RELIC_TUNE }, cur = curF && curF !== '-' ? JSON.parse(fs.readFileSync(curF, 'utf8')).relicTune : {};
const RT = { ...RT0, ...cur };
const KNOBS = { banner: ['banner'], heart: ['heart'], luckycharm: ['lucky'], bell: ['bell'], dormant_sword: ['swordBase', 'swordStep', 'swordCap'], precision: ['precisionCrit', 'precisionCharge'], plating: ['platingShield'], execution: ['execution', 'executionCharge'], merchant: ['merchant'], profane_idol: ['idol', 'idolCap'], contract: ['contractElite', 'contractBoss'], colossal_heart: ['colossal'], recovery: ['recovery'], ember: ['emberAtk', 'emberShield'], fang: ['fang'], repulsion: ['repulsionShield', 'repulsionStun'], chain: ['chainCharge'], laststand: ['laststandHp', 'laststandInvuln'], hourglass: [], echo: ['echoRefund'], sling: ['slingDamage'] }; // 09/11: Ampulheta fixa em 100%; Funda com atordoamento 1,5 s e invulnerável 1 s fixos
const LIMIT = { lucky: 1, merchant: .5, hourglass: .8, echoRefund: .7, laststandHp: .8, idolCap: .6, swordCap: .3, precisionCrit: .15, recovery: .05, chainCharge: .6 };
const INT = new Set(['contractElite', 'contractBoss']);
const TARGET = [1.0, 1.3, 1.65, 2.15];
const jl = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(JSON.parse) : [];
const delta = (dir, id, k) => { const base = new Map(jl(path.join(dir, 'base_-.jsonl')).map(r => [r.deck + '|' + r.seed, r])); const f = id.startsWith('_') ? id.slice(1) : 'rel_' + id; const X = jl(path.join(dir, f + '.jsonl')).map(r => { const b = base.get(r.deck + '|' + r.seed); if (!b) return null; return k === 'w' ? (r.wins || 0) - (b.wins || 0) : (r.result === 'victory') - (b.result === 'victory'); }).filter(x => x !== null); return X.reduce((a, b) => a + b, 0) / Math.max(1, X.length); };
const gw = delta(d10, '_ouro35_-', 'w'), gv = delta(d23, '_ouro35_-', 'v');
const next = { ...cur }, rep = [`+35 de ouro: ${gw.toFixed(2)} lutas (10 nós), ${(100 * gv).toFixed(1)} pontos (23 nós)`];
for (const [id, knobs] of Object.entries(KNOBS)) {
  const a = E.G.ARTIFACTS.find(a => a.id === id); if (!a) continue;
  const x = process.env.METRIC === 'w10' ? delta(d10, id, 'w') / gw : (delta(d10, id, 'w') / gw + delta(d23, id, 'v') / gv) / 2, t = TARGET[a.rarity]; // METRIC=w10: só lutas com 10 nós (23 nós tem régua instável)
  const f = x > .15 ? Math.min(2, Math.max(.6, (t / x) ** .75)) : 1.8; // passo amortecido (efeito não é linear)
  const ch = knobs.map(k => { let v = RT[k] * f; if (LIMIT[k]) v = Math.min(LIMIT[k], v); v = INT.has(k) ? Math.max(1, Math.round(v)) : +v.toFixed(3); next[k] = v; return `${k} ${RT[k]} → ${v}`; });
  rep.push(`${a.name.padEnd(22)} raridade ${a.rarity} meta ${t} | × ouro ${x.toFixed(2)} | fator ${f.toFixed(2)} | ${ch.join(', ')}`);
}
fs.writeFileSync(nextF, JSON.stringify({ note: 'calibração das relíquias ' + new Date().toISOString(), relicTune: next }, null, 1)); console.log(rep.join('\n'));
