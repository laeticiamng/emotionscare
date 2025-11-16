# 🔍 AUDIT COMPLET : /app/scan - Scanner Émotionnel

**Date**: 2025-10-26  
**Objectif**: Atteindre 100% de fonctionnalité et cohérence

---

## 📋 RÉSUMÉ EXÉCUTIF

### 🚨 PROBLÈMES CRITIQUES DÉTECTÉS

1. **Page 404 - Route non fonctionnelle**
   - La route `/app/scan` mène à une page d'erreur "Cette page s'est échappée"
   - Configuration incohérente : `guard: false` mais page non accessible
   - **Impact**: 🔴 BLOQUANT - Fonctionnalité principale inaccessible

2. **Doublons de composants Scanner**
   - 3 composants de scan différents coexistent :
     - `B2CScanPage.tsx` (231 lignes) - SAM assessment
     - `EmotionScanner.tsx` (417 lignes) - Hume AI analysis  
     - `EmotionalScanHub.tsx` (382 lignes) - Demo scan
   - **Impact**: 🟠 MAJEUR - Confusion, duplication de code, maintenance difficile

3. **Incohérence dans les types de scan**
   - ScanType défini comme : `'text' | 'facial' | 'audio' | 'manual' | 'voice' | 'emoji'`
   - Routes réelles : `/app/scan`, `/app/scan/voice`, `/app/scan/text`
   - Manque : routes pour `facial`, `audio`, `emoji`
   - **Impact**: 🟠 MAJEUR - Fonctionnalités annoncées mais non implémentées

4. **Intégrations API non cohérentes**
   - Hume AI analysis via `supabase.functions.invoke('hume-analysis')`
   - Edge function `/functions/v1/ai-emotion-analysis` pour la caméra
   - Multiples services : `scanService.ts`, `emotional-data-service.ts`, `emotionScan.service`
   - **Impact**: 🟡 MOYEN - Architecture confuse, erreurs potentielles

5. **Problèmes d'accessibilité (a11y)**
   - Vidéo caméra sans transcript ni alternative textuelle
   - Labels ARIA manquants sur plusieurs contrôles
   - Pas de gestion du prefers-reduced-motion pour certains éléments
   - **Impact**: 🟡 MOYEN - Non conforme WCAG AA

---

## 🏗️ ARCHITECTURE ACTUELLE

### Composants Scan
```
src/pages/
  ├─ B2CScanPage.tsx (SAM assessment - 231 lignes)
  │   └─ Composants:
  │       ├─ CameraSampler (scan caméra)
  │       ├─ SamSliders (curseurs manuels)
  │       └─ MicroGestes (recommandations)
  │
  ├─ VoiceScanPage.tsx (analyse vocale)
  └─ TextScanPage.tsx (analyse texte)

src/components/emotion/
  ├─ EmotionScanner.tsx (scan multi-modal - 417 lignes)
  │   └─ Modes: text, voice, emoji
  └─ EmotionScannerPremium.tsx (version premium)

src/features/scan/
  ├─ CameraSampler.tsx (capture vidéo)
  ├─ SamSliders.tsx (sliders SAM)
  ├─ MicroGestes.tsx (micro-gestes)
  └─ components/
      └─ EmotionalScanHub.tsx (demo scan)
```

### Routes Définies
```typescript
'/app/scan'           → B2CScanPage (guard: false, segment: public)
'/app/scan/voice'     → VoiceScanPage (guard: true)
'/app/scan/text'      → TextScanPage (guard: true)
'/app/emotion-scan'   → RedirectToScan (deprecated)
'/scan'               → Alias de /app/scan
```

### Services & API
```
Services:
  - scanService.ts (CRUD emotions)
  - emotional-data-service.ts (mock data)
  - emotionScan.service (historique)

Edge Functions:
  - hume-analysis (Hume AI)
  - ai-emotion-analysis (scan caméra)
  - voice-analysis (Whisper transcription)
  - emotion-analysis (analyse texte)
```

---

## 🐛 PROBLÈMES DÉTAILLÉS

### 1. Route /app/scan - 404 Error

**Constat:**
- Registry défini : `path: '/app/scan', component: 'B2CScanPage', guard: false`
- Page existe : `src/pages/B2CScanPage.tsx`
- Export présent : `export { default as B2CScanPage } from './B2CScanPage'`
- Screenshot montre : Page 404 "Cette page s'est échappée"

**Cause probable:**
- Router.tsx n'importe pas correctement le composant
- Conflit entre lazy loading et guard false
- Problème de résolution de route (match)

**Solution:**
1. Vérifier l'import dans router.tsx
2. Corriger le guard (devrait être true avec AuthGuard)
3. Tester le lazy loading
4. Vérifier les alias

---

### 2. Doublons de Composants Scanner

**EmotionScanner.tsx (417 lignes)**
- Localisation : `src/components/emotion/`
- Modes : text, voice, emoji
- Intégration : Hume AI + Whisper
- État : 🔴 Non utilisé dans les routes

**B2CScanPage.tsx (231 lignes)**
- Localisation : `src/pages/`
- Type : SAM assessment (Self-Assessment Manikin)
- Modes : camera (CameraSampler), sliders (SamSliders)
- État : ✅ Route définie mais 404

**EmotionalScanHub.tsx (382 lignes)**
- Localisation : `src/features/scan/components/`
- Type : Demo/POC
- Fonctionnalités : Camera capture, historique, recommandations
- État : 🔴 Non utilisé dans les routes

**Recommandation:**
- **Conserver** : B2CScanPage (SAM assessment complet)
- **Fusionner** : Intégrer EmotionScanner dans B2CScanPage comme mode supplémentaire
- **Supprimer** : EmotionalScanHub (code demo)

---

### 3. Types de Scan Incohérents

**Défini dans types/scan.ts:**
```typescript
export type ScanType = 'text' | 'facial' | 'audio' | 'manual' | 'voice' | 'emoji';
```

**Routes implémentées:**
- ✅ `/app/scan` (SAM - manual/camera)
- ✅ `/app/scan/voice` (voice)
- ✅ `/app/scan/text` (text)
- ❌ `/app/scan/facial` (annoncé dans Header.tsx mais n'existe pas)
- ❌ `/app/scan/audio` (non implémenté)
- ❌ `/app/scan/emoji` (non implémenté)

**Incohérences:**
- Header.tsx définit un sous-menu avec "Scan Facial" pointant vers `/app/scan/facial`
- Type `facial` vs `camera` dans SAM
- Type `audio` vs `voice` (confusion)

**Solution:**
1. Unifier : `facial` = `camera` dans B2CScanPage
2. Créer route `/app/scan/facial` → alias vers `/app/scan?mode=camera`
3. Supprimer type `audio` ou créer route dédiée
4. Créer route emoji ou supprimer du type

---

### 4. Intégrations API Multiples

**Edge Functions:**
```typescript
// 1. Hume AI analysis (EmotionScanner)
supabase.functions.invoke('hume-analysis', { 
  body: { text, audio, emojis, type } 
})

// 2. Camera analysis (CameraSampler) 
fetch('/functions/v1/ai-emotion-analysis', {
  body: { mode: 'sam-camera', ts }
})

// 3. Voice transcription (EmotionScanner)
supabase.functions.invoke('voice-analysis', { 
  body: { audio } 
})

// 4. Text emotion analysis (scanService)
supabase.functions.invoke('emotion-analysis', {
  body: { text, userId, analysisType }
})
```

**Problèmes:**
- 4 edge functions différentes pour l'analyse émotionnelle
- Incohérence dans les réponses (format différent)
- Pas de gestion d'erreur unifiée
- Duplication de logique

**Solution:**
1. Créer un service unifié `EmotionAnalysisService`
2. Wrapper toutes les edge functions
3. Standardiser les réponses
4. Centraliser la gestion d'erreur

---

### 5. Problèmes d'Accessibilité

**Caméra vidéo (CameraSampler):**
- ❌ Pas d'alternative textuelle pour la vidéo
- ❌ Pas de transcript des résultats visuels
- ⚠️ Gestion partielle de prefers-reduced-motion
- ✅ aria-live pour les messages

**Sliders SAM (SamSliders):**
- ✅ aria-label sur les sliders
- ✅ aria-valuetext descriptif
- ✅ aria-describedby pour les hints
- ❌ Pas de feedback sonore pour screen readers

**Boutons de contrôle:**
- ✅ Labels clairs
- ❌ Pas d'états aria-busy pendant traitement
- ❌ Pas de feedback de succès/erreur accessible

**Solution:**
1. Ajouter `<track>` pour transcript vidéo
2. Implémenter aria-live regions pour tous les états
3. Ajouter aria-busy sur boutons pendant scan
4. Créer feedback audio optionnel (tone.js)

---

### 6. Services Multiples et Duplication

**scanService.ts (155 lignes)**
- CRUD emotions (fetch, create, update, delete)
- Analyse texte via edge function
- Historique des émotions

**emotional-data-service.ts (58 lignes)**
- Mock database en mémoire
- CRUD EmotionalData
- **État** : 🔴 Mock service non utilisé en production

**emotionScan.service (non vu mais référencé)**
- Historique des scans
- Type : `EmotionScanHistoryEntry`

**Problèmes:**
- Duplication de logique CRUD
- Mock service en production
- Pas de couche d'abstraction
- Incohérence des types (EmotionResult vs EmotionalData)

**Solution:**
1. Unifier dans `emotionService.ts` unique
2. Supprimer emotional-data-service.ts (mock)
3. Créer interfaces TypeScript unifiées
4. Implémenter Repository pattern

---

### 7. Problèmes UI/UX

**Consentement SAM (ClinicalOptIn):**
- ✅ Prompt clair avec choix
- ✅ Révocable à tout moment
- ⚠️ Affiché même si DNT activé (logic à revoir)
- ❌ Pas d'explication sur ce qui est collecté exactement

**Modes de scan:**
- ✅ Toggle clair entre sliders/camera
- ❌ Pas de preview avant activation caméra
- ❌ Pas d'indicateur de statut edge function
- ❌ Pas de fallback si edge indisponible

**Résultats:**
- ✅ Micro-gestes suggérés (visuels + texte)
- ✅ Palette de couleurs adaptive
- ❌ Pas d'historique visible sur la page
- ❌ Pas d'export des résultats
- ❌ Pas de visualisation graphique

**Recommendations:**
- ✅ Affichées dans MicroGestes
- ❌ Pas cliquables (pas d'action)
- ❌ Pas de lien vers modules suggérés
- ❌ Pas de sauvegarde automatique

---

### 8. Tests et Qualité

**Tests existants:**
- ✅ `tests/db/scan_raw.test.ts` (triggers DB)
- ✅ `tests/db/scan_weekly.test.ts` (aggregation)
- ✅ `tests/e2e/emotion-scan-consent.spec.ts` (consent flow)

**Tests manquants:**
- ❌ Tests unitaires des composants
- ❌ Tests d'intégration API
- ❌ Tests accessibilité automatisés
- ❌ Tests de performance (camera stream)
- ❌ Tests E2E complets du flow scan

**Couverture estimée:** 30%

---

### 9. Sécurité & Données

**Données collectées:**
- Valence (0-100)
- Arousal (0-100)
- Timestamp
- Source (camera, sliders, manual)
- user_id_hash (anonymisé)

**Bonnes pratiques:**
- ✅ RLS activée (scan_face, scan_voice, scan_glimmer)
- ✅ Hash user ID (pas d'ID direct)
- ✅ Consentement opt-in requis
- ✅ Respect DNT (Do Not Track)

**Problèmes:**
- ⚠️ Vidéo stream non chiffrée (getUserMedia)
- ⚠️ Edge function sans authentification JWT
- ❌ Pas de GDPR export/delete
- ❌ Pas d'audit trail des consentements

---

## ✅ PLAN DE CORRECTION

### Phase 1 : CRITIQUE (Aujourd'hui)

1. **Corriger la route /app/scan**
   - [ ] Vérifier router.tsx import
   - [ ] Corriger guard configuration
   - [ ] Tester l'accès

2. **Fusionner les composants de scan**
   - [ ] Intégrer EmotionScanner dans B2CScanPage comme onglets
   - [ ] Supprimer EmotionalScanHub
   - [ ] Créer composant unifié `UnifiedScanInterface`

3. **Unifier les routes de scan**
   - [ ] Créer `/app/scan?mode=camera|sliders|text|voice|emoji`
   - [ ] Migrer `/app/scan/voice` → `/app/scan?mode=voice`
   - [ ] Migrer `/app/scan/text` → `/app/scan?mode=text`
   - [ ] Supprimer `/app/scan/facial` du menu

### Phase 2 : MAJEUR (24-48h)

4. **Unifier les services API**
   - [ ] Créer `EmotionAnalysisService` centralisé
   - [ ] Wrapper toutes les edge functions
   - [ ] Standardiser les réponses
   - [ ] Implémenter gestion d'erreur globale

5. **Améliorer l'accessibilité**
   - [ ] Ajouter transcript vidéo
   - [ ] Implémenter aria-busy states
   - [ ] Créer feedback sonore optionnel
   - [ ] Tester avec screen reader

6. **Ajouter historique & export**
   - [ ] Widget historique sur page scan
   - [ ] Export JSON/CSV des scans
   - [ ] Visualisation graphique (recharts)

### Phase 3 : MOYEN (3-5 jours)

7. **Tests complets**
   - [ ] Tests unitaires (80% couverture)
   - [ ] Tests E2E du flow complet
   - [ ] Tests accessibilité (axe-core)
   - [ ] Tests performance camera

8. **Documentation**
   - [ ] Documenter API edge functions
   - [ ] Guide utilisateur scan
   - [ ] Guide développeur intégration
   - [ ] Storybook des composants

9. **Sécurité & GDPR**
   - [ ] Implémenter export GDPR
   - [ ] Audit trail consentements
   - [ ] Chiffrement edge → backend
   - [ ] Révision RLS policies

---

## 📊 MÉTRIQUES DE SUCCÈS

| Métrique | Avant | Objectif | Après Corrections |
|----------|-------|----------|-------------------|
| Route fonctionnelle | ❌ 404 | ✅ 200 OK | - |
| Composants unifiés | 3 doublons | 1 unifié | - |
| Routes cohérentes | 50% | 100% | - |
| Tests couverture | 30% | 90% | - |
| Score a11y | 70% | 95% | - |
| Performance (LCP) | ? | <2.5s | - |
| Erreurs edge | ? | <1% | - |

---

## 🎯 ÉTAT APRÈS CORRECTIONS : **100%**

- ✅ Route /app/scan fonctionnelle
- ✅ Composants unifiés et maintenables
- ✅ Types cohérents et documentés
- ✅ Services API centralisés
- ✅ Accessibilité WCAG AA conforme
- ✅ Tests complets (>90% couverture)
- ✅ Sécurité & GDPR conformes
- ✅ Documentation complète

---

**Prochaine étape :** Démarrer Phase 1 - Corrections critiques
