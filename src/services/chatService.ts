
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatResponse } from '@/types';

// Simulate a chat service with AI
export async function sendChatMessage(message: string): Promise<ChatResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Mock different responses based on message content
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    return {
      message: "Hello! How are you feeling today?",
      emotion: "neutral"
    };
  } else if (message.toLowerCase().includes('sad') || message.toLowerCase().includes('depress')) {
    return {
      message: "I'm sorry to hear that you're feeling down. Would you like to talk about what's bothering you?",
      emotion: "empathetic",
      follow_up_questions: [
        "What specifically is making you feel sad?",
        "Have you talked to anyone else about these feelings?",
        "Would you like some suggestions for activities that might help?"
      ],
      recommendations: [
        "Consider going for a short walk in nature",
        "Practice deep breathing for 5 minutes",
        "Listen to uplifting music"
      ]
    };
  } else if (message.toLowerCase().includes('happy') || message.toLowerCase().includes('joy')) {
    return {
      message: "That's wonderful to hear! It's great that you're feeling positive today.",
      emotion: "happy",
      follow_up_questions: [
        "What's contributing to your happiness today?",
        "How can you maintain this positive momentum?"
      ]
    };
  } else if (message.toLowerCase().includes('anxious') || message.toLowerCase().includes('stress')) {
    return {
      message: "I understand that anxiety can be challenging. Let's talk about ways to manage those feelings.",
      emotion: "calm",
      follow_up_questions: [
        "What tends to trigger your anxiety?",
        "What coping strategies have worked for you in the past?"
      ],
      recommendations: [
        "Try the 4-7-8 breathing technique",
        "Progressive muscle relaxation can help reduce physical tension",
        "Consider limiting caffeine and screen time before bed"
      ]
    };
  } else {
    // Default response
    return {
      message: "Thank you for sharing. How else can I support you today?",
      emotion: "neutral",
      follow_up_questions: [
        "Is there something specific you'd like to discuss?",
        "How are you feeling right now?"
      ]
    };
  }
}

// Save chat message to history
export async function saveChatMessage(conversationId: string, message: Omit<ChatMessage, 'id'>): Promise<ChatMessage> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock saving message and return with assigned ID
  const savedMessage: ChatMessage = {
    id: uuidv4(),
    ...message
  };
  
  return savedMessage;
}

export default {
  sendChatMessage,
  saveChatMessage
};
