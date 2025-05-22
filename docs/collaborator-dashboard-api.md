# API Dashboard Collaborateur

Ce document liste les principaux modules visibles sur le tableau de bord collaborateur et l’endpoint associé côté backend. Les appels sont implémentés via les fonctions Supabase Edge ou des services internes.

| Module / Bouton | Endpoint Supabase | Description du flux |
|-----------------|------------------|---------------------|
| Journal émotionnel | `/functions/v1/analyze-journal` | Enregistre une entrée de journal et génère un feedback IA. |
| Musicothérapie | `/functions/v1/coach-ai` (action `generate_music`) | Génère une playlist ou un conseil musical personnalisé. |
| Coach IA | `/functions/v1/coach-ai` | Discussion ou recommandations bien‑être par IA. |
| Défis / Gamification | `/functions/v1/process-emotion-gamification` | Valide un défi et met à jour les scores. |
| Notifications | `/functions/v1/monitor-api-usage` | Envoie un résumé des alertes ou notifications personnalisées. |
| Export / Reporting personnel | `/functions/v1/enhanced-emotion-analyze` | Génère un rapport des émotions et statistiques de l’utilisateur. |
| Gestion du profil | `/functions/v1/assistant-api` | Sauvegarde des préférences ou mise à jour des données profil. |

Chaque appel est protégé par `authorizeRole` pour s’assurer que seul le rôle **collaborateur** (ou `b2b_user`) peut accéder à ces routes. Les erreurs sont retournées au format JSON avec un code HTTP approprié et chaque action critique est logguée via `logUnauthorizedAccess` ou dans des tables dédiées.
