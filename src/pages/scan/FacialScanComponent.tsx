import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CameraOff, RotateCcw, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface FacialScanComponentProps {
  onResults: (results: any) => void;
  isScanning: boolean;
}

const FacialScanComponent: React.FC<FacialScanComponentProps> = ({ onResults, isScanning }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Erreur lors de l\'accès à la caméra:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const analyzeFace = () => {
    if (!capturedImage) return;

    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulation d'analyse faciale
          setTimeout(() => {
            onResults({
              type: 'facial',
              confidence: 91,
              emotions: {
                'Joie': Math.random() * 30 + 50,
                'Surprise': Math.random() * 20 + 10,
                'Sérénité': Math.random() * 40 + 40,
                'Concentration': Math.random() * 35 + 30,
                'Fatigue': Math.random() * 25 + 5,
                'Stress': Math.random() * 20 + 10
              },
              facialMetrics: {
                eyeContact: 'Bon',
                facialSymmetry: 'Normale',
                microExpressions: ['Sourire léger', 'Regard confiant'],
                posture: 'Détendue'
              }
            });
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setScanProgress(0);
    startCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Analyse Faciale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[4/3]">
          {!isStreaming && !capturedImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Camera className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center">
                Cliquez sur "Démarrer la caméra" pour commencer
              </p>
            </div>
          )}
          
          {isStreaming && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <motion.div
                className="absolute inset-4 border-2 border-blue-500 rounded-lg"
                animate={{ 
                  borderColor: ['#3b82f6', '#10b981', '#3b82f6'],
                  scale: [1, 1.02, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Visage détecté
              </div>
            </>
          )}
          
          {capturedImage && (
            <div className="relative">
              <img 
                src={capturedImage} 
                alt="Capture" 
                className="w-full h-full object-cover"
              />
              {scanProgress > 0 && scanProgress < 100 && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <p className="text-sm font-medium mb-2">Analyse en cours...</p>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500"
                        style={{ width: `${scanProgress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex gap-2">
          {!isStreaming && !capturedImage && (
            <Button onClick={startCamera} className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Démarrer la caméra
            </Button>
          )}
          
          {isStreaming && (
            <>
              <Button onClick={captureImage} className="flex-1">
                <Camera className="mr-2 h-4 w-4" />
                Capturer
              </Button>
              <Button onClick={stopCamera} variant="outline">
                <CameraOff className="mr-2 h-4 w-4" />
                Arrêter
              </Button>
            </>
          )}
          
          {capturedImage && scanProgress === 0 && (
            <>
              <Button onClick={analyzeFace} className="flex-1" disabled={isScanning}>
                Analyser le visage
              </Button>
              <Button onClick={resetCapture} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reprendre
              </Button>
            </>
          )}
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-2">👁️ Conseils pour une meilleure analyse</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Regardez directement la caméra</li>
            <li>• Assurez-vous d'avoir un bon éclairage</li>
            <li>• Gardez une expression naturelle</li>
            <li>• Évitez les ombres sur votre visage</li>
            <li>• Restez immobile pendant la capture</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacialScanComponent;