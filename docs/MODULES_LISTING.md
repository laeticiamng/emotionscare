# 🧩 LISTING COMPLET DES MODULES - EMOTIONSCARE

## 📁 Architecture Actuelle vs Optimisée

### **1. MODULES UI DE BASE** (`src/components/ui/`)
> **But**: Système de design fondamental et composants réutilisables

#### **🎨 Composants d'Interface Core**
- **`button.tsx`** - Boutons avec variants et tailles multiples
- **`card.tsx`** - Conteneurs de contenu avec header/content/footer
- **`input.tsx`** - Champs de saisie avec validation et états
- **`textarea.tsx`** - Zones de texte multi-lignes
- **`dialog.tsx`** - Modales et dialogues overlay
- **`sheet.tsx`** - Panneaux latéraux coulissants
- **`popover.tsx`** - Info-bulles et menus contextuels
- **`dropdown-menu.tsx`** - Menus déroulants interactifs
- **`select.tsx`** - Sélecteurs avec options multiples
- **`checkbox.tsx`** - Cases à cocher avec états intermédiaires
- **`radio-group.tsx`** - Groupes de boutons radio
- **`switch.tsx`** - Interrupteurs on/off
- **`slider.tsx`** - Curseurs de valeurs numériques
- **`progress.tsx`** - Barres de progression linéaires
- **`avatar.tsx`** - Photos de profil avec fallbacks
- **`badge.tsx`** - Étiquettes de statut et notifications
- **`separator.tsx`** - Séparateurs visuels
- **`skeleton.tsx`** - Placeholders de chargement

#### **🧭 Navigation & Layout**
- **`tabs.tsx`** - Onglets de navigation horizontale
- **`accordion.tsx`** - Contenus pliables/dépliables
- **`sidebar.tsx`** - Barre latérale avec shadcn/ui
- **`breadcrumb.tsx`** - Fil d'Ariane navigationnel
- **`pagination.tsx`** - Navigation entre pages de contenu
- **`navigation-menu.tsx`** - Menus de navigation principaux
- **`command.tsx`** - Palette de commandes (⌘K)
- **`menubar.tsx`** - Barre de menu classique

#### **📊 Visualisation & Données**
- **`table.tsx`** - Tableaux de données avec tri/filtres
- **`data-table.tsx`** - Composant table avancé
- **`chart.tsx`** - Graphiques avec Recharts integration
- **`calendar.tsx`** - Calendriers interactifs
- **`date-picker.tsx`** - Sélecteurs de dates
- **`time-picker.tsx`** - Sélecteurs d'heures

#### **🔔 Feedback & États**
- **`toast.tsx`** - Notifications temporaires
- **`alert.tsx`** - Messages d'alerte persistants
- **`alert-dialog.tsx`** - Confirmations critiques
- **`loading-animation.tsx`** - Animations de chargement
- **`loading-spinner.tsx`** - Indicateurs de progression
- **`scroll-progress.tsx`** - Barre de scroll de page

#### **🎛️ Composants Avancés**
- **`form.tsx`** - Système de formulaires avec validation
- **`carousel.tsx`** - Défilements d'images/contenu
- **`resizable.tsx`** - Panneaux redimensionnables
- **`collapsible.tsx`** - Contenus collapsables
- **`hover-card.tsx`** - Cartes au survol
- **`context-menu.tsx`** - Menus contextuels clic-droit
- **`tooltip.tsx`** - Info-bulles au survol

---

## 📁 **2. MODULES FONCTIONNELS CORE** (`src/components/features/`)
> **But**: Fonctionnalités métier principales réutilisables

#### **🧠 Intelligence Artificielle**
- **`EmotionAnalyzer.tsx`** - **But**: Analyse IA d'émotions multi-modal (texte, voix, caméra)
  - Analyse de sentiment en temps réel
  - Reconnaissance vocale émotionnelle
  - Suggestions personnalisées basées IA
  - Support multi-langues et dialectes

- **`VirtualCoach.tsx`** - **But**: Assistant IA conversationnel intelligent Nyvée
  - Conversations thérapeutiques guidées
  - Reconnaissance vocale et synthèse
  - Personnalité adaptative selon utilisateur
  - Base de connaissances psychologique

- **`SmartMusicPlayer.tsx`** - **But**: Génération musicale IA adaptée aux émotions
  - Composition automatique basée sur l'état émotionnel
  - Binaural beats thérapeutiques
  - Synchronisation rythme cardiaque
  - Playlists auto-adaptatives

#### **📊 Analytics & Suivi**
- **`StatsOverview.tsx`** - **But**: Tableau de bord métriques bien-être
  - KPIs émotionnels centralisés
  - Tendances long-terme et patterns
  - Comparaisons et benchmarks
  - Export données et rapports

- **`EmotionTracking.tsx`** - **But**: Suivi détaillé des émotions dans le temps
  - Capture multi-modal (scan, journal, biométrie)
  - Corrélations environnementales
  - Prédictions et alertes préventives
  - Historique complet utilisateur

- **`MoodChart.tsx`** - **But**: Visualisations graphiques des états émotionnels
  - Graphiques interactifs temporels
  - Heatmaps émotionnelles
  - Comparaisons multi-périodes
  - Export formats multiples

#### **📝 Expression & Communication**
- **`InteractiveJournal.tsx`** - **But**: Journal intelligent avec analyse de sentiment
  - Éditeur enrichi avec templates
  - Analyse IA automatique du contenu
  - Suggestions d'amélioration
  - Chiffrement end-to-end

- **`NavigationHub.tsx`** - **But**: Hub de navigation intelligent avec recherche
  - Recherche instantanée multi-critères
  - Filtrage par catégories et rôles
  - Raccourcis claviers et accessibilité
  - Personnalisation selon utilisateur

- **`GlobalSearchCommand.tsx`** - **But**: Palette de commandes globale (⌘K)
  - Recherche unifiée app-wide
  - Navigation clavier complète
  - Suggestions intelligentes
  - Historique et favoris

#### **📅 Planning & Organisation**
- **`SmartCalendar.tsx`** - **But**: Calendrier de bien-être avec IA
  - Planification activités adaptées
  - Rappels personnalisés intelligents
  - Intégration objectifs et habitudes
  - Synchronisation calendriers externes

- **`ProfileManager.tsx`** - **But**: Gestion complète profil utilisateur
  - Paramètres et préférences avancées
  - Achievements et gamification
  - Contrôles de privacy granulaires
  - Import/export données personnelles

#### **🔔 Système & Notifications**
- **`NotificationSystem.tsx`** - **But**: Centre de notifications intelligent
  - Notifications contextuelles et adaptatives
  - Gestion multi-canal (push, email, in-app)
  - Préférences utilisateur granulaires
  - Analytics d'engagement

- **`UnifiedDashboard.tsx`** - **But**: Dashboard adaptatif selon rôle utilisateur
  - Interface unified B2C/B2B/Manager
  - Métriques personnalisées par rôle
  - Actions rapides contextuelles
  - Navigation intelligente

---

## 📁 **3. MODULES SPÉCIALISÉS PAR DOMAINE**

### **🔍 Scanner Émotionnel** (`src/components/scan/`)
> **But**: Analyse faciale et émotionnelle temps réel

#### **Core Scanning**
- **`EmotionScanner.tsx`** - Scanner principal multi-modal
- **`FacialEmotionScanner.tsx`** - Analyse faciale IA avancée  
- **`VoiceEmotionScanner.tsx`** - Reconnaissance émotions vocales
- **`TextEmotionScanner.tsx`** - Analyse sentiment textuel
- **`LiveScanner.tsx`** - Stream temps réel continu
- **`PhotoUploader.tsx`** - Upload et analyse photos

#### **Visualisation & Résultats**
- **`EmotionVisualization.tsx`** - Graphiques émotions temps réel
- **`EmotionResultCard.tsx`** - Affichage résultats analysés
- **`BiometricDisplay.tsx`** - Métriques physiologiques
- **`EmotionTrendChart.tsx`** - Tendances émotionnelles

#### **Analytics & Historique**
- **`EmotionHistory.tsx`** - Historique complet scans
- **`ScanHistoryViewer.tsx`** - Visualiseur historique avancé
- **`EmotionAnalyticsDashboard.tsx`** - Dashboard analytics détaillé
- **`PostScanAnalysis.tsx`** - Analyse post-scan approfondie

### **🎵 Musicothérapie** (`src/components/music/`)
> **But**: Thérapie musicale intelligente et génération IA

#### **Génération & Recommandation IA**
- **`AdvancedMusicGenerator.tsx`** - Génération musicale IA avancée
- **`EmotionBasedMusicRecommendation.tsx`** - Recommandations basées émotions
- **`AdaptivePlaylistEngine.tsx`** - Engine playlists auto-adaptatives
- **`MoodBasedRecommendations.tsx`** - Recommandations selon humeur

#### **Lecteurs & Contrôles**
- **`AdaptiveMusicPlayer.tsx`** - Lecteur adaptatif principal
- **`AnimatedMusicPlayer.tsx`** - Lecteur avec animations
- **`MusicMiniPlayer.tsx`** - Mini-lecteur persistant
- **`AutoMusicPlayer.tsx`** - Lecture automatique intelligente

#### **Visualisation & Effets**
- **`MusicVisualizer.tsx`** - Visualisateur audio avancé
- **`AudioVisualizer.tsx`** - Spectre audio en temps réel
- **`MusicWaveform.tsx`** - Formes d'ondes interactives
- **`AudioEqualizer.tsx`** - Égaliseur audio personnalisable

#### **Thérapie & Création**
- **`MusicTherapy.tsx`** - Module thérapie musicale guidée
- **`MusicCreator.tsx`** - Création musicale utilisateur
- **`MusicMixer.tsx`** - Mixage et blend de sons
- **`EmotionMusicGenerator.tsx`** - Générateur selon émotions

### **💬 Coach IA & Conversation** (`src/components/coach/`)
> **But**: Assistant virtuel thérapeutique intelligent

#### **Interface de Chat**
- **`EnhancedCoachChat.tsx`** - Interface chat principale améliorée
- **`CoachChatInterface.tsx`** - Interface conversationnelle complète
- **`ChatMessageList.tsx`** - Liste messages avec historique
- **`EnhancedCoachChatInput.tsx`** - Input enrichi avec suggestions

#### **Personnalité & Comportement**
- **`EmpathicAICoach.tsx`** - Coach IA avec empathie avancée
- **`CoachCharacter.tsx`** - Système de personnalité coach
- **`CoachPersonalitySelector.tsx`** - Sélecteur personnalité coach
- **`CoachPresence.tsx`** - Indicateurs de présence coach

#### **Intelligence & Recommandations**
- **`EnhancedCoachAI.tsx`** - IA coach avec logique avancée
- **`CoachInsights.tsx`** - Insights et analyses coach
- **`CoachRecommendations.tsx`** - Recommandations personnalisées
- **`MiniCoach.tsx`** - Coach compact intégré

#### **Historique & Navigation**
- **`ConversationHistory.tsx`** - Historique conversations complètes
- **`ConversationTimeline.tsx`** - Timeline interactions temporelle
- **`ConversationList.tsx`** - Liste conversations sauvegardées

### **📔 Journal Intelligent** (`src/components/journal/`)
> **But**: Écriture thérapeutique avec IA et analytics

#### **Interface d'Écriture**
- **`IntelligentJournal.tsx`** - Journal principal avec IA
- **`JournalInterface.tsx`** - Interface complète journal
- **`TextEditor.tsx`** - Éditeur texte enrichi
- **`JournalEntryForm.tsx`** - Formulaire saisie entrées

#### **Analytics & Visualisation**
- **`JournalAnalytics.tsx`** - Analytics avancés journal
- **`JournalMoodChart.tsx`** - Graphiques humeur journal
- **`SentimentCard.tsx`** - Cartes analyse sentiment
- **`JournalStatsCards.tsx`** - Cartes statistiques résumées

#### **Organisation & Navigation**
- **`JournalCalendarView.tsx`** - Vue calendrier entrées
- **`JournalListView.tsx`** - Liste chronologique entrées
- **`EntryCard.tsx`** - Cartes d'entrées individuelles
- **`JournalTemplates.tsx`** - Templates d'écriture guidée

#### **Fonctionnalités Avancées**
- **`VoiceRecorder.tsx`** - Enregistrement vocal intégré
- **`EmotionSelector.tsx`** - Sélecteur émotions rapide
- **`ExportButton.tsx`** - Export données journal
- **`JournalEntryModal.tsx`** - Modale édition entrées

### **🥽 Expériences VR** (`src/components/vr/`)
> **But**: Thérapie immersive en réalité virtuelle

#### **Sessions & Contrôles**
- **`VRSessionView.tsx`** - Vue session VR principale
- **`VRSessionControls.tsx`** - Contrôles session temps réel
- **`VRSessionPlayer.tsx`** - Lecteur expériences VR
- **`VRActiveSession.tsx`** - Session active avec monitoring

#### **Environnements & Visualisation**
- **`EnhancedVRGalaxy.tsx`** - Expérience galaxie VR améliorée
- **`VREnvironmentSelector.tsx`** - Sélecteur environnements VR
- **`Starfield.tsx`** - Champ d'étoiles immersif
- **`BreathPacerSphere.tsx`** - Sphère rythme respiratoire

#### **Interface & HUD**
- **`VRHUD.tsx`** - Interface heads-up display VR
- **`HUDControls.tsx`** - Contrôles HUD intégrés
- **`VRExitButton.tsx`** - Bouton sortie sécurisée VR
- **`VRPromptWidget.tsx`** - Widgets de guidage VR

#### **Analytics & Historique**
- **`VRSessionHistory.tsx`** - Historique sessions VR
- **`VRSessionStats.tsx`** - Statistiques sessions détaillées
- **`VRHistoryList.tsx`** - Liste historique organisée
- **`VRDashboard.tsx`** - Dashboard VR centralisé

---

## 📁 **4. MODULES UTILITAIRES & SYSTÈME**

### **⚡ Performance & Loading** (`src/components/ui/`)
- **`loading-animation.tsx`** - Animations de chargement fluides
- **`loading-spinner.tsx`** - Spinners personnalisables
- **`skeleton.tsx`** - Placeholders de contenu
- **`scroll-progress.tsx`** - Indicateur progression scroll
- **`optimized-image.tsx`** - Images optimisées lazy-loading

### **🔐 Sécurité & Accès** (`src/components/access/`)
- **`ProtectedRoute.tsx`** - Routes protégées par authentification
- **`RoleProtectedRoute.tsx`** - Protection par rôles utilisateur
- **`B2BModeGuard.tsx`** - Guard spécifique mode B2B
- **`AccessibilitySkipLinks.tsx`** - Liens d'accessibilité WCAG

### **🎨 Thèmes & Apparence**
- **`theme-toggle.tsx`** - Commutateur thème dark/light
- **`theme-provider.tsx`** - Provider thème global
- **`ThemeSwitcher.tsx`** - Sélecteur thèmes avancé

### **🚨 Gestion d'Erreurs**
- **`RootErrorBoundary.tsx`** - Boundary erreurs racine
- **`enhanced-error-boundary.tsx`** - Boundary erreurs enrichi
- **`EmptyState.tsx`** - États vides avec actions

---

## 🔄 **ARCHITECTURE OPTIMISÉE PROPOSÉE**

### **Problèmes Identifiés**
1. **Duplication excessive** - Multiples composants similaires
2. **Organisation dispersée** - Logique métier éparpillée  
3. **Dépendances croisées** - Couplage fort entre modules
4. **Manque de réutilisabilité** - Composants trop spécialisés
5. **Inconsistances** - Styles et comportements différents

### **Solutions Architecturales**

#### **🏗️ Structure Refactorisée**
```
src/components/
├── core/                 # Modules core business critical
│   ├── emotion/          # Tout l'émotionnel centralisé
│   ├── music/           # Audio et musicothérapie
│   ├── coaching/        # IA conversationnelle 
│   ├── journal/         # Écriture et analytics
│   ├── vr/              # Expériences immersives
│   └── analytics/       # Métriques et dashboards
├── shared/              # Composants partagés métier
│   ├── navigation/      # Navigation et routing
│   ├── forms/          # Formulaires complexes  
│   ├── visualization/   # Graphiques et charts
│   └── media/          # Audio, vidéo, images
├── ui/                 # Design system pur
│   ├── primitives/     # Composants atomiques
│   ├── patterns/       # Patterns composés
│   └── layouts/        # Layouts et grilles
└── utils/              # Utilitaires et helpers
    ├── providers/      # Context providers
    ├── guards/         # Route guards
    └── hooks/          # Custom hooks
```

#### **🎯 Bénéfices Attendus**
- **-60% duplication** code via factorisation
- **+200% réutilisabilité** composants cross-domain  
- **+150% maintenabilité** structure claire et logique
- **+100% testabilité** isolation et injection dépendances
- **+300% évolutivité** architecture modulaire extensible

---

## 🚀 **PROCHAINES ÉTAPES**

1. **Phase 1**: Refactoring architecture core modules
2. **Phase 2**: Consolidation composants UI système  
3. **Phase 3**: Optimisation performance et bundle size
4. **Phase 4**: Tests end-to-end et documentation
5. **Phase 5**: Migration progressive sans breaking changes

L'objectif est une architecture **modulaire, réutilisable et maintenable** supportant la croissance future de la plateforme EmotionsCare.