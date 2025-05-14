import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}

export const openai = new OpenAI({ apiKey });

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateStory(topic: string): Promise<string> {
  try {
    const prompt = `Write a short story about ${topic}. The story should be engaging and have a clear beginning, middle, and end.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error("No choices returned from OpenAI API");
    }

    return response.choices[0].message?.content || "No story generated.";
  } catch (error) {
    console.error("Error generating story:", error);
    return "Failed to generate story.";
  }
}

export async function analyzeSentiment(text: string): Promise<string> {
  try {
    const prompt = `Analyze the sentiment of the following text: "${text}". 
                    Provide a concise answer indicating whether the sentiment is positive, negative, or neutral.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
      temperature: 0.2,
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error("No choices returned from OpenAI API");
    }

    return response.choices[0].message?.content || "Sentiment analysis failed.";
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return "Sentiment analysis failed.";
  }
}

export async function generateResponse(messages: OpenAIMessage[]): Promise<string | undefined> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error("No choices returned from OpenAI API");
    }

    return response.choices[0].message?.content;
  } catch (error) {
    console.error("Error generating response:", error);
    return "Failed to generate response.";
  }
}

export async function summarizeText(text: string): Promise<string | undefined> {
  try {
    const prompt = `Summarize the following text in a concise manner: "${text}"`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.5,
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error("No choices returned from OpenAI API");
    }

    return response.choices[0].message?.content;
  } catch (error) {
    console.error("Error summarizing text:", error);
    return "Failed to summarize text.";
  }
}

export async function correctGrammar(text: string): Promise<string | undefined> {
  try {
    const prompt = `Correct the grammar and spelling in the following text: "${text}"`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.3,
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error("No choices returned from OpenAI API");
    }

    return response.choices[0].message?.content;
  } catch (error) {
    console.error("Error correcting grammar:", error);
    return "Failed to correct grammar.";
  }
}

export async function translateText(text: string, targetLanguage: string): Promise<string | undefined> {
    try {
        const prompt = `Translate the following text to ${targetLanguage}: "${text}"`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 100,
            temperature: 0.3,
        });

        if (!response.choices || response.choices.length === 0) {
            throw new Error("No choices returned from OpenAI API");
        }

        return response.choices[0].message?.content;
    } catch (error) {
        console.error("Error translating text:", error);
        return "Failed to translate text.";
    }
}

// Implementing polyfill for findLast if it's not available
if (!Array.prototype.findLast) {
  Array.prototype.findLast = function<T>(
    predicate: (value: T, index: number, array: T[]) => boolean
  ): T | undefined {
    for (let i = this.length - 1; i >= 0; i--) {
      const value = this[i];
      if (predicate(value, i, this)) {
        return value;
      }
    }
    return undefined;
  };
}

// Use the findLast method safely after the polyfill
const lastMessage = messages.findLast(msg => msg.role === 'assistant');
