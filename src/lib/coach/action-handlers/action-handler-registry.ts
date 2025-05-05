
import { ActionHandler } from './action-handler.interface';

/**
 * Registry for all action handlers in the coach system
 */
export class ActionHandlerRegistry {
  private handlers: Map<string, ActionHandler> = new Map();

  /**
   * Register a handler for a specific action type
   */
  register(handler: ActionHandler): void {
    this.handlers.set(handler.actionType, handler);
  }

  /**
   * Get a handler for a specific action type
   */
  getHandler(actionType: string): ActionHandler | undefined {
    return this.handlers.get(actionType);
  }

  /**
   * Check if a handler exists for a specific action type
   */
  hasHandler(actionType: string): boolean {
    return this.handlers.has(actionType);
  }

  /**
   * Get all registered handlers
   */
  getAllHandlers(): Map<string, ActionHandler> {
    return this.handlers;
  }
}

export const actionHandlerRegistry = new ActionHandlerRegistry();

