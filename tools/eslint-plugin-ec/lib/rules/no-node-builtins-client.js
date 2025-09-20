"use strict";

const NODE_PATTERNS = [
  "node:*",
  "fs",
  "path",
  "crypto",
  "child_process",
  "buffer",
  "stream",
  "zlib",
  "os",
];

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "No Node builtins in client code",
    },
  },
  create(ctx) {
    const filename = ctx.getFilename();
    const normalized = filename.replace(/\\/g, "/");
    const isTsFile = normalized.endsWith('.ts') || normalized.endsWith('.tsx');
    if (!isTsFile) {
      return {};
    }

    const isTestFile = /\.test\.|\.spec\./.test(normalized) || normalized.includes('/__tests__/');
    if (isTestFile) {
      return {};
    }

    const blocklist = [
      '/supabase/functions/',
      'supabase/functions/',
      '/scripts/',
      'scripts/',
      '/e2e/',
      'e2e/',
      '/tests/',
      'tests/',
    ];
    const isClient = !blocklist.some((pattern) => normalized.includes(pattern));

    if (!isClient) {
      return {};
    }

    const matchesPattern = (specifier, pattern) => {
      if (pattern.endsWith('*')) {
        const base = pattern.slice(0, -1);
        return specifier.startsWith(base);
      }
      return specifier === pattern || specifier.startsWith(`${pattern}/`);
    };

    return {
      ImportDeclaration(node) {
        const src = node.source.value;
        if (typeof src !== "string") {
          return;
        }
        if (NODE_PATTERNS.some((pattern) => matchesPattern(src, pattern))) {
          ctx.report({
            node,
            message: `Import Node interdit côté client: "${src}". Utilise Web Crypto / APIs web.`,
          });
        }
      },
      CallExpression(node) {
        if (
          node.callee.type === "Identifier" &&
          node.callee.name === "require" &&
          node.arguments.length === 1 &&
          node.arguments[0].type === "Literal" &&
          typeof node.arguments[0].value === "string"
        ) {
          const specifier = node.arguments[0].value;
          if (NODE_PATTERNS.some((pattern) => matchesPattern(specifier, pattern))) {
            ctx.report({
              node,
              message: `Import Node interdit côté client: "${specifier}". Utilise Web Crypto / APIs web.`,
            });
          }
        }
      },
    };
  },
};
