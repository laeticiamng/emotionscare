
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { EmotionResult } from '@/types';

interface TextEmotionScannerProps {
  onScan: (text: string) => Promise<EmotionResult>;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({ onScan }) => {
  const [text, setText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setText(value);
      setCharCount(value.length);
    }
  };

  const handleScan = async () => {
    if (!text.trim()) return;
    
    try {
      setIsScanning(true);
      await onScan(text);
    } catch (error) {
      console.error('Error scanning text:', error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <Textarea 
            placeholder="Décrivez comment vous vous sentez..."
            value={text}
            onChange={handleTextChange}
            className="min-h-[150px]"
            disabled={isScanning}
          />
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {charCount}/{maxChars} caractères
            </span>
            
            <Button 
              onClick={handleScan} 
              disabled={isScanning || !text.trim()}
              className="relative"
            >
              {isScanning ? (
                <>
                  <span className="animate-pulse">Analyse en cours...</span>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full"></span>
                </>
              ) : (
                'Analyser'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextEmotionScanner;
