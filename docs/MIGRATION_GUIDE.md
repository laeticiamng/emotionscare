# 🚀 Guide de Migration vers RouterV2

## Vue d'ensemble

Ce guide explique comment migrer d'anciennes routes vers le nouveau système RouterV2.

---

## 📋 Table des matières

1. [Changements Principaux](#changements-principaux)
2. [Migration des Routes](#migration-des-routes)
3. [Migration des Guards](#migration-des-guards)
4. [Migration des Helpers](#migration-des-helpers)
5. [Checklist de Migration](#checklist-de-migration)
6. [Dépannage](#dépannage)

---

## 🔄 Changements Principaux

### Avant (Router Legacy)
```typescript
// Routes hardcodées
<Route path="/scan" element={<ScanPage />} />

// Guards manuels
const ProtectedRoute = ({ children }) => {
  if (!isAuth) return <Navigate to="/login" />;
  return children;
};

// Helpers non typés
const navigate = useNavigate();
navigate('/dashboard');
```

### Après (RouterV2)
```typescript
// Routes centralisées dans registry
// src/routerV2/registry.ts
{
  name: 'scan',
  path: '/app/scan',
  segment: 'consumer',
  component: 'B2CScanPage',
  guard: true,
}

// Guards automatiques
<AuthGuard><RoleGuard requiredRole="consumer">
  <ScanPage />
</RoleGuard></AuthGuard>

// Helpers typés
import { routes } from '@/lib/routes';
navigate(routes.consumer.scan());
```

---

## 📍 Migration des Routes

### Étape 1 : Identifier les routes existantes

```bash
# Chercher toutes les définitions de routes
grep -r "<Route" src/
grep -r "path=" src/
```

### Étape 2 : Ajouter au registry

Pour chaque route trouvée, ajouter une entrée dans `src/routerV2/registry.ts` :

```typescript
{
  name: 'ma-route',              // Nom unique
  path: '/app/ma-route',         // Chemin complet
  segment: 'consumer',           // 'public' | 'consumer' | 'employee' | 'manager'
  component: 'MaRoutePage',      // Nom du composant
  layout: 'app-sidebar',         // Layout à utiliser
  guard: true,                   // Protection requise?
  role: 'consumer',              // Rôle requis (optionnel)
  aliases: ['/old-route'],       // Anciens chemins (optionnel)
}
```

### Étape 3 : Ajouter les alias si nécessaire

Si l'ancienne route avait un chemin différent, ajouter un alias dans `src/routerV2/aliases.tsx` :

```typescript
export const ROUTE_ALIASES = {
  '/old-path': '/app/new-path',
  '/another-old': '/app/new-path',
};
```

---

## 🔐 Migration des Guards

### Avant
```typescript
// Guard manuel
const ProtectedRoute = ({ children, requireRole }) => {
  const { user, isAuth } = useAuth();
  
  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  
  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/forbidden" />;
  }
  
  return <>{children}</>;
};

// Utilisation
<Route path="/admin" element={
  <ProtectedRoute requireRole="admin">
    <AdminPage />
  </ProtectedRoute>
} />
```

### Après
```typescript
// Guards automatiques via registry
{
  name: 'admin',
  path: '/admin',
  segment: 'manager',
  component: 'AdminPage',
  guard: true,
  role: 'manager',
}

// Ou utilisation manuelle
import { AuthGuard, RoleGuard } from '@/routerV2/guards';

<AuthGuard>
  <RoleGuard requiredRole="manager">
    <AdminPage />
  </RoleGuard>
</AuthGuard>
```

---

## 🔗 Migration des Helpers

### Avant
```typescript
// Chemins hardcodés
navigate('/dashboard');
navigate('/scan');
navigate('/music');

// Ou constantes non typées
const ROUTES = {
  DASHBOARD: '/dashboard',
  SCAN: '/scan',
};
navigate(ROUTES.DASHBOARD);
```

### Après
```typescript
// Helpers typés depuis lib/routes
import { routes } from '@/lib/routes';

navigate(routes.consumer.home());
navigate(routes.consumer.scan());
navigate(routes.consumer.music());

// Avec compatibilité legacy
import { Routes } from '@/routerV2/routes';

navigate(Routes.consumerHome());
navigate(Routes.scan());
```

---

## ✅ Checklist de Migration

### Pour chaque route à migrer :

- [ ] Identifier le chemin actuel et le composant
- [ ] Déterminer le segment (`public`, `consumer`, `employee`, `manager`)
- [ ] Déterminer si la route nécessite authentication/rôle
- [ ] Ajouter l'entrée dans `registry.ts`
- [ ] Si chemin change, ajouter alias dans `aliases.tsx`
- [ ] Remplacer les hardcoded paths par les helpers typés
- [ ] Supprimer les guards manuels si applicable
- [ ] Tester la route (accès, redirections, guards)
- [ ] Mettre à jour la documentation

### Tests à effectuer :

- [ ] La route est accessible
- [ ] Les redirections fonctionnent (alias)
- [ ] Les guards bloquent les accès non autorisés
- [ ] Le layout est correct
- [ ] Les metadata SEO sont présents
- [ ] Le lazy loading fonctionne
- [ ] Pas de régression sur les routes existantes

---

## 🔍 Exemples Complets

### Exemple 1 : Route publique simple

**Avant :**
```typescript
<Route path="/about" element={<AboutPage />} />
```

**Après :**
```typescript
// Dans registry.ts
{
  name: 'about',
  path: '/about',
  segment: 'public',
  component: 'AboutPage',
  layout: 'marketing',
}
```

### Exemple 2 : Route protégée avec rôle

**Avant :**
```typescript
<Route path="/settings" element={
  <ProtectedRoute requireAuth>
    <SettingsPage />
  </ProtectedRoute>
} />
```

**Après :**
```typescript
// Dans registry.ts
{
  name: 'settings',
  path: '/settings/general',
  segment: 'consumer',
  component: 'B2CSettingsPage',
  layout: 'app-sidebar',
  guard: true,
  role: 'consumer',
  aliases: ['/settings'],
}
```

### Exemple 3 : Route avec alias multiples

**Avant :**
```typescript
<Route path="/scan" element={<ScanPage />} />
<Route path="/emotion-scan" element={<Navigate to="/scan" />} />
<Route path="/emotions" element={<Navigate to="/scan" />} />
```

**Après :**
```typescript
// Dans registry.ts
{
  name: 'scan',
  path: '/app/scan',
  segment: 'public',
  component: 'B2CScanPage',
  layout: 'simple',
  guard: false,
  aliases: ['/scan', '/emotion-scan', '/emotions'],
}

// aliases.tsx s'occupe automatiquement des redirections
```

---

## 🐛 Dépannage

### Problème : Route non trouvée (404)

**Cause :** Route pas dans le registry ou chemin incorrect

**Solution :**
1. Vérifier que la route existe dans `registry.ts`
2. Vérifier le chemin exact (avec/sans slash)
3. Vérifier les alias si ancien chemin utilisé

### Problème : Redirection infinie

**Cause :** Boucle dans les alias ou guards mal configurés

**Solution :**
1. Vérifier les alias dans `aliases.tsx` (pas de A→B→A)
2. Vérifier les redirections des guards
3. Vérifier la logique de `AuthGuard` et `RoleGuard`

### Problème : Accès refusé (403)

**Cause :** Guard ou rôle incorrect

**Solution :**
1. Vérifier `segment` et `role` dans registry
2. Vérifier que l'utilisateur a le bon rôle
3. Vérifier `allowedRoles` si multiple rôles possibles

### Problème : Page blanche / composant non chargé

**Cause :** Composant non mappé ou import échoué

**Solution :**
1. Vérifier que le composant existe dans `router.tsx` componentMap
2. Vérifier l'import lazy du composant
3. Vérifier les logs console pour erreurs d'import

### Problème : Layout incorrect

**Cause :** Layout non défini ou incorrect dans registry

**Solution :**
1. Vérifier la propriété `layout` dans registry
2. Layouts disponibles : `'marketing' | 'app' | 'simple' | 'app-sidebar'`
3. Défaut si non spécifié : `'app'`

---

## 📚 Ressources

- [ROUTING.md](./ROUTING.md) - Documentation complète
- [ROUTERV2_SUMMARY.md](./ROUTERV2_SUMMARY.md) - Vue d'ensemble
- [PHASE3_VALIDATION_COMPLETE.md](./PHASE3_VALIDATION_COMPLETE.md) - Validation
- [src/routerV2/registry.ts](../src/routerV2/registry.ts) - Registry source
- [src/routerV2/aliases.tsx](../src/routerV2/aliases.tsx) - Alias source
- [src/lib/routes.ts](../src/lib/routes.ts) - Helpers typés

---

## 🆘 Support

En cas de problème :

1. Consulter cette documentation
2. Vérifier les tests existants dans `src/routerV2/__tests__/`
3. Lancer le script de validation : `node scripts/validate-routerv2.js`
4. Consulter les logs de développement
5. Contacter l'équipe technique

---

**Dernière mise à jour :** 2025-10-04  
**Version :** 1.0.0
