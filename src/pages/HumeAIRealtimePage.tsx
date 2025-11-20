/**
 * Hume AI Real-time Emotion Scanning Page
 * Demo/Example page for Hume AI WebSocket integration
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { HumeAIRealtimeScanner } from '@/components/scan/HumeAIRealtimeScanner';
import { Camera, Mic, Type, Info, Sparkles, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { emotionScanService } from '@/services/emotion/scan-service';
import { useToast } from '@/hooks/use-toast';
import type { HumeEmotionResult } from '@/services/ai/HumeAIWebSocketService';

export default function HumeAIRealtimePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMode, setSelectedMode] = useState<'face' | 'prosody' | 'language'>('face');
  const [scanCount, setScanCount] = useState(0);

  // Get Hume AI API key from environment
  const humeApiKey = import.meta.env.VITE_HUME_API_KEY;

  const handleEmotionDetected = async (result: HumeEmotionResult) => {
    if (!user?.id) return;

    // Save the emotion scan to database
    try {
      await emotionService.saveEmotionResult({
        id: crypto.randomUUID(),
        user_id: user.id,
        emotion: result.topEmotion.name,
        confidence: result.topEmotion.score,
        source: selectedMode === 'face' ? 'facial' : selectedMode === 'prosody' ? 'voice' : 'text',
        timestamp: new Date().toISOString(),
        analysis_data: {
          emotions: result.emotions,
          prosody: result.prosody,
          face: result.face,
          timestamp: result.timestamp,
        },
      });

      setScanCount((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to save emotion scan', error);
    }
  };

  if (!humeApiKey) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Configuration manquante</AlertTitle>
          <AlertDescription>
            La clé API Hume AI n'est pas configurée. Veuillez ajouter{' '}
            <code className="bg-muted px-1 py-0.5 rounded">VITE_HUME_API_KEY</code> dans votre
            fichier .env
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
            Streaming d'émotions en temps réel avec l'API Hume AI. Détection faciale, vocale et
            textuelle instantanée.
          </p>
          {scanCount > 0 && (
            <Badge className="mt-2">
              {scanCount} scan{scanCount > 1 ? 's' : ''} enregistré{scanCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-900">
                À propos de l'analyse en temps réel
              </p>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>
                  <strong>Analyse faciale :</strong> Détecte les émotions via votre caméra en
                  temps réel
                </li>
                <li>
                  <strong>Analyse vocale :</strong> Analyse la prosodie et les émotions dans
                  votre voix
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
            Choisissez le type d'analyse émotionnelle que vous souhaitez utiliser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={selectedMode}
            onValueChange={(value) => setSelectedMode(value as typeof selectedMode)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="face" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Faciale
              </TabsTrigger>
              <TabsTrigger value="prosody" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Vocale
              </TabsTrigger>
              <TabsTrigger value="language" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Textuelle
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Hume AI Scanner */}
      <HumeAIRealtimeScanner
        apiKey={humeApiKey}
        mode={selectedMode}
        onEmotionDetected={handleEmotionDetected}
        autoConnect={false}
      />

      {/* Features Info */}
      <Card>
        <CardHeader>
          <CardTitle>Fonctionnalités</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Analyse Faciale</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Détection en temps réel des émotions via expressions faciales. Identifie plus de
                30 émotions différentes avec précision.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Analyse Vocale</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Analyse de la prosodie (ton, tempo, volume) pour détecter les émotions dans la
                voix. Streaming audio continu.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Analyse Textuelle</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Compréhension du langage naturel pour identifier les émotions dans le texte.
                Analyse sémantique avancée.
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
          <p>
            ✓ Connexion WebSocket sécurisée avec reconnexion automatique
          </p>
          <p>
            ✓ Latence ultra-faible (&lt;500ms) pour une expérience en temps réel
          </p>
          <p>
            ✓ Plus de 30 émotions détectées avec scores de confiance
          </p>
          <p>
            ✓ Données de prosodie (tonalité, tempo, volume) pour l'analyse vocale
          </p>
          <p>
            ✓ Historique des émotions pour le suivi dans le temps
          </p>
          <p className="pt-2 border-t">
            Propulsé par{' '}
            <a
              href="https://hume.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Hume AI
            </a>{' '}
            - L'API d'expression émotionnelle la plus avancée
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
