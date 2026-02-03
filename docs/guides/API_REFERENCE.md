# 📡 API Reference - EmotionsCare

Documentation complète des 8 Super-Routers Edge Functions.

## Vue d'ensemble

L'API EmotionsCare utilise une architecture consolidée de **8 super-routers** qui regroupent logiquement les ~235 endpoints originaux.

### Base URL
```
https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1
```

### Authentification
Toutes les requêtes (sauf `/health`) nécessitent un header `Authorization`:
```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 🤖 router-ai

**Endpoint**: `/router-ai`

Intelligence artificielle et recommandations contextuelles.

### Actions disponibles

| Action | Description | Payload |
|--------|-------------|---------|
| `context-recommend` | Recommandations IA basées sur le contexte | `{ valence, arousal, timeOfDay?, history? }` |
| `coach-message` | Message au coach IA | `{ message, sessionId?, personality? }` |
| `analyze-emotion` | Analyse émotionnelle d'un texte | `{ text, language? }` |
| `generate-insight` | Génération d'insights personnalisés | `{ userId, period? }` |

### Exemple
```typescript
const response = await supabase.functions.invoke('router-ai', {
  body: {
    action: 'context-recommend',
    payload: {
      valence: 0.6,
      arousal: 0.4,
      timeOfDay: 'morning'
    }
  }
});
```

### Réponse type
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "type": "activity",
        "id": "morning-meditation",
        "title": "Méditation du matin",
        "reason": "Votre niveau d'énergie est idéal pour une pratique calme"
      }
    ]
  }
}
```

---

## 🎵 router-music

**Endpoint**: `/router-music`

Génération musicale et musicothérapie.

### Actions disponibles

| Action | Description | Payload |
|--------|-------------|---------|
| `generate` | Génère une musique personnalisée | `{ mood, duration, style? }` |
| `extend` | Étend une piste existante | `{ trackId, seconds }` |
| `analyze` | Analyse les caractéristiques audio | `{ audioUrl }` |
| `get-history` | Historique des générations | `{ limit?, offset? }` |

### Exemple
```typescript
const response = await supabase.functions.invoke('router-music', {
  body: {
    action: 'generate',
    payload: {
      mood: 'relaxation',
      duration: 180,
      style: 'ambient'
    }
  }
});
```

---

## 🏢 router-b2b

**Endpoint**: `/router-b2b`

Fonctionnalités entreprise et RH.

### Actions disponibles

| Action | Description | Payload |
|--------|-------------|---------|
| `org-aggregates` | Agrégats organisationnels | `{ orgId, period }` |
| `team-stats` | Statistiques par équipe | `{ teamId, period }` |
| `heatmap` | Données heatmap émotionnelle | `{ orgId, startDate, endDate }` |
| `generate-report` | Génère un rapport RH | `{ orgId, type, period }` |
| `access-codes` | Gestion codes d'accès | `{ action, code? }` |

### Réponse Heatmap
```json
{
  "success": true,
  "data": {
    "cells": [
      {
        "teamId": "dev-team",
        "teamName": "Développement",
        "instrument": "WHO-5",
        "avgScore": 68,
        "trend": "up"
      }
    ],
    "insights": ["L'équipe Support montre des signes de fatigue"]
  }
}
```

---

## ⚙️ router-system

**Endpoint**: `/router-system`

Opérations système et monitoring.

### Actions disponibles

| Action | Description | Payload |
|--------|-------------|---------|
| `health` | Vérification santé système | - |
| `metrics` | Métriques de performance | `{ type }` |
| `cache-clear` | Vide le cache | `{ keys? }` |
| `feature-flags` | Récupère les feature flags | `{ userId? }` |

---

## 🧘 router-wellness

**Endpoint**: `/router-wellness`

Activités de bien-être et méditation.

### Actions disponibles

| Action | Description | Payload |
|--------|-------------|---------|
| `start-session` | Démarre une session | `{ type, duration }` |
| `end-session` | Termine une session | `{ sessionId, feedback? }` |
| `get-activities` | Liste des activités | `{ category?, difficulty? }` |
| `log-breath` | Enregistre respiration | `{ cycles, pattern }` |
| `streak-status` | Statut des streaks | - |

---

## 🔐 router-gdpr

**Endpoint**: `/router-gdpr`

Conformité RGPD et gestion des données.

### Actions disponibles

| Action | Description | Payload |
|--------|-------------|---------|
| `export-data` | Export des données utilisateur | - |
| `delete-data` | Suppression des données | `{ confirm: true }` |
| `consent-status` | Statut des consentements | - |
| `update-consent` | Mise à jour consentements | `{ consents }` |
| `anonymize` | Anonymisation compte | - |

### Réponse Export
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://..../export-user-xxx.zip",
    "expiresAt": "2026-02-04T12:00:00Z",
    "format": "json",
    "sections": ["profile", "journal", "activities", "assessments"]
  }
}
```

---

## 🔬 router-context-lens

**Endpoint**: `/router-context-lens`

Analyse contextuelle et NLP.

### Actions disponibles

| Action | Description | Payload |
|--------|-------------|---------|
| `analyze` | Analyse NLP complète | `{ text, language? }` |
| `extract-topics` | Extraction de thèmes | `{ text }` |
| `sentiment` | Analyse de sentiment | `{ text }` |
| `summarize` | Résumé de texte | `{ text, maxLength? }` |

---

## 👥 router-community

**Endpoint**: `/router-community`

Fonctionnalités sociales et communautaires.

### Actions disponibles

| Action | Description | Payload |
|--------|-------------|---------|
| `guilds-list` | Liste des guildes | `{ search?, limit? }` |
| `guild-join` | Rejoindre une guilde | `{ guildId }` |
| `guild-leave` | Quitter une guilde | `{ guildId }` |
| `send-message` | Envoyer un message | `{ guildId, content }` |
| `events-list` | Liste des événements | `{ filter? }` |

---

## Codes d'erreur

| Code | Description |
|------|-------------|
| `400` | Requête invalide - payload manquant ou malformé |
| `401` | Non authentifié - token manquant ou invalide |
| `403` | Non autorisé - permissions insuffisantes |
| `404` | Ressource non trouvée |
| `429` | Rate limit dépassé |
| `500` | Erreur serveur interne |

### Format d'erreur
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PAYLOAD",
    "message": "Le champ 'action' est requis"
  }
}
```

---

## Rate Limiting

| Plan | Limite | Fenêtre |
|------|--------|---------|
| Gratuit | 100 req | /minute |
| Pro | 500 req | /minute |
| Enterprise | Illimité | - |

Headers de réponse:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1706965200
```

---

## SDK & Intégration

### TypeScript/JavaScript
```typescript
import { supabase } from '@/integrations/supabase/client';

async function callRouter(router: string, action: string, payload?: object) {
  const { data, error } = await supabase.functions.invoke(router, {
    body: { action, payload }
  });
  
  if (error) throw error;
  return data;
}

// Exemple
const recommendations = await callRouter('router-ai', 'context-recommend', {
  valence: 0.6,
  arousal: 0.4
});
```

### cURL
```bash
curl -X POST \
  'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/router-ai' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"action": "context-recommend", "payload": {"valence": 0.6}}'
```

---

## Changelog

### v2.0.0 (2026-02-03)
- Consolidation de 235+ endpoints en 8 super-routers
- Amélioration des temps de réponse de 40%
- Nouveau système de rate limiting par tier

### v1.x.x (Legacy)
- Endpoints individuels (dépréciés)
- Voir `src/lib/services/router-adapter.ts` pour la migration

---

*Dernière mise à jour: 2026-02-03*
