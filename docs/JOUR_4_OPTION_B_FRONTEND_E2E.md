# 📊 JOUR 4 - Option B: Front-end + Tests E2E

**Durée estimée:** 8-10h  
**Démarrage:** 2025-10-03 17:15

---

## 🎯 Objectifs

1. **UI complète** pour toutes les données migrées (Journal, VR, Breath, Assessments)
2. **Tests E2E** avec Playwright pour valider les workflows critiques
3. **Composants réutilisables** respectant le design system
4. **Couverture ≥ 90%** sur les parcours utilisateurs principaux

---

## 📋 Phase 1: Composants UI Core (2-3h)

### 1.1 Journal Components
- [ ] `JournalVoiceCard.tsx` - Affichage d'une entrée vocale
- [ ] `JournalTextCard.tsx` - Affichage d'une entrée texte
- [ ] `JournalTimeline.tsx` - Timeline des entrées
- [ ] `JournalStats.tsx` - Statistiques émotionnelles

### 1.2 VR Components
- [ ] `VRNebulaSession.tsx` - Session Nebula (HRV, cohérence)
- [ ] `VRDomeSession.tsx` - Session Dome (synchrony, team PA)
- [ ] `VRSessionsList.tsx` - Liste des sessions
- [ ] `VRMetricsChart.tsx` - Graphiques biométriques

### 1.3 Breath Components
- [ ] `BreathWeeklyCard.tsx` - Métriques hebdomadaires
- [ ] `BreathCoherenceGauge.tsx` - Jauge de cohérence cardiaque
- [ ] `BreathTrendChart.tsx` - Évolution HRV/MVPA

### 1.4 Assessment Components
- [ ] `AssessmentCard.tsx` - Résultat d'un assessment
- [ ] `AssessmentHistory.tsx` - Historique des évaluations
- [ ] `AssessmentQualitativeSummary.tsx` - Résumé textuel (sans chiffres)

---

## 📋 Phase 2: Pages Dashboard (2-3h)

### 2.1 B2C Dashboard (`/app/home`)
- [ ] `DashboardHome.tsx` - Vue d'ensemble utilisateur
- [ ] Intégration `user_weekly_dashboard` (matérialized view)
- [ ] Widgets: Journal récent, VR stats, Breath coherence, Assessments

### 2.2 B2B User Dashboard (`/app/collab`)
- [ ] `DashboardCollab.tsx` - Vue collaborateur
- [ ] Métriques personnelles + recommandations

### 2.3 B2B Admin Dashboard (`/app/rh`)
- [ ] `DashboardRH.tsx` - Vue manager
- [ ] Agrégats org: `breath_weekly_org_metrics`
- [ ] Graphiques d'équipe anonymisés

---

## 📋 Phase 3: Tests E2E Playwright (3-4h)

### 3.1 Journal Tests
```typescript
// tests/e2e/journal-flow.e2e.ts
- Création entrée vocale
- Création entrée texte
- Affichage timeline
- Vérification encryption (pas de données brutes visibles)
```

### 3.2 VR Tests
```typescript
// tests/e2e/vr-sessions.e2e.ts
- Affichage session Nebula
- Affichage session Dome
- Vérification métriques (HRV, coherence)
```

### 3.3 Breath Tests
```typescript
// tests/e2e/breath-metrics.e2e.ts
- Affichage métriques hebdomadaires
- Graphiques de tendance
- Export données
```

### 3.4 Assessment Tests
```typescript
// tests/e2e/assessment-flow.e2e.ts
- Soumission assessment
- Affichage résultat qualitatif
- Vérification absence de chiffres (RGPD)
```

### 3.5 Dashboard Tests
```typescript
// tests/e2e/dashboard-complete.e2e.ts
- Chargement dashboard B2C
- Chargement dashboard B2B User
- Chargement dashboard B2B Admin
- Vérification performance (<500ms)
```

---

## 📋 Phase 4: Optimisations & Polish (1-2h)

### 4.1 Performance
- [ ] Lazy loading des composants lourds
- [ ] Suspense boundaries
- [ ] React Query optimizations

### 4.2 Accessibilité (a11y)
- [ ] ARIA labels sur tous les composants
- [ ] Navigation clavier
- [ ] Screen reader support

### 4.3 Responsive
- [ ] Mobile-first design
- [ ] Breakpoints Tailwind
- [ ] Touch gestures

---

## 🎨 Design System Tokens (rappel)

```css
/* index.css - Utiliser UNIQUEMENT ces tokens */
--primary: hsl(...)
--secondary: hsl(...)
--accent: hsl(...)
--muted: hsl(...)
--destructive: hsl(...)

/* INTERDIT: text-white, bg-black, etc. */
/* TOUJOURS: text-primary, bg-secondary, etc. */
```

---

## ✅ Checklist Qualité

- [ ] Tous les composants utilisent le design system
- [ ] Aucune couleur directe (text-white, bg-black)
- [ ] Tests E2E ≥ 90% couverture
- [ ] Accessibilité AA WCAG 2.1
- [ ] Performance: Lighthouse score > 90
- [ ] Dead code: 0 warnings
- [ ] TypeScript strict: aucune erreur

---

## 📊 Métriques Cibles

| Métrique | Cible | Actuel |
|----------|-------|--------|
| Tests E2E coverage | ≥ 90% | - |
| Lighthouse Performance | > 90 | - |
| Lighthouse Accessibility | 100 | - |
| Dashboard load time | < 500ms | - |
| Components count | ~20 | 0 |

---

**Prochaine étape:** Implémentation Phase 1 (Composants UI Core)
