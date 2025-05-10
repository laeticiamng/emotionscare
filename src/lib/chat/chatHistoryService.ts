
import { ChatConversation, ChatMessage } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock database for conversations and messages
const conversations: ChatConversation[] = [];
const messages: ChatMessage[] = [];

// Generate some initial mock data
function initializeData() {
  if (conversations.length === 0) {
    for (let i = 0; i < 5; i++) {
      const id = uuidv4();
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - i);
      
      const conversation: ChatConversation = {
        id,
        user_id: 'user-1',
        title: `Conversation ${i + 1}`,
        created_at: createdAt.toISOString(),
        updated_at: createdAt.toISOString(),
        last_message: `Last message from conversation ${i + 1}`
      };
      
      conversations.push(conversation);
      
      // Add some messages for this conversation
      for (let j = 0; j < 3; j++) {
        const msgTime = new Date(createdAt);
        msgTime.setHours(msgTime.getHours() + j);
        
        messages.push({
          id: uuidv4(),
          conversation_id: id,
          sender: j % 2 === 0 ? 'user' : 'assistant',
          text: `Sample message ${j + 1} in conversation ${i + 1}`,
          timestamp: msgTime.toISOString()
        });
      }
    }
  }
}

// Get all conversations for a user
export async function getConversationsForUser(userId: string): Promise<ChatConversation[]> {
  initializeData();
  return conversations.filter(c => c.user_id === userId);
}

// Get a specific conversation by ID
export async function getConversationById(conversationId: string): Promise<ChatConversation | null> {
  initializeData();
  return conversations.find(c => c.id === conversationId) || null;
}

// Get all messages for a conversation
export async function getMessagesForConversation(conversationId: string): Promise<ChatMessage[]> {
  initializeData();
  return messages
    .filter(m => m.conversation_id === conversationId)
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateA - dateB;
    });
}

// Create a new conversation
export async function createConversation(userId: string, title: string): Promise<ChatConversation> {
  const newConversation: ChatConversation = {
    id: uuidv4(),
    user_id: userId,
    title,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_message: ''
  };
  
  conversations.push(newConversation);
  return newConversation;
}

// Update conversation properties
export async function updateConversation(
  conversationId: string, 
  updates: { title?: string; lastMessage?: string }
): Promise<ChatConversation | null> {
  const conversation = conversations.find(c => c.id === conversationId);
  if (!conversation) return null;
  
  if (updates.title) conversation.title = updates.title;
  if (updates.lastMessage) conversation.last_message = updates.lastMessage;
  conversation.updated_at = new Date().toISOString();
  
  return conversation;
}

// Delete a conversation
export async function deleteConversation(conversationId: string): Promise<boolean> {
  const index = conversations.findIndex(c => c.id === conversationId);
  if (index === -1) return false;
  
  conversations.splice(index, 1);
  
  // Delete all messages in this conversation
  const messagesToDelete = messages.filter(m => m.conversation_id === conversationId);
  messagesToDelete.forEach(m => {
    const msgIndex = messages.findIndex(msg => msg.id === m.id);
    if (msgIndex !== -1) {
      messages.splice(msgIndex, 1);
    }
  });
  
  return true;
}

// Add a message to a conversation
export async function addMessageToConversation(
  conversationId: string,
  messageData: Omit<ChatMessage, 'id'>
): Promise<ChatMessage> {
  // Create new message
  const newMessage: ChatMessage = {
    id: uuidv4(),
    ...messageData
  };
  
  messages.push(newMessage);
  
  // Update conversation last message and timestamp
  const conversation = conversations.find(c => c.id === conversationId);
  if (conversation) {
    conversation.updated_at = new Date().toISOString();
    conversation.last_message = messageData.text;
  }
  
  return newMessage;
}

// Clear all messages in a conversation
export async function clearConversationMessages(conversationId: string): Promise<boolean> {
  const messagesToRemove = messages.filter(m => m.conversation_id === conversationId);
  messagesToRemove.forEach(m => {
    const index = messages.findIndex(msg => msg.id === m.id);
    if (index !== -1) {
      messages.splice(index, 1);
    }
  });
  
  return true;
}

const chatHistoryService = {
  getConversationsForUser,
  getConversationById,
  getMessagesForConversation,
  createConversation,
  updateConversation,
  deleteConversation,
  addMessageToConversation,
  clearConversationMessages
};

export default chatHistoryService;
