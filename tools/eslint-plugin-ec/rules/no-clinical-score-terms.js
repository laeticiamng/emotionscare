"use strict";

const CLINICAL_UI_PATH_REGEX = new RegExp(String.raw`[\\/]src[\\/]app[\\/]`);

const FORBIDDEN_PATTERNS = [
  { regex: /\bscores?\b/i, label: "score" },
  { regex: /\bpoints?\b/i, label: "points" },
  { regex: /%/, label: "%" },
  { regex: /\banxi[ée]t[ée]\b/i, label: "anxiété" },
  { regex: /\bburnout\b/i, label: "burnout" },
];

const NON_TEXTUAL_ATTRIBUTES = new Set([
  "class",
  "className",
  "style",
  "id",
  "variant",
  "size",
  "color",
  "to",
  "href",
  "src",
  "width",
  "height",
  "minWidth",
  "maxWidth",
  "data-testid",
  "data-test",
  "data-id",
  "data-track",
  "testid",
  "role",
  "tabIndex",
  "type",
  "as",
  "rel",
  "target",
]);

function getAttributeName(attribute) {
  if (!attribute || attribute.type !== "JSXAttribute") {
    return null;
  }

  const { name } = attribute;
  if (!name) {
    return null;
  }

  if (name.type === "JSXIdentifier") {
    return name.name;
  }

  if (name.type === "JSXNamespacedName") {
    const namespace = name.namespace?.name ?? "";
    const local = name.name?.name ?? "";
    return namespace && local ? `${namespace}:${local}` : namespace || local || null;
  }

  return null;
}

function findNearestJSXAttribute(node) {
  let current = node.parent;
  while (current) {
    if (current.type === "JSXAttribute") {
      return current;
    }
    if (current.type === "Program") {
      return null;
    }
    current = current.parent;
  }
  return null;
}

function isWithinJSX(node) {
  let current = node.parent;
  while (current) {
    if (
      current.type === "JSXElement" ||
      current.type === "JSXFragment" ||
      current.type === "JSXExpressionContainer"
    ) {
      return true;
    }
    if (current.type === "Program") {
      return false;
    }
    current = current.parent;
  }
  return false;
}

function isLikelyTextualAttribute(attribute) {
  const name = getAttributeName(attribute);
  if (!name) {
    return false;
  }

  if (NON_TEXTUAL_ATTRIBUTES.has(name)) {
    return false;
  }

  if (name.startsWith("data-")) {
    return false;
  }

  if (name.startsWith("aria-")) {
    return true;
  }

  const lower = name.toLowerCase();
  const textualHints = [
    "label",
    "title",
    "text",
    "message",
    "description",
    "content",
    "caption",
    "placeholder",
    "helper",
    "tooltip",
    "children",
    "heading",
    "summary",
    "subtitle",
  ];

  return textualHints.some((hint) => lower.includes(hint));
}

function reportIfForbidden(context, node, rawText) {
  if (!rawText || typeof rawText !== "string") {
    return;
  }

  const text = rawText.trim();
  if (!text) {
    return;
  }

  for (const { regex, label } of FORBIDDEN_PATTERNS) {
    if (regex.test(text)) {
      context.report({
        node,
        messageId: "forbiddenTerm",
        data: {
          term: label,
        },
      });
      break;
    }
  }
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Empêche l'affichage de termes ou symboles de score dans l'interface clinique (src/app).",
      recommended: false,
    },
    schema: [],
    messages: {
      forbiddenTerm:
        "Terme clinique sensible \"{{term}}\" détecté dans l'interface. Supprime ou anonymise ce contenu.",
    },
  },
  create(context) {
    const filename = context.getFilename();
    if (!CLINICAL_UI_PATH_REGEX.test(filename)) {
      return {};
    }

    return {
      JSXText(node) {
        reportIfForbidden(context, node, node.value);
      },
      Literal(node) {
        if (typeof node.value !== "string") {
          return;
        }

        const attribute = findNearestJSXAttribute(node);
        if (attribute) {
          if (!isLikelyTextualAttribute(attribute)) {
            return;
          }
          reportIfForbidden(context, node, node.value);
          return;
        }

        if (!isWithinJSX(node)) {
          return;
        }

        reportIfForbidden(context, node, node.value);
      },
      TemplateLiteral(node) {
        const attribute = findNearestJSXAttribute(node);
        if (attribute && !isLikelyTextualAttribute(attribute)) {
          return;
        }

        if (!attribute && !isWithinJSX(node)) {
          return;
        }

        const text = node.quasis
          .map((quasi) =>
            typeof quasi.value.cooked === "string"
              ? quasi.value.cooked
              : typeof quasi.value.raw === "string"
              ? quasi.value.raw
              : ""
          )
          .join("");

        reportIfForbidden(context, node, text);
      },
    };
  },
};
