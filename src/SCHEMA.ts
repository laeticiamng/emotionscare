// @ts-nocheck
import { z } from "zod";

export const FlashGlowPrefs = z.object({
  intensity: z.number().min(0).max(10).optional(),
  enabled: z.boolean().optional(),
});
export type FlashGlowPrefs = z.infer<typeof FlashGlowPrefs>;
export const AdaptiveMusicPrefs = z.object({
  style: z.string().optional(),
  durationMin: z.number().int().min(1).max(60).optional(),
  autoLoop: z.boolean().optional(),
  defaultVolume: z.number().min(0).max(1).optional()
});
export type AdaptiveMusicPrefs = z.infer<typeof AdaptiveMusicPrefs>;
export const BossGritPrefs = z.object({
  defaultMs: z.number().int().min(30000).max(3600000).optional(), // 30s..60min
  cues: z.boolean().optional(),   // bip + haptics
  tasks: z.array(z.object({ id: z.string(), label: z.string(), done: z.boolean().optional() })).optional()
});
export type BossGritPrefs = z.infer<typeof BossGritPrefs>;
export const BreathConstellationPrefs = z.object({
  pattern: z
    .enum(["coherence-5-5", "4-7-8", "box-4-4-4-4", "triangle-4-6-8"])
    .optional(),
  cycles: z.number().int().min(4).max(16).optional(),
  density: z.number().min(0.3).max(1).optional(),
  soundCues: z.boolean().optional(),
  haptics: z.boolean().optional(),
});
export type BreathConstellationPrefs = z.infer<typeof BreathConstellationPrefs>;
export const BubbleBeatPrefs = z.object({
  defaultDifficulty: z.enum(["easy", "medium", "hard"]).optional(), // Difficulté par défaut
  defaultMood: z.enum(["calm", "energetic", "focus"]).optional(),   // Mood musical par défaut
  soundEnabled: z.boolean().optional(),                              // Sons activés
  hapticFeedback: z.boolean().optional(),                            // Retour haptique
  autoSave: z.boolean().optional(),                                  // Sauvegarde automatique des sessions
  showTutorial: z.boolean().optional()                               // Afficher le tutoriel au démarrage
}).optional();
export type BubbleBeatPrefs = z.infer<typeof BubbleBeatPrefs>;
export const CoachPrefs = z.object({
  mode: z.enum(["soft","boost"]).optional(),   // intensité des suggestions
  dailyGoalMin: z.number().int().min(1).max(60).optional()
});
export type CoachPrefs = z.infer<typeof CoachPrefs>;
export const EmotionScanPrefs = z.object({
  preferredMode: z.enum(["text", "voice", "image", "facial", "realtime"]).optional(), // Mode de scan préféré
  sensitivity: z.number().min(0).max(1).optional(),                                    // Sensibilité de détection (0.0-1.0)
  enableBiometric: z.boolean().optional(),                                             // Activer les données biométriques
  enableFacialLandmarks: z.boolean().optional(),                                       // Activer la détection des points faciaux
  minConfidence: z.number().min(0).max(1).optional(),                                  // Confiance minimale pour validation
  autoSaveResults: z.boolean().optional(),                                             // Sauvegarde automatique des résultats
  language: z.string().optional(),                                                     // Langue pour l'analyse textuelle
  notificationsEnabled: z.boolean().optional()                                         // Notifications après analyse
}).optional();
export type EmotionScanPrefs = z.infer<typeof EmotionScanPrefs>;
export const FlashGlowUltraPrefs = z.object({
  bpm: z.number().int().min(2).max(12).optional(),       // sûr pour le visuel
  intensity: z.number().min(0.2).max(1).optional(),
  theme: z.enum(["cyan","violet","amber","emerald"]).optional(),
  shape: z.enum(["ring","full"]).optional(),
  durationMin: z.number().int().min(1).max(10).optional(),
  audioCues: z.boolean().optional()
});
export type FlashGlowUltraPrefs = z.infer<typeof FlashGlowUltraPrefs>;
export const JournalPrefs = z.object({
  defaultMode: z.enum(["text", "voice"]).optional(),        // Mode de saisie par défaut
  autoSummary: z.boolean().optional(),                      // Générer automatiquement un résumé IA
  voiceLanguage: z.string().optional(),                     // Langue pour la reconnaissance vocale
  reminderEnabled: z.boolean().optional(),                  // Activer les rappels quotidiens
  reminderTime: z.string().optional(),                      // Heure du rappel (format HH:mm)
  defaultTags: z.array(z.string()).optional(),              // Tags par défaut
  burnSealMode: z.boolean().optional(),                     // Mode "scellé/brûlé" pour la confidentialité
  autoSave: z.boolean().optional(),                         // Sauvegarde automatique
  maxEntryLength: z.number().int().min(100).max(10000).optional() // Longueur max d'une entrée
}).optional();
export type JournalPrefs = z.infer<typeof JournalPrefs>;
export const MoodMixerPrefs = z.object({
  autoPlay: z.boolean().optional(),                         // Lecture automatique au lancement
  defaultVolume: z.number().min(0).max(1).optional(),       // Volume par défaut (0.0-1.0)
  crossfadeDuration: z.number().int().min(0).max(5000).optional(), // Durée du crossfade en ms
  savePresets: z.boolean().optional(),                      // Sauvegarder les presets personnalisés
  hapticFeedback: z.boolean().optional(),                   // Retour haptique sur les sliders
  visualizations: z.boolean().optional(),                   // Afficher les visualisations
  defaultPresetId: z.string().optional()                    // ID du preset par défaut
}).optional();
export type MoodMixerPrefs = z.infer<typeof MoodMixerPrefs>;
export const ScanPrefs = z.object({
  quickScan: z.boolean().optional(),                        // Mode scan rapide
  detailedAnalysis: z.boolean().optional(),                 // Analyse détaillée des résultats
  shareResults: z.boolean().optional(),                     // Autoriser le partage des résultats
  notificationsEnabled: z.boolean().optional(),             // Notifications de fin de scan
  autoArchive: z.boolean().optional(),                      // Archivage automatique des anciens scans
  retentionDays: z.number().int().min(7).max(365).optional() // Durée de conservation des scans (jours)
}).optional();
export type ScanPrefs = z.infer<typeof ScanPrefs>;
export const StorySynthPrefs = z.object({
  defaultGenre: z.enum(["calme","aventure","poetique","mysterieux","romance"]).optional(),
  defaultLength: z.number().int().min(3).max(7).optional(),
  defaultStyle: z.enum(["sobre","lyrique","journal","dialogue"]).optional(),
  ambientAudio: z.boolean().optional()
}).optional();
export type StorySynthPrefs = z.infer<typeof StorySynthPrefs>;

// ════════════════════════════════════════════════════════════════
// NOUVEAUX SCHÉMAS DE PRÉFÉRENCES POUR MODULES MANQUANTS
// ════════════════════════════════════════════════════════════════

export const ActivitiesPrefs = z.object({
  defaultView: z.enum(["grid", "list", "calendar"]).optional(),        // Vue par défaut
  showCompleted: z.boolean().optional(),                                // Afficher les activités complétées
  defaultDuration: z.number().int().min(5).max(120).optional(),        // Durée par défaut en minutes
  remindersBefore: z.number().int().min(0).max(60).optional(),         // Rappel avant l'activité (minutes)
  autoTrack: z.boolean().optional(),                                    // Suivi automatique
  favoriteCategories: z.array(z.string()).optional()                   // Catégories favorites
}).optional();
export type ActivitiesPrefs = z.infer<typeof ActivitiesPrefs>;

export const AmbitionPrefs = z.object({
  defaultTimeframe: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(), // Cadre temporel par défaut
  reminderEnabled: z.boolean().optional(),                              // Activer les rappels
  reminderTime: z.string().optional(),                                  // Heure du rappel (HH:mm)
  trackProgress: z.boolean().optional(),                                // Suivre la progression
  shareAchievements: z.boolean().optional(),                            // Partager les réussites
  motivationalQuotes: z.boolean().optional()                            // Afficher des citations motivantes
}).optional();
export type AmbitionPrefs = z.infer<typeof AmbitionPrefs>;

export const AmbitionArcadePrefs = z.object({
  difficulty: z.enum(["easy", "medium", "hard", "extreme"]).optional(), // Niveau de difficulté
  soundEnabled: z.boolean().optional(),                                 // Sons activés
  musicEnabled: z.boolean().optional(),                                 // Musique activée
  hapticFeedback: z.boolean().optional(),                               // Retour haptique
  showLeaderboard: z.boolean().optional(),                              // Afficher le classement
  autoSave: z.boolean().optional(),                                     // Sauvegarde automatique
  theme: z.enum(["classic", "neon", "minimalist", "retro"]).optional() // Thème visuel
}).optional();
export type AmbitionArcadePrefs = z.infer<typeof AmbitionArcadePrefs>;

export const ARFiltersPrefs = z.object({
  defaultFilter: z.string().optional(),                                 // Filtre par défaut
  cameraQuality: z.enum(["low", "medium", "high", "ultra"]).optional(), // Qualité de la caméra
  savePhotos: z.boolean().optional(),                                   // Sauvegarder les photos
  shareEnabled: z.boolean().optional(),                                 // Partage activé
  faceTrackingEnabled: z.boolean().optional(),                          // Suivi facial activé
  privacyMode: z.boolean().optional()                                   // Mode confidentialité
}).optional();
export type ARFiltersPrefs = z.infer<typeof ARFiltersPrefs>;

export const AudioStudioPrefs = z.object({
  defaultSampleRate: z.number().int().min(22050).max(48000).optional(), // Fréquence d'échantillonnage
  defaultBitDepth: z.enum(["16", "24", "32"]).optional(),               // Profondeur de bits
  autoNormalize: z.boolean().optional(),                                // Normalisation automatique
  noiseReduction: z.boolean().optional(),                               // Réduction du bruit
  defaultFormat: z.enum(["mp3", "wav", "ogg", "flac"]).optional(),     // Format par défaut
  maxRecordingDuration: z.number().int().min(30).max(600).optional()   // Durée max d'enregistrement (secondes)
}).optional();
export type AudioStudioPrefs = z.infer<typeof AudioStudioPrefs>;

export const BreathPrefs = z.object({
  defaultPattern: z.enum(["box", "4-7-8", "coherence", "wim-hof"]).optional(), // Schéma par défaut
  duration: z.number().int().min(1).max(30).optional(),                 // Durée en minutes
  guidedVoice: z.boolean().optional(),                                  // Guidage vocal
  backgroundMusic: z.boolean().optional(),                              // Musique de fond
  hapticGuide: z.boolean().optional(),                                  // Guide haptique
  visualCues: z.boolean().optional()                                    // Indices visuels
}).optional();
export type BreathPrefs = z.infer<typeof BreathPrefs>;

export const BreathUnifiedPrefs = z.object({
  preferredTechniques: z.array(z.string()).optional(),                  // Techniques préférées
  sessionDuration: z.number().int().min(3).max(60).optional(),          // Durée de session (minutes)
  transitionTime: z.number().int().min(0).max(30).optional(),           // Temps de transition (secondes)
  breathGuide: z.enum(["visual", "audio", "haptic", "all"]).optional(), // Type de guide
  trackingEnabled: z.boolean().optional(),                              // Suivi activé
  showStatistics: z.boolean().optional()                                // Afficher les statistiques
}).optional();
export type BreathUnifiedPrefs = z.infer<typeof BreathUnifiedPrefs>;

export const BreathingVRPrefs = z.object({
  environment: z.enum(["forest", "ocean", "mountain", "space", "zen"]).optional(), // Environnement VR
  ambientSounds: z.boolean().optional(),                                // Sons ambiants
  guidanceLevel: z.enum(["none", "minimal", "full"]).optional(),       // Niveau de guidage
  immersionLevel: z.number().min(0).max(1).optional(),                  // Niveau d'immersion
  controllerEnabled: z.boolean().optional(),                            // Contrôleur activé
  comfortMode: z.boolean().optional()                                   // Mode confort (réduction du mal de mer)
}).optional();
export type BreathingVRPrefs = z.infer<typeof BreathingVRPrefs>;

export const CommunityPrefs = z.object({
  displayName: z.string().optional(),                                   // Nom d'affichage
  profileVisibility: z.enum(["public", "friends", "private"]).optional(), // Visibilité du profil
  allowMessages: z.boolean().optional(),                                // Autoriser les messages
  showOnlineStatus: z.boolean().optional(),                             // Afficher le statut en ligne
  notificationsEnabled: z.boolean().optional(),                         // Notifications activées
  autoJoinGroups: z.boolean().optional(),                               // Rejoindre automatiquement les groupes
  moderationLevel: z.enum(["strict", "moderate", "relaxed"]).optional() // Niveau de modération
}).optional();
export type CommunityPrefs = z.infer<typeof CommunityPrefs>;

export const FlashLitePrefs = z.object({
  flashSpeed: z.number().min(1).max(20).optional(),                     // Vitesse des flashs (Hz)
  intensity: z.number().min(0).max(1).optional(),                       // Intensité lumineuse
  colorScheme: z.enum(["warm", "cool", "rainbow", "monochrome"]).optional(), // Schéma de couleurs
  duration: z.number().int().min(1).max(15).optional(),                 // Durée (minutes)
  pulsePattern: z.enum(["steady", "wave", "random", "rhythmic"]).optional(), // Motif de pulsation
  safetyPause: z.boolean().optional()                                   // Pause de sécurité automatique
}).optional();
export type FlashLitePrefs = z.infer<typeof FlashLitePrefs>;

export const MeditationPrefs = z.object({
  defaultDuration: z.number().int().min(5).max(60).optional(),          // Durée par défaut (minutes)
  guidedVoice: z.enum(["male", "female", "none"]).optional(),          // Voix guidée
  backgroundSound: z.enum(["silence", "nature", "ambient", "music"]).optional(), // Son de fond
  bellInterval: z.number().int().min(0).max(15).optional(),             // Intervalle de cloche (minutes, 0 = désactivé)
  sessionReminder: z.boolean().optional(),                              // Rappel de session
  preferredTime: z.string().optional(),                                 // Heure préférée (HH:mm)
  trackStreak: z.boolean().optional()                                   // Suivre la série
}).optional();
export type MeditationPrefs = z.infer<typeof MeditationPrefs>;

export const MusicTherapyPrefs = z.object({
  preferredGenres: z.array(z.string()).optional(),                      // Genres préférés
  bpmRange: z.object({
    min: z.number().int().min(40).max(200).optional(),
    max: z.number().int().min(40).max(200).optional()
  }).optional(),                                                         // Plage de BPM
  moodAdaptive: z.boolean().optional(),                                 // Adaptation selon l'humeur
  volume: z.number().min(0).max(1).optional(),                          // Volume par défaut
  crossfade: z.boolean().optional(),                                    // Fondu enchaîné
  autoGenerate: z.boolean().optional()                                  // Génération automatique
}).optional();
export type MusicTherapyPrefs = z.infer<typeof MusicTherapyPrefs>;

export const MusicUnifiedPrefs = z.object({
  defaultPlaylist: z.string().optional(),                               // Playlist par défaut
  adaptiveMode: z.boolean().optional(),                                 // Mode adaptatif
  blendingEnabled: z.boolean().optional(),                              // Mélange activé
  therapeuticMode: z.boolean().optional(),                              // Mode thérapeutique
  equalizerPreset: z.string().optional(),                               // Preset égaliseur
  spatialAudio: z.boolean().optional(),                                 // Audio spatial
  downloadQuality: z.enum(["low", "medium", "high", "lossless"]).optional() // Qualité de téléchargement
}).optional();
export type MusicUnifiedPrefs = z.infer<typeof MusicUnifiedPrefs>;

export const NyveePrefs = z.object({
  voiceEnabled: z.boolean().optional(),                                 // Voix activée
  voiceType: z.enum(["compassionate", "energetic", "calm", "neutral"]).optional(), // Type de voix
  responseLength: z.enum(["concise", "balanced", "detailed"]).optional(), // Longueur des réponses
  proactiveMode: z.boolean().optional(),                                // Mode proactif
  emotionalTone: z.enum(["empathetic", "motivating", "supportive"]).optional(), // Ton émotionnel
  language: z.string().optional()                                       // Langue
}).optional();
export type NyveePrefs = z.infer<typeof NyveePrefs>;

export const ScreenSilkPrefs = z.object({
  breakInterval: z.number().int().min(10).max(120).optional(),          // Intervalle de pause (minutes)
  breakDuration: z.number().int().min(1).max(10).optional(),            // Durée de pause (minutes)
  reminderStyle: z.enum(["gentle", "firm", "custom"]).optional(),      // Style de rappel
  dimScreen: z.boolean().optional(),                                    // Atténuer l'écran
  blockApps: z.boolean().optional(),                                    // Bloquer les applications
  trackingEnabled: z.boolean().optional(),                              // Suivi activé
  blueLightFilter: z.boolean().optional()                               // Filtre lumière bleue
}).optional();
export type ScreenSilkPrefs = z.infer<typeof ScreenSilkPrefs>;

export const VRGalaxyPrefs = z.object({
  graphicsQuality: z.enum(["low", "medium", "high", "ultra"]).optional(), // Qualité graphique
  fieldOfView: z.number().int().min(80).max(120).optional(),            // Champ de vision
  locomotion: z.enum(["teleport", "smooth", "hybrid"]).optional(),      // Type de locomotion
  comfortMode: z.boolean().optional(),                                  // Mode confort
  handTracking: z.boolean().optional(),                                 // Suivi des mains
  voiceCommands: z.boolean().optional(),                                // Commandes vocales
  ambientAudio: z.boolean().optional()                                  // Audio ambiant
}).optional();
export type VRGalaxyPrefs = z.infer<typeof VRGalaxyPrefs>;

export const VRNebulaPrefs = z.object({
  particleDensity: z.enum(["low", "medium", "high", "ultra"]).optional(), // Densité des particules
  colorPalette: z.enum(["aurora", "sunset", "cosmic", "ethereal"]).optional(), // Palette de couleurs
  interactionMode: z.enum(["passive", "interactive", "creative"]).optional(), // Mode d'interaction
  musicSync: z.boolean().optional(),                                    // Synchronisation musicale
  guidedMode: z.boolean().optional(),                                   // Mode guidé
  sessionLength: z.number().int().min(5).max(60).optional()            // Durée de session (minutes)
}).optional();
export type VRNebulaPrefs = z.infer<typeof VRNebulaPrefs>;

export const WeeklyBarsPrefs = z.object({
  startDay: z.enum(["monday", "sunday", "saturday"]).optional(),        // Jour de début de semaine
  displayMode: z.enum(["bars", "lines", "combined"]).optional(),        // Mode d'affichage
  showGoals: z.boolean().optional(),                                    // Afficher les objectifs
  showTrends: z.boolean().optional(),                                   // Afficher les tendances
  comparisonEnabled: z.boolean().optional(),                            // Comparaison activée
  notifyWeeklyProgress: z.boolean().optional(),                         // Notifier la progression hebdomadaire
  colorCoding: z.boolean().optional()                                   // Codage couleur
}).optional();
export type WeeklyBarsPrefs = z.infer<typeof WeeklyBarsPrefs>;

export const BounceBackPrefs = z.object({
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),            // Niveau de difficulté
  sessionDuration: z.number().int().min(5).max(30).optional(),          // Durée de session (minutes)
  enableScoring: z.boolean().optional(),                                // Activer le score
  challengeMode: z.boolean().optional(),                                // Mode défi
  soundEffects: z.boolean().optional(),                                 // Effets sonores
  hapticFeedback: z.boolean().optional()                                // Retour haptique
}).optional();
export type BounceBackPrefs = z.infer<typeof BounceBackPrefs>;

// ════════════════════════════════════════════════════════════════

export const StoryRecord = z.object({
  id: z.string().optional(),
  createdAt: z.string().optional(),
  title: z.string().optional(),
  content: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  mood: z.string().optional()
}).optional();
export type StoryRecord = z.infer<typeof StoryRecord>;

export const AudioPrefs = z.object({
  masterVolume: z.number().min(0).max(1).optional(),
  crossfadeMs: z.number().int().min(0).max(5000).optional(),
  haptics: z.boolean().optional(),
  loopDefault: z.boolean().optional()
});
export type AudioPrefs = z.infer<typeof AudioPrefs>;
export const OnboardingPrefs = z.object({
  musicRelax: z.boolean().optional(),
  defaultDurationMin: z.number().int().min(5).max(60).optional(),
  favoriteModule: z.string().optional(), // optionnel si redirection vers un module favori
});
export type OnboardingPrefs = z.infer<typeof OnboardingPrefs>;

export const SessionEvent = z.object({
  id: z.string().optional(),
  module: z.string().optional(),           // ex: "mood-mixer"
  startedAt: z.string().optional(),        // ISO
  endedAt: z.string().optional(),          // ISO
  durationSec: z.number().int().optional(),// durée estimée
  mood: z.string().optional(),             // info libre
  score: z.number().optional(),            // score brut si dispo
  meta: z.record(z.any()).optional()
});
export type SessionEvent = z.infer<typeof SessionEvent>;

export const ScoreSnapshot = z.object({
  total: z.number().optional(),
  streakDays: z.number().optional(),
  level: z.number().optional(),
  badges: z.array(z.string()).optional(),
  byDay: z.array(z.object({
    date: z.string(), value: z.number()
  })).optional()
});
export type ScoreSnapshot = z.infer<typeof ScoreSnapshot>;

export const Achievement = z.object({
  key: z.string().optional(),
  label: z.string().optional(),
  earnedAt: z.string().optional()
});
export type Achievement = z.infer<typeof Achievement>;
export const Feedback = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  message: z.string().optional(),
});
export type Feedback = z.infer<typeof Feedback>;

export const JournalEntry = z.object({
  id: z.string().optional(),
  createdAt: z.string().optional(), // ISO
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  mood: z.string().optional(),
  deleted: z.boolean().optional()
}).optional();

export type JournalEntry = z.infer<typeof JournalEntry>;
export const EmotionScanData = z.object({
  // clés I-PANAS-SF — toutes optionnelles pour compat ascendante
  active: z.number().int().min(1).max(5).optional(),
  determined: z.number().int().min(1).max(5).optional(),
  attentive: z.number().int().min(1).max(5).optional(),
  inspired: z.number().int().min(1).max(5).optional(),
  alert: z.number().int().min(1).max(5).optional(),
  upset: z.number().int().min(1).max(5).optional(),
  hostile: z.number().int().min(1).max(5).optional(),
  ashamed: z.number().int().min(1).max(5).optional(),
  nervous: z.number().int().min(1).max(5).optional(),
  afraid: z.number().int().min(1).max(5).optional(),
  // scores dérivés (facultatifs)
  pa: z.number().optional(),
  na: z.number().optional(),
  balance: z.number().optional()
}).optional();

export type EmotionScanData = z.infer<typeof EmotionScanData>;
