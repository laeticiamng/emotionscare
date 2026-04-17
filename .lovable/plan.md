

## Cadrage : Gouvernance Plateforme — Phases 2 à 5

La Phase 1 (foundations + routing audit + hub admin) est livrée. Je propose maintenant de compléter la refonte structurelle complète sur les 3 axes restants + ouverture Manager B2B.

### Architecture cible

```text
┌─────────────────────────────────────────────────────────┐
│  /admin/governance  (Admin)   │  /b2b/governance (Mgr)  │
├─────────────────────────────────────────────────────────┤
│  Overview │ Routing │ Data │ Observability │ Modules   │
└────────┬────────────┬───────┬────────┬──────────┬───────┘
         │            │       │        │          │
   routingAudit   rlsAudit  sloEngine  modules  killSwitch
         │            │       │        │          │
   ROUTES_REGISTRY  pg_policies  edge_logs  module_lifecycle
```

### Phase 2 — Data Governance & RLS (réel)
- Edge function `governance-rls-scan` : interroge `pg_policies` + `pg_tables` (schéma `public`), détecte tables sans RLS, policies trop permissives (`USING (true)`), colonnes PII non protégées.
- Stocke résultat dans `governance_audits` (type `data_rls`) avec score 0-100.
- `DataGovernancePage` : remplace placeholders par findings réels + bouton "Relancer scan".

### Phase 3 — Observabilité & SLO
- Edge function `governance-slo-collect` : agrège logs edge functions (uptime, latency p95, error rate) sur fenêtre 24h, écrit dans `slo_metrics`.
- `ObservabilityGovernancePage` : graphiques recharts (uptime/latency/errors par module), badges `healthy|degraded|critical`.
- Cron quotidien via `pg_cron` (toutes les heures).

### Phase 4 — Modules & Kill-switch (runtime)
- Hook `useModuleLifecycle(moduleKey)` : lit `module_lifecycle`, retourne `{ enabled, rollout, killSwitch }`.
- Composant `<ModuleGate moduleKey="...">` : bloque le rendu si `kill_switch_enabled = true`, affiche page "Module temporairement indisponible".
- Intégration sur 3 modules pilotes : `music`, `coach`, `vr` (preuve de concept).

### Phase 5 — Hub Manager B2B
- Nouveau layout `/b2b/governance` : version restreinte (lecture seule, pas de kill-switch, pas de scan RLS).
- Pages : `Overview` (score global org), `Modules` (statut + rollout), `SLO` (santé services consommés).
- Guard : `allowedRoles: ['manager', 'admin']`.

### Détails techniques

**Nouvelles edge functions**
- `supabase/functions/governance-rls-scan/index.ts` (admin-only, JWT validation manuelle)
- `supabase/functions/governance-slo-collect/index.ts` (cron-friendly)

**Nouveaux fichiers front**
- `src/lib/governance/rlsAudit.ts` — appel edge + parsing
- `src/lib/governance/sloEngine.ts` — agrégation côté client + helpers status
- `src/lib/governance/useModuleLifecycle.ts`
- `src/components/governance/ModuleGate.tsx`
- `src/components/governance/SLOChart.tsx`
- `src/pages/b2b/governance/{Overview,Modules,SLO}Page.tsx`
- `src/components/governance/B2BGovernanceLayout.tsx`

**Fichiers modifiés**
- `RoutingGovernancePage` : bouton "Snapshot" qui persiste l'audit dans `governance_audits`
- `DataGovernancePage` + `ObservabilityGovernancePage` : branchement réel
- `ModulesGovernancePage` : ajoute toggle rollout %
- `routerV2/registry/b2bRegistry.ts` : 3 routes B2B governance
- 3 modules pilotes : wrap avec `<ModuleGate>`

**Migration DB**
- Activer extension `pg_cron` + `pg_net` si pas déjà fait
- Schedule `governance-slo-collect` toutes les heures
- Trigger `route_audit_log` sur changements `module_lifecycle` (traçabilité)

**Sécurité**
- Edge functions : `verify_jwt = false` + validation manuelle, vérification rôle `admin` via `has_role()`
- RLS : déjà en place (tables Phase 1), étendre policies à `manager` en lecture seule
- Pas de secret hardcodé, tout via `Deno.env`

**Scope estimé** : ~18 fichiers créés/modifiés + 1 migration + 2 edge functions. Aucune régression sur l'existant.

