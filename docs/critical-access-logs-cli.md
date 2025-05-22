# Consultation des logs d'accès critiques

Le script `scripts/viewCriticalAccessLogs.ts` fournit un accès sécurisé aux journaux
`access_logs`. Il est destiné aux administrateurs disposant de la clé
`SUPABASE_SERVICE_ROLE_KEY`.

## Utilisation

```bash
npx ts-node scripts/viewCriticalAccessLogs.ts --start=2024-01-01 --end=2024-01-31 \
  --user=123 --action=login --limit=50 --export=janvier.json
```

Options disponibles :

- `--start` : date minimale (ISO) du log à récupérer
- `--end` : date maximale
- `--user` : filtre sur l'identifiant utilisateur
- `--action` : filtre sur le type d'action ou la route
- `--limit` : nombre maximum de résultats (100 par défaut)
- `--export` : chemin du fichier d'export JSON

Chaque exécution enregistre une entrée dans la table `admin_access_logs` afin de
tracer qui a consulté les journaux et avec quels filtres. Les droits d'accès sont
restreints à la clé de service et aux rôles administrateurs.

## Procédure d'audit

1. L'administrateur lance le script avec les filtres adaptés à la période ou
   l'utilisateur cible.
2. Les données peuvent être exportées pour analyse ou réponse à une demande RGPD.
3. Une entrée d'audit est automatiquement ajoutée pour conserver la traçabilité.

Cette interface complète les recommandations décrites dans
`docs/responsible-data-audit-point16.md`.
