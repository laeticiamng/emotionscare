-- =====================================================
-- AMÉLIORATION 2: Activer la Gamification (corrigé)
-- =====================================================

-- Défis de la semaine en cours
INSERT INTO public.weekly_challenges (id, title, description, challenge_type, target_value, xp_reward, badge_reward, starts_at, ends_at, is_active)
VALUES 
  (gen_random_uuid(), '🌬️ Souffle Zen', 'Complétez 5 sessions de respiration cette semaine', 'breathing', 5, 100, 'zen_breather', date_trunc('week', now()), date_trunc('week', now()) + interval '7 days', true),
  (gen_random_uuid(), '📝 Plume Fidèle', 'Écrivez 3 entrées dans votre journal cette semaine', 'journal', 3, 75, 'faithful_writer', date_trunc('week', now()), date_trunc('week', now()) + interval '7 days', true),
  (gen_random_uuid(), '🧘 Esprit Calme', 'Méditez pendant 30 minutes au total cette semaine', 'meditation', 30, 150, 'calm_mind', date_trunc('week', now()), date_trunc('week', now()) + interval '7 days', true),
  (gen_random_uuid(), '🎭 Explorateur Intérieur', 'Réalisez 3 scans émotionnels cette semaine', 'emotion_scan', 3, 100, 'inner_explorer', date_trunc('week', now()), date_trunc('week', now()) + interval '7 days', true),
  (gen_random_uuid(), '💬 Dialogue Bienveillant', 'Échangez avec votre coach IA 5 fois cette semaine', 'coach', 5, 125, 'kind_dialogue', date_trunc('week', now()), date_trunc('week', now()) + interval '7 days', true),
  (gen_random_uuid(), '🔥 Flamme Continue', 'Maintenez une série de 7 jours consécutifs', 'streak', 7, 200, 'flame_keeper', date_trunc('week', now()), date_trunc('week', now()) + interval '7 days', true),
  (gen_random_uuid(), '🤝 Cœur Ouvert', 'Partagez ou commentez 2 posts dans la communauté', 'community', 2, 50, 'open_heart', date_trunc('week', now()), date_trunc('week', now()) + interval '7 days', true)
ON CONFLICT DO NOTHING;

-- Achievements avec rarity valides (common, rare, epic, legendary, mythic)
INSERT INTO public.achievements (id, name, description, category, rarity, conditions, rewards, icon)
VALUES
  (gen_random_uuid(), 'Premier Pas', 'Compléter votre première activité', 'onboarding', 'common', '{"activity_count": 1}', '{"xp": 50}', '🎯'),
  (gen_random_uuid(), 'Souffle Maître', 'Compléter 10 sessions de respiration', 'breathing', 'common', '{"breath_count": 10}', '{"xp": 100}', '🌬️'),
  (gen_random_uuid(), 'Écrivain Régulier', 'Écrire 7 entrées dans le journal', 'journal', 'common', '{"journal_count": 7}', '{"xp": 100}', '📝'),
  (gen_random_uuid(), 'Méditant Assidu', 'Méditer 60 minutes au total', 'meditation', 'rare', '{"meditation_minutes": 60}', '{"xp": 150}', '🧘'),
  (gen_random_uuid(), 'Explorateur Émotionnel', 'Réaliser 5 scans émotionnels', 'emotion_scan', 'common', '{"scan_count": 5}', '{"xp": 100}', '🎭'),
  (gen_random_uuid(), 'Série de 7 Jours', 'Maintenir une série de 7 jours', 'streak', 'rare', '{"streak_days": 7}', '{"xp": 200}', '🔥'),
  (gen_random_uuid(), 'Série de 30 Jours', 'Maintenir une série de 30 jours', 'streak', 'epic', '{"streak_days": 30}', '{"xp": 500}', '⚡'),
  (gen_random_uuid(), 'Membre Actif', 'Participer à la communauté 10 fois', 'community', 'rare', '{"community_count": 10}', '{"xp": 100}', '🤝'),
  (gen_random_uuid(), 'Coach Fidèle', 'Échanger 20 fois avec le coach IA', 'coach', 'rare', '{"coach_count": 20}', '{"xp": 200}', '💬'),
  (gen_random_uuid(), 'Maître Zen', 'Compléter 100 sessions de respiration', 'breathing', 'legendary', '{"breath_count": 100}', '{"xp": 1000}', '🏆'),
  (gen_random_uuid(), 'Série de 100 Jours', 'Maintenir une série de 100 jours', 'streak', 'mythic', '{"streak_days": 100}', '{"xp": 2000}', '👑')
ON CONFLICT DO NOTHING;