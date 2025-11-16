/**
 * Music Reducer - State management
 */

import { MusicState, MusicAction, MusicOrchestrationPreset } from './types';
import { musicOrchestrationService } from '@/services/music/orchestration';

const initialPreset: MusicOrchestrationPreset = musicOrchestrationService.getActivePreset();

export const initialState: MusicState = {
  currentTrack: null,
  isPlaying: false,
  isPaused: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  progress: 0,
  activePreset: initialPreset,
  lastPresetChange: null,
  playlist: [],
  currentPlaylistIndex: 0,
  shuffleMode: false,
  repeatMode: 'none',
  isGenerating: false,
  generationProgress: 0,
  generationError: null,
  playHistory: [],
  favorites: [],
  therapeuticMode: false,
  emotionTarget: null,
  adaptiveVolume: true,
};

export const musicReducer = (state: MusicState, action: MusicAction): MusicState => {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return { ...state, currentTrack: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload, isPaused: !action.payload };
    case 'SET_PAUSED':
      return { ...state, isPaused: action.payload, isPlaying: !action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: Math.max(0, Math.min(1, action.payload)) };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_ACTIVE_PRESET':
      return {
        ...state,
        activePreset: action.payload.preset,
        lastPresetChange: action.payload.timestamp,
      };
    case 'SET_PLAYLIST':
      return { ...state, playlist: action.payload, currentPlaylistIndex: 0 };
    case 'SET_PLAYLIST_INDEX':
      return { 
        ...state, 
        currentPlaylistIndex: Math.max(0, Math.min(action.payload, state.playlist.length - 1))
      };
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffleMode: !state.shuffleMode };
    case 'SET_REPEAT_MODE':
      return { ...state, repeatMode: action.payload };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'SET_GENERATION_PROGRESS':
      return { ...state, generationProgress: action.payload };
    case 'SET_GENERATION_ERROR':
      return { ...state, generationError: action.payload };
    case 'ADD_TO_HISTORY':
      return { 
        ...state, 
        playHistory: [action.payload, ...state.playHistory.slice(0, 49)]
      };
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload]
      };
    case 'SET_THERAPEUTIC_MODE':
      return { ...state, therapeuticMode: action.payload };
    case 'SET_EMOTION_TARGET':
      return { ...state, emotionTarget: action.payload };
    case 'SET_ADAPTIVE_VOLUME':
      return { ...state, adaptiveVolume: action.payload };
    default:
      return state;
  }
};
