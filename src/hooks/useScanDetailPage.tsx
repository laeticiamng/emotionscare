
import { useState, useEffect } from 'react';
import { useEmotionScan } from './useEmotionScan';
import { fetchUserById } from '@/lib/communityService';
import type { Emotion, User } from '@/types';

export function useScanDetailPage(userId?: string) {
  const { scanEmotion, getLatestEmotion, lastEmotion, isLoading: emotionLoading, error } = useEmotionScan();
  
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
      await getLatestEmotion();
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
    latestEmotion: lastEmotion,
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
