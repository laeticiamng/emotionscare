# Heatmap RH B2B — Guide d'intégration

Ce document synthétise les choix d'interface et de tonalité utilisés par la heatmap RH disponible sur `/app/rh`.

## Sources de données

- **Origine** : Supabase Edge `POST /assess/aggregate`
- **Table** : `public.org_assess_rollups`
- **Instruments agrégés** : `WEMWBS`, `SWEMWBS`, `CBI`, `UWES`
- **Périodes** : mois courant + deux mois glissants précédents (format `YYYY-MM`)
- **Seuil de confidentialité** : `n ≥ 5` appliqué en base via RLS ; aucune donnée n’est renvoyée sous le seuil.

## Palette verbale et actions

| Tendance détectée | Mot-clé (résumé) | Label affiché | Action proposée | Teinte |
| --- | --- | --- | --- | --- |
| Ambiance apaisée | `posé`, `calme`, `apais` | `semaine plus posée` | `prévoir 1 pause courte sans agenda` | `bg-emerald-50` |
| Élan positif | `énergie`, `dynamique`, `engagé` | `élan engagé` | `célébrer une réussite concrète` | `bg-sky-50` |
| Fatigue partagée | `fatigue`, `épuis`, `lassitude` | `fatigue présente` | `protéger un créneau de récupération` | `bg-amber-50` |
| Tension sensible | `tension`, `stress`, `pression` | `tension sensible` | `resserrer la charge de réunions` | `bg-rose-50` |
| Énergie variable | `fluct`, `altern`, `variation` | `énergie fluctuante` | `ouvrir un tour météo express` | `bg-indigo-50` |
| Besoin d'écoute | `inquiet`, `fragile`, `baisse` | `humeur à écouter` | `organiser un temps d’écoute dédié` | `bg-purple-50` |
| Par défaut | aucun mot-clé | `à observer` | `planifier un check-in ouvert` | `bg-slate-50` |

> Chaque action reste une phrase courte, concrète et non intrusive. Les tooltips restituent une version condensée (par exemple « Ambiance apaisée »).

## Accessibilité & impression

- **Navigation** : grille clavier via `role="table"`, focus `focus-visible`.
- **Réduction des animations** : respect de `prefers-reduced-motion`.
- **Impression** : feuille `@media print` (`src/styles/print-b2b.css`) optimise marges, couleurs et titres pour un export A4/A3.
- **Export** : boutons PNG et CSV texte (uniquement des phrases, jamais de chiffres).

## Observabilité

- Breadcrumbs Sentry :
  - `b2b:heatmap:view` lors de l’ouverture de la page.
  - `assess:aggregate:call` (start/success/error) pour chaque requête Edge.
- Tag Sentry : `b2b_text_only` fixé à `true` lorsque la réponse ne contient que des phrases (sans chiffres).

## Feature flags

- `FF_B2B_RH` doit être actif pour afficher la heatmap.
- `FF_B2B_AGGREGATES` doit être actif pour déclencher l’appel Edge.

## Bonnes pratiques

- Ne jamais afficher de chiffres ou de pourcentages sur cette vue.
- Toujours conserver la mention du seuil (« Minimum cinq réponses par cellule »).
- Mettre à jour la palette verbale ici avant toute évolution produit.
