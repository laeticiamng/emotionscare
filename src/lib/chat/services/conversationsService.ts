// @ts-nocheck
import { v4 as uuidv4 } from 'uuid';
import { ChatConversation } from '@/types/chat';

class ConversationsService {
  private conversations: ChatConversation[] = [];

  constructor() {
    this.initializeConversations();
  }

  private initializeConversations() {
    // Pour la démonstration, créez une conversation par défaut
    this.conversations = [
      {
        id: uuidv4(),
        title: 'Première conversation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastMessage: 'Bienvenue sur EmotionsCare!',
        created_at: new Date().toISOString(), // Pour compatibilité
        updated_at: new Date().toISOString(), // Pour compatibilité
        last_message: 'Bienvenue sur EmotionsCare!', // Pour compatibilité
        user_id: 'default-user', // Pour compatibilité
        messages: [] // Pour compatibilité
      }
    ];
  }

  public async getConversations(): Promise<ChatConversation[]> {
    return this.conversations;
  }

  public async getConversation(id: string): Promise<ChatConversation | undefined> {
    return this.conversations.find(conv => conv.id === id);
  }

  public async createConversation(title: string): Promise<ChatConversation> {
    const now = new Date().toISOString();
    const newConversation: ChatConversation = {
      id: uuidv4(),
      title,
      createdAt: now,
      updatedAt: now,
      lastMessage: '',
      created_at: now, // Pour compatibilité
      updated_at: now, // Pour compatibilité
      last_message: '', // Pour compatibilité
      user_id: 'default-user', // Pour compatibilité
      messages: [] // Pour compatibilité
    };
    
    this.conversations.push(newConversation);
    return newConversation;
  }

  public async updateLastMessage(id: string, message: string): Promise<void> {
    const conversation = this.conversations.find(conv => conv.id === id);
    if (conversation) {
      const now = new Date().toISOString();
      conversation.lastMessage = message;
      conversation.last_message = message; // Pour compatibilité
      conversation.updatedAt = now;
      conversation.updated_at = now; // Pour compatibilité
    }
  }

  public async deleteConversation(id: string): Promise<void> {
    this.conversations = this.conversations.filter(conv => conv.id !== id);
  }
}

export const conversationsService = new ConversationsService();
export default conversationsService;
