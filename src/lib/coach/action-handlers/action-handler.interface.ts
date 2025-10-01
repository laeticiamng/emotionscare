// @ts-nocheck

export interface ActionHandler {
  actionType: string;
  execute(userId: string, payload?: any): void | Promise<void>;
}
