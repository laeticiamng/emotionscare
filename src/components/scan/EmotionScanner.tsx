
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScanIcon, Mic, FileText } from "lucide-react";
import AudioRecorder from "./AudioRecorder";
import EmotionScanResult from "./EmotionScanResult";
import { useAuth } from '@/contexts/AuthContext';
import { analyzeEmotion } from '@/lib/scanService';
import { EmotionResult } from '@/types';

interface Props {
  onEmotionDetected?: (emotion: string) => void;
}

const EmotionScanner: React.FC<Props> = ({ onEmotionDetected }) => {
  const [activeTab, setActiveTab] = useState<string>("text");
  const [text, setText] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const { user } = useAuth();

  const resetForm = () => {
    setText("");
    setAudioUrl(null);
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    
    if (!text && !audioUrl) {
      // No input to analyze
      return;
    }
    
    setLoading(true);
    
    try {
      const analysisResult = await analyzeEmotion({
        user_id: user.id,
        text: text || undefined,
        audio_url: audioUrl || undefined,
      });
      
      setResult(analysisResult);
      
      if (onEmotionDetected) {
        onEmotionDetected(analysisResult.emotion);
      }
    } catch (error) {
      console.error("Error analyzing emotion:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);

  return (
    <div className="space-y-6">
      {!result ? (
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Texte</span>
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span>Audio</span>
              </TabsTrigger>
            </TabsList>
            <div className="mt-4">
              <TabsContent value="text" className="space-y-4">
                <Textarea 
                  placeholder="Décrivez votre état émotionnel actuel..."
                  value={text}
                  onChange={handleTextChange}
                  rows={5}
                />
              </TabsContent>
              <TabsContent value="audio" className="space-y-4">
                <AudioRecorder audioUrl={audioUrl} setAudioUrl={setAudioUrl} />
              </TabsContent>
            </div>
          </Tabs>
          
          <div className="mt-6 flex justify-end">
            <Button 
              type="submit" 
              disabled={loading || (!text && !audioUrl)}
              className="flex items-center gap-2"
            >
              <ScanIcon className="h-4 w-4" />
              {loading ? "Analyse en cours..." : "Analyser"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <EmotionScanResult result={result} />
          <div className="flex justify-end">
            <Button onClick={resetForm} variant="outline">
              Nouvelle analyse
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionScanner;
