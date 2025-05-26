
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { EmotionResult } from '@/types/emotions';
import { useEmotionScan } from '@/hooks/useEmotionScan';
import { Mic, Camera, Type, X } from 'lucide-react';

interface EmotionScanFormProps {
  onComplete: (result: EmotionResult) => void;
  onClose: () => void;
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({ onComplete, onClose }) => {
  const [text, setText] = useState('');
  const [scanType, setScanType] = useState<'text' | 'voice' | 'image'>('text');
  const { scanEmotion, isScanning } = useEmotionScan();

  const handleScan = async () => {
    try {
      const result = await scanEmotion({
        text: scanType === 'text' ? text : undefined,
        type: scanType
      });
      onComplete(result);
    } catch (error) {
      console.error('Scan failed:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Analyse émotionnelle
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={scanType === 'text' ? 'default' : 'outline'}
            onClick={() => setScanType('text')}
            size="sm"
          >
            <Type className="mr-2 h-4 w-4" />
            Texte
          </Button>
          <Button
            variant={scanType === 'voice' ? 'default' : 'outline'}
            onClick={() => setScanType('voice')}
            size="sm"
          >
            <Mic className="mr-2 h-4 w-4" />
            Audio
          </Button>
          <Button
            variant={scanType === 'image' ? 'default' : 'outline'}
            onClick={() => setScanType('image')}
            size="sm"
          >
            <Camera className="mr-2 h-4 w-4" />
            Image
          </Button>
        </div>

        {scanType === 'text' && (
          <Textarea
            placeholder="Décrivez comment vous vous sentez..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />
        )}

        {scanType === 'voice' && (
          <div className="p-8 border-2 border-dashed rounded-lg text-center">
            <Mic className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p>Cliquez pour commencer l'enregistrement audio</p>
          </div>
        )}

        {scanType === 'image' && (
          <div className="p-8 border-2 border-dashed rounded-lg text-center">
            <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p>Prenez une photo ou sélectionnez une image</p>
          </div>
        )}

        <Button 
          onClick={handleScan} 
          disabled={isScanning || (scanType === 'text' && !text.trim())}
          className="w-full"
        >
          {isScanning ? 'Analyse en cours...' : 'Analyser'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmotionScanForm;
