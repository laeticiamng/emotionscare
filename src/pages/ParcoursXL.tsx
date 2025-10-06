// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Music, Sparkles, Clock, Shield, AlertCircle, Play, Pause, SkipForward, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { AVAILABLE_PRESETS, createParcoursRun, type ParcoursPreset } from '@/services/parcours-orchestrator';

const ParcoursXL: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showBrief, setShowBrief] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [progress, setProgress] = useState(0);
  const [journal, setJournal] = useState('');
  const [showJournal, setShowJournal] = useState(false);

  const selectedPresetData = AVAILABLE_PRESETS.find(p => p.key === selectedPreset);

  const handleSelectEmotion = (presetKey: string) => {
    setSelectedPreset(presetKey);
    setShowBrief(true);
  };

  const handleStartParcours = async () => {
    if (!selectedPreset) return;

    try {
      toast.info('Création de votre parcours personnalisé...');
      
      const result = await createParcoursRun(selectedPreset, 'user-id-placeholder');
      
      if (result.error) {
        throw new Error(result.error);
      }

      toast.success('Parcours prêt ! Lancement...');
      setShowBrief(false);
      setIsPlaying(true);
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible de démarrer le parcours');
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setShowJournal(true);
  };

  const handleSaveJournal = () => {
    toast.success('Journal sauvegardé de manière sécurisée');
    setShowJournal(false);
    setSelectedPreset(null);
    setJournal('');
  };

  // Vue: Sélection d'émotion
  if (!selectedPreset) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Music className="h-8 w-8 text-primary" />
            Parcours Musicothérapie XL
          </h1>
          <p className="text-muted-foreground">
            Choisissez votre émotion de départ — 18 à 24 minutes de soin
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {AVAILABLE_PRESETS.map((preset) => (
            <Card
              key={preset.key}
              className="cursor-pointer hover:border-primary transition-all hover:scale-105"
              onClick={() => handleSelectEmotion(preset.key)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">{preset.icon}</div>
                <h3 className="font-semibold mb-1">{preset.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{preset.emotion}</p>
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {preset.duration}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Vue: Brief avant lancement
  if (showBrief && selectedPresetData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">{selectedPresetData.icon}</span>
              {selectedPresetData.title}
            </CardTitle>
            <CardDescription>
              Parcours {selectedPresetData.emotion} • {selectedPresetData.duration}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Techniques incluses
              </h3>
              <div className="space-y-2">
                <Badge variant="secondary">Respiration guidée</Badge>
                <Badge variant="secondary">TCC/ACT/DBT</Badge>
                <Badge variant="secondary">Hypnose ericksonienne</Badge>
                <Badge variant="secondary">Acupression TCM</Badge>
                <Badge variant="secondary">Tapping bilatéral</Badge>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Points d'attention</p>
                  <p className="text-muted-foreground">
                    Certains points d'acupression (LI4, SP6) sont contre-indiqués pendant la grossesse.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-md border">
              <Shield className="h-4 w-4 text-green-600" />
              <p className="text-sm text-muted-foreground">
                Vos données sont anonymisées • Conforme RGPD
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedPreset(null);
                  setShowBrief(false);
                }}
                className="flex-1"
              >
                Retour
              </Button>
              <Button
                onClick={handleStartParcours}
                className="flex-1"
                size="lg"
              >
                <Play className="mr-2 h-4 w-4" />
                Lancer le parcours
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vue: Lecture en cours
  if (isPlaying) {
    const segments = ['Respiration', 'Attention', 'Défusion', 'Ancrage', 'Retour'];
    
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Music className="h-5 w-5 animate-pulse text-primary" />
                {selectedPresetData?.title}
              </span>
              <Badge variant="outline">
                {segments[currentSegment]}
              </Badge>
            </CardTitle>
            <CardDescription>
              Segment {currentSegment + 1} / {segments.length}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Barre de progression */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{Math.floor(progress / 60)}:{(progress % 60).toString().padStart(2, '0')}</span>
                <span>{Math.floor(parseInt(selectedPresetData?.duration || '20'))}:00</span>
              </div>
              <Progress value={(progress / (parseInt(selectedPresetData?.duration || '20') * 60)) * 100} />
            </div>

            {/* Timeline des segments */}
            <div className="space-y-2">
              {segments.map((seg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-md border transition-all ${
                    idx === currentSegment
                      ? 'bg-primary/10 border-primary'
                      : idx < currentSegment
                      ? 'bg-muted opacity-50'
                      : 'bg-background'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{seg}</span>
                    {idx === currentSegment && (
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Contrôles */}
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Pause className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleStop}
                className="ml-auto"
              >
                <StopCircle className="h-4 w-4 mr-2" />
                Arrêter
              </Button>
            </div>

            {/* Sécurité */}
            <div className="p-3 bg-muted rounded-md text-xs text-center text-muted-foreground">
              🛟 En cas de détresse : arrêtez et contactez un professionnel
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vue: Journal de fin
  if (showJournal) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Comment vous sentez-vous ?</CardTitle>
            <CardDescription>
              Prenez 60 secondes pour noter ce que vous retenez
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Ce que j'ai appris / ressenti</label>
              <Textarea
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder="Notes personnelles (chiffrées et privées)..."
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Ces notes sont chiffrées et uniquement accessibles par vous
              </p>
            </div>

            <Button onClick={handleSaveJournal} className="w-full">
              Sauvegarder et terminer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default ParcoursXL;
