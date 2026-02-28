"use strict";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Détecte les chiffres marketing non sourcés (ex: '25 000+', '94%', '+X utilisateurs')",
    },
    messages: {
      unsourcedStat:
        "Chiffre marketing non sourcé détecté ({{ value }}). Ajouter un commentaire `// SOURCE: ...` ou utiliser une formulation factuelle.",
    },
    schema: [],
  },

  create(context) {
    const PATTERNS = [
      // "25 000+", "25,000+", "12000+"
      /\d[\d\s,.]*\d\+/,
      // Percentages > 90% (marketing claims)
      /9[0-9]%|100%/,
      // "+X utilisateurs/soignants/patients"
      /\+\s*\d[\d\s,.]*\s*(utilisateurs|soignants|patients|clients|professionnels)/i,
    ];

    function checkValue(node, value) {
      if (typeof value !== "string") return;

      for (const pattern of PATTERNS) {
        const match = value.match(pattern);
        if (match) {
          // Check if there's a SOURCE comment nearby
          const sourceCode = context.getSourceCode();
          const comments = sourceCode.getCommentsBefore(node);
          const hasSource = comments.some((c) =>
            c.value.toUpperCase().includes("SOURCE:")
          );

          if (!hasSource) {
            context.report({
              node,
              messageId: "unsourcedStat",
              data: { value: match[0] },
            });
          }
          return; // One report per node
        }
      }
    }

    return {
      JSXText(node) {
        checkValue(node, node.value);
      },
      Literal(node) {
        checkValue(node, node.value);
      },
      TemplateLiteral(node) {
        node.quasis.forEach((quasi) => {
          checkValue(node, quasi.value.raw);
        });
      },
    };
  },
};
