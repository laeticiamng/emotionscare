"use strict";

/**
 * Interdit "@/routerV2/helpers" au profit de "@/routerV2/routes".
 */
module.exports = {
  meta: {
    type: "problem",
    docs: { description: "Ban legacy helpers and enforce canonical routes module" },
    messages: {
      banned: "Import from '@/routerV2/helpers' is forbidden. Import from '@/routerV2/routes' instead."
    },
    fixable: "code"
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const s = node.source.value || "";
        if (s === "@/routerV2/helpers") {
          context.report({
            node,
            messageId: "banned",
            fix(fixer) {
              const range = [node.source.range[0] + 1, node.source.range[1] - 1];
              return fixer.replaceTextRange(range, "@/routerV2/routes");
            }
          });
        }
      }
    };
  }
};
