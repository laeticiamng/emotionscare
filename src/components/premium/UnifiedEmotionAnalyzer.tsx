/**
 * 🧠 UNIFIED EMOTION ANALYZER PREMIUM
 * Composant unifié et accessible pour l'analyse émotionnelle
 * Intègre toutes les méthodes: texte, voix, emoji, facial
 */

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Mic, 
  MicOff, 
  Camera, 
  MessageSquare, 
  Smile,
  Loader2,
  CheckCircle,
  AlertCircle,
  Zap,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useUnifiedEmotion } from '@/hooks/useUnifiedEmotion';
import { useAccessibility } from '@/hooks/useAccessibility';
import { toast } from 'sonner';

interface UnifiedEmotionAnalyzerProps {
  onAnalysisComplete?: (result: any) => void;
  showRecommendations?: boolean;
  enableAllMethods?: boolean;
  compact?: boolean;
  autoAnalyze?: boolean;
}

const ANALYSIS_METHODS = [
  {
    id: 'text',
    name: 'Analyse Textuelle',
    icon: MessageSquare,
    description: 'Analysez vos émotions à partir de votre texte',
    shortcut: 'T'
  },
  {
    id: 'voice',
    name: 'Analyse Vocale',
    icon: Mic,
    description: 'Détection émotionnelle par analyse vocale',
    shortcut: 'V'
  },
  {
    id: 'emoji',
    name: 'Sélection Emoji',
    icon: Smile,
    description: 'Exprimez votre émotion avec des emojis',
    shortcut: 'E'
  },
  {
    id: 'facial',
    name: 'Reconnaissance Faciale',
    icon: Camera,
    description: 'Analyse des expressions faciales',
    shortcut: 'F'
  }
] as const;

const EMOTION_COLORS = {
  happy: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
  sad: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
  angry: 'bg-red-500/20 text-red-700 border-red-500/30',
  fear: 'bg-purple-500/20 text-purple-700 border-purple-500/30',
  surprise: 'bg-green-500/20 text-green-700 border-green-500/30',
  neutral: 'bg-gray-500/20 text-gray-700 border-gray-500/30'
};

export const UnifiedEmotionAnalyzer: React.FC<UnifiedEmotionAnalyzerProps> = ({
  onAnalysisComplete,
  showRecommendations = true,
  enableAllMethods = true,
  compact = false,
  autoAnalyze = false
}) => {
  const [activeMethod, setActiveMethod] = useState<string>('text');
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { 
    analyzeText, 
    analyzeVoice, 
    analyzeEmoji,
    analyzeFacial,
    isAnalyzing, 
    lastResult,
    recommendations,
    insights
  } = useUnifiedEmotion();
  
  const { announce, generateId } = useAccessibility();

  // Gestion des raccourcis clavier
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const method = ANALYSIS_METHODS.find(m => 
          m.shortcut.toLowerCase() === e.key.toLowerCase()
        );
        if (method && (enableAllMethods || method.id === 'text')) {
          e.preventDefault();
          setActiveMethod(method.id);
          announce(`Méthode d'analyse changée vers ${method.name}`, 'polite');
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [enableAllMethods, announce]);

  const handleAnalysis = useCallback(async () => {
    try {
      let result;
      
      switch (activeMethod) {
        case 'text':
          if (!textInput.trim()) {
            toast.error('Veuillez saisir un texte à analyser');
            return;
          }
          result = await analyzeText(textInput);
          break;
          
        case 'voice':
          setIsRecording(true);
          result = await analyzeVoice();
          setIsRecording(false);
          break;
          
        case 'emoji':
          // Ouvre un sélecteur d'emojis
          result = await analyzeEmoji();
          break;
          
        case 'facial':
          result = await analyzeFacial();
          break;
          
        default:
          throw new Error('Méthode d\'analyse non supportée');
      }

      if (result) {
        announce(
          `Analyse terminée. Émotion détectée: ${result.emotion} avec ${Math.round(result.confidence * 100)}% de confiance`,
          'assertive'
        );
        onAnalysisComplete?.(result);
        
        if (result.confidence < 0.7) {
          toast.warning('Résultat d\'analyse peu fiable. Essayez une autre méthode.');
        } else {
          toast.success(`Émotion détectée: ${result.emotion}`);
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      toast.error('Erreur lors de l\'analyse émotionnelle');
      announce('Erreur lors de l\'analyse émotionnelle', 'assertive');
    }
  }, [activeMethod, textInput, analyzeText, analyzeVoice, analyzeEmoji, analyzeFacial, onAnalysisComplete, announce]);

  const renderMethodContent = () => {
    switch (activeMethod) {
      case 'text':
        return (
          <div className="space-y-4">
            <Textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Décrivez comment vous vous sentez en ce moment..."
              className="min-h-[120px] resize-none"
              aria-label="Texte à analyser pour détecter les émotions"
              disabled={isAnalyzing}
            />
            {textInput.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {textInput.length} caractères
                {autoAnalyze && textInput.length > 20 && (
                  <span className="ml-2 text-primary">• Auto-analyse activée</span>
                )}
              </div>
            )}
          </div>
        );
        
      case 'voice':
        return (
          <div className="text-center space-y-4">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
              isRecording ? 'bg-red-500/20 animate-pulse' : 'bg-primary/10'
            }`}>
              {isRecording ? (
                <MicOff className="h-8 w-8 text-red-500" />
              ) : (
                <Mic className="h-8 w-8 text-primary" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {isRecording ? 'Enregistrement en cours...' : 'Cliquez pour commencer l\'enregistrement'}
            </p>
            {isRecording && (
              <div className="w-full max-w-xs mx-auto">
                <Progress value={75} className="h-1" />
              </div>
            )}
          </div>
        );
        
      case 'emoji':
        return (
          <div className="grid grid-cols-6 gap-3">
            {['😊', '😢', '😠', '😨', '😮', '😐', '🥰', '😤', '😰', '🤔', '😴', '🤗'].map((emoji, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-12 w-12 text-xl hover:scale-110 transition-transform"
                onClick={() => analyzeEmoji(emoji)}
                disabled={isAnalyzing}
                aria-label={`Sélectionner l'émotion ${emoji}`}
              >
                {emoji}
              </Button>
            ))}
          </div>
        );
        
      case 'facial':
        return (
          <div className="text-center space-y-4">
            <div className="w-48 h-36 mx-auto bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Positionnez votre visage dans le cadre et cliquez pour analyser
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };

  const availableMethods = enableAllMethods 
    ? ANALYSIS_METHODS 
    : ANALYSIS_METHODS.filter(m => m.id === 'text');

  return (
    <div ref={containerRef} className={`space-y-6 ${compact ? 'space-y-4' : ''}`}>
      {/* Method Selection */}
      <Card>
        <CardHeader className={compact ? 'pb-3' : ''}>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Analyse Émotionnelle Premium
            {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Method Tabs */}
          <div className="flex flex-wrap gap-2">
            {availableMethods.map((method) => {
              const Icon = method.icon;
              const isActive = activeMethod === method.id;
              
              return (
                <Button
                  key={method.id}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveMethod(method.id)}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2"
                  aria-pressed={isActive}
                  title={`${method.description} (Ctrl+${method.shortcut})`}
                >
                  <Icon className="h-4 w-4" />
                  {compact ? null : method.name}
                  <kbd className="hidden sm:inline text-xs opacity-60">
                    {method.shortcut}
                  </kbd>
                </Button>
              );
            })}
          </div>

          {/* Method Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMethod}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderMethodContent()}
            </motion.div>
          </AnimatePresence>

          {/* Action Button */}
          <Button
            onClick={handleAnalysis}
            disabled={isAnalyzing || (activeMethod === 'text' && !textInput.trim())}
            className="w-full"
            size={compact ? 'sm' : 'default'}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Analyser l'émotion
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <AnimatePresence>
        {lastResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Résultat de l'analyse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={EMOTION_COLORS[lastResult.emotion as keyof typeof EMOTION_COLORS] || EMOTION_COLORS.neutral}
                  >
                    {lastResult.emotion}
                  </Badge>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Confiance</div>
                    <div className="font-medium">{Math.round(lastResult.confidence * 100)}%</div>
                  </div>
                </div>
                
                <Progress value={lastResult.confidence * 100} className="h-2" />
                
                {lastResult.secondaryEmotions && lastResult.secondaryEmotions.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Émotions secondaires</div>
                    <div className="flex flex-wrap gap-1">
                      {lastResult.secondaryEmotions.map((emotion: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommendations */}
      <AnimatePresence>
        {showRecommendations && recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Recommandations personnalisées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground">{rec.description}</p>
                      {rec.actionLink && (
                        <Button variant="link" size="sm" className="h-auto p-0 mt-2">
                          {rec.actionText || 'En savoir plus'}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insights */}
      {insights && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Insights IA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{insights}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};