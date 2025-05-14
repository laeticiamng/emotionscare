
// OpenAI API client facade

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAICompletionOptions {
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

class OpenAIClient {
  private apiKey: string | null = null;
  private defaultOptions: Partial<OpenAICompletionOptions> = {
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 500,
    top_p: 1,
  };

  constructor(apiKey?: string) {
    if (apiKey) {
      this.apiKey = apiKey;
    }
  }

  async chatCompletion(
    messages: OpenAIMessage[],
    options?: Partial<OpenAICompletionOptions>
  ): Promise<string> {
    console.log('OpenAI Chat Completion', messages, options);
    
    if (!this.apiKey) {
      console.warn('OpenAI API key not set');
      return 'Mock response: OpenAI API key not configured';
    }
    
    // In development, we can return mock responses
    const lastUserMessage = [...messages].findLast(m => m.role === 'user')?.content || '';
    return `Mock response to: ${lastUserMessage.substring(0, 30)}...`;
  }

  async moderation(text: string): Promise<{ flagged: boolean; categories: Record<string, boolean> }> {
    console.log('OpenAI Moderation', text);
    
    // Mock implementation
    return {
      flagged: text.toLowerCase().includes('inappropriate'),
      categories: {
        harassment: false,
        'hate/threatening': false,
        'self-harm': false,
        sexual: false,
        'violence/graphic': false,
      }
    };
  }
}

// Create a singleton instance
const openAIClient = new OpenAIClient();

export default openAIClient;
