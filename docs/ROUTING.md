
# 🚀 Guide de Routage EmotionsCare

## 📋 Vue d'ensemble

Le système de routage d'EmotionsCare est maintenant **unifié et sans doublons**. Chaque route a un chemin unique et tous les composants sont correctement mappés.

## 🗂️ Architecture

- `src/router/buildUnifiedRoutes.tsx` - Configuration centrale des routes
- `src/api/routes.ts` - API de gestion du manifeste
- `public/routes-manifest.json` - Manifeste public des routes
- `scripts/routes-audit.ts` - Script d'audit automatique

### Structure des routes

```
/ (HomePage)
├── /choose-mode (ChooseModePage)
├── /point20 (Point20Page)
├── /b2c/
│   ├── login (B2CLoginPage)
│   ├── register (B2CRegisterPage)
│   └── dashboard (B2CDashboardPage)
├── /b2b/
│   ├── selection (B2BSelectionPage)
│   ├── user/
│   │   ├── login (B2BUserLoginPage)
│   │   ├── register (B2BUserRegisterPage)
│   │   └── dashboard (B2BUserDashboardPage)
│   └── admin/
│       ├── login (B2BAdminLoginPage)
│       └── dashboard (B2BAdminDashboardPage)
├── /scan (ScanPage)
├── /music (MusicPage)
├── /coach (CoachPage)
├── /journal (JournalPage)
├── /vr (VRPage)
├── /meditation (MeditationPage)
├── /preferences (PreferencesPage)
├── /gamification (GamificationPage)
├── /social-cocon (SocialCoconPage)
├── /teams (TeamsPage) [Admin only]
├── /reports (ReportsPage) [Admin only]
├── /events (EventsPage) [Admin only]
├── /optimisation (OptimisationPage) [Admin only]
├── /settings (SettingsPage) [Admin only]
├── /notifications (NotificationsPage) [Admin only]
├── /security (SecurityPage) [Admin only]
├── /privacy (PrivacyPage) [Admin only]
├── /audit (AuditPage) [Admin only]
├── /accessibility (AccessibilityPage) [Admin only]
├── /innovation (InnovationPage) [Admin only]
├── /feedback (FeedbackPage) [Admin only]
├── /onboarding (OnboardingPage)
├── /access-diagnostic (AccessDiagnosticPage)
└── /* (Error404Page) - 404 catch-all
```

## 🔧 Comment ajouter une nouvelle route

### 1. Créer la page
```typescript
// src/pages/NouvelePage.tsx
import React from 'react';

const NouvelePage: React.FC = () => {
  return (
    <div data-testid="page-root">
      <h1>Nouvelle Page</h1>
    </div>
  );
};

export default NouvelePage;
```

### 2. Ajouter au manifeste
```typescript
// Dans src/router/buildUnifiedRoutes.tsx

// 1. Importer le composant
const NouvelePage = lazy(() => import('../pages/NouvelePage'));

// 2. Ajouter au ROUTES_MANIFEST
export const ROUTES_MANIFEST: RouteManifestEntry[] = [
  // ... autres routes
  { 
    path: '/nouvelle-page', 
    auth: 'public', // ou 'b2c', 'b2b_user', 'b2b_admin'
    module: 'nouveau-module', 
    component: 'NouvelePage' 
  },
];

// 3. Ajouter à buildUnifiedRoutes()
export function buildUnifiedRoutes(): RouteObject[] {
  const routes: RouteObject[] = [
    // ... autres routes
    {
      path: '/nouvelle-page',
      element: <NouvelePage />,
    },
  ];
}
```

### 3. Mettre à jour le manifeste public
```json
// Dans public/routes-manifest.json
{
  "routes": [
    // ... autres routes
    { 
      "path": "/nouvelle-page", 
      "auth": "public", 
      "module": "nouveau-module", 
      "component": "NouvelePage" 
    }
  ]
}
```

### 4. Lancer l'audit
```bash
bun run routes:audit
```

## 🔍 API du manifeste

### GET /api/routes (simulation)
```typescript
import { RoutesApi } from '../src/api/routes';

const manifest = await RoutesApi.getManifest();
// Retourne : { routes: RouteManifestEntry[], meta: {...} }
```

### GET /api/routes/health (simulation)
```typescript
const health = await RoutesApi.getHealth();
// Retourne : { status: 'healthy'|'error', duplicates: [...], ... }
```

## 🛠️ Audit automatique

### Script local
```bash
# Lancer l'audit
bun run scripts/routes-audit.ts

# Ou avec npm
npm run routes:audit
```

### Intégration CI
Le script `routes:audit` devrait être ajouté au pipeline CI :
```yaml
- name: Audit Routes
  run: bun run routes:audit
```

## ✅ Règles de validation

1. **Aucun doublon de path** - Chaque chemin doit être unique
2. **Format de path valide** - Doit commencer par `/`
3. **Auth valide** - `public`, `b2c`, `b2b_user`, ou `b2b_admin`
4. **Composant existant** - Le fichier de page doit exister
5. **data-testid requis** - Chaque page doit avoir `data-testid="page-root"`

## 🚨 Erreurs communes

### Doublon de routes
```
❌ Error: Duplicate path: /duplicate-route
✅ Solution: Supprimer l'une des déclarations
```

### Page manquante
```
❌ Error: Missing page: NonExistentPage
✅ Solution: Créer src/pages/NonExistentPage.tsx
```

### data-testid manquant
```
❌ Error: Page missing data-testid="page-root"
✅ Solution: Ajouter l'attribut à l'élément racine
```

## 📊 Métriques

- **Total routes :** 34
- **Routes publiques :** 9
- **Routes B2C :** 11
- **Routes B2B User :** 3
- **Routes B2B Admin :** 13

---

*Dernière mise à jour : 23 janvier 2025*
