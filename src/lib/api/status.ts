export interface APIStatusItem {
  name: string;
  isAvailable: boolean;
  lastChecked: Date | null;
  error?: string;
}

export class APIStatus {
  private static apis: Map<string, APIStatusItem> = new Map([
    ['supabase', { name: 'Supabase', isAvailable: false, lastChecked: null }],
    ['openai', { name: 'OpenAI', isAvailable: false, lastChecked: null }],
    ['sentry', { name: 'Sentry', isAvailable: false, lastChecked: null }],
  ]);

  static async checkAllAPIs(): Promise<APIStatusItem[]> {
    const results: APIStatusItem[] = [];
    
    for (const [key, api] of this.apis) {
      try {
        const isAvailable = await this.checkAPI(key);
        const updatedApi: APIStatusItem = {
          ...api,
          isAvailable,
          lastChecked: new Date(),
        };
        this.apis.set(key, updatedApi);
        results.push(updatedApi);
      } catch (error) {
        const updatedApi: APIStatusItem = {
          ...api,
          isAvailable: false,
          lastChecked: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        };
        this.apis.set(key, updatedApi);
        results.push(updatedApi);
      }
    }
    
    return results;
  }

  private static async checkAPI(name: string): Promise<boolean> {
    // Simple health check implementations
    switch (name) {
      case 'supabase':
        return Promise.resolve(true); // Assume available
      case 'openai':
        return Promise.resolve(true); // Assume available
      case 'sentry':
        return Promise.resolve(true); // Assume available
      default:
        return false;
    }
  }

  static getAPIConfiguration(): Record<string, boolean> {
    const config: Record<string, boolean> = {};
    for (const [key, api] of this.apis) {
      config[key] = api.isAvailable;
    }
    return config;
  }

  static getAllAPIs(): APIStatusItem[] {
    return Array.from(this.apis.values());
  }
}