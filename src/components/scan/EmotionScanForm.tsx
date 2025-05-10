
import React, { useState } from 'react';
import EmotionScanner from './EmotionScanner';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EmotionScanFormProps {
  onScanSaved: () => void;
  onClose: () => void;
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({
  onScanSaved,
  onClose
}) => {
  const [text, setText] = useState('');
  const [emojis, setEmojis] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleAnalyze = async () => {
    if (!text && !emojis && !audioUrl) return;
    
    setIsAnalyzing(true);
    
    // Simulation d'analyse
    setTimeout(() => {
      setIsAnalyzing(false);
      onScanSaved();
    }, 1500);
  };
  
  return (
    <div className="relative">
      <div className="absolute top-0 right-0">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <h2 className="text-2xl font-semibold mb-6">Scanner mon émotion</h2>
      
      <EmotionScanner
        text={text}
        emojis={emojis}
        audioUrl={audioUrl}
        onTextChange={setText}
        onEmojiChange={setEmojis}
        onAudioChange={setAudioUrl}
        onAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
};

export default EmotionScanForm;
