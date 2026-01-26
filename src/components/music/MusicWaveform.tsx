import React, { useRef, useEffect } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { cn } from '@/lib/utils';

interface MusicWaveformProps {
  className?: string;
  height?: number;
  color?: string;
  backgroundColor?: string;
  progressColor?: string;
  barWidth?: number;
  barGap?: number;
  barCount?: number;
  animated?: boolean;
  interactive?: boolean;
  waveformType?: 'bars' | 'wave' | 'peaks';
}

const MusicWaveform: React.FC<MusicWaveformProps> = ({
  className,
  height = 64,
  color = 'bg-primary',
  backgroundColor = 'bg-primary/10',
  progressColor = 'bg-primary/60',
  barWidth = 2,
  barGap = 2,
  barCount = 50,
  animated = true,
  interactive = true,
  waveformType = 'bars'
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const { state, seek } = useMusic();
  const { currentTrack, isPlaying, currentTime, duration } = state;

  // Generate random waveform data (in a real app, this would use the actual audio data)
  const generateWaveformData = (count: number) => {
    const data = [];
    let lastValue = 0.5;
    
    for (let i = 0; i < count; i++) {
      // Generate value with some relationship to previous value for smoother appearance
      const randomChange = (Math.random() - 0.5) * 0.3;
      let newValue = lastValue + randomChange;
      
      // Keep within bounds
      newValue = Math.max(0.05, Math.min(1, newValue));
      data.push(newValue);
      lastValue = newValue;
    }
    return data;
  };
  
  // Mock waveform data
  const waveformData = useRef<number[]>(generateWaveformData(100));
  
  useEffect(() => {
    // Regenerate waveform when track changes
    if (currentTrack) {
      waveformData.current = generateWaveformData(100);
    }
  }, [currentTrack]);

  // Handle seeking when clicking on waveform
  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !seek || !duration) return;
    
    const waveformElement = waveformRef.current;
    if (waveformElement) {
      const rect = waveformElement.getBoundingClientRect();
      const clickPositionX = e.clientX - rect.left;
      const percentPosition = clickPositionX / rect.width;
      const newPosition = percentPosition * duration;
      
      seek(newPosition);
    }
  };

  // Calculate progress percentage
  const progressPercent = duration ? (currentTime || 0) / duration : 0;
  
  if (!currentTrack) {
    return (
      <div 
        className={cn("rounded-md overflow-hidden", className)} 
        style={{ height }}
      >
        <div className={`w-full h-full ${backgroundColor} opacity-30`}></div>
      </div>
    );
  }
  
  return (
    <div 
      ref={waveformRef}
      className={cn("relative rounded-md overflow-hidden cursor-pointer", className)} 
      style={{ height }}
      onClick={handleWaveformClick}
    >
      <div className="absolute inset-0 flex items-center">
        {waveformData.current.slice(0, barCount).map((value, index) => {
          // Determine if this bar is in the "progress" section
          const isInProgress = index / barCount < progressPercent;
          
          // Calculate height based on the data value
          const barHeight = value * height;
          
          // For the wave type, we calculate height differently
          const waveHeight = waveformType === 'wave' ? value * height / 2 : barHeight;
          
          // Apply active style when playing
          const isActive = isPlaying && animated;
          
          // Calculate animation delay
          const animationDelay = `${index * 0.02}s`;
          
          return (
            <React.Fragment key={index}>
              {waveformType === 'bars' && (
                <div
                  className={cn(
                    "transition-all duration-300",
                    isInProgress ? progressColor : color
                  )}
                  style={{
                    height: `${isActive ? barHeight * (0.7 + Math.sin(Date.now() / 500 + index) * 0.3) : barHeight}px`,
                    width: barWidth,
                    marginLeft: barGap,
                    transform: isActive ? `scaleY(${0.8 + Math.sin(Date.now() / 200 + index) * 0.2})` : 'none',
                    transition: isActive ? 'none' : 'all 0.2s ease'
                  }}
                />
              )}
              
              {waveformType === 'wave' && (
                <div
                  className="relative flex flex-col justify-center"
                  style={{ height: '100%', width: barWidth, marginLeft: barGap }}
                >
                  <div
                    className={cn(
                      "transition-all duration-300",
                      isInProgress ? progressColor : color
                    )}
                    style={{
                      height: `${waveHeight}px`,
                      width: barWidth,
                      transform: isActive ? `scaleY(${0.8 + Math.sin(Date.now() / 200 + index) * 0.2})` : 'none'
                    }}
                  />
                  <div
                    className={cn(
                      "transition-all duration-300",
                      isInProgress ? progressColor : color
                    )}
                    style={{
                      height: `${waveHeight}px`,
                      width: barWidth,
                      transform: isActive ? `scaleY(${0.8 + Math.sin(Date.now() / 200 + index + 10) * 0.2})` : 'none'
                    }}
                  />
                </div>
              )}
              
              {waveformType === 'peaks' && (
                <div
                  className={cn(
                    "rounded-full transition-all duration-300",
                    isInProgress ? progressColor : color
                  )}
                  style={{
                    height: isActive ? 
                      `${barHeight * (0.7 + Math.sin(Date.now() / 500 + index) * 0.3)}px` : 
                      `${barHeight}px`,
                    width: barWidth,
                    marginLeft: barGap,
                    animationDelay
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Progress indicator line */}
      <div 
        className="absolute top-0 bottom-0 bg-primary opacity-50 w-px pointer-events-none"
        style={{ left: `${progressPercent * 100}%` }}
      />
    </div>
  );
};

export default MusicWaveform;
