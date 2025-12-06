# 🚀 Guide de démarrage rapide - EmotionsCare

## Installation immédiate (5 minutes)

### 1. Prérequis ✓
- **Node.js 20+** et **npm**
- **Git** pour cloner le dépôt

### 2. Installation express ⚡
```bash
# Clone + install + démarrage
git clone <repo-url>
cd emotionscare-platform
npm install
npm run dev
```

**🎉 Ça fonctionne !** Ouvrez http://localhost:3000

### 3. Configuration optionnelle ⚙️

Le projet fonctionne immédiatement avec la configuration Supabase pré-intégrée.

**Pour personnaliser** (optionnel) :
```bash
cp .env.example .env.local
# Éditez .env.local selon vos besoins
```

## Structure du projet 📁

```
src/
├── components/      # Composants UI réutilisables
├── pages/          # Pages (HomePage, Dashboard, etc.)
├── hooks/          # Custom hooks React
├── lib/            # Configuration & utilitaires
├── integrations/   # Supabase, Firebase
├── services/       # Logique métier
└── assets/         # Images, sons, fichiers
```

## Commandes utiles 🛠️

```bash
# Développement
npm run dev         # Serveur local
npm run build       # Build production  
npm run preview     # Test du build

# Qualité code
npm run lint        # Vérification
npm run format      # Formatage auto
npm run test        # Tests unitaires
```

## Ajouter une fonctionnalité 🎯

### Nouveau composant
```bash
# Créer src/components/MonComposant.tsx
export const MonComposant = () => {
  return <div>Mon contenu</div>;
};
```

### Nouvelle page  
```bash
# Créer src/pages/MaPage.tsx
import { MonComposant } from '@/components/MonComposant';

export const MaPage = () => {
  return <MonComposant />;
};
```

### Nouveau hook
```bash
# Créer src/hooks/useMonHook.ts
export const useMonHook = () => {
  // Logique du hook
  return { data: 'exemple' };
};
```

## Variables d'environnement 🔧

### Variables disponibles (.env.local)
```bash
# API URLs (optionnel)
VITE_API_URL=https://mon-api.com
VITE_WEB_URL=http://localhost:3000

# Firebase (pour fonctionnalités étendues)
VITE_FIREBASE_API_KEY=ma_cle
VITE_FIREBASE_PROJECT_ID=mon_projet

# Paramètres upload
VITE_UPLOAD_MAX_SIZE=10485760
VITE_ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
```

### Où les utiliser
```typescript
import { API_URL, FIREBASE_CONFIG } from '@/lib/env';
```

## Déploiement 🚀

### Build de production
```bash
npm run build       # Génère dist/
npm run preview     # Test local du build
```

### Plateformes recommandées
- **Frontend** : Vercel, Netlify, GitHub Pages
- **Backend** : Supabase (déjà configuré)

## Troubleshooting 🔧

### Erreurs communes

**Port 3000 occupé ?**
```bash
# Utiliser un autre port
npm run dev -- --port 3001
```

**Erreur node_modules ?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Erreur TypeScript ?**
```bash
npm run lint        # Vérifier les erreurs
```

### Support
- 🐛 **GitHub Issues** pour les bugs
- 📚 **Documentation** dans `/docs`
- 💬 **Discussions** pour les questions

## Bonnes pratiques 📋

### Structure de code
- **Un composant = un fichier** dans `src/components/`
- **Hooks custom** dans `src/hooks/`  
- **Utilitaires** dans `src/lib/`
- **Pages** dans `src/pages/`

### Imports
```typescript
// ✅ Utiliser les alias
import { MonComposant } from '@/components/MonComposant';
import { useMonHook } from '@/hooks/useMonHook';
import { API_URL } from '@/lib/env';
```

### TypeScript
- **Types stricts** activés
- **Props typées** pour tous les composants
- **Pas de `any`** - utiliser des types précis

---

**🎯 Résultat** : Un environnement de développement moderne, rapide et fiable !

**Prochaine étape** : Consultez `CONTRIBUTING.md` pour les standards de contribution.