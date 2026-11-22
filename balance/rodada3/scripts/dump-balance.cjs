/* Dumps normalized balance data of a game copy (GJ_ROOT) to stdout as JSON. Read-only. */
'use strict';
const E = require('../../sim/engine.cjs');
const { G, A, Tree, TreeData, CH, AD } = E; const g = globalThis;
const pick = (o, ks) => Object.fromEntries(ks.filter(k => o[k] !== undefined).map(k => [k, o[k]]));
const out = {};
out.units = Object.fromEntries(Object.values(G.BY).map(u => [u.id || u.type, pick(u, ['name', 'cost', 'rarity', 'hp', 'atk', 'defense', 'rate', 'range', 'speed', 'skill', 'role', 'faction', 'traits', 'area', 'trigger', 'enemyOnly', 'boss'])]));
out.treeNodes = Object.fromEntries(TreeData.nodes.map(n => [n.id, pick(n, ['cost', 'depth', 'type', 'branch', 'value', 'values', 'effect', 'parents', 'requires'])]));
out.treeLevel = Tree.LEVEL;
out.actsSpec = A.SPEC;
out.decks = Object.fromEntries((G.DECKS || []).map(d => [d.id, pick(d, ['counts', 'cards', 'units', 'relic', 'startRelic', 'order'])]));
out.supports = g.JourneySupportB?.SUPPORTS || g.SUPPORT_B || null;
out.chTune = CH?.TUNE; out.chList = CH?.LIST?.map(x => pick(x, ['id', 'value', 'values']));
out.adTune = AD?.TUNE; out.adList = AD?.LIST?.map(x => pick(x, ['id', 'cost', 'value', 'values']));
out.traits = g.JourneyTraits?.LIST?.map?.(t => pick(t, ['id', 'tiers', 'thresholds', 'values'])) || null;
console.log(JSON.stringify(out, (k, v) => typeof v === 'function' ? undefined : v));
