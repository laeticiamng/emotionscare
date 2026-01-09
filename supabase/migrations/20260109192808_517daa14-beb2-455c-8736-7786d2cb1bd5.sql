-- Créer une organisation de démonstration
INSERT INTO public.organizations (id, name, description, org_type, subscription_plan)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Entreprise Démo',
  'Organisation de démonstration pour tester EmotionsCare B2B',
  'enterprise',
  'trial'
) ON CONFLICT (id) DO NOTHING;

-- Créer un code d'accès de démonstration
INSERT INTO public.org_access_codes (id, org_id, code, code_type, is_active, max_uses, current_uses, expires_at)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'DEMO-2024',
  'universal',
  true,
  1000,
  0,
  '2026-12-31T23:59:59Z'
) ON CONFLICT (id) DO NOTHING;