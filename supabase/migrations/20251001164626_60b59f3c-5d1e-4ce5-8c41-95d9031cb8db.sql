-- Seed des cartes émotionnelles avec ranges WHO-5
INSERT INTO public.emotion_cards (code, mantra, mantra_emoji, color_primary, color_secondary, icon_name, rarity, who5_range_min, who5_range_max, unlock_rewards) VALUES
  ('energy', 'Élan', '🔥', '#FF6B6B', '#FFA07A', 'Flame', 'common', 20, 25, '{"xp": 10}'),
  ('calm', 'Posé', '✨', '#4ECDC4', '#95E1D3', 'Sparkles', 'common', 16, 19, '{"xp": 10}'),
  ('joy', 'Joie', '🌈', '#FFD93D', '#FFEB99', 'Sun', 'common', 18, 22, '{"xp": 10}'),
  ('softness', 'Douceur', '🌊', '#A8DADC', '#C5E4E6', 'Waves', 'common', 14, 17, '{"xp": 10}'),
  ('focus', 'Focus', '🎯', '#6C5CE7', '#A29BFE', 'Target', 'rare', 17, 21, '{"xp": 25, "badge": "focused_warrior"}'),
  ('growth', 'Croissance', '🌱', '#00B894', '#55EFC4', 'TrendingUp', 'rare', 19, 23, '{"xp": 25, "sticker": "growth_seed"}'),
  ('power', 'Puissance', '⚡', '#FDCB6E', '#FFEAA7', 'Zap', 'epic', 22, 25, '{"xp": 50, "halo": "golden"}'),
  ('peace', 'Sérénité', '🕊️', '#DFE6E9', '#F0F3F4', 'Cloud', 'epic', 20, 24, '{"xp": 50, "sound": "zen_bell"}'),
  ('legend', 'Légende', '👑', '#F39C12', '#FDCA00', 'Crown', 'legendary', 23, 25, '{"xp": 100, "title": "Légende Vivante", "ar_effect": true}')
ON CONFLICT (code) DO NOTHING;

-- Fonction qui tire ou récupère la carte hebdomadaire
CREATE OR REPLACE FUNCTION public.get_or_create_weekly_draw(p_user_id UUID)
RETURNS TABLE(
  draw_id UUID,
  card_code TEXT,
  mantra TEXT,
  mantra_emoji TEXT,
  color_primary TEXT,
  color_secondary TEXT,
  icon_name TEXT,
  rarity TEXT,
  is_new_draw BOOLEAN,
  unlock_rewards JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_week_start DATE;
  v_week_end DATE;
  v_existing_draw public.weekly_card_draws;
  v_card public.emotion_cards;
BEGIN
  -- Obtenir les bornes de la semaine
  SELECT * INTO v_week_start, v_week_end FROM get_current_week_bounds();
  
  -- Chercher un tirage existant pour cette semaine
  SELECT * INTO v_existing_draw
  FROM public.weekly_card_draws
  WHERE user_id = p_user_id
    AND week_start = v_week_start
  LIMIT 1;
  
  -- Si tirage existe, le retourner
  IF v_existing_draw.id IS NOT NULL THEN
    SELECT * INTO v_card
    FROM public.emotion_cards
    WHERE id = v_existing_draw.card_id;
    
    RETURN QUERY SELECT
      v_existing_draw.id,
      v_card.code,
      v_card.mantra,
      v_card.mantra_emoji,
      v_card.color_primary,
      v_card.color_secondary,
      v_card.icon_name,
      v_card.rarity,
      false,
      v_card.unlock_rewards;
    RETURN;
  END IF;
  
  -- Sinon créer un nouveau tirage (carte aléatoire pour l'instant)
  SELECT * INTO v_card
  FROM public.emotion_cards
  ORDER BY random()
  LIMIT 1;
  
  INSERT INTO public.weekly_card_draws (
    user_id,
    card_id,
    week_start,
    week_end
  ) VALUES (
    p_user_id,
    v_card.id,
    v_week_start,
    v_week_end
  ) RETURNING id INTO v_existing_draw;
  
  RETURN QUERY SELECT
    v_existing_draw.id,
    v_card.code,
    v_card.mantra,
    v_card.mantra_emoji,
    v_card.color_primary,
    v_card.color_secondary,
    v_card.icon_name,
    v_card.rarity,
    true,
    v_card.unlock_rewards;
END;
$$;