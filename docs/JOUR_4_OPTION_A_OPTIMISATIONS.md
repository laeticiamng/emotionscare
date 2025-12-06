# JOUR 4 - Option A : Optimisations DB (2h)

**Objectif** : Optimiser les performances de la base de données Supabase

---

## 🎯 Périmètre

### 1. Indexes composites (45 min)
- Analyser les queries les plus fréquentes
- Créer indexes multi-colonnes pour optimiser les JOINs
- Optimiser les requêtes de filtrage complexe

### 2. Vues matérialisées (45 min)
- Créer vues matérialisées pour agrégats coûteux
- Statistiques hebdomadaires/mensuelles précalculées
- Refresh automatique via triggers ou cron

### 3. Partitionnement (15 min - si nécessaire)
- Évaluer la volumétrie des tables
- Partitionner par date si > 1M lignes

### 4. Query optimization (15 min)
- Analyser EXPLAIN ANALYZE des queries lentes
- Optimiser les subqueries
- Réduire les N+1 queries

---

## 📋 Phase 1 : Indexes composites (45 min)

### 1.1 Analyse des queries fréquentes

**Journal** : Requêtes par utilisateur + période
```sql
-- Query pattern actuel
SELECT * FROM journal_voice 
WHERE user_id = ? AND ts BETWEEN ? AND ?
ORDER BY ts DESC;

-- Index composite optimal
CREATE INDEX idx_journal_voice_user_ts 
  ON journal_voice(user_id, ts DESC);

CREATE INDEX idx_journal_text_user_ts 
  ON journal_text(user_id, ts DESC);
```

**VR** : Requêtes par utilisateur + session
```sql
-- Query pattern actuel
SELECT * FROM vr_nebula_sessions 
WHERE user_id = ? AND ts_start >= ?
ORDER BY ts_start DESC;

-- Index composite optimal
CREATE INDEX idx_vr_nebula_user_ts 
  ON vr_nebula_sessions(user_id, ts_start DESC);

CREATE INDEX idx_vr_dome_session_user 
  ON vr_dome_sessions(session_id, user_id);
```

**Breath** : Requêtes par utilisateur + semaine
```sql
-- Query pattern actuel
SELECT * FROM breath_weekly_metrics 
WHERE user_id = ? AND week_start >= ?
ORDER BY week_start DESC;

-- Index composite optimal
CREATE INDEX idx_breath_user_week 
  ON breath_weekly_metrics(user_id, week_start DESC);

CREATE INDEX idx_breath_org_week 
  ON breath_weekly_org_metrics(org_id, week_start DESC);
```

**Assessments** : Requêtes par utilisateur + instrument
```sql
-- Query pattern actuel
SELECT * FROM assessment_sessions 
WHERE user_id = ? AND instrument = ?
ORDER BY started_at DESC;

-- Index composite optimal
CREATE INDEX idx_assessment_user_instrument 
  ON assessment_sessions(user_id, instrument, started_at DESC);

CREATE INDEX idx_assessments_user_instrument_ts 
  ON assessments(user_id, instrument, ts DESC);
```

### 1.2 Indexes pour recherches full-text (optionnel)
```sql
-- Si recherche dans journal texte nécessaire
CREATE INDEX idx_journal_text_search 
  ON journal_text USING GIN (to_tsvector('french', text_raw));
```

---

## 📋 Phase 2 : Vues matérialisées (45 min)

### 2.1 Vue agrégée : Statistiques utilisateur hebdomadaires

```sql
-- Vue matérialisée : Dashboard utilisateur hebdomadaire
CREATE MATERIALIZED VIEW user_weekly_dashboard AS
SELECT 
  user_id,
  date_trunc('week', ts) as week_start,
  
  -- Journal metrics
  COUNT(DISTINCT jv.id) as journal_voice_count,
  COUNT(DISTINCT jt.id) as journal_text_count,
  
  -- VR metrics
  COUNT(DISTINCT vn.id) as vr_nebula_sessions_count,
  AVG(vn.coherence_score) as avg_coherence,
  AVG(vn.rmssd_delta) as avg_hrv_improvement,
  
  -- Breath metrics
  AVG(bw.coherence_avg) as avg_breath_coherence,
  AVG(bw.mood_score) as avg_mood,
  
  -- Assessment metrics
  COUNT(DISTINCT ass.id) as assessments_count,
  
  MAX(GREATEST(jv.ts, jt.ts, vn.ts_start, ass.ts)) as last_activity_at
  
FROM (
  SELECT DISTINCT user_id, ts FROM journal_voice
  UNION
  SELECT DISTINCT user_id, ts FROM journal_text
  UNION
  SELECT DISTINCT user_id, ts_start as ts FROM vr_nebula_sessions
  UNION
  SELECT DISTINCT user_id, ts FROM assessments
) users
LEFT JOIN journal_voice jv USING (user_id)
LEFT JOIN journal_text jt USING (user_id)
LEFT JOIN vr_nebula_sessions vn USING (user_id)
LEFT JOIN breath_weekly_metrics bw USING (user_id)
LEFT JOIN assessments ass USING (user_id)
WHERE users.ts >= NOW() - INTERVAL '6 months'
GROUP BY user_id, week_start;

-- Index sur la vue matérialisée
CREATE UNIQUE INDEX idx_user_weekly_dashboard_pk 
  ON user_weekly_dashboard(user_id, week_start);

CREATE INDEX idx_user_weekly_dashboard_week 
  ON user_weekly_dashboard(week_start DESC);
```

### 2.2 Vue agrégée : Statistiques organisation

```sql
-- Vue matérialisée : Dashboard organisation
CREATE MATERIALIZED VIEW org_dashboard AS
SELECT 
  om.org_id,
  o.name as org_name,
  date_trunc('month', NOW()) as month_start,
  
  -- Membres actifs
  COUNT(DISTINCT om.user_id) as total_members,
  COUNT(DISTINCT CASE 
    WHEN last_activity.last_ts >= NOW() - INTERVAL '7 days' 
    THEN om.user_id 
  END) as active_members_7d,
  COUNT(DISTINCT CASE 
    WHEN last_activity.last_ts >= NOW() - INTERVAL '30 days' 
    THEN om.user_id 
  END) as active_members_30d,
  
  -- Métriques breath org
  AVG(bwo.org_coherence) as avg_org_coherence,
  AVG(bwo.org_mood) as avg_org_mood,
  AVG(bwo.org_hrv_idx) as avg_org_hrv,
  
  -- Engagement
  SUM(jv_count.cnt) as total_journal_voice_entries,
  SUM(jt_count.cnt) as total_journal_text_entries,
  SUM(vr_count.cnt) as total_vr_sessions
  
FROM org_memberships om
JOIN organizations o ON o.id = om.org_id
LEFT JOIN breath_weekly_org_metrics bwo ON bwo.org_id = om.org_id
LEFT JOIN LATERAL (
  SELECT user_id, MAX(GREATEST(
    (SELECT MAX(ts) FROM journal_voice WHERE user_id = om.user_id),
    (SELECT MAX(ts) FROM journal_text WHERE user_id = om.user_id),
    (SELECT MAX(ts_start) FROM vr_nebula_sessions WHERE user_id = om.user_id)
  )) as last_ts
) last_activity ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) as cnt FROM journal_voice WHERE user_id = om.user_id
) jv_count ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) as cnt FROM journal_text WHERE user_id = om.user_id
) jt_count ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) as cnt FROM vr_nebula_sessions WHERE user_id = om.user_id
) vr_count ON true
GROUP BY om.org_id, o.name;

-- Index sur la vue matérialisée
CREATE UNIQUE INDEX idx_org_dashboard_pk 
  ON org_dashboard(org_id, month_start);
```

### 2.3 Refresh automatique des vues

```sql
-- Fonction de refresh
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_weekly_dashboard;
  REFRESH MATERIALIZED VIEW CONCURRENTLY org_dashboard;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour refresh automatique (après insertions majeures)
-- Option 1 : Via pg_cron (nécessite extension)
-- SELECT cron.schedule('refresh-dashboards', '0 2 * * *', 'SELECT refresh_materialized_views()');

-- Option 2 : Via trigger après INSERT (peut être coûteux)
-- À implémenter selon les besoins
```

---

## 📋 Phase 3 : Partitionnement (15 min - évaluation)

### 3.1 Analyse volumétrie

```sql
-- Vérifier nombre de lignes par table
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'journal_voice', 'journal_text', 
    'vr_nebula_sessions', 'vr_dome_sessions',
    'breath_weekly_metrics', 'assessments'
  )
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 3.2 Décision partitionnement

**Seuil recommandé** : Partitionner si > 1M lignes ou > 1GB

**Exemple partitionnement par date (si nécessaire)** :
```sql
-- Exemple : Partitionner journal_voice par mois
CREATE TABLE journal_voice_partitioned (LIKE journal_voice INCLUDING ALL)
PARTITION BY RANGE (ts);

CREATE TABLE journal_voice_2025_01 PARTITION OF journal_voice_partitioned
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE journal_voice_2025_02 PARTITION OF journal_voice_partitioned
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Automatiser création partitions futures via fonction
```

**Recommandation actuelle** : ⚠️ Reporter si volumétrie < 100k lignes

---

## 📋 Phase 4 : Query optimization (15 min)

### 4.1 Analyse des queries lentes

```sql
-- Activer pg_stat_statements (si pas déjà fait)
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Top 10 queries les plus lentes
SELECT 
  query,
  calls,
  mean_exec_time,
  total_exec_time,
  rows
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### 4.2 Optimisations courantes

**Éviter N+1 queries** :
```sql
-- ❌ Mauvais : N+1 query
SELECT * FROM users;
-- Puis pour chaque user : SELECT * FROM journal_voice WHERE user_id = ?

-- ✅ Bon : 1 query avec JOIN
SELECT u.*, jv.*
FROM users u
LEFT JOIN LATERAL (
  SELECT * FROM journal_voice WHERE user_id = u.id ORDER BY ts DESC LIMIT 10
) jv ON true;
```

**Utiliser EXPLAIN ANALYZE** :
```sql
EXPLAIN ANALYZE
SELECT * FROM journal_voice 
WHERE user_id = '...' 
  AND ts >= NOW() - INTERVAL '30 days'
ORDER BY ts DESC
LIMIT 20;
```

---

## ✅ Critères de succès

- [ ] Indexes composites créés (8+)
- [ ] Vues matérialisées fonctionnelles (2)
- [ ] Refresh automatique configuré
- [ ] Analyse volumétrie effectuée
- [ ] Queries optimisées (top 5 lentes)
- [ ] Documentation complète

---

## 📊 Gains attendus

| Optimisation | Gain performance |
|--------------|------------------|
| Indexes composites | -50% à -70% temps requête |
| Vues matérialisées | -90% calculs agrégats |
| Query optimization | -30% à -50% temps moyen |

**Total estimé** : -60% temps requêtes globales ✅

---

**Statut** : 🔄 EN COURS - Phase 1 (Indexes composites)
