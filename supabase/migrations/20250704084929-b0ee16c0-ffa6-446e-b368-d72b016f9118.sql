-- Créer un compte testeur complet avec tous les accès
-- D'abord, s'assurer que la table profiles existe et a les bonnes colonnes
INSERT INTO public.profiles (
  id,
  email,
  name,
  is_test_account,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'test@emotionscare.com',
  'Compte Testeur QA',
  true,
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  is_test_account = EXCLUDED.is_test_account,
  updated_at = now();

-- Créer un abonnement premium pour le testeur
INSERT INTO public.med_mng_subscriptions (
  user_id,
  plan,
  credits_left,
  renews_at,
  gateway,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'premium',
  999999, -- Crédits illimités pour les tests
  now() + INTERVAL '1 year',
  'test',
  now(),
  now()
) ON CONFLICT (user_id) DO UPDATE SET
  plan = EXCLUDED.plan,
  credits_left = EXCLUDED.credits_left,
  renews_at = EXCLUDED.renews_at,
  updated_at = now();

-- Créer un profil EmotionsRoom pour le testeur
INSERT INTO public.emotionsroom_profiles (
  id,
  nickname,
  avatar_emoji,
  favorite_mood,
  total_time_minutes,
  total_rooms,
  is_anonymous,
  settings,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'TesteurQA',
  '🧪',
  'testing',
  120,
  5,
  false,
  '{"mic_default": true, "notifications": true, "camera_default": true}'::jsonb,
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  nickname = EXCLUDED.nickname,
  avatar_emoji = EXCLUDED.avatar_emoji,
  favorite_mood = EXCLUDED.favorite_mood,
  settings = EXCLUDED.settings,
  updated_at = now();

-- Ajouter quelques données de test pour l'utilisateur
INSERT INTO public.emotions (
  user_id,
  text,
  score,
  emojis,
  ai_feedback,
  date
) VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Test emotion positive', 85, '😊', 'Excellent état émotionnel pour les tests', now() - INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Test emotion neutre', 50, '😐', 'État neutre parfait pour tester les recommandations', now() - INTERVAL '2 hours')
ON CONFLICT DO NOTHING;

-- Log de l'activité de création du compte test
INSERT INTO public.user_activity_logs (
  user_id,
  activity_type,
  activity_details,
  timestamp
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'test_account_created',
  '{"platform": "emotionscare", "purpose": "qa_testing", "features": "all_access"}'::jsonb,
  now()
) ON CONFLICT DO NOTHING;