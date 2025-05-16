
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';

interface EnhancedMusicVisualizerProps {
  showControls?: boolean;
  height?: number;
}

const EnhancedMusicVisualizer: React.FC<EnhancedMusicVisualizerProps> = ({ 
  showControls = true,
  height = 120
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, isDarkMode } = useTheme();
  const [visualizerType, setVisualizerType] = useState<'bars' | 'wave' | 'circles'>('bars');
  
  // Simulate audio data for demo purposes
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    
    // Set base color based on theme
    let baseColor = isDarkMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(37, 99, 235, 0.7)';
    if (theme === 'pastel') {
      baseColor = 'rgba(147, 197, 253, 0.7)';
    }
    
    // Animation frame ID for cleanup
    let animationId: number;
    
    // Function to generate random data (simulating audio frequency data)
    const generateRandomData = (size: number) => {
      return Array.from({ length: size }, () => Math.random() * height * 0.8);
    };
    
    // Render function based on visualizer type
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Generate simulated audio data
      const dataSize = Math.floor(width / 4);
      const data = generateRandomData(dataSize);
      
      // Choose visualization based on type
      switch (visualizerType) {
        case 'bars':
          renderBars(data);
          break;
        case 'wave':
          renderWave(data);
          break;
        case 'circles':
          renderCircles(data);
          break;
      }
      
      // Continue animation
      animationId = requestAnimationFrame(render);
    };
    
    // Render bar visualization
    const renderBars = (data: number[]) => {
      const barWidth = width / data.length;
      
      ctx.fillStyle = baseColor;
      
      data.forEach((value, index) => {
        const x = index * barWidth;
        const barHeight = value;
        ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
      });
    };
    
    // Render wave visualization
    const renderWave = (data: number[]) => {
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      data.forEach((value, index) => {
        const x = index * (width / data.length);
        const y = height - value;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    };
    
    // Render circles visualization
    const renderCircles = (data: number[]) => {
      // Use subset of data for circles
      const circleData = data.filter((_, index) => index % 5 === 0);
      
      circleData.forEach((value, index) => {
        const x = (index / (circleData.length - 1)) * width;
        const y = height / 2;
        const radius = value / 3;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor.slice(0, -4)}, ${0.6 - (index / circleData.length) * 0.4})`;
        ctx.fill();
      });
    };
    
    // Start animation
    render();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [visualizerType, theme, isDarkMode]);
  
  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={height}
        className="w-full h-full rounded-lg bg-opacity-10 bg-primary"
      />
      
      {showControls && (
        <div className="absolute bottom-2 right-2 flex gap-1">
          <button 
            className={`text-xs px-2 py-1 rounded ${visualizerType === 'bars' ? 'bg-primary text-white' : 'bg-muted'}`}
            onClick={() => setVisualizerType('bars')}
          >
            Bars
          </button>
          <button 
            className={`text-xs px-2 py-1 rounded ${visualizerType === 'wave' ? 'bg-primary text-white' : 'bg-muted'}`}
            onClick={() => setVisualizerType('wave')}
          >
            Wave
          </button>
          <button 
            className={`text-xs px-2 py-1 rounded ${visualizerType === 'circles' ? 'bg-primary text-white' : 'bg-muted'}`}
            onClick={() => setVisualizerType('circles')}
          >
            Circles
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedMusicVisualizer;
