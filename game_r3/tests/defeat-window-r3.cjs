/* R3 etapa 4 (Carlos 08/11/2026): janela da árvore na derrota, sem penalidade. Rodar: GJ_ROOT=game_r3 node game_r3/tests/defeat-window-r3.cjs */
'use strict';
process.env.GJ_ROOT ||= require('path').join(__dirname, '..');
const assert = require('assert');
const { playRun } = require('../../balance/sim/run.cjs');
const { G, P, Tree: T } = require('../../balance/sim/engine.cjs');
const st = () => T.profile();
const pol = { prep: 'smart', route: 'greedy', events: 'safe', shop: 'balanced', tree: [], treeBuy: 'all', order: null, forcewin: false };
// 1. Uma derrota com XP suficiente abre a janela 'defeat'; o que foi comprado fica; o resto é perdido; earned = spent + lost
let found = null;
for (let seed = 1; seed < 80 && !found; seed++) {
  st().unlocked = []; st().respec = 0; const h0 = { ...st().history };
  const r = playRun('vanguard', seed, pol, { dt: 1 / 60 });
  if (r.result === 'defeat' && r.windows?.at(-1)?.kind === 'defeat') found = { r, h0, h: { ...st().history }, unlocked: [...st().unlocked] };
}
assert.ok(found, 'achou uma derrota com janela');
const w = found.r.windows.at(-1);
assert.ok(w.bought.length >= 1, 'a janela da derrota compra pelo menos 1 nó');
assert.ok(w.bought.every(id => found.unlocked.includes(id)), 'nós comprados na derrota ficam no perfil');
const x = found.r.xpR3; /* conta da própria run (o histórico do perfil é mexido pelo simulador entre runs) */
assert.strictEqual(x.earned, x.spent + x.lost, 'earned = spent + lost'); assert.strictEqual(x.lost, w.left, 'só a sobra da janela da derrota é perdida');
// 2. Sem XP suficiente para 1 nó, a derrota termina direto (sem janela)
st().unlocked = []; let s = G.fresh('vanguard', 501); let t = T.ensure(s); t.xp = 3; s.phase = 'defeat';
assert.notStrictEqual(P.finish(s, 'defeat'), false); assert.strictEqual(s.phase, 'defeat'); assert.ok(s.meta.ended, 'run encerrada sem janela');
// 3. Com XP: janela abre; fechar encerra a run como derrota e zera o XP; reabrir não é possível
s = G.fresh('vanguard', 502); t = T.ensure(s); t.xp = 30; s.phase = 'defeat';
assert.strictEqual(P.finish(s, 'defeat'), false); assert.strictEqual(s.phase, 'tree'); assert.strictEqual(t.session.kind, 'defeat'); assert.ok(!s.meta.ended);
assert.ok(T.buying(s), 'pode comprar na janela da derrota');
assert.ok(T.continueRun(s)); assert.strictEqual(s.phase, 'defeat'); assert.ok(s.meta.ended); assert.strictEqual(t.xp, 0); assert.strictEqual(s.meta.reason, 'defeat');
assert.strictEqual(P.finish(s, 'defeat'), false, 'não termina duas vezes'); assert.ok(!t.session, 'não reabre a janela');
// 4. Abandonar não abre a janela
s = G.fresh('vanguard', 503); t = T.ensure(s); t.xp = 30; assert.ok(P.abandon(s)); assert.strictEqual(s.phase, 'defeat'); assert.ok(!t.session); assert.strictEqual(t.xp, 0);
console.log('PASS defeat-window-r3: derrota com XP abre a árvore uma vez (sem penalidade), sobra perdida, abandono sem janela');
