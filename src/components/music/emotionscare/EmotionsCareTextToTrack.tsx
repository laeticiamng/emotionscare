import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Music, Wand2, Heart, Brain } from 'lucide-react';
import { useEmotionsCareTextToTrack } from '@/hooks/useEmotionsCareTextToTrack';

const EmotionsCareTextToTrack: React.FC = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState<'English' | 'Français'>('Français');
  const { generateTrack, isGenerating, generatedTrack } = useEmotionsCareTextToTrack();

  const handleGenerate = async () => {
    await generateTrack({
      text,
      language,
    });
  };

  const isTextValid = text.trim().length >= 10;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Brain className="h-6 w-6 text-primary" />
              <Music className="h-6 w-6 text-purple-500" />
            </div>
            EmotionsCare × Suno × Hume
          </CardTitle>
          <p className="text-muted-foreground">
            Transformez vos émotions en musique personnalisée grâce à l'IA
          </p>
        </CardHeader>
      </Card>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Génération de Musique Émotionnelle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Exprimez vos émotions, pensées ou histoire
            </label>
            <Textarea
              placeholder="Décrivez ce que vous ressentez, une situation, une émotion, ou racontez une histoire... L'IA analysera vos émotions et créera une musique unique."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={5000}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Minimum 10 caractères • Maximum 5000</span>
              <span>{text.length}/5000</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Langue</label>
            <Select value={language} onValueChange={(value: 'English' | 'Français') => setLanguage(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Français">🇫🇷 Français</SelectItem>
                <SelectItem value="English">🇬🇧 English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!isTextValid || isGenerating}
            className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Génération en cours...
              </>
            ) : (
              <>
                <Music className="mr-2 h-4 w-4" />
                Générer ma Musique EmotionsCare
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Track Display */}
      {generatedTrack && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Heart className="h-5 w-5" />
              Piste Générée avec Succès !
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{generatedTrack.title}</h3>
              <p className="text-sm text-muted-foreground">
                Preset musical : <Badge variant="secondary">{String((generatedTrack as any).preset?.tag ?? '')}</Badge>
              </p>
              <p className="text-sm text-muted-foreground">
                Style : {String((generatedTrack as any).preset?.style ?? '')}
              </p>
            </div>

            {generatedTrack.emotions && generatedTrack.emotions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Émotions détectées :</h4>
                <div className="flex flex-wrap gap-2">
                  {generatedTrack.emotions.slice(0, 5).map((emotion: any, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {emotion.name} ({(emotion.score * 100).toFixed(0)}%)
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-white rounded-lg border">
              <p className="text-sm">
                <strong>ID Paroles :</strong> <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{generatedTrack.lyricsTaskId}</code>
              </p>
              <p className="text-sm mt-1">
                <strong>ID Musique :</strong> <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{generatedTrack.musicTaskId}</code>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                La génération peut prendre quelques minutes. Vous pouvez suivre le progrès dans votre bibliothèque EmotionsCare.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Brain className="h-4 w-4 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-blue-900">Comment ça fonctionne ?</h4>
              <p className="text-sm text-blue-700">
                Notre IA analyse vos émotions avec Hume AI (80 presets émotionnels), 
                sélectionne le style musical optimal, puis génère paroles et mélodie 
                personnalisées avec Suno AI. Chaque création est unique !
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionsCareTextToTrack;
