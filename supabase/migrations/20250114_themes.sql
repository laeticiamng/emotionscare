-- Migration: Thèmes personnalisables avancés (Phase 3 - Excellence)

-- Table des thèmes personnalisés
CREATE TABLE IF NOT EXISTS custom_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('light', 'dark', 'auto')),
  colors JSONB NOT NULL,
  fonts JSONB NOT NULL,
  spacing JSONB NOT NULL,
  effects JSONB NOT NULL,
  accessibility JSONB NOT NULL,
  is_built_in BOOLEAN NOT NULL DEFAULT false,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  thumbnail TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des préférences de thème utilisateur
CREATE TABLE IF NOT EXISTS user_theme_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  active_theme_id TEXT NOT NULL DEFAULT 'default-light',
  auto_switch_enabled BOOLEAN NOT NULL DEFAULT false,
  light_theme_id TEXT,
  dark_theme_id TEXT,
  switch_time JSONB,
  sync_across_devices BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_custom_themes_user_id ON custom_themes(user_id);
CREATE INDEX idx_custom_themes_is_built_in ON custom_themes(is_built_in);
CREATE INDEX idx_custom_themes_is_premium ON custom_themes(is_premium);
CREATE INDEX idx_custom_themes_tags ON custom_themes USING GIN(tags);

-- Trigger pour updated_at
CREATE TRIGGER update_custom_themes_updated_at
  BEFORE UPDATE ON custom_themes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_theme_preferences_updated_at
  BEFORE UPDATE ON user_theme_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE custom_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_theme_preferences ENABLE ROW LEVEL SECURITY;

-- Policies pour custom_themes
CREATE POLICY "Users can view their own custom themes"
  ON custom_themes FOR SELECT
  USING (user_id = auth.uid() OR is_built_in = true);

CREATE POLICY "Users can insert their own custom themes"
  ON custom_themes FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own custom themes"
  ON custom_themes FOR UPDATE
  USING (user_id = auth.uid() AND is_built_in = false);

CREATE POLICY "Users can delete their own custom themes"
  ON custom_themes FOR DELETE
  USING (user_id = auth.uid() AND is_built_in = false);

-- Policies pour user_theme_preferences
CREATE POLICY "Users can view their own theme preferences"
  ON user_theme_preferences FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own theme preferences"
  ON user_theme_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own theme preferences"
  ON user_theme_preferences FOR UPDATE
  USING (user_id = auth.uid());

-- Commentaires
COMMENT ON TABLE custom_themes IS 'Thèmes personnalisés créés par les utilisateurs ou thèmes prédéfinis';
COMMENT ON TABLE user_theme_preferences IS 'Préférences de thème pour chaque utilisateur';
