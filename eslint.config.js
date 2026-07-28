import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(

  {
    ignores: ["dist/"]
  },

  js.configs.recommended,

  tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },

  {
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: globals.browser
    }
  },

  {
    files: ["test/**/*.ts", "*.config.ts"],
    languageOptions: {
      globals: globals.node
    }
  },

  {
    files: ["eslint.config.js"],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      globals: globals.node
    }
  }
);
