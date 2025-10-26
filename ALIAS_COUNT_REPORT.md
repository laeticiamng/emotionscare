# 📊 Rapport de Comptage des Aliases

## Vue d'ensemble

Le système de routing EmotionsCare utilise **2 types d'aliases** :

### 1. **Aliases du Registry** (routes.registry.ts)
Routes alternatives qui pointent directement vers la même page (pas de redirection).

### 2. **Aliases de Compatibilité** (aliases.tsx)
Redirections legacy pour maintenir la compatibilité avec les anciennes URLs.

---

## 🔢 Comptage Détaillé

### ALIASES DU REGISTRY

Basé sur l'analyse du fichier `src/routerV2/registry.ts` :

**65 définitions d'aliases trouvées**, contenant au total :

#### Par catégorie :

**Routes Publiques :**
- `/tarifs` → `/pricing` (1)
- `/choose-mode` → `/b2c` (1)
- `/b2b` → `/entreprise` (1)

**Authentification :**
- `/auth`, `/b2c/login`, `/b2b/user/login`, `/b2b/admin/login` → `/login` (4)
- `/register`, `/b2c/register`, `/b2b/user/register` → `/signup` (3)

**Dashboards :**
- `/app/home`, `/b2c/dashboard`, `/dashboard` → `/app/consumer/home` (3)
- `/b2b/user/dashboard` → `/app/collab` (1)
- `/b2b/admin/dashboard` → `/app/rh` (1)

**Modules Fonctionnels :**
- `/scan` → `/app/scan` (1)
- `/music` → `/app/music` (1)
- `/parcours-xl` → `/app/parcours-xl` (1)
- `/emotion-music` → `/app/emotion-music` (1)
- `/emotion-music-library` → `/app/emotion-music-library` (1)
- `/music-therapy-premium` → `/app/music-premium` (1)
- `/coach` → `/app/coach` (1)
- `/coach-micro-decisions` → `/app/coach-micro` (1)
- `/journal`, `/voice-journal` → `/app/journal` (2)
- `/weekly-bars`, `/bars` → `/app/weekly-bars` (2)
- `/vr` → `/app/vr` (1)

**Modules Fun-First :**
- `/flash-glow`, `/instant-glow`, `/b2c-flash-glow`, `/flash-glow-advanced` → `/app/flash-glow` (4)
- `/breathwork`, `/breathwork-adaptive` → `/app/breath` (2)
- `/meditation` → `/app/meditation` (1)
- `/ar-filters` → `/app/face-ar` (1)
- `/bubble-beat` → `/app/bubble-beat` (1)
- `/emotion-scan` → `/app/emotion-scan` (1)
- `/voice-journal` → `/app/journal/audio` (1)
- `/emotions` → `/app/emotions-scan` (1)
- `/community` → `/app/community` (1)
- `/screen-silk-break` → `/app/screen-silk` (1)
- `/vr-breath-ariane` → `/app/vr-breath` (1)
- `/vr-galactique` → `/app/vr-galaxy` (1)
- `/vr-respiration` → `/app/vr-breath-guide` (1)
- `/boss-level-grit` → `/app/boss-grit` (1)
- `/mood-mixer` → `/app/mood-mixer` (1)
- `/ambition-arcade` → `/app/ambition-arcade` (1)
- `/bounce-back-battle` → `/app/bounce-back` (1)
- `/story-synth-lab` → `/app/story-synth` (1)
- `/social-cocon` → `/app/social-cocon` (1)
- `/communaute` → `/app/community` (1)
- `/parc`, `/park` → `/app/emotional-park` (2)
- `/voyage`, `/journey` → `/app/park-journey` (2)

**Analytics & Data :**
- `/analytics` → `/app/analytics` (1)
- `/leaderboard` → `/app/leaderboard` (1)
- `/weekly-bars`, `/activity-history` → `/app/activity` (2)
- `/app/heatmap`, `/heatmap-vibes` → `/app/scores` (2)

**Communication :**
- `/chat`, `/nyvee-chat` → `/messages` (2)
- `/agenda` → `/calendar` (1)
- `/recuperation-20` → `/point20` (1)

**Paramètres :**
- `/settings`, `/preferences` → `/settings/general` (2)
- `/profile-settings` → `/settings/profile` (1)
- `/privacy-toggles`, `/settings/data-privacy` → `/settings/privacy` (2)
- `/notifications` → `/settings/notifications` (1)

**B2B Features :**
- `/teams` → `/app/teams` (1)
- `/reports` → `/app/reports` (1)
- `/events` → `/app/events` (1)
- `/optimisation` → `/app/optimization` (1)
- `/security` → `/app/security` (1)
- `/audit` → `/app/audit` (1)
- `/accessibility` → `/app/accessibility` (1)

**Pages Légales :**
- `/terms`, `/conditions` → `/legal/terms` (2)
- `/privacy-policy` → `/legal/privacy` (1)
- `/mentions-legales`, `/legal` → `/legal/mentions` (2)
- `/cgv`, `/conditions-ventes` → `/legal/sales` (2)
- `/cookies-policy`, `/cookies` → `/legal/cookies` (2)
- `/billing`, `/plans` → `/subscribe` (2)

**TOTAL REGISTRY : ~100 aliases individuels**

---

### ALIASES DE COMPATIBILITÉ (REDIRECTIONS)

Basé sur `src/routerV2/aliases.tsx` :

**55 redirections de compatibilité** réparties en :

#### Authentification (7)
- `/b2c/login` → `/login?segment=b2c`
- `/b2b/user/login` → `/login?segment=b2b`
- `/b2b/admin/login` → `/login?segment=b2b`
- `/auth` → `/login`
- `/b2c/register` → `/signup?segment=b2c`
- `/b2b/user/register` → `/signup?segment=b2b`
- `/register` → `/signup`

#### Landing Pages (5)
- `/choose-mode` → `/b2c`
- `/b2b` → `/entreprise`
- `/b2b/selection` → `/entreprise`
- `/help-center` → `/help`
- `/tarifs` → `/pricing`

#### Dashboards (5)
- `/b2c/dashboard` → `/app/home`
- `/dashboard` → `/app/home`
- `/home` → `/app/home`
- `/b2b/user/dashboard` → `/app/collab`
- `/b2b/admin/dashboard` → `/app/rh`

#### Modules Fonctionnels (8)
- `/emotions` → `/app/scan`
- `/scan` → `/app/scan`
- `/emotion-scan` → `/app/scan`
- `/music` → `/app/music`
- `/coach` → `/app/coach`
- `/journal` → `/app/journal`
- `/voice-journal` → `/app/journal`
- `/vr` → `/app/vr`
- `/community` → `/app/social-cocon`

#### Modules Fun-First (10)
- `/flash-glow` → `/app/flash-glow`
- `/instant-glow` → `/app/flash-glow`
- `/breathwork` → `/app/breath`
- `/ar-filters` → `/app/face-ar`
- `/bubble-beat` → `/app/bubble-beat`
- `/screen-silk-break` → `/app/screen-silk`
- `/vr-galactique` → `/app/vr-galaxy`
- `/boss-level-grit` → `/app/boss-grit`
- `/mood-mixer` → `/app/mood-mixer`
- `/ambition-arcade` → `/app/ambition-arcade`
- `/bounce-back-battle` → `/app/bounce-back`
- `/story-synth-lab` → `/app/story-synth`

#### Analytics & Data (3)
- `/weekly-bars` → `/app/activity`
- `/activity-history` → `/app/activity`
- `/heatmap-vibes` → `/app/scores`

#### Paramètres (5)
- `/settings` → `/settings/general`
- `/preferences` → `/settings/general`
- `/profile-settings` → `/settings/profile`
- `/privacy-toggles` → `/settings/privacy`
- `/notifications` → `/settings/notifications`

#### B2B Features (8)
- `/teams` → `/app/teams`
- `/social-cocon` → `/app/social`
- `/reports` → `/app/reports`
- `/events` → `/app/events`
- `/optimisation` → `/app/optimization`
- `/security` → `/app/security`
- `/audit` → `/app/audit`
- `/accessibility` → `/app/accessibility`

**TOTAL COMPATIBILITÉ : 55 redirections**

---

## 📈 RÉSUMÉ GLOBAL

| Type | Nombre |
|------|--------|
| **Aliases Registry** | ~100 |
| **Aliases Compatibilité** | 55 |
| **TOTAL GÉNÉRAL** | **~155 aliases** |

---

## 🎯 Implications

### Avantages
✅ Navigation flexible  
✅ URLs intuitives multiples  
✅ Rétrocompatibilité totale  
✅ SEO-friendly (plusieurs chemins vers même contenu)  

### Points de vigilance
⚠️ Maintenance importante  
⚠️ Risque de confusion pour les développeurs  
⚠️ Tests nécessaires pour chaque alias  

---

## 🔍 Recommandations

1. **Documentation** : Maintenir ce rapport à jour
2. **Tests E2E** : Valider tous les aliases critiques
3. **Analytics** : Tracker l'usage réel de chaque alias
4. **Nettoyage** : Supprimer les aliases non utilisés après 6 mois
5. **Convention** : Privilégier les paths canoniques dans le nouveau code

---

*Généré le : 2025-10-26*  
*Version RouterV2 : 2.1.0*
