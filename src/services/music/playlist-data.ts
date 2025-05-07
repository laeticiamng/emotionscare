
import { MusicTrack } from '@/types/music';

// Define types of playlists with sample tracks
export const emotionPlaylists: Record<string, MusicTrack[]> = {
  happy: [
    {
      id: 'happy-1',
      title: 'Sunshine Melody',
      artist: 'Mood Elevators',
      duration: 187,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_9598e49d65.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1520962922320-2038eebab146',
      emotion: 'happy'
    },
    {
      id: 'happy-2',
      title: 'Dancing Lights',
      artist: 'Positive Energy',
      duration: 212,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6435fe5.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320',
      emotion: 'happy'
    },
    {
      id: 'happy-3',
      title: 'Morning Joy',
      artist: 'Sunrise Sounds',
      duration: 195,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/05/16/audio_3242a0cf66.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1475724017904-b712052c192a',
      emotion: 'happy'
    }
  ],
  
  calm: [
    {
      id: 'calm-1',
      title: 'Ocean Waves',
      artist: 'Nature Sounds',
      duration: 240,
      audioUrl: 'https://cdn.pixabay.com/audio/2021/08/09/audio_dc39bede44.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0',
      emotion: 'calm'
    },
    {
      id: 'calm-2',
      title: 'Gentle Rain',
      artist: 'Peaceful Mind',
      duration: 225,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/10/05/audio_304e9ebf75.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17',
      emotion: 'calm'
    },
    {
      id: 'calm-3',
      title: 'Meditation Hour',
      artist: 'Zen Masters',
      duration: 315,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5',
      emotion: 'calm'
    }
  ],
  
  focused: [
    {
      id: 'focused-1',
      title: 'Concentration',
      artist: 'Mind Flow',
      duration: 202,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/05/13/audio_d200f84d3e.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
      emotion: 'focused'
    },
    {
      id: 'focused-2',
      title: 'Deep Work',
      artist: 'Cognitive Boost',
      duration: 243,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
      emotion: 'focused'
    },
    {
      id: 'focused-3',
      title: 'Mind Zone',
      artist: 'Concentration Wave',
      duration: 198,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8b0d50f4d.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2',
      emotion: 'focused'
    }
  ],
  
  energetic: [
    {
      id: 'energetic-1',
      title: 'Power Up',
      artist: 'Energy Boost',
      duration: 165,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/03/19/audio_270f49b1d1.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1470319149933-6db8be0f50fa',
      emotion: 'energetic'
    },
    {
      id: 'energetic-2',
      title: 'Momentum',
      artist: 'Rhythm Surge',
      duration: 183,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/01/21/audio_d16703ac0e.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
      emotion: 'energetic'
    },
    {
      id: 'energetic-3',
      title: 'Fast Forward',
      artist: 'Adrenaline Wave',
      duration: 175,
      audioUrl: 'https://cdn.pixabay.com/audio/2021/11/25/audio_5c6b9de330.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105',
      emotion: 'energetic'
    }
  ],
  
  neutral: [
    {
      id: 'neutral-1',
      title: 'Soft Balance',
      artist: 'Harmony Flow',
      duration: 210,
      audioUrl: 'https://cdn.pixabay.com/audio/2021/11/01/audio_00fa5593f3.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699',
      emotion: 'neutral'
    },
    {
      id: 'neutral-2',
      title: 'Gentle Day',
      artist: 'Everyday Sounds',
      duration: 235,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/01/26/audio_978b2a8dc3.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a',
      emotion: 'neutral'
    },
    {
      id: 'neutral-3',
      title: 'Balanced Mind',
      artist: 'Middle Ground',
      duration: 195,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/04/27/audio_568b66efef.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946',
      emotion: 'neutral'
    }
  ]
};
