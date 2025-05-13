
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Smile, Mic, Webcam, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import TextEmotionScanner from './TextEmotionScanner';
import EmojiEmotionScanner from './EmojiEmotionScanner';
import AudioEmotionScanner from './AudioEmotionScanner';
import FacialEmotionScanner from './FacialEmotionScanner';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { analyzeEmotion, saveEmotion } from '@/lib/scanService';
import { EmotionResult } from '@/types';

interface UnifiedEmotionCheckinProps {
  onScanComplete?: (result: EmotionResult) => void;
  className?: string;
}

const UnifiedEmotionCheckin: React.FC<UnifiedEmotionCheckinProps> = ({
  onScanComplete,
  className
}) => {
  const [activeTab, setActiveTab] = useState<string>("facial");
  const [text, setText] = useState('');
  const [emojis, setEmojis] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleFacialEmotionDetected = (emotionResult: any, emotionData: any) => {
    // This can auto-update text and emoji fields based on facial expression
    if (emotionResult.dominantEmotion) {
      // Map the emotion to relevant emoji
      const emotionToEmoji: Record<string, string> = {
        'happy': '😊',
        'sad': '😔',
        'angry': '😠',
        'fearful': '😨',
        'surprised': '😲',
        'disgusted': '🤢',
        'neutral': '😐',
        'calm': '😌'
      };
      
      const emoji = emotionToEmoji[emotionResult.dominantEmotion] || '😐';
      
      // Add the emoji if not already present
      if (!emojis.includes(emoji)) {
        setEmojis(prev => prev + emoji);
      }
    }
  };
  
  const handleAnalyze = async () => {
    if (!user?.id) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour enregistrer vos émotions.",
        variant: "destructive"
      });
      return;
    }
    
    if (!text && !emojis && !audioUrl && activeTab !== 'facial') {
      toast({
        title: "Données insuffisantes",
        description: "Veuillez fournir du texte, des emojis ou un enregistrement audio pour l'analyse.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Analyze emotion based on input data
      const result = await analyzeEmotion({
        user_id: user.id,
        text,
        emojis,
        audio_url: audioUrl || undefined,
        is_confidential: false,
        share_with_coach: true
      });
      
      if (result) {
        // Save the emotion
        await saveEmotion({
          user_id: user.id,
          date: new Date().toISOString(),
          emotion: result.emotion,
          score: result.score,
          text: text || result.text || undefined,
          emojis: emojis || result.emojis || undefined,
          audio_url: audioUrl || undefined,
          ai_feedback: result.feedback || result.ai_feedback
        });
        
        toast({
          title: "Analyse complétée",
          description: `Votre émotion dominante : ${result.emotion}`,
        });
        
        // Callback with the result
        if (onScanComplete) {
          onScanComplete(result);
        }
        
        // Clear form fields
        setText('');
        setEmojis('');
        setAudioUrl(null);
      }
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Une erreur s'est produite lors de l'analyse. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Check-in émotionnel</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="facial" className="flex flex-col py-2 px-1 h-auto items-center">
              <Webcam className="h-4 w-4 mb-1" />
              <span className="text-xs">Facial</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex flex-col py-2 px-1 h-auto items-center">
              <MessageSquare className="h-4 w-4 mb-1" />
              <span className="text-xs">Texte</span>
            </TabsTrigger>
            <TabsTrigger value="emoji" className="flex flex-col py-2 px-1 h-auto items-center">
              <Smile className="h-4 w-4 mb-1" />
              <span className="text-xs">Emoji</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex flex-col py-2 px-1 h-auto items-center">
              <Mic className="h-4 w-4 mb-1" />
              <span className="text-xs">Audio</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="facial">
            <FacialEmotionScanner 
              onEmotionDetected={handleFacialEmotionDetected}
              autoStart={true}
              className="border-none shadow-none"
            />
            <div className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    "Enregistrer cette émotion"
                  )}
                </Button>
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="text">
            <TextEmotionScanner 
              text={text}
              onTextChange={setText}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </TabsContent>
          
          <TabsContent value="emoji">
            <EmojiEmotionScanner 
              emojis={emojis}
              onEmojiChange={setEmojis}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </TabsContent>
          
          <TabsContent value="audio">
            <AudioEmotionScanner 
              audioUrl={audioUrl}
              onAudioChange={setAudioUrl}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UnifiedEmotionCheckin;
