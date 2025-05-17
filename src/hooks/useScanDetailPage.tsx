
import { useState, useEffect } from 'react';
import { useEmotionScan } from './useEmotionScan';
import { User } from '@/types/other';
import { EmotionResult } from '@/types/emotions';

// Fonction simulée pour récupérer les détails d'un utilisateur
const fetchUserById = async (userId: string): Promise<User> => {
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    id: userId,
    name: `User ${userId}`,
    email: `user${userId}@example.com`,
  };
};

export function useScanDetailPage(userId?: string) {
  const { scanEmotion, latestEmotion, isLoading: emotionLoading, error, fetchLatest } = useEmotionScan({
    userId
  });
  
  const [emojis, setEmojis] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user details and latest emotion
  const fetchUserAndLatestEmotion = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Fetch user details
      const userData = await fetchUserById(userId);
      setUserDetail(userData);
      
      // Fetch latest emotion for this user
      await fetchLatest();
    } catch (err) {
      console.error('Error fetching user or emotion data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add emoji to current emojis
  const handleEmojiClick = (emoji: string) => {
    setEmojis(prev => prev + emoji);
  };

  // Analyze emotion based on provided inputs
  const analyzeEmotion = async () => {
    if (!userId) return;
    
    setAnalyzing(true);
    try {
      await scanEmotion({
        text,
        emojis,
        audio_url: audioUrl || undefined
      });
    } catch (err) {
      console.error('Error analyzing emotion:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return {
    // State
    emojis,
    text,
    audioUrl,
    userDetail,
    latestEmotion,
    loading: loading || emotionLoading,
    analyzing,
    error,
    
    // Actions
    setEmojis,
    setText,
    setAudioUrl,
    setAnalyzing,
    handleEmojiClick,
    analyzeEmotion,
    fetchUserAndLatestEmotion
  };
}
