
// DALL-E Service
export interface DALLEOptions {
  size?: '256x256' | '512x512' | '1024x1024';
  n?: number;
  responseFormat?: 'url' | 'b64_json';
}

const DALLE_API_ENDPOINT = 'https://api.openai.com/v1/images/generations';

const generateImage = async (prompt: string, options: DALLEOptions = {}): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_OPENAI_API_KEY is not configured');
    }

    const response = await fetch(DALLE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        n: options.n || 1,
        size: options.size || '1024x1024',
        response_format: options.responseFormat || 'url',
      }),
    });

    if (!response.ok) {
      throw new Error(`DALL-E API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    console.error('Error generating image with DALL-E:', error);
    throw error;
  }
};

const generateVariations = async (imageUrl: string, options: DALLEOptions = {}): Promise<string[]> => {
  try {
    // Implementation for variations would go here
    // This is a simplified mock implementation
    return [imageUrl];
  } catch (error) {
    console.error('Error generating image variations with DALL-E:', error);
    throw error;
  }
};

const checkApiConnection = async (): Promise<{ status: boolean; message: string }> => {
  try {
    // Simple test call to see if the API key works
    await generateImage('test', { size: '256x256' });
    return { status: true, message: 'DALL-E API connection successful' };
  } catch (error) {
    return { 
      status: false, 
      message: `DALL-E API connection failed: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
};

export const generateEmotionImage = async (emotion: string, options: DALLEOptions = {}): Promise<string> => {
  const prompt = `Create an abstract image representing the emotion "${emotion}". The image should convey the feeling without showing faces or people.`;
  return generateImage(prompt, options);
};

export const generatePersonalizedImage = async (userContext: string, emotion: string, options: DALLEOptions = {}): Promise<string> => {
  const prompt = `Create a personalized abstract image representing "${emotion}" for ${userContext}. The image should be appropriate and convey the feeling without showing identifiable people.`;
  return generateImage(prompt, options);
};

export default {
  generateImage,
  generateVariations,
  checkApiConnection,
  generateEmotionImage,
  generatePersonalizedImage
};
