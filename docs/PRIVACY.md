# 🔐 Confidentialité Coach IA

Ce module premium a été revu pour respecter les attentes cliniques et B2B. Voici ce qui est **enregistré** et **ce qui ne l’est jamais**.

## Données côté client
- ✅ Consentement explicite enregistré en `localStorage` (`coach:consent:v1`) et synchronisé dans `auth.user_metadata.coach_consent_at` pour éviter de redemander.
- ✅ Hash utilisateur (`sha256Hex` Web Crypto) utilisé uniquement comme étiquette de session côté Edge (aucune diffusion de l’UUID réel).
- ✅ Breadcrumbs Sentry limités (événements `coach:send|receive|error` sans contenu du message, uniquement métadonnées anonymisées).
- ❌ Aucun stockage local du transcript complet ; la conversation reste en mémoire temps-réel.

## Fonction Edge `ai-coach`
- ✅ Authentification obligatoire (JWT Supabase) + CORS strict (`ALLOWED_ORIGINS`) + rate-limit (30 req/min/user).
- ✅ Modération hybride : regex de crise + appel OpenAI Moderation (si clef présente). En cas de contenu sensible → réponse sécurisée + orientation ressources (respiration, journal, aide).
- ✅ Journalisation Supabase : table `public.coach_logs`
  - colonnes : `user_id`, `thread_id`, `summary_text` (≤ 280 caractères, PII masquée), `mode`, `created_at`.
  - RLS owner-only ; indexes `user_id, created_at desc` et `thread_id`.
- ✅ Réponses streamées via SSE (fallback JSON) avec disclaimers (`COACH_DISCLAIMERS`) envoyés côté client.
- ❌ Aucun stockage des messages bruts ni des prompts utilisateurs.
- ❌ Aucune adresse email / téléphone conservée (redaction agressive `redactSensitive`).

## Observabilité
- ✅ `captureException` enrichi uniquement de tags (`coach_mode`, `threadId` tronqué) et d’un extrait redigé via `redactForTelemetry`.
- ✅ Breadcrumbs limités à l’état (`mode`, `len`, `reason`) ; aucun texte libre n’est transféré.
- ✅ Sentry `beforeSend` global tronque URL sensibles (`/coach`, `/journal`).
- ❌ Pas de Replay sur ce flux (samples à 0 par défaut) pour éviter toute captation de contenu.

## Tests & conformité
- Tests unitaires (Vitest) sur hashing / prompts / redaction.
- Tests Deno sur les garde-fous Edge (regex, redaction, génération d’identifiants).
- Parcours Playwright `coach.smoke.spec.ts` vérifiant consentement → message, sans émettre de contenu vers la prod (route interceptée).

> 🔄 Mise à jour : juillet 2025 — refonte sécurisée COACH-01 (Edge + front). Toute évolution doit maintenir ces garanties avant livraison.
