
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionResult } from '@/types/emotions';
import { Loader2, Mic, Type, Image } from 'lucide-react';

interface EmotionScanFormProps {
  onComplete: (result: EmotionResult) => void;
  onClose: () => void;
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({ onComplete, onClose }) => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanType, setScanType] = useState<'text' | 'voice' | 'image'>('text');

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    
    try {
      // Simulation d'analyse
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: EmotionResult = {
        id: Math.random().toString(36),
        userId: 'current-user',
        timestamp: new Date(),
        overallMood: 'positive',
        emotions: [
          { emotion: 'joie', confidence: 0.8, intensity: 0.7 },
          { emotion: 'sérénité', confidence: 0.6, intensity: 0.5 }
        ],
        dominantEmotion: 'joie',
        confidence: 0.8,
        source: scanType,
        recommendations: ['Continuer sur cette lancée positive'],
        metadata: {
          inputLength: inputText.length,
          processingTime: 2000
        }
      };
      
      onComplete(mockResult);
      onClose();
    } catch (error) {
      console.error('Erreur analyse:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Analyse Émotionnelle</span>
          {scanType === 'text' && <Type className="w-5 h-5" />}
          {scanType === 'voice' && <Mic className="w-5 h-5" />}
          {scanType === 'image' && <Image className="w-5 h-5" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={scanType === 'text' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setScanType('text')}
          >
            <Type className="w-4 h-4 mr-2" />
            Texte
          </Button>
          <Button
            variant={scanType === 'voice' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setScanType('voice')}
          >
            <Mic className="w-4 h-4 mr-2" />
            Vocal
          </Button>
          <Button
            variant={scanType === 'image' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setScanType('image')}
          >
            <Image className="w-4 h-4 mr-2" />
            Image
          </Button>
        </div>

        <Textarea
          placeholder="Décrivez comment vous vous sentez..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={4}
          disabled={isAnalyzing}
        />

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isAnalyzing}>
            Annuler
          </Button>
          <Button 
            onClick={handleAnalyze} 
            disabled={!inputText.trim() || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyse...
              </>
            ) : (
              'Analyser'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionScanForm;
