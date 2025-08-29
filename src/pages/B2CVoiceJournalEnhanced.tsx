import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Play, Pause, Square, FileAudio, Brain, Heart, Wand2, Save, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

const B2CVoiceJournalEnhanced: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioURL, setAudioURL] = useState('');
  const [transcription, setTranscription] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [editableText, setEditableText] = useState('');
  const [recordingLevel, setRecordingLevel] = useState(0);
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedMood, setSelectedMood] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const moods = [
    { value: 'joyful', label: 'Joyeux', emoji: '😊', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'calm', label: 'Calme', emoji: '😌', color: 'bg-blue-100 text-blue-800' },
    { value: 'excited', label: 'Excité', emoji: '🤩', color: 'bg-orange-100 text-orange-800' },
    { value: 'thoughtful', label: 'Pensif', emoji: '🤔', color: 'bg-purple-100 text-purple-800' },
    { value: 'grateful', label: 'Reconnaissant', emoji: '🙏', color: 'bg-green-100 text-green-800' },
    { value: 'stressed', label: 'Stressé', emoji: '😰', color: 'bg-red-100 text-red-800' }
  ];

  // Analyse du niveau audio en temps réel
  const analyzeAudioLevel = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;
    setRecordingLevel(average);

    if (isRecording) {
      animationRef.current = requestAnimationFrame(analyzeAudioLevel);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      streamRef.current = stream;

      // Configuration de l'analyseur audio
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Convertir en base64 pour l'envoi
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result?.toString().split(',')[1];
          if (base64) {
            transcribeAudio(base64);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      analyzeAudioLevel();

      // Timer pour la durée
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Erreur d'enregistrement",
        description: "Impossible d'accéder au microphone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      setRecordingLevel(0);
    }
  };

  const transcribeAudio = async (audioBase64: string) => {
    try {
      setIsAnalyzing(true);
      
      const { data, error } = await supabase.functions.invoke('openai-whisper', {
        body: { audio: audioBase64 }
      });

      if (error) throw error;

      setTranscription(data.text);
      setEditableText(data.text);
      
      // Analyse IA du contenu
      await analyzeJournalEntry(data.text);
      
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast({
        title: "Erreur de transcription",
        description: "Impossible de transcrire l'audio",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeJournalEntry = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('journal-analysis', {
        body: { 
          text,
          mood: selectedMood,
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;
      setAiAnalysis(data);
      
    } catch (error) {
      console.error('Error analyzing journal entry:', error);
    }
  };

  const saveEntry = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('journal-entry', {
        body: {
          text: editableText,
          mood: selectedMood,
          audio_url: audioURL,
          analysis: aiAnalysis,
          duration: recordingDuration
        }
      });

      if (error) throw error;

      toast({
        title: "✅ Entrée sauvegardée",
        description: "Votre journal vocal a été enregistré avec succès"
      });

      // Reset
      setTranscription('');
      setEditableText('');
      setAudioURL('');
      setAiAnalysis(null);
      setRecordingDuration(0);
      setSelectedMood('');
      
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder l'entrée",
        variant: "destructive"
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <motion.div
          animate={isRecording ? { 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          } : { scale: 1, rotate: 0 }}
          transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
        >
          <FileAudio className="h-8 w-8 text-purple-500" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold">Journal Vocal IA 🎙️</h1>
          <p className="text-muted-foreground">Exprimez-vous, nous analysons vos émotions</p>
        </div>
      </motion.div>

      {/* Sélection d'humeur */}
      <Card>
        <CardHeader>
          <CardTitle>Comment vous sentez-vous ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {moods.map(mood => (
              <motion.div
                key={mood.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedMood === mood.value ? "default" : "outline"}
                  className={`w-full h-auto p-3 flex flex-col gap-1 ${
                    selectedMood === mood.value ? mood.color : ''
                  }`}
                  onClick={() => setSelectedMood(mood.value)}
                >
                  <span className="text-lg">{mood.emoji}</span>
                  <span className="text-xs">{mood.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Zone d'enregistrement */}
      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Studio d'Enregistrement</span>
            <Badge variant="outline">
              {formatDuration(recordingDuration)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Visualiseur audio */}
          <div className="relative h-32 bg-muted rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {isRecording ? (
                <motion.div
                  animate={{ 
                    scale: [1, 1 + recordingLevel / 100, 1]
                  }}
                  transition={{ duration: 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Mic className="h-12 w-12 text-red-500 mx-auto mb-2" />
                  </motion.div>
                  <div className="text-sm text-red-600 font-medium">EN COURS D'ENREGISTREMENT</div>
                  <div className="text-xs text-muted-foreground">Parlez naturellement...</div>
                </motion.div>
              ) : audioURL ? (
                <div className="text-center">
                  <Volume2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <div className="text-sm text-green-600 font-medium">ENREGISTREMENT TERMINÉ</div>
                  <div className="text-xs text-muted-foreground">Durée: {formatDuration(recordingDuration)}</div>
                </div>
              ) : (
                <div className="text-center">
                  <MicOff className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Appuyez pour commencer</div>
                </div>
              )}
            </div>

            {/* Barres de niveau audio */}
            {isRecording && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500">
                <motion.div
                  className="h-full bg-white/50"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(recordingLevel, 100)}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            )}
          </div>

          {/* Contrôles */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isRecording ? (
                <>
                  <Square className="h-5 w-5" />
                  Arrêter
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5" />
                  Enregistrer
                </>
              )}
            </Button>

            {audioURL && (
              <Button
                onClick={() => {
                  if (audioRef.current) {
                    if (isPlaying) {
                      audioRef.current.pause();
                    } else {
                      audioRef.current.play();
                    }
                    setIsPlaying(!isPlaying);
                  }
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                Écouter
              </Button>
            )}
          </div>

          <audio 
            ref={audioRef} 
            src={audioURL}
            onEnded={() => setIsPlaying(false)}
          />
        </CardContent>
      </Card>

      {/* Transcription et édition */}
      {(transcription || editableText) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              Transcription & Édition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              placeholder="Votre transcription apparaîtra ici..."
              className="min-h-[120px]"
            />
            
            {isAnalyzing && (
              <div className="flex items-center gap-2 text-blue-600">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Wand2 className="h-4 w-4" />
                </motion.div>
                <span className="text-sm">Analyse IA en cours...</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analyse IA */}
      {aiAnalysis && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-purple-500" />
              Analyse Émotionnelle IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {aiAnalysis.emotions && Object.entries(aiAnalysis.emotions).map(([emotion, score]: [string, any]) => (
                <div key={emotion} className="text-center">
                  <div className="text-sm font-medium capitalize">{emotion}</div>
                  <div className="text-lg font-bold text-purple-600">{Math.round(score * 100)}%</div>
                </div>
              ))}
            </div>
            
            {aiAnalysis.insights && (
              <div className="p-4 bg-white rounded-lg">
                <div className="font-medium mb-2">Insights IA</div>
                <div className="text-sm text-muted-foreground">{aiAnalysis.insights}</div>
              </div>
            )}

            {aiAnalysis.recommendations && (
              <div className="p-4 bg-white rounded-lg">
                <div className="font-medium mb-2">Recommandations</div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {aiAnalysis.recommendations.map((rec: string, index: number) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bouton de sauvegarde */}
      {editableText && (
        <Button 
          onClick={saveEntry}
          size="lg"
          className="w-full"
        >
          <Save className="h-5 w-5 mr-2" />
          Sauvegarder cette entrée
        </Button>
      )}
    </div>
  );
};

export default B2CVoiceJournalEnhanced;