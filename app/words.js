// words.js —— 單字包：全隊共編，進 Git（Lab 8 Sprint 4；PLAN 見 index.html 頂端註解）
const WORDS = [
  {en:"algorithm", zh:"演算法"},   {en:"recursion", zh:"遞迴"},
  {en:"vocabulary", zh:"字彙"},    {en:"memorize", zh:"背誦"},
  {en:"efficient", zh:"有效率的"}, {en:"persist", zh:"堅持；持續"},
  {en:"retrieve", zh:"取回；檢索"},{en:"interval", zh:"間隔"},
  // 動物主題單字包（Sprint 4 多人共編演練，分支 lab08/feature/words-animals）
  {en:"elephant", zh:"大象"},       {en:"dolphin", zh:"海豚"},
  {en:"eagle", zh:"老鷹"},          {en:"penguin", zh:"企鵝"},
  {en:"giraffe", zh:"長頸鹿"},      {en:"squirrel", zh:"松鼠"},
  {en:"octopus", zh:"章魚"},        {en:"kangaroo", zh:"袋鼠"},
  {en:"butterfly", zh:"蝴蝶"},      {en:"crocodile", zh:"鱷魚"}
];
if (typeof module !== "undefined") module.exports = WORDS;
