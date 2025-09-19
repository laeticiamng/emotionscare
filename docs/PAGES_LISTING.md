# 📋 Cartographie des pages EmotionsCare

## 🗂️ Légende des statuts
- **🟢 Livré** : page utilisée en production avec fonctionnalités branchées.
- **🟡 Bêta** : expérience stable mais avec dépendances ou parcours encore en validation.
- **🟠 Prototype** : exploration produit conservée pour tests internes.

## 🌐 Entrées publiques & marketing
| Page | Route(s) | Statut | Description | Fichier principal |
| --- | --- | --- | --- | --- |
| HomePage | `/` | 🟢 | Landing unifiée qui sert le contenu marketing complet et annonce aux utilisateurs connectés l'accès rapide à leur tableau de bord. | `src/components/HomePage.tsx` |
| SimpleB2CPage | `/b2c` | 🟢 | Variante allégée de la home pour la cible B2C avec CTA directs vers l'inscription et les offres entreprise. | `src/components/SimpleB2CPage.tsx` |
| B2BEntreprisePage | `/entreprise` (`/b2b`) | 🟡 | Présentation des programmes entreprise et formulaires d'intérêt, encore en finalisation marketing. | `src/pages/B2BEntreprisePage.tsx` |
| AboutPage | `/about` | 🟢 | Page « À propos » structurée en sections animées et orientées accessibilité (focus management, badges de valeurs). | `src/pages/AboutPage.tsx` |
| ContactPage | `/contact` | 🟢 | Formulaire de contact réactif avec coordonnées directes et carte d'engagement. | `src/pages/ContactPage.tsx` |
| DemoPage | `/demo` | 🟡 | Parcours interactif pas-à-pas qui illustre Emotion Scan, Adaptive Music et Coach via composants motion. | `src/pages/DemoPage.tsx` |
| HelpPage | `/help` | 🟢 | Centre d'aide listant FAQ, assistance chat et liens rapides. | `src/pages/HelpPage.tsx` |
| OnboardingPage | `/onboarding` | 🟡 | Présentation guidée des modules clés avant connexion complète. | `src/pages/OnboardingPage.tsx` |
| LegalTermsPage & LegalPrivacyPage | `/legal/terms`, `/legal/privacy` | 🟢 | Pages légales décorrélées qui reprennent les obligations RGPD et CGU. | `src/pages/LegalTermsPage.tsx`, `src/pages/LegalPrivacyPage.tsx` |

## 🔐 Authentification & accès
| Page | Route(s) | Statut | Description | Fichier principal |
| --- | --- | --- | --- | --- |
| UnifiedLoginPage | `/login` (+ alias historiques) | 🟢 | Formulaire multi-segments relié à Supabase Auth, incluant social login et récupération. Validée par le scénario e2e « auth.spec.ts » (connexion B2C 06/2025). | `src/pages/unified/UnifiedLoginPage.tsx` |
| SignupPage | `/signup` | 🟢 | Inscription progressive avec validations et consentements explicites. | `src/pages/SignupPage.tsx` |
| ChooseModePage | `/choose-mode` | 🟢 | Sélecteur de mode B2C/B2B utilisé pour router les nouveaux inscrits. | `src/pages/ChooseModePage.tsx` |
| AppGatePage | `/app` | 🟢 | Dispatcher post-authentification qui redirige selon le rôle normalisé et l'état de consentement. | `src/pages/AppGatePage.tsx` |
| Pages d'erreur 401/403/404 | `/401`, `/403`, `/404`, `*` | 🟢 | Garde-fous système avec messages contextualisés et CTA retour. | `src/pages/errors/401.tsx`, `src/pages/errors/403.tsx`, `src/pages/errors/404.tsx` |

## 🧭 Dashboards & navigation
| Page | Route(s) | Statut | Description | Fichier principal |
| --- | --- | --- | --- | --- |
| HomePage (consumer) | `/app/home` (+ `/dashboard`) | 🟢 | Hub B2C affichant les tuiles modules et les raccourcis personnalisation. Couverture e2e « dashboard.spec.ts » confirmant les actions rapides et la navigation (06/2025). | `src/components/HomePage.tsx` |
| B2BCollabDashboard | `/app/collab` | 🟡 | Dashboard collaborateurs avec indicateurs d'engagement et actions rapides. | `src/pages/B2BCollabDashboard.tsx` |
| B2BRHDashboard | `/app/rh` | 🟡 | Vue manager présentant analytics d'équipe, en attente d'intégration finale Supabase. | `src/pages/B2BRHDashboard.tsx` |
| B2BReports/B2BEvents/B2BOptimisation | `/app/reports`, `/app/events`, `/app/optimization` | 🟡 | Pivots analytiques côté manager : rapports consolidés, calendrier d'évènements et leviers d'optimisation. | `src/pages/B2BReportsPage.tsx` etc. |
| ModulesShowcase & NavigationPage | `/modules`, `/navigation` | 🟠 | Explorations conservées pour présenter les composants et scénarios internes. | `src/pages/ModulesPage.tsx`, `src/pages/NavigationPage.tsx` |

## 🎯 Modules bien-être B2C
| Module | Route(s) | Statut | Description | Entrée |
| --- | --- | --- | --- | --- |
| Emotion Scan | `/app/scan` | 🟢 | Questionnaire I-PANAS-SF relié à la fonction `invokeEmotionScan`, historique Supabase et fallback local. Couvert par le scénario e2e « emotion-scan-dashboard.spec.ts » (scan → historique). | `src/modules/emotion-scan/EmotionScanPage.tsx` |
| Mood Mixer | `/app/mood-mixer` | 🟢 | Création/édition de presets `mood_presets` avec pré-écoute Adaptive Music et sauvegarde Supabase. Scénario e2e « mood-mixer-crud.spec.ts » (CRUD complet) validé. | `src/pages/B2CMoodMixerPage.tsx` |
| Flash Glow & Ultra | `/app/flash-glow`, `/app/flash-glow-ultra` | 🟢 | Séances guidées avec machine d'état, timers, calcul du delta d'humeur et insertion automatique dans le journal. Couverture e2e « flash-glow-ultra-session.spec.ts ». | `src/modules/flash-glow/useFlashGlowMachine.ts`, `src/modules/flash-glow-ultra/FlashGlowUltraPage.tsx` |
| Breath Constellation | `/app/breath` | 🟢 | Protocoles respiratoires nommés, options audio/haptique, compatibilité reduced motion et logging Supabase. | `src/modules/breath-constellation/BreathConstellationPage.tsx` |
| Journal | `/app/journal` | 🟢 | Composer texte/voix, recherche + tags, action coach, sanitisation DOMPurify, Dashboard sync. Tests e2e `journal-feed.spec.ts`. | `src/pages/journal/JournalView.tsx` |
| Coach IA | `/app/coach` | 🟢 | Parcours consentement → prompt AI → réponses normalisées, logs anonymisés (`coach_conversations`). Couvert par « coach-ai-session.spec.ts ». | `src/pages/B2CAICoachPage.tsx`, `src/modules/coach/coachService.ts` |
| Adaptive Music | `/app/music` | 🟢 | Recommandations mood→playlist, favoris, reprise audio via `moodPlaylist.service`. Scénario e2e « adaptive-music-favorites.spec.ts » validant favoris. | `src/modules/adaptive-music/AdaptiveMusicPage.tsx` |
| Scores Dashboard | `/app/heatmap`, `/app/activity`, `/app/leaderboard` | 🟢 | Agrégats Supabase (tendances, heatmap, sessions) avec export PNG. | `src/pages/HeatmapPage.tsx`, `src/app/modules/scores/ScoresV2Panel.tsx` |

## ⚙️ Paramètres, abonnement & légal
| Page | Route(s) | Statut | Description | Fichier principal |
| --- | --- | --- | --- | --- |
| B2CSettings/B2CProfileSettings | `/settings/general`, `/settings/profile` | 🟢 | Préférences générales, profil et synchronisation avatar. | `src/pages/B2CSettingsPage.tsx`, `src/pages/B2CProfileSettingsPage.tsx` |
| B2CPrivacyToggles | `/settings/privacy` | 🟢 | Gestion fine des consentements (tracking, newsletters, IA). | `src/pages/B2CPrivacyTogglesPage.tsx` |
| B2CNotifications | `/settings/notifications` | 🟢 | Paramétrage granularité notifications email/push. | `src/pages/B2CNotificationsPage.tsx` |
| SubscribePage | `/subscribe` (+ `/billing`) | 🟡 | Parcours d'abonnement et présentation des plans, paiements à brancher. | `src/pages/SubscribePage.tsx` |

## 🛠️ Outils internes & développement
| Page | Route(s) | Statut | Description | Fichier principal |
| --- | --- | --- | --- | --- |
| ValidationPage | `/validation` (dev only) | 🟠 | Boîte à outils QA pour valider les composants et états critiques. | `src/pages/ValidationPage.tsx` |
| ComprehensiveSystemAuditPage | `/dev/system-audit` (dev only) | 🟠 | Audit système complet (routes, dépendances) destiné aux équipes techniques. | `src/pages/ComprehensiveSystemAuditPage.tsx` |
| AdminFlagsPage | `/admin/flags` | 🟠 | Gestion expérimentale des feature flags côté admin. | `src/modules/admin/AdminFlagsPage.tsx` |

> _Ce document reflète la structure réelle du RouterV2 et les modules livrés. Utilisez `src/routerV2/registry.ts` pour retrouver la liste exhaustive des routes, y compris alias et redirections._
