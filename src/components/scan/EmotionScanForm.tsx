
import React, { useState } from 'react';
import { EmotionResult } from '@/types/emotion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smile, Film, Mic, Send } from 'lucide-react';

interface EmotionScanFormProps {
  onScanComplete: (result: EmotionResult) => void;
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({ onScanComplete }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('text');

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulons une analyse d'émotion
    setTimeout(() => {
      const result: EmotionResult = {
        emotion: 'calm',
        confidence: 0.85,
        secondaryEmotions: ['focused', 'relaxed'],
        timestamp: new Date().toISOString(),
        source: 'text',
        text: text
      };
      
      onScanComplete(result);
      setLoading(false);
      setText('');
    }, 1500);
  };

  const handleVoiceAnalysis = () => {
    setLoading(true);
    
    // Simulons une analyse vocale
    setTimeout(() => {
      const result: EmotionResult = {
        emotion: 'happy',
        confidence: 0.92,
        secondaryEmotions: ['excited', 'energetic'],
        timestamp: new Date().toISOString(),
        source: 'voice'
      };
      
      onScanComplete(result);
      setLoading(false);
    }, 2000);
  };

  const handleFacialAnalysis = () => {
    setLoading(true);
    
    // Simulons une analyse faciale
    setTimeout(() => {
      const result: EmotionResult = {
        emotion: 'focused',
        confidence: 0.78,
        secondaryEmotions: ['calm', 'neutral'],
        timestamp: new Date().toISOString(),
        source: 'facial'
      };
      
      onScanComplete(result);
      setLoading(false);
    }, 2500);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Comment vous sentez-vous ?</CardTitle>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Texte</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">Voix</span>
          </TabsTrigger>
          <TabsTrigger value="facial" className="flex items-center gap-2">
            <Film className="w-4 h-4" />
            <span className="hidden sm:inline">Visage</span>
          </TabsTrigger>
        </TabsList>
        <CardContent>
          <TabsContent value="text">
            <form onSubmit={handleTextSubmit}>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Décrivez comment vous vous sentez en ce moment..."
                className="resize-none min-h-[120px]"
              />
              <div className="mt-4 flex justify-end">
                <Button type="submit" disabled={!text.trim() || loading}>
                  {loading ? 'Analyse...' : 'Analyser'}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="voice">
            <div className="text-center py-6">
              <Button
                variant="outline" 
                size="lg"
                className="rounded-full h-20 w-20 flex items-center justify-center"
                onClick={handleVoiceAnalysis}
                disabled={loading}
              >
                <Mic className={`h-8 w-8 ${loading ? 'animate-pulse' : ''}`} />
              </Button>
              <p className="mt-4">{loading ? 'Analyse vocale en cours...' : 'Cliquez pour commencer l\'analyse vocale'}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="facial">
            <div className="text-center py-6">
              <Button 
                variant="outline"
                size="lg"
                className="rounded-full h-20 w-20 flex items-center justify-center"
                onClick={handleFacialAnalysis}
                disabled={loading}
              >
                <Film className={`h-8 w-8 ${loading ? 'animate-pulse' : ''}`} />
              </Button>
              <p className="mt-4">{loading ? 'Analyse faciale en cours...' : 'Cliquez pour activer la caméra'}</p>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          <Smile className="inline-block mr-1 h-4 w-4" />
          L'analyse émotionnelle est confidentielle
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmotionScanForm;
