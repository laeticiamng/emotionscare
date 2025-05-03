
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Emotion } from '@/types';
import { Smile, Mic, Stop, ArrowRight } from 'lucide-react';

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
        // Fetch user details
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (userError) throw userError;
        setUserDetail(userData);
        
        // Fetch latest emotion for this user
        const { data: emotionData, error: emotionError } = await supabase
          .from('emotions')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(1)
          .single();
        
        if (!emotionError) {
          setLatestEmotion(emotionData);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        if (error.code !== 'PGRST116') { // No rows found error
          toast({
            title: "Erreur",
            description: `${error.message}`,
            variant: "destructive"
          });
        }
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
      // Create a new emotion record
      const { data: emotionData, error: emotionError } = await supabase
        .from('emotions')
        .insert({
          user_id: userId,
          emojis,
          text,
          audio_url: audioUrl,
        })
        .select()
        .single();
      
      if (emotionError) throw emotionError;
      
      // For this demo, we'll simulate an AI analysis with a simple algorithm
      const score = Math.floor(Math.random() * 100); // Random score from 0-100
      const feedback = generateFakeFeedback(score);
      
      // Update the emotion record with AI feedback and score
      const { data: updatedEmotion, error: updateError } = await supabase
        .from('emotions')
        .update({
          ai_feedback: feedback,
          score: score,
        })
        .eq('id', emotionData.id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      // Update user's emotional score
      await supabase
        .from('users')
        .update({
          emotional_score: score,
        })
        .eq('id', userId);
      
      // Set the latest emotion
      setLatestEmotion(updatedEmotion);
      
      toast({
        title: "Analyse terminée",
        description: "Votre état émotionnel a été analysé avec succès",
      });
      
      // Reset form
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

  // Simple function to generate fake AI feedback based on score
  const generateFakeFeedback = (score: number) => {
    if (score >= 80) {
      return "Vous semblez être dans un excellent état émotionnel aujourd'hui ! Votre langage est positif et énergique. Continuez à cultiver cette énergie positive dans vos interactions quotidiennes.";
    } else if (score >= 60) {
      return "Votre état émotionnel est bon. Je perçois un équilibre, mais aussi quelques traces de stress. Pensez à prendre une petite pause relaxante aujourd'hui.";
    } else if (score >= 40) {
      return "Vous semblez être dans un état émotionnel mitigé aujourd'hui. Je détecte des signes de tension et de fatigue. Une micro-pause VR pourrait vous aider à vous ressourcer.";
    } else {
      return "Votre état émotionnel semble fragile aujourd'hui. Je perçois de la fatigue et potentiellement de l'anxiété. Je recommande vivement une session de relaxation guidée ou un échange avec un collègue de confiance.";
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
                  <Stop className="h-4 w-4" />
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
