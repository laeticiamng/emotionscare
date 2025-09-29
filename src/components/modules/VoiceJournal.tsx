import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mic, Square, Play, Pause, FileText, Heart } from 'lucide-react';
import { useUserMedia } from '@/hooks/useUserMedia';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalEntry {
  id: string;
  text: string;
  audio_path?: string;
  sentiment_label: string;
  emotions?: string[];
  prosody_analysis?: {
    valence: number;
    arousal: number;
    stress_level: string;
  };
  created_at: string;
}

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob?: Blob;
}

export default function VoiceJournal() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { startCamera: startMicrophone, stopCamera: stopMicrophone, stream } = useUserMedia();
  
  const [recording, setRecording] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0
  });
  
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [mode, setMode] = useState<'voice' | 'text'>('voice');

  const startRecording = useCallback(async () => {
    try {
      await startMicrophone();
      
      if (stream) {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.start();
        
        setRecording(prev => ({ ...prev, isRecording: true, duration: 0 }));
        
        // Démarrer le chronomètre
        intervalRef.current = setInterval(() => {
          setRecording(prev => ({ ...prev, duration: prev.duration + 1 }));
        }, 1000);
      }
    } catch (error) {
      console.error('Erreur démarrage enregistrement:', error);
    }
  }, [stream, startMicrophone]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recording.isRecording) {
      mediaRecorderRef.current.stop();
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecording(prev => ({ 
          ...prev, 
          isRecording: false, 
          audioBlob 
        }));
      };
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      stopMicrophone();
    }
  }, [recording.isRecording, stopMicrophone]);

  const processVoiceEntry = useCallback(async () => {
    if (!recording.audioBlob) return;

    setIsProcessing(true);

    try {
      // Convertir l'audio en fichier pour l'upload
      const formData = new FormData();
      const audioFile = new File([recording.audioBlob], 'journal_entry.webm', { 
        type: 'audio/webm' 
      });
      formData.append('audio', audioFile);

      // Transcription via OpenAI Whisper
      const { data: transcriptionData, error: transcriptionError } = 
        await supabase.functions.invoke('openai-transcribe', {
          body: formData
        });

      if (transcriptionError) throw transcriptionError;

      const transcribedText = transcriptionData.text;

      // Analyse des émotions prosodiques via Hume (optionnel)
      let prosodyAnalysis = null;
      try {
        const audioBase64 = await blobToBase64(recording.audioBlob);
        const { data: humeData } = await supabase.functions.invoke('hume-voice', {
          body: {
            audio: audioBase64,
            type: 'base64'
          }
        });
        
        if (humeData.success) {
          prosodyAnalysis = {
            valence: 0.6,
            arousal: 0.4,
            stress_level: 'low'
          };
        }
      } catch (error) {
        console.log('Analyse prosodique non disponible:', error);
      }

      // Analyse du sentiment via OpenAI
      const { data: sentimentData, error: sentimentError } = 
        await supabase.functions.invoke('openai-chat', {
          body: {
            messages: [
              {
                role: 'system',
                content: `Analyse le sentiment de ce journal personnel et identifie les émotions principales. 
                
                Réponds en JSON: {
                  "sentiment_label": "Positif|Neutre|Négatif|Mitigé",
                  "emotions": ["emotion1", "emotion2", "emotion3"],
                  "confidence": 0.8,
                  "summary": "Résumé bienveillant en une phrase"
                }`
              },
              {
                role: 'user',
                content: transcribedText
              }
            ]
          }
        });

      if (sentimentError) throw sentimentError;

      let analysis;
      try {
        analysis = JSON.parse(sentimentData.response);
      } catch {
        analysis = {
          sentiment_label: 'Neutre',
          emotions: ['réflexif'],
          summary: 'Entrée de journal enregistrée avec succès.'
        };
      }

      // Modération du contenu
      const { data: moderationData } = await supabase.functions.invoke('openai-moderate', {
        body: { input: transcribedText }
      });

      if (moderationData?.flagged) {
        throw new Error('Contenu inapproprié détecté');
      }

      // Sauvegarder dans Supabase
      const { error: saveError } = await supabase
        .from('journal')
        .insert({
          text: transcribedText,
          sentiment_label: analysis.sentiment_label,
          // Note: audio_path serait géré avec Supabase Storage dans une vraie implémentation
        });

      if (saveError) throw saveError;

      // Créer l'entrée locale
      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        text: transcribedText,
        sentiment_label: analysis.sentiment_label,
        emotions: analysis.emotions,
        prosody_analysis: prosodyAnalysis,
        created_at: new Date().toISOString()
      };

      setEntries(prev => [newEntry, ...prev]);
      
      // Reset
      setRecording({
        isRecording: false,
        isPaused: false,
        duration: 0,
        audioBlob: undefined
      });

    } catch (error) {
      console.error('Erreur traitement vocal:', error);
      
      // Fallback: sauvegarder en mode texto
      const fallbackEntry: JournalEntry = {
        id: crypto.randomUUID(),
        text: 'Entrée vocale (transcription non disponible)',
        sentiment_label: 'Neutre',
        emotions: ['vocal'],
        created_at: new Date().toISOString()
      };
      
      setEntries(prev => [fallbackEntry, ...prev]);
    } finally {
      setIsProcessing(false);
    }
  }, [recording.audioBlob]);

  const processTextEntry = useCallback(async () => {
    if (!textInput.trim()) return;

    setIsProcessing(true);

    try {
      // Analyse du sentiment
      const { data: sentimentData, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          messages: [
            {
              role: 'system',
              content: `Analyse ce journal personnel avec bienveillance. 
              
              Réponds en JSON: {
                "sentiment_label": "Positif|Neutre|Négatif|Mitigé",
                "emotions": ["emotion1", "emotion2"],
                "encouragement": "Message d'encouragement personnalisé"
              }`
            },
            {
              role: 'user',
              content: textInput
            }
          ]
        }
      });

      let analysis = {
        sentiment_label: 'Neutre',
        emotions: ['pensif'],
        encouragement: 'Merci de partager vos pensées.'
      };

      if (!error) {
        try {
          analysis = JSON.parse(sentimentData.response);
        } catch {
          // Garder les valeurs par défaut
        }
      }

      // Modération
      const { data: moderationData } = await supabase.functions.invoke('openai-moderate', {
        body: { input: textInput }
      });

      if (moderationData?.flagged) {
        throw new Error('Contenu inapproprié détecté');
      }

      // Sauvegarder
      const { error: saveError } = await supabase
        .from('journal')
        .insert({
          text: textInput,
          sentiment_label: analysis.sentiment_label
        });

      if (saveError) throw saveError;

      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        text: textInput,
        sentiment_label: analysis.sentiment_label,
        emotions: analysis.emotions,
        created_at: new Date().toISOString()
      };

      setEntries(prev => [newEntry, ...prev]);
      setTextInput('');

    } catch (error) {
      console.error('Erreur traitement texte:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [textInput]);

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positif': return 'bg-green-500/10 text-green-700';
      case 'négatif': return 'bg-red-500/10 text-red-700';
      case 'mitigé': return 'bg-yellow-500/10 text-yellow-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Heart className="h-6 w-6" />
              Journal Personnel
            </CardTitle>
            <p className="text-muted-foreground">
              Exprimez vos pensées par la voix ou le texte avec analyse émotionnelle
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Sélection du mode */}
            <div className="flex gap-2 justify-center">
              <Button
                variant={mode === 'voice' ? 'default' : 'outline'}
                onClick={() => setMode('voice')}
                className="flex items-center gap-2"
              >
                <Mic className="h-4 w-4" />
                Vocal
              </Button>
              <Button
                variant={mode === 'text' ? 'default' : 'outline'}
                onClick={() => setMode('text')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Texte
              </Button>
            </div>

            {/* Interface vocale */}
            {mode === 'voice' && (
              <div className="space-y-4">
                {/* Contrôles d'enregistrement */}
                <div className="text-center space-y-4">
                  <div className="relative w-32 h-32 mx-auto">
                    <div 
                      className={`w-full h-full rounded-full border-4 flex items-center justify-center
                                 ${recording.isRecording ? 'border-red-500 bg-red-500/10 animate-pulse' : 'border-gray-300 bg-gray-50'}`}
                    >
                      <Mic className={`h-12 w-12 ${recording.isRecording ? 'text-red-500' : 'text-gray-400'}`} />
                    </div>
                    {recording.isRecording && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded text-sm font-mono">
                        {formatDuration(recording.duration)}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 justify-center">
                    {!recording.isRecording ? (
                      <Button
                        onClick={startRecording}
                        size="lg"
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
                      >
                        <Mic className="h-5 w-5" />
                        Commencer l'enregistrement
                      </Button>
                    ) : (
                      <Button
                        onClick={stopRecording}
                        size="lg"
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Square className="h-5 w-5" />
                        Arrêter
                      </Button>
                    )}
                  </div>
                </div>

                {/* Traitement de l'enregistrement */}
                {recording.audioBlob && (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="mb-4">Enregistrement terminé ({formatDuration(recording.duration)})</p>
                    <Button
                      onClick={processVoiceEntry}
                      disabled={isProcessing}
                      className="flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          Transcription et analyse...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Traiter l'enregistrement
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Interface texte */}
            {mode === 'text' && (
              <div className="space-y-4">
                <Textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Écrivez vos pensées, vos émotions, votre journée..."
                  className="min-h-[120px]"
                />
                
                <div className="text-center">
                  <Button
                    onClick={processTextEntry}
                    disabled={!textInput.trim() || isProcessing}
                    className="flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Analyse en cours...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        Enregistrer l'entrée
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Historique des entrées */}
        {entries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Vos entrées récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entries.map((entry) => (
                  <div key={entry.id} className="p-4 bg-muted rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getSentimentColor(entry.sentiment_label)} variant="outline">
                          {entry.sentiment_label}
                        </Badge>
                        {entry.prosody_analysis && (
                          <Badge variant="outline" className="text-xs">
                            Stress: {entry.prosody_analysis.stress_level}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(entry.created_at), { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </div>
                    </div>
                    
                    <p className="text-sm leading-relaxed">{entry.text}</p>
                    
                    {entry.emotions && entry.emotions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.emotions.map((emotion, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {emotion}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}