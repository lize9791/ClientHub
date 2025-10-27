/** @type {import("prettier").Config} */
module.exports = {
  // 基础格式规则
  printWidth: 100, // 超过 100 字符时换行（包括模板标签属性）
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',

  // Vue 专用规则
  vueIndentScriptAndStyle: true, // script 和 style 标签内缩进
  htmlWhitespaceSensitivity: 'ignore', // 忽略空格敏感性，避免不必要的换行
  singleAttributePerLine: false, // 允许多个属性在同一行（不会强制换行）
  bracketSameLine: true, // 使 `>` 保持在最后一个属性的同一行
}
