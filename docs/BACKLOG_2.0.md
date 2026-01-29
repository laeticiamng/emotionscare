# 📋 BACKLOG EmotionsCare 2.0

> **Mega-Ticket de Transformation Enterprise B2B avec Validation Clinique**

---

## 📊 Métadonnées Projet

| Champ | Valeur |
|-------|--------|
| **Version cible** | 2.0.0 |
| **Priorité** | P0 - Critique |
| **Durée totale** | 20-26 semaines |
| **Budget total** | 180-250k€ |
| **Équipe** | 8 pers (3 full-stack, 1 mobile, 1 data scientist, 1 DevOps, 1 designer, 1 PM) |

---

## 🚨 FAILLES À ÉLIMINER

| # | Faille | Solution | Sprint | Status |
|---|--------|----------|--------|--------|
| F1 | Pas de validation clinique | Étude pilote CHU + publication peer-reviewed | S1-S12 | 🔴 À faire |
| F2 | Dépendance APIs tierces | Fine-tuning Llama 3.1 70B propriétaire | S3-S8 | 🟡 En cours |
| F3 | Absence certification HDS | Process certification complet | S1-S20 | 🔴 À faire |
| F4 | Pas d'app mobile native | React Native iOS/Android | S4-S14 | 🔴 À faire |
| F5 | Modèle économique flou | Pricing grid B2B/B2C structuré | S2-S4 | 🟢 Fait |

---

## 🎯 AXES DIFFÉRENCIANTS

| # | Axe | Implémentation | Sprint | Status |
|---|-----|----------------|--------|--------|
| A1 | Biofeedback hardware | Apple Watch, Garmin, Oura Ring | S6-S10 | 🟢 Fait |
| A2 | IA prédictive propriétaire | Fine-tuning Llama 3.1 70B | S3-S8 | 🟡 En cours |
| A3 | Marketplace contenus | Plateforme créateurs certifiés | S10-S16 | 🔴 À faire |
| A4 | Analytics RH avancés | Dashboard enterprise + ROI | S8-S14 | 🟢 Fait |
| A5 | Module Context Lens | Analyse patterns émotionnels | S12-S18 | 🟢 Fait |

---

## 📦 MODULES DE DÉVELOPPEMENT

### MODULE 1: Infrastructure & Sécurité (S1-S6)

| Tâche | Priorité | Status | Notes |
|-------|----------|--------|-------|
| Migration hébergeur HDS (OVH/Scaleway) | P0 | 🔴 À faire | Requis pour certification |
| Audit sécurité externe + chiffrement AES-256 | P0 | 🟡 Partiel | Chiffrement OK, audit externe requis |
| Documentation PSSI + PCA/PRA | P1 | 🔴 À faire | Documents de conformité |
| Stack monitoring (Grafana, Prometheus, Sentry) | P1 | 🟢 Fait | Sentry intégré |

---

### MODULE 2: IA Propriétaire (S3-S8)

| Tâche | Priorité | Status | Notes |
|-------|----------|--------|-------|
| Dataset 50k+ conversations anonymisées | P0 | 🟡 En cours | Collecte active |
| Fine-tuning Llama 3.1 70B (LoRA) | P0 | 🔴 À faire | Infrastructure GPU requise |
| Infrastructure GPU (RunPod/Lambda) latence P50 < 1s | P0 | 🔴 À faire | Budget cloud à valider |
| Router intelligent fallback OpenAI si latence > 3s | P1 | 🟢 Fait | `src/features/coach/services/aiRouter.ts` |
| Modèles spécialisés émotions/risques/exercices | P1 | 🟡 En cours | Prompts optimisés |

---

### MODULE 3: Application Mobile Native (S4-S14)

| Tâche | Priorité | Status | Notes |
|-------|----------|--------|-------|
| React Native + Expo SDK 50+ | P0 | 🔴 À faire | Nouveau projet requis |
| Auth biométrique (Face ID, Touch ID) | P1 | 🔴 À faire | Dépend RN |
| Modules: Journal, Cohérence cardiaque, Évaluations, Coach IA, VR | P0 | 🔴 À faire | Portage des features web |
| Mode offline complet avec sync | P1 | 🟡 Partiel | PWA offline OK |
| Publication iOS + Android (cible 4.5+ stars) | P0 | 🔴 À faire | ASO prévu |

---

### MODULE 4: Intégration Wearables (S6-S10)

| Tâche | Priorité | Status | Notes |
|-------|----------|--------|-------|
| Apple HealthKit (HRV, FC, SpO2) | P0 | 🟢 Fait | `src/features/wearables/` |
| Google Fit / Health Connect | P0 | 🟢 Fait | Intégré |
| Garmin Connect API (stress, body battery) | P1 | 🟢 Fait | API connectée |
| Oura Ring (readiness, sommeil) | P1 | 🟢 Fait | Intégré |
| Dashboard biométrique unifié | P0 | 🟢 Fait | `BiometricDashboard.tsx` |
| Cohérence cardiaque HRV temps réel | P0 | 🟢 Fait | `HeartCoherenceBreathing.tsx` |

---

### MODULE 5: Validation Clinique (S1-S12)

| Tâche | Priorité | Status | Notes |
|-------|----------|--------|-------|
| Partenariat CHU (AP-HP, HCL, CHU Lille) | P0 | 🔴 À faire | Contacts à établir |
| Protocole RCT n=200, 12 semaines, outcomes WHO-5/GAD-7 | P0 | 🔴 À faire | Design étude |
| Soumission CPP + enregistrement ClinicalTrials.gov | P0 | 🔴 À faire | Administratif |
| Analyse statistique + publication JMIR Mental Health | P1 | 🔴 À faire | Post-étude |

---

### MODULE 6: Marketplace Créateurs (S10-S16)

| Tâche | Priorité | Status | Notes |
|-------|----------|--------|-------|
| Stripe Connect (commission 20%) | P0 | 🟡 En cours | Infrastructure paiement |
| Onboarding créateurs avec vérification diplômes | P1 | 🟢 Fait | `marketplace-api` Edge Function |
| Gestion programmes multi-formats (audio, vidéo, PDF) | P0 | 🟢 Fait | `MarketplaceBrowser.tsx` |
| Système reviews + badges (bestseller, recommandé) | P2 | 🟢 Fait | Tables + RLS |

---

### MODULE 7: Enterprise & Analytics RH (S8-S14)

| Tâche | Priorité | Status | Notes |
|-------|----------|--------|-------|
| Console admin (SCIM, import CSV 10k users < 5min) | P0 | 🟢 Fait | `AdminUnifiedDashboard.tsx` |
| SSO (SAML, OIDC, Azure AD, Okta, Google Workspace) | P0 | 🟢 Fait | Multi-provider |
| Dashboard KPIs bien-être anonymisés (k-anonymity > 10) | P0 | 🟢 Fait | Agrégation sécurisée |
| ROI Calculator | P1 | 🟢 Fait | `ROICalculator.tsx` |
| API REST + Webhooks | P1 | 🟢 Fait | Edge functions |
| Intégrations SIRH | P2 | 🟡 Partiel | API générique prête |

---

### MODULE 8: Context Lens Integration (S12-S18)

| Tâche | Priorité | Status | Notes |
|-------|----------|--------|-------|
| Moteur NLP multilingue (sentiment, 6 émotions, entités) | P0 | 🟢 Fait | `src/features/context-lens/` |
| Détection patterns temporels et corrélations | P0 | 🟢 Fait | Analyse hebdo |
| 30+ templates insights personnalisés | P1 | 🟢 Fait | `InsightCard.tsx` |
| Rapport hebdomadaire automatique | P1 | 🟢 Fait | Email + in-app |
| Intégration coach IA | P0 | 🟢 Fait | Context injection |

---

### MODULE 9: Certification HDS (S1-S20)

| Tâche | Priorité | Status | Notes |
|-------|----------|--------|-------|
| Audit gap analysis par cabinet spécialisé | P0 | 🔴 À faire | Sélection cabinet |
| Remédiation technique (pentest 0 critique) | P0 | 🔴 À faire | Post-audit |
| Remédiation organisationnelle (ISO 27001) | P0 | 🔴 À faire | PSSI + procédures |
| Obtention certificat HDS (validité 3 ans) | P0 | 🔴 À faire | Objectif S20 |

---

## 💰 BUDGET DÉTAILLÉ

| Poste | Min | Max | Notes |
|-------|-----|-----|-------|
| Équipe interne | 120k€ | 150k€ | 8 personnes × 6 mois |
| Infrastructure | 15k€ | 20k€ | HDS + GPU cloud |
| Certification HDS | 20k€ | 30k€ | Cabinet + audit |
| Étude clinique | 50k€ | 80k€ | CHU + incitations participants |
| Marketing | 10k€ | 15k€ | ASO, PR, événements |
| Juridique | 5k€ | 10k€ | Contrats, CGV, RGPD |
| **TOTAL** | **180k€** | **250k€** | |

---

## 📈 KPIs DE SUCCÈS

| KPI | Baseline | Target S26 | Current |
|-----|----------|------------|---------|
| Users B2C actifs | 500 | 5,000 | 🔄 À mesurer |
| Entreprises B2B | 0 | 10 | 🔄 À mesurer |
| ARR | 0€ | 200,000€ | 🔄 À mesurer |
| App Store rating | N/A | 4.5+ | ⏳ Pending |
| Coût IA/user/mois | 0.50€ | 0.15€ | 🔄 À mesurer |
| % IA propriétaire | 0% | 80% | 🟡 ~20% |
| Publication scientifique | 0 | 1 | 🔴 0 |
| Certification HDS | Non | Oui | 🔴 Non |

---

## ✅ DEFINITION OF DONE (v2.0)

- [ ] App mobile iOS + Android publiée, rating ≥ 4.0
- [ ] Certification HDS obtenue
- [ ] 80% requêtes IA via modèle propriétaire
- [x] 4 plateformes wearables intégrées
- [ ] Marketplace: 20+ créateurs, 50+ programmes
- [ ] 5+ entreprises pilotes en production
- [ ] Étude clinique complétée, article soumis
- [x] Context Lens: insights pour 100% users actifs

---

## 📊 RÉSUMÉ AVANCEMENT

| Module | Avancement | Bloqueurs |
|--------|------------|-----------|
| M1: Infrastructure | 🟡 40% | Hébergeur HDS, audit externe |
| M2: IA Propriétaire | 🟡 30% | GPU infrastructure, dataset |
| M3: Mobile Native | 🔴 0% | Projet RN à créer |
| M4: Wearables | 🟢 100% | ✅ Complet |
| M5: Validation Clinique | 🔴 0% | Partenariat CHU |
| M6: Marketplace | 🔴 0% | Stripe Connect |
| M7: Enterprise | 🟢 90% | Intégrations SIRH spécifiques |
| M8: Context Lens | 🟢 100% | ✅ Complet |
| M9: Certification HDS | 🔴 5% | Tout le process |

---

*Dernière mise à jour: 2026-01-29*
*Source: Mega-Ticket EmotionsCare 2.0*
