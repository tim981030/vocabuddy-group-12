// quiz.js —— 四選一作答的純函式（E2 第 12 組延伸功能，沿用 E1 VocaBuddy.ipynb 的 quiz() 構想）
// 不碰 DOM、不碰 localStorage，亂數由呼叫端傳入，所以 Node 可以直接測（test_quiz.js）。

// 用途：回傳打亂順序後的新陣列，不改動原陣列；rand 是回傳 [0,1) 的函式
function shuffle(list, rand){
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 用途：為 answer 產生 n 個中文選項（含正解、中文不重複），從 pool 挑干擾項；pool 不夠時選項會少於 n
function makeChoices(answer, pool, n, rand){
  const others = [...new Set(pool.map(w => w.zh))].filter(zh => zh !== answer.zh);
  const distractors = shuffle(others, rand).slice(0, n - 1);
  return shuffle([answer.zh, ...distractors], rand);
}

if (typeof module !== "undefined") module.exports = { shuffle, makeChoices };
