// Stub pour éviter les erreurs d'import dans AccessibilityAudit
export const useAccessibilityValidation = () => {
  return {
    issues: [] as unknown[],
    criticalCount: 0,
    warningCount: 0,
    infoCount: 0,
    report: {
      score: 100,
      compliance: {
        a: true,
        aa: true,
        aaa: false
      },
      issues: [] as unknown[],
      passedRules: [] as unknown[]
    },
    isValidating: false,
    validateAccessibility: async () => {}
  };
};
