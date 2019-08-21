module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'plugins': [
    '@typescript-eslint',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'overrides': [
    {
      'files': ['*.js'],
      'rules': {
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ],
  'rules': {
    '@typescript-eslint/require-jsdoc': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 'args': 'none' }],
    '@typescript-eslint/semi': 'error',
  },
};
