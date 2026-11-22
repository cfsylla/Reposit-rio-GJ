const fs=require('node:fs'),path=require('node:path');
const base=path.join(__dirname,'fonte_v50');globalThis.window=globalThis;
const scripts=[...fs.readFileSync(path.join(base,'dist/index.html'),'utf8').matchAll(/src="([^"?]+\.js)/g)].map(m=>m[1]);
for(const file of scripts.slice(0,scripts.indexOf('game-2.js')))require(path.join(base,'dist',file));
module.exports={Game,Progress,JourneyTree,JourneyTreeData,JourneyBosses,JourneyActs,JourneyRaid,JourneyTraits,JourneySupportB,JourneyChallenges,JourneyAdvantages,JourneyMilestones,JourneyProgression,JourneyBossCards,JourneyContent,JourneyPlaytest,JourneyEnemyDecks};
