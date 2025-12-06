# 📋 Plan d'Action Complet - EmotionsCare Platform

## 🎯 Objectif
Auditer, vérifier, compléter et corriger l'ensemble de la plateforme EmotionsCare en suivant la méthodologie senior en 8 étapes.

---

## 📊 Phase 0 : État des lieux (Fait ✅)

### Audits réalisés
- ✅ Audit routes 404 → 0 erreurs critiques
- ✅ Audit complétude pages → 15 routes dépréciées identifiées
- ✅ Vérification routes 1 à 1 → Registry validé
- ✅ Architecture Route → Page → Module documentée

### Outils disponibles
- ✅ `scripts/audit-routes-404.ts`
- ✅ `scripts/audit-pages-completeness.ts`
- ✅ `scripts/verify-all-routes-pages.ts`
- ✅ `scripts/validate-architecture.ts`

---

## 🗺️ Plan en 8 Phases

### **Phase 1 : AUDIT GLOBAL** 🔍 (Semaine 1)

#### 1.1 Audit Architecture
```bash
npx tsx scripts/validate-architecture.ts
```

**Objectifs :**
- [ ] Identifier toutes les couleurs hardcodées
- [ ] Détecter les console.log non supprimés
- [ ] Trouver les types `any`
- [ ] Vérifier data-testid="page-root" sur toutes les pages
- [ ] Valider le SEO (title, meta) sur toutes les pages

#### 1.2 Audit Modules
**Modules à auditer :**

| Module | Statut actuel | Action requise |
|--------|---------------|----------------|
| **auth** | Stable | Validation RLS + tests |
| **scan** | Stable | Validation complète |
| **music** | Stable | Tests e2e manquants |
| **journal** | Stable | Refacto UI/UX |
| **predictive** | Stable | Analytics optimisation |
| **social** | Bêta | Finalisation + tests |
| **coach** | ⚠️ Partiel | Pages à compléter |
| **meditation** | ⚠️ Nouveau | Enrichissement contenu |
| **vr** | Planifié | Développement complet |
| **profile** | ⚠️ Nouveau | Enrichissement contenu |

#### 1.3 Audit Base de données
```bash
# Vérifier RLS policies
npm run supabase:check-rls

# Linter Supabase
npx supabase db lint
```

**Tables à auditer :**
- [ ] `profiles` → RLS policies
- [ ] `scan_*` → Permissions consumer
- [ ] `music_*` → Quotas et limites
- [ ] `journal_entries` → Encryption des données sensibles
- [ ] `coach_sessions` → RLS + timestamps
- [ ] `meditation_sessions` → Nouvelles policies
- [ ] `org_*` → Permissions B2B managers
- [ ] `team_*` → Analytics sécurisés

---

### **Phase 2 : DESIGN SYSTEM** 🎨 (Semaine 2)

#### 2.1 Tokens unifiés
**Fichiers à réviser :**
- [ ] `src/index.css` → Variables CSS cohérentes
- [ ] `tailwind.config.ts` → Tokens HSL uniquement
- [ ] Supprimer toutes les couleurs RGB

#### 2.2 Composants shadcn
**Composants à vérifier/customiser :**
- [ ] `Button` → Variants (primary, secondary, ghost, etc.)
- [ ] `Card` → Variants selon contexte (scan, music, journal)
- [ ] `Dialog` → Animations cohérentes
- [ ] `Tabs` → Style uniforme
- [ ] `Select` → Accessibilité
- [ ] `Toast` → Messages d'erreur standardisés

#### 2.3 Audit couleurs hardcodées
```bash
# Rechercher toutes les couleurs directes
grep -r "bg-\(blue\|red\|green\|white\|black\)" src/ | grep -v node_modules
```

**Action :** Remplacer par tokens design system

---

### **Phase 3 : ROUTES & NAVIGATION** 🗺️ (Semaine 3)

#### 3.1 Registry complet
**Routes à valider :**

##### Public (Marketing)
- [x] `/` → HomePage
- [x] `/b2c` → B2C Landing
- [x] `/b2b` → B2B Landing
- [x] `/about` → About
- [x] `/contact` → Contact
- [x] `/pricing` → Pricing
- [ ] `/demo` → Page démo interactive (À créer)

##### Auth
- [x] `/login` → Login
- [x] `/signup` → Signup
- [x] `/b2c/login` → B2C Login
- [x] `/b2b/user/login` → B2B User Login
- [x] `/b2b/admin/login` → B2B Admin Login

##### Consumer (B2C)
- [x] `/app/home` → Consumer Home
- [x] `/app/scan` → Scan émotionnel
- [x] `/app/music` → Thérapie musicale
- [x] `/app/journal` → Journal émotionnel
- [x] `/app/coach` → Coach IA
- [ ] `/app/coach/programs` → À enrichir ⚠️
- [ ] `/app/coach/sessions` → À enrichir ⚠️
- [ ] `/app/meditation` → À enrichir ⚠️
- [ ] `/app/profile` → À enrichir ⚠️
- [x] `/app/settings` → Paramètres
- [ ] `/app/vr` → VR (À développer)
- [ ] `/app/vr/galaxy` → VR Galaxy (À développer)
- [ ] `/app/vr/breath` → VR Breath (À développer)

##### B2B Employee
- [x] `/app/collab` → Employee Dashboard
- [x] `/app/teams` → Équipes
- [ ] `/app/reports` → Rapports (À vérifier)

##### B2B Manager
- [x] `/app/rh` → Manager Dashboard
- [x] `/app/analytics` → Analytics RH
- [ ] `/app/security` → Sécurité (À vérifier)
- [ ] `/app/optimization` → Optimisation (À vérifier)

#### 3.2 Alias et redirections
**Vérifier :**
- [ ] Tous les anciens chemins redirigent correctement
- [ ] Pas de redirections en boucle
- [ ] Query params préservés
- [ ] Hash fragments préservés

#### 3.3 Guards et permissions
**Tester :**
- [ ] Auth guard → Redirige vers login si non authentifié
- [ ] Role guard → 403 si mauvais rôle
- [ ] Feature flags → Bloque si flag désactivé

---

### **Phase 4 : MODULES MÉTIER** 🧩 (Semaines 4-6)

#### 4.1 Module Auth ✅
**Statut :** Stable
**Actions :**
- [ ] Tests e2e complets (login, signup, logout)
- [ ] Validation des erreurs
- [ ] OAuth Google/LinkedIn

#### 4.2 Module Scan ⚠️
**Statut :** Stable, tests à compléter
**Actions :**
- [ ] Tests unitaires scan-face
- [ ] Tests unitaires scan-voice
- [ ] Tests unitaires scan-text
- [ ] Validation des quotas
- [ ] Optimisation performances

#### 4.3 Module Music 🎵
**Statut :** Stable, features premium à finaliser
**Actions :**
- [ ] Tests player audio
- [ ] Tests génération adaptative
- [ ] Validation quotas premium
- [ ] Intégration Spotify/Apple Music
- [ ] Playlists recommandées

#### 4.4 Module Journal 📓
**Statut :** Stable, UI/UX à améliorer
**Actions :**
- [ ] Refacto composants (trop verbeux)
- [ ] Tests CRUD entries
- [ ] Visualisations émotionnelles
- [ ] Export PDF/CSV
- [ ] Recherche et filtres

#### 4.5 Module Coach 🤖
**Statut :** Partiel, pages à compléter
**Actions :**
- [ ] Enrichir `/app/coach/programs`
  - Liste des programmes disponibles
  - Détails de chaque programme
  - Progression utilisateur
- [ ] Enrichir `/app/coach/sessions`
  - Historique des sessions
  - Nouvelle session
  - Analytics de progression
- [ ] Enrichir `/app/coach/micro`
  - Micro-sessions quotidiennes
  - Challenges hebdomadaires
- [ ] Tests chatbot IA
- [ ] Intégration Lovable AI Gateway
- [ ] Personnalisation recommandations

#### 4.6 Module Meditation 🧘
**Statut :** Nouveau, à enrichir
**Actions :**
- [ ] Créer composants séances guidées
- [ ] Timer et ambiances sonores
- [ ] Tracking progression
- [ ] Programmes méditation (7, 14, 30 jours)
- [ ] Tests complets

#### 4.7 Module Profile 👤
**Statut :** Nouveau, à enrichir
**Actions :**
- [ ] Formulaire édition profil
- [ ] Upload photo de profil
- [ ] Préférences utilisateur
- [ ] Historique d'activité
- [ ] Gamification (badges, streaks)
- [ ] Tests complets

#### 4.8 Module VR 🥽
**Statut :** Planifié, développement complet
**Actions :**
- [ ] Créer page `/app/vr`
- [ ] Scène Galaxy immersive
- [ ] Scène Breath relaxation
- [ ] Intégration React Three Fiber
- [ ] Détection casque VR
- [ ] Tests VR (complexe)

#### 4.9 Module Social 🌐
**Statut :** Bêta, finalisation
**Actions :**
- [ ] Tests communauté (posts, likes, comments)
- [ ] Modération contenu
- [ ] Notifications temps réel
- [ ] Messagerie privée
- [ ] Groupes thématiques

#### 4.10 Module Predictive 📊
**Statut :** Stable, optimisation
**Actions :**
- [ ] Validation modèles ML
- [ ] Tests prédictions
- [ ] Dashboard insights
- [ ] Alertes proactives
- [ ] Export rapports

---

### **Phase 5 : TESTS & QUALITÉ** ✅ (Semaine 7)

#### 5.1 Tests unitaires
**Objectif :** Coverage ≥ 90%

**Modules prioritaires :**
```bash
# Scanner coverage actuel
npm run test -- --coverage

# Identifier les fichiers non testés
npm run test:coverage-report
```

**À tester :**
- [ ] `src/hooks/` → Tous les hooks
- [ ] `src/lib/` → Utilitaires
- [ ] `src/services/` → API calls
- [ ] `src/modules/*/hooks/` → Hooks métier
- [ ] `src/modules/*/components/` → Composants UI

#### 5.2 Tests e2e
**Parcours critiques :**
- [ ] Auth : Login → Home → Logout
- [ ] Scan : Home → Scan → Résultats → Musique recommandée
- [ ] Music : Library → Play → Contrôles player
- [ ] Journal : Liste → Nouvelle entrée → Édition → Suppression
- [ ] Coach : Home → Programme → Session → Complétion
- [ ] B2B : Login manager → Dashboard → Analytics → Export

#### 5.3 Accessibilité
**Outils :**
```bash
# Auditer avec axe-core
npx @axe-core/cli http://localhost:8080 --exit
```

**Critères WCAG AA :**
- [ ] Navigation clavier complète
- [ ] Lecteurs d'écran (NVDA, JAWS)
- [ ] Contraste couleurs ≥ 4.5:1
- [ ] ARIA labels corrects
- [ ] Focus visible

#### 5.4 Performance
**Web Vitals :**
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

**Bundle size :**
```bash
npm run build
npm run analyze
```
**Objectif :** < 500kb (gzipped)

---

### **Phase 6 : SÉCURITÉ & RGPD** 🔒 (Semaine 8)

#### 6.1 RLS Policies Supabase
**Tables critiques :**
```sql
-- Vérifier toutes les policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

**À valider :**
- [ ] `profiles` → User ne peut voir que son profil
- [ ] `scan_*` → User ne peut voir que ses scans
- [ ] `journal_entries` → Privé par défaut
- [ ] `music_generations` → Quotas respectés
- [ ] `org_memberships` → Managers uniquement
- [ ] `team_emotion_summary` → Managers de l'org

#### 6.2 Encryption données sensibles
- [ ] Journal entries → Chiffrement côté client
- [ ] Messages privés → E2E encryption
- [ ] Health data → HIPAA compliant

#### 6.3 RGPD
- [ ] Consentement cookies
- [ ] Export données utilisateur
- [ ] Suppression compte + données
- [ ] Politique de confidentialité
- [ ] Mentions légales

#### 6.4 Audit de sécurité
```bash
npm audit
npm audit fix
```

---

### **Phase 7 : DOCUMENTATION** 📚 (Semaine 9)

#### 7.1 Documentation technique
**Fichiers à mettre à jour :**
- [ ] `docs/MODULES_LISTING.md` → Tous les modules
- [ ] `docs/PAGES_LISTING.md` → Toutes les pages
- [ ] `docs/ROUTING.md` → Routes complètes
- [ ] `docs/module-registry.md` → Statuts à jour
- [ ] `docs/API.md` → Endpoints Supabase
- [ ] `docs/DEPLOYMENT.md` → Process de déploiement

#### 7.2 Documentation utilisateur
- [ ] Guide démarrage rapide
- [ ] Tutoriels vidéo (consumer)
- [ ] Guide admin B2B
- [ ] FAQ
- [ ] Changelog

#### 7.3 Code documentation
**JSDoc sur :**
- [ ] Hooks publics
- [ ] Fonctions utilitaires
- [ ] Services API
- [ ] Composants complexes

---

### **Phase 8 : OPTIMISATION & MONITORING** 🚀 (Semaine 10)

#### 8.1 Optimisations performances
**Actions :**
- [ ] Lazy loading toutes les routes
- [ ] Image optimization (AVIF/WebP)
- [ ] Code splitting agressif
- [ ] React Query cache optimisé
- [ ] Service Worker (PWA)

#### 8.2 Monitoring production
**Outils :**
- [ ] Sentry → Erreurs frontend
- [ ] Supabase Analytics → Requêtes DB
- [ ] Vercel Analytics → Web Vitals
- [ ] LogRocket → Session replay

#### 8.3 CI/CD
**GitHub Actions :**
```yaml
# .github/workflows/ci.yml
- Lint
- Tests unitaires
- Tests e2e
- Build
- Audit sécurité
- Déploiement staging
- Déploiement production (si tag)
```

#### 8.4 Observabilité
- [ ] Dashboards Grafana
- [ ] Alertes critiques (Slack/Email)
- [ ] Logs centralisés
- [ ] Tracing distribué

---

## 📊 Métriques de succès

### Qualité Code
| Métrique | Cible | Actuel | Statut |
|----------|-------|--------|--------|
| Test Coverage | ≥ 90% | ? | 🔍 À mesurer |
| TypeScript strict | 100% | ? | 🔍 À mesurer |
| ESLint errors | 0 | ? | 🔍 À mesurer |
| Bundle size | < 500kb | ? | 🔍 À mesurer |

### Performance
| Métrique | Cible | Actuel | Statut |
|----------|-------|--------|--------|
| LCP | < 2.5s | ? | 🔍 À mesurer |
| FID | < 100ms | ? | 🔍 À mesurer |
| CLS | < 0.1 | ? | 🔍 À mesurer |
| Lighthouse | ≥ 90 | ? | 🔍 À mesurer |

### Sécurité
| Métrique | Cible | Actuel | Statut |
|----------|-------|--------|--------|
| RLS policies | 100% | ? | 🔍 À mesurer |
| Audit npm | 0 vulns | ? | 🔍 À mesurer |
| RGPD compliant | Oui | ? | 🔍 À mesurer |

### Fonctionnalités
| Module | Pages | Tests | Statut |
|--------|-------|-------|--------|
| Auth | 5/5 | ⚠️ | Stable |
| Scan | 3/3 | ⚠️ | Stable |
| Music | 3/3 | ❌ | Stable |
| Journal | 2/2 | ⚠️ | Stable |
| Coach | 2/4 | ❌ | Partiel |
| Meditation | 1/1 | ❌ | Nouveau |
| Profile | 1/1 | ❌ | Nouveau |
| VR | 0/3 | ❌ | Planifié |
| Social | 5/5 | ⚠️ | Bêta |

---

## 🗓️ Planning prévisionnel

### Sprint 1 (Semaines 1-2) : Audit & Design
- Audit complet architecture
- Unification design system
- Refacto couleurs hardcodées

### Sprint 2 (Semaines 3-4) : Routes & Navigation
- Validation registry complet
- Tests guards et redirections
- Finalisation aliases

### Sprint 3 (Semaines 5-6) : Modules prioritaires
- Coach (compléter pages)
- Meditation (enrichir contenu)
- Profile (enrichir contenu)
- Music (tests e2e)

### Sprint 4 (Semaine 7) : Tests & Qualité
- Tests unitaires → 90% coverage
- Tests e2e parcours critiques
- Audit accessibilité

### Sprint 5 (Semaine 8) : Sécurité
- RLS policies validation
- RGPD compliance
- Audit sécurité

### Sprint 6 (Semaine 9) : Documentation
- Docs technique à jour
- Docs utilisateur
- JSDoc complet

### Sprint 7 (Semaine 10) : Production
- Optimisations finales
- Monitoring setup
- CI/CD complet
- 🚀 Déploiement production

---

## 🎯 Prochaines étapes immédiates

### À faire maintenant
1. **Lancer audit architecture**
   ```bash
   npx tsx scripts/validate-architecture.ts
   ```

2. **Mesurer coverage actuel**
   ```bash
   npm run test -- --coverage
   ```

3. **Identifier pages à enrichir**
   - `/app/coach/programs`
   - `/app/coach/sessions`
   - `/app/meditation`
   - `/app/profile`

4. **Prioriser modules**
   - Coach (impact fort)
   - VR (innovation)
   - Social (finalisation)

### Questions à clarifier
- Budget temps disponible ?
- Équipe actuelle (solo / équipe) ?
- Priorités business (B2C vs B2B) ?
- Date de lancement cible ?

---

**Prêt à démarrer ? Quelle phase veux-tu attaquer en premier ?** 🚀
