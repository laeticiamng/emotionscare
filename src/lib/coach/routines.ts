
import { supabase } from '@/integrations/supabase/client';
import { CoachAction } from './types';

/**
 * Service for managing wellness routines
 */
export class RoutinesService {
  private userId: string | null = null;
  
  constructor(userId?: string) {
    this.userId = userId || null;
  }
  
  setUserId(userId: string) {
    this.userId = userId;
  }
  
  // Get routines recommended based on emotional state
  async getRecommendedRoutines(emotion: string): Promise<any[]> {
    if (!this.userId) {
      console.error("No user ID set for routines service");
      return [];
    }
    
    // In a real implementation, this would fetch appropriate routines
    const routines = [
      {
        id: "routine-1",
        title: "Méditation pleine conscience",
        description: "5 minutes de méditation guidée pour vous recentrer",
        duration: 300,
        type: "meditation",
        recommendedFor: ["anxious", "stressed"]
      },
      {
        id: "routine-2",
        title: "Exercice de respiration",
        description: "Respirez profondément pendant 2 minutes",
        duration: 120,
        type: "breathing",
        recommendedFor: ["anxious", "angry", "stressed"]
      },
      {
        id: "routine-3",
        title: "Visualisation positive",
        description: "Imaginez un lieu apaisant pour vous détendre",
        duration: 300,
        type: "visualization",
        recommendedFor: ["sad", "anxious", "stressed"]
      }
    ];
    
    // Filter by emotion
    return routines.filter(routine => 
      routine.recommendedFor.includes(emotion.toLowerCase())
    );
  }
  
  // Record completion of a routine
  async completeRoutine(routineId: string): Promise<boolean> {
    if (!this.userId) {
      console.error("No user ID set for routines service");
      return false;
    }
    
    // In a real implementation, this would save to Supabase
    console.log("Recording routine completion:", routineId, "for user:", this.userId);
    return true;
  }
}

const routinesService = new RoutinesService();
export default routinesService;
