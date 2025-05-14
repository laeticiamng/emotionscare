
// Mock OpenAI client for development
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface OpenAIResponse {
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
}

// Mock function that simulates calling the OpenAI API
export async function callOpenAI(request: OpenAIRequest): Promise<string> {
  console.log('Mock OpenAI API call:', request);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate responses based on the last user message
  const lastUserMessage = request.messages
    .filter(m => m.role === 'user')
    .pop()?.content || '';
  
  if (lastUserMessage.toLowerCase().includes('anxiété') || lastUserMessage.toLowerCase().includes('stress')) {
    return "L'anxiété est une réponse naturelle au stress. Je vous recommande des exercices de respiration et de pleine conscience pour vous aider à gérer ces moments difficiles.";
  }
  
  if (lastUserMessage.toLowerCase().includes('triste') || lastUserMessage.toLowerCase().includes('déprimé')) {
    return "La tristesse est une émotion importante qui nous aide à traiter les expériences difficiles. Accordez-vous du temps pour ressentir cette émotion, tout en veillant à pratiquer des activités qui vous apportent un sentiment de bien-être.";
  }
  
  if (lastUserMessage.toLowerCase().includes('heureux') || lastUserMessage.toLowerCase().includes('content')) {
    return "C'est merveilleux d'entendre que vous vous sentez bien ! Savourez ces moments positifs et réfléchissez à ce qui contribue à ce bonheur dans votre vie.";
  }
  
  // Default response
  return "Merci de partager cela avec moi. Les émotions sont des guides précieux pour comprendre nos besoins et nos valeurs. Comment puis-je vous aider à approfondir cette réflexion ?";
}

// Export a mock client
const OpenAIClient = {
  chat: {
    completions: {
      create: async (request: OpenAIRequest): Promise<OpenAIResponse> => {
        const content = await callOpenAI(request);
        
        return {
          choices: [
            {
              message: {
                role: 'assistant',
                content
              }
            }
          ]
        };
      }
    }
  }
};

export default OpenAIClient;
