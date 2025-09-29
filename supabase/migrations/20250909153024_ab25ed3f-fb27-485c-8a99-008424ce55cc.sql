-- Create music generation tables
CREATE TABLE IF NOT EXISTS music_generation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emotion TEXT NOT NULL,
  intensity NUMERIC CHECK (intensity >= 0 AND intensity <= 1),
  tracks_generated INTEGER DEFAULT 0,
  generation_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS music_play_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  emotion_context TEXT,
  play_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  session_metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS music_completion_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  completion_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  listen_duration INTEGER DEFAULT 0,
  completion_percentage NUMERIC DEFAULT 100
);

CREATE TABLE IF NOT EXISTS music_skip_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  skip_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  skip_position INTEGER DEFAULT 0,
  skip_reason TEXT DEFAULT 'user_skip'
);

CREATE TABLE IF NOT EXISTS user_favorite_tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  favorited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, track_id)
);

CREATE TABLE IF NOT EXISTS user_music_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  preferred_emotions TEXT[] DEFAULT '{}',
  last_played_emotion TEXT,
  total_plays INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS emotion_analysis_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  input_text TEXT,
  detected_emotion TEXT NOT NULL,
  confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 1),
  valence NUMERIC CHECK (valence >= 0 AND valence <= 1),
  arousal NUMERIC CHECK (arousal >= 0 AND arousal <= 1),
  analysis_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE music_generation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_play_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_completion_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_skip_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorite_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_music_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotion_analysis_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own music data" ON music_generation_logs
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own play logs" ON music_play_logs
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own completion logs" ON music_completion_logs
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own skip logs" ON music_skip_logs
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own favorite tracks" ON user_favorite_tracks
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own music preferences" ON user_music_preferences
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own emotion analysis" ON emotion_analysis_logs
  FOR ALL USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_music_generation_logs_user_id ON music_generation_logs(user_id);
CREATE INDEX idx_music_generation_logs_emotion ON music_generation_logs(emotion);
CREATE INDEX idx_music_play_logs_user_id ON music_play_logs(user_id);
CREATE INDEX idx_music_play_logs_track_id ON music_play_logs(track_id);
CREATE INDEX idx_user_music_preferences_user_id ON user_music_preferences(user_id);
CREATE INDEX idx_emotion_analysis_logs_user_id ON emotion_analysis_logs(user_id);
CREATE INDEX idx_emotion_analysis_logs_emotion ON emotion_analysis_logs(detected_emotion);