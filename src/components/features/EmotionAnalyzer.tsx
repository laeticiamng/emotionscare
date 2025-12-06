// @ts-nocheck
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  Camera, 
  Mic, 
  FileText, 
  Smile, 
  Frown, 
  Meh, 
  Heart,
  AlertCircle,
  CheckCircle,
  Loader2,
  Play,
  Square
} from 'lucide-react';
import { emotionsCareApi } from '@/services/emotions-care-api';
import { logger } from '@/lib/logger';

interface EmotionResult {
  emotion: string;
  confidence: number;
  suggestions: string[];
  timestamp: Date;
}

const EmotionAnalyzer: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(null);
  const [analysisType, setAnalysisType] = useState<'text' | 'voice' | 'camera'>('text');

  const handleTextAnalysis = async () => {
    if (!textInput.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await emotionsCareApi.analyzeEmotionText(textInput);
      setEmotionResult({
        emotion: result.emotion || 'Neutre',
        confidence: result.confidence || 0.85,
        suggestions: result.suggestions || ['Prenez une pause de 5 minutes', 'Pratiquez la respiration profonde'],
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Erreur analyse texte', error as Error, 'UI');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulation de l'enregistrement
      setTimeout(async () => {
        setIsRecording(false);
        setIsAnalyzing(true);
        
        try {
          // Simulation d'un blob audio
          const mockBlob = new Blob(['mock audio data'], { type: 'audio/wav' });
          const result = await emotionsCareApi.analyzeVoiceEmotion(mockBlob);
          setEmotionResult({
            emotion: result.emotion || 'Calme',
            confidence: result.confidence || 0.92,
            suggestions: result.suggestions || ['Continuez sur cette voie', 'Maintenez ce niveau de sérénité'],
            timestamp: new Date()
          });
        } catch (error) {
          logger.error('Erreur analyse vocale', error as Error, 'UI');
        } finally {
          setIsAnalyzing(false);
        }
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const getEmotionIcon = (emotion: string) => {
    const emotionIcons = {
      'joie': Smile,
      'tristesse': Frown,
      'colère': AlertCircle,
      'peur': Heart,
      'surprise': CheckCircle,
      'dégoût': Frown,
      'neutre': Meh,
      'calme': Smile,
      'anxieux': AlertCircle,
      'content': Smile
    };
    
    const IconComponent = emotionIcons[emotion.toLowerCase() as keyof typeof emotionIcons] || Meh;
    return IconComponent;
  };

  const getEmotionColor = (emotion: string) => {
    const emotionColors = {
      'joie': 'text-yellow-500 bg-yellow-100',
      'tristesse': 'text-blue-500 bg-blue-100',
      'colère': 'text-red-500 bg-red-100',
      'peur': 'text-purple-500 bg-purple-100',
      'calme': 'text-green-500 bg-green-100',
      'anxieux': 'text-orange-500 bg-orange-100'
    };
    
    return emotionColors[emotion.toLowerCase() as keyof typeof emotionColors] || 'text-gray-500 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Sélection du type d'analyse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Analyse Émotionnelle IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={analysisType === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAnalysisType('text')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Texte
            </Button>
            <Button
              variant={analysisType === 'voice' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAnalysisType('voice')}
            >
              <Mic className="h-4 w-4 mr-2" />
              Voix
            </Button>
            <Button
              variant={analysisType === 'camera' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAnalysisType('camera')}
              disabled
            >
              <Camera className="h-4 w-4 mr-2" />
              Caméra (Bientôt)
            </Button>
          </div>

          {/* Interface d'analyse par texte */}
          {analysisType === 'text' && (
            <div className="space-y-3">
              <Textarea
                placeholder="Décrivez vos sentiments actuels... Comment vous sentez-vous aujourd'hui ?"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-24"
              />
              <Button 
                onClick={handleTextAnalysis}
                disabled={!textInput.trim() || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyser mes émotions
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Interface d'analyse vocale */}
          {analysisType === 'voice' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <motion.div
                  className={`p-6 rounded-full ${isRecording ? 'bg-red-100' : 'bg-primary/10'}`}
                  animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: isRecording ? Infinity : 0, duration: 1 }}
                >
                  <Mic className={`h-8 w-8 ${isRecording ? 'text-red-500' : 'text-primary'}`} />
                </motion.div>
              </div>
              
              <Button 
                onClick={handleVoiceRecording}
                disabled={isAnalyzing}
                variant={isRecording ? 'destructive' : 'default'}
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyse en cours...
                  </>
                ) : isRecording ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Arrêter l'enregistrement
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Commencer l'enregistrement
                  </>
                )}
              </Button>
              
              {isRecording && (
                <p className="text-sm text-muted-foreground">
                  Parlez naturellement pendant 10-15 secondes...
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats de l'analyse */}
      {emotionResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Résultat de l'Analyse</span>
                <Badge variant="outline" className="text-xs">
                  {emotionResult.timestamp.toLocaleTimeString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {React.createElement(getEmotionIcon(emotionResult.emotion), {
                  className: `h-12 w-12 p-2 rounded-full ${getEmotionColor(emotionResult.emotion)}`
                })}
                <div className="flex-1">
                  <div className="text-2xl font-bold capitalize">
                    {emotionResult.emotion}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Confiance: {Math.round(emotionResult.confidence * 100)}%
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Recommandations:</h4>
                <ul className="space-y-1">
                  {emotionResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default EmotionAnalyzer;