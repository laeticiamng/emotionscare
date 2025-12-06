-- ════════════════════════════════════════════════════════════════════════════
-- CONFIGURATION CRON JOB: DÉTECTEUR PROACTIF D'INCIDENTS
-- ════════════════════════════════════════════════════════════════════════════
--
-- Ce script configure un cron job pour le détecteur proactif d'incidents
-- qui surveille automatiquement les alertes critiques et génère des rapports
--
-- Fréquence recommandée: Toutes les 5 minutes (ajustable selon le besoin)
--
-- Prérequis:
-- 1. Edge function 'proactive-incident-detector' déployée
-- 2. Extensions pg_cron et pg_net activées
-- 3. Les cron jobs collect-system-metrics et send-weekly-monitoring-report configurés
--
-- Instructions:
-- 1. Remplacer YOUR_PROJECT_ID par votre Project ID Supabase
-- 2. Remplacer YOUR_ANON_KEY par votre clé anon Supabase
-- 3. Exécuter dans l'éditeur SQL Supabase
--
-- ════════════════════════════════════════════════════════════════════════════

-- Supprimer l'ancien job s'il existe
SELECT cron.unschedule('proactive-incident-detector-job');

-- Créer le job de détection proactive
SELECT cron.schedule(
  'proactive-incident-detector-job',
  '*/5 * * * *',  -- Toutes les 5 minutes
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/proactive-incident-detector',  -- ⚠️ MODIFIER ICI
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_ANON_KEY'  -- ⚠️ MODIFIER ICI
      ),
      body := jsonb_build_object(
        'timestamp', now(),
        'source', 'cron_job'
      )
    ) as request_id;
  $$
);

-- Vérifier la création du job
SELECT 
  jobid,
  jobname,
  schedule,
  active,
  database
FROM cron.job
WHERE jobname = 'proactive-incident-detector-job';

-- ════════════════════════════════════════════════════════════════════════════
-- RÉSUMÉ DES 3 CRON JOBS CONFIGURÉS
-- ════════════════════════════════════════════════════════════════════════════

-- 1. collect-system-metrics-job
--    Fréquence: */5 * * * * (toutes les 5 minutes)
--    Rôle: Collecte les métriques système (CPU, mémoire, uptime, etc.)
--    URL: /functions/v1/collect-system-metrics

-- 2. weekly-monitoring-report-job
--    Fréquence: 0 9 * * 1 (chaque lundi à 9h00 UTC)
--    Rôle: Envoie le rapport hebdomadaire par email
--    URL: /functions/v1/send-weekly-monitoring-report

-- 3. proactive-incident-detector-job (nouveau)
--    Fréquence: */5 * * * * (toutes les 5 minutes)
--    Rôle: Surveille les alertes critiques et génère des incidents automatiquement
--    URL: /functions/v1/proactive-incident-detector

-- Vérifier tous les jobs actifs
SELECT 
  jobid,
  jobname,
  schedule,
  active
FROM cron.job
ORDER BY jobname;

-- ════════════════════════════════════════════════════════════════════════════
-- MONITORING DES EXÉCUTIONS
-- ════════════════════════════════════════════════════════════════════════════

-- Voir les dernières exécutions du détecteur proactif
SELECT 
  job.jobname,
  run.status,
  run.start_time,
  run.end_time,
  run.return_message
FROM cron.job_run_details run
JOIN cron.job job ON run.jobid = job.jobid
WHERE job.jobname = 'proactive-incident-detector-job'
  AND run.start_time > NOW() - INTERVAL '24 hours'
ORDER BY run.start_time DESC
LIMIT 20;

-- Compter les incidents détectés automatiquement
SELECT 
  DATE(created_at) as date,
  COUNT(*) as incidents_auto_detectes
FROM incident_reports
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ════════════════════════════════════════════════════════════════════════════
-- AJUSTEMENTS OPTIONNELS
-- ════════════════════════════════════════════════════════════════════════════

-- Option 1: Augmenter la fréquence à toutes les 2 minutes (environnements critiques)
-- SELECT cron.alter_job(
--   job_id := (SELECT jobid FROM cron.job WHERE jobname = 'proactive-incident-detector-job'),
--   schedule := '*/2 * * * *'
-- );

-- Option 2: Réduire la fréquence à toutes les 10 minutes (économiser ressources)
-- SELECT cron.alter_job(
--   job_id := (SELECT jobid FROM cron.job WHERE jobname = 'proactive-incident-detector-job'),
--   schedule := '*/10 * * * *'
-- );

-- Option 3: Exécuter uniquement pendant les heures de bureau (9h-18h en semaine)
-- SELECT cron.alter_job(
--   job_id := (SELECT jobid FROM cron.job WHERE jobname = 'proactive-incident-detector-job'),
--   schedule := '*/5 9-18 * * 1-5'  -- Toutes les 5 min, de 9h à 18h, lundi à vendredi
-- );

-- ════════════════════════════════════════════════════════════════════════════
-- NOTES IMPORTANTES
-- ════════════════════════════════════════════════════════════════════════════

-- 📝 WORKFLOW COMPLET INCIDENT→ANALYSE ML→TICKET→RÉSOLUTION
--
-- 1. Alerte critique détectée
--    ↓
-- 2. proactive-incident-detector s'exécute (toutes les 5 min)
--    ↓
-- 3. Génère rapport incident avec analyse ML (generate-incident-report)
--    ↓
-- 4. Si critique: Création ticket automatique (create-ticket)
--    ↓
-- 5. Notification admin + assignation ML
--    ↓
-- 6. Admin consulte /admin/incidents ou /admin/unified
--    ↓
-- 7. Applique actions correctives recommandées
--    ↓
-- 8. Marque incident comme résolu
--    ↓
-- 9. Métriques mises à jour (résolution time, etc.)

-- 📝 INTÉGRATIONS AUTOMATIQUES
--
-- Le détecteur proactif est déjà intégré dans:
-- - create-ticket: Génère incident si alerte critique
-- - ab-test-manager: Génère incident si résultat négatif significatif
-- - (Futur) collect-system-metrics: Alerte si métriques dépassent seuils

-- 📝 FAUX POSITIFS
--
-- Pour réduire les faux positifs:
-- 1. Ajuster les seuils dans proactive-incident-detector (ex: confiance ML)
-- 2. Filtrer par type d'alerte (exclure alertes info/warning)
-- 3. Grouper incidents similaires (même root cause dans 15 min)

-- 📝 PERFORMANCE
--
-- Le détecteur est optimisé pour:
-- - Scanner max 50 alertes par exécution
-- - Timeout si > 30 secondes d'exécution
-- - Cache des incidents existants pour éviter doublons
-- - Appels ML en parallèle si plusieurs alertes critiques

-- ════════════════════════════════════════════════════════════════════════════
-- DÉPANNAGE
-- ════════════════════════════════════════════════════════════════════════════

-- Le job ne s'exécute pas ?
-- 1. Vérifier que pg_cron est activé: SELECT * FROM pg_extension WHERE extname = 'pg_cron';
-- 2. Vérifier que le job est actif: SELECT active FROM cron.job WHERE jobname = 'proactive-incident-detector-job';
-- 3. Voir les logs d'erreur: SELECT return_message FROM cron.job_run_details WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'proactive-incident-detector-job') ORDER BY start_time DESC LIMIT 5;

-- Trop d'incidents générés ?
-- 1. Augmenter les seuils de sévérité (ne déclencher que pour 'critical', pas 'high')
-- 2. Augmenter l'intervalle du cron (de */5 à */10 ou */15)
-- 3. Ajouter cooldown period (ne pas générer incident si un existe déjà pour même alerte dans les 1h)

-- Pas assez d'incidents détectés ?
-- 1. Vérifier que les alertes sont bien créées dans unified_alerts
-- 2. Vérifier les filtres de sévérité dans proactive-incident-detector
-- 3. Consulter les logs edge function dans Supabase Dashboard > Edge Functions > Logs

-- ════════════════════════════════════════════════════════════════════════════
-- FIN DU SCRIPT
-- ════════════════════════════════════════════════════════════════════════════

-- ✅ Workflow complet incident→ML→ticket→résolution maintenant configuré
-- ✅ 3 cron jobs actifs pour monitoring 24/7
-- ✅ Dashboard unifié (/admin/unified) pour centraliser toutes les métriques
-- 
-- 📧 Questions ? support@emotionscare.com
