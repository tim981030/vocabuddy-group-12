const CACHE = "ytp-vocabuddy-v6";     // E2：v3 改 words.js、srs.js；v4 加四選一（quiz.js）；v5 加 Git 協作單字；v6 加清舊快取
const SHELL = ["./", "index.html", "words.js", "srs.js", "csv.js", "quiz.js", "manifest.json", "icon.png"];  // Lab 10 加 csv.js；icon.png 見 E-025；E2 加 quiz.js

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));   // 安裝時先存一份
});

// 用途：新版啟用時刪掉其他版本的快取；不刪的話 caches.match 會先找到舊版檔案，升 CACHE 版本也沒用
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request)) // 先問快取，沒有才上網
  );
});
