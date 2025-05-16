
import React, { useRef, useEffect, useState } from 'react';

export interface EnhancedMusicVisualizerProps {
  intensity?: number;
  volume?: number;
  height?: number;
  showControls?: boolean;
  mood?: string;
}

const EnhancedMusicVisualizer: React.FC<EnhancedMusicVisualizerProps> = ({
  intensity = 0.5,
  volume = 0.5,
  height = 120,
  showControls = false,
  mood = 'calm'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(true);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    // Colors based on mood
    const colors: Record<string, {primary: string, secondary: string}> = {
      calm: {primary: '#3b82f6', secondary: '#60a5fa'},
      happy: {primary: '#f59e0b', secondary: '#fbbf24'},
      focus: {primary: '#10b981', secondary: '#34d399'},
      energetic: {primary: '#ef4444', secondary: '#f87171'},
      sad: {primary: '#6366f1', secondary: '#818cf8'}
    };
    
    const selectedColors = colors[mood] || colors.calm;
    
    // Animation variables
    let animationId: number;
    const particles: {x: number, y: number, radius: number, speed: number, color: string}[] = [];
    
    // Create initial particles
    const particleCount = Math.floor(20 * intensity);
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.2,
        color: Math.random() > 0.5 ? selectedColors.primary : selectedColors.secondary
      });
    }
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Move particles
        particle.y -= particle.speed * (volume + 0.3);
        
        // Reset particles when they go off screen
        if (particle.y < -particle.radius) {
          particle.y = height + particle.radius;
          particle.x = Math.random() * width;
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [intensity, volume, isActive, mood]);
  
  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        className="w-full rounded-lg shadow-inner"
        style={{ height: `${height}px` }}
      />
      
      {showControls && (
        <div className="absolute bottom-2 right-2 flex gap-2">
          <button 
            onClick={() => setIsActive(!isActive)}
            className="rounded-full bg-white/20 backdrop-blur-sm p-1 hover:bg-white/40 transition-colors"
          >
            {isActive ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedMusicVisualizer;
