-- Seed data pour l'intégration B2C
-- Ce fichier contient des données de test pour faciliter le développement

-- Créer des organisations de test
INSERT INTO public.organizations (id, name, plan, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'TechCorp', 'premium', now()),
  ('00000000-0000-0000-0000-000000000002', 'HealthCare Inc', 'standard', now())
ON CONFLICT (id) DO NOTHING;

-- Créer des utilisateurs de test avec leurs profils
-- Note: Ces utilisateurs doivent être créés via l'authentification Supabase
-- Ce seed crée uniquement les profils et rôles associés

-- Profils B2C (particuliers)
INSERT INTO public.profiles (id, user_id, role, organization_id, theme_pref)
VALUES 
  ('10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'b2c_user', NULL, 'light'),
  ('10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'b2c_user', NULL, 'dark')
ON CONFLICT (id) DO NOTHING;

-- Rôles B2C
INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('10000000-0000-0000-0000-000000000001', 'b2c_user'),
  ('10000000-0000-0000-0000-000000000002', 'b2c_user')
ON CONFLICT (user_id, role) DO NOTHING;

-- Profils B2B (employés)
INSERT INTO public.profiles (id, user_id, role, organization_id, theme_pref)
VALUES 
  ('20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'b2b_employee', '00000000-0000-0000-0000-000000000001', 'light'),
  ('20000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'b2b_employee', '00000000-0000-0000-0000-000000000001', 'light'),
  ('20000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 'b2b_employee', '00000000-0000-0000-0000-000000000001', 'light'),
  ('20000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', 'b2b_employee', '00000000-0000-0000-0000-000000000001', 'light'),
  ('20000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000005', 'b2b_employee', '00000000-0000-0000-0000-000000000001', 'light'),
  ('20000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000006', 'b2b_employee', '00000000-0000-0000-0000-000000000001', 'light')
ON CONFLICT (id) DO NOTHING;

-- Rôles B2B employés
INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('20000000-0000-0000-0000-000000000001', 'b2b_employee'),
  ('20000000-0000-0000-0000-000000000002', 'b2b_employee'),
  ('20000000-0000-0000-0000-000000000003', 'b2b_employee'),
  ('20000000-0000-0000-0000-000000000004', 'b2b_employee'),
  ('20000000-0000-0000-0000-000000000005', 'b2b_employee'),
  ('20000000-0000-0000-0000-000000000006', 'b2b_employee')
ON CONFLICT (user_id, role) DO NOTHING;

-- Profil RH
INSERT INTO public.profiles (id, user_id, role, organization_id, theme_pref)
VALUES 
  ('30000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'b2b_rh', '00000000-0000-0000-0000-000000000001', 'light')
ON CONFLICT (id) DO NOTHING;

-- Rôle RH
INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('30000000-0000-0000-0000-000000000001', 'b2b_rh')
ON CONFLICT (user_id, role) DO NOTHING;

-- Session presets pour la musique
INSERT INTO public.session_presets (id, name, tags, engine, cfg_json)
VALUES 
  ('preset-calm', 'Calme & Sérénité', ARRAY['calm', 'relaxation', 'meditation'], 'suno', '{"tempo": "slow", "mood": "peaceful"}'),
  ('preset-energy', 'Énergie & Focus', ARRAY['energy', 'focus', 'concentration'], 'suno', '{"tempo": "medium", "mood": "energetic"}'),
  ('preset-sleep', 'Sommeil Profond', ARRAY['sleep', 'night', 'relaxation'], 'suno', '{"tempo": "very_slow", "mood": "dreamy"}'),
  ('preset-nature', 'Ambiance Nature', ARRAY['nature', 'ambient', 'outdoor'], 'musicgen', '{"style": "ambient", "instruments": ["nature_sounds", "piano"]}'),
  ('preset-workout', 'Sport & Motivation', ARRAY['workout', 'sport', 'motivation'], 'suno', '{"tempo": "fast", "mood": "motivational"}')
ON CONFLICT (id) DO NOTHING;

-- Moods de test pour l'organisation (pour tester k-anonymat)
INSERT INTO public.moods (user_id, valence, arousal, note, ts)
VALUES 
  ('20000000-0000-0000-0000-000000000001', 0.7, 0.5, 'Journée productive', now() - interval '1 day'),
  ('20000000-0000-0000-0000-000000000002', 0.5, 0.3, 'Calme et concentré', now() - interval '1 day'),
  ('20000000-0000-0000-0000-000000000003', -0.2, 0.7, 'Un peu stressé', now() - interval '1 day'),
  ('20000000-0000-0000-0000-000000000004', 0.8, 0.6, 'Excellente journée', now() - interval '1 day'),
  ('20000000-0000-0000-0000-000000000005', 0.3, 0.4, 'Neutre', now() - interval '1 day'),
  ('20000000-0000-0000-0000-000000000006', 0.6, 0.5, 'Satisfait du travail accompli', now() - interval '1 day'),
  ('20000000-0000-0000-0000-000000000001', 0.5, 0.4, 'Bonne matinée', now() - interval '2 hours'),
  ('20000000-0000-0000-0000-000000000003', 0.2, 0.6, 'Meilleur qu\'hier', now() - interval '3 hours')
ON CONFLICT DO NOTHING;

-- Moods B2C de test
INSERT INTO public.moods (user_id, valence, arousal, note, ts)
VALUES 
  ('10000000-0000-0000-0000-000000000001', 0.8, 0.7, 'Super journée!', now() - interval '5 hours'),
  ('10000000-0000-0000-0000-000000000001', 0.6, 0.5, 'Détendu après ma séance', now() - interval '2 hours'),
  ('10000000-0000-0000-0000-000000000002', 0.4, 0.3, 'Fatigue mais apaisé', now() - interval '1 hour')
ON CONFLICT DO NOTHING;

-- Sessions musicales de test
INSERT INTO public.music_sessions (id, user_id, preset_id, status, duration_sec, ts_start, ts_end, artifact_url)
VALUES 
  ('session-b2c-1', '10000000-0000-0000-0000-000000000001', 'preset-calm', 'completed', 600, now() - interval '3 hours', now() - interval '2 hours 50 minutes', 'https://example.com/music/calm-1.mp3'),
  ('session-b2c-2', '10000000-0000-0000-0000-000000000002', 'preset-sleep', 'completed', 1200, now() - interval '1 day', now() - interval '1 day' + interval '20 minutes', 'https://example.com/music/sleep-1.mp3')
ON CONFLICT (id) DO NOTHING;

-- Sessions immersives de test
INSERT INTO public.immersive_sessions (id, user_id, type, params_json, ts_start, ts_end, outcome_text)
VALUES 
  ('immersive-1', '10000000-0000-0000-0000-000000000001', 'vr', '{"duration_minutes": 10, "theme": "forest", "intensity": 0.8}', now() - interval '6 hours', now() - interval '5 hours 50 minutes', 'Séance VR complétée : 10 minutes dans un environnement "forêt". Niveau d''immersion : 80%. Vous avez exploré 3 espaces de relaxation.'),
  ('immersive-2', '10000000-0000-0000-0000-000000000002', 'audio', '{"duration_minutes": 15, "theme": "ocean", "intensity": 0.6}', now() - interval '2 days', now() - interval '2 days' + interval '15 minutes', 'Séance audio immersive : 15 minutes d''ambiance sonore "océan". Mix de sons naturels et fréquences binaurales.')
ON CONFLICT (id) DO NOTHING;

-- Agrégat B2B de test (avec k-anonymat respecté)
INSERT INTO public.b2b_aggregates (id, organization_id, team_id, period, text_summary)
VALUES 
  ('aggregate-1', '00000000-0000-0000-0000-000000000001', NULL, 'month', 'Sur la période "month" (8 participants), la tendance émotionnelle globale est positive avec une énergie modérée. Les collaborateurs montrent un état d''esprit globalement positif. Recommandation : maintenir les pratiques actuelles qui favorisent le bien-être.')
ON CONFLICT (id) DO NOTHING;

-- Logs pour confirmer le seed
DO $$
BEGIN
  RAISE NOTICE 'Seed data inserted successfully';
  RAISE NOTICE '- 2 organizations created';
  RAISE NOTICE '- 9 user profiles created (2 B2C, 6 B2B employees, 1 RH)';
  RAISE NOTICE '- 5 music presets created';
  RAISE NOTICE '- 11 moods created (8 B2B, 3 B2C)';
  RAISE NOTICE '- 2 music sessions created';
  RAISE NOTICE '- 2 immersive sessions created';
  RAISE NOTICE '- 1 B2B aggregate created';
END $$;
