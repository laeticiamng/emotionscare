// Services API centralisés pour EmotionsCare

// Interface APIStatus pour les composants
export interface APIStatus {
  name: string;
  isAvailable: boolean;
  lastChecked: Date | null;
  responseTime?: number;
}

// Service API factice pour les tests
class ApiService {
  async checkAllAPIs(): Promise<Record<string, APIStatus>> {
    return {
      supabase: {
        name: "Supabase",
        isAvailable: true,
        lastChecked: new Date(),
        responseTime: 120
      },
      openai: {
        name: "OpenAI",
        isAvailable: true,
        lastChecked: new Date(),
        responseTime: 250
      }
    };
  }

  getAPIConfiguration(): Record<string, boolean> {
    return {
      "Supabase": true,
      "OpenAI": false,
      "Hume AI": false
    };
  }
}

// Export par défaut
const apiServices = new ApiService();
export default apiServices;

// Export des types
export { APIStatus };