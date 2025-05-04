
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEmotionScan } from '@/hooks/useEmotionScan';
import EmotionInputForm from '@/components/scan/EmotionInputForm';
import EmotionFeedback from '@/components/scan/EmotionFeedback';
import LoadingAnimation from '@/components/ui/loading-animation';
import AnalysisDialog from '@/components/scan/AnalysisDialog';
import type { Emotion } from '@/types'; // Import from index.ts

const ScanDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const {
    emojis,
    text,
    audioUrl,
    latestEmotion,
    loading,
    analyzing,
    userDetail,
    setEmojis,
    setText,
    setAudioUrl,
    setAnalyzing,
    handleEmojiClick,
    analyzeEmotion,
    fetchUserAndLatestEmotion
  } = useEmotionScan(userId);

  useEffect(() => {
    if (userId) {
      fetchUserAndLatestEmotion();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingAnimation text="Chargement de vos données..." />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Scan émotionnel {userDetail ? `de ${userDetail.name}` : ''}
      </h1>
      
      <EmotionInputForm 
        emojis={emojis}
        text={text}
        audioUrl={audioUrl}
        onEmojiClick={handleEmojiClick}
        onEmojisChange={setEmojis}
        onTextChange={setText}
        onAudioChange={setAudioUrl}
        onAnalyze={analyzeEmotion}
        analyzing={analyzing}
      />
      
      <EmotionFeedback emotion={latestEmotion as Emotion} />

      <AnalysisDialog 
        open={analyzing} 
        onOpenChange={(open) => !open && setAnalyzing(false)} 
      />
    </div>
  );
};

export default ScanDetailPage;
