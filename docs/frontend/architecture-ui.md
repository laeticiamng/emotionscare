
# Architecture UI - EmotionsCare 1.0

## 📊 Diagramme de flux utilisateur principal

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Onboarding    │───▶│  Mode Selection │───▶│   Dashboard     │
│                 │    │   (B2C/B2B)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                       ┌─────────────────┐            │
                       │  Privacy Setup  │◄───────────┘
                       └─────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
┌───────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐
│ Glow Experience │    │ Wellness Modules │    │  Settings/RGPD  │
│                 │    │                  │    │                 │
│ • Flash Glow    │    │ • Journal        │    │ • Privacy       │
│ • Face Filters  │    │ • Music Therapy  │    │ • Export Data   │
│ • Bubble-Beat   │    │ • Emotion Scan   │    │ • Delete Acc    │
│ • VR Galaxy     │    │ • VR Breath      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🏗️ Arbre des composants

```
src/
├── components/
│   ├── layout/
│   │   ├── DashboardGrid.tsx          # Grid responsive principal
│   │   ├── FloatingPanel.tsx          # Panneaux flottants
│   │   └── Layout.tsx                 # Layout global
│   ├── glow/
│   │   ├── FlashGlow.tsx             # Défi respiration
│   │   ├── GlowGauge.tsx             # Jauge instantanée
│   │   ├── FaceFilterAR.tsx          # Filtres AR
│   │   └── BubbleBeat.tsx            # Visualisation BPM
│   ├── dashboard/
│   │   ├── WeeklyBars.tsx            # Barres hebdomadaires
│   │   ├── NotificationCenter.tsx     # Centre notifications
│   │   └── UserDashboard.tsx         # Dashboard utilisateur
│   ├── wellness/
│   │   ├── JournalInterface.tsx      # Interface journal
│   │   ├── MusicPlayer.tsx           # Lecteur musical
│   │   ├── EmotionScanForm.tsx       # Scan émotionnel
│   │   └── VRBreathSession.tsx       # Session VR
│   ├── privacy/
│   │   ├── PrivacyToggle.tsx         # Switches privacy
│   │   ├── DataExport.tsx            # Export RGPD
│   │   └── AccountDeletion.tsx       # Suppression compte
│   └── accessibility/
│       ├── ScreenReaderOnly.tsx      # Éléments SR
│       ├── SkipToContent.tsx         # Skip links
│       └── FocusManager.tsx          # Gestion focus
├── hooks/
│   ├── usePrivacyPrefs.tsx           # Hook privacy
│   ├── useAccessibility.tsx          # Hook a11y
│   └── useMotionPrefs.tsx            # Hook animations
├── services/
│   ├── api/
│   │   ├── apiClient.ts              # Client API standardisé
│   │   ├── endpoints.ts              # Définition endpoints
│   │   └── errorHandler.ts           # Gestion erreurs
│   └── accessibility/
│       ├── announcer.ts              # Annonces SR
│       └── contrastChecker.ts        # Vérif contraste
└── styles/
    ├── tokens/
    │   ├── colors.css                # Variables couleurs
    │   ├── spacing.css               # Espacement
    │   └── motion.css                # Animations
    └── accessibility.css             # Styles a11y
```

## 📱 Breakpoints responsive

```css
/* Mobile First Approach */
:root {
  --bp-xs: 320px;   /* Très petit mobile */
  --bp-sm: 640px;   /* Mobile */
  --bp-md: 768px;   /* Tablette */
  --bp-lg: 1024px;  /* Desktop */
  --bp-xl: 1280px;  /* Large desktop */
  --bp-2xl: 1536px; /* Ultra-wide */
}

/* Grid responsive Dashboard */
.dashboard-grid {
  grid-template-columns: 1fr;                    /* xs: 1 col */
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);       /* sm: 2 cols */
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);       /* lg: 3 cols */
  }
  
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);       /* xl: 4 cols */
  }
}
```
