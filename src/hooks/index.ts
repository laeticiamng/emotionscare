
// Centralisation des exports de hooks pour simplifier les imports

// Réexporter les hooks de base
export { useToast, toast } from './use-toast';

// Réexporter hooks audio
export { useAudioPlayer } from './useAudioPlayer';
export { useAudioRecorder } from './useAudioRecorder';

// Hooks pour le chat et conversations
export { useChatStatus } from './chat/useChatStatus';
export { useChatProcessing } from './chat/useChatProcessing';
export { useConversations } from './chat/useConversations';

// Hooks d'authentification et utilisateur
export { useUser } from './useUser';
export { useUserProfile } from './useUserProfile';
export { useAuthentication } from './useAuthentication';

// Hooks de dashboard et données
export { useDashboardData } from './useDashboardData';

// Hooks d'interface utilisateur
export { useMediaQuery } from './useMediaQuery';
export { useLocalStorage } from './useLocalStorage';
export { useWindowSize } from './useWindowSize';
export { useOnClickOutside } from './useOnClickOutside';

// Hooks pour les fonctionnalités
export { useEmotion } from './useEmotion';
export { useGamification } from './useGamification';
export { useJournal } from './useJournal';
