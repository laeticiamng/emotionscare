"use strict";

/**
 * Interdit tout import "next/*" (et "next"), pour tuer les régressions Next.
 */
module.exports = {
  meta: {
    type: "problem",
    docs: { description: "Ban all next/* imports" },
    messages: { banned: "Import from '{{name}}' is forbidden. Use RouterV2 only." }
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const s = node.source.value || "";
        if (s === "next" || s.startsWith("next/")) {
          context.report({ node, messageId: "banned", data: { name: s } });
        }
      },
      CallExpression(node) {
        // handle dynamic import('next/router')
        if (node.callee.type === "Import" && node.arguments?.[0]?.type === "Literal") {
          const s = node.arguments[0].value;
          if (typeof s === "string" && (s === "next" || s.startsWith("next/"))) {
            context.report({ node, messageId: "banned", data: { name: s } });
          }
        }
      }
    };
  }
};
