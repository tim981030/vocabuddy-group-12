const assert = require("assert");
const { shuffle, makeChoices } = require("./quiz.js");
const WORDS = require("./words.js");

// 固定種子的亂數，讓測試可重現
function seeded(seed){
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}

const answer = { en: "loop", zh: "迴圈" };
const opts = makeChoices(answer, WORDS, 4, seeded(1));
assert.strictEqual(opts.length, 4);                                       // 四個選項
assert.ok(opts.includes("迴圈"));                                         // 一定含正解
assert.strictEqual(new Set(opts).size, 4);                                // 選項不重複
assert.deepStrictEqual(makeChoices(answer, WORDS, 4, seeded(1)), opts);   // 同種子結果一致

const pool = [{ en: "a", zh: "甲" }, { en: "b", zh: "乙" }, { en: "loop", zh: "迴圈" }, { en: "c", zh: "甲" }];
const before = JSON.stringify(pool);
const small = makeChoices(answer, pool, 4, seeded(7));
assert.deepStrictEqual(small.slice().sort(), ["乙", "甲", "迴圈"].sort());  // 字庫不夠：只出 3 個，重複的「甲」只算一次
assert.strictEqual(JSON.stringify(pool), before);                         // 不改輸入

const list = [1, 2, 3, 4, 5];
const mixed = shuffle(list, seeded(3));
assert.deepStrictEqual(list, [1, 2, 3, 4, 5]);                            // shuffle 不改原陣列
assert.deepStrictEqual(mixed.slice().sort(), [1, 2, 3, 4, 5]);            // 元素一個都不少
console.log("8 quiz tests passed ✓");
