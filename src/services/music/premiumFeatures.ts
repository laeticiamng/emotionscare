import topMediaMusicService from './topMediaService';
import { MusicTrack, MusicPlaylist } from '@/types/music';

/**
 * Coach musical IA contextuel
 * Génère une piste musicale adaptée à l'émotion ou au besoin détecté.
 */
export async function generateContextualMusic(emotion: string, options: { stressLevel?: number; need?: 'motivation' | 'confort' } = {}): Promise<MusicTrack | null> {
  try {
    const suggestion = topMediaMusicService.getMoodSuggestions(emotion);
    const { song_id } = await topMediaMusicService.submitMusicGenerationTask({
      is_auto: suggestion.lyrics ? 0 : 1,
      prompt: suggestion.prompt,
      lyrics: suggestion.lyrics,
      title: suggestion.title,
      instrumental: suggestion.instrumental ? 1 : 0,
      mood: emotion
    });
    const status = await topMediaMusicService.checkGenerationStatus(song_id);
    if (status.status === 'completed' && status.url) {
      return topMediaMusicService.convertToMusicTrack(song_id, suggestion.title, { url: status.url });
    }
    return null;
  } catch (error) {
    console.error('generateContextualMusic error', error);
    return null;
  }
}

/**
 * Playlists émotionnelles intelligentes
 * Génère une playlist correspondant à un objectif émotionnel.
 */
export async function generateEmotionPlaylist(goal: string, opts: { duration?: number; ambiance?: string; style?: string } = {}): Promise<MusicPlaylist> {
  const tracks: MusicTrack[] = [];
  const mood = goal.toLowerCase();
  const suggestion = topMediaMusicService.getMoodSuggestions(mood);
  const { song_id } = await topMediaMusicService.submitMusicGenerationTask({
    is_auto: suggestion.lyrics ? 0 : 1,
    prompt: suggestion.prompt,
    lyrics: suggestion.lyrics,
    title: suggestion.title,
    instrumental: suggestion.instrumental ? 1 : 0,
    mood
  });
  const status = await topMediaMusicService.checkGenerationStatus(song_id);
  if (status.status === 'completed' && status.url) {
    tracks.push(topMediaMusicService.convertToMusicTrack(song_id, suggestion.title, { url: status.url }));
  }
  return {
    id: `playlist-${goal}-${Date.now()}`,
    name: suggestion.title,
    title: suggestion.title,
    tracks,
    emotion: mood,
    description: opts.ambiance || `Playlist ${goal}`
  };
}

/**
 * Création collaborative de musique d'équipe
 * Chaque membre propose un prompt pour générer un morceau commun.
 */
export async function createTeamTrack(teamId: string, prompts: string[]): Promise<MusicTrack | null> {
  try {
    const prompt = prompts.join(' ');
    const { song_id } = await topMediaMusicService.submitMusicGenerationTask({
      is_auto: 1,
      prompt,
      title: `Team ${teamId} track`,
      instrumental: 1,
      mood: 'team'
    });
    const status = await topMediaMusicService.checkGenerationStatus(song_id);
    if (status.status === 'completed' && status.url) {
      return topMediaMusicService.convertToMusicTrack(song_id, `Team ${teamId}`, { url: status.url });
    }
    return null;
  } catch (error) {
    console.error('createTeamTrack error', error);
    return null;
  }
}

/**
 * Génère une ambiance musicale pour un événement ou une étape d'onboarding.
 */
export async function generateEventMusic(event: string, step?: string): Promise<MusicTrack | null> {
  const mood = step ? `${event} ${step}` : event;
  return generateContextualMusic(mood);
}

/**
 * Module "Météo sonore" : génère une ambiance quotidienne pour l'équipe.
 */
export async function generateDailyTeamMood(mood: string): Promise<MusicTrack | null> {
  return generateContextualMusic(mood);
}

/**
 * Personnalisation avancée pour la génération de musique.
 */
export async function generateCustomMusic(options: { tempo?: number; key?: string; instruments?: string[]; duration?: number; mood?: string }): Promise<MusicTrack | null> {
  try {
    const promptParts = [options.mood || ''];
    if (options.instruments?.length) promptParts.push(`instruments: ${options.instruments.join(', ')}`);
    if (options.tempo) promptParts.push(`tempo ${options.tempo}bpm`);
    if (options.key) promptParts.push(`key ${options.key}`);
    const prompt = promptParts.join(', ');
    const { song_id } = await topMediaMusicService.submitMusicGenerationTask({
      is_auto: 1,
      prompt,
      title: 'Custom track',
      instrumental: 1,
      mood: options.mood
    });
    const status = await topMediaMusicService.checkGenerationStatus(song_id);
    if (status.status === 'completed' && status.url) {
      return topMediaMusicService.convertToMusicTrack(song_id, 'Custom track', { url: status.url });
    }
    return null;
  } catch (error) {
    console.error('generateCustomMusic error', error);
    return null;
  }
}

/**
 * Exporte la partition ou le MIDI d'une piste générée.
 */
export async function exportMidi(trackId: string): Promise<string | null> {
  try {
    // Placeholder implementation; would call TopMedia or storage service
    return `${trackId}.midi`;
  } catch (error) {
    console.error('exportMidi error', error);
    return null;
  }
}

/**
 * Endpoint d'appel externe pour générer une musique émotionnelle.
 */
export async function partnerGenerateMusic(emotion: string): Promise<MusicTrack | null> {
  return generateContextualMusic(emotion);
}

/**
 * Génère une musique thématique pour un événement ou une saison.
 */
export async function generateSeasonalMusic(theme: string): Promise<MusicTrack | null> {
  return generateContextualMusic(theme);
}

/**
 * Partage ou remix d'une piste existante.
 */
export async function remixTrack(trackId: string, prompt: string): Promise<MusicTrack | null> {
  try {
    const { song_id } = await topMediaMusicService.submitMusicGenerationTask({
      is_auto: 1,
      continue_at: 30,
      continue_song_id: trackId,
      prompt,
      title: `Remix of ${trackId}`,
      instrumental: 1
    });
    const status = await topMediaMusicService.checkGenerationStatus(song_id);
    if (status.status === 'completed' && status.url) {
      return topMediaMusicService.convertToMusicTrack(song_id, `Remix ${trackId}`, { url: status.url });
    }
    return null;
  } catch (error) {
    console.error('remixTrack error', error);
    return null;
  }
}
