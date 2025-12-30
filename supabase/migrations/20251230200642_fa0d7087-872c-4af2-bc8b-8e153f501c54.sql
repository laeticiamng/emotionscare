-- Add missing columns to user_insights
ALTER TABLE public.user_insights 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'emotional',
ADD COLUMN IF NOT EXISTS impact_score INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS confidence DECIMAL(3,2) DEFAULT 0.75,
ADD COLUMN IF NOT EXISTS source_data JSONB,
ADD COLUMN IF NOT EXISTS applied_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS dismissed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reminded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
ADD COLUMN IF NOT EXISTS feedback_text TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_insights_category ON public.user_insights(category);
CREATE INDEX IF NOT EXISTS idx_user_insights_priority ON public.user_insights(priority);
CREATE INDEX IF NOT EXISTS idx_user_insights_type ON public.user_insights(insight_type);

-- Create insight_feedback table for detailed feedback
CREATE TABLE IF NOT EXISTS public.insight_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  insight_id UUID NOT NULL REFERENCES public.user_insights(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  was_helpful BOOLEAN DEFAULT true,
  action_taken TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on insight_feedback
ALTER TABLE public.insight_feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for insight_feedback
CREATE POLICY "Users can view their own feedback" 
ON public.insight_feedback 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback" 
ON public.insight_feedback 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback" 
ON public.insight_feedback 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create insight_stats_cache table for performance
CREATE TABLE IF NOT EXISTS public.insight_stats_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  stats_data JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.insight_stats_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their stats cache" 
ON public.insight_stats_cache 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);