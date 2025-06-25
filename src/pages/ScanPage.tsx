
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Scan, Mic, FileText } from 'lucide-react';

const ScanPage: React.FC = () => {
  const [scanMode, setScanMode] = useState<'text' | 'voice'>('text');
  const [inputText, setInputText] = useState('');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Scan className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Analyse Émotionnelle</h1>
          </div>
          <p className="text-muted-foreground">
            Analysez vos émotions à partir de texte ou de voix
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mode d'analyse</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant={scanMode === 'text' ? 'default' : 'outline'}
                  onClick={() => setScanMode('text')}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Texte
                </Button>
                <Button
                  variant={scanMode === 'voice' ? 'default' : 'outline'}
                  onClick={() => setScanMode('voice')}
                  className="flex items-center gap-2"
                >
                  <Mic className="h-4 w-4" />
                  Voix
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {scanMode === 'text' ? 'Saisissez votre texte' : 'Enregistrement vocal'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scanMode === 'text' ? (
                <Textarea
                  placeholder="Décrivez ce que vous ressentez..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={6}
                />
              ) : (
                <div className="text-center p-8 border-2 border-dashed rounded-lg">
                  <Mic className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Cliquez pour commencer l'enregistrement</p>
                  <Button>Démarrer l'enregistrement</Button>
                </div>
              )}
              <Button className="w-full" size="lg">
                Analyser les émotions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
