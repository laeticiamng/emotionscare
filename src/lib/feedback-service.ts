import { supabase } from '@/integrations/supabase/client';

export interface Feedback {
  id: string;
  module: string;
  rating: number;
  comment?: string;
  userId?: string;
  created_at: string;
}

export class FeedbackService {
  static async addFeedback(feedback: Omit<Feedback, 'id' | 'created_at'>): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('add-feedback', {
        body: feedback
      });
      if (error) throw error;
      return data.id as string;
    } catch (error) {
      console.error('Error adding feedback:', error);
      throw error;
    }
  }

  static async getFeedbacks(filters?: { module?: string; userId?: string }): Promise<Feedback[]> {
    try {
      const { data, error } = await supabase.functions.invoke('get-feedbacks', {
        body: filters || {}
      });
      if (error) throw error;
      return (data as Feedback[]) || [];
    } catch (error) {
      console.error('Error getting feedbacks:', error);
      return [];
    }
  }

  static async getSummary(filters?: { module?: string }): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('get-feedback-summary', {
        body: filters || {}
      });
      if (error) throw error;
      return (data as { summary: string })?.summary || '';
    } catch (error) {
      console.error('Error getting feedback summary:', error);
      return '';
    }
  }
}

export default FeedbackService;
