'use strict';
const JourneyDeckCompatibility=(()=>{const Q=JourneyPlaytest,T=JourneyTraits;let views=[],matchingDetail=false;
const traitName=id=>T.D[id]?L(T.D[id].en,T.D[id].pt):id;
function remember(){
 const el=document.querySelector('#overlay>.modal');
 if(!el){views.push(null);return;}
 const copy=el.cloneNode(true);
 copy.querySelector('.close')?.remove();
 views.push({html:copy.innerHTML,cls:el.className,label:el.getAttribute('aria-label'),
  focus:[...el.querySelectorAll('button')].indexOf(document.activeElement)});
}
function back(){
 matchingDetail=false;
 const v=views.pop();
 if(!v){closeModal();return;}
 openModal(v.html);
 const el=document.querySelector('#overlay>.modal');
 el.className=v.cls;
 if(v.label)el.setAttribute('aria-label',v.label);
 if(v.focus>=0)el.querySelectorAll('button')[v.focus]?.focus({preventScroll:true});
 JourneyMenuScroll.restore();
}
function countText(cards){const n=Q.summary(cards);return n.copies+' '+L(n.copies===1?'card':'cards',n.copies===1?'carta':'cartas')+' · '+n.unique+' '+L(n.unique===1?'different character':'different characters',n.unique===1?'personagem diferente':'personagens diferentes');}
function button(kind,id,text,on=true,label=''){return '<button type="button" class="deck-compat '+(on?'compatible':'no-match')+'" data-act="p3-compatible" data-kind="'+kind+'" data-id="'+esc(id)+'"'+(label?' aria-label="'+esc(label)+'" title="'+esc(label)+'"':'')+'>'+text+' <span aria-hidden="true">›</span></button>';}
function relicCompatibility(id){const r=Q.relicMatch(S,id);if(r.kind==='run')return '<p class="deck-compat-note">'+L('Run or team effect','Efeito da run ou da equipe')+'</p>';const labels={blackfang:'Blackfang',dawncrest:'Dawncrest',support:L('Support auras','Auras de suporte'),all:L('All allies','Todos os aliados'),ranged:L('Ranged allies','Aliados à distância'),caster:L('Spellcasters','Conjuradores'),charged:L('Eligible skills','Habilidades elegíveis'),curse:L('Curses in deck','Maldições no deck')};return button('relic',id,(labels[r.kind]||traitName(r.kind))+': '+(r.copies?(r.kind==='curse'?r.copies+' '+L(r.copies===1?'curse':'curses',r.copies===1?'maldição':'maldições'):countText(r.cards)):L('None in deck','Nenhum no deck'))+(r.kind==='curse'?' · +'+Math.min(20,r.copies*4)+'% ATQ':''),r.copies>0);}
const potentialHint=()=>L('Deck potential; bonuses activate with different characters in the field.','Potencial do deck; bônus ativam com personagens diferentes em campo.');
function cardCompatibility(id,compact=false){
 if(!G.BY[id]?.traits?.length)return '';
 const units=Q.units(S),counts=G.counts(units),owned=units.some(c=>c.type===id);
 const rows=G.BY[id].traits.map(tr=>{
  const n=counts[tr]||0,after=n+(owned?0:1),reaches=T.tier({[tr]:after},tr)>T.tier(counts,tr);
  const label=traitName(tr)+': '+n+' → '+after+' '+L('different','diferentes')+(reaches?' · '+L('new potential tier','novo patamar potencial'):'');
  const visual=Icon(traitIcon(tr))+'<b>'+n+'→'+after+'</b>'+(reaches?'<i aria-hidden="true">↑</i>':'');
  return button('trait',tr,compact?visual:esc(label),after>0,compact?label:'');
 }).join('');
 return '<div class="card-compatibility'+(compact?' compact-compatibility':'')+'">'+rows+(compact?'':'<small>'+potentialHint()+'</small>')+'</div>';
}
const eventHint=()=>'<p class="panel-hint">'+L('Deck synergy · ↑ marks a new potential tier.','Sinergia do deck · ↑ indica um novo patamar potencial.')+' '+potentialHint()+'</p>';
function matches(kind,id){remember();const cards=kind==='relic'?Q.relicMatch(S,id).cards:Q.matching(S,id);journeyPanel(kind==='relic'?relicName(id):traitName(id),'<p class="panel-hint">'+L('In your current deck · repeated copies count once for trait tiers.','No deck atual · cópias repetidas contam uma vez para patamares de traits.')+'</p><p>'+countText(cards)+'</p>'+(cards.length?'<div class="content-card-grid">'+Q.sortCards(cards,I18n.lang).map(c=>cardFace(c,'p3-match-info')).join('')+'</div>':'<p>'+L('No matching cards in this deck.','Nenhuma carta compatível neste deck.')+'</p>'),metaButton('p3-back',L('Back','Voltar'),'','primary'));}
deckModal=function(){const cards=Q.sortCards(S.cards,I18n.lang),n=G.counts(Q.units(S));journeyPanel(L('Your companions','Seus companheiros'),'<div class="eyebrow">'+esc(S.customName||deckName(S.deck))+' · '+cards.length+' '+L('cards','cartas')+'</div><div class="deck-cards">'+cards.map(c=>cardFace(c,'info')).join('')+'</div><h3>'+L('Deck traits & synergies','Traits e sinergias do deck')+'</h3><p class="panel-hint">'+L('Potential only. Field different characters to activate bonuses.','Potencial do deck. Posicione personagens diferentes para ativar bônus.')+'</p><div class="deck-preview-traits">'+Object.values(T.D).filter(d=>visiblePlayerTrait(d.id)).map(d=>'<button type="button" data-act="traits54-run" data-id="'+d.id+'" class="deck-potential '+(T.tier(n,d.id)?'on':'')+'"><span>'+Icon(traitIcon(d.id))+'<b>'+(n[d.id]||0)+'</b></span><small>'+esc(traitName(d.id))+'</small></button>').join('')+'</div>',metaButton('close',L('Back','Voltar'),'','primary'));};
const service=shopServiceView;shopServiceView=function(kind){service(kind);const m=document.querySelector('#overlay>.modal');m?.classList.add('p3-service');m?.querySelector('h2')?.insertAdjacentHTML('afterend','<strong class="p3-gold" role="status" aria-label="'+L('Gold','Ouro')+'">◈ '+S.gold+'</strong>');if(kind==='upgrade')m?.querySelector('.journey-panel-content>p')?.remove();};
const shop=shopView;shopView=function(){shop();for(const el of document.querySelectorAll('[data-shop-card]'))el.querySelector(':scope>div')?.insertAdjacentHTML('beforeend',cardCompatibility(el.dataset.shopCard));for(const el of [...document.querySelectorAll('[data-act="buy-artifact"]')]){const id=S.offers.artifacts[+el.dataset.i];if(!id)continue;const wrap=document.createElement('article');wrap.className='p3-relic-offer';el.before(wrap);wrap.append(el);wrap.insertAdjacentHTML('beforeend',relicCompatibility(id));}};
const recruit=recruitView;recruitView=function(){recruit();for(const el of document.querySelectorAll('.recruit-candidates>article')){const id=el.querySelector('[data-act="recruit"]')?.dataset.id;if(id)el.insertAdjacentHTML('beforeend',cardCompatibility(id));}};
relicOffers=function(ids,action){return metaButton('open-bag',L('View Relic Bag','Ver bolsa de relíquias'))+metaButton('deck',L('View deck','Ver deck'))+'<div class="offer-list">'+ids.map(id=>{const a=G.ARTIFACTS.find(a=>a.id===id);return '<article class="p3-relic-offer"><button class="offer" data-act="'+action+'" data-id="'+id+'"><span class="artifact-icon">'+relicIcon(id)+'</span><div><h3>'+esc(relicTitle(a))+'</h3><p>'+esc(relicDescription(a))+'</p>'+relicStamp(id)+'</div></button>'+relicCompatibility(id)+'</article>';}).join('')+'</div>';};
const rv=relicView;relicView=function(){rv();document.querySelector('[data-act="cp2-reroll"]')?.closest('.screen-footer')?.remove();if(S.offers?.length){const free=JourneyAdvantages.canReroll(S),f=document.createElement('div');f.className='screen-footer cp2-footer';f.innerHTML=metaButton('p3-relic-refresh','↻ '+L('Refresh relics','Renovar relíquias')+' · '+(free?L('free','grátis'):'◈ 5'),!Q.canRefreshRelics(S)||!free&&S.gold<5?'disabled':'','primary');document.querySelector('#app').append(f);}};
metaNotices=function(all=false){
 const entries=all?Progress.profile.unlockHistory:Progress.unlocks(S),unlocks=entries.filter(e=>e.kind!=='milestone');
 const items=unlocks.map(e=>{
  let art='';
  if(e.kind==='card')art=CA[e.id]?.art?'<img src="'+esc(CA[e.id].art)+'" alt="">':P.portrait(e.id);
  else if(e.kind==='relic')art=relicIcon(e.id);
  else if(e.kind==='booster')art='<div class="pack-art"><span>GRAND<br>JOURNEY</span><b>✦</b></div>';
  else if(e.kind==='deck')art=G.DECKS.find(d=>d.id===e.id)?.faces.slice(0,3).map(id=>P.portrait(id)).join('')||'';
  const style={card:'unlock-character',deck:'unlock-deck'}[e.kind]||'';
  return '<li><div class="unlock-art '+style+'">'+art+'</div><span>'+esc(unlockText(e))+'</span></li>';
 });
 const milestones=all?[]:entries.filter(e=>e.kind==='milestone');
 const summary=all?'':'<h3>'+L('Milestones completed this run','Milestones concluídos nesta run')+'</h3>'+
  (milestones.length?'<ul class="unlock-list">'+milestones.map(e=>'<li>'+esc(unlockText(e))+'</li>').join('')+'</ul>':
   '<p>'+L('No milestones completed in this run.','Nenhum milestone concluído nesta run.')+'</p>');
 const body=items.length?'<ul class="unlock-list p3-unlocks">'+items.join('')+'</ul>':
  '<p>'+L(all?'No unlocks yet.':'No new unlocks in this run.',all?'Nenhum desbloqueio ainda.':'Nenhum desbloqueio novo nesta run.')+'</p>';
 journeyPanel(L('Unlocks','Desbloqueios'),body+summary,metaButton('close',L('Back','Voltar'),'','primary'));
};
const detailBase=detail;detail=function(...args){detailBase(...args);if(matchingDetail)for(const b of document.querySelectorAll('#overlay [data-act="detail-back"]'))b.dataset.act='p3-back';};
const guard=JourneyTraining.guard;JourneyTraining.guard=function(e){JourneyMenuScroll.begin();const el=e.target.closest?.('[data-act]'),d=el?.dataset;if(d?.act==='close'&&views.length&&!document.querySelector('.trait-focus')){if(e.type!=='click')return guard(e);e.preventDefault();e.stopImmediatePropagation();back();return true;}if(!d?.act.startsWith('p3-'))return guard(e);if(e.type!=='click'&&!(e.type==='keydown'&&['Enter',' '].includes(e.key)))return guard(e);e.preventDefault();e.stopImmediatePropagation();if(el.disabled)return true;if(d.act==='p3-relic-refresh'){if(Q.refreshRelics(S)){save();render();}}else if(d.act==='p3-compatible')matches(d.kind,d.id);else if(d.act==='p3-back')back();else if(d.act==='p3-match-info'){remember();matchingDetail=true;detailFusionPreview=false;detailNav=null;detail(G.card(S,d.id));}return true;};
window.addEventListener('keydown',e=>{
 if(e.key!=='Escape'||!views.length)return;
 const close=document.querySelector('#overlay>.modal>.close');
 if(!close)return;
 e.preventDefault();
 e.stopPropagation();
 close.click();
},true);
return {card:cardCompatibility,relic:relicCompatibility,eventHint};
})();
