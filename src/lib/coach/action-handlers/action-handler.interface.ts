
/**
 * Interface for all action handlers in the coach system
 */
export interface ActionHandler {
  /**
   * The type of action this handler can process
   */
  actionType: string;
  
  /**
   * Execute the action with the given user ID and payload
   */
  execute(userId: string, payload: any): Promise<void> | void;
}

