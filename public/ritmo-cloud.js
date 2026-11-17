(function(){
'use strict';
const base=new URL(document.documentElement.dataset.pwaBase||'./',location.href);
let client=null,user=null,available=false,checking=true,verified=false,timer=null,authBusy=false,authGeneration=0;
let message='Verificando disponibilidade da conta…';
const originalSave=save,originalRender=render;
const store=new RitmoCloudStore.Store({storage:localStorage,initial:()=>D.initial(),validate:x=>D.validate(x),request,
  onData(payload){state=payload;badStorage=null;draft=null;coachResult='';window.shortDraft=null;chartExercise=state.history.at(-1)?.exercises[0]?.name||'Supino com halteres';render()},
  onStatus(value){message=value;mount()}
});
function sessionResult(result){if(result?.error)throw result.error;return result?.data?.user||null}
function restoreGuest(){
  const raw=localStorage.getItem(KEY);badStorage=null;
  try{state=raw?D.validate(JSON.parse(raw)):D.initial()}catch{badStorage=raw;state=D.initial()}
  draft=null;coachResult='';window.shortDraft=null;
}
function schedule(){clearTimeout(timer);timer=setTimeout(()=>{if(verified)store.sync()},1200)}
save=function(){
  if(!store.owner)return originalSave();
  try{store.save(state);storageWorking=true;schedule();return true}
  catch{storageWorking=false;$('#storage-banner').hidden=false;$('#storage-banner').textContent='Não foi possível salvar nesta conta. Exporte seu backup antes de sair ou recarregar.';toast('Exporte seu backup para preservar as alterações.');return false}
};
render=function(){originalRender();mount()};
function button(text,action,disabled=false){return `<button type="button" class="outline small-button" data-cloud="${action}" ${disabled?'disabled':''}>${text}</button>`}
function mount(){
  document.querySelectorAll('[data-cloud-card]').forEach(el=>el.remove());
  const label=document.querySelector('.local-label');if(label)label.textContent=store.owner?'Conta · '+(store.record.dirty?'envio pendente':'cópia neste aparelho'):'Dados neste navegador';
  const footer=document.querySelector('.app-footer span');if(footer)footer.textContent=store.owner?'Ritmo · '+message:'Ritmo · dados salvos neste navegador';
  if(current!=='perfil'&&current!=='inicio')return;
  const card=document.createElement('section');card.className='card cloud-card';card.dataset.cloudCard='';
  card.innerHTML=`<div class="card-title"><h3>${user?'Sua conta Ritmo':'Seus treinos em todos os aparelhos'}</h3><span class="pill">${store.owner?'Conta':'Acesso opcional'}</span></div><p class="mini-note" role="status">${E(message)}</p>${user?`<p class="mini-note">${E(user.email||user.name||'Conta conectada')}</p><div class="actions mt">${!verified&&available?button('Entrar novamente','login',authBusy):''}${button('Sincronizar agora','sync',!verified||store.busy||store.blocked)}${button('Importar dados deste navegador','import',!verified||store.blocked)}${button('Exportar cópias de recuperação','recoveries')}${button('Sair da conta','logout',authBusy||!client)}</div>${store.blocked?`<div class="callout orange mt"><p>As versões não foram sobrescritas. Exporte seu backup antes de escolher.</p><div class="actions mt">${button('Usar versão da nuvem','remote')}${button('Enviar versão deste aparelho','local')}${button('Exportar minha cópia','export')}</div></div>`:''}<p class="mini-note mt">Arquivos de vídeo pessoais ficam neste aparelho. Os vídeos incluídos continuam disponíveis no app.</p>`:available?`<div class="actions mt">${button('Entrar','login',authBusy)}${button('Criar conta','signup',authBusy)}</div><p class="mini-note mt">Os dados atuais só serão enviados se você escolher importá-los após entrar.</p>`:!checking?'<p class="mini-note mt">Você pode continuar usando o app e exportando seus backups neste navegador.</p>':''}`;
  $('#screen').prepend(card);
}
async function request(method,body,owner){
  if(!client||!verified||user?.id!==owner)throw Object.assign(Error('auth'),{status:401});
  const result=await client.token();if(result.error||!result.data?.token)throw Object.assign(Error('auth'),{status:401});
  if(user?.id!==owner||!verified)throw Object.assign(Error('auth'),{status:401});
  const response=await fetch(new URL('api/account',base),{method,cache:'no-store',headers:{Authorization:'Bearer '+result.data.token,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw Object.assign(Error('cloud'),{status:response.status});return response.json();
}
async function attach(next){
  if(store.owner===next.id){user=next;verified=true;await store.sync();return}
  if(state.session){message='Conclua ou descarte o treino atual antes de entrar em outra conta.';mount();return}
  if(!save())throw Error('storage');
  closeModal();store.detach();user=next;verified=true;
  try{store.activate(next.id);localStorage.setItem('ritmo-account-active',next.id)}
  catch{store.detach();verified=false;user=null;restoreGuest();message='Não foi possível abrir a cópia desta conta. Ela foi preservada; exporte os dados antes de continuar.';render();return}
  await store.sync();
}
function authForm(mode,email=''){
  const verify=mode==='verify',reset=mode.startsWith('reset'),signup=mode==='signup';
  openModal(verify?'Verificar e-mail':reset?'Recuperar acesso':signup?'Criar conta Ritmo':'Entrar no Ritmo',`<form id="cloud-auth-form" data-mode="${mode}">${signup?label('Nome','name','','text','autocomplete="name" maxlength="100" required'):''}${label('E-mail','email',email,'email','autocomplete="email" required maxlength="254"')}${verify?label('Código recebido por e-mail','code','','text','inputmode="numeric" autocomplete="one-time-code" required minlength="4" maxlength="12"'):(!reset||mode==='reset-confirm')?label('Senha','password','','password',`autocomplete="${signup||reset?'new-password':'current-password'}" required minlength="8" maxlength="128"`):''}${mode==='reset-confirm'?label('Código recebido','code','','text','inputmode="numeric" autocomplete="one-time-code" required minlength="4" maxlength="12"'):reset?'<p class="mini-note mt">Enviaremos um código de recuperação por e-mail.</p>':''}<p id="cloud-auth-message" class="mini-note mt" role="status"></p><div class="actions mt"><button class="primary" type="submit">${verify?'Confirmar código':reset?(mode==='reset-confirm'?'Salvar nova senha':'Enviar código'):signup?'Criar conta':'Entrar'}</button>${verify?button('Reenviar código','resend'):!signup&&!reset?button('Esqueci minha senha','reset'):''}</div></form>`);
}
function safeError(error){
  const code=String(error?.code||'');
  if(/INVALID_EMAIL_OR_PASSWORD|INVALID_PASSWORD|USER_NOT_FOUND/.test(code))return 'E-mail ou senha incorretos.';
  if(/USER_ALREADY_EXISTS/.test(code))return 'Este e-mail já possui uma conta. Entre ou recupere sua senha.';
  if(/PASSWORD_TOO_SHORT/.test(code))return 'Use uma senha com pelo menos 8 caracteres.';
  if(/OTP|TOKEN.*EXPIRED|INVALID_TOKEN/.test(code))return 'Código inválido ou expirado. Solicite um novo código.';
  if(/RATE_LIMIT|TOO_MANY/.test(code))return 'Muitas tentativas. Aguarde um pouco e tente novamente.';
  return 'Não foi possível concluir. Confira a conexão e tente novamente.';
}
async function checkSession(){
  if(!client||authBusy)return;
  const generation=authGeneration;
  try{
    const next=sessionResult(await client.getSession());if(generation!==authGeneration)return;
    if(next)await attach(next);
    else if(user){verified=false;message='Sessão encerrada. Entre novamente para sincronizar; seus dados estão neste aparelho.';mount()}
  }catch{if(store.owner){verified=false;message='Sem conexão para verificar a sessão. Dados desta conta preservados neste aparelho.';mount()}}
}
document.addEventListener('submit',async event=>{
  const form=event.target;if(form.id!=='cloud-auth-form')return;event.preventDefault();if(authBusy||!form.reportValidity())return;
  authBusy=true;authGeneration++;const submit=form.querySelector('[type="submit"]');submit.disabled=true;
  const data=new FormData(form),email=String(data.get('email')).trim(),password=String(data.get('password')||''),code=String(data.get('code')||'').trim(),mode=form.dataset.mode;
  const status=form.querySelector('#cloud-auth-message');status.textContent='Aguarde…';
  try{
    let result;
    if(mode==='verify')result=await client.emailOtp.verifyEmail({email,otp:code});
    else if(mode.startsWith('reset'))result=mode==='reset-confirm'?await client.emailOtp.resetPassword({email,otp:code,password}):await client.forgetPassword.emailOtp({email});
    else result=mode==='signup'?await client.signUp.email({email,password,name:String(data.get('name')).trim()}):await client.signIn.email({email,password});
    if(result.error){if(result.error.code==='EMAIL_NOT_VERIFIED'){authForm('verify',email);return}throw result.error}
    if(mode.startsWith('reset')){if(mode==='reset-confirm'){authForm('login',email);toast('Senha atualizada. Entre com a nova senha.')}else{authForm('reset-confirm',email);$('#cloud-auth-message').textContent='Se houver uma conta, o código será enviado ao e-mail informado.'}return}
    const next=sessionResult(await client.getSession());
    if(next){await attach(next);toast('Conta conectada. Seus dados anteriores continuam separados neste navegador.')}
    else if(mode==='signup'){authForm('verify',email)}
    else {authForm('login',email);toast('E-mail confirmado. Entre para continuar.')}
  }catch(error){if(status.isConnected)status.textContent=safeError(error)}
  finally{authBusy=false;if(submit.isConnected)submit.disabled=false;mount()}
});
document.addEventListener('click',async event=>{
  const target=event.target.closest('[data-cloud]');if(!target||target.disabled)return;event.preventDefault();const action=target.dataset.cloud;
  if(['login','signup','reset'].includes(action)){
    if(state.session&&action!=='reset'){toast('Conclua ou descarte o treino antes de entrar na conta.');return}
    authForm(action);return;
  }
  if(action==='export'){exportData();return}
  if(action==='recoveries'){
    const copies=[];
    for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key?.startsWith(store.key+':recovery:')||key?.startsWith(store.key+':before-import:'))copies.push({key,data:JSON.parse(localStorage.getItem(key))})}
    if(!copies.length){toast('Não há cópias de recuperação desta conta neste aparelho.');return}
    const url=URL.createObjectURL(new Blob([JSON.stringify(copies,null,2)],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download='ritmo-recuperacao.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;
  }
  if(action==='resend'){
    if(authBusy)return;target.disabled=true;
    try{const email=$('#cloud-auth-form [name="email"]').value;const result=await client.emailOtp.sendVerificationOtp({email,type:'email-verification'});if(result.error)throw result.error;$('#cloud-auth-message').textContent='Código enviado. Confira seu e-mail.'}catch{toast('Não foi possível reenviar o código. Tente novamente mais tarde.')}finally{if(target.isConnected)target.disabled=false}return;
  }
  if(authBusy)return;
  if(['logout','import','remote','local'].includes(action)&&state.session){toast('Conclua ou descarte o treino antes de trocar os dados da conta.');return}
  target.disabled=true;
  try{
    if(action==='sync'){await checkSession();await store.sync()}
    if(action==='logout'){
      if(store.record?.dirty&&!confirm('Há alterações que ainda não foram enviadas. Elas ficarão neste aparelho, vinculadas à conta. Sair mesmo assim?'))return;
      authBusy=true;authGeneration++;const result=await client.signOut();if(result.error)throw result.error;
      store.detach();clearTimeout(timer);verified=false;user=null;localStorage.removeItem('ritmo-account-active');
      restoreGuest();closeModal();message='Você está usando os dados locais deste navegador.';render();
    }
    if(action==='import'){
      const raw=localStorage.getItem(KEY);if(!raw){toast('Não há dados locais anteriores para importar.');return}
      if(!confirm('Substituir os dados desta conta pelos dados locais anteriores? Uma cópia de segurança da conta será preservada neste aparelho.'))return;
      const incoming=D.validate(JSON.parse(raw));if(incoming.session){toast('Conclua o treino dos dados locais antes de importar.');return}
      localStorage.setItem(store.key+':before-import:'+Date.now(),JSON.stringify(store.record));store.save(incoming);state=incoming;render();await store.sync();
    }
    if(action==='remote'||action==='local'){
      if(!confirm(action==='remote'?'Usar os dados da nuvem neste aparelho? As duas versões serão preservadas em uma cópia de recuperação local.':'Substituir a versão da nuvem pelos dados deste aparelho? As duas versões serão preservadas em uma cópia de recuperação local.'))return;
      await store.resolve(action==='remote');render();
    }
  }catch{toast('Não foi possível concluir. Os dados locais foram preservados.')}
  finally{authBusy=false;mount()}
});
async function boot(){
  if(location.protocol==='file:'||location.hostname.endsWith('github.io')){checking=false;message='Acesso local. Para entrar na conta, abra o Ritmo hospedado na Vercel.';mount();return}
  // Restore only a previously selected account cache; no network upload before session verification.
  try{const owner=localStorage.getItem('ritmo-account-active');if(owner&&localStorage.getItem('ritmo-account:'+owner)&&!state.session){store.activate(owner);user={id:owner};verified=false}}catch{store.detach();user=null;verified=false;restoreGuest();message='Não foi possível ler a cópia da conta. Os dados foram preservados.'}
  try{
    const response=await fetch(new URL('api/config',base),{cache:'no-store',signal:AbortSignal.timeout(10000)});
    if(!response.ok)throw Error('config');const config=await response.json();if(!config.enabled||!config.authUrl)throw Error('config');
    const sdk=await import(new URL('assets/neon-auth.js',base).href);
    client=sdk.createAuthClient(config.authUrl,{adapter:sdk.BetterAuthVanillaAdapter({fetchOptions:{credentials:'include'}})});
    available=true;message='Entre para salvar e acessar seus treinos em outros aparelhos.';await checkSession();
  }catch{message=store.owner?'Sem conexão com a conta. Seus dados continuam disponíveis neste aparelho.':'Conta indisponível agora. Seus treinos continuam salvos neste navegador.'}
  finally{checking=false;mount()}
}
window.addEventListener('online',()=>{if(client)checkSession();else boot()});
window.addEventListener('focus',()=>{if(client)checkSession()});
window.addEventListener('storage',event=>{if(store.owner&&event.key===store.key&&event.newValue!==store.disk){store.blocked=true;store.status('Outro separador alterou estes dados. Exporte sua cópia antes de recarregar.')}});
setInterval(()=>{if(verified)store.sync()},30000);
mount();boot();
})();
