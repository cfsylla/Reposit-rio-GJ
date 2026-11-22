// Export the actual production engine in index.html order; no legacy CP1/CP2 snapshots.
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const {G,P}=require('../tests/cp4-engine.cjs');
const data={source:JSON.parse(fs.readFileSync(path.join(root,'VERSAO.json'),'utf8')),
 note:'Static snapshot of final definitions after all production modules load. Functions are omitted by JSON. Source code remains authoritative for dynamic combat, offers, rewards and progression.',
 playableUnits:G.UNITS.filter(u=>!u.enemyOnly),enemyTemplates:Object.fromEntries(Object.entries(G.BY).filter(([id,u])=>u.enemyOnly)),
 traits:globalThis.JourneyTraits?.D,traitAssignments:globalThis.JourneyTraits?.assignments,
 relics:G.ARTIFACTS,relicFormats:G.RELIC_FORMATS,curses:globalThis.JourneyContent?.curses,
 tree:globalThis.JourneyTreeData,acts:globalThis.JourneyActs?.SPEC,bosses:globalThis.JourneyBosses?.D,raids:globalThis.JourneyRaid?.SPECS,
 decks:G.DECKS,enemyDecks:G.ENEMY_DECKS,blackfangDecks:G.BLACKFANG_DECKS,dawncrestDecks:G.DAWNCREST_DECKS,
 rarities:P.RARITIES,boosters:P.BOOSTERS,milestones:P.MILESTONES,startRelics:P.START_RELICS,
 heroCards:globalThis.JourneyBossCards?.cards,rarityRevision:G.CARD_RARITIES_R3,rangerTrap:G.RANGER_TRAP,
 challenges:{list:globalThis.JourneyChallenges?.LIST,tune:globalThis.JourneyChallenges?.TUNE},advantages:{list:globalThis.JourneyAdvantages?.LIST,tune:globalThis.JourneyAdvantages?.TUNE},
 tunes:Object.fromEntries(Object.entries(globalThis).filter(([k,v])=>/^JOURNEY_.*TUNE$/.test(k)&&v&&typeof v==='object'))};
const target=path.join(root,'dados/dados_atuais_v65.json');fs.writeFileSync(target,JSON.stringify(data,null,2)+'\n');console.log(target);
