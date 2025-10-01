// @ts-nocheck
// Stub pour éviter les erreurs d'import dans AccessibilityAudit
export const useAccessibilityValidation = () => {
  return {
    issues: [] as any[],
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
      issues: [] as any[],
      passedRules: [] as any[]
    },
    isValidating: false,
    validateAccessibility: async () => {}
  };
};
