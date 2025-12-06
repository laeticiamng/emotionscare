// @ts-nocheck

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Mic, Type, Play, Square, RotateCcw, Settings, 
  Zap, Brain, Eye, Heart, Timer, TrendingUp, AlertTriangle,
  CheckCircle, Loader2, Volume2, VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useEnhancedEmotionScan } from '@/hooks/useEnhancedEmotionScan';
import { EmotionResult, ScanMode, EmotionAnalysisConfig } from '@/types/emotion';
import EmotionVisualization from './EmotionVisualization';
import BiometricDisplay from './BiometricDisplay';

interface EnhancedEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onScanProgress?: (progress: number) => void;
  className?: string;
}

const EnhancedEmotionScanner: React.FC<EnhancedEmotionScannerProps> = ({
  onScanComplete,
  onScanProgress,
  className
}) => {
  // États du scanner
  const [scanMode, setScanMode] = useState<ScanMode>('facial');
  const [textInput, setTextInput] = useState('');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  // Configuration avancée
  const [config, setConfig] = useState<EmotionAnalysisConfig>({
    duration: 10,
    sensitivity: 75,
    sources: ['facial'],
    realTimeUpdates: true,
    biometricTracking: true,
    confidenceThreshold: 70,
    noiseReduction: true,
    smoothingFactor: 0.3,
    predictiveMode: true
  });

  // Hook personnalisé pour le scan
  const {
    isScanning,
    scanProgress,
    currentResult,
    permissions,
    scanHistory,
    startScan,
    stopScan,
    resetScan,
    updateConfig,
    getRealtimeEmotion
  } = useEnhancedEmotionScan(config);

  // Refs pour les médias
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Modes de scan disponibles
  const scanModes = [
    {
      id: 'facial' as ScanMode,
      name: 'Analyse Faciale',
      description: 'Reconnaissance d\'émotions par caméra IA',
      icon: <Camera className="w-5 h-5" />,
      color: 'bg-blue-500',
      permission: permissions.camera,
      accuracy: 96
    },
    {
      id: 'voice' as ScanMode,
      name: 'Analyse Vocale',
      description: 'Détection d\'émotions par tonalité vocale',
      icon: <Mic className="w-5 h-5" />,
      color: 'bg-green-500',
      permission: permissions.microphone,
      accuracy: 94
    },
    {
      id: 'text' as ScanMode,
      name: 'Analyse Textuelle',
      description: 'Sentiment analysis NLP avancée',
      icon: <Type className="w-5 h-5" />,
      color: 'bg-purple-500',
      permission: true,
      accuracy: 91
    },
    {
      id: 'combined' as ScanMode,
      name: 'Analyse Multimodale',
      description: 'Combinaison de toutes les sources IA',
      icon: <Brain className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-blue-500 to-purple-500',
      permission: permissions.camera && permissions.microphone,
      accuracy: 98
    },
    {
      id: 'realtime' as ScanMode,
      name: 'Stream Temps Réel',
      description: 'Analyse continue et adaptative',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-orange-500',
      permission: permissions.camera || permissions.microphone,
      accuracy: 95
    }
  ];

  // Démarrer le scan avec le mode sélectionné
  const handleStartScan = useCallback(async () => {
    try {
      await startScan(scanMode, scanMode === 'text' ? { text: textInput } : undefined);
    } catch (error) {
      // Scan start error
    }
  }, [startScan, scanMode, textInput]);

  // Mettre à jour la configuration
  const handleConfigChange = useCallback((key: keyof EmotionAnalysisConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    updateConfig(newConfig);
  }, [config, updateConfig]);

  // Callback quand le scan est terminé
  useEffect(() => {
    if (currentResult && onScanComplete) {
      onScanComplete(currentResult);
    }
  }, [currentResult, onScanComplete]);

  // Callback pour le progrès
  useEffect(() => {
    if (onScanProgress) {
      onScanProgress(scanProgress);
    }
  }, [scanProgress, onScanProgress]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Scanner Émotionnel IA Avancé
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfigOpen(!isConfigOpen)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Configuration avancée (collapsible) */}
        <AnimatePresence>
          {isConfigOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 p-4 bg-muted/30 rounded-lg overflow-hidden"
            >
              <h4 className="font-semibold text-sm">Configuration Avancée</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Durée d'analyse (s)</label>
                  <Slider
                    value={[config.duration]}
                    onValueChange={([value]) => handleConfigChange('duration', value)}
                    min={5}
                    max={60}
                    step={5}
                    className="w-full"
                    aria-label="Durée d'analyse en secondes"
                  />
                  <p className="text-xs text-muted-foreground">{config.duration}s</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sensibilité (%)</label>
                  <Slider
                    value={[config.sensitivity]}
                    onValueChange={([value]) => handleConfigChange('sensitivity', value)}
                    min={10}
                    max={100}
                    step={5}
                    className="w-full"
                    aria-label="Sensibilité en pourcentage"
                  />
                  <p className="text-xs text-muted-foreground">{config.sensitivity}%</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Seuil de confiance (%)</label>
                  <Slider
                    value={[config.confidenceThreshold || 70]}
                    onValueChange={([value]) => handleConfigChange('confidenceThreshold', value)}
                    min={50}
                    max={95}
                    step={5}
                    className="w-full"
                    aria-label="Seuil de confiance en pourcentage"
                  />
                  <p className="text-xs text-muted-foreground">{config.confidenceThreshold}%</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lissage temporel</label>
                  <Slider
                    value={[(config.smoothingFactor || 0.3) * 100]}
                    onValueChange={([value]) => handleConfigChange('smoothingFactor', value / 100)}
                    min={0}
                    max={80}
                    step={5}
                    className="w-full"
                    aria-label="Lissage temporel"
                  />
                  <p className="text-xs text-muted-foreground">{Math.round((config.smoothingFactor || 0.3) * 100)}%</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.realTimeUpdates}
                    onCheckedChange={(checked) => handleConfigChange('realTimeUpdates', checked)}
                  />
                  <span className="text-sm">Mises à jour temps réel</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.biometricTracking}
                    onCheckedChange={(checked) => handleConfigChange('biometricTracking', checked)}
                  />
                  <span className="text-sm">Suivi biométrique</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.noiseReduction}
                    onCheckedChange={(checked) => handleConfigChange('noiseReduction', checked)}
                  />
                  <span className="text-sm">Réduction du bruit</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.predictiveMode}
                    onCheckedChange={(checked) => handleConfigChange('predictiveMode', checked)}
                  />
                  <span className="text-sm">Mode prédictif</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sélection du mode de scan */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Mode d'Analyse</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {scanModes.map(mode => (
              <motion.button
                key={mode.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setScanMode(mode.id)}
                disabled={!mode.permission || isScanning}
                aria-label={`Mode de scan: ${mode.name} - ${mode.description}`}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all duration-300 text-left",
                  scanMode === mode.id
                    ? `${mode.color.includes('gradient') ? mode.color : mode.color + ' text-white'} border-white shadow-lg`
                    : "bg-card hover:bg-accent border-border",
                  (!mode.permission || isScanning) && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "p-2 rounded-lg",
                      scanMode === mode.id ? "bg-white/20" : mode.color + " text-white"
                    )}>
                      {mode.icon}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {mode.accuracy}%
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm leading-tight">{mode.name}</h4>
                    <p className="text-xs opacity-90 mt-1">{mode.description}</p>
                  </div>
                  {!mode.permission && (
                    <Badge variant="destructive" className="text-xs w-full justify-center">
                      Permission requise
                    </Badge>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Zone d'analyse principale */}
        <div className="space-y-4">
          {/* Interface de texte pour l'analyse textuelle */}
          {scanMode === 'text' && (
            <div className="space-y-3">
              <label className="font-medium text-sm">Texte à analyser</label>
              <Textarea
                placeholder="Décrivez votre état émotionnel actuel, vos pensées ou sentiments..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          )}

          {/* Zone de capture vidéo/audio */}
          {(scanMode === 'facial' || scanMode === 'combined' || scanMode === 'realtime') && (
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="w-64 h-64 border-2 border-primary rounded-lg relative"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="absolute inset-0 bg-primary/10 rounded-lg" />
                    
                    {/* Coins de détection animés */}
                    {[
                      'top-0 left-0 border-t-4 border-l-4',
                      'top-0 right-0 border-t-4 border-r-4', 
                      'bottom-0 left-0 border-b-4 border-l-4',
                      'bottom-0 right-0 border-b-4 border-r-4'
                    ].map((pos, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-8 h-8 border-primary ${pos}`}
                        animate={{ 
                          opacity: [0.5, 1, 0.5],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                    
                    {/* Point central d'analyse */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Brain className="w-8 h-8 text-primary" />
                    </motion.div>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {/* Barre de progression et statut */}
          {isScanning && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Analyse en cours...</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  IA Processing
                </div>
                <div className="flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  {Math.round((config.duration * scanProgress) / 100)}s / {config.duration}s
                </div>
                {config.realTimeUpdates && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Temps réel
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Résultat de l'analyse */}
          {currentResult && !isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <EmotionVisualization result={currentResult} />
              
              {config.biometricTracking && currentResult.biometrics && (
                <BiometricDisplay biometrics={currentResult.biometrics} />
              )}
            </motion.div>
          )}

          {/* Contrôles de scan */}
          <div className="flex justify-center gap-3">
            {!isScanning ? (
              <>
                <Button 
                  onClick={handleStartScan}
                  disabled={!scanModes.find(m => m.id === scanMode)?.permission || (scanMode === 'text' && !textInput.trim())}
                  className="flex-1 max-w-xs"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Démarrer l'Analyse
                </Button>
                
                {currentResult && (
                  <Button variant="outline" onClick={resetScan}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Nouveau Scan
                  </Button>
                )}
              </>
            ) : (
              <Button variant="destructive" onClick={stopScan} className="flex-1 max-w-xs">
                <Square className="w-4 h-4 mr-2" />
                Arrêter
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedEmotionScanner;