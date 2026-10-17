// srs.js —— 純函式：不碰畫面、不自己看時鐘，所以可以測試
// （Lab 7 Sprint 3；PLAN 見 index.html 頂端註解）
const INTERVALS = [0, 1, 2, 4, 8, 16];   // 盒 1~5 的間隔天數（索引 0 不用）

function schedule(box, ok, today){
  const nb = ok ? Math.min(box + 1, 5) : 1;
  return { box: nb, due: today + INTERVALS[nb] };
}

// 用途：計算 states 中 due <= today（今天或更早到期）的筆數；不改輸入、不讀時鐘
function countDue(states, today){
  let n = 0;
  for (const s of states) if (s.due <= today) n++;
  return n;
}

// 讓 Node（測試）與瀏覽器（App）都能用這個檔案
if (typeof module !== "undefined") module.exports = { schedule, INTERVALS, countDue };
