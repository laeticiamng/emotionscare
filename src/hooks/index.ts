
// Export des hooks personnalisés centralisé
// Ce fichier sert de point d'entrée unique pour tous les hooks de l'application

// Hooks d'authentification
export { default as useAuth } from './useAuth';
export { default as useSession } from './useSession';
export { default as useAuthForm } from './useAuthForm';

// Hooks d'interface utilisateur
export { default as useToast } from './use-toast';
export { default as useMediaQuery } from './useMediaQuery';
export { default as useLocalStorage } from './useLocalStorage';
export { default as useCopyToClipboard } from './useCopyToClipboard';
export { default as useDebounce } from './useDebounce';
export { default as useThrottle } from './useThrottle';
export { default as useClickOutside } from './useClickOutside';
export { default as useKeyPress } from './useKeyPress';
export { default as useAudioRecorder } from './useAudioRecorder';

// Hooks d'API et de données
export * from './api';
export { default as useUserData } from './useUserData';
export { default as useInvitations } from './useInvitations';
export { default as useFetchData } from './useFetchData';
export { default as useQueryParams } from './useQueryParams';
export { default as useSocket } from './useSocket';
export { default as useInfiniteScroll } from './useInfiniteScroll';

// Hooks spécifiques aux fonctionnalités
export * from './chat';
export * from './emotion';
export * from './journal';
export * from './community-gamification';
export * from './vr';

// Hooks d'interface pour l'application
export { default as useAppSettings } from './useAppSettings';
export { default as useOnboarding } from './useOnboarding';
export { default as useNotificationPermission } from './useNotificationPermission';
export { default as useTemporaryState } from './useTemporaryState';
