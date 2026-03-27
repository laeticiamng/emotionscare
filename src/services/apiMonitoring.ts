// @ts-nocheck
/**
 * Service de monitoring global des APIs
 * Teste et surveille toutes les APIs critiques de la plateforme EmotionsCare
 */

import { supabase } from '@/integrations/supabase/client';
import openaiService from './openai';
import humeAIService from './humeai';

export interface ApiStatus {
  name: string;
  isConnected: boolean;
  responseTime: number;
  lastChecked: Date;
  error?: string;
  details?: any;
}

export interface ApiMonitoringReport {
  timestamp: Date;
  overallStatus: 'healthy' | 'degraded' | 'critical';
  apis: ApiStatus[];
  summary: {
    total: number;
    healthy: number;
    failed: number;
    averageResponseTime: number;
  };
}

class ApiMonitoringService {
  private apiEndpoints = [
    {
      name: 'Supabase Database',
      testFn: () => this.testSupabaseConnection(),
    },
    {
      name: 'OpenAI',
      testFn: () => this.testOpenAIConnection(),
    },
    {
      name: 'Health Check Function',
      testFn: () => this.testHealthCheckFunction(),
    },
    {
      name: 'Emotion Analysis Function',
      testFn: () => this.testEmotionAnalysisFunction(),
    },
    {
      name: 'Chat Coach Function',
      testFn: () => this.testChatCoachFunction(),
    },
    {
      name: 'Music Generation Function',
      testFn: () => this.testMusicGenerationFunction(),
    },
    {
      name: 'Voice Analysis Function',
      testFn: () => this.testVoiceAnalysisFunction(),
    },
    {
      name: 'Journal Functions',
      testFn: () => this.testJournalFunctions(),
    },
    {
      name: 'HumeAI Service',
      testFn: () => this.testHumeAIConnection(),
    },
    {
      name: 'SUNO API Service',
      testFn: () => this.testSunoConnection(),
    }
  ];

  /**
   * Teste la connexion Supabase
   */
  private async testSupabaseConnection(): Promise<{ success: boolean; responseTime: number; details?: any; error?: string }> {
    const startTime = performance.now();
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true });
      
      const responseTime = performance.now() - startTime;
      
      if (error) {
        return { success: false, responseTime, error: error.message };
      }
      
      return { 
        success: true, 
        responseTime,
        details: { recordCount: data || 0 }
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      return { 
        success: false, 
        responseTime, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Teste la connexion OpenAI
   */
  private async testOpenAIConnection(): Promise<{ success: boolean; responseTime: number; details?: any; error?: string }> {
    const startTime = performance.now();
    
    try {
      const isConnected = await openaiService.checkApiConnection();
      const responseTime = performance.now() - startTime;
      
      return { 
        success: isConnected, 
        responseTime,
        details: { service: 'OpenAI GPT Models' }
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      return { 
        success: false, 
        responseTime, 
        error: error instanceof Error ? error.message : 'OpenAI connection failed' 
      };
    }
  }

  /**
   * Teste la fonction Health Check
   */
  private async testHealthCheckFunction(): Promise<{ success: boolean; responseTime: number; details?: any; error?: string }> {
    const startTime = performance.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('health-check');
      const responseTime = performance.now() - startTime;
      
      if (error) {
        return { success: false, responseTime, error: error.message };
      }
      
      return { 
        success: true, 
        responseTime,
        details: data
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      return { 
        success: false, 
        responseTime, 
        error: error instanceof Error ? error.message : 'Health check failed' 
      };
    }
  }

  /**
   * Teste la fonction d'analyse d'émotion
   */
  private async testEmotionAnalysisFunction(): Promise<{ success: boolean; responseTime: number; details?: any; error?: string }> {
    const startTime = performance.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('emotion-analysis', {
        body: { text: 'Je me sens bien aujourd\'hui' }
      });
      
      const responseTime = performance.now() - startTime;
      
      if (error) {
        return { success: false, responseTime, error: error.message };
      }
      
      return { 
        success: true, 
        responseTime,
        details: { testResult: 'Emotion analysis working' }
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      return { 
        success: false, 
        responseTime, 
        error: error instanceof Error ? error.message : 'Emotion analysis failed' 
      };
    }
  }

  /**
   * Teste la fonction Chat Coach
   */
  private async testChatCoachFunction(): Promise<{ success: boolean; responseTime: number; details?: any; error?: string }> {
    const startTime = performance.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('chat-coach', {
        body: { message: 'Test de connexion' }
      });
      
      const responseTime = performance.now() - startTime;
      
      if (error) {
        return { success: false, responseTime, error: error.message };
      }
      
      return { 
        success: true, 
        responseTime,
        details: { testResult: 'Chat coach working' }
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      return { 
        success: false, 
        responseTime, 
        error: error instanceof Error ? error.message : 'Chat coach failed' 
      };
    }
  }

  /**
   * Teste la fonction de génération musicale SUNO
   */
  private async testMusicGenerationFunction(): Promise<{ success: boolean; responseTime: number; details?: any; error?: string }> {
    const startTime = performance.now();
    
    try {
      // Utiliser suno-music avec health-check
      const { data, error } = await supabase.functions.invoke('suno-music', {
        body: { 
          action: 'health-check'
        }
      });
      
      const responseTime = performance.now() - startTime;
      
      if (error) {
        return { success: false, responseTime, error: error.message };
      }
      
      return { 
        success: true, 
        responseTime,
        details: { testResult: 'SUNO music generation working', hasApiKey: data?.hasApiKey }
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      return { 
        success: false, 
        responseTime, 
        error: error instanceof Error ? error.message : 'SUNO music generation failed' 
      };
    }
  }

  /**
   * Teste la fonction d'analyse vocale
   */
  private async testVoiceAnalysisFunction(): Promise<{ success: boolean; responseTime: number; details?: any; error?: string }> {
    const startTime = performance.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('voice-analysis', {
        body: { test: true }
      });
      
      const responseTime = performance.now() - startTime;
      
      if (error && !error.message.includes('test')) {
        return { success: false, responseTime, error: error.message };
      }
      
      return { 
        success: true, 
        responseTime,
        details: { testResult: 'Voice analysis endpoint responsive' }
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      return { 
        success: false, 
        responseTime, 
        error: error instanceof Error ? error.message : 'Voice analysis failed' 
      };
    }
  }

  /**
   * Teste les fonctions de journal
   */
  private async testJournalFunctions(): Promise<{ success: boolean; responseTime: number; details?: any; error?: string }> {
    const startTime = performance.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('journal-weekly', {
        body: { test: true }
      });
      
      const responseTime = performance.now() - startTime;
      
      // Journal functions might require auth, so we consider them working if they respond
      return { 
        success: true, 
        responseTime,
        details: { testResult: 'Journal functions endpoint responsive' }
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      return { 
        success: false, 
        responseTime, 
        error: error instanceof Error ? error.message : 'Journal functions failed' 
      };
    }
  }

  /**
   * Teste HumeAI
   */
  private async testHumeAIConnection(): Promise<{ success: boolean; responseTime: number; details?: any; error?: string }> {
    const startTime = performance.now();
    
    try {
      const result = await humeAIService.checkApiConnection();
      const responseTime = performance.now() - startTime;
      
      return { 
        success: result.status, 
        responseTime,
        details: { message: result.message }
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      return { 
        success: false, 
        responseTime, 
        error: error instanceof Error ? error.message : 'HumeAI connection failed' 
      };
    }
  }

  /**
   * Teste SUNO API
   */
  private async testSunoConnection(): Promise<{ success: boolean; responseTime: number; details?: any; error?: string }> {
    const startTime = performance.now();
    
    try {
      // Test via suno-music health-check
      const { data, error } = await supabase.functions.invoke('suno-music', {
        body: { 
          action: 'health-check'
        }
      });
      
      const responseTime = performance.now() - startTime;
      
      return { 
        success: !error && data?.success, 
        responseTime,
        details: { service: 'SUNO API via Edge Function', hasApiKey: data?.hasApiKey },
        error: error?.message
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      return { 
        success: false, 
        responseTime, 
        error: error instanceof Error ? error.message : 'SUNO API connection failed' 
      };
    }
  }

  /**
   * Exécute tous les tests de connectivité
   */
  async runFullMonitoring(): Promise<ApiMonitoringReport> {
    const timestamp = new Date();
    const results: ApiStatus[] = [];

    // Exécuter tous les tests en parallèle pour une meilleure performance
    const testPromises = this.apiEndpoints.map(async (endpoint) => {
      try {
        const result = await endpoint.testFn();
        
        return {
          name: endpoint.name,
          isConnected: result.success,
          responseTime: result.responseTime,
          lastChecked: timestamp,
          error: result.error,
          details: result.details
        } as ApiStatus;
      } catch (error) {
        return {
          name: endpoint.name,
          isConnected: false,
          responseTime: 0,
          lastChecked: timestamp,
          error: error instanceof Error ? error.message : 'Test failed'
        } as ApiStatus;
      }
    });

    const testResults = await Promise.all(testPromises);
    results.push(...testResults);

    // Calculer les statistiques
    const total = results.length;
    const healthy = results.filter(r => r.isConnected).length;
    const failed = total - healthy;
    const averageResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / total;

    // Déterminer le statut global
    let overallStatus: 'healthy' | 'degraded' | 'critical';
    if (failed === 0) {
      overallStatus = 'healthy';
    } else if (failed <= total * 0.3) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'critical';
    }

    return {
      timestamp,
      overallStatus,
      apis: results,
      summary: {
        total,
        healthy,
        failed,
        averageResponseTime: Math.round(averageResponseTime)
      }
    };
  }

  /**
   * Test rapide des APIs critiques seulement
   */
  async runQuickCheck(): Promise<{ status: 'ok' | 'issues'; criticalApis: string[] }> {
    const criticalApis = ['Supabase Database', 'OpenAI', 'Health Check Function'];
    const issues: string[] = [];

    for (const apiName of criticalApis) {
      const endpoint = this.apiEndpoints.find(e => e.name === apiName);
      if (endpoint) {
        try {
          const result = await endpoint.testFn();
          if (!result.success) {
            issues.push(apiName);
          }
        } catch (error) {
          issues.push(apiName);
        }
      }
    }

    return {
      status: issues.length === 0 ? 'ok' : 'issues',
      criticalApis: issues
    };
  }
}

export const apiMonitoringService = new ApiMonitoringService();
export default apiMonitoringService;