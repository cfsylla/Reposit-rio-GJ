'use strict';
(function(){const M=JourneyMilestones;
const label=m=>m.kind==='secret'&&M.hidden(m)?'?????':M.displayText(m,L(m.en,m.pt));
const concealed=m=>label(m).includes('?????');
milestoneRewards=function(m){
 return ['◇ 1 '+L('diamond','diamante'),M.displayText(m,L(m.rewardEn,m.rewardPt))].filter(Boolean).join(' · ');
};
milestonesView=function(){Progress.check();const p=Progress.profile,done=Progress.MILESTONES.filter(m=>p.milestones.includes(m.id)).length;metaPage('Milestones','<p class="milestones-summary">'+done+' / '+Progress.MILESTONES.length+' '+L('completed · each milestone grants 1 diamond once.','concluídos · cada milestone concede 1 diamante uma única vez.')+'</p><div class="milestones-list">'+Progress.MILESTONES.map(m=>{const hidden=concealed(m),n=Math.min(m.goal,M.progress(m)),complete=p.milestones.includes(m.id);return '<button class="milestone '+(complete?'done ':'')+(hidden?'milestone-hidden':'')+'" data-act="milestone-info" data-id="'+esc(m.id)+'"><div><b>'+(complete?'✓ ':'')+esc(label(m))+'</b><span>'+n+'/'+m.goal+'</span></div><progress value="'+n+'" max="'+m.goal+'"></progress><p>'+esc(milestoneRewards(m))+'</p></button>';}).join('')+'</div>'+metaButton('unlock-history',L('View unlock history','Ver histórico de desbloqueios')),'milestones');};
const guard=JourneyTraining.guard;JourneyTraining.guard=function(e){const el=e.target.closest?.('[data-act]');if(e.type==='click'&&el?.dataset.act==='milestone-info'){e.preventDefault();e.stopImmediatePropagation();const m=Progress.MILESTONES.find(m=>m.id===el.dataset.id);if(!m)return true;const n=Math.min(m.goal,M.progress(m));journeyPanel(label(m),'<p>'+n+' / '+m.goal+'</p><progress value="'+n+'" max="'+m.goal+'"></progress><p>'+esc(milestoneRewards(m))+'</p>'+(concealed(m)?'<p>'+L('Discover this content to reveal its objective.','Descubra este conteúdo para revelar o objetivo.')+'</p>':''),metaButton('close',L('Back','Voltar'),'','primary'));return true;}return guard(e);};
const oldUnlock=unlockText;unlockText=function(e){if(e.kind==='milestone'){const m=Progress.MILESTONES.find(m=>m.id===e.id);if(m)return M.displayText(m,L(m.en,m.pt),false)+' · ◇ 1';}return oldUnlock(e);};
})();
