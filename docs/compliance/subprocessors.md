# Registre des sous-traitants — EmotionsCare

> **Date** : 28/02/2026  
> **Version** : 1.0  
> **Base légale** : RGPD Art. 28 (sous-traitance)

---

## 1. Objectif

Lister tous les sous-traitants ayant accès aux données personnelles des utilisateurs EmotionsCare, conformément à l'obligation de transparence du RGPD.

## 2. Sous-traitants actifs

| Sous-traitant | Rôle | Données accédées | Localisation | Garanties | DPA |
|--------------|------|-------------------|-------------|-----------|-----|
| **Supabase Inc.** | Hébergement BDD, Auth, Storage | Toutes les données utilisateur | AWS eu-central-1 (Francfort, DE) | SOC 2 Type II, ISO 27001 | ✅ Inclus dans ToS |
| **OpenAI** | Coaching IA, génération contenu | Texte utilisateur (prompts) | US (avec option EU) | SOC 2 Type II | ✅ DPA disponible |
| **Hume AI** | Analyse émotionnelle vocale/faciale | Flux audio/vidéo temporaire | US | En cours d'évaluation | ⚠️ À obtenir |
| **ElevenLabs** | Synthèse vocale (TTS) | Texte à vocaliser | US/EU | En cours d'évaluation | ⚠️ À obtenir |
| **Vercel** | Hébergement frontend (CDN) | Aucune donnée personnelle stockée | Global (Edge) | SOC 2 Type II | ✅ DPA disponible |
| **Sentry** | Monitoring erreurs | Stack traces, user agents (anonymisés) | US/EU | SOC 2, GDPR-ready | ✅ DPA disponible |

## 3. Transferts hors UE

| Sous-traitant | Mécanisme de transfert | Statut |
|--------------|----------------------|--------|
| OpenAI | SCCs (Standard Contractual Clauses) | ✅ |
| Hume AI | SCCs | ⚠️ À vérifier |
| ElevenLabs | SCCs / Serveurs EU disponibles | ⚠️ À vérifier |
| Sentry | SCCs + Data residency EU disponible | ✅ |

## 4. Engagement des sous-traitants

Chaque sous-traitant doit garantir :
- ✅ Traitement uniquement sur instruction documentée
- ✅ Confidentialité du personnel
- ✅ Mesures de sécurité appropriées (Art. 32)
- ✅ Assistance pour les droits des personnes concernées
- ✅ Suppression/restitution des données en fin de contrat
- ✅ Mise à disposition des informations pour audits

## 5. Actions requises

| # | Action | Priorité | Statut |
|---|--------|----------|--------|
| 1 | Obtenir DPA Hume AI | P0 | ⏳ En attente |
| 2 | Obtenir DPA ElevenLabs | P0 | ⏳ En attente |
| 3 | Activer data residency EU sur Sentry | P1 | ⏳ À configurer |
| 4 | Évaluer option EU pour OpenAI | P2 | ⏳ À investiguer |
| 5 | Mettre en place notification utilisateur en cas de changement | P1 | ⏳ À faire |
