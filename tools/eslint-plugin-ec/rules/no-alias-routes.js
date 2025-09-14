"use strict";

/**
 * Heuristique: interdit les littéraux de routes /app, /b2b, /entreprise, /social
 * dans le code applicatif (composants/pages) pour pousser l'usage de routes.*.
 * Autorise les fichiers de config/manifeste et tests.
 */
const PATH_ALLOW = /(ROUTES_MANIFEST\.json|routes(\.test)?\.|tests?|scripts|storybook|e2e|playwright)/i;

module.exports = {
  meta: {
    type: "suggestion",
    docs: { description: "Discourage route literals; use canonical routes module" },
    messages: {
      literal: "Avoid hard-coded route '{{val}}'. Use the canonical routes module (import { routes } from '@/routerV2/routes')."
    }
  },
  create(context) {
    const filename = context.getFilename();
    if (PATH_ALLOW.test(filename)) return {};

    return {
      Literal(node) {
        if (typeof node.value !== "string") return;
        const v = node.value;
        if (/^\/(app|b2b|entreprise|social|login|signup|settings|help|legal|system)\b/.test(v)) {
          context.report({ node, messageId: "literal", data: { val: v } });
        }
      },
      TemplateElement(node) {
        const v = node.value && node.value.cooked;
        if (!v || typeof v !== "string") return;
        if (/\/(app|b2b|entreprise|social|login|signup|settings|help|legal|system)\b/.test(v)) {
          context.report({ node, messageId: "literal", data: { val: v } });
        }
      }
    };
  }
};
