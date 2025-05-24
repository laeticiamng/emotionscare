
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Heart, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmotionSelector from '@/components/journal/EmotionSelector';

const B2CScanPage: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();

  const handleTextAnalysis = async () => {
    if (!textInput.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir du texte à analyser",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult = {
        emotions: [
          { name: 'Joie', confidence: 0.75 },
          { name: 'Sérénité', confidence: 0.60 },
          { name: 'Optimisme', confidence: 0.45 }
        ],
        sentiment: 'positive',
        mood_score: 78
      };
      
      setAnalysisResult(mockResult);
      toast({
        title: "Analyse terminée",
        description: "Votre analyse émotionnelle est prête",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'analyser le texte",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Enregistrement démarré",
        description: "Parlez maintenant...",
      });
      // Simulate recording for 5 seconds
      setTimeout(() => {
        setIsRecording(false);
        toast({
          title: "Enregistrement terminé",
          description: "Analyse en cours...",
        });
      }, 5000);
    }
  };

  return (
    <>
      <Helmet>
        <title>Scanner d'émotions - EmotionsCare</title>
        <meta name="description" content="Analysez vos émotions en temps réel" />
      </Helmet>
      
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Scanner d'émotions</h1>
          <p className="text-gray-600">
            Analysez vos émotions à partir de votre voix ou de votre texte
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Text Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Analyse de texte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Décrivez ce que vous ressentez..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={6}
              />
              <Button 
                onClick={handleTextAnalysis}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyser le texte
              </Button>
            </CardContent>
          </Card>

          {/* Voice Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Analyse vocale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Button
                  onClick={handleVoiceRecording}
                  variant={isRecording ? "destructive" : "default"}
                  size="lg"
                  className="rounded-full w-20 h-20"
                >
                  {isRecording ? (
                    <MicOff className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>
                <p className="mt-4 text-sm text-gray-600">
                  {isRecording ? "Enregistrement en cours..." : "Cliquez pour enregistrer"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emotion Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Sélection manuelle d'émotion</CardTitle>
          </CardHeader>
          <CardContent>
            <EmotionSelector 
              selectedEmotion={selectedEmotion}
              onSelectEmotion={setSelectedEmotion}
            />
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResult && (
          <Card>
            <CardHeader>
              <CardTitle>Résultats de l'analyse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Émotions détectées :</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.emotions.map((emotion: any) => (
                    <Badge key={emotion.name} variant="outline">
                      {emotion.name} ({Math.round(emotion.confidence * 100)}%)
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Score de bien-être :</h3>
                <div className="text-2xl font-bold text-primary">
                  {analysisResult.mood_score}/100
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default B2CScanPage;
