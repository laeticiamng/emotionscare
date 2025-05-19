# Audit Connexion/Inscription & Dashboards B2B

Ce rapport complète l'analyse du module B2B (point 3 du suivi Codex). Il vérifie la structure d'accès pour les collaborateurs et administrateurs, la centralisation des types ainsi que les protections en place.

## Cartographie des routes

Les chemins sont définis de manière typée dans `src/types/navigation.ts` :

```ts
  b2bUser: {
    home: '/b2b/user',
    login: '/b2b/user/login',
    register: '/b2b/user/register',
    dashboard: '/b2b/user/dashboard',
    journal: '/b2b/user/journal',
    scan: '/b2b/user/scan',
    music: '/b2b/user/music',
    coach: '/b2b/user/coach',
    vr: '/b2b/user/vr',
    teams: '/b2b/user/teams',
    settings: '/b2b/user/settings',
    gamification: '/b2b/user/gamification',
    cocon: '/b2b/user/cocon',
    preferences: '/b2b/user/preferences',
    extensions: '/extensions'
  },
  b2bAdmin: {
    home: '/b2b/admin',
    login: '/b2b/admin/login',
    dashboard: '/b2b/admin/dashboard',
    journal: '/b2b/admin/journal',
    scan: '/b2b/admin/scan',
    music: '/b2b/admin/music',
    coach: '/b2b/admin/coach',
    vr: '/b2b/admin/vr',
    teams: '/b2b/admin/teams',
    reports: '/b2b/admin/reports',
    events: '/b2b/admin/events',
    settings: '/b2b/admin/settings',
    optimisation: '/b2b/admin/optimisation',
    extensions: '/extensions'
  }
```

## Protection par rôles

Le composant `ProtectedRoute` bloque l'accès lorsque le rôle ne correspond pas :

```tsx
  if (requiredRole && user?.role) {
    const normalizedUserRole = normalizeUserMode(user.role);
    const normalizedRequiredRole = normalizeUserMode(requiredRole);

    if (normalizedUserRole !== normalizedRequiredRole) {
      const userDashboardPath = normalizedUserRole === 'b2b_admin'
        ? '/b2b/admin/dashboard'
        : normalizedUserRole === 'b2b_user'
          ? '/b2b/user/dashboard'
          : '/b2c/dashboard';

      return <Navigate to={redirectTo || userDashboardPath} />;
    }
  }
```

Chaque zone `/b2b/user/*` ou `/b2b/admin/*` est déclarée dans `src/router/index.tsx` sous cette protection.

## Contexte d'authentification

`AuthContext` expose l'objet utilisateur et son rôle dès la connexion :

```tsx
const userData: User = {
  id: session.user.id,
  email: session.user.email || '',
  name: profileData?.name || session.user.user_metadata?.name || '',
  role: (profileData?.role || session.user.user_metadata?.role || 'b2c') as UserRole,
  created_at: session.user.created_at,
  preferences: {
    theme: 'system',
    language: 'fr',
    ...(profileData?.preferences || session.user.user_metadata?.preferences || {}),
  }
};
```

Le `UserModeContext` conserve en parallèle le mode sélectionné (`b2b_user` ou `b2b_admin`) pour restaurer l'expérience lors du retour sur le site.

## Redirection après connexion

Les pages de login contrôlent le rôle renvoyé par Supabase. Exemple pour l'admin :

```tsx
const user = await login(email, password);

if (user && user.role !== 'b2b_admin') {
  toast({
    title: 'Accès refusé',
    description: "Ce compte n'a pas les permissions nécessaires pour accéder à l'espace d'administration.",
    variant: 'destructive'
  });
  return;
}

setTimeout(() => navigate('/b2b/admin/dashboard'), 800);
```

Un comportement identique existe côté collaborateur.

## Tests et améliorations recommandées

- Ajouter des tests unitaires pour `ProtectedRoute` et `AuthContext`.
- Couvrir le parcours sélection → login → dashboard en end‑to‑end.
- Préparer un provider global de logs (type `AdminAccessLog`) pour tracer chaque tentative d'accès.
- Générer dynamiquement le mapping rôle ↔ route afin de faciliter l'ajout de futurs rôles.
- Prévoir la compatibilité SSO / OAuth en séparant la logique d'authentification dans un service dédié.

```mermaid
flowchart TD
    A[Selection B2B] --> B[Login User/Admin]
    B --> C{ProtectedRoute}
    C -->|b2b_user| D[/b2b/user/dashboard]
    C -->|b2b_admin| E[/b2b/admin/dashboard]
```

## Conclusion

La séparation des rôles est correctement appliquée. Les types centralisés et les hooks de redirection garantissent un flux cohérent. Les améliorations premium portent surtout sur la journalisation des accès, la génération dynamique des routes protégées et la préparation au SSO.
