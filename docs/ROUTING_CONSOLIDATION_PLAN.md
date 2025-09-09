# 🔧 PLAN DE CONSOLIDATION - Routage EmotionsCare

## ÉTAPE 1 : Activation RouterV2 (CRITIQUE)

### Remplacement App.tsx
- Supprimer le Router React basique
- Activer RouterV2 avec routerV2 importé
- Tester que les routes de base fonctionnent

### Code à modifier :
```tsx
// AVANT (App.tsx actuel)
<Routes>
  <Route path="/" element={<HomePage />} />
  // ... routes basiques
</Routes>

// APRÈS (RouterV2)
import { routerV2 } from './routerV2';
<RouterProvider router={routerV2} />
```

## ÉTAPE 2 : Mapping Pages Existantes

### Pages à connecter au registry :
- ✅ HomePage → déjà mappé
- ✅ DashboardPage → mapper vers B2CDashboardPage
- ✅ JournalPage → mapper vers B2CJournalPage
- ✅ MusicPage → mapper vers B2CMusicEnhanced
- ✅ EmotionsPage → rediriger vers /app/scan
- ⚠️ MessagesPage → créer route /messages
- ⚠️ CalendarPage → créer route /calendar
- ⚠️ Point20Page → créer route /point20

## ÉTAPE 3 : Création Pages Manquantes

### Pages critiques à créer :
```
src/pages/
├── auth/
│   ├── LoginPage.tsx (existe mais à améliorer)
│   └── SignupPage.tsx (existe mais à améliorer)
├── public/
│   ├── B2CPage.tsx (page présentation B2C)
│   └── EntreprisePage.tsx (page présentation B2B)
├── legal/
│   ├── TermsPage.tsx
│   ├── PrivacyPage.tsx
│   └── LegalPage.tsx
└── redirects/
    ├── AppDispatcher.tsx (dispatcher /app)
    └── RoleRedirect.tsx
```

## ÉTAPE 4 : Configuration Guards & Rôles

### Système à activer :
- AuthGuard (déjà défini dans guards.tsx)
- RoleGuard pour consumer/employee/manager
- Redirections automatiques selon rôle

### Routes à protéger :
- `/app/*` → RequireAuth
- `/app/home` → Role: consumer
- `/app/collab` → Role: employee  
- `/app/rh` → Role: manager

## ÉTAPE 5 : Nettoyage & Optimisation

### Suppressions :
- Ancien Router dans App.tsx
- Routes en doublon
- Imports obsolètes

### Ajouts :
- Pages d'erreur appropriées (401, 403, 500)
- Redirections gracieuses
- Loading states

## VALIDATION

### Tests à effectuer :
- [ ] Toutes les routes du registry s'affichent
- [ ] Guards de rôles fonctionnels
- [ ] Redirections appropriées
- [ ] Pages d'erreur
- [ ] Aucun lien mort
- [ ] Performance (lazy loading)

## ORDRE D'EXÉCUTION

1. **Backup** : Sauvegarder App.tsx actuel
2. **RouterV2** : Activer le routerV2 
3. **Test critique** : Vérifier routes principales
4. **Mapping** : Connecter pages existantes
5. **Création** : Ajouter pages manquantes
6. **Guards** : Activer protection rôles
7. **Nettoyage** : Supprimer ancien code
8. **Test complet** : Validation finale

## RISQUES IDENTIFIÉS

- **Navigation cassée** temporairement
- **Liens morts** pendant transition
- **Conflits d'authentification** 
- **Performance** (trop de lazy imports)

## MITIGATION

- Garder fallbacks 404
- Tester étape par étape
- Redirections temporaires
- Monitoring erreurs console