
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { triggerCoachEvent } from '@/lib/coach/coach-service';
import { useActivity } from '@/hooks/useActivity';

type EmotionData = {
  emotion?: string;
  score?: number;
};

/**
 * Hook to manage coach events/triggers
 */
export function useCoachEvents(
  generateRecommendation: () => Promise<void>,
  setLastEmotion: (emotion: string) => void,
  setSessionScore: (score: number) => void
) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logActivity } = useActivity();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTrigger, setLastTrigger] = useState<Date | null>(null);

  // Trigger coach after a scan
  const triggerAfterScan = useCallback(async (data: EmotionData) => {
    if (!user?.id) return;
    
    try {
      setIsProcessing(true);
      
      // Set emotion data for local UI usage
      if (data.emotion) setLastEmotion(data.emotion);
      if (data.score !== undefined) setSessionScore(data.score);
      
      // Log the activity
      logActivity('coach_scan_trigger', { 
        emotion: data.emotion,
        score: data.score 
      });
      
      // Trigger the coach event
      await triggerCoachEvent('scan_completed', user.id, data);
      
      // Update recommendations
      await generateRecommendation();
      
      // Update last trigger time
      setLastTrigger(new Date());
    } catch (error) {
      console.error('Error triggering coach after scan:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [user?.id, setLastEmotion, setSessionScore, logActivity, generateRecommendation]);

  // Trigger alert for concerning emotion data
  const triggerAlert = useCallback(async (data: EmotionData) => {
    if (!user?.id) return;
    
    try {
      setIsProcessing(true);
      
      // Log the activity
      logActivity('coach_alert', { 
        emotion: data.emotion,
        score: data.score 
      });
      
      // Trigger the alert
      await triggerCoachEvent('predictive_alert', user.id, data);
      
      // Show a notification
      toast({
        title: "Coach IA - Alerte",
        description: "Une notification de bien-être a été déclenchée suite à l'analyse de vos données émotionnelles.",
      });
      
      // Update last trigger time
      setLastTrigger(new Date());
    } catch (error) {
      console.error('Error triggering coach alert:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [user?.id, logActivity, toast]);

  // Trigger daily reminder
  const triggerDailyReminder = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsProcessing(true);
      
      // Log the activity
      logActivity('coach_daily_reminder', {});
      
      // Trigger the daily reminder
      await triggerCoachEvent('daily_reminder', user.id, {});
      
      // Generate recommendations
      await generateRecommendation();
      
      // Update last trigger time
      setLastTrigger(new Date());
    } catch (error) {
      console.error('Error triggering daily reminder:', error);
      // Don't show errors to the user for background refreshes
    } finally {
      setIsProcessing(false);
    }
    
    return; // Explicitly return Promise<void>
  }, [user?.id, logActivity, generateRecommendation]);

  // Suggest VR session
  const suggestVRSession = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsProcessing(true);
      
      // Log the activity
      logActivity('vr_session_suggestion', {});
      
      // Show a notification
      toast({
        title: "Suggestion VR",
        description: "Une session de réalité virtuelle pourrait vous aider à vous détendre.",
      });
      
      // Update last trigger time
      setLastTrigger(new Date());
    } catch (error) {
      console.error('Error suggesting VR session:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [user?.id, logActivity, toast]);

  return {
    isProcessing,
    lastTrigger,
    triggerAfterScan,
    triggerAlert,
    triggerDailyReminder,
    suggestVRSession
  };
}
