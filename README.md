# VocaBuddy — yTp（第 12 組）

## 小組名稱

yTp｜第 12 組（vocabuddy-group-12）

## 組員

| 姓名 | GitHub 帳號 | 角色 |
| --- | --- | --- |
| 陳彥廷 | [@tim981030](https://github.com/tim981030) | Repository Owner |
| 陳柏東 | [@Dong-Chen-1031](https://github.com/Dong-Chen-1031) | Developer A |
| 孫浩雲 | [@Friedturtleee](https://github.com/Friedturtleee) | Developer B |
| 唐博威 | [@Tturtle611](https://github.com/Tturtle611) | Reviewer |

## E2：AI Native 開發工作坊成果（2026-10-17）

以官方 VocaBuddy v1.1（lab10 快照）為起點，完成工作坊的四項任務與教材 Lab 11–14，並加上本組自己的延伸功能。詳細過程、資料流、實驗與 review 紀錄見 **[docs/E2_REPORT.md](docs/E2_REPORT.md)**。

### 這次做了什麼

| 項目 | 內容 | 檔案 |
| --- | --- | --- |
| 新增三個程式主題單字 | loop＝迴圈、variable＝變數、debug＝除錯 | `app/words.js` |
| 新增純函式 `countDue(states, today)` | 回傳 `due <= today` 的筆數，不改輸入、不讀時鐘 | `app/srs.js`、`app/test_count_due.js` |
| 在 Colab 重做 | 同一個起點、同一組驗收，結果和 VS Code 相同 | `E2_Colab.ipynb` |
| 專案指示檔（Lab 12） | 隊規：怎麼跑、怎麼測、`// 用途：` 記號、不能自動 push | `AGENTS.md`（`CLAUDE.md` 匯入同一份） |
| 技能（Lab 13） | `add-words`：新增單字的固定流程 | `.claude/skills/add-words/SKILL.md` |
| 唯讀 review 子代理（Lab 14） | `code-reviewer`：只能讀，依四面向審 diff | `.claude/agents/code-reviewer.md` |
| **本組延伸：四選一作答** | 把 E1 的 `quiz()` 搬進網頁；由程式判斷對錯，結果接上 SRS 排程 | `app/quiz.js`、`app/index.html` |
| **本組延伸：今天到期張數** | 統計列用 `countDue` 顯示依排程今天到期的張數 | `app/index.html` |
| **本組延伸：Git 協作單字** | 沿用 E1 單字本的 5 個字（共 26 字） | `app/words.js` |
| Code review 後的修正 | Service Worker 啟用時清掉舊快取（升版本才會生效）、佇列清空時更新張數 | `app/sw.js`、`app/index.html` |

E2 由陳柏東（[@Dong-Chen-1031](https://github.com/Dong-Chen-1031)）使用 Claude Code 實作，每一步都先列計畫，再親自跑測試；合併前由 Reviewer 依報告第 7 節進行人工 review。

### 執行網頁

需要 Python 3，或任何靜態 HTTP 伺服器。請不要直接雙擊 `index.html`，因為 Service Worker 需要 localhost。

```bash
git clone https://github.com/tim981030/vocabuddy-group-12.git
cd vocabuddy-group-12/app
python3 -m http.server 8000      # Windows 可用：py -m http.server 8000
```

瀏覽器開啟 http://localhost:8000 ，結束時按 `Ctrl+C`。

**操作方式**：

- 「顯示答案」→「記得 ✓／忘了 ✗」：原本的自評複習。
- 「四選一作答」→ 選一個中文意思 → 顯示答對或答錯 →「下一張 →」：本組新增。答對升盒，答錯回到盒 1，並在今天稍後重考。
- 上方統計列：「今日佇列」是這次還要複習的張數（答錯的會重排進來）；「依排程今天到期」是由 `countDue` 算出、排程日期在今天以前的張數。
- 開發者工具 Console 輸入 `vbTravel(1)` 可以快轉一天，用來測試複習排程。

### 測試方式

需要 Node.js（測試只用內建模組，不需要 `npm install`）。在 repo 根目錄執行：

```bash
node app/test_srs.js
node app/test_csv.js
node app/check_words.js
node app/test_count_due.js
node app/test_quiz.js
node app/test_choice_flow.js
node app/e2_contract.js
```

本組實際執行結果（2026-10-17，Node v26.5.0）：

```
4 tests passed ✓
CSV tests passed ✓
words.js 檢查通過，共 26 字 ✓
6 countDue tests passed ✓
8 quiz tests passed ✓
choice flow tests passed ✓（出題、選錯、防重複、選對、未作答、清空）
E2 contract passed
```

| 測試 | 驗證什麼 |
| --- | --- |
| `test_srs.js` | 原本的排程規則：答對升盒、最高盒 5、答錯回盒 1 |
| `test_csv.js` | 原本的 CSV 匯入解析與驗證 |
| `check_words.js` | 單字欄位齊全、沒有重複 |
| `test_count_due.js` | `countDue`：空陣列、過去／今天／未來（today=100 時 `due=100` 要算）、全部未到期、不改輸入、重跑結果一致 |
| `test_quiz.js` | 四選一出題：4 個不重複選項且含正解、字庫不夠時減少選項、不改輸入 |
| `test_choice_flow.js` | 用假 DOM 執行 `index.html`：出題、選錯、防止重複計分、選對、未作答按下一張、佇列清空時張數歸零 |
| `e2_contract.js` | 助教提供的合約測試（原封不動） |

### 在 Colab 執行

[在 Google Colab 開啟 E2_Colab.ipynb](https://colab.research.google.com/github/tim981030/vocabuddy-group-12/blob/main/E2_Colab.ipynb)

開啟後由上而下執行即可。CPU 就能跑，不需要 API key。筆記本會還原同一個起點，寫入本組的 `words.js` 與 `countDue`，再跑同一組測試與合約測試，最後下載成果 zip。

---

## E1：VocaBuddy Python 版

## 專案簡介

VocaBuddy 是一個用 Python 撰寫的英文單字學習小工具，在 Google Colab 上執行。

單字以清單（list of dict）形式儲存，每一筆包含英文單字、詞性、中文解釋與例句。程式提供兩種使用方式：完整瀏覽整份單字清單，或是透過隨機測驗檢驗學習成果並記錄答對與答錯的單字。

## 組員分工

1. **陳彥廷 @tim981030（Repository Owner）**：建立 GitHub Repository、邀請 Collaborators、以 Google Colab 建立 `VocaBuddy.ipynb` 初版
2. **陳柏東 @Dong-Chen-1031（Developer A）**：建立單字本資料結構，新增 5 個英文單字與中文解釋，並撰寫 `show_vocabulary()` 列出所有單字
3. **孫浩雲 @Friedturtleee（Developer B）**：新增 `draw_random_word()` 隨機抽取單字，以及 `quiz()` 單字測驗功能（含答對／答錯紀錄與正確率統計）
4. **唐博威 @Tturtle611（Reviewer）**：整理 README、檢查程式與 commit 紀錄、負責繳交成果

## 本次新增的單字

共新增 5 個單字，每個單字均包含詞性、中文解釋與例句：

| 英文單字 | 詞性 | 中文解釋 |
| --- | --- | --- |
| collaboration | n. | 合作、協作 |
| repository | n. | 倉庫、儲存庫 |
| commit | v. / n. | 提交（版本紀錄）、承諾 |
| notebook | n. | 筆記本、（Colab）筆記本檔案 |
| review | v. / n. | 檢查、複習、審查 |

## 本次新增的功能

- **`show_vocabulary(vocab_list)`**：依序列出所有單字的英文、詞性、中文解釋與例句，並顯示單字總數
- **`draw_random_word(vocab_list)`**：隨機抽取一個單字並顯示中文解釋
- **`quiz(vocab_list, questions=3)`**：單字測驗。以中文解釋出題、四選一作答，作答後會即時判斷對錯，並在最後統計答對題數、答錯題數、正確率，以及列出需要複習的單字

## Google Colab 開啟連結

https://colab.research.google.com/github/tim981030/vocabuddy-group-12/blob/main/VocaBuddy.ipynb

## 程式執行方式

1. 點擊上方的 Google Colab 連結開啟 `VocaBuddy.ipynb`
2. 選擇上方選單的「執行階段」→「全部執行」
3. 由上而下依序會看到：
   - 單字本建立完成的訊息與單字總數
   - 完整的單字清單（英文、詞性、中文解釋、例句）
   - 隨機抽取的一個單字
   - 3 題單字測驗與測驗結果統計

### 自己作答

Notebook 中的測驗預設使用 `answers=["D", "C", "A"]` 自動作答，方便「全部執行」時不需要手動輸入。若想自己作答，請把最後一個程式儲存格的最後一行改成：

```python
quiz(vocabulary, questions=3)
```

即可依照題目手動輸入 A／B／C／D。

### 新增自己的單字

在 `vocabulary` 清單中依照相同格式加入即可，其餘功能會自動套用：

```python
{
    "word": "example",
    "meaning": "例子、範例",
    "pos": "n.",
    "example": "This is an example sentence.",
}
```
