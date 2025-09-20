# Seed QA CI

Le script `pnpm seed:ci` prépare l'environnement de test utilisé par les scénarios E2E et les validations QA. Il peut être exécuté en local comme en CI ; il est **idempotent** et peut être relancé sans effets secondaires.

## Variables d'environnement requises

| Variable | Description |
| --- | --- |
| `SUPABASE_URL` | URL de l'instance Supabase ciblée. |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé Service Role (permissions complètes) permettant l'upsert des données de test. |
| `SEED_CI_PASSWORD` *(optionnel)* | Mot de passe appliqué à l'utilisateur de test si besoin d'authentification locale. Défaut : `EmotionsCare#QA1`. |

## Données créées / synchronisées

- Organisation `EmotionsCare QA Org` (`domain = ec-e2e.qa`).
- Utilisateur de test `qa.e2e@emotions.care` (compte confirmé, marqué `is_test_account`).
- Profil enrichi (préférences textuelles, bio sans termes cliniques) relié à l'organisation.
- Entrée `org_memberships` avec rôle `admin` et équipe `Harmonie QA`.
- Flags d'orchestration et d'assessment (`FF_ORCH_EMPATHY_FLOW`, `FF_ASSESS_EMOTIVE_STORY`).
- Rollup B2B `org_assess_rollups` uniquement textuel (`n = 5`, résumé narratif sans chiffres visibles).
- Session musicale factice (`music_sessions`) avec piste de démonstration `seed-ec-e2e`.

## Exécution

```bash
pnpm install --frozen-lockfile
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... pnpm seed:ci
```

Le script journalise le récapitulatif des entités créées. En cas d'erreur, le processus sort avec un code ≠ 0 pour être détecté par la CI.
