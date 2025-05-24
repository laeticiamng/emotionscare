
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Brain, Mic, Camera, Type, Loader2, Smile, Frown, Meh } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ScanPage: React.FC = () => {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [scanType, setScanType] = useState<'text' | 'voice' | 'emoji'>('text');
  const [textInput, setTextInput] = useState('');
  const [emojiInput, setEmojiInput] = useState('');
  const [results, setResults] = useState<any>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const handleScan = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour utiliser cette fonctionnalité');
      return;
    }

    if (scanType === 'text' && !textInput.trim()) {
      toast.error('Veuillez saisir du texte à analyser');
      return;
    }

    if (scanType === 'emoji' && !emojiInput.trim()) {
      toast.error('Veuillez sélectionner des émojis');
      return;
    }

    setIsScanning(true);
    setScanProgress(0);

    try {
      // Simulation de progression
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Appel à l'API d'analyse d'émotions
      const { data, error } = await supabase.functions.invoke('enhanced-emotion-analyze', {
        body: {
          type: scanType,
          content: scanType === 'text' ? textInput : emojiInput,
          userId: user.id
        }
      });

      clearInterval(progressInterval);
      setScanProgress(100);

      if (error) {
        throw error;
      }

      // Sauvegarder les résultats
      const { error: saveError } = await supabase
        .from('emotions')
        .insert({
          user_id: user.id,
          [scanType === 'text' ? 'text' : 'emojis']: scanType === 'text' ? textInput : emojiInput,
          score: data.confidence || 75,
          ai_feedback: data.analysis || 'Analyse émotionnelle complétée avec succès'
        });

      if (saveError) {
        console.error('Erreur lors de la sauvegarde:', saveError);
      }

      setResults(data);
      toast.success('Analyse émotionnelle terminée !');

    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      toast.error('Erreur lors de l\'analyse émotionnelle');
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const handleVoiceRecord = () => {
    toast.info('Fonctionnalité vocale en cours de développement');
    // Ici, vous implémenteriez l'enregistrement vocal
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'joy':
      case 'happiness':
      case 'content':
        return <Smile className="h-6 w-6 text-green-500" />;
      case 'sadness':
      case 'anger':
      case 'fear':
        return <Frown className="h-6 w-6 text-red-500" />;
      default:
        return <Meh className="h-6 w-6 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* En-tête */}
        <div className="text-center space-y-4">
          <div className="mx-auto p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit">
            <Brain className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Scanner d'émotions IA
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Analysez votre état émotionnel avec notre intelligence artificielle avancée. 
            Choisissez votre méthode préférée d'analyse.
          </p>
        </div>

        {/* Sélection du type de scan */}
        <Card>
          <CardHeader>
            <CardTitle>Méthode d'analyse</CardTitle>
            <CardDescription>
              Choisissez comment vous souhaitez partager vos émotions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant={scanType === 'text' ? 'default' : 'outline'}
                onClick={() => setScanType('text')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Type className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-medium">Texte libre</div>
                  <div className="text-xs text-muted-foreground">
                    Décrivez vos sentiments par écrit
                  </div>
                </div>
              </Button>

              <Button
                variant={scanType === 'voice' ? 'default' : 'outline'}
                onClick={() => setScanType('voice')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Mic className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-medium">Vocal</div>
                  <div className="text-xs text-muted-foreground">
                    Enregistrez votre voix
                  </div>
                </div>
              </Button>

              <Button
                variant={scanType === 'emoji' ? 'default' : 'outline'}
                onClick={() => setScanType('emoji')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Smile className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-medium">Émojis</div>
                  <div className="text-xs text-muted-foreground">
                    Exprimez-vous avec des émojis
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Interface de saisie */}
        <Card>
          <CardHeader>
            <CardTitle>
              {scanType === 'text' && 'Décrivez vos émotions'}
              {scanType === 'voice' && 'Enregistrement vocal'}
              {scanType === 'emoji' && 'Sélectionnez vos émojis'}
            </CardTitle>
            <CardDescription>
              {scanType === 'text' && 'Partagez ce que vous ressentez en ce moment'}
              {scanType === 'voice' && 'Cliquez pour enregistrer votre message vocal'}
              {scanType === 'emoji' && 'Choisissez les émojis qui correspondent à votre humeur'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {scanType === 'text' && (
              <Textarea
                placeholder="Je me sens... Aujourd'hui j'ai vécu... Mon humeur est..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-32"
              />
            )}

            {scanType === 'voice' && (
              <div className="text-center py-8">
                <Button
                  onClick={handleVoiceRecord}
                  size="lg"
                  className="rounded-full w-24 h-24"
                >
                  <Mic className="h-8 w-8" />
                </Button>
                <p className="mt-4 text-sm text-muted-foreground">
                  Cliquez pour commencer l'enregistrement
                </p>
              </div>
            )}

            {scanType === 'emoji' && (
              <div className="space-y-4">
                <Input
                  placeholder="😊 😢 😍 😴 😡 🥰 😅 😰 ..."
                  value={emojiInput}
                  onChange={(e) => setEmojiInput(e.target.value)}
                  className="text-2xl"
                />
                <div className="grid grid-cols-6 gap-2">
                  {['😊', '😢', '😍', '😴', '😡', '🥰', '😅', '😰', '🤔', '😎', '🥳', '😌'].map((emoji) => (
                    <Button
                      key={emoji}
                      variant="outline"
                      onClick={() => setEmojiInput(prev => prev + emoji)}
                      className="text-2xl aspect-square"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {isScanning && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Analyse en cours...</span>
                </div>
                <Progress value={scanProgress} className="w-full" />
              </div>
            )}

            <Button
              onClick={handleScan}
              disabled={isScanning || (scanType === 'text' && !textInput.trim()) || (scanType === 'emoji' && !emojiInput.trim())}
              className="w-full"
              size="lg"
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Analyser mes émotions
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Résultats */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Résultats de l'analyse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Émotions détectées */}
              {results.emotions && (
                <div>
                  <h3 className="font-medium mb-3">Émotions détectées</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.emotions.map((emotion: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        {getEmotionIcon(emotion.name)}
                        <div className="flex-1">
                          <div className="font-medium">{emotion.name}</div>
                          <Progress value={emotion.intensity * 100} className="mt-1" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round(emotion.intensity * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analyse et recommandations */}
              {results.analysis && (
                <div>
                  <h3 className="font-medium mb-3">Analyse IA</h3>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">{results.analysis}</p>
                  </div>
                </div>
              )}

              {/* Score de confiance */}
              {results.confidence && (
                <div>
                  <h3 className="font-medium mb-3">Fiabilité de l'analyse</h3>
                  <div className="flex items-center gap-3">
                    <Progress value={results.confidence} className="flex-1" />
                    <span className="text-sm font-medium">{results.confidence}%</span>
                  </div>
                </div>
              )}

              {/* Recommandations */}
              {results.recommendations && (
                <div>
                  <h3 className="font-medium mb-3">Recommandations personnalisées</h3>
                  <div className="space-y-2">
                    {results.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-500">•</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ScanPage;
