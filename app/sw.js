const CACHE = "ytp-vocabuddy-v2";     // Lab 10 改版：v1 → v2，舊快取才會換新
const SHELL = ["./", "index.html", "words.js", "srs.js", "csv.js", "manifest.json", "icon.png"];  // Lab 10 加 csv.js；icon.png 見 E-025

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));   // 安裝時先存一份
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request)) // 先問快取，沒有才上網
  );
});
