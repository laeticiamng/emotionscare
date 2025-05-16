
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { MusicTrack } from '@/types/music';

const MusicCreator: React.FC = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [tempo, setTempo] = useState(120);
  const [mood, setMood] = useState('calm');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<MusicTrack | null>(null);

  const handleGenerate = async () => {
    if (!title) {
      toast({
        title: 'Title required',
        description: 'Please provide a title for your music piece',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate API call to generate music
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock generated track
      const newTrack: MusicTrack = {
        id: `track-${Date.now()}`,
        title,
        artist: artist || 'AI Composer',
        duration: Math.floor(Math.random() * 180) + 60, // 60-240 seconds
        mood,
        tempo,
        url: '/sounds/ambient-calm.mp3', // Placeholder
        coverUrl: '/images/music-cover.jpg', // Placeholder
        intensity: tempo / 180, // Normalize to 0-1 range
      };
      
      setGeneratedTrack(newTrack);
      toast({
        title: 'Music created!',
        description: `${title} has been successfully generated`,
      });
    } catch (error) {
      toast({
        title: 'Generation failed',
        description: 'There was a problem creating your music',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Create AI Music</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your music"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="artist">Artist Name (optional)</Label>
          <Input 
            id="artist" 
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Who is the composer?"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Tempo: {tempo} BPM</Label>
          <Slider
            min={60}
            max={180}
            step={1}
            value={[tempo]}
            onValueChange={(val) => setTempo(val[0])}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mood">Mood</Label>
          <select
            id="mood"
            className="w-full p-2 border rounded-md"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option value="calm">Calm</option>
            <option value="energetic">Energetic</option>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="focus">Focus</option>
          </select>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => {
          setTitle('');
          setArtist('');
          setTempo(120);
          setMood('calm');
        }}>
          Reset
        </Button>
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Music'}
        </Button>
      </CardFooter>
      
      {generatedTrack && (
        <CardContent>
          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-medium">Generated Track</h3>
            <p>"{generatedTrack.title}" by {generatedTrack.artist}</p>
            <p>Duration: {Math.floor(generatedTrack.duration / 60)}:{(generatedTrack.duration % 60).toString().padStart(2, '0')}</p>
            <audio src={generatedTrack.url} controls className="mt-2 w-full" />
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default MusicCreator;
