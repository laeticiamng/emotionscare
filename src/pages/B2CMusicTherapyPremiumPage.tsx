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
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';

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
      <ConsentGate>
        <PageRoot>
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
            <div className="container mx-auto px-4 py-16">
              <div className="mb-12 text-center">
                <div className="mb-4 flex items-center justify-center gap-3">
                  <Crown className="h-8 w-8 text-yellow-400" />
                  <h1 className="text-4xl font-bold text-transparent md:text-6xl bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                    Music Therapy Premium
                  </h1>
                  <Crown className="h-8 w-8 text-yellow-400" />
                </div>
                <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-300">
                  Thérapie musicale avancée avec fréquences binaurales et compositions exclusives
                </p>
              </div>

              <div className="grid gap-6">
                {PREMIUM_TRACKS.map(track => (
                  <div key={track.id} className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handlePlayPause(track)}
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                          selectedTrack?.id === track.id && isPlaying
                            ? 'bg-yellow-400 text-black'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {selectedTrack?.id === track.id && isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="ml-0.5 h-5 w-5" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-white">{track.title}</h3>
                          <Crown className="h-4 w-4 text-yellow-400" />
                        </div>
                        <p className="mb-1 text-gray-400">{track.artist}</p>
                        <p className="text-sm text-gray-500">{track.description}</p>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-yellow-400">{track.frequency}</div>
                        <div className="text-sm text-gray-400">{track.duration}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PageRoot>
      </ConsentGate>
    );
};

export default B2CMusicTherapyPremiumPage;
