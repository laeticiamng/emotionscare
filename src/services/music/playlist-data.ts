
// Ce fichier sert de fallback si l'API TopMedia n'est pas disponible
import { MusicTrack } from '@/types/music';

// Types d'émotions disponibles dans notre système
type EmotionKey = 'happy' | 'calm' | 'energetic' | 'focused' | 'neutral';

// Structure des playlists par émotion
export const emotionPlaylists: Record<EmotionKey, MusicTrack[]> = {
  happy: [
    {
      id: 'happy-1',
      title: 'Walking on Sunshine',
      artist: 'Mood Elevators',
      duration: 187,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_7cad99ae24.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81',
      emotion: 'happy'
    },
    {
      id: 'happy-2',
      title: 'Joyful Morning',
      artist: 'The Optimists',
      duration: 204,
      audioUrl: 'https://cdn.pixabay.com/audio/2021/11/23/audio_cb4f1212a9.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1517230878791-4d28214057c2',
      emotion: 'happy'
    },
    {
      id: 'happy-3',
      title: 'Positive Vibes',
      artist: 'Sunshine Orchestra',
      duration: 195,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9',
      emotion: 'happy'
    }
  ],
  
  calm: [
    {
      id: 'calm-1',
      title: 'Ocean Breeze',
      artist: 'Tranquil Sounds',
      duration: 238,
      audioUrl: 'https://cdn.pixabay.com/audio/2021/04/07/audio_b84467212c.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      emotion: 'calm'
    },
    {
      id: 'calm-2',
      title: 'Rainfall Meditation',
      artist: 'Nature Harmony',
      duration: 226,
      audioUrl: 'https://cdn.pixabay.com/audio/2021/08/09/audio_dc39bede44.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0',
      emotion: 'calm'
    },
    {
      id: 'calm-3',
      title: 'Silent Forest',
      artist: 'Mindful Melodies',
      duration: 247,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6435fe5.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
      emotion: 'calm'
    }
  ],
  
  energetic: [
    {
      id: 'energetic-1',
      title: 'Power Up',
      artist: 'Energy Beats',
      duration: 173,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/08/23/audio_69a61cd8d8.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1535743686920-55e4145369b9',
      emotion: 'energetic'
    },
    {
      id: 'energetic-2',
      title: 'Morning Workout',
      artist: 'Fitness Groove',
      duration: 192,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/10/25/audio_5dbbdc33b6.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c',
      emotion: 'energetic'
    },
    {
      id: 'energetic-3',
      title: 'Dynamic Flow',
      artist: 'Rhythm Revolution',
      duration: 185,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/05/16/audio_7b7e244725.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb',
      emotion: 'energetic'
    }
  ],
  
  focused: [
    {
      id: 'focused-1',
      title: 'Deep Concentration',
      artist: 'Mind Masters',
      duration: 256,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8b0124e4d.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
      emotion: 'focused'
    },
    {
      id: 'focused-2',
      title: 'Study Session',
      artist: 'Cognitive Flow',
      duration: 218,
      audioUrl: 'https://cdn.pixabay.com/audio/2021/12/13/audio_98ccd8b74c.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
      emotion: 'focused'
    },
    {
      id: 'focused-3',
      title: 'Productive Space',
      artist: 'Task Completion',
      duration: 231,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/02/07/audio_d6ba19a93f.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc',
      emotion: 'focused'
    }
  ],
  
  neutral: [
    {
      id: 'neutral-1',
      title: 'Ambient Flow',
      artist: 'Balance Project',
      duration: 210,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/01/25/audio_3812f01b28.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1465146633011-14f8e0781093',
      emotion: 'neutral'
    },
    {
      id: 'neutral-2',
      title: 'Middle Ground',
      artist: 'Equilibrium',
      duration: 197,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/04/27/audio_c8d45d5c59.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8',
      emotion: 'neutral'
    },
    {
      id: 'neutral-3',
      title: 'Everyday Soundtrack',
      artist: 'Normal State',
      duration: 223,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/08/02/audio_2dde668d05.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
      emotion: 'neutral'
    }
  ]
};
