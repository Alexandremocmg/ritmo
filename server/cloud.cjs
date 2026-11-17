'use strict';
const D=require('../public/training-data.js');
const {authURL,noStore}=require('./config.cjs');
const MAX_BYTES=1024*1024;
let jwks,ready;
async function identity(req){
  const header=req.headers.authorization||'';
  if(!/^Bearer [^\s]+$/.test(header)||header.length>20000)return null;
  const base=authURL();if(!base)return null;
  const {createRemoteJWKSet,jwtVerify}=await import('jose');
  jwks||=createRemoteJWKSet(new URL(base+'/.well-known/jwks.json'),{timeoutDuration:8000});
  try{
    const {payload}=await jwtVerify(header.slice(7),jwks,{algorithms:['EdDSA'],issuer:new URL(base).origin,audience:new URL(base).origin,requiredClaims:['sub','exp','iat'],maxTokenAge:'20m'});
    return typeof payload.sub==='string'&&payload.sub.length<=200&&payload.banned!==true?payload.sub:null;
  }catch{return null}
}
async function database(){
  const {neon}=await import('@neondatabase/serverless');
  const sql=neon(process.env.DATABASE_URL);
  if(!ready){ready=sql`CREATE TABLE IF NOT EXISTS public.ritmo_accounts (user_id text PRIMARY KEY, revision integer NOT NULL CHECK (revision > 0), payload jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`.catch(e=>{ready=null;throw e})}
  await ready;return sql;
}
async function read(owner){const sql=await database();const rows=await sql`SELECT revision, payload, updated_at FROM public.ritmo_accounts WHERE user_id=${owner}`;return rows[0]||null}
async function write(owner,revision,payload){
  const sql=await database();
  const rows=revision===0
    ?await sql`INSERT INTO public.ritmo_accounts (user_id, revision, payload) VALUES (${owner}, 1, ${JSON.stringify(payload)}::jsonb) ON CONFLICT (user_id) DO NOTHING RETURNING revision, updated_at`
    :await sql`UPDATE public.ritmo_accounts SET payload=${JSON.stringify(payload)}::jsonb, revision=revision+1, updated_at=now() WHERE user_id=${owner} AND revision=${revision} RETURNING revision, updated_at`;
  return rows[0]||null;
}
function validateBody(body){
  if(typeof body==='string'){if(Buffer.byteLength(body)>MAX_BYTES)throw Error('size');body=JSON.parse(body)}
  if(!body||Buffer.byteLength(JSON.stringify(body))>MAX_BYTES)throw Error('size');
  if(!Number.isSafeInteger(body.revision)||body.revision<0)throw Error('revision');
  const payload=D.validate(body.payload);
  // Personal media bytes and browser-specific file IDs never belong in cloud backups.
  payload.videos=Object.fromEntries(Object.entries(payload.videos||{}).filter(([,v])=>v.kind!=='file'));
  return {revision:body.revision,payload};
}
function createHandler(deps={identity,read,write}){return async(req,res)=>{
  noStore(res);
  if(!['GET','PUT'].includes(req.method)){res.setHeader('Allow','GET, PUT');return res.status(405).json({error:'Método não permitido.'})}
  try{
    const owner=await deps.identity(req);
    if(!owner)return res.status(401).json({error:'Entre na sua conta para acessar seus treinos.'});
    if(req.method==='GET'){
      const row=await deps.read(owner);
      return res.status(200).json(row?{revision:row.revision,payload:row.payload,updatedAt:row.updated_at}:{revision:0,payload:null,updatedAt:null});
    }
    let body;try{body=validateBody(req.body)}catch{return res.status(400).json({error:'Backup inválido ou maior que 1 MB. Exporte uma cópia para preservar seus dados.'})}
    const row=await deps.write(owner,body.revision,body.payload);
    if(!row)return res.status(409).json({error:'Há alterações em outro aparelho. Escolha qual versão manter.'});
    return res.status(200).json({revision:row.revision,updatedAt:row.updated_at});
  }catch{
    // Never log exceptions: drivers may include connection strings in error objects.
    return res.status(503).json({error:'Não foi possível acessar a nuvem. Seus dados locais foram preservados.'});
  }
}}
module.exports={handler:createHandler(),createHandler,validateBody,MAX_BYTES};
