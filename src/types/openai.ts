// @ts-nocheck

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIHookResult {
  messages: OpenAIMessage[];
  addMessage: (message: OpenAIMessage) => void;
  removeMessage: (index: number) => void;
  generateResponse: (systemPrompt?: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
  admin?: {
    createReport: (data: any) => Promise<any>;
    analyzeTeamHealth: (teamId: string) => Promise<any>;
    generateAnalytics?: (data: any) => Promise<any>;
  };
  moderation?: {
    checkContent: (content: string) => Promise<any>;
    flagContent: (contentId: string, reason: string) => Promise<void>;
  };
}
