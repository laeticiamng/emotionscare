# 🔐 Comptes de Test - EmotionsCare

**Date de création:** 2025-01-21  
**Environnement:** Développement uniquement  
**Statut:** Prêt pour audit complet

---

## 🚀 Accès Rapide

**Page de gestion:** [http://localhost:8080/dev/test-accounts](http://localhost:8080/dev/test-accounts)

Sur cette page, vous pouvez :
- Créer tous les comptes en un clic
- Créer des comptes individuellement
- Copier facilement les identifiants
- Voir le statut de création de chaque compte

---

## 👥 Comptes de Test Disponibles

### 1️⃣ Utilisateur B2C Standard

**Email:** `test.user@emotionscare.dev`  
**Mot de passe:** `Test123!EmotionsCare`  
**Type:** B2C (Particulier)  
**Rôle:** `user`

**Accès:**
- ✅ Scan émotionnel de base
- ✅ Musique thérapeutique limitée
- ✅ Journal émotionnel
- ✅ 3 modules gratuits
- ❌ VR / AR (Premium uniquement)
- ❌ Coach IA avancé (Premium uniquement)

**À tester:**
- `/app/scan` - Scan émotionnel
- `/app/music` - Musique thérapeutique
- `/app/journal` - Journal personnel
- `/app/breath` - Exercices de respiration
- `/app/home` - Dashboard utilisateur

---

### 2️⃣ Utilisateur B2C Premium

**Email:** `test.premium@emotionscare.dev`  
**Mot de passe:** `Premium123!EmotionsCare`  
**Type:** B2C (Particulier Premium)  
**Rôle:** `premium_user`

**Accès:**
- ✅ Tous les scans émotionnels
- ✅ Musique thérapeutique illimitée
- ✅ Coach IA personnalisé
- ✅ Tous les modules premium
- ✅ Expériences VR/AR
- ✅ Analyses avancées
- ✅ Flash Glow, Ambition Arcade, etc.

**À tester:**
- `/app/vr-galaxy` - VR Galaxy Experience
- `/app/vr-breath-guide` - VR Breath Guide
- `/app/face-ar` - Filtres AR
- `/app/coach-micro` - Coach IA micro-sessions
- `/app/flash-glow` - Flash Glow Premium
- `/app/ambition-arcade` - Ambition Arcade
- `/app/boss-grit` - Boss Level Grit
- `/app/music-premium` - Musique thérapeutique premium

---

### 3️⃣ Collaborateur B2B

**Email:** `test.collab@emotionscare.dev`  
**Mot de passe:** `Collab123!EmotionsCare`  
**Type:** B2B (Entreprise)  
**Rôle:** `collaborator`

**Accès:**
- ✅ Tous les modules B2C
- ✅ Dashboard collaborateur
- ✅ Outils d'équipe
- ✅ Social Cocon
- ✅ Communauté entreprise
- ❌ Dashboard RH (Manager uniquement)
- ❌ Analytics d'équipe (Manager uniquement)

**À tester:**
- `/app/collab` - Dashboard collaborateur
- `/app/social-cocon` - Social Cocon
- `/app/community` - Communauté entreprise
- `/app/emotional-park` - Parc émotionnel collectif
- `/app/weekly-bars` - Weekly Bars (suivi hebdo)

---

### 4️⃣ Manager RH

**Email:** `test.rh@emotionscare.dev`  
**Mot de passe:** `RH123!EmotionsCare`  
**Type:** B2B (Entreprise - Manager)  
**Rôle:** `hr_manager`

**Accès:**
- ✅ Tous les accès Collaborateur
- ✅ Dashboard RH complet
- ✅ Analytics d'équipe
- ✅ Rapports de bien-être
- ✅ Gestion d'équipe
- ✅ Heatmaps et métriques avancées
- ✅ Export de données

**À tester:**
- `/app/rh` - Dashboard RH
- `/b2b/reports` - Rapports détaillés
- `/app/teams` - Gestion d'équipe
- `/b2b/heatmap-vibes` - Heatmap Vibes
- `/app/analytics` - Analytics avancées

---

### 5️⃣ Administrateur

**Email:** `test.admin@emotionscare.dev`  
**Mot de passe:** `Admin123!EmotionsCare`  
**Type:** Admin  
**Rôle:** `admin`

**Accès:**
- ✅ Accès complet à tous les modules
- ✅ Panel d'administration
- ✅ Gestion des utilisateurs
- ✅ Configuration système
- ✅ Logs et monitoring
- ✅ API documentation
- ✅ Préréglages mood
- ✅ Moteur de recommandation

**À tester:**
- `/app/admin` - Panel admin
- `/app/mood-presets` - Gestion préréglages
- `/app/recommendation-engine` - Moteur de recommandation
- `/app/api-monitoring` - Monitoring API
- `/app/audit` - Audit système complet

---

## 📋 Plan de Test Complet

### Phase 1: Authentification ✅
- [x] Créer les 5 comptes de test
- [ ] Tester login avec chaque compte
- [ ] Vérifier la redirection appropriée après login
- [ ] Tester logout
- [ ] Vérifier la persistence de session
- [ ] Tester "Se souvenir de moi"
- [ ] Tester "Mot de passe oublié"

### Phase 2: Modules B2C Standard
- [ ] **Scan Émotionnel** (`/app/scan`)
  - [ ] Scan vocal
  - [ ] Scan visuel (webcam)
  - [ ] Scan texte
  - [ ] Historique des scans
- [ ] **Musique Thérapeutique** (`/app/music`)
  - [ ] Lecture de playlists
  - [ ] Génération de musique adaptative
  - [ ] Sauvegarde de favoris
- [ ] **Journal Émotionnel** (`/app/journal`)
  - [ ] Création d'entrée
  - [ ] Journal vocal
  - [ ] Historique et recherche
  - [ ] Export
- [ ] **Respiration Guidée** (`/app/breath`)
  - [ ] Exercices de base
  - [ ] Suivi de progression

### Phase 3: Modules B2C Premium
- [ ] **VR Galaxy** (`/app/vr-galaxy`)
- [ ] **VR Breath Guide** (`/app/vr-breath-guide`)
- [ ] **Flash Glow** (`/app/flash-glow`)
- [ ] **Ambition Arcade** (`/app/ambition-arcade`)
- [ ] **Boss Level Grit** (`/app/boss-grit`)
- [ ] **Filtres AR** (`/app/face-ar`)
- [ ] **Coach IA** (`/app/coach-micro`)
- [ ] **Bubble Beat** (`/app/bubble-beat`)
- [ ] **Screen Silk Break** (`/app/screen-silk`)

### Phase 4: Modules B2B
- [ ] **Dashboard Collab** (`/app/collab`)
- [ ] **Dashboard RH** (`/app/rh`)
- [ ] **Social Cocon** (`/app/social-cocon`)
- [ ] **Rapports B2B** (`/b2b/reports`)
- [ ] **Heatmap Vibes** (`/b2b/heatmap-vibes`)
- [ ] **Gestion d'équipe** (`/app/teams`)

### Phase 5: Administration
- [ ] **Panel Admin** (`/app/admin`)
- [ ] **Mood Presets** (`/app/mood-presets`)
- [ ] **API Monitoring** (`/app/api-monitoring`)
- [ ] **Audit Système** (`/app/audit`)

### Phase 6: Accessibilité & UX
- [ ] Navigation clavier complète
- [ ] Lecteurs d'écran (NVDA/JAWS)
- [ ] Contraste des couleurs (WCAG AA)
- [ ] Textes alternatifs images
- [ ] Focus visible
- [ ] Responsive (mobile/tablet/desktop)

### Phase 7: Performance
- [ ] Lighthouse audit (≥90 tous scores)
- [ ] Time to Interactive < 3s
- [ ] First Contentful Paint < 1.5s
- [ ] Lazy loading fonctionnel
- [ ] Bundle size optimisé

### Phase 8: Sécurité
- [ ] RLS policies Supabase
- [ ] XSS/CSRF protections
- [ ] Input validation
- [ ] Session management
- [ ] Secrets protection

---

## 🔧 Utilisation

### Méthode 1: Via l'interface web (Recommandé)

1. Ouvrir [http://localhost:8080/dev/test-accounts](http://localhost:8080/dev/test-accounts)
2. Cliquer sur "Créer tous les comptes" ou créer individuellement
3. Copier les identifiants avec le bouton de copie
4. Se rendre sur [http://localhost:8080/login](http://localhost:8080/login)
5. Se connecter avec un des comptes

### Méthode 2: Création manuelle via Supabase

1. Aller sur [https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/auth/users](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/auth/users)
2. Cliquer sur "Add user" → "Create new user"
3. Entrer l'email et le mot de passe
4. Cocher "Auto Confirm User" pour éviter la validation email

### Méthode 3: Via l'API Supabase

```typescript
import { supabase } from '@/integrations/supabase/client';

// Créer un compte
const { data, error } = await supabase.auth.signUp({
  email: 'test.user@emotionscare.dev',
  password: 'Test123!EmotionsCare',
  options: {
    data: {
      account_type: 'b2c',
      role: 'user',
      is_test_account: true
    }
  }
});
```

---

## ⚠️ Important - Sécurité

### ⛔ À NE JAMAIS FAIRE

- ❌ Utiliser ces comptes en production
- ❌ Commiter les mots de passe dans Git
- ❌ Partager ces identifiants publiquement
- ❌ Utiliser ces comptes pour des données réelles

### ✅ Bonnes Pratiques

- ✅ Supprimer tous les comptes de test avant production
- ✅ Utiliser des mots de passe forts et uniques
- ✅ Activer la confirmation email en production
- ✅ Implémenter 2FA pour les comptes admin en production
- ✅ Monitorer les connexions suspectes

---

## 📊 Suivi de l'Audit

**Dernière mise à jour:** 2025-01-21

| Phase | Progrès | Statut |
|-------|---------|--------|
| Authentification | 0% | ⏳ À faire |
| Modules B2C Standard | 0% | ⏳ À faire |
| Modules B2C Premium | 0% | ⏳ À faire |
| Modules B2B | 0% | ⏳ À faire |
| Administration | 0% | ⏳ À faire |
| Accessibilité | 0% | ⏳ À faire |
| Performance | 0% | ⏳ À faire |
| Sécurité | 0% | ⏳ À faire |

**Total:** 0% complété

---

## 🔗 Liens Utiles

- **Dashboard Supabase:** https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk
- **Auth Users:** https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/auth/users
- **Database:** https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/editor
- **Logs:** https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/logs/explorer
- **Audit Complet:** Voir `AUDIT_PLATFORM_2025.md`

---

**Note:** Ce document doit être mis à jour au fur et à mesure de l'avancement de l'audit.
