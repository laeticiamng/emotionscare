INSERT INTO public.module_lifecycle (module_key, display_name, status, version, owner, description, rollout_percentage, kill_switch_enabled)
VALUES
  ('music', 'Musicothérapie', 'stable', '2026.1.0', 'Équipe Therapy', 'Hub unifié de musicothérapie (Suno AI, EQ 10 bandes, Vocal Journal)', 100, false),
  ('coach', 'Coach IA', 'stable', '2026.1.0', 'Équipe Therapy', 'Assistant conversationnel 24h/24 basé sur Lovable AI Gateway', 100, false),
  ('vr', 'Réalité Virtuelle', 'beta', '2026.0.5', 'Équipe Immersive', 'Expériences immersives 3D Three.js (parc émotionnel, méditation)', 80, false),
  ('scan', 'Scanner émotionnel SAM', 'stable', '2026.1.0', 'Équipe Clinical', 'Self-Assessment Manikin avec recommandations contextuelles', 100, false),
  ('breath', 'Breathwork', 'stable', '2026.1.0', 'Équipe Therapy', 'Protocoles respiratoires (Stop 20-20-20, Reset 4-4-6)', 100, false),
  ('journal', 'Journal vocal & écrit', 'stable', '2026.1.0', 'Équipe Therapy', 'Journal multimodal avec analyse Hume + transcription Whisper', 100, false),
  ('nyvee', 'Nyvée (Coach immersif)', 'beta', '2026.0.8', 'Équipe Immersive', 'Coach immersif avec voix ElevenLabs', 60, false),
  ('community', 'Communauté', 'stable', '2026.1.0', 'Équipe Social', 'Hub communautaire (Cocon, Buddies, Auras)', 100, false)
ON CONFLICT (module_key) DO NOTHING;