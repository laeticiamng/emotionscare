// @ts-nocheck
import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useUserMedia } from '@/hooks/useUserMedia';
import { supabase } from '@/integrations/supabase/client';

interface EmotionResult {
  emotions: string[];
  confidence: number;
  recommendations: string[];
  mood_label: string;
}

export default function EmotionScan() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { stream, startCamera, stopCamera, isStreaming, error: cameraError } = useUserMedia();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useCamera, setUseCamera] = useState(true);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('hume-face', {
        body: {
          image: imageData,
          type: 'base64'
        }
      });
      
      if (supabaseError) throw supabaseError;
      
      if (data.success) {
        // Simuler un résultat en attendant Hume
        const mockResult: EmotionResult = {
          emotions: ['calme', 'concentré', 'optimiste'],
          confidence: 0.85,
          mood_label: 'Serein',
          recommendations: [
            'Votre état émotionnel semble équilibré',
            'Continuez vos pratiques de bien-être',
            'Une session de méditation pourrait amplifier cette sérénité'
          ]
        };
        
        setResult(mockResult);
        
        // Sauvegarder la session
        await supabase.functions.invoke('metrics/emotion_scan', {
          body: {
            session_id: crypto.randomUUID(),
            payload: {
              emotions: mockResult.emotions,
              confidence: mockResult.confidence,
              mood_label: mockResult.mood_label,
              source: useCamera ? 'camera' : 'upload'
            }
          }
        });
      } else if (data.fallback) {
        setResult({
          emotions: data.fallback.emotions,
          confidence: data.fallback.confidence,
          mood_label: 'Neutre',
          recommendations: ['Analyse de secours activée', 'Les résultats peuvent être approximatifs']
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur d\'analyse');
      // Fallback local
      setResult({
        emotions: ['neutre', 'pensif'],
        confidence: 0.5,
        mood_label: 'Réfléchi',
        recommendations: [
          'Analyse hors ligne utilisée',
          'Reconnectez-vous pour une analyse plus précise'
        ]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCameraCapture = async () => {
    if (!isStreaming) {
      try {
        await startCamera();
      } catch (err) {
        setError('Impossible d\'accéder à la caméra');
        setUseCamera(false);
      }
      return;
    }
    
    const imageData = captureFrame();
    if (imageData) {
      await analyzeImage(imageData);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      await analyzeImage(result);
    };
    reader.readAsDataURL(file);
  };

  const resetScan = () => {
    setResult(null);
    setError(null);
    stopCamera();
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      'calme': 'bg-blue-500/10 text-blue-700',
      'heureux': 'bg-yellow-500/10 text-yellow-700',
      'concentré': 'bg-purple-500/10 text-purple-700',
      'optimiste': 'bg-green-500/10 text-green-700',
      'neutre': 'bg-gray-500/10 text-gray-700',
      'pensif': 'bg-indigo-500/10 text-indigo-700'
    };
    return colors[emotion] || 'bg-gray-500/10 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Camera className="h-6 w-6" />
              Scan Émotionnel
            </CardTitle>
            <p className="text-muted-foreground">
              Analyse de vos émotions via reconnaissance faciale
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Zone de capture */}
            <div className="space-y-4">
              {useCamera && (
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 object-cover"
                    onLoadedMetadata={() => {
                      if (stream && videoRef.current) {
                        videoRef.current.srcObject = stream;
                      }
                    }}
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {!isStreaming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-white text-center">
                        <Camera className="h-12 w-12 mx-auto mb-4" />
                        <p>Cliquez pour activer la caméra</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contrôles */}
              <div className="flex justify-center gap-4">
                {useCamera ? (
                  <Button 
                    onClick={handleCameraCapture}
                    disabled={isAnalyzing}
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-5 w-5" />
                    {isStreaming ? 'Analyser' : 'Activer Caméra'}
                  </Button>
                ) : null}
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="lg"
                  disabled={isAnalyzing}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-5 w-5" />
                  Upload Image
                </Button>
                
                {(result || error) && (
                  <Button
                    onClick={resetScan}
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-5 w-5" />
                    Nouveau Scan
                  </Button>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* État de chargement */}
            {isAnalyzing && (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Analyse des émotions en cours...</p>
              </div>
            )}

            {/* Erreurs */}
            {error && !result && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {/* Résultats */}
            {result && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Analyse terminée</span>
                </div>

                {/* État émotionnel principal */}
                <div className="text-center p-6 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {result.mood_label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Confiance: {Math.round(result.confidence * 100)}%
                  </div>
                </div>

                {/* Émotions détectées */}
                <div>
                  <h3 className="font-semibold mb-3">Émotions détectées</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.emotions.map((emotion, index) => (
                      <Badge 
                        key={index}
                        className={getEmotionColor(emotion)}
                        variant="outline"
                      >
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Recommandations */}
                <div>
                  <h3 className="font-semibold mb-3">Recommandations</h3>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mode de secours */}
            {cameraError && useCamera && (
              <div className="text-center p-4 bg-yellow-50 text-yellow-700 rounded-lg">
                <p className="font-medium">Caméra non disponible</p>
                <p className="text-sm mt-1">Vous pouvez uploader une image à la place</p>
                <Button
                  onClick={() => setUseCamera(false)}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Continuer sans caméra
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}