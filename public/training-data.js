(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RData=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const EXERCISE_ALIASES={
  "Leg press": [
    "Leg Press 45°",
    "Leg Press inclinado"
  ],
  "Cadeira extensora": [
    "Extensão de joelho",
    "Extensão de joelhos",
    "Leg Extension"
  ],
  "Flexora sentada": [
    "Flexão de joelho sentado",
    "Cadeira flexora",
    "Seated Leg Curl"
  ],
  "Mesa flexora": [
    "Flexão de joelho deitado",
    "Lying Leg Curl"
  ],
  "Panturrilha": [
    "Máquina de panturrilha"
  ],
  "Puxada frontal": [
    "Pulley",
    "Lat Pulldown"
  ],
  "Remada baixa": [
    "Seated Row"
  ],
  "Remada na máquina": [
    "Remada máquina",
    "Row Machine"
  ],
  "Tríceps na polia": [
    "Tríceps pulley",
    "Triceps Pushdown"
  ],
  "Leg press horizontal": [
    "Horizontal Leg Press"
  ],
  "Abdução de quadril": [
    "Cadeira abdutora",
    "Hip Abduction"
  ],
  "Adução de quadril": [
    "Cadeira adutora",
    "Hip Adduction"
  ],
  "Agachamento Hack": [
    "Hack Squat"
  ],
  "Glúteo na máquina": [
    "Glúteo máquina",
    "Máquina de glúteo"
  ],
  "Supino na máquina": [
    "Supino máquina",
    "Chest Press"
  ],
  "Supino inclinado na máquina": [
    "Supino inclinado máquina",
    "Incline Chest Press"
  ],
  "Crucifixo na máquina": [
    "Crucifixo máquina",
    "Peck Deck"
  ],
  "Crossover": [
    "Cross Over",
    "Crossover na polia"
  ],
  "Supino no Smith": [
    "Supino Smith",
    "Smith Bench Press"
  ],
  "Puxada articulada": [
    "High Row"
  ],
  "Pullover na máquina": [
    "Pullover",
    "Pullover Machine"
  ],
  "Remada no Smith": [
    "Smith Row"
  ],
  "Desenvolvimento na máquina": [
    "Desenvolvimento máquina",
    "Shoulder Press"
  ],
  "Elevação lateral na máquina": [
    "Elevação lateral máquina",
    "Lateral Raise Machine"
  ],
  "Crucifixo invertido": [
    "Reverse Fly",
    "Peck Deck invertido"
  ],
  "Desenvolvimento no Smith": [
    "Smith Shoulder Press"
  ],
  "Rosca bíceps na máquina": [
    "Rosca bíceps",
    "Máquina de bíceps",
    "Biceps Curl Machine"
  ],
  "Rosca Scott na máquina": [
    "Rosca Scott",
    "Scott Machine"
  ],
  "Rosca na polia": [
    "Cable Curl"
  ],
  "Tríceps corda": [
    "Tríceps na polia com corda",
    "Rope Pushdown"
  ],
  "Tríceps na máquina": [
    "Tríceps máquina",
    "Triceps Extension"
  ],
  "Tríceps mergulho assistido": [
    "Tríceps mergulho",
    "Assisted Dip"
  ],
  "Abdominal na máquina": [
    "Abdominal máquina",
    "Abdominal Crunch"
  ],
  "Extensão lombar": [
    "Back Extension"
  ],
  "Rotação de tronco": [
    "Rotary Torso"
  ],
  "Elevação de pernas": [
    "Captain's Chair",
    "Cadeira romana"
  ]
};
const CARDIO_ACTIVITIES=["Caminhada","Corrida","Bicicleta","Esteira","Bicicleta vertical","Bicicleta horizontal","Elíptico","Escada","Remo ergométrico"];
const CATALOG=[
 ['supino-halteres','Supino com halteres','Peito',['Tríceps','Ombros'],'Halteres','empurrar-horizontal','Mantenha os halteres controlados e registre a carga por halter.','Evite perder o controle na descida.'],
 ['supino-inclinado','Supino inclinado','Peito',['Tríceps','Ombros'],'Halteres','empurrar-inclinado','Registre o equipamento e a inclinação usados para comparar sessões equivalentes.','Evite comparar cargas de máquinas e halteres como se fossem iguais.'],
 ['desenvolvimento','Desenvolvimento','Ombros',['Tríceps'],'Halteres','empurrar-vertical','Use o vídeo para conferir a variação sentada com halteres.','Evite compensações para completar uma repetição.'],
 ['elevacao-lateral','Elevação lateral','Ombros',[],'Halteres','abducao-ombro','Registre a carga por halter e mantenha o movimento controlado.','Evite usar impulso para elevar a carga.'],
 ['triceps-polia','Tríceps na polia','Tríceps',[],'Polia','extensao-cotovelo','Anote o acessório e a máquina utilizados.','Evite mudar o equipamento sem registrar a alteração.'],
 ['puxada-frontal','Puxada frontal','Costas',['Bíceps'],'Polia','puxar-vertical','Use o vídeo incluído para observar a execução e a pegada.','Evite puxar a barra por trás da cabeça.'],
 ['remada-baixa','Remada baixa','Costas',['Bíceps'],'Polia','puxar-horizontal','Compare o seu movimento com a demonstração em verde.','Evite usar o balanço do tronco para deslocar a carga.'],
 ['remada-halter','Remada com halter','Costas',['Bíceps'],'Halteres','puxar-horizontal','Registre a carga de um halter e mantenha o mesmo critério em todas as sessões.','Evite transformar a remada em um movimento de rotação do tronco.'],
 ['rosca-direta','Rosca direta','Bíceps',[],'Barra','flexao-cotovelo','Anote se o peso registrado inclui a barra.','Evite balanço para completar repetições.'],
 ['agachamento','Agachamento','Quadríceps',['Glúteos'],'Halteres','agachar','O vídeo incluído mostra a variação goblet com halter.','Evite comparar diretamente a carga goblet com a de uma barra.'],
 ['leg-press','Leg press','Quadríceps',['Glúteos'],'Máquina','agachar','Registre a máquina e sua regulagem. O vídeo mostra variações na posição dos pés.','Evite comparar cargas entre máquinas diferentes.'],
 ['cadeira-extensora','Cadeira extensora','Quadríceps',[],'Máquina','extensao-joelho','Anote a regulagem do banco e da máquina para repetir a sessão.','Evite movimentos sem controle.'],
 ['mesa-flexora','Mesa flexora','Posterior de coxa',[],'Máquina','flexao-joelho','Registre a regulagem da máquina e a carga usada.','Evite usar impulso para deslocar o peso.'],
 ['panturrilha','Panturrilha','Panturrilhas',[],'Máquina','flexao-plantar','Especifique a variação usada: sentada, em pé ou na máquina.','Evite comparar cargas entre variações diferentes.'],
 ['supino-barra','Supino com barra','Peito',['Tríceps','Ombros'],'Barra','empurrar-horizontal','Registre a carga total, incluindo a barra, se esse for seu critério habitual.','Evite mudar o critério de carga entre sessões.'],
 ['remada-maquina','Remada na máquina','Costas',['Bíceps'],'Máquina','puxar-horizontal','Anote o modelo da máquina e a pegada.','Cargas de máquinas diferentes não são diretamente comparáveis.'],
 ['rosca-halteres','Rosca com halteres','Bíceps',[],'Halteres','flexao-cotovelo','O vídeo mostra a variação em banco inclinado. Registre a carga por halter e a variação usada.','Evite usar impulso.'],
 ['flexora-sentada','Flexora sentada','Posterior de coxa',[],'Máquina','flexao-joelho','Anote a regulagem e trate esta variação como um exercício diferente no histórico.','Não transfira automaticamente a carga da mesa flexora.'],
 ['panturrilha-halter','Panturrilha com halteres','Panturrilhas',[],'Halteres','flexao-plantar','Registre a carga e se o movimento é feito com uma ou duas pernas.','Não compare diretamente com máquinas.'],
 ["leg-press-horizontal","Leg press horizontal","Quadríceps",["Glúteos"],"Máquina","agachar","Anote o modelo e a regulagem do leg press horizontal.","Mantenha o histórico separado do leg press inclinado."],
 ["abducao-quadril","Abdução de quadril","Glúteos",[],"Máquina","abducao-quadril","Registre a regulagem da cadeira abdutora e a carga usada.","Não confunda a cadeira abdutora com a adutora."],
 ["aducao-quadril","Adução de quadril","Adutores",[],"Máquina","aducao-quadril","Registre a regulagem da cadeira adutora e a carga usada.","Mantenha o mesmo critério de regulagem entre sessões."],
 ["agachamento-hack","Agachamento Hack","Quadríceps",["Glúteos"],"Máquina","agachar","Anote o modelo do Hack Squat e o critério de carga.","Não compare diretamente a carga com leg press ou agachamento livre."],
 ["gluteo-maquina","Glúteo na máquina","Glúteos",["Posterior de coxa"],"Máquina","extensao-quadril","Registre o modelo da máquina e se a carga é usada por lado.","Mantenha o mesmo critério ao alternar as pernas."],
 ["supino-maquina","Supino na máquina","Peito",["Tríceps","Ombros"],"Máquina","empurrar-horizontal","Anote o modelo do Chest Press, banco e pegada.","As cargas não equivalem às do supino com halteres ou barra."],
 ["supino-inclinado-maquina","Supino inclinado na máquina","Peito",["Tríceps","Ombros"],"Máquina","empurrar-inclinado","Anote o modelo do Incline Chest Press e a regulagem.","Mantenha este registro separado do supino inclinado com halteres."],
 ["crucifixo-maquina","Crucifixo na máquina","Peito",["Ombros"],"Máquina","aducao-ombro","Registre a regulagem do Peck Deck e a carga.","Não confunda com o crucifixo invertido para ombros."],
 ["crossover","Crossover","Peito",["Ombros"],"Polia","aducao-ombro","Anote a altura das polias, o acessório e a carga por lado.","Mantenha o mesmo critério de carga entre sessões."],
 ["supino-smith","Supino no Smith","Peito",["Tríceps","Ombros"],"Máquina","empurrar-horizontal","Anote a posição do banco e se a carga inclui a barra do Smith.","Barras de máquinas Smith diferentes podem ter resistências diferentes."],
 ["puxada-articulada","Puxada articulada","Costas",["Bíceps"],"Máquina","puxar-diagonal","Registre o modelo High Row, a pegada e a carga por lado.","Mantenha o registro separado da puxada frontal na polia."],
 ["pullover-maquina","Pullover na máquina","Costas",[],"Máquina","extensao-ombro","Anote o modelo da máquina de pullover e a regulagem.","Não compare diretamente com pullover usando halter."],
 ["remada-smith","Remada no Smith","Costas",["Bíceps"],"Máquina","puxar-horizontal","Anote a pegada e se a carga inclui a barra do Smith.","Mantenha o registro separado da remada sentada na máquina."],
 ["desenvolvimento-maquina","Desenvolvimento na máquina","Ombros",["Tríceps"],"Máquina","empurrar-vertical","Registre o modelo do Shoulder Press e a regulagem do banco.","Mantenha o histórico separado da versão com halteres."],
 ["elevacao-lateral-maquina","Elevação lateral na máquina","Ombros",[],"Máquina","abducao-ombro","Registre o modelo e a regulagem da máquina de elevação lateral.","Mantenha o histórico separado da versão com halteres."],
 ["crucifixo-invertido","Crucifixo invertido","Ombros",["Costas"],"Máquina","abducao-horizontal-ombro","Anote a regulagem do Reverse Fly e a pegada utilizada.","Não confunda com o crucifixo para peito no Peck Deck."],
 ["desenvolvimento-smith","Desenvolvimento no Smith","Ombros",["Tríceps"],"Máquina","empurrar-vertical","Anote a posição do banco e o critério de carga da barra do Smith.","Não transfira automaticamente cargas da versão com halteres."],
 ["rosca-biceps-maquina","Rosca bíceps na máquina","Bíceps",[],"Máquina","flexao-cotovelo","Anote o modelo da máquina de bíceps e a regulagem.","Mantenha o registro separado da máquina Scott com apoio de braços."],
 ["rosca-scott-maquina","Rosca Scott na máquina","Bíceps",[],"Máquina","flexao-cotovelo","Registre o modelo e a regulagem do apoio da máquina Scott.","Não compare diretamente com a rosca Scott com barra livre."],
 ["rosca-polia","Rosca na polia","Bíceps",[],"Polia","flexao-cotovelo","Anote a altura da polia, o acessório e o critério de carga.","Mantenha o mesmo acessório para comparar sessões."],
 ["triceps-corda","Tríceps corda","Tríceps",[],"Polia","extensao-cotovelo","Registre a polia e o uso da corda nesta variação.","Não transfira automaticamente cargas da variação com barra curta."],
 ["triceps-maquina","Tríceps na máquina","Tríceps",[],"Máquina","extensao-cotovelo","Registre o modelo Triceps Extension e a regulagem.","Não compare diretamente a carga com a polia."],
 ["triceps-mergulho-assistido","Tríceps mergulho assistido","Tríceps",["Peito","Ombros"],"Máquina","mergulho-assistido","No campo de carga, registre os kg de assistência; anote também a regulagem.","Nesta máquina, mais assistência reduz a resistência. O app não sugere aumentar a assistência como progressão."],
 ["abdominal-maquina","Abdominal na máquina","Abdômen",[],"Máquina","flexao-tronco","Anote o modelo da máquina abdominal e a regulagem.","Mantenha o mesmo critério de carga entre sessões."],
 ["extensao-lombar","Extensão lombar","Lombar",["Glúteos","Posterior de coxa"],"Máquina","extensao-tronco","Registre o modelo Back Extension e a regulagem utilizada.","Mantenha o registro separado de extensões em banco livre."],
 ["rotacao-tronco","Rotação de tronco","Abdômen",[],"Máquina","rotacao-tronco","Anote o modelo Rotary Torso e a carga por lado.","Use o mesmo critério de registro para os dois lados."],
 ["elevacao-pernas","Elevação de pernas","Abdômen",["Flexores do quadril"],"Peso corporal","flexao-quadril","Anote o uso da Captain’s Chair e se as pernas ficam estendidas ou flexionadas.","Mantenha a variação registrada para comparar sessões."]
].map(([id,name,primary,secondary,equipment,pattern,cue,mistake])=>({id,name,primary,secondary,equipment,pattern,cue,mistake,aliases:EXERCISE_ALIASES[name]||[]}));
const SET_TYPES=['normal','warmup','drop','failure'];
const working=s=>s.done&&s.reps>0&&s.type!=='warmup';
const clone=x=>JSON.parse(JSON.stringify(x));
const number=(x,fallback=0)=>Number.isFinite(Number(x))?Number(x):fallback;
const clamp=(x,a,b)=>Math.min(b,Math.max(a,number(x,a)));
const id=()=>typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2)+Date.now().toString(36);
const searchKey=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function findExercise(name){const key=searchKey(name);return CATALOG.find(e=>searchKey(e.name)===key||e.aliases.some(a=>searchKey(a)===key))}
function exerciseName(name){return findExercise(name)?.name||String(name).trim()}
function matchesExercise(e,query){return searchKey([e.name,e.primary,...(e.secondary||[]),e.equipment,...(e.aliases||[])].join(' ')).includes(searchKey(query))}
function info(name){return findExercise(name)||{id:name,name,primary:'Não classificado',secondary:[],equipment:'Outro',pattern:'personalizado',cue:'Exercício personalizado. Registre as características e a orientação recebida.',mistake:'Mantenha o mesmo critério de registro entre sessões.'}}
function prescription(name,sets=3,min=8,max=12){return {id:id(),name,sets,repsMin:min,repsMax:max,rest:90,increment:2,notes:''}}
function initial(){return {schemaVersion:3,folders:[],profile:{name:'',goal:'Hipertrofia',weeklyGoal:4,experience:'Iniciante',equipment:['Halteres','Barra','Polia','Máquina'],limitations:'',effortMetric:'RIR',theme:'light',progressionIncrement:2,cardioTarget:150},plans:[{id:'a',name:'Peito, ombros e tríceps',exercises:['Supino com halteres','Supino inclinado','Desenvolvimento','Elevação lateral','Tríceps na polia'].map(n=>prescription(n,3,8,n==='Elevação lateral'?15:12))},{id:'b',name:'Costas e bíceps',exercises:['Puxada frontal','Remada baixa','Remada com halter','Rosca direta'].map(n=>prescription(n))},{id:'c',name:'Pernas e glúteos',exercises:['Agachamento','Leg press','Cadeira extensora','Mesa flexora','Panturrilha'].map(n=>prescription(n,3,8,n==='Panturrilha'?15:12))}],history:[],session:null,videos:{},schedule:['a','b','rest','c','a','rest','rest'],cardio:[],measurements:[]}}
function normalizedPrescription(e){if(Array.isArray(e))return prescription(String(e[0]),clamp(e[1],1,10),Math.max(1,number(e[2],12)-2),clamp(e[2],1,100));return {...prescription(String(e.name||'')),...e,id:e.id||id(),sets:clamp(e.sets,1,10),repsMin:clamp(e.repsMin??8,1,100),repsMax:clamp(e.repsMax??12,1,100),rest:clamp(e.rest??90,0,900),increment:clamp(e.increment??2,.25,100),notes:String(e.notes||'').slice(0,1000)}}
function normalizeSession(session){if(!session)return null;return {...session,id:session.id||id(),exercises:session.exercises.map(e=>({...normalizedPrescription(e),sets:e.sets.map(s=>({...s,weight:number(s.weight),reps:number(s.reps),effort:s.effort===null||s.effort===undefined?null:number(s.effort),done:!!s.done,type:s.type||'normal'})),targetSets:e.targetSets||e.sets.length,metric:e.metric||'RIR'}))}}
function migrate(input){const base=initial();if(!input||typeof input!=='object'||!Array.isArray(input.plans)||!Array.isArray(input.history))throw Error('Backup sem fichas ou histórico');const out={...base,...clone(input),schemaVersion:3,profile:{...base.profile,...input.profile},plans:input.plans.map(p=>({...p,exercises:p.exercises.map(normalizedPrescription)})),history:input.history.map(h=>normalizeSession(h)),session:normalizeSession(input.session),videos:clone(input.videos||{}),folders:clone(input.folders||[]),schedule:Array.isArray(input.schedule)?input.schedule:[input.plans[0]?.id||'rest',input.plans[1]?.id||'rest','rest',input.plans[2]?.id||'rest','rest','rest','rest'],cardio:input.cardio||[],measurements:input.measurements||[]};out.history.forEach(h=>{h.volume=volume(h);h.sets=h.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.done).length,0)});return out}
function validate(input){
 const plain=x=>x&&typeof x==='object'&&!Array.isArray(x);const str=x=>typeof x==='string'&&x.length>0&&x.length<=200;const finite=(x,a,b)=>typeof x==='number'&&Number.isFinite(x)&&x>=a&&x<=b;const integer=(x,a,b)=>Number.isInteger(x)&&finite(x,a,b);
 if(!plain(input)||![undefined,1,2,3].includes(input.schemaVersion)||!Array.isArray(input.plans)||input.plans.length>100||!Array.isArray(input.history)||input.history.length>10000)throw Error('Formato de backup inválido');
 const validPlan=e=>Array.isArray(e)?str(e[0])&&integer(e[1],1,10)&&integer(e[2],1,100):plain(e)&&str(e.name)&&integer(e.sets,1,10)&&integer(e.repsMin,1,100)&&integer(e.repsMax,e.repsMin,100)&&finite(e.rest,0,900)&&finite(e.increment,.25,100);
 if(!input.plans.every(p=>plain(p)&&str(p.id)&&str(p.name)&&Array.isArray(p.exercises)&&p.exercises.length>0&&p.exercises.length<=100&&p.exercises.every(validPlan)))throw Error('Fichas inválidas');
 if(new Set(input.plans.map(p=>p.id)).size!==input.plans.length)throw Error('Fichas duplicadas');
 function validSession(s,ended){return plain(s)&&str(s.name)&&finite(s.started,0,1e15)&&(!ended||finite(s.ended,s.started,1e15))&&Array.isArray(s.exercises)&&(s.exercises.length>0||!ended)&&s.exercises.length<=100&&s.exercises.every(e=>plain(e)&&str(e.name)&&Array.isArray(e.sets)&&e.sets.length>0&&e.sets.length<=100&&e.sets.every(x=>plain(x)&&finite(x.weight,0,2000)&&integer(x.reps,0,1000)&&typeof x.done==='boolean'&&(x.type===undefined||SET_TYPES.includes(x.type))&&(x.effort===undefined||x.effort===null||finite(x.effort,0,10))))}
 if(!input.history.every(s=>validSession(s,true))||(input.session&&!validSession(input.session,false)))throw Error('Sessões inválidas');
 if(input.profile!==undefined&&(!plain(input.profile)||typeof input.profile.name!=='string'||input.profile.name.length>100||!integer(input.profile.weeklyGoal,1,7)||!Array.isArray(input.profile.equipment)||!input.profile.equipment.every(str)||!['RIR','RPE'].includes(input.profile.effortMetric)||!finite(input.profile.progressionIncrement,.25,100)||!finite(input.profile.cardioTarget,0,1000)))throw Error('Perfil inválido');
 if(input.profile&&(['goal','experience','limitations'].some(k=>input.profile[k]!==undefined&&(typeof input.profile[k]!=='string'||input.profile[k].length>1000))))throw Error('Preferências inválidas');
 if(input.measurements?.some(m=>m.fat!==null&&m.fat!==undefined&&m.fat>100))throw Error('Percentual inválido');
 if(input.cardio?.some(c=>c.heartRate!==undefined&&c.heartRate!==null&&!finite(c.heartRate,20,250)))throw Error('Frequência cardíaca inválida');
 if(input.schedule!==undefined&&(!Array.isArray(input.schedule)||input.schedule.length!==7||!input.schedule.every(s=>s==='rest'||input.plans.some(p=>p.id===s))))throw Error('Planejamento inválido');
 if(input.cardio!==undefined&&(!Array.isArray(input.cardio)||input.cardio.length>10000||!input.cardio.every(c=>plain(c)&&str(c.id)&&str(c.type)&&finite(c.ended,0,1e15)&&finite(c.minutes,.1,1440)&&finite(c.distance,0,1000)&&['leve','moderada','vigorosa'].includes(c.intensity))))throw Error('Cardio inválido');
 if(input.measurements!==undefined&&(!Array.isArray(input.measurements)||input.measurements.length>10000||!input.measurements.every(m=>plain(m)&&str(m.id)&&finite(m.ended,0,1e15)&&Object.entries(m).filter(([k])=>!['id','ended'].includes(k)).every(([k,v])=>['weight','height','waist','chest','arm','thigh','hip','fat'].includes(k)&&(v===null||finite(v,0,k==='weight'?500:300))))))throw Error('Medidas inválidas');
 if(input.folders!==undefined&&(!Array.isArray(input.folders)||input.folders.length>100||!input.folders.every(f=>plain(f)&&str(f.id)&&str(f.name))||new Set(input.folders.map(f=>f.id)).size!==input.folders.length))throw Error('Pastas inválidas');
 if(input.plans.some(p=>p.folderId!==undefined&&p.folderId!==''&&!input.folders?.some(f=>f.id===p.folderId)))throw Error('Pasta da rotina inválida');
 if(input.plans.some(p=>p.exercises.some(e=>!Array.isArray(e)&&e.setTypes!==undefined&&(!Array.isArray(e.setTypes)||e.setTypes.length!==e.sets||!e.setTypes.every(t=>SET_TYPES.includes(t))))))throw Error('Tipos de série da rotina inválidos');
 if(input.profile?.theme!==undefined&&!['light','dark'].includes(input.profile.theme))throw Error('Tema inválido');
 if(input.videos!==undefined){if(!plain(input.videos)||Object.keys(input.videos).length>1000)throw Error('Vídeos inválidos');for(const [name,v]of Object.entries(input.videos)){if(!str(name)||['__proto__','constructor','prototype'].includes(name)||!plain(v))throw Error('Vídeo inválido');if(v.kind==='file'){if(!str(v.id)||!str(v.name))throw Error('Arquivo inválido')}else if(v.kind==='tiktok'){let url;try{url=new URL(v.url)}catch{throw Error('Link inválido')}if(!/^[0-9]{15,25}$/.test(v.id)||url.protocol!=='https:'||!['www.tiktok.com','tiktok.com'].includes(url.hostname)||!url.pathname.replace(/\/$/,'').endsWith('/video/'+v.id))throw Error('Link inválido')}else throw Error('Vídeo inválido')}}
 return migrate(input)
}
function dayKey(time){const d=new Date(time);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function weekStart(time=Date.now()){const d=new Date(time);d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return +d}
function weekDays(time=Date.now()){const start=new Date(weekStart(time));return Array.from({length:7},(_,i)=>{const d=new Date(start);d.setDate(d.getDate()+i);return +d})}
function weekItems(items,time=Date.now()){const days=new Set(weekDays(time).map(dayKey));return items.filter(x=>days.has(dayKey(x.ended)))}
function isAssisted(name){return info(name).id==='triceps-mergulho-assistido'}
function volume(s){return s.exercises.reduce((n,e)=>n+(isAssisted(e.name)?0:e.sets.reduce((a,x)=>a+(working(x)?number(x.weight)*number(x.reps):0),0)),0)}
function lastExercise(state,name,before=Infinity){return state.history.filter(h=>h.ended<before).slice().sort((a,b)=>b.ended-a.ended).flatMap(h=>h.exercises.filter(e=>e.name===name&&e.sets.some(s=>s.done)).map(e=>({...e,ended:h.ended}))).at(0)||null}
function previousSet(previous,index,currentRows){if(!previous)return null;let exact=previous.sets[index];if(currentRows){const type=currentRows[index]?.type||'normal',ordinal=currentRows.slice(0,index+1).filter(s=>(s.type||'normal')===type).length-1;exact=previous.sets.filter(s=>(s.type||'normal')===type)[ordinal]}return exact?.done?exact:null}
function startSession(state,plan,now=Date.now()){return {id:id(),planId:plan.id,name:plan.name,started:now,exercises:plan.exercises.map(e=>{const previous=lastExercise(state,e.name);return {...clone(e),targetSets:e.sets,metric:state.profile.effortMetric,sets:Array.from({length:e.sets},(_,i)=>{const rows=Array.from({length:e.sets},(_,j)=>({type:e.setTypes?.[j]||'normal'}));return {weight:previousSet(previous,i,rows)?.weight||0,reps:e.repsMax,effort:null,done:false,type:rows[i].type}}),notes:e.notes||''}})}}
function progression(state,entry){if(isAssisted(entry.name))return {eligible:false,reason:'A carga representa assistência: mais kg tornam o movimento mais leve. Revise a assistência manualmente.'};const previous=lastExercise(state,entry.name);if(!previous)return {eligible:false,reason:'Registre uma sessão para comparar a próxima.'};const types=Array.isArray(entry.sets)?entry.sets.map(s=>s.type||'normal'):Array.from({length:entry.sets},(_,i)=>entry.setTypes?.[i]||'normal');if(types.some(t=>t==='drop'||t==='failure')||previous.sets.some(s=>s.type==='drop'||s.type==='failure'))return {eligible:false,reason:'Uma sessão com drop sets ou séries marcadas até a falha requer revisão individual da progressão.'};const n=types.filter(t=>t!=='warmup').length,rows=previous.sets.filter(s=>s.type!=='warmup');if(!n)return {eligible:false,reason:'Adicione séries de trabalho para comparar a progressão.'};if(rows.length!==n||rows.some(s=>!s.done))return {eligible:false,reason:'A sessão anterior não tem todas as séries previstas concluídas.'};if(rows.some(s=>s.weight<=0)||new Set(rows.map(s=>s.weight)).size!==1)return {eligible:false,reason:'A sugestão requer a mesma carga positiva em todas as séries.'};if(rows.some(s=>s.reps<entry.repsMax))return {eligible:false,reason:'Mantenha a carga até atingir o topo da faixa em todas as séries.'};const step=number(entry.increment,state.profile.progressionIncrement);return {eligible:true,weight:Math.round((rows[0].weight+step)*100)/100,previous:rows[0].weight,increment:step,reason:`Todas as ${n} séries anteriores alcançaram ${entry.repsMax} repetições. Revise antes de aplicar.`}}
function records(state,name){if(isAssisted(name))return {maxWeight:0,maxReps:0,maxVolume:0,e1rm:0,events:[]};const sessions=state.history.slice().sort((a,b)=>a.ended-b.ended);let maxWeight=0,maxReps=0,maxVolume=0,e1rm=0;const events=[];for(const h of sessions){for(const e of h.exercises.filter(e=>e.name===name)){const sets=e.sets.filter(working);if(!sets.length)continue;const w=Math.max(...sets.map(s=>s.weight)),r=Math.max(...sets.map(s=>s.reps)),v=sets.reduce((n,s)=>n+s.weight*s.reps,0),est=Math.max(0,...sets.filter(s=>s.weight>0&&s.reps>=1&&s.reps<=10).map(s=>s.weight*(1+s.reps/30)));const improved=(maxWeight>0&&w>maxWeight)||(maxReps>0&&r>maxReps)||(maxVolume>0&&v>maxVolume)||(e1rm>0&&est>e1rm);if(improved)events.push({name,ended:h.ended,weight:w,reps:r,volume:v});maxWeight=Math.max(maxWeight,w);maxReps=Math.max(maxReps,r);maxVolume=Math.max(maxVolume,v);e1rm=Math.max(e1rm,est)}}return {maxWeight,maxReps,maxVolume,e1rm,events}}
function weeklyStats(state,now=Date.now()){const current=weekItems(state.history,now),previousTime=new Date(weekStart(now));previousTime.setDate(previousTime.getDate()-7);const previous=weekItems(state.history,+previousTime);const total=current.reduce((n,h)=>n+volume(h),0),old=previous.reduce((n,h)=>n+volume(h),0);const names=[...new Set(current.flatMap(h=>h.exercises.map(e=>e.name)))],prs=names.flatMap(name=>records(state,name).events).filter(x=>weekItems([x],now).length);const groups={};for(const h of current)for(const e of h.exercises){const group=info(e.name).primary,count=e.sets.filter(working).length;if(count>0)groups[group]=(groups[group]||0)+count}const cardio=weekItems(state.cardio,now),minutes=cardio.reduce((n,c)=>n+(c.intensity==='vigorosa'?c.minutes*2:c.intensity==='moderada'?c.minutes:0),0);return {sessions:current.length,volume:total,change:old>0?(total-old)/old*100:null,consistency:Math.min(100,current.length/state.profile.weeklyGoal*100),groups,prs,cardioMinutes:minutes}}
function alternatives(state,name,available=state.profile.equipment){const current=info(name);if(current.pattern==='personalizado')return [];return CATALOG.filter(e=>e.id!==current.id&&e.pattern===current.pattern&&e.primary===current.primary&&available.includes(e.equipment))}
function nextPlan(state,now=Date.now()){const today=(new Date(now).getDay()+6)%7;const scheduled=state.plans.find(p=>p.id===state.schedule[today]);if(scheduled)return scheduled;const last=state.history.slice().sort((a,b)=>b.ended-a.ended)[0];const index=state.plans.findIndex(p=>p.id===last?.planId);return state.plans[(index+1)%state.plans.length]||null}
function normalizeCompleted(session,now=Date.now()){const done=clone(session);done.ended=now;done.minutes=Math.max(1,Math.round((now-done.started)/60000));done.volume=volume(done);done.sets=done.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.done).length,0);return done}
function weeklySeries(state,now=Date.now(),count=8){return Array.from({length:count},(_,i)=>{const d=new Date(weekStart(now));d.setDate(d.getDate()-(count-1-i)*7);const sessions=weekItems(state.history,+d);return {time:+d,label:d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}),volume:sessions.reduce((n,h)=>n+volume(h),0),sessions:sessions.length}})}
return {CATALOG,CARDIO_ACTIVITIES,isAssisted,searchKey,exerciseName,matchesExercise,SET_TYPES,working,clone,id,number,clamp,info,prescription,initial,migrate,validate,dayKey,weekStart,weekDays,weekItems,volume,lastExercise,previousSet,startSession,progression,records,weeklyStats,alternatives,nextPlan,normalizeCompleted,weeklySeries};
});
