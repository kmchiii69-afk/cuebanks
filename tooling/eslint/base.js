import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

/** @type {import("typescript-eslint").Config} */
export default [
  { ignores: ["**/*.config.*", "dist/**", ".next/**", ".turbo/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
];
