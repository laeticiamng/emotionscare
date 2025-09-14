export default [
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      // Interdire les accès directs à .add sans vérification
      "no-restricted-syntax": [
        "error",
        {
          "selector": "MemberExpression[property.name='add'][computed=false]",
          "message": "Utiliser safeAdd, safeClassAdd ou safeAddToCollection au lieu d'accès direct à .add pour éviter les erreurs 'Cannot read properties of undefined'"
        },
        {
          "selector": "CallExpression[callee.type='MemberExpression'][callee.property.name='add'][callee.computed=false]",
          "message": "Utiliser les helpers sécurisés (safeAdd, safeClassAdd, etc.) au lieu d'appels directs à .add()"
        }
      ],
      
      // Interdire l'utilisation de classList sans vérification
      "no-restricted-properties": [
        "error",
        {
          "object": "classList",
          "property": "add",
          "message": "Utiliser safeClassAdd au lieu de classList.add direct"
        },
        {
          "object": "classList", 
          "property": "remove",
          "message": "Utiliser safeClassRemove au lieu de classList.remove direct"
        },
        {
          "object": "classList",
          "property": "toggle", 
          "message": "Utiliser safeClassToggle au lieu de classList.toggle direct"
        }
      ],
      
      // Exiger des vérifications null/undefined
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      
      // Interdire certains patterns dangereux
      "no-implicit-coercion": "error",
      "no-unsafe-optional-chaining": "error",
    }
  },
  {
    // Exceptions pour les fichiers de test et helpers
    files: ["src/lib/safe-helpers.ts", "src/**/*.test.{ts,tsx}", "src/**/*.spec.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": "off",
      "no-restricted-properties": "off"
    }
  }
];