const { existsSync } = require("node:fs");

const options = {
  doNotFollow: {
    dependencyTypes: ["npm", "npm-dev", "npm-optional", "npm-peer", "npm-bundled", "npm-no-pkg"],
  },
};
if (existsSync("./tsconfig.json")) {
  options.tsConfig = { fileName: "./tsconfig.json" };
}
if (existsSync("./.dependency-cruiser-known-violations.json")) {
  options.knownViolations = require("./.dependency-cruiser-known-violations.json");
}

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "Interdit: pas de cycles d'import.",
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: "no-orphan",
      severity: "error",
      comment: "Chaque module doit être relié au graphe d'import.",
      from: {
        orphan: true,
        pathNot: [
          "^src/main\\.(t|j)sx?$",
          "^src/index\\.(t|j)sx?$",
          "^src/vite-env\\.d\\.ts$",
        ],
      },
      to: {},
    },
  ],
  options,
};
