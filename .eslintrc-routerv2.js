/**
 * ESLint Rule personnalisée - No Raw Routes
 * TICKET: FE/BE-Router-Cleanup-01
 * 
 * Interdit les liens en dur dans le code et force l'usage de Routes.*()
 */

module.exports = {
  rules: {
    'no-raw-routes': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Interdit les liens en dur, utiliser Routes.*() à la place',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: 'code',
        schema: [],
      },
      create(context) {
        return {
          // Vérifier les attributs JSX to="..."
          JSXAttribute(node) {
            if (node.name.name === 'to' && node.value?.type === 'Literal') {
              const value = node.value.value;
              
              if (typeof value === 'string' && value.startsWith('/')) {
                // Exceptions autorisées
                const allowedPaths = [
                  '/', // Racine OK en contexte marketing
                ];
                
                if (!allowedPaths.includes(value)) {
                  context.report({
                    node: node.value,
                    message: `Utiliser Routes.*() au lieu du chemin en dur "${value}"`,
                    fix(fixer) {
                      // Tentative de correction automatique basique
                      const routeFunction = getRouteFunctionFor(value);
                      if (routeFunction) {
                        return fixer.replaceText(
                          node.value, 
                          `{Routes.${routeFunction}()}`
                        );
                      }
                      return null;
                    },
                  });
                }
              }
            }
          },

          // Vérifier les appels navigate('...')
          CallExpression(node) {
            if (
              node.callee.type === 'Identifier' &&
              node.callee.name === 'navigate' &&
              node.arguments.length > 0 &&
              node.arguments[0].type === 'Literal'
            ) {
              const value = node.arguments[0].value;
              
              if (typeof value === 'string' && value.startsWith('/')) {
                context.report({
                  node: node.arguments[0],
                  message: `Utiliser Routes.*() dans navigate() au lieu du chemin en dur "${value}"`,
                  fix(fixer) {
                    const routeFunction = getRouteFunctionFor(value);
                    if (routeFunction) {
                      return fixer.replaceText(
                        node.arguments[0],
                        `Routes.${routeFunction}()`
                      );
                    }
                    return null;
                  },
                });
              }
            }
          },

          // Vérifier les template literals avec des chemins
          TemplateLiteral(node) {
            if (node.parent?.type === 'JSXExpressionContainer') {
              const source = context.getSourceCode().getText(node);
              
              if (/^\`\/[^${}]*\`$/.test(source)) {
                const path = source.slice(1, -1); // Enlever les backticks
                
                context.report({
                  node,
                  message: `Utiliser Routes.*() au lieu du template literal "${path}"`,
                });
              }
            }
          },
        };
      },
    },
  },
};

// Helper pour mapper les chemins vers les fonctions Routes.*()
function getRouteFunctionFor(path) {
  const mapping = {
    '/login': 'login',
    '/signup': 'signup',
    '/b2c': 'b2cLanding',
    '/entreprise': 'b2bLanding',
    '/about': 'about',
    '/contact': 'contact',
    '/help': 'help',
    '/app': 'app',
    '/app/home': 'consumerHome',
    '/app/collab': 'employeeHome',
    '/app/rh': 'managerHome',
    '/app/scan': 'scan',
    '/app/music': 'music',
    '/app/coach': 'coach',
    '/app/journal': 'journal',
    '/app/vr': 'vr',
    '/settings/general': 'settingsGeneral',
    '/settings/profile': 'settingsProfile',
    
    // Chemins obsolètes vers leurs équivalents canoniques
    '/b2c/login': 'login',
    '/b2c/dashboard': 'consumerHome',
    '/dashboard': 'consumerHome',
    '/music': 'music',
    '/journal': 'journal',
    '/scan': 'scan',
    '/coach': 'coach',
    '/vr': 'vr',
    '/settings': 'settingsGeneral',
    '/preferences': 'settingsGeneral',
  };

  return mapping[path] || null;
}