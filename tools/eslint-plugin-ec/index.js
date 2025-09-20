"use strict";

module.exports = {
  rules: {
    "no-next-imports": require("./rules/no-next-imports"),
    "no-legacy-routes-helpers": require("./rules/no-legacy-routes-helpers"),
    // optionnel, voir plus bas
    "no-alias-routes": require("./rules/no-alias-routes"),
    "no-clinical-score-terms": require("./rules/no-clinical-score-terms"),
    "no-hardcoded-paths": require("./rules/no-hardcoded-paths"),
    "no-node-builtins-client": require("./lib/rules/no-node-builtins-client"),
  }
};
