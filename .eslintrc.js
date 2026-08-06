module.exports = {
  extends: [
    'next',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['jsx-a11y', 'unused-imports', 'perfectionist'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
      },
    ],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'perfectionist/sort-imports': [
      'error',
      {
        type: 'alphabetical',
        order: 'asc',
        newlinesBetween: 'never',
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'object',
          'type',
        ],
        customGroups: {
          value: {
            internal: [
              '^@components',
              '^@hooks',
              '^@providers',
              '^@constants',
              '^@types',
              '^@utils',
              '^@pages',
            ],
          },
        },
      },
    ],
    'perfectionist/sort-named-imports': [
      'error',
      {
        type: 'alphabetical',
        order: 'asc',
      },
    ],
    'perfectionist/sort-jsx-props': [
      'error',
      {
        type: 'alphabetical',
        order: 'asc',
        customGroups: {
          key: 'key',
          callback: 'on*',
        },
        groups: ['key', 'unknown', 'callback'],
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
