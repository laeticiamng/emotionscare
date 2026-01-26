import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface MoodVisualizerProps {
  valence: number; // -1 to 1
  arousal: number; // -1 to 1
  size?: 'sm' | 'md' | 'lg';
}

export const MoodVisualizer: React.FC<MoodVisualizerProps> = ({
  valence,
  arousal,
  size = 'md',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sizeMap = {
    sm: 200,
    md: 300,
    lg: 400,
  };

  const canvasSize = sizeMap[size];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw quadrants
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;

    // Background quadrants with colors
    const quadrants = [
      { x: centerX, y: 0, color: 'rgba(34, 197, 94, 0.1)' }, // High arousal, positive valence (excited)
      { x: 0, y: 0, color: 'rgba(239, 68, 68, 0.1)' },       // High arousal, negative valence (stressed)
      { x: 0, y: centerY, color: 'rgba(59, 130, 246, 0.1)' }, // Low arousal, negative valence (sad)
      { x: centerX, y: centerY, color: 'rgba(168, 85, 247, 0.1)' }, // Low arousal, positive valence (calm)
    ];

    quadrants.forEach((q, _i) => {
      ctx.fillStyle = q.color;
      ctx.fillRect(q.x, q.y, centerX, centerY);
    });

    // Draw axes
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
    ctx.lineWidth = 2;
    
    // Horizontal axis (valence)
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvasSize, centerY);
    ctx.stroke();
    
    // Vertical axis (arousal)
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvasSize);
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(100, 100, 100, 0.8)';
    ctx.font = '12px sans-serif';
    ctx.fillText('Négatif', 10, centerY - 10);
    ctx.fillText('Positif', canvasSize - 50, centerY - 10);
    ctx.fillText('Élevé', centerX + 10, 15);
    ctx.fillText('Faible', centerX + 10, canvasSize - 10);

    // Convert valence and arousal to canvas coordinates
    const x = centerX + (valence * centerX * 0.8);
    const y = centerY - (arousal * centerY * 0.8); // Inverted Y axis

    // Draw current mood point
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
    
    // Color based on position
    const getColor = () => {
      if (valence > 0 && arousal > 0) return { start: 'rgba(34, 197, 94, 0.8)', end: 'rgba(34, 197, 94, 0)' };
      if (valence < 0 && arousal > 0) return { start: 'rgba(239, 68, 68, 0.8)', end: 'rgba(239, 68, 68, 0)' };
      if (valence < 0 && arousal < 0) return { start: 'rgba(59, 130, 246, 0.8)', end: 'rgba(59, 130, 246, 0)' };
      return { start: 'rgba(168, 85, 247, 0.8)', end: 'rgba(168, 85, 247, 0)' };
    };

    const colors = getColor();
    gradient.addColorStop(0, colors.start);
    gradient.addColorStop(1, colors.end);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // Draw center point
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();

    // Pulse animation
    let pulseRadius = 8;
    let growing = true;
    
    const animate = () => {
      if (growing) {
        pulseRadius += 0.5;
        if (pulseRadius >= 15) growing = false;
      } else {
        pulseRadius -= 0.5;
        if (pulseRadius <= 8) growing = true;
      }
      
      ctx.clearRect(x - 20, y - 20, 40, 40);
      
      // Redraw glow
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();
      
      // Redraw pulse
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Center point
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    };

    const intervalId = setInterval(animate, 50);

    return () => clearInterval(intervalId);
  }, [valence, arousal, canvasSize]);

  const getMoodLabel = () => {
    if (valence > 0 && arousal > 0) return 'Excité / Joyeux';
    if (valence < 0 && arousal > 0) return 'Stressé / Anxieux';
    if (valence < 0 && arousal < 0) return 'Triste / Déprimé';
    return 'Calme / Serein';
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">État Émotionnel</h3>
        <p className="text-sm text-muted-foreground">{getMoodLabel()}</p>
      </div>
      
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="border border-border rounded-lg"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Valence:</span>
          <span className="ml-2 font-medium">{valence.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Activation:</span>
          <span className="ml-2 font-medium">{arousal.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
};
