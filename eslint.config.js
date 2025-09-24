import { existsSync } from "node:fs";
import tsParser from "@typescript-eslint/parser";
import ec from "./tools/eslint-plugin-ec/index.js";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";

const createNoNodeImportsRule = ({ patterns = [], paths = [] } = {}) => [
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
      ...patterns.map((pattern) =>
        typeof pattern === "string" ? { group: [pattern] } : pattern
      ),
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
      ...paths,
    ]
  }
];

const routerImportRestrictions = [
  {
    name: "@/routerV2/router",
    importNames: ["routerV2"],
    message: "Importe `router` depuis '@/routerV2/router' plutôt que `routerV2`."
  },
  {
    name: "@/routerV2",
    importNames: ["routerV2"],
    message: "Importe `router` depuis '@/routerV2' plutôt que `routerV2`."
  },
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
      parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } }
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin,
      "react-hooks": reactHooksPlugin,
      ec,
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: ["tsconfig.json"].filter((configPath) => existsSync(configPath)),
          alwaysTryTypes: true,
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      "no-restricted-imports": createNoNodeImportsRule({
        paths: routerImportRestrictions,
      }),
      "ec/no-node-builtins-client": "error",
      "ec/no-hardcoded-paths": "error",
      "ec/no-hooks-in-blocks": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
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
      "ec/no-node-builtins-client": "off",
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
      "no-restricted-imports": createNoNodeImportsRule({
        patterns: ["../**/ui/*", "../../**/*"],
      }),
      // "ec/no-alias-routes": "warn",
    }
  }
];
