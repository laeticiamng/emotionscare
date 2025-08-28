import React, { useEffect } from 'react';
import { useXRSession } from '@/hooks/useXRSession';
import { useBreathingPattern } from '@/hooks/useBreathingPattern';
import { useAmbientAudio } from '@/hooks/useAmbientAudio';
import { useVRBreathStore } from '@/store/vrbreath.store';
import { XRCanvas } from '@/components/vr/XRCanvas';
import { Fallback2D } from '@/components/vr/Fallback2D';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VrHeadset, Monitor, Play, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function VRBreathPage() {
  const { xrSupported, inXR, enterXR, exitXR } = useXRSession();
  const { pattern, setPattern, start, pause, finish, running, metrics, isComplete } = useBreathingPattern();
  const { enabled: audioEnabled, toggle: toggleAudio } = useAmbientAudio();
  const { reduceMotion } = useVRBreathStore();

  const sendMetrics = async () => {
    try {
      const data = metrics();
      if (!data) return;

      await supabase.functions.invoke('vr-breath-metrics', {
        body: {
          pattern: data.pattern,
          duration_sec: data.duration_sec,
          adherence: data.adherence,
          ts: data.ts
        }
      });

      toast({
        title: "Respiration enregistrée ✨",
        description: "Session terminée avec succès",
        duration: 3000
      });

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'vrbreath_metrics_sent', {
          custom_pattern: data.pattern,
          custom_duration: data.duration_sec
        });
      }

    } catch (error) {
      // Queue offline for later sync
      const data = metrics();
      if (data && 'indexedDB' in window) {
        try {
          const request = indexedDB.open('vrbreath_offline', 1);
          request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['metrics'], 'readwrite');
            const store = transaction.objectStore('metrics');
            store.add({ ...data, queued_at: Date.now() });
          };
        } catch (e) {
          console.error('Failed to queue offline metrics:', e);
        }
      }
      
      toast({
        title: "Session sauvegardée localement",
        description: "Sera synchronisée à la reconnexion",
        duration: 3000
      });
    }
  };

  // Handle completion
  useEffect(() => {
    if (isComplete) {
      sendMetrics();
    }
  }, [isComplete]);

  // Analytics
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'vrbreath_view', {
        custom_xr_supported: xrSupported
      });
    }
  }, [xrSupported]);

  const handleStart = () => {
    start();
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'vrbreath_start', {
        custom_pattern: pattern
      });
    }
  };

  const handleExit = () => {
    finish();
    if (inXR) {
      exitXR();
    }
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'vrbreath_exit');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/5">
      <div className="container mx-auto p-4 space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            VR Respiration
          </h1>
          <p className="text-muted-foreground">
            Exercice de respiration guidée immersif
          </p>
        </header>

        {!xrSupported ? (
          // Fallback 2D automatique
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 flex justify-center">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Mode 2D (WebXR non supporté)
              </Badge>
            </div>
            <Fallback2D
              pattern={pattern}
              onPatternChange={setPattern}
              reducedMotion={reduceMotion}
              onStart={handleStart}
              onPause={pause}
              onFinish={handleExit}
              running={running}
              audioEnabled={audioEnabled}
              onToggleAudio={toggleAudio}
            />
          </div>
        ) : !inXR ? (
          // Interface d'entrée VR
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <VrHeadset className="w-6 h-6" />
                  Mode VR Disponible
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={enterXR}
                      size="lg"
                      className="w-full h-20 flex flex-col gap-2"
                      aria-label="Entrer en VR"
                    >
                      <VrHeadset className="w-6 h-6" />
                      <span>Entrer en VR</span>
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-20 flex flex-col gap-2"
                      onClick={() => {
                        // Force fallback mode
                        window.location.hash = 'fallback2d';
                      }}
                    >
                      <Monitor className="w-6 h-6" />
                      <span>Mode 2D</span>
                    </Button>
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Pattern de respiration</label>
                    <select
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value as any)}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      <option value="4-2-4">4-2-4 (Débutant)</option>
                      <option value="4-6-8">4-6-8 (Relaxation)</option>
                      <option value="5-5">5-5 (Équilibré)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Audio ambiant</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleAudio}
                      className={audioEnabled ? "text-primary" : ""}
                    >
                      {audioEnabled ? "Activé" : "Désactivé"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Scène VR active
          <XRCanvas
            pattern={pattern}
            running={running}
            reduceMotion={reduceMotion}
            onStart={handleStart}
            onPause={pause}
            onExit={handleExit}
          />
        )}

        {/* Instructions d'accessibilité */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Settings className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Raccourcis clavier (mode 2D):</strong></p>
                  <p>• Espace = Démarrer/Pause • Échap = Quitter</p>
                  <p>• Les animations respectent vos préférences d'accessibilité</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}