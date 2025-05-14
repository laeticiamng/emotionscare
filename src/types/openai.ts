
export interface OpenAIHookResult {
  loading: boolean;
  error: string | null;
  analyze: (text: string) => Promise<any>;
  generateText: (prompt: string) => Promise<string>;
  summarize: (text: string) => Promise<string>;
  admin?: {
    analyzeGroupTrends: (data: any) => Promise<any>;
    generateReport: (data: any) => Promise<any>;
  };
  moderation?: {
    checkContent: (text: string) => Promise<{safe: boolean, issues: string[]}>;
    suggestImprovements: (text: string) => Promise<string>;
  };
}
