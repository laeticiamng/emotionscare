-- ============================================
-- MUSIC MODULE ENHANCEMENTS
-- Date: 2025-11-14
-- Description: Tables et index manquants pour le module music
-- ============================================

-- ============================================
-- 1. TABLE: user_music_quotas
-- Gestion des quotas de génération musicale
-- ============================================

CREATE TABLE IF NOT EXISTS user_music_quotas (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  generations_used INTEGER DEFAULT 0 NOT NULL,
  generations_limit INTEGER DEFAULT 10 NOT NULL,
  reset_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days') NOT NULL,
  is_premium BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Contraintes
  CONSTRAINT positive_usage CHECK (generations_used >= 0),
  CONSTRAINT positive_limit CHECK (generations_limit > 0),
  CONSTRAINT usage_within_limit CHECK (generations_used <= generations_limit * 2) -- Allow 2x overflow for refunds
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_user_music_quotas_reset_date
  ON user_music_quotas(reset_date)
  WHERE reset_date < NOW();

-- RLS Policy
ALTER TABLE user_music_quotas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quotas"
  ON user_music_quotas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own quotas"
  ON user_music_quotas FOR UPDATE
  USING (auth.uid() = user_id);

-- Fonction de mise à jour automatique du updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_music_quotas_updated_at
  BEFORE UPDATE ON user_music_quotas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. TABLE: playlist_favorites
-- Favoris de playlists
-- ============================================

CREATE TABLE IF NOT EXISTS playlist_favorites (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  playlist_id UUID REFERENCES music_playlists(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  PRIMARY KEY (user_id, playlist_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_playlist_favorites_user
  ON playlist_favorites(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_playlist_favorites_playlist
  ON playlist_favorites(playlist_id);

-- RLS
ALTER TABLE playlist_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own playlist favorites"
  ON playlist_favorites FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- 3. TABLE: user_badges
-- Badges et achievements utilisateur
-- ============================================

CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  progress INTEGER DEFAULT 0 NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,

  UNIQUE(user_id, badge_id),
  CONSTRAINT positive_progress CHECK (progress >= 0)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_badges_user
  ON user_badges(user_id, unlocked_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_badges_badge
  ON user_badges(badge_id);

-- RLS
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert badges"
  ON user_badges FOR INSERT
  WITH CHECK (true); -- Controlled by application

CREATE POLICY "System can update badges"
  ON user_badges FOR UPDATE
  USING (true); -- Controlled by application

-- ============================================
-- 4. TABLE: user_challenges
-- Challenges et défis utilisateur
-- ============================================

CREATE TABLE IF NOT EXISTS user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL,
  progress INTEGER DEFAULT 0 NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,

  CONSTRAINT valid_status CHECK (status IN ('active', 'completed', 'failed', 'expired')),
  CONSTRAINT positive_progress CHECK (progress >= 0)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_challenges_user
  ON user_challenges(user_id, status, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_challenges_status
  ON user_challenges(status, expires_at)
  WHERE status = 'active';

-- RLS
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own challenges"
  ON user_challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges"
  ON user_challenges FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 5. TABLE: offline_sync_queue
-- File d'attente pour synchronisation offline
-- ============================================

CREATE TABLE IF NOT EXISTS offline_sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  synced_at TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'pending' NOT NULL,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0 NOT NULL,

  CONSTRAINT valid_sync_status CHECK (sync_status IN ('pending', 'synced', 'failed'))
);

-- Index
CREATE INDEX IF NOT EXISTS idx_offline_sync_queue_user
  ON offline_sync_queue(user_id, sync_status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_offline_sync_queue_pending
  ON offline_sync_queue(created_at)
  WHERE sync_status = 'pending';

-- RLS
ALTER TABLE offline_sync_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sync queue"
  ON offline_sync_queue FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- 6. TABLE: music_system_metrics
-- Métriques système pour monitoring
-- ============================================

CREATE TABLE IF NOT EXISTS music_system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index
CREATE INDEX IF NOT EXISTS idx_music_system_metrics_name
  ON music_system_metrics(metric_name, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_music_system_metrics_recorded
  ON music_system_metrics(recorded_at DESC);

-- RLS (Admin only)
ALTER TABLE music_system_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view metrics"
  ON music_system_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- ============================================
-- 7. TABLE: audio_metadata_cache
-- Cache pour métadonnées audio (waveforms, etc.)
-- ============================================

CREATE TABLE IF NOT EXISTS audio_metadata_cache (
  audio_url TEXT PRIMARY KEY,
  duration NUMERIC,
  waveform_data JSONB,
  spectral_data JSONB,
  cached_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days') NOT NULL,
  access_count INTEGER DEFAULT 0 NOT NULL
);

-- Index
CREATE INDEX IF NOT EXISTS idx_audio_metadata_cache_expires
  ON audio_metadata_cache(expires_at)
  WHERE expires_at < NOW();

-- Cleanup function pour supprimer les caches expirés
CREATE OR REPLACE FUNCTION cleanup_expired_audio_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM audio_metadata_cache
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. INDEXES MANQUANTS SUR TABLES EXISTANTES
-- Optimisation requêtes fréquentes
-- ============================================

-- music_generations
CREATE INDEX IF NOT EXISTS idx_music_generations_user_status
  ON music_generations(user_id, status);

CREATE INDEX IF NOT EXISTS idx_music_generations_created
  ON music_generations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_music_generations_user_created
  ON music_generations(user_id, created_at DESC);

-- Full-text search
CREATE INDEX IF NOT EXISTS idx_music_generations_search
  ON music_generations
  USING gin(to_tsvector('french', COALESCE(title, '') || ' ' || COALESCE(style, '')));

-- playlist_tracks
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist_position
  ON playlist_tracks(playlist_id, position);

CREATE INDEX IF NOT EXISTS idx_playlist_tracks_music_gen
  ON playlist_tracks(music_generation_id);

-- music_favorites
CREATE INDEX IF NOT EXISTS idx_music_favorites_user_created
  ON music_favorites(user_id, created_at DESC);

-- music_shares
CREATE INDEX IF NOT EXISTS idx_music_shares_token
  ON music_shares(share_token)
  WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_music_shares_user_created
  ON music_shares(shared_by, created_at DESC);

-- music_playlists
CREATE INDEX IF NOT EXISTS idx_music_playlists_user_updated
  ON music_playlists(user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_music_playlists_public
  ON music_playlists(updated_at DESC)
  WHERE is_public = true;

-- ============================================
-- 9. FONCTIONS UTILITAIRES
-- ============================================

-- Fonction pour réinitialiser les quotas expirés
CREATE OR REPLACE FUNCTION reset_expired_quotas()
RETURNS void AS $$
BEGIN
  UPDATE user_music_quotas
  SET
    generations_used = 0,
    reset_date = NOW() + INTERVAL '30 days',
    updated_at = NOW()
  WHERE reset_date < NOW();
END;
$$ LANGUAGE plpgsql;

-- Fonction pour marquer les challenges expirés
CREATE OR REPLACE FUNCTION expire_old_challenges()
RETURNS void AS $$
BEGIN
  UPDATE user_challenges
  SET
    status = 'expired',
    completed_at = NOW()
  WHERE
    status = 'active'
    AND expires_at IS NOT NULL
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Fonction pour nettoyer la sync queue
CREATE OR REPLACE FUNCTION cleanup_old_sync_queue()
RETURNS void AS $$
BEGIN
  DELETE FROM offline_sync_queue
  WHERE
    sync_status = 'synced'
    AND synced_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 10. VUES UTILES
-- ============================================

-- Vue pour statistiques quotas
CREATE OR REPLACE VIEW music_quota_stats AS
SELECT
  u.id as user_id,
  u.email,
  p.full_name,
  q.generations_used,
  q.generations_limit,
  q.reset_date,
  q.is_premium,
  ROUND((q.generations_used::numeric / q.generations_limit) * 100, 2) as usage_percentage,
  (q.generations_limit - q.generations_used) as remaining
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
LEFT JOIN user_music_quotas q ON q.user_id = u.id;

-- Vue pour top utilisateurs
CREATE OR REPLACE VIEW music_top_users AS
SELECT
  u.id,
  u.email,
  p.full_name,
  COUNT(mg.id) as total_generations,
  COUNT(mf.music_generation_id) as total_favorites,
  COUNT(DISTINCT mp.id) as total_playlists
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
LEFT JOIN music_generations mg ON mg.user_id = u.id
LEFT JOIN music_favorites mf ON mf.user_id = u.id
LEFT JOIN music_playlists mp ON mp.user_id = u.id
GROUP BY u.id, u.email, p.full_name
ORDER BY total_generations DESC;

-- ============================================
-- 11. CRON JOBS (Si extension pg_cron disponible)
-- ============================================

-- Note: Décommenter si pg_cron est activé
-- SELECT cron.schedule(
--   'reset-expired-quotas',
--   '0 0 * * *', -- Daily at midnight
--   'SELECT reset_expired_quotas()'
-- );

-- SELECT cron.schedule(
--   'expire-old-challenges',
--   '0 * * * *', -- Every hour
--   'SELECT expire_old_challenges()'
-- );

-- SELECT cron.schedule(
--   'cleanup-audio-cache',
--   '0 2 * * *', -- Daily at 2 AM
--   'SELECT cleanup_expired_audio_cache()'
-- );

-- SELECT cron.schedule(
--   'cleanup-sync-queue',
--   '0 3 * * 0', -- Weekly on Sunday at 3 AM
--   'SELECT cleanup_old_sync_queue()'
-- );

-- ============================================
-- 12. GRANTS (Optionnel selon configuration)
-- ============================================

-- GRANT SELECT ON music_quota_stats TO authenticated;
-- GRANT SELECT ON music_top_users TO authenticated;

-- ============================================
-- FIN DE LA MIGRATION
-- ============================================

-- Commentaire de fin
COMMENT ON TABLE user_music_quotas IS 'Quotas de génération musicale par utilisateur';
COMMENT ON TABLE playlist_favorites IS 'Playlists favorites des utilisateurs';
COMMENT ON TABLE user_badges IS 'Badges et achievements débloqués';
COMMENT ON TABLE user_challenges IS 'Challenges actifs et historique';
COMMENT ON TABLE offline_sync_queue IS 'File d''attente pour synchronisation offline';
COMMENT ON TABLE music_system_metrics IS 'Métriques système pour monitoring';
COMMENT ON TABLE audio_metadata_cache IS 'Cache métadonnées audio (waveforms, spectral data)';
