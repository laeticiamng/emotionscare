-- Add missing columns to community_posts for full functionality
ALTER TABLE public.community_posts 
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS media_urls TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'approved',
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Update user_id from author_id for compatibility
UPDATE public.community_posts SET user_id = author_id WHERE user_id IS NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON public.community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_tags ON public.community_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_moderation_status ON public.community_posts(moderation_status);

-- Add missing columns to notifications for action_url compatibility
ALTER TABLE public.notifications
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS action_url TEXT;

-- Update is_read from read column
UPDATE public.notifications SET is_read = read WHERE is_read IS NULL;