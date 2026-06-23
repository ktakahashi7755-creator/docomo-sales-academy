// DOCOMO Sales Academy — Service Worker（PWA：インストール可・基本オフライン）
//
// 方針：
//   - ナビゲーション（HTML）は network-first。オフライン時はキャッシュした app shell を返す。
//   - 同一オリジンのハッシュ付き資産（JS/CSS/画像）は cache-first（不変なので安全）。
//   - クロスオリジン（Google Fonts 等）は素通し（ネットワーク）。
//   - CACHE 名を更新すると activate 時に旧キャッシュを掃除する（デプロイ毎の更新）。
const CACHE = "dsa-v1";
// 配信ベース（ルート "/" でも GitHub Pages のサブパスでも自分の scope を使う）。
const SHELL = new URL("./", self.location).pathname;

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((c) => c.add(SHELL)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // ナビゲーション：network-first（更新優先）→ 失敗時は app shell でオフライン起動。
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          // SW 終了で書込が落ちないよう waitUntil で保持（イベントがまだ active のうちに呼ぶ）。
          event.waitUntil(caches.open(CACHE).then((c) => c.put(SHELL, copy)));
          return res;
        })
        .catch(() => caches.match(SHELL).then((r) => r || caches.match(request))),
    );
    return;
  }

  // 同一オリジンの資産：stale-while-revalidate（即時にキャッシュ → 背景で更新）。
  // ハッシュ付き資産は不変、ハッシュ無し資産（icon/manifest）も次回以降に反映され、
  // CACHE 名の手動更新に依存しない。
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request)
            .then((res) => {
              if (res.ok && res.type === "basic") cache.put(request, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached || network;
        }),
      ),
    );
  }
});
