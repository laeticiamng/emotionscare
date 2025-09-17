# 🧩 LISTING COMPLET DES MODULES - EMOTIONSCARE

## 🗂️ Légende des statuts
- **🟢 Stable**: composant/morceau de domaine validé en production et largement utilisé.
- **🟡 Beta**: implémentation prête à l'emploi mais encore alimentée par des données simulées ou en attente de QA finale.
- **🟠 Prototype**: exploration active ou module expérimental en phase de design/POC.
- **🔵 Planifié**: conception actée mais pas encore livrée dans le codebase.

## 📁 Architecture Actuelle vs Optimisée

### **1. MODULES UI DE BASE** (`src/components/ui/`)
> **But**: Système de design fondamental et composants réutilisables

#### **🎨 Composants d'Interface Core**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `button.tsx` | 🟢 Stable | Boutons avec variants et tailles multiples |
| `card.tsx` | 🟢 Stable | Conteneurs de contenu avec header/content/footer |
| `input.tsx` | 🟢 Stable | Champs de saisie avec validation et états |
| `textarea.tsx` | 🟢 Stable | Zones de texte multi-lignes |
| `dialog.tsx` | 🟢 Stable | Modales et dialogues overlay |
| `sheet.tsx` | 🟢 Stable | Panneaux latéraux coulissants |
| `popover.tsx` | 🟢 Stable | Info-bulles et menus contextuels |
| `dropdown-menu.tsx` | 🟢 Stable | Menus déroulants interactifs |
| `select.tsx` | 🟢 Stable | Sélecteurs avec options multiples |
| `checkbox.tsx` | 🟢 Stable | Cases à cocher avec états intermédiaires |
| `radio-group.tsx` | 🟢 Stable | Groupes de boutons radio |
| `switch.tsx` | 🟢 Stable | Interrupteurs on/off |
| `slider.tsx` | 🟢 Stable | Curseurs de valeurs numériques |
| `progress.tsx` | 🟢 Stable | Barres de progression linéaires |
| `avatar.tsx` | 🟢 Stable | Photos de profil avec fallbacks |
| `badge.tsx` | 🟢 Stable | Étiquettes de statut et notifications |
| `separator.tsx` | 🟢 Stable | Séparateurs visuels |
| `skeleton.tsx` | 🟢 Stable | Placeholders de chargement |

#### **🧭 Navigation & Layout**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `tabs.tsx` | 🟢 Stable | Onglets de navigation horizontale |
| `accordion.tsx` | 🟢 Stable | Contenus pliables/dépliables |
| `sidebar.tsx` | 🟡 Beta | Barre latérale shadcn/ui adaptée au shell premium |
| `breadcrumb.tsx` | 🟢 Stable | Fil d'Ariane navigationnel |
| `pagination.tsx` | 🟢 Stable | Navigation entre pages de contenu |
| `navigation-menu.tsx` | 🟡 Beta | Menu principal responsive (tests accessibilité en cours) |
| `command.tsx` | 🟡 Beta | Palette de commandes (⌘K) alimentée par RouterV2 |
| `menubar.tsx` | 🟢 Stable | Barre de menu classique |

#### **📊 Visualisation & Données**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `table.tsx` | 🟡 Beta | Tableaux de données avec tri/filtres |
| `data-table.tsx` | 🟡 Beta | Table avancée (TanStack) en cours de généralisation |
| `chart.tsx` | 🟡 Beta | Graphiques avec intégration Recharts |
| `calendar.tsx` | 🟡 Beta | Calendriers interactifs |
| `date-picker.tsx` | 🟢 Stable | Sélecteurs de dates |
| `time-picker.tsx` | 🟡 Beta | Sélecteurs d'heures |

#### **🔔 Feedback & États**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `toast.tsx` | 🟢 Stable | Notifications temporaires |
| `alert.tsx` | 🟢 Stable | Messages d'alerte persistants |
| `alert-dialog.tsx` | 🟢 Stable | Confirmations critiques |
| `loading-animation.tsx` | 🟢 Stable | Animations de chargement |
| `loading-spinner.tsx` | 🟢 Stable | Indicateurs de progression |
| `scroll-progress.tsx` | 🟡 Beta | Barre de scroll de page |

#### **🎛️ Composants Avancés**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `form.tsx` | 🟢 Stable | Système de formulaires React Hook Form |
| `carousel.tsx` | 🟡 Beta | Défilements d'images/contenu |
| `resizable.tsx` | 🟡 Beta | Panneaux redimensionnables |
| `collapsible.tsx` | 🟢 Stable | Contenus collapsables |
| `hover-card.tsx` | 🟢 Stable | Cartes au survol |
| `context-menu.tsx` | 🟡 Beta | Menus contextuels clic-droit |
| `tooltip.tsx` | 🟢 Stable | Info-bulles au survol |

---

## 📁 **2. MODULES FONCTIONNELS CORE** (`src/components/features/`)
> **But**: Fonctionnalités métier principales réutilisables

#### **🧠 Intelligence Artificielle**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `EmotionAnalyzer.tsx` | 🟢 Stable | Analyse IA multi-modal (texte, voix, caméra) via `emotionsCareApi` |
| `VirtualCoach.tsx` | 🟠 Prototype | Assistant Nyvée expérimental, flux conversationnels en cours |
| `SmartMusicPlayer.tsx` | 🟢 Stable | Génération musicale IA adaptée aux émotions |

#### **📊 Analytics & Suivi**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `StatsOverview.tsx` | 🟡 Beta | Tableau de bord KPIs bien-être |
| `EmotionTracking.tsx` | 🟡 Beta | Suivi détaillé des émotions dans le temps |
| `MoodChart.tsx` | 🟡 Beta | Visualisations graphiques des états émotionnels |

#### **📝 Expression & Communication**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `InteractiveJournal.tsx` | 🟢 Stable | Journal intelligent avec analyse de sentiment |
| `NavigationHub.tsx` | 🟡 Beta | Hub de navigation intelligent multi-critères |
| `GlobalSearchCommand.tsx` | 🟡 Beta | Palette de commandes globale (⌘K) |

#### **📅 Planning & Organisation**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `SmartCalendar.tsx` | 🟡 Beta | Calendrier de bien-être avec IA |
| `ProfileManager.tsx` | 🟡 Beta | Gestion complète du profil utilisateur |

#### **🔔 Système & Notifications**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `NotificationSystem.tsx` | 🟡 Beta | Centre de notifications intelligent |
| `UnifiedDashboard.tsx` | 🟡 Beta | Dashboard adaptatif selon rôle utilisateur |

---

## 📁 **3. MODULES SPÉCIALISÉS PAR DOMAINE**

### **🔍 Scanner Émotionnel** (`src/components/scan/`)
> **But**: Analyse faciale et émotionnelle temps réel

#### **Core Scanning**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `EmotionScanner.tsx` | 🟡 Beta | Scanner principal multi-modal |
| `FacialEmotionScanner.tsx` | 🟡 Beta | Analyse faciale IA avancée |
| `VoiceEmotionScanner.tsx` | 🟡 Beta | Reconnaissance émotions vocales |
| `TextEmotionScanner.tsx` | 🟡 Beta | Analyse sentiment textuel |
| `LiveScanner.tsx` | 🟠 Prototype | Stream temps réel continu |
| `PhotoUploader.tsx` | 🟡 Beta | Upload et analyse photos |

#### **Visualisation & Résultats**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `EmotionVisualization.tsx` | 🟡 Beta | Graphiques émotions temps réel |
| `EmotionResultCard.tsx` | 🟢 Stable | Affichage résultats analysés |
| `BiometricDisplay.tsx` | 🟡 Beta | Métriques physiologiques |
| `EmotionTrendChart.tsx` | 🟡 Beta | Tendances émotionnelles |

#### **Analytics & Historique**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `EmotionHistory.tsx` | 🟡 Beta | Historique complet scans |
| `ScanHistoryViewer.tsx` | 🟡 Beta | Visualiseur historique avancé |
| `EmotionAnalyticsDashboard.tsx` | 🟡 Beta | Dashboard analytics détaillé |
| `PostScanAnalysis.tsx` | 🟠 Prototype | Analyse post-scan approfondie |

### **🎵 Musicothérapie** (`src/components/music/`)
> **But**: Thérapie musicale intelligente et génération IA

#### **Génération & Recommandation IA**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `AdvancedMusicGenerator.tsx` | 🟡 Beta | Génération musicale IA avancée |
| `EmotionBasedMusicRecommendation.tsx` | 🟢 Stable | Recommandations basées émotions |
| `AdaptivePlaylistEngine.tsx` | 🟢 Stable | Engine playlists auto-adaptatives |
| `MoodBasedRecommendations.tsx` | 🟡 Beta | Recommandations selon humeur |

#### **Lecteurs & Contrôles**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `AdaptiveMusicPlayer.tsx` | 🟢 Stable | Lecteur adaptatif principal |
| `AnimatedMusicPlayer.tsx` | 🟡 Beta | Lecteur avec animations |
| `MusicMiniPlayer.tsx` | 🟢 Stable | Mini-lecteur persistant |
| `AutoMusicPlayer.tsx` | 🟡 Beta | Lecture automatique intelligente |

#### **Visualisation & Effets**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `MusicVisualizer.tsx` | 🟡 Beta | Visualisateur audio avancé |
| `AudioVisualizer.tsx` | 🟡 Beta | Spectre audio en temps réel |
| `MusicWaveform.tsx` | 🟡 Beta | Formes d'ondes interactives |
| `AudioEqualizer.tsx` | 🟠 Prototype | Égaliseur audio personnalisable |

#### **Thérapie & Création**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `MusicTherapy.tsx` | 🟡 Beta | Module thérapie musicale guidée |
| `MusicCreator.tsx` | 🟠 Prototype | Création musicale utilisateur |
| `MusicMixer.tsx` | 🟡 Beta | Mixage et blend de sons |
| `EmotionMusicGenerator.tsx` | 🟡 Beta | Générateur selon émotions |

### **💬 Coach IA & Conversation** (`src/components/coach/`)
> **But**: Assistant virtuel thérapeutique intelligent

#### **Interface de Chat**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `EnhancedCoachChat.tsx` | 🟠 Prototype | Interface chat principale améliorée |
| `CoachChatInterface.tsx` | 🟠 Prototype | Interface conversationnelle complète |
| `ChatMessageList.tsx` | 🟠 Prototype | Liste messages avec historique |
| `EnhancedCoachChatInput.tsx` | 🟠 Prototype | Input enrichi avec suggestions |

#### **Personnalité & Comportement**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `EmpathicAICoach.tsx` | 🟠 Prototype | Coach IA avec empathie avancée |
| `CoachCharacter.tsx` | 🟠 Prototype | Système de personnalité coach |
| `CoachPersonalitySelector.tsx` | 🟠 Prototype | Sélecteur personnalité coach |
| `CoachPresence.tsx` | 🟠 Prototype | Indicateurs de présence coach |

#### **Intelligence & Recommandations**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `EnhancedCoachAI.tsx` | 🟠 Prototype | IA coach avec logique avancée |
| `CoachInsights.tsx` | 🟠 Prototype | Insights et analyses coach |
| `CoachRecommendations.tsx` | 🟠 Prototype | Recommandations personnalisées |
| `MiniCoach.tsx` | 🟠 Prototype | Coach compact intégré |

#### **Historique & Navigation**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `ConversationHistory.tsx` | 🟠 Prototype | Historique conversations complètes |
| `ConversationTimeline.tsx` | 🟠 Prototype | Timeline interactions temporelle |
| `ConversationList.tsx` | 🟠 Prototype | Liste conversations sauvegardées |

### **📔 Journal Intelligent** (`src/components/journal/`)
> **But**: Écriture thérapeutique avec IA et analytics

#### **Interface d'Écriture**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `IntelligentJournal.tsx` | 🟢 Stable | Journal principal avec IA |
| `JournalInterface.tsx` | 🟢 Stable | Interface complète journal |
| `TextEditor.tsx` | 🟢 Stable | Éditeur texte enrichi |
| `JournalEntryForm.tsx` | 🟡 Beta | Formulaire saisie entrées |

#### **Analytics & Visualisation**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `JournalAnalytics.tsx` | 🟡 Beta | Analytics avancés journal |
| `JournalMoodChart.tsx` | 🟡 Beta | Graphiques humeur journal |
| `SentimentCard.tsx` | 🟡 Beta | Cartes analyse sentiment |
| `JournalStatsCards.tsx` | 🟡 Beta | Cartes statistiques résumées |

#### **Organisation & Navigation**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `JournalCalendarView.tsx` | 🟡 Beta | Vue calendrier entrées |
| `JournalListView.tsx` | 🟢 Stable | Liste chronologique entrées |
| `EntryCard.tsx` | 🟢 Stable | Cartes d'entrées individuelles |
| `JournalTemplates.tsx` | 🟡 Beta | Templates d'écriture guidée |

#### **Fonctionnalités Avancées**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `VoiceRecorder.tsx` | 🟡 Beta | Enregistrement vocal intégré |
| `EmotionSelector.tsx` | 🟢 Stable | Sélecteur émotions rapide |
| `ExportButton.tsx` | 🟢 Stable | Export données journal |
| `JournalEntryModal.tsx` | 🟡 Beta | Modale édition entrées |

### **🥽 Expériences VR** (`src/components/vr/`)
> **But**: Thérapie immersive en réalité virtuelle

#### **Sessions & Contrôles**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `VRSessionView.tsx` | 🟡 Beta | Vue session VR principale |
| `VRSessionControls.tsx` | 🟡 Beta | Contrôles session temps réel |
| `VRSessionPlayer.tsx` | 🟡 Beta | Lecteur expériences VR |
| `VRActiveSession.tsx` | 🟡 Beta | Session active avec monitoring |

#### **Environnements & Visualisation**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `EnhancedVRGalaxy.tsx` | 🟡 Beta | Expérience galaxie VR améliorée |
| `VREnvironmentSelector.tsx` | 🟡 Beta | Sélecteur environnements VR |
| `Starfield.tsx` | 🟢 Stable | Champ d'étoiles immersif |
| `BreathPacerSphere.tsx` | 🟡 Beta | Sphère rythme respiratoire |

#### **Interface & HUD**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `VRHUD.tsx` | 🟡 Beta | Interface heads-up display VR |
| `HUDControls.tsx` | 🟡 Beta | Contrôles HUD intégrés |
| `VRExitButton.tsx` | 🟢 Stable | Bouton sortie sécurisée VR |
| `VRPromptWidget.tsx` | 🟡 Beta | Widgets de guidage VR |

#### **Analytics & Historique**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `VRSessionHistory.tsx` | 🟡 Beta | Historique sessions VR |
| `VRSessionStats.tsx` | 🟡 Beta | Statistiques sessions détaillées |
| `VRHistoryList.tsx` | 🟡 Beta | Liste historique organisée |
| `VRDashboard.tsx` | 🟡 Beta | Dashboard VR centralisé |

---

## 📁 **4. MODULES UTILITAIRES & SYSTÈME**

### **⚡ Performance & Loading** (`src/components/ui/`)

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `loading-animation.tsx` | 🟢 Stable | Animations de chargement fluides |
| `loading-spinner.tsx` | 🟢 Stable | Spinners personnalisables |
| `skeleton.tsx` | 🟢 Stable | Placeholders de contenu |
| `scroll-progress.tsx` | 🟡 Beta | Indicateur progression scroll |
| `optimized-image.tsx` | 🟡 Beta | Images optimisées lazy-loading |

### **🔐 Sécurité & Accès** (`src/components/access/`)

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `ProtectedRoute.tsx` | 🟢 Stable | Routes protégées par authentification |
| `RoleProtectedRoute.tsx` | 🟢 Stable | Protection par rôles utilisateur |
| `B2BModeGuard.tsx` | 🟡 Beta | Guard spécifique mode B2B |
| `AccessibilitySkipLinks.tsx` | 🟢 Stable | Liens d'accessibilité WCAG |

### **🎨 Thèmes & Apparence**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `theme-toggle.tsx` | 🟢 Stable | Commutateur thème dark/light |
| `theme-provider.tsx` | 🟢 Stable | Provider thème global |
| `ThemeSwitcher.tsx` | 🟡 Beta | Sélecteur thèmes avancé |

### **🚨 Gestion d'Erreurs**

| Composant | Statut | Notes clés |
|-----------|--------|------------|
| `RootErrorBoundary.tsx` | 🟢 Stable | Boundary erreurs racine |
| `enhanced-error-boundary.tsx` | 🟢 Stable | Boundary erreurs enrichi |
| `EmptyState.tsx` | 🟢 Stable | États vides avec actions |

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