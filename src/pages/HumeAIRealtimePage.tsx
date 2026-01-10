/**
 * Hume AI Real-time Emotion Scanning Page
 * Uses Edge Functions for secure API calls - no client-side API keys
 */

import React, { useState, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Camera, Mic, Type, Info, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface EmotionResult {
  topEmotion: {
    name: string;
    score: number;
  };
  emotions?: Array<{ name: string; score: number }>;
}

export default function HumeAIRealtimePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMode, setSelectedMode] = useState<'face' | 'prosody' | 'language'>('language');
  const [scanCount, setScanCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [lastResult, setLastResult] = useState<EmotionResult | null>(null);

  const analyzeText = useCallback(async (text: string) => {
    if (!text.trim() || !user?.id) return;
    
    setIsAnalyzing(true);
    try {
      // Appel via Edge Function - pas de clé API côté client
      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: { 
          text, 
          analysisType: 'text'
        }
      });
      
      if (error) throw error;
      
      const result: EmotionResult = {
        topEmotion: {
          name: data?.emotions?.[0]?.name || 'neutral',
          score: data?.emotions?.[0]?.score || 0.5
        },
        emotions: data?.emotions || []
      };
      
      setLastResult(result);
      
      // Sauvegarder le scan en base de données
      const { error: insertError } = await supabase
        .from('emotion_scans')
        .insert({
          user_id: user.id,
          valence: result.topEmotion.score * 100,
          arousal: 50,
          summary: result.topEmotion.name,
          source: 'hume_realtime',
          metadata: {
            allEmotions: result.emotions?.slice(0, 5) || [],
            mode: selectedMode,
            timestamp: new Date().toISOString()
          }
        });

      if (insertError) {
        logger.error('Failed to save to DB', insertError, 'SCAN');
      } else {
        toast({
          title: 'Scan enregistré',
          description: `Émotion détectée: ${result.topEmotion.name}`,
        });
        setScanCount((prev) => prev + 1);
      }
    } catch (error) {
      logger.error('Failed to analyze text', error instanceof Error ? error : new Error(String(error)), 'SCAN');
      toast({
        title: 'Erreur d\'analyse',
        description: 'Impossible d\'analyser le texte',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, selectedMode, toast]);

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Analyse Émotionnelle en Temps Réel</h1>
          <p className="text-muted-foreground mt-2">
            Streaming d'émotions via l'API Hume AI. Détection faciale, vocale et textuelle.
          </p>
          {scanCount > 0 && (
            <Badge className="mt-2">
              {scanCount} scan{scanCount > 1 ? 's' : ''} enregistré{scanCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                À propos de l'analyse en temps réel
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                <li>
                  <strong>Analyse sécurisée :</strong> Les appels API sont gérés côté serveur via Edge Functions
                </li>
                <li>
                  <strong>Analyse textuelle :</strong> Comprend les émotions dans vos textes
                </li>
                <li>Tous les scans sont automatiquement sauvegardés dans votre historique</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Mode d'analyse</CardTitle>
          <CardDescription>
            Choisissez le type d'analyse émotionnelle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={selectedMode}
            onValueChange={(value) => setSelectedMode(value as typeof selectedMode)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="face" className="flex items-center gap-2" disabled>
                <Camera className="h-4 w-4" />
                Faciale
              </TabsTrigger>
              <TabsTrigger value="prosody" className="flex items-center gap-2" disabled>
                <Mic className="h-4 w-4" />
                Vocale
              </TabsTrigger>
              <TabsTrigger value="language" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Textuelle
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="language" className="mt-4 space-y-4">
              <textarea
                className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Écrivez votre texte ici pour analyser les émotions..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                onClick={() => analyzeText(textInput)}
                disabled={isAnalyzing || !textInput.trim()}
              >
                {isAnalyzing ? 'Analyse en cours...' : 'Analyser les émotions'}
              </button>
              
              {lastResult && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="font-medium">Résultat:</p>
                  <p className="text-lg">
                    Émotion dominante: <span className="font-bold text-primary">{lastResult.topEmotion.name}</span>
                    <span className="text-muted-foreground ml-2">({(lastResult.topEmotion.score * 100).toFixed(1)}%)</span>
                  </p>
                  {lastResult.emotions && lastResult.emotions.length > 1 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {lastResult.emotions.slice(1, 5).map((emotion, i) => (
                        <Badge key={i} variant="secondary">
                          {emotion.name}: {(emotion.score * 100).toFixed(0)}%
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="face" className="mt-4">
              <p className="text-muted-foreground text-center py-8">
                L'analyse faciale en temps réel sera disponible prochainement
              </p>
            </TabsContent>
            
            <TabsContent value="prosody" className="mt-4">
              <p className="text-muted-foreground text-center py-8">
                L'analyse vocale en temps réel sera disponible prochainement
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Features Info */}
      <Card>
        <CardHeader>
          <CardTitle>Fonctionnalités</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Analyse Faciale</h3>
                <Badge variant="outline">Bientôt</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Détection en temps réel des émotions via expressions faciales.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Analyse Vocale</h3>
                <Badge variant="outline">Bientôt</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Analyse de la prosodie pour détecter les émotions dans la voix.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Analyse Textuelle</h3>
                <Badge>Disponible</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Compréhension du langage naturel pour identifier les émotions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-lg">Détails Techniques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>✓ Appels API sécurisés via Supabase Edge Functions</p>
          <p>✓ Aucune clé API exposée côté client</p>
          <p>✓ Plus de 30 émotions détectées avec scores de confiance</p>
          <p>✓ Historique des émotions pour le suivi dans le temps</p>
          <p className="pt-2 border-t">
            Propulsé par{' '}
            <a
              href="https://hume.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Hume AI
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
