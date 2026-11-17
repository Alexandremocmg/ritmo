const {authURL,noStore}=require('../server/config.cjs');
module.exports=(req,res)=>{
  noStore(res);
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Método não permitido.'})}
  const url=authURL();
  // This allowlist exposes only the public authentication URL. Never serialize env.
  return res.status(200).json({enabled:!!(url&&process.env.DATABASE_URL),authUrl:url});
};
