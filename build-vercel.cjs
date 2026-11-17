const fs=require('node:fs');
require('./build.cjs');
async function main(){
  fs.mkdirSync('dist',{recursive:true});
  for(const file of ['index.html','Ritmo.html','manifest.webmanifest','sw.js'])fs.copyFileSync(file,'dist/'+file);
  for(const folder of ['public','icons'])fs.cpSync(folder,'dist/'+folder,{recursive:true});
  await require('esbuild').build({entryPoints:['src/auth-sdk.mjs'],bundle:true,format:'esm',platform:'browser',target:['es2022'],outfile:'dist/assets/neon-auth.js',minify:true,legalComments:'eof'});
  console.log('Interface e SDK de autenticação preparados para a Vercel.');
}
main().catch(()=>{console.error('Falha ao preparar o SDK de autenticação.');process.exitCode=1});
