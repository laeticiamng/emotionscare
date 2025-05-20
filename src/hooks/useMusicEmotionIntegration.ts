
import { useContext } from 'react';
import { MusicContext } from '@/contexts/MusicContext';
import { EmotionResult } from '@/types/emotion';
import { EmotionMusicParams, MusicContextType } from '@/types/music';
import { findTracksByMood } from '@/utils/musicCompatibility';

/**
 * Custom hook to integrate music recommendations with emotion analysis
 */
export const useMusicEmotionIntegration = () => {
  const musicContext = useContext(MusicContext) as MusicContextType;
  
  /**
   * Get a description of what type of music is recommended for an emotion
   */
  const getEmotionMusicDescription = (emotion: string): string => {
    const descriptions: Record<string, string> = {
      joy: "Upbeat and positive music to enhance your happy mood",
      happiness: "Upbeat and positive music to enhance your happy mood",
      sadness: "Gentle, comforting melodies to help process emotions",
      anger: "Calming music to help reduce stress and tension",
      fear: "Soothing sounds to create a sense of safety and relaxation",
      surprise: "Intriguing and dynamic compositions to complement your mood",
      disgust: "Cleansing and refreshing audio to shift your emotional state",
      calm: "Peaceful ambient sounds to maintain your tranquil state",
      neutral: "Balanced and melodic tunes to accompany your balanced mood",
      anxiety: "Soothing rhythms to help ease worry and promote relaxation",
      stress: "Gentle sounds designed to reduce tension and promote calmness"
    };
    
    return descriptions[emotion.toLowerCase()] || "Music curated for your current emotional state";
  };

  /**
   * Activate music based on detected emotion
   */
  const activateMusicForEmotion = async (params: EmotionMusicParams): Promise<void> => {
    if (!musicContext.loadPlaylistForEmotion) {
      console.error("Music context loadPlaylistForEmotion function not available");
      return;
    }
    
    try {
      const playlist = await musicContext.loadPlaylistForEmotion(params);
      if (playlist && musicContext.playPlaylist) {
        musicContext.playPlaylist(playlist);
      }
    } catch (error) {
      console.error("Error activating music for emotion:", error);
    }
  };

  /**
   * Process emotion result and get music recommendation
   */
  const getMusicRecommendationForEmotion = async (emotionResult: EmotionResult) => {
    if (!emotionResult || !emotionResult.emotion) {
      return null;
    }
    
    const emotion = emotionResult.emotion.toLowerCase();
    
    try {
      if (!musicContext.playlists || musicContext.playlists.length === 0) {
        console.warn("No music playlists available");
        return null;
      }
      
      // Try to find a playlist directly matching the emotion
      let playlist = musicContext.playlists.find(p => 
        p.emotion?.toLowerCase() === emotion || 
        p.mood?.toLowerCase() === emotion
      );
      
      // If no direct match, try to find tracks with the emotion
      if (!playlist && musicContext.playlists.length > 0) {
        const allTracks = musicContext.playlists.flatMap(p => p.tracks);
        const matchingTracks = findTracksByMood(allTracks, emotion);
        
        if (matchingTracks.length > 0) {
          return {
            id: `generated-${emotion}`,
            name: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Mix`,
            title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Mix`,
            tracks: matchingTracks,
            emotion: emotion,
            mood: emotion,
            description: getEmotionMusicDescription(emotion)
          };
        }
      }
      
      return playlist;
      
    } catch (error) {
      console.error("Error getting music recommendation for emotion:", error);
      return null;
    }
  };
  
  return {
    activateMusicForEmotion,
    getEmotionMusicDescription,
    getMusicRecommendationForEmotion,
    playEmotion: musicContext.playEmotion,
  };
};

export default useMusicEmotionIntegration;
