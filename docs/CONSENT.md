# Gouvernance des consentements

## Principes
- Consentement explicite, granulaire par module (scan, coach, musique, B2B exports).
- Horodatage et version stockés dans `user_consent_logs` avec hash utilisateur.
- Révocation possible depuis `/settings/privacy` ou via API `POST /optin/revoke`.

## Versioning
| Module | Flag | Colonne | Description |
| --- | --- | --- | --- |
| Emotion Scan | `FF_ASSESS_*` | `opt_in_scan` | Autorise la collecte d’auto-évaluations textuelles. |
| Coach IA | `FF_ORCH_COMMUNITY` | `opt_in_coach` | Permet les échanges SSE avec modération automatique. |
| Musique adaptative | `FF_ORCH_AURAS` | `opt_in_music` | Active le suivi des préférences sonores. |
| Exports B2B | `FF_B2B_AGGREGATES` | `opt_in_b2b` | Autorise l’agrégation anonymisée pour une organisation. |

Chaque consentement est versionné via `consent_version` (string) pour suivre l’évolution des textes juridiques. Toute mise à jour de version déclenche un mail automatique et exige une ré-acceptation in-app.

## Preuve & traçabilité
- Table `user_consent_logs` : `user_id`, `consent_key`, `version`, `granted_at`, `revoked_at`.
- Les Edge Functions vérifient l’opt-in avant toute action sensible (`assess-start`, `ai-emotion-analysis`, exports B2B).
- Les logs Sentry/Supabase n’incluent jamais les métadonnées personnelles (hash unidirectionnel).

## Révocation
- UI : bouton “Retirer mon accord” sur chaque module → appelle `/functions/v1/optin-revoke`.
- CLI/support : procédure d’urgence via script `scripts/revoke-consent.ts`.
- Révocation = désactivation immédiate du flag + purge des jobs planifiés (cron B2B, orchestrations automatiques).

## Portée par feature
- **Scan** : stockage minimal (texte libre, contexte). Jamais de chiffres retournés à l’utilisatrice.
- **Coach** : conversation modérée, stockage limité aux dernières interactions (TTL configurable).
- **Musique** : préférences locales + piste sélectionnée. Pas de diffusion de playlist avec métriques.
- **B2B** : uniquement textes agrégés, `min_n` appliqué côté base. Export signé valable quinze minutes.
