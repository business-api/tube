module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard-with-typescript', 'plugin:prettier/recommended'],
  overrides: [],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.app.json', './tsconfig.spec.json'],
  },
  plugins: [
    'prettier',
    'import',
    'jsdoc',
    'prefer-arrow',
    'simple-import-sort',
    'sort-class-members',
    'sort',
  ],
  rules: {
    'prettier/prettier': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'],
          ['^@?(?!medium-stories)\\w'],
          ['^@medium-stories?\\w'],
          ['^[^.]'],
          ['^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'no-use-before-define': ['error', { variables: false }],
    'import/first': ['error'],
    'import/newline-after-import': ['error'],
    'import/no-duplicates': ['error'],
    'sort-class-members/sort-class-members': [
      2,
      {
        order: [
          '[properties]',
          '[conventional-private-properties]',
          'constructor',
          '[methods]',
          '[conventional-private-methods]',
          '[static-properties]',
          '[static-methods]',
        ],
        accessorPairPositioning: 'getThenSet',
      },
    ],
    'sort/destructuring-properties': ['error'],
    'sort/exports': ['error'],
    'sort/export-members': ['error'],
    'sort/imports': ['off'],
    'sort/imports-members': ['off'],
    'sort/object-properties': ['error'],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
  },
};
