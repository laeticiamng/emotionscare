import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Music, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { logger } from '@/lib/logger';

const MusicGenerationTest: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState('Verse 1:\nDans le cabinet, deux regards se croisent\nL\'un cherche à comprendre, l\'autre à être compris\nPlus qu\'un simple soin, une alliance se tisse\nEntre l\'art médical et l\'humain qui se livre');
  const [style, setStyle] = useState('lofi-piano');

  const testGeneration = async () => {
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-music', {
        body: {
          lyrics,
          style,
          rang: 'A'
        }
      });

      if (error) {
        throw error;
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du test de génération');
      logger.error('Erreur test génération:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Test de génération musicale TopMediAI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Style musical :</label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lofi-piano">Lo-Fi Piano</SelectItem>
              <SelectItem value="afrobeat">Afrobeat</SelectItem>
              <SelectItem value="ambient">Ambient</SelectItem>
              <SelectItem value="jazz">Jazz</SelectItem>
              <SelectItem value="classical">Classical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Paroles (optionnel) :</label>
          <Textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Entrez les paroles de votre chanson..."
            rows={6}
          />
        </div>

        <Button 
          onClick={testGeneration} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Music className="mr-2 h-4 w-4" />
              Tester la génération
            </>
          )}
        </Button>

        {result && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Génération réussie !</span>
            </div>
            <div className="text-sm text-green-700">
              <p><strong>Source :</strong> {result.source}</p>
              <p><strong>Titre :</strong> {result.music?.title}</p>
              <p><strong>Style :</strong> {result.music?.style}</p>
              <p><strong>Durée :</strong> {result.music?.duration}s</p>
              {result.music?.audioUrl && (
                <p><strong>URL Audio :</strong> {result.music.audioUrl}</p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-800">Erreur de génération</span>
            </div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MusicGenerationTest;
