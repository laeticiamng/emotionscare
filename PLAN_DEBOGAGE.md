# 🔧 PLAN DE DÉBOGAGE SYSTÉMATIQUE

## Phase 1: ISOLATION DU PROBLÈME ✅

### Fichiers créés:
1. ✅ `src/main.test.tsx` - Test React pur
2. ✅ `src/main.reboot.tsx` - Application minimale fonctionnelle
3. ✅ `index.test.html` - HTML pour test React
4. ✅ `index.reboot.html` - HTML pour application minimale
5. ✅ `src/routerV2/router.minimal.tsx` - Router test
6. ✅ `RAPPORT_AUDIT_BLOCAGE.md` - Documentation du problème

### Tests à effectuer:

#### Test 1: React pur (main.test.tsx)
**Objectif:** Vérifier que React se charge
```
Si ✅: React fonctionne → problème dans les providers/router
Si ❌: React ne fonctionne pas → problème Vite/build
```

#### Test 2: Application minimale (main.reboot.tsx)
**Objectif:** Vérifier qu'une app React-Router-Query fonctionne
```
Si ✅: Infrastructure OK → problème dans le code métier
Si ❌: Problème dans les dépendances de base
```

---

## Phase 2: RECONSTRUCTION PROGRESSIVE

### Si Test 2 ✅ (app minimale fonctionne)

#### Étape 2.1: Ajouter AuthProvider
```tsx
// Dans main.reboot.tsx
import { AuthProvider } from '@/contexts/AuthContext';

<AuthProvider>
  <QueryClientProvider>
    ...
  </QueryClientProvider>
</AuthProvider>
```
**Test:** Si ça casse → problème dans AuthContext

#### Étape 2.2: Ajouter UserModeProvider
```tsx
<AuthProvider>
  <UserModeProvider>
    ...
  </UserModeProvider>
</AuthProvider>
```
**Test:** Si ça casse → problème dans UserModeContext

#### Étape 2.3: Ajouter I18nProvider (version simplifiée)
```tsx
<I18nProvider>
  ...
</I18nProvider>
```
**Test:** Si ça casse → problème dans I18n

#### Étape 2.4: Ajouter ErrorBoundary et HelmetProvider
```tsx
<HelmetProvider>
  <ErrorBoundary>
    ...
  </ErrorBoundary>
</HelmetProvider>
```

#### Étape 2.5: Intégrer router original avec lazy imports
```tsx
import { router } from '@/routerV2/router';
<RouterProvider router={router} />
```
**Test:** Si ça casse → problème dans les lazy imports des pages

---

## Phase 3: CORRECTION CIBLÉE

### Une fois le provider/composant problématique identifié:

#### Si c'est un Provider:
1. Réé crire le provider from scratch
2. Supprimer toutes les dépendances inutiles
3. Tester progressivement

#### Si c'est un lazy import:
1. Identifier la page qui casse
2. Vérifier les imports de cette page
3. Corriger les imports circulaires

#### Si c'est I18n:
1. Utiliser version ultra-simple sans Zustand
2. Charger les traductions de façon synchrone
3. Pas de localStorage au démarrage

---

## Phase 4: VALIDATION COMPLÈTE

### Checklist finale:
- [ ] Home page s'affiche
- [ ] Login page s'affiche
- [ ] Dashboard s'affiche
- [ ] Navigation fonctionne
- [ ] Aucune erreur console
- [ ] Aucune erreur réseau
- [ ] Providers tous actifs
- [ ] Router complet actif
- [ ] Lazy loading fonctionne

---

## 🎯 OBJECTIF IMMÉDIAT

**FAIRE FONCTIONNER `main.reboot.tsx`**

Si on a une page qui s'affiche avec ce fichier, on sait que:
- ✅ React OK
- ✅ Vite OK
- ✅ Router OK
- ✅ QueryClient OK
- ✅ Tailwind OK

Ensuite on reconstruit couche par couche.

---

## 📊 MÉTRIQUES DE SUCCÈS

- **Phase 1:** Une page s'affiche = 25%
- **Phase 2:** Providers ajoutés = 50%
- **Phase 3:** Router complet = 75%
- **Phase 4:** Application complète = 100%

---

## 🚀 PROCHAINE ACTION

**TESTER `main.reboot.tsx` EN REMPLAÇANT L'IMPORT DANS `index.html`**

Ou créer un script de test qui lance Vite avec index.reboot.html
