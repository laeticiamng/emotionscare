
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { VRSessionTemplate } from '@/types';
import { PauseCircle, PlayCircle, SkipBack, X } from 'lucide-react';

interface VRSessionPlayerProps {
  template: VRSessionTemplate;
  onComplete: () => void;
}

const VRSessionPlayer: React.FC<VRSessionPlayerProps> = ({ template, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const totalDuration = template.duration;
  
  // Handle session playback
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;
        const newProgress = Math.min((newTime / totalDuration) * 100, 100);
        setProgress(newProgress);
        
        // Auto-complete when session finishes
        if (newTime >= totalDuration) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 1000);
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPlaying, totalDuration, onComplete]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleRestart = () => {
    setTimeElapsed(0);
    setProgress(0);
    setIsPlaying(true);
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{template.title || template.name}</h1>
        <Button variant="ghost" size="sm" onClick={onComplete}>
          <X className="h-5 w-5 mr-1" /> Exit Session
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Video/Audio player area */}
        <div className="lg:col-span-8">
          {!template.is_audio_only && template.preview_url ? (
            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
              <img
                src={template.preview_url}
                alt={template.title || template.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-primary/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl font-medium mb-2">Audio Session</p>
                <p className="text-muted-foreground">Close your eyes and follow the guidance</p>
              </div>
            </div>
          )}
          
          {/* Player controls */}
          <div className="mt-4 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">{formatTime(timeElapsed)}</span>
              <span className="text-sm">{formatTime(totalDuration)}</span>
            </div>
            
            <Progress value={progress} className="h-2" />
            
            <div className="flex items-center justify-center space-x-4 mt-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRestart}
                title="Restart"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button 
                size="lg"
                variant="default"
                className="rounded-full h-16 w-16 flex items-center justify-center"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <PauseCircle className="h-8 w-8" />
                ) : (
                  <PlayCircle className="h-8 w-8" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right side info panel */}
        <div className="lg:col-span-4">
          <div className="bg-muted/30 rounded-lg p-4 space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
            </div>
            
            {template.benefits && template.benefits.length > 0 && (
              <div>
                <h3 className="font-medium">Benefits</h3>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  {template.benefits.map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Difficulty:</span>
              <span>{template.difficulty || 'Beginner'}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duration:</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRSessionPlayer;
