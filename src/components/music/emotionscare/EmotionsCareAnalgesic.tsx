import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, Activity, Brain, Music, Clock, Play } from 'lucide-react';
import { useAnalgesicMusic } from '@/hooks/useAnalgesicMusic';
import { useToast } from '@/hooks/use-toast';

const EmotionsCareAnalgesic: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState<"Français" | "English">("Français");
  const [generatedTrack, setGeneratedTrack] = useState<any>(null);
  const [generatedSequence, setGeneratedSequence] = useState<any>(null);
  
  const { generateAnalgesicTrack, generateTherapeuticSequence, isGenerating } = useAnalgesicMusic();
  const { toast } = useToast();

  const handleGenerateAnalgesic = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Texte requis",
        description: "Veuillez saisir un texte décrivant votre état émotionnel",
        variant: "destructive"
      });
      return;
    }

    const result = await generateAnalgesicTrack({
      text: inputText,
      language
    });

    if (result) {
      setGeneratedTrack(result);
      toast({
        title: "Musique antalgique générée",
        description: `Track thérapeutique en cours de création (${result.preset.presetTag})`,
      });
    }
  };

  const handleGenerateSequence = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Texte requis",
        description: "Veuillez saisir un texte décrivant votre état émotionnel",
        variant: "destructive"
      });
      return;
    }

    const result = await generateTherapeuticSequence({
      text: inputText,
      language
    });

    if (result) {
      setGeneratedSequence(result);
      toast({
        title: "Parcours thérapeutique généré",
        description: `Séquence évolutive de ${result.sequence.totalDuration}s en cours de création`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec principes neuroscientifiques */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Heart className="h-6 w-6" />
            Musique Antalgique EmotionsCare
          </CardTitle>
          <p className="text-green-700 text-sm">
            Génération musicale thérapeutique basée sur les neurosciences pour soulager la douleur et améliorer l'état émotionnel
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-green-600" />
              <span><strong>Fréquence cardiaque:</strong> Tempo 60-80 BPM</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Brain className="h-4 w-4 text-green-600" />
              <span><strong>Cortisol:</strong> Progressions modales douces</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Music className="h-4 w-4 text-green-600" />
              <span><strong>Analgésie:</strong> Masquage drone bas niveau</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interface de génération */}
      <Card>
        <CardHeader>
          <CardTitle>Génération Thérapeutique</CardTitle>
          <p className="text-muted-foreground">
            Décrivez votre état émotionnel ou votre douleur pour générer une musique adaptée
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              placeholder="Ex: Je me sens stressé et j'ai une douleur lancinante au dos..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-20"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={language === "Français" ? "default" : "outline"}
                onClick={() => setLanguage("Français")}
              >
                Français
              </Button>
              <Button
                size="sm"
                variant={language === "English" ? "default" : "outline"}
                onClick={() => setLanguage("English")}
              >
                English
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button
              onClick={handleGenerateAnalgesic}
              disabled={isGenerating}
              className="flex-1"
            >
              <Music className="h-4 w-4 mr-2" />
              {isGenerating ? 'Génération...' : 'Track Antalgique'}
            </Button>
            
            <Button
              onClick={handleGenerateSequence}
              disabled={isGenerating}
              variant="outline"
              className="flex-1"
            >
              <Clock className="h-4 w-4 mr-2" />
              {isGenerating ? 'Génération...' : 'Parcours Thérapeutique'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultats Track Antalgique */}
      {generatedTrack && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Music className="h-5 w-5" />
              Track Antalgique Généré
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {generatedTrack.preset.presetTag}
              </Badge>
              <Badge variant="outline">
                {generatedTrack.preset.tempo} BPM
              </Badge>
              <Badge variant={generatedTrack.preset.instrumental ? "default" : "secondary"}>
                {generatedTrack.preset.instrumental ? "Instrumental" : "Avec paroles"}
              </Badge>
            </div>
            
            <div className="bg-white p-3 rounded border">
              <p className="text-sm font-medium mb-1">Émotion détectée:</p>
              <p className="text-sm text-muted-foreground">
                {generatedTrack.emotions[0]?.name} ({(generatedTrack.emotions[0]?.score * 100).toFixed(0)}%)
              </p>
            </div>
            
            <div className="bg-white p-3 rounded border">
              <p className="text-sm font-medium mb-1">Approche thérapeutique:</p>
              <p className="text-sm text-muted-foreground">
                {generatedTrack.preset.extraPrompt}
              </p>
            </div>
            
            <Button className="w-full" disabled>
              <Play className="h-4 w-4 mr-2" />
              Track en cours de génération... (Task ID: {generatedTrack.taskId.slice(0, 8)})
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Résultats Séquence Thérapeutique */}
      {generatedSequence && (
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Clock className="h-5 w-5" />
              Parcours Thérapeutique Généré
            </CardTitle>
            <p className="text-purple-700 text-sm">
              Évolution progressive: {generatedSequence.sequence.startEmotion} → {generatedSequence.sequence.targetEmotion}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-3 rounded border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Durée totale:</span>
                <Badge>{Math.floor(generatedSequence.sequence.totalDuration / 60)}min {generatedSequence.sequence.totalDuration % 60}s</Badge>
              </div>
              <span className="text-sm font-medium">Étapes:</span>
              <div className="space-y-2 mt-2">
                {generatedSequence.sequence.steps.map((step: any, index: number) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>{step.description}</span>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {step.duration}s
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {step.tempo} BPM
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button className="w-full" disabled>
              <Play className="h-4 w-4 mr-2" />
              Séquence en cours de génération... (Task ID: {generatedSequence.taskId.slice(0, 8)})
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmotionsCareAnalgesic;
