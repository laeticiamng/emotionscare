
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { createEmotionEntry, fetchLatestEmotion } from '@/lib/scanService';
import type { Emotion, User } from '@/types';

export const useEmotionScan = (userId: string | undefined) => {
  const [emojis, setEmojis] = useState("");
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [latestEmotion, setLatestEmotion] = useState<Emotion | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const { toast } = useToast();

  // Assurer que l'ID est un UUID valide pour Supabase
  const getValidUserId = () => {
    if (!userId) return "00000000-0000-0000-0000-000000000000"; // UUID par défaut
    
    // Vérifier si c'est déjà un UUID valide
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return userId;
    }
    
    // Sinon, générer un UUID basé sur une valeur constante pour garantir la cohérence
    const paddedId = userId.padStart(12, '0').substring(0, 12);
    return `00000000-0000-0000-0000-${paddedId}`;
  };

  const fetchUserAndLatestEmotion = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const validUserId = getValidUserId();
      
      // Pour cette démo, nous simulons les données utilisateur
      const simulatedUserData: User = {
        id: validUserId,
        name: `User ${userId.substring(0, 4)}`,
        email: `user-${userId.substring(0, 4)}@example.com`,
        anonymity_code: `Anon-${userId.substring(0, 4)}`,
      };
      
      setUserDetail(simulatedUserData);
      
      // Récupérer la dernière émotion pour cet utilisateur
      const emotionData = await fetchLatestEmotion(validUserId);
      if (emotionData) {
        setLatestEmotion(emotionData);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erreur",
        description: `${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeEmotion = async () => {
    if (!userId) return;
    
    setAnalyzing(true);
    try {
      const validUserId = getValidUserId();
      
      // Utiliser notre service pour créer et analyser l'entrée d'émotion
      const emotionEntry = await createEmotionEntry({
        user_id: validUserId,
        emojis,
        text,
        audio_url: audioUrl || undefined
      });
      
      // Mettre à jour la dernière émotion
      setLatestEmotion(emotionEntry);
      
      toast({
        title: "Analyse terminée",
        description: "Votre état émotionnel a été analysé avec succès",
      });
      
      // Réinitialiser le formulaire
      setEmojis("");
      setText("");
      setAudioUrl(null);
      
    } catch (error: any) {
      console.error('Error analyzing emotion:', error);
      toast({
        title: "Erreur",
        description: `${error.message}`,
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setEmojis(prev => prev + emoji);
  };

  return {
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
    handleEmojiClick,
    analyzeEmotion,
    fetchUserAndLatestEmotion
  };
};
