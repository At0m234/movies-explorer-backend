module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'import',
  ],
  rules: {
    'no-underscore-dangle': [0, { allow: [] }],
  },
  settings: {
    'import/extensions': [
      '.js',
      '.jsx',
    ],
  },
};
