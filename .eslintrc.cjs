module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier', 'plugin:svelte/recommended'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020
  },
  env: {
    browser: true,
    es2017: true,
    node: true
  }
};
