import tsParser from "@typescript-eslint/parser";
import ec from "./tools/eslint-plugin-ec/index.js";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";
import reactHooksPlugin from "eslint-plugin-react-hooks";

const createNoNodeImportsRule = (extraPatterns = []) => [
  "error",
  {
    patterns: [
  {
        group: ["node:*"],
        message:
          "Interdit dans le bundle client. Utilise les APIs Web (crypto.subtle via '@/lib/hash', fetch, File API, etc.)."
      },
      {
        group: ["zustand/middleware/immer"],
        message: "Interdit: Zustand doit fonctionner sans immer."
      },
      {
        group: ["immer"],
        message:
          "Interdit côté client: utilisez des mises à jour immutables (spread)!"
      },
      ...extraPatterns.map((pattern) =>
        typeof pattern === "string" ? { group: [pattern] } : pattern
      )
    ],
    paths: [
      {
        name: "crypto",
        message: "Utilise Web Crypto via '@/lib/hash' (sha256Hex).",
      },
      {
        name: "node:crypto",
        message: "Utilise Web Crypto via '@/lib/hash' (sha256Hex).",
      },
    ]
  }
];

export default [
  {
    ignores: [
      "scripts/**",
      "src/scripts/**",
      "src/tests/**",
      "tests/**",
      "test/**",
      "database/**",
      "e2e/**",
      "src/services/b2b/reportsApi.ts",
      "src/services/clinicalScoringService.test.ts",
    ],
  },
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" }
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin,
      "react-hooks": reactHooksPlugin,
      ec
    },
    rules: {
      "no-restricted-imports": createNoNodeImportsRule(),
      "ec/no-hardcoded-paths": "error",
    }
  },
  {
    files: ["src/app/**/*.{ts,tsx,js,jsx}"],
    plugins: {
      ec,
    },
    rules: {
      "ec/no-clinical-score-terms": "error",
    }
  },
  {
    files: ["services/**/*.{ts,tsx,js,jsx,mjs,cjs}", "supabase/functions/**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    rules: {
      "no-restricted-imports": "off",
    }
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
      "no-restricted-imports": createNoNodeImportsRule(["../**/ui/*", "../../**/*"]),
      // "ec/no-alias-routes": "warn",
    }
  }
];
