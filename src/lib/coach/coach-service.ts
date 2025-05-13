
// Re-export everything from the refactored coach module
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CoachAction, CoachEvent, EmotionalData, CoachNotification } from './types';

// Coach service client
export class CoachService {
  private userId: string | null = null;
  
  constructor(userId?: string) {
    this.userId = userId || null;
  }
  
  setUserId(userId: string) {
    this.userId = userId;
  }
  
  // Add an emotional data point to the user's history
  async addEmotionalData(data: EmotionalData): Promise<boolean> {
    if (!this.userId) {
      console.error("No user ID set for coach service");
      return false;
    }
    
    try {
      // In a real implementation, this would save to Supabase
      // For now, we'll log the action and simulate success
      console.log("Adding emotional data:", data, "for user:", this.userId);
      return true;
    } catch (error) {
      console.error("Error adding emotional data:", error);
      return false;
    }
  }
  
  // Get the user's recent emotional data
  async getRecentEmotionalData(limit = 10): Promise<EmotionalData[]> {
    if (!this.userId) {
      console.error("No user ID set for coach service");
      return [];
    }
    
    try {
      // In a real implementation, this would fetch from Supabase
      return [
        {
          emotion: "calm",
          intensity: 0.8,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          emotion: "happy",
          intensity: 0.7,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        }
      ];
    } catch (error) {
      console.error("Error fetching emotional data:", error);
      return [];
    }
  }
  
  // Register events that might trigger coach actions
  async registerEvent(event: CoachEvent): Promise<void> {
    if (!this.userId) {
      console.error("No user ID set for coach service");
      return;
    }
    
    try {
      console.log("Registering event:", event, "for user:", this.userId);
      // Process event and potentially trigger actions
    } catch (error) {
      console.error("Error registering event:", error);
    }
  }
  
  // Execute a coach action
  async executeAction(action: CoachAction): Promise<boolean> {
    if (!this.userId) {
      console.error("No user ID set for coach service");
      return false;
    }
    
    try {
      console.log("Executing action:", action, "for user:", this.userId);
      // Based on action type, delegate to specific handlers
      
      toast({
        title: "Action exécutée",
        description: `L'action de type ${action.type} a été exécutée avec succès.`,
      });
      
      return true;
    } catch (error) {
      console.error("Error executing action:", error);
      return false;
    }
  }
  
  // Get coaching recommendations based on emotional state
  async getCoachRecommendations(emotion: string, intensity: number): Promise<any[]> {
    try {
      // In a real implementation, this would use AI or a rule-based system
      console.log("Getting recommendations for emotion:", emotion, "with intensity:", intensity);
      
      // Mock recommendations
      return [
        {
          id: "rec-1",
          type: "music",
          title: "Écouter de la musique apaisante",
          description: "La musique peut aider à stabiliser et améliorer votre humeur.",
          actionType: "play_music",
          actionPayload: { emotion }
        },
        {
          id: "rec-2",
          type: "breathing",
          title: "Exercice de respiration",
          description: "Prenez quelques minutes pour vous recentrer avec cet exercice de respiration.",
          actionType: "start_breathing_exercise",
          actionPayload: { duration: 3 }
        }
      ];
    } catch (error) {
      console.error("Error getting coach recommendations:", error);
      return [];
    }
  }
}

// Create and export a singleton instance
const coachService = new CoachService();
export default coachService;

// Helper functions for simpler API access
export const addEmotionalDataPoint = async (
  emotion: string, 
  intensity: number, 
  userId?: string,
  context?: string
): Promise<boolean> => {
  if (userId) coachService.setUserId(userId);
  
  return await coachService.addEmotionalData({
    emotion,
    intensity,
    timestamp: new Date().toISOString(),
    context
  });
};

export const getCoachRecommendations = async (
  emotion: string,
  intensity: number,
  userId?: string
): Promise<any[]> => {
  if (userId) coachService.setUserId(userId);
  
  return await coachService.getCoachRecommendations(emotion, intensity);
};
