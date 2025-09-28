-- Ajouter la colonne is_test_account à la table profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_test_account boolean DEFAULT false;

-- Créer un compte testeur complet avec tous les accès
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