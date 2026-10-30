
const VERSION = 'v13';
const CACHE = 'marathon-planer-' + VERSION;

const SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './charts.js',
  './plan-data.js',
  './manifest.json',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
];

async function cleanResponse(response) {
  if (!response || !response.redirected) return response;
  const body = await response.blob();
  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

async function precache(cache, url) {
  try {
    const response = await fetch(url, { cache: 'reload', redirect: 'follow' });
    if (!response || !response.ok) return;
    await cache.put(url, await cleanResponse(response));
  } catch (e) {
  }
}

async function storeAndServe(request, response) {
  if (!response || !response.ok) return response;
  const safe = await cleanResponse(response);
  const copy = safe.clone();
  caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
  return safe;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.all(SHELL.map((url) => precache(cache, url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isShell = SHELL.some((path) => {
    const full = new URL(path, self.location.href).pathname;
    return full === url.pathname;
  });

  if (isShell) {
    event.respondWith((async () => {
      const hit = await caches.match(request);
      const network = fetch(request, { redirect: 'follow' })
        .then((response) => storeAndServe(request, response))
        .catch(() => (hit ? cleanResponse(hit) : Promise.reject(new Error('offline'))));
      if (hit) return cleanResponse(hit);
      return network;
    })());
    return;
  }

  event.respondWith((async () => {
    try {
      const response = await fetch(request, { redirect: 'follow' });
      return await storeAndServe(request, response);
    } catch (e) {
      const hit = await caches.match(request);
      if (hit) return cleanResponse(hit);
      if (request.mode === 'navigate') {
        const fallback = await caches.match('./index.html');
        if (fallback) return cleanResponse(fallback);
      }
      throw e;
    }
  })());
});
