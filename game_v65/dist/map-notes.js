/* Run-local route annotations. Points use map-relative coordinates, never viewport pixels. */
(function(root){'use strict';
 const A=root.JourneyActs;
 function collection(s){const j=A.ensure(s);if(!j)return null;return j.mapDrawings||(j.mapDrawings={});}
 function strokes(s){return collection(s)?.[A.act(s)]||[];}
 function point(x,y){return [x,y].map(v=>Math.round(Math.max(0,Math.min(1,v))*10000)/10000);}
 function add(s,points){if(!points.length)return false;const maps=collection(s);if(!maps)return false;(maps[A.act(s)]||(maps[A.act(s)]=[])).push(points.map(p=>point(p[0],p[1])));return true;}
 function clear(s){const maps=collection(s);if(maps)maps[A.act(s)]=[];}
 function path(points){if(!points.length)return '';const xy=p=>p[0]*430+' '+p[1]*1390;return 'M'+points.map(xy).join(' L')+(points.length===1?' l.01 0':'');}
 function trueBoss(s){return !!s&&!s.training&&!s.tutorialReplay&&A.act(s)===3&&s.current?.type==='boss'&&s.current.trueBoss===true;}
 root.JourneyMapNotes={strokes,point,add,clear,path,trueBoss};
})(typeof globalThis!=='undefined'?globalThis:this);
