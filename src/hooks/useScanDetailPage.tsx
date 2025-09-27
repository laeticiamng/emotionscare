
import { useState, useEffect } from 'react';
import type { User } from '@/types/user';
import type { Emotion } from '@/types/emotion';

export interface ScanDetail {
  id: string;
  date: string;
  score: number;
  user: User;
  emotions: string[];
  insights: string[];
  recommendations: string[];
}

export interface UseScanDetailPageReturn {
  scanDetail: ScanDetail | null;
  loading: boolean;
  error: Error | null;
  emojis: string[];
  text: string;
  audioUrl: string | null;
  latestEmotion: Emotion | null;
  analyzing: boolean;
  userDetail: User | null;
  setEmojis: (emojis: string[]) => void;
  setText: (text: string) => void;
  setAudioUrl: (url: string | null) => void;
  setAnalyzing: (analyzing: boolean) => void;
  handleEmojiClick: (emoji: string) => void;
  analyzeEmotion: () => void;
  fetchUserAndLatestEmotion: () => void;
}

export function useScanDetailPage(scanId: string): UseScanDetailPageReturn {
  const [scanDetail, setScanDetail] = useState<ScanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Additional state needed for interaction
  const [emojis, setEmojis] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [latestEmotion, setLatestEmotion] = useState<Emotion | null>(null);
  const [userDetail, setUserDetail] = useState<User | null>(null);

  const handleEmojiClick = (emoji: string) => {
    setEmojis(prev => [...prev, emoji]);
  };

  const analyzeEmotion = () => {
    setAnalyzing(true);
    // Mock analysis would happen here
    setTimeout(() => {
      setLatestEmotion({
        id: 'emotion-1',
        name: 'joy',
        color: '#FFD700'
      });
      setAnalyzing(false);
    }, 1500);
  };

  const fetchUserAndLatestEmotion = async () => {
    try {
      setLoading(true);
      // Simuler un chargement pour mieux voir l'état de chargement
      await new Promise(r => setTimeout(r, 1000));

      // Simuler les données pour la démo
      const mockScanDetail: ScanDetail = {
        id: scanId,
        date: new Date().toISOString(),
        score: 78,
        user: {
          id: 'usr-123',
          name: 'Jean Dupont',
          email: 'jean.dupont@example.com',
          role: 'user',
          created_at: new Date().toISOString()
        },
        emotions: ['calme', 'concentré', 'léger stress'],
        insights: [
          'Votre niveau de stress est inférieur à la moyenne de votre équipe',
          'Votre bien-être émotionnel s\'est amélioré de 12% cette semaine'
        ],
        recommendations: [
          'Prenez une pause de 10 minutes pour méditer',
          'Écoutez une playlist musicale pour renforcer votre concentration'
        ]
      };

      // Set user details from the scan
      setUserDetail(mockScanDetail.user);
      setScanDetail(mockScanDetail);
      
      // Set a mock latest emotion
      setLatestEmotion({
        id: 'emotion-1',
        name: 'calm',
        color: '#4682B4'
      });
      
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch scan details'));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scanId) {
      fetchUserAndLatestEmotion();
    }
  }, [scanId]);

  return { 
    scanDetail, 
    loading, 
    error,
    emojis,
    text,
    audioUrl,
    latestEmotion,
    analyzing,
    userDetail,
    setEmojis,
    setText,
    setAudioUrl,
    setAnalyzing,
    handleEmojiClick,
    analyzeEmotion,
    fetchUserAndLatestEmotion
  };
}

export default useScanDetailPage;
