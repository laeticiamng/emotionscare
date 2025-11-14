-- Migration: Create help article feedback table
-- Created: 2025-11-14
-- Description: Store user feedback on help center articles

-- Create table for help article feedback
CREATE TABLE IF NOT EXISTS public.help_article_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id TEXT NOT NULL,
  article_slug TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.help_article_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can submit feedback"
  ON public.help_article_feedback
  FOR INSERT
  WITH CHECK (true); -- Allow anonymous feedback

CREATE POLICY "Users can view their own feedback"
  ON public.help_article_feedback
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all feedback"
  ON public.help_article_feedback
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'b2b_admin')
    )
  );

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_help_article_feedback_article_slug
  ON public.help_article_feedback(article_slug);

CREATE INDEX IF NOT EXISTS idx_help_article_feedback_user_id
  ON public.help_article_feedback(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_help_article_feedback_rating
  ON public.help_article_feedback(rating);

CREATE INDEX IF NOT EXISTS idx_help_article_feedback_created
  ON public.help_article_feedback(created_at DESC);

-- Function to get article rating statistics
CREATE OR REPLACE FUNCTION get_article_rating_stats(article_slug_param TEXT)
RETURNS TABLE (
  average_rating NUMERIC,
  total_ratings BIGINT,
  rating_1 BIGINT,
  rating_2 BIGINT,
  rating_3 BIGINT,
  rating_4 BIGINT,
  rating_5 BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROUND(AVG(rating)::numeric, 2) AS average_rating,
    COUNT(*) AS total_ratings,
    SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS rating_1,
    SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS rating_2,
    SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS rating_3,
    SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS rating_4,
    SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS rating_5
  FROM help_article_feedback
  WHERE article_slug = article_slug_param;
END;
$$;

-- Comments
COMMENT ON TABLE public.help_article_feedback IS
'Stores user feedback and ratings for help center articles';

COMMENT ON COLUMN public.help_article_feedback.rating IS
'User rating from 1 (poor) to 5 (excellent)';

COMMENT ON COLUMN public.help_article_feedback.comment IS
'Optional user comment about the article';

COMMENT ON FUNCTION get_article_rating_stats(TEXT) IS
'Get rating statistics for a specific help article';
