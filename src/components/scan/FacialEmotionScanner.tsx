
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw, CheckCircle } from 'lucide-react';
import { EmotionResult } from '@/types';

interface FacialEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
}

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({ onScanComplete }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
        setCapturedImage(null);
        setScanCompleted(false);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageDataUrl);
        
        // Stop the video stream
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        video.srcObject = null;
        setIsCapturing(false);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCapture();
  };

  const analyzeImage = () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call to analyze image
    setTimeout(() => {
      // Mock result data
      const result: EmotionResult = {
        id: 'facial-scan-' + Date.now(),
        emotion: 'calm',
        score: 75,
        confidence: 0.82,
        date: new Date().toISOString(),
        timestamp: new Date().toISOString()
      };
      
      setIsAnalyzing(false);
      setScanCompleted(true);
      onScanComplete(result);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
        {isCapturing && (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        )}
        
        {capturedImage && (
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="w-full h-full object-cover" 
          />
        )}
        
        {!isCapturing && !capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="h-16 w-16 text-muted" />
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="flex justify-center gap-2">
        {!isCapturing && !capturedImage && (
          <Button onClick={startCapture} className="w-full">
            <Camera className="mr-2 h-4 w-4" />
            Activer la caméra
          </Button>
        )}
        
        {isCapturing && (
          <Button onClick={captureImage} className="w-full">
            <Camera className="mr-2 h-4 w-4" />
            Capturer
          </Button>
        )}
        
        {capturedImage && !scanCompleted && (
          <>
            <Button variant="outline" onClick={retakePhoto} disabled={isAnalyzing}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reprendre
            </Button>
            
            <Button onClick={analyzeImage} disabled={isAnalyzing} className="relative">
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyse...
                </>
              ) : (
                <>
                  Analyser
                </>
              )}
            </Button>
          </>
        )}
        
        {scanCompleted && (
          <Card className="w-full">
            <CardContent className="p-4 flex items-center justify-center text-green-500">
              <CheckCircle className="mr-2 h-5 w-5" />
              <span>Analyse faciale complétée</span>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FacialEmotionScanner;
