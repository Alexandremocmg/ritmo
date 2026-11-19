(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./training-data.js'));
  else root.RitmoGym = factory(root.RData);
})(globalThis, function(D) {
  'use strict';
  const splits = {
    upper: ['Superiores', 'Inferiores'],
    push: ['Empurrar', 'Puxar', 'Pernas'],
    full: ['Corpo inteiro']
  };
  const templates = {
    Superiores: ['Supino com halteres', 'Remada baixa', 'Desenvolvimento', 'Puxada frontal', 'Rosca direta', 'Tríceps na polia'],
    Inferiores: ['Leg press', 'Mesa flexora', 'Cadeira extensora', 'Glúteo na máquina', 'Panturrilha'],
    Empurrar: ['Supino com halteres', 'Supino inclinado', 'Desenvolvimento', 'Elevação lateral', 'Tríceps na polia'],
    Puxar: ['Puxada frontal', 'Remada baixa', 'Crucifixo invertido', 'Rosca direta'],
    Pernas: ['Agachamento', 'Flexora sentada', 'Glúteo na máquina', 'Cadeira extensora', 'Panturrilha'],
    'Corpo inteiro': ['Leg press', 'Supino com halteres', 'Remada baixa', 'Flexora sentada', 'Desenvolvimento']
  };
  function available(state, exercise) {
    return state.profile.equipment.includes(exercise.equipment) &&
      (!Array.isArray(state.profile.gymExercises) || state.profile.gymExercises.includes(exercise.id));
  }
  function build(state, split, days) {
    const sequence = splits[split];
    if (!sequence || !days.length || days.length > 7 || new Set(days).size !== days.length ||
        !days.every(day => Number.isInteger(day) && day >= 0 && day < 7)) throw Error('Seleção de dias inválida.');
    const plans = [], missing = [], schedule = Array(7).fill('rest');
    const orderedDays = [...days].sort((a,b) => a-b);
    orderedDays.forEach((day, index) => {
      const group = sequence[index % sequence.length];
      const rotation = Math.floor(index / sequence.length);
      const plan = {id:D.id(), name:group+' '+String.fromCharCode(65+rotation), exercises:[]};
      for (const name of templates[group]) {
        const source = D.info(name);
        const choices = [source, ...D.alternatives(state, name)].filter(e => available(state,e) && !plan.exercises.some(x => x.name===e.name));
        if (!choices.length) {missing.push({day,name});continue}
        plan.exercises.push(D.prescription(choices[rotation % choices.length].name));
      }
      plans.push(plan);
      schedule[day] = plan.id;
    });
    return {plans,schedule,missing};
  }
  function adapt(state, original) {
    const plan = D.clone(original), changes = [], missing = [];
    const used = new Set(plan.exercises.filter(e => available(state,D.info(e.name))).map(e => D.exerciseName(e.name)));
    for (const exercise of plan.exercises) {
      const source = D.info(exercise.name);
      if (available(state,source)) continue;
      const replacement = D.alternatives(state,source.name).find(e => available(state,e) && !used.has(e.name));
      if (!replacement) {missing.push(exercise.name);continue}
      changes.push({from:exercise.name,to:replacement.name});
      used.add(replacement.name);
      exercise.name = replacement.name;
      exercise.notes = '';
    }
    return {plan,changes,missing};
  }
  return {build,available,adapt};
});
