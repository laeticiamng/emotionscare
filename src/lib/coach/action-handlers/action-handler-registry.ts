
import { ActionHandler } from './action-handler.interface';

export class ActionHandlerRegistry {
  private handlers: ActionHandler[] = [];
  
  register(handler: ActionHandler): void {
    this.handlers.push(handler);
  }
  
  getHandler(actionType: string): ActionHandler | undefined {
    return this.handlers.find(handler => handler.actionType === actionType);
  }
  
  executeAction(actionType: string, userId: string, payload?: any): boolean {
    const handler = this.getHandler(actionType);
    
    if (!handler) {
      console.warn(`No handler registered for action type: ${actionType}`);
      return false;
    }
    
    try {
      handler.execute(userId, payload);
      return true;
    } catch (error) {
      console.error(`Error executing action ${actionType}:`, error);
      return false;
    }
  }
}

export const actionHandlerRegistry = new ActionHandlerRegistry();
