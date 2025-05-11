
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
  const totalDuration = template.duration * 60; // Convert minutes to seconds
  
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
        <h1 className="text-2xl font-bold">{template.title}</h1>
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
                alt={template.title}
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
              <Button variant="ghost" size="icon" onClick={handleRestart}>
                <SkipBack className="h-6 w-6" />
              </Button>
              
              <Button 
                variant="default" 
                size="icon" 
                className="h-12 w-12 rounded-full" 
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
        
        {/* Session info */}
        <div className="lg:col-span-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">About this session</h2>
            <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
            
            <h3 className="font-medium text-sm mb-1">Benefits</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground mb-4">
              {template.benefits?.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="font-medium">Duration</p>
                <p className="text-muted-foreground">{template.duration} minutes</p>
              </div>
              <div>
                <p className="font-medium">Difficulty</p>
                <p className="text-muted-foreground capitalize">{template.difficulty}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRSessionPlayer;
