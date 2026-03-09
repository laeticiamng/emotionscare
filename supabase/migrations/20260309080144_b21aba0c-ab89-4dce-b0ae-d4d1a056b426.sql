-- Create social_posts table for SocialCoconContext persistence
CREATE TABLE IF NOT EXISTS public.social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create social_post_reactions table
CREATE TABLE IF NOT EXISTS public.social_post_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.social_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'like',
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id, type)
);

-- Create social_post_comments table
CREATE TABLE IF NOT EXISTS public.social_post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.social_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_post_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for social_posts
CREATE POLICY "Users can read all posts" ON public.social_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create own posts" ON public.social_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.social_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.social_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS policies for social_post_reactions
CREATE POLICY "Users can read all reactions" ON public.social_post_reactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create own reactions" ON public.social_post_reactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON public.social_post_reactions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS policies for social_post_comments
CREATE POLICY "Users can read all comments" ON public.social_post_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create own comments" ON public.social_post_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.social_post_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_social_posts_user_id ON public.social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_created_at ON public.social_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_post_reactions_post_id ON public.social_post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_social_post_comments_post_id ON public.social_post_comments(post_id);