
import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  audioUrl?: string;
  isPlaying?: boolean;
  variant?: 'bars' | 'wave' | 'circle';
  height?: number;
  width?: number;
  primaryColor?: string;
  secondaryColor?: string;
  intensity?: number; // Add intensity prop
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioUrl,
  isPlaying = false,
  variant = 'bars',
  height = 100,
  width = 0,
  primaryColor = '#6366F1',
  secondaryColor = '#818CF8',
  intensity = 50 // Default intensity value
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const containerWidth = width || canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.width = containerWidth;
    canvas.height = height;
    
    // Create fake audio data for the visualization
    const drawVisualization = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (!isPlaying) {
        // Draw idle state (flat line or minimal animation)
        ctx.beginPath();
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2;
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        return;
      }
      
      // Apply intensity factor (0.1 to 2.0)
      const intensityFactor = (intensity / 50) * 1.5;
      
      // Choose visualization type
      switch (variant) {
        case 'bars': {
          // Draw frequency bars
          const barCount = 64;
          const barWidth = canvas.width / barCount;
          const barMaxHeight = canvas.height * 0.8;
          
          for (let i = 0; i < barCount; i++) {
            // Generate random heights based on position (higher in middle)
            const positionFactor = 1 - Math.abs((i / barCount) - 0.5) * 2;
            const randomHeight = Math.random() * barMaxHeight * positionFactor * intensityFactor;
            const barHeight = Math.max(3, randomHeight);
            
            // Create gradient for each bar
            const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
            gradient.addColorStop(0, primaryColor);
            gradient.addColorStop(1, secondaryColor);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(
              i * barWidth, 
              canvas.height - barHeight, 
              barWidth - 1, 
              barHeight
            );
          }
          break;
        }
        
        case 'wave': {
          // Draw waveform
          ctx.beginPath();
          ctx.moveTo(0, canvas.height / 2);
          
          const segmentCount = 100;
          const amplitude = canvas.height * 0.3 * intensityFactor;
          const frequency = 2;
          
          for (let i = 0; i <= segmentCount; i++) {
            const x = (canvas.width / segmentCount) * i;
            const y = (canvas.height / 2) + 
              Math.sin((Date.now() / 500) + (i / 10)) * amplitude * Math.random() * 0.5 +
              Math.sin((Date.now() / 800) + (i / 15) * frequency) * amplitude;
            
            ctx.lineTo(x, y);
          }
          
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, primaryColor);
          gradient.addColorStop(1, secondaryColor);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 3;
          ctx.stroke();
          break;
        }
        
        case 'circle': {
          // Draw circular visualization
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
          const numCircles = 3;
          const numPoints = 80;
          
          for (let c = 0; c < numCircles; c++) {
            const radius = maxRadius * (0.3 + (0.7 * (c + 1) / numCircles));
            
            ctx.beginPath();
            
            for (let i = 0; i <= numPoints; i++) {
              const angle = (i / numPoints) * Math.PI * 2;
              const noiseFactor = Math.random() * 0.2 + 0.8;
              const radiusNoise = radius * (1 + Math.sin(Date.now() / 1000 + c * 2 + i) * 0.1 * intensityFactor * noiseFactor);
              
              const x = centerX + Math.cos(angle) * radiusNoise;
              const y = centerY + Math.sin(angle) * radiusNoise;
              
              if (i === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            
            ctx.closePath();
            
            const gradientRadius = ctx.createRadialGradient(
              centerX, centerY, radius * 0.2,
              centerX, centerY, radius
            );
            
            const alpha = 1 - (c / numCircles) * 0.6;
            gradientRadius.addColorStop(0, `${primaryColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`);
            gradientRadius.addColorStop(1, `${secondaryColor}${Math.round(alpha * 0.5 * 255).toString(16).padStart(2, '0')}`);
            
            ctx.strokeStyle = gradientRadius;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          break;
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      drawVisualization();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [
    isPlaying,
    variant,
    height,
    width,
    primaryColor,
    secondaryColor,
    intensity // Add intensity to the dependency array
  ]);

  return (
    <canvas 
      ref={canvasRef} 
      height={height} 
      className="w-full"
      style={{ height: `${height}px` }}
    />
  );
};

export default AudioVisualizer;
