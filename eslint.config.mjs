import { defineConfig } from 'eslint-define-config';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import vuePlugin from 'eslint-plugin-vue';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  {
    files: ['*.js', '*.ts', '*.vue'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      globals: { process: 'readonly', chrome: 'readonly' },
    },
    ignores: ['/dist', '/node_modules', '.eslintrc.js', '/.cache/'],
    plugins: {
      vue: vuePlugin,
      storybook: storybookPlugin,
      '@typescript-eslint': typescriptPlugin,
    },
    settings: { 'import/resolver': { typescript: {} } },
    rules: {
      // "simple-import-sort/imports": [
      //   "error",
      //   {
      //     groups: [
      //       // Pierwsze pliki .vue
      //       ["^.*\\.vue$"],

      //       // Pusta linia (oddziela różne grupy)
      //       ["^"],

      //       // Następnie komponenty i inne zależności
      //       ["^@/components", "^@/.*"],

      //       // Ogólne importy (biblioteki itp.)
      //       ["^react", "^vue", "^@?\\w"],
      //     ],
      //   },
      // ],
      'prefer-promise-reject-errors': 'off',
      quotes: ['warn', 'single', { avoidEscape: true }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-unused-vars': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-console': 'off',
    },
  },
  prettierConfig,
]);
