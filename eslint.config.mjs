// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'eslint.config.mjs',
      '**/dist/**',
      'dist/**',
      'commitlint.config.js',
      'changelog.config.js',
      'node_modules/**',
      '**/node_modules/**',
      '*.log',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      'coverage/**',
      '**/coverage/**',
      '*.lcov',
      '.vscode/**',
      '.idea/**',
      '*.swp',
      '*.swo',
      '.DS_Store',
      'Thumbs.db',
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/jest.config.cjs',
      'scripts/*.js',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
);
