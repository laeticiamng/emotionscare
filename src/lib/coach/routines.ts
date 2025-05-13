
import { CoachAction } from './types';
import { executeAction } from './action-executor';

// Daily routines scheduler for coaching
export class RoutinesManager {
  private userId: string | null = null;
  private routines: Map<string, () => Promise<void>> = new Map();
  
  constructor(userId?: string) {
    this.userId = userId || null;
    this.setupDefaultRoutines();
  }
  
  setUserId(userId: string) {
    this.userId = userId;
  }
  
  private setupDefaultRoutines() {
    this.routines.set('daily-check-in', this.dailyCheckInRoutine.bind(this));
    this.routines.set('weekly-reflection', this.weeklyReflectionRoutine.bind(this));
  }
  
  async executeRoutine(routineId: string): Promise<boolean> {
    if (!this.userId) {
      console.error("No user ID set for routines");
      return false;
    }
    
    const routine = this.routines.get(routineId);
    
    if (!routine) {
      console.error(`Routine not found: ${routineId}`);
      return false;
    }
    
    try {
      await routine();
      return true;
    } catch (error) {
      console.error(`Error executing routine ${routineId}:`, error);
      return false;
    }
  }
  
  private async dailyCheckInRoutine(): Promise<void> {
    console.log("Executing daily check-in routine for user:", this.userId);
    
    const action: CoachAction = {
      type: 'reminder',
      payload: {
        message: "N'oubliez pas de faire votre scan émotionnel quotidien",
        importance: "medium"
      }
    };
    
    await executeAction(action, this.userId || undefined);
  }
  
  private async weeklyReflectionRoutine(): Promise<void> {
    console.log("Executing weekly reflection routine for user:", this.userId);
    
    const action: CoachAction = {
      type: 'generate_report',
      payload: {
        reportType: 'weekly_emotional_summary'
      }
    };
    
    await executeAction(action, this.userId || undefined);
  }
}

// Export a singleton instance
export const routinesManager = new RoutinesManager();
