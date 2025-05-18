
import { ChatMessage, ChatConversation } from '@/types/chat';

// Service de gestion de l'historique des conversations
export class ChatHistoryService {
  private conversations: ChatConversation[] = [];
  
  constructor() {
    this.loadFromLocalStorage();
  }
  
  // Charger les conversations depuis le localStorage
  private loadFromLocalStorage() {
    try {
      const storedConversations = localStorage.getItem('chat-conversations');
      if (storedConversations) {
        this.conversations = JSON.parse(storedConversations);
      }
    } catch (error) {
      console.error('Failed to load conversations from localStorage:', error);
    }
  }
  
  // Sauvegarder les conversations dans le localStorage
  private saveToLocalStorage() {
    try {
      localStorage.setItem('chat-conversations', JSON.stringify(this.conversations));
    } catch (error) {
      console.error('Failed to save conversations to localStorage:', error);
    }
  }
  
  // Créer une nouvelle conversation
  createConversation(title: string): ChatConversation {
    const newConversation: ChatConversation = {
      id: `conv-${Date.now()}`,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessage: ''
    };
    
    this.conversations.push(newConversation);
    this.saveToLocalStorage();
    
    return newConversation;
  }
  
  // Ajouter un message à une conversation
  addMessage(conversationId: string, message: Omit<ChatMessage, 'id' | 'conversationId'>): ChatMessage {
    const conversation = this.conversations.find(c => c.id === conversationId);
    
    if (!conversation) {
      throw new Error(`Conversation with id ${conversationId} not found`);
    }
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      sender: message.sender,
      text: message.text,
      timestamp: new Date().toISOString()
    };
    
    // Mise à jour de la conversation
    conversation.lastMessage = message.text;
    conversation.updatedAt = new Date().toISOString();
    
    this.saveToLocalStorage();
    
    return newMessage;
  }
  
  // Obtenir une conversation par son ID
  getConversation(conversationId: string): ChatConversation | undefined {
    return this.conversations.find(c => c.id === conversationId);
  }
  
  // Obtenir toutes les conversations
  getAllConversations(): ChatConversation[] {
    return [...this.conversations].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
  
  // Supprimer une conversation
  deleteConversation(conversationId: string): boolean {
    const initialLength = this.conversations.length;
    this.conversations = this.conversations.filter(c => c.id !== conversationId);
    
    if (this.conversations.length !== initialLength) {
      this.saveToLocalStorage();
      return true;
    }
    
    return false;
  }
  
  // Mettre à jour le titre d'une conversation
  updateConversationTitle(conversationId: string, newTitle: string): boolean {
    const conversation = this.conversations.find(c => c.id === conversationId);
    
    if (conversation) {
      conversation.title = newTitle;
      conversation.updatedAt = new Date().toISOString();
      this.saveToLocalStorage();
      return true;
    }
    
    return false;
  }
}

export default new ChatHistoryService();
