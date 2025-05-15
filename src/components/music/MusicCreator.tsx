import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MusicTrack } from '@/types';

interface MusicCreatorProps {
  onCreateTrack: (track: MusicTrack) => void;
  loading?: boolean;
}

const MusicCreator: React.FC<MusicCreatorProps> = ({ onCreateTrack, loading = false }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [duration, setDuration] = useState(180);
  const [emotion, setEmotion] = useState('calm');
  const [generating, setGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    // Reset upload progress when not generating
    if (!generating) {
      setUploadProgress(0);
    }
  }, [generating]);

  useEffect(() => {
    // Simulate progress when generating
    let interval: number | undefined;
    
    if (generating) {
      interval = window.setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              handleMusicCreation();
              setGenerating(false);
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 300);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [generating]);

  const handleMusicCreation = () => {
    // Create a unique ID for the track
    const id = `track-${Date.now()}`;
    
    // Default cover images based on emotion
    const coverMap: Record<string, string> = {
      calm: '/images/music/calm.jpg',
      happy: '/images/music/happy.jpg',
      focus: '/images/music/focus.jpg',
      energy: '/images/music/energy.jpg',
      melancholy: '/images/music/melancholy.jpg'
    };
    
    // Create the new track
    const newTrack: MusicTrack = {
      id,
      title,
      artist,
      duration,
      url: `/audio/${emotion}-${id}.mp3`,
      coverUrl: coverMap[emotion] || '/images/music/default.jpg',
      emotion
    };
    
    // Call the callback function with the new track
    onCreateTrack(newTrack);
    
    // Reset form
    setTitle('');
    setArtist('');
    setDuration(180);
  };

  const startGeneration = () => {
    if (!title || !artist) return;
    setGenerating(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Custom Music</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Track Title</Label>
            <Input
              id="title"
              placeholder="Enter track title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={generating || loading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="artist">Artist Name</Label>
            <Input
              id="artist"
              placeholder="Enter artist name"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              disabled={generating || loading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="duration">Duration (seconds)</Label>
            <Input
              id="duration"
              type="number"
              min={30}
              max={600}
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              disabled={generating || loading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="emotion">Emotion</Label>
            <Select
              value={emotion}
              onValueChange={setEmotion}
              disabled={generating || loading}
            >
              <SelectTrigger id="emotion">
                <SelectValue placeholder="Select an emotion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calm">Calm</SelectItem>
                <SelectItem value="happy">Happy</SelectItem>
                <SelectItem value="focus">Focus</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
                <SelectItem value="melancholy">Melancholy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {generating && (
            <div className="space-y-2">
              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                <div 
                  className="h-full bg-primary transition-all" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {uploadProgress < 100 
                  ? `Generating music: ${Math.round(uploadProgress)}%`
                  : 'Processing complete!'}
              </p>
            </div>
          )}
          
          <Button 
            className="w-full" 
            onClick={startGeneration}
            disabled={!title || !artist || generating || loading}
          >
            {generating ? 'Generating...' : 'Generate Music Track'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicCreator;
