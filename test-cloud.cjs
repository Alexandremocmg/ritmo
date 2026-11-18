const test=require('node:test'),assert=require('node:assert/strict');
const D=require('./public/training-data.js');
const {Store}=require('./public/cloud-store.js');
const {createHandler,validateBody,MAX_BYTES}=require('./server/cloud.cjs');
const {authURL,authJWKSURL}=require('./server/config.cjs');
const AuthErrors=require('./public/auth-errors.js');
test('erros reais do SDK são reconhecidos em formato normalizado e aninhado',()=>{
  for(const error of [{code:'invalid_credentials',status:400},{code:'unexpected_failure',error:{code:'INVALID_EMAIL_OR_PASSWORD',status:401}},{error:{code:'invalid_credentials',status:400}}])assert.match(AuthErrors.message(error),/E-mail ou senha incorretos/);
  assert(AuthErrors.needsVerification({code:'email_not_confirmed'}));
  assert(AuthErrors.needsVerification({error:{code:'EMAIL_NOT_VERIFIED',status:403}}));
  assert.match(AuthErrors.message({code:'user_already_exists'}),/já possui uma conta/);
  assert.match(AuthErrors.message({code:'weak_password'}),/senha mais forte/);
  assert.match(AuthErrors.message({code:'unexpected_failure',error:{code:'EMAIL_PASSWORD_SIGNUP_DISABLED',status:403}}),/desativado/);
  assert.match(AuthErrors.message({error:{code:'INVALID_ORIGIN',status:403}}),/domínio/);
});
test('diagnóstico de autenticação não expõe mensagens, senhas ou tokens retornados pelo servidor',()=>{
  const error={message:'private@example.com password=private-secret token=private-jwt',code:'unexpected_failure',error:{code:'FAILED_TO_CREATE_USER',status:500,message:'private-secret'}};
  const message=AuthErrors.message(error,'signup');assert.match(message,/SIGNUP \/ FAILED_TO_CREATE_USER \/ 500/);assert(!message.includes('private'));
  assert.match(AuthErrors.message(new TypeError('private-secret')),/navegador/);
});
function storage(){const map=new Map();return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value),removeItem:key=>map.delete(key),map}}
function fixture(){
  const disk=storage(),rows=new Map(),statuses=[],data=[],calls=[];let fail=false,pause=null;
  async function request(method,body,owner){
    calls.push({method,owner});if(fail)throw Error('offline');if(pause)await pause;
    const remote=rows.get(owner)||{revision:0,payload:null};
    if(method==='GET')return structuredClone(remote);
    if(body.revision!==remote.revision)throw Object.assign(Error('conflict'),{status:409});
    rows.set(owner,{revision:remote.revision+1,payload:structuredClone(body.payload)});return {revision:remote.revision+1};
  }
  const make=()=>new Store({storage:disk,request,initial:D.initial,validate:D.validate,onData:x=>data.push(x),onStatus:x=>statuses.push(x)});
  return {disk,rows,statuses,data,calls,make,offline:value=>fail=value,pause:value=>pause=value};
}
test('configuração aceita os nomes da integração e nunca retorna a conexão do Postgres',()=>{
  assert.equal(authURL({DATABASE_NEON_AUTH_BASE_URL:'https://branch.neon.tech/neondb/auth/'}),'https://branch.neon.tech/neondb/auth/');
  assert.equal(authURL({DATABASE_VITE_NEON_AUTH_URL:'https://branch.neon.tech/auth'}),'https://branch.neon.tech/auth/');
  assert.equal(authURL({DATABASE_URL:'postgres://private'}),null);
  assert.equal(authURL({DATABASE_NEON_AUTH_BASE_URL:'https://user:secret@example.com'}),null);
});
test('JWKS preserva a branch sem duplicar barras e mantém a barra final do login',()=>{
  for(const suffix of ['', '/', '///']){
    const base='https://branch.neon.tech/neondb/auth'+suffix;
    assert.equal(authJWKSURL(base).href,'https://branch.neon.tech/neondb/auth/.well-known/jwks.json');
  }
  const login=authURL({DATABASE_NEON_AUTH_BASE_URL:'https://branch.neon.tech/neondb/auth'});
  assert.equal(login,'https://branch.neon.tech/neondb/auth/');
  assert.equal(authJWKSURL(login).href,'https://branch.neon.tech/neondb/auth/.well-known/jwks.json');
});
test('nova conta recebe apenas um perfil inicial; conta existente carrega a nuvem',async()=>{
  const f=fixture(),s=f.make();f.disk.setItem('ritmo-v3',JSON.stringify({...D.initial(),profile:{...D.initial().profile,name:'Visitante'}}));
  s.activate('a');await s.sync();assert.equal(f.rows.get('a').payload.profile.name,'');assert.equal(f.rows.get('a').revision,1);
  const remote=D.initial();remote.profile.name='Conta B';f.rows.set('b',{revision:3,payload:remote});s.activate('b');await s.sync();
  assert.equal(s.record.payload.profile.name,'Conta B');assert.equal(s.blocked,false);assert.equal(f.rows.get('b').revision,3);
  assert.equal(JSON.parse(f.disk.getItem('ritmo-v3')).profile.name,'Visitante');
});
test('alterações offline persistem por conta e são enviadas após recarregar',async()=>{
  const f=fixture(),s=f.make();s.activate('a');await s.sync();const p=D.initial();p.profile.name='Offline';
  f.offline(true);s.save(p);await s.sync();assert(s.record.dirty);
  const reloaded=f.make();reloaded.activate('a');assert.equal(reloaded.record.payload.profile.name,'Offline');
  f.offline(false);await reloaded.sync();assert.equal(f.rows.get('a').payload.profile.name,'Offline');assert(!reloaded.record.dirty);
  reloaded.activate('b');assert.equal(reloaded.record.payload.profile.name,'');
});
test('conflito entre aparelhos nunca sobrescreve e recuperação preserva ambas as cópias',async()=>{
  const f=fixture(),s=f.make();s.activate('a');await s.sync();const local=D.initial();local.profile.name='Local';s.save(local);
  const remote=D.initial();remote.profile.name='Remoto';f.rows.set('a',{revision:2,payload:remote});await s.sync();
  assert(s.blocked);assert.equal(f.rows.get('a').payload.profile.name,'Remoto');assert.equal(s.record.payload.profile.name,'Local');
  await s.resolve(false);assert.equal(f.rows.get('a').payload.profile.name,'Local');assert(!s.blocked);
  const recovery=[...f.disk.map].find(([key])=>key.includes(':recovery:'));
  assert.equal(JSON.parse(recovery[1]).remote.payload.profile.name,'Remoto');
});
test('sincronização interrompida por troca de conta não aplica a resposta antiga',async()=>{
  const f=fixture(),s=f.make();let release;f.pause(new Promise(resolve=>release=resolve));
  s.activate('a');const pending=s.sync();s.detach();s.activate('b');release();await pending;
  assert.equal(s.owner,'b');assert.equal(s.record.revision,0);assert(!f.rows.has('a'));
});
test('uma versão remota nunca substitui um treino em andamento mesmo sem edições pendentes',async()=>{
  const f=fixture(),s=f.make();s.activate('a');const p=D.initial();p.session=D.startSession(p,p.plans[0]);s.save(p);await s.sync();assert(!s.record.dirty);
  f.rows.set('a',{revision:2,payload:D.initial()});await s.sync();assert(s.blocked);assert(s.record.payload.session);
});
test('edição durante envio continua pendente e não é perdida pela resposta',async()=>{
  const f=fixture(),s=f.make();s.activate('a');await s.sync();
  const original=f.make().request;let release,started;const wait=new Promise(r=>started=r);
  s.request=async(method,body,owner)=>{if(method==='PUT'){started();await new Promise(r=>release=r)}return original(method,body,owner)};
  const p=D.initial();p.profile.name='Primeira';s.save(p);const pending=s.sync();await wait;p.profile.name='Segunda';s.save(p);release();await pending;
  assert(s.record.dirty);assert.equal(s.record.payload.profile.name,'Segunda');assert.equal(f.rows.get('a').payload.profile.name,'Primeira');
});
test('duas abas detectam divergência no armazenamento e preservam o estado em memória',async()=>{
  const f=fixture(),a=f.make(),b=f.make();a.activate('a');await a.sync();b.activate('a');
  const p=D.initial();p.profile.name='Aba A';a.save(p);p.profile.name='Aba B';assert.throws(()=>b.save(p),/tab-conflict/);
  assert.equal(JSON.parse(f.disk.getItem('ritmo-account:a')).payload.profile.name,'Aba A');assert.equal(b.record.payload.profile.name,'Aba B');assert(b.blocked);
});
test('backup em nuvem valida limites e não inclui associações a arquivos pessoais',()=>{
  const p=D.initial();p.videos={'Supino com halteres':{kind:'file',id:'local-id',name:'video.mp4'}};
  assert.deepEqual(validateBody({revision:0,payload:p}).payload.videos,{});
  assert.equal(p.videos['Supino com halteres'].id,'local-id');
  assert.throws(()=>validateBody({revision:-1,payload:p}));assert.throws(()=>validateBody({revision:1,payload:{}}));
  assert.throws(()=>validateBody(' '.repeat(MAX_BYTES+1)));
});
function response(){return {headers:{},statusCode:200,setHeader(key,value){this.headers[key]=value},status(code){this.statusCode=code;return this},json(body){this.body=body;return this}}}
test('API bloqueia visitantes, deriva proprietário da sessão e responde a conflitos',async()=>{
  const writes=[],reads=[];const handler=createHandler({identity:async req=>req.headers.authorization==='Bearer valid'?'verified-owner':null,
    read:async owner=>{reads.push(owner);return null},write:async(...args)=>{writes.push(args);return args[1]===0?{revision:1,updated_at:'now'}:null}});
  let res=response();await handler({method:'GET',headers:{}},res);assert.equal(res.statusCode,401);assert.equal(reads.length,0);assert.equal(res.headers['Cache-Control'],'private, no-store');
  res=response();await handler({method:'PUT',headers:{authorization:'Bearer valid'},body:{userId:'attacker',revision:0,payload:D.initial()}},res);
  assert.equal(res.statusCode,200);assert.equal(writes[0][0],'verified-owner');
  res=response();await handler({method:'PUT',headers:{authorization:'Bearer valid'},body:{revision:9,payload:D.initial()}},res);assert.equal(res.statusCode,409);
  res=response();await handler({method:'GET',headers:{authorization:'Bearer valid'},query:{userId:'other'}},res);assert.equal(reads[0],'verified-owner');assert.equal(res.body.payload,null);
  res=response();await handler({method:'DELETE',headers:{}},res);assert.equal(res.statusCode,405);
});
test('falhas de driver não vazam detalhes ou credenciais',async()=>{
  const h=createHandler({identity:async()=>{throw Error('postgres://credential-must-not-leak')}}),res=response();await h({method:'GET',headers:{}},res);
  assert.equal(res.statusCode,503);assert(!JSON.stringify(res.body).includes('credential-must-not-leak'));
});
