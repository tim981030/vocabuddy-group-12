# E2 AI Native 開發工作坊：第 12 組（yTp）成果報告

> 2026-10-17 工作坊作業。依據：工作坊錄影、操作投影片（`YTP_E2_操作投影片.pdf`）、教材第五篇 Lab 11–14（https://tw-ytp.github.io/vocabuddy/#/ch5）。
> 本組使用代理式編碼工具 **Claude Code** 協作完成。所有測試輸出都是實際執行的結果，原始紀錄放在 [`docs/evidence/`](evidence/)。

## 1. 交付項目對照

| 投影片要求 | 本組成果 | 位置 |
| --- | --- | --- |
| 01 找到「記得」按鈕的資料流 | 第 3 節，附檔名與行號 | 本檔 |
| 02 新增三個程式主題單字 | loop＝迴圈、variable＝變數、debug＝除錯（18 → 21 字） | `app/words.js` |
| 03 新增 `countDue` 與測試 | 純函式＋ 6 個斷言 | `app/srs.js`、`app/test_count_due.js` |
| 04 在 Colab 重做並比較 | 筆記本＋兩環境比較 | `E2_Colab.ipynb`、第 8 節 |
| Lab 12 專案指示檔＋對照實驗 | `AGENTS.md`（`CLAUDE.md` 以 `@AGENTS.md` 匯入同一份） | 根目錄、第 5 節 |
| Lab 13 第一個技能＋正反測試 | `add-words` | `.claude/skills/add-words/SKILL.md`、第 6 節 |
| Lab 14 唯讀 review 子代理＋人審對照 | `code-reviewer`（只能 Read／Grep／Glob） | `.claude/agents/code-reviewer.md`、第 7 節 |
| 自己的延伸功能（老師：不要照抄示範） | 四選一作答接上 SRS、今天到期張數、E1 的 Git 協作單字 | 第 4 節 |
| PROMPTS、計畫與驗收紀錄 | 第 9、10 節 | 本檔 |

## 2. 變更歷史（分支 `e2/ai-native`）

每一步都是「先計畫 → 改 → 自己跑測試 → commit」，一個 commit 只做一件事：

```
chore: 加入 E2 起點程式（官方 v1.1 lab10 快照）          ← 未修改的基準，18 字、3 支測試通過
docs:  新增專案指示檔，統一 AI 產出風格與驗收流程
feat:  新增 3 個「程式」主題單字（loop、variable、debug）
feat:  新增純函式 countDue 與 test_count_due.js，加入 E2 合約測試
feat:  新增 add-words 技能，統一新增單字流程
fix:   sw.js 快取版本升到 v3，讓改過的 words.js、srs.js 生效
feat:  新增四選一出題純函式 makeChoices 與 test_quiz.js
fix:   佇列清空時也更新張數，不再停在「剩 1 張」
feat:  單字卡加入四選一作答（接上 SRS 排程），統計列顯示 countDue 今天到期張數
feat:  新增 5 個「Git 協作」主題單字
feat:  新增唯讀 code-reviewer 子代理
fix:   依 code review 修正：sw.js 啟用時清掉舊快取、統計列標籤改清楚、測試改用 __dirname
chore: 新增第 12 組 Colab 筆記本，填入已驗收的 words.js 與 countDue
```

查看完整 diff：`git diff f214ca0 HEAD -- app`（`f214ca0` 是未修改的起點）。

## 3. Lab 11：讀懂程式

### 第一輪：專案地圖

| 檔案 | 責任 | 證據 |
| --- | --- | --- |
| `app/index.html` | 畫面、按鈕事件、佇列、localStorage 讀寫 | 依序載入 words → srs → csv → quiz（`index.html:83-86`） |
| `app/words.js` | 單字包 `WORDS`（只有 `en`、`zh`） | `words.js:2` |
| `app/srs.js` | 純函式 `schedule`、`countDue` 與 `INTERVALS` | `srs.js:3-18` |
| `app/csv.js` | CSV 匯入的解析與驗證（純函式） | `csv.js` |
| `app/quiz.js` | 四選一出題（純函式，本組新增） | `quiz.js` |
| `app/sw.js`、`manifest.json` | PWA 離線快取與安裝資訊 | `sw.js:1-2` |
| `test_*.js`、`check_words.js`、`e2_contract.js` | Node 測試入口，只用內建 `assert` | 第 10 節 |

觀察：沒有後端或資料庫。資料只有兩種：`words.js` 進 Git，學習紀錄 `vb-log` 存在瀏覽器（`index.html:91-93`）。

### 第二輪：按下「記得」之後（`mark(true)`）

1. 按鈕 `onclick="mark(true)"`（`index.html:64`）。
2. `stateOf(cur)` 取出這個字的紀錄，沒有就建立；舊紀錄補上 `box=1`、`due=today()`（`index.html:104-108`）。
3. `seen++`，答錯才 `wrong++`（`index.html:152`）。
4. `schedule(s.box, ok, today())` 交給純函式算新盒級與到期日（`index.html:153` → `srs.js:5-8`）。答對升一盒（最高 5），答錯回盒 1，`due = today + INTERVALS[盒]`。
5. 結果寫回紀錄 `s.box`、`s.due`（`index.html:154`）。
6. `save()` 把整個 `log` 存進 localStorage `vb-log`（`index.html:155` → `index.html:93`）。
7. **佇列更新**：答對 `queue.shift()` 移出；答錯 `queue.push(queue.shift())` 排到隊尾（`index.html:156-157`）。
8. `next()` 顯示下一張；佇列空了就顯示「今天沒有到期的卡」（`index.html:158` → `index.html:122`）。

本組的四選一作答在第 4 步之前都一樣：`finishChoice()` 直接呼叫 `mark(picked)`，所以和「記得／忘了」走同一條路。

### 第三輪：為什麼 `schedule(box, ok, today)` 要由外部傳入 `today`？

- **程式事實**：`srs.js` 不讀時鐘；`today()` 在 `index.html:98`，單位是「從 1970-01-01 起算的第幾天」，`Math.floor(Date.now() / 864e5)` 再加上測試用的 `dayOffset`。
- **程式事實**：`test_srs.js:4` 固定 `today=100`，盒 1 答對變盒 2，`due = 100 + INTERVALS[2] = 102`，所以測試每次跑結果都一樣。
- **推論**：時間由外部傳入，函式就是純函式，可以重現測試，也能用 `vbTravel(n)` 快轉日期。代價是呼叫端要傳對單位（天數，不是毫秒）。如果誤傳 `Date.now()`，到期日會差好幾個數量級。

## 4. 本組的延伸功能（巧思）

老師在錄影中示範了「國三・中文答英文」，並強調那不是唯一解，每組要放進自己的巧思。本組的延伸功能接續自己 E1 的作品（`VocaBuddy.ipynb`）：

1. **四選一作答**：把 E1 Python 版 `quiz()` 的四選一構想搬進網頁。原本的「記得／忘了」是自己評分，容易高估；選擇題由程式判斷對錯，結果交給 `mark()`，直接接上 SRS 排程。
   - 出題是純函式 `makeChoices(answer, pool, n, rand)`（`quiz.js`）：中文選項不重複、一定含正解、亂數由外部傳入（測試用固定種子）。
   - 選完先顯示對錯，按「下一張」才寫入紀錄；重複點選不會重複計分；還沒選就按「下一張」不會動到紀錄。
2. **依排程今天到期張數**：統計列呼叫 `countDue(WORDS.map(stateOf), today())`，讓今天的 `countDue` 真的接到畫面上。
3. **Git 協作單字包**：collaboration、repository、commit、notebook、review，沿用 E1 單字本，透過 `add-words` 技能的流程新增（21 → 26 字）。

**一個邊界案例**：答錯的字會留在今天的佇列裡重練，但它的排程已經改成明天。所以答錯一題後，統計列會顯示「剩 26 張｜依排程今天到期：25 張」。兩個數字故意不同，這也是 review 後把標籤改成「依排程今天到期」的原因（第 7 節）。

## 5. Lab 12：專案指示檔對照實驗

同一個起點、同一句提示，每組都開乾淨的新工作階段，工具限制成唯讀：

> 請新增純函式 countDue 的計畫。先不要改檔。說明你會讀哪些檔案、函式上方會放什麼註解、以及修改後會跑什麼測試。

| 比較項目 | A：沒有指示檔 | B：有 `AGENTS.md` |
| --- | --- | --- |
| 函式上方的固定記號 `// 用途：` | ❌ 沒有，寫的是一般中文註解 | ✅ `// 用途：計算今天已到期…` |
| 更新 `sw.js` 的 CACHE | ❌ 明說「不用改」 | ✅ 計畫升到 v3 |
| 等組員回覆「執行」才動手 | 只說「確認後就開始」 | ✅ 明確要求回覆「執行」 |
| 不 push、不發 PR | 沒提 | ✅ 明列 |
| 貼出真實測試輸出 | 沒提 | ✅ 明列 |

結論：指示檔有效。記號這條規則挑的是「模型照抄現狀不會自然做到」的事（A 組確實沒做到），所以不是假陽性。
另一個發現：兩組都自己決定了 `countDue` 的參數（A 組處理缺 `due`，B 組改成 `(words, log, today)`），都和投影片規格 `countDue(states, today)` 不同。所以下一步要給精確的規格與預期結果，不能讓 AI 自己猜。原始輸出：[`lab12_A_無指示檔.txt`](evidence/lab12_A_無指示檔.txt)、[`lab12_B_有指示檔.txt`](evidence/lab12_B_有指示檔.txt)。

## 6. Lab 13：`add-words` 技能的觸發測試

各開一個乾淨的工作階段，在隔離的複本裡執行，並移除 remote，避免任何 push 出去：

| 測試 | 請求（完全沒提技能） | 結果 |
| --- | --- | --- |
| 正向 | 「幫我加三個天氣主題的單字。」 | ✅ 自動觸發 `add-words` → 讀格式 → 先列計畫、等「執行」 → 加在最後並寫主題註解 → 升 CACHE → 跑完 5 支測試（共 24 字）→ commit `feat: 新增 3 個「天氣」主題單字` → 沒有 push |
| 負向 | 「幫我把卡片的圓角改大一點。」 | ✅ 沒有觸發技能，沒有跑 `check_words.js`，只改 `#card` 的 `border-radius` |

正向測試還順便抓到本組自己的疏漏：前面改了 `words.js`、`srs.js`，卻沒照規則升 `sw.js` 的 CACHE，所以補了一個 fix commit。原始紀錄：[`lab13_正向測試_天氣單字.txt`](evidence/lab13_正向測試_天氣單字.txt)、[`lab13_負向測試_卡片圓角.txt`](evidence/lab13_負向測試_卡片圓角.txt)。

## 7. Lab 14：機器審 vs 人審

主對話先取出 diff：`git diff f214ca0 HEAD -- app`，共 326 行。整段貼給唯讀的 `code-reviewer` 子代理，它不能寫檔，也不能跑指令。原始報告：[`lab14_code-reviewer_報告.txt`](evidence/lab14_code-reviewer_報告.txt)。

| 類別 | 內容 | 處理 |
| --- | --- | --- |
| 主對話先自審發現 | ① 佇列清空時統計列停在「剩 1 張」（起點程式就有的 bug）；② 改了前端檔案卻沒升 CACHE | 已修，① 有測試保護（把修正拿掉，測試會失敗） |
| 只有子代理抓到 | **sw.js 沒有 `activate` 清舊快取**。`caches.match` 會先找到舊版快取，升 CACHE 對舊使用者無效（中） | 查證屬實後修正。在 Chrome 實測：放一個假的舊 v2 快取，新版啟用後只剩 v6 |
| 只有子代理抓到 | 統計列兩個數字容易誤會、測試路徑依賴執行位置、測試輔助函式缺 `// 用途：`（低） | 都已修正 |
| 子代理要求人工確認 | `e2_contract.js` 是否和助教原版一致 | 已和助教筆記本內嵌的原文逐字比對：完全相同 |
| 範圍外的既有風險 | `index.html` 的 AI 例句與考我弱點用 `innerHTML` 插入 AI 回傳內容 | 不在本次範圍，列為後續 issue |
| 它抓錯的 | 本次沒有發現誤報 | — |

**組員人工 review（合併前由 Reviewer 填寫）**

- [ ] 自己讀過完整 diff，再看上面的機器報告
- [ ] 本機跑過第 10 節的 7 支測試，看到通過的輸出
- [ ] 用瀏覽器走過一次四選一（選錯、選對、下一張）
- [ ] 只有人能判斷的事（設計是否合理、是否符合組內決定）：＿＿＿＿
- [ ] 決定：可以合併／需要修改，原因：＿＿＿＿

## 8. 兩個環境的比較（VS Code vs Colab）

| | VS Code（本機代理） | Colab（`E2_Colab.ipynb`） |
| --- | --- | --- |
| 起點 | 同一份 v1.1 lab10 快照（18 字） | 同一份，第 1 格內嵌（18 字） |
| AI 怎麼看到程式 | 代理直接讀寫工作資料夾 | 只看得到貼過去的檔案快照；改檔後要重新輸出再貼 |
| 跑測試 | 終端機 `node` | 儲存格 `run_node()`，失敗會停在該格 |
| 結果 | 21 字；`test_srs`、`test_csv`、`check_words`、`test_count_due`、`e2_contract` 全部通過 | 本機用 Local 模式逐格執行，結果相同：21 字、5 支全部通過，diff 格只顯示預期的兩處改動 |
| UI 驗收 | `python3 -m http.server` ＋瀏覽器 | 做不到，要下載成果再回本機用 HTTP 開 |

投影片第 33 頁的四個問題：

1. **哪一項規格兩邊都通過？** 助教的 `e2_contract.js`：三個字各出現一次；`countDue` 在 today=100 時包含今天；不改輸入；`schedule` 行為不變。
2. **哪一次 AI 回答需要補上下文？** Lab 12 兩組都自己決定了 `countDue` 的參數，要補上「輸入是 states 陣列、條件 `<=`」的規格才對。Colab 那邊的 AI 只看得到貼過去的快照，換檔後要重新提供。
3. **哪個測試抓到真實問題？** `test_choice_flow.js` 第 7 段抓到「佇列清空時張數不更新」。拿掉修正就會失敗：實際「剩 1 張」，預期「剩 0 張」。另外把 `countDue` 的 `<=` 改成 `<`，`test_count_due.js` 和 `e2_contract.js` 都會失敗，代表測試真的擋得住。
4. **哪些 UI 行為仍需人工驗證？** PWA 安裝、離線開啟、手機版面、真實裝置上的快取更新，以及需要 API 金鑰的「AI 例句」「考我弱點」（本次沒有測）。

## 9. PROMPTS

給代理的主要指示（依時間順序）：

1. 組員：「幫我看這個影片完成該做的作業」、「老師怎麼說就怎麼做」。
2. Lab 12 對照實驗（A、B 兩組相同）：「請新增純函式 countDue 的計畫。先不要改檔。說明你會讀哪些檔案、函式上方會放什麼註解、以及修改後會跑什麼測試。」
3. Lab 13 正向測試：「幫我加三個天氣主題的單字。」→「執行」；負向測試：「幫我把卡片的圓角改大一點。」
4. Lab 14：「請 code-reviewer 子代理審查以下 diff（從 E2 起點程式到目前的 app/ 改動，全文貼在下方）。只回報子代理的結論，不要修改任何檔案。」＋完整 diff。
5. 核心任務的規格照投影片第 18、21–23 頁：單字「新增 loop=迴圈、variable=變數、debug=除錯，已有就跳過，只改 app/words.js」；countDue「只接收 states 與 today，計算 due <= today，不改輸入、不讀時鐘、不改 schedule，每個新函式前加 // 用途：」。

## 10. 執行與驗收紀錄

在 repo 根目錄執行（`test_choice_flow.js` 用 `__dirname`，也可以在 `app/` 裡執行）：

```
$ for t in test_srs.js test_csv.js check_words.js test_count_due.js test_quiz.js test_choice_flow.js e2_contract.js; do node app/$t; done
4 tests passed ✓
CSV tests passed ✓
words.js 檢查通過，共 26 字 ✓
6 countDue tests passed ✓
8 quiz tests passed ✓
choice flow tests passed ✓（出題、選錯、防重複、選對、未作答、清空）
E2 contract passed
```

瀏覽器實測（Chrome，`http://localhost:8012`）：

- 開啟後顯示「剩 26 張｜依排程今天到期：26 張」。
- 四選一出 4 個選項，含正解。
- 選錯顯示「答錯 ✗ 正解：演算法」，按「下一張」後 `algorithm` 變成 `{box:1, due:明天, seen:1, wrong:1}`，並排到隊尾。
- 選對顯示「答對 ✓ 遞迴」，`recursion` 變成 `{box:2, due:後天}`。
- 重新整理後紀錄仍在。
- Service Worker 快取包含 `quiz.js`，Console 沒有錯誤。
