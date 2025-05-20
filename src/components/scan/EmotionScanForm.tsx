
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { EmotionResult } from '@/types';
import { enhancedAnalyzeService } from '@/lib/scan';

interface EmotionScanFormProps {
  onComplete: (result: EmotionResult) => void;
  onScanSaved?: () => void;
  onClose: () => void;
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({
  onComplete,
  onScanSaved,
  onClose
}) => {
  const { toast } = useToast();
  const [scanType, setScanType] = useState<'text' | 'voice' | 'face'>('text');
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleTextAnalysis = async () => {
    if (!textInput.trim()) {
      toast({
        title: "Texte manquant",
        description: "Veuillez saisir un texte pour l'analyse émotionnelle.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await enhancedAnalyzeService.analyzeEmotion(textInput);
      
      toast({
        title: "Analyse complétée",
        description: "Votre analyse émotionnelle est prête.",
        variant: "default"
      });
      
      onComplete(result);
      
      if (onScanSaved) {
        onScanSaved();
      }
    } catch (error) {
      console.error("Erreur d'analyse émotionnelle:", error);
      toast({
        title: "Erreur d'analyse",
        description: "Une erreur s'est produite lors de l'analyse émotionnelle.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Nouvelle analyse émotionnelle</h3>
      
      <Tabs defaultValue="text" className="mt-4">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="text" onClick={() => setScanType('text')}>Texte</TabsTrigger>
          <TabsTrigger value="voice" onClick={() => setScanType('voice')}>Voix</TabsTrigger>
          <TabsTrigger value="face" onClick={() => setScanType('face')}>Visage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <textarea 
            className="w-full p-3 border rounded-md mb-4 h-32"
            placeholder="Comment vous sentez-vous aujourd'hui ?"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            <Button 
              onClick={handleTextAnalysis}
              disabled={isAnalyzing || !textInput.trim()}
            >
              {isAnalyzing ? "Analyse en cours..." : "Analyser"}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="voice">
          <div className="text-center py-8">
            <p className="mb-4">La fonctionnalité d'analyse vocale sera bientôt disponible.</p>
            <Button variant="outline" onClick={onClose}>Retour</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="face">
          <div className="text-center py-8">
            <p className="mb-4">La fonctionnalité d'analyse faciale sera bientôt disponible.</p>
            <Button variant="outline" onClick={onClose}>Retour</Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default EmotionScanForm;
