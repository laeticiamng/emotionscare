
import { v4 as uuidv4 } from 'uuid';
import { EmotionRecommendation } from '@/types/emotion';

// Simulate an AI service for journal entries
export class JournalAIService {
  // Analyze a journal entry and provide feedback
  async analyzeEntry(content: string) {
    // In a real app, this would be an API call to an AI service
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // Extract mood from the journal entry
    const detectedMood = this.detectMood(content);
    
    // Generate feedback based on the detected mood
    const feedback = this.generateFeedback(detectedMood);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(detectedMood);
    
    return {
      id: uuidv4(),
      mood: detectedMood,
      feedback,
      recommendations,
      analysis: {
        wordCount: content.split(' ').length,
        sentiment: Math.random() * 2 - 1, // Score between -1 and 1
        topics: ['work', 'relationship', 'health'].filter(() => Math.random() > 0.5)
      }
    };
  }
  
  // Simple mood detection logic (would be more sophisticated in a real app)
  private detectMood(content: string) {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('happy') || lowerContent.includes('joy')) return 'joyful';
    if (lowerContent.includes('sad') || lowerContent.includes('depress')) return 'sad';
    if (lowerContent.includes('angry') || lowerContent.includes('frustrat')) return 'angry';
    if (lowerContent.includes('anxiety') || lowerContent.includes('worry')) return 'anxious';
    
    return 'neutral';
  }
  
  // Generate feedback based on mood
  private generateFeedback(mood: string) {
    switch (mood) {
      case 'joyful':
        return "It's great to see you're in such a positive mood! This is a great time to set goals or tackle challenging tasks.";
      case 'sad':
        return "I notice you seem to be feeling down. Remember that emotions are temporary and it's okay to seek support when needed.";
      case 'angry':
        return "I sense some frustration in your writing. Consider taking a moment to breathe and reflect on the source of these feelings.";
      case 'anxious':
        return "You appear to be experiencing some worry. Grounding exercises and focusing on what you can control might help ease your anxiety.";
      default:
        return "Thank you for sharing your thoughts. Regular journaling can help you track your emotional patterns over time.";
    }
  }
  
  // Generate recommendations based on mood
  private generateRecommendations(mood: string): EmotionRecommendation[] {
    switch (mood) {
      case 'joyful':
        return [
          { title: 'Share your joy', description: 'Consider reaching out to someone who might need positivity today' },
          { title: 'Capture this moment', description: 'Take a photo or note to remember this positive feeling' },
          { title: 'Set a goal', description: 'Use this positive energy to plan something meaningful' }
        ];
      case 'sad':
        return [
          { title: 'Self-care time', description: 'Do something gentle and nurturing for yourself today' },
          { title: 'Connect with support', description: 'Reach out to a trusted friend or professional' },
          { title: 'Express yourself', description: 'Try creative expression like art or music to process feelings' }
        ];
      case 'angry':
        return [
          { title: 'Physical release', description: 'Try exercise or physical activity to release tension' },
          { title: 'Breathing exercise', description: 'Practice deep breathing for 5 minutes' },
          { title: 'Perspective shift', description: 'Write about the situation from another viewpoint' }
        ];
      case 'anxious':
        return [
          { title: 'Grounding exercise', description: 'Try the 5-4-3-2-1 sensory awareness technique' },
          { title: 'Limit information', description: 'Consider taking a break from news or social media' },
          { title: 'Focus on controllables', description: 'Make a list of things within your control right now' }
        ];
      default:
        return [
          { title: 'Reflection practice', description: 'Consider what patterns you notice in your journal entries' },
          { title: 'Mindfulness moment', description: 'Take a few minutes for mindful awareness of the present' },
          { title: 'Set an intention', description: 'Create a simple intention for the rest of your day' }
        ];
    }
  }
}

export const journalService = new JournalAIService();

export default journalService;
