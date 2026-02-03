# 🗺️ Roadmap EmotionsCare 2026

> Jalons trimestriels réalistes avec livrables mesurables

---

## 📊 Vue d'ensemble

| Trimestre | Focus | Objectif Principal |
|-----------|-------|-------------------|
| **Q1** | Stabilisation | MVP solide, tests ≥80%, docs complètes |
| **Q2** | Mobile & PWA | App installable, mode offline, notifications |
| **Q3** | Wearables & B2B | Apple Watch, Garmin, console entreprise |
| **Q4** | IA Prédictive | Analyse tendances, alertes préventives |

---

## 🎯 Q1 2026 : Stabilisation (Janvier - Mars)

### Objectifs
- Consolider les 5 modules core (Scan, Breath, Journal, Coach, Music)
- Atteindre 80% de couverture de tests
- Documentation technique complète

### Livrables

| Livrable | Responsable | Date | Statut |
|----------|-------------|------|--------|
| Tests unitaires hooks (15+) | Équipe Dev | 15 Jan | ✅ Fait |
| Tests E2E Playwright (50+ scénarios) | QA | 31 Jan | 🔶 En cours |
| Guide intégrations API | Tech Lead | 15 Jan | ✅ Fait |
| Audit accessibilité WCAG AA | UX | 28 Fév | 🔶 En cours |
| README et docs alignés réalité | Tous | 15 Jan | ✅ Fait |
| Tutoriel onboarding interactif | UX/Dev | 31 Jan | ✅ Fait |

### Critères de succès
- [ ] Zéro bug critique en production pendant 2 semaines
- [ ] Score Lighthouse ≥ 90 sur toutes les pages
- [ ] Couverture tests ≥ 80%

---

## 📱 Q2 2026 : Mobile & PWA (Avril - Juin)

### Objectifs
- Expérience mobile native via PWA
- Fonctionnement hors ligne complet
- Notifications push personnalisées

### Livrables

| Livrable | Responsable | Date | Statut |
|----------|-------------|------|--------|
| Mode offline Breath | Dev Mobile | 15 Avr | ⏳ Planifié |
| Mode offline Journal (brouillons) | Dev Mobile | 30 Avr | ⏳ Planifié |
| Sync intelligente (background) | Backend | 15 Mai | ⏳ Planifié |
| Notifications push (rappels) | Backend | 31 Mai | ⏳ Planifié |
| Optimisation taille bundle (<500KB) | DevOps | 15 Juin | ⏳ Planifié |
| Tests PWA sur iOS/Android | QA | 30 Juin | ⏳ Planifié |

### Critères de succès
- [ ] PWA installable sur 95% des devices
- [ ] Breath/Journal utilisables offline
- [ ] Temps de chargement < 2s sur 3G

---

## ⌚ Q3 2026 : Wearables & B2B (Juillet - Septembre)

### Objectifs
- Intégration wearables (HRV, stress)
- Console entreprise fonctionnelle
- Dashboard RH avec analytics

### Livrables

| Livrable | Responsable | Date | Statut |
|----------|-------------|------|--------|
| API Apple HealthKit | Dev iOS | 31 Juil | ⏳ Planifié |
| API Garmin Connect | Dev Backend | 15 Août | ⏳ Planifié |
| Dashboard RH (heatmap équipe) | Dev B2B | 31 Août | ⏳ Planifié |
| Rapports anonymisés PDF | Dev B2B | 15 Sep | ⏳ Planifié |
| SSO entreprise (SAML/OIDC) | Backend | 30 Sep | ⏳ Planifié |

### Critères de succès
- [ ] 3+ wearables supportés
- [ ] 2 clients B2B pilotes actifs
- [ ] Conformité HDS initiée

---

## 🧠 Q4 2026 : IA Prédictive (Octobre - Décembre)

### Objectifs
- Prédiction des baisses d'humeur
- Recommandations proactives
- Fine-tuning modèle propriétaire

### Livrables

| Livrable | Responsable | Date | Statut |
|----------|-------------|------|--------|
| Modèle prédiction tendances | Data Science | 31 Oct | ⏳ Planifié |
| Alertes préventives burn-out | AI Team | 15 Nov | ⏳ Planifié |
| Fine-tuning Llama 3 (émotions) | AI Team | 30 Nov | ⏳ Planifié |
| A/B testing recommandations | Product | 15 Déc | ⏳ Planifié |
| Rapport d'impact clinique | Medical | 31 Déc | ⏳ Planifié |

### Critères de succès
- [ ] Précision prédiction > 75%
- [ ] Temps de réponse IA < 2s
- [ ] Validation clinique obtenue

---

## ⚠️ Risques et Mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Retard wearables API | Moyen | Prioriser Apple Watch, reporter Garmin |
| Coûts IA élevés | Élevé | Quotas utilisateur, caching agressif |
| Conformité HDS complexe | Élevé | Partenariat hébergeur certifié |
| Adoption B2B lente | Moyen | Pilotes gratuits, ROI mesurable |

---

## 📈 KPIs Globaux 2026

| Métrique | Actuel | Cible Q4 |
|----------|--------|----------|
| Utilisateurs actifs mensuels | 500 | 10,000 |
| Score NPS | - | > 50 |
| Couverture tests | 40% | 90% |
| Uptime | 99% | 99.9% |
| Temps réponse API (p95) | 800ms | 200ms |

---

## 🔄 Processus de Mise à Jour

1. **Revue mensuelle** : Équipe produit valide avancement
2. **Rétrospective trimestrielle** : Ajustement priorités
3. **Communication** : Changelog public mensuel

---

*Dernière mise à jour : 3 février 2026*
