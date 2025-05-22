# API Dashboard Particulier

Ce document récapitule les modules visibles dans le dashboard B2C et l'endpoint Supabase associé. Chaque appel passe par les fonctions Edge et nécessite qu'un utilisateur authentifié possède le rôle **b2c**.

| Module / Bouton | Endpoint Supabase | Description du flux |
|-----------------|------------------|---------------------|
| Météo émotionnelle / Scan | `/functions/v1/analyze-emotion` | Analyse du texte, des emojis ou d'un audio pour fournir un score et un feedback personnalisé. |
| Journal émotionnel | `/functions/v1/analyze-journal` | Enregistre l'entrée de journal et renvoie une analyse IA en français. |
| Coach IA | `/functions/v1/coach-ai` (action `get_recommendation`) | Envoie la question de l'utilisateur et récupère la réponse du coach. |
| Musicothérapie | `/functions/v1/coach-ai` (action `generate_music`) | Génère une recommandation ou une playlist adaptée à l'émotion courante. |
| Export / Reporting | `/functions/v1/enhanced-emotion-analyze` | Prépare un rapport d'activité émotionnelle pouvant être exporté en CSV/PDF. |
| Feedback & Notifications | `/functions/v1/monitor-api-usage` | Journalise l'action et renvoie un accusé de réception ou une alerte. |

Chaque fonction est protégée par `authorizeRole` et retourne des erreurs JSON explicites (status 4xx/5xx) en cas de problème.
