# 📋 LISTING COMPLET DES PAGES - EMOTIONSCARE

## 🏠 Pages Principales & Navigation

### **HomePage.tsx** - Page d'accueil principale
- **But**: Landing page premium avec présentation complète d'EmotionsCare
- **Contenu**: Hero section, features IA, témoignages, stats en temps réel, CTA vers B2C/B2B
- **Public**: Visiteurs non-authentifiés
- **Rôle**: Acquisition et conversion

### **ChooseModePage.tsx** - Sélection du mode utilisateur
- **But**: Orienter l'utilisateur vers l'expérience B2C ou B2B appropriée
- **Contenu**: Deux cartes interactives (Particulier/Entreprise) avec comparaison features
- **Public**: Nouveaux utilisateurs
- **Rôle**: Segmentation et routing intelligent

### **AppGatePage.tsx** - Dispatcher intelligent post-authentification
- **But**: Redirecter automatiquement selon le rôle utilisateur (consumer/employee/manager)
- **Contenu**: Logique de redirection basée sur user.role et userMode
- **Public**: Utilisateurs authentifiés
- **Rôle**: Router central et gateway sécurisé

---

## 🔐 Authentification & Onboarding

### **LoginPage.tsx** - Connexion sécurisée multi-segment
- **But**: Authentification universelle avec support B2C/B2B
- **Contenu**: Form optimisé, social login, segment detection, UX premium
- **Features**: Mode souvenir, mot de passe oublié, validation temps réel
- **Sécurité**: RGPD conforme, SSL, protection contre bruteforce

### **SignupPage.tsx** - Inscription avec profil personnalisé
- **But**: Création de compte avec questionnaire onboarding
- **Contenu**: Étapes progressives, validation email, choix préférences
- **Features**: Upload avatar, sélection intérêts, confirmation email

### **OnboardingPage.tsx** - Première expérience guidée
- **But**: Introduction interactive aux fonctionnalités clés
- **Contenu**: Tour guidé, configuration initiale, tutoriel interactif
- **Features**: Personnalisation profil, choix modules favoris

---

## 🎯 Espaces Utilisateur B2C

### **B2CHomePage.tsx** - Dashboard modules B2C
- **But**: Hub central d'accès à tous les modules de bien-être personnel
- **Contenu**: 7 catégories organisées (Mesure, VR, Audio, Coaching, etc.)
- **Features**: Badges progression, accès rapide, navigation intuitive

### **DashboardPage.tsx** - Tableau de bord émotionnel avancé
- **But**: Vue d'ensemble complète de l'état émotionnel et progression
- **Contenu**: Stats temps réel, graphiques tendances, objectifs, activités récentes
- **Features**: EmotionMeter, MoodChart, StatsOverview, NotificationSystem

### **B2CDashboardPage.tsx** - Dashboard B2C spécialisé
- **But**: Version B2C du dashboard avec focus individuel
- **Contenu**: Métriques personnelles, progression individuelle, recommandations IA

---

## 🧠 Modules Core d'Analyse

### **ScanPage.tsx** / **B2CScanPage.tsx** - Analyse émotionnelle IA
- **But**: Scanner facial temps réel pour détecter émotions et micro-expressions
- **Contenu**: Caméra live, analyse faciale, résultats instantanés, historique
- **Features**: IA recognition 99% précision, export données, graphiques

### **EmotionsPage.tsx** - Tracking émotionnel complet
- **But**: Suivi détaillé des patterns émotionnels et tendances
- **Contenu**: Calendrier émotions, analytics avancés, corrélations
- **Features**: EmotionTracking, graphiques interactifs, insights IA

---

## 🎵 Modules Audio & Thérapie

### **MusicPage.tsx** - Musicothérapie intelligente IA
- **But**: Génération musicale adaptative basée sur l'état émotionnel
- **Contenu**: SmartMusicPlayer, playlists personnalisées, binaural beats
- **Features**: Génération temps réel, synchronisation biométrique

### **B2CMoodMixerPage.tsx** - Création d'ambiances personnalisées
- **But**: Mixer des sons et ambiances pour créer l'atmosphère idéale
- **Contenu**: Interface DJ, presets émotionnels, enregistrement créations

### **B2CBubbleBeatPage.tsx** - Thérapie rythmique cardiaque
- **But**: Synchronisation visuelle et audio avec le rythme cardiaque
- **Contenu**: Capteur BPM, bulles animées, exercices de cohérence cardiaque

---

## 📝 Expression & Journal

### **JournalPage.tsx** - Journal intelligent avec IA
- **But**: Espace d'écriture sécurisé avec analyse de sentiment automatique
- **Contenu**: Éditeur avancé, analyse IA, suggestions, export
- **Features**: Chiffrement E2E, InteractiveJournal, sentiment analysis

### **B2CStorySynthLabPage.tsx** - Laboratoire de création narrative
- **But**: Créer des histoires thérapeutiques personnalisées
- **Contenu**: IA narrative, templates, partage communauté

---

## 🥽 Expériences Immersives VR

### **VRBreathPage.tsx** / **B2CVRBreathGuidePage.tsx** - Méditation VR
- **But**: Sessions de respiration guidée en réalité virtuelle
- **Contenu**: Environnements 3D apaisants, exercices breathing, biofeedback

### **B2CVRGalaxyPage.tsx** - Exploration spatiale thérapeutique
- **But**: Voyage immersif dans l'espace pour relaxation profonde
- **Contenu**: Univers 3D interactif, narration guidée, musique spatiale

### **VRSessionsPage.tsx** - Gestion des sessions VR
- **But**: Planning et suivi des expériences VR thérapeutiques
- **Contenu**: Calendrier sessions, historique, statistiques immersion

---

## 💬 Coaching & Support

### **CoachChatPage.tsx** / **MessagesPage.tsx** - Assistant IA Nyvée
- **But**: Conversation thérapeutique avec coach virtuel intelligent
- **Contenu**: Chat IA avancé, reconnaissance vocale, conseils personnalisés
- **Features**: VirtualCoach, analyse contextuelle, support 24/7

### **B2CAICoachPage.tsx** - Coach IA spécialisé B2C
- **But**: Version B2C enrichie du coaching avec focus personnel

---

## ⚡ Modules Flash & Micro-Interventions

### **B2CFlashGlowPage.tsx** - Thérapie lumière instantanée
- **But**: Sessions ultra-courtes (2min) de stimulation lumineuse
- **Contenu**: Patterns lumineux thérapeutiques, synchronisation breathing

### **B2CBreathworkPage.tsx** - Exercices de respiration guidés
- **But**: Techniques de breathing pour gestion stress et anxiété
- **Contenu**: Exercices variés, visualisations, suivi progression

### **B2CScreenSilkBreakPage.tsx** - Pauses écran intelligentes
- **But**: Micro-pauses automatiques pour protection vue et bien-être
- **Contenu**: Rappels adaptatifs, exercices oculaires, stats usage écran

---

## 🎮 Gamification & Motivation

### **GamificationPage.tsx** - Système de récompenses global
- **But**: Mécaniques de jeu pour encourager l'engagement bien-être
- **Contenu**: Points, badges, défis, classements, achievements

### **LeaderboardPage.tsx** - Classements et compétitions bienveillantes
- **But**: Motivation sociale positive avec respect de la privacy
- **Contenu**: Classements anonymisés, défis communauté, auras

### **B2CAmbitionArcadePage.tsx** - Gamification des objectifs
- **But**: Transformer les objectifs personnels en jeux motivants
- **Contenu**: Quêtes, niveaux, récompenses, progression visuelle

### **B2CBossLevelGritPage.tsx** - Développement de la résilience
- **But**: Exercices pour renforcer la résistance aux difficultés
- **Contenu**: Défis progressifs, techniques coping, mesure grit score

### **B2CBounceBackBattlePage.tsx** - Combat contre les rechutes
- **But**: Outils de prévention et gestion des phases difficiles
- **Contenu**: Plan d'action personnalisé, réseau support, techniques urgence

---

## 📊 Analytics & Rapports

### **ReportingPage.tsx** - Rapports détaillés multi-niveaux
- **But**: Analytics complets pour utilisateurs et administrateurs
- **Contenu**: Graphiques avancés, export données, insights IA

### **ApiMonitoringPage.tsx** - Monitoring technique système
- **But**: Surveillance performance API et services (admin uniquement)
- **Contenu**: Métriques système, alertes, logs, diagnostic

### **HeatmapPage.tsx** - Cartes de chaleur émotionnelles
- **But**: Visualisation géographique et temporelle des émotions
- **Contenu**: Heatmaps interactives, corrélations temporelles

---

## 📅 Planning & Organisation

### **CalendarPage.tsx** - Calendrier de bien-être intelligent
- **But**: Planification des activités de bien-être avec SmartCalendar
- **Contenu**: Agenda adaptatif, rappels personnalisés, synchronisation goals
- **Features**: IA scheduling, intégration modules, suivi habitudes

---

## 👤 Profil & Paramètres

### **ProfilePage.tsx** - Gestion profil complète
- **But**: Espace personnel avec ProfileManager et paramètres avancés
- **Contenu**: Infos personnelles, préférences, historique, achievements
- **Features**: Avatar upload, privacy controls, export données

### **SettingsPage.tsx** - Configuration système
- **But**: Paramètres globaux application et préférences utilisateur
- **Contenu**: Notifications, privacy, thème, intégrations

---

## 🏢 Espace B2B Entreprise

### **B2BAdminDashboardPage.tsx** - Dashboard administrateur
- **But**: Vue d'ensemble RH et management d'équipe
- **Contenu**: Analytics équipe, KPIs bien-être, gestion utilisateurs

### **B2BUserDashboardPage.tsx** - Dashboard employé
- **But**: Interface employé avec focus professionnel
- **Contenu**: Métriques individuelles, objectifs équipe, resources RH

### **B2BRHDashboard.tsx** - Dashboard RH spécialisé
- **But**: Outils RH pour suivi bien-être collectif
- **Contenu**: Reports anonymisés, tendances équipe, actions préventives

### **B2BTeamsPage.tsx** - Gestion d'équipes
- **But**: Management et suivi des équipes
- **Contenu**: Structure organisationnelle, collaboration, communication

### **B2BReportsPage.tsx** - Rapports entreprise
- **But**: Analytics B2B avec focus performance organisationnelle
- **Contenu**: ROI bien-être, productivité, satisfaction employés

---

## 🛡️ Sécurité & Légal

### **PrivacyPage.tsx** / **LegalPrivacyPage.tsx** - Politique de confidentialité
- **But**: Transparence RGPD et protection des données
- **Contenu**: Politique détaillée, droits utilisateurs, contacts DPO

### **LegalTermsPage.tsx** - Conditions d'utilisation
- **But**: Cadre légal d'utilisation de la plateforme
- **Contenu**: CGU complètes, responsabilités, propriété intellectuelle

### **ContactPage.tsx** - Support et contact
- **But**: Canaux de communication avec l'équipe
- **Contenu**: Formulaire contact, FAQ, coordonnées support

---

## 🚨 Pages d'Erreur & États

### **404Page.tsx** / **NotFoundPage.tsx** - Page non trouvée
- **But**: Gestion élégante des erreurs 404
- **Contenu**: Message friendly, suggestions navigation, retour accueil

### **401Page.tsx** / **UnauthorizedPage.tsx** - Non autorisé
- **But**: Gestion des erreurs d'autorisation
- **Contenu**: Message explicatif, lien connexion, support

### **403Page.tsx** / **ForbiddenPage.tsx** - Accès interdit
- **But**: Gestion des restrictions d'accès
- **Contenu**: Explication permissions, contact admin

### **503Page.tsx** / **ServerErrorPage.tsx** - Erreur serveur
- **But**: Communication lors de maintenance ou dysfonctionnement
- **Contenu**: Message technique, estimation rétablissement

---

## 📈 Performance & Optimisation

### **TestPage.tsx** - Tests et expérimentations
- **But**: Environnement de test pour nouvelles fonctionnalités
- **Contenu**: Playground développeur, prototypes, A/B testing

### **DemoPage.tsx** - Démonstrations interactives
- **But**: Présentation des fonctionnalités sans compte
- **Contenu**: Tours guidés, exemples d'usage, conversions

---

## 🎯 Architecture & Navigation

L'application suit une **architecture modulaire** avec:
- **Routing intelligent** basé sur les rôles utilisateur
- **Composants réutilisables** pour cohérence UX
- **Features avancées** (IA, VR, biométrie, gamification)
- **Accessibilité WCAG 2.1 AA** sur toutes les pages
- **Design system** unifié avec Tailwind CSS
- **Intégrations premium** (Supabase, Analytics, Monitoring)

**État actuel**: 80+ pages développées couvrant l'intégralité du parcours utilisateur B2C et B2B.