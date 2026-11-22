'use strict';
(function(root){const G=root.Game;
 function key(s){return [s.seed,root.JourneyActs?.act(s)||1,s.encounters,s.current?.id].join(':');}
 function previous(s){const m=s?.previousEnemyFormation;return m&&m.encounter===key(s)&&m.round===s.round-1?m:null;}
 const create=G.createBattle;G.createBattle=function(s){const b=create(s);if(b){s.previousEnemyFormation={encounter:key(s),round:s.round,units:b.units.filter(u=>u.side===1).map(u=>({type:u.type,x:u.x,y:u.y,level:u.level||0,fused:!!u.fused,large:!!(u.raidBoss||u.bossLeader),stats:Object.fromEntries(['hp','maxhp','atk','defense','rate','speed','range','crit'].map(k=>[k,u[k]]))}))};}return b;};
 root.JourneyEncounterMemory={previous};
})(globalThis);
