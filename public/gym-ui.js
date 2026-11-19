'use strict';
(function(){
  const days = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];
  const defaultDays = [[0],[0,3],[0,2,4],[0,1,3,4],[0,1,2,3,4],[0,1,2,3,4,5],[0,1,2,3,4,5,6]];
  function planner(){
    const scheduled = days.map((_,i)=>i).filter(i=>state.schedule[i]!=='rest');
    const selected = scheduled.length ? scheduled : defaultDays[state.profile.weeklyGoal-1];
    const groups = [...new Set(D.CATALOG.map(e=>e.equipment))];
    const equipment = groups.map(group => {
      const exercises = D.CATALOG.filter(e=>e.equipment===group);
      return `<details class="mt"><summary>${E(group)}</summary><div class="actions mt"><button type="button" class="ghost small-button" data-gym-group="all">Marcar todas</button><button type="button" class="ghost small-button" data-gym-group="none">Desmarcar todas</button></div><div class="check-grid">${exercises.map(e=>
        `<label><input type="checkbox" name="gym-ex" value="${E(e.id)}" ${RitmoGym.available(state,e)?'checked':''}> ${E(e.name)}</label>`).join('')}</div></details>`;
    }).join('');
    const formHTML = `<form id="gym-planner">${select('O que deseja montar?','gym-target',[['','Nova semana'],...state.plans.map(p=>[p.id,'Adaptar ficha · '+p.name])],'')}<div id="gym-week-options"><fieldset><legend>Dias de treino</legend><div class="check-grid">${days.map((d,i)=>
      `<label><input type="checkbox" name="gym-day" value="${i}" ${selected.includes(i)?'checked':''}> ${d}</label>`).join('')}</div></fieldset>
      ${select('Divisão da semana','gym-split',[['upper','Superiores / inferiores'],['push','Empurrar / puxar / pernas'],['full','Corpo inteiro']], 'upper')}
      </div><fieldset class="mt"><legend>O que consigo fazer na minha academia</legend><p class="mini-note">Marque as variações para as quais você tem o aparelho e os acessórios.</p>${equipment}</fieldset>
      <div class="actions mt">${btn('Ver prévia','gym-preview','','primary')}${btn('Salvar apenas equipamentos','gym-inventory')}</div><div id="gym-preview" aria-live="polite"></div></form>`;
    const modal = openModal('Montar minha semana',formHTML,true);
    const form = modal.querySelector('#gym-planner'), preview = form.querySelector('#gym-preview');
    let pending = null;
    form.onchange = () => {
      pending=null;preview.replaceChildren();
      form.querySelector('#gym-week-options').hidden=!!form.elements['gym-target'].value;
    };
    function inventory(){
      const ids = new FormData(form).getAll('gym-ex');
      const groups = [...new Set(D.CATALOG.filter(e=>ids.includes(e.id)).map(e=>e.equipment))];
      return {gymExercises:ids,equipment:groups};
    }
    form.onclick = event => {
      const groupButton=event.target.closest('[data-gym-group]');
      if(groupButton){
        for(const box of groupButton.closest('details').querySelectorAll('input'))box.checked=groupButton.dataset.gymGroup==='all';
        pending=null;preview.replaceChildren();return;
      }
      const action = event.target.closest('[data-action]')?.dataset.action;
      if (!action?.startsWith('gym-')) return;
      event.preventDefault();
      const gym = inventory();
      if (!gym.gymExercises.length) {toast('Marque pelo menos uma variação disponível.');return}
      if (action==='gym-inventory'){
        Object.assign(state.profile,gym);save();closeModal();render();toast('Equipamentos atualizados.');return;
      }
      if (action==='gym-preview'){
        const existing=state.plans.find(p=>p.id===form.elements['gym-target'].value);
        if(existing){
          pending=RitmoGym.adapt({...state,profile:{...state.profile,...gym}},existing);
          const changes=pending.changes.map(c=>`<li>${E(c.from)} → <strong>${E(c.to)}</strong></li>`).join('');
          preview.innerHTML=`<h3 class="mt">${E(existing.name)}</h3>${changes?'<ul>'+changes+'</ul>':'<p>Nenhuma troca sugerida.</p>'}
            ${pending.missing.length?`<p>Sem alternativa equivalente. Permanecem na ficha: ${pending.missing.map(E).join(', ')}.</p>`:''}
            <p class="mini-note">As trocas valem para os próximos treinos desta ficha.</p>${btn('Aplicar à ficha','gym-adapt','','primary')}`;
          preview.scrollIntoView({block:'nearest'});return;
        }
        const choices = new FormData(form), selectedDays = choices.getAll('gym-day').map(Number);
        if (!selectedDays.length){toast('Escolha pelo menos um dia de treino.');return}
        pending = RitmoGym.build({...state,profile:{...state.profile,...gym}},choices.get('gym-split'),selectedDays);
        preview.innerHTML = '<h3 class="mt">Sua semana</h3>'+selectedDays.map((day,i)=>{
          const plan=pending.plans[i], skipped=pending.missing.filter(x=>x.day===day);
          return `<section class="mt"><b>${days[day]} · ${E(plan.name)}</b><p>${plan.exercises.map(e=>E(e.name)).join(' · ')||'Sem exercícios disponíveis'}</p>${skipped.length?`<p class="mini-note">Sem alternativa disponível para ${skipped.map(x=>E(x.name)).join(', ')}.</p>`:''}</section>`;
        }).join('')+'<p class="mini-note mt">Aplicar cria novas fichas e substitui o planejamento semanal. Suas fichas anteriores continuam na biblioteca.</p>'+btn('Aplicar esta semana','gym-apply','','primary',pending.plans.every(p=>p.exercises.length)?'':'disabled');
        preview.scrollIntoView({block:'nearest'});return;
      }
      if(action==='gym-adapt'&&pending?.plan){
        const index=state.plans.findIndex(p=>p.id===pending.plan.id);
        if(index<0)return;
        state.plans[index]=pending.plan;Object.assign(state.profile,gym);
        save();pending=null;closeModal();render();toast('Ficha e equipamentos atualizados.');return;
      }
      if(action==='gym-apply'&&pending?.plans&&pending.plans.every(p=>p.exercises.length)){
        if(state.plans.length+pending.plans.length>100){toast('Limite de 100 fichas atingido.');return}
        state.plans.push(...pending.plans);state.schedule=pending.schedule;
        Object.assign(state.profile,gym,{weeklyGoal:pending.plans.length});
        save();pending=null;closeModal();render();toast('Semana aplicada. Você pode editar cada ficha em Treino.');
      }
    };
  }
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-action="open-gym"]'))planner();
  });
  document.addEventListener('change',event=>{
    const field=event.target;
    if(field.dataset.gymSwap===undefined||!field.value||!draft)return;
    const exercise=draft.exercises[Number(field.dataset.gymSwap)];
    if(!exercise||!D.alternatives(state,exercise.name).some(e=>e.name===field.value))return;
    draft.name=$('#plan-form [name="planName"]').value;
    exercise.name=field.value;exercise.notes='';
    drawPlanEditor();toast('Troca preparada. Salve a ficha para confirmar.');
  });
})();
