'use strict';
const CACHE_PREFIX='ritmo-shell:'+self.registration.scope+':';
const CACHE_NAME=CACHE_PREFIX+'__RITMO_CACHE_VERSION__';
const SHELL=__RITMO_SHELL_ASSETS__.map(file=>new URL(file,self.registration.scope).href);
const SHELL_URLS=new Set(SHELL);
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL)));
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE_NAME).map(key=>caches.delete(key)));await self.clients.claim()})());
});
self.addEventListener('message',event=>{
  if(event.data?.type==='RITMO_ACTIVATE_UPDATE'&&event.source?.url?.startsWith(self.registration.scope))event.waitUntil(self.skipWaiting());
});
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url),scope=new URL(self.registration.scope);
  // Authentication and private backups must never enter the offline cache.
  if(/\/(?:api|assets)\//.test(url.pathname))return;
  if(request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname)||request.headers.has('range'))return;
  // Keep media on the network: no silent 30 MB download and no cached partial responses.
  if(/\.(?:mp4|webm|mov|jpg|jpeg)$/i.test(url.pathname))return;
  url.search='';url.hash='';const key=url.href;
  if(request.mode!=='navigate'&&!SHELL_URLS.has(key))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME),cached=await cache.match(key);if(cached)return cached;
    try{const response=await fetch(request);if(response.ok&&SHELL_URLS.has(key)){try{await cache.put(key,response.clone())}catch{}}return response}
    catch{if(request.mode==='navigate'){const home=await cache.match(new URL('./',self.registration.scope).href);if(home)return home}return new Response('Conecte-se à internet e abra o Ritmo novamente para preparar o acesso offline.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})}
  })());
});
