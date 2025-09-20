"use strict";

const path = require('node:path');

const HARD_CODED_REGEX = /^\/(app|b2b)\//;

const isCallExpression = node => node && node.type === 'CallExpression';
const isIdentifier = (node, name) => node && node.type === 'Identifier' && node.name === name;

const isRoutesHelperCall = node => {
  if (!isCallExpression(node)) {
    return false;
  }

  const callee = node.callee;

  if (isIdentifier(callee, 'route') || isIdentifier(callee, 'routeByPath')) {
    return true;
  }

  if (callee.type === 'MemberExpression') {
    const object = callee.object;
    if (object && object.type === 'Identifier' && object.name === 'routes') {
      return true;
    }
  }

  return false;
};

const isAllowedContext = node => {
  if (!node) {
    return false;
  }

  if (node.type === 'ImportDeclaration' || node.type === 'ExportNamedDeclaration' || node.type === 'ExportAllDeclaration') {
    return true;
  }

  if (node.type === 'TSLiteralType') {
    return true;
  }

  if (node.type === 'CallExpression') {
    return isRoutesHelperCall(node);
  }

  if (node.type === 'JSXAttribute' && node.name && node.name.name === 'data-testid') {
    return true;
  }

  if (node.type === 'TemplateLiteral') {
    return true;
  }

  return false;
};

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Interdit les chemins /app et /b2b codés en dur",
    },
    schema: [],
    messages: {
      hardcoded: 'Utilise les helpers de routing (route(), routes.*) au lieu de "{{path}}".',
    },
  },
  create(context) {
    const filename = context.getFilename();
    const normalized = filename.split(path.sep).join('/');
    const inLibScope = normalized.includes('/src/lib/');
    const skipFile =
      /routerV2\/(routes\.config|registry)\.ts$/.test(normalized) ||
      !inLibScope;

    return {
      Literal(node) {
        if (skipFile) {
          return;
        }

        if (typeof node.value !== 'string' || !HARD_CODED_REGEX.test(node.value)) {
          return;
        }

        const parent = node.parent;
        if (isAllowedContext(parent)) {
          return;
        }

        if (parent && parent.type === 'JSXExpressionContainer' && isAllowedContext(parent.parent)) {
          return;
        }

        context.report({ node, messageId: 'hardcoded', data: { path: node.value } });
      },
      TemplateElement(node) {
        if (skipFile) {
          return;
        }
        const raw = node.value && node.value.raw;
        if (typeof raw !== 'string' || !HARD_CODED_REGEX.test(raw)) {
          return;
        }

        context.report({ node, messageId: 'hardcoded', data: { path: raw } });
      },
    };
  },
};
