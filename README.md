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
