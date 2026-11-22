'use strict';
(function(){
 const categories={all:['All','Todas'],health:['Health','Vida'],heal:['Healing','Cura'],attack:['Attack','Ataque'],defense:['Defense','Defesa'],shield:['Shields','Escudos'],energy:['Energy','Energia'],speed:['Attack speed','Vel. ataque'],movement:['Movement','Movimento'],crit:['Critical','Crítico'],skill:['Skills','Habilidades'],traits:['Traits','Traits'],economy:['Economy / XP','Economia / XP'],deck:['Deck','Deck'],control:['Control','Controle']};
 const effects={
  banner:['attack'],heart:['health'],scope:['attack','crit'],tome:['skill'],boots:['movement','speed','defense','control','traits'],shield:['defense','control','traits'],precision:['crit','skill'],hourglass:['skill'],recovery:['heal'],merchant:['economy'],quickstart:['energy'],spark:['energy'],luckycharm:['economy'],plating:['shield'],laststand:['defense'],repulsion:['shield','control'],fang:['heal'],execution:['attack','skill'],ember:['attack','shield'],bell:['speed'],captain_standard:['deck'],profane_idol:['attack','deck'],colossal_heart:['health','deck'],dormant_sword:['attack'],travelers_mirror:['deck'],sling:['movement','attack','control','defense'],contract:['economy'],grimoire:['economy'],echo:['skill'],chain:['skill'],compass:['deck'],houses:['traits'],honor:['traits'],talents:['traits'],devastator:['attack','control','traits'],warcry:['heal','traits'],ironroot:['shield','defense','traits'],patience:['attack','defense','traits'],aegis:['movement','defense','traits'],lone:['attack','defense','traits'],amplifier:['traits'],horde:['skill','attack','traits'],dawn:['shield','traits']
 };
 const selections=new Map();
 const buttons='[data-act="claim-relic"],[data-act="reward-relic"],[data-act="custom-pick-relic"],[data-act="training-toggle-relic"],[data-act="content-pick"][data-key$="Relic"]';
 function apply(group){
  const selected=selections.get(group.key)||'all';
  for(const item of group.items)item.row.hidden=selected!=='all'&&!effects[item.id]?.includes(selected);
  for(const button of group.bar.querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.effect===selected));
  group.empty.hidden=group.items.some(item=>!item.row.hidden);
 }
 function enhance(){
  const groups=new Map();
  for(const element of document.querySelectorAll('[data-relic-id],'+buttons+',.shop-card-relic [data-act="buy-artifact"],[data-act="buy-artifact"]')){
   const id=element.dataset.relicId||element.dataset.id||(element.dataset.act==='buy-artifact'?S?.offers?.artifacts?.[+element.dataset.i]:null);
   if(!effects[id])continue;
   const row=element.closest('.p3-relic-offer')||element;
   const parent=row.parentElement;
   if(!parent||parent.closest('[hidden]'))continue;
   if(!groups.has(parent))groups.set(parent,[]);
   if(!groups.get(parent).some(item=>item.row===row))groups.get(parent).push({row,id});
  }
  for(const [parent,items]of groups){
   if(parent.querySelector(':scope > .relic-effect-filters'))continue;
   const root=parent.closest('#overlay>.modal,#screen-content');
   if(!root)continue;
   const title=root.querySelector('h2')?.textContent||'',kind=parent.className||'relics';
   const key=[activeMetaScreen||'',title,kind,S?.seed||'',S?.current?.id||''].join('|');
   const bar=document.createElement('div');bar.className='relic-effect-filters';bar.setAttribute('role','group');bar.setAttribute('aria-label',L('Relic effects','Efeitos de relíquias'));
   bar.innerHTML=Object.entries(categories).map(([id,names])=>'<button type="button" class="mini" data-act="relic-effect-filter" data-effect="'+id+'" aria-pressed="false">'+esc(L(...names))+'</button>').join('');
   const empty=document.createElement('p');empty.className='relic-filter-empty';empty.textContent=L('No relics match this effect.','Nenhuma relíquia com este efeito.');empty.hidden=true;
   parent.insertBefore(bar,items[0].row);parent.append(empty);
   const group={key,items,bar,empty};apply(group);
   bar.addEventListener('click',e=>{
    const button=e.target.closest('[data-effect]');if(!button)return;
    JourneyMenuScroll.begin();selections.set(key,button.dataset.effect);apply(group);
   });
  }
 }
 new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
 globalThis.JourneyRelicFilters={categories,effects,enhance};
 enhance();
})();
