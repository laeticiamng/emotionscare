"use strict";

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Interdire les hooks React dans des blocs conditionnels ou de gestion d'erreur",
      category: "Possible Errors",
      recommended: true,
    },
    schema: [],
    messages: {
      noHooksInBlocks: "Les hooks React ne peuvent pas être utilisés dans des blocs conditionnels (if, try, switch). Déplacez le hook au niveau racine du composant.",
    },
  },

  create(context) {
    const isHookCall = (node) => {
      return (
        node.type === "CallExpression" &&
        node.callee.type === "Identifier" &&
        node.callee.name.startsWith("use") &&
        node.callee.name.length > 3 &&
        node.callee.name[3] === node.callee.name[3].toUpperCase()
      );
    };

    const checkForHooksInBlocks = (node) => {
      if (isHookCall(node)) {
        // Vérifier si le hook est dans un bloc conditionnel
        let parent = node.parent;
        while (parent) {
          if (
            parent.type === "IfStatement" ||
            parent.type === "TryStatement" ||
            parent.type === "SwitchStatement" ||
            parent.type === "ConditionalExpression" ||
            parent.type === "LogicalExpression" ||
            parent.type === "ForStatement" ||
            parent.type === "WhileStatement" ||
            parent.type === "DoWhileStatement"
          ) {
            context.report({
              node,
              messageId: "noHooksInBlocks",
            });
            break;
          }
          parent = parent.parent;
        }
      }
    };

    return {
      CallExpression: checkForHooksInBlocks,
    };
  },
};