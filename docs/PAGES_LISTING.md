# 📋 Cartographie des pages EmotionsCare

## 🗂️ Légende des statuts
- **🟢 Livré** : page utilisée en production avec fonctionnalités branchées.
- **🟡 Bêta** : expérience stable mais avec dépendances ou parcours encore en validation.
- **🟠 Prototype** : exploration produit conservée pour tests internes.

## 🌐 Entrées publiques & marketing
| Page | Route(s) | Statut | Description | Fichier principal |
| --- | --- | --- | --- | --- |
| HomePage | `/` | 🟢 | Landing unifiée qui adresse B2C & B2B, gère les CTA et les redirections d'utilisateurs déjà authentifiés. | `src/components/HomePage.tsx` |
| SimpleB2CPage | `/b2c` (alias `/choose-mode`) | 🟢 | Variante orientée particuliers : storytelling + CTA directs vers l'inscription. | `src/components/SimpleB2CPage.tsx` |
| B2BEntreprisePage | `/entreprise` (alias `/b2b`) | 🟡 | Présentation des parcours entreprises, formulaires d'intérêt et crédibilisation sociale. | `src/pages/B2BEntreprisePage.tsx` |
| AboutPage | `/about` | 🟢 | Page « À propos » structurée en sections avec focus management et éléments de preuve. | `src/pages/AboutPage.tsx` |
| ContactPage | `/contact` | 🟢 | Formulaire de contact, coordonnées directes et routage support. | `src/pages/ContactPage.tsx` |
| DemoPage | `/demo` | 🟡 | Démo guidée des modules Emotion Scan, Coach, Adaptive Music. | `src/pages/DemoPage.tsx` |
| HelpPage | `/help` | 🟢 | Centre d'aide (FAQ + support) commun aux segments. | `src/pages/HelpPage.tsx` |
| OnboardingPage | `/onboarding` | 🟡 | Pré-onboarding marketing avant création de compte. | `src/pages/OnboardingPage.tsx` |
| LegalTermsPage & LegalPrivacyPage | `/legal/terms`, `/legal/privacy` | 🟢 | Pages légales RGPD/CGU décorrélées. | `src/pages/LegalTermsPage.tsx`, `src/pages/LegalPrivacyPage.tsx` |

## 🔐 Authentification & accès
| Page | Route(s) | Statut | Description | Fichier principal |
| --- | --- | --- | --- | --- |
| UnifiedLoginPage | `/login` (+ aliases historiques) | 🟢 | Auth Supabase (B2C, B2B user/admin), reset password et social login. Couvert par `auth.spec.ts`. | `src/pages/unified/UnifiedLoginPage.tsx` |
| SignupPage | `/signup` | 🟢 | Inscription progressive avec consentements explicites. | `src/pages/SignupPage.tsx` |
| ChooseModePage | `/choose-mode` | 🟢 | Sélecteur de mode B2C/B2B avant création de compte. | `src/pages/ChooseModePage.tsx` |
| AppGatePage | `/app` | 🟢 | Dispatcher post-authentification : route l'utilisateur selon rôle et consentement. | `src/pages/AppGatePage.tsx` |
| Error pages | `/401`, `/403`, `/404`, `*` | 🟢 | Pages d'état homogènes (CTA retour, i18n) branchées dans RouterV2. | `src/pages/errors/401/page.tsx` etc. |

## 🧭 Dashboards & navigation authentifiée
| Page | Route(s) | Statut | Description | Fichier principal |
| --- | --- | --- | --- | --- |
| HomePage (consumer) | `/app/home` (alias `/dashboard`) | 🟢 | Hub B2C avec tuiles modules, shortcuts personnalisation. e2e `dashboard.spec.ts`. | `src/components/HomePage.tsx` |
| B2BCollabDashboard | `/app/collab` | 🟡 | Dashboard collaborateurs (pulses + recommandations). | `src/pages/B2BCollabDashboard.tsx` |
| B2BRHDashboard | `/app/rh` | 🟡 | Vue manager RH : analytics équipes, suivi adoption. | `src/pages/B2BRHDashboard.tsx` |
| B2B User Social Cocon | `/app/social` | 🟡 | Hub social B2B (programmes & activités). | `src/pages/B2BSocialCoconPage.tsx` |
| B2B Reports suite | `/app/reports`, `/app/reports/:period`, `/app/events`, `/app/optimization`, `/app/security`, `/app/audit`, `/app/accessibility` | 🟡 | Suite manager (rapports anonymisés, calendrier RH, optimisations, posture sécurité/a11y). | `src/pages/B2BReportsPage.tsx`, `src/pages/B2BEventsPage.tsx`, etc. |
| Teams Directory | `/app/teams` | 🟡 | Vue collaborateurs (B2B) avec jauges bien-être par équipe. | `src/pages/B2BTeamsPage.tsx` |

## 🎯 Modules bien-être B2C (sessions & coaching)
| Module | Route(s) | Statut | Description | Entrée |
| --- | --- | --- | --- | --- |
| Emotion Scan | `/app/scan` | 🟢 | I-PANAS-SF complet, historique Supabase, fallback offline. e2e `emotion-scan-dashboard.spec.ts`. | `src/modules/emotion-scan/EmotionScanPage.tsx` |
| Adaptive Music | `/app/music`, `/app/music-premium` | 🟢 | Recommandations mood→playlist, favoris persistés, premium Suno. e2e `adaptive-music-favorites.spec.ts`. | `src/modules/adaptive-music/AdaptiveMusicPage.tsx` |
| Coach IA | `/app/coach`, `/app/coach-micro` | 🟢 | Conversation SSE, consentement explicite, hash Web Crypto, redaction Sentry. e2e `coach.smoke.spec.ts`. | `src/pages/B2CAICoachPage.tsx` |
| Journal | `/app/journal`, `/journal/new` | 🟢 | Composer texte/voix, recherche/tags, envoi coach. e2e `journal-feed.spec.ts`. | `src/pages/journal/JournalView.tsx` |
| Mood Mixer | `/app/mood-mixer` | 🟢 | Création de presets musicaux, sync Supabase. e2e `mood-mixer-crud.spec.ts`. | `src/pages/B2CMoodMixerPage.tsx` |
| Flash Glow & Ultra | `/app/flash-glow`, `/app/flash-glow-ultra` | 🟢 | Machines d'état (Start/Pause/Resume), journalisation auto. e2e `flash-glow-ultra-session.spec.ts`. | `src/modules/flash-glow/useFlashGlowMachine.ts`, `src/modules/flash-glow-ultra/FlashGlowUltraPage.tsx` |
| Breath Constellation | `/app/breath` | 🟢 | Protocoles respiration, audio/haptique optionnels, `useSessionClock`. Tests `breath-constellation-session.spec.ts`. | `src/modules/breath-constellation/BreathConstellationPage.tsx` |
| Screen Silk Break | `/app/screen-silk` | 🟢 | Micro-pauses visuelles, timers adaptatifs. | `src/modules/screen-silk/ScreenSilkBreakPage.tsx` |
| Boss Level Grit | `/app/boss-grit` | 🟠 | Challenge ludifié (prototype gamifié). | `src/pages/modules/BossLevelGritPage.tsx` |
| Bounce Back Battle | `/app/bounce-back` | 🟠 | Mini-jeu résilience (prototype). | `src/pages/modules/BounceBackBattlePage.tsx` |
| Story Synth Lab | `/app/story-synth` | 🟠 | Atelier narratif expérimental. | `src/pages/modules/StorySynthLabPage.tsx` |

## 🪐 Immersion VR & AR
| Expérience | Route(s) | Statut | Description | Entrée |
| --- | --- | --- | --- | --- |
| VR Hub | `/app/vr` | 🟢 | Sélecteur VR qui respecte le store sécurité (fallback 2D, doNotTrack). | `src/pages/B2CVRGalaxyPage.tsx` |
| VR Galaxy | `/app/vr-galaxy` | 🟢 | Expérience cosmique adaptive, journalisation sessions `vr_galaxy`. | `src/pages/B2CVRGalaxyPage.tsx` |
| VR Breath Guide | `/app/vr-breath-guide` | 🟢 | Parcours respiratoire guidé VR soft/2D selon tolérance SSQ. | `src/pages/B2CVRBreathGuidePage.tsx` |
| VR Breath | `/app/vr-breath` | 🟢 | Module respiration immersive connecté aux métriques VR. | `src/pages/VRBreathPage.tsx` |
| Face AR Filters | `/app/face-ar` | 🟠 | Démo filtres AR (prototype). | `src/pages/modules/FaceARFiltersPage.tsx` |

## 🤝 Social & communauté
| Module | Route(s) | Statut | Description | Entrée |
| --- | --- | --- | --- | --- |
| Community Feed | `/app/community`, `/app/communaute` | 🟢 | Mur bienveillant, auto-signalements Sentry, redirections Social Cocon. | `src/pages/B2CCommunautePage.tsx` |
| Social Cocon (B2C) | `/app/social-cocon` | 🟢 | Espaces protégés guidés, animations douce et garde-fous. | `src/pages/B2CSocialCoconPage.tsx` |
| Activity Timeline | `/app/activity` | 🟢 | Journal d'activité (sessions + scans) avec filtrage anonyme et timeline hebdo. | `src/pages/B2CActivitePage.tsx` |
| Leaderboard | `/app/leaderboard` | 🟢 | Classement gamifié anonymisé (min_n). | `src/pages/LeaderboardPage.tsx` |
| Scores / Heatmap | `/app/scores` (aliases `/app/heatmap`) | 🟢 | Heatmap vibes, agrégats anonymisés. e2e `scores-heatmap-dashboard.spec.ts`. | `src/pages/ScoresPage.tsx` |
| Gamification Hub | `/gamification` | 🟠 | Portail ludification (expérience exploratoire). | `src/pages/modules/GamificationPage.tsx` |

## ⚙️ Paramètres, abonnement & légal
| Page | Route(s) | Statut | Description | Fichier principal |
| --- | --- | --- | --- | --- |
| Settings (général) | `/settings/general` | 🟢 | Préférences globales, opt-out IA. | `src/pages/B2CSettingsPage.tsx` |
| Settings (profil) | `/settings/profile` | 🟢 | Profil, avatar, préférences langue. | `src/pages/B2CProfileSettingsPage.tsx` |
| Settings (privacy) | `/settings/privacy` | 🟢 | Consentements tracking, download data. | `src/pages/B2CPrivacyTogglesPage.tsx` |
| Settings (notifications) | `/settings/notifications` | 🟢 | Fréquence emails/push, do-not-disturb. | `src/pages/B2CNotificationsPage.tsx` |
| SubscribePage | `/subscribe` (alias `/billing`) | 🟡 | Parcours abonnement (paiement en intégration). | `src/pages/SubscribePage.tsx` |

## 🛠️ Outils internes & développement
| Page | Route(s) | Statut | Description | Fichier principal |
| --- | --- | --- | --- | --- |
| ValidationPage | `/validation` (dev only) | 🟠 | Boîte à outils QA (affichée uniquement en `NODE_ENV=development`). | `src/pages/ValidationPage.tsx` |
| ComprehensiveSystemAudit | `/dev/system-audit` (dev only) | 🟠 | Audit routes/dépendances réservé aux devs. | `src/pages/ComprehensiveSystemAuditPage.tsx` |
| AdminFlagsPage | `/admin/flags` | 🟠 | Gestion expérimentale des feature flags (protégée). | `src/modules/admin/AdminFlagsPage.tsx` |

> _Ce document reflète la structure actuelle de RouterV2 (`src/routerV2/registry.ts`). Utilisez `routes.ts` pour retrouver les helpers typés, y compris les alias et redirections legacy._
