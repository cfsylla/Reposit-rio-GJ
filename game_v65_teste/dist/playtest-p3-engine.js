'use strict';
(function(root){const G=root.Game,C=root.JourneyContent;
function units(s){return(s?.cards||[]).filter(c=>G.BY[c.type]&&!C.isCurse(c));}
function matching(s,tr){return units(s).filter(c=>G.BY[c.type].traits.includes(tr));}
function summary(cards){return{copies:cards.length,unique:new Set(cards.map(c=>c.type)).size};}
function sortCards(cards,lang='en'){const n={};for(const c of cards)n[c.type]=(n[c.type]||0)+1;return [...cards].sort((a,b)=>n[b.type]-n[a.type]||(G.BY[b.type]?.cost||0)-(G.BY[a.type]?.cost||0)||(G.BY[b.type]?.rarity||0)-(G.BY[a.type]?.rarity||0)||(G.BY[a.type]?.name||a.type).localeCompare(G.BY[b.type]?.name||b.type,lang)||a.type.localeCompare(b.type));}
const relicTraits={boots:'Trailblazer',shield:'Sentinel',patience:'Patient',aegis:'Protector',
 lone:'Audacious',devastator:'Devastator',warcry:'Fearless',ironroot:'Unyielding'};
function relicMatch(s,id){
 const all=units(s);let cards=all,kind='all';
 if(relicTraits[id]){kind=relicTraits[id];cards=matching(s,kind);}
 else if(id==='scope'){kind='ranged';cards=all.filter(c=>G.BY[c.type].range>100);}
 else if(id==='tome'){kind='caster';cards=all.filter(c=>root.JourneyTraits.caster(G.BY[c.type]));}
 else if(['hourglass','echo','chain'].includes(id)){kind='charged';cards=all.filter(c=>G.BY[c.type].kind==='active'&&(id!=='hourglass'||!G.BY[c.type].trigger.startFull));}
 else if(id==='profane_idol'){kind='curse';cards=(s?.cards||[]).filter(C.isCurse);}
 else if(['horde','dawn'].includes(id)){kind=id==='horde'?'blackfang':'dawncrest';cards=all.filter(c=>(G.BY[c.type].order||G.BY[c.type].faction)===kind);}
 else if(id==='amplifier'){kind='support';cards=all.filter(c=>root.JourneySupportB?.SPEC[c.type]);}
 else if(['merchant','quickstart','spark','luckycharm','travelers_mirror','contract','grimoire','compass','sling','houses','honor','talents'].includes(id)){kind='run';cards=[];}
 return{kind,cards,...summary(cards)};
}
const reroll=G.rerollOffers;G.rerollOffers=function(s){if(s?.phase!=='shop')return reroll(s);const masks={cards:s.offers.cards.map(Boolean),artifacts:s.offers.artifacts.map(Boolean)};if(!masks.cards.some(Boolean)&&!masks.artifacts.some(Boolean))return false;const ok=reroll(s);if(ok)for(const k of ['cards','artifacts']){const pool=[...s.offers[k]];s.offers[k]=masks[k].map(on=>on?(pool.shift()||null):null);}return ok;};
function canRefreshRelics(s){return !!s&&s.phase==='relic'&&!s.pendingRelic&&Array.isArray(s.offers)&&s.offers.length>0&&G.relicOfferPool(s).some(id=>!s.offers.includes(id));}
function refreshRelics(s){if(!canRefreshRelics(s))return false;if(root.JourneyAdvantages.canReroll(s))return root.JourneyAdvantages.rerollRelic(s);if(s.gold<5)return false;const old=s.offers,pool=G.unownedRelics(s);s.offers=G.relicOffers(s,old.length,pool.filter(id=>!old.includes(id)),old.filter(id=>pool.includes(id)));const key=(root.JourneyActs?.act(s)||1)+':'+s.current.id+':node';if(s.adv?.eyeChoices?.[key])s.adv.eyeChoices[key].ids=[...s.offers];s.gold-=5;root.Progress.spend(s,5);return true;}
root.JourneyPlaytest={units,matching,summary,sortCards,relicMatch,canRefreshRelics,refreshRelics};})(globalThis);
