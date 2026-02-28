"use strict";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Interdit dangerouslySetInnerHTML brut — utiliser <SafeHtml> ou DOMPurify.sanitize()",
    },
    messages: {
      noRawInnerHTML:
        "Usage direct de dangerouslySetInnerHTML interdit. Utilise le composant <SafeHtml> ou encapsule avec DOMPurify.sanitize().",
    },
    schema: [],
  },

  create(context) {
    const WHITELISTED_FILES = ["SafeHtml.tsx", "ChartStyle.tsx"];

    return {
      JSXAttribute(node) {
        if (
          node.name.type !== "JSXIdentifier" ||
          node.name.name !== "dangerouslySetInnerHTML"
        ) {
          return;
        }

        // Whitelist specific wrapper files
        const filename = context.getFilename();
        if (WHITELISTED_FILES.some((f) => filename.endsWith(f))) {
          return;
        }

        // Check if the value expression contains DOMPurify.sanitize
        const sourceCode = context.getSourceCode();
        const rawText = sourceCode.getText(node.value);
        if (
          rawText.includes("DOMPurify.sanitize") ||
          rawText.includes("sanitize(")
        ) {
          return;
        }

        context.report({ node, messageId: "noRawInnerHTML" });
      },
    };
  },
};
