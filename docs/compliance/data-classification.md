# Classification des données — EmotionsCare

> **Date** : 28/02/2026  
> **Version** : 1.0

---

## 1. Objectif

Classifier toutes les données traitées par la plateforme EmotionsCare selon leur sensibilité, pour appliquer les mesures de protection adéquates (RGPD, HDS le cas échéant).

## 2. Niveaux de classification

| Niveau | Description | Exemples | Mesures |
|--------|-------------|----------|---------|
| **C0 — Public** | Données accessibles publiquement | Pages marketing, FAQ | Aucune restriction |
| **C1 — Interne** | Données personnelles standard | Email, prénom, préférences UI | RGPD standard, chiffrement transit |
| **C2 — Confidentiel** | Données sensibles / émotionnelles | Scores PANAS, journal intime, analyses IA | Chiffrement transit + repos, RLS, accès restreint |
| **C3 — Critique** | Données potentiellement HDS | Scores cliniques, historique émotionnel long terme | C2 + audit trail, sauvegarde externalisée, hébergement HDS si qualifié |

## 3. Cartographie par table

### C1 — Données personnelles standard
| Table | Données | Base légale RGPD |
|-------|---------|-----------------|
| `profiles` | Prénom, email, avatar | Consentement |
| `accessibility_settings` | Préférences UI | Intérêt légitime |
| `analytics_events` | Navigation anonymisée | Intérêt légitime |

### C2 — Données sensibles / émotionnelles
| Table | Données | Base légale RGPD |
|-------|---------|-----------------|
| `mood_entries` | Scores émotionnels, humeur | Consentement explicite |
| `journal_entries` | Texte libre (journal intime) | Consentement explicite |
| `activity_sessions` | Humeur avant/après activité | Consentement explicite |
| `ai_coach_sessions` | Conversations coaching IA | Consentement explicite |
| `ai_chat_messages` | Messages chatbot | Consentement explicite |

### C3 — Données potentiellement critiques
| Table | Données | Base légale RGPD |
|-------|---------|-----------------|
| `emotion_scans` | Analyses faciales / textuelles | Consentement explicite |
| `ai_exam_history` | Scores d'évaluation | Consentement explicite |
| `activity_streaks` | Historique comportemental long terme | Consentement explicite |

## 4. Données transmises aux tiers

| Sous-traitant | Données transmises | Localisation | DPA |
|--------------|-------------------|-------------|-----|
| **Supabase** | Toutes les tables (hébergeur) | AWS eu-central-1 | ✅ Standard |
| **OpenAI** | Texte utilisateur (prompts coaching) | US | ✅ DPA OpenAI |
| **Hume AI** | Audio/vidéo pour analyse émotionnelle | US | ⚠️ À vérifier |
| **ElevenLabs** | Texte pour synthèse vocale | US/EU | ⚠️ À vérifier |

## 5. Mesures techniques appliquées

- ✅ Chiffrement en transit (TLS 1.3)
- ✅ RLS sur toutes les tables utilisateur
- ✅ Sanitisation XSS (DOMPurify + triggers DB)
- ✅ Tokens JWT en sessionStorage (pas localStorage)
- ✅ CSP strict (no unsafe-inline en prod)
- ✅ Droit à l'oubli (DSAR + suppression compte)
- ⚠️ Chiffrement at-rest : dépend de Supabase/AWS (à documenter)
- ⚠️ Pseudonymisation : non implémentée
