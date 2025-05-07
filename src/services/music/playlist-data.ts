
import { MusicTrack } from '@/types/music';

// Playlists statiques par émotion
export const emotionPlaylists: Record<string, MusicTrack[]> = {
  calm: [
    {
      id: 'calm-1',
      title: 'Méditation au bord de l\'eau',
      artist: 'Nature Sounds',
      duration: 180,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6435fe5.mp3?filename=ocean-waves-112924.mp3',
      coverUrl: '/images/calm-1.jpg',
      emotion: 'calm'
    },
    {
      id: 'calm-2',
      title: 'Sérénité nocturne',
      artist: 'Ambient Dreams',
      duration: 240,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_00fa5593f3.mp3?filename=ambient-piano-amp-strings-10711.mp3',
      coverUrl: '/images/calm-2.jpg',
      emotion: 'calm'
    },
    {
      id: 'calm-3',
      title: 'Forêt enchantée',
      artist: 'Deep Relaxation',
      duration: 210,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_90852d2423.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3',
      coverUrl: '/images/calm-3.jpg',
      emotion: 'calm'
    }
  ],
  happy: [
    {
      id: 'happy-1',
      title: 'Sunshine Vibes',
      artist: 'Happy Tunes',
      duration: 165,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=summer-walk-153562.mp3',
      coverUrl: '/images/happy-1.jpg',
      emotion: 'happy'
    },
    {
      id: 'happy-2',
      title: 'Morning Energy',
      artist: 'Mood Lifters',
      duration: 195,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/30/audio_946f4ebb05.mp3?filename=motivational-electronic-distant-132919.mp3',
      coverUrl: '/images/happy-2.jpg',
      emotion: 'happy'
    },
    {
      id: 'happy-3',
      title: 'Summer Dreams',
      artist: 'Beach Collective',
      duration: 182,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/08/04/audio_884fe92c21.mp3?filename=hawaii-groove-184287.mp3',
      coverUrl: '/images/happy-3.jpg',
      emotion: 'happy'
    }
  ],
  energetic: [
    {
      id: 'energetic-1',
      title: 'Power Up',
      artist: 'Workout Beats',
      duration: 175,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_40ce8a1485.mp3?filename=powerful-beat-121008.mp3',
      coverUrl: '/images/energetic-1.jpg',
      emotion: 'energetic'
    },
    {
      id: 'energetic-2',
      title: 'Electric Rush',
      artist: 'Energy Collective',
      duration: 188,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2021/12/13/audio_cb4f1211a4.mp3?filename=sport-fashion-rock-synthwave-electro-romantic-powerful-opener-epic-legends-142467.mp3',
      coverUrl: '/images/energetic-2.jpg',
      emotion: 'energetic'
    }
  ],
  focused: [
    {
      id: 'focused-1',
      title: 'Deep Concentration',
      artist: 'Mind Focus',
      duration: 210,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_c8182d3dfd.mp3?filename=electronic-future-beats-117997.mp3',
      coverUrl: '/images/focused-1.jpg',
      emotion: 'focused'
    },
    {
      id: 'focused-2',
      title: 'Clarity',
      artist: 'Study Sessions',
      duration: 195,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_dc39bede44.mp3?filename=evident-curiousity-114347.mp3',
      coverUrl: '/images/focused-2.jpg',
      emotion: 'focused'
    }
  ],
  neutral: [
    {
      id: 'neutral-1',
      title: 'Ambient Flow',
      artist: 'Neutral Minds',
      duration: 190,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/02/22/audio_508bd7ce5e.mp3?filename=quiet-place-piano-with-ambient-pad-119382.mp3',
      coverUrl: '/images/neutral-1.jpg',
      emotion: 'neutral'
    },
    {
      id: 'neutral-2',
      title: 'Gentle Waves',
      artist: 'Sound Balance',
      duration: 205,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_9614bc2d96.mp3?filename=moment-of-relief-12609.mp3',
      coverUrl: '/images/neutral-2.jpg',
      emotion: 'neutral'
    }
  ]
};
