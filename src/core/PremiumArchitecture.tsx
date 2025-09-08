/**
 * 🏗️ PREMIUM ARCHITECTURE REGISTRY
 * Registre centralisé pour l'architecture premium
 */

export interface PremiumService {
  id: string;
  name: string;
  version: string;
  dependencies: string[];
  status: 'active' | 'inactive' | 'deprecated';
  config: Record<string, any>;
}

export interface PremiumComponent {
  id: string;
  name: string;
  category: 'ui' | 'business' | 'utility';
  lazy: boolean;
  preload: boolean;
}

class PremiumArchitectureRegistry {
  private services: Map<string, PremiumService> = new Map();
  private components: Map<string, PremiumComponent> = new Map();

  registerService(service: PremiumService) {
    this.services.set(service.id, service);
  }

  registerComponent(component: PremiumComponent) {
    this.components.set(component.id, component);
  }

  getService(id: string): PremiumService | undefined {
    return this.services.get(id);
  }

  getComponent(id: string): PremiumComponent | undefined {
    return this.components.get(id);
  }

  getAllServices(): PremiumService[] {
    return Array.from(this.services.values());
  }

  getAllComponents(): PremiumComponent[] {
    return Array.from(this.components.values());
  }

  getActiveServices(): PremiumService[] {
    return this.getAllServices().filter(s => s.status === 'active');
  }
}

export const premiumRegistry = new PremiumArchitectureRegistry();

// Initialize default services
premiumRegistry.registerService({
  id: 'emotion-analysis',
  name: 'Unified Emotion Analysis',
  version: '2.0.0',
  dependencies: ['hume-api', 'openai-api'],
  status: 'active',
  config: {
    apiVersion: 'v2',
    timeout: 10000
  }
});

premiumRegistry.registerService({
  id: 'music-therapy',
  name: 'Adaptive Music Therapy',
  version: '2.0.0',
  dependencies: ['suno-api', 'emotion-analysis'],
  status: 'active',
  config: {
    generationTimeout: 30000,
    maxRetries: 3
  }
});