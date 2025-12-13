/**
 * Meditation Audio Service - Gestion des sons ambiants et guidages audio
 * Prend en charge les sons de fond, la voix de guidance et les transitions
 */

import { logger } from '@/lib/logger';

export type AmbientSoundType = 
  | 'rain' 
  | 'ocean' 
  | 'forest' 
  | 'fire' 
  | 'wind' 
  | 'birds' 
  | 'thunder' 
  | 'stream' 
  | 'night' 
  | 'tibetan_bowl'
  | 'white_noise'
  | 'brown_noise'
  | 'pink_noise';

export interface AmbientSound {
  id: AmbientSoundType;
  name: string;
  icon: string;
  category: 'nature' | 'water' | 'noise' | 'instruments';
  description: string;
  url: string;
}

export interface GuidanceTrack {
  id: string;
  name: string;
  technique: string;
  duration: number; // seconds
  language: 'fr' | 'en';
  url: string;
}

// Bibliothèque de sons ambiants (URLs publiques gratuites)
const AMBIENT_SOUNDS: AmbientSound[] = [
  {
    id: 'rain',
    name: 'Pluie douce',
    icon: '🌧️',
    category: 'nature',
    description: 'Pluie légère et apaisante',
    url: 'https://cdn.pixabay.com/audio/2022/05/13/audio_257112ce2f.mp3'
  },
  {
    id: 'ocean',
    name: 'Vagues océan',
    icon: '🌊',
    category: 'water',
    description: 'Vagues douces sur la plage',
    url: 'https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3'
  },
  {
    id: 'forest',
    name: 'Forêt',
    icon: '🌲',
    category: 'nature',
    description: 'Ambiance forestière paisible',
    url: 'https://cdn.pixabay.com/audio/2022/10/30/audio_3b3f66f0af.mp3'
  },
  {
    id: 'fire',
    name: 'Feu de cheminée',
    icon: '🔥',
    category: 'nature',
    description: 'Crépitement de feu apaisant',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115fb53bf3.mp3'
  },
  {
    id: 'birds',
    name: 'Chants d\'oiseaux',
    icon: '🐦',
    category: 'nature',
    description: 'Oiseaux au lever du soleil',
    url: 'https://cdn.pixabay.com/audio/2022/04/27/audio_67bcb5e49f.mp3'
  },
  {
    id: 'stream',
    name: 'Ruisseau',
    icon: '💧',
    category: 'water',
    description: 'Eau qui coule doucement',
    url: 'https://cdn.pixabay.com/audio/2022/02/23/audio_ea70ad08e2.mp3'
  },
  {
    id: 'night',
    name: 'Nuit d\'été',
    icon: '🌙',
    category: 'nature',
    description: 'Grillons et nuit paisible',
    url: 'https://cdn.pixabay.com/audio/2022/08/31/audio_419263fc29.mp3'
  },
  {
    id: 'tibetan_bowl',
    name: 'Bol tibétain',
    icon: '🔔',
    category: 'instruments',
    description: 'Vibrations harmoniques',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8e92a82.mp3'
  },
  {
    id: 'white_noise',
    name: 'Bruit blanc',
    icon: '📻',
    category: 'noise',
    description: 'Son uniforme relaxant',
    url: 'https://cdn.pixabay.com/audio/2022/03/24/audio_d5e1a4d0d4.mp3'
  },
  {
    id: 'brown_noise',
    name: 'Bruit brun',
    icon: '🟤',
    category: 'noise',
    description: 'Fréquences basses apaisantes',
    url: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3'
  }
];

// Guidances audio générées
const GUIDANCE_TRACKS: GuidanceTrack[] = [
  {
    id: 'breathing-4-7-8',
    name: 'Respiration 4-7-8',
    technique: '4-7-8',
    duration: 300,
    language: 'fr',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8e92a82.mp3'
  },
  {
    id: 'body-scan',
    name: 'Scan corporel',
    technique: 'body-scan',
    duration: 600,
    language: 'fr',
    url: 'https://cdn.pixabay.com/audio/2022/05/16/audio_460b6c7c2b.mp3'
  },
  {
    id: 'loving-kindness',
    name: 'Méditation bienveillance',
    technique: 'metta',
    duration: 480,
    language: 'fr',
    url: 'https://cdn.pixabay.com/audio/2022/10/30/audio_3b3f66f0af.mp3'
  }
];

class MeditationAudioServiceClass {
  private ambientAudio: HTMLAudioElement | null = null;
  private guidanceAudio: HTMLAudioElement | null = null;
  private bellAudio: HTMLAudioElement | null = null;
  private fadeInterval: NodeJS.Timeout | null = null;
  private currentVolume: number = 0.5;
  private isPlaying: boolean = false;
  private currentAmbientId: AmbientSoundType | null = null;
  private mixedSounds: Map<string, HTMLAudioElement> = new Map();

  /**
   * Récupère la liste des sons ambiants disponibles
   */
  getAmbientSounds(): AmbientSound[] {
    return AMBIENT_SOUNDS;
  }

  /**
   * Récupère les sons par catégorie
   */
  getSoundsByCategory(category: AmbientSound['category']): AmbientSound[] {
    return AMBIENT_SOUNDS.filter(s => s.category === category);
  }

  /**
   * Récupère les guidances disponibles
   */
  getGuidanceTracks(): GuidanceTrack[] {
    return GUIDANCE_TRACKS;
  }

  /**
   * Récupère une guidance par technique
   */
  getGuidanceByTechnique(technique: string): GuidanceTrack | undefined {
    return GUIDANCE_TRACKS.find(g => g.technique === technique);
  }

  /**
   * Mixe plusieurs sons ambiants ensemble
   */
  async playMixedAmbient(
    sounds: Array<{ id: AmbientSoundType; volume: number }>
  ): Promise<void> {
    try {
      // Arrêter les sons existants
      this.stopAllMixed();

      for (const { id, volume } of sounds) {
        const sound = AMBIENT_SOUNDS.find(s => s.id === id);
        if (!sound) continue;

        const audio = new Audio(sound.url);
        audio.loop = true;
        audio.volume = 0;

        await audio.play();
        this.mixedSounds.set(id, audio);

        // Fade in
        await this.fadeIn(audio, volume, 1500);
      }

      this.isPlaying = true;
      logger.info('Mixed ambient started', { count: sounds.length }, 'MEDITATION_AUDIO');
    } catch (error) {
      logger.error('Error playing mixed ambient', error as Error, 'MEDITATION_AUDIO');
    }
  }

  /**
   * Ajuste le volume d'un son dans le mix
   */
  setMixedVolume(soundId: AmbientSoundType, volume: number): void {
    const audio = this.mixedSounds.get(soundId);
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Arrête tous les sons mixés
   */
  async stopAllMixed(): Promise<void> {
    const promises = Array.from(this.mixedSounds.values()).map(audio => 
      this.fadeOut(audio, 1000).then(() => {
        audio.pause();
      })
    );
    await Promise.all(promises);
    this.mixedSounds.clear();
  }

  /**
   * Précharge un son pour lecture instantanée
   */
  async preload(soundId: AmbientSoundType): Promise<void> {
    const sound = AMBIENT_SOUNDS.find(s => s.id === soundId);
    if (!sound) return;

    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = sound.url;
    
    return new Promise((resolve) => {
      audio.oncanplaythrough = () => resolve();
      audio.onerror = () => resolve();
    });
  }

  /**
   * Récupère le son ambiant actuellement en lecture
   */
  getCurrentAmbientId(): AmbientSoundType | null {
    return this.currentAmbientId;
  }

  /**
   * Joue un son ambiant
   */
  async playAmbient(soundId: AmbientSoundType, volume: number = 0.5): Promise<void> {
    try {
      const sound = AMBIENT_SOUNDS.find(s => s.id === soundId);
      if (!sound) {
        logger.warn('Ambient sound not found', { soundId }, 'MEDITATION_AUDIO');
        return;
      }

      // Stop existing ambient
      await this.stopAmbient();

      this.ambientAudio = new Audio(sound.url);
      this.ambientAudio.loop = true;
      this.ambientAudio.volume = 0;
      this.currentVolume = volume;
      this.currentAmbientId = soundId;

      await this.ambientAudio.play();
      this.isPlaying = true;

      // Fade in
      await this.fadeIn(this.ambientAudio, volume, 2000);

      logger.info('Ambient sound started', { soundId }, 'MEDITATION_AUDIO');
    } catch (error) {
      logger.error('Error playing ambient sound', error as Error, 'MEDITATION_AUDIO');
      this.isPlaying = false;
      this.currentAmbientId = null;
    }
  }

  /**
   * Arrête le son ambiant avec fade out
   */
  async stopAmbient(): Promise<void> {
    if (this.ambientAudio) {
      await this.fadeOut(this.ambientAudio, 1500);
      this.ambientAudio.pause();
      this.ambientAudio = null;
      this.isPlaying = false;
    }
  }

  /**
   * Ajuste le volume du son ambiant
   */
  setAmbientVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.ambientAudio) {
      this.ambientAudio.volume = this.currentVolume;
    }
  }

  /**
   * Joue un son de cloche/bol pour marquer les transitions
   */
  async playBell(type: 'start' | 'transition' | 'end' = 'start'): Promise<void> {
    try {
      const bellUrl = 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8e92a82.mp3';
      
      if (this.bellAudio) {
        this.bellAudio.pause();
      }

      this.bellAudio = new Audio(bellUrl);
      this.bellAudio.volume = type === 'end' ? 0.7 : 0.5;
      await this.bellAudio.play();

      logger.debug('Bell played', { type }, 'MEDITATION_AUDIO');
    } catch (error) {
      logger.warn('Could not play bell sound', error, 'MEDITATION_AUDIO');
    }
  }

  /**
   * Prépare et joue une guidance audio (si disponible)
   */
  async playGuidance(url: string, volume: number = 0.8): Promise<void> {
    try {
      this.stopGuidance();

      this.guidanceAudio = new Audio(url);
      this.guidanceAudio.volume = volume;

      // Baisser l'ambiant pendant la guidance
      if (this.ambientAudio) {
        this.ambientAudio.volume = this.currentVolume * 0.3;
      }

      await this.guidanceAudio.play();

      this.guidanceAudio.onended = () => {
        // Remonter l'ambiant après la guidance
        if (this.ambientAudio) {
          this.fadeIn(this.ambientAudio, this.currentVolume, 1000);
        }
      };
    } catch (error) {
      logger.error('Error playing guidance', error as Error, 'MEDITATION_AUDIO');
    }
  }

  /**
   * Arrête la guidance audio
   */
  stopGuidance(): void {
    if (this.guidanceAudio) {
      this.guidanceAudio.pause();
      this.guidanceAudio = null;
    }
  }

  /**
   * Arrête tous les sons
   */
  stopAll(): void {
    this.stopAmbient();
    this.stopGuidance();
    if (this.bellAudio) {
      this.bellAudio.pause();
      this.bellAudio = null;
    }
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
  }

  /**
   * Vérifie si un son est en cours de lecture
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Récupère le volume actuel
   */
  getCurrentVolume(): number {
    return this.currentVolume;
  }

  // Helpers privés

  private fadeIn(audio: HTMLAudioElement, targetVolume: number, duration: number): Promise<void> {
    return new Promise(resolve => {
      const steps = 20;
      const stepDuration = duration / steps;
      const volumeStep = targetVolume / steps;
      let currentStep = 0;

      if (this.fadeInterval) clearInterval(this.fadeInterval);

      this.fadeInterval = setInterval(() => {
        currentStep++;
        audio.volume = Math.min(targetVolume, volumeStep * currentStep);

        if (currentStep >= steps) {
          if (this.fadeInterval) clearInterval(this.fadeInterval);
          this.fadeInterval = null;
          resolve();
        }
      }, stepDuration);
    });
  }

  private fadeOut(audio: HTMLAudioElement, duration: number): Promise<void> {
    return new Promise(resolve => {
      const steps = 15;
      const stepDuration = duration / steps;
      const startVolume = audio.volume;
      const volumeStep = startVolume / steps;
      let currentStep = 0;

      if (this.fadeInterval) clearInterval(this.fadeInterval);

      this.fadeInterval = setInterval(() => {
        currentStep++;
        audio.volume = Math.max(0, startVolume - volumeStep * currentStep);

        if (currentStep >= steps) {
          if (this.fadeInterval) clearInterval(this.fadeInterval);
          this.fadeInterval = null;
          resolve();
        }
      }, stepDuration);
    });
  }
}

export const meditationAudioService = new MeditationAudioServiceClass();
export default meditationAudioService;
