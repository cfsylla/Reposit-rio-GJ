/* Shuffle encounter payloads, keeping geometry and saved maps stable. */
(function(root){'use strict';
function arrange(map,seed,act=1){const G=root.Game,random=G.rng((seed^Math.imul(act,0x51ad27))>>>0),keys=['type','name','eventId','campaign','forceId','raidKind','raidSlot'];
 for(const row of map){if(row.length<2)continue;const payloads=G.shuffle(row.map(n=>Object.fromEntries(keys.filter(k=>n[k]!==undefined).map(k=>[k,n[k]]))),random);row.forEach((n,i)=>{for(const key of keys)delete n[key];Object.assign(n,payloads[i]);});}
 for(const order of ['monsters','blackfang','dawncrest']){const pair=map.flat().filter(n=>n.campaign===order);if(pair.length!==2)continue;const [from,to]=pair;let reachable=new Set([from.id]);for(let layer=from.layer;layer<to.layer;layer++){const children=new Set(map[layer].filter(n=>reachable.has(n.id)).flatMap(n=>n.links));const goal=layer+1===to.layer?to:map[layer+1].reduce((a,n)=>Math.abs(n.x-to.x)<Math.abs(a.x-to.x)?n:a);if(!children.has(goal.id)){const parent=map[layer].filter(n=>reachable.has(n.id)).reduce((a,n)=>Math.abs(n.x-goal.x)<Math.abs(a.x-goal.x)?n:a);parent.links.push(goal.id);children.add(goal.id);}reachable=children;}}
 for(const row of map)for(const n of row)n.links=[...new Set(n.links)];return map;
}
root.JourneyMaps={arrange};
})(typeof globalThis!=='undefined'?globalThis:this);
