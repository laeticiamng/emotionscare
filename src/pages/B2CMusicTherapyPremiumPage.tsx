import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Volume2, Star, Crown, Headphones, Music, 
  Heart, Brain, Download, Share, Bookmark, Settings,
  SkipBack, SkipForward, Shuffle, Repeat, Clock,
  Sparkles, Award, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/contexts/MusicContext';
import { cn } from '@/lib/utils';
import PageRoot from '@/components/common/PageRoot';

interface PremiumTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  category: 'focus' | 'relaxation' | 'energy' | 'healing' | 'meditation';
  frequency: string;
  description: string;
  premium: boolean;
}

const PREMIUM_TRACKS: PremiumTrack[] = [
  {
    id: '1',
    title: 'Deep Focus Alpha Waves',
    artist: 'EmotionsCare Studio',
    duration: '45:00',
    category: 'focus',
    frequency: '10Hz Alpha',
    description: 'Ondes alpha pour concentration profonde et créativité',
    premium: true
  },
  {
    id: '2',
    title: 'Healing Theta Journey',
    artist: 'EmotionsCare Studio',
    duration: '60:00',
    category: 'healing',
    frequency: '6Hz Theta',
    description: 'Thérapie par les fréquences pour guérison émotionnelle',
    premium: true
  }
];

const B2CMusicTherapyPremiumPage: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState<PremiumTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = (track: PremiumTrack) => {
    if (selectedTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedTrack(track);
      setIsPlaying(true);
    }
  };

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="h-8 w-8 text-yellow-400" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Music Therapy Premium
              </h1>
              <Crown className="h-8 w-8 text-yellow-400" />
            </div>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Thérapie musicale avancée avec fréquences binaurales et compositions exclusives
            </p>
          </div>

          <div className="grid gap-6">
            {PREMIUM_TRACKS.map((track) => (
              <div key={track.id} className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handlePlayPause(track)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      selectedTrack?.id === track.id && isPlaying
                        ? 'bg-yellow-400 text-black'
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    {selectedTrack?.id === track.id && isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{track.title}</h3>
                      <Crown className="h-4 w-4 text-yellow-400" />
                    </div>
                    <p className="text-gray-400 mb-1">{track.artist}</p>
                    <p className="text-sm text-gray-500">{track.description}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold">{track.frequency}</div>
                    <div className="text-gray-400 text-sm">{track.duration}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageRoot>
  );
};

export default B2CMusicTherapyPremiumPage;