
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { User, Emotion } from '@/types';
import { createEmotionEntry, fetchLatestEmotion } from '@/lib/scanService';

// Import our components
import EmojiSelector from '@/components/scan/EmojiSelector';
import EmotionTextInput from '@/components/scan/EmotionTextInput';
import AudioRecorder from '@/components/scan/AudioRecorder';
import EmotionFeedback from '@/components/scan/EmotionFeedback';
import LoadingAnimation from '@/components/ui/loading-animation';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const ScanDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [emojis, setEmojis] = useState("");
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [latestEmotion, setLatestEmotion] = useState<Emotion | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
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

  useEffect(() => {
    if (!userId) return;

    const fetchUserAndLatestEmotion = async () => {
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

    fetchUserAndLatestEmotion();
  }, [userId, toast]);

  const handleEmojiClick = (emoji: string) => {
    setEmojis(prev => prev + emoji);
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
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Comment vous sentez-vous aujourd'hui ?</CardTitle>
            <CardDescription>Utilisez des emojis pour exprimer votre humeur</CardDescription>
          </CardHeader>
          <CardContent>
            <EmojiSelector 
              emojis={emojis} 
              onEmojiClick={handleEmojiClick} 
              onClear={() => setEmojis('')}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Décrivez votre état</CardTitle>
            <CardDescription>Partagez vos ressentis en quelques mots</CardDescription>
          </CardHeader>
          <CardContent>
            <EmotionTextInput 
              value={text} 
              onChange={setText}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Audio</CardTitle>
            <CardDescription>Enregistrez un message vocal pour exprimer votre ressenti</CardDescription>
          </CardHeader>
          <CardContent>
            <AudioRecorder 
              audioUrl={audioUrl} 
              setAudioUrl={setAudioUrl} 
            />
          </CardContent>
        </Card>
        
        <div className="flex justify-center">
          <Button 
            onClick={analyzeEmotion}
            disabled={analyzing || (!emojis && !text && !audioUrl)}
            className="w-full max-w-md gap-2"
            size="lg"
          >
            {analyzing ? "Analyse en cours..." : "Analyser mon état"}
          </Button>
        </div>
        
        <EmotionFeedback emotion={latestEmotion} />
      </div>

      {/* Dialog d'analyse avec animation */}
      <Dialog open={analyzing} onOpenChange={(open) => !open && setAnalyzing(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Analyse en cours</DialogTitle>
          <DialogDescription>Veuillez patienter pendant que nous analysons votre état émotionnel</DialogDescription>
          <div className="flex flex-col items-center justify-center py-8">
            <LoadingAnimation 
              text="Notre IA analyse votre état émotionnel..." 
              className="mb-4"
              iconClassName="h-12 w-12"
            />
            <div className="text-center max-w-sm">
              <p className="text-sm text-muted-foreground mt-4">
                Nous utilisons l'intelligence artificielle pour analyser vos émotions et vous offrir un retour personnalisé.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScanDetailPage;
