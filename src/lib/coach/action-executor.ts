
import { CoachAction, CoachEvent } from './types';

// Interface for action handlers
interface ActionHandler {
  canHandle(action: CoachAction): boolean;
  execute(action: CoachAction, userId?: string): Promise<boolean>;
}

// Registry of action handlers
class ActionHandlerRegistry {
  private handlers: ActionHandler[] = [];
  
  register(handler: ActionHandler) {
    this.handlers.push(handler);
  }
  
  async executeAction(action: CoachAction, userId?: string): Promise<boolean> {
    for (const handler of this.handlers) {
      if (handler.canHandle(action)) {
        return await handler.execute(action, userId);
      }
    }
    
    console.warn(`No handler found for action: ${action.type}`);
    return false;
  }
}

// Example handlers
class MusicActionHandler implements ActionHandler {
  canHandle(action: CoachAction): boolean {
    return action.type === 'play_music';
  }
  
  async execute(action: CoachAction, userId?: string): Promise<boolean> {
    console.log("Playing music for", userId);
    // In a real app, this would interact with the music service
    return true;
  }
}

class BreathingActionHandler implements ActionHandler {
  canHandle(action: CoachAction): boolean {
    return action.type === 'start_breathing_exercise';
  }
  
  async execute(action: CoachAction, userId?: string): Promise<boolean> {
    console.log("Starting breathing exercise for", userId);
    return true;
  }
}

// Create and configure the registry
const registry = new ActionHandlerRegistry();
registry.register(new MusicActionHandler());
registry.register(new BreathingActionHandler());

// Export executor function
export const executeAction = async (action: CoachAction, userId?: string): Promise<boolean> => {
  return registry.executeAction(action, userId);
};
