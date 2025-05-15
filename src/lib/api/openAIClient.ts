import '../polyfills';
import OpenAI from 'openai';
import { ChatMessage } from '@/types';
import '../utils/array-polyfills';  // Import the array polyfills

const apiKey = process.env.OPENAI_API_KEY || 'mock-api-key';

if (!apiKey) {
  console.warn('OPENAI_API_KEY is not set in environment variables.');
}

export const openAIClient = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

export const createAssistant = async (name: string, instructions: string, model: string = 'gpt-4'): Promise<OpenAI.Beta.Assistants.Assistant> => {
  try {
    const assistant = await openAIClient.beta.assistants.create({
      name: name,
      instructions: instructions,
      model: model,
      tools: [{ type: "code_interpreter" }]
    });
    return assistant;
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
};

export const getAssistant = async (assistantId: string): Promise<OpenAI.Beta.Assistants.Assistant | null> => {
  try {
    const assistant = await openAIClient.beta.assistants.retrieve(assistantId);
    return assistant;
  } catch (error: any) {
    console.error("Error retrieving assistant:", error);
    return null;
  }
};

export const updateAssistant = async (assistantId: string, name: string, instructions: string, model: string = 'gpt-4'): Promise<OpenAI.Beta.Assistants.Assistant | null> => {
  try {
    const assistant = await openAIClient.beta.assistants.update(assistantId, {
      name: name,
      instructions: instructions,
      model: model,
      tools: [{ type: "code_interpreter" }]
    });
    return assistant;
  } catch (error) {
    console.error("Error updating assistant:", error);
    return null;
  }
};

export const deleteAssistant = async (assistantId: string): Promise<boolean> => {
  try {
    await openAIClient.beta.assistants.del(assistantId);
    return true;
  } catch (error) {
    console.error("Error deleting assistant:", error);
    return false;
  }
};

export const createThread = async (): Promise<OpenAI.Beta.Threads.Thread> => {
  try {
    const thread = await openAIClient.beta.threads.create();
    return thread;
  } catch (error) {
    console.error("Error creating thread:", error);
    throw error;
  }
};

export const getThread = async (threadId: string): Promise<OpenAI.Beta.Threads.Thread | null> => {
  try {
    const thread = await openAIClient.beta.threads.retrieve(threadId);
    return thread;
  } catch (error) {
    console.error("Error retrieving thread:", error);
    return null;
  }
};

export const addMessageToThread = async (threadId: string, content: string, role: string = 'user'): Promise<OpenAI.Beta.Threads.Messages.ThreadMessage> => {
  try {
    const message = await openAIClient.beta.threads.messages.create(threadId, {
      role: role,
      content: content
    });
    return message;
  } catch (error) {
    console.error("Error adding message to thread:", error);
    throw error;
  }
};

export const getThreadMessages = async (threadId: string): Promise<OpenAI.Beta.Threads.Messages.ThreadMessage[]> => {
  try {
    const messages = await openAIClient.beta.threads.messages.list(threadId);
    return messages.data;
  } catch (error) {
    console.error("Error getting thread messages:", error);
    return [];
  }
};

export const runThread = async (threadId: string, assistantId: string, instructions?: string): Promise<OpenAI.Beta.Threads.Runs.Run> => {
  try {
    const run = await openAIClient.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      instructions: instructions,
      model: "gpt-4o"
    });
    return run;
  } catch (error) {
    console.error("Error running thread:", error);
    throw error;
  }
};

export const getRun = async (threadId: string, runId: string): Promise<OpenAI.Beta.Threads.Runs.Run | null> => {
  try {
    const run = await openAIClient.beta.threads.runs.retrieve(threadId, runId);
    return run;
  } catch (error) {
    console.error("Error getting run:", error);
    return null;
  }
};

export const getRunSteps = async (threadId: string, runId: string): Promise<OpenAI.Beta.Threads.Runs.RunStep[]> => {
  try {
    const steps = await openAIClient.beta.threads.runs.steps.list(threadId, runId);
    return steps.data;
  } catch (error) {
    console.error("Error getting run steps:", error);
    return [];
  }
};

export const generateChatResponse = async (
  messages: ChatMessage[],
  model: string = 'gpt-4',
  temperature: number = 0.7,
  max_tokens: number = 500,
  top_p: number = 1,
  frequency_penalty: number = 0,
  presence_penalty: number = 0,
  stream: boolean = false
): Promise<OpenAI.Chat.Completions.ChatCompletion | string | null> => {
  try {
    // Use the polyfill for findLast
    const lastUserMessage = messages.findLast(m => m.role === 'user');
    const systemPrompt = lastUserMessage
      ? `You are an AI assistant. The user's last message was: ${lastUserMessage.text || lastUserMessage.content}.`
      : 'You are an AI assistant.';

    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.text || m.content || '' }))
    ];

    const chatCompletion = await openAIClient.chat.completions.create({
      messages: chatMessages,
      model: model,
      temperature: temperature,
      max_tokens: max_tokens,
      top_p: top_p,
      frequency_penalty: frequency_penalty,
      presence_penalty: presence_penalty,
      stream: stream,
    });

    if (stream) {
      return chatCompletion as string;
    } else {
      return chatCompletion;
    }

  } catch (error) {
    console.error("Error generating chat response:", error);
    return null;
  }
};

export const generateText = async (prompt: string): Promise<string> => {
  try {
    const response = await openAIClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that provides concise responses.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw new Error('Failed to generate text with AI');
  }
};

export const analyzeEmotion = async (text: string): Promise<{ 
  emotion: string;
  intensity: number;
  analysis: string;
  suggestions: string[];
}> => {
  try {
    const response = await openAIClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an emotion analysis AI. Analyze the emotional content of the text and provide the primary emotion, intensity (1-10), brief analysis, and 2-3 suggestions.' 
        },
        { role: 'user', content: text }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const result = response.choices[0]?.message?.content || '';
    
    // Simulate parsed response
    return {
      emotion: 'calm', // Default values if parsing fails
      intensity: 5,
      analysis: result || 'Analysis not available',
      suggestions: ['Take deep breaths', 'Practice mindfulness']
    };
  } catch (error) {
    console.error('Error analyzing emotion with OpenAI:', error);
    throw new Error('Failed to analyze emotion with AI');
  }
};

export default openAIClient;
