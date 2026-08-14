import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import cuebanks from "@cuebanks/eslint-config/base";
import convexPlugin from "@convex-dev/eslint-plugin";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  cuebanks,
  ...convexPlugin.configs.recommended,
  {
    // Project uses Id-typed db.get/patch/delete; explicit table names need
    // type-aware linting and a Convex API migration — keep other rules.
    rules: {
      "@convex-dev/explicit-table-ids": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "convex/_generated/**",
    ".cache/**",
  ]),
]);

export default eslintConfig;
