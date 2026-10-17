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
  {en:"butterfly", zh:"蝴蝶"},      {en:"crocodile", zh:"鱷魚"},
  // 程式主題單字（E2 AI Native 工作坊）
  {en:"loop", zh:"迴圈"},           {en:"variable", zh:"變數"},
  {en:"debug", zh:"除錯"},
  // Git 協作主題單字（沿用第 12 組 E1 VocaBuddy.ipynb 的單字本）
  {en:"collaboration", zh:"合作；協作"}, {en:"repository", zh:"倉庫；儲存庫"},
  {en:"commit", zh:"提交（版本紀錄）；承諾"}, {en:"notebook", zh:"筆記本；（Colab）筆記本檔案"},
  {en:"review", zh:"檢查；複習；審查"}
];
if (typeof module !== "undefined") module.exports = WORDS;
