// 四選一作答的流程測試：在 Node 的 vm 裡用假的 DOM 和 localStorage 執行 index.html 的程式（只用內建模組）
const fs = require("fs"), vm = require("vm"), assert = require("assert");

const html = fs.readFileSync("index.html", "utf8");
const inline = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// 假元素：textContent 設成空字串會清掉子元素，跟瀏覽器一樣
function fakeElement(){
  const el = { hidden: false, value: "", innerHTML: "", className: "", children: [], focus(){},
               appendChild(c){ this.children.push(c); } };
  let text = "";
  Object.defineProperty(el, "textContent", {
    get: () => text,
    set: v => { text = String(v); if (text === "") el.children = []; }
  });
  return el;
}
const elements = {};
const $ = id => elements[id] || (elements[id] = fakeElement());
const memory = {};
const context = vm.createContext({
  document: { getElementById: $, createElement: fakeElement },
  localStorage: { getItem: k => (k in memory ? memory[k] : null), setItem: (k, v) => { memory[k] = String(v); } },
  navigator: {}, window: {}, location: { reload(){} }, console, Date, confirm: () => true
});
for (const file of ["words.js", "srs.js", "csv.js", "quiz.js"]) vm.runInContext(fs.readFileSync(file, "utf8"), context);
vm.runInContext(inline, context);
const run = code => vm.runInContext(code, context);
const day = run("today()");
const total = run("WORDS.length");

// 1. 開啟時：第一張卡、統計列接上 countDue
assert.strictEqual($("card").textContent, "algorithm");
assert.strictEqual($("stats").textContent, "今日佇列：剩 " + total + " 張｜今天到期：" + total + " 張");
assert.strictEqual($("choiceBtn").hidden, false);

// 2. 按「四選一作答」：出四個不重複選項，含正解；顯示答案鈕藏起來
run("startChoice()");
const options = $("choices").children.map(b => b.textContent);
assert.strictEqual(options.length, 4);
assert.ok(options.includes("演算法"));
assert.strictEqual(new Set(options).size, 4);
assert.strictEqual($("reveal").hidden, true);

// 3. 選錯：顯示正解，但按「下一張」之前不寫紀錄；重複點選不重複計分
$("choices").children.find(b => b.textContent !== "演算法").onclick();
assert.ok($("meaning").textContent.startsWith("答錯 ✗ 正解：演算法"));
assert.strictEqual($("nextBtn").hidden, false);
run("pickChoice('演算法')");
assert.ok($("meaning").textContent.startsWith("答錯"));
assert.strictEqual(run("stateOf(cur).seen"), 0);

// 4. 下一張：答錯交給 mark(false)——回盒 1、明天到期、排到今天隊尾
run("finishChoice()");
assert.deepStrictEqual(JSON.parse(memory["vb-log"]).algorithm, { seen: 1, wrong: 1, box: 1, due: day + 1 });
assert.strictEqual(run("queue[queue.length - 1].en"), "algorithm");
assert.strictEqual($("card").textContent, "recursion");
assert.strictEqual($("choices").children.length, 0);
assert.strictEqual($("stats").textContent, "今日佇列：剩 " + total + " 張｜今天到期：" + (total - 1) + " 張");

// 5. 選對：交給 mark(true)——升到盒 2、兩天後到期、離開佇列
run("startChoice()");
$("choices").children.find(b => b.textContent === "遞迴").onclick();
assert.ok($("meaning").textContent.startsWith("答對 ✓"));
run("finishChoice()");
assert.deepStrictEqual(JSON.parse(memory["vb-log"]).recursion, { seen: 1, wrong: 0, box: 2, due: day + 2 });
assert.strictEqual(run("queue.length"), total - 1);

// 6. 還沒選就按「下一張」不會動到紀錄
run("finishChoice()");
assert.strictEqual(run("stateOf(cur).seen"), 0);

// 7. 全部記得到佇列清空：統計列要歸零（修正前會停在「剩 1 張」），作答鈕藏起來
run("while (queue.length) mark(true)");
assert.strictEqual($("stats").textContent, "今日佇列：剩 0 張｜今天到期：0 張");
assert.strictEqual($("choiceBtn").hidden, true);
console.log("choice flow tests passed ✓（出題、選錯、防重複、選對、未作答、清空）");
