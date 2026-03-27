// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mic, Camera, Type, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { EmotionResult } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface EmotionScanFormProps {
  onComplete: (result: EmotionResult) => void;
  onClose: () => void;
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({ onComplete, onClose }) => {
  const [step, setStep] = useState(1);
  const [scanType, setScanType] = useState<'text' | 'voice' | 'facial'>('text');
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('emotion-analysis', {
        body: {
          type: scanType,
          content: textInput,
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;

      const emotionResult: EmotionResult = {
        id: crypto.randomUUID(),
        emotion: data.emotion || 'neutral',
        intensity: data.intensity || 5,
        confidence: data.confidence || 0.8,
        timestamp: new Date().toISOString(),
        source: scanType,
        text: textInput,
        ai_feedback: data.ai_feedback || 'Analyse effectuée avec succès'
      };

      setResult(emotionResult);
      setStep(3);
    } catch (error) {
      // Emotion analysis error
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleComplete = () => {
    if (result) {
      onComplete(result);
    }
    onClose();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Analyse émotionnelle {step === 1 && '- Choix du type'}
          {step === 2 && '- Saisie'}
          {step === 3 && '- Résultats'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { type: 'text' as const, icon: Type, label: 'Analyse textuelle', desc: 'Analysez vos émotions à partir de texte' },
              { type: 'voice' as const, icon: Mic, label: 'Analyse vocale', desc: 'Analysez vos émotions à partir de votre voix' },
              { type: 'facial' as const, icon: Camera, label: 'Analyse faciale', desc: 'Analysez vos émotions via votre webcam' }
            ].map(({ type, icon: Icon, label, desc }) => (
              <motion.div
                key={type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${scanType === type ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                  onClick={() => setScanType(type)}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium mb-1">{label}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Badge variant="outline" className="mb-4">
              Mode : {scanType === 'text' ? 'Textuel' : scanType === 'voice' ? 'Vocal' : 'Facial'}
            </Badge>
            
            {scanType === 'text' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Décrivez comment vous vous sentez
                </label>
                <Textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Parlez-moi de votre état émotionnel actuel..."
                  rows={4}
                />
              </div>
            )}
            
            {scanType === 'voice' && (
              <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg">
                <Mic className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Fonction vocale en développement</p>
                <p className="text-sm text-muted-foreground mt-2">Utilisez le mode textuel pour le moment</p>
              </div>
            )}
            
            {scanType === 'facial' && (
              <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg">
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Fonction de reconnaissance faciale en développement</p>
                <p className="text-sm text-muted-foreground mt-2">Utilisez le mode textuel pour le moment</p>
              </div>
            )}
          </div>
        )}

        {step === 3 && result && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-2">{result.emotion === 'happy' ? '😊' : result.emotion === 'sad' ? '😢' : '😐'}</div>
              <h3 className="text-xl font-semibold">Émotion détectée : {result.emotion}</h3>
              <p className="text-muted-foreground">Intensité : {result.intensity}/10</p>
              <p className="text-muted-foreground">Confiance : {Math.round((typeof result.confidence === 'number' ? result.confidence : 0.5) * 100)}%</p>
            </div>
            
            {result.ai_feedback && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Analyse IA</h4>
                <p className="text-sm">{result.ai_feedback}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Retour
            </Button>
          )}
          
          <div className="ml-auto space-x-2">
            <Button variant="ghost" onClick={onClose}>
              Annuler
            </Button>
            
            {step === 1 && (
              <Button onClick={() => setStep(2)}>
                Continuer
              </Button>
            )}
            
            {step === 2 && scanType === 'text' && (
              <Button 
                onClick={handleAnalyze}
                disabled={!textInput.trim() || isAnalyzing}
              >
                {isAnalyzing ? 'Analyse...' : 'Analyser'}
              </Button>
            )}
            
            {step === 3 && (
              <Button onClick={handleComplete}>
                Terminer
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionScanForm;
