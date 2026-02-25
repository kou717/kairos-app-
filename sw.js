// KAIROS Service Worker v19.16 - Urgent Moonshot Alert + Worker Integration
const CACHE_NAME = 'kairos-v19-34';
const STATIC_CACHE = 'kairos-static-v19-34';
const DYNAMIC_CACHE = 'kairos-dynamic-v19-34';

// 静的アセット（必ずキャッシュ）
const STATIC_ASSETS = [
  './',
  './kairos.html',
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
  console.log('[SW] Installing KAIROS v19.18...');
  event.waitUntil(
    Promise.all([
      // 静的アセットをキャッシュ
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // 外部リソースを試行（失敗しても続行）
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

// アクティベーション
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating KAIROS v19.18...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => !name.includes('v19-16'))
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

  // APIリクエスト: ネットワーク優先（Network First）
  if (url.pathname.includes('/api/') ||
      url.hostname.includes('api.') ||
      url.hostname.includes('binance') ||
      url.hostname.includes('coingecko') ||
      url.hostname.includes('alternative.me')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // HTML/JS/CSS: ネットワーク優先（Network First）
  // 常に最新のファイルを取得し、オフライン時のみキャッシュを使用
  if (request.url.includes('.html') ||
      request.url.includes('.js') ||
      request.url.includes('.css')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // その他の静的アセット（manifest等）: キャッシュ優先
  if (STATIC_ASSETS.some(asset => request.url.includes(asset.replace('./', '')))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // フォント・ライブラリ: キャッシュ優先
  if (url.hostname.includes('fonts.') ||
      url.hostname.includes('unpkg.com') ||
      url.hostname.includes('cdnjs.')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // その他: Stale While Revalidate
  event.respondWith(staleWhileRevalidate(request));
});

// ネットワーク優先戦略
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
    // オフラインフォールバック
    return new Response(
      JSON.stringify({ error: 'offline', message: 'オフラインです' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// キャッシュ優先戦略
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

// Stale While Revalidate戦略
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => null);

  return cached || fetchPromise;
}

// バックグラウンド同期
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-investment') {
    console.log('[SW] Syncing investment data...');
    event.waitUntil(syncInvestmentData());
  }
});

async function syncInvestmentData() {
  // ローカルストレージの投資データをサーバーと同期（将来の実装用）
  console.log('[SW] Investment data sync completed');
}

// プッシュ通知
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {
    title: 'KAIROS',
    body: '新しい通知があります',
    icon: 'notification'
  };

  const options = {
    body: data.body,
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23080a0f' width='100' height='100' rx='20'/%3E%3Ctext x='50' y='70' font-size='36' text-anchor='middle' fill='%23d4a853'%3E%E2%9C%A8%3C/text%3E%3C/svg%3E",
    badge: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle fill='%23d4a853' cx='50' cy='50' r='50'/%3E%3C/svg%3E",
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 通知クリック
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // 既存のウィンドウがあればフォーカス
      for (const client of clientList) {
        if (client.url.includes('kairos') && 'focus' in client) {
          return client.focus();
        }
      }
      // なければ新しいウィンドウを開く
      if (clients.openWindow) {
        return clients.openWindow('./kairos.html');
      }
    })
  );
});

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

console.log('[SW] KAIROS Service Worker v19.16 loaded');
