# Validation des données (D.1)

Ce dossier décrit la procédure de contrôle des données métier attendues pour les items, compétences, pistes générées et segments de paroles. L'objectif est de détecter toute anomalie structurelle avant d'exécuter les étapes d'orchestration (RPC, backfill, etc.).

## Contenu

- [`sql/007_validation_data.sql`](../sql/007_validation_data.sql) : script SQL principal. Il regroupe l'ensemble des requêtes de vérification et **ne renvoie aucune ligne si la base est conforme**. Toute ligne retournée correspond à une anomalie dont le code figure dans la première colonne.
- [`/.github/workflows/validate-data.yml`](../.github/workflows/validate-data.yml) *(optionnel mais recommandé)* : workflow GitHub Actions exécutant automatiquement le script sur chaque Pull Request.

## Pré-requis

- Accès à la base ciblée (local, staging) exposée en PostgreSQL.
- Variable d'environnement contenant l'URL de connexion. Les exemples ci-dessous utilisent `SUPABASE_DB_URL` en local et `DB_URL_STAGING` en CI.
- Client `psql` installé.

## Exécution locale

1. Exporter l'URL de connexion :
   ```bash
   export SUPABASE_DB_URL="postgres://user:pass@host:5432/dbname"
   ```
2. Lancer le script :
   ```bash
   psql "$SUPABASE_DB_URL" -f sql/007_validation_data.sql -v ON_ERROR_STOP=1 -P pager=off
   ```
3. Interprétation :
   - **0 ligne retournée** → la base est conforme.
   - **≥1 ligne** → chaque ligne correspond à une anomalie à corriger (voir colonne `code`).

### Via Supabase SQL Editor

1. Ouvrir le SQL Editor.
2. Copier/coller le contenu du fichier [`sql/007_validation_data.sql`](../sql/007_validation_data.sql).
3. Exécuter le script :
   - 0 ligne = conforme.
   - Sinon, corriger les anomalies indiquées.

> Le script contient plusieurs requêtes `SELECT`. Si l'éditeur ne supporte pas l'exécution multi-statement, exécuter chaque bloc `SELECT` séparément.

### Via PostgREST

Le fichier comporte plusieurs requêtes. PostgREST n'étant pas adapté à l'exécution multi-statement, préférer `psql`. En cas de besoin, exécuter les blocs `SELECT` séparément.

## Exécution sur l'environnement de staging

1. Vérifier que l'URL de connexion staging est disponible (ex. `postgres://user:pass@staging-host:5432/dbname`).
2. Exécuter :
   ```bash
   psql "$SUPABASE_DB_URL" -f sql/007_validation_data.sql -v ON_ERROR_STOP=1 -P pager=off
   ```
   (Remplacer `SUPABASE_DB_URL` par la variable adéquate, p. ex. `STAGING_DB_URL`).
3. Valider que la sortie est vide.

## Intégration continue

Le workflow GitHub Actions fourni s'exécute automatiquement sur chaque Pull Request qui modifie les fichiers SQL ou le workflow lui-même. Il échoue si le script retourne au moins une ligne.

### Création du secret

1. Aller dans **Settings → Secrets and variables → Actions**.
2. Créer le secret `DB_URL_STAGING` contenant l'URL PostgreSQL de l'environnement de staging.

### Personnalisation

- Ajuster le nom du secret si nécessaire (et mettre à jour le workflow).
- Ajouter d'autres déclencheurs (`push`, cron, etc.) selon vos besoins.

## Résolution des anomalies

Le code de chaque anomalie est rappelé ci-dessous :

| Code | Signification | Action recommandée |
| ---- | ------------- | ------------------ |
| `A_TOTAL_ITEMS_NOT_367` | Nombre d'items différent de 367 | Synchroniser le référentiel des items |
| `B_ITEM_WITHOUT_ANY_COMPETENCE` | Item sans compétence associée | Compléter les compétences (Rang A/B) |
| `C_ITEM_MISSING_A_OR_B` | Item sans compétence Rang A ou Rang B | Ajouter les compétences manquantes ou documenter l'exception |
| `D_DUPLICATE_ITEM_SLUG` | `slug` dupliqué | Corriger les doublons (contrainte unique recommandée) |
| `E_INCOMPLETE_TRACK_FIELDS` | Piste générée avec champ obligatoire manquant | Compléter les informations de la piste |
| `F_ORPHAN_TRACK_ITEM` | Piste référencée sur un item inexistant | Purger ou rattacher à un item valide |
| `G_INVALID_SEG_TIMECODE` | Segment avec `end_ms <= start_ms` | Corriger les timecodes |
| `H_DUP_SEG_IDX` | Indice `(track_id, idx)` dupliqué | Renuméroter ou supprimer les doublons |
| `I_ORPHAN_SEG_TRACK` | Segment référencé sur un track inexistant | Purger ou corriger le `track_id` |
| `J_SEG_ITEM_MISMATCH` | `item_id` segment ≠ `item_id` track | Ré-aligner les segments sur le bon item |
| `K_TRACK_STATUS_INVALID` | Statut de track en dehors des valeurs attendues | Normaliser le statut (enum recommandée) |
| `L_TRACK_MODE_INVALID` | Mode de track invalide | Corriger la valeur (`A`, `B` ou `AB`) |
| `M_EMPTY_SEG_TEXT` | Segment sans texte | Fournir le texte manquant ou supprimer le segment |

Maintenir la base dans un état sain avant d'exécuter les traitements suivants (génération, backfill, etc.) garantit la fiabilité du pipeline de production.
