// @ts-nocheck
/**
 * Clinical Orchestration Service
 * Handles invisible clinical signals to adapt module behavior
 * NEVER displays scores or clinical data to users
 */

import { supabase } from '@/integrations/supabase/client';

export type ModuleContext = 
  | 'dashboard' | 'nyvee' | 'scan' | 'music' | 'coach' | 'journal' 
  | 'vr_breath' | 'vr_galaxy' | 'flash_glow' | 'breathwork' 
  | 'face_ar' | 'bubble_beat' | 'boss_grit' | 'mood_mixer'
  | 'community' | 'social_cocon' | 'auras' | 'ambition_arcade'
  | 'bounce_back' | 'story_synth' | 'activity' | 'screen_silk' | 'weekly_bars';

export type AdaptationSignal =
  | 'gentle_tone' | 'prefer_silence' | 'extend_sessions' | 'shorter_paths'
  | 'increase_warmth' | 'reduce_intensity' | 'favor_nature' | 'boost_social'
  | 'quiet_mode' | 'compassion_focus' | 'stability_first' | 'comfort_zone';

export interface ClinicalSignal {
  id: string;
  source_instrument: string;
  domain: string;
  level: number; // 0-4 severity
  module_context: string;
  metadata: any;
  expires_at: string;
  created_at: string;
}

export interface ModuleAdaptation {
  signalCount: number;
  adaptations: AdaptationSignal[];
  priority: 'low' | 'medium' | 'high';
  suggestedDuration?: number; // in minutes
  recommendedModules?: ModuleContext[];
}

class ClinicalOrchestrationService {
  private cache = new Map<string, ClinicalSignal[]>();
  private adaptationCache = new Map<string, ModuleAdaptation>();

  async getActiveSignals(moduleContext: ModuleContext): Promise<ClinicalSignal[]> {
    const cacheKey = `signals_${moduleContext}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const { data, error } = await supabase
        .from('clinical_signals')
        .select('*')
        .eq('module_context', moduleContext)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const signals = data || [];
      this.cache.set(cacheKey, signals);
      
      // Clear cache after 5 minutes
      setTimeout(() => {
        this.cache.delete(cacheKey);
      }, 5 * 60 * 1000);

      return signals;
    } catch (error) {
      // Silent: clinical signals fetch error logged internally
      return [];
    }
  }

  async getModuleAdaptation(moduleContext: ModuleContext): Promise<ModuleAdaptation> {
    const cacheKey = `adaptation_${moduleContext}`;
    
    if (this.adaptationCache.has(cacheKey)) {
      return this.adaptationCache.get(cacheKey)!;
    }

    const signals = await this.getActiveSignals(moduleContext);
    const adaptation = this.calculateAdaptation(signals, moduleContext);
    
    this.adaptationCache.set(cacheKey, adaptation);
    
    // Clear adaptation cache after 10 minutes
    setTimeout(() => {
      this.adaptationCache.delete(cacheKey);
    }, 10 * 60 * 1000);

    return adaptation;
  }

  private calculateAdaptation(signals: ClinicalSignal[], moduleContext: ModuleContext): ModuleAdaptation {
    if (signals.length === 0) {
      return {
        signalCount: 0,
        adaptations: [],
        priority: 'low'
      };
    }

    const adaptations: Set<AdaptationSignal> = new Set();
    let maxLevel = 0;
    let wellbeingSignals = 0;
    let anxietySignals = 0;
    let affectSignals = 0;

    signals.forEach(signal => {
      maxLevel = Math.max(maxLevel, signal.level);
      
      switch (signal.domain) {
        case 'wellbeing':
          wellbeingSignals++;
          if (signal.level <= 2) {
            adaptations.add('gentle_tone');
            adaptations.add('increase_warmth');
            adaptations.add('compassion_focus');
          }
          break;
          
        case 'anxiety':
          anxietySignals++;
          if (signal.level >= 3) {
            adaptations.add('prefer_silence');
            adaptations.add('reduce_intensity');
            adaptations.add('quiet_mode');
            adaptations.add('stability_first');
          }
          break;
          
        case 'affect':
          affectSignals++;
          if (signal.level <= 2) {
            adaptations.add('boost_social');
            adaptations.add('favor_nature');
          }
          break;
      }
    });

    // Module-specific adaptations
    switch (moduleContext) {
      case 'music':
        if (anxietySignals > 0) {
          adaptations.add('prefer_silence');
          adaptations.add('extend_sessions');
        }
        break;
        
      case 'vr_breath':
      case 'vr_galaxy':
        if (anxietySignals > 0) {
          adaptations.add('reduce_intensity');
          adaptations.add('shorter_paths');
        }
        break;
        
      case 'coach':
        if (wellbeingSignals > 0) {
          adaptations.add('compassion_focus');
          adaptations.add('gentle_tone');
        }
        break;
        
      case 'community':
      case 'social_cocon':
        if (affectSignals > 0) {
          adaptations.add('boost_social');
          adaptations.add('increase_warmth');
        }
        break;
    }

    const priority = maxLevel >= 3 ? 'high' : maxLevel >= 2 ? 'medium' : 'low';
    
    return {
      signalCount: signals.length,
      adaptations: Array.from(adaptations),
      priority,
      suggestedDuration: this.calculateOptimalDuration(adaptations, maxLevel),
      recommendedModules: this.getRecommendedModules(adaptations)
    };
  }

  private calculateOptimalDuration(adaptations: AdaptationSignal[], maxLevel: number): number {
    const baseMinutes = 5;
    
    if (adaptations.includes('extend_sessions')) return baseMinutes * 2;
    if (adaptations.includes('shorter_paths')) return Math.max(2, baseMinutes / 2);
    if (maxLevel >= 3) return baseMinutes / 2; // Shorter for high stress
    
    return baseMinutes;
  }

  private getRecommendedModules(adaptations: AdaptationSignal[]): ModuleContext[] {
    const recommendations: ModuleContext[] = [];
    
    if (adaptations.includes('prefer_silence')) {
      recommendations.push('breathwork', 'flash_glow');
    }
    
    if (adaptations.includes('boost_social')) {
      recommendations.push('community', 'social_cocon');
    }
    
    if (adaptations.includes('favor_nature')) {
      recommendations.push('scan', 'nyvee');
    }
    
    if (adaptations.includes('compassion_focus')) {
      recommendations.push('coach', 'journal');
    }
    
    return recommendations;
  }

  // Helper methods for specific modules
  async shouldUseSoftTone(moduleContext: ModuleContext): Promise<boolean> {
    const adaptation = await this.getModuleAdaptation(moduleContext);
    return adaptation.adaptations.includes('gentle_tone') || 
           adaptation.adaptations.includes('compassion_focus');
  }

  async shouldReduceIntensity(moduleContext: ModuleContext): Promise<boolean> {
    const adaptation = await this.getModuleAdaptation(moduleContext);
    return adaptation.adaptations.includes('reduce_intensity') ||
           adaptation.adaptations.includes('quiet_mode');
  }

  async shouldExtendSession(moduleContext: ModuleContext): Promise<boolean> {
    const adaptation = await this.getModuleAdaptation(moduleContext);
    return adaptation.adaptations.includes('extend_sessions');
  }

  async shouldBoostSocial(moduleContext: ModuleContext): Promise<boolean> {
    const adaptation = await this.getModuleAdaptation(moduleContext);
    return adaptation.adaptations.includes('boost_social');
  }

  async getOptimalSessionDuration(moduleContext: ModuleContext): Promise<number> {
    const adaptation = await this.getModuleAdaptation(moduleContext);
    return adaptation.suggestedDuration || 5;
  }

  async getRecommendedNextModules(currentModule: ModuleContext): Promise<ModuleContext[]> {
    const adaptation = await this.getModuleAdaptation(currentModule);
    return adaptation.recommendedModules || [];
  }

  clearCache() {
    this.cache.clear();
    this.adaptationCache.clear();
  }
}

export const clinicalOrchestration = new ClinicalOrchestrationService();