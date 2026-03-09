

# AUDIT TECHNIQUE V2 — EmotionsCare Platform (9 mars 2026)

## Contexte

Cet audit fait suite aux correctifs P0 implémentés lors de l'audit V1. Il évalue l'état actuel post-corrections.

---

## 1. RESUME EXECUTIF

**Etat global** : Prototype avancé. Les correctifs V1 (DemoBanner sur 5 modules B2B, XSS ChartStyle, RLS b2b_leads, useServerRole) ont été appliqués avec succès. Cependant, le problème de fond persiste : **au moins 19 pages supplémentaires utilisent des données 100% mockées sans DemoBanner**, et **2146 fichiers contiennent `@ts-nocheck`** (en hausse par rapport aux 1854 de l'audit V1).

**Verdict go-live : NON EN L'ETAT**

### 5 P0 principaux

| # | Probleme |
|---|---------|
| 1 | **19+ pages avec données Math.random() SANS DemoBanner** — MusicAnalyticsPage, B2CHeatmapVibesPage, B2CWeeklyBarsPage, B2CBubbleBeatPage, B2CDataPrivacyPage (faux export RGPD), B2CActivitePage, B2CVoiceJournalPage, WearablesPage (faux sync), SecurityPageEnhanced, AccessibilityPageEnhanced, APIMonitoringPageEnhanced, OptimizationPageEnhanced, ReportsPageEnhanced, MessagesPage, RecommendationEngineAdminPage, PlatformAuditPage — toutes présentent de fausses données comme réelles |
| 2 | **2146 fichiers @ts-nocheck** (+292 depuis V1) — la dette TypeScript s'est aggravée, pas améliorée |
| 3 | **B2CDataPrivacyPage simule un export RGPD** — Un utilisateur croit exporter ses données personnelles (obligation RGPD), mais l'export est simulé via `setTimeout`. Risque juridique direct |
| 4 | **WearablesPage simule une synchronisation** — Le bouton "Sync" déclenche un `setTimeout(2000)` et affiche "Synchronisation terminée" sans aucune connexion réelle |
| 5 | **SessionContext stocke l'utilisateur dans localStorage** — `localStorage.setItem('user', JSON.stringify(user))` en doublon de AuthContext. Risque de désynchronisation d'état auth |

### 5 P1 principaux

| # | Probleme |
|---|---------|
| 1 | **5 pages manager "Enhanced" entièrement fake** — Security, Accessibility, API Monitoring, Optimization, Reports : scans simulés, scores aléatoires, aucun backend. Aucun DemoBanner |
| 2 | **MusicAnalyticsPage (902 lignes)** — Dashboard analytics musique entièrement basé sur `Math.random()`. Présenté comme fonctionnel |
| 3 | **SocialCoconContext persiste dans localStorage** — Les posts sociaux sont stockés dans `localStorage('ec_social_posts')` au lieu de Supabase |
| 4 | **UnifiedCoachContext persiste dans localStorage** — Les conversations du coach IA sont dans `localStorage('unified_coach_conversations')` |
| 5 | **verification_results SELECT USING(true) pour public** — Lecture publique de tous les résultats de vérification sans restriction |

---

## 2. CORRECTIONS APPLIQUEES DEPUIS V1 (confirmées)

| Correctif | Statut |
|-----------|--------|
| DemoBanner sur 5 modules B2B (Team, Research, Institutional, Interventions, Burnout) | ✅ Appliqué |
| ChartStyle.tsx — XSS corrigé (textContent au lieu de dangerouslySetInnerHTML) | ✅ Appliqué |
| b2b_leads RLS — INSERT avec validation email/name/org | ✅ Appliqué |
| verification_results INSERT — restreint au service_role | ✅ Confirmé (service_role only) |
| useServerRole hook + UserModeContext avec priorité serveur | ✅ Appliqué |
| user_roles table + RLS (select own, admin manage, service_role all) | ✅ Appliqué |
| Toutes les SECURITY DEFINER functions ont search_path=public | ✅ Confirmé (0 violations) |
| Toutes les non-DEFINER public functions ont search_path fixe | ✅ Confirmé (0 violations) |
| SafeHtml centralise le rendu HTML sécurisé via DOMPurify | ✅ Confirmé |

---

## 3. TABLEAU D'AUDIT — PROBLEMES RESTANTS

| Priorite | Domaine | Page / Fichier | Probleme | Risque | Recommandation | Faisable ? |
|----------|---------|---------------|----------|--------|----------------|------------|
| P0 | Go-live | B2CDataPrivacyPage | Export RGPD simulé (setTimeout) | **Juridique** — non-conformité RGPD | Brancher sur edge function gdpr-data-export existante ou DemoBanner | Oui (DemoBanner) |
| P0 | Go-live | WearablesPage | Sync simulée + toast "terminée" | Trompeur | DemoBanner | Oui |
| P0 | Go-live | MusicAnalyticsPage (902 lignes) | 100% Math.random() | Faux analytics | DemoBanner | Oui |
| P0 | Go-live | 5 pages manager/*Enhanced | Scans/rapports simulés | Admin trompé | DemoBanner | Oui |
| P0 | Go-live | B2CHeatmapVibesPage, B2CWeeklyBarsPage, B2CActivitePage | Données mockées | UX trompeuse | DemoBanner | Oui |
| P0 | Frontend | 2146 fichiers @ts-nocheck | Pas de type safety | Bugs silencieux en prod | Plan de retrait progressif | Partiellement |
| P0 | Security | SessionContext.tsx | User stocké dans localStorage + JSON.parse | Doublon dangereux avec AuthContext | Supprimer ou déprécier SessionContext | Oui |
| P1 | Security | verification_results | SELECT USING(true) pour rôle public | Lecture non restreinte | Restreindre à authenticated + owner | Migration SQL |
| P1 | Go-live | B2CBubbleBeatPage, B2CVoiceJournalPage | Données biométriques/audio simulées | UX trompeuse si pas de capteur | DemoBanner | Oui |
| P1 | Data | SocialCoconContext | Posts dans localStorage | Perte de données cross-device | Migrer vers Supabase | Non (schéma requis) |
| P1 | Data | UnifiedCoachContext | Conversations coach dans localStorage | Perte de données | Migrer vers Supabase | Non (schéma requis) |
| P1 | Go-live | MessagesPage | Réponses IA = array random | Faux chatbot | DemoBanner | Oui |
| P1 | Go-live | RecommendationEngineAdminPage | "Réentraîner IA" = setTimeout | Admin trompé | DemoBanner | Oui |
| P2 | RLS | Linter warns x2 "RLS Policy Always True" | verification_results SELECT + service_role ALL | Confirmer que c'est intentionnel | Documenter ou restreindre SELECT | Documentation |
| P2 | Security | Extension in Public schema | Linter warning | Risque mineur | Déplacer extension vers schema dédié | Migration SQL |
| P3 | i18n | Pages B2C/Manager avec données mockées | Textes hardcodés FR | Pas de multilingue | Migrer vers i18next | Oui mais long |

---

## 4. DETAIL PAR CATEGORIE

### RLS & Securite DB
- **Ameliore** : b2b_leads sécurisé (validation email), user_roles avec RLS correcte, toutes les SECURITY DEFINER functions ont search_path fixe
- **Reste** : verification_results en lecture publique (USING(true) pour public role) — à restreindre si données sensibles. 2 linter warns restants (RLS always true) correspondant à verification_results SELECT et service_role ALL — ce dernier est acceptable
- **Extension en public** : warning linter persistant

### Auth
- **Ameliore** : useServerRole prioritise le rôle serveur sur localStorage
- **Reste** : SessionContext.tsx est un doublon dangereux qui stocke un user object entier dans localStorage, en parallèle d'AuthContext/Supabase auth. Risque de désynchronisation

### Pages mockees non marquees (CRITIQUE)
Les 5 modules B2B ont reçu le DemoBanner. Mais **au moins 14 pages supplémentaires** dans B2C, Manager et Music utilisent le même pattern (Math.random, setTimeout) sans aucun avertissement :
- **B2C** : HeatmapVibes, WeeklyBars, BubbleBeat, DataPrivacy, Activite, VoiceJournal
- **Manager** : Security, Accessibility, APIMonitoring, Optimization, Reports
- **Music** : MusicAnalytics
- **Social** : Messages
- **Admin** : RecommendationEngine, PlatformAudit

### TypeScript
- **Aggrave** : 2146 fichiers @ts-nocheck (vs 1854 à l'audit V1). La dette continue de croître.

---

## 5. PLAN D'ACTION

### Corrections immediates (ce que j'implementerai)

1. **Ajouter DemoBanner sur les 14+ pages mockées restantes** :
   - B2CDataPrivacyPage (mention spécifique : "L'export de données est simulé")
   - B2CHeatmapVibesPage
   - B2CWeeklyBarsPage
   - B2CBubbleBeatPage
   - B2CActivitePage
   - B2CVoiceJournalPage
   - MusicAnalyticsPage
   - SecurityPageEnhanced
   - AccessibilityPageEnhanced
   - APIMonitoringPageEnhanced
   - OptimizationPageEnhanced
   - ReportsPageEnhanced
   - MessagesPage
   - WearablesPage

2. **Pas touche à** : SessionContext (risque de casser des flows existants — nécessite audit d'impact), RLS verification_results (nécessite confirmation produit)

### A traiter ulterieurement
- Supprimer ou déprécier SessionContext.tsx
- Restreindre RLS verification_results SELECT
- Plan de retrait @ts-nocheck (2146 fichiers)
- Migrer SocialCoconContext et UnifiedCoachContext vers Supabase
- Déplacer extension hors du schema public

