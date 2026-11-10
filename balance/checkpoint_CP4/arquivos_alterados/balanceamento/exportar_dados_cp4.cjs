/* Exporta os dados de balanceamento do CP4 (inclui escada de barreiras, tabela de relíquias e as 43 relíquias). Uso: node exportar_dados_cp3.cjs <raiz do jogo com dist/> [saida.json]
 * Mesma ordem de carga do loader oficial da v50 (scripts de dist/index.html até game-2.js). Só leitura. */
const fs=require('node:fs'),path=require('node:path');const root=path.resolve(process.argv[2]||'.');globalThis.window=globalThis;
const scripts=[...fs.readFileSync(path.join(root,'dist/index.html'),'utf8').matchAll(/src="([^"?]+\.js)/g)].map(m=>m[1]);
for(const f of scripts.slice(0,scripts.indexOf('game-2.js')))require(path.join(root,'dist',f));
const G=globalThis.Game,P=globalThis.Progress,T=globalThis.JourneyTree,D=globalThis.JourneyTreeData,nodes=D.nodes.filter(n=>n.id!=='origin');
const data={checkpoint:'GJ-v50-BAL-CP4',base:{publishedVersion:50,internalContentVersion:56,commit:'aed07ed41c8a002ab1d149882e068b7a7f6c4415'},
 treeXp:T.XP,treeAudit:{purchasableNodes:nodes.length,totalCost:nodes.reduce((s,n)=>s+n.cost,0),costs:Object.fromEntries(nodes.map(n=>[n.id,n.cost])),midWindowLayer:[1,2,3].map(T.midLayer)},
 bossTune:globalThis.JourneyBosses.TUNE,supportsB:globalThis.JourneySupportB.SPEC,decks:G.DECKS.map(d=>({id:d.id,name:d.name,counts:d.counts,startRelic:d.startRelic})),
 challenges:{list:globalThis.JourneyChallenges.LIST,tune:globalThis.JourneyChallenges.TUNE},advantages:{list:globalThis.JourneyAdvantages.LIST,tune:globalThis.JourneyAdvantages.TUNE},
 barrierTune:globalThis.JOURNEY_BARRIER_TUNE,relicTune:globalThis.JOURNEY_RELIC_TUNE,
 relics:G.ARTIFACTS.map(a=>({id:a.id,name:a.name,namePT:a.namePT,rarity:a.rarity,price:a.price,shape:G.RELIC_FORMATS[a.id],category:a.category,desc:a.desc,descPT:a.descPT}))};
const out=process.argv[3]||path.join(process.cwd(),'dados_checkpoint_CP4.json');fs.writeFileSync(out,JSON.stringify(data,null,2)+'\n');console.log(out,nodes.length,'nós, custo total',data.treeAudit.totalCost);
