const CACHE='living-diary-shell-v1';
const SHELL=['./','./manifest.webmanifest','./diary-icon.svg','https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET')return;
  if(url.origin===self.location.origin&&url.pathname.startsWith('/woman-in-progress/')){
    event.respondWith(fetch(event.request).then(response=>{
      if(response.ok){
        const copy=response.clone();
        event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));
      }
      return response;
    }).catch(async()=>await caches.match(event.request)||(event.request.mode==='navigate'?caches.match('./'):Response.error())));
  }else if(url.href===SHELL[3]){
    event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
  }
});
