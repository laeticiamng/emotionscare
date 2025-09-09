# 📋 BONNES PRATIQUES - Système de Routes EmotionsCare

## ✅ SYSTÈME OFFICIEL

**Un seul système autorisé :**
```typescript
import { routes } from '@/routerV2';
```

## 🚫 SYSTÈME INTERDIT 

**Ne plus utiliser :**
```typescript
import { Routes } from '@/routerV2/helpers'; // ❌ DÉPRÉCIÉ
```

## 📖 GUIDE D'UTILISATION

### Routes Publiques
```typescript
routes.public.home()        // → '/'
routes.public.about()       // → '/about'
routes.public.contact()     // → '/contact'
routes.public.help()        // → '/help'
```

### Authentification
```typescript
routes.auth.login()         // → '/login'
routes.auth.signup()        // → '/signup'
routes.auth.b2cLogin()      // → '/b2c/login'
```

### Application B2C (Consumer)
```typescript
routes.b2c.dashboard()      // → '/app/home'
routes.b2c.scan()           // → '/app/scan'
routes.b2c.music()          // → '/app/music'
routes.b2c.coach()          // → '/app/coach'
routes.b2c.journal()        // → '/app/journal'
routes.b2c.settings()       // → '/settings'
routes.b2c.profile()        // → '/profile'
```

### Application B2B
```typescript
// Employés
routes.b2b.user.dashboard() // → '/b2b/user/dashboard'
routes.b2b.user.profile()   // → '/b2b/user/profile'

// Managers  
routes.b2b.admin.dashboard() // → '/b2b/admin/dashboard'
routes.b2b.admin.users()     // → '/b2b/admin/users'
routes.b2b.teams()           // → '/teams'
routes.b2b.reports()         // → '/reports'
```

### Routes Spéciales
```typescript
routes.special.chooseMode()    // → '/choose-mode'
routes.special.unauthorized()  // → '/unauthorized'
routes.special.notFound()      // → '/404'
```

## 🎯 EXEMPLES PRATIQUES

### Navigation Standard
```typescript
import { Link } from 'react-router-dom';
import { routes } from '@/routerV2';

// Liens de navigation
<Link to={routes.public.home()}>Accueil</Link>
<Link to={routes.b2c.dashboard()}>Mon Dashboard</Link>
<Link to={routes.b2c.scan()}>Scanner Émotions</Link>
```

### Redirections Programmables
```typescript
import { Navigate } from 'react-router-dom';
import { routes } from '@/routerV2';

// Redirections conditionnelles
const AppDispatcher = () => {
  if (!isAuthenticated) {
    return <Navigate to={routes.auth.login()} replace />;
  }
  
  return <Navigate to={routes.b2c.dashboard()} replace />;
};
```

### Navigation Programmée
```typescript
import { useNavigate } from 'react-router-dom';
import { routes } from '@/routerV2';

const MyComponent = () => {
  const navigate = useNavigate();
  
  const handleSubmit = () => {
    // Logique métier...
    navigate(routes.b2c.dashboard());
  };
};
```

## 📏 RÈGLES D'ÉQUIPE

### ✅ À FAIRE
1. **Toujours importer** : `import { routes } from '@/routerV2'`
2. **Structure claire** : Utiliser la hiérarchie `routes.section.route()`
3. **Cohérence** : Même terminologie partout (dashboard, not home)
4. **Tests** : Vérifier que le lien fonctionne avant de commit

### ❌ NE PAS FAIRE
1. **Liens hardcodés** : `<Link to="/app/home">` → Utiliser `routes.b2c.dashboard()`
2. **Ancien système** : `Routes.*` est interdit
3. **Incohérence** : Mélanger anciens/nouveaux helpers
4. **Liens morts** : Tout lien doit mener à une page existante

## 🔧 AJOUT DE NOUVELLES ROUTES

### 1. Définir dans le Registry
```typescript
// src/routerV2/registry.ts
{
  name: 'nouvelle-fonctionnalite',
  path: '/app/nouvelle-fonctionnalite', 
  segment: 'consumer',
  role: 'consumer',
  layout: 'app',
  component: 'NouvelleFonctionnalitePage',
  guard: true,
}
```

### 2. Ajouter au Helper
```typescript
// src/routerV2/routes.ts
export const b2cRoutes = {
  // ... existing routes
  nouvelleFonctionnalite: () => '/app/nouvelle-fonctionnalite',
}
```

### 3. Utiliser dans l'App
```typescript
// Dans un composant
import { routes } from '@/routerV2';

<Link to={routes.b2c.nouvelleFonctionnalite()}>
  Nouvelle Fonctionnalité
</Link>
```

## 🎉 BÉNÉFICES

### Développeur
- **Autocomplétion** : TypeScript suggère les routes disponibles
- **Refactoring sûr** : Renommer une route met à jour tous les usages
- **Erreurs compilation** : Détection des liens cassés au build

### Équipe  
- **Cohérence** : Même façon de faire partout
- **Maintenabilité** : Une seule source de vérité
- **Évolutivité** : Ajouts faciles sans casser l'existant

### Utilisateur
- **Navigation fiable** : Aucun lien mort
- **Performance** : Pas de redirect chains
- **UX cohérente** : Terminologie unifiée

---

**💡 ASTUCE** : En cas de doute, regarder `src/routerV2/routes.ts` pour voir toutes les routes disponibles !

**🚨 RAPPEL** : Aucune PR acceptée avec `import { Routes } from '@/routerV2/helpers'` !
