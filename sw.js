// Service worker TalcoMusic : installation (PWA), démarrage hors ligne, mise à jour proposée à l'utilisateur.
const VERSION = 'v3';
const CACHE = 'talcomusic-' + VERSION;      // fichiers du site
const EXT = 'talcomusic-ext-v1';            // SDK Firebase (version figée) + polices Google
const SHELL = ['./', 'index.html', 'offline.html', 'manifest.webmanifest',
  'icon-192.png', 'icon-512.png', 'favicon-32.png'];

self.addEventListener('install', (e) => {
  // Pas de skipWaiting automatique : la page propose « Actualiser » (message SKIP_WAITING).
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keep = [CACHE, EXT];
    for (const k of await caches.keys()) if (!keep.includes(k)) await caches.delete(k);
    if (self.registration.navigationPreload) { try { await self.registration.navigationPreload.enable(); } catch (_) {} }
    await self.clients.claim();
  })());
});

const isExternalAsset = (u) =>
  (u.hostname === 'www.gstatic.com' && u.pathname.startsWith('/firebasejs/')) ||
  u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com';

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const net = fetch(req).then((res) => {
    if (res && (res.status === 200 || res.type === 'opaque')) cache.put(req, res.clone()).catch(() => {});
    return res;
  }).catch(() => null);
  return cached || (await net) || Response.error();
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;   // audio en streaming : réseau direct
  const url = new URL(req.url);

  if (url.origin !== location.origin) {
    if (isExternalAsset(url)) e.respondWith(staleWhileRevalidate(req, EXT));
    return;                                                        // Firebase API, audio externes : réseau direct
  }

  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const res = (await e.preloadResponse) || (await fetch(req));
        if (res && res.status === 200) { const c = await caches.open(CACHE); c.put(req, res.clone()).catch(() => {}); }
        return res;
      } catch (_) {
        return (await caches.match(req)) || (await caches.match('index.html')) || (await caches.match('offline.html'));
      }
    })());
    return;
  }

  e.respondWith(staleWhileRevalidate(req, CACHE));
});
