
# Structure des Contexts et Hooks

Ce document décrit l'organisation des Contexts React et des Hooks personnalisés dans le projet.

## Architecture des Contexts

Tous les contexts React sont centralisés dans le dossier `/src/contexts/`. 
Pour les importer, utilisez:

```typescript
import { ThemeContext, useTheme } from '@/contexts';
```

### Liste des Contexts disponibles

| Context | Provider | Hook | Description |
|---------|----------|------|-------------|
| ThemeContext | ThemeProvider | useTheme | Gestion du thème de l'application |
| UserPreferencesContext | UserPreferencesProvider | useUserPreferences | Préférences utilisateur |
| UserModeContext | UserModeProvider | useUserMode | Mode utilisateur (B2C, B2B user, B2B admin) |
| AuthContext | AuthProvider | useAuth | Authentification |
| AudioContext | AudioProvider | useAudio | Gestion audio |
| MusicContext | MusicProvider | useMusic | Lecteur de musique |
| LayoutContext | LayoutProvider | useLayout | Mise en page |
| SidebarContext | SidebarProvider | useSidebar | Sidebar |
| CoachContext | CoachProvider | useCoach | Coach IA |
| StorytellingContext | StorytellingProvider | useStorytelling | Récits narratifs |
| SoundscapeContext | SoundscapeProvider | useSoundscape | Ambiances sonores |
| BrandingContext | BrandingProvider | - | Personnalisation marque |
| SegmentContext | SegmentProvider | useSegment | Segmentation utilisateurs |
| SessionContext | SessionProvider | useSession | Gestion de session |
| OnboardingContext | OnboardingProvider | useOnboarding | Processus d'intégration |
| PredictiveAnalyticsContext | PredictiveAnalyticsProvider | usePredictiveAnalytics | Analyses prédictives |

## Architecture des Hooks

Tous les hooks personnalisés sont centralisés dans le dossier `/src/hooks/`. 
Pour les importer, utilisez:

```typescript
import { useToast, useMediaQuery } from '@/hooks';
```

### Liste des Hooks disponibles

| Hook | Description |
|------|-------------|
| useToast | Affichage de notifications toast |
| useAudioPlayer | Lecteur audio |
| useAudioRecorder | Enregistreur audio |
| useChatStatus | État des conversations |
| useChatProcessing | Traitement des messages |
| useConversations | Gestion des conversations |
| useUser | Informations utilisateur |
| useUserProfile | Profil utilisateur |
| useAuthentication | Authentification |
| useDashboardData | Données du tableau de bord |
| useMediaQuery | Requêtes média responsive |
| useLocalStorage | Stockage local |
| useWindowSize | Taille de fenêtre |
| useOnClickOutside | Détection de clic extérieur |
| useEmotion | Gestion des émotions |
| useGamification | Fonctionnalités de gamification |
| useJournal | Journal émotionnel |

## Bonnes pratiques

1. Toujours importer depuis les fichiers d'index centralisés:
   - `import { useTheme } from '@/contexts'` au lieu de `import { useTheme } from '@/contexts/ThemeContext'`

2. Utiliser les hooks au lieu d'accéder directement au contexte:
   - `const { theme } = useTheme()` au lieu de `const theme = useContext(ThemeContext)`

3. Tous les exports sont nommés, pas de default exports

4. Les types associés sont également disponibles dans les fichiers centralisés
