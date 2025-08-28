import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Volume2, PlayCircle, Square } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoiceScanComponentProps {
  onResults: (results: any) => void;
  isScanning: boolean;
}

const VoiceScanComponent: React.FC<VoiceScanComponentProps> = ({ onResults, isScanning }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [volume, setVolume] = useState(0);
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioData(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Simuler le niveau de volume
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        setVolume(Math.random() * 100);
      }, 100);

    } catch (error) {
      console.error('Erreur lors de l\'accès au microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const playRecording = () => {
    if (audioData) {
      const audio = new Audio(URL.createObjectURL(audioData));
      audio.play();
    }
  };

  const analyzeVoice = () => {
    if (audioData) {
      // Simulation d'analyse vocale
      setTimeout(() => {
        onResults({
          type: 'voice',
          confidence: 92,
          emotions: {
            'Joie': 78,
            'Confiance': 85,
            'Calme': 65,
            'Énergie': 72,
            'Anxiété': 15
          },
          voiceMetrics: {
            pitch: 'Normal',
            tempo: 'Modéré',
            clarity: 'Excellente',
            emotion: 'Positive'
          }
        });
      }, 2000);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Analyse Vocale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <motion.div
            className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center ${
              isRecording ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'
            }`}
            animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {isRecording ? (
              <MicOff className="h-12 w-12 text-red-500" />
            ) : (
              <Mic className="h-12 w-12 text-blue-500" />
            )}
          </motion.div>
        </div>

        {isRecording && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Enregistrement... {Math.floor(recordingTime / 10)}s
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm">Niveau audio:</p>
              <Progress value={volume} className="w-full" />
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4">
          {!isRecording ? (
            <Button onClick={startRecording} className="w-full">
              <Mic className="mr-2 h-4 w-4" />
              Commencer l'enregistrement
            </Button>
          ) : (
            <Button onClick={stopRecording} variant="destructive" className="w-full">
              <Square className="mr-2 h-4 w-4" />
              Arrêter l'enregistrement
            </Button>
          )}
        </div>

        {audioData && !isRecording && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={playRecording} variant="outline" className="flex-1">
                <PlayCircle className="mr-2 h-4 w-4" />
                Écouter
              </Button>
              <Button onClick={analyzeVoice} className="flex-1" disabled={isScanning}>
                Analyser
              </Button>
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Conseils pour une meilleure analyse</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Parlez naturellement pendant 10-15 secondes</li>
            <li>• Décrivez votre journée ou vos ressentis</li>
            <li>• Assurez-vous d'être dans un endroit calme</li>
            <li>• Rapprochez-vous du microphone</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceScanComponent;