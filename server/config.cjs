'use strict';
function authURL(env=process.env){
  const value=env.DATABASE_NEON_AUTH_BASE_URL||env.DATABASE_VITE_NEON_AUTH_URL||env.NEON_AUTH_BASE_URL||env.VITE_NEON_AUTH_URL;
  if(!value)return null;
  try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href.replace(/\/?$/,'/'):null}catch{return null}
}
// Keep the login URL intact; normalize only the separator before the JWKS path.
function authJWKSURL(base){return new URL(base.replace(/\/+$/,'')+'/.well-known/jwks.json')}
function noStore(res){res.setHeader('Cache-Control','private, no-store');res.setHeader('Vercel-CDN-Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff')}
module.exports={authURL,authJWKSURL,noStore};
