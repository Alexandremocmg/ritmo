const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),D=require('./public/training-data.js');
const requested=[
 ['Leg Press 45°','Leg press'],['Leg Press horizontal','Leg press horizontal'],['Extensão de joelho','Cadeira extensora'],['Flexão de joelho sentado','Flexora sentada'],['Flexão de joelho deitado','Mesa flexora'],['Abdução de quadril','Abdução de quadril'],['Adução de quadril','Adução de quadril'],['Agachamento Hack','Agachamento Hack'],['Máquina de panturrilha','Panturrilha'],['Glúteo máquina','Glúteo na máquina'],
 ['Supino máquina','Supino na máquina'],['Supino inclinado máquina','Supino inclinado na máquina'],['Crucifixo máquina','Crucifixo na máquina'],['Crossover','Crossover'],['Supino Smith','Supino no Smith'],
 ['Puxada frontal','Puxada frontal'],['Remada baixa','Remada baixa'],['Remada máquina','Remada na máquina'],['Puxada articulada','Puxada articulada'],['Pullover','Pullover na máquina'],['Remada no Smith','Remada no Smith'],
 ['Shoulder Press','Desenvolvimento na máquina'],['Lateral Raise Machine','Elevação lateral na máquina'],['Crucifixo invertido','Crucifixo invertido'],['Desenvolvimento no Smith','Desenvolvimento no Smith'],
 ['Rosca bíceps','Rosca bíceps na máquina'],['Rosca Scott','Rosca Scott na máquina'],['Rosca na polia','Rosca na polia'],['Tríceps pulley','Tríceps na polia'],['Tríceps corda','Tríceps corda'],['Tríceps máquina','Tríceps na máquina'],['Tríceps mergulho','Tríceps mergulho assistido'],
 ['Abdominal máquina','Abdominal na máquina'],['Extensão lombar','Extensão lombar'],['Rotação de tronco','Rotação de tronco'],['Elevação de pernas','Elevação de pernas']
];
test('todos os movimentos solicitados são encontrados sem nomes ou sinônimos em conflito',()=>{
 assert.equal(requested.length,36);assert.equal(D.CATALOG.length,46);
 assert.equal(new Set(D.CATALOG.map(e=>e.id)).size,46);
 const owners=new Map();
 for(const e of D.CATALOG)for(const name of [e.name,...e.aliases]){const key=D.searchKey(name);assert(!owners.has(key)||owners.get(key)===e.id,'Nome ambíguo: '+name);owners.set(key,e.id)}
 for(const [query,canonical]of requested){assert.equal(D.exerciseName(query),canonical);assert.equal(D.info(query).name,canonical);assert(D.matchesExercise(D.info(query),query))}
 assert.equal(D.exerciseName('  FLEXAO DE JOELHO SENTADO  '),'Flexora sentada');
 assert.equal(D.exerciseName('Meu exercício personalizado'),'Meu exercício personalizado');
 for(const name of ['Esteira','Bicicleta vertical','Bicicleta horizontal','Elíptico','Escada','Remo ergométrico'])assert(D.CARDIO_ACTIVITIES.includes(name));
 assert.equal(new Set(D.CARDIO_ACTIVITIES).size,D.CARDIO_ACTIVITIES.length);
});
test('variações têm registros independentes e os nomes anteriores permanecem preservados',()=>{
 assert.equal(D.info('Desenvolvimento').equipment,'Halteres');
 assert.equal(D.info('Desenvolvimento na máquina').equipment,'Máquina');
 assert.notEqual(D.info('Elevação lateral').id,D.info('Lateral Raise Machine').id);
 assert.notEqual(D.info('Tríceps corda').id,D.info('Tríceps pulley').id);
 assert.notEqual(D.info('Leg Press 45°').id,D.info('Leg Press horizontal').id);
 assert.notEqual(D.info('Flexora sentada').id,D.info('Mesa flexora').id);
 assert(!D.alternatives(D.initial(),'Cadeira flexora').some(e=>e.name==='Flexora sentada'));
 const state=D.initial(),before=D.clone(state.plans);
 state.plans[0].exercises.push(D.prescription('Flexão de joelho sentado'));
 state.cardio=[{id:'rowing',type:'Remo ergométrico',ended:2000,minutes:15,distance:2,intensity:'moderada',heartRate:null}];
 const migrated=D.validate(state);
 assert.deepEqual(migrated.plans[1],before[1]);
 assert.equal(migrated.plans[0].exercises.at(-1).name,'Flexão de joelho sentado');
 assert.deepEqual(migrated.cardio,state.cardio);
 const oldSession=D.startSession(state,{id:'old',name:'Antigo',exercises:[D.prescription('Desenvolvimento')]},1000);
 oldSession.exercises[0].sets.forEach(s=>Object.assign(s,{weight:12,reps:12,done:true}));state.history=[D.normalizeCompleted(oldSession,2000)];
 const machineSession=D.startSession(state,{id:'new',name:'Máquina',exercises:[D.prescription('Desenvolvimento na máquina')]},3000);
 assert(machineSession.exercises[0].sets.every(s=>s.weight===0));
});
test('kg de assistência não geram sugestão de aumento, recorde ou volume de carga',()=>{
 const state=D.initial(),plan={id:'assisted',name:'Assistido',exercises:[D.prescription('Tríceps mergulho assistido')]},s=D.startSession(state,plan,1000);
 s.exercises[0].sets.forEach(x=>Object.assign(x,{weight:50,reps:12,done:true}));state.history=[D.normalizeCompleted(s,2000)];
 assert.equal(D.volume(s),0);assert.equal(D.progression(state,plan.exercises[0]).eligible,false);
 assert.equal(D.records(state,'Tríceps mergulho assistido').e1rm,0);assert.deepEqual(D.records(state,'Tríceps mergulho assistido').events,[]);
 assert.equal(D.weeklyStats(state,2000).groups['Tríceps'],3);
 assert.equal(D.lastExercise(state,'Tríceps mergulho assistido').sets[0].weight,50);
});
test('biblioteca busca sinônimos e permite iniciar o registro do cardio escolhido',()=>{
 const source=fs.readFileSync('public/ritmo-app.js','utf8').match(/^function libraryView\(\).*$/m)[0];
 const ctx={D,state:{plans:[]},librarySearch:'cadeira flexora',libraryGroup:'',E:String,I:()=>'',videoMapping:()=>null,options:()=>'',btn:(label,action,value)=>`<button data-action="${action}" data-value="${value}">${label}</button>`,empty:String};
 vm.runInNewContext(source,ctx);let html=ctx.libraryView();assert(html.includes('<h3>Flexora sentada</h3>'));assert(!html.includes('<h3>Mesa flexora</h3>'));
 ctx.librarySearch='stair climber';html=ctx.libraryView();assert(html.includes('data-action="cardio" data-value="Escada"'));assert(!html.includes('Nenhum exercício encontrado'));
 ctx.libraryGroup='Cardio';ctx.librarySearch='';html=ctx.libraryView();assert(html.includes('Remo ergométrico'));assert(!html.includes('Conhecer exercício'));
 const action=fs.readFileSync('public/ritmo-actions.js','utf8').match(/^function cardioForm\(.*$/m)[0];
 ctx.openModal=(title,body)=>{ctx.body=body};ctx.select=(label,name,values,selected)=>`${name}:${selected}`;ctx.label=()=>'';vm.runInNewContext(action,ctx);ctx.cardioForm('Bicicleta horizontal');assert(ctx.body.includes('type:Bicicleta horizontal'));
});
