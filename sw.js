// KAIROS Service Worker v19.39 - Updated cache version
const CACHE_VERSION = 'v19-39';
const CACHE_NAME = 'kairos-' + CACHE_VERSION;
const STATIC_CACHE = 'kairos-static-' + CACHE_VERSION;
const DYNAMIC_CACHE = 'kairos-dynamic-' + CACHE_VERSION;

// 静的アセット（必ずキャッシュ）
const STATIC_ASSETS = [
  './',
  './index.html',
  './kairos-vanilla-app.js',
  './kairos-vanilla-styles.css',
  './manifest.json'
];

// 外部リソース（オプショナルキャッシュ）
const EXTERNAL_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap',
  'https://unpkg.com/lightweight-charts@4.1.0/dist/lightweight-charts.standalone.production.js'
];

// インストール
self.addEventListener('install', (event) => {
  console.log('[SW] Installing KAIROS ' + CACHE_VERSION + '...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(STATIC_CACHE).then((cache) => {
        return Promise.allSettled(
          EXTERNAL_ASSETS.map(url =>
            fetch(url).then(response => {
              if (response.ok) {
                cache.put(url, response);
              }
            }).catch(() => console.log('[SW] Could not cache:', url))
          )
        );
      })
    ])
  );
  self.skipWaiting();
});

// アクティベーション — 古いキャッシュを全て削除
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating KAIROS ' + CACHE_VERSION + '...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => !name.includes(CACHE_VERSION))
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// フェッチ戦略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // APIリクエスト: ネットワーク優先
  if (url.pathname.includes('/api/') ||
      url.hostname.includes('api.') ||
      url.hostname.includes('binance') ||
      url.hostname.includes('coingecko') ||
      url.hostname.includes('alternative.me')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // HTML/JS/CSS: ネットワーク優先（常に最新を取得）
  if (request.url.includes('.html') ||
      request.url.includes('.js') ||
      request.url.includes('.css') ||
      request.url.endsWith('/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // フォント・ライブラリ: キャッシュ優先
  if (url.hostname.includes('fonts.') ||
      url.hostname.includes('unpkg.com') ||
      url.hostname.includes('cdnjs.')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // その他: ネットワーク優先
  event.respondWith(networkFirst(request));
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return new Response(
      JSON.stringify({ error: 'offline', message: 'オフラインです' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

// メッセージハンドラ
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  if (event.data === 'clearCache') {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
  }
});

console.log('[SW] KAIROS Service Worker ' + CACHE_VERSION + ' loaded');
