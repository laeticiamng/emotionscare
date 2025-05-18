
import { ChatResponse } from "@/types/support";

export async function getSupportResponse(message: string): Promise<ChatResponse> {
  // Simulation d'une réponse d'API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: `resp-${Date.now()}`,
    content: `Merci pour votre message: "${message.substring(0, 30)}${message.length > 30 ? '...' : ''}". 
    Comment puis-je vous aider davantage?`,
    emotion: ["neutral", "curious", "helpful"][Math.floor(Math.random() * 3)]
  };
}
