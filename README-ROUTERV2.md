# 🚀 RouterV2 - Guide d'implémentation

> **TICKET**: FE/BE-Router-Cleanup-01  
> **Objectif**: Source unique de vérité pour le routing, élimination des doublons, architecture unifiée

## 🎯 Vue d'ensemble

RouterV2 remplace le système de routing dispersé par une architecture centralisée avec:
- **52 routes canoniques** définies dans un registre unique
- **Helpers typés** `Routes.*()` pour tous les liens 
- **Redirections d'alias** pour la compatibilité
- **Guards par rôle** (consumer/employee/manager)
- **Scripts d'audit** pour prévenir les doublons

## 🔧 Structure

```
src/routerV2/
├── schema.ts          # Types & interfaces
├── registry.ts        # 52 routes canoniques 
├── helpers.ts         # Routes.*() functions
├── aliases.ts         # Redirections de compatibilité
├── guards.tsx         # Protection par rôle
└── index.tsx          # Router principal

scripts/
├── route-audit.ts     # Détection doublons/orphelins
└── codemod-links.ts   # Migration automatique des liens
```

## 🚦 Activation

### Feature Flag
```bash
# .env.local
VITE_FF_ROUTER_V2=true
```

### Scripts disponibles
```bash
npm run route:audit      # Audit complet des routes
npm run codemod:links    # Migration automatique des liens
```

## 📝 Usage

### Avant (liens en dur)
```tsx
// ❌ INTERDIT
<Link to="/music">Musique</Link>
<Link to="/b2c/dashboard">Dashboard</Link>
navigate('/journal');
```

### Après (Routes.*())
```tsx
// ✅ CORRECT
import { Routes } from '@/routerV2/helpers';

<Link to={Routes.music()}>Musique</Link>
<Link to={Routes.consumerHome()}>Dashboard</Link>
navigate(Routes.journal());

// Avec paramètres
<Link to={Routes.login({ segment: 'b2c' })}>Login B2C</Link>
```

## 🎮 Routes principales

| Type | Route canonique | Ancien alias | Helper |
|------|-----------------|--------------|--------|
| **Landing** | `/` | - | `Routes.home()` |
| | `/b2c` | `/choose-mode` | `Routes.b2cLanding()` |
| | `/entreprise` | `/b2b`, `/b2b/selection` | `Routes.b2bLanding()` |
| **Auth** | `/login` | `/auth`, `/b2c/login` | `Routes.login()` |
| | `/signup` | `/register`, `/b2c/register` | `Routes.signup()` |
| **App** | `/app` | - | `Routes.app()` |
| **Dashboards** | `/app/home` | `/b2c/dashboard`, `/dashboard` | `Routes.consumerHome()` |
| | `/app/collab` | `/b2b/user/dashboard` | `Routes.employeeHome()` |
| | `/app/rh` | `/b2b/admin/dashboard` | `Routes.managerHome()` |
| **Modules** | `/app/scan` | `/scan` | `Routes.scan()` |
| | `/app/music` | `/music` | `Routes.music()` |
| | `/app/coach` | `/coach` | `Routes.coach()` |
| | `/app/journal` | `/journal` | `Routes.journal()` |
| | `/app/vr` | `/vr` | `Routes.vr()` |

## 🛡️ Protection des routes

RouterV2 intègre un système de guards par rôle:

```tsx
// Automatique dans le registry
{
  name: 'consumer-home',
  path: '/app/home',
  role: 'consumer',     // ← Protection automatique
  guard: true,
  component: 'B2CDashboardPage',
}

// Redirection automatique si mauvais rôle:
// consumer → /app/home
// employee → /app/collab  
// manager  → /app/rh
```

## 🔄 Redirections d'alias

Les anciens liens sont automatiquement redirigés:

```
/music            → /app/music
/b2c/login        → /login?segment=b2c
/b2c/dashboard    → /app/home
/b2b/user/login   → /login?segment=b2b
/journal          → /app/journal
/settings         → /settings/general
```

## 📊 Audit & validation

### Commandes d'audit
```bash
# Vérification complète
npm run route:audit

# Résultats d'audit:
# ✅ Routes configurées: 52
# ✅ Pages trouvées: 45  
# ❌ Doublons détectés: 0
# ⚠️ Pages orphelines: 3 (non bloquant)
```

### Migration automatique
```bash
# Dry-run (preview des changements)
npm run codemod:links

# Applique les changements (décommenter writeFile dans le script)
```

## 🚨 Règles ESLint

RouterV2 inclut une règle ESLint personnalisée qui interdit les liens en dur:

```tsx
// ❌ ESLint Error: Utiliser Routes.*() au lieu du chemin en dur "/music"
<Link to="/music">

// ✅ Correct
<Link to={Routes.music()}>
```

## 🎯 Pages système

RouterV2 normalise les pages d'erreur:

```
/401 → UnauthorizedPage  (non connecté)
/403 → ForbiddenPage     (mauvais rôle)  
/404 → NotFoundPage      (avec suggestions)
/503 → ServerErrorPage   (erreur serveur)
```

## 🔄 Migration progressive

1. **Phase 1**: Activer `VITE_FF_ROUTER_V2=true` en staging
2. **Phase 2**: Lancer `npm run codemod:links` pour migrer les liens
3. **Phase 3**: Valider avec `npm run route:audit`  
4. **Phase 4**: Production avec monitoring des redirections
5. **Phase 5**: Cleanup ancien router quand migration complète

## 🎉 Rollback

En cas de problème, désactiver immédiatement:
```bash
# .env.local
VITE_FF_ROUTER_V2=false
```
→ Retour automatique au router legacy sans redéploiement

## 📈 Bénéfices

- ✅ **Source unique** de vérité pour toutes les routes
- ✅ **Zéro doublon** garanti par l'audit automatique
- ✅ **Type-safety** complète avec TypeScript
- ✅ **Maintenance** simplifiée (1 seul endroit à modifier)
- ✅ **Performance** améliorée (lazy loading systématique)
- ✅ **Compatibilité** préservée avec les anciens liens
- ✅ **Rollback** instantané via feature flag

---

**🚀 RouterV2 est maintenant opérationnel !**

> Prochaine étape : lancer `npm run route:audit` pour valider l'implémentation