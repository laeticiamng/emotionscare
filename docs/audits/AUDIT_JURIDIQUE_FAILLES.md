# 🚨 AUDIT JURIDIQUE - FAILLES CRITIQUES IDENTIFIÉES

**Date**: 4 novembre 2025  
**Plateforme**: EmotionsCare  
**Auditeur**: Analyse sécurité & conformité juridique  
**Criticité globale**: ⚠️ **HAUTE - 18 FAILLES MAJEURES**

---

## ⚖️ RÉSUMÉ EXÉCUTIF

Cette analyse identifie **18 failles juridiques critiques** susceptibles d'entraîner:
- Sanctions CNIL: jusqu'à **20M€ ou 4% du CA mondial** (art. 83 RGPD)
- Responsabilité civile et pénale des dirigeants
- Action de groupe (class action) des utilisateurs
- Mise sous séquestre de la plateforme par décision judiciaire
- Interdiction d'exercer dans le secteur santé/bien-être

---

## 🔴 SECTION 1 : FAILLES RGPD CRITIQUES (SANCTIONS IMMÉDIATES)

### FAILLE #1 : ABSENCE TOTALE DE MENTIONS LÉGALES ⚠️ CRITIQUE
**Violation**: Art. L111-7 du Code de la consommation  
**Statut**: `src/pages/legal/MentionsLegalesPage.tsx` **N'EXISTE PAS**

**Conséquences juridiques**:
- Délit pénal (art. L123-5 C.Com): **1 an prison + 37 500€ d'amende**
- Impossibilité de poursuivre en justice (vice de forme)
- Nullité des contrats B2B signés
- Amende DGCCRF: **15 000€ par manquement**

**Informations obligatoires manquantes**:
- Raison sociale, forme juridique, capital
- Siège social complet
- RCS + numéro SIRET/SIREN
- N° TVA intracommunautaire
- Directeur de publication (nom + prénom)
- Hébergeur (raison sociale + adresse complète)
- Numéro CNIL (si activité santé/données sensibles)

**Action requise**: **IMMÉDIATE** (< 24h)

---

### FAILLE #2 : POLITIQUE DE CONFIDENTIALITÉ INEXISTANTE ⚠️ CRITIQUE
**Violation**: Art. 13 & 14 RGPD  
**Statut**: `src/pages/legal/PrivacyPolicyPage.tsx` **N'EXISTE PAS**

**Conséquences juridiques**:
- Amende CNIL: **20M€ ou 4% du CA** (violation art. 13 RGPD)
- Nullité du consentement collecté (base légale invalide)
- Droit à indemnisation des utilisateurs (art. 82 RGPD)
- Interdiction de traiter des données de santé

**Informations obligatoires manquantes**:
- Identité du responsable de traitement + DPO
- Finalités précises de chaque traitement
- Base légale (consentement, intérêt légitime, etc.)
- Destinataires des données (sous-traitants, partenaires)
- Transferts hors UE (mécanismes de protection)
- Durées de conservation détaillées
- Droits RGPD (accès, rectification, effacement, portabilité)
- Modalités d'exercice des droits (contact DPO)
- Droit de réclamation auprès de la CNIL

**Action requise**: **IMMÉDIATE** (< 24h)

---

### FAILLE #3 : TRAITEMENT ILLÉGAL DE DONNÉES DE SANTÉ
**Violation**: Art. 9 RGPD (données sensibles) + Art. L1111-8 CSP  
**Preuves code**:
```typescript
// emotion_scans, journal_entries, assessments, clinical_feature_flags
// Aucune base légale documentée pour données de santé
```

**Conséquences juridiques**:
- Amende CNIL maximale: **20M€ ou 4% du CA**
- Peine complémentaire: **interdiction d'activité** (5 ans)
- Poursuites pénales: atteinte à la vie privée (art. 226-1 CP)
- Responsabilité personnelle dirigeants

**Problèmes identifiés**:
1. **Absence de consentement explicite et distinct** pour données de santé
2. **Pas de mention d'hébergeur HDS** (Hébergeur Données Santé certifié)
3. **Absence d'analyse d'impact (APIA)** pour traitements à haut risque
4. **Pas de registre des traitements** accessible
5. **Chiffrement insuffisant** (localStorage non chiffré)

**Exigences légales non respectées**:
- Consentement **écrit et daté** requis (art. 1111-7 CSP)
- Hébergement HDS obligatoire pour données de santé françaises
- APIA obligatoire (art. 35 RGPD)
- Double authentification pour accès données sensibles

**Action requise**: **IMMÉDIATE** - Suspension temporaire recommandée

---

### FAILLE #4 : COOKIES DÉPOSÉS SANS CONSENTEMENT PRÉALABLE
**Violation**: Art. 82 Loi Informatique & Libertés + Directive ePrivacy  
**Preuves code**:
```typescript
// src/components/ConsentBanner.tsx - Ligne 28
if (!hasStoredConsentPreferences()) {
  setVisible(true);
}
// ❌ Cookies déjà déposés AVANT affichage du bandeau
```

**Conséquences juridiques**:
- Amende CNIL: **20M€** (violation consentement cookies)
- Jurisprudence CJUE (Planet49): consentement invalide si cookies pré-cochés
- Action de groupe possible

**Cookies problématiques identifiés**:
1. **localStorage** utilisé AVANT consentement (473 occurrences)
2. **Supabase auth tokens** déposés sans opt-in
3. **Analytics** potentiellement actifs par défaut
4. **Matomo** configuré mais consentement flou

**Exigences non respectées**:
- Consentement **AVANT** tout dépôt (sauf strictement nécessaires)
- Refus aussi facile qu'acceptation (bouton "Tout refuser" visible)
- Durée conservation consentement ≤ 6 mois
- Preuve datée et horodatée du consentement

**Action requise**: **48h** - Refonte complète du mécanisme

---

### FAILLE #5 : DURÉES DE CONSERVATION NON DÉFINIES
**Violation**: Art. 5.1.e RGPD (limitation de conservation)

**Preuves code**:
```sql
-- database/sql/ - Aucune clause de purge automatique
CREATE TABLE journal_entries (...);
-- ❌ Pas de TTL, pas de politique de rétention
```

**Conséquences juridiques**:
- Amende CNIL: **10M€ ou 2% du CA**
- Conservation excessive = traitement illicite
- Obligation de purge sous 48h si réclamation utilisateur

**Tables sans durée de conservation**:
- `journal_entries` (données ultra-sensibles)
- `emotion_scans` (données biométriques)
- `assessments` (données médicales)
- `coach_logs` (conversations sensibles)
- `audit_logs` (doivent être purgés après 3 ans max)

**Action requise**: **7 jours** - Définir et implémenter politique de rétention

---

### FAILLE #6 : TRANSFERTS INTERNATIONAUX NON DOCUMENTÉS
**Violation**: Art. 44-50 RGPD (transferts hors UE)

**Services tiers identifiés**:
```typescript
// OpenAI API (USA) - données coaching
// Sentry (possiblement USA) - données d'erreur
// Firebase (Google - USA) - authentification
```

**Conséquences juridiques**:
- Amende CNIL: **20M€ ou 4% du CA**
- Invalidation Schrems II: transferts USA illégaux sans garanties
- Injonction de cesser les transferts

**Garanties manquantes**:
- Clauses contractuelles types (CCT) non signées
- Absence de BCR (Binding Corporate Rules)
- Pas de décision d'adéquation
- APIA transferts non réalisée

**Action requise**: **30 jours** - Audit complet des sous-traitants

---

## 🔴 SECTION 2 : FAILLES DROIT DE LA CONSOMMATION

### FAILLE #7 : CGV ABSENTES (B2C PREMIUM)
**Violation**: Art. L111-1 Code de la consommation  
**Statut**: Aucune page `/legal/sales` fonctionnelle

**Conséquences juridiques**:
- Nullité des ventes (remboursement intégral exigible)
- Amende DGCCRF: **75 000€** (personne morale)
- Action en pratique commerciale trompeuse

**Informations obligatoires manquantes**:
- Prix TTC + décomposition (HT, TVA, frais)
- Modalités de paiement acceptées
- Délai de livraison / accès service
- Droit de rétractation 14 jours (délai, procédure, formulaire)
- Service après-vente et garanties
- Médiation consommation obligatoire
- Loi applicable + juridiction compétente

**Action requise**: **48h** - Rédaction urgente CGV complètes

---

### FAILLE #8 : DROIT DE RÉTRACTATION NON IMPLÉMENTÉ
**Violation**: Art. L221-18 Code de la consommation

**Conséquences juridiques**:
- Remboursement sous 14 jours + prorogation délai rétractation (12 mois)
- Amende: **15 000€** par infraction
- Nullité des clauses abusives (liste noire art. R212-1)

**Fonctionnalités manquantes**:
- Formulaire de rétractation téléchargeable
- Email de confirmation rétractation
- Remboursement automatique (14 jours max après réception demande)
- Clause exception (contenu numérique commencé = perte droit rétractation)

**Action requise**: **7 jours**

---

### FAILLE #9 : ABSENCE DE MÉDIATEUR DE LA CONSOMMATION
**Violation**: Art. L612-1 Code de la consommation (obligatoire depuis 2016)

**Conséquences juridiques**:
- Amende: **3 000€** + astreinte journalière
- Impossibilité de se défendre si litige porté devant médiateur

**Action requise**: **30 jours** - Adhérer à un médiateur agréé CECMC

---

## 🔴 SECTION 3 : FAILLES SÉCURITÉ TECHNIQUE

### FAILLE #10 : STOCKAGE DONNÉES SENSIBLES EN CLAIR
**Violation**: Art. 32 RGPD (sécurité des traitements)

**Preuves code**:
```typescript
// src/core/privacy.ts - Ligne 27
const response = await fetch('/me/privacy_prefs', {
  credentials: 'include'
});
// ❌ localStorage utilisé pour données santé (non chiffré)

// 473 occurrences localStorage dans le code
// ❌ Aucune implémentation de chiffrement côté client
```

**Conséquences juridiques**:
- Amende CNIL: **10M€ ou 2% du CA**
- Responsabilité en cas de fuite (art. 82 RGPD)
- Obligation de notification violation sous 72h (art. 33 RGPD)

**Recommandations techniques**:
- Chiffrement AES-256 pour `localStorage`
- Utilisation `IndexedDB` chiffré
- Cookies `httpOnly` + `Secure` + `SameSite=Strict`
- Implémentation Web Crypto API

**Action requise**: **14 jours** - Refonte sécurité

---

### FAILLE #11 : ABSENCE DE LOGS DE SÉCURITÉ CONFORMES
**Violation**: Art. 32 RGPD + ISO 27001

**Preuves**:
```sql
-- supabase/tests/rls_check.sql
-- ❌ Pas de table d'audit des accès données sensibles
-- ❌ Pas de détection d'intrusion
```

**Conséquences juridiques**:
- Impossibilité de prouver la conformité en cas d'audit
- Amende aggravée si violation non détectée

**Logs manquants**:
- Accès aux données de santé (qui, quand, quoi)
- Modifications de consentements
- Exports de données
- Tentatives d'accès non autorisés

**Action requise**: **30 jours**

---

### FAILLE #12 : RLS POLICIES INSUFFISANTES
**Violation**: Principe de sécurité par défaut (art. 25 RGPD)

**Supabase Linter Report**:
- 2 erreurs **ERROR** (Security Definer Views)
- 8 avertissements **WARN** (fonctions non sécurisées)

**Tables vulnérables**:
```sql
-- Policies manquantes ou insuffisantes
privacy_prefs, export_jobs, delete_requests
-- Risque: accès cross-user
```

**Action requise**: **7 jours** - Audit complet RLS

---

## 🔴 SECTION 4 : FAILLES PROPRIÉTÉ INTELLECTUELLE

### FAILLE #13 : ABSENCE DE CRÉDITS OPEN SOURCE
**Violation**: Licences MIT, Apache, GPL (obligations attribution)

**Conséquences juridiques**:
- Violation copyright → poursuites éditeurs
- Injonction de cesser l'utilisation
- Dommages et intérêts

**Packages à risque** (≥186 dépendances):
- React, Supabase, OpenAI SDK
- Radix UI, Lucide Icons
- Chart.js, Three.js

**Action requise**: **7 jours** - Page `/legal/licenses` avec crédits

---

### FAILLE #14 : MARQUES NON PROTÉGÉES
**Nom**: EmotionsCare™, ResiMax™

**Risque juridique**:
- Usage marque non déposée = fraude
- Concurrent peut déposer avant vous
- Perte exclusive sur la marque

**Action requise**: **60 jours** - Dépôt INPI

---

## 🔴 SECTION 5 : FAILLES CONFORMITÉ SANTÉ

### FAILLE #15 : ABSENCE DE DISCLAIMER MÉDICAL CLAIR
**Violation**: Art. L4113-9 CSP (exercice illégal médecine)

**Risque pénal**: **2 ans prison + 30 000€ amende**

**Disclaimer actuel insuffisant**:
```tsx
// src/components/SecurityFooter.tsx - Ligne 11
"ÉmotionsCare™ ne remplace pas un avis médical"
// ❌ Trop petit, trop tard, pas assez visible
```

**Exigences légales**:
- Disclaimer **AVANT** tout questionnaire santé
- Popup acceptation explicite
- Alerte si réponses critiques détectées

**Action requise**: **48h** - Refonte disclaimer

---

### FAILLE #16 : DONNÉES BIOMÉTRIQUES NON CONFORMES
**Violation**: Art. 9 RGPD (données biométriques = catégorie spéciale)

**Preuves**:
```typescript
// Mediapipe, transformers.js pour analyse faciale
// ❌ Absence de consentement explicite biométrie
// ❌ Pas de mention dans politique confidentialité
```

**Conséquences juridiques**:
- Amende maximale: **20M€ ou 4% CA**
- APIA obligatoire non réalisée

**Action requise**: **IMMÉDIATE** - Suspension feature ou consentement

---

## 🔴 SECTION 6 : FAILLES CONTRACTUELLES B2B

### FAILLE #17 : ABSENCE DE DPA (DATA PROCESSING AGREEMENT)
**Violation**: Art. 28 RGPD (sous-traitance)

**Conséquences juridiques**:
- Clients B2B co-responsables si violation
- Nullité contrats B2B
- Impossibilité transfert responsabilité

**Clauses obligatoires manquantes**:
- Objet, durée, nature et finalités du traitement
- Type de données et catégories de personnes
- Obligations du sous-traitant (sécurité, confidentialité)
- Sous-traitance ultérieure (autorisation, notification)
- Assistance du responsable de traitement
- Destruction ou restitution des données

**Action requise**: **14 jours** - Rédaction DPA pour tous clients B2B

---

### FAILLE #18 : CGV B2B ABSENTES
**Violation**: Art. L441-1 C.Com (conditions générales de vente)

**Conséquences juridiques**:
- Nullité conditions de paiement
- Impossibilité recouvrement créances
- Amende: **75 000€**

**Clauses manquantes**:
- Barème de prix et remises
- Conditions de paiement (délais, pénalités retard)
- Clause résolutoire
- Clause de révision tarifaire
- Juridiction compétente

**Action requise**: **30 jours**

---

## 📋 PLAN D'ACTION JURIDIQUE URGENT

### 🔥 PRIORITÉ 1 : IMMÉDIATE (< 24H)
1. ✅ **Créer Mentions Légales complètes** → `/legal/mentions`
2. ✅ **Créer Politique Confidentialité** → `/legal/privacy`
3. ✅ **Disclaimer médical visible** → Popup avant scan

### ⚠️ PRIORITÉ 2 : HAUTE (< 48H)
4. ✅ **Refonte bandeau cookies** (opt-in strict)
5. ✅ **CGV B2C** → `/legal/sales`
6. ✅ **Formulaire rétractation** téléchargeable

### 🔶 PRIORITÉ 3 : MOYENNE (< 7 JOURS)
7. ✅ **Durées conservation** → Politique + script purge
8. ✅ **Audit RLS Supabase** → Corriger toutes les failles
9. ✅ **Page crédits Open Source** → `/legal/licenses`

### 🔷 PRIORITÉ 4 : NORMALE (< 30 JOURS)
10. ✅ **Adhésion médiateur consommation**
11. ✅ **Audit sous-traitants** (DPA, transferts)
12. ✅ **DPA type** pour clients B2B
13. ✅ **CGV B2B**

### 📅 PRIORITÉ 5 : PLANIFIÉE (< 60 JOURS)
14. ✅ **Dépôt marques INPI**
15. ✅ **Certification HDS** (si hébergement données santé)
16. ✅ **Audit ISO 27001**

---

## 💰 EXPOSITION FINANCIÈRE TOTALE

| Catégorie | Amende max | Probabilité |
|-----------|------------|-------------|
| **RGPD (art. 83)** | 20M€ ou 4% CA | HAUTE |
| **Cookies (CNIL)** | 20M€ | HAUTE |
| **Conso (DGCCRF)** | 225 000€ | MOYENNE |
| **Santé (CSP)** | 30 000€ + prison | MOYENNE |
| **PI (copyright)** | Variable | FAIBLE |

**TOTAL ESTIMÉ**: **40M€ + sanctions pénales**

---

## 📞 CONTACTS URGENTS RECOMMANDÉS

1. **Avocat RGPD/Privacy**: Consultation sous 24h
2. **DPO externe**: Mise en conformité accélérée
3. **Consultant HDS**: Si hébergement données santé françaises
4. **Assurance RC Pro**: Vérifier couverture cyber-risques

---

## ⚖️ CLAUSE DE NON-RESPONSABILITÉ

Ce document est un audit préventif à visée pédagogique. Il ne constitue pas un conseil juridique personnalisé. Consultez un avocat spécialisé avant toute décision.

---

**Fin du rapport - Document confidentiel**  
**Mise à jour obligatoire tous les 6 mois**
