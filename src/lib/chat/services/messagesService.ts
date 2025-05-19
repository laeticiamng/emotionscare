
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';

// Mock API for message services
const messagesService = {
  async fetchMessages(conversationId: string): Promise<ChatMessage[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, this would fetch from a database
    return [
      {
        id: uuidv4(),
        conversationId: conversationId,
        conversation_id: conversationId, // For backward compatibility
        sender: 'system',
        content: 'Welcome to the chat!', // Add required content
        timestamp: new Date().toISOString(),
        role: 'system',
        text: 'Welcome to the chat!' // For backward compatibility
      },
      {
        id: uuidv4(),
        conversationId: conversationId,
        conversation_id: conversationId, // For backward compatibility
        sender: 'assistant',
        content: 'How can I help you today?', // Add required content
        timestamp: new Date(Date.now() - 60000).toISOString(),
        role: 'assistant',
        text: 'How can I help you today?' // For backward compatibility
      }
    ];
  },
  
  async sendMessage(message: Partial<ChatMessage>): Promise<ChatMessage> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would save to a database
    return {
      id: uuidv4(),
      conversationId: message.conversationId || '',
      conversation_id: message.conversationId || '',
      sender: message.sender || 'user',
      content: message.content || message.text || '', // Ensure content is set
      timestamp: new Date().toISOString(),
      role: message.role || message.sender || 'user',
      text: message.text || message.content || '' // For backward compatibility
    };
  },
  
  async deleteMessage(messageId: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, this would delete from a database
    return true;
  },
  
  async clearConversation(conversationId: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, this would delete messages from a database
    return true;
  }
};

export default messagesService;
