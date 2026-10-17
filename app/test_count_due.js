const assert = require("assert");
const { countDue } = require("./srs.js");

assert.strictEqual(countDue([], 100), 0);                                // 空陣列
const states = [{ due: 99 }, { due: 100 }, { due: 101 }];
const before = JSON.stringify(states);
assert.strictEqual(countDue(states, 100), 2);                            // 過去 + 今天，未來不算
assert.strictEqual(countDue([{ due: 100 }], 100), 1);                    // 今天到期要算（<=）
assert.strictEqual(countDue([{ due: 101 }, { due: 102 }], 100), 0);      // 全部未到期
assert.strictEqual(JSON.stringify(states), before);                      // 不改輸入
assert.strictEqual(countDue(states, 100), countDue(states, 100));        // 同輸入重跑一致
console.log("6 countDue tests passed ✓");
