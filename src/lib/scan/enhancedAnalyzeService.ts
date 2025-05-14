
import { EmotionResult } from '@/types/emotion';
import { Emotion } from '@/types';
import OpenAIClient from '../api/openAIClient';

export interface EnhancedEmotionResult extends EmotionResult {
  insights?: string[];
  recommendations?: string[];
  triggers?: string[];
}

export interface EmotionInsights {
  insights: string[];
  recommendations: string[];
  triggers: string[];
}

export async function enhanceEmotionAnalysis(emotion: Partial<Emotion>): Promise<EnhancedEmotionResult> {
  // Basic result from original emotion data
  const result: EnhancedEmotionResult = {
    id: emotion.id,
    emotion: emotion.emotion || 'neutral',
    score: emotion.score,
    confidence: emotion.confidence,
    text: emotion.text,
  };
  
  try {
    // Get enhanced insights using OpenAI
    const insights = await getEmotionInsights(emotion);
    
    // Add enhanced data to result
    return {
      ...result,
      insights: insights.insights,
      recommendations: insights.recommendations,
      triggers: insights.triggers
    };
  } catch (error) {
    console.error("Error enhancing emotion analysis:", error);
    return result;
  }
}

async function getEmotionInsights(emotion: Partial<Emotion>): Promise<EmotionInsights> {
  try {
    const prompt = `
      Analyze the following emotion data:
      - Primary emotion: ${emotion.emotion}
      - Confidence level: ${emotion.confidence || 'unknown'}
      - Related text: "${emotion.text || 'No text provided'}"
      
      Provide:
      1. Three specific insights about this emotional state
      2. Three personalized recommendations for managing or leveraging this emotion
      3. Likely triggers for this emotion based on the provided context
      
      Format your response as JSON with insights, recommendations, and triggers arrays.
    `;
    
    const response = await OpenAIClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an emotional intelligence expert. Analyze emotions and provide insights, recommendations, and potential triggers in JSON format." },
        { role: "user", content: prompt }
      ]
    });
    
    const content = response.choices[0].message.content;
    
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(content);
      return {
        insights: Array.isArray(parsed.insights) ? parsed.insights : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        triggers: Array.isArray(parsed.triggers) ? parsed.triggers : []
      };
    } catch (parseError) {
      // Fallback if not valid JSON
      console.error("Failed to parse AI response as JSON:", parseError);
      return {
        insights: ["Insight could not be generated automatically"],
        recommendations: ["Try reflecting on your emotion and its context"],
        triggers: ["Unknown triggers"]
      };
    }
  } catch (error) {
    console.error("Error getting emotion insights:", error);
    return {
      insights: [],
      recommendations: [],
      triggers: []
    };
  }
}
