import tsParser from "@typescript-eslint/parser";
import ec from "./tools/eslint-plugin-ec/index.js";

export default [
  {
    ignores: ["scripts/**", "src/scripts/**", "src/tests/**", "tests/**", "test/**", "database/**", "e2e/**"],
  },
  {
    files: ["src/routerV2/**/*.{ts,tsx,js,jsx}", "src/components/navigation/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" }
    },
    plugins: {
      ec
    },
    settings: {
      // no framework-specific settings required
    },
    rules: {
      "ec/no-next-imports": "error",
      "ec/no-legacy-routes-helpers": "error",
      "no-restricted-imports": ["error", { patterns: ["../**/ui/*", "../../**/*"] }],
      // "ec/no-alias-routes": "warn",
    }
  }
];
