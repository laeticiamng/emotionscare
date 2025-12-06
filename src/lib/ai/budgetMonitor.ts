
import { supabase } from '@/integrations/supabase/client';
import { BUDGET_THRESHOLDS, BUDGET_FALLBACKS } from './openai-config';

/**
 * Budget monitoring service for OpenAI API usage
 * 
 * Implements the budget guardrail from the specification:
 * if (getMonthlySpend("gpt-4.1-2025-04-14") > threshold) {
 *   // Switch to gpt-4o-mini-2024-07-18
 * }
 */
class BudgetMonitor {
  private cache: Map<string, number> = new Map();
  private lastUpdate: Date | null = null;
  private updateFrequency = 60 * 60 * 1000; // 1 hour
  private thresholds = BUDGET_THRESHOLDS;
  private fallbacks = BUDGET_FALLBACKS;
  
  /**
   * Get the current token usage for a specific model
   */
  async getMonthlySpend(model: string): Promise<number> {
    await this.refreshUsageDataIfNeeded();
    return this.cache.get(model) || 0;
  }
  
  /**
   * Check if any model has exceeded its budget threshold
   */
  async hasExceededBudget(model?: string): Promise<boolean> {
    await this.refreshUsageDataIfNeeded();
    
    if (model && this.thresholds[model]) {
      const usage = this.cache.get(model) || 0;
      return usage > this.thresholds[model];
    }
    
    // Check overall budget
    let totalUsage = 0;
    this.cache.forEach(usage => totalUsage += usage);
    return totalUsage > this.thresholds.default;
  }
  
  /**
   * Get the fallback model if budget is exceeded
   */
  getFallbackModel(model: string): string {
    return this.fallbacks[model] || this.fallbacks.default;
  }
  
  /**
   * Set custom thresholds for budget control
   */
  setThresholds(newThresholds: Record<string, number>) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }
  
  /**
   * Refresh usage data if it's stale
   */
  private async refreshUsageDataIfNeeded(): Promise<void> {
    const now = new Date();
    if (!this.lastUpdate || (now.getTime() - this.lastUpdate.getTime()) > this.updateFrequency) {
      await this.fetchUsageData();
      this.lastUpdate = now;
    }
  }
  
  /**
   * Fetch the actual usage data from OpenAI API via Supabase Edge Function
   */
  private async fetchUsageData(): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('monitor-api-usage', {
        body: {}
      });
      
      if (error || !data) {
        console.error('Error fetching API usage data:', error);
        return;
      }
      
      // Update the cache with new usage data
      if (data.usage) {
        Object.entries(data.usage).forEach(([model, cost]) => {
          this.cache.set(model, cost as number);
        });
      }
      
    } catch (error) {
      console.error('Failed to fetch API usage data:', error);
    }
  }
}

// Export a singleton instance
export const budgetMonitor = new BudgetMonitor();
