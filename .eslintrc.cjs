module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [],
  rules: {
    'prefer-const': 'error',
    'no-var': 'error'
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.ts', '*.html', '*.d.ts']
}