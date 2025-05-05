
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EmojiSelector from './EmojiSelector';
import EmotionTextInput from './EmotionTextInput';
import AudioRecorder from './AudioRecorder';
import AnalysisDialog from './AnalysisDialog';
import { analyzeEmotion } from '@/lib/scan/analyzeService';
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from 'lucide-react';

export interface EmotionScanFormProps {
  onScanSaved: () => void;
  onClose?: () => void;
  onSaveComplete?: () => void; // Added for ScanPage.tsx compatibility
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({ 
  onScanSaved, 
  onClose, 
  onSaveComplete 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('text');
  const [emojis, setEmojis] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [isConfidential, setIsConfidential] = useState<boolean>(false);
  const [shareWithCoach, setShareWithCoach] = useState<boolean>(true);
  const [charCount, setCharCount] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [quickMode, setQuickMode] = useState<boolean>(false);
  const [skipDay, setSkipDay] = useState<boolean>(false);
  const MAX_CHARS = 500;

  const handleEmojiClick = (emoji: string) => {
    if (quickMode) {
      setEmojis(emoji);
      handleQuickSubmit(emoji);
    } else {
      setEmojis(prev => prev + emoji);
    }
  };

  const handleTextChange = (value: string) => {
    if (value.length <= MAX_CHARS) {
      setText(value);
      setCharCount(value.length);
    }
  };

  const handleQuickSubmit = async (emojiValue: string) => {
    setAnalyzing(true);
    
    try {
      // Fixed type issue: pass object to analyzeEmotion
      const result = await analyzeEmotion({
        user_id: user?.id || '',
        emojis: emojiValue,
        is_confidential: isConfidential,
        share_with_coach: shareWithCoach
      });
      
      setAnalysisResult(result);
      
      toast({
        title: "Scan rapide complété",
        description: `Votre état émotionnel: ${result.emotion}`,
      });
      
      onScanSaved();
      if (onSaveComplete) onSaveComplete();
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser votre état émotionnel. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!emojis && !text && !audioUrl) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez ajouter au moins un emoji, du texte ou un enregistrement audio.",
        variant: "destructive"
      });
      return;
    }

    try {
      setAnalyzing(true);
      
      // Fixed type issue: pass object to analyzeEmotion
      const result = await analyzeEmotion({
        user_id: user?.id || '',
        emojis,
        text,
        audio_url: audioUrl,
        is_confidential: isConfidential,
        share_with_coach: shareWithCoach
      });
      
      setAnalysisResult(result);
      
      toast({
        title: "Analyse complétée",
        description: `Votre état émotionnel: ${result.emotion}`,
      });
      
      onScanSaved();
      if (onSaveComplete) onSaveComplete();
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser votre état émotionnel. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCorrection = () => {
    setActiveTab('text');
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Nouveau scan émotionnel</h2>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="quickMode"
              checked={quickMode}
              onChange={() => setQuickMode(!quickMode)}
              className="rounded border-gray-300"
            />
            <label htmlFor="quickMode" className="text-sm">Mode rapide</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="skipDay"
              checked={skipDay}
              onChange={() => setSkipDay(!skipDay)}
              className="rounded border-gray-300"
            />
            <label htmlFor="skipDay" className="text-sm">Sauter un jour</label>
          </div>
          
          {onClose && (
            <Button variant="ghost" onClick={onClose}>
              Annuler
            </Button>
          )}
        </div>
      </div>

      {analysisResult ? (
        <div className="space-y-6 bg-card p-6 rounded-lg border">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Résultat de l'analyse</h3>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
              Confiance: {Math.round(analysisResult.confidence * 100)}%
            </Badge>
          </div>
          
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Émotion détectée</p>
              <p className="text-2xl font-bold">{analysisResult.emotion}</p>
            </div>
            
            {analysisResult.transcript && (
              <div>
                <p className="text-muted-foreground text-sm">Texte analysé</p>
                <p className="italic">"{analysisResult.transcript}"</p>
              </div>
            )}
          </div>
          
          <Button 
            variant="outline"
            className="gap-2"
            onClick={handleCorrection}
          >
            <AlertCircle className="h-4 w-4" />
            Ce n'est pas ce que je ressens
          </Button>
        </div>
      ) : (
        <>
          {quickMode ? (
            <div className="p-6 bg-card rounded-lg border">
              <p className="mb-4 text-sm text-muted-foreground">Sélectionnez un emoji qui représente votre humeur</p>
              <EmojiSelector 
                emojis={emojis} 
                onEmojiClick={handleEmojiClick} 
                onClear={() => setEmojis('')}
              />
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="text">Texte</TabsTrigger>
                <TabsTrigger value="emoji">Emoji</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4 pt-4">
                <EmotionTextInput 
                  value={text} 
                  onChange={handleTextChange}
                  maxChars={MAX_CHARS} 
                />
                <div className="text-right text-sm text-muted-foreground">
                  {charCount}/{MAX_CHARS} caractères
                </div>
              </TabsContent>
              
              <TabsContent value="emoji" className="space-y-4 pt-4">
                <EmojiSelector 
                  emojis={emojis} 
                  onEmojiClick={handleEmojiClick} 
                  onClear={() => setEmojis('')}
                />
              </TabsContent>
              
              <TabsContent value="audio" className="space-y-4 pt-4">
                <AudioRecorder 
                  audioUrl={audioUrl} 
                  setAudioUrl={setAudioUrl} 
                />
              </TabsContent>
            </Tabs>
          )}

          {!quickMode && (
            <>
              <div className="space-y-4 mt-6 border-t pt-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="confidential"
                      checked={isConfidential}
                      onChange={() => setIsConfidential(!isConfidential)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="confidential" className="text-sm">Confidentiel</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="shareWithCoach"
                      checked={shareWithCoach}
                      onChange={() => setShareWithCoach(!shareWithCoach)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="shareWithCoach" className="text-sm">Partager avec Coach</label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                {onClose && (
                  <Button variant="outline" onClick={onClose}>
                    Annuler
                  </Button>
                )}
                <Button 
                  onClick={handleSubmit} 
                  disabled={analyzing} 
                  className="bg-wellness-coral hover:bg-wellness-coral/90 text-white"
                >
                  {analyzing ? "Analyse en cours..." : "Analyser mon état"}
                </Button>
              </div>
            </>
          )}
        </>
      )}

      <AnalysisDialog 
        open={analyzing} 
        onOpenChange={(open) => !open && setAnalyzing(false)} 
      />
    </div>
  );
};

export default EmotionScanForm;
