
import { Track } from '@/contexts/MusicContext';

// Tracks de démonstration avec des URLs d'audio libres de droits
export const demoTracks: Track[] = [
  {
    id: 'demo-1',
    title: 'Relaxation Douce',
    artist: 'Nature Sounds',
    duration: 180,
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
    artwork: '/images/demo-track-1.jpg'
  },
  {
    id: 'demo-2', 
    title: 'Méditation Profonde',
    artist: 'Zen Master',
    duration: 240,
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
    artwork: '/images/demo-track-2.jpg'
  },
  {
    id: 'demo-3',
    title: 'Ambiance Calme',
    artist: 'Peaceful Mind',
    duration: 200,
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
    artwork: '/images/demo-track-3.jpg'
  }
];

// Fonction pour charger la playlist de démonstration
export const loadDemoPlaylist = (): Track[] => {
  console.log('🎵 Chargement de la playlist de démonstration');
  return demoTracks;
};

// Fonction pour obtenir un track aléatoire
export const getRandomTrack = (): Track => {
  const randomIndex = Math.floor(Math.random() * demoTracks.length);
  return demoTracks[randomIndex];
};
