# VocaBuddy 第 12 組（yTp）專案指示檔

## 這是什麼專案
- 背單字網頁，純前端（HTML＋原生 JavaScript），沒有後端、資料庫或建置步驟。
- 學習紀錄存在瀏覽器 localStorage（`vb-log`、`vb-words`、`vb-day`），單字包在 `app/words.js` 的 `WORDS`。
- `VocaBuddy.ipynb` 是 E1 的 Python 版作業，E2 不要動它。

## 怎麼跑起來
- 網頁：`cd app && python3 -m http.server 8000`，開 http://localhost:8000。不要用 file:// 開，service worker 會註冊失敗。
- 測試一律在 `app/` 執行，全部都要通過：
  `node test_srs.js`、`node test_csv.js`、`node check_words.js`、`node test_count_due.js`、`node test_quiz.js`、`node test_choice_flow.js`、`node e2_contract.js`
- `e2_contract.js` 是助教提供的合約測試，只能執行，不能修改。

## 程式碼慣例
- 2 空格縮排、`const`／`let`、函式小駝峰；不引入任何框架與套件。
- **每個新函式上方加一行 `// 用途：…`**（繁體中文）。
- 邏輯寫成純函式（例如 `srs.js`、`csv.js`、`quiz.js`）：不碰 DOM、不碰 localStorage、不讀時鐘，`today` 由呼叫端傳入。
- 純函式檔尾用 `if (typeof module !== "undefined") module.exports = {...}`，只新增匯出，不刪既有匯出。
- 新增純函式要附 Node 測試檔 `test_*.js`（只用內建 `assert`）。
- 改了前端檔案或新增檔案時，同步更新 `sw.js` 的 `CACHE` 版本，並把新檔加進 `SHELL`。

## 協作規矩
- commit 訊息：`類型: 說明`（feat／fix／docs／chore／test），說明用繁體中文。
- 分支：`e2/…` 或 `feature/…`，透過 PR 合併到 `main`，不直接改 `main`。
- 修改前先列計畫，等組員回覆「執行」才動手；只改計畫裡列出的檔案。
- 改完要親自跑測試並貼出真實輸出，不能把沒跑的寫成通過。

## 不要做的事
- 不要自動 `git push`、不要 force push、不要發 PR：對外的動作由組員自己按。
- 不要改 `words.js` 的資料格式（每筆只有 `en`、`zh`），不要重排既有單字。
- 不要為了讓測試通過而刪改測試。
- 不要把任何 API 金鑰寫進程式碼或 commit。
