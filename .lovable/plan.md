

# Analyse Complète du Repo EmotionsCare — Rapport & Plan

## Etat actuel (chiffres)

```text
Pages         : 347 fichiers .tsx
Composants    : 1 960
Hooks         : 626
Modules       : 48 (src/modules/)
Features      : 37 (src/features/)
Edge Functions: 273 (8 super-routers + spécialisées)
Tables DB     : 1 051
Tests         : 417 fichiers
i18n          : 87 clés FR/EN
3D components : 14
```

---

## Ce qui manque / est incomplet

### A. Pages placeholder / stub (contenu vide ou < 20 lignes)

| Page | Problème |
|------|----------|
| `ComprehensiveSystemAuditPage` (6 lignes) | Squelette vide |
| `SystemHealthPage` (17 lignes) | Squelette minimal |
| `ValidationPage` (12 lignes) | Redirect uniquement |
| `admin/UserRolesPage` (12 lignes) | Squelette vide |
| `b2b/user/LoginPage` (15 lignes) | Formulaire minimal |
| `b2b/user/RegisterPage` (11 lignes) | Formulaire minimal |

### B. 21 pages en mode "Demo" (DemoBanner / données mockées)

Ces pages affichent un bandeau "Mode démonstration" et utilisent des données statiques au lieu de données Supabase :

- **Social** : `MessagesPage` (chat IA fake, pas de vrai messaging)
- **B2C** : `BubbleBeatPage`, `ActivitePage`, `VoiceJournalPage`, `WeeklyBarsPage`, `DataPrivacyPage`
- **Gamification** : `AchievementsPage`
- **B2B/Admin** : `PlatformAuditPage`, `GDPRDashboard`, `APIMonitoring`, `Accessibility`, `Optimization`, `Reports`, `Security`
- **Assess** : `BurnoutAssessmentPage`
- **Autres** : `RecommendationEngineAdmin`, `SupportChatbot`, `WeeklyReport`, `InstitutionalReport`, `InterventionsLibrary`, `ResearchExport`

### C. 4 modules stub (index < 10 lignes, pas de vrai contenu)

| Module | Lignes index | Statut |
|--------|-------------|--------|
| `buddies` | 9 | Structure OK (hooks/components/services) mais index stub |
| `group-sessions` | 9 | Idem |
| `insights` | 8 | Service existe mais index stub |
| `bubble-beat` | 9 | Composants existent mais index stub |

### D. Fonctionnalités manquantes identifiées

1. **Notifications en temps réel** — `NotificationsCenterPage` utilise des données statiques hardcodées (4 notifs fictives). Pas de connexion Supabase Realtime.

2. **Messagerie sociale** — `MessagesPage` est un faux chat IA avec réponses aléatoires. Pas de vrai système de messages entre utilisateurs.

3. **Système d'amis/buddies** — Le module existe structurellement mais les hooks importés dans `BuddiesPage` (`useBuddies`, `useBuddyChat`, etc.) ne sont pas connectés à des données réelles.

4. **Sessions de groupe** — Module structuré mais stub.

5. **Stripe Checkout** — Les edge functions existent (`create-checkout`, `stripe-webhook`, `customer-portal`, `check-subscription`) mais la page `PremiumPage` redirige vers `/pricing` qui pointe vers `PricingPageWorking` — à vérifier si le checkout Stripe est fonctionnel de bout en bout.

6. **Export CSV fonctionnel** — `ExportCSVPage` affiche l'UI mais pas de logique d'export réelle.

7. **Partage de données** — `ShareDataPage` affiche l'UI mais pas de logique de partage.

8. **Rapport hebdomadaire** — Mode démo uniquement.

---

## Plan d'implémentation

Vu l'ampleur (98 pages avec placeholder, 21 en mode démo, 4 modules stub), je propose de prioriser les corrections à **impact utilisateur immédiat** :

### Phase 1 — Corriger les 4 modules stub (exports manquants)
- Compléter les `index.ts` de `buddies`, `group-sessions`, `insights`, `bubble-beat` pour exporter correctement leurs composants, hooks et types existants.

### Phase 2 — Connecter les notifications au réel
- Brancher `NotificationsCenterPage` sur le hook `useNotifications` existant (271 lignes) au lieu des données statiques.

### Phase 3 — Rendre l'export CSV fonctionnel
- Ajouter la logique de téléchargement dans `ExportCSVPage` (générer CSV depuis les données Supabase de l'utilisateur).

### Phase 4 — Compléter les pages admin stub
- `UserRolesPage` : interface de gestion des rôles utilisateur
- `SystemHealthPage` : dashboard de santé système

### Phase 5 — Remplacer les DemoBanner par des données réelles
- Prioriser : `AchievementsPage`, `ActivitePage`, `WeeklyBarsPage` (B2C visible)
- Puis : les pages admin/manager

### Détails techniques

**Fichiers modifiés (Phase 1)** :
- `src/modules/buddies/index.ts` — re-export hooks, components, types
- `src/modules/group-sessions/index.ts` — idem
- `src/modules/insights/index.ts` — export `useInsights`, `insightsService`, types
- `src/modules/bubble-beat/index.ts` — export composants et hooks

**Fichiers modifiés (Phase 2)** :
- `src/pages/NotificationsCenterPage.tsx` — remplacer `useState([...])` statique par `useNotifications()`

**Fichiers modifiés (Phase 3)** :
- `src/pages/ExportCSVPage.tsx` — ajouter logique de fetch + conversion CSV + download

**Fichiers modifiés (Phase 4)** :
- `src/pages/admin/UserRolesPage.tsx` — interface CRUD rôles
- `src/pages/SystemHealthPage.tsx` — métriques système

**Scope estimé** : ~15 fichiers modifiés, aucune migration DB nécessaire (les tables existent déjà).

