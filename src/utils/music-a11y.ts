/**
 * Music Accessibility Utilities
 *
 * Utilitaires pour améliorer l'accessibilité des composants musicaux
 * - ARIA live regions
 * - Screen reader announcements
 * - Keyboard navigation
 * - Focus management
 *
 * @module utils/music-a11y
 */

import type { MusicTrack } from '@/types/music';

// ============================================
// CONSTANTS
// ============================================

const ARIA_LIVE_REGION_ID = 'music-announcer';
const FOCUS_VISIBLE_CLASS = 'focus-visible';

// ============================================
// LIVE REGIONS
// ============================================

/**
 * Crée une région ARIA live pour les annonces
 */
export function createAriaLiveRegion(): HTMLDivElement {
  let liveRegion = document.getElementById(ARIA_LIVE_REGION_ID) as HTMLDivElement;

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = ARIA_LIVE_REGION_ID;
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('role', 'status');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  }

  return liveRegion;
}

/**
 * Annonce un message aux lecteurs d'écran
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const liveRegion = createAriaLiveRegion();
  liveRegion.setAttribute('aria-live', priority);

  // Clear puis set pour forcer la lecture
  liveRegion.textContent = '';

  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);
}

// ============================================
// MUSIC SPECIFIC ANNOUNCEMENTS
// ============================================

/**
 * Annonce le changement de track
 */
export function announceTrackChange(track: MusicTrack): void {
  const message = `Lecture de ${track.title} par ${track.artist}`;
  announce(message, 'polite');
}

/**
 * Annonce la lecture/pause
 */
export function announcePlaybackState(isPlaying: boolean, track?: MusicTrack): void {
  if (isPlaying && track) {
    announce(`Lecture de ${track.title}`, 'polite');
  } else if (!isPlaying) {
    announce('Lecture en pause', 'polite');
  }
}

/**
 * Annonce le changement de volume
 */
export function announceVolumeChange(volume: number): void {
  const percentage = Math.round(volume * 100);
  announce(`Volume: ${percentage}%`, 'polite');
}

/**
 * Annonce la progression
 */
export function announceProgress(currentTime: number, duration: number): void {
  const percentage = Math.round((currentTime / duration) * 100);
  announce(`Progression: ${percentage}%`, 'polite');
}

/**
 * Annonce l'ajout aux favoris
 */
export function announceFavoriteToggle(isFavorite: boolean, trackTitle: string): void {
  const message = isFavorite
    ? `${trackTitle} ajouté aux favoris`
    : `${trackTitle} retiré des favoris`;
  announce(message, 'polite');
}

/**
 * Annonce l'ajout à une playlist
 */
export function announcePlaylistAdd(trackTitle: string, playlistName: string): void {
  announce(`${trackTitle} ajouté à ${playlistName}`, 'polite');
}

/**
 * Annonce le quota utilisateur
 */
export function announceQuota(remaining: number, _limit: number): void {
  if (remaining === 0) {
    announce('Quota de générations épuisé', 'assertive');
  } else if (remaining <= 3) {
    announce(`Attention: seulement ${remaining} générations restantes`, 'polite');
  }
}

/**
 * Annonce une erreur
 */
export function announceError(errorMessage: string): void {
  announce(`Erreur: ${errorMessage}`, 'assertive');
}

/**
 * Annonce le succès d'une opération
 */
export function announceSuccess(message: string): void {
  announce(message, 'polite');
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

/**
 * Configuration des raccourcis clavier pour le player
 */
export const MUSIC_KEYBOARD_SHORTCUTS = {
  PLAY_PAUSE: ' ', // Space
  NEXT_TRACK: 'ArrowRight',
  PREV_TRACK: 'ArrowLeft',
  VOLUME_UP: 'ArrowUp',
  VOLUME_DOWN: 'ArrowDown',
  MUTE: 'm',
  SEEK_FORWARD: 'l', // Like YouTube
  SEEK_BACKWARD: 'j', // Like YouTube
  FULL_SCREEN: 'f',
  TOGGLE_FAVORITE: 'f',
  SHOW_PLAYLIST: 'p',
  SHUFFLE: 's',
  REPEAT: 'r'
} as const;

/**
 * Setup keyboard navigation pour le player
 */
export function setupMusicKeyboardNavigation(
  element: HTMLElement,
  handlers: {
    onPlayPause?: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    onVolumeUp?: () => void;
    onVolumeDown?: () => void;
    onMute?: () => void;
    onSeekForward?: () => void;
    onSeekBackward?: () => void;
    onToggleFavorite?: () => void;
    onShowPlaylist?: () => void;
  }
): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Ignorer si focus dans un input
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    switch (event.key) {
      case MUSIC_KEYBOARD_SHORTCUTS.PLAY_PAUSE:
        event.preventDefault();
        handlers.onPlayPause?.();
        break;

      case MUSIC_KEYBOARD_SHORTCUTS.NEXT_TRACK:
        if (!event.shiftKey) {
          event.preventDefault();
          handlers.onNext?.();
        }
        break;

      case MUSIC_KEYBOARD_SHORTCUTS.PREV_TRACK:
        if (!event.shiftKey) {
          event.preventDefault();
          handlers.onPrev?.();
        }
        break;

      case MUSIC_KEYBOARD_SHORTCUTS.VOLUME_UP:
        event.preventDefault();
        handlers.onVolumeUp?.();
        break;

      case MUSIC_KEYBOARD_SHORTCUTS.VOLUME_DOWN:
        event.preventDefault();
        handlers.onVolumeDown?.();
        break;

      case MUSIC_KEYBOARD_SHORTCUTS.MUTE:
        event.preventDefault();
        handlers.onMute?.();
        break;

      case MUSIC_KEYBOARD_SHORTCUTS.SEEK_FORWARD:
        event.preventDefault();
        handlers.onSeekForward?.();
        break;

      case MUSIC_KEYBOARD_SHORTCUTS.SEEK_BACKWARD:
        event.preventDefault();
        handlers.onSeekBackward?.();
        break;

      case 'f':
        if (event.ctrlKey || event.metaKey) return; // Allow browser find
        event.preventDefault();
        handlers.onToggleFavorite?.();
        break;

      case 'p':
        event.preventDefault();
        handlers.onShowPlaylist?.();
        break;
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  // Cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Setup roving tabindex pour une liste (playlist, etc.)
 */
export function setupRovingTabindex(container: HTMLElement, itemSelector: string): () => void {
  const items = Array.from(container.querySelectorAll(itemSelector)) as HTMLElement[];

  if (items.length === 0) return () => {};

  let currentIndex = 0;

  // Set initial tabindex
  items.forEach((item, index) => {
    item.setAttribute('tabindex', index === 0 ? '0' : '-1');
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    const currentItem = items.indexOf(target);

    if (currentItem === -1) return;

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = Math.min(currentIndex + 1, items.length - 1);
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = Math.max(currentIndex - 1, 0);
        break;

      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        nextIndex = items.length - 1;
        break;

      default:
        return;
    }

    // Update tabindex
    items[currentIndex].setAttribute('tabindex', '-1');
    items[nextIndex].setAttribute('tabindex', '0');
    items[nextIndex].focus();

    currentIndex = nextIndex;
  };

  container.addEventListener('keydown', handleKeyDown);

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

// ============================================
// FOCUS MANAGEMENT
// ============================================

/**
 * Trap focus dans un modal
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Focus first element
  firstElement?.focus();

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Restore focus après fermeture modal
 */
export function createFocusRestorer(): {
  save: () => void;
  restore: () => void;
} {
  let previouslyFocused: HTMLElement | null = null;

  return {
    save: () => {
      previouslyFocused = document.activeElement as HTMLElement;
    },
    restore: () => {
      previouslyFocused?.focus();
      previouslyFocused = null;
    }
  };
}

/**
 * Ensure focus visible (for keyboard users)
 */
export function ensureFocusVisible(): void {
  let hadKeyboardEvent = false;

  const handleKeyDown = () => {
    hadKeyboardEvent = true;
  };

  const handlePointerDown = () => {
    hadKeyboardEvent = false;
  };

  const handleFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement;

    if (hadKeyboardEvent && target.matches(':focus')) {
      target.classList.add(FOCUS_VISIBLE_CLASS);
    } else {
      target.classList.remove(FOCUS_VISIBLE_CLASS);
    }
  };

  document.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('mousedown', handlePointerDown, true);
  document.addEventListener('pointerdown', handlePointerDown, true);
  document.addEventListener('focus', handleFocus, true);
}

// ============================================
// ARIA ATTRIBUTES HELPERS
// ============================================

/**
 * Génère les attributs ARIA pour un player
 */
export function getPlayerAriaAttributes(_isPlaying: boolean, track?: MusicTrack) {
  return {
    'role': 'region',
    'aria-label': 'Lecteur audio',
    'aria-live': 'polite' as const,
    'aria-atomic': true,
    'aria-busy': !track,
    'aria-describedby': track ? `track-${track.id}` : undefined
  };
}

/**
 * Génère les attributs ARIA pour un bouton play/pause
 */
export function getPlayButtonAriaAttributes(isPlaying: boolean) {
  return {
    'aria-label': isPlaying ? 'Pause' : 'Lecture',
    'aria-pressed': isPlaying,
    'role': 'button' as const
  };
}

/**
 * Génère les attributs ARIA pour un slider de volume
 */
export function getVolumeSliderAriaAttributes(volume: number) {
  const percentage = Math.round(volume * 100);

  return {
    'role': 'slider' as const,
    'aria-label': 'Volume',
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-valuenow': percentage,
    'aria-valuetext': `${percentage}%`
  };
}

/**
 * Génère les attributs ARIA pour une progress bar
 */
export function getProgressAriaAttributes(currentTime: number, duration: number) {
  const percentage = Math.round((currentTime / duration) * 100);

  return {
    'role': 'progressbar' as const,
    'aria-label': 'Progression de la lecture',
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-valuenow': percentage,
    'aria-valuetext': `${percentage}% lu`
  };
}

/**
 * Génère les attributs ARIA pour une liste de tracks
 */
export function getTrackListAriaAttributes(count: number) {
  return {
    'role': 'list' as const,
    'aria-label': 'Liste de lecture',
    'aria-live': 'polite' as const,
    'aria-atomic': 'false',
    'aria-relevant': 'additions removals',
    'aria-describedby': `track-count-${count}`
  };
}

/**
 * Génère les attributs ARIA pour un item de track
 */
export function getTrackItemAriaAttributes(
  track: MusicTrack,
  index: number,
  isPlaying: boolean
) {
  return {
    'role': 'listitem' as const,
    'aria-label': `${track.title} par ${track.artist}`,
    'aria-posinset': index + 1,
    'aria-current': isPlaying ? ('true' as const) : undefined,
    'tabindex': 0
  };
}

// ============================================
// FORMAT TIME FOR A11Y
// ============================================

/**
 * Formate le temps pour les lecteurs d'écran
 */
export function formatTimeForScreenReader(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (minutes === 0) {
    return `${remainingSeconds} secondes`;
  }

  return `${minutes} minute${minutes > 1 ? 's' : ''} et ${remainingSeconds} seconde${remainingSeconds > 1 ? 's' : ''}`;
}

// ============================================
// EXPORT ALL
// ============================================

export default {
  createAriaLiveRegion,
  announce,
  announceTrackChange,
  announcePlaybackState,
  announceVolumeChange,
  announceProgress,
  announceFavoriteToggle,
  announcePlaylistAdd,
  announceQuota,
  announceError,
  announceSuccess,
  setupMusicKeyboardNavigation,
  setupRovingTabindex,
  trapFocus,
  createFocusRestorer,
  ensureFocusVisible,
  getPlayerAriaAttributes,
  getPlayButtonAriaAttributes,
  getVolumeSliderAriaAttributes,
  getProgressAriaAttributes,
  getTrackListAriaAttributes,
  getTrackItemAriaAttributes,
  formatTimeForScreenReader,
  MUSIC_KEYBOARD_SHORTCUTS
};
