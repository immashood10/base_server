// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    ignores: [
      "**/*.js",
      "**/*.json",
      "**/*.md",
      "**/*.sh",
      "**/*.ps1",
      "**/*.log",
      "**/*.dockerignore",
      "**/*.env*",
      "**/.gitignore",
      "**/.husky/**",
      "**/.vscode/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
      "**/logs/**",
      "**/migrations/**",
      "**/cli/**",
      "**/scripts/**",
      "**/setup/**",
      "**/docs/**",
      "**/docker/**",
      "**/.prettierrc",
      "**/commitlint.config.js",
      "**/jest.config.js",
      "**/nodemon.json",
      "**/register-page-corrected.tsx",
      "**/tsconfig.tsbuildinfo",
      "eslint.config.mjs",
    ],
  },
  {
    files: ["src/**/*.ts"],
    ignores: ["**/__tests__/**/*.ts", "**/*.spec.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      eslintConfigPrettier,
    ],
    rules: {
      "no-console": "error",
      "no-useless-catch": 0,
      quotes: ["error", "single", { allowTemplateLiterals: true }],
    },
  }
);
