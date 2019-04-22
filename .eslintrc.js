module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  // 此项指定环境的全局变量，下面的配置指定为浏览器环境
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended'],

  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "vue/no-v-html": "off",
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off'
    // 'vue/require-component-is': 'off'
  }
}
