
/**
 * 🎵 Music Context
 * ------------------------------------
 * This file serves as the central export point for all music context functionality.
 * Import from this file instead of directly referencing the implementation.
 */

// Export the hook for accessing music functionality
// This is the ONLY hook to use for music features
export { useMusic } from '@/contexts/MusicContext';

// Export the default context
export { default } from '@/contexts/MusicContext';

// For backward compatibility (to be removed in future versions)
export { MusicProvider } from '@/contexts/MusicContext';
