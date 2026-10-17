// test_csv.js —— 畢業挑戰「單字包 CSV 匯入」的單元測試（先寫、先紅後綠；CI 自動跑）
const assert = require("assert");
const { parseCSV, validateWords } = require("./csv.js");

// ---- parseCSV：文字 → 列（每列是欄位陣列，附原始行號）----
assert.deepStrictEqual(parseCSV("apple,蘋果\nbanana,香蕉"),
  [{ line: 1, fields: ["apple", "蘋果"] }, { line: 2, fields: ["banana", "香蕉"] }]);          // 基本
assert.deepStrictEqual(parseCSV("﻿apple,蘋果\r\n\r\nbanana,香蕉\r\n"),
  [{ line: 1, fields: ["apple", "蘋果"] }, { line: 3, fields: ["banana", "香蕉"] }]);          // BOM、CRLF、空行跳過但行號保留
assert.deepStrictEqual(parseCSV("en,zh\napple,蘋果"),
  [{ line: 2, fields: ["apple", "蘋果"] }]);                                                  // 表頭 en,zh 跳過
assert.deepStrictEqual(parseCSV("  apple , 蘋果  "),
  [{ line: 1, fields: ["apple", "蘋果"] }]);                                                  // 欄位前後空白修掉
assert.deepStrictEqual(parseCSV('"give up","放棄；投降, 認輸"'),
  [{ line: 1, fields: ["give up", "放棄；投降, 認輸"] }]);                                     // 引號內的逗號不是分隔
assert.deepStrictEqual(parseCSV('"say ""hi""",打招呼'),
  [{ line: 1, fields: ['say "hi"', "打招呼"] }]);                                             // 連續兩個引號代表一個引號
assert.deepStrictEqual(parseCSV("apple,蘋果,extra"),
  [{ line: 1, fields: ["apple", "蘋果", "extra"] }]);                                          // 欄位數不對由 validate 判
assert.deepStrictEqual(parseCSV(""), []);
assert.deepStrictEqual(parseCSV("   \n\n"), []);

// ---- validateWords：列 → { ok: 合法單字, errors: 逐行錯誤 }（規則沿用 check_words.js）----
const existing = [{ en: "algorithm", zh: "演算法" }];
let r = validateWords(parseCSV("apple,蘋果\nbanana,香蕉"), existing);
assert.deepStrictEqual(r, { ok: [{ en: "apple", zh: "蘋果" }, { en: "banana", zh: "香蕉" }], errors: [] });

r = validateWords(parseCSV("apple\n,蘋果\napple,\nbanana,香蕉,多的"), existing);
assert.deepStrictEqual(r.ok, []);
assert.deepStrictEqual(r.errors.map(e => e.line), [1, 2, 3, 4]);
assert.ok(r.errors[0].reason.includes("兩欄"), r.errors[0].reason);     // 欄位數不是 2
assert.ok(r.errors[1].reason.includes("en"), r.errors[1].reason);       // en 空
assert.ok(r.errors[2].reason.includes("zh"), r.errors[2].reason);       // zh 空
assert.ok(r.errors[3].reason.includes("兩欄"), r.errors[3].reason);

r = validateWords(parseCSV("algorithm,演算法\napple,蘋果\nApple,蘋果二"), existing);
assert.deepStrictEqual(r.ok, [{ en: "apple", zh: "蘋果" }]);
assert.deepStrictEqual(r.errors.map(e => e.line), [1, 3]);
assert.ok(r.errors[0].reason.includes("已有"), r.errors[0].reason);     // 與既有單字重複
assert.ok(r.errors[1].reason.includes("重複"), r.errors[1].reason);     // 檔內重複（不分大小寫）

r = validateWords(parseCSV("Apple,蘋果"), []);
assert.deepStrictEqual(r.ok, [{ en: "apple", zh: "蘋果" }]);            // en 統一小寫，和 words.js 一致

r = validateWords(parseCSV("ok,好\nbad\nfine,好的"), []);
assert.deepStrictEqual(r.ok.map(w => w.en), ["ok", "fine"]);           // 錯誤行不影響其他合法行
assert.deepStrictEqual(r.errors.map(e => e.line), [2]);

console.log("CSV tests passed ✓");
