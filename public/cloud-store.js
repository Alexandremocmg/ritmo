(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RitmoCloudStore=api})(globalThis,function(){
'use strict';
const copy=x=>JSON.parse(JSON.stringify(x));
class Store{
  constructor({storage,request,initial,validate,onData,onStatus}){Object.assign(this,{storage,request,initial,validate,onData,onStatus});this.generation=0;this.owner=null;this.busy=false;this.blocked=false}
  status(value){this.message=value;this.onStatus(value)}
  read(){return this.storage.getItem(this.key)}
  commit(){
    if(this.read()!==this.disk){this.blocked=true;this.status('Outro separador alterou estes dados. Exporte sua cópia antes de recarregar.');throw Error('tab-conflict')}
    const value=JSON.stringify(this.record);this.storage.setItem(this.key,value);this.disk=value;
  }
  activate(owner){
    this.generation++;this.owner=owner;this.key='ritmo-account:'+owner;this.busy=false;this.blocked=false;
    this.disk=this.read();
    if(this.disk){this.record=JSON.parse(this.disk);this.record.payload=this.validate(this.record.payload);if(!Number.isSafeInteger(this.record.revision)||this.record.revision<0)throw Error('cache')}
    else this.record={revision:0,dirty:false,version:0,payload:this.initial()};
    this.onData(copy(this.record.payload));this.status('Dados desta conta neste aparelho. Conectando à nuvem…');
  }
  detach(){this.generation++;this.owner=null;this.busy=false;this.blocked=false}
  save(payload){
    if(!this.owner)return false;
    this.record.payload=copy(payload);this.record.dirty=true;this.record.version++;
    this.commit();if(!this.blocked)this.status('Alterações salvas neste aparelho; envio pendente.');return true;
  }
  async sync(){
    if(!this.owner||this.busy||this.blocked)return;
    const generation=this.generation,owner=this.owner;this.busy=true;
    try{
      this.status('Sincronizando…');
      const remote=await this.request('GET',null,owner);
      if(generation!==this.generation)return;
      if(!remote.payload&&remote.revision===0)this.record.dirty=true;
      if(remote.revision!==this.record.revision){
        if(this.record.dirty||this.record.payload.session){this.blocked=true;this.status('Conflito: há outra versão na nuvem. Escolha qual manter no Perfil.');return}
        const payload=this.validate(remote.payload);this.record={revision:remote.revision,dirty:false,version:this.record.version+1,payload};this.commit();this.onData(copy(payload));
      }
      if(this.record.dirty){
        const version=this.record.version;
        const result=await this.request('PUT',{revision:this.record.revision,payload:copy(this.record.payload)},owner);
        if(generation!==this.generation)return;
        this.record.revision=result.revision;this.record.dirty=this.record.version!==version;this.commit();
      }
      this.status(this.record.dirty?'Há alterações pendentes.':'Tudo salvo na nuvem.');
    }catch(e){
      if(generation!==this.generation)return;
      if(e.status===409){this.blocked=true;this.status('Conflito: há outra versão na nuvem. Escolha qual manter no Perfil.')}
      else if(e.status===401)this.status('Sessão expirada. Entre novamente; os dados deste aparelho estão preservados.');
      else if(!this.blocked)this.status(e.status===400?'Não foi possível enviar este backup. Exporte uma cópia e confira os dados.':'Sem conexão com a nuvem. Alterações preservadas neste aparelho.');
    }finally{if(generation===this.generation)this.busy=false}
  }
  async resolve(useRemote){
    if(!this.owner||this.busy)return;
    const generation=this.generation,owner=this.owner,version=this.record.version;this.busy=true;
    try{
      const remote=await this.request('GET',null,owner);if(generation!==this.generation)return;
      if(version!==this.record.version)throw Error('changed');
      // Preserve BOTH versions before an explicit conflict resolution.
      this.storage.setItem(this.key+':recovery:'+Date.now(),JSON.stringify({local:this.record,otherTab:this.read(),remote}));
      this.disk=this.read();
      const payload=useRemote?(remote.payload?this.validate(remote.payload):this.initial()):this.record.payload;
      this.record={payload:copy(payload),revision:remote.revision,dirty:!useRemote||!remote.payload,version:version+1};
      this.blocked=false;this.commit();this.onData(copy(payload));this.status('Versão escolhida. Cópias anteriores preservadas neste aparelho.');
    }finally{if(generation===this.generation)this.busy=false}
    await this.sync();
  }
}
return {Store};
});
