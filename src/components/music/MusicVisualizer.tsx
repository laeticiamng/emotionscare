// @ts-nocheck
/**
 * MusicVisualizer - Visualiseur audio temps réel
 * Affiche une représentation graphique de la musique en cours
 */

import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface MusicVisualizerProps {
  audioElement?: HTMLAudioElement;
  enabled?: boolean;
  type?: 'bars' | 'wave' | 'circular';
  className?: string;
}

export const MusicVisualizer: React.FC<MusicVisualizerProps> = ({
  audioElement,
  enabled = true,
  type = 'bars',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode>();
  const dataArrayRef = useRef<Uint8Array>();

  useEffect(() => {
    if (!audioElement || !enabled || !canvasRef.current) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioElement);
    
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      ctx.fillStyle = 'hsl(var(--background))';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (type === 'bars') {
        drawBars(ctx, canvas, dataArrayRef.current, bufferLength);
      } else if (type === 'wave') {
        drawWave(ctx, canvas, dataArrayRef.current, bufferLength);
      } else if (type === 'circular') {
        drawCircular(ctx, canvas, dataArrayRef.current, bufferLength);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      audioContext.close();
    };
  }, [audioElement, enabled, type]);

  const drawBars = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, dataArray: Uint8Array, bufferLength: number) => {
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i] / 255) * canvas.height;

      const hue = (i / bufferLength) * 360;
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  };

  const drawWave = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, dataArray: Uint8Array, bufferLength: number) => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'hsl(var(--primary))';
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  };

  const drawCircular = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, dataArray: Uint8Array, bufferLength: number) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'hsl(var(--primary) / 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    for (let i = 0; i < bufferLength; i++) {
      const angle = (i / bufferLength) * 2 * Math.PI;
      const barLength = (dataArray[i] / 255) * radius * 0.5;
      
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barLength);
      const y2 = centerY + Math.sin(angle) * (radius + barLength);

      const hue = (i / bufferLength) * 360;
      ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  if (!enabled) return null;

  return (
    <Card className={`p-4 ${className}`}>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className="w-full h-auto rounded-lg"
        aria-label="Visualiseur audio"
      />
    </Card>
  );
};
