
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { analyzeEmotion } from '@/lib/scanService';
import { EmotionResult } from '@/types/emotion';
import { Loader2 } from 'lucide-react';

interface TextEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
}

const TextEmotionScanner: React.FC<TextEmotionScannerProps> = ({ onResult }) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast({
        title: "Text required",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeEmotion(text);
      
      if (onResult) {
        onResult(result);
      }
      
      toast({
        title: "Analysis complete",
        description: `Detected emotion: ${result.emotion}`,
      });
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast({
        title: "Analysis failed",
        description: "Could not analyze your emotional state. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Describe how you're feeling right now..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          This information will be used to analyze your emotional state. The more details you provide, the more accurate the analysis will be.
        </p>
      </div>
      
      <Button type="submit" disabled={isAnalyzing || !text.trim()} className="w-full">
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze My Emotions"
        )}
      </Button>
    </form>
  );
};

export default TextEmotionScanner;
