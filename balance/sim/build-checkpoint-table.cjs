/* Builds the CP1 change table (CSV + Markdown) by diffing exported data (v54 vs checkpoint) + explicit rule rows.
 * Usage: node balance/sim/build-checkpoint-table.cjs <outDir> */
'use strict';
const fs = require('fs'), path = require('path');
const out = process.argv[2];
const A = JSON.parse(fs.readFileSync('v54/balanceamento/dados_base_v54.json', 'utf8'));
const B = JSON.parse(fs.readFileSync('game/balanceamento/dados_checkpoint_CP1.json', 'utf8'));
const rows = [];
const R = (o) => rows.push(Object.assign({ tipo: 'numérico', aprovacao: 'Aprovada', implementacao: 'Implementada', validacao: '', dependencias: '' }, o));
const RAR = ['Comum', 'Incomum', 'Rara', 'Ultra rara'];
// ---------- P1 units (automatic diff) ----------
const byA = Object.fromEntries(A.units.map(u => [u.id, u])), byB = Object.fromEntries(B.units.map(u => [u.id, u]));
for (const u of B.units) {
  const o = byA[u.id];
  for (const k of ['cost', 'rarity', 'hp', 'atk', 'area', 'skillScale']) {
    const va = k === 'skillScale' ? (o.skillScale ?? 1) : o[k], vb = k === 'skillScale' ? (u.skillScale ?? 1) : u[k];
    if (JSON.stringify(va) === JSON.stringify(vb) || (k === 'rarity' && va === vb)) continue;
    if (['cost', 'rarity', 'hp', 'atk', 'area', 'skillScale'].includes(k) && va === vb) continue;
    const fmt = v => k === 'rarity' ? RAR[v] : k === 'skillScale' ? '×' + v : String(v);
    R({ sistema: 'Personagens (P1)', id: u.id, entidade: u.name, arquivo: 'dist/balance-p1.js (dados); skillScale lido em game-0.js stats()', parametro: { cost: 'Custo de energia', rarity: 'Raridade', hp: 'Vida base', atk: 'Ataque base', area: 'Raio da área do ataque básico', skillScale: 'Multiplicador do poder de habilidade (novo campo)' }[k], original: fmt(va), novo: fmt(vb),
      justificativa: 'Curva-alvo aprovada: índice de laboratório = 1,00 + 0,04×(custo−2) + 0,02×raridade (balance/RELATORIO_03)', validacao: 'tests/balance-p2.cjs; tests/roster-v37.cjs; laboratório validacao/dados_simulacoes/lab_p1b', dependencias: k === 'skillScale' ? 'Requer a linha de stats() em game-0.js' : (k === 'cost' || k === 'rarity' ? 'Afeta curva de energia dos decks / frequência em lojas e boosters' : '') });
  }
}
// ---------- Traits: descriptions (numeric + mechanics) ----------
const mech = { 'Legends of the East': 1, Goblin: 1, Trailblazer: 1, Protector: 1, Patient: 1, Fearless: 1 };
for (const [id, t] of Object.entries(B.traits)) {
  const o = A.traits[id]; if (!o || o.descPT === t.descPT) continue;
  R({ sistema: mech[id] ? 'Traits — mecânica (P2)' : 'Traits — valores (P1)', id, entidade: t.pt, arquivo: 'dist/traits-v54.js (' + (mech[id] ? 'damage()/defense()/reduction()/crit()/beforeStep()/stats(); texto' : 'val() / stats(); texto') + ')', parametro: 'Efeito do trait (patamar 1 / patamar 2)',
    original: o.descPT, novo: t.descPT, tipo: mech[id] ? 'design' : 'numérico', justificativa: mech[id] ? 'Ganho medido < 3% mesmo com valores maiores; mecânica nova aprovada (RELATORIO_04/06)' : 'Ganho do 2º membro quase nulo / Meowri dominante (+24%) (RELATORIO_02/03)',
    validacao: 'tests/traits-v54.cjs (expectativas atualizadas); traitlab validacao/dados_simulacoes/traits_p1, mech1, mech2, fearless', dependencias: id === 'Fearless' ? 'Única exceção ao teto de 75% de crítico' : id === 'Protector' ? 'Provocação antiga removida' : id === 'Goblin' ? 'Redução de dano por proximidade removida' : '' });
}
// ---------- Supports model B ----------
for (const [id, sp] of Object.entries(B.supportsB || {})) {
  const o = byA[id], n = byB[id];
  R({ sistema: 'Suportes — modelo B (P2)', id, entidade: n.name, arquivo: 'dist/supports-b.js (SPEC; ganchos JourneyTraits.beforeStep e JourneyTree.beforeSettle)', parametro: 'Habilidade', tipo: 'design',
    original: 'Ativa (' + o.trigger.kind + ' ' + o.trigger.limit + '): ' + (o.detailPT || o.detail),
    novo: `Passiva (aura raio ${sp.radius}): a cada ${sp.every}s cura OUTROS aliados na área em ${+(sp.heal * 100).toFixed(1)}% da vida máxima; OUTROS aliados na área recebem ${Object.entries(sp.buff).map(([k, v]) => (k === 'guard' ? 'redução de dano ' : k === 'haste' ? 'vel. de ataque +' : k === 'skill' ? 'poder de habilidade +' : k === 'atk' ? 'dano +' : 'movimento +') + +(v * 100).toFixed(0) + '%').join(', ')}. Emissor não é afetado; auras de suportes diferentes se somam; força usa poder BASE do emissor (×(1+(skill−1)×0,5)); fica ~60 atrás da linha de frente.`,
    justificativa: 'Cura chegava tarde e era ~10× pequena para o ritmo das lutas; Carlos escolheu modelo B; calibrado ao alvo de custo/raridade (RELATORIO_06/07)', validacao: 'tests/balance-p2.cjs; stress balance/sim/stress.cjs (sem empates por tempo); lab validacao/dados_simulacoes/final_p2', dependencias: 'kind=passive: Ampulheta e nó Prontidão deixam de afetar estes 10' });
}
// ---------- Decks ----------
const dA = Object.fromEntries(A.decks.map(d => [d.id, d]));
const cards = d => d.counts ? Object.entries(d.counts).map(([t, n]) => n + '×' + t).join(', ') : d.ids.map((t, i) => (i < 4 ? 3 : 2) + '×' + t).join(', ');
for (const d of B.decks) {
  const o = dA[d.id];
  R({ sistema: 'Decks emprestados (P3)', id: d.id, entidade: d.name, arquivo: 'dist/decks-p3.js (DECKS, START_RELICS)', parametro: 'Composição (20 cartas), relíquia inicial' + (d.order ? ', ordem ' + d.order : ''), tipo: 'design',
    original: o ? `${o.name}: ${cards(o)}; relíquia ${o.startRelic}` : '— (deck novo)', novo: `${d.name}: ${cards(d)}; relíquia ${d.startRelic}`,
    justificativa: 'Decks reconstruídos; 4 rodadas de ajuste (runs + torneio) (RELATORIO_08)', validacao: 'tests/decks-p3.cjs; tests/systems-v18.cjs; validacao/dados_simulacoes/decks_final; validacao/matriz_CP1', dependencias: 'deckCards() com counts (game-0.js); desbloqueio por milestones' });
}
const mA = Object.fromEntries((A.milestones || []).map(m => [m.id, m]));
for (const m of B.milestones) if (m.decks?.length && JSON.stringify(m.decks) !== JSON.stringify(mA[m.id]?.decks || (m.id === 'firstSteps' ? ['balanced', 'swift'] : undefined)))
  R({ sistema: 'Milestones (P3)', id: m.id, entidade: m.pt, arquivo: 'dist/decks-p3.js (MILESTONE_DECKS / novo milestone)', parametro: 'Recompensa', tipo: 'design', original: m.id === 'map2boss' ? '— (milestone novo; métrica stats.map2Bosses)' : 'sem deck', novo: 'libera deck(s): ' + m.decks.join(', '),
    justificativa: 'Desbloqueio por milestones (decisão de Carlos)', validacao: 'tests/decks-p3.cjs', dependencias: m.id === 'map2boss' ? 'Contagem começa no CP1 (sem retroatividade) — ver pendências' : 'Migração: concede ao carregar perfil com milestone já concluído' });
R({ sistema: 'Desbloqueios (P3)', id: 'order_decks', entidade: 'Decks de ordem', arquivo: 'dist/decks-p3.js (ORDER_DECKS, sync, wrap de Progress.encounterWin/load)', parametro: 'Condição de desbloqueio', tipo: 'design', original: '—', novo: 'Boss Blackfang: greenskins, goblin_horde; true boss Blackfang: dark_court, blackfang_war; boss Dawncrest: meowri_band, high_court; true boss Dawncrest: forest_guard, centaur_charge, dawncrest_choir', justificativa: 'Mesmo momento em que as cartas da ordem ficam disponíveis', validacao: 'tests/decks-p3.cjs', dependencias: 'True boss registrado a partir do CP1 (stats.trueBoss_<ordem>) — ver pendências' });
R({ sistema: 'IA inimiga (P3)', id: 'makeAI.elitePool', entidade: 'Sorteio de deck de elite comum', arquivo: 'dist/game-0.js makeAI()', parametro: 'Decks elegíveis', tipo: 'design', original: 'qualquer deck emprestado ou inimigo', novo: 'decks emprestados SEM ordem + decks inimigos; usa counts quando presente', justificativa: 'Não revelar personagens de ordem bloqueados', validacao: 'tests/decks-p3.cjs', dependencias: 'decks-p3.js' });
// ---------- P4 explicit rows ----------
const p4 = [
  ['Curva de upgrades inimigos', 'makeAI (bloco "const C=" após criar cartas)', 'Normais: lutas 1–3 L0; 4–6: 4 tipos (12 cartas) L1; 7–8: todas L1; ≥9: 2 tipos L2 + resto L1 (contagem global de lutas)', 'Luta N (contagem global): N−2 passos de upgrade (mín 0, máx 26). Passos sobem cartas a L1 (tipos impulsionados primeiro) e depois a L2', 'design'],
  ['Elite', 'makeAI', 'Só tipos impulsionados (~1/3) L1 a partir da 4ª luta', 'Curva + 1 passo', 'numérico'],
  ['Boss comum (deck emprestado)', 'makeAI', 'Mesma regra das normais', 'Curva −3 / −4 / −6 passos (mapa 1/2/3)', 'numérico'],
  ['Equipe do boss de ordem', 'makeAI', 'Mesma regra das normais', 'Curva −4 / −7 / −8 passos; Rei Troll −3 adicional', 'numérico'],
  ['Líder do boss de ordem (forma 1)', 'boss-engine.js (bloco no fim: JourneyBosses.D)', 'Vida/ataque de D', 'Vida e ataque ×0,80; Rei Troll ×0,65; Rainha Meowri e Líder Centauro ×0,75 (true bosses forma 2 inalterados)', 'numérico'],
  ['Ouro por vitória', 'game-0.js battleReward()', '10 (lutas 1–3), 12 (4–6), 14 (≥7), contagem global', '14 / 16 / 18 por mapa (lutas 1–9 / 10–18 / 19–27)', 'numérico'],
  ['Upgrade na loja', 'game-0.js price()', '0→1: 12; 1→2: 20', '0→1: 10; 1→2: 16 (eventos inalterados: 8/14)', 'numérico'],
  ['Força por mapa', 'acts-engine.js SPEC.power', '×1 / ×1,12 / ×1,25', '×1 / ×1,10 / ×1,16 (vale também para raids e líderes)', 'numérico'],
  ['Escala dentro do mapa', 'game-0.js createBattle()', '0,86 + 0,02×(etapa local−1), máx +0,16', '0,80 + 0,02×(etapa local−1), máx +0,16', 'numérico'],
  ['Relíquias de elites/bosses inimigos', 'game-0.js rollEnemyRelics()', 'Máx(1, nº de sucessos de 33% por oportunidade de relíquia vista); limitado pela bolsa', 'Sorteio uniforme entre 1 e máx(1, n−1), n = 1 + oportunidades de relíquia vistas; limitado pela bolsa (regra R1 de Carlos)', 'design'],
  ['Raids', 'acts-engine.js attachRun()', 'escala por posição × força do mapa', 'Mapa 1 inalterado; mapas 2 e 3: vida ×1,25 e dano/lacaios ×1,10', 'numérico'],
  ['Decks inimigos por mapa', 'dist/enemy-decks-p4.js + makeAI', 'Batalha normal: 10 personagens aleatórios (1ª luta: grupo fixo)', '1ª luta inalterada; demais batalhas normais sorteiam 1 de 4 decks temáticos do mapa atual (12 no total), com counts', 'design'],
];
for (const [ent, loc, a, b, tipo] of p4) R({ sistema: 'Dificuldade e economia (P4)', id: 'p4', entidade: ent, arquivo: 'dist/' + loc, parametro: ent, original: a, novo: b, tipo, justificativa: 'Meta aprovada: árvore intermediária (20–30 nós) vence 40–50% (simulado); recalibrado após correção do simulador (RELATORIO_11/12)', validacao: 'tests/difficulty-p4.cjs; validacao/matriz_CP1 (1.440 runs na versão entregue)', dependencias: 'Conjunto P4 inteiro deve entrar junto (calibrado em conjunto)' });
R({ sistema: 'Bug corrigido (P4)', id: 'freshMinion', entidade: 'Lacaio invocado por boss (Lanceiro do Rei Goblin)', arquivo: 'dist/boss-engine.js freshMinion()', parametro: 'Carga do especial', tipo: 'correção de bug', original: 'charge 0 → especial a cada passo (60×/s); na v54 o lanceiro causa ~900+ de dano por rodada', novo: 'charge = Game.skillLimit(unidade), como qualquer unidade', justificativa: 'Bug da v54', validacao: 'tests/difficulty-p4.cjs; simulação: Rei Goblin 0/6 → 5/6 vitórias', dependencias: 'Independente' });
const tests = [['tests/traits-v54.cjs', 'Valores e mecânicas de traits aprovados'], ['tests/systems-v18.cjs', 'Decks com counts (formato antigo continua validado sem counts)'], ['tests/roster-v37.cjs', 'Atributos de BALANCE_P1; L2 comparado ao novo base'], ['tests/acts-v47.cjs', 'Escala de raid × multiplicador por mapa'], ['tests/content-v53.cjs', 'Preço do upgrade na loja 10/16'], ['tests/manticore-v46.cjs', 'Ouro por vitória 14'], ['tests/monsters-v42.cjs', 'Ouro por vitória 14 e 28'], ['tests/raids-v45.cjs', 'Ouro por vitória 14'], ['tests/tree-v51.cjs', 'Preço do upgrade com desconto da árvore 9/16'], ['scripts/validate-balance-base.cjs', 'Carrega módulos novos e roda 3 testes novos'], ['scripts/export-balance-data.cjs', 'Exporta dados do checkpoint (módulos novos)']];
for (const [f, why] of tests) R({ sistema: 'Testes e ferramentas', id: path.basename(f), entidade: f, arquivo: f, parametro: 'Expectativa / carga de módulos', tipo: 'teste/ferramenta', original: 'valores v54', novo: why, justificativa: 'Somente expectativa atualizada por regra aprovada; lógica do teste mantida', validacao: 'validate-balance-base PASS' });
// ---------- write ----------
const cols = [['sistema', 'Sistema'], ['id', 'ID'], ['entidade', 'Entidade'], ['arquivo', 'Arquivo / função'], ['parametro', 'Parâmetro / regra'], ['original', 'Original v54'], ['novo', 'Aprovado CP1'], ['tipo', 'Tipo'], ['justificativa', 'Justificativa'], ['aprovacao', 'Aprovação'], ['implementacao', 'Implementação'], ['validacao', 'Validação'], ['dependencias', 'Dependências / ressalvas']];
const esc = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
fs.writeFileSync(path.join(out, 'TABELA_ALTERACOES.csv'), '﻿' + cols.map(c => esc(c[1])).join(',') + '\n' + rows.map(r => cols.map(c => esc(r[c[0]])).join(',')).join('\n') + '\n');
const md = v => String(v ?? '').replace(/\|/g, '/').replace(/\n/g, ' ');
fs.writeFileSync(path.join(out, 'TABELA_ALTERACOES.md'), '# Tabela de alterações — checkpoint GJ-v54-BAL-CP1\n\nUma alteração por linha. Gerada automaticamente (dados exportados v54 × checkpoint + regras). ' + rows.length + ' linhas.\n\n| ' + cols.map(c => c[1]).join(' | ') + ' |\n|' + cols.map(() => '---').join('|') + '|\n' + rows.map(r => '| ' + cols.map(c => md(r[c[0]])).join(' | ') + ' |').join('\n') + '\n');
console.log('linhas', rows.length, Object.entries(rows.reduce((m, r) => (m[r.sistema] = (m[r.sistema] || 0) + 1, m), {})).map(x => x.join(':')).join(', '));
