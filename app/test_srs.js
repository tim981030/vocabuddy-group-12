const assert = require("assert");
const { schedule } = require("./srs.js");

assert.deepStrictEqual(schedule(1, true, 100),  { box: 2, due: 102 });  // 答對晉級
assert.deepStrictEqual(schedule(3, true, 100),  { box: 4, due: 108 });
assert.deepStrictEqual(schedule(5, true, 100),  { box: 5, due: 116 });  // 頂級不再升
assert.deepStrictEqual(schedule(4, false, 100), { box: 1, due: 101 });  // 答錯打回盒 1
console.log("4 tests passed ✓");
