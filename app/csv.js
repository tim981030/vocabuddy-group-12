// csv.js —— 單字包 CSV 匯入的純函式（畢業挑戰；PLAN 見 index.html 頂端註解）
// 不碰 DOM、不碰 localStorage，所以 Node 可以直接測（test_csv.js），瀏覽器也能直接用。

// 把一行 CSV 切成欄位：逗號分隔；雙引號包住的欄位內可含逗號，"" 代表一個引號；欄位前後空白修掉
function splitLine(line){
  const fields = [];
  let cur = "", quoted = false;
  for (let i = 0; i < line.length; i++){
    const ch = line[i];
    if (quoted){
      if (ch === '"' && line[i + 1] === '"'){ cur += '"'; i++; }   // 連續兩個引號 → 一個引號
      else if (ch === '"') quoted = false;                           // 收尾引號
      else cur += ch;
    } else if (ch === '"') quoted = true;                            // 起始引號
    else if (ch === ","){ fields.push(cur.trim()); cur = ""; }
    else cur += ch;
  }
  fields.push(cur.trim());
  return fields;
}

// 文字 → 列陣列 [{ line, fields }]。處理 BOM、CRLF、空行（跳過但行號照算）、表頭 en,zh（跳過）
function parseCSV(text){
  const rows = [];
  text.replace(/^﻿/, "").split(/\r?\n/).forEach((raw, i) => {
    if (!raw.trim()) return;                                         // 空行
    const fields = splitLine(raw);
    if (i === 0 && fields.length === 2 &&
        fields[0].toLowerCase() === "en" && fields[1].toLowerCase() === "zh") return;   // 表頭
    rows.push({ line: i + 1, fields });
  });
  return rows;
}

// 列 → { ok: [{en, zh}], errors: [{line, reason}] }。規則沿用 check_words.js：
// 兩欄都要有；en 不可與既有單字重複、檔內不可重複（不分大小寫）；en 統一小寫，和 words.js 一致
function validateWords(rows, existing){
  const taken = new Set((existing || []).map(w => String(w.en).toLowerCase()));
  const ok = [], errors = [];
  for (const { line, fields } of rows){
    if (fields.length !== 2){ errors.push({ line, reason: "要剛好兩欄 en,zh，這行有 " + fields.length + " 欄" }); continue; }
    const en = fields[0].toLowerCase(), zh = fields[1];
    if (!en){ errors.push({ line, reason: "en 是空的" }); continue; }
    if (!zh){ errors.push({ line, reason: "zh 是空的" }); continue; }
    if (taken.has(en)){
      errors.push({ line, reason: ok.some(w => w.en === en) ? "檔內重複：" + en : "單字包已有：" + en });
      continue;
    }
    taken.add(en);
    ok.push({ en, zh });
  }
  return { ok, errors };
}

if (typeof module !== "undefined") module.exports = { parseCSV, validateWords, splitLine };
