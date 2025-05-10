import { useState } from 'react';
import { analyzeEmotion } from '@/lib/scanService';
import { useToast } from "@/hooks/use-toast";

export default function useEmotionScanFormState(onScanSaved: () => void, onSaveComplete?: () => void, userId?: string) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('text');
  const [emojis, setEmojis] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [isConfidential, setIsConfidential] = useState<boolean>(false);
  const [shareWithCoach, setShareWithCoach] = useState<boolean>(true);
  const [charCount, setCharCount] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [quickMode, setQuickMode] = useState<boolean>(false);
  const [skipDay, setSkipDay] = useState<boolean>(false);
  const MAX_CHARS = 500;

  const handleEmojiClick = (emoji: string) => {
    if (quickMode) {
      setEmojis(emoji);
      handleQuickSubmit(emoji);
    } else {
      setEmojis(prev => prev + emoji);
    }
  };

  const handleTextChange = (value: string) => {
    if (value.length <= MAX_CHARS) {
      setText(value);
      setCharCount(value.length);
    }
  };

  const handleQuickSubmit = async (emojiValue: string) => {
    setAnalyzing(true);
    
    try {
      const result = await analyzeEmotion({
        user_id: userId || '',
        emojis: emojiValue,
        is_confidential: isConfidential,
        share_with_coach: shareWithCoach
      });
      
      setAnalysisResult(result);
      
      toast({
        title: "Scan rapide complété",
        description: `Votre état émotionnel: ${result.emotion}`,
      });
      
      onScanSaved();
      if (onSaveComplete) onSaveComplete();
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser votre état émotionnel. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!emojis && !text && !audioUrl) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez ajouter au moins un emoji, du texte ou un enregistrement audio.",
        variant: "destructive"
      });
      return;
    }

    try {
      setAnalyzing(true);
      
      const result = await analyzeEmotion({
        user_id: userId || '',
        emojis,
        text,
        audio_url: audioUrl,
        is_confidential: isConfidential,
        share_with_coach: shareWithCoach
      });
      
      setAnalysisResult(result);
      
      toast({
        title: "Analyse complétée",
        description: `Votre état émotionnel: ${result.emotion}`,
      });
      
      onScanSaved();
      if (onSaveComplete) onSaveComplete();
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser votre état émotionnel. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCorrection = () => {
    setActiveTab('text');
    setAnalysisResult(null);
  };

  return {
    activeTab,
    setActiveTab,
    emojis,
    setEmojis,
    text,
    setText,
    audioUrl,
    setAudioUrl,
    analyzing,
    setAnalyzing,
    isConfidential,
    setIsConfidential,
    shareWithCoach,
    setShareWithCoach,
    charCount,
    analysisResult,
    setAnalysisResult,
    quickMode,
    setQuickMode,
    skipDay,
    setSkipDay,
    MAX_CHARS,
    handleEmojiClick,
    handleTextChange,
    handleSubmit,
    handleCorrection
  };
}
