const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./public/training-data.js');
const gym = require('./public/gym-planner.js');
test('divisões de quatro a sete dias respeitam calendário, inventário e backup',()=>{
  for(const split of ['upper','push','full']){
    for(let count=4;count<=7;count++){
      const state=D.initial(), days=Array.from({length:count},(_,i)=>6-i);
      const week=gym.build(state,split,days);
      assert.equal(week.plans.length,count);
      for(let i=0;i<7;i++)assert.equal(week.schedule[i]!=='rest',days.includes(i));
      for(const p of week.plans){
        assert(p.exercises.length);
        assert.equal(new Set(p.exercises.map(e=>e.name)).size,p.exercises.length);
      }
      assert.doesNotThrow(()=>D.validate({...state,plans:week.plans,schedule:week.schedule}));
    }
  }
});
test('academia com apenas leg press horizontal: troca compatível, lacunas explícitas e ficha original intacta',()=>{
  const state=D.initial(), replacement=D.info('Leg press horizontal');
  state.profile.gymExercises=[replacement.id];
  const plan={id:'x',name:'Pernas',exercises:['Leg press','Mesa flexora'].map(name=>D.prescription(name))};
  const result=gym.adapt(state,plan);
  assert.equal(result.plan.exercises[0].name,replacement.name);
  assert.equal(plan.exercises[0].name,'Leg press');
  assert.deepEqual(result.missing,['Mesa flexora']);
  assert.equal(result.plan.exercises[1].name,'Mesa flexora');
  const week=gym.build(state,'full',[1,3]);
  assert(week.missing.length);
  for(const day of week.plans)assert.deepEqual(day.exercises.map(e=>e.name),[replacement.name]);
  assert.deepEqual(D.validate(state).profile.gymExercises,[replacement.id]);
});
