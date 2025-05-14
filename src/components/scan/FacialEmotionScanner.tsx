import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Pause, RefreshCw } from 'lucide-react';
import { useHumeAI } from '@/hooks/useHumeAI'; // Correct import
import { Skeleton } from '@/components/ui/skeleton';

interface FacialEmotionScannerProps {
  onEmotionDetected: (emotion: string, intensity: number) => void;
}

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({ onEmotionDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { analyzeFaces } = useHumeAI();

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    if (!isCameraActive) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setLoading(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataURL = canvas.toDataURL('image/jpeg');
    const blob = await (await fetch(imageDataURL)).blob();

    try {
      const result = await analyzeFaces(blob);
      if (result && result.length > 0) {
        const face = result[0];
        const emotionData = face.predictions.reduce((maxEmotion, emotion) => {
          return emotion.score > maxEmotion.score ? emotion : maxEmotion;
        }, { name: 'neutral', score: 0 });

        setDetectedEmotion(emotionData.name);
        onEmotionDetected(emotionData.name, emotionData.score);
      } else {
        setDetectedEmotion('neutral');
        onEmotionDetected('neutral', 0.5);
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      setDetectedEmotion('error');
    } finally {
      setLoading(false);
    }
  };

  const toggleCamera = () => {
    setIsCameraActive(prev => !prev);
  };

  return (
    <Card className="w-full max-w-md mx-auto p-4">
      <div className="relative">
        <video ref={videoRef} autoPlay className="w-full rounded-md" style={{ display: isCameraActive ? 'block' : 'none' }} />
        <Skeleton className="w-full aspect-video rounded-md" style={{ display: isCameraActive ? 'none' : 'block' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      <div className="mt-4 flex justify-between gap-2">
        <Button onClick={captureFrame} disabled={loading}>
          {loading ? 'Analyse...' : 'Analyser'}
        </Button>
        <Button variant="outline" onClick={toggleCamera}>
          {isCameraActive ? <Pause className="h-4 w-4 mr-2" /> : <Camera className="h-4 w-4 mr-2" />}
          {isCameraActive ? 'Arrêter' : 'Activer'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setDetectedEmotion(null);
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>
      {detectedEmotion && (
        <div className="mt-4 text-center">
          Emotion détectée: <strong>{detectedEmotion}</strong>
        </div>
      )}
    </Card>
  );
};

export default FacialEmotionScanner;
