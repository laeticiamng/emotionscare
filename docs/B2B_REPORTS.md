# Heatmap RH B2B — Notes de mise en œuvre

## Flux de données et contraintes

- **Source unique** : toutes les synthèses proviennent de la table `org_assess_rollups` exposée via l’Edge Function `assess-aggregate` (voir ECC-DATA-02 / ECC-EDGE-01).
- **Filtrage min_n ≥ 5** :
  - La fonction Edge ne renvoie que des agrégats respectant le seuil.
  - Le service `getHeatmap` filtre à nouveau côté front lorsque `n` est présent dans la réponse.
- **Zéro données individuelles** : le front n’interroge jamais les tables d’assessments brutes.
- **JWT obligatoire** : l’appel Edge est signé avec le token Supabase de l’utilisateur manager (RLS + CORS déjà appliqués côté Edge).

## Composants principaux

- `src/services/b2b/reportsApi.ts` — wrapper typé qui appelle l’Edge Function et produit des cellules textuelles.
- `src/features/b2b/reports/B2BHeatmap.tsx` — grille accessible (ARIA, clavier, contraste) présentant une carte par instrument/équipe.
- `src/features/b2b/reports/ActionSuggestion.tsx` — transforme chaque synthèse en « action concrète » textuelle (mapping local en attendant la génération Edge).
- `src/features/b2b/reports/ExportButton.tsx` — export PNG via `html2canvas`, import dynamique pour éviter de charger la librairie inutilement.
- `src/pages/b2b/reports/index.tsx` — page complète : filtres (équipe, instrument, période), heatmap, actions, impression, instrumentation Sentry et métriques simples.
- `src/styles/print-b2b.css` — styles dédiés à l’impression, fond clair et lisibilité renforcée.

## Privacy & observabilité

- Breadcrumbs Sentry : `b2b:agg:fetch:start|success|error`, `b2b:export:png`, `b2b:print` (sans texte utilisateur, seules les métadonnées techniques sont remontées).
- Aucun numéro ni score n’est rendu dans les cellules : uniquement le résumé textuel + l’action suggérée.
- Mesures locales via `performanceMonitor` :
  - `b2b_reports.fetch_latency` (durée de l’appel agrégé)
  - `b2b_reports.visible_cells` (nombre de cartes affichées après filtre)
- Les logs front (`logger`) sont redigés automatiquement et n’incluent jamais le texte des synthèses.

## Accessibilité et motion

- Respect de `prefers-reduced-motion` : transitions neutralisées si l’utilisateur le demande.
- Navigation clavier sur toute la grille (`role="grid"`, `role="gridcell"`, focus visible).
- Version impression dédiée : fond blanc, texte sombre, suppression des contrôles interactifs (`.no-print`).

## Tests

- **Unitaires (Vitest)** : mapping `summaries[] → cells`, filtrage `min_n`, génération d’action concrète, regroupement par instrument.
- **E2E (Playwright)** : scénario manager authentifié `/b2b/reports` couvrant chargement mocké, filtres, export PNG, appel impression, contrôle console sans avertissement.
- **Contrats Edge** : vérifiés séparément via `supabase/tests/assess-functions.test.ts`.

## Points d’attention produit

- La philosophie « texte uniquement + min_n ≥ 5 » est matérialisée dans l’UI et rappelée dans le footer.
- Aucun lien vers des vues individuelles ; pas de tri par équipe « meilleure/pire ».
- Le bouton Export génère un PNG autonome respectant le thème impression (fond blanc). `window.print()` applique les styles CSS d’impression.
