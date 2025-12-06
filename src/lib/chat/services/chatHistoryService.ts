
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';
import { conversationsService } from './conversationsService';

class ChatHistoryService {
  private messages: Record<string, ChatMessage[]> = {};

  constructor() {
    // Initialise avec des messages vides pour chaque conversation
    this.initializeMessagesFromConversations();
  }

  private async initializeMessagesFromConversations() {
    try {
      const conversations = await conversationsService.getConversations();
      conversations.forEach(conversation => {
        this.messages[conversation.id] = conversation.messages || [];
      });
    } catch (err) {
      console.error('Error initializing messages from conversations:', err);
    }
  }

  public async getMessagesForConversation(conversationId: string): Promise<ChatMessage[]> {
    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    return this.messages[conversationId];
  }

  public async addMessageToConversation(
    conversationId: string, 
    messageData: Omit<ChatMessage, 'id'>
  ): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: uuidv4(),
      ...messageData,
      conversationId: conversationId
    };
    
    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    
    this.messages[conversationId].push(message);
    
    // Mettre à jour la conversation avec le dernier message
    if (message.sender === 'user' || message.sender === 'assistant') {
      conversationsService.updateLastMessage(conversationId, message.text);
    }
    
    return message;
  }

  public async deleteMessagesForConversation(conversationId: string): Promise<void> {
    delete this.messages[conversationId];
  }
}

export const chatHistoryService = new ChatHistoryService();

export default chatHistoryService;
