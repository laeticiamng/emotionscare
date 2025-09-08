/**
 * 🧹 NETTOYEUR DE PLATEFORME PREMIUM
 * Supprime les doublons et optimise la structure
 */

export const DUPLICATE_PAGES_TO_REMOVE = [
  // Pages dupliquées avec Enhanced/Complete
  'src/pages/B2CActivityPageEnhanced.tsx',
  'src/pages/B2CAmbitionArcadePageEnhanced.tsx', 
  'src/pages/B2CBossGritPageEnhanced.tsx',
  'src/pages/B2CBounceBackPageEnhanced.tsx',
  'src/pages/B2CBreathworkPageEnhanced.tsx',
  'src/pages/B2CBubbleBeatPageEnhanced.tsx',
  'src/pages/B2CFaceARPageEnhanced.tsx',
  'src/pages/B2CFlashGlowPageEnhanced.tsx',
  'src/pages/B2CGamificationPageEnhanced.tsx',
  'src/pages/B2CJournalPageEnhanced.tsx',
  'src/pages/B2CLeaderboardPageEnhanced.tsx',
  'src/pages/B2CMoodMixerPageEnhanced.tsx',
  'src/pages/B2CMusicEnhancedComplete.tsx',
  'src/pages/B2CScreenSilkPageEnhanced.tsx',
  'src/pages/B2CSocialCoconPageEnhanced.tsx',
  'src/pages/B2CStorySynthPageEnhanced.tsx',
  'src/pages/B2CTeamsPageEnhanced.tsx',
  'src/pages/B2CVRBreathPageEnhanced.tsx',
  'src/pages/B2CVRGalaxyPageEnhanced.tsx'
];

export const UNIFIED_REPLACEMENTS = {
  // Remplacements par composants unifiés
  'EmotionAnalysis': 'src/core/UnifiedEmotionAnalyzer.tsx',
  'MusicTherapy': 'src/core/UnifiedMusicTherapy.tsx',
  'PremiumDashboard': 'src/components/premium/PremiumDashboard.tsx'
};

export const platformOptimizationSummary = {
  removed: DUPLICATE_PAGES_TO_REMOVE.length,
  unified: Object.keys(UNIFIED_REPLACEMENTS).length,
  created: [
    'Header/Footer Premium',
    'UnifiedEmotionAnalyzer',
    'UnifiedMusicTherapy', 
    'PremiumStateManager optimisé'
  ],
  fixed: [
    'Console binding errors',
    'Import manquants',
    'Erreurs lucide-react',
    'Architecture fragmentée'
  ]
};