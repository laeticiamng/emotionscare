
/**
 * 🎵 Music Context
 * ------------------------------------
 * This file serves as the central export point for all music context functionality.
 * Import from this file instead of directly referencing the implementation.
 */

// Export the hook for accessing music functionality
export { useMusic } from '@/hooks/useMusic';

// Export the default context
export { default } from '@/contexts/MusicContext';

// For backward compatibility (to be removed in future versions)
export { MusicProvider } from '@/contexts/MusicContext';
