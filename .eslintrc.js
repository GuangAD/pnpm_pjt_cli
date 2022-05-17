// https://eslint.org/docs/user-guide/configuring/
// https://eslint.org/docs/user-guide/command-line-interface
module.exports = {
  root: true,
  // env: {
  //   es6: true,
  //   node: true,
  //   browser: true,
  //   // node: true,
  //   // commonjs: true,
  // },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  // plugin插件主要是为eslint新增一些检查规则（对于其他的语言）
  // 赋予了eslint解析规则的检查能力，真正开启这个规则的检查能力还是要通过rules配置
  plugins: ['prettier'],
  // 它配置的内容实际就是一份份别人配置好的.eslintrc.js
  extends: ['standard', 'prettier', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': ['error', require('./.prettierrc.js')],
    'no-console': 1,
    'no-useless-call': 'off',
  },
  // globals: {
  //   // document,
  // },
  overrides: [
    {
      files: ['.js'],
    },
  ],
}
