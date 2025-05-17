
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EmotionResult } from '@/types/emotions';
import { useMusicRecommendation } from '@/hooks/music/useMusicRecommendation';
import { useRouter } from 'react-router-dom';

export const useScanPageState = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [scanResults, setScanResults] = useState<EmotionResult[]>([]);
  const [lastScannedEmotion, setLastScannedEmotion] = useState<EmotionResult | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { handlePlayMusic, isLoading: musicLoading } = useMusicRecommendation();

  useEffect(() => {
    // Fetch last emotion if needed
    // This would normally come from a real API
  }, []);

  const handleScanStart = useCallback(() => {
    setIsScanning(true);
    setScanCompleted(false);
  }, []);

  const handleScanComplete = useCallback((result: EmotionResult) => {
    setIsScanning(false);
    setScanCompleted(true);
    setLastScannedEmotion(result);
    
    // Add to scan history
    setScanResults(prev => {
      if (prev.find(item => item.id === result.id)) {
        return prev;
      }
      return [result, ...prev];
    });

    toast({
      title: "Scan completed",
      description: `Detected primary emotion: ${result.emotion}`,
      duration: 3000,
    });
  }, [toast]);

  const handleViewHistory = useCallback(() => {
    router.navigate('/scan-history');
  }, [router]);

  const handlePlayRecommendedMusic = useCallback((emotion: string) => {
    handlePlayMusic(emotion);
    toast({
      title: "Music started",
      description: `Playing music for ${emotion} mood`,
      duration: 3000,
    });
  }, [handlePlayMusic, toast]);

  const handleSaveEmotion = useCallback((result: EmotionResult) => {
    // This would normally save to a database
    console.log('Saving emotion result:', result);
    setScanResults(prev => [result, ...prev]);
    
    toast({
      title: "Emotion saved",
      description: "Your emotional data has been recorded",
      duration: 3000,
    });
    
    return result;
  }, [toast]);

  return {
    isScanning,
    scanCompleted,
    scanResults,
    lastScannedEmotion,
    musicLoading,
    handleScanStart,
    handleScanComplete,
    handleViewHistory,
    handlePlayRecommendedMusic,
    handleSaveEmotion,
  };
};

export default useScanPageState;
