
import { ChatMessage } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export interface CoachMessage {
  id: string;
  text: string;
  sender: 'user' | 'coach';
  timestamp: string;
}

// Get coach messages for a user
export async function getCoachMessages(userId: string): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: true });

    if (error) throw error;

    return data.map((message: any) => ({
      id: message.id,
      text: message.text,
      sender: message.sender,
      timestamp: message.timestamp,
    }));
  } catch (error) {
    console.error('Error fetching coach messages:', error);
    return [];
  }
}

// Send a message to the coach
export async function sendCoachMessage(userId: string, text: string): Promise<string> {
  try {
    // In a real implementation, this would send the message to an AI service
    // and get a response back
    
    // Store the user's message
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        text,
        sender: 'user',
      });

    if (error) throw error;

    // Generate a mock response
    const response = generateMockResponse(text);
    
    // Store the coach's response
    await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        text: response,
        sender: 'coach',
      });

    return response;
  } catch (error) {
    console.error('Error sending coach message:', error);
    throw error;
  }
}

// Generate a mock response for development
function generateMockResponse(userMessage: string): string {
  const responses = [
    "Je comprends ce que vous ressentez. Comment puis-je vous aider davantage ?",
    "C'est une observation intéressante. Pouvez-vous m'en dire plus ?",
    "Je vous remercie de partager cela avec moi. Continuez à explorer ces émotions.",
    "Cette expérience semble significative pour vous. Qu'est-ce qui vous a le plus marqué ?",
    "Je suis là pour vous accompagner dans ce processus.",
  ];
  
  // Check for keywords to customize response
  if (userMessage.toLowerCase().includes('stress') || userMessage.toLowerCase().includes('anxiété')) {
    return "Le stress et l'anxiété sont des expériences communes. Avez-vous essayé de pratiquer des exercices de respiration profonde ? Cela peut aider à calmer votre système nerveux.";
  }
  
  if (userMessage.toLowerCase().includes('triste') || userMessage.toLowerCase().includes('déprimé')) {
    return "Je suis désolé d'entendre que vous vous sentez ainsi. Ces émotions sont valides, et il est important de les reconnaître. Qu'est-ce qui vous apporte habituellement du réconfort ?";
  }
  
  // Return a random response for other messages
  return responses[Math.floor(Math.random() * responses.length)];
}
