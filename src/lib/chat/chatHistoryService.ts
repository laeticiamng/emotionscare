
import { messagesService } from './services/messagesService';
import { conversationsService } from './services/conversationsService';

/**
 * Service for managing chat history
 * Re-exports functionality from individual service modules
 */
export const chatHistoryService = {
  // Conversations methods
  getConversations: conversationsService.getConversations,
  createConversation: conversationsService.createConversation,
  updateConversation: conversationsService.updateConversation,
  deleteConversation: conversationsService.deleteConversation,
  
  // Messages methods
  getMessages: messagesService.getMessages,
  saveMessages: messagesService.saveMessages
};
