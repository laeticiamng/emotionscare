
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import OpenAIClient from '../api/openAIClient';
import { ChatMessage } from '@/types';

export interface CoachMessage {
  id: string;
  conversation_id: string;
  sender: string;
  text: string;
  timestamp: string;
}

// Get all messages for a user's coach conversation
export async function getCoachMessages(userId: string): Promise<ChatMessage[]> {
  try {
    // For now, return mock messages
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        text: "Bonjour, je suis votre coach émotionnel. Comment puis-je vous aider aujourd'hui ?",
        sender: 'coach',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ];
    
    return mockMessages;
  } catch (error) {
    console.error('Error fetching coach messages:', error);
    return [];
  }
}

// Send a message to the coach and get a response
export async function sendCoachMessage(userId: string, messageText: string): Promise<string> {
  try {
    // Create conversation if it doesn't exist
    const conversationId = uuidv4();

    // Store user message
    const userMessageId = uuidv4();
    const timestamp = new Date().toISOString();
    
    // In a real implementation, we would store the message in the database
    console.log('Storing user message:', {
      id: userMessageId,
      conversation_id: conversationId,
      sender: 'user',
      text: messageText,
      timestamp
    });

    // Get coach response from OpenAI
    const response = await OpenAIClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an emotional coach helping users understand and process their emotions.' },
        { role: 'user', content: messageText }
      ]
    });

    const coachResponse = response.choices[0].message.content;
    const coachMessageId = uuidv4();

    // Store coach response
    console.log('Storing coach response:', {
      id: coachMessageId,
      conversation_id: conversationId,
      sender: 'coach',
      text: coachResponse,
      timestamp: new Date().toISOString()
    });

    return coachResponse;
  } catch (error) {
    console.error('Error sending coach message:', error);
    throw new Error('Failed to get response from coach');
  }
}

export type CoachEvent = {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
};
