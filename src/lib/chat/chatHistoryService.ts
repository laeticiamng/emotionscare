
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatConversation } from '@/types/chat';

const STORAGE_KEY = 'chat_history';

/**
 * Get all conversations from local storage
 */
export function getConversations(): ChatConversation[] {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return [];
    
    const conversations = JSON.parse(storedData);
    
    return Array.isArray(conversations) ? conversations : [];
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    return [];
  }
}

/**
 * Create a new conversation
 */
export function createConversation(title: string = 'New Conversation'): ChatConversation {
  const newId = uuidv4();
  const now = new Date().toISOString();
  
  const conversation: ChatConversation = {
    id: newId,
    title,
    createdAt: now,
    updatedAt: now,
    lastMessage: '',
    messages: [] // Include the required messages array
  };
  
  // Store in local storage
  const conversations = getConversations();
  conversations.push(conversation);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  
  return conversation;
}

/**
 * Get all messages for a specific conversation
 */
export function getMessages(conversationId: string): ChatMessage[] {
  const conversations = getConversations();
  const conversation = conversations.find(c => c.id === conversationId);
  
  return conversation?.messages || [];
}

/**
 * Add a new message to a conversation
 */
export function addMessage(conversationId: string, sender: 'user' | 'assistant' | 'system', text: string): ChatMessage {
  const message: ChatMessage = {
    id: uuidv4(),
    conversationId,
    sender,
    content: text, // Include the required content property
    timestamp: new Date().toISOString(),
    text // For backward compatibility
  };
  
  // Update storage
  const conversations = getConversations();
  const conversationIndex = conversations.findIndex(c => c.id === conversationId);
  
  if (conversationIndex !== -1) {
    const conversation = conversations[conversationIndex];
    if (!conversation.messages) conversation.messages = [];
    conversation.messages.push(message);
    conversation.updatedAt = message.timestamp;
    conversation.lastMessage = text;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }
  
  return message;
}

/**
 * Delete a conversation by ID
 */
export function deleteConversation(conversationId: string): boolean {
  let conversations = getConversations();
  const initialLength = conversations.length;
  
  conversations = conversations.filter(c => c.id !== conversationId);
  
  if (conversations.length !== initialLength) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    return true;
  }
  
  return false;
}
