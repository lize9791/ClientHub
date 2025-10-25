/** @type {import("prettier").Config} */
module.exports = {
  // 基础格式化规则
  printWidth: 100,            // 每行最大长度
  tabWidth: 2,                // 缩进空格数
  useTabs: false,             // 使用空格缩进
  semi: false,                // 语句末尾不加分号
  singleQuote: true,          // 使用单引号
  quoteProps: 'as-needed',    // 对象属性仅在必要时加引号
  trailingComma: 'es5',       // ES5中有效的地方保留尾逗号（对象、数组等）
  bracketSpacing: true,       // 对象字面量中保留空格 { foo: bar }
  arrowParens: 'always',      // 箭头函数参数总是加括号
  endOfLine: 'lf',            // 换行符为 LF（避免跨平台问题）

  // Vue 特定配置
  vueIndentScriptAndStyle: true,  // script 与 style 标签内容缩进
  singleAttributePerLine: true,   // 多属性标签时每个属性独占一行

  // 文件相关
  htmlWhitespaceSensitivity: 'ignore', // 忽略 HTML 空白敏感性
  embeddedLanguageFormatting: 'auto',  // 自动格式化嵌入的代码块（如 vue 中的 JS/HTML/CSS）
}
