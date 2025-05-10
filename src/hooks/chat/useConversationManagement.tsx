
import { useState } from 'react';
// Fixed import statement
import chatHistoryService from '@/lib/chat/chatHistoryService';
import { v4 as uuidv4 } from 'uuid';

export const useConversationManagement = (userId: string) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const createConversation = async (title: string) => {
    setIsProcessing(true);
    try {
      const conversation = await chatHistoryService.createConversation(userId, title);
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const updateConversation = async (conversationId: string, updates: { title?: string; lastMessage?: string }) => {
    setIsProcessing(true);
    try {
      const updatedConversation = await chatHistoryService.updateConversation(conversationId, updates);
      return updatedConversation;
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    setIsProcessing(true);
    try {
      await chatHistoryService.deleteConversation(conversationId);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    createConversation,
    updateConversation,
    deleteConversation,
    isProcessing
  };
};

export default useConversationManagement;
