// @ts-nocheck

import { logger } from '@/lib/logger';
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
      logger.warn(`No handler registered for action type: ${actionType}`, {}, 'API');
      return false;
    }
    
    try {
      handler.execute(userId, payload);
      return true;
    } catch (error) {
      logger.error(`Error executing action ${actionType}`, error as Error, 'API');
      return false;
    }
  }
}

export const actionHandlerRegistry = new ActionHandlerRegistry();
