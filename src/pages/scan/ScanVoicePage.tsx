import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Brain, Activity } from 'lucide-react';

export const ScanVoicePage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simuler niveau audio
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      setTimeout(() => {
        clearInterval(interval);
        setIsRecording(false);
        setIsAnalyzing(true);
        setTimeout(() => setIsAnalyzing(false), 2000);
      }, 5000);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Analyse Vocale Émotionnelle
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <motion.div
            animate={{ scale: isRecording ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: isRecording ? Infinity : 0, duration: 2 }}
          >
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              className="h-20 w-20 rounded-full"
              onClick={toggleRecording}
              disabled={isAnalyzing}
            >
              {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>
          </motion.div>
          
          {isRecording && (
            <div className="space-y-2">
              <div>Niveau audio</div>
              <Progress value={audioLevel} className="h-2" />
            </div>
          )}
          
          <div className="text-sm">
            {isRecording ? "Enregistrement en cours..." : 
             isAnalyzing ? "Analyse des émotions..." : 
             "Cliquez pour commencer l'analyse vocale"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanVoicePage;