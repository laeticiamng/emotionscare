const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const HARD_CODED_PATH = /^\/(app|b2b)\//;

const registryPath = resolve(process.cwd(), 'src/routerV2/registry.ts');
let registrySource = '';
try {
  registrySource = readFileSync(registryPath, 'utf8');
} catch (error) {
  console.warn('[codemod] Impossible de lire src/routerV2/registry.ts:', error);
}

const ROUTE_NAME_BY_PATH = new Map();
if (registrySource) {
  const ROUTE_REGEX = /\{[\s\S]*?name:\s*'([^']+)'[\s\S]*?path:\s*'([^']+)'[\s\S]*?\}/g;
  let match;
  while ((match = ROUTE_REGEX.exec(registrySource))) {
    const [, name, path] = match;
    ROUTE_NAME_BY_PATH.set(path, name);
  }
}

const ensureRouteImport = (j, root) => {
  const importDeclarations = root.find(j.ImportDeclaration, {
    source: { value: '@/routes' },
  });

  if (importDeclarations.size() > 0) {
    importDeclarations.forEach(path => {
      const hasSpecifier = path.node.specifiers?.some(spec =>
        spec.type === 'ImportSpecifier' && spec.imported.name === 'route',
      );
      if (!hasSpecifier) {
        path.node.specifiers = [
          ...(path.node.specifiers || []),
          j.importSpecifier(j.identifier('route')),
        ];
      }
    });
    return;
  }

  const firstImport = root.find(j.ImportDeclaration).at(0);
  const newImport = j.importDeclaration(
    [j.importSpecifier(j.identifier('route'))],
    j.literal('@/routes'),
  );

  if (firstImport.size() > 0) {
    firstImport.insertBefore(newImport);
  } else {
    root.get().node.program.body.unshift(newImport);
  }
};

const shouldSkipFile = filePath => {
  if (!filePath) return false;
  if (filePath.includes('routerV2/routes.config')) return true;
  if (filePath.includes('routerV2/types')) return true;
  return false;
};

module.exports = function transformer(fileInfo, api) {
  if (shouldSkipFile(fileInfo.path)) {
    return fileInfo.source;
  }

  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let transformed = false;

  root
    .find(j.Literal)
    .filter(path => typeof path.node.value === 'string' && HARD_CODED_PATH.test(path.node.value))
    .forEach(path => {
      const literalValue = path.node.value;
      const parent = path.parent?.node;

      if (!parent) {
        return;
      }

      // Skip import/export declarations
      if (parent.type === 'ImportDeclaration' || parent.type === 'ExportNamedDeclaration' || parent.type === 'ExportAllDeclaration') {
        return;
      }

      const routeName = ROUTE_NAME_BY_PATH.get(literalValue);
      if (!routeName) {
        return;
      }

      const callExpression = j.callExpression(j.identifier('route'), [j.literal(routeName)]);

      if (parent.type === 'JSXAttribute') {
        parent.value = j.jsxExpressionContainer(callExpression);
        transformed = true;
        return;
      }

      if (parent.type === 'JSXExpressionContainer') {
        parent.expression = callExpression;
        transformed = true;
        return;
      }

      j(path).replaceWith(callExpression);
      transformed = true;
    });

  if (transformed) {
    ensureRouteImport(j, root);
    return root.toSource();
  }

  return fileInfo.source;
};
