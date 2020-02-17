module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
    'jest/globals': true
  },
  'extends': [
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'prettier/standard'
  ],
  'plugins': [
    '@typescript-eslint',
    'jest'
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
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'error'
  },
};
