import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/components/ui/use-toast';
import { User, Emotion } from '@/types';
import { Smile, Mic, CircleStop, ArrowRight } from 'lucide-react';
import { createEmotionEntry, fetchLatestEmotion } from '@/lib/scanService';
import { supabase } from '@/integrations/supabase/client';

const ScanDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [emojis, setEmojis] = useState("");
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [latestEmotion, setLatestEmotion] = useState<Emotion | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchUserAndLatestEmotion = async () => {
      setLoading(true);
      try {
        // Pour cette démo, nous simulons les données utilisateur
        const simulatedUserData: User = {
          id: userId,
          name: `User ${userId.substring(0, 4)}`,
          email: `user-${userId.substring(0, 4)}@example.com`,
          anonymity_code: `Anon-${userId.substring(0, 4)}`,
        };
        
        setUserDetail(simulatedUserData);
        
        // Récupérer la dernière émotion pour cet utilisateur
        const emotionData = await fetchLatestEmotion(userId);
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];
      
      recorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });
      
      recorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
      });
      
      recorder.start();
      setRecording(true);
      setMediaRecorder(recorder);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setEmojis(prev => prev + emoji);
  };

  const analyzeEmotion = async () => {
    if (!userId) return;
    
    setAnalyzing(true);
    try {
      // Utiliser notre nouveau service pour créer et analyser l'entrée d'émotion
      const emotionEntry = await createEmotionEntry({
        user_id: userId,
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

  const commonEmojis = ["😊", "😃", "😄", "🙂", "😐", "😕", "😢", "😡", "😴", "🤔", "😌", "🥺"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {commonEmojis.map((emoji) => (
                <Button
                  key={emoji}
                  variant="outline"
                  className="text-xl"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center p-2 border rounded-md">
              <div className="text-xl mr-2">
                <Smile className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-h-[40px] flex-1 text-xl">
                {emojis || <span className="text-muted-foreground">Sélectionnez des emojis...</span>}
              </div>
              {emojis && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEmojis('')}
                >
                  Effacer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Décrivez votre état</CardTitle>
            <CardDescription>Partagez vos ressentis en quelques mots</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Comment vous sentez-vous aujourd'hui ?"
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Audio</CardTitle>
            <CardDescription>Enregistrez un message vocal pour exprimer votre ressenti</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              {!recording ? (
                <Button 
                  onClick={startRecording}
                  disabled={!!audioUrl}
                  className="gap-2"
                >
                  <Mic className="h-4 w-4" />
                  Commencer l'enregistrement
                </Button>
              ) : (
                <Button 
                  onClick={stopRecording}
                  variant="destructive"
                  className="gap-2"
                >
                  <CircleStop className="h-4 w-4" />
                  Arrêter l'enregistrement
                </Button>
              )}
            </div>
            
            {audioUrl && (
              <div className="border rounded-md p-4 mt-2">
                <audio src={audioUrl} controls className="w-full" />
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="mt-2"
                  onClick={() => setAudioUrl(null)}
                >
                  Supprimer l'audio
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-center">
          <Button 
            onClick={analyzeEmotion}
            disabled={analyzing || (!emojis && !text && !audioUrl)}
            className="w-full max-w-md gap-2"
            size="lg"
          >
            {analyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyse en cours...
              </>
            ) : (
              <>Analyser mon état</>
            )}
          </Button>
        </div>
        
        {latestEmotion?.ai_feedback && (
          <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-800">
                Résultat de l'analyse IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-indigo-700">
                {latestEmotion.ai_feedback}
              </div>
              
              <div className="mt-6">
                <Button 
                  onClick={() => navigate('/vr')}
                  variant="outline"
                  className="gap-2 border-indigo-300 hover:bg-indigo-100"
                >
                  Planifier une micro-pause VR
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ScanDetailPage;
