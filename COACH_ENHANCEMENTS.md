# 🎯 Coach Module Enhancements - Documentation Complète

## Vue d'ensemble

Ce document décrit les améliorations et enrichissements apportés au module Coach EmotionsCare. Ces améliorations transforment la plateforme d'un simple chatbot en un système complet de gestion du bien-être émotionnel.

## 📋 Fichiers Créés

### 1. Composants Principaux (`src/components/coach/`)

#### **CoachDashboard.tsx**
- **Purpose**: Tableau de bord principal avec statistiques
- **Features**:
  - 📊 Cartes KPI (bien-être, conversations, flexibilité)
  - 📈 Graphique de tendance émotionnelle (7 jours)
  - 🎯 Distribution des états émotionnels (graphique circulaire)
  - 📅 Activité hebdomadaire (graphique barres)
  - 💡 Recommandations personnalisées du jour
  - 🎨 Design responsive et dark mode
- **Props**: Aucun (utilise des données mockes)
- **Usage**:
  ```tsx
  import { CoachDashboard } from '@/components/coach/CoachDashboard';
  <CoachDashboard />
  ```

#### **CoachConversationManager.tsx**
- **Purpose**: Gestion des conversations passées
- **Features**:
  - 🔍 Recherche et filtres par émotion/date
  - 📥 Téléchargement de conversations (JSON)
  - 🔗 Partage sécurisé avec lien
  - 🗑️ Suppression de conversations
  - ✏️ Renommage de conversations
  - 📌 Tags par émotion
- **Data**: Utilise données mockes pour démo
- **Usage**:
  ```tsx
  import { CoachConversationManager } from '@/components/coach/CoachConversationManager';
  <CoachConversationManager />
  ```

#### **CoachSettingsPanel.tsx**
- **Purpose**: Paramètres et préférences utilisateur
- **Features**:
  - 🌍 Sélection de langue (FR/EN/ES/DE)
  - 👤 Mode Coach (B2C personnel / B2B professionnel)
  - 🎨 Sélection du thème
  - 🎭 Personnalité du coach (4 styles)
  - 🔊 Longueur des réponses (4 niveaux)
  - 🔔 Gestion des notifications
  - 🔒 Paramètres de confidentialité
  - 💾 Gestion des données personnelles
- **State Management**: useState local
- **Usage**:
  ```tsx
  import { CoachSettingsPanel } from '@/components/coach/CoachSettingsPanel';
  <CoachSettingsPanel />
  ```

#### **CoachEmotionTracker.tsx**
- **Purpose**: Suivi émotionnel avancé avec analytics
- **Features**:
  - 📊 4 onglets d'analyse :
    - Émotions : Graphique de tendance 7j avec sélection
    - Progrès : 4 semaines de métriques psychologiques
    - Profil : Graphique radar 5 dimensions
    - Insights : Analyses intelligentes et patterns
  - 💖 Cartes de résumé (état actuel, tendance, flexibilité)
  - 🎨 Couleurs codées par émotion
  - 📈 Détection de patterns temporels
- **Data**: Utilise données mockes pour démo
- **Usage**:
  ```tsx
  import { CoachEmotionTracker } from '@/components/coach/CoachEmotionTracker';
  <CoachEmotionTracker />
  ```

#### **CoachQuickActions.tsx**
- **Purpose**: Actions rapides et templates de messages
- **Features**:
  - ⚡ 8 actions rapides par émotion/catégorie
  - 📝 6 templates de messages pré-écrits
  - 🎨 Codes couleur par catégorie
  - 👁️ Aperçu complet des templates
  - 📋 Copie au presse-papiers
  - 🔄 Envoi direct au chat
- **Categories**: emotions, wellness, advice
- **Usage**:
  ```tsx
  import { CoachQuickActions } from '@/components/coach/CoachQuickActions';
  <CoachQuickActions />
  ```

### 2. Pages (`src/pages/`)

#### **CoachEnhancedPage.tsx**
- **Purpose**: Page principale intégrant tous les composants
- **Features**:
  - 🧭 Sidebar navigation avec 6 sections
  - 📱 Responsive design (mobile menu toggle)
  - 🎯 Context-aware header
  - 📜 Scrollable content area
  - 💬 Chat intégré
  - 🔐 Consentement & medical disclaimer
- **Layout**: Sidebar (64px) + Main content
- **Screen Sizes**:
  - Desktop: Sidebar permanent
  - Mobile: Sidebar collapsible
- **Usage**:
  ```tsx
  import CoachEnhancedPage from '@/pages/CoachEnhancedPage';
  // Auto-routed at /app/coach-enhanced
  ```

### 3. Utilitaires (`src/lib/coach/`)

#### **exportUtils.ts**
Utilitaires d'export et de partage de conversations

**Fonctions principales**:
- `exportAsJSON()` - Exporte en JSON
- `exportAsText()` - Exporte en texte brut
- `exportAsMarkdown()` - Exporte en markdown
- `downloadExport()` - Télécharge le fichier
- `generateShareLink()` - Crée un lien de partage
- `anonymizeContent()` - Masque informations sensibles
- `getConversationStats()` - Statistiques (messages, mots)
- `generatePDFExport()` - Génère PDF (future implémentation)
- `validateExportOptions()` - Valide les options

**Usage**:
```typescript
import { exportAsJSON, downloadExport } from '@/lib/coach/exportUtils';

const jsonString = exportAsJSON(conversation, {
  anonymize: true,
  includeTimestamps: true,
});

downloadExport(jsonString, 'conversation.json', 'application/json');
```

#### **emotionalAnalysis.ts**
Analyse avancée des données émotionnelles

**Interfaces**:
- `EmotionalSnapshot` - Instant émotionnel avec score
- `EmotionalTrend` - Tendance sur période
- `EmotionalPattern` - Patterns identifiés

**Fonctions principales**:
- `calculateEmotionalScore()` - Score global 0-10
- `getDominantEmotion()` - Émotion dominante
- `analyzeTrend()` - Analyse tendance (improving/declining/stable)
- `identifyPatterns()` - Détecte patterns temporels
- `generateRecommendations()` - Recommandations basées analyse
- `calculateFlexibility()` - Score AAQ-II (rigide/transition/souple)
- `generateWeeklySummary()` - Résumé hebdomadaire
- `comparePeriods()` - Compare deux périodes

**Usage**:
```typescript
import { analyzeTrend, generateRecommendations } from '@/lib/coach/emotionalAnalysis';

const trend = analyzeTrend(emotionalSnapshots);
const recs = generateRecommendations(snapshot, trend);
```

## 🏗️ Architecture

### Component Hierarchy
```
CoachEnhancedPage
├── Header
│   ├── Menu toggle (mobile)
│   ├── Page title
│   └── Action buttons
├── Sidebar (navigation)
│   └── 6 Nav items
│       ├── Chat
│       ├── Dashboard
│       ├── Emotions
│       ├── Conversations
│       ├── Quick Actions
│       └── Settings
└── Main Content (tabbed)
    ├── CoachView (chat)
    ├── CoachDashboard
    ├── CoachEmotionTracker
    ├── CoachConversationManager
    ├── CoachQuickActions
    └── CoachSettingsPanel
```

### Data Flow
```
CoachEnhancedPage (state: activeTab)
  ├── Manages tab state
  ├── Renders context-aware header
  └── Conditionally renders content component
      └── Each component manages its own state
```

## 🎨 Design System

### Couleurs Émotions
```
Joy       → #FBBF24 (Jaune)
Sadness   → #60A5FA (Bleu)
Anxiety   → #F87171 (Rouge)
Anger     → #F97316 (Orange)
Calm      → #34D399 (Vert)
Neutral   → #9CA3AF (Gris)
```

### Composants UI Utilisés
- shadcn/ui: Button, Card, Badge, Tabs, Dialog, Select, Input, Switch, etc.
- Recharts: LineChart, AreaChart, BarChart, PieChart, RadarChart
- Lucide Icons: 40+ icônes

## 📦 Dépendances Requises

### Déjà installées:
- react, react-router-dom
- shadcn/ui components
- lucide-react
- recharts
- typescript

### Nécessaires pour PDF export (future):
- jsPDF ou pdfkit

## 🔄 Intégration avec le Système Existant

### Routing
- La page `CoachEnhancedPage` doit être enregistrée dans le routeur
- Route suggérée: `/app/coach-enhanced`
- Ou remplacer la route existante `/app/coach`

### State Management
- Actuellement: useState local dans chaque composant
- Future: Intégration avec context/zustand si nécessaire

### Data Persistence
- Dashboard/Tracker: Data mockes (remplacer par API calls)
- Settings: localStorage ou Supabase
- Conversations: Supabase ou IndexedDB

## 🚀 Prochaines Étapes

1. **Backend Integration**:
   - Connecter exportUtils à l'API
   - Implémenter PDF export
   - Générer vrais rapports

2. **Data Persistence**:
   - Remplacer données mockes
   - Intégrer Supabase/API pour fetch
   - Cacher les données localement

3. **Analytics**:
   - Implémenter tracking Sentry
   - Monitorer les exports
   - Analyser l'utilisation

4. **Notifications**:
   - Toast notifications pour actions
   - Desktop notifications
   - Email digests

5. **Performance**:
   - Code splitting pour composants lourds
   - Lazy loading des charts
   - Optimisation des re-renders

## 📝 Notes de Développement

### Mocking Data
Tous les composants utilisent des données mockes. Pour la production:

```typescript
// Avant (mock)
const [stats, setStats] = useState<DashboardStats>({ ... });

// Après (API)
const [stats, setStats] = useState<DashboardStats | null>(null);
useEffect(() => {
  fetchDashboardStats().then(setStats);
}, []);
```

### Validation
- Tous les exports sont validés via `validateExportOptions()`
- L'anonymisation est optionnelle
- Gestion d'erreur à implémenter

### Accessibilité
- ✅ ARIA labels sur les boutons
- ✅ Keyboard navigation (Tabs)
- ✅ Dark mode support
- ⚠️ À tester: Screen reader compat

## 🐛 Problèmes Connus

1. Les données sont mockes - nécessite intégration API
2. PDF export pas implémenté (jsPDF dépendance manquante)
3. Partage de conversation nécessite backend
4. Anonymisation basique (regex) - peut manquer données sensibles

## 📚 Ressources

- [Recharts Documentation](https://recharts.org/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Version**: 1.0.0
**Date**: 2025-11-15
**Maintainers**: Claude AI
**Status**: ✅ MVP Complete
