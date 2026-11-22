// Load the production engine in exactly the order used by the page.
const fs = require('node:fs');
globalThis.window = globalThis;
const scripts = [...fs.readFileSync(require.resolve('../dist/index.html'), 'utf8').matchAll(/src="([^"?]+\.js)/g)].map(match => match[1]);
for (const file of scripts.slice(0, scripts.indexOf('game-2.js'))) require('../dist/' + file);
module.exports = { G: Game, P: Progress, A: JourneyActs, Tree: JourneyTree, TreeData: JourneyTreeData, C: JourneyContent };
