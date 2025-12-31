-- Ajout des connexions pour le Parc Émotionnel et les modules manquants
INSERT INTO module_connections (source_module, target_module, connection_type, weight, metadata) VALUES
-- Parc Émotionnel -> Autres modules
('emotional_park', 'meditation', 'triggers', 0.95, '{"zone": "calm"}'),
('emotional_park', 'breathing', 'triggers', 0.90, '{"zone": "calm"}'),
('emotional_park', 'music_therapy', 'triggers', 0.85, '{"zone": "joy"}'),
('emotional_park', 'emotion_scan', 'triggers', 0.90, '{"zone": "wonder"}'),
('emotional_park', 'journal', 'triggers', 0.80, '{"zone": "growth"}'),
('emotional_park', 'coach', 'triggers', 0.85, '{"zone": "growth"}'),
('emotional_park', 'community', 'triggers', 0.80, '{"zone": "connection"}'),
('emotional_park', 'vr_galaxy', 'triggers', 0.75, '{"zone": "immersive"}'),
('emotional_park', 'ar_filter', 'triggers', 0.70, '{"zone": "immersive"}'),
('emotional_park', 'bounce_back', 'triggers', 0.80, '{"zone": "courage"}'),
('emotional_park', 'flash_glow', 'triggers', 0.75, '{"zone": "courage"}'),
('emotional_park', 'mood_mixer', 'triggers', 0.85, '{"zone": "joy"}'),
('emotional_park', 'achievements', 'triggers', 1.00, '{}'),
('emotional_park', 'leaderboard', 'shares_data', 0.90, '{}'),

-- Nyvee -> Autres modules
('nyvee', 'meditation', 'enhances', 0.95, '{}'),
('nyvee', 'breathing', 'enhances', 0.90, '{}'),
('nyvee', 'scores', 'triggers', 1.00, '{}'),
('nyvee', 'achievements', 'triggers', 0.90, '{}'),
('nyvee', 'leaderboard', 'shares_data', 0.85, '{}'),
('nyvee', 'emotional_park', 'shares_data', 0.80, '{}'),

-- Leaderboard connexions
('leaderboard', 'achievements', 'shares_data', 0.90, '{}'),
('leaderboard', 'community', 'shares_data', 0.85, '{}'),

-- Retour vers le Parc
('meditation', 'emotional_park', 'shares_data', 0.85, '{}'),
('breathing', 'emotional_park', 'shares_data', 0.80, '{}'),
('emotion_scan', 'emotional_park', 'shares_data', 0.90, '{}'),
('coach', 'emotional_park', 'shares_data', 0.80, '{}'),
('journal', 'emotional_park', 'shares_data', 0.75, '{}'),
('music_therapy', 'emotional_park', 'shares_data', 0.80, '{}'),
('achievements', 'emotional_park', 'triggers', 0.95, '{}'),
('achievements', 'leaderboard', 'shares_data', 1.00, '{}')

ON CONFLICT DO NOTHING;